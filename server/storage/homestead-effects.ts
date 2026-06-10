// ─── Homestead building effects ──────────────────────────────────────────
import type { GameState } from "@shared/schema";

export interface HomesteadLevels {
  shelter: number; farm: number; lumbermill: number; mine: number;
  workshop: number; wall: number; warehouse: number; clinic: number;
  altar: number; tower: number; furnace: number;
  recycling: number; radlab: number;
  wonder_corpse: number; wonder_beacon: number; wonder_radio: number;
  wonder_greenhouse: number; wonder_furnace: number;
}

const DEFAULT: HomesteadLevels = {
  shelter: 0, farm: 0, lumbermill: 0, mine: 0,
  workshop: 0, wall: 0, warehouse: 0, clinic: 0,
  altar: 0, tower: 0, furnace: 0,
  recycling: 0, radlab: 0,
  wonder_corpse: 0, wonder_beacon: 0, wonder_radio: 0,
  wonder_greenhouse: 0, wonder_furnace: 0,
};

export function getHomesteadLevels(state: GameState): HomesteadLevels {
  try {
    const raw: Record<string, number> = JSON.parse((state as any).homestead ?? '{}');
    return { ...DEFAULT, ...raw };
  } catch {
    return { ...DEFAULT };
  }
}
