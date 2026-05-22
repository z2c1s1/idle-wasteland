import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const gameStates = pgTable("game_states", {
  id: serial("id").primaryKey(),
  activeAction: text("active_action").notNull().default("idle"),
  actionUpdatedAt: timestamp("action_updated_at").notNull().defaultNow(),

  woodcuttingXp: integer("woodcutting_xp").notNull().default(0),
  miningXp: integer("mining_xp").notNull().default(0),
  smeltingXp: integer("smelting_xp").notNull().default(0),
  fishingXp: integer("fishing_xp").notNull().default(0),
  huntingXp: integer("hunting_xp").notNull().default(0),
  craftingXp: integer("crafting_xp").notNull().default(0),

  attackXp: integer("attack_xp").notNull().default(0),
  strengthXp: integer("strength_xp").notNull().default(0),
  defenceXp: integer("defence_xp").notNull().default(0),
  hitpointsXp: integer("hitpoints_xp").notNull().default(0),
  smithingXp: integer("smithing_xp").notNull().default(0),

  playerHp: integer("player_hp").notNull().default(-1),
  enemyHp: integer("enemy_hp").notNull().default(-1),

  gold: integer("gold").notNull().default(0),
  bones: integer("bones").notNull().default(0),
  dragonBones: integer("dragon_bones").notNull().default(0),

  // equipment: {slot: GameItem} full item object per slot
  equipment: text("equipment").notNull().default("{}"),
  // craftItems: {itemId: qty} for smithed items
  craftItems: text("craft_items").notNull().default("{}"),
  // lootBag: GameItem[] for randomly dropped items
  lootBag: text("loot_bag").notNull().default("[]"),

  wood_0: integer("wood_0").notNull().default(0),
  wood_1: integer("wood_1").notNull().default(0),
  wood_2: integer("wood_2").notNull().default(0),
  wood_3: integer("wood_3").notNull().default(0),
  wood_4: integer("wood_4").notNull().default(0),
  wood_5: integer("wood_5").notNull().default(0),
  wood_6: integer("wood_6").notNull().default(0),
  wood_7: integer("wood_7").notNull().default(0),
  wood_8: integer("wood_8").notNull().default(0),
  wood_9: integer("wood_9").notNull().default(0),

  ore_0: integer("ore_0").notNull().default(0),
  ore_1: integer("ore_1").notNull().default(0),
  ore_2: integer("ore_2").notNull().default(0),
  ore_3: integer("ore_3").notNull().default(0),
  ore_4: integer("ore_4").notNull().default(0),
  ore_5: integer("ore_5").notNull().default(0),
  ore_6: integer("ore_6").notNull().default(0),
  ore_7: integer("ore_7").notNull().default(0),
  ore_8: integer("ore_8").notNull().default(0),
  ore_9: integer("ore_9").notNull().default(0),

  bar_0: integer("bar_0").notNull().default(0),
  bar_1: integer("bar_1").notNull().default(0),
  bar_2: integer("bar_2").notNull().default(0),
  bar_3: integer("bar_3").notNull().default(0),
  bar_4: integer("bar_4").notNull().default(0),
  bar_5: integer("bar_5").notNull().default(0),
  bar_6: integer("bar_6").notNull().default(0),
  bar_7: integer("bar_7").notNull().default(0),
  bar_8: integer("bar_8").notNull().default(0),
  bar_9: integer("bar_9").notNull().default(0),

  fish_0: integer("fish_0").notNull().default(0),
  fish_1: integer("fish_1").notNull().default(0),
  fish_2: integer("fish_2").notNull().default(0),
  fish_3: integer("fish_3").notNull().default(0),
  fish_4: integer("fish_4").notNull().default(0),
  fish_5: integer("fish_5").notNull().default(0),
  fish_6: integer("fish_6").notNull().default(0),
  fish_7: integer("fish_7").notNull().default(0),
  fish_8: integer("fish_8").notNull().default(0),
  fish_9: integer("fish_9").notNull().default(0),

  hide_0: integer("hide_0").notNull().default(0),
  hide_1: integer("hide_1").notNull().default(0),
  hide_2: integer("hide_2").notNull().default(0),
  hide_3: integer("hide_3").notNull().default(0),
  hide_4: integer("hide_4").notNull().default(0),
  hide_5: integer("hide_5").notNull().default(0),
  hide_6: integer("hide_6").notNull().default(0),
  hide_7: integer("hide_7").notNull().default(0),
  hide_8: integer("hide_8").notNull().default(0),
  hide_9: integer("hide_9").notNull().default(0),

  item_0: integer("item_0").notNull().default(0),
  item_1: integer("item_1").notNull().default(0),
  item_2: integer("item_2").notNull().default(0),
  item_3: integer("item_3").notNull().default(0),
  item_4: integer("item_4").notNull().default(0),
  item_5: integer("item_5").notNull().default(0),
  item_6: integer("item_6").notNull().default(0),
  item_7: integer("item_7").notNull().default(0),
  item_8: integer("item_8").notNull().default(0),
  item_9: integer("item_9").notNull().default(0),
});

export const insertGameStateSchema = createInsertSchema(gameStates).omit({ id: true });
export type GameState = typeof gameStates.$inferSelect;
export type InsertGameState = z.infer<typeof insertGameStateSchema>;
