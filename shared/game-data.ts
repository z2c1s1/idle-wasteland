// ─── Rarity system ─────────────────────────────────────────────────────────────
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export const RARITY_LABEL: Record<Rarity, string> = {
  common:    'Common',
  uncommon:  'Uncommon',
  rare:      'Rare',
  epic:      'Epic',
  legendary: 'Legendary',
};

export const RARITY_COLOR: Record<Rarity, string> = {
  common:    'text-gray-300',
  uncommon:  'text-green-400',
  rare:      'text-blue-400',
  epic:      'text-purple-400',
  legendary: 'text-orange-400',
};

export const RARITY_BORDER: Record<Rarity, string> = {
  common:    'border-gray-500/40',
  uncommon:  'border-green-500/40',
  rare:      'border-blue-500/40',
  epic:      'border-purple-500/50',
  legendary: 'border-orange-500/60',
};

export const RARITY_BG: Record<Rarity, string> = {
  common:    'bg-gray-500/5',
  uncommon:  'bg-green-500/8',
  rare:      'bg-blue-500/10',
  epic:      'bg-purple-500/12',
  legendary: 'bg-orange-500/15',
};

// ─── Equipment slots ────────────────────────────────────────────────────────────
export type EquipmentSlot = 'weapon' | 'offhand' | 'helmet' | 'chest' | 'legs' | 'gloves' | 'boots' | 'neck' | 'ring';

export const SLOT_LABEL: Record<EquipmentSlot, string> = {
  weapon:  'Weapon',
  offhand: 'Off-Hand',
  helmet:  'Helmet',
  chest:   'Chest',
  legs:    'Legs',
  gloves:  'Gloves',
  boots:   'Boots',
  neck:    'Neck',
  ring:    'Ring',
};

export const SLOT_EMOJI: Record<EquipmentSlot, string> = {
  weapon:  '⚔️',
  offhand: '🛡️',
  helmet:  '⛑️',
  chest:   '🧥',
  legs:    '👖',
  gloves:  '🥊',
  boots:   '👢',
  neck:    '📿',
  ring:    '💍',
};

export const ALL_SLOTS: EquipmentSlot[] = ['weapon','offhand','helmet','chest','legs','gloves','boots','neck','ring'];

// ─── Affix types ────────────────────────────────────────────────────────────────
export type AffixType = 'strength' | 'agility' | 'stamina' | 'armour';

export const AFFIX_LABEL: Record<AffixType, string> = {
  strength: 'Strength',
  agility:  'Agility',
  stamina:  'Stamina',
  armour:   'Armour',
};

export const AFFIX_COLOR: Record<AffixType, string> = {
  strength: 'text-red-300',
  agility:  'text-yellow-300',
  stamina:  'text-green-300',
  armour:   'text-blue-300',
};

export const AFFIX_EFFECT: Record<AffixType, string> = {
  strength: '+1 Attack per point',
  agility:  '+0.5% Crit per point',
  stamina:  '+5 HP per point',
  armour:   '+1 Defence per point',
};

export interface ItemAffix {
  type: AffixType;
  value: number;
}

// ─── Gem system ─────────────────────────────────────────────────────────────────
export type GemType = 'ruby' | 'sapphire' | 'emerald' | 'topaz' | 'diamond';
export type GemQuality = 'chipped' | 'flawed' | 'normal' | 'flawless' | 'perfect';

export const GEM_EMOJI: Record<GemType, string> = {
  ruby: '🔴', sapphire: '🔵', emerald: '💚', topaz: '💛', diamond: '💎',
};
export const GEM_TYPE_LABEL: Record<GemType, string> = {
  ruby: '红宝石', sapphire: '蓝宝石', emerald: '翠玉', topaz: '黄晶', diamond: '钻石',
};
export const GEM_QUALITY_LABEL: Record<GemQuality, string> = {
  chipped: '残缺', flawed: '瑕疵', normal: '普通', flawless: '无瑕', perfect: '完美',
};
export const GEM_TYPE_COLOR: Record<GemType, string> = {
  ruby: 'text-red-400', sapphire: 'text-blue-400', emerald: 'text-green-400',
  topaz: 'text-yellow-400', diamond: 'text-cyan-300',
};
export const GEM_QUALITY_COLOR: Record<GemQuality, string> = {
  chipped: 'text-gray-400', flawed: 'text-green-400', normal: 'text-blue-400',
  flawless: 'text-purple-400', perfect: 'text-orange-400',
};
export const GEM_TYPES: GemType[]    = ['ruby','sapphire','emerald','topaz','diamond'];
export const GEM_QUALITIES: GemQuality[] = ['chipped','flawed','normal','flawless','perfect'];

export function getGemName(gemKey: string): string {
  const [type, quality] = gemKey.split('_') as [GemType, GemQuality];
  return `${GEM_QUALITY_LABEL[quality] ?? ''}${GEM_TYPE_LABEL[type] ?? gemKey}`;
}
export function getGemBonus(gemKey: string): { attackBonus: number; defenceBonus: number; hpBonus: number; critRating: number } {
  const [type, quality] = gemKey.split('_') as [GemType, GemQuality];
  const mult = ({ chipped:1, flawed:2, normal:4, flawless:7, perfect:12 })[quality] ?? 1;
  switch (type) {
    case 'ruby':     return { attackBonus: 3*mult, defenceBonus: 0,     hpBonus: 0,      critRating: 0 };
    case 'sapphire': return { attackBonus: 0,      defenceBonus: 3*mult, hpBonus: 0,     critRating: 0 };
    case 'emerald':  return { attackBonus: 0,      defenceBonus: 0,     hpBonus: 15*mult, critRating: 0 };
    case 'topaz':    return { attackBonus: 0,      defenceBonus: 0,     hpBonus: 0,      critRating: 1.5*mult };
    case 'diamond':  return { attackBonus: 2*mult, defenceBonus: 2*mult, hpBonus: 10*mult, critRating: 0.5*mult };
    default:         return { attackBonus: 0,      defenceBonus: 0,     hpBonus: 0,      critRating: 0 };
  }
}
export function getGemBgClass(gemKey: string): string {
  const type = gemKey.split('_')[0] as GemType;
  return ({ ruby:'bg-red-500/20 border-red-500/50', sapphire:'bg-blue-500/20 border-blue-500/50',
    emerald:'bg-green-500/20 border-green-500/50', topaz:'bg-yellow-500/20 border-yellow-500/50',
    diamond:'bg-cyan-500/20 border-cyan-500/50' })[type] ?? 'bg-muted/20 border-border';
}

