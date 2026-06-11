import { db } from "../db";
import { gameStates, type GameState } from "@shared/schema";
import { safeJsonRecord, safeJsonArray } from "@shared/safe-parse";
import {
  getEquipmentBonuses, generateDroppedItem,
  SMITHING_RECIPES, LEATHERWORKING_RECIPES, JEWELCRAFTING_RECIPES,
  TOOL_RECIPES, ALL_TOOLS, ALL_SLOTS, SLOT_BASES, ITEM_SETS, UNIQUE_ITEMS, buildUniqueGameItem,
  GAMBLE_TIERS, getGemBonus,
  type GameItem, type EquipmentSlot, type Rarity,
  MAX_ENHANCE_LEVEL, ENHANCE_COST_PER_LEVEL, rollSubStatValue,
  type SubStatType,
} from "@shared/game-data";
import { eq } from "drizzle-orm";
import { calculateLevel, getCombatLevel } from "@shared/game-math";
import { parseEquipment, parseCraftItems, parseLootBag, parseGems } from "@shared/game-state-parse";
import { getResourceCount, buildResourceUpdates } from "@shared/resources";
import { DISENCHANT_GOLD } from "./constants";
import { msg } from "@shared/messages";

const calcLevel = calculateLevel;

// ─── Equip / Unequip ──────────────────────────────────────────────────────────

export async function equipItem(state: GameState, instanceId?: string, itemId?: string): Promise<GameState> {
  const equipment = parseEquipment(state.equipment);
  const craftItems = parseCraftItems(state.craftItems);
  const lootBag = parseLootBag(state.lootBag);

  let newItem: GameItem | null = null;

  if (instanceId) {
    const idx = lootBag.findIndex(i => i.instanceId === instanceId);
    if (idx < 0) throw new Error("Item not found in loot bag");
    newItem = lootBag[idx];
    lootBag.splice(idx, 1);
  } else if (itemId) {
    if ((craftItems[itemId] ?? 0) < 1) throw new Error("Item not in inventory");
    // Validate item exists BEFORE consuming it (prevents item loss on invalid IDs)
    newItem = (await import("@shared/game-data")).craftedToGameItem(itemId);
    if (!newItem) throw new Error("Unknown item");
    craftItems[itemId]--;
    if (craftItems[itemId] <= 0) delete craftItems[itemId];
  } else {
    throw new Error("Must provide instanceId or itemId");
  }

  const prev = equipment[newItem.slot as EquipmentSlot] ?? null;
  if (prev) {
    if (prev.source === 'smithed' && prev.baseId) {
      craftItems[prev.baseId] = (craftItems[prev.baseId] ?? 0) + 1;
    } else {
      lootBag.push(prev);
    }
  }

  equipment[newItem.slot as EquipmentSlot] = applySubStatsToItem(newItem);

  const [updated] = await db.update(gameStates).set({
    equipment:  JSON.stringify(equipment),
    craftItems: JSON.stringify(craftItems),
    lootBag:    JSON.stringify(lootBag),
  }).where(eq(gameStates.id, state.id)).returning();
  return updated;
}

export async function unequipItem(state: GameState, slot: string): Promise<GameState> {
  const equipment = parseEquipment(state.equipment);
  const item = equipment[slot as EquipmentSlot] ?? null;
  if (!item) throw new Error("Nothing equipped in that slot");

  const craftItems = parseCraftItems(state.craftItems);
  const lootBag = parseLootBag(state.lootBag);

  if (item.source === 'smithed' && item.baseId) {
    craftItems[item.baseId] = (craftItems[item.baseId] ?? 0) + 1;
  } else {
    lootBag.push(item);
  }
  delete equipment[slot as EquipmentSlot];

  const [updated] = await db.update(gameStates).set({
    equipment:  JSON.stringify(equipment),
    craftItems: JSON.stringify(craftItems),
    lootBag:    JSON.stringify(lootBag),
  }).where(eq(gameStates.id, state.id)).returning();
  return updated;
}

// ─── Loot management ──────────────────────────────────────────────────────────

