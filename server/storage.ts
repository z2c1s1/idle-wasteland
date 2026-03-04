import { db } from "./db";
import { gameStates, type GameState } from "@shared/schema";
import { eq } from "drizzle-orm";

export const WOODCUTTING_DATA = [
  { name: "Oak", time: 5, xp: 10 },
  { name: "Willow", time: 10, xp: 25 },
  { name: "Teak", time: 15, xp: 45 },
  { name: "Maple", time: 20, xp: 70 },
  { name: "Mahogany", time: 25, xp: 100 },
  { name: "Yew", time: 30, xp: 135 },
  { name: "Magic", time: 35, xp: 180 },
  { name: "Elder", time: 40, xp: 230 },
  { name: "Redwood", time: 45, xp: 290 },
  { name: "Spirit", time: 50, xp: 360 },
];

export const MINING_DATA = [
  { name: "Copper", time: 5, xp: 15 },
  { name: "Tin", time: 10, xp: 35 },
  { name: "Iron", time: 15, xp: 60 },
  { name: "Coal", time: 20, xp: 90 },
  { name: "Mithril", time: 25, xp: 130 },
  { name: "Adamant", time: 30, xp: 180 },
  { name: "Rune", time: 35, xp: 240 },
  { name: "Dragon", time: 40, xp: 310 },
  { name: "Obsidian", time: 45, xp: 390 },
  { name: "Ether", time: 50, xp: 480 },
];

export interface IStorage {
  getGameState(): Promise<GameState>;
  updateAction(action: string): Promise<GameState>;
}

export class DatabaseStorage implements IStorage {
  async getGameState(): Promise<GameState> {
    let [state] = await db.select().from(gameStates).limit(1);

    if (!state) {
      const [newState] = await db.insert(gameStates).values({}).returning();
      state = newState;
    }

    const now = new Date();
    const elapsedSeconds = Math.floor((now.getTime() - new Date(state.actionUpdatedAt).getTime()) / 1000);

    if (elapsedSeconds > 0 && state.activeAction !== "idle") {
      const updates: Partial<GameState> = {
        actionUpdatedAt: now,
      };

      const [skill, indexStr] = state.activeAction.split("_");
      const index = parseInt(indexStr);
      const data = skill === "woodcutting" ? WOODCUTTING_DATA[index] : MINING_DATA[index];
      
      if (data) {
        const completions = Math.floor(elapsedSeconds / data.time);
        if (completions > 0) {
          if (skill === "woodcutting") {
            updates.woodcuttingXp = state.woodcuttingXp + completions * data.xp;
            const key = `wood_${index}` as keyof GameState;
            (updates as any)[key] = (state as any)[key] + completions;
          } else {
            updates.miningXp = state.miningXp + completions * data.xp;
            const key = `ore_${index}` as keyof GameState;
            (updates as any)[key] = (state as any)[key] + completions;
          }
          
          // Use precise timestamp to avoid losing fractional progress on next tick
          const usedTime = completions * data.time;
          updates.actionUpdatedAt = new Date(new Date(state.actionUpdatedAt).getTime() + usedTime * 1000);
        } else {
          // Keep current progress, don't update actionUpdatedAt yet
          delete updates.actionUpdatedAt;
        }
      }

      const [updatedState] = await db.update(gameStates)
        .set(updates)
        .where(eq(gameStates.id, state.id))
        .returning();
      
      return updatedState;
    }

    return state;
  }

  async updateAction(action: string): Promise<GameState> {
    const currentState = await this.getGameState();
    const [updatedState] = await db.update(gameStates)
      .set({
        activeAction: action,
        actionUpdatedAt: new Date(),
      })
      .where(eq(gameStates.id, currentState.id))
      .returning();

    return updatedState;
  }
}

export const storage = new DatabaseStorage();
