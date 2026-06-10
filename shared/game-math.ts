import { getEquipmentBonuses, type EquipmentState } from "@shared/game-data";
import type { GameState } from "@shared/schema";
import { parseEquipment } from "@shared/game-state-parse";

export const MAX_LEVEL = 99;

// Melvor-inspired curve: Lv30 ≈ 15min, Lv99 ≈ 200k XP
export function calculateLevel(xp: number): number {
  if (xp <= 0) return 1;
  return Math.min(MAX_LEVEL, Math.floor(Math.pow(xp, 0.375)) + 1);
}

export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.ceil(Math.pow(level - 1, 1 / 0.375)); // ≈ (L-1)^2.67
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
  const homestead: Record<string, number> = (() => { try { return JSON.parse((state as any).homestead ?? '{}'); } catch { return {}; } })();
  return 10 + (calculateLevel(state.hitpointsXp) - 1) * 5 + hpBonus + (homestead.shelter ?? 0) * 10;
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
  const homestead: Record<string, number> = (() => { try { return JSON.parse((state as any).homestead ?? '{}'); } catch { return {}; } })();
  return Math.floor(calculateLevel(state.defenceXp) * 0.8) + defenceBonus + (homestead.wall ?? 0) * 3;
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

/** Base attack interval in seconds */
export const BASE_COMBAT_SPEED = 3;

/** Shared combat speed formula — used by both client and server */
export function computeEffectiveCombatSpeed(attackSpeed: number, tempMul: number): number {
  return Math.max(1.5, BASE_COMBAT_SPEED * (1 - attackSpeed / 200)) / Math.max(0.1, tempMul);
}