export async function destroyLoot(state: GameState, instanceId: string): Promise<GameState> {
  const lootBag = parseLootBag(state.lootBag);
  const item = lootBag.find(i => i.instanceId === instanceId);
  const homeLv: Record<string,number> = (()=>{try{return safeJsonRecord((state as any).homestead)}catch{return{}}})();
  const goldRefund = item ? Math.floor((DISENCHANT_GOLD[item.rarity] ?? 5) * (1 + (homeLv.wonder_furnace ?? 0) * 0.25)) : 0;
  const filtered = lootBag.filter(i => i.instanceId !== instanceId);
  const [updated] = await db.update(gameStates)
    .set({ lootBag: JSON.stringify(filtered), gold: state.gold + goldRefund })
    .where(eq(gameStates.id, state.id)).returning();
  return updated;
}

/** Get effective loot bag size including warehouse building bonus */
export function getEffectiveLootBagSize(state: GameState): number {
  const base = state.lootBagSize ?? 50;
  const homestead: Record<string, number> = (() => { try { return JSON.parse((state as any).homestead ?? '{}'); } catch { return {}; } })();
  const warehouse = homestead.warehouse ?? 0;
  return base + warehouse * 2;
}

export async function expandLootBag(state: GameState): Promise<GameState> {
  const current = getEffectiveLootBagSize(state);
  if (current >= 200) throw new Error(msg("lootBagMax"));
  const slot = (state.lootBagSize ?? 50) - 49; // cost based on raw expansions, not warehouse bonus
  const cost = Math.floor(Math.pow(Math.max(1, slot), 2) * 100);
  if (state.gold < cost) throw new Error(msg("notEnoughGold", cost));
  const [u] = await db.update(gameStates).set({ lootBagSize: (state.lootBagSize ?? 50) + 1, gold: state.gold - cost } as any).where(eq(gameStates.id, state.id)).returning();
  return u;
}

export async function setLootFilter(state: GameState, rarity: string): Promise<GameState> {
  const [updated] = await db.update(gameStates)
    .set({ lootFilter: rarity })
    .where(eq(gameStates.id, state.id)).returning();
  return updated;
}

// ─── Socket gem ───────────────────────────────────────────────────────────────

export async function socketGem(state: GameState, instanceId: string, gemKey: string): Promise<GameState> {
  const gems = parseGems(state.gems);
  if ((gems[gemKey] ?? 0) < 1) throw new Error("You don't have that gem");

  const lootBag  = parseLootBag(state.lootBag);
  const equipment = parseEquipment(state.equipment);

  let item: GameItem | null = null;
  let inLoot = false;
  const lootIdx = lootBag.findIndex(i => i.instanceId === instanceId);
  if (lootIdx >= 0) { item = lootBag[lootIdx]; inLoot = true; }
  else {
    for (const slot of Object.keys(equipment) as EquipmentSlot[]) {
      if (equipment[slot]?.instanceId === instanceId) { item = equipment[slot]!; break; }
    }
  }

  if (!item) throw new Error("Item not found");
  const sockets = item.socketedGems ?? [];
  const maxSockets = item.maxSockets ?? 0;
  if (sockets.length >= maxSockets) throw new Error("No empty sockets");

  const bonus = getGemBonus(gemKey);
  const updatedItem: GameItem = {
    ...item,
    socketedGems: [...sockets, gemKey],
    attackBonus:  item.attackBonus  + bonus.attackBonus,
    defenceBonus: item.defenceBonus + bonus.defenceBonus,
    hpBonus:      item.hpBonus      + bonus.hpBonus,
    critRating:   item.critRating   + bonus.critRating,
  };

  gems[gemKey]--;
  if (gems[gemKey] <= 0) delete gems[gemKey];

  if (inLoot) lootBag[lootIdx] = updatedItem;
  else {
    for (const slot of Object.keys(equipment) as EquipmentSlot[]) {
      if (equipment[slot]?.instanceId === instanceId) { equipment[slot] = updatedItem; break; }
    }
  }

  const [updated] = await db.update(gameStates).set({
    gems:      JSON.stringify(gems),
    lootBag:   JSON.stringify(lootBag),
    equipment: JSON.stringify(equipment),
  }).where(eq(gameStates.id, state.id)).returning();
  return updated;
}

