import {
  db, gameStates, type GameState, eq,
  DUNGEONS, getEquipmentBonuses, COMBAT_GEM_POOLS, type CombatStyle,
  calculateLevel, getPlayerMaxHp, getPlayerAttack, getPlayerDefence,
  parseEquipment, parseLootBag, parseGems,
  getResourceCount, buildResourceUpdates,
  SKILLS_DATA, RARITY_ORDER, DISENCHANT_GOLD, mergeGems,
  type GameItem, ALL_SLOTS, SLOT_BASES, type AffixType, type Rarity,
} from "./_shared";

const calcLevel = calculateLevel;

export async function tickTower(state: GameState, elapsedSeconds: number): Promise<GameState> {
  const floor = state.towerFloor || 0;
  const isBoss = floor > 0 && floor % 5 === 0;
  const equipment = parseEquipment(state.equipment);
  const { attackBonus, enhancedDamage, lifeRegen, resistAll, lifeLeech, deadlyStrike, attackSpeed } = getEquipmentBonuses(equipment);
  const playerStyle: CombatStyle = (equipment.weapon as any)?.combatStyle ?? 'melee';
  
  const effectiveCombatSpeed = Math.max(1.5, 3 * (1 - (attackSpeed ?? 0) / 200));
  const ticks = Math.floor(elapsedSeconds / effectiveCombatSpeed);
  if (ticks <= 0) return state;

  const playerMaxHp = getPlayerMaxHp(state);
  const playerDef = getPlayerDefence(state);
  let playerHp = state.playerHp < 0 ? playerMaxHp : state.playerHp;

  // Scale enemy by floor
  const scale = 1 + floor * 0.15;
  const bossPool = DUNGEONS;
  const boss = bossPool[floor % bossPool.length].boss;
  const enemyHpMax = isBoss ? Math.floor(boss.maxHp * scale * 0.6) : Math.floor(30 + floor * 18 * scale);
  const enemyAtk   = isBoss ? Math.floor(boss.attack * scale * 0.7) : Math.floor(3 + floor * 2.5 * scale);
  let enemyHp = state.enemyHp < 0 ? enemyHpMax : state.enemyHp;

  let goldGained = 0, attackXpGained = 0, defenceXpGained = 0, hitpointsXpGained = 0;
  let playerDied = false, killed = false;
  const newDrops: GameItem[] = [];

  for (let i = 0; i < ticks; i++) {
    if (lifeRegen > 0) playerHp = Math.min(playerMaxHp, playerHp + lifeRegen);
    const atk = Math.max(1, getPlayerAttack(state));
    let dmg = Math.max(1, atk + (attackBonus ?? 0) - (isBoss ? boss.defence : 0));
    if (enhancedDamage) dmg = Math.floor(dmg * (1 + enhancedDamage / 100));
    if (deadlyStrike && Math.random()*100 < deadlyStrike) dmg *= 2;
    enemyHp -= dmg;
    attackXpGained += 4;
    if (lifeLeech) playerHp = Math.min(playerMaxHp, playerHp + Math.floor(dmg * lifeLeech / 100));
    if (enemyHp <= 0) {
      goldGained += isBoss ? Math.floor(50 + floor * 30) : Math.floor(5 + floor * 3);
      attackXpGained += isBoss ? Math.floor(boss.xp * 0.5 * scale) : Math.floor(20 + floor * 5);
      hitpointsXpGained += Math.floor(attackXpGained / 5);
      killed = true;
      // Boss drops: 20% tower key, 10% mythic item
      if (isBoss) {
        if (Math.random() < 0.2) { /* tower key — already tracked via towerFloor */ }
        if (Math.random() < 0.1) {
          const slot = ALL_SLOTS[Math.floor(Math.random() * ALL_SLOTS.length)];
          const base = SLOT_BASES[slot][Math.floor(Math.random() * SLOT_BASES[slot].length)];
          const affixes = [{ type: 'damage_percent' as AffixType, value: Math.floor(20 + floor * 3) }];
          const drop = { instanceId: `mythic_${Date.now()}`, name: `神话 ${base.name}`, slot, emoji: base.emoji, rarity: 'mythic' as Rarity, ilvl: Math.floor(50 + floor * 3), affixes, prefixes:[], suffixes:affixes, minDamage:base.minDamage, maxDamage:base.maxDamage, attackBonus:Math.floor(floor*2), defenceBonus:0, hpBonus:0, critRating:0, enhancedDamage:0, lifeOnKill:0, crushingBlow:0, magicFind:0, lifeRegen:0, goldBonus:0, resistAll:0, lifeLeech:0, deadlyStrike:0, attackSpeed:0, reflectDamage:0, source:'dropped' as const, baseType:base.id, maxSockets:3, socketedGems:[], skills:[] };
          newDrops.push(drop as GameItem);
        }
      }
      break;
    }
    // Enemy attacks
    const rawDmg = Math.max(0, enemyAtk - playerDef - (resistAll ?? 0));
    if (rawDmg > 0) { playerHp -= rawDmg; defenceXpGained += 2; hitpointsXpGained += 1; }
    if (playerHp <= 0) { playerDied = true; break; }
  }

  const usedTime = (playerDied || killed) ? elapsedSeconds : ticks * effectiveCombatSpeed;
  const existingLoot = parseLootBag(state.lootBag);
  const combinedLoot = [...existingLoot, ...newDrops].slice(-50);

  const updates: Partial<GameState> = {
    playerHp: playerDied ? 0 : playerHp,
    enemyHp: (playerDied || killed) ? -1 : enemyHp,
    gold: state.gold + goldGained,
    [playerStyle === 'ranged' ? 'rangedXp' : playerStyle === 'magic' ? 'magicXp' : 'attackXp']: (state[playerStyle === 'ranged' ? 'rangedXp' : playerStyle === 'magic' ? 'magicXp' : 'attackXp'] ?? 0) + attackXpGained,
    defenceXp: state.defenceXp + defenceXpGained,
    hitpointsXp: state.hitpointsXp + hitpointsXpGained,
    lootBag: JSON.stringify(combinedLoot),
    towerFloor: (playerDied || !killed) ? state.towerFloor : (floor + 1),
    activeAction: playerDied ? 'idle' : killed ? `tower` : state.activeAction,
    actionUpdatedAt: new Date(new Date(state.actionUpdatedAt).getTime() + usedTime * 1000),
  };

  const [updated] = await db.update(gameStates).set(updates).where(eq(gameStates.id, state.id)).returning();
  return updated;
}
