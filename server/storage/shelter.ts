import { db } from "../db";
import { gameStates, type GameState } from "@shared/schema";
import { SHELTER_BUILDINGS } from "@shared/game-data";
import { eq } from "drizzle-orm";
import { getResourceCount, buildResourceUpdates } from "@shared/resources";
import { msg } from "@shared/messages";

// ─── Homestead building ───────────────────────────────────────────────────────

export async function buildShelter(state: GameState, buildingId: string): Promise<GameState> {
  const bld = SHELTER_BUILDINGS.find(b => b.id === buildingId);
  if (!bld) throw new Error(msg("buildingNotFound"));
  const homestead: Record<string, number> = JSON.parse(state.homestead ?? '{}');
  if ((homestead[buildingId] ?? 0) >= bld.maxLevel) throw new Error(msg("buildingMaxLevel"));
  const costWood = bld.costWood; const costStone = bld.costStone; const costGold = bld.costGold;
  if ((state.wood ?? 0) < costWood) throw new Error(msg("notEnoughWood"));
  if ((state.stone ?? 0) < costStone) throw new Error(msg("notEnoughStone"));
  if (state.gold < costGold) throw new Error(msg("notEnoughGold"));
  homestead[buildingId] = (homestead[buildingId] ?? 0) + 1;
  const [u] = await db.update(gameStates).set({
    homestead: JSON.stringify(homestead),
    wood: (state.wood ?? 0) - costWood,
    stone: (state.stone ?? 0) - costStone,
    gold: state.gold - costGold,
  } as Partial<GameState>)
    .where(eq(gameStates.id, state.id)).returning();
  return u;
}

// ─── Farm passive gold ────────────────────────────────────────────────────────

export function getFarmGoldIncome(state: GameState, elapsedSec: number): number {
  const homestead: Record<string, number> = JSON.parse(state.homestead ?? '{}');
  const farmLevel = homestead['farm'] ?? 0;
  const greenhouse = homestead['wonder_greenhouse'] ?? 0;
  if (farmLevel <= 0) return 0;
  const baseGoldPerMin = farmLevel * 3;
  const greenhouseMul = 1 + greenhouse * 0.4;
  return Math.floor(baseGoldPerMin * (elapsedSec / 60) * greenhouseMul);
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
  const baseDecay = fuelEndsAt && now > fuelEndsAt ? 2 : 1;
  const furnaceReduction = 1 - furnaceLevel * 0.15;
  const decayRate = Math.max(0.1, baseDecay * furnaceReduction);
  const newTemp = Math.max(0, temp - decayRate);

  if (newTemp === temp) return {};
  return { temperature: newTemp } as Partial<GameState>;
}