export async function addSocket(state: GameState, instanceId: string): Promise<GameState> {
  const loot = parseLootBag(state.lootBag);
  const item = loot.find(i => i.instanceId === instanceId);
  if (!item) throw new Error(msg("itemNotFound"));
  const maxSockets = item.rarity === 'mythic' ? 5 : item.rarity === 'legendary' ? 4 : item.rarity === 'epic' ? 3 : item.rarity === 'rare' ? 2 : 1;
  if ((item.maxSockets ?? 0) >= maxSockets) throw new Error(msg("socketMax"));
  const rarityCost: Record<string,number> = { common:1, uncommon:3, rare:8, epic:25, legendary:100, mythic:2000 };
  const cost = Math.floor(Math.pow(item.ilvl, 2) * (rarityCost[item.rarity] ?? 5));
  if (state.gold < cost) throw new Error(msg("notEnoughGold", cost));
  item.maxSockets = (item.maxSockets ?? 0) + 1;
  const idx = loot.findIndex(i => i.instanceId === instanceId);
  loot[idx] = item;
  const [u] = await db.update(gameStates).set({ lootBag: JSON.stringify(loot), gold: state.gold - cost } as any).where(eq(gameStates.id, state.id)).returning();
  return u;
}

// ─── Tool ─────────────────────────────────────────────────────────────────────

export async function equipTool(state: GameState, toolId: string): Promise<GameState> {
  const tool = ALL_TOOLS.find(t => t.id === toolId);
  if (!tool) throw new Error("Tool not found");
  const [updated] = await db.update(gameStates)
    .set({ tool: JSON.stringify(tool) })
    .where(eq(gameStates.id, state.id)).returning();
  return updated;
}

// ─── Synthesis ────────────────────────────────────────────────────────────────

export async function synthEquip(state: GameState, instanceIds: string[]): Promise<GameState> {
  const loot = parseLootBag(state.lootBag);
  const items = loot.filter(i => instanceIds.includes(i.instanceId));
  const count = items.length;
  if (count < 3 || count > 5) throw new Error(msg("need3to5Items"));
  const chance = count === 3 ? 0.25 : count === 4 ? 0.5 : 1;
  const avgIlvl = Math.max(1, Math.floor(items.reduce((s,i) => s + i.ilvl, 0) / count) - 5);
  // Cost = baseGold × rarityWeight × ilvlFactor, per-item sum (sync with client)
  const RARITY_WEIGHT: Record<string, number> = {
    common: 0.2, uncommon: 0.6, rare: 1.0, epic: 1.8, legendary: 3.0, mythic: 5.0,
  };
  const combatLevel = getCombatLevel(state);
  const baseGold = 500 + combatLevel * 300;
  const baseCost = items.reduce((sum, item) => {
    const ilvlFactor = item.ilvl / 10;
    return sum + baseGold * (RARITY_WEIGHT[item.rarity] ?? 0.6) * ilvlFactor;
  }, 0);
  const synthLevel = calcLevel(state.synthesisXp ?? 0);
  const discount = Math.min(0.5, synthLevel / 200);
  const finalCost = Math.max(1, Math.floor(baseCost * (1 - discount)));
  if (state.gold < finalCost) throw new Error(msg("notEnoughGold", finalCost));

  const remaining = loot.filter(i => !instanceIds.includes(i.instanceId));
  const success = Math.random() < chance;
  const xpGain = count * 5;
  if (!success) {
    const [u] = await db.update(gameStates).set({ lootBag: JSON.stringify(remaining), gold: state.gold - finalCost, synthesisXp: (state.synthesisXp ?? 0) + xpGain } as any).where(eq(gameStates.id, state.id)).returning();
    return u;
  }

  const rOrder = ['common','uncommon','rare','epic','legendary','mythic'];
  const maxRI = Math.max(...items.map(i => rOrder.indexOf(i.rarity)));
  const newRarity = rOrder[Math.min(maxRI + 1, rOrder.length - 1)] as Rarity;
  const sameSlot = items.every(i => i.slot === items[0].slot);
  const slot = sameSlot ? items[0].slot : ALL_SLOTS[Math.floor(Math.random() * ALL_SLOTS.length)];

  const newItem = generateDroppedItem(Math.max(0, Math.min(7, Math.floor(avgIlvl/10))), 0);
  newItem.instanceId = 'synth_'+Date.now();
  newItem.rarity = newRarity;
  newItem.ilvl = avgIlvl;
  newItem.slot = slot;

  const [u] = await db.update(gameStates).set({ lootBag: JSON.stringify([...remaining, newItem]), gold: state.gold - finalCost, synthesisXp: (state.synthesisXp ?? 0) + xpGain } as any).where(eq(gameStates.id, state.id)).returning();
  return u;
}

