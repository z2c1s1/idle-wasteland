import type { GameState } from "@shared/schema";
import { getToolBonus } from "@shared/game-data";
import { safeJsonArray } from "@shared/safe-parse";
import { getAgilityBonuses, getTemperatureMultiplier } from "@/lib/game-utils";

/** Get pet speed multiplier for a skill (matches server/storage/tick/gathering.ts petSpeedMap) */
export function getPetSpeedMultiplier(state: GameState, skill: string): number {
  try {
    const pets: string[] = safeJsonArray((state as any).pets);
    let bonus = 0;
    // Map pet IDs to their speed bonus (matching server/storage/skills.ts logic)
    const petSpeeds: Record<string, number> = {
      pet_beaver: 0.05, pet_ent: 0.05, pet_mole: 0.05, pet_magpie: 0.05,
      pet_dragon: 0.10, pet_octopus: 0.05, pet_fox: 0.05, pet_raccoon: 0.05,
      pet_phoenix: 0.10, pet_angel: 0.10, pet_wolf: 0.05,
    };
    const skillPets: Record<string, string[]> = {
      woodcutting: ['pet_beaver','pet_ent'],
      mining: ['pet_mole','pet_magpie'],
      smelting: ['pet_dragon'],
      fishing: ['pet_octopus'],
      hunting: ['pet_fox','pet_raccoon'],
      thieving: ['pet_raccoon'],
      smithing: ['pet_dragon'],
      leatherworking: ['pet_wolf'],
      jewelcrafting: ['pet_magpie'],
      cooking: ['pet_fox'],
      alchemy: ['pet_ent'],
      agility: ['pet_phoenix','pet_angel'],
      exploration: ['pet_angel','pet_phoenix'],
    };
    const eligible = skillPets[skill] ?? [];
    for (const petId of pets) {
      if (eligible.includes(petId)) bonus += (petSpeeds[petId] ?? 0.05);
    }
    return 1 + bonus;
  } catch { return 1; }
}

/** Base cycle times per skill tier — mirrors server/storage/constants.ts */
const SKILL_TIMES: Record<string, number[]> = {
  woodcutting: [3, 4, 5, 6, 8, 10, 12, 14, 16, 18],
  mining:      [3, 4, 5, 6, 8, 10, 12, 14, 16, 18],
  smelting:    [4, 5, 6, 7, 9, 11, 13, 15, 17, 19],
  fishing:     [3, 4, 5, 6, 7, 9, 11, 13, 15, 17],
  hunting:     [3, 4, 5, 6, 8, 10, 12, 14, 16, 18],
  agility:     [5, 6, 7, 8, 10, 12, 14, 16, 18, 20],
  crafting:    [4, 5, 6, 7, 9, 11, 13, 15, 17, 19],
  exploration: Array.from({ length: 30 }, (_, i) => 30 + i * 15),
};

export function getActionBaseTime(action: string): number | null {
  if (action.startsWith("thieve_")) return 3;
  const [skill, idxStr] = action.split("_");
  const idx = parseInt(idxStr ?? "");
  const times = skill ? SKILL_TIMES[skill] : undefined;
  if (!times || isNaN(idx)) return null;
  return times[idx] ?? null;
}

export function getEffectiveCycleTime(action: string, state: GameState): number | null {
  const base = getActionBaseTime(action);
  if (base == null) return null;
  const toolBonus = getToolBonus(state.tool ?? "{}");
  const agility = getAgilityBonuses(state);
  const tempMul = getTemperatureMultiplier(state);
  const skill = action.split("_")[0];
  const agilityMul = skill === "fishing" ? agility.fishingMul : 1;
  const petSpeedMul = getPetSpeedMultiplier(state, skill);

  // Prayer speed buff (matches server getPrayerBuff("swiftness"))
  let prayerSpeed = 1;
  try {
    const buffs = JSON.parse((state as any).activeBuffs ?? '[]');
    for (const b of buffs) {
      if (b.effect === 'speed') prayerSpeed = 1 + (b.value ?? 0);
    }
  } catch { /* ignore */ }

  // Building speed multiplier (matches server buildingMul)
  let buildingMul = 1;
  try {
    const homestead: Record<string, number> = JSON.parse((state as any).homestead ?? '{}');
    if (skill === 'woodcutting' && homestead.lumbermill) buildingMul = 1 - homestead.lumbermill * 0.03;
    if (skill === 'mining' && homestead.mine) buildingMul = 1 - homestead.mine * 0.03;
    if (skill === 'smithing' || skill === 'leatherworking' || skill === 'jewelcrafting' || skill === 'tools') {
      if (homestead.workshop) buildingMul = 1 - homestead.workshop * 0.03;
    }
    if (skill === 'fishing' && homestead.dock) buildingMul = 1 - (homestead.dock ?? 0) * 0.03;
    if (skill === 'hunting' && homestead.trap) buildingMul = 1 - (homestead.trap ?? 0) * 0.03;
  } catch { /* ignore */ }

  return base * toolBonus.timeMult / agilityMul / Math.max(0.1, tempMul) / petSpeedMul / prayerSpeed * buildingMul;
}

export function getActionProgress(action: string, state: GameState, nowMs = Date.now()): {
  cycleTime: number;
  progress: number;
  timeLeft: number;
} | null {
  const cycleTime = getEffectiveCycleTime(action, state);
  if (cycleTime == null) return null;
  const startMs = new Date(state.actionUpdatedAt as unknown as string).getTime();
  const elapsed = (nowMs - startMs) / 1000;
  const cycleElapsed = elapsed % cycleTime;
  return {
    cycleTime,
    progress: (cycleElapsed / cycleTime) * 100,
    timeLeft: Math.max(0, cycleTime - cycleElapsed),
  };
}
