import {
  db, gameStates, type GameState, eq,
  type GameItem, type ItemSkill,
  ENEMIES, getEquipmentBonuses, generateDroppedItem, getDropChance, getPrayerBuff,
  COMBAT_TRIANGLE, TRIANGLE_DAMAGE_BONUS, TRIANGLE_DAMAGE_PENALTY,
  COMBAT_GEM_POOLS, type Rarity, type CombatStyle,
  calculateLevel, getPlayerMaxHp, getPlayerAttack, getPlayerDefence,
  parseEquipment, parseLootBag, parseGems,
  getAgilityBonuses, getTemperatureMultiplier,
  RARITY_ORDER, DISENCHANT_GOLD, mergeGems,
  COMPANION_NPCS,
  trackAchievement, getPetBuffs, getTalentBonuses,
} from "./_shared";
import {
  computeSkillEffects, computeEffectiveCombatSpeed,
  applySkillProcDamage, applyMortalStrike,
  computeIncomingDamage, applyLifeRecovery, applyThornsReflect,
} from "./_combat-shared";

const calcLevel = calculateLevel;

export async function tickMeleeCombat(state: GameState, elapsedSeconds: number): Promise<GameState> {
  const action = state.activeAction;
  const parts = action.split("_");
  const enemyIndex = parseInt(parts[1]);
  const enemyQty = parseInt(parts[2] ?? '1') || 1;
  const enemy = ENEMIES[enemyIndex];
  if (!enemy) return state;

  const equipment = parseEquipment(state.equipment);
  const allSkills: ItemSkill[] = Object.values(equipment).flatMap(item => item?.skills ?? []);

  const {
    attackBonus: eqAttackBonus,
    enhancedDamage, lifeOnKill, crushingBlow, magicFind,
    lifeRegen, goldBonus, resistAll, critRating,
    lifeLeech, deadlyStrike, attackSpeed, reflectDamage,
  
  } = getEquipmentBonuses(equipment);
  const homeLv: Record<string,number> = (()=>{try{return JSON.parse((state as any).homestead??"{}")}catch{return{}}})();

  const talentBonuses = getTalentBonuses(state);

  const eff = computeSkillEffects(equipment);

  const tempMul = getTemperatureMultiplier(state);
  // Enemy attackSpeed offsets player advantage — faster enemies = shorter cycle
  const enemySpeedBonus = enemy.attackSpeed ?? 0;
  const effectiveCombatSpeed = computeEffectiveCombatSpeed(attackSpeed - enemySpeedBonus, tempMul);
  const ticks = Math.floor(elapsedSeconds / effectiveCombatSpeed);
  if (ticks <= 0) return state;

  const playerMaxHp = getPlayerMaxHp(state) + talentBonuses.maxHp;
  let playerHp = state.playerHp < 0 ? playerMaxHp : state.playerHp;
  // World tier scaling
  const tier = (state as any).worldTier ?? 1;
  const tierHpMul = tier === 2 ? 2 : tier === 3 ? 4 : tier === 4 ? 8 : 1;
  const tierAtkMul = tier === 2 ? 1.5 : tier === 3 ? 2.5 : tier === 4 ? 4 : 1;
  const totalMaxHp = Math.floor(enemy.maxHp * tierHpMul * (1 - (homeLv.wonder_corpse ?? 0) * 0.05));
  let enemyHp  = state.enemyHp  < 0 ? totalMaxHp  : state.enemyHp;
  const enemyAttack = Math.floor(enemy.attack * tierAtkMul);
  const eqSkill = (state as any).equippedSkill || '';
  const aoeList = ['whirlwind','arrow_rain','blizzard','earthquake','wave_slash','blade_storm','hail_arrow','barrage','corpse_boom','poison_cloud','blizzard_m','consecration'];
  const isAoESkill = aoeList.includes(eqSkill);

  const playerAtk = getPlayerAttack(state);
  const playerDef = getPlayerDefence(state) + Math.floor(getPlayerDefence(state) * getPrayerBuff(state, 'defence'));

  const weaponItem = equipment.weapon ?? null;
  const hasWeaponRange = weaponItem && (weaponItem.maxDamage ?? 0) > 0;
  const levelBaseDmg = Math.max(1, playerAtk - eqAttackBonus + talentBonuses.attack);

  const playerStyle: CombatStyle = (equipment.weapon as any)?.combatStyle ?? 'melee';
  const enemyStyle: CombatStyle = (enemy as any).combatStyle ?? 'melee';
  let triangleMult = 1;
  if (COMBAT_TRIANGLE[playerStyle].strong === enemyStyle) triangleMult = 1 + TRIANGLE_DAMAGE_BONUS;
  else if (COMBAT_TRIANGLE[playerStyle].weak === enemyStyle) triangleMult = 1 - TRIANGLE_DAMAGE_PENALTY;

  let goldGained = 0, bonesGained = 0, dragonBonesGained = 0, bloodShardsGained = 0;
  let attackXpGained = 0, defenceXpGained = 0, hitpointsXpGained = 0;
  let playerDied = false;
  let slayerKills = 0;
  const newDrops: GameItem[] = [];
  const tierMaterialChance = tier >= 2 ? 0.05 * (tier - 1) : 0;
  let gemsGained: Record<string, number> = {};
  const dropChance = getDropChance(enemyIndex);
  const agilityLuck = getAgilityBonuses(state).luckMul;

  // ── Pet buffs ────────────────────────────────────────────────────────────
  const petBuffs = getPetBuffs(state);
  playerHp += petBuffs.maxHp; // pet HP bonus
  const petDmgBonus = playerStyle === 'melee' ? petBuffs.meleeDmg : playerStyle === 'ranged' ? petBuffs.rangedDmg : petBuffs.magicDmg;
  const petXpMult = 1 + petBuffs.combatXp;
  const gemPool = COMBAT_GEM_POOLS[Math.min(enemyIndex, COMBAT_GEM_POOLS.length - 1)];

  const updates: Partial<GameState> = {}; // declared early for companion drops

  const rng = () => Math.random();

  for (let i = 0; i < ticks; i++) {
    const effLifeRegen = lifeRegen + (homeLv.clinic ?? 0);
    if (effLifeRegen > 0) playerHp = Math.min(playerMaxHp, playerHp + effLifeRegen);

    const weaponRoll = hasWeaponRange && weaponItem
      ? (weaponItem.minDamage ?? 0) + Math.floor(Math.random() * ((weaponItem.maxDamage ?? 0) - (weaponItem.minDamage ?? 0) + 1))
      : levelBaseDmg;
    const perHitBase = Math.max(1, weaponRoll + eqAttackBonus);

    let effAtk = Math.max(1, perHitBase - enemy.defence);
    if (eff.spellbladePct > 0)  effAtk = Math.floor(effAtk * (1 + eff.spellbladePct / 100));
    if (enhancedDamage > 0) effAtk = Math.floor(effAtk * (1 + enhancedDamage / 100));
    if (eff.berserkPct > 0 && playerHp < playerMaxHp * 0.3) effAtk = Math.floor(effAtk * (1 + eff.berserkPct / 100));
    if (petDmgBonus > 0) effAtk = Math.floor(effAtk * (1 + petDmgBonus));

    const petCritBonus = petBuffs.critChance * 100; // convert to percentage
  const critHit = (critRating + petCritBonus) > 0 && Math.random() * 100 < (critRating + petCritBonus);
    const critDmg = (200 + (deadlyStrike ?? 0)) / 100; // default 200% = 2x
    const strikes = (eff.doubleStrikePct > 0 && Math.random() * 100 < eff.doubleStrikePct) ? 2 : 1;
    let totalDmgToEnemy = Math.floor(effAtk * strikes * (critHit ? critDmg : 1) * triangleMult) + eff.poisonDmg;

    if (crushingBlow > 0 && Math.random() * 100 < crushingBlow) {
      totalDmgToEnemy += Math.max(1, Math.floor(playerMaxHp * 0.01));
    }

    if (isAoESkill) totalDmgToEnemy = Math.floor(totalDmgToEnemy * Math.min(enemyQty, 7));

    // ── Shared skill proc effects ──────────────────────────────────────────
    const skillCtx = { enemyHp, enemyMaxHp: totalMaxHp, playerHp, playerMaxHp, perHitBase, effAtk };
    const skillResult = applySkillProcDamage(skillCtx, eff, allSkills, rng);
    totalDmgToEnemy += skillResult.extraDmg;
    playerHp = skillResult.playerHpAfter;
    attackXpGained += skillResult.extraXp;

    // Mortal Strike (debuff)
    totalDmgToEnemy += applyMortalStrike(perHitBase, allSkills, rng);

    enemyHp -= totalDmgToEnemy;
    const towerXpMul = 1 + (homeLv.tower ?? 0) * 0.04;
    attackXpGained += Math.floor(4 * strikes * (1 + getPrayerBuff(state, 'experience')) * towerXpMul);

    // ── Life recovery (shared) ─────────────────────────────────────────────
    playerHp = applyLifeRecovery(playerHp, playerMaxHp, totalDmgToEnemy,
      lifeLeech, eff.lifeStealPct, lifeOnKill, rng);

    if (enemyHp <= 0) {
      const killReward = enemy.drops.gold[0] + Math.floor(Math.random() * (enemy.drops.gold[1] - enemy.drops.gold[0] + 1));
      goldGained += Math.floor(killReward * enemyQty * (1 + petBuffs.goldDrop));
      bonesGained       += (enemy.drops.bones ?? 0) * enemyQty;
      dragonBonesGained += (enemy.drops.dragonBones ?? 0) * enemyQty;
      bloodShardsGained += Math.floor((enemyIndex + 1) * 2 * enemyQty);
      attackXpGained    += Math.floor(enemy.xp * enemyQty * petXpMult);
      hitpointsXpGained += Math.floor(enemy.xp / 3 * enemyQty * petXpMult);
      slayerKills += enemyQty;
      enemyHp = totalMaxHp;
      // Track achievement progress
      state.achievements = trackAchievement(state, 'kill', enemy.id, enemyQty);
      state.achievements = trackAchievement(state, 'kill', '_total', enemyQty);
      if (Math.random() < (dropChance + petBuffs.dropRate) * agilityLuck * (1 + (enemyQty - 1) * 0.5)) {
        const drop = generateDroppedItem(enemyIndex, magicFind, (enemy as any).uniqueDropIds, homeLv.altar ?? 0);
        const filterThreshold = RARITY_ORDER[state.lootFilter ?? 'common'] ?? 0;
        if ((RARITY_ORDER[drop.rarity] ?? 0) >= filterThreshold) newDrops.push(drop);
        else goldGained += Math.floor((DISENCHANT_GOLD[drop.rarity] ?? 5) * (1 + (homeLv.wonder_furnace ?? 0) * 0.25));
      }
      if (Math.random() < 0.015) {
        const npcs = COMPANION_NPCS;
        const npc = npcs[Math.floor(Math.random() * npcs.length)];
        if (Math.random() < npc.dropChance) {
          const companions = JSON.parse((state as any).companions ?? '[]');
          const bonus = npc.bonusRange[0] + Math.floor(Math.random() * (npc.bonusRange[1] - npc.bonusRange[0] + 1));
          companions.push({ id:npc.id, name:npc.name, emoji:npc.emoji, rarity:npc.rarity, bonusType:npc.bonusType, bonusName:npc.bonusName, bonusValue:bonus });
          (updates as any).companions = JSON.stringify(companions);
        }
      }
      if (Math.random() < gemPool.chance * agilityLuck) {
        const gk = gemPool.pool[Math.floor(Math.random() * gemPool.pool.length)];
        gemsGained[gk] = (gemsGained[gk] ?? 0) + 1;
      }
      if (eff.vampiricHp > 0) playerHp = Math.min(playerMaxHp, playerHp + Math.floor(eff.vampiricHp * playerMaxHp / 100));
      enemyHp = totalMaxHp;
    }

    // ── Incoming damage (shared, with enemy crit + tier scaling) ───────────
    const incCtx = { enemyAttack, playerDef, effectiveResist: eff.effectiveResist, playerHp, playerMaxHp, enemyCritRating: enemy.critRating, enemyCritDamage: enemy.critDamage };
    const inc = computeIncomingDamage(incCtx, eff, allSkills, rng);
    if (!inc.dodged && inc.dmgToPlayer > 0) {
      playerHp -= inc.dmgToPlayer;
      defenceXpGained   += 2;
      hitpointsXpGained += 1;
    }
    // Thorns / Reflect (shared)
    enemyHp = applyThornsReflect(enemyHp, inc.dmgToPlayer, eff.thornsDmg, reflectDamage);
    // Iron Maiden reflect
    enemyHp -= inc.reflectDmg;

    if (playerHp <= 0) {
      playerDied = true;
      playerHp = Math.floor(playerMaxHp * 0.5);
      break;
    }
  }

  const usedTime = playerDied ? elapsedSeconds : ticks * effectiveCombatSpeed;
  const existingLoot = parseLootBag(state.lootBag);
  const combinedLoot = [...existingLoot, ...newDrops].slice(-50);
  const existingGems = parseGems(state.gems);

  Object.assign(updates, {
    playerHp, enemyHp,
    achievements: state.achievements,
    gold:        state.gold        + goldGained,
    bloodShards: (state as any).bloodShards + bloodShardsGained,
    bones:       state.bones       + bonesGained,
    dragonBones: state.dragonBones + dragonBonesGained,
    [playerStyle === 'ranged' ? 'rangedXp' as 'rangedXp' : playerStyle === 'magic' ? 'magicXp' as 'magicXp' : 'attackXp' as 'attackXp']: (state[playerStyle === 'ranged' ? 'rangedXp' as 'rangedXp' : playerStyle === 'magic' ? 'magicXp' as 'magicXp' : 'attackXp' as 'attackXp'] ?? 0) + attackXpGained,
    defenceXp:   state.defenceXp   + defenceXpGained,
    hitpointsXp: state.hitpointsXp + hitpointsXpGained,
    lootBag: JSON.stringify(combinedLoot),
    gems:    JSON.stringify(mergeGems(existingGems, gemsGained)),
    actionUpdatedAt: new Date(new Date(state.actionUpdatedAt).getTime() + usedTime * 1000),
    ...(playerDied ? { activeAction: "idle" } : {}),
  });

  if (slayerKills > 0 && state.slayerTask) {
    try {
      const task = JSON.parse(state.slayerTask);
      if (task.enemyIndex === enemyIndex) {
        task.killed = Math.min(task.qty, (task.killed ?? 0) + slayerKills);
        (updates as any).slayerTask = JSON.stringify(task);
      }
    } catch {}
  }

  const [updated] = await db.update(gameStates).set(updates).where(eq(gameStates.id, state.id)).returning();
  return updated;
}