export async function synthGem(state: GameState, items: {type:string;quality:string}[]): Promise<GameState> {
  const gems = safeJsonRecord(state.gems);
  const count = items.length;
  if (count < 3 || count > 5) throw new Error(msg("need3to5Gems"));
  const costMul = count===3?1:count===4?2:5;
  const goldCost = (50+count*30)*costMul;
  if (state.gold < goldCost) throw new Error(msg("notEnoughGold"));
  const chance = count===3?0.25:count===4?0.5:1;
  for(const g of items){const k=g.type+'_'+g.quality;if(!gems[k])throw new Error(msg("notEnoughGems"));gems[k]--}
  if(Math.random()>=chance){
    const [u]=await db.update(gameStates).set({gems:JSON.stringify(gems),gold:state.gold-goldCost}as any).where(eq(gameStates.id,state.id)).returning();
    return u;
  }
  const qo=['chipped','flawed','normal','flawless','perfect'];
  const mi=Math.max(...items.map(g=>qo.indexOf(g.quality)));
  const nq=qo[Math.min(mi+1,qo.length-1)];
  const nk=items[0].type+'_'+nq;
  gems[nk]=(gems[nk]??0)+1;
  const [u]=await db.update(gameStates).set({gems:JSON.stringify(gems),gold:state.gold-goldCost}as any).where(eq(gameStates.id,state.id)).returning();
  return u;
}

// ─── Gamble ───────────────────────────────────────────────────────────────────

export async function gambleItem(state: GameState, tierIdx: number, slot?: string): Promise<GameState> {
  const tier = GAMBLE_TIERS[tierIdx];
  if (!tier) throw new Error(msg("invalidTier"));
  const combatLevel = getCombatLevel(state);
  const cost = tier.costPerLevel * Math.max(1, combatLevel);
  if (state.gold < cost) throw new Error(msg("notEnoughGold"));

  const ilvl = Math.max(1, combatLevel + Math.floor((Math.random() - 0.5) * 2 * tier.ilvlSpread));
  const slotKey = (slot ?? ALL_SLOTS[Math.floor(Math.random() * ALL_SLOTS.length)]) as EquipmentSlot;
  const totalWeight = tier.rarities.reduce((s,r) => s + r.weight, 0);
  let roll = Math.random() * totalWeight;
  let rarity: Rarity = 'common';
  for (const r of tier.rarities) { roll -= r.weight; if (roll <= 0) { rarity = r.rarity; break; } }
  const isUnique = Math.random() < tier.uniqueChance;

  let item: GameItem;
  if (isUnique) {
    const eligible = UNIQUE_ITEMS.filter(u => u.slot === slotKey && u.ilvl <= ilvl + 10);
    const def = eligible.length > 0 ? eligible[Math.floor(Math.random() * eligible.length)] : null;
    if (def) item = buildUniqueGameItem(def);
    else item = generateDroppedItem(Math.max(0, Math.min(7, Math.floor(ilvl/10))), 0);
  } else {
    item = generateDroppedItem(Math.max(0, Math.min(7, Math.floor(ilvl/10))), 0);
    item.rarity = rarity;
    item.ilvl = ilvl;
    item.slot = slotKey;
    item.instanceId = 'gamble_'+Date.now();
  }

  const loot = parseLootBag(state.lootBag);
  const [u] = await db.update(gameStates).set({ lootBag: JSON.stringify([...loot, item]), gold: state.gold - cost } as any).where(eq(gameStates.id, state.id)).returning();
  return u;
}

// ─── Enhancement ──────────────────────────────────────────────────────────────

