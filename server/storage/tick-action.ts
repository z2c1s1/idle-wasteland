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

export async function tickActiveAction(
  state: GameState,
  now: Date,
  elapsedSeconds: number,
): Promise<GameState> {
  const action = state.activeAction;
  if (action.startsWith("combat_")) return tickMeleeCombat(state, elapsedSeconds);
  if (action.startsWith("dungeon_")) return tickDungeon(state, elapsedSeconds);
  if (action.startsWith("trial_")) return tickTrial(state, elapsedSeconds);
  if (action.startsWith("tower")) return tickTower(state, elapsedSeconds);
  if (action.startsWith("ranged_")) {
    const enemyIndex = parseInt(action.split("_")[1]);
    const enemy = ENEMIES[enemyIndex];
    if (!enemy) return state;
    return (await handleTriangleCombat(state, enemy, enemyIndex, "ranged", elapsedSeconds)) ?? state;
  }
  if (action.startsWith("magic_")) {
    const enemyIndex = parseInt(action.split("_")[1]);
    const enemy = ENEMIES[enemyIndex];
    if (!enemy) return state;
    return (await handleTriangleCombat(state, enemy, enemyIndex, "magic", elapsedSeconds)) ?? state;
  }
  if (action.startsWith("thieve_")) return tickThieving(state, elapsedSeconds);
  if (action.startsWith("smith_") || action.startsWith("leather_") || action.startsWith("jewel_") || action.startsWith("tool_")) {
    return tickCrafting(state, elapsedSeconds, now);
  }
  return tickGathering(state, elapsedSeconds);
}
