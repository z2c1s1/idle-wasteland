import type { GameState } from "@shared/schema";
import { getToolBonus } from "@shared/game-data";
import { getAgilityBonuses, getTemperatureMultiplier } from "@/lib/game-utils";

/** Base cycle times per skill tier — mirrors server/storage/constants.ts */
const SKILL_TIMES: Record<string, number[]> = {
  woodcutting: [3, 4, 5, 6, 8, 10, 12, 14, 16, 18],
  mining:      [3, 4, 5, 6, 8, 10, 12, 14, 16, 18],
  smelting:    [4, 5, 6, 7, 9, 11, 13, 15, 17, 19],
  fishing:     [3, 4, 5, 6, 7, 9, 11, 13, 15, 17],
  hunting:     [3, 4, 5, 6, 8, 10, 12, 14, 16, 18],
  agility:     [3, 4, 5, 6, 8, 10, 12, 14, 16, 18],
  exploration: [5, 6, 8, 10, 12, 15, 20],
};

export function getActionBaseTime(action: string): number | null {
  if (action.startsWith("thieve_")) return 3;
  const [skill, idxStr] = action.split("_");
  const idx = parseInt(idxStr ?? "");
  const times = skill ? SKILL_TIMES[skill] : undefined;
  if (!times || isNaN(idx)) return null;
  return times[idx] ?? null;
}

export function getEffectiveCycleTime(action: string, state: GameState): number | null {
  const base = getActionBaseTime(action);
  if (base == null) return null;
  const toolBonus = getToolBonus(state.tool ?? "{}");
  const agility = getAgilityBonuses(state);
  const tempMul = getTemperatureMultiplier(state);
  const skill = action.split("_")[0];
  const agilityMul = skill === "fishing" ? agility.fishingMul : 1;
  return base * toolBonus.timeMult / agilityMul / Math.max(0.1, tempMul);
}

export function getActionProgress(action: string, state: GameState, nowMs = Date.now()): {
  cycleTime: number;
  progress: number;
  timeLeft: number;
} | null {
  const cycleTime = getEffectiveCycleTime(action, state);
  if (cycleTime == null) return null;
  const startMs = new Date(state.actionUpdatedAt as unknown as string).getTime();
  const elapsed = (nowMs - startMs) / 1000;
  const cycleElapsed = elapsed % cycleTime;
  return {
    cycleTime,
    progress: (cycleElapsed / cycleTime) * 100,
    timeLeft: Math.max(0, cycleTime - cycleElapsed),
  };
}
