import type { GameState } from "@shared/schema";
import { ENEMIES } from "@shared/game-data";
import { handleTriangleCombat, type CombatStyle } from "./combat";

import { tickMeleeCombat } from "./tick/melee";
import { tickDungeon } from "./tick/dungeon";
import { tickTrial } from "./tick/trial";
import { tickTower } from "./tick/tower";
import { tickThieving } from "./tick/thieving";
import { tickCrafting } from "./tick/crafting";
import { tickGathering } from "./tick/gathering";
import { checkMilestones } from "./skills";

export async function tickActiveAction(
  state: GameState,
  now: Date,
  elapsedSeconds: number,
): Promise<GameState> {
  const action = state.activeAction;
  let result: GameState = state;
  if (action.startsWith("combat_")) result = await tickMeleeCombat(state, elapsedSeconds);
  else if (action.startsWith("dungeon_")) result = await tickDungeon(state, elapsedSeconds);
  else if (action.startsWith("trial_")) result = await tickTrial(state, elapsedSeconds);
  else if (action.startsWith("tower")) result = await tickTower(state, elapsedSeconds);
  // ranged_/magic_ actions are not sent by client (combat uses combat_N_Q for all styles)
  // Keeping dead code commented for potential future ranged/magic combat UI
  // else if (action.startsWith("ranged_")) { ... }
  // else if (action.startsWith("magic_")) { ... }
  else if (action.startsWith("thieve_")) result = await tickThieving(state, elapsedSeconds);
  else if (action.startsWith("smith_") || action.startsWith("leather_") || action.startsWith("jewel_") || action.startsWith("tool_")) {
    result = await tickCrafting(state, elapsedSeconds, now);
  } else {
    result = await tickGathering(state, elapsedSeconds);
  }
  // Check milestones after every action completion
  checkMilestones(result as any);
  // Clamp all accumulating fields to safe 32-bit integer range (prevents PG overflow)
  const MAX_INT = 2_000_000_000;
  if (result.gold > MAX_INT) result.gold = MAX_INT;
  const xpFields = ['woodcuttingXp','miningXp','smeltingXp','fishingXp','huntingXp','craftingXp',
    'attackXp','strengthXp','defenceXp','hitpointsXp','smithingXp','leatherworkingXp',
    'jewelcraftingXp','thievingXp','agilityXp','rangedXp','magicXp','synthesisXp',
    'explorationXp','prayerXp','cookingXp'] as const;
  for (const f of xpFields) {
    if ((result as any)[f] > MAX_INT) (result as any)[f] = MAX_INT;
  }
  if ((result as any).bones > MAX_INT) (result as any).bones = MAX_INT;
  if ((result as any).dragonBones > MAX_INT) (result as any).dragonBones = MAX_INT;
  if ((result as any).bloodShards > MAX_INT) (result as any).bloodShards = MAX_INT;
  return result;
}
