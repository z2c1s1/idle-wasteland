// ═══════════════════════════════════════════════════════════════════════════════
// Spritesheet mapping — maps game entities to spritesheet.png coordinates
// ═══════════════════════════════════════════════════════════════════════════════

import manifest from "./spritesheet-manifest.json";

const CELL = 209; // px per cell in the spritesheet
const COLS = 6;

/** Get {x,y,w,h} pixel rect for a frame by its 1-based index (1-36) */
function frameRect(index: number) {
  const i = index - 1;
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  return { x: col * CELL, y: row * CELL, w: CELL, h: CELL };
}

// ─── Enemy mapping ────────────────────────────────────────────────────────────
// Map game enemy IDs to frame numbers (1-15)
export const ENEMY_FRAME: Record<string, number> = {
  rad_roach:      8,   // 08_toxic_beetle — beetle closest to roach
  rad_rat:        3,   // 03_rad_rat — perfect match
  stray_dog:      2,   // 02_mutant_hound — dog-like
  mutant_spider:  8,   // 08_toxic_beetle — insectoid
  zombie_walk:    1,   // 01_zombie — perfect match
  rad_scorpion:   9,   // 09_sandworm — burrowing creature
  ghoul_flesh:    4,   // 04_skeleton_warrior — undead
  mutant_hound:   2,   // 02_mutant_hound — perfect match
  bandit_scav:   11,   // 11_sniper — human enemy with gun
  rad_elemental: 13,   // 13_mushroom_mutant — weird mutated thing
  mutant_bear:   10,   // 10_mutant_brute — big brutish creature
  zombie_brute:   5,   // 05_toxic_brute — big undead
  wasteland_raider:11, // 11_sniper — human raider
  sentry_bot:     7,   // 07_steam_robot — perfect match
  rad_drake:     15,   // 15_demon — big scary creature
  deathclaw:     10,   // 10_mutant_brute — brute
  mutant_behemoth:10,  // 10_mutant_brute
  ancient_wraith:14,   // 14_dark_knight — dark figure
  warlord:       14,   // 14_dark_knight
  glowing_one:   13,   // 13_mushroom_mutant — glowing mutant
  elder_dragon:  15,   // 15_demon
  overlord:      15,   // 15_demon
};

// ─── Item/Equipment mapping ───────────────────────────────────────────────────
// Weapons: frames 16-26, Equipment: frames 27-36

import type { EquipmentSlot } from "@shared/game-data";

export const WEAPON_FRAME: Record<string, number> = {
  sword: 16, club: 19, dagger: 20, axe: 17,
  spear: 18, bow: 24, crossbow: 24, staff: 26,
  gun: 21, rifle: 23, shotgun: 22,
};

export const ARMOR_FRAME: Record<string, number> = {
  helmet: 27, chest: 30, legs: 0, // legs not in asset — use chest
  gloves: 31, boots: 32,
  offhand: 29, // spiked bracer as offhand/shield
  neck: 36, ring: 33,
};

/** Get frame index for an equipment slot */
export function getEquipFrame(slot: string, baseId?: string): number {
  // Check if it's a weapon type
  if (slot === 'weapon') {
    if (!baseId) return 16; // default sword
    const lc = baseId.toLowerCase();
    if (lc.includes('bow') || lc.includes('crossbow')) return 24;
    if (lc.includes('gun') || lc.includes('rifle')) return 23;
    if (lc.includes('shotgun')) return 22;
    if (lc.includes('revolver') || lc.includes('pistol')) return 21;
    if (lc.includes('staff') || lc.includes('wand') || lc.includes('codex')) return 26;
    if (lc.includes('axe') || lc.includes('cleaver')) return 17;
    if (lc.includes('spear')) return 18;
    if (lc.includes('dagger') || lc.includes('knife')) return 20;
    if (lc.includes('club') || lc.includes('mace') || lc.includes('hammer')) return 19;
    return 16; // default sword
  }
  return ARMOR_FRAME[slot] ?? 30; // default chest
}

// ─── Spritesheet renderer ─────────────────────────────────────────────────────

const SPRITESHEET_URL = "/spritesheet.png";

interface SpriteFrameProps {
  frameIndex: number;
  size?: number;
  className?: string;
}

/** Render a single frame from the spritesheet */
export function SpriteFrame({ frameIndex, size = 48, className = "" }: SpriteFrameProps) {
  const rect = frameRect(frameIndex);
  // Scale proportionally to fit the requested size
  const scale = size / CELL;
  const w = rect.w * scale;
  const h = rect.h * scale;

  return (
    <div
      style={{
        width: w,
        height: h,
        backgroundImage: `url(${SPRITESHEET_URL})`,
        backgroundPosition: `-${rect.x * scale}px -${rect.y * scale}px`,
        backgroundSize: `${CELL * COLS * scale}px auto`,
        imageRendering: "pixelated",
        flexShrink: 0,
      }}
      className={className}
    />
  );
}

// ─── Public helpers ───────────────────────────────────────────────────────────

/** Get enemy frame index, fallback to zombie (1) */
export function getEnemyFrame(enemyId: string): number {
  return ENEMY_FRAME[enemyId] ?? 1;
}

export { frameRect, CELL, COLS };
