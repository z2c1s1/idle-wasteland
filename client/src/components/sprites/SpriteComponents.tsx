// ═══════════════════════════════════════════════════════════════════════════════
// 像素精灵组件 — 8×8 / 10×10 像素矩阵渲染
// ═══════════════════════════════════════════════════════════════════════════════

import React from "react";
import type { SkillIconName, ResourceType } from "./spriteData";
import {
  ENEMY_PIXELS, ARCHETYPE_PIXEL_COLORS as COMBAT_COLORS,
  EQUIPMENT_PIXELS, ITEM_COLORS,
  SKILL_PIXELS, GEM_PIXEL,
  RESOURCE_PIXELS,
  type PixelColors,
} from "./spriteData";

/** Convert PixelColors object to string array for PixelGrid */
function toColors(pc: PixelColors): string[] {
  return ["#000000", pc.dark, pc.main, pc.light, pc.highlight, pc.eye];
}

/** Enemy ID → pixel archetype key */
const ENEMY_ARCHETYPE_MAP: Record<string, string> = {
  rad_roach: 'insect', mutant_spider: 'insect', rad_scorpion: 'insect',
  rad_rat: 'rodent', stray_dog: 'rodent',
  zombie_walk: 'undead', zombie_brute: 'undead', ghoul_flesh: 'undead',
  mutant_hound: 'mutant', mutant_bear: 'mutant', mutant_behemoth: 'mutant',
  bandit_scav: 'humanoid', wasteland_raider: 'humanoid', warlord: 'humanoid',
  sentry_bot: 'mech',
  rad_elemental: 'dragon', rad_drake: 'dragon', elder_dragon: 'dragon',
  deathclaw: 'boss', glowing_one: 'boss', ancient_wraith: 'boss', overlord: 'boss',
};

const SLOT_SHAPE: Record<string, string> = {
  weapon: 'sword', offhand: 'shield',
  helmet: 'helmet', chest: 'chest', legs: 'legs',
  gloves: 'gloves', boots: 'boots',
  neck: 'neck', ring: 'ring',
};

// ─── 通用像素渲染器 ──────────────────────────────────────────────────────────

function PixelGrid({ pixels, colors, cellSize = 3, className = "" }: {
  pixels: number[][]; colors: string[]; cellSize?: number; className?: string;
}) {
  const h = pixels.length;
  const w = pixels[0]?.length ?? 0;
  const els: React.ReactNode[] = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const ci = pixels[y]![x]!;
      if (ci === 0) continue;
      els.push(
        <rect key={`${y}-${x}`} x={x * cellSize} y={y * cellSize}
          width={cellSize} height={cellSize} fill={colors[ci] ?? colors[1]!} />
      );
    }
  }
  return (
    <svg viewBox={`0 0 ${w * cellSize} ${h * cellSize}`}
      width={w * cellSize} height={h * cellSize} className={className}
      style={{ display: "block", imageRendering: "pixelated" }}
      shapeRendering="crispEdges"
    >
      {els}
    </svg>
  );
}

// ─── EnemySprite ──────────────────────────────────────────────────────────────

interface EnemySpriteProps { enemyId: string; size?: number; className?: string; }

export function EnemySprite({ enemyId, size = 48, className = "" }: EnemySpriteProps) {
  const arch = ENEMY_ARCHETYPE_MAP[enemyId] ?? 'humanoid';
  const pixels = ENEMY_PIXELS[arch] ?? ENEMY_PIXELS['humanoid']!;
  const pc = COMBAT_COLORS[arch] ?? COMBAT_COLORS['humanoid']!;
  const cs = Math.max(2, Math.floor(size / pixels.length));
  return <PixelGrid pixels={pixels} colors={toColors(pc)} cellSize={cs} className={className} />;
}

// ─── ItemSprite ───────────────────────────────────────────────────────────────

interface ItemSpriteProps {
  slot: string; baseId?: string; rarity?: string; ilvl?: number;
  size?: number; className?: string;
}

