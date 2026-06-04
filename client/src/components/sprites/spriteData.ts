// ═══════════════════════════════════════════════════════════════════════════════
// SVG 精灵数据 — 废土辐射主题，几何化简约风
// ═══════════════════════════════════════════════════════════════════════════════

// ─── 敌人类型 → 颜色 + 形状模板 ─────────────────────────────────────────────

export type EnemyArchetype = 'insect' | 'rodent' | 'humanoid' | 'mutant' | 'mech' | 'dragon' | 'undead' | 'boss';

export const ENEMY_ARCHETYPE_MAP: Record<string, EnemyArchetype> = {
  // 昆虫型
  rad_roach: 'insect', mutant_worm: 'insect', giant_spider: 'insect', rad_scorpion: 'insect',
  // 鼠型
  rad_rat: 'rodent', mole_rat: 'rodent',
  // 人型
  raider: 'humanoid', raider_brute: 'humanoid', bandit: 'humanoid', mercenary: 'humanoid',
  scavenger: 'humanoid', wasteland_warrior: 'humanoid',
  // 变异体
  mutant_hound: 'mutant', mutant_bear: 'mutant', ghoul: 'mutant', glowing_one: 'mutant',
  mutant_ogre: 'mutant', mutant_behemoth: 'mutant',
  // 机械
  sentry_bot: 'mech', assaultron: 'mech', robobrain: 'mech',
  // 龙型
  rad_drake: 'dragon', fire_drake: 'dragon', elder_dragon: 'dragon',
  // 亡灵
  skeleton: 'undead', wraith: 'undead', lich: 'undead', deathclaw: 'undead',
  // Boss
  warlord: 'boss', behemoth: 'boss', ancient_horror: 'boss', overlord: 'boss',
};

export const ARCHETYPE_COLORS: Record<EnemyArchetype, { primary: string; secondary: string; eye: string }> = {
  insect:   { primary: '#4a7c3f', secondary: '#2d4f25', eye: '#ff4444' },
  rodent:   { primary: '#8b7355', secondary: '#5c4a35', eye: '#ffcc00' },
  humanoid: { primary: '#6b5b4f', secondary: '#4a3f35', eye: '#cc3333' },
  mutant:   { primary: '#5b8c3e', secondary: '#3a5c28', eye: '#00ff88' },
  mech:     { primary: '#7a8a8a', secondary: '#4a5555', eye: '#ff4444' },
  dragon:   { primary: '#8b4513', secondary: '#5c2d0a', eye: '#ff8800' },
  undead:   { primary: '#9b9b9b', secondary: '#6b6b6b', eye: '#00ffff' },
  boss:     { primary: '#cc3333', secondary: '#881111', eye: '#ffff00' },
};

// ─── 装备类型 → SVG 路径 ────────────────────────────────────────────────────

export type EquipmentShape = 'sword' | 'axe' | 'bow' | 'staff' | 'helmet' | 'chest' | 'legs' | 'gloves' | 'boots' | 'neck' | 'ring';

/** 装备槽 → 形状映射 */
export const SLOT_SHAPE: Record<string, EquipmentShape> = {
  weapon: 'sword', offhand: 'axe',
  helmet: 'helmet', chest: 'chest', legs: 'legs',
  gloves: 'gloves', boots: 'boots',
  neck: 'neck', ring: 'ring',
};

/** 稀有度 → 边框颜色 + 发光 */
export const RARITY_GLOW: Record<string, { stroke: string; glow: string }> = {
  common:    { stroke: '#888888', glow: 'none' },
  uncommon:  { stroke: '#4488ff', glow: '0 0 4px #4488ff44' },
  rare:      { stroke: '#ffcc00', glow: '0 0 6px #ffcc0044' },
  epic:      { stroke: '#cc88ff', glow: '0 0 8px #cc88ff66' },
  legendary: { stroke: '#ff8844', glow: '0 0 10px #ff884488' },
  mythic:    { stroke: '#ff4444', glow: '0 0 14px #ff4444aa' },
};

// ─── 装备 SVG 路径数据 ──────────────────────────────────────────────────────

export interface SpriteDef {
  viewBox: string;
  paths: { d: string; fill?: string; stroke?: string; strokeWidth?: number; opacity?: number }[];
}

