import { db } from "../db";
import { gameStates, type GameState } from "@shared/schema";
import { TALENT_TREES } from "@shared/game-data";
import { eq } from "drizzle-orm";
import { calculateLevel } from "@shared/game-math";
import { msg } from "@shared/messages";

const calcLevel = calculateLevel;

export async function resetTalents(state: GameState): Promise<GameState> {
  const talents: Record<string, string[]> = { melee: [], ranged: [], magic: [] };
  const [updated] = await db.update(gameStates)
    .set({ talents: JSON.stringify(talents) } as any)
    .where(eq(gameStates.id, state.id)).returning();
  return updated;
}

export async function unlockTalent(state: GameState, style: string, nodeId: string): Promise<GameState> {
  const talents: Record<string, string[]> = JSON.parse(state.talents ?? '{}');
  if (!talents[style]) talents[style] = [];
  // Auto-add center node when level requirement is met
  const centerMap: Record<string, { cid: string; xp: number }> = {
    melee: { cid: 'm_center', xp: state.attackXp },
    ranged: { cid: 'r_center', xp: state.rangedXp ?? 0 },
    magic: { cid: 'mg_center', xp: state.magicXp ?? 0 },
  };
  const cm = centerMap[style];
  if (cm && calcLevel(cm.xp) >= 15 && !talents[style].includes(cm.cid)) {
    talents[style].push(cm.cid);
  }
  if (talents[style].includes(nodeId)) throw new Error(msg("talentAlreadyUnlocked"));
  const node = (TALENT_TREES as any)[style]?.find((n: any) => n.id === nodeId);
  if (!node) throw new Error(msg("talentNotFound"));
  if (node.tier === 0 && node.cost === 0) {
    const levelMap: Record<string, number> = { melee: calcLevel(state.attackXp), ranged: calcLevel(state.rangedXp ?? 0), magic: calcLevel(state.magicXp ?? 0) };
    if ((levelMap[style] ?? 0) < 15) throw new Error(msg("needCombatLevel15"));
    if (!talents[style].includes(nodeId)) talents[style].push(nodeId);
  }
  if (talents[style].includes(nodeId)) throw new Error(msg("talentAlreadyUnlocked"));
  if (node.requires && !node.requires.every((r: string) => talents[style].includes(r)))
    throw new Error(msg("prereqNotUnlocked"));
  const skills = [state.attackXp, state.defenceXp, state.hitpointsXp, state.rangedXp??0, state.magicXp??0, state.woodcuttingXp, state.miningXp, state.smeltingXp, state.fishingXp, state.huntingXp, state.thievingXp, state.agilityXp??0];
  const points = skills.reduce((s, xp) => s + Math.floor(calcLevel(xp as number) / 9), 0);
  const allNodesForSpent = [...TALENT_TREES.melee, ...TALENT_TREES.ranged, ...TALENT_TREES.magic];
  const freeIds = new Set(allNodesForSpent.filter((n: any) => n.cost === 0).map((n: any) => n.id));
  const spent = Object.values(talents).reduce((s: number, arr: string[]) => s + arr.filter(id => !freeIds.has(id)).length, 0);
  if (spent >= points) throw new Error(msg("notEnoughTalentPoints"));
  talents[style].push(nodeId);
  const [updated] = await db.update(gameStates)
    .set({ talents: JSON.stringify(talents) } as any)
    .where(eq(gameStates.id, state.id)).returning();
  return updated;
}
