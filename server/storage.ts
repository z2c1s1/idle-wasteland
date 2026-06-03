import { db, client } from "./db";
import { gameStates, type GameState } from "@shared/schema";
import { eq } from "drizzle-orm";
import { tickActiveAction } from "./storage/tick-action";
import type { GameItem, EquipmentSlot } from "@shared/game-data";

// ─── Module imports ───────────────────────────────────────────────────────────
import * as eqMod     from "./storage/equipment";
import * as consMod   from "./storage/consumables";
import * as homeMod   from "./storage/homestead";
import * as prayMod   from "./storage/prayer";
import * as worldMod  from "./storage/world";
import * as caMod     from "./storage/combat-actions";
import * as talentMod from "./storage/talents";
import * as skillMod  from "./storage/skills";

export { SKILLS_DATA } from "./storage/constants";
export { getCombatLevel } from "@shared/game-math";

// ─── IStorage interface ──────────────────────────────────────────────────────

export interface IStorage {
  getGameState(): Promise<GameState>;
  updateAction(action: string): Promise<GameState>;
  enterDungeon(dungeonIndex: number): Promise<GameState>;
  setLootFilter(rarity: string): Promise<GameState>;
  equipItem(instanceId?: string, itemId?: string): Promise<GameState>;
  unequipItem(slot: string): Promise<GameState>;
  destroyLoot(instanceId: string): Promise<GameState>;
  socketGem(instanceId: string, gemKey: string): Promise<GameState>;
}

// ─── DatabaseStorage (thin shell) ────────────────────────────────────────────

export class DatabaseStorage implements IStorage {
  // ── Core ──────────────────────────────────────────────────────────────────

  async getGameState(): Promise<GameState> {
    let [state] = await db.select().from(gameStates).limit(1);
    if (!state) {
      const [newState] = await db.insert(gameStates).values({}).returning();
      state = newState;
    }

    const now = new Date();

    // Wrap multi-update sequence in a transaction for atomicity
    await client.exec("BEGIN");
    try {
      // Temperature decay
      const tempPatch = homeMod.applyTemperatureDecay(state, now);
      if (Object.keys(tempPatch).length > 0) {
        const [updated] = await db.update(gameStates).set(tempPatch as any)
          .where(eq(gameStates.id, state.id)).returning();
        state = updated;
      }

      // NPC spawn
      const npcPatch = worldMod.trySpawnNpc(state);
      if (npcPatch) {
        const [npcUpdated] = await db.update(gameStates).set(npcPatch as any)
          .where(eq(gameStates.id, state.id)).returning();
        state = npcUpdated;
      }

      // Prayer tick
      const prayerElapsed = (now.getTime() - new Date(state.prayerStartedAt ?? now).getTime()) / 1000;
      const prayerPatch = prayMod.applyPrayerTick(state, prayerElapsed);
      if (prayerPatch) {
        const [pUpdated] = await db.update(gameStates).set({ ...prayerPatch, prayerStartedAt: state.activePrayer ? now : null } as any)
          .where(eq(gameStates.id, state.id)).returning();
        state = pUpdated;
      }

      await client.exec("COMMIT");
    } catch (err) {
      await client.exec("ROLLBACK");
      throw err;
    }

    const action = state.activeAction;
    if (action === "idle") return state;

    const elapsedSeconds = (now.getTime() - new Date(state.actionUpdatedAt).getTime()) / 1000;
    if (elapsedSeconds <= 0) return state;

    return tickActiveAction(state, now, elapsedSeconds);
  }

  // ── Actions / Speed ───────────────────────────────────────────────────────

  async updateAction(action: string): Promise<GameState> {
    const state = await this.getGameState();
    return skillMod.updateAction(state, action);
  }

  // ── Combat actions ────────────────────────────────────────────────────────

  async enterDungeon(dungeonIndex: number): Promise<GameState> {
    const state = await this.getGameState();
    return caMod.enterDungeon(state, dungeonIndex);
  }

  async startTower(): Promise<GameState> {
    const state = await this.getGameState();
    return caMod.startTower(state);
  }

  async startTrial(): Promise<GameState> {
    const state = await this.getGameState();
    return caMod.startTrial(state);
  }

  async chooseTrialBuff(buffId: string): Promise<GameState> {
    const state = await this.getGameState();
    return caMod.chooseTrialBuff(state, buffId);
  }

  // ── Equipment ─────────────────────────────────────────────────────────────

  async equipItem(instanceId?: string, itemId?: string): Promise<GameState> {
    const state = await this.getGameState();
    return eqMod.equipItem(state, instanceId, itemId);
  }

  async unequipItem(slot: string): Promise<GameState> {
    const state = await this.getGameState();
    return eqMod.unequipItem(state, slot);
  }

  async destroyLoot(instanceId: string): Promise<GameState> {
    const state = await this.getGameState();
    return eqMod.destroyLoot(state, instanceId);
  }

  async socketGem(instanceId: string, gemKey: string): Promise<GameState> {
    const state = await this.getGameState();
    return eqMod.socketGem(state, instanceId, gemKey);
  }

  async addSocket(instanceId: string): Promise<GameState> {
    const state = await this.getGameState();
    return eqMod.addSocket(state, instanceId);
  }

  async setLootFilter(rarity: string): Promise<GameState> {
    const state = await this.getGameState();
    return eqMod.setLootFilter(state, rarity);
  }

  async equipTool(toolId: string): Promise<GameState> {
    const state = await this.getGameState();
    return eqMod.equipTool(state, toolId);
  }