// Gem drop tables for mining and combat
export const MINING_GEM_POOLS: { chance: number; pool: string[] }[] = [
  { chance: 0.04, pool: ['ruby_chipped','sapphire_chipped','emerald_chipped','topaz_chipped'] },
  { chance: 0.04, pool: ['ruby_chipped','sapphire_chipped','emerald_chipped','topaz_chipped'] },
  { chance: 0.05, pool: ['ruby_chipped','sapphire_chipped','emerald_chipped','topaz_chipped','ruby_flawed','sapphire_flawed'] },
  { chance: 0.05, pool: ['ruby_flawed','sapphire_flawed','emerald_flawed','topaz_flawed'] },
  { chance: 0.06, pool: ['ruby_flawed','sapphire_flawed','emerald_flawed','topaz_flawed','ruby_normal'] },
  { chance: 0.06, pool: ['ruby_normal','sapphire_normal','emerald_normal','topaz_normal'] },
  { chance: 0.07, pool: ['ruby_normal','sapphire_normal','emerald_normal','topaz_normal','ruby_flawless','diamond_normal'] },
  { chance: 0.07, pool: ['ruby_flawless','sapphire_flawless','emerald_flawless','topaz_flawless'] },
  { chance: 0.08, pool: ['ruby_flawless','sapphire_flawless','emerald_flawless','topaz_flawless','diamond_flawless'] },
  { chance: 0.09, pool: ['ruby_perfect','sapphire_perfect','emerald_perfect','topaz_perfect','diamond_perfect'] },
];
export const COMBAT_GEM_POOLS: { chance: number; pool: string[] }[] = [
  { chance: 0.03, pool: ['ruby_chipped','sapphire_chipped','emerald_chipped','topaz_chipped'] },
  { chance: 0.04, pool: ['ruby_chipped','sapphire_chipped','emerald_chipped','topaz_chipped','ruby_flawed'] },
  { chance: 0.05, pool: ['ruby_flawed','sapphire_flawed','emerald_flawed','topaz_flawed'] },
  { chance: 0.06, pool: ['ruby_flawed','sapphire_flawed','emerald_flawed','topaz_flawed','ruby_normal'] },
  { chance: 0.08, pool: ['ruby_normal','sapphire_normal','emerald_normal','topaz_normal'] },
  { chance: 0.09, pool: ['ruby_normal','sapphire_normal','emerald_normal','topaz_normal','ruby_flawless'] },
  { chance: 0.11, pool: ['ruby_flawless','sapphire_flawless','emerald_flawless','topaz_flawless','diamond_normal'] },
  { chance: 0.13, pool: ['ruby_flawless','sapphire_flawless','emerald_flawless','topaz_flawless','diamond_flawless','ruby_perfect'] },
];

// ─── Item skills (Diablo-style procs) ──────────────────────────────────────────
export type SkillType = 'lifesteal' | 'thorns' | 'berserk' | 'doublestrike' | 'dodge' | 'poison' | 'spellblade' | 'vampiric';

export interface ItemSkill {
  type: SkillType;
  name: string;
  value: number;
  description: string;
}

export const SKILL_EMOJI: Record<SkillType, string> = {
  lifesteal:   '🩸', thorns: '🌵', berserk: '💢', doublestrike: '⚡',
  dodge:       '💨', poison: '☠️', spellblade: '✨', vampiric: '🧛',
};
export const SKILL_COLOR: Record<SkillType, string> = {
  lifesteal: 'text-red-300', thorns: 'text-green-300', berserk: 'text-orange-300',
  doublestrike: 'text-yellow-300', dodge: 'text-blue-300', poison: 'text-purple-300',
  spellblade: 'text-cyan-300', vampiric: 'text-pink-300',
};

const SKILL_POOL: { type: SkillType; name: string; minVal: number; maxVal: number; desc: (v: number) => string }[] = [
  { type: 'lifesteal',   name: '吸血',   minVal: 3,  maxVal: 15, desc: v => `击中时吸取 ${v}% 伤害恢复生命` },
  { type: 'thorns',      name: '荆棘',   minVal: 2,  maxVal: 20, desc: v => `被击中时反弹 ${v} 点伤害` },
  { type: 'berserk',     name: '狂战',   minVal: 10, maxVal: 50, desc: v => `HP < 30% 时攻击力提升 ${v}%` },
  { type: 'doublestrike',name: '双击',   minVal: 10, maxVal: 35, desc: v => `${v}% 概率每回合攻击两次` },
  { type: 'dodge',       name: '闪避',   minVal: 5,  maxVal: 25, desc: v => `${v}% 概率闪避所有伤害` },
  { type: 'poison',      name: '淬毒',   minVal: 2,  maxVal: 12, desc: v => `每次攻击追加 ${v} 点毒素伤害` },
  { type: 'spellblade',  name: '剑术',   minVal: 5,  maxVal: 30, desc: v => `攻击力额外提升 ${v}%` },
  { type: 'vampiric',    name: '嗜血',   minVal: 5,  maxVal: 20, desc: v => `击杀时恢复 ${v} 点生命` },
];

const RARITY_SKILL_COUNT: Record<Rarity, number> = {
  common: 0, uncommon: 0, rare: 1, epic: 2, legendary: 3,
};
const RARITY_MAX_SOCKETS: Record<Rarity, number> = {
  common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4,
};

function rollSkills(rarity: Rarity): ItemSkill[] {
  const count = RARITY_SKILL_COUNT[rarity];
  if (count === 0) return [];
  const pool = [...SKILL_POOL];
  const result: ItemSkill[] = [];
  const used = new Set<SkillType>();
  for (let i = 0; i < count; i++) {
    const avail = pool.filter(s => !used.has(s.type));
    if (!avail.length) break;
    const s = avail[Math.floor(Math.random() * avail.length)];
    used.add(s.type);
    const value = Math.round(s.minVal + Math.random() * (s.maxVal - s.minVal));
    result.push({ type: s.type, name: s.name, value, description: s.desc(value) });
  }
  return result;
}

function rollSockets(rarity: Rarity): number {
  const max = RARITY_MAX_SOCKETS[rarity];
  if (max === 0) return 0;
  if (rarity === 'uncommon') return Math.random() < 0.5 ? 1 : 0;
  if (rarity === 'rare') return 1 + Math.floor(Math.random() * 2);     // 1-2
  if (rarity === 'epic') return 2 + Math.floor(Math.random() * 2);     // 2-3
  return max; // legendary always max
}

// ─── Game item interface ────────────────────────────────────────────────────────
export interface GameItem {
  instanceId: string;
  name: string;
  slot: EquipmentSlot;
  emoji: string;
  rarity: Rarity;
  ilvl: number;
  affixes: ItemAffix[];
  attackBonus: number;
  defenceBonus: number;
  hpBonus: number;
  critRating: number;
  source: 'smithed' | 'dropped';
  baseId?: string;
  maxSockets: number;
  socketedGems: string[];
  skills: ItemSkill[];
}