export function ItemSprite({ slot, baseId, rarity = 'common', ilvl = 5, size = 32, className = "" }: ItemSpriteProps) {
  const shape = SLOT_SHAPE[slot] ?? 'sword';
  const pixels = EQUIPMENT_PIXELS[shape] ?? EQUIPMENT_PIXELS['sword']!;
  const tier = Math.min(6, Math.floor(ilvl / 15));
  const pc = ITEM_COLORS[tier] ?? ITEM_COLORS[0]!;
  const cs = Math.max(2, Math.floor(size / pixels.length));
  return <PixelGrid pixels={pixels} colors={toColors(pc)} cellSize={cs} className={className} />;
}

// ─── GemSprite ────────────────────────────────────────────────────────────────

interface GemSpriteProps { gemKey: string; size?: number; className?: string; }

const GEM_COLOR_MAP: Record<string, string[]> = {
  ruby:     ["#0000", "#991122", "#CC2244", "#FF4466", "#FF8899"],
  sapphire: ["#0000", "#112299", "#2244BB", "#4466DD", "#88AAFF"],
  emerald:  ["#0000", "#116622", "#228833", "#44BB55", "#88DD99"],
  diamond:  ["#0000", "#8899AA", "#AABBCC", "#CCDDEE", "#FFFFFF"],
  amethyst: ["#0000", "#551188", "#7722AA", "#9944CC", "#BB88EE"],
  topaz:    ["#0000", "#996600", "#BB8811", "#DDAA22", "#FFCC44"],
};

export function GemSprite({ gemKey, size = 24, className = "" }: GemSpriteProps) {
  const colors = GEM_COLOR_MAP[gemKey] ?? ["#0000", "#888", "#aaa", "#ccc", "#fff"];
  const cs = Math.max(2, Math.floor(size / GEM_PIXEL.length));
  return <PixelGrid pixels={GEM_PIXEL} colors={colors} cellSize={cs} className={className} />;
}

// ─── SkillSprite ──────────────────────────────────────────────────────────────

interface SkillSpriteProps { skill: SkillIconName; size?: number; className?: string; }

const SKILL_COLOR_MAP: Record<string, string[]> = {
  woodcutting: ["#0000", "#228B22", "#32CD32", "#90EE90"],
  mining: ["#0000", "#8B8682", "#A9A9A9", "#D3D3D3"],
  smelting: ["#0000", "#FF8C00", "#FFA500", "#FFD700"],
  fishing: ["#0000", "#4169E1", "#6495ED", "#87CEEB"],
  hunting: ["#0000", "#8B4513", "#A0522D", "#CD853F"],
  smithing: ["#0000", "#708090", "#A0A0B0", "#D0D0E0"],
  combat: ["#0000", "#DC143C", "#FF4444", "#FF8888"],
  thieving: ["#0000", "#4B0082", "#8A2BE2", "#BA55D3"],
  agility: ["#0000", "#00CED1", "#20B2AA", "#7FFFD4"],
  exploration: ["#0000", "#8B6914", "#DAA520", "#FFD700"],
  homestead: ["#0000", "#8B7355", "#A08060", "#D2B48C"],
  cooking: ["#0000", "#FF6347", "#FF7F50", "#FFA07A"],
  alchemy: ["#0000", "#9932CC", "#BA55D3", "#DDA0DD"],
  prayer: ["#0000", "#FFD700", "#FFF8DC", "#FFFFF0"],
};

export function SkillSprite({ skill, size = 20, className = "" }: SkillSpriteProps) {
  const pixels = SKILL_PIXELS[skill] ?? SKILL_PIXELS.dashboard;
  const colors = SKILL_COLOR_MAP[skill] ?? ["#0000", "#888", "#aaa", "#ddd"];
  const cs = Math.max(2, Math.floor(size / pixels.length));
  return <PixelGrid pixels={pixels} colors={colors} cellSize={cs} className={className} />;
}

// ─── ResourceIcon ─────────────────────────────────────────────────────────────

