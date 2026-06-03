import { getEquipmentBonuses, type EquipmentState } from "@shared/game-data";
import type { GameState } from "@shared/schema";
import { parseEquipment } from "@shared/game-state-parse";

export const MAX_LEVEL = 99;

// Melvor-style exponential curve: XP doubles ~every 7 levels, 92=halfway to 99
export function calculateLevel(xp: number): number {
  if (xp <= 0) return 1;
  return Math.min(MAX_LEVEL, Math.floor(Math.pow(xp, 0.36)) + 1);
}

export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.ceil(Math.pow(level - 1, 1 / 0.36)); // ≈ (L-1)^2.78
}

export function levelProgress(xp: number): number {
  const lv = calculateLevel(xp);
  const cur = xpForLevel(lv);
  const nxt = xpForLevel(lv + 1);
  const range = nxt - cur;
  return range === 0 ? 100 : Math.min(100, Math.max(0, ((xp - cur) / range) * 100));
}

export function getPlayerMaxHp(state: GameState): number {
  const equipment = parseEquipment(state.equipment);
  const { hpBonus } = getEquipmentBonuses(equipment);
  return 10 + (calculateLevel(state.hitpointsXp) - 1) * 5 + hpBonus;
}

export function getPlayerAttack(state: GameState): number {
  const equipment = parseEquipment(state.equipment);
  const { attackBonus, critRating } = getEquipmentBonuses(equipment);
  const base = Math.max(1, Math.floor(calculateLevel(state.attackXp) * 1.2) + attackBonus);
  return Math.floor(base * (1 + (critRating / 100) * 0.5));
}

export function getPlayerDefence(state: GameState): number {
  const equipment = parseEquipment(state.equipment);
  const { defenceBonus } = getEquipmentBonuses(equipment);
  return Math.floor(calculateLevel(state.defenceXp) * 0.8) + defenceBonus;
}

export function getCombatLevel(state: GameState): number {
  return Math.floor(
    (calculateLevel(state.attackXp) +
      calculateLevel(state.defenceXp) +
      calculateLevel(state.hitpointsXp)) /
      3,
  );
}

/** 温度对速度的影响倍率 */
export function getTemperatureMultiplier(state: GameState): number {
  const t = state.temperature ?? 0;
  if (t >= 50) return 1;
  if (t >= 30) return 0.9;
  if (t >= 10) return 0.75;
  if (t >= 1)  return 0.6;
  return 0.5; // 0 = frozen
}

/** 温度过低时的生命流失（每秒） */
export function getTemperatureHpLoss(state: GameState): number {
  const t = state.temperature ?? 0;
  if (t >= 10) return 0;
  if (t >= 1)  return 1 / 10; // 每 10 秒 -1
  return 1 / 5; // 每 5 秒 -1
}

/** 敏捷技能提供的全局加成 */
export function getAgilityBonuses(state: GameState): {
  thievingMul: number;   // 偷窃成功率倍率
  fishingMul: number;    // 钓鱼速度倍率
  luckMul: number;       // 全局掉率倍率
} {
  const lv = calculateLevel(state.agilityXp ?? 0);
  return {
    thievingMul: Math.min(2, 1 + lv * 0.01),   // 每级 +1%，上限 2x
    fishingMul:  Math.min(1.5, 1 + lv * 0.005), // 每级 +0.5%，上限 1.5x
    luckMul:     Math.min(1.3, 1 + lv * 0.003), // 每级 +0.3%，上限 1.3x
  };
}