export type EquipmentState = Partial<Record<EquipmentSlot, GameItem | null>>;

// ─── Helpers ───────────────────────────────────────────────────────────────────
export function getEquipmentBonuses(equipment: EquipmentState) {
  let attackBonus = 0, defenceBonus = 0, hpBonus = 0, critRating = 0;
  for (const item of Object.values(equipment)) {
    if (!item) continue;
    attackBonus  += item.attackBonus;
    defenceBonus += item.defenceBonus;
    hpBonus      += item.hpBonus;
    critRating   += item.critRating;
  }
  return { attackBonus, defenceBonus, hpBonus, critRating };
}

// ─── Smithed equipment items ───────────────────────────────────────────────────
export interface SmithedItemDef {
  id: string;
  name: string;
  emoji: string;
  slot: EquipmentSlot;
  attackBonus: number;
  defenceBonus: number;
  hpBonus?: number;
  critRating?: number;
  ilvl: number;
}

export const EQUIPMENT_ITEMS: Record<string, SmithedItemDef> = {
  bronze_sword:     { id: 'bronze_sword',     name: 'Bronze Sword',      emoji: '🗡️', slot: 'weapon',  attackBonus: 9,  defenceBonus: 0,  ilvl: 5  },
  iron_sword:       { id: 'iron_sword',       name: 'Iron Sword',        emoji: '⚔️', slot: 'weapon',  attackBonus: 17, defenceBonus: 0,  ilvl: 10 },
  steel_sword:      { id: 'steel_sword',      name: 'Steel Sword',       emoji: '⚔️', slot: 'weapon',  attackBonus: 27, defenceBonus: 0,  ilvl: 15 },
  mithril_sword:    { id: 'mithril_sword',    name: 'Mithril Sword',     emoji: '⚔️', slot: 'weapon',  attackBonus: 42, defenceBonus: 0,  ilvl: 25 },
  adamant_sword:    { id: 'adamant_sword',    name: 'Adamant Sword',     emoji: '⚔️', slot: 'weapon',  attackBonus: 60, defenceBonus: 0,  ilvl: 35 },
  rune_sword:       { id: 'rune_sword',       name: 'Rune Sword',        emoji: '⚔️', slot: 'weapon',  attackBonus: 82, defenceBonus: 0,  ilvl: 50 },
  bronze_shield:    { id: 'bronze_shield',    name: 'Bronze Shield',     emoji: '🛡️', slot: 'offhand', attackBonus: 0,  defenceBonus: 6,  ilvl: 5  },
  iron_shield:      { id: 'iron_shield',      name: 'Iron Shield',       emoji: '🛡️', slot: 'offhand', attackBonus: 0,  defenceBonus: 12, ilvl: 10 },
  steel_shield:     { id: 'steel_shield',     name: 'Steel Shield',      emoji: '🛡️', slot: 'offhand', attackBonus: 0,  defenceBonus: 20, ilvl: 15 },
  mithril_shield:   { id: 'mithril_shield',   name: 'Mithril Shield',    emoji: '🛡️', slot: 'offhand', attackBonus: 0,  defenceBonus: 32, ilvl: 25 },
  bronze_helmet:    { id: 'bronze_helmet',    name: 'Bronze Helmet',     emoji: '⛑️', slot: 'helmet',  attackBonus: 0,  defenceBonus: 4,  ilvl: 5  },
  iron_helmet:      { id: 'iron_helmet',      name: 'Iron Helmet',       emoji: '⛑️', slot: 'helmet',  attackBonus: 0,  defenceBonus: 8,  ilvl: 10 },
  steel_helmet:     { id: 'steel_helmet',     name: 'Steel Helmet',      emoji: '⛑️', slot: 'helmet',  attackBonus: 0,  defenceBonus: 14, ilvl: 15 },
  bronze_body:      { id: 'bronze_body',      name: 'Bronze Platebody',  emoji: '🧥', slot: 'chest',   attackBonus: 0,  defenceBonus: 9,  ilvl: 5  },
  iron_body:        { id: 'iron_body',        name: 'Iron Platebody',    emoji: '🧥', slot: 'chest',   attackBonus: 0,  defenceBonus: 18, ilvl: 10 },
  steel_body:       { id: 'steel_body',       name: 'Steel Platebody',   emoji: '🧥', slot: 'chest',   attackBonus: 0,  defenceBonus: 30, ilvl: 15 },
  bronze_legs:      { id: 'bronze_legs',      name: 'Bronze Platelegs',  emoji: '👖', slot: 'legs',    attackBonus: 0,  defenceBonus: 7,  ilvl: 5  },
  iron_legs:        { id: 'iron_legs',        name: 'Iron Platelegs',    emoji: '👖', slot: 'legs',    attackBonus: 0,  defenceBonus: 14, ilvl: 10 },
  steel_legs:       { id: 'steel_legs',       name: 'Steel Platelegs',   emoji: '👖', slot: 'legs',    attackBonus: 0,  defenceBonus: 23, ilvl: 15 },
  bronze_gauntlets: { id: 'bronze_gauntlets', name: 'Bronze Gauntlets',  emoji: '🥊', slot: 'gloves',  attackBonus: 3,  defenceBonus: 3,  ilvl: 5  },
  iron_gauntlets:   { id: 'iron_gauntlets',   name: 'Iron Gauntlets',    emoji: '🥊', slot: 'gloves',  attackBonus: 6,  defenceBonus: 6,  ilvl: 10 },
  steel_gauntlets:  { id: 'steel_gauntlets',  name: 'Steel Gauntlets',   emoji: '🥊', slot: 'gloves',  attackBonus: 10, defenceBonus: 10, ilvl: 15 },
  bronze_boots:     { id: 'bronze_boots',     name: 'Bronze Boots',      emoji: '👢', slot: 'boots',   attackBonus: 0,  defenceBonus: 5,  ilvl: 5  },
  iron_boots:       { id: 'iron_boots',       name: 'Iron Boots',        emoji: '👢', slot: 'boots',   attackBonus: 0,  defenceBonus: 10, ilvl: 10 },
  steel_boots:      { id: 'steel_boots',      name: 'Steel Boots',       emoji: '👢', slot: 'boots',   attackBonus: 0,  defenceBonus: 16, ilvl: 15 },
};

