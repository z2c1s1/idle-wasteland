import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const lines = readFileSync(join(root, "server/storage.ts"), "utf8").split("\n");

function dedent(block) {
  return block
    .map((line) => (line.startsWith("    ") ? line.slice(4) : line))
    .join("\n");
}

function extract(start, end) {
  return dedent(lines.slice(start - 1, end));
}

const commonImports = `import { db } from "../db";
import { gameStates, type GameState } from "@shared/schema";
import type { GameItem, ItemSkill } from "@shared/game-data";
import { eq } from "drizzle-orm";
import {
  ENEMIES,
  DUNGEONS,
  generateDungeonDrop,
  SMITHING_RECIPES,
  LEATHERWORKING_RECIPES,
  JEWELCRAFTING_RECIPES,
  getEquipmentBonuses,
  generateDroppedItem,
  getDropChance,
  COMBAT_TRIANGLE,
  TRIANGLE_DAMAGE_BONUS,
  TRIANGLE_DAMAGE_PENALTY,
  getToolBonus,
  ALL_TOOLS,
  TOOL_RECIPES,
  WOODCUTTING_BERRY_DROPS,
  HUNTING_HERB_DROPS,
  MINING_GEM_POOLS,
  COMBAT_GEM_POOLS,
  THIEVING_NPCS,
  calcStealth,
  calcThievingSuccessRate,
  calcThievingDoubleRate,
  ITEM_SETS,
  UNIQUE_ITEMS,
  buildUniqueGameItem,
  ALL_SLOTS,
  SLOT_BASES,
  type AffixType,
  type Rarity,
} from "@shared/game-data";
import { TRIAL_BUFFS, TRIAL_CURSES } from "@shared/trial-data";
import { calculateLevel, getPlayerMaxHp, getPlayerAttack, getPlayerDefence } from "@shared/game-math";
import { parseEquipment, parseLootBag, parseGems, parseDungeonStats } from "@shared/game-state-parse";
import { getResourceCount, buildResourceUpdates } from "@shared/resources";
import { SKILLS_DATA, RARITY_ORDER, DISENCHANT_GOLD } from "../constants";
import { handleProductionRecipe, rollGemDropsFromPool, mergeGems } from "../helpers";
import { handleTriangleCombat, type CombatStyle } from "../combat";

const calcLevel = calculateLevel;
`;

mkdirSync(join(root, "server/storage/tick"), { recursive: true });

const modules = [
  {
    file: "melee.ts",
    fn: "tickMeleeCombat",
    start: 53,
    end: 308,
    extra: "",
  },
  {
    file: "dungeon.ts",
    fn: "tickDungeon",
    start: 313,
    end: 509,
    extra: "",
  },
  {
    file: "trial.ts",
    fn: "tickTrial",
    start: 515,
    end: 586,
    extra: "",
  },
  {
    file: "tower.ts",
    fn: "tickTower",
    start: 591,
    end: 668,
    extra: "",
  },
  {
    file: "thieving.ts",
    fn: "tickThieving",
    start: 691,
    end: 761,
    extra: "",
  },
  {
    file: "crafting.ts",
    fn: "tickCrafting",
    start: 765,
    end: 802,
    extra: `const now = new Date();\n`,
  },
  {
    file: "gathering.ts",
    fn: "tickGathering",
    start: 805,
    end: 889,
    extra: "",
  },
];

for (const mod of modules) {
  const body = extract(mod.start, mod.end);
  const content = `${commonImports}
export async function ${mod.fn}(state: GameState, elapsedSeconds: number): Promise<GameState> {
${mod.extra}${body}
}
`;
  writeFileSync(join(root, "server/storage/tick", mod.file), content, "utf8");
}

const dispatcher = `${commonImports}
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
    return tickCrafting(state, elapsedSeconds);
  }
  return tickGathering(state, elapsedSeconds);
}
`;

writeFileSync(join(root, "server/storage/tick-action.ts"), dispatcher, "utf8");
console.log("Extracted tick modules");
