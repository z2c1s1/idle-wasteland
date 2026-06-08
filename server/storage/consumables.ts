import { db } from "../db";
import { gameStates, type GameState } from "@shared/schema";
import {
  COOKING_RECIPES, POTION_RECIPES,
} from "@shared/game-data";
import { eq } from "drizzle-orm";
import { getPlayerMaxHp } from "@shared/game-math";
import { msg } from "@shared/messages";

// ─── Cooking (instant HP recovery) ────────────────────────────────────────────

export async function cookFood(state: GameState, recipeId: string): Promise<GameState> {
  const recipe = COOKING_RECIPES.find(r => r.id === recipeId);
  if (!recipe) throw new Error(msg("recipeNotFound"));
  // Check materials (hides, fish, etc.)
  for (const inp of recipe.inputs) {
    const have = (state as any)[inp.resource] ?? 0;
    if (have < inp.qty) throw new Error(msg("notEnoughMaterials"));
  }
  // Consume materials
  const materialUpdates: any = {};
  for (const inp of recipe.inputs) {
    materialUpdates[inp.resource] = ((state as any)[inp.resource] ?? 0) - inp.qty;
  }
  // Add food to inventory
  const foods = JSON.parse(state.foods ?? '{}');
  foods[recipeId] = (foods[recipeId] ?? 0) + 1;
  const [u] = await db.update(gameStates).set({
    foods: JSON.stringify(foods),
    ...materialUpdates,
  } as any).where(eq(gameStates.id, state.id)).returning();
  return u;
}

// ─── Brewing ──────────────────────────────────────────────────────────────────

export async function brewPotion(state: GameState, recipeId: string): Promise<GameState> {
  const recipe = POTION_RECIPES.find(r => r.id === recipeId);
  if (!recipe) throw new Error(msg("potionRecipeNotFound"));
  const herbs = JSON.parse(state.herbs ?? '{}');
  const berries = JSON.parse(state.berries ?? '{}');
  const resourceUpdates: any = {};
  for (const inp of recipe.inputs) {
    const total = (herbs[inp.resource] ?? 0) + (berries[inp.resource] ?? 0) + ((state as any)[inp.resource] ?? 0);
    if (total < inp.qty) throw new Error(msg("notEnoughHerbs"));
  }
  // Consume from herbs first, then berries, then resources
  for (const inp of recipe.inputs) {
    let remaining = inp.qty;
    const h = herbs[inp.resource] ?? 0;
    const take = Math.min(h, remaining);
    herbs[inp.resource] = (herbs[inp.resource] ?? 0) - take;
    remaining -= take;
    if (remaining > 0) {
      const b = berries[inp.resource] ?? 0;
      const takeB = Math.min(b, remaining);
      berries[inp.resource] = (berries[inp.resource] ?? 0) - takeB;
      remaining -= takeB;
    }
    if (remaining > 0) {
      resourceUpdates[inp.resource] = ((state as any)[inp.resource] ?? 0) - remaining;
    }
  }
  const potions = JSON.parse(state.potions ?? '{}');
  potions[recipeId] = (potions[recipeId] ?? 0) + 1;
  const buffMap: Record<string, { effect: string; value: number }> = {
    berry_juice: { effect:'xp', value:0.1 }, strength_potion: { effect:'atk', value:0.25 },
    iron_potion: { effect:'def', value:0.25 }, speed_potion: { effect:'speed', value:0.2 },
    luck_potion: { effect:'drop', value:0.15 }, crit_potion: { effect:'crit', value:0.15 },
    leech_potion: { effect:'leech', value:0.1 }, combat_stim: { effect:'combatXp', value:0.3 },
    woodcutter_brew: { effect:'woodSpeed', value:0.15 }, miner_brew: { effect:'mineSpeed', value:0.15 },
    hunter_brew: { effect:'huntSpeed', value:0.15 }, dragon_elixir: { effect:'all', value:0.1 },
    feast_of_the_deep: { effect:'all', value:0.2 }, magic_brew: { effect:'magicDmg', value:0.25 },
    ancient_elixir: { effect:'xp', value:0.3 }, mercury_elixir: { effect:'fishSpeed', value:0.3 },
  };
  const buff = buffMap[recipeId];
  if (buff) {
    const activeBuffs: any[] = JSON.parse(state.activeBuffs ?? '[]');
    activeBuffs.push({ id: recipeId, effect: buff.effect, value: buff.value, expiresAt: Date.now() + recipe.durationMin * 60000 });
    await db.update(gameStates).set({ activeBuffs: JSON.stringify(activeBuffs) } as any).where(eq(gameStates.id, state.id));
  }
  const [u] = await db.update(gameStates).set({ potions: JSON.stringify(potions), herbs: JSON.stringify(herbs), berries: JSON.stringify(berries), ...resourceUpdates } as any).where(eq(gameStates.id, state.id)).returning();
  return u;
}

// ─── Farming ──────────────────────────────────────────────────────────────────

export async function farmPlant(state: GameState, slotS: number, seed: string): Promise<GameState> {
  const homestead: Record<string, number> = JSON.parse(state.homestead ?? '{}');
  const farmLevel = homestead['farm'] ?? 0;
  if (farmLevel <= 0) throw new Error(msg("needFarm"));
  if (slotS >= farmLevel * 2) throw new Error(msg("farmSlotLocked"));
  const farms: Record<string, any> = JSON.parse((state as any).farms ?? '{}');
  if (farms[String(slotS)]) throw new Error(msg("farmSlotOccupied"));
  const berryCount = JSON.parse(state.berries ?? '{}')[seed] ?? 0;
  if (berryCount < 1) throw new Error(msg("notEnoughSeeds"));
  const berries = JSON.parse(state.berries ?? '{}');
  berries[seed] = Math.max(0, berryCount - 1);
  farms[String(slotS)] = { seed, plantedAt: Date.now(), growTime: 300 };
  const [u] = await db.update(gameStates).set({
    berries: JSON.stringify(berries),
    farms: JSON.stringify(farms),
  } as any).where(eq(gameStates.id, state.id)).returning();
  return u;
}

export async function farmHarvest(state: GameState, slot: number): Promise<GameState> {
  const farms: Record<string, any> = JSON.parse((state as any).farms ?? '{}');
  const plot = farms[String(slot)];
  if (!plot) throw new Error(msg("farmSlotEmpty"));
  const elapsed = (Date.now() - plot.plantedAt) / 1000;
  if (elapsed < plot.growTime) throw new Error(msg("farmNotReady", Math.ceil((plot.growTime - elapsed) / 60)));
  const berries = JSON.parse(state.berries ?? '{}');
  berries[plot.seed] = (berries[plot.seed] ?? 0) + 2;
  delete farms[String(slot)];
  const [u] = await db.update(gameStates).set({
    berries: JSON.stringify(berries),
    farms: JSON.stringify(farms),
  } as any).where(eq(gameStates.id, state.id)).returning();
  return u;
}