export function smithedToGameItem(itemId: string): GameItem | null {
  const def = EQUIPMENT_ITEMS[itemId];
  if (!def) return null;
  const affix: ItemAffix[] = [];
  if (def.attackBonus > 0)  affix.push({ type: 'strength', value: def.attackBonus });
  if (def.defenceBonus > 0) affix.push({ type: 'armour',   value: def.defenceBonus });
  if (def.hpBonus && def.hpBonus > 0) affix.push({ type: 'stamina', value: Math.round(def.hpBonus / 5) });
  if (def.critRating && def.critRating > 0) affix.push({ type: 'agility', value: Math.round(def.critRating / 0.5) });
  return {
    instanceId: `smithed_${itemId}_${Date.now()}`,
    name: def.name, slot: def.slot, emoji: def.emoji,
    rarity: 'uncommon', ilvl: def.ilvl, affixes: affix,
    attackBonus: def.attackBonus, defenceBonus: def.defenceBonus,
    hpBonus: def.hpBonus ?? 0, critRating: def.critRating ?? 0,
    source: 'smithed', baseId: itemId,
    maxSockets: rollSockets('uncommon'), socketedGems: [], skills: [],
  };
}

// ─── Leather equipment items ───────────────────────────────────────────────────
// Uses hides from Hunting (hide_0..9)
export const LEATHER_ITEMS: Record<string, SmithedItemDef> = {
  // Rabbit hide (hide_0) — Tier 1
  leather_cap:       { id: 'leather_cap',       name: 'Leather Cap',          emoji: '🎩', slot: 'helmet',  attackBonus: 0,  defenceBonus: 3,   ilvl: 4  },
  leather_vest:      { id: 'leather_vest',      name: 'Leather Vest',         emoji: '🧥', slot: 'chest',   attackBonus: 0,  defenceBonus: 6,   ilvl: 4  },
  leather_pants:     { id: 'leather_pants',     name: 'Leather Pants',        emoji: '👖', slot: 'legs',    attackBonus: 0,  defenceBonus: 4,   ilvl: 4  },
  leather_gloves:    { id: 'leather_gloves',    name: 'Leather Gloves',       emoji: '🥊', slot: 'gloves',  attackBonus: 3,  defenceBonus: 2,   ilvl: 4  },
  leather_boots:     { id: 'leather_boots',     name: 'Leather Boots',        emoji: '👢', slot: 'boots',   attackBonus: 0,  defenceBonus: 3,   ilvl: 4  },
  // Fox hide (hide_2) — Tier 2
  studded_cap:       { id: 'studded_cap',       name: 'Studded Cap',          emoji: '⛑️', slot: 'helmet',  attackBonus: 0,  defenceBonus: 10,  ilvl: 14 },
  studded_vest:      { id: 'studded_vest',      name: 'Studded Vest',         emoji: '🧥', slot: 'chest',   attackBonus: 0,  defenceBonus: 18,  ilvl: 14 },
  studded_pants:     { id: 'studded_pants',     name: 'Studded Pants',        emoji: '👖', slot: 'legs',    attackBonus: 0,  defenceBonus: 13,  ilvl: 14 },
  studded_gloves:    { id: 'studded_gloves',    name: 'Studded Gloves',       emoji: '🥊', slot: 'gloves',  attackBonus: 7,  defenceBonus: 5,   ilvl: 14 },
  // Wolf hide (hide_3) — Tier 3
  wolf_cap:          { id: 'wolf_cap',          name: 'Wolf Hide Cap',        emoji: '⛑️', slot: 'helmet',  attackBonus: 0,  defenceBonus: 15,  ilvl: 22 },
  wolf_vest:         { id: 'wolf_vest',         name: 'Wolf Hide Vest',       emoji: '🧥', slot: 'chest',   attackBonus: 0,  defenceBonus: 26,  ilvl: 22 },
  wolf_pants:        { id: 'wolf_pants',        name: 'Wolf Hide Pants',      emoji: '👖', slot: 'legs',    attackBonus: 0,  defenceBonus: 20,  ilvl: 22 },
  wolf_gloves:       { id: 'wolf_gloves',       name: 'Wolf Hide Gloves',     emoji: '🥊', slot: 'gloves',  attackBonus: 12, defenceBonus: 7,   ilvl: 22 },
  // Bear hide (hide_4) — Tier 4
  bear_vest:         { id: 'bear_vest',         name: 'Bear Hide Vest',       emoji: '🧥', slot: 'chest',   attackBonus: 0,  defenceBonus: 38,  ilvl: 32 },
  bear_pants:        { id: 'bear_pants',        name: 'Bear Hide Pants',      emoji: '👖', slot: 'legs',    attackBonus: 0,  defenceBonus: 28,  ilvl: 32 },
  // Dragon hide (hide_8) — Tier 5
  dragonhide_vest:   { id: 'dragonhide_vest',   name: 'Dragonhide Vest',      emoji: '🧥', slot: 'chest',   attackBonus: 0,  defenceBonus: 72,  ilvl: 58 },
  dragonhide_boots:  { id: 'dragonhide_boots',  name: 'Dragonhide Boots',     emoji: '👢', slot: 'boots',   attackBonus: 0,  defenceBonus: 38,  ilvl: 58 },
  // Phoenix hide (hide_9) — Tier 6
  phoenix_vest:      { id: 'phoenix_vest',      name: 'Phoenix Feather Vest', emoji: '🧥', slot: 'chest',   attackBonus: 5,  defenceBonus: 90,  ilvl: 72 },
};

