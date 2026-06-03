import type { CraftingRecipe } from "@shared/game-data";
import type { GameState } from "@shared/schema";
import { parseCraftItems } from "@shared/game-state-parse";
import { getResourceCount, buildResourceUpdates } from "@shared/resources";

export function mergeGems(
  a: Record<string, number>,
  b: Record<string, number>,
): Record<string, number> {
  const out = { ...a };
  for (const [k, v] of Object.entries(b)) out[k] = (out[k] ?? 0) + v;
  return out;
}

export function rollGemDropsFromPool(
  completions: number,
  chance: number,
  pool: string[],
): Record<string, number> {
  const expected = completions * chance;
  const total = Math.floor(expected) + (Math.random() < expected % 1 ? 1 : 0);
  const gems: Record<string, number> = {};
  for (let i = 0; i < total; i++) {
    const key = pool[Math.floor(Math.random() * pool.length)];
    gems[key] = (gems[key] ?? 0) + 1;
  }
  return gems;
}

export async function handleProductionRecipe(
  state: GameState,
  recipes: CraftingRecipe[],
  recipeIndex: number,
  xpKey: keyof GameState,
  now: Date,
): Promise<{ updates: Partial<GameState> } | null> {
  const recipe = recipes[recipeIndex];
  if (!recipe) return null;

  const elapsedSeconds =
    (now.getTime() - new Date(state.actionUpdatedAt).getTime()) / 1000;
  const ticks = Math.floor(elapsedSeconds / recipe.time);
  if (ticks <= 0) return null;

  const craftItems = parseCraftItems(state.craftItems);
  const tempRes: Record<string, number> = {};
  for (const inp of recipe.inputs) {
    tempRes[inp.resource] = getResourceCount(state, inp.resource);
  }

  let actualTicks = 0;
  for (let i = 0; i < ticks; i++) {
    if (!recipe.inputs.every((inp) => (tempRes[inp.resource] ?? 0) >= inp.qty)) break;
    for (const inp of recipe.inputs) tempRes[inp.resource] -= inp.qty;
    craftItems[recipe.output] = (craftItems[recipe.output] ?? 0) + 1;
    actualTicks++;
  }

  const resourcePatch = buildResourceUpdates(state, tempRes);
  const updates: Partial<GameState> = {
    [xpKey]: (state[xpKey] as number) + actualTicks * recipe.xp,
    craftItems: JSON.stringify(craftItems),
    actionUpdatedAt: new Date(
      new Date(state.actionUpdatedAt).getTime() + actualTicks * recipe.time * 1000,
    ),
    ...resourcePatch,
  };
  const depleted = recipe.inputs.some((inp) => (tempRes[inp.resource] ?? 0) < inp.qty);
  if (actualTicks === 0 || actualTicks < ticks || depleted) updates.activeAction = "idle";

  return { updates };
}