export const EQUIPMENT_SPRITES: Record<EquipmentShape, SpriteDef> = {
  sword: {
    viewBox: "0 0 32 32",
    paths: [
      { d: "M16 2 L18 12 L18 24 L16 28 L14 24 L14 12 Z", fill: "currentColor" },
      { d: "M12 22 L20 22 L20 24 L12 24 Z", fill: "#888" },
    ],
  },
  axe: {
    viewBox: "0 0 32 32",
    paths: [
      { d: "M16 2 L16 22 L22 18 L26 20 L22 24 L16 22 Z", fill: "currentColor" },
      { d: "M6 24 L22 24 L22 26 L6 26 Z", fill: "#8b7355" },
    ],
  },
  bow: {
    viewBox: "0 0 32 32",
    paths: [
      { d: "M6 28 Q16 4 26 28", fill: "none", stroke: "currentColor", strokeWidth: 2 },
      { d: "M16 28 L16 8 M6 28 L16 24 L26 28", fill: "none", stroke: "currentColor", strokeWidth: 1 },
    ],
  },
  staff: {
    viewBox: "0 0 32 32",
    paths: [
      { d: "M16 2 L16 28 M10 4 Q16 8 22 4", fill: "none", stroke: "currentColor", strokeWidth: 2 },
      { d: "M14 28 L18 28 L16 22 Z", fill: "currentColor" },
    ],
  },
  helmet: {
    viewBox: "0 0 32 32",
    paths: [
      { d: "M6 20 Q6 8 16 6 Q26 8 26 20 L22 22 L22 26 L10 26 L10 22 Z", fill: "currentColor" },
      { d: "M12 22 L20 22", fill: "none", stroke: "#0003", strokeWidth: 1 },
    ],
  },
  chest: {
    viewBox: "0 0 32 32",
    paths: [
      { d: "M8 4 L24 4 L26 20 L20 28 L12 28 L6 20 Z", fill: "currentColor" },
      { d: "M14 4 L16 20 L18 4", fill: "none", stroke: "#0002", strokeWidth: 1 },
    ],
  },
  legs: {
    viewBox: "0 0 32 32",
    paths: [
      { d: "M10 2 L14 2 L14 16 L12 28 L8 28 L10 16 Z", fill: "currentColor" },
      { d: "M18 2 L22 2 L22 16 L20 28 L24 28 L22 16 Z", fill: "currentColor" },
    ],
  },
  gloves: {
    viewBox: "0 0 32 32",
    paths: [
      { d: "M4 10 L8 12 L8 18 L12 22 L12 28 L8 28 L6 18 Z", fill: "currentColor" },
      { d: "M20 10 L24 12 L24 18 L28 22 L28 28 L24 28 L22 18 Z", fill: "currentColor" },
    ],
  },
  boots: {
    viewBox: "0 0 32 32",
    paths: [
      { d: "M6 12 L10 12 L10 22 L28 22 L28 28 L6 28 Z", fill: "currentColor" },
      { d: "M24 16 L28 16 L28 22 L24 22 Z", fill: "#0003" },
      { d: "M10 12 L10 22 L28 22 L28 28 L6 28 L6 12 Z", fill: "none", stroke: "#0003", strokeWidth: 0.5 },
    ],
  },
  neck: {
    viewBox: "0 0 32 32",
    paths: [
      { d: "M10 8 Q16 4 22 8 L20 14 Q16 18 12 14 Z", fill: "none", stroke: "currentColor", strokeWidth: 2 },
      { d: "M10 24 Q16 16 22 24 Q16 20 10 24 Z", fill: "currentColor" },
    ],
  },
  ring: {
    viewBox: "0 0 32 32",
    paths: [
      { d: "M16 4 Q24 4 24 12 Q24 24 16 28 Q8 24 8 12 Q8 4 16 4 Z", fill: "none", stroke: "currentColor", strokeWidth: 3 },
      { d: "M16 10 Q20 10 20 14 Q20 18 16 18 Q12 18 12 14 Q12 10 16 10 Z", fill: "currentColor", opacity: 0.6 },
    ],
  },
};

// ─── 武器类型（根据 baseId 关键词检测）──────────────────────────────────────

export function detectWeaponShape(baseId: string): EquipmentShape {
  if (/bow|rifle|shotgun|sniper|crossbow/i.test(baseId)) return 'bow';
  if (/staff|wand|rod|scept/i.test(baseId)) return 'staff';
  if (/axe|hatchet|cleaver/i.test(baseId)) return 'axe';
  return 'sword';
}

// ─── Tier → 颜色渐变（铜→铁→钢→秘银→精金→符文→龙）───────────────────────

