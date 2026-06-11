// ═══════════════════════════════════════════════════════════════════════════════
// tick 模块共享导入 — 所有 tick/*.ts 从此文件按需导入，避免 7 个文件各自
// 维护 ~30 行重复 import。
// ═══════════════════════════════════════════════════════════════════════════════

// ─── DB / Schema ─────────────────────────────────────────────────────────────
export { db } from "../../db";
export { gameStates } from "@shared/schema";
export type { GameState } from "@shared/schema";
export { eq } from "drizzle-orm";

// ─── Game data (常用) ────────────────────────────────────────────────────────
export {
  ENEMIES,
  DUNGEONS,
  generateDungeonDrop,
  getEquipmentBonuses,
  generateDroppedItem,
  getDropChance,
  COMBAT_TRIANGLE,
  TRIANGLE_DAMAGE_BONUS,
  TRIANGLE_DAMAGE_PENALTY,
  type GameItem,
  type ItemSkill,
} from "@shared/game-data";

// ─── Game data (采集) ────────────────────────────────────────────────────────
export {
  getToolBonus,
  ALL_TOOLS,
  WOODCUTTING_BERRY_DROPS,
  HUNTING_HERB_DROPS,
} from "@shared/game-data";

// ─── Game data (生产) ────────────────────────────────────────────────────────
export {
  SMITHING_RECIPES,
  LEATHERWORKING_RECIPES,
  JEWELCRAFTING_RECIPES,
  TOOL_RECIPES,
} from "@shared/game-data";

// ─── Game data (宝石 / 掉落) ─────────────────────────────────────────────────
export {
  MINING_GEM_POOLS,
  COMBAT_GEM_POOLS,
} from "@shared/game-data";

// ─── Game data (盗窃) ────────────────────────────────────────────────────────
export {
  THIEVING_NPCS,
  calcStealth,
  calcThievingSuccessRate,
  calcThievingDoubleRate,
} from "@shared/game-data";

// ─── Game data (稀有) ────────────────────────────────────────────────────────
export {
  ITEM_SETS,
  UNIQUE_ITEMS,
  buildUniqueGameItem,
  ALL_SLOTS,
  SLOT_BASES,
  type AffixType,
  type Rarity,
} from "@shared/game-data";

// ─── Game math ───────────────────────────────────────────────────────────────
export {
  calculateLevel,
  getPlayerMaxHp,
  getPlayerAttack,
  getPlayerDefence,
  getAgilityBonuses,
  getTemperatureMultiplier,
  getTemperatureHpLoss,
} from "@shared/game-math";

// ─── State parsing ───────────────────────────────────────────────────────────
export {
  parseEquipment,
  parseLootBag,
  parseGems,
  parseDungeonStats,
} from "@shared/game-state-parse";

// ─── Resources ───────────────────────────────────────────────────────────────
export {
  getResourceCount,
  buildResourceUpdates,
} from "@shared/resources";

// ─── Trial data ──────────────────────────────────────────────────────────────
export { COMPANION_NPCS } from "@shared/game-data";
export { TRIAL_BUFFS, TRIAL_CURSES } from "@shared/trial-data";

// ─── Local helpers ───────────────────────────────────────────────────────────
export { SKILLS_DATA, RARITY_ORDER, DISENCHANT_GOLD } from "../constants";
export { handleProductionRecipe, rollGemDropsFromPool, mergeGems } from "../helpers";
export { handleTriangleCombat } from "../combat";
export { getPrayerBuff } from "../prayer";
export { getTalentBonuses } from "./talent-bonuses";
export { computeSkillEffects, computeEffectiveCombatSpeed, applySkillProcDamage, type SkillProcContext } from "./_combat-shared";
export { trackAchievement, getPetBuffs, getActiveBuffs } from "../skills";
export type { CombatStyle } from "../combat";

// ─── Safe JSON parsing ──────────────────────────────────────────────────────
export { safeJsonRecord, safeJsonArray } from "@shared/safe-parse";
