import type { GameState } from "@shared/schema";

export type ResourceStore = Record<string, Record<number, number>>;

export function parseResourceStore(raw: string | null | undefined): ResourceStore {
  try {
    return JSON.parse(raw ?? "{}") as ResourceStore;
  } catch {
    return {};
  }
}

/** e.g. wood_0 → { prefix: "wood", tier: 0 } */
export function parseResourceKey(key: string): { prefix: string; tier: number } | null {
  const match = key.match(/^([a-z]+)_(\d+)$/);
  if (!match) return null;
  return { prefix: match[1], tier: parseInt(match[2], 10) };
}

/** Unified count: reads from resourceStore JSON (single source of truth). */
export function getResourceCount(state: GameState, resourceKey: string): number {
  if (resourceKey === "bones") return state.bones ?? 0;
  if (resourceKey === "dragonBones") return state.dragonBones ?? 0;

  const parsed = parseResourceKey(resourceKey);
  if (parsed) {
    const store = parseResourceStore(state.resourceStore);
    return store[parsed.prefix]?.[parsed.tier] ?? 0;
  }

  return ((state as Record<string, unknown>)[resourceKey] as number) ?? 0;
}

/** Apply absolute counts for resource keys; writes only to resourceStore JSON. */
export function buildResourceUpdates(
  state: GameState,
  counts: Record<string, number>,
): Partial<GameState> {
  const store = parseResourceStore(state.resourceStore);
  const updates: Partial<GameState> = {};

  for (const [key, amount] of Object.entries(counts)) {
    const parsed = parseResourceKey(key);
    if (parsed) {
      if (!store[parsed.prefix]) store[parsed.prefix] = {};
      store[parsed.prefix][parsed.tier] = amount;
    } else if (key === "bones") {
      updates.bones = amount;
    } else if (key === "dragonBones") {
      updates.dragonBones = amount;
    }
  }

  updates.resourceStore = JSON.stringify(store);
  return updates;
}

export function addToResourceStore(
  store: ResourceStore,
  prefix: string,
  tier: number,
  amount: number,
): void {
  if (!store[prefix]) store[prefix] = {};
  store[prefix][tier] = (store[prefix][tier] ?? 0) + amount;
}
