import { db } from "../db";
import { gameStates, type GameState } from "@shared/schema";
import {
  TOWN_NPCS, GAMBLE_TIERS, ALL_SLOTS, generateDroppedItem,
  type Rarity,
} from "@shared/game-data";
import { eq } from "drizzle-orm";
import { getCombatLevel } from "@shared/game-math";
import { msg } from "@shared/messages";
import { parseEquipment, parseLootBag } from "@shared/game-state-parse";
import { calculateLevel } from "@shared/game-math";
import { getResourceCount, buildResourceUpdates } from "@shared/resources";

const calcLevel = calculateLevel;

// ─── Town level ──────────────────────────────────────────────────────────────

export function getTownLevel(state: GameState): number {
  const homestead: Record<string, number> = JSON.parse(state.homestead ?? '{}');
  return Object.values(homestead).reduce((s, v) => s + (v ?? 0), 0);
}

// ─── NPC encounter ───────────────────────────────────────────────────────────

export function trySpawnNpc(state: GameState): Partial<GameState> | null {
  if (state.npcEncounter) return null;
  const homestead: Record<string, number> = (() => { try { return JSON.parse((state as any).homestead ?? '{}'); } catch { return {}; } })();
  const townLevel = getTownLevel(state);
  if (townLevel < 3) return null;
  const dungeonStats = (() => { try { return JSON.parse(state.dungeonStats ?? '{}'); } catch { return {}; } })();
  const eligible = TOWN_NPCS.filter(n => {
    if ((n.reqTownLevel ?? 0) > townLevel) return false;
    if ((n.reqDungeon ?? 0) > 0) {
      const clears = (dungeonStats[String(n.reqDungeon)] as any)?.clears ?? 0;
      if (clears <= 0) return false;
    }
    return true;
  });
  if (eligible.length === 0) return null;
  const radioMul = 1 + (homestead.wonder_radio ?? 0) * 0.3;
  if (Math.random() > 0.08 * radioMul) return null;
  const npc = eligible[Math.floor(Math.random() * eligible.length)];
  return { npcEncounter: JSON.stringify({ id: npc.id, arrivedAt: Date.now() }) } as any;
}

export async function npcAction(state: GameState, npcId: string, actionIndex: number): Promise<GameState> {
  if (!state.npcEncounter) throw new Error(msg("noNpcVisiting"));
  const npc = TOWN_NPCS.find(n => n.id === npcId);
  if (!npc) throw new Error(msg("npcNotFound"));
  const action = npc.actions[actionIndex];
  if (!action) throw new Error(msg("invalidAction"));

  const rewards: Partial<GameState> = { npcEncounter: null } as any;
  switch (npcId) {
    case 'merchant':
      if (actionIndex === 0) {
        if (state.gold < 500) throw new Error(msg("notEnoughGold"));
        rewards.gold = state.gold - 500;
        const drop = generateDroppedItem(Math.floor(Math.random() * 5), 0);
        drop.rarity = 'rare';
        const loot = parseLootBag(state.lootBag);
        loot.push(drop);
        rewards.lootBag = JSON.stringify(loot);
      } else {
        const loot = parseLootBag(state.lootBag);
        const junk = loot.filter(i => i.rarity === 'common' || i.rarity === 'uncommon');
        rewards.lootBag = JSON.stringify(loot.filter(i => !junk.includes(i)));
        rewards.gold = state.gold + junk.length * 50;
      }
      break;
    case 'blacksmith':
      if (actionIndex === 0) {
        if (state.gold < 300) throw new Error(msg("notEnoughGold"));
        rewards.gold = state.gold - 300;
        const eq = parseEquipment(state.equipment);
        if (eq.weapon) { eq.weapon = { ...eq.weapon, ilvl: (eq.weapon.ilvl ?? 1) + 1 }; rewards.equipment = JSON.stringify(eq); }
      }
      break;
    case 'traveler':
      if (actionIndex === 0) {
        rewards.gold = state.gold + 200;
        rewards.bones = state.bones + 10;
      } else {
        rewards.woodcuttingXp = state.woodcuttingXp + 200;
        rewards.miningXp = state.miningXp + 200;
      }
      break;
    case 'sage':
      if (actionIndex === 0) {
        rewards.talents = JSON.stringify({ melee: [], ranged: [], magic: [] });
      } else {
        rewards.attackXp = state.attackXp + 500;
        rewards.defenceXp = state.defenceXp + 500;
      }
      break;
    case 'gambler': {
      const tierIdx = actionIndex === 0 ? 0 : actionIndex === 1 ? 2 : 4;
      const tier = GAMBLE_TIERS[tierIdx];
      if (!tier) break;
      const combatLevel = getCombatLevel(state);
      const cost = tier.costPerLevel * Math.max(1, combatLevel);
      if (state.gold < cost) throw new Error(msg("notEnoughGold"));
      const ilvl = Math.max(1, combatLevel + Math.floor((Math.random() - 0.5) * 2 * tier.ilvlSpread));
      const slotKey = ALL_SLOTS[Math.floor(Math.random() * ALL_SLOTS.length)];
      const totalWeight = tier.rarities.reduce((s: number, r: any) => s + r.weight, 0);
      let roll = Math.random() * totalWeight;
      let rarity: Rarity = 'common';
      for (const r of tier.rarities) { roll -= r.weight; if (roll <= 0) { rarity = r.rarity; break; } }
      const item = generateDroppedItem(Math.max(0, Math.min(7, Math.floor(ilvl/10))), 0);
      item.rarity = rarity;
      item.ilvl = ilvl;
      item.slot = slotKey;
      item.instanceId = 'gamble_'+Date.now();
      const loot = parseLootBag(state.lootBag);
      loot.push(item);
      rewards.lootBag = JSON.stringify(loot);
      rewards.gold = state.gold - cost;
      rewards.npcEncounter = null;
      break;
    }
  }

  const [u] = await db.update(gameStates).set(rewards as any)
    .where(eq(gameStates.id, state.id)).returning();
  return u;
}