export async function enhanceItem(state: GameState, instanceId: string): Promise<GameState> {
  // Find item in lootBag or equipped
  const lootBag = parseLootBag(state.lootBag);
  const equipment = parseEquipment(state.equipment);

  let item: GameItem | null = null;
  let inLoot = false;
  const lootIdx = lootBag.findIndex(i => i.instanceId === instanceId);
  if (lootIdx >= 0) { item = lootBag[lootIdx]; inLoot = true; }
  else {
    for (const slot of Object.keys(equipment) as EquipmentSlot[]) {
      if (equipment[slot]?.instanceId === instanceId) { item = equipment[slot]!; break; }
    }
  }
  if (!item) throw new Error(msg("itemNotFound"));

  const currentLevel = item.enhanceLevel ?? 0;
  if (currentLevel >= MAX_ENHANCE_LEVEL) throw new Error("已达最大强化等级（+12）");

  // Cost: (level+1) * base * ilvl
  const cost = (currentLevel + 1) * ENHANCE_COST_PER_LEVEL * Math.max(1, item.ilvl);
  if (state.gold < cost) throw new Error(msg("notEnoughGold", cost));

  const newLevel = currentLevel + 1;
  const subStats = [...(item.subStats ?? [])];

  // Every +3 levels, boost a random sub-stat (weighted toward existing high-quality ones)
  if (newLevel % 3 === 0 && subStats.length > 0) {
    const idx = Math.floor(Math.random() * subStats.length);
    const boost = rollSubStatValue(subStats[idx].type, item.ilvl);
    subStats[idx] = { ...subStats[idx], value: subStats[idx].value + boost.value, quality: boost.quality };
  }

  const updatedItem: GameItem = { ...item, enhanceLevel: newLevel, subStats };

  // Also apply sub-stat bonuses to the item's main stats
  const applied = applySubStatsToItem(updatedItem);

  if (inLoot) lootBag[lootIdx] = applied;
  else {
    for (const slot of Object.keys(equipment) as EquipmentSlot[]) {
      if (equipment[slot]?.instanceId === instanceId) { equipment[slot] = applied; break; }
    }
  }

  const [updated] = await db.update(gameStates).set({
    gold: state.gold - cost,
    lootBag: JSON.stringify(lootBag),
    equipment: JSON.stringify(equipment),
  }).where(eq(gameStates.id, state.id)).returning();
  return updated;
}

/** Apply sub-stats to the item's main stats (called on equip and after enhance) */
export function applySubStatsToItem(item: GameItem): GameItem {
  const subStats = item.subStats ?? [];
  if (subStats.length === 0) return item;

  let atk = item.attackBonus, def = item.defenceBonus, hp = item.hpBonus;
  let crit = item.critRating, ed = item.enhancedDamage ?? 0, ll = item.lifeLeech ?? 0;
  let aspd = item.attackSpeed ?? 0, res = item.resistAll ?? 0, ds = item.deadlyStrike ?? 0;
  let cb = item.crushingBlow ?? 0;

  const enhanceMult = 1 + (item.enhanceLevel ?? 0) * 0.05; // 5% per enhance level

  for (const s of subStats) {
    const v = Math.floor(s.value * enhanceMult);
    switch (s.type) {
      case 'attackBonus':    atk += v; break;
      case 'defenceBonus':   def += v; break;
      case 'hpBonus':        hp  += v; break;
      case 'critRating':     crit += s.value; break;
      case 'enhancedDamage': ed  += s.value; break;
      case 'lifeLeech':      ll  += s.value; break;
      case 'resistAll':      res += s.value; break;
      case 'deadlyStrike':   ds  += s.value; break;
      case 'crushingBlow':   cb  += s.value; break;
    }
  }

  return {
    ...item,
    attackBonus: atk, defenceBonus: def, hpBonus: hp,
    critRating: crit, enhancedDamage: ed, lifeLeech: ll,
    attackSpeed: aspd, resistAll: res, deadlyStrike: ds, crushingBlow: cb,
  };
}

// ─── Legendary Power Extraction ──────────────────────────────────────────────

