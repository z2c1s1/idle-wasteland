import { db } from "../db";
import { gameStates, type GameState } from "@shared/schema";
import { safeJsonRecord, safeJsonArray } from "@shared/safe-parse";
import { getResourceCount } from "@shared/resources";
import {
  ENEMIES, DUNGEONS,
} from "@shared/game-data";
import { eq } from "drizzle-orm";
import { getCombatLevel } from "@shared/game-math";
import { msg } from "@shared/messages";
import { TRIAL_BUFFS, TRIAL_CURSES } from "@shared/trial-data";

// ─── Dungeon ──────────────────────────────────────────────────────────────────

export async function enterDungeon(state: GameState, dungeonIndex: number): Promise<GameState> {
  const dungeon = DUNGEONS[dungeonIndex];
  if (!dungeon) throw new Error(msg("dungeonNotFound"));

  const combatLevel = getCombatLevel(state);
  if (combatLevel < dungeon.reqCombatLevel) {
    throw new Error(msg("needCombatLevel", dungeon.reqCombatLevel, combatLevel));
  }
  if (state.gold < dungeon.cost.gold) {
    throw new Error(`金币不足（需要 ${dungeon.cost.gold}，当前 ${state.gold}）`);
  }
  if (dungeon.cost.bones && getResourceCount(state, "bones") < dungeon.cost.bones) {
    throw new Error(`骨头不足（需要 ${dungeon.cost.bones}，当前 ${state.bones}）`);
  }
  if (dungeon.cost.dragonBones && getResourceCount(state, "dragonBones") < dungeon.cost.dragonBones) {
    throw new Error(`龙骨不足（需要 ${dungeon.cost.dragonBones}，当前 ${state.dragonBones}）`);
  }

  const [updated] = await db.update(gameStates)
    .set({
      activeAction: `dungeon_${dungeonIndex}_0`,
      actionUpdatedAt: new Date(),
      enemyHp: -1,
      gold:        state.gold        - dungeon.cost.gold,
      bones:       state.bones       - (dungeon.cost.bones ?? 0),
      dragonBones: state.dragonBones - (dungeon.cost.dragonBones ?? 0),
    })
    .where(eq(gameStates.id, state.id)).returning();
  return updated;
}

// ─── Tower ────────────────────────────────────────────────────────────────────

export async function startTower(state: GameState): Promise<GameState> {
  const [updated] = await db.update(gameStates)
    .set({ activeAction: 'tower', actionUpdatedAt: new Date(), enemyHp: -1 })
    .where(eq(gameStates.id, state.id)).returning();
  return updated;
}

// ─── Trial ────────────────────────────────────────────────────────────────────

export async function startTrial(state: GameState): Promise<GameState> {
  if ((state.trialKey ?? 0) < 1) throw new Error(msg("needCurseKey"));
  const [updated] = await db.update(gameStates)
    .set({ activeAction: 'trial_0_0', actionUpdatedAt: new Date(), enemyHp: -1, trialKey: state.trialKey - 1, trialBuffs: '[]', trialCurses: '[]' } as any)
    .where(eq(gameStates.id, state.id)).returning();
  return updated;
}

export async function chooseTrialBuff(state: GameState, buffId: string): Promise<GameState> {
  const buffs: string[] = safeJsonArray(state.trialBuffs);
  const curses: string[] = safeJsonArray(state.trialCurses);
  buffs.push(buffId);
  const curse = TRIAL_CURSES[Math.floor(Math.random() * TRIAL_CURSES.length)];
  curses.push(curse.id);
  const parts = state.activeAction.split('_');
  const phase = parseInt(parts[2] ?? '0');
  const nextAction = `trial_${parts[1]}_${phase + 1}`;
  const [updated] = await db.update(gameStates)
    .set({ trialBuffs: JSON.stringify(buffs), trialCurses: JSON.stringify(curses), activeAction: nextAction, actionUpdatedAt: new Date(), enemyHp: -1 } as any)
    .where(eq(gameStates.id, state.id)).returning();
  return updated;
}

// ─── Slayer ───────────────────────────────────────────────────────────────────

export async function getSlayerTask(state: GameState): Promise<GameState> {
  if (state.slayerTask) return state;
  const combatLevel = getCombatLevel(state);
  const eligible = ENEMIES.filter((_, i) => {
    const enemyLevel = i + 1;
    return enemyLevel >= combatLevel - 3 && enemyLevel <= combatLevel + 5;
  });
  if (eligible.length === 0) throw new Error(msg("noSlayerTarget"));
  const target = eligible[Math.floor(Math.random() * eligible.length)];
  const enemyIndex = ENEMIES.indexOf(target);
  const qty = 3 + Math.floor(Math.random() * 5);
  const task = { enemyIndex, enemyName: target.name, qty, killed: 0, reward: qty * target.xp * 5 };
  const [u] = await db.update(gameStates).set({
    slayerTask: JSON.stringify(task),
  } as any).where(eq(gameStates.id, state.id)).returning();
  return u;
}

export async function completeSlayerTask(state: GameState): Promise<GameState> {
  if (!state.slayerTask) throw new Error(msg("noSlayerTask"));
  let task: any;
  try { task = JSON.parse(state.slayerTask); } catch { throw new Error("Slayer task data corrupted"); }
  if (task.killed < task.qty) throw new Error(msg("slayerKillRemaining", task.qty - task.killed));
  const streak = (state.slayerStreak ?? 0) + 1;
  const bonusGold = task.reward + streak * 50;
  const [u] = await db.update(gameStates).set({
    slayerTask: null,
    slayerStreak: streak,
    gold: state.gold + bonusGold,
    bones: state.bones + task.qty * 2,
  } as any).where(eq(gameStates.id, state.id)).returning();
  return u;
}
