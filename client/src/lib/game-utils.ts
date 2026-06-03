import { getEquipmentBonuses } from "@shared/game-data";
import type { GameState } from "@shared/schema";
import {
  MAX_LEVEL,
  calculateLevel,
  xpForLevel,
  levelProgress,
  getPlayerMaxHp,
  getPlayerAttack,
  getPlayerDefence,
  getCombatLevel,
  getAgilityBonuses,
  getTemperatureMultiplier,
} from "@shared/game-math";
import {
  parseEquipment,
  parseCraftItems,
  parseLootBag,
  parseGems,
  parseDungeonStats,
  type DungeonStat,
  type DungeonStats,
} from "@shared/game-state-parse";
import { getResourceCount } from "@shared/resources";

export {
  MAX_LEVEL,
  calculateLevel,
  xpForLevel,
  levelProgress,
  getPlayerMaxHp,
  getPlayerAttack,
  getPlayerDefence,
  getCombatLevel,
  getAgilityBonuses,
  getTemperatureMultiplier,
  parseEquipment,
  parseCraftItems,
  parseLootBag,
  parseGems,
  parseDungeonStats,
  type DungeonStat,
  type DungeonStats,
  getResourceCount,
};

export const formatNumber = (n: number): string =>
  new Intl.NumberFormat("en-US").format(Math.floor(n));

export function getTotalTalentPoints(state: GameState): number {
  // 每个技能达到 9/18/27/... 级时各获得 1 天赋点
  const skills = [
    state.attackXp,
    state.defenceXp,
    state.hitpointsXp,
    state.rangedXp ?? 0,
    state.magicXp ?? 0,
    state.woodcuttingXp,
    state.miningXp,
    state.smeltingXp,
    state.fishingXp,
    state.huntingXp,
    state.thievingXp,
    state.agilityXp ?? 0,
  ];
  return skills.reduce((sum, xp) => sum + Math.floor(calculateLevel(xp) / 9), 0);
}

export function getEquipmentStats(state: GameState) {
  return getEquipmentBonuses(parseEquipment(state.equipment));
}
