import {
  db, gameStates, type GameState, eq,
  type GameItem, type ItemSkill,
  ENEMIES, DUNGEONS, generateDungeonDrop,
  getEquipmentBonuses, generateDroppedItem, getDropChance, getAgilityBonuses, getPetBuffs, getTalentBonuses, getTemperatureMultiplier, computeEffectiveCombatSpeed,
  COMBAT_TRIANGLE, TRIANGLE_DAMAGE_BONUS, TRIANGLE_DAMAGE_PENALTY,
  COMBAT_GEM_POOLS, type Rarity, type CombatStyle,
  calculateLevel, getPlayerMaxHp, getPlayerAttack, getPlayerDefence,
  parseEquipment, parseLootBag, parseGems, parseDungeonStats,
  RARITY_ORDER, DISENCHANT_GOLD, mergeGems,
  trackAchievement,
  computeSkillEffects, applySkillProcDamage, type SkillProcContext,
} from "./_shared";

const calcLevel = calculateLevel;

export async function tickDungeon(state: GameState, elapsedSeconds: number): Promise<GameState> {
  const action = state.activeAction;
  const parts = action.split("_");
  const dungeonIndex = parseInt(parts[1]);
  const waveIndex = parseInt(parts[2] ?? "0");
  const dungeon = DUNGEONS[dungeonIndex];
  if (!dungeon) return state;

  const equipment = parseEquipment(state.equipment);
  const allSkills: ItemSkill[] = Object.values(equipment).flatMap(item => item?.skills ?? []);

  const {
    attackBonus: eqAttackBonus,
    enhancedDamage, lifeOnKill, crushingBlow, magicFind,
    lifeRegen, resistAll, critRating, lifeLeech, deadlyStrike, attackSpeed, reflectDamage,
  } = getEquipmentBonuses(equipment);

  const eff = computeSkillEffects(equipment);
  const { spellbladePct, poisonDmg, thornsDmg, lifeStealPct, vampiricHp, berserkPct, doubleStrikePct, dodgePct } = eff;
  const playerStyle: CombatStyle = (equipment.weapon as any)?.combatStyle ?? 'melee';
  const homeLv: Record<string, number> = (() => { try { return JSON.parse((state as any).homestead ?? '{}'); } catch { return {}; } })();

  const BASE_COMBAT_SPEED = 3;
  const effectiveCombatSpeed = Math.max(1.5, BASE_COMBAT_SPEED * (1 - attackSpeed / 200));
  const ticks = Math.floor(elapsedSeconds / effectiveCombatSpeed);
  if (ticks <= 0) return state;

  // Boss skill tracking
  const bossSkills = (dungeon.boss.skills ?? []) as Array<{ type: string; name: string; cooldownSec: number; value: number; duration: number }>;
  const bossSkillCooldowns: number[] = bossSkills.map(() => 0);
  let bossActiveEffects: Array<{ skill: typeof bossSkills[0]; remainingTicks: number }> = [];

  const isBoss = waveIndex >= 10;
  const waveDef = !isBoss ? dungeon.waves[waveIndex] : null;
  const boss = dungeon.boss;
  const enemyMaxHp = isBoss ? boss.maxHp : Math.floor(boss.maxHp * (waveDef?.hpMul ?? 0.5));
  const enemyAtk  = isBoss ? boss.attack : Math.floor(boss.attack * (waveDef?.atkMul ?? 0.6));
  const enemyDef  = isBoss ? boss.defence : Math.floor(boss.defence * 0.6);
  const enemyXp   = isBoss ? boss.xp : Math.floor(boss.xp * 0.08);
  const enemyName = isBoss ? boss.name : (waveDef?.name ?? '怪物');
  const enemyEmoji= isBoss ? boss.emoji : (waveDef?.emoji ?? '👾');

  const talentBonuses = getTalentBonuses(state);
  const petBuffs = getPetBuffs(state);
  let playerMaxHp = getPlayerMaxHp(state) + talentBonuses.maxHp + petBuffs.maxHp;
  let playerHp = state.playerHp < 0 ? playerMaxHp : state.playerHp + petBuffs.maxHp;
  let enemyHp  = state.enemyHp  < 0 ? enemyMaxHp : state.enemyHp;
  const weaponItem = equipment.weapon ?? null;
  const hasWeaponRange = weaponItem && (weaponItem.maxDamage ?? 0) > 0;
  const levelBaseDmg = Math.max(1, getPlayerAttack(state) - eqAttackBonus);

  let goldGained = 0, attackXpGained = 0, defenceXpGained = 0, hitpointsXpGained = 0;
  let playerDied = false;
  let bossKilled = false;
  const newDrops: GameItem[] = [];
  let bossShieldActive = false;

  for (let i = 0; i < ticks; i++) {
    if (lifeRegen > 0) playerHp = Math.min(playerMaxHp, playerHp + lifeRegen);

    const weaponRoll = hasWeaponRange && weaponItem
      ? (weaponItem.minDamage ?? 0) + Math.floor(Math.random() * ((weaponItem.maxDamage ?? 0) - (weaponItem.minDamage ?? 0) + 1))
      : levelBaseDmg;
    const perHitBase = Math.max(1, weaponRoll + eqAttackBonus);

    let effAtk = Math.max(1, perHitBase - enemyDef);
    if (spellbladePct  > 0) effAtk = Math.floor(effAtk * (1 + spellbladePct / 100));
    if (enhancedDamage > 0) effAtk = Math.floor(effAtk * (1 + enhancedDamage / 100));
    if (berserkPct > 0 && playerHp < playerMaxHp * 0.3) effAtk = Math.floor(effAtk * (1 + berserkPct / 100));

    const critHit = critRating > 0 && Math.random() * 100 < critRating;
    const critDmg = (200 + (deadlyStrike ?? 0)) / 100;
    const strikes = (doubleStrikePct > 0 && Math.random() * 100 < doubleStrikePct) ? 2 : 1;
    let totalDmgToEnemy = effAtk * strikes * (critHit ? critDmg : 1) + poisonDmg;
    if (bossShieldActive) totalDmgToEnemy = Math.floor(totalDmgToEnemy * 0.5);

    if (crushingBlow > 0 && Math.random() * 100 < crushingBlow) {
      totalDmgToEnemy += Math.max(1, Math.floor(playerMaxHp * 0.01));
    }

    // Apply skill proc damage (execute, cleave, meteor, frenzy, blood sacrifice, avalanche, arcane barrage)
    const skillCtx: SkillProcContext = { enemyHp: enemyHp - totalDmgToEnemy, enemyMaxHp: enemyMaxHp, playerHp, playerMaxHp, perHitBase: effAtk, effAtk };
    const skillResult = applySkillProcDamage(skillCtx, eff, allSkills, Math.random);
    totalDmgToEnemy += skillResult.extraDmg;
    playerHp = skillResult.playerHpAfter;
    attackXpGained += skillResult.extraXp;

    enemyHp -= totalDmgToEnemy;
    attackXpGained += 4 * strikes;

    if (lifeLeech > 0)    playerHp = Math.min(playerMaxHp, playerHp + Math.floor(totalDmgToEnemy * lifeLeech / 100));
    if (lifeOnKill > 0)   playerHp = Math.min(playerMaxHp, playerHp + lifeOnKill);
    if (lifeStealPct > 0) playerHp = Math.min(playerMaxHp, playerHp + Math.floor(totalDmgToEnemy * lifeStealPct / 100));

    if (enemyHp <= 0) {
      goldGained        += enemyXp * (isBoss ? 2 : 1);
      attackXpGained    += enemyXp;
      hitpointsXpGained += Math.floor(enemyXp / 3);
      // Boss drops
      if (isBoss) {
        const drop = generateDungeonDrop(dungeonIndex);
        if (drop) {
          const filterThreshold = RARITY_ORDER[state.lootFilter ?? 'common'] ?? 0;
          if ((RARITY_ORDER[drop.rarity] ?? 0) >= filterThreshold) {
            newDrops.push(drop);
          } else {
            goldGained += DISENCHANT_GOLD[drop.rarity] ?? 5;
          }
        }
      }
      if (vampiricHp > 0) playerHp = Math.min(playerMaxHp, playerHp + Math.floor(vampiricHp * playerMaxHp / 100));
      bossKilled = isBoss;
      break;
    }

    // Process boss skills
    let bossEnhancedAtk = boss.attack * (1 - (homeLv.wonder_beacon ?? 0) * 0.08);
    bossShieldActive = false;
    // Boss skills (only during boss wave)
    if (isBoss) {
    bossActiveEffects = bossActiveEffects.filter(e => {
      if (e.skill.type === 'enrage') bossEnhancedAtk = Math.floor(bossEnhancedAtk * (1 + e.skill.value / 100));
      if (e.skill.type === 'shield') bossShieldActive = true;
      e.remainingTicks--;
      return e.remainingTicks > 0;
    });
    // Tick cooldowns and trigger skills
    for (let si = 0; si < bossSkills.length; si++) {
      bossSkillCooldowns[si] -= effectiveCombatSpeed;
      if (bossSkillCooldowns[si] <= 0) {
        const skill = bossSkills[si];
        bossSkillCooldowns[si] = skill.cooldownSec;
        if (skill.type === 'shield') {
          bossActiveEffects.push({ skill, remainingTicks: skill.duration > 0 ? skill.duration : 1 });
        } else if (skill.type === 'heal') {
          enemyHp = Math.min(dungeon.boss.maxHp, enemyHp + skill.value);
        } else if (skill.type === 'aoe') {
          const aoeDmg = skill.value;
          if (aoeDmg > 0) playerHp -= aoeDmg;
          hitpointsXpGained += 1;
        } else if (skill.type === 'enrage') {
          bossActiveEffects.push({ skill, remainingTicks: skill.duration > 0 ? skill.duration : 1 });
        }
      }
    }

    }
    // Enemy attack (boss uses enhanced attack, waves use base)
    const effectiveEnemyAtk = isBoss ? bossEnhancedAtk : enemyAtk;
    const rawDmg = Math.max(0, effectiveEnemyAtk - getPlayerDefence(state));
    const dmgToPlayer = Math.max(0, rawDmg - resistAll);
    const dodged = dodgePct > 0 && Math.random() * 100 < dodgePct;
    if (!dodged && dmgToPlayer > 0) {
      playerHp -= dmgToPlayer;
      defenceXpGained   += 2;
      hitpointsXpGained += 1;
      if (thornsDmg > 0)    enemyHp -= thornsDmg;
      if (reflectDamage > 0) enemyHp -= reflectDamage;
    }

    if (playerHp <= 0) {
      playerDied = true;
      playerHp = Math.floor(playerMaxHp * 0.5);
      break;
    }
  }

  const usedTime = (playerDied || bossKilled) ? elapsedSeconds : ticks * effectiveCombatSpeed;
  const existingLoot = parseLootBag(state.lootBag);
  const combinedLoot = [...existingLoot, ...newDrops].slice(-50);
  const nextAction = bossKilled ? "idle" : `dungeon_${dungeonIndex}_${waveIndex + 1}`;

  // Track dungeon clear stats + tier boss kill
  let dungeonStatsObj = parseDungeonStats(state.dungeonStats);
  let tierBossKilledUpdate: string | undefined;
  if (bossKilled) {
    // Record tier boss kill (last dungeon of each tier)
    const tierBossDungeonIdx: Record<number, number> = { 1: 1, 2: 3, 3: 5, 4: 5 };
    const currentTier = (state as any).worldTier ?? 1;
    if (dungeonIndex === tierBossDungeonIdx[currentTier]) {
      const killed: number[] = JSON.parse((state as any).tierBossKilled ?? '[]');
      if (!killed.includes(currentTier)) {
        killed.push(currentTier);
        tierBossKilledUpdate = JSON.stringify(killed);
      }
    }
    const dungeonId = DUNGEONS[dungeonIndex].id;
    const current = dungeonStatsObj[dungeonId] ?? { clears: 0, fastestSec: null };
    current.clears = (current.clears ?? 0) + 1;
    state.achievements = trackAchievement(state, 'dungeon', String(dungeonIndex), 1);
    if (current.fastestSec === null || usedTime < current.fastestSec) {
      current.fastestSec = usedTime;
    }
    dungeonStatsObj[dungeonId] = current;
  }

  const updates: Partial<GameState> = {
    playerHp,
    achievements: state.achievements,
    enemyHp: (playerDied || bossKilled) ? -1 : enemyHp,
    activeAction: (playerDied) ? "idle" as const : (bossKilled ? "idle" as const : nextAction as any),
    gold:        state.gold        + goldGained,
    [playerStyle === 'ranged' ? 'rangedXp' as 'rangedXp' : playerStyle === 'magic' ? 'magicXp' as 'magicXp' : 'attackXp' as 'attackXp']: (state[playerStyle === 'ranged' ? 'rangedXp' as 'rangedXp' : playerStyle === 'magic' ? 'magicXp' as 'magicXp' : 'attackXp' as 'attackXp'] ?? 0) + attackXpGained,
    defenceXp:   state.defenceXp   + defenceXpGained,
    hitpointsXp: state.hitpointsXp + hitpointsXpGained,
    lootBag: JSON.stringify(combinedLoot),
    dungeonStats: JSON.stringify(dungeonStatsObj),
    trialKey: bossKilled && Math.random() < 0.15 ? (state.trialKey ?? 0) + 1 : state.trialKey,
    actionUpdatedAt: new Date(new Date(state.actionUpdatedAt).getTime() + usedTime * 1000),
    ...(tierBossKilledUpdate ? { tierBossKilled: tierBossKilledUpdate } as any : {}),
  };

  const [updated] = await db.update(gameStates).set(updates).where(eq(gameStates.id, state.id)).returning();
  return updated;
}
