import { db, client } from "./db";
import { gameStates, type GameState } from "@shared/schema";
import { eq } from "drizzle-orm";
import { tickActiveAction } from "./storage/tick-action";

// ─── Module imports ───────────────────────────────────────────────────────────
import * as eqMod     from "./storage/equipment";
import * as consMod   from "./storage/consumables";
import * as homeMod   from "./storage/shelter";
import * as prayMod   from "./storage/prayer";
import * as worldMod  from "./storage/world";
import * as caMod     from "./storage/combat-actions";
import * as talentMod from "./storage/talents";
import * as skillMod  from "./storage/skills";

export { SKILLS_DATA } from "./storage/constants";
export { getCombatLevel } from "@shared/game-math";

// ─── Schema detection + auto-migration ──────────────────────────────────────

let _hasPlayerColumn: boolean | null = null;

async function hasPlayerColumn(): Promise<boolean> {
  if (_hasPlayerColumn !== null) return _hasPlayerColumn;
  try {
    const r = await client.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name='game_states' AND column_name='player_id'"
    );
    _hasPlayerColumn = (r.rows as any[]).length > 0;
  } catch { _hasPlayerColumn = false; }
  return _hasPlayerColumn;
}

export async function ensurePlayerColumn(): Promise<void> {
  if (await hasPlayerColumn()) return;
  try {
    await client.exec("ALTER TABLE game_states ADD COLUMN player_id TEXT");
    await client.exec("UPDATE game_states SET player_id = '_legacy' WHERE player_id IS NULL");
    _hasPlayerColumn = true;
    console.log("[migrate] Added player_id column, legacy data preserved");
  } catch (err) { console.error("[migrate] player_id migration failed:", err); }
}

// ─── IStorage ────────────────────────────────────────────────────────────────

export interface IStorage {
  getGameState(): Promise<GameState>;
  updateAction(action: string): Promise<GameState>;
  enterDungeon(dungeonIndex: number): Promise<GameState>;
  setLootFilter(rarity: string): Promise<GameState>;
  equipItem(instanceId?: string, itemId?: string): Promise<GameState>;
  unequipItem(slot: string): Promise<GameState>;
  destroyLoot(instanceId: string): Promise<GameState>;
  socketGem(instanceId: string, gemKey: string): Promise<GameState>;
  claimPet(achievementId: string): Promise<GameState>;
}

// ─── DatabaseStorage ────────────────────────────────────────────────────────

export class DatabaseStorage implements IStorage {
  private playerId: string;
  constructor(playerId: string) { this.playerId = playerId; }

  async getGameState(): Promise<GameState> {
    const usePlayer = await hasPlayerColumn();
    if (!usePlayer) return this.getOrCreateLegacy();

    // Find by playerId
    let rows = await db.select().from(gameStates).where(eq(gameStates.playerId, this.playerId)).limit(1);

    // If no row: try to copy the legacy shared save
    if (rows.length === 0) {
      const legacy = await db.select().from(gameStates).where(eq(gameStates.playerId, '_legacy')).limit(1);
      if (legacy.length > 0) {
        const { id, playerId: _, ...data } = legacy[0] as any;
        await db.insert(gameStates).values({ ...data, playerId: this.playerId } as any);
        rows = await db.select().from(gameStates).where(eq(gameStates.playerId, this.playerId)).limit(1);
      }
    }

    if (rows.length === 0) {
      const [s] = await db.insert(gameStates).values({ playerId: this.playerId } as any).returning();
      return s;
    }
    return this.applyTicks(rows[0]);
  }

  private async getOrCreateLegacy(): Promise<GameState> {
    const rows = await db.select().from(gameStates).limit(1);
    if (rows.length > 0) return this.applyTicks(rows[0]);
    const [s] = await db.insert(gameStates).values({} as any).returning();
    return s;
  }

  private async applyTicks(state: GameState): Promise<GameState> {
    const now = new Date();
    await client.exec("BEGIN");
    try {
      const tp = homeMod.applyTemperatureDecay(state, now);
      if (Object.keys(tp).length > 0) { const [u] = await db.update(gameStates).set(tp as any).where(eq(gameStates.id, state.id)).returning(); Object.assign(state, u); }
      const np = worldMod.trySpawnNpc(state);
      if (np) { const [u] = await db.update(gameStates).set(np as any).where(eq(gameStates.id, state.id)).returning(); Object.assign(state, u); }
      const pe = (now.getTime() - new Date(state.prayerStartedAt ?? now).getTime()) / 1000;
      const pp = prayMod.applyPrayerTick(state, pe);
      if (pp) { const [u] = await db.update(gameStates).set({ ...pp, prayerStartedAt: state.activePrayer ? now : null } as any).where(eq(gameStates.id, state.id)).returning(); Object.assign(state, u); }
      await client.exec("COMMIT");
    } catch (err) { await client.exec("ROLLBACK"); throw err; }

    if (state.activeAction === "idle") return state;
    const es = (now.getTime() - new Date(state.actionUpdatedAt).getTime()) / 1000;
    if (es <= 0) return state;
    return tickActiveAction(state, now, es);
  }

