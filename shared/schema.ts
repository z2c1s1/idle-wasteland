import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const gameStates = pgTable("game_states", {
  id: serial("id").primaryKey(),
  activeAction: text("active_action").notNull().default("idle"), // "idle", "woodcutting_0"..."woodcutting_9", "mining_0"..."mining_9"
  actionUpdatedAt: timestamp("action_updated_at").notNull().defaultNow(),
  woodcuttingXp: integer("woodcutting_xp").notNull().default(0),
  miningXp: integer("mining_xp").notNull().default(0),
  
  // Woodcutting resources
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

  // Mining resources
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
});

export const insertGameStateSchema = createInsertSchema(gameStates).omit({ id: true });

export type GameState = typeof gameStates.$inferSelect;
export type InsertGameState = z.infer<typeof insertGameStateSchema>;
