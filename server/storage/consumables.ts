import { db } from "../db";
import { gameStates, type GameState } from "@shared/schema";
import {
  COOKING_RECIPES, POTION_RECIPES,
} from "@shared/game-data";
import { eq } from "drizzle-orm";
import { getPlayerMaxHp } from "@shared/game-math";
import { msg } from "@shared/messages";

// ─── Cooking ──────────────────────────────────────────────────────────────────

export async function cookFood(state: GameState, recipeId: string): Promise<GameState> {
  const recipe = COOKING_RECIPES.find(r => r.id === recipeId);
  if (!recipe) throw new Error(msg("recipeNotFound"));
  for (const inp of recipe.inputs) {
    const have = inp.resource.includes('berry') ? JSON.parse(state.berries ?? '{}')[inp.resource] ?? 0 :
      JSON.parse(state.herbs ?? '{}')[inp.resource] ?? (state as any)[inp.resource] ?? 0;
    if (have < inp.qty) throw new Error(msg("notEnoughMaterials"));
  }
  const berries = JSON.parse(state.berries ?? '{}');
  const herbs = JSON.parse(state.herbs ?? '{}');
  const hideUpdates: any = {};
  for (const inp of recipe.inputs) {
    if (inp.resource.includes('berry')) berries[inp.resource] -= inp.qty;
    else if (inp.resource.includes('herb') || inp.resource in herbs) herbs[inp.resource] = (herbs[inp.resource] ?? 0) - inp.qty;
    else hideUpdates[inp.resource] = ((state as any)[inp.resource] ?? 0) - inp.qty;
  }
  const foods = JSON.parse(state.foods ?? '{}');
  foods[recipeId] = (foods[recipeId] ?? 0) + 1;
  const buffMap: Record<string, { effect: string; value: number }> = {
    roasted_meat: { effect:'hp', value:0.2 }, berry_juice: { effect:'xp', value:0.1 },
    herb_stew: { effect:'atk', value:0.15 }, ginseng_soup: { effect:'xp', value:0.3 },
    honey_roast: { effect:'def', value:0.2 }, elf_bread: { effect:'speed', value:0.15 },
    miner_pie: { effect:'speed', value:0.15 }, fisherman_stew: { effect:'speed', value:0.15 },
    hunter_pie: { effect:'speed', value:0.15 }, dragon_feast: { effect:'all', value:0.1 },
  };
  const buff = buffMap[recipeId];
  if (buff) {
    const activeBuffs: any[] = JSON.parse(state.activeBuffs ?? '[]');
    activeBuffs.push({ id: recipeId, effect: buff.effect, value: buff.value, expiresAt: Date.now() + recipe.durationMin * 60000 });
    await db.update(gameStates).set({ activeBuffs: JSON.stringify(activeBuffs) } as any).where(eq(gameStates.id, state.id));
  }
  const [u] = await db.update(gameStates).set({ foods: JSON.stringify(foods), berries: JSON.stringify(berries), herbs: JSON.stringify(herbs), ...hideUpdates } as any).where(eq(gameStates.id, state.id)).returning();
  return u;
}

// ─── Brewing ──────────────────────────────────────────────────────────────────

export async function brewPotion(state: GameState, recipeId: string): Promise<GameState> {
  const recipe = POTION_RECIPES.find(r => r.id === recipeId);
  if (!recipe) throw new Error(msg("potionRecipeNotFound"));
  const herbs = JSON.parse(state.herbs ?? '{}');
  for (const inp of recipe.inputs) {
    if ((herbs[inp.resource] ?? 0) < inp.qty) throw new Error(msg("notEnoughHerbs"));
  }
  for (const inp of recipe.inputs) herbs[inp.resource] -= inp.qty;
  const potions = JSON.parse(state.potions ?? '{}');
  potions[recipeId] = (potions[recipeId] ?? 0) + 1;
  const buffMap: Record<string, { effect: string; value: number }> = {
    health_potion: { effect:'heal', value:0.5 }, greater_health: { effect:'heal', value:1 },
    strength_potion: { effect:'atk', value:0.25 }, iron_potion: { effect:'def', value:0.25 },
    speed_potion: { effect:'speed', value:0.2 }, luck_potion: { effect:'drop', value:0.15 },
    crit_potion: { effect:'crit', value:0.15 }, leech_potion: { effect:'leech', value:0.1 },
  };
  const buff = buffMap[recipeId];
  if (buff) {
    const activeBuffs: any[] = JSON.parse(state.activeBuffs ?? '[]');
    if (buff.effect === 'heal') {
      const maxHp = getPlayerMaxHp(state);
      const newHp = Math.min(maxHp, (state.playerHp < 0 ? maxHp : state.playerHp) + Math.floor(maxHp * buff.value));
      await db.update(gameStates).set({ playerHp: newHp } as any).where(eq(gameStates.id, state.id));
    } else {
      activeBuffs.push({ id: recipeId, effect: buff.effect, value: buff.value, expiresAt: Date.now() + recipe.durationMin * 60000 });
      await db.update(gameStates).set({ activeBuffs: JSON.stringify(activeBuffs) } as any).where(eq(gameStates.id, state.id));
    }
  }
  const [u] = await db.update(gameStates).set({ potions: JSON.stringify(potions), herbs: JSON.stringify(herbs) } as any).where(eq(gameStates.id, state.id)).returning();
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
