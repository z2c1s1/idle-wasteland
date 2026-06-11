/**
 * 🔒 Recipe integrity linter — validates recipe→item and achievement→pet references.
 *
 * Run:  npx tsx scripts/lint-recipes.ts
 */

import * as fs from "fs";
import * as path from "path";

const GAME_DATA = path.resolve("shared/game-data.ts");

let errors = 0;
function err(msg: string) { console.error("❌ " + msg); errors++; }
function warn(msg: string) { console.warn("⚠️  " + msg); }

// ── Parse key-value exports from a TS file (line-based approach) ──────────
function extractRecordKeys(filePath: string, recordName: string): Set<string> {
  return extractKeysFromFile(filePath, recordName, "object");
}

/** Extract IDs from an array of objects like: [{id:'scrap_axe', ...}, ...] */
function extractArrayIds(filePath: string, recordName: string): Set<string> {
  return extractKeysFromFile(filePath, recordName, "array");
}

function extractKeysFromFile(filePath: string, recordName: string, mode: "object" | "array"): Set<string> {
  const src = fs.readFileSync(filePath, "utf-8");
  const keys = new Set<string>();
  const lines = src.split("\n");
  let inRecord = false;
  let depth = 0;
  for (const line of lines) {
    if (!inRecord) {
      if (line.includes(`export const ${recordName}`)) inRecord = true;
      continue;
    }
    let opens = 0, closes = 0;
    for (const ch of line) {
      if (ch === "{" || ch === "[") opens++;
      if (ch === "}" || ch === "]") closes++;
    }
    if (mode === "object") {
      const keyMatch = line.match(/^\s*(\w+):\s*\{/);
      if (keyMatch && depth === 0) keys.add(keyMatch[1]);
    } else {
      const idMatch = line.match(/id:\s*'(\w+)'/);
      if (idMatch) keys.add(idMatch[1]);
    }
    depth += opens - closes;
    if (depth < 0) break;
  }
  return keys;
}

// ── 1. Recipe output → item definition ───────────────────────────────────────
console.log("📋 Checking recipe outputs...");

// Parse ITEMS
const equipmentItems = extractRecordKeys(GAME_DATA, "EQUIPMENT_ITEMS");
const leatherItems = extractRecordKeys(GAME_DATA, "LEATHER_ITEMS");
const jewelryItems = extractRecordKeys(GAME_DATA, "JEWELRY_ITEMS");
const toolItems = extractArrayIds(GAME_DATA, "ALL_TOOLS");

console.log(`  EQUIPMENT_ITEMS: ${equipmentItems.size} entries`);
console.log(`  LEATHER_ITEMS: ${leatherItems.size} entries`);
console.log(`  JEWELRY_ITEMS: ${jewelryItems.size} entries`);
console.log(`  ALL_TOOLS: ${toolItems.size} entries`);

// Parse recipe outputs (line-based, handles any array format)
function checkRecipes(filePath: string, recordName: string, validOutputs: Set<string>, label: string) {
  const src = fs.readFileSync(filePath, "utf-8");
  const lines = src.split("\n");
  let inRecord = false;
  const outputs = new Set<string>();
  for (const line of lines) {
    if (!inRecord && line.includes(`export const ${recordName}`)) {
      inRecord = true;
      continue;
    }
    if (inRecord) {
      const outputMatch = line.match(/output:\s*'(\w+)'/);
      if (outputMatch) outputs.add(outputMatch[1]);
      if (line.trim() === "];") break;
    }
  }
  for (const id of outputs) {
    if (!validOutputs.has(id)) {
      err(`${label}: recipe output '${id}' not found in item definitions`);
    }
  }
  console.log(`  ${label}: ${outputs.size} recipes, all outputs checked`);
}

checkRecipes(GAME_DATA, "SMITHING_RECIPES", equipmentItems, "SMITHING_RECIPES");
checkRecipes(GAME_DATA, "LEATHERWORKING_RECIPES", leatherItems, "LEATHERWORKING_RECIPES");
checkRecipes(GAME_DATA, "JEWELCRAFTING_RECIPES", jewelryItems, "JEWELCRAFTING_RECIPES");
checkRecipes(GAME_DATA, "TOOL_RECIPES", toolItems, "TOOL_RECIPES");

// ── 2. Achievement → Pet links ──────────────────────────────────────────────
console.log("\n📋 Checking achievement→pet links...");

const gameDataSrc = fs.readFileSync(GAME_DATA, "utf-8");

// Extract PETS
const petIds = new Set<string>();
const petAchievements = new Map<string, string>(); // petId → achievementId
const petsRe = /export const PETS[^=]*=\s*\[([\s\S]*?)\];/;
const petsM = petsRe.exec(gameDataSrc);
if (petsM) {
  const petEntryRe = /\{\s*id:\s*'(\w+)'[\s\S]*?achievement:\s*'(\w+)'/g;
  let pm: RegExpExecArray | null;
  while ((pm = petEntryRe.exec(petsM[1])) !== null) {
    petIds.add(pm[1]);
    petAchievements.set(pm[1], pm[2]);
  }
}

// Extract ACHIEVEMENTS
const achievementIds = new Set<string>();
const achRe = /export const ACHIEVEMENTS[^=]*=\s*\[([\s\S]*?)\];/;
const achM = achRe.exec(gameDataSrc);
if (achM) {
  const achEntryRe = /\{\s*id:\s*'(\w+)'/g;
  let am: RegExpExecArray | null;
  while ((am = achEntryRe.exec(achM[1])) !== null) {
    achievementIds.add(am[1]);
  }
}

console.log(`  PETS: ${petIds.size}, ACHIEVEMENTS: ${achievementIds.size}`);

for (const [petId, achId] of petAchievements) {
  if (!achievementIds.has(achId)) {
    err(`Pet '${petId}' references achievement '${achId}' which doesn't exist`);
  }
}

// ── 3. Check for duplicate data definitions ──────────────────────────────────
console.log("\n📋 Checking for duplicate data...");

const skillsMeta = path.resolve("shared/game-data/skills-meta.ts");
if (fs.existsSync(skillsMeta)) {
  const meta = fs.readFileSync(skillsMeta, "utf-8");
  const dupes = ["ACHIEVEMENTS", "PETS", "ALL_TOOLS", "SHELTER_BUILDINGS", "HOMESTEAD_BUILDINGS"];
  for (const name of dupes) {
    if (meta.includes(`export const ${name}`) && gameDataSrc.includes(`export const ${name}`)) {
      warn(`Duplicate definition: ${name} exists in BOTH game-data.ts AND skills-meta.ts`);
    }
  }
}

// ── Summary ────────────────────────────────────────────────────────────────────
if (errors > 0) {
  console.log(`\n🔴 ${errors} recipe integrity error(s) found.`);
  process.exit(1);
} else {
  console.log("\n✅ All recipe integrity checks passed.");
  process.exit(0);
}
