import { db } from "./db";
import { gameStates, type GameState, type InsertGameState } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getGameState(): Promise<GameState>;
  updateAction(action: "idle" | "woodcutting" | "mining"): Promise<GameState>;
}

export class DatabaseStorage implements IStorage {
  async getGameState(): Promise<GameState> {
    // We only have one global state for the MVP
    let [state] = await db.select().from(gameStates).limit(1);

    if (!state) {
      const [newState] = await db.insert(gameStates).values({}).returning();
      state = newState;
    }

    // Calculate offline progress
    const now = new Date();
    const elapsedSeconds = Math.floor((now.getTime() - new Date(state.actionUpdatedAt).getTime()) / 1000);

    if (elapsedSeconds > 0 && state.activeAction !== "idle") {
      const updates: Partial<GameState> = {
        actionUpdatedAt: now,
      };

      if (state.activeAction === "woodcutting") {
        updates.woodcuttingXp = state.woodcuttingXp + elapsedSeconds * 10; // 10 XP per second
        updates.woodCount = state.woodCount + elapsedSeconds * 1; // 1 Wood per second
      } else if (state.activeAction === "mining") {
        updates.miningXp = state.miningXp + elapsedSeconds * 15; // 15 XP per second
        updates.copperOreCount = state.copperOreCount + elapsedSeconds * 1; // 1 Copper per second
      }

      const [updatedState] = await db.update(gameStates)
        .set(updates)
        .where(eq(gameStates.id, state.id))
        .returning();
      
      return updatedState;
    }

    // Even if idle, update the actionUpdatedAt to avoid massive jumps if we switch action later
    if (elapsedSeconds > 0 && state.activeAction === "idle") {
       const [updatedState] = await db.update(gameStates)
        .set({ actionUpdatedAt: now })
        .where(eq(gameStates.id, state.id))
        .returning();
      return updatedState;
    }

    return state;
  }

  async updateAction(action: "idle" | "woodcutting" | "mining"): Promise<GameState> {
    // First apply any pending progress by getting the state
    const currentState = await this.getGameState();

    // Then update the action and reset the timer
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
