import type { EquipmentState, GameItem } from "@shared/game-data";

export function parseEquipment(raw: string): EquipmentState {
  try {
    return JSON.parse(raw) as EquipmentState;
  } catch {
    return {};
  }
}

export function parseCraftItems(raw: string): Record<string, number> {
  try {
    return JSON.parse(raw) as Record<string, number>;
  } catch {
    return {};
  }
}

export function parseLootBag(raw: string): GameItem[] {
  try {
    return JSON.parse(raw) as GameItem[];
  } catch {
    return [];
  }
}

export function parseGems(raw: string): Record<string, number> {
  try {
    return JSON.parse(raw) as Record<string, number>;
  } catch {
    return {};
  }
}

export interface DungeonStat {
  clears: number;
  fastestSec: number | null;
}

export type DungeonStats = Record<string, DungeonStat>;

export function parseDungeonStats(raw: string): DungeonStats {
  try {
    return JSON.parse(raw) as DungeonStats;
  } catch {
    return {};
  }
}
