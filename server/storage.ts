import { db } from "./db";
import { gameStates, type GameState } from "@shared/schema";
import { eq } from "drizzle-orm";

export const SKILLS_DATA: Record<string, { name: string, time: number, xp: number, prefix: string }[]> = {
  woodcutting: Array.from({ length: 10 }, (_, i) => ({
    name: ["Oak", "Willow", "Teak", "Maple", "Mahogany", "Yew", "Magic", "Elder", "Redwood", "Spirit"][i],
    time: 5 + i * 5,
    xp: 10 + i * 15,
    prefix: "wood"
  })),
  mining: Array.from({ length: 10 }, (_, i) => ({
    name: ["Copper", "Tin", "Iron", "Coal", "Mithril", "Adamant", "Rune", "Dragon", "Obsidian", "Ether"][i],
    time: 5 + i * 5,
    xp: 15 + i * 20,
    prefix: "ore"
  })),
  smelting: Array.from({ length: 10 }, (_, i) => ({
    name: ["Bronze", "Iron", "Steel", "Silver", "Gold", "Mithril", "Adamant", "Rune", "Dragon", "Eternal"][i],
    time: 5 + i * 5,
    xp: 20 + i * 25,
    prefix: "bar"
  })),
  fishing: Array.from({ length: 10 }, (_, i) => ({
    name: ["Shrimp", "Sardine", "Herring", "Trout", "Salmon", "Tuna", "Lobster", "Swordfish", "Shark", "Whale"][i],
    time: 5 + i * 5,
    xp: 12 + i * 18,
    prefix: "fish"
  })),
  hunting: Array.from({ length: 10 }, (_, i) => ({
    name: ["Rabbit", "Bird", "Fox", "Wolf", "Bear", "Boar", "Deer", "Tiger", "Dragon", "Phoenix"][i],
    time: 5 + i * 5,
    xp: 18 + i * 22,
    prefix: "hide"
  })),
  crafting: Array.from({ length: 10 }, (_, i) => ({
    name: ["Cloth", "Leather", "Jewelry", "Armor", "Weapon", "Artifact", "Relic", "Masterpiece", "Celestial", "Divine"][i],
    time: 5 + i * 5,
    xp: 25 + i * 30,
    prefix: "item"
  }))
};

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
      const updates: Partial<GameState> = { actionUpdatedAt: now };
      const [skill, indexStr] = state.activeAction.split("_");
      const index = parseInt(indexStr);
      const skillData = SKILLS_DATA[skill];
      const data = skillData ? skillData[index] : null;
      
      if (data) {
        const completions = Math.floor(elapsedSeconds / data.time);
        if (completions > 0) {
          const xpKey = `${skill}Xp` as keyof GameState;
          updates[xpKey] = (state[xpKey] as number) + completions * data.xp;
          const resourceKey = `${data.prefix}_${index}` as keyof GameState;
          (updates as any)[resourceKey] = (state[resourceKey] as number) + completions;
          const usedTime = completions * data.time;
          updates.actionUpdatedAt = new Date(new Date(state.actionUpdatedAt).getTime() + usedTime * 1000);
        }
      }

      // Only perform update if there are changes (Drizzle fails on empty set)
      if (Object.keys(updates).length > 0) {
        const [updatedState] = await db.update(gameStates).set(updates).where(eq(gameStates.id, state.id)).returning();
        return updatedState;
      }
    }
    return state;
  }

  async updateAction(action: string): Promise<GameState> {
    const currentState = await this.getGameState();
    const [updatedState] = await db.update(gameStates)
      .set({ activeAction: action, actionUpdatedAt: new Date() })
      .where(eq(gameStates.id, currentState.id))
      .returning();
    return updatedState;
  }
}

export const storage = new DatabaseStorage();
