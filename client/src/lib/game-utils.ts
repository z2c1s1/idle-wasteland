import { EQUIPMENT_ITEMS, getEquipmentBonuses, type EquipmentState } from "@shared/game-data";
import type { GameState } from "@shared/schema";

export const calculateLevel = (xp: number): number => {
  if (xp < 0) return 1;
  return Math.floor(Math.sqrt(xp)) + 1;
};

export const xpForLevel = (level: number): number => Math.pow(level - 1, 2);

export const levelProgress = (xp: number): number => {
  const currentLevel = calculateLevel(xp);
  const currentLevelXp = xpForLevel(currentLevel);
  const nextLevelXp = xpForLevel(currentLevel + 1);
  const xpRequiredForNext = nextLevelXp - currentLevelXp;
  if (xpRequiredForNext === 0) return 100;
  return Math.min(100, Math.max(0, ((xp - currentLevelXp) / xpRequiredForNext) * 100));
};

export const formatNumber = (num: number): string =>
  new Intl.NumberFormat('en-US').format(Math.floor(num));

export function parseEquipment(raw: string): EquipmentState {
  try { return JSON.parse(raw) as EquipmentState; } catch { return {}; }
}

export function parseCraftItems(raw: string): Record<string, number> {
  try { return JSON.parse(raw) as Record<string, number>; } catch { return {}; }
}

export function getPlayerMaxHp(state: GameState): number {
  return 10 + (calculateLevel(state.hitpointsXp) - 1) * 5;
}

export function getPlayerAttack(state: GameState): number {
  const equipment = parseEquipment(state.equipment);
  const { attackBonus } = getEquipmentBonuses(equipment);
  return Math.max(1, Math.floor(calculateLevel(state.attackXp) * 1.2) + attackBonus);
}

export function getPlayerDefence(state: GameState): number {
  const equipment = parseEquipment(state.equipment);
  const { defenceBonus } = getEquipmentBonuses(equipment);
  return Math.floor(calculateLevel(state.defenceXp) * 0.8) + defenceBonus;
}

export function getCombatLevel(state: GameState): number {
  const atk = calculateLevel(state.attackXp);
  const def = calculateLevel(state.defenceXp);
  const hp  = calculateLevel(state.hitpointsXp);
  return Math.floor((atk + def + hp) / 3);
}

export function getEquippedItem(state: GameState, slot: string): typeof EQUIPMENT_ITEMS[string] | null {
  const eq = parseEquipment(state.equipment);
  const itemId = (eq as Record<string, string | null>)[slot];
  return itemId ? (EQUIPMENT_ITEMS[itemId] ?? null) : null;
}