// ─── Jewelry items ─────────────────────────────────────────────────────────────
// Uses crafting items (item_0..9) from the Crafting skill
export const JEWELRY_ITEMS: Record<string, SmithedItemDef> = {
  // Cloth (item_0) — Tier 1
  copper_ring:      { id: 'copper_ring',     name: 'Copper Ring',        emoji: '💍', slot: 'ring', attackBonus: 0, defenceBonus: 0, critRating: 1.5, ilvl: 3  },
  leather_amulet:   { id: 'leather_amulet',  name: 'Leather Amulet',     emoji: '📿', slot: 'neck', attackBonus: 0, defenceBonus: 0, hpBonus: 10,     ilvl: 3  },
  // Leather (item_1) — Tier 2
  tin_band:         { id: 'tin_band',        name: 'Tin Band',           emoji: '💍', slot: 'ring', attackBonus: 0, defenceBonus: 0, critRating: 2.5, ilvl: 9  },
  cord_pendant:     { id: 'cord_pendant',    name: 'Cord Pendant',       emoji: '📿', slot: 'neck', attackBonus: 0, defenceBonus: 0, hpBonus: 20,     ilvl: 9  },
  // Jewelry (item_2) — Tier 3
  bronze_signet:    { id: 'bronze_signet',   name: 'Bronze Signet',      emoji: '💍', slot: 'ring', attackBonus: 2, defenceBonus: 0, critRating: 3.0, ilvl: 15 },
  iron_chain:       { id: 'iron_chain',      name: 'Iron Chain',         emoji: '📿', slot: 'neck', attackBonus: 0, defenceBonus: 0, hpBonus: 30,     ilvl: 15 },
  // Armor (item_3) — Tier 4
  silver_ring:      { id: 'silver_ring',     name: 'Silver Ring',        emoji: '💍', slot: 'ring', attackBonus: 0, defenceBonus: 0, critRating: 5.0, ilvl: 22 },
  silver_chain:     { id: 'silver_chain',    name: 'Silver Chain',       emoji: '📿', slot: 'neck', attackBonus: 3, defenceBonus: 0, hpBonus: 35,     ilvl: 22 },
  // Weapon (item_4) — Tier 5
  gold_ring:        { id: 'gold_ring',       name: 'Gold Ring',          emoji: '💍', slot: 'ring', attackBonus: 5, defenceBonus: 0, critRating: 6.0, ilvl: 30 },
  gold_locket:      { id: 'gold_locket',     name: 'Gold Locket',        emoji: '📿', slot: 'neck', attackBonus: 0, defenceBonus: 0, hpBonus: 50,     ilvl: 30 },
  // Artifact (item_5) — Tier 6
  mithril_signet:   { id: 'mithril_signet',  name: 'Mithril Signet',     emoji: '💍', slot: 'ring', attackBonus: 5, defenceBonus: 0, critRating: 8.0, ilvl: 38 },
  runed_pendant:    { id: 'runed_pendant',   name: 'Runed Pendant',      emoji: '📿', slot: 'neck', attackBonus: 5, defenceBonus: 5, hpBonus: 65,     ilvl: 38 },
  // Relic (item_6) — Tier 7
  arcane_band:      { id: 'arcane_band',     name: 'Arcane Band',        emoji: '💍', slot: 'ring', attackBonus: 8, defenceBonus: 0, critRating: 10.5,ilvl: 48 },
  arcane_locket:    { id: 'arcane_locket',   name: 'Arcane Locket',      emoji: '📿', slot: 'neck', attackBonus: 5, defenceBonus: 5, hpBonus: 80,     ilvl: 48 },
  // Dragon ring (item_8) — Tier 8
  dragon_ring:      { id: 'dragon_ring',     name: 'Dragon Fire Ring',   emoji: '💍', slot: 'ring', attackBonus:12, defenceBonus: 0, critRating: 13.0,ilvl: 62 },
  dragon_pendant:   { id: 'dragon_pendant',  name: 'Dragon Scale Pendant',emoji: '📿',slot: 'neck', attackBonus: 8, defenceBonus: 8, hpBonus: 100,    ilvl: 62 },
  // Divine (item_9) — Tier 9
  eternal_ring:     { id: 'eternal_ring',    name: 'Eternal Ring',       emoji: '💍', slot: 'ring', attackBonus:18, defenceBonus: 0, critRating: 18.0,ilvl: 78 },
  eternal_pendant:  { id: 'eternal_pendant', name: 'Eternal Pendant',    emoji: '📿', slot: 'neck', attackBonus:10, defenceBonus:10, hpBonus: 130,    ilvl: 78 },
};

// Merged lookup including smithed, leather, and jewelry
export const ALL_CRAFTABLE_ITEMS: Record<string, SmithedItemDef> = {
  ...EQUIPMENT_ITEMS,
  ...LEATHER_ITEMS,
  ...JEWELRY_ITEMS,
};

// ─── Leatherworking recipes ────────────────────────────────────────────────────
export interface CraftingRecipe {
  id: string;
  output: string;
  inputs: { resource: string; qty: number }[];
  reqLevel: number;
  xp: number;
  time: number;
}

export const LEATHERWORKING_RECIPES: CraftingRecipe[] = [
  // Rabbit hides (hide_0) — basic leather
  { id: 'lw_leather_cap',     output: 'leather_cap',     inputs: [{ resource: 'hide_0', qty: 2 }], reqLevel: 1,  xp: 20,  time: 6  },
  { id: 'lw_leather_vest',    output: 'leather_vest',    inputs: [{ resource: 'hide_0', qty: 4 }], reqLevel: 1,  xp: 40,  time: 12 },
  { id: 'lw_leather_pants',   output: 'leather_pants',   inputs: [{ resource: 'hide_0', qty: 3 }], reqLevel: 1,  xp: 30,  time: 9  },
  { id: 'lw_leather_gloves',  output: 'leather_gloves',  inputs: [{ resource: 'hide_0', qty: 2 }], reqLevel: 1,  xp: 20,  time: 6  },
  { id: 'lw_leather_boots',   output: 'leather_boots',   inputs: [{ resource: 'hide_0', qty: 2 }], reqLevel: 1,  xp: 20,  time: 6  },
  // Fox hides (hide_2) — studded leather
  { id: 'lw_studded_cap',     output: 'studded_cap',     inputs: [{ resource: 'hide_2', qty: 2 }], reqLevel: 15, xp: 55,  time: 8  },
  { id: 'lw_studded_vest',    output: 'studded_vest',    inputs: [{ resource: 'hide_2', qty: 4 }], reqLevel: 15, xp: 110, time: 15 },
  { id: 'lw_studded_pants',   output: 'studded_pants',   inputs: [{ resource: 'hide_2', qty: 3 }], reqLevel: 15, xp: 82,  time: 12 },
  { id: 'lw_studded_gloves',  output: 'studded_gloves',  inputs: [{ resource: 'hide_2', qty: 2 }], reqLevel: 15, xp: 55,  time: 8  },
  // Wolf hides (hide_3) — wolf leather
  { id: 'lw_wolf_cap',        output: 'wolf_cap',        inputs: [{ resource: 'hide_3', qty: 2 }], reqLevel: 25, xp: 85,  time: 8  },
  { id: 'lw_wolf_vest',       output: 'wolf_vest',       inputs: [{ resource: 'hide_3', qty: 4 }], reqLevel: 25, xp: 170, time: 15 },
  { id: 'lw_wolf_pants',      output: 'wolf_pants',      inputs: [{ resource: 'hide_3', qty: 3 }], reqLevel: 25, xp: 128, time: 12 },
  { id: 'lw_wolf_gloves',     output: 'wolf_gloves',     inputs: [{ resource: 'hide_3', qty: 2 }], reqLevel: 25, xp: 85,  time: 8  },
  // Bear hides (hide_4) — bear leather
  { id: 'lw_bear_vest',       output: 'bear_vest',       inputs: [{ resource: 'hide_4', qty: 5 }], reqLevel: 35, xp: 230, time: 18 },
  { id: 'lw_bear_pants',      output: 'bear_pants',      inputs: [{ resource: 'hide_4', qty: 4 }], reqLevel: 35, xp: 185, time: 15 },
  // Dragon hides (hide_8) — dragonhide
  { id: 'lw_dragonhide_vest', output: 'dragonhide_vest', inputs: [{ resource: 'hide_8', qty: 4 }], reqLevel: 60, xp: 480, time: 22 },
  { id: 'lw_dragonhide_boots',output: 'dragonhide_boots',inputs: [{ resource: 'hide_8', qty: 3 }], reqLevel: 60, xp: 360, time: 18 },
  // Phoenix hides (hide_9) — phoenix
  { id: 'lw_phoenix_vest',    output: 'phoenix_vest',    inputs: [{ resource: 'hide_9', qty: 4 }], reqLevel: 70, xp: 650, time: 25 },
];