export async function dismissNpc(state: GameState): Promise<GameState> {
  const [u] = await db.update(gameStates).set({ npcEncounter: null } as any)
    .where(eq(gameStates.id, state.id)).returning();
  return u;
}

// ─── Outposts ────────────────────────────────────────────────────────────────

export async function establishOutpost(state: GameState, zoneIndex: number, resourceType: string = "wood"): Promise<GameState> {
  const outposts: any[] = JSON.parse((state as any).outposts ?? '[]');
  const worldTier = (state as any).worldTier ?? 1;
  const maxSlots = Math.min(worldTier + 1, 4); // 2/3/4/4 slots per tier
  if (outposts.length >= maxSlots) throw new Error(`前哨站已满（${maxSlots}/${maxSlots}），提升世界层级解锁更多`);
  if (outposts.find((o:any) => o.zoneIndex === zoneIndex)) throw new Error(msg("outpostExists"));
  const explorationLevel = calcLevel(state.explorationXp ?? 0);
  if (zoneIndex >= explorationLevel) throw new Error(`需要探索等级 ${zoneIndex + 1}（当前 ${explorationLevel}）`);

  // Cost: scales with zone index
  const costWood = Math.floor(50 + zoneIndex * 30);
  const costStone = Math.floor(30 + zoneIndex * 20);
  const currentWood = getResourceCount(state, "wood_0");
  if (currentWood < costWood) throw new Error(`木材不足（需${costWood}）`);
  const currentStone = state.stone ?? 0;
  if (currentStone < costStone) throw new Error(`石料不足（需${costStone}）`);

  const zoneNames = ["枯树林","废弃加油站","废墟小镇","辐射沼泽","破碎公路","废弃农场","地下掩体","酸雨平原","沙暴废土","雪地废墟","火山灰地带","淹没城区","高架桥废墟","裂谷深渊","变异丛林","巨兽骸骨场","精灵废墟","矮人矿场","吸血鬼巢穴","狼人森林","搁浅货轮","海盗码头","天文台废墟","迷宫地铁","梦境实验室","陨石坑","虚空边界","混沌荒原","避难所遗迹","终末之门"];
  const resourceTypes = ['wood','ore','herb','berry','fish','hide','gold','bone'];
  const resource = resourceTypes[zoneIndex % resourceTypes.length];
  outposts.push({ zoneIndex, zoneName: zoneNames[zoneIndex]??`区域${zoneIndex+1}`, resource, establishedAt: Date.now(), resourceType, level:1 });
  const resourcePatch = buildResourceUpdates(state, { wood_0: currentWood - costWood });
  const [u] = await db.update(gameStates).set({
    outposts: JSON.stringify(outposts),
    ...resourcePatch,
    stone: currentStone - costStone,
  } as any).where(eq(gameStates.id, state.id)).returning();
  return u;
}

export async function demolishOutpost(state: GameState, zoneIndex: number): Promise<GameState> {
  const outposts: any[] = JSON.parse((state as any).outposts ?? '[]');
  const idx = outposts.findIndex((o:any) => o.zoneIndex === zoneIndex);
  if (idx < 0) throw new Error("该区域没有前哨站");
  outposts.splice(idx, 1);
  const [u] = await db.update(gameStates).set({ outposts: JSON.stringify(outposts) } as any).where(eq(gameStates.id, state.id)).returning();
  return u;
}

export async function collectOutposts(state: GameState): Promise<GameState> {
  const outposts: any[] = JSON.parse((state as any).outposts ?? '[]');
  if (outposts.length === 0) throw new Error(msg("noOutposts"));
  const now = Date.now();
  let totalGold = 0;
  const resourceGains: Record<string, number> = {};
  for (const o of outposts) {
    const elapsedMin = (now - (o.establishedAt ?? now)) / 60000;
    const yieldAmount = Math.floor(elapsedMin * o.level * 2);
    if (o.resource === 'gold') totalGold += yieldAmount;
    else resourceGains[o.resource] = (resourceGains[o.resource]??0) + yieldAmount;
    o.establishedAt = now;
  }
  const updates: any = { outposts: JSON.stringify(outposts), gold: state.gold + totalGold };
  // Use resourceStore abstraction — individual columns are deprecated
  const resourceCounts: Record<string, number> = {};
  if (resourceGains.wood) resourceCounts['wood_0'] = getResourceCount(state, 'wood_0') + resourceGains.wood;
  if (resourceGains.ore)  resourceCounts['ore_0']  = getResourceCount(state, 'ore_0')  + resourceGains.ore;
  if (Object.keys(resourceCounts).length > 0) {
    Object.assign(updates, buildResourceUpdates(state, resourceCounts));
  }
  if (resourceGains.herb) { const h = JSON.parse(state.herbs??'{}'); h['dandelion']=(h['dandelion']??0)+(resourceGains.herb??0); updates.herbs = JSON.stringify(h); }
  if (resourceGains.berry){ const b = JSON.parse(state.berries??'{}'); b['blueberry']=(b['blueberry']??0)+(resourceGains.berry??0); updates.berries = JSON.stringify(b); }
  if (resourceGains.bone) updates.bones = (state.bones??0) + resourceGains.bone;
  const [u] = await db.update(gameStates).set(updates as any).where(eq(gameStates.id, state.id)).returning();
  return u;
}
