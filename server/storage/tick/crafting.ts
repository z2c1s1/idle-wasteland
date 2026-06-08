import { db } from "../../db";
import { gameStates, type GameState } from "@shared/schema";
import {
  SMITHING_RECIPES,
  LEATHERWORKING_RECIPES,
  JEWELCRAFTING_RECIPES,
  ALL_TOOLS,
  TOOL_RECIPES,
} from "@shared/game-data";
import { eq } from "drizzle-orm";
import { handleProductionRecipe } from "../helpers";
import { getPetBuffs } from "./_shared";

export async function tickCrafting(
  state: GameState,
  _elapsedSeconds: number,
  now: Date,
): Promise<GameState> {
  const action = state.activeAction;

  const petBuffs = getPetBuffs(state);
  const petSmithMul = 1 + petBuffs.smithSpeed;
  const petLeatherMul = 1 + petBuffs.leatherSpeed;
  const petJewelMul = 1 + petBuffs.jewelSpeed;

  if (action.startsWith("smith_")) {
    const recipeIndex = parseInt(action.split("_")[1]);
    const result = await handleProductionRecipe(state, SMITHING_RECIPES, recipeIndex, "smithingXp", now, petSmithMul);
    if (!result) return state;
    const [updated] = await db.update(gameStates).set(result.updates).where(eq(gameStates.id, state.id)).returning();
    return updated;
  }

  if (action.startsWith("leather_")) {
    const recipeIndex = parseInt(action.split("_")[1]);
    const result = await handleProductionRecipe(state, LEATHERWORKING_RECIPES, recipeIndex, "leatherworkingXp", now, petLeatherMul);
    if (!result) return state;
    const [updated] = await db.update(gameStates).set(result.updates).where(eq(gameStates.id, state.id)).returning();
    return updated;
  }

  if (action.startsWith("jewel_")) {
    const recipeIndex = parseInt(action.split("_")[1]);
    const result = await handleProductionRecipe(state, JEWELCRAFTING_RECIPES, recipeIndex, "jewelcraftingXp", now, petJewelMul);
    if (!result) return state;
    const [updated] = await db.update(gameStates).set(result.updates).where(eq(gameStates.id, state.id)).returning();
    return updated;
  }

  if (action.startsWith("tool_")) {
    const recipeIndex = parseInt(action.split("_")[1]);
    const recipe = TOOL_RECIPES[recipeIndex];
    const result = await handleProductionRecipe(state, TOOL_RECIPES, recipeIndex, "smithingXp", now);
    if (!result) return state;
    const tool = ALL_TOOLS.find((t) => t.id === recipe?.output);
    if (tool) (result.updates as Record<string, unknown>).tool = JSON.stringify(tool);
    const [updated] = await db.update(gameStates).set(result.updates).where(eq(gameStates.id, state.id)).returning();
    return updated;
  }

  return state;
}