const RESOURCE_COLORS: Record<string, string[]> = {
  wood: ["#0000", "#8B4513", "#A0522D", "#DEB887"],
  ore: ["#0000", "#696969", "#808080", "#C0C0C0"],
  bar: ["#0000", "#CD853F", "#DAA520", "#FFD700"],
  fish: ["#0000", "#4682B4", "#5F9EA0", "#87CEEB"],
  hide: ["#0000", "#8B4513", "#A0522D", "#D2691E"],
  herb: ["#0000", "#228B22", "#32CD32", "#90EE90"],
  berry: ["#0000", "#8B008B", "#9932CC", "#DA70D6"],
  stone: ["#0000", "#808080", "#A9A9A9", "#D3D3D3"],
  bone: ["#0000", "#F5DEB3", "#FAEBD7", "#FFF8DC"],
  gold: ["#0000", "#B8860B", "#DAA520", "#FFD700"],
  agility: ["#0000", "#00CED1", "#48D1CC", "#AFEEEE"],
  exploration: ["#0000", "#8B6914", "#DAA520", "#F0E68C"],
  craft: ["#0000", "#8B7355", "#A08060", "#DEB887"],
};

interface ResourceIconProps { type: ResourceType; size?: number; className?: string; }

export function ResourceIcon({ type, size = 20, className = "" }: ResourceIconProps) {
  const pixels = RESOURCE_PIXELS[type] ?? RESOURCE_PIXELS.wood;
  const colors = RESOURCE_COLORS[type] ?? ["#0000", "#888", "#aaa", "#ddd"];
  const cs = Math.max(2, Math.floor(size / pixels.length));
  return <PixelGrid pixels={pixels} colors={colors} cellSize={cs} className={className} />;
}

// ─── 装饰精灵 ─────────────────────────────────────────────────────────────────

const DECO_PIXELS = {
  radiation: [
    [0,0,0,2,2,0,0,0],
    [0,0,2,1,1,2,0,0],
    [0,2,1,2,2,1,2,0],
    [2,1,2,1,1,2,1,2],
    [2,1,2,1,1,2,1,2],
    [0,2,1,2,2,1,2,0],
    [0,0,2,1,1,2,0,0],
    [0,0,0,2,2,0,0,0],
  ],
  spark: [
    [0,0,0,2,0,0,0],
    [0,0,2,1,2,0,0],
    [0,2,1,3,1,2,0],
    [2,1,3,3,3,1,2],
    [0,2,1,3,1,2,0],
    [0,0,2,1,2,0,0],
    [0,0,0,2,0,0,0],
  ],
};

const DECO_COLORS_radiation = ["#0000", "#FFD700", "#FFA500", "#FF8C00"];
const DECO_COLORS_spark = ["#0000", "#FFFF00", "#FFD700", "#FFFFFF"];

export function RadiationIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  const cs = Math.max(2, Math.floor(size / 8));
  return <PixelGrid pixels={DECO_PIXELS.radiation} colors={DECO_COLORS_radiation} cellSize={cs} className={className} />;
}

export function SparkIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  const cs = Math.max(2, Math.floor(size / 7));
  return <PixelGrid pixels={DECO_PIXELS.spark} colors={DECO_COLORS_spark} cellSize={cs} className={className} />;
}

const SKULL_PIXEL: number[][] = [
  [0,1,1,1,0,1,1,1,0],
  [1,2,2,2,1,2,2,2,1],
  [1,2,3,2,2,2,3,2,1],
  [0,1,2,2,2,2,2,1,0],
  [0,0,1,2,2,2,1,0,0],
  [0,0,0,1,1,1,0,0,0],
  [0,0,0,1,2,1,0,0,0],
  [0,0,1,0,0,0,1,0,0],
];
const SKULL_COLORS = ["#0000", "#cccccc", "#aaaaaa", "#ffffff"];

export function SkullIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  const cs = Math.max(2, Math.floor(size / 9));
  return <PixelGrid pixels={SKULL_PIXEL} colors={SKULL_COLORS} cellSize={cs} className={className} />;
}
