import { db } from "../db";
import { gameStates, type GameState } from "@shared/schema";
import {
  SMITHING_RECIPES, LEATHERWORKING_RECIPES, JEWELCRAFTING_RECIPES,
  TOOL_RECIPES, ACHIEVEMENTS, PETS, COMBAT_SKILLS,
  TIER_UNLOCK_LEVELS, type WorldTier,
} from "@shared/game-data";
import { eq } from "drizzle-orm";
import { calculateLevel } from "@shared/game-math";
import { msg } from "@shared/messages";
import { getResourceCount } from "@shared/resources";
import { SKILLS_DATA } from "./constants";

const calcLevel = calculateLevel;

// ─── Action management ────────────────────────────────────────────────────────

export async function updateAction(state: GameState, action: string): Promise<GameState> {
  const checkRes = (key: string, qty: number) => getResourceCount(state, key) >= qty;
  if (action.startsWith("smith_")) {
    const r = SMITHING_RECIPES[parseInt(action.split("_")[1])];
    if (!r?.inputs.every(i => checkRes(i.resource, i.qty))) throw new Error(msg("notEnoughMaterials"));
  }
  if (action.startsWith("leather_")) {
    const r = LEATHERWORKING_RECIPES[parseInt(action.split("_")[1])];
    if (!r?.inputs.every(i => checkRes(i.resource, i.qty))) throw new Error(msg("notEnoughMaterials"));
  }
  if (action.startsWith("jewel_")) {
    const r = JEWELCRAFTING_RECIPES[parseInt(action.split("_")[1])];
    if (!r?.inputs.every(i => checkRes(i.resource, i.qty))) throw new Error(msg("notEnoughMaterials"));
  }
  if (action.startsWith("tool_")) {
    const r = TOOL_RECIPES[parseInt(action.split("_")[1])];
    if (!r?.inputs.every(i => checkRes(i.resource, i.qty))) throw new Error(msg("notEnoughMaterials"));
  }
  if (action.startsWith("smelting_")) {
    const idx = action.split("_")[1];
    if (!checkRes(`ore_${idx}`, 1)) throw new Error(msg("notEnoughOre"));
  }

  // Level gate — check reqLevel for gathering skills
  const gatherSkills = ['woodcutting','mining','smelting','fishing','hunting','crafting','agility','exploration'];
  for (const skill of gatherSkills) {
    if (action.startsWith(skill + '_')) {
      const idx = parseInt(action.split('_')[1]);
      const data = SKILLS_DATA[skill]?.[idx];
      if (data?.reqLevel) {
        const xpKey = (skill + 'Xp') as keyof GameState;
        const playerLevel = calcLevel(state[xpKey] as number ?? 0);
        if (playerLevel < data.reqLevel) {
          throw new Error(`需要${skill}等级 ${data.reqLevel}（当前 ${playerLevel}）`);
        }
      }
      break;
    }
  }

  const [updated] = await db.update(gameStates)
    .set({ activeAction: action, actionUpdatedAt: new Date() })
    .where(eq(gameStates.id, state.id)).returning();
  return updated;
}

// ─── World Tier ────────────────────────────────────────────────────────────────

export async function setWorldTier(state: GameState, tier: number): Promise<GameState> {
  if (tier < 1 || tier > 4) throw new Error("无效的世界层级");
  const currentTier = (state as any).worldTier ?? 1;
  if (tier <= currentTier) {
    // Downgrade always allowed
    const [updated] = await db.update(gameStates)
      .set({ worldTier: tier } as any)
      .where(eq(gameStates.id, state.id)).returning();
    return updated;
  }

  // Upgrade: check unlock condition
  const requiredLevels = TIER_UNLOCK_LEVELS[tier as WorldTier];
  if (requiredLevels) {
    const totalLevels = [
      state.attackXp, state.defenceXp, state.hitpointsXp,
      state.rangedXp ?? 0, state.magicXp ?? 0,
      state.woodcuttingXp, state.miningXp, state.smeltingXp,
      state.fishingXp, state.huntingXp, state.thievingXp,
      state.agilityXp ?? 0, state.explorationXp ?? 0,
      state.smithingXp, state.leatherworkingXp, state.jewelcraftingXp,
      state.prayerXp ?? 0, state.synthesisXp ?? 0,
    ].reduce((s, xp) => s + calculateLevel(xp), 0);
    if (totalLevels < requiredLevels) {
      throw new Error(`需要总技能等级 ${requiredLevels}（当前 ${totalLevels}）`);
    }
  }

  // Check previous tier boss kill
  const killed: number[] = JSON.parse((state as any).tierBossKilled ?? '[]');
  if (tier === 2 && !killed.includes(1)) throw new Error("请先击败辐射废土的最终Boss");
  if (tier === 3 && !killed.includes(2)) throw new Error("请先击败燃烧废土的最终Boss");
  if (tier === 4 && !killed.includes(3)) throw new Error("请先击败深渊废土的最终Boss");

  const [updated] = await db.update(gameStates)
    .set({ worldTier: tier } as any)
    .where(eq(gameStates.id, state.id)).returning();
  return updated;
}

