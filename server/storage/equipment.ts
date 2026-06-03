import { db } from "../db";
import { gameStates, type GameState } from "@shared/schema";
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
    craftItems[itemId]--;
    if (craftItems[itemId] <= 0) delete craftItems[itemId];
    newItem = (await import("@shared/game-data")).craftedToGameItem(itemId);
    if (!newItem) throw new Error("Unknown item");
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
  const goldRefund = item ? (DISENCHANT_GOLD[item.rarity] ?? 5) : 0;
  const filtered = lootBag.filter(i => i.instanceId !== instanceId);
  const [updated] = await db.update(gameStates)
    .set({ lootBag: JSON.stringify(filtered), gold: state.gold + goldRefund })
    .where(eq(gameStates.id, state.id)).returning();
  return updated;
}

export async function expandLootBag(state: GameState): Promise<GameState> {
  const current = state.lootBagSize ?? 50;
  if (current >= 200) throw new Error(msg("lootBagMax"));
  const slot = current - 49;
  const cost = Math.floor(Math.pow(slot, 2) * 100);
  if (state.gold < cost) throw new Error(msg("notEnoughGold", cost));
  const [u] = await db.update(gameStates).set({ lootBagSize: current + 1, gold: state.gold - cost } as any).where(eq(gameStates.id, state.id)).returning();
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
  const costMul = count === 3 ? 1 : count === 4 ? 2 : 5;
  const avgIlvl = Math.max(1, Math.floor(items.reduce((s,i) => s + i.ilvl, 0) / count) - 5);
  const rarityCost: Record<string,number> = { normal:10, fine:50, rare:200, epic:800, legendary:3000, mythic:10000 };
  const maxR = items.reduce((r,i) => (rarityCost[i.rarity]||0) > (rarityCost[r]||0) ? i.rarity : r, 'normal');
  const baseCost = Math.floor(avgIlvl * (rarityCost[maxR]||50) * costMul);
  const synthLevel = calcLevel(state.synthesisXp ?? 0);
  const discount = 1 - (synthLevel / 100);
  const finalCost = Math.max(1, Math.floor(baseCost * discount));
  if (state.gold < finalCost) throw new Error(msg("notEnoughGold", finalCost));

  const remaining = loot.filter(i => !instanceIds.includes(i.instanceId));
  const success = Math.random() < chance;
  const xpGain = count * 5;
  if (!success) {
    const [u] = await db.update(gameStates).set({ lootBag: JSON.stringify(remaining), gold: state.gold - finalCost, synthesisXp: (state.synthesisXp ?? 0) + xpGain } as any).where(eq(gameStates.id, state.id)).returning();
    return u;
  }

  const rOrder = ['normal','fine','rare','epic','legendary','mythic'];
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
  const gems = JSON.parse(state.gems??'{}');
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
