import { getEquipmentBonuses, type EquipmentState, type GameItem } from "@shared/game-data";
import type { GameState } from "@shared/schema";

export const calculateLevel = (xp: number): number => Math.floor(Math.sqrt(Math.max(0, xp))) + 1;
export const xpForLevel = (level: number): number => Math.pow(level - 1, 2);
export const levelProgress = (xp: number): number => {
  const lv = calculateLevel(xp);
  const cur = xpForLevel(lv);
  const nxt = xpForLevel(lv + 1);
  const range = nxt - cur;
  return range === 0 ? 100 : Math.min(100, Math.max(0, ((xp - cur) / range) * 100));
};
export const formatNumber = (n: number): string =>
  new Intl.NumberFormat('en-US').format(Math.floor(n));

export function parseEquipment(raw: string): EquipmentState {
  try { return JSON.parse(raw) as EquipmentState; } catch { return {}; }
}
export function parseCraftItems(raw: string): Record<string, number> {
  try { return JSON.parse(raw) as Record<string, number>; } catch { return {}; }
}
export function parseLootBag(raw: string): GameItem[] {
  try { return JSON.parse(raw) as GameItem[]; } catch { return []; }
}
export function parseGems(raw: string): Record<string, number> {
  try { return JSON.parse(raw) as Record<string, number>; } catch { return {}; }
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
  return Math.floor((calculateLevel(state.attackXp) + calculateLevel(state.defenceXp) + calculateLevel(state.hitpointsXp)) / 3);
}

export function getEquipmentStats(state: GameState) {
  const equipment = parseEquipment(state.equipment);
  return getEquipmentBonuses(equipment);
}