const TIER_COLORS = [
  '#cd7f32', // 铜
  '#c0c0c0', // 铁
  '#8899aa', // 钢
  '#aaddff', // 秘银
  '#ffdd88', // 精金
  '#ff6644', // 符文
  '#ff4488', // 龙
];

export function tierColor(ilvl: number): string {
  const idx = Math.min(6, Math.floor(ilvl / 15));
  return TIER_COLORS[idx] ?? '#c0c0c0';
}

// ─── 技能图标 → SVG 路径 ────────────────────────────────────────────────────

export type SkillIconName = 'woodcutting' | 'mining' | 'smelting' | 'fishing' | 'hunting' | 'thieving'
  | 'smithing' | 'leatherworking' | 'jewelcrafting' | 'combat' | 'agility' | 'exploration'
  | 'cooking' | 'alchemy' | 'prayer' | 'homestead' | 'town' | 'inventory' | 'gems'
  | 'talents' | 'equipment' | 'wasteland' | 'dashboard';

export const SKILL_SPRITES: Record<SkillIconName, SpriteDef> = {
  woodcutting: {
    viewBox: "0 0 24 24",
    paths: [{ d: "M12 2 L14 8 L12 10 L10 8 Z M14 8 L16 16 L12 22 L8 16 L10 8 Z M8 16 L6 20 L12 22 L18 20 L16 16", fill: "currentColor" }],
  },
  mining: {
    viewBox: "0 0 24 24",
    paths: [{ d: "M12 2 L12 14 L6 18 L12 22 L18 18 L12 14 M18 18 L20 14 L18 10 L14 8", fill: "none", stroke: "currentColor", strokeWidth: 2 }],
  },
  smelting: {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M4 20 L8 12 L16 12 L20 20 Z", fill: "currentColor", opacity: 0.5 },
      { d: "M8 12 Q12 4 16 12 M10 8 Q12 2 14 8", fill: "none", stroke: "currentColor", strokeWidth: 1.5 },
    ],
  },
  fishing: {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M4 18 L20 4 M16 4 L20 4 L20 8", fill: "none", stroke: "currentColor", strokeWidth: 2 },
      { d: "M4 18 L4 22 L8 22", fill: "none", stroke: "currentColor", strokeWidth: 1.5 },
    ],
  },
  hunting: {
    viewBox: "0 0 24 24",
    paths: [{ d: "M4 20 L8 14 L12 16 L16 10 L20 12 L18 6 L12 8 L14 12 L10 10 L6 16 Z", fill: "currentColor" }],
  },
  thieving: {
    viewBox: "0 0 24 24",
    paths: [{ d: "M12 2 Q16 4 14 8 Q12 6 10 8 Q8 4 12 2 Z M8 8 Q4 12 6 18 Q8 14 10 16 Q12 12 8 8 Z M16 8 Q20 12 18 18 Q16 14 14 16 Q12 12 16 8 Z", fill: "currentColor", opacity: 0.8 }],
  },
  smithing: {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M4 20 L6 16 L18 16 L20 20 Z", fill: "currentColor" },
      { d: "M6 16 L12 8 L18 16 M12 8 L12 4 M10 4 L14 4", fill: "none", stroke: "currentColor", strokeWidth: 1.5 },
    ],
  },
  leatherworking: {
    viewBox: "0 0 24 24",
    paths: [{ d: "M6 4 L10 4 L8 8 L14 12 L10 16 L14 20 L10 22 L4 18 Z M14 8 L20 4 L22 10 L18 12 Z", fill: "currentColor", opacity: 0.7 }],
  },
  jewelcrafting: {
    viewBox: "0 0 24 24",
    paths: [{ d: "M12 2 L16 8 L12 12 L8 8 Z M16 8 L20 16 L12 22 L4 16 L8 8 L12 12 L16 8 Z", fill: "none", stroke: "currentColor", strokeWidth: 1.5 }],
  },
  combat: {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M6 20 L10 8 L14 8 L18 20 L14 18 L12 14 L10 18 Z", fill: "currentColor" },
      { d: "M10 8 L12 4 L14 8 M6 14 L2 16 M18 14 L22 16", fill: "none", stroke: "currentColor", strokeWidth: 1.5 },
    ],
  },
  agility: {
    viewBox: "0 0 24 24",
    paths: [{ d: "M4 20 Q6 12 12 14 Q18 12 20 20 M12 14 L12 4 M8 4 L16 4 M12 4 Q8 8 10 10 Q12 8 14 10 Q16 8 12 4", fill: "none", stroke: "currentColor", strokeWidth: 1.5 }],
  },
  exploration: {
    viewBox: "0 0 24 24",
    paths: [{ d: "M4 20 L4 8 L12 4 L20 8 L20 20 L12 16 L4 20 Z M20 8 L12 12 L4 8 M12 4 L12 16", fill: "none", stroke: "currentColor", strokeWidth: 1.5 }],
  },
  cooking: {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M6 16 Q12 10 18 16 L16 22 L8 22 Z", fill: "currentColor", opacity: 0.5 },
      { d: "M10 10 L14 10 M12 8 L12 4 M10 4 L14 4", fill: "none", stroke: "currentColor", strokeWidth: 1.5 },
    ],
  },
  alchemy: {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M10 4 L14 4 L14 10 L18 16 L6 16 L10 10 Z", fill: "none", stroke: "currentColor", strokeWidth: 1.5 },
      { d: "M8 18 L16 18 L14 22 L10 22 Z", fill: "currentColor", opacity: 0.3 },
    ],
  },
  prayer: {
    viewBox: "0 0 24 24",
    paths: [{ d: "M8 22 L16 22 L12 16 Z M12 16 L12 4 M8 8 L16 8 M6 12 L18 12 M4 16 L20 16", fill: "none", stroke: "currentColor", strokeWidth: 1.5 }],
  },
  homestead: {
    viewBox: "0 0 24 24",
    paths: [{ d: "M4 18 L12 8 L20 18 L18 18 L18 22 L6 22 L6 18 Z M10 22 L10 18 L14 18 L14 22", fill: "none", stroke: "currentColor", strokeWidth: 1.5 }],
  },
  town: {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M4 18 L8 12 L12 18 L16 12 L20 18 L18 22 L6 22 Z", fill: "none", stroke: "currentColor", strokeWidth: 1.5 },
      { d: "M8 22 L8 18 L10 18 L10 22 M14 22 L14 18 L16 18 L16 22", fill: "none", stroke: "currentColor", strokeWidth: 1 },
    ],
  },
  inventory: {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M6 4 L18 4 L20 8 L20 20 L4 20 L4 8 Z", fill: "none", stroke: "currentColor", strokeWidth: 1.5 },
      { d: "M6 4 L6 8 L18 8 L18 4 M10 8 L10 12 L14 12 L14 8", fill: "none", stroke: "currentColor", strokeWidth: 1.5 },
    ],
  },
  gems: {
    viewBox: "0 0 24 24",
    paths: [{ d: "M12 2 L18 8 L12 14 L6 8 Z M12 14 L18 8 L20 16 L12 22 L4 16 L6 8 Z", fill: "none", stroke: "currentColor", strokeWidth: 1.5 }],
  },
  talents: {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M12 2 L20 8 L20 16 L12 22 L4 16 L4 8 Z", fill: "none", stroke: "currentColor", strokeWidth: 1.5 },
      { d: "M12 8 L16 12 M12 8 L8 12 M12 16 L16 12 M12 16 L8 12", fill: "none", stroke: "currentColor", strokeWidth: 1 },
    ],
  },
  equipment: {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M12 2 L16 6 L16 10 L12 12 L8 10 L8 6 Z M14 6 L16 6 L18 4 M10 6 L8 6 L6 4", fill: "none", stroke: "currentColor", strokeWidth: 1.5 },
      { d: "M8 10 L10 12 L8 16 L6 14 Z M16 10 L14 12 L16 16 L18 14 Z", fill: "currentColor", opacity: 0.4 },
    ],
  },
  wasteland: {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M12 2 Q18 6 16 12 Q14 16 12 20 Q10 16 8 12 Q6 6 12 2 Z", fill: "currentColor", opacity: 0.3 },
      { d: "M12 2 Q18 6 16 12 Q14 16 12 20", fill: "none", stroke: "currentColor", strokeWidth: 2 },
      { d: "M4 22 L8 18 M20 22 L16 18 M12 20 L12 22", fill: "none", stroke: "currentColor", strokeWidth: 1.5 },
    ],
  },
  dashboard: {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M4 4 L20 4 L20 20 L4 20 Z", fill: "none", stroke: "currentColor", strokeWidth: 1.5 },
      { d: "M8 12 L12 8 L16 12 L14 16 L10 16 Z", fill: "currentColor", opacity: 0.4 },
    ],
  },
};

