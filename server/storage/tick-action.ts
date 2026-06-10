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
  else if (action.startsWith("ranged_")) {
    const enemyIndex = parseInt(action.split("_")[1]);
    const enemy = ENEMIES[enemyIndex];
    if (enemy) result = (await handleTriangleCombat(state, enemy, enemyIndex, "ranged", elapsedSeconds)) ?? state;
  }
  else if (action.startsWith("magic_")) {
    const enemyIndex = parseInt(action.split("_")[1]);
    const enemy = ENEMIES[enemyIndex];
    if (enemy) result = (await handleTriangleCombat(state, enemy, enemyIndex, "magic", elapsedSeconds)) ?? state;
  }
  if (action.startsWith("thieve_")) result = await tickThieving(state, elapsedSeconds);
  else if (action.startsWith("smith_") || action.startsWith("leather_") || action.startsWith("jewel_") || action.startsWith("tool_")) {
    result = await tickCrafting(state, elapsedSeconds, now);
  } else {
    result = await tickGathering(state, elapsedSeconds);
  }
  // Check milestones after every action completion
  checkMilestones(result as any);
  return result;
}