export async function extractPower(state: GameState, instanceId: string): Promise<GameState> {
  const lootBag = parseLootBag(state.lootBag);
  const equipment = parseEquipment(state.equipment);

  let item: GameItem | null = null;
  let inLoot = false;
  const idx = lootBag.findIndex(i => i.instanceId === instanceId);
  if (idx >= 0) { item = lootBag[idx]; inLoot = true; }
  else {
    for (const slot of Object.keys(equipment) as EquipmentSlot[]) {
      if (equipment[slot]?.instanceId === instanceId) { item = equipment[slot]!; break; }
    }
  }
  if (!item) throw new Error("物品不存在");
  if (!item.legendaryPower && !item.skills?.length) throw new Error("该装备没有可萃取的传奇特效");

  const powerId = item.legendaryPower || `skill_${item.skills?.[0]?.type || 'unknown'}`;
  const powerName = item.legendaryPower || item.skills?.[0]?.name || '未知威能';
  const powers: string[] = safeJsonArray((state as any).extractedPowers);
  const homeLv: Record<string,number> = (()=>{try{return safeJsonRecord((state as any).homestead)}catch{return{}}})();
  const maxSlots = 3 + (homeLv.recycling ?? 0);
  if (powers.length >= maxSlots) throw new Error("萃取槽已满，升级回收站解锁更多");
  if (powers.includes(powerId)) throw new Error("该威能已学会");

  powers.push(powerId);
  (item as any)._powerName = powerName;

  // Remove item
  if (inLoot) lootBag.splice(idx, 1);
  else {
    for (const slot of Object.keys(equipment) as EquipmentSlot[]) {
      if (equipment[slot]?.instanceId === instanceId) { delete equipment[slot]; break; }
    }
  }

  const [updated] = await db.update(gameStates).set({
    extractedPowers: JSON.stringify(powers),
    lootBag: JSON.stringify(lootBag),
    equipment: JSON.stringify(equipment),
  } as any).where(eq(gameStates.id, state.id)).returning();
  return updated;
}

export async function equipPower(state: GameState, slotS: number, powerId: string): Promise<GameState> {
  const powers: string[] = safeJsonArray((state as any).extractedPowers);
  if (powerId !== "" && !powers.includes(powerId)) throw new Error("尚未学会该威能");
  const active: string[] = safeJsonArray<string>((state as any).activePowers);
  if (powerId !== "" && active.includes(powerId)) throw new Error("该威能已在其他槽位激活");
  active[slotS] = powerId;
  const [updated] = await db.update(gameStates).set({
    activePowers: JSON.stringify(active),
  } as any).where(eq(gameStates.id, state.id)).returning();
  return updated;
}

// ─── Equipment Corruption ────────────────────────────────────────────────────

const CORRUPT_EFFECTS = [
  { weight: 30, type: 'buff', desc: '全体属性 +15%', apply: (item: GameItem) => {
    item.attackBonus = Math.floor((item.attackBonus||0) * 1.15);
    item.defenceBonus = Math.floor((item.defenceBonus||0) * 1.15);
    item.hpBonus = Math.floor((item.hpBonus||0) * 1.15);
    item.critRating = Math.floor((item.critRating||0) * 1.15);
  }},
  { weight: 20, type: 'big_buff', desc: '随机一条副属性翻倍', apply: (item: GameItem) => {
    if ((item.subStats?.length ?? 0) > 0) {
      const idx = Math.floor(Math.random() * item.subStats!.length);
      item.subStats![idx].value *= 2;
    }
  }},
  { weight: 20, type: 'nerf', desc: '全体属性 -10%', apply: (item: GameItem) => {
    item.attackBonus = Math.floor((item.attackBonus||0) * 0.9);
    item.defenceBonus = Math.floor((item.defenceBonus||0) * 0.9);
    item.hpBonus = Math.floor((item.hpBonus||0) * 0.9);
  }},
  { weight: 15, type: 'big_nerf', desc: '随机一条副属性清零', apply: (item: GameItem) => {
    if ((item.subStats?.length ?? 0) > 0) {
      const idx = Math.floor(Math.random() * item.subStats!.length);
      item.subStats![idx].value = 0;
    }
  }},
  { weight: 15, type: 'nothing', desc: '无变化' },
];