// ─── Pet / Skill ──────────────────────────────────────────────────────────────

export async function claimPet(state: GameState, achievementId: string): Promise<GameState> {
  const ach = ACHIEVEMENTS.find(a => a.id === achievementId);
  if (!ach) throw new Error(msg("achievementNotFound"));
  const progress: Record<string, number> = JSON.parse(state.achievements ?? '{}');
  const key = `${ach.type}_${ach.target}`;
  if ((progress[key] ?? 0) < ach.count) throw new Error(msg("achievementNotMet"));
  const pets = JSON.parse(state.pets ?? '[]');
  if (pets.includes(ach.reward)) throw new Error(msg("petAlreadyClaimed"));
  pets.push(ach.reward);
  const [u] = await db.update(gameStates).set({ pets: JSON.stringify(pets), achievements: JSON.stringify({ ...progress, [key]: -ach.count }) } as any).where(eq(gameStates.id, state.id)).returning();
  return u;
}

export async function equipSkill(state: GameState, skillId: string): Promise<GameState> {
  const [u] = await db.update(gameStates).set({ equippedSkill: skillId } as any).where(eq(gameStates.id, state.id)).returning();
  return u;
}

export function getSkillDamageMultiplier(state: any, skill: any): number {
  const levelKey = skill.style === 'melee' ? 'attackXp' : skill.style === 'ranged' ? 'rangedXp' : 'magicXp';
  const level = calcLevel(state[levelKey] ?? 0);
  return skill.dmgMul * (1 + level / 100);
}

// ─── Achievement tracking ─────────────────────────────────────────────────────

export function trackAchievement(state: any, type: string, target: string, count: number = 1) {
  const ach: Record<string, number> = JSON.parse(state.achievements ?? '{}');
  const key = `${type}_${target}`;
  ach[key] = (ach[key] ?? 0) + count;
  return JSON.stringify(ach);
}

// ─── Active buffs ─────────────────────────────────────────────────────────────

export function getActiveBuffs(state: any): { hpMul: number; atkMul: number; defMul: number; xpMul: number; speedMul: number; dropMul: number; critMul: number; leechMul: number } {
  const buffs: any[] = JSON.parse(state.activeBuffs ?? '[]');
  const now = Date.now();
  const active = buffs.filter((b: any) => b.expiresAt > now);
  let hpMul = 1, atkMul = 1, defMul = 1, xpMul = 1, speedMul = 1, dropMul = 1, critMul = 1, leechMul = 1;
  for (const b of active) {
    if (b.effect === 'hp') hpMul += b.value;
    if (b.effect === 'atk') atkMul += b.value;
    if (b.effect === 'def') defMul += b.value;
    if (b.effect === 'xp') xpMul += b.value;
    if (b.effect === 'speed') speedMul += b.value;
    if (b.effect === 'drop') dropMul += b.value;
    if (b.effect === 'crit') critMul += b.value;
    if (b.effect === 'leech') leechMul += b.value;
  }
  return { hpMul: Math.min(hpMul, 2), atkMul: Math.min(atkMul, 2), defMul: Math.min(defMul, 2), xpMul: Math.min(xpMul, 2), speedMul: Math.min(speedMul, 1.5), dropMul: Math.min(dropMul, 1.5), critMul: Math.min(critMul, 1.5), leechMul: Math.min(leechMul, 1.3) };
}

// ─── Save import/export ──────────────────────────────────────────────────────

export async function importSave(state: GameState, data: any): Promise<GameState> {
  // Only allow known fields, prevent injection
  const allowed = new Set(Object.keys(gameStates));
  const clean: Record<string, any> = {};
  for (const key of Object.keys(data)) {
    if (allowed.has(key) && key !== "id") {
      clean[key] = data[key];
    }
  }
  // Reset active action so tick doesn't apply stale time
  clean.activeAction = "idle";
  clean.actionUpdatedAt = new Date();

  const [updated] = await db.update(gameStates)
    .set(clean as any)
    .where(eq(gameStates.id, state.id)).returning();
  return updated;
}

// ─── Debug: Fast-forward ─────────────────────────────────────────────────────

export async function fastForward(state: GameState, seconds: number): Promise<GameState> {
  const past = new Date(new Date(state.actionUpdatedAt).getTime() - seconds * 1000);
  const [updated] = await db.update(gameStates)
    .set({ actionUpdatedAt: past } as any)
    .where(eq(gameStates.id, state.id)).returning();
  const { tickActiveAction } = await import("./tick-action");
  return tickActiveAction(updated, new Date(), seconds);
}