// ─── 宝石 → 颜色映射 ────────────────────────────────────────────────────────

export const GEM_COLORS: Record<string, string> = {
  ruby: '#ff2244', sapphire: '#2266ff', emerald: '#22cc44',
  diamond: '#aaddff', amethyst: '#9944ff', topaz: '#ffaa00',
};

// ─── 资源图标 ────────────────────────────────────────────────────────────────

export type ResourceType = 'wood' | 'ore' | 'bar' | 'fish' | 'hide' | 'herb' | 'berry' | 'stone' | 'bone' | 'gold';

export const RESOURCE_SPRITES: Record<ResourceType, SpriteDef> = {
  wood: {
    viewBox: "0 0 24 24",
    paths: [{ d: "M12 2 L16 8 L14 12 L18 16 L14 22 L10 22 L6 16 L10 12 L8 8 Z", fill: "currentColor" }],
  },
  ore: {
    viewBox: "0 0 24 24",
    paths: [{ d: "M6 12 L12 6 L18 12 L16 18 L8 18 Z M12 6 L16 10 L14 14 L10 14 L8 10 Z", fill: "none", stroke: "currentColor", strokeWidth: 1.5 }],
  },
  bar: {
    viewBox: "0 0 24 24",
    paths: [{ d: "M6 8 L18 8 L18 18 L6 18 Z M10 4 L14 4 L14 8 L10 8 Z", fill: "currentColor", opacity: 0.8 }],
  },
  fish: {
    viewBox: "0 0 24 24",
    paths: [{ d: "M6 12 Q12 4 20 10 Q12 8 6 12 Z M20 10 Q12 16 6 12 Q12 12 20 10 Z M20 10 L22 8 L22 12 Z", fill: "currentColor" }],
  },
  hide: {
    viewBox: "0 0 24 24",
    paths: [{ d: "M4 8 Q8 4 12 8 Q16 4 20 8 L18 18 Q12 20 6 18 Z", fill: "currentColor", opacity: 0.6 }],
  },
  herb: {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M12 22 L12 8 M12 8 Q14 4 18 4 Q12 6 12 8 Q12 6 6 4 Q10 4 12 8", fill: "none", stroke: "currentColor", strokeWidth: 1.5 },
      { d: "M8 14 L16 14 M7 18 L17 18", fill: "none", stroke: "currentColor", strokeWidth: 1 },
    ],
  },
  berry: {
    viewBox: "0 0 24 24",
    paths: [{ d: "M10 16 Q7 12 10 8 Q13 6 16 8 Q19 12 16 16 Q13 18 10 16 Z M16 8 L18 4 L14 4 Z", fill: "currentColor" }],
  },
  stone: {
    viewBox: "0 0 24 24",
    paths: [{ d: "M6 14 L10 10 L14 14 L18 10 L20 16 L16 20 L8 20 L4 16 Z", fill: "currentColor", opacity: 0.7 }],
  },
  bone: {
    viewBox: "0 0 24 24",
    paths: [{ d: "M6 10 Q4 12 6 14 L18 14 Q20 12 18 10 L6 10 Z M6 10 Q8 6 6 4 M18 10 Q16 6 18 4", fill: "currentColor", opacity: 0.7 }],
  },
  gold: {
    viewBox: "0 0 24 24",
    paths: [{ d: "M12 2 Q18 4 20 12 Q18 20 12 22 Q6 20 4 12 Q6 4 12 2 Z", fill: "currentColor" }],
  },
};

// ─── 辐射主题粒子 / 装饰 SVG ───────────────────────────────────────────────

export const DECORATION = {
  radiation: {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M12 12 L12 4 M12 12 L19 16 M12 12 L5 16", fill: "none", stroke: "currentColor", strokeWidth: 2 },
      { d: "M12 12 Q16 10 18 7 Q16 8 14 10 M12 12 Q8 14 6 17 Q8 16 10 14 M12 12 Q14 14 12 18 Q12 16 11 14", fill: "none", stroke: "currentColor", strokeWidth: 1.5 },
    ],
  },
  spark: {
    viewBox: "0 0 16 16",
    paths: [{ d: "M8 2 L10 6 L14 8 L10 10 L8 14 L6 10 L2 8 L6 6 Z", fill: "currentColor" }],
  },
  skull: {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M12 4 Q16 4 18 8 L20 14 Q20 16 18 16 L16 18 L16 20 L8 20 L8 18 L6 16 Q4 16 4 14 L6 8 Q8 4 12 4 Z", fill: "none", stroke: "currentColor", strokeWidth: 1.5 },
      { d: "M9 10 Q10 11 9 12 M15 10 Q14 11 15 12", fill: "none", stroke: "currentColor", strokeWidth: 1 },
    ],
  },
};
