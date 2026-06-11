// ═══════════════════════════════════════════════════════════════════════════════
// 像素精灵组件 — 优先使用 spritesheet PNG，回退到 SVG 像素生成
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
import { getEnemyFrame, getEquipFrame, ENEMY_FRAME, SpriteFrame } from "./SpritesheetSprite";

// Atlas-order tile filenames (1-105)
const TILE_FILES = [
  '001_废木板','002_枯树枝','003_焦木','004_铁线木','005_石化木',
  '006_辐射瘤木','007_骨白杉','008_黑钢木','009_泰坦木','010_核融晶木',
  '011_废铁块','012_铜丝矿','013_铝罐矿','014_铅块','015_硫磺矿',
  '016_硝酸盐矿','017_铀矿石','018_钛金矿','019_钨钢矿','020_铱金矿',
  '021_辐射蝌蚪','022_癞皮鱼','023_电鳗仔','024_刺鳍鱼','025_肿眼鲶',
  '026_荧光鳗','027_铁甲鱼','028_双头鲨','029_深渊巨口','030_核融鲸',
  '031_辐射鼠','032_变异兔','033_铁鳞蜥','034_疯犬','035_钢鬃猪',
  '036_双头鹿','037_灰熊','038_辐射蝎','039_死亡爪','040_巨兽',
  '041_辐射鼠皮','042_变异兔皮','043_铁鳞蜥皮','044_疯犬皮','045_钢鬃猪皮',
  '046_双头鹿皮','047_灰熊厚皮','048_辐射蝎壳','049_死亡爪皮','050_巨兽硬皮',
  '051_辐射鼠肉','052_变异兔肉','053_铁鳞蜥肉','054_疯犬肉','055_钢鬃猪肉',
  '056_双头鹿肉','057_灰熊肉','058_辐射蝎肉','059_死亡爪肉','060_巨兽肉',
  '061_流浪汉','062_废墟乞丐','063_废品商人','064_废土行商','065_黑市走私犯',
  '066_废土掠夺者','067_废土商人','068_废土军阀','069_避难所银行家','070_废土统治者',
  '071_废铁锭','072_铜丝锭','073_铝罐锭','074_铅锭','075_硫磺锭',
  '076_硝酸盐锭','077_铀锭','078_钛金锭','079_钨钢锭','080_铱金锭',
  '081_蓝莓','082_树莓','083_接骨木莓','084_黑莓','085_枸杞',
  '086_夜光莓','087_魔法莓','088_远古莓','089_蔓越莓','090_日光莓',
  '091_灵魂莓','092_月光莓','093_蒲公英','094_薄荷','095_迷迭香',
  '096_金盏花','097_人参','098_百里香','099_灵芝','100_龙草',
  '101_龙血果','102_骨头','103_龙骨','104_木材','105_石料',
];
const CAT_START: Record<string, number> = { wood:0, ore:10, fish:20, animal:30, hide:40, meat:50, npc:60, ingot:70, berry:80, herb:92, material:100 };
const PREFIX_MAP: Record<string, string> = { wood:'wood', ore:'ore', fish:'fish', hide:'hide', meat:'meat', animal:'animal', bar:'ingot' };

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
  // Use spritesheet PNG if mapped
  const frame = ENEMY_FRAME[enemyId];
  if (frame) {
    return <SpriteFrame frameIndex={frame} size={size} className={className} />;
  }
  // Fallback to SVG pixel art
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

// Rarity → pixel color mapping (matches RARITY_COLOR text colors)
const RARITY_PIXEL: Record<string, number> = {
  common: 1, uncommon: 2, rare: 6, epic: 4, legendary: 5, mythic: 5,
};

export function ItemSprite({ slot, baseId, rarity = 'common', ilvl = 5, size = 32, className = "" }: ItemSpriteProps) {
  // Check if a PNG tile exists for this item
  const [imgSrc, setImgSrc] = React.useState<string | null>(null);
  const [imgFailed, setImgFailed] = React.useState(false);

  React.useEffect(() => {
    if (!baseId || typeof baseId !== 'string') { setImgFailed(true); return; }
    const tileName = baseId;
    // Try /tiles/ first, then /equipment_tiles/
    const probe = new Image();
    probe.onload = () => setImgSrc(`/tiles/${tileName}.png`);
    probe.onerror = () => {
      const probe2 = new Image();
      probe2.onload = () => setImgSrc(`/equipment_tiles/${tileName}.png`);
      probe2.onerror = () => setImgFailed(true);
      probe2.src = `/equipment_tiles/${tileName}.png`;
    };
    probe.src = `/tiles/${tileName}.png`;
  }, [baseId]);

  if (imgSrc && !imgFailed) {
    return <img src={imgSrc} alt="" width={size} height={size}
      style={{ imageRendering: 'pixelated' }} className={className} />;
  }
  if (imgFailed || !baseId) {
    // Fallback: spritesheet or SVG
    const frame = getEquipFrame(slot, baseId as string);
    if (frame) return <SpriteFrame frameIndex={frame} size={size} className={className} />;
    const shape = SLOT_SHAPE[slot] ?? 'sword';
    const pixels = EQUIPMENT_PIXELS[shape] ?? EQUIPMENT_PIXELS['sword']!;
    const ci = RARITY_PIXEL[rarity] ?? 1;
    const pc = ITEM_COLORS[ci] ?? ITEM_COLORS[1]!;
    const cs = Math.max(2, Math.floor(size / pixels.length));
    return <PixelGrid pixels={pixels} colors={toColors(pc)} cellSize={cs} className={className} />;
  }
  // Loading state — show a placeholder
  return <div style={{ width: size, height: size, background: '#222' }} className={className} />;
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

interface ResourceIconProps { type: ResourceType; size?: number; className?: string; tier?: number; resourceKey?: string; }

export function ResourceIcon({ type, size = 20, className = "", tier = 0, resourceKey }: ResourceIconProps) {
  // Try PNG from tiles directory
  const key = resourceKey || `${type}_${tier}`;
  let tileIdx: number | null = null;
  
  // Match by resource key pattern
  const m = key.match(/^([a-z]+)_(\d+)$/);
  if (m) {
    const cat = type === 'animal' ? 'animal' : (PREFIX_MAP[m[1]]);
    if (cat && CAT_START[cat] !== undefined) {
      tileIdx = CAT_START[cat] + parseInt(m[2]);
    }
  }
  // Special cases
  if (key === 'bones') tileIdx = 101;
  if (key === 'dragonBones') tileIdx = 102;
  
  if (tileIdx !== null && tileIdx >= 0 && tileIdx < TILE_FILES.length && typeof window !== 'undefined') {
    const filename = TILE_FILES[tileIdx] + '.png';
    return (
      <img src={`/tiles/${filename}`} alt="" className={className}
        style={{ width: size, height: size, imageRendering: 'pixelated', flexShrink: 0 }} />
    );
  }

  // Fallback to pixel SVG
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
