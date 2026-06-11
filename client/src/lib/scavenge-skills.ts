import type { LucideIcon } from "lucide-react";
import {
  Axe, Pickaxe, Waves, PawPrint, HandMetal,
} from "lucide-react";
import type { GameState } from "@shared/schema";
import { R } from "@/lib/routes";

/** Outdoor gathering & scavenging — grouped in the Scavenge zone */
export const SCAVENGE_SKILLS = [
  { id: "woodcutting", path: R.woodcutting, xpKey: "woodcuttingXp" as const, icon: Axe,       color: "text-green-400"  },
  { id: "mining",      path: R.mining,      xpKey: "miningXp"      as const, icon: Pickaxe,   color: "text-yellow-400" },
  { id: "fishing",     path: R.fishing,     xpKey: "fishingXp"     as const, icon: Waves,     color: "text-blue-400"   },
  { id: "hunting",     path: R.hunting,     xpKey: "huntingXp"     as const, icon: PawPrint,  color: "text-red-400"    },
  { id: "thieving",    path: R.thieving,    xpKey: "thievingXp"    as const, icon: HandMetal, color: "text-purple-400" },
] as const;

export type ScavengeSkillId = typeof SCAVENGE_SKILLS[number]["id"];

export function isScavengeAction(action: string): boolean {
  if (action.startsWith("thieve_")) return true;
  return SCAVENGE_SKILLS.some(s => action.startsWith(`${s.id}_`));
}

export function getScavengeSkillFromAction(action: string): ScavengeSkillId | null {
  if (action.startsWith("thieve_")) return "thieving";
  for (const s of SCAVENGE_SKILLS) {
    if (action.startsWith(`${s.id}_`)) return s.id;
  }
  return null;
}

export function getScavengeXp(gs: GameState, id: ScavengeSkillId): number {
  return gs[`${id}Xp` as keyof GameState] as number;
}

export type { LucideIcon };