// ─── Jewelcrafting recipes ──────────────────────────────────────────────────────
export const JEWELCRAFTING_RECIPES: CraftingRecipe[] = [
  // Cloth items (item_0)
  { id: 'jc_copper_ring',    output: 'copper_ring',    inputs: [{ resource: 'item_0', qty: 3 }], reqLevel: 1,  xp: 25,  time: 8  },
  { id: 'jc_leather_amulet', output: 'leather_amulet', inputs: [{ resource: 'item_0', qty: 4 }], reqLevel: 1,  xp: 30,  time: 10 },
  // Leather (item_1)
  { id: 'jc_tin_band',       output: 'tin_band',       inputs: [{ resource: 'item_1', qty: 3 }], reqLevel: 10, xp: 45,  time: 8  },
  { id: 'jc_cord_pendant',   output: 'cord_pendant',   inputs: [{ resource: 'item_1', qty: 4 }], reqLevel: 10, xp: 55,  time: 10 },
  // Jewelry (item_2)
  { id: 'jc_bronze_signet',  output: 'bronze_signet',  inputs: [{ resource: 'item_2', qty: 3 }], reqLevel: 20, xp: 70,  time: 9  },
  { id: 'jc_iron_chain',     output: 'iron_chain',     inputs: [{ resource: 'item_2', qty: 4 }], reqLevel: 20, xp: 85,  time: 12 },
  // Armor (item_3)
  { id: 'jc_silver_ring',    output: 'silver_ring',    inputs: [{ resource: 'item_3', qty: 3 }], reqLevel: 28, xp: 100, time: 10 },
  { id: 'jc_silver_chain',   output: 'silver_chain',   inputs: [{ resource: 'item_3', qty: 4 }], reqLevel: 28, xp: 120, time: 12 },
  // Weapon (item_4)
  { id: 'jc_gold_ring',      output: 'gold_ring',      inputs: [{ resource: 'item_4', qty: 3 }], reqLevel: 38, xp: 140, time: 10 },
  { id: 'jc_gold_locket',    output: 'gold_locket',    inputs: [{ resource: 'item_4', qty: 4 }], reqLevel: 38, xp: 165, time: 12 },
  // Artifact (item_5)
  { id: 'jc_mithril_signet', output: 'mithril_signet', inputs: [{ resource: 'item_5', qty: 3 }], reqLevel: 48, xp: 200, time: 12 },
  { id: 'jc_runed_pendant',  output: 'runed_pendant',  inputs: [{ resource: 'item_5', qty: 4 }], reqLevel: 48, xp: 240, time: 14 },
  // Relic (item_6)
  { id: 'jc_arcane_band',    output: 'arcane_band',    inputs: [{ resource: 'item_6', qty: 3 }], reqLevel: 55, xp: 270, time: 12 },
  { id: 'jc_arcane_locket',  output: 'arcane_locket',  inputs: [{ resource: 'item_6', qty: 4 }], reqLevel: 55, xp: 320, time: 15 },
  // Dragon (item_8)
  { id: 'jc_dragon_ring',    output: 'dragon_ring',    inputs: [{ resource: 'item_8', qty: 2 }], reqLevel: 65, xp: 400, time: 14 },
  { id: 'jc_dragon_pendant', output: 'dragon_pendant', inputs: [{ resource: 'item_8', qty: 3 }], reqLevel: 65, xp: 480, time: 16 },
  // Divine (item_9)
  { id: 'jc_eternal_ring',   output: 'eternal_ring',   inputs: [{ resource: 'item_9', qty: 2 }], reqLevel: 72, xp: 600, time: 16 },
  { id: 'jc_eternal_pendant',output: 'eternal_pendant', inputs: [{ resource: 'item_9', qty: 3 }], reqLevel: 72, xp: 720, time: 20 },
];

// ─── Item generation (Diablo-style) ───────────────────────────────────────────
const RARITY_PREFIXES: Record<Rarity, string[]> = {
  common:    ['Battered', 'Worn', 'Crude', 'Old', 'Tattered'],
  uncommon:  ['Sturdy', 'Fine', 'Polished', 'Reinforced', 'Honed'],
  rare:      ['Masterwork', 'Enchanted', 'Refined', 'Superior', 'Tempered'],
  epic:      ['Ancient', 'Arcane', 'Mythic', 'Runic', 'Hallowed'],
  legendary: ['Legendary', 'Eternal', 'Godly', 'Infernal', 'Immortal'],
};

const SLOT_BASE_NAMES: Record<EquipmentSlot, string[]> = {
  weapon:  ['Sword', 'Blade', 'Axe', 'Mace', 'Warhammer', 'Greatsword', 'Spear', 'Halberd', 'Cleaver'],
  offhand: ['Shield', 'Buckler', 'Tome', 'Orb', 'Dagger', 'Targe', 'Aegis', 'Barrier'],
  helmet:  ['Helm', 'Crown', 'Hood', 'Cowl', 'Skullcap', 'Visor', 'Crest', 'Faceguard'],
  chest:   ['Chestplate', 'Robe', 'Tunic', 'Hauberk', 'Breastplate', 'Chainmail', 'Vest'],
  legs:    ['Legplates', 'Breeches', 'Leggings', 'Greaves', 'Cuisses', 'Pants'],
  gloves:  ['Gauntlets', 'Gloves', 'Grips', 'Wraps', 'Handguards', 'Fists'],
  boots:   ['Boots', 'Sabatons', 'Treads', 'Stompers', 'Greaves', 'Slippers'],
  neck:    ['Necklace', 'Amulet', 'Pendant', 'Choker', 'Chain', 'Collar', 'Locket'],
  ring:    ['Ring', 'Band', 'Signet', 'Loop', 'Circle', 'Seal', 'Coil'],
};

