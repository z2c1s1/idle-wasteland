import {
  db, gameStates, type GameState, eq,
  DUNGEONS, getEquipmentBonuses, COMBAT_GEM_POOLS, type CombatStyle,
  ALL_SLOTS, SLOT_BASES, ITEM_SETS, UNIQUE_ITEMS, buildUniqueGameItem,
  type GameItem, type AffixType, type Rarity,
  TRIAL_BUFFS, TRIAL_CURSES,
  calculateLevel, getPlayerMaxHp, getPlayerAttack, getPlayerDefence,
  parseEquipment, parseLootBag, parseGems,
  getResourceCount, buildResourceUpdates,
  SKILLS_DATA, RARITY_ORDER, DISENCHANT_GOLD, mergeGems,
  getTemperatureMultiplier, computeEffectiveCombatSpeed,
} from "./_shared";

const calcLevel = calculateLevel;

export async function tickTrial(state: GameState, elapsedSeconds: number): Promise<GameState> {
  const action = state.activeAction;
  const parts = action.split("_");
  const trialIndex = parseInt(parts[1]);
  const phase = parseInt(parts[2] ?? "0");
  if (phase >= 7) { const [u] = await db.update(gameStates).set({ activeAction: "idle" } as any).where(eq(gameStates.id, state.id)).returning(); return u; }

  const equipment = parseEquipment(state.equipment);
  const { attackBonus, enhancedDamage, lifeRegen, resistAll, lifeLeech, deadlyStrike, attackSpeed } = getEquipmentBonuses(equipment);
  const playerStyle: CombatStyle = (equipment.weapon as any)?.combatStyle ?? 'melee';
  const buffs: string[] = JSON.parse(state.trialBuffs ?? '[]');
  const curses: string[] = JSON.parse(state.trialCurses ?? '[]');

  // Apply buff/curse multipliers
  let atkMul = 1, hpMul = 1, defMul = 1, regenAdd = 0, dmgTakenMul = 1;
  buffs.forEach(id => { const b = TRIAL_BUFFS.find(x => x.id === id); if (b) { atkMul += (b.attackMul - 1); hpMul += (b.hpMul - 1); defMul += (b.defMul - 1); regenAdd += b.regenBonus; } });
  curses.forEach(id => { const c = TRIAL_CURSES.find(x => x.id === id); if (c) { hpMul += (c.hpMul - 1); dmgTakenMul += (c.dmgTakenMul - 1); } });

  const effSpeed = computeEffectiveCombatSpeed(attackSpeed ?? 0, getTemperatureMultiplier(state));
  const ticks = Math.floor(elapsedSeconds / effSpeed);
  if (ticks <= 0) return state;

  const bossRef = DUNGEONS[phase % DUNGEONS.length]?.boss;
  const scale = 1 + phase * 0.25;
  const bossHp = Math.floor((bossRef?.maxHp ?? 500) * scale * 0.6);
  const bossAtk = Math.floor((bossRef?.attack ?? 15) * scale * 0.5);
  const bossDef = Math.floor((bossRef?.defence ?? 5) * scale * 0.4);
  const bossXp = Math.floor((bossRef?.xp ?? 200) * scale * 0.3);
  const bossName = bossRef?.name ?? `Boss ${phase + 1}`;

  const playerMaxHp = Math.max(10, Math.floor(getPlayerMaxHp(state) * hpMul));
  let playerHp = state.playerHp < 0 ? playerMaxHp : state.playerHp;
  let enemyHp = state.enemyHp < 0 ? bossHp : state.enemyHp;
  const effRegen = lifeRegen + regenAdd - (curses.some(id => id === 'c_decay') ? 5 * curses.filter(id => id === 'c_decay').length : 0);
  let goldGained = 0, atkXp = 0, defXp = 0, hpXp = 0, died = false, killed = false;
  const drops: GameItem[] = [];

  for (let i = 0; i < ticks; i++) {
    if (effRegen > 0) playerHp = Math.min(playerMaxHp, playerHp + effRegen);
    const baseAtk = Math.floor(getPlayerAttack(state) * atkMul);
    const defPenalty = Math.floor(bossDef * defMul);
    let dmg = Math.max(1, baseAtk + (attackBonus ?? 0) - defPenalty);
    if (enhancedDamage) dmg = Math.floor(dmg * (1 + enhancedDamage / 100));
    if (deadlyStrike && Math.random() * 100 < deadlyStrike) dmg *= 2;
    if (curses.some(id => id === 'c_fog') && Math.random() < 0.1) dmg = 0;
    enemyHp -= dmg; atkXp += 4;
    if (lifeLeech) playerHp = Math.min(playerMaxHp, playerHp + Math.floor(dmg * lifeLeech / 100));
    if (enemyHp <= 0) {
      goldGained += Math.floor(bossXp * (curses.some(id => id === 'c_poor') ? 0.5 : 1));
      atkXp += bossXp; hpXp += Math.floor(bossXp / 3);
      killed = true;
      if (phase === 6) { const setDef = ITEM_SETS[Math.floor(Math.random() * ITEM_SETS.length)]; const pid = setDef.pieces[Math.floor(Math.random() * setDef.pieces.length)]; const def = UNIQUE_ITEMS.find(u => u.id === pid); if (def) drops.push(buildUniqueGameItem(def)); if (Math.random() < 0.15) { const slot = ALL_SLOTS[Math.floor(Math.random() * ALL_SLOTS.length)]; const base = SLOT_BASES[slot]?.[0]; if (base) drops.push({ instanceId:'mythic_'+Date.now(), name:'神话 '+base.name, slot, emoji:base.emoji, rarity:'mythic',ilvl:75,affixes:[],prefixes:[],suffixes:[],minDamage:base.minDamage,maxDamage:base.maxDamage,attackBonus:35,defenceBonus:0,hpBonus:0,critRating:0,enhancedDamage:0,lifeOnKill:0,crushingBlow:0,magicFind:0,lifeRegen:0,goldBonus:0,resistAll:0,lifeLeech:0,deadlyStrike:0,attackSpeed:0,reflectDamage:0,source:'dropped',baseType:base.id,maxSockets:4,socketedGems:[],skills:[] } as GameItem); } }
      break;
    }
    const rDmg = Math.max(0, Math.floor(bossAtk * dmgTakenMul) - getPlayerDefence(state) - (resistAll ?? 0));
    if (rDmg > 0) { playerHp -= rDmg; defXp += 2; hpXp += 1; }
    if (playerHp <= 0) { died = true; break; }
  }

  const usedTime = (died || killed) ? elapsedSeconds : ticks * effSpeed;
  const combined = [...parseLootBag(state.lootBag), ...drops].slice(-50);
  const updates: any = {
    playerHp: died ? 0 : playerHp, enemyHp: (died || killed) ? -1 : enemyHp,
    gold: state.gold + goldGained,
    [playerStyle === 'ranged' ? 'rangedXp' : playerStyle === 'magic' ? 'magicXp' : 'attackXp']: (state[playerStyle === 'ranged' ? 'rangedXp' : playerStyle === 'magic' ? 'magicXp' : 'attackXp'] ?? 0) + atkXp,
    defenceXp: state.defenceXp + defXp, hitpointsXp: state.hitpointsXp + hpXp,
    lootBag: JSON.stringify(combined),
    activeAction: died ? 'idle' : (killed && phase >= 6) ? 'idle' : state.activeAction,
    actionUpdatedAt: new Date(new Date(state.actionUpdatedAt).getTime() + usedTime * 1000),
  };
  if (died) { updates.trialBuffs = '[]'; updates.trialCurses = '[]'; }

  const [updated] = await db.update(gameStates).set(updates).where(eq(gameStates.id, state.id)).returning();
  return updated;
}