  async synthEquip(instanceIds: string[]): Promise<GameState> {
    const state = await this.getGameState();
    return eqMod.synthEquip(state, instanceIds);
  }

  async synthGem(items: {type:string;quality:string}[]): Promise<GameState> {
    const state = await this.getGameState();
    return eqMod.synthGem(state, items);
  }

  async gambleItem(tierIdx: number, slot?: string): Promise<GameState> {
    const state = await this.getGameState();
    return eqMod.gambleItem(state, tierIdx, slot);
  }

  async expandLootBag(): Promise<GameState> {
    const state = await this.getGameState();
    return eqMod.expandLootBag(state);
  }

  async enhanceItem(instanceId: string): Promise<GameState> {
    const state = await this.getGameState();
    return eqMod.enhanceItem(state, instanceId);
  }

  async setWorldTier(tier: number): Promise<GameState> {
    const state = await this.getGameState();
    return skillMod.setWorldTier(state, tier);
  }

  // ── Cooking / Brewing / Farming ───────────────────────────────────────────

  async cookFood(recipeId: string): Promise<GameState> {
    const state = await this.getGameState();
    return consMod.cookFood(state, recipeId);
  }

  async brewPotion(recipeId: string): Promise<GameState> {
    const state = await this.getGameState();
    return consMod.brewPotion(state, recipeId);
  }

  async farmPlant(slot: number, seed: string): Promise<GameState> {
    const state = await this.getGameState();
    return consMod.farmPlant(state, slot, seed);
  }

  async farmHarvest(slot: number): Promise<GameState> {
    const state = await this.getGameState();
    return consMod.farmHarvest(state, slot);
  }

  // ── Homestead / Fuel ──────────────────────────────────────────────────────

  async buildHomestead(buildingId: string): Promise<GameState> {
    const state = await this.getGameState();
    return homeMod.buildHomestead(state, buildingId);
  }

  async addFuel(woodTier: number): Promise<GameState> {
    const state = await this.getGameState();
    return homeMod.addFuel(state, woodTier);
  }

  applyTemperatureDecay(state: GameState, now: Date): Partial<GameState> {
    return homeMod.applyTemperatureDecay(state, now);
  }

  // ── Prayer ────────────────────────────────────────────────────────────────

  async activatePrayer(prayerId: string): Promise<GameState> {
    const state = await this.getGameState();
    return prayMod.activatePrayer(state, prayerId);
  }

  async deactivatePrayer(): Promise<GameState> {
    const state = await this.getGameState();
    return prayMod.deactivatePrayer(state);
  }

  applyPrayerTick(state: GameState, elapsedSec: number): Partial<GameState> | null {
    return prayMod.applyPrayerTick(state, elapsedSec);
  }

  getPrayerBuff(state: GameState, type: string): number {
    return prayMod.getPrayerBuff(state, type);
  }

  // ── NPC / Outpost ─────────────────────────────────────────────────────────

  getTownLevel(state: GameState): number {
    return worldMod.getTownLevel(state);
  }

  trySpawnNpc(state: GameState): Partial<GameState> | null {
    return worldMod.trySpawnNpc(state);
  }

  async npcAction(npcId: string, actionIndex: number): Promise<GameState> {
    const state = await this.getGameState();
    return worldMod.npcAction(state, npcId, actionIndex);
  }

  async dismissNpc(): Promise<GameState> {
    const state = await this.getGameState();
    return worldMod.dismissNpc(state);
  }

  async establishOutpost(zoneIndex: number): Promise<GameState> {
    const state = await this.getGameState();
    return worldMod.establishOutpost(state, zoneIndex);
  }

  async collectOutposts(): Promise<GameState> {
    const state = await this.getGameState();
    return worldMod.collectOutposts(state);
  }

  async demolishOutpost(zoneIndex: number): Promise<GameState> {
    const state = await this.getGameState();
    return worldMod.demolishOutpost(state, zoneIndex);
  }

  async importSave(data: any): Promise<GameState> {
    const state = await this.getGameState();
    return skillMod.importSave(state, data);
  }

  // ── Slayer ────────────────────────────────────────────────────────────────

  async getSlayerTask(): Promise<GameState> {
    const state = await this.getGameState();
    return caMod.getSlayerTask(state);
  }

  async completeSlayerTask(): Promise<GameState> {
    const state = await this.getGameState();
    return caMod.completeSlayerTask(state);
  }

  // ── Talents ───────────────────────────────────────────────────────────────

  async resetTalents(): Promise<GameState> {
    const state = await this.getGameState();
    return talentMod.resetTalents(state);
  }

  async unlockTalent(style: string, nodeId: string): Promise<GameState> {
    const state = await this.getGameState();
    return talentMod.unlockTalent(state, style, nodeId);
  }

  // ── Skills / Pets ─────────────────────────────────────────────────────────

  async claimPet(achievementId: string): Promise<GameState> {
    const state = await this.getGameState();
    return skillMod.claimPet(state, achievementId);
  }

  async equipSkill(skillId: string): Promise<GameState> {
    const state = await this.getGameState();
    return skillMod.equipSkill(state, skillId);
  }

  getSkillDamageMultiplier(state: any, skill: any): number {
    return skillMod.getSkillDamageMultiplier(state, skill);
  }

  trackAchievement(state: any, type: string, target: string, count: number = 1) {
    return skillMod.trackAchievement(state, type, target, count);
  }

  getActiveBuffs(state: any) {
    return skillMod.getActiveBuffs(state);
  }
}

export const storage = new DatabaseStorage();
