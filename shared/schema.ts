import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const gameStates = pgTable("game_states", {
  id: serial("id").primaryKey(),
  activeAction: text("active_action").notNull().default("idle"), // "idle", "woodcutting", "mining"
  actionUpdatedAt: timestamp("action_updated_at").notNull().defaultNow(),
  woodcuttingXp: integer("woodcutting_xp").notNull().default(0),
  miningXp: integer("mining_xp").notNull().default(0),
  woodCount: integer("wood_count").notNull().default(0),
  copperOreCount: integer("copper_ore_count").notNull().default(0),
});

export const insertGameStateSchema = createInsertSchema(gameStates).omit({ id: true });

export type GameState = typeof gameStates.$inferSelect;
export type InsertGameState = z.infer<typeof insertGameStateSchema>;
