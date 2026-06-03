import { db } from "../db";
import { gameStates, type GameState } from "@shared/schema";
import { PRAYERS, getPrayerLevel } from "@shared/game-data";
import { eq } from "drizzle-orm";
import { msg } from "@shared/messages";

// ─── Prayer activation ────────────────────────────────────────────────────────

export async function activatePrayer(state: GameState, prayerId: string): Promise<GameState> {
  const prayer = PRAYERS.find(p => p.id === prayerId);
  if (!prayer) throw new Error(msg("prayerNotFound"));
  const [u] = await db.update(gameStates).set({
    activePrayer: prayerId,
    prayerStartedAt: new Date(),
    prayerXp: state.prayerXp ?? 0,
  } as any).where(eq(gameStates.id, state.id)).returning();
  return u;
}

export async function deactivatePrayer(state: GameState): Promise<GameState> {
  const [u] = await db.update(gameStates).set({
    activePrayer: '',
    prayerStartedAt: null,
  } as any).where(eq(gameStates.id, state.id)).returning();
  return u;
}

// ─── Prayer tick ──────────────────────────────────────────────────────────────

export function applyPrayerTick(state: GameState, elapsedSec: number): Partial<GameState> | null {
  if (!state.activePrayer) return null;
  const USE_DRAGON_BONES = (state as any).useDragonBones ?? false;
  const boneCost = Math.ceil(elapsedSec);
  const boneKey = USE_DRAGON_BONES ? 'dragonBones' : 'bones';
  const boneCount = boneKey === 'dragonBones' ? (state.dragonBones ?? 0) : (state.bones ?? 0);
  if (boneCount < boneCost) {
    return { activePrayer: '', prayerStartedAt: null } as any;
  }
  const xpGain = Math.floor(elapsedSec * (USE_DRAGON_BONES ? 2 : 1));
  return {
    [boneKey]: boneCount - boneCost,
    prayerXp: (state.prayerXp ?? 0) + xpGain,
  } as any;
}

// ─── Prayer buff ──────────────────────────────────────────────────────────────

export function getPrayerBuff(state: GameState, type: string): number {
  if (!state.activePrayer) return 0;
  const prayer = PRAYERS.find(p => p.id === state.activePrayer);
  if (!prayer || prayer.id !== type) return 0;
  const lv = getPrayerLevel(state.prayerXp ?? 0);
  return (prayer.baseBuff + (lv - 1) * prayer.buffPerLevel) / 100;
}
