import { db } from "../db";
import { gameStates, type GameState } from "@shared/schema";
import { HOMESTEAD_BUILDINGS } from "@shared/game-data";
import { eq } from "drizzle-orm";
import { getResourceCount, buildResourceUpdates } from "@shared/resources";
import { msg } from "@shared/messages";

// ─── Wood helpers (sums all tiers) ────────────────────────────────────────────

function totalWood(state: GameState): number {
  let sum = 0;
  for (let i = 0; i <= 9; i++) sum += getResourceCount(state, `wood_${i}`);
  return sum;
}

function consumeAnyWood(state: GameState, amount: number): Record<string, number> {
  const result: Record<string, number> = {};
  let remaining = amount;
  for (let i = 0; i <= 9 && remaining > 0; i++) {
    const have = getResourceCount(state, `wood_${i}`);
    const take = Math.min(have, remaining);
    result[`wood_${i}`] = have - take;
    remaining -= take;
  }
  return result;
}

// ─── Homestead building ───────────────────────────────────────────────────────

export async function buildHomestead(state: GameState, buildingId: string): Promise<GameState> {
  const bld = HOMESTEAD_BUILDINGS.find(b => b.id === buildingId);
  if (!bld) throw new Error(msg("buildingNotFound"));
  const homestead: Record<string, number> = JSON.parse(state.homestead ?? '{}');
  if ((homestead[buildingId] ?? 0) >= bld.maxLevel) throw new Error(msg("buildingMaxLevel"));
  const costWood = bld.costWood; const costStone = bld.costStone; const costGold = bld.costGold;
  if (totalWood(state) < costWood) throw new Error(msg("notEnoughWood"));
  if ((state.stone ?? 0) < costStone) throw new Error(msg("notEnoughStone"));
  if (state.gold < costGold) throw new Error(msg("notEnoughGold"));
  homestead[buildingId] = (homestead[buildingId] ?? 0) + 1;
  const woodPatch = consumeAnyWood(state, costWood);
  const resourcePatch = buildResourceUpdates(state, woodPatch);
  const [u] = await db.update(gameStates).set({
    homestead: JSON.stringify(homestead),
    ...resourcePatch,
    stone: (state.stone ?? 0) - costStone,
    gold: state.gold - costGold,
  } as Partial<GameState>)
    .where(eq(gameStates.id, state.id)).returning();
  return u;
}

// ─── Fuel / Temperature ───────────────────────────────────────────────────────

export async function addFuel(state: GameState, woodTier: number): Promise<GameState> {
  const homestead: Record<string, number> = JSON.parse(state.homestead ?? '{}');
  const furnaceLevel = homestead['furnace'] ?? 0;
  if (furnaceLevel <= 0) throw new Error(msg("needFurnace"));

  const woodKey = `wood_${woodTier}`;
  const woodCount = getResourceCount(state, woodKey);
  if (woodCount < 1) throw new Error(msg("notEnoughWood"));

  const tempGain = (woodTier + 1) * 5;
  const burnSec = (woodTier + 1) * 60;
  const newTemp = Math.min(100, (state.temperature ?? 0) + tempGain);
  const fuelEndsAt = new Date(Date.now() + burnSec * 1000);

  const resourcePatch = buildResourceUpdates(state, { [woodKey]: woodCount - 1 });
  const [u] = await db.update(gameStates).set({
    temperature: newTemp,
    fuelEndsAt,
    ...resourcePatch,
  } as any).where(eq(gameStates.id, state.id)).returning();
  return u;
}

export function applyTemperatureDecay(state: GameState, now: Date): Partial<GameState> {
  const homestead: Record<string, number> = JSON.parse(state.homestead ?? '{}');
  const furnaceLevel = homestead['furnace'] ?? 0;
  if (furnaceLevel <= 0) return {};

  const temp = state.temperature ?? 0;
  if (temp <= 0) return {};

  const fuelEndsAt = state.fuelEndsAt ? new Date(state.fuelEndsAt) : null;
  const decayRate = fuelEndsAt && now > fuelEndsAt ? 2 : 1;
  const newTemp = Math.max(0, temp - decayRate);

  if (newTemp === temp) return {};
  return { temperature: newTemp } as Partial<GameState>;
}