  // ── All action delegates ──────────────────────────────────────────────────
  async updateAction(a: string) { return skillMod.updateAction(await this.getGameState(), a); }
  async enterDungeon(i: number) { return caMod.enterDungeon(await this.getGameState(), i); }
  async startTower() { return caMod.startTower(await this.getGameState()); }
  async startTrial() { return caMod.startTrial(await this.getGameState()); }
  async chooseTrialBuff(b: string) { return caMod.chooseTrialBuff(await this.getGameState(), b); }
  async equipItem(iid?: string, id?: string) { return eqMod.equipItem(await this.getGameState(), iid, id); }
  async unequipItem(s: string) { return eqMod.unequipItem(await this.getGameState(), s); }
  async destroyLoot(iid: string) { return eqMod.destroyLoot(await this.getGameState(), iid); }
  async socketGem(iid: string, gk: string) { return eqMod.socketGem(await this.getGameState(), iid, gk); }
  async addSocket(iid: string) { return eqMod.addSocket(await this.getGameState(), iid); }
  async setLootFilter(r: string) { return eqMod.setLootFilter(await this.getGameState(), r); }
  async equipTool(t: string) { return eqMod.equipTool(await this.getGameState(), t); }
  async synthEquip(ids: string[]) { return eqMod.synthEquip(await this.getGameState(), ids); }
  async synthGem(items: {type:string;quality:string}[]) { return eqMod.synthGem(await this.getGameState(), items); }
  async gambleItem(t: number, s?: string) { return eqMod.gambleItem(await this.getGameState(), t, s); }
  async expandLootBag() { return eqMod.expandLootBag(await this.getGameState()); }
  async enhanceItem(iid: string) { return eqMod.enhanceItem(await this.getGameState(), iid); }
  async gambleSlot(s: string, c: number) { return eqMod.gambleSlot(await this.getGameState(), s, c); }
  async extractPower(iid: string) { return eqMod.extractPower(await this.getGameState(), iid); }
  async equipPower(s: number, p: string) { return eqMod.equipPower(await this.getGameState(), s, p); }
  async corruptItem(iid: string) { return eqMod.corruptItem(await this.getGameState(), iid); }
  async setWorldTier(t: number) { return skillMod.setWorldTier(await this.getGameState(), t); }
  async cookFood(r: string) { return consMod.cookFood(await this.getGameState(), r); }
  async brewPotion(r: string) { return consMod.brewPotion(await this.getGameState(), r); }
  async farmPlant(s: number, seed: string) { return consMod.farmPlant(await this.getGameState(), s, seed); }
  async farmHarvest(s: number) { return consMod.farmHarvest(await this.getGameState(), s); }
  async buildHomestead(b: string) { return homeMod.buildShelter(await this.getGameState(), b); }
  async addFuel(t: number) { return homeMod.addFuel(await this.getGameState(), t); }
  applyTemperatureDecay(state: GameState, now: Date) { return homeMod.applyTemperatureDecay(state, now); }
  async activatePrayer(p: string) { return prayMod.activatePrayer(await this.getGameState(), p); }
  async deactivatePrayer() { return prayMod.deactivatePrayer(await this.getGameState()); }
  applyPrayerTick(s: GameState, e: number) { return prayMod.applyPrayerTick(s, e); }
  getPrayerBuff(s: GameState, t: string) { return prayMod.getPrayerBuff(s, t); }
  getTownLevel(s: GameState) { return worldMod.getTownLevel(s); }
  trySpawnNpc(s: GameState) { return worldMod.trySpawnNpc(s); }
  async npcAction(id: string, a: number) { return worldMod.npcAction(await this.getGameState(), id, a); }
  async dismissNpc() { return worldMod.dismissNpc(await this.getGameState()); }
  async establishOutpost(z: number) { return worldMod.establishOutpost(await this.getGameState(), z); }
  async collectOutposts() { return worldMod.collectOutposts(await this.getGameState()); }
  async demolishOutpost(z: number) { return worldMod.demolishOutpost(await this.getGameState(), z); }
  async importSave(data: any) { return skillMod.importSave(await this.getGameState(), data); }
  async fastForward(s: number) { return skillMod.fastForward(await this.getGameState(), s); }
  async getSlayerTask() { return caMod.getSlayerTask(await this.getGameState()); }
  async completeSlayerTask() { return caMod.completeSlayerTask(await this.getGameState()); }
  async resetTalents() { return talentMod.resetTalents(await this.getGameState()); }
  async unlockTalent(st: string, n: string) { return talentMod.unlockTalent(await this.getGameState(), st, n); }
  async claimPet(a: string) { return skillMod.claimPet(await this.getGameState(), a); }
  async equipSkill(s: string) { return skillMod.equipSkill(await this.getGameState(), s); }
  getSkillDamageMultiplier(state: any, skill: any) { return skillMod.getSkillDamageMultiplier(state, skill); }
  trackAchievement(state: any, type: string, target: string, count = 1) { return skillMod.trackAchievement(state, type, target, count); }
  getActiveBuffs(state: any) { return skillMod.getActiveBuffs(state); }
}

export function storageFor(playerId: string): DatabaseStorage {
  return new DatabaseStorage(playerId);
}