// Slot-biased affix pools (slot favors certain stats but can roll anything)
const SLOT_AFFIX_POOL: Record<EquipmentSlot, AffixType[]> = {
  weapon:  ['strength', 'agility', 'strength', 'strength', 'agility', 'stamina'],
  offhand: ['armour', 'stamina', 'armour', 'armour', 'agility', 'strength'],
  helmet:  ['stamina', 'armour', 'agility', 'stamina', 'armour', 'strength'],
  chest:   ['stamina', 'armour', 'armour', 'stamina', 'strength', 'agility'],
  legs:    ['armour', 'stamina', 'agility', 'armour', 'strength', 'stamina'],
  gloves:  ['strength', 'agility', 'strength', 'agility', 'armour', 'stamina'],
  boots:   ['agility', 'stamina', 'armour', 'agility', 'strength', 'armour'],
  neck:    ['strength', 'agility', 'stamina', 'armour', 'agility', 'strength'],
  ring:    ['strength', 'agility', 'stamina', 'armour', 'strength', 'agility'],
};

const RARITY_AFFIX_COUNT: Record<Rarity, number> = {
  common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5,
};

const RARITY_MULTIPLIER: Record<Rarity, number> = {
  common: 0.5, uncommon: 0.9, rare: 1.4, epic: 2.0, legendary: 3.2,
};

const AFFIX_SCALING: Record<AffixType, number> = {
  strength: 1.2,
  agility:  0.8,
  stamina:  0.7,
  armour:   1.3,
};

function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min: number, max: number): number { return min + Math.floor(Math.random() * (max - min + 1)); }