export async function corruptItem(state: GameState, instanceId: string): Promise<{ gameState: GameState; result: string }> {
  const lootBag = parseLootBag(state.lootBag);
  const equipment = parseEquipment(state.equipment);

  let item: GameItem | null = null;
  let inLoot = false;
  const idx = lootBag.findIndex(i => i.instanceId === instanceId);
  if (idx >= 0) { item = lootBag[idx]; inLoot = true; }
  else {
    for (const slot of Object.keys(equipment) as EquipmentSlot[]) {
      if (equipment[slot]?.instanceId === instanceId) { item = equipment[slot]!; break; }
    }
  }
  if (!item) throw new Error("物品不存在");
  if ((item as any).corrupted) throw new Error("该装备已被辐射污染");

  // Roll effect — radlab building increases positive outcome weights
  const homestead: Record<string, number> = (() => { try { return JSON.parse((state as any).homestead ?? '{}'); } catch { return {}; } })();
  const radlabLevel = homestead.radlab ?? 0;
  const radlabBonus = radlabLevel * 5; // +5% per level
  const adjustedEffects = CORRUPT_EFFECTS.map(e => ({
    ...e,
    weight: e.type === 'buff' || e.type === 'double_buff' ? e.weight + radlabBonus : e.weight
  }));
  const totalWeight = adjustedEffects.reduce((s, e) => s + e.weight, 0);
  let roll = Math.random() * totalWeight;
  let chosen = adjustedEffects[0];
  for (const e of adjustedEffects) { roll -= e.weight; if (roll <= 0) { chosen = e; break; } }

  if (chosen.type === 'destroy') {
    if (inLoot) lootBag.splice(idx, 1);
    else {
      for (const slot of Object.keys(equipment) as EquipmentSlot[]) {
        if (equipment[slot]?.instanceId === instanceId) { delete equipment[slot]; break; }
      }
    }
    const [updated] = await db.update(gameStates).set({
      lootBag: JSON.stringify(lootBag), equipment: JSON.stringify(equipment),
    }).where(eq(gameStates.id, state.id)).returning();
    return { gameState: updated, result: '💀 装备被辐射摧毁！' };
  }

  if (chosen.apply) chosen.apply(item);
  (item as any).corrupted = true;

  if (inLoot) lootBag[idx] = item;
  else {
    for (const slot of Object.keys(equipment) as EquipmentSlot[]) {
      if (equipment[slot]?.instanceId === instanceId) { equipment[slot] = item; break; }
    }
  }

  const [updated] = await db.update(gameStates).set({
    lootBag: JSON.stringify(lootBag), equipment: JSON.stringify(equipment),
  }).where(eq(gameStates.id, state.id)).returning();
  return { gameState: updated, result: chosen.desc };
}

// ─── Blood Shards Slot Gambling ──────────────────────────────────────────────

export async function gambleSlot(state: GameState, slotS: string, cost: number): Promise<GameState> {
  const bloodShards = (state as any).bloodShards ?? 0;
  if (bloodShards < cost) throw new Error(`血岩碎片不足（需要${cost}，当前${bloodShards}）`);

  const rarityRoll = Math.random();
  let rarity: Rarity;
  if (rarityRoll < 0.10)      rarity = 'mythic';
  else if (rarityRoll < 0.30) rarity = 'legendary';
  else if (rarityRoll < 0.60) rarity = 'epic';
  else                         rarity = 'rare';

  const combatLevel = getCombatLevel(state);
  const ilvl = Math.max(1, combatLevel + Math.floor((Math.random() - 0.5) * 10));
  const slotKey = (slotS || ALL_SLOTS[Math.floor(Math.random() * ALL_SLOTS.length)]) as EquipmentSlot;

  const item = generateDroppedItem(Math.max(0, Math.min(7, Math.floor(ilvl / 10))), 0);
  item.rarity = rarity;
  item.ilvl = ilvl;
  item.slot = slotKey;
  item.instanceId = 'shard_' + Date.now();

  const loot = parseLootBag(state.lootBag);
  const [updated] = await db.update(gameStates).set({
    lootBag: JSON.stringify([...loot, item]),
    bloodShards: bloodShards - cost,
  } as any).where(eq(gameStates.id, state.id)).returning();
  return updated;
}