export function generateDroppedItem(enemyIndex: number): GameItem {
  const enemy = ENEMIES[enemyIndex];
  const ilvlBase = enemyIndex * 7 + 1;
  const ilvl = ilvlBase + randInt(0, 5);

  // Rarity weighting by enemy tier
  const weights = [
    Math.max(10, 60 - enemyIndex * 7),   // common
    Math.min(40, 20 + enemyIndex * 3),    // uncommon
    Math.min(25, enemyIndex * 3),         // rare
    Math.min(10, Math.floor(enemyIndex * 1.2)), // epic
    enemyIndex >= 6 ? 2 : 0,             // legendary (dragons only)
  ];
  const pool: Rarity[] = [];
  (['common', 'uncommon', 'rare', 'epic', 'legendary'] as Rarity[]).forEach((r, i) => {
    for (let w = 0; w < weights[i]; w++) pool.push(r);
  });
  const rarity = rand(pool);

  const slot = rand(ALL_SLOTS);
  const numAffixes = RARITY_AFFIX_COUNT[rarity];
  const mult = RARITY_MULTIPLIER[rarity];
  const slotPool = SLOT_AFFIX_POOL[slot];

  const usedTypes = new Set<AffixType>();
  const affixes: ItemAffix[] = [];
  const allTypes: AffixType[] = ['strength', 'agility', 'stamina', 'armour'];

  for (let i = 0; i < numAffixes; i++) {
    const available = allTypes.filter(t => !usedTypes.has(t));
    if (!available.length) break;
    const candidate = rand(slotPool);
    const type = available.includes(candidate) ? candidate : rand(available);
    usedTypes.add(type);
    const value = Math.max(1, Math.round(ilvl * mult * AFFIX_SCALING[type]));
    affixes.push({ type, value });
  }

  const attackBonus  = affixes.filter(a => a.type === 'strength').reduce((s, a) => s + a.value, 0);
  const defenceBonus = affixes.filter(a => a.type === 'armour').reduce((s, a) => s + a.value, 0);
  const hpBonus      = affixes.filter(a => a.type === 'stamina').reduce((s, a) => s + a.value, 0) * 5;
  const critRating   = affixes.filter(a => a.type === 'agility').reduce((s, a) => s + a.value * 0.5, 0);

  const prefix = rand(RARITY_PREFIXES[rarity]);
  const base   = rand(SLOT_BASE_NAMES[slot]);

  return {
    instanceId: `drop_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name: `${prefix} ${base}`,
    slot, emoji: SLOT_EMOJI[slot], rarity, ilvl, affixes,
    attackBonus, defenceBonus, hpBonus, critRating, source: 'dropped',
    maxSockets: rollSockets(rarity), socketedGems: [], skills: rollSkills(rarity),
  };
}

export function getDropChance(enemyIndex: number): number {
  return 0.15 + enemyIndex * 0.02; // 15% for Chicken → 29% for Fire Dragon
}

// ─── Enemies ───────────────────────────────────────────────────────────────────
export interface Enemy {
  id: string;
  name: string;
  emoji: string;
  maxHp: number;
  attack: number;
  defence: number;
  xp: number;
  drops: { gold: [number, number]; bones?: number; dragonBones?: number };
  reqCombatLevel: number;
}

export const ENEMIES: Enemy[] = [
  { id: 'chicken',    name: 'Chicken',      emoji: '🐔', maxHp: 15,   attack: 1,  defence: 0,  xp: 8,    drops: { gold: [1, 2] },               reqCombatLevel: 1  },
  { id: 'cow',        name: 'Cow',          emoji: '🐄', maxHp: 35,   attack: 4,  defence: 0,  xp: 20,   drops: { gold: [2, 5],  bones: 1 },    reqCombatLevel: 5  },
  { id: 'goblin',     name: 'Goblin',       emoji: '👺', maxHp: 70,   attack: 8,  defence: 2,  xp: 45,   drops: { gold: [4, 10], bones: 1 },    reqCombatLevel: 10 },
  { id: 'skeleton',   name: 'Skeleton',     emoji: '💀', maxHp: 140,  attack: 15, defence: 5,  xp: 100,  drops: { gold: [8, 18], bones: 2 },    reqCombatLevel: 20 },
  { id: 'troll',      name: 'Troll',        emoji: '👹', maxHp: 280,  attack: 26, defence: 10, xp: 200,  drops: { gold: [18, 40], bones: 3 },   reqCombatLevel: 35 },
  { id: 'giant',      name: 'Giant',        emoji: '🦣', maxHp: 500,  attack: 42, defence: 18, xp: 380,  drops: { gold: [35, 75] },             reqCombatLevel: 50 },
  { id: 'dragon',     name: 'Green Dragon', emoji: '🐲', maxHp: 850,  attack: 65, defence: 30, xp: 720,  drops: { gold: [70, 140], dragonBones: 1 }, reqCombatLevel: 65 },
  { id: 'fire_dragon',name: 'Fire Dragon',  emoji: '🔥', maxHp: 1400, attack: 95, defence: 50, xp: 1400, drops: { gold: [140, 280], dragonBones: 2 }, reqCombatLevel: 80 },
];

// ─── Smithing recipes ──────────────────────────────────────────────────────────
export interface SmithingRecipe {
  id: string;
  output: string;
  inputs: { resource: string; qty: number }[];
  reqLevel: number;
  xp: number;
  time: number;
}

export const SMITHING_RECIPES: SmithingRecipe[] = [
  // Bronze (bar_0)
  { id: 'r_bronze_sword',      output: 'bronze_sword',      inputs: [{ resource: 'bar_0', qty: 2 }], reqLevel: 5,  xp: 25,  time: 8  },
  { id: 'r_bronze_shield',     output: 'bronze_shield',     inputs: [{ resource: 'bar_0', qty: 3 }], reqLevel: 5,  xp: 35,  time: 10 },
  { id: 'r_bronze_helmet',     output: 'bronze_helmet',     inputs: [{ resource: 'bar_0', qty: 2 }], reqLevel: 5,  xp: 25,  time: 8  },
  { id: 'r_bronze_body',       output: 'bronze_body',       inputs: [{ resource: 'bar_0', qty: 5 }], reqLevel: 10, xp: 60,  time: 15 },
  { id: 'r_bronze_legs',       output: 'bronze_legs',       inputs: [{ resource: 'bar_0', qty: 4 }], reqLevel: 10, xp: 48,  time: 12 },
  { id: 'r_bronze_gauntlets',  output: 'bronze_gauntlets',  inputs: [{ resource: 'bar_0', qty: 2 }], reqLevel: 5,  xp: 22,  time: 7  },
  { id: 'r_bronze_boots',      output: 'bronze_boots',      inputs: [{ resource: 'bar_0', qty: 2 }], reqLevel: 5,  xp: 22,  time: 7  },
  // Iron (bar_1)
  { id: 'r_iron_sword',        output: 'iron_sword',        inputs: [{ resource: 'bar_1', qty: 2 }], reqLevel: 20, xp: 50,  time: 8  },
  { id: 'r_iron_shield',       output: 'iron_shield',       inputs: [{ resource: 'bar_1', qty: 3 }], reqLevel: 20, xp: 70,  time: 10 },
  { id: 'r_iron_helmet',       output: 'iron_helmet',       inputs: [{ resource: 'bar_1', qty: 2 }], reqLevel: 20, xp: 50,  time: 8  },
  { id: 'r_iron_body',         output: 'iron_body',         inputs: [{ resource: 'bar_1', qty: 5 }], reqLevel: 25, xp: 120, time: 15 },
  { id: 'r_iron_legs',         output: 'iron_legs',         inputs: [{ resource: 'bar_1', qty: 4 }], reqLevel: 25, xp: 96,  time: 12 },
  { id: 'r_iron_gauntlets',    output: 'iron_gauntlets',    inputs: [{ resource: 'bar_1', qty: 2 }], reqLevel: 20, xp: 45,  time: 7  },
  { id: 'r_iron_boots',        output: 'iron_boots',        inputs: [{ resource: 'bar_1', qty: 2 }], reqLevel: 20, xp: 45,  time: 7  },
  // Steel (bar_2)
  { id: 'r_steel_sword',       output: 'steel_sword',       inputs: [{ resource: 'bar_2', qty: 2 }], reqLevel: 30, xp: 75,  time: 8  },
  { id: 'r_steel_shield',      output: 'steel_shield',      inputs: [{ resource: 'bar_2', qty: 3 }], reqLevel: 30, xp: 105, time: 10 },
  { id: 'r_steel_helmet',      output: 'steel_helmet',      inputs: [{ resource: 'bar_2', qty: 2 }], reqLevel: 30, xp: 75,  time: 8  },
  { id: 'r_steel_body',        output: 'steel_body',        inputs: [{ resource: 'bar_2', qty: 5 }], reqLevel: 35, xp: 180, time: 15 },
  { id: 'r_steel_legs',        output: 'steel_legs',        inputs: [{ resource: 'bar_2', qty: 4 }], reqLevel: 35, xp: 144, time: 12 },
  { id: 'r_steel_gauntlets',   output: 'steel_gauntlets',   inputs: [{ resource: 'bar_2', qty: 2 }], reqLevel: 30, xp: 70,  time: 7  },
  { id: 'r_steel_boots',       output: 'steel_boots',       inputs: [{ resource: 'bar_2', qty: 2 }], reqLevel: 30, xp: 70,  time: 7  },
  // Mithril (bar_4)
  { id: 'r_mithril_sword',     output: 'mithril_sword',     inputs: [{ resource: 'bar_4', qty: 2 }], reqLevel: 50, xp: 120, time: 10 },
  { id: 'r_mithril_shield',    output: 'mithril_shield',    inputs: [{ resource: 'bar_4', qty: 3 }], reqLevel: 50, xp: 160, time: 12 },
  // Adamant (bar_5)
  { id: 'r_adamant_sword',     output: 'adamant_sword',     inputs: [{ resource: 'bar_5', qty: 2 }], reqLevel: 60, xp: 160, time: 10 },
  // Rune (bar_6)
  { id: 'r_rune_sword',        output: 'rune_sword',        inputs: [{ resource: 'bar_6', qty: 2 }], reqLevel: 70, xp: 220, time: 10 },
];

// ─── Universal item converter (smithed + leather + jewelry) ────────────────────
export function craftedToGameItem(itemId: string): GameItem | null {
  const def = ALL_CRAFTABLE_ITEMS[itemId];
  if (!def) return null;
  const affix: ItemAffix[] = [];
  if (def.attackBonus > 0)  affix.push({ type: 'strength', value: def.attackBonus });
  if (def.defenceBonus > 0) affix.push({ type: 'armour',   value: def.defenceBonus });
  if (def.hpBonus && def.hpBonus > 0) affix.push({ type: 'stamina', value: Math.round(def.hpBonus / 5) });
  if (def.critRating && def.critRating > 0) affix.push({ type: 'agility', value: Math.round(def.critRating / 0.5) });
  const rarity: Rarity = 'uncommon';
  return {
    instanceId: `crafted_${itemId}_${Date.now()}`,
    name: def.name, slot: def.slot, emoji: def.emoji,
    rarity, ilvl: def.ilvl, affixes: affix,
    attackBonus: def.attackBonus, defenceBonus: def.defenceBonus,
    hpBonus: def.hpBonus ?? 0, critRating: def.critRating ?? 0,
    source: 'smithed', baseId: itemId,
    maxSockets: rollSockets(rarity), socketedGems: [], skills: [],
  };
}
