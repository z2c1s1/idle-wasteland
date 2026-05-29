// ─── Rarity system ─────────────────────────────────────────────────────────────
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export const RARITY_LABEL: Record<Rarity, string> = {
  common:    '普通',
  uncommon:  '魔法',
  rare:      '稀有',
  epic:      '神圣',
  legendary: '独特',
};

export const RARITY_COLOR: Record<Rarity, string> = {
  common:    'text-gray-400',
  uncommon:  'text-blue-400',
  rare:      'text-yellow-400',
  epic:      'text-amber-300',
  legendary: 'text-orange-400',
};

export const RARITY_BORDER: Record<Rarity, string> = {
  common:    'border-gray-500/40',
  uncommon:  'border-blue-500/40',
  rare:      'border-yellow-500/40',
  epic:      'border-amber-400/60',
  legendary: 'border-orange-500/60',
};

export const RARITY_BG: Record<Rarity, string> = {
  common:    'bg-gray-500/5',
  uncommon:  'bg-blue-500/8',
  rare:      'bg-yellow-500/10',
  epic:      'bg-amber-500/12',
  legendary: 'bg-orange-500/15',
};

// ─── Equipment slots ────────────────────────────────────────────────────────────
export type EquipmentSlot = 'weapon' | 'offhand' | 'helmet' | 'chest' | 'legs' | 'gloves' | 'boots' | 'neck' | 'ring';

export const SLOT_LABEL: Record<EquipmentSlot, string> = {
  weapon:  '武器',
  offhand: '副手',
  helmet:  '头盔',
  chest:   '胸甲',
  legs:    '护腿',
  gloves:  '手套',
  boots:   '靴子',
  neck:    '项链',
  ring:    '戒指',
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

// ─── Affix types (Diablo 4 style) ───────────────────────────────────────────────
export type AffixType =
  | 'strength' | 'dexterity' | 'vitality' | 'intelligence' | 'armour'
  | 'damage_percent' | 'life_on_hit' | 'overpower'
  | 'lucky_hit' | 'life_regen' | 'resist_all'
  | 'life_leech' | 'crit_damage' | 'attack_speed' | 'thorns';

export const AFFIX_LABEL: Record<AffixType, string> = {
  strength:      '力量',
  dexterity:     '敏捷',
  vitality:      '活力',
  intelligence:  '智慧',
  armour:        '护甲',
  damage_percent:'伤害加成',
  life_on_hit:   '命中回血',
  overpower:     '强击',
  lucky_hit:     '幸运命中',
  life_regen:    '生命回复',
  resist_all:    '全系抗性',
  life_leech:    '吸血',
  crit_damage:   '暴击伤害',
  attack_speed:  '攻击速度',
  thorns:        '荆棘',
};

export const AFFIX_COLOR: Record<AffixType, string> = {
  strength:      'text-red-400',
  dexterity:     'text-yellow-300',
  vitality:      'text-green-300',
  intelligence:  'text-blue-300',
  armour:        'text-slate-300',
  damage_percent:'text-orange-300',
  life_on_hit:   'text-pink-300',
  overpower:     'text-red-500',
  lucky_hit:     'text-purple-300',
  life_regen:    'text-emerald-300',
  resist_all:    'text-cyan-300',
  life_leech:    'text-rose-300',
  crit_damage:   'text-amber-300',
  attack_speed:  'text-sky-300',
  thorns:        'text-lime-300',
};

export const AFFIX_EFFECT: Record<AffixType, string> = {
  strength:      '+1 攻击/点',
  dexterity:     '+0.5% 暴击率/点',
  vitality:      '+5 生命/点',
  intelligence:  '+0.5% 技能伤害/点',
  armour:        '+1 防御/点',
  damage_percent:'+1% 所有伤害/点',
  life_on_hit:   '+1 生命/命中',
  overpower:     '+1% 强击概率 — 额外伤害等于最大生命 1%',
  lucky_hit:     '+1% 幸运命中 — 触发时恢复少量生命',
  life_regen:    '+1 生命回复/战斗回合',
  resist_all:    '+1 伤害减免/点',
  life_leech:    '+1% 吸血率/点',
  crit_damage:   '+1% 暴击伤害加成',
  attack_speed:  '+1% 攻击速度加成/点',
  thorns:        '+1 被击反伤/点',
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
export type SkillType = 'lifesteal' | 'thorns' | 'berserk' | 'doublestrike' | 'dodge' | 'poison' | 'spellblade' | 'vampiric' | 'skill_rank';

export interface ItemSkill {
  type: SkillType;
  name: string;
  value: number;
  description: string;
}

export const SKILL_EMOJI: Record<SkillType, string> = {
  lifesteal:   '🩸', thorns: '🌵', berserk: '💢', doublestrike: '⚡',
  dodge:       '💨', poison: '☠️', spellblade: '✨', vampiric: '🧛',
  skill_rank:  '📖',
};
export const SKILL_COLOR: Record<SkillType, string> = {
  lifesteal: 'text-red-300', thorns: 'text-green-300', berserk: 'text-orange-300',
  doublestrike: 'text-yellow-300', dodge: 'text-blue-300', poison: 'text-purple-300',
  spellblade: 'text-cyan-300', vampiric: 'text-pink-300',
  skill_rank: 'text-violet-300',
};

const SKILL_POOL: { type: SkillType; name: string; minVal: number; maxVal: number; desc: (v: number) => string }[] = [
  { type: 'lifesteal',   name: '吸血',       minVal: 3,  maxVal: 15, desc: v => `击中时吸取 ${v}% 伤害恢复生命` },
  { type: 'thorns',      name: '荆棘',       minVal: 2,  maxVal: 20, desc: v => `被击中时反弹 ${v} 点伤害` },
  { type: 'berserk',     name: '狂战',       minVal: 10, maxVal: 50, desc: v => `HP < 30% 时攻击力提升 ${v}%` },
  { type: 'doublestrike',name: '双击',       minVal: 10, maxVal: 35, desc: v => `${v}% 概率每回合攻击两次` },
  { type: 'dodge',       name: '闪避',       minVal: 5,  maxVal: 25, desc: v => `${v}% 概率闪避所有伤害` },
  { type: 'poison',      name: '淬毒',       minVal: 2,  maxVal: 12, desc: v => `每次攻击追加 ${v} 点毒素伤害` },
  { type: 'spellblade',  name: '剑术',       minVal: 5,  maxVal: 30, desc: v => `攻击力额外提升 ${v}%` },
  { type: 'vampiric',    name: '嗜血',       minVal: 5,  maxVal: 20, desc: v => `击杀时恢复 ${v} 点生命` },
  { type: 'skill_rank',  name: '+技能等级',  minVal: 1,  maxVal: 3,  desc: v => `所有技能等级 +${v}（提升 ${v * 5}% 战斗效能）` },
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

// ─── Item base types (Diablo-style item archetypes) ────────────────────────────
export interface ItemBase {
  id: string;
  name: string;
  emoji: string;
  slot: EquipmentSlot;
  reqIlvl: number;
  minDamage: number;    // weapon: base min damage; armor: 0
  maxDamage: number;    // weapon: base max damage; armor: 0
  baseDefence: number;  // armor base defence value; weapon: 0
  implicit?: { type: AffixType; value: number }; // always-present affix (not randomized)
}

export const SLOT_BASES: Record<EquipmentSlot, ItemBase[]> = {
  weapon: [
    { id:'dagger',     name:'匕首',   emoji:'🗡️', slot:'weapon', reqIlvl:1,  minDamage:2,  maxDamage:6,  baseDefence:0 },
    { id:'short_sword',name:'短剑',   emoji:'⚔️', slot:'weapon', reqIlvl:8,  minDamage:4,  maxDamage:10, baseDefence:0 },
    { id:'scimitar',   name:'弯刀',   emoji:'⚔️', slot:'weapon', reqIlvl:15, minDamage:6,  maxDamage:15, baseDefence:0 },
    { id:'long_sword', name:'长剑',   emoji:'⚔️', slot:'weapon', reqIlvl:25, minDamage:10, maxDamage:22, baseDefence:0 },
    { id:'battle_axe', name:'战斧',   emoji:'🪓', slot:'weapon', reqIlvl:35, minDamage:14, maxDamage:30, baseDefence:0 },
    { id:'great_sword',name:'巨剑',   emoji:'⚔️', slot:'weapon', reqIlvl:48, minDamage:20, maxDamage:45, baseDefence:0 },
    { id:'rune_blade', name:'符文刃', emoji:'✨', slot:'weapon', reqIlvl:60, minDamage:28, maxDamage:62, baseDefence:0 },
  ],
  offhand: [
    { id:'buckler',    name:'小圆盾', emoji:'🛡️', slot:'offhand', reqIlvl:1,  minDamage:0, maxDamage:0, baseDefence:5,  implicit:{type:'armour',value:5} },
    { id:'kite_shield',name:'风筝盾', emoji:'🛡️', slot:'offhand', reqIlvl:15, minDamage:0, maxDamage:0, baseDefence:15, implicit:{type:'armour',value:12} },
    { id:'tower_shield',name:'塔盾',  emoji:'🛡️', slot:'offhand', reqIlvl:30, minDamage:0, maxDamage:0, baseDefence:28, implicit:{type:'armour',value:22} },
    { id:'dragon_shield',name:'龙盾', emoji:'🛡️', slot:'offhand', reqIlvl:55, minDamage:0, maxDamage:0, baseDefence:50, implicit:{type:'armour',value:40} },
  ],
  helmet: [
    { id:'leather_cap', name:'皮帽',   emoji:'⛑️', slot:'helmet', reqIlvl:1,  minDamage:0, maxDamage:0, baseDefence:3 },
    { id:'iron_helm',   name:'铁头盔', emoji:'⛑️', slot:'helmet', reqIlvl:12, minDamage:0, maxDamage:0, baseDefence:10 },
    { id:'great_helm',  name:'大战盔', emoji:'⛑️', slot:'helmet', reqIlvl:28, minDamage:0, maxDamage:0, baseDefence:22 },
    { id:'dragon_crown',name:'龙冠',   emoji:'👑', slot:'helmet', reqIlvl:55, minDamage:0, maxDamage:0, baseDefence:40 },
  ],
  chest: [
    { id:'leather_armor',name:'皮甲',   emoji:'🧥', slot:'chest', reqIlvl:1,  minDamage:0, maxDamage:0, baseDefence:8 },
    { id:'chain_mail',   name:'锁子甲', emoji:'🧥', slot:'chest', reqIlvl:18, minDamage:0, maxDamage:0, baseDefence:25 },
    { id:'plate_armor',  name:'板甲',   emoji:'🧥', slot:'chest', reqIlvl:35, minDamage:0, maxDamage:0, baseDefence:48 },
    { id:'dragon_plate', name:'龙甲',   emoji:'🧥', slot:'chest', reqIlvl:58, minDamage:0, maxDamage:0, baseDefence:80 },
  ],
  legs: [
    { id:'leather_legs',name:'皮腿甲', emoji:'👖', slot:'legs', reqIlvl:1,  minDamage:0, maxDamage:0, baseDefence:6 },
    { id:'chain_legs',  name:'锁链腿', emoji:'👖', slot:'legs', reqIlvl:20, minDamage:0, maxDamage:0, baseDefence:20 },
    { id:'plate_legs',  name:'板甲腿', emoji:'👖', slot:'legs', reqIlvl:40, minDamage:0, maxDamage:0, baseDefence:38 },
    { id:'dragon_legs', name:'龙腿甲', emoji:'👖', slot:'legs', reqIlvl:60, minDamage:0, maxDamage:0, baseDefence:62 },
  ],
  gloves: [
    { id:'leather_gloves',name:'皮手套',  emoji:'🥊', slot:'gloves', reqIlvl:1,  minDamage:0, maxDamage:0, baseDefence:2 },
    { id:'gauntlets',     name:'铁护手',  emoji:'🥊', slot:'gloves', reqIlvl:20, minDamage:0, maxDamage:0, baseDefence:8 },
    { id:'war_gauntlets', name:'战斗护手',emoji:'🥊', slot:'gloves', reqIlvl:42, minDamage:0, maxDamage:0, baseDefence:16 },
  ],
  boots: [
    { id:'leather_boots',name:'皮靴',   emoji:'👢', slot:'boots', reqIlvl:1,  minDamage:0, maxDamage:0, baseDefence:3 },
    { id:'iron_boots',   name:'铁靴',   emoji:'👢', slot:'boots', reqIlvl:20, minDamage:0, maxDamage:0, baseDefence:10 },
    { id:'war_boots',    name:'战靴',   emoji:'👢', slot:'boots', reqIlvl:38, minDamage:0, maxDamage:0, baseDefence:20 },
    { id:'dragon_boots', name:'龙靴',   emoji:'👢', slot:'boots', reqIlvl:58, minDamage:0, maxDamage:0, baseDefence:35 },
  ],
  neck: [
    { id:'pendant',     name:'吊坠',   emoji:'📿', slot:'neck', reqIlvl:1,  minDamage:0, maxDamage:0, baseDefence:0 },
    { id:'amulet',      name:'护身符', emoji:'📿', slot:'neck', reqIlvl:20, minDamage:0, maxDamage:0, baseDefence:0, implicit:{type:'vitality',value:5} },
    { id:'torc',        name:'颈圈',   emoji:'📿', slot:'neck', reqIlvl:40, minDamage:0, maxDamage:0, baseDefence:0, implicit:{type:'vitality',value:12} },
    { id:'rune_amulet', name:'符文坠', emoji:'📿', slot:'neck', reqIlvl:60, minDamage:0, maxDamage:0, baseDefence:0, implicit:{type:'vitality',value:20} },
  ],
  ring: [
    { id:'copper_ring', name:'铜戒指', emoji:'💍', slot:'ring', reqIlvl:1,  minDamage:0, maxDamage:0, baseDefence:0 },
    { id:'silver_ring', name:'银戒指', emoji:'💍', slot:'ring', reqIlvl:20, minDamage:0, maxDamage:0, baseDefence:0, implicit:{type:'dexterity',value:3} },
    { id:'gold_ring',   name:'金戒指', emoji:'💍', slot:'ring', reqIlvl:38, minDamage:0, maxDamage:0, baseDefence:0, implicit:{type:'dexterity',value:6} },
    { id:'rune_ring',   name:'符文戒', emoji:'💍', slot:'ring', reqIlvl:60, minDamage:0, maxDamage:0, baseDefence:0, implicit:{type:'dexterity',value:12} },
  ],
};

// ─── Unique items (Diablo-style named legendaries) ──────────────────────────────
export interface UniqueItemDef {
  id: string;
  name: string;
  flavorText: string;
  slot: EquipmentSlot;
  emoji: string;
  ilvl: number;
  minEnemyIndex: number; // minimum enemy tier to drop from
  affixes: ItemAffix[];
  skills?: { type: SkillType; name: string; value: number; description: string }[];
}

export const UNIQUE_ITEMS: UniqueItemDef[] = [
  {
    id:'frost_fang', name:'冰霜之牙', emoji:'⚔️', slot:'weapon', ilvl:8, minEnemyIndex:1,
    flavorText:'寒意从刀身渗入每一个伤口，令敌人冻僵战栗。',
    affixes:[{type:'strength',value:8},{type:'dexterity',value:6},{type:'damage_percent',value:15}],
    skills:[{type:'poison',name:'寒毒',value:4,description:'每次攻击追加 4 点冰毒伤害'}],
  },
  {
    id:'goblin_lucky_ring', name:'哥布林幸运戒', emoji:'💍', slot:'ring', ilvl:12, minEnemyIndex:2,
    flavorText:'哥布林囤积一生的幸运，随戒指归你所有。',
    affixes:[{type:'lucky_hit',value:25},{type:'intelligence',value:30},{type:'dexterity',value:4}],
  },
  {
    id:'skeletal_crown', name:'骷髅王冠', emoji:'👑', slot:'helmet', ilvl:22, minEnemyIndex:3,
    flavorText:'骷髅王的意志令黑暗力量加身，令弱者闻风丧胆。',
    affixes:[{type:'vitality',value:12},{type:'armour',value:15},{type:'life_regen',value:5},{type:'resist_all',value:8}],
    skills:[{type:'thorns',name:'骸骨',value:10,description:'被击中时反弹 10 点伤害'}],
  },
  {
    id:'phantom_steps', name:'幽灵之踪', emoji:'👢', slot:'boots', ilvl:22, minEnemyIndex:3,
    flavorText:'步伐如鬼魅，触地无声，敌人难以追踪。',
    affixes:[{type:'dexterity',value:10},{type:'lucky_hit',value:20},{type:'intelligence',value:15}],
    skills:[{type:'dodge',name:'幻影',value:18,description:'18% 概率闪避所有伤害'}],
  },
  {
    id:'berserker_gloves', name:'狂战士之拳', emoji:'🥊', slot:'gloves', ilvl:28, minEnemyIndex:4,
    flavorText:'佩戴此手套后，战士体内涌现出原始的暴怒。',
    affixes:[{type:'strength',value:14},{type:'damage_percent',value:20},{type:'crit_damage',value:12},{type:'overpower',value:8}],
    skills:[{type:'berserk',name:'暴怒',value:35,description:'HP < 30% 时攻击力提升 35%'}],
  },
  {
    id:'andariel_visage', name:'安达里尔的凝视', emoji:'⛑️', slot:'helmet', ilvl:35, minEnemyIndex:4,
    flavorText:'毁灭之女神的目光令所有人恐惧战栗，她的力量注入其中。',
    affixes:[{type:'vitality',value:18},{type:'life_leech',value:8},{type:'crit_damage',value:15},{type:'damage_percent',value:15}],
    skills:[{type:'poison',name:'安达里尔毒液',value:8,description:'每次攻击追加 8 点毒素伤害'}],
  },
  {
    id:'tyrant_shield', name:'暴君之盾', emoji:'🛡️', slot:'offhand', ilvl:35, minEnemyIndex:4,
    flavorText:'这面盾牌见证了无数霸主的统治，本身也承载着无上的威严。',
    affixes:[{type:'armour',value:30},{type:'resist_all',value:12},{type:'thorns',value:15},{type:'vitality',value:10}],
  },
  {
    id:'shadow_blade', name:'影刃', emoji:'🗡️', slot:'weapon', ilvl:38, minEnemyIndex:4,
    flavorText:'此刃生于黑暗，游走于光影之间，致命而隐秘。',
    affixes:[{type:'dexterity',value:16},{type:'crit_damage',value:20},{type:'life_leech',value:10},{type:'attack_speed',value:15}],
    skills:[{type:'doublestrike',name:'影分身',value:25,description:'25% 概率每回合攻击两次'}],
  },
  {
    id:'giant_smash_axe', name:'巨人粉碎斧', emoji:'🪓', slot:'weapon', ilvl:42, minEnemyIndex:5,
    flavorText:'锻造自巨人骨骼，一击足以粉碎磐石。',
    affixes:[{type:'strength',value:22},{type:'overpower',value:20},{type:'damage_percent',value:25}],
    skills:[{type:'berserk',name:'巨怒',value:30,description:'HP < 30% 时攻击力提升 30%'}],
  },
  {
    id:'hellhound_boots', name:'地狱猎犬靴', emoji:'👢', slot:'boots', ilvl:42, minEnemyIndex:5,
    flavorText:'穿上此靴，战士的速度媲美地狱犬的追猎。',
    affixes:[{type:'dexterity',value:14},{type:'attack_speed',value:20},{type:'life_on_hit',value:12}],
    skills:[{type:'vampiric',name:'猎杀',value:15,description:'击杀时恢复 15 点生命'}],
  },
  {
    id:'vampire_ring', name:'吸血鬼戒指', emoji:'💍', slot:'ring', ilvl:45, minEnemyIndex:5,
    flavorText:'戴上此戒，战士可汲取敌人的生命维系自身。',
    affixes:[{type:'life_leech',value:12},{type:'life_on_hit',value:15},{type:'dexterity',value:8}],
    skills:[{type:'lifesteal',name:'吸血鬼',value:10,description:'击中时吸取 10% 伤害恢复生命'}],
  },
  {
    id:'giant_chest', name:'巨人铠甲', emoji:'🧥', slot:'chest', ilvl:45, minEnemyIndex:5,
    flavorText:'只有最强壮的战士才能穿戴此甲，但同时力量也会倍增。',
    affixes:[{type:'vitality',value:24},{type:'armour',value:35},{type:'resist_all',value:15},{type:'life_regen',value:8}],
  },
  {
    id:'dragon_eye_necklace', name:'龙眼项链', emoji:'📿', slot:'neck', ilvl:55, minEnemyIndex:6,
    flavorText:'龙之眼珠注入其中，佩戴者可感知一切宝物的气息。',
    affixes:[{type:'lucky_hit',value:40},{type:'intelligence',value:35},{type:'vitality',value:15},{type:'life_on_hit',value:20}],
  },
  {
    id:'dragonblood_plate', name:'龙血甲', emoji:'🧥', slot:'chest', ilvl:55, minEnemyIndex:6,
    flavorText:'以真龙之血淬炼而成，坚若磐石，防御无双。',
    affixes:[{type:'armour',value:55},{type:'vitality',value:30},{type:'resist_all',value:20},{type:'thorns',value:20}],
    skills:[{type:'thorns',name:'龙鳞',value:20,description:'被击中时反弹 20 点伤害'}],
  },
  {
    id:'dragonblood_legs', name:'龙血护腿', emoji:'👖', slot:'legs', ilvl:55, minEnemyIndex:6,
    flavorText:'龙血注入护腿，坚不可摧，让穿戴者屹立不倒。',
    affixes:[{type:'armour',value:42},{type:'vitality',value:22},{type:'resist_all',value:15},{type:'life_regen',value:10}],
  },
  {
    id:'touch_of_darkness', name:'黑暗之触', emoji:'🥊', slot:'gloves', ilvl:58, minEnemyIndex:6,
    flavorText:'黑暗本身化为双手，所及之处皆为虚无。',
    affixes:[{type:'strength',value:20},{type:'crit_damage',value:25},{type:'life_leech',value:15},{type:'attack_speed',value:20}],
    skills:[{type:'doublestrike',name:'黑暗双击',value:30,description:'30% 概率每回合攻击两次'}],
  },
  {
    id:'flame_tongue_sword', name:'炎语之剑', emoji:'⚔️', slot:'weapon', ilvl:58, minEnemyIndex:6,
    flavorText:'剑身常燃烈焰，斩出的每一剑都灼烧敌人的灵魂。',
    affixes:[{type:'damage_percent',value:35},{type:'strength',value:24},{type:'crit_damage',value:18},{type:'life_leech',value:10}],
    skills:[{type:'spellblade',name:'炎语',value:25,description:'攻击力额外提升 25%'}],
  },
  {
    id:'hellfire_plate', name:'炼狱铠甲', emoji:'🧥', slot:'chest', ilvl:65, minEnemyIndex:7,
    flavorText:'地狱烈火锻造，穿戴者如站在炼狱核心，烈焰护体。',
    affixes:[{type:'armour',value:70},{type:'vitality',value:35},{type:'thorns',value:25},{type:'resist_all',value:25},{type:'life_regen',value:15}],
    skills:[{type:'thorns',name:'地狱之焰',value:30,description:'被击中时反弹 30 点伤害'}],
  },
  {
    id:'inferno_crown', name:'炼狱王冠', emoji:'👑', slot:'helmet', ilvl:65, minEnemyIndex:7,
    flavorText:'戴上此冠，战士的意志如炼狱之火，永不熄灭。',
    affixes:[{type:'vitality',value:28},{type:'life_leech',value:18},{type:'lucky_hit',value:30},{type:'life_on_hit',value:25}],
    skills:[{type:'vampiric',name:'火龙嗜血',value:20,description:'击杀时恢复 20 点生命'}],
  },
  {
    id:'time_keeper_ring', name:'时间守护戒', emoji:'💍', slot:'ring', ilvl:65, minEnemyIndex:7,
    flavorText:'时间的主宰，万物皆在其掌控之中。',
    affixes:[{type:'attack_speed',value:30},{type:'dexterity',value:20},{type:'crit_damage',value:20},{type:'lucky_hit',value:25}],
    skills:[{type:'doublestrike',name:'时之双击',value:35,description:'35% 概率每回合攻击两次'}],
  },
  {
    id:'eternity_blade', name:'永恒之刃', emoji:'⚔️', slot:'weapon', ilvl:70, minEnemyIndex:7,
    flavorText:'自混沌之初便存在的神器，凡持有者皆无敌于天下。',
    affixes:[{type:'strength',value:35},{type:'damage_percent',value:50},{type:'crit_damage',value:25},{type:'overpower',value:20},{type:'life_leech',value:15}],
    skills:[{type:'spellblade',name:'永恒剑意',value:30,description:'攻击力额外提升 30%'}],
  },
  {
    id:'eternity_shield', name:'永恒之盾', emoji:'🛡️', slot:'offhand', ilvl:70, minEnemyIndex:7,
    flavorText:'护佑者永恒不灭的意志铸成此盾，任何攻击都无法将其击碎。',
    affixes:[{type:'armour',value:80},{type:'vitality',value:40},{type:'resist_all',value:30},{type:'thorns',value:30},{type:'life_regen',value:20}],
  },
];

// ─── Item sets (Diablo-style) ───────────────────────────────────────────────────
export interface ItemSetDef {
  id: string;
  name: string;
  pieces: string[]; // uniqueId values
  bonuses: Array<{ count: number; description: string; affixes: ItemAffix[] }>;
}

export const ITEM_SETS: ItemSetDef[] = [
  {
    id: 'warrior_set',
    name: '战士传承',
    pieces: ['skeletal_crown', 'giant_chest', 'dragonblood_legs'],
    bonuses: [
      {
        count: 2,
        description: '+20 护甲，+10 力量',
        affixes: [{type:'armour',value:20},{type:'strength',value:10}],
      },
      {
        count: 3,
        description: '+80 最大生命，+20% 强化伤害，+10 生命回复',
        affixes: [{type:'vitality',value:16},{type:'damage_percent',value:20},{type:'life_regen',value:10}],
      },
    ],
  },
  {
    id: 'dragon_hunter_set',
    name: '龙猎者',
    pieces: ['flame_tongue_sword', 'tyrant_shield', 'berserker_gloves', 'hellhound_boots'],
    bonuses: [
      {
        count: 2,
        description: '+20% 强化伤害',
        affixes: [{type:'damage_percent',value:20}],
      },
      {
        count: 3,
        description: '+15% 重击，+15% 致命一击',
        affixes: [{type:'overpower',value:15},{type:'crit_damage',value:15}],
      },
      {
        count: 4,
        description: '+40% 魔法发现，+20% 攻击速度',
        affixes: [{type:'lucky_hit',value:40},{type:'attack_speed',value:20}],
      },
    ],
  },
  {
    id: 'specter_set',
    name: '幽灵圣者',
    pieces: ['andariel_visage', 'hellfire_plate', 'dragon_eye_necklace', 'time_keeper_ring'],
    bonuses: [
      {
        count: 2,
        description: '+30% 魔法发现，+25% 黄金加成',
        affixes: [{type:'lucky_hit',value:30},{type:'intelligence',value:25}],
      },
      {
        count: 3,
        description: '+15% 吸血，+20 击杀回血',
        affixes: [{type:'life_leech',value:15},{type:'life_on_hit',value:20}],
      },
      {
        count: 4,
        description: '+20 生命回复，+25% 攻击速度',
        affixes: [{type:'life_regen',value:20},{type:'attack_speed',value:25}],
      },
    ],
  },
];

// Map uniqueId → set membership for quick lookup
export const UNIQUE_SET_MAP: Record<string, string> = {};
for (const set of ITEM_SETS) {
  for (const piece of set.pieces) UNIQUE_SET_MAP[piece] = set.id;
}

// ─── Game item interface ────────────────────────────────────────────────────────
export interface GameItem {
  instanceId: string;
  name: string;
  slot: EquipmentSlot;
  emoji: string;
  rarity: Rarity;
  ilvl: number;
  affixes: ItemAffix[];   // = [...prefixes, ...suffixes, implicit?]
  prefixes: ItemAffix[];  // offensive affixes
  suffixes: ItemAffix[];  // defensive/utility affixes
  // Base weapon damage
  minDamage: number;
  maxDamage: number;
  // Computed from affixes
  attackBonus: number;
  defenceBonus: number;
  hpBonus: number;
  critRating: number;
  // Diablo-style advanced stats
  enhancedDamage: number;
  lifeOnKill: number;
  crushingBlow: number;
  magicFind: number;
  lifeRegen: number;
  goldBonus: number;
  resistAll: number;
  lifeLeech: number;      // % of damage healed to player
  deadlyStrike: number;   // % chance to double all damage
  attackSpeed: number;    // % bonus (multiplier on damage per tick)
  reflectDamage: number;  // flat damage back to attacker per hit
  source: 'smithed' | 'dropped' | 'unique' | 'set';
  baseId?: string;
  baseType?: string;
  uniqueId?: string;
  setId?: string;
  flavorText?: string;
  maxSockets: number;
  socketedGems: string[];
  skills: ItemSkill[];
}

export type EquipmentState = Partial<Record<EquipmentSlot, GameItem | null>>;

// ─── Helpers ───────────────────────────────────────────────────────────────────
export function getEquipmentBonuses(equipment: EquipmentState) {
  let attackBonus = 0, defenceBonus = 0, hpBonus = 0, critRating = 0;
  let enhancedDamage = 0, lifeOnKill = 0, crushingBlow = 0, magicFind = 0;
  let lifeRegen = 0, goldBonus = 0, resistAll = 0;
  let lifeLeech = 0, deadlyStrike = 0, attackSpeed = 0, reflectDamage = 0;

  for (const item of Object.values(equipment)) {
    if (!item) continue;
    attackBonus    += item.attackBonus;
    defenceBonus   += item.defenceBonus;
    hpBonus        += item.hpBonus;
    critRating     += item.critRating;
    enhancedDamage += item.enhancedDamage ?? 0;
    lifeOnKill     += item.lifeOnKill ?? 0;
    crushingBlow   += item.crushingBlow ?? 0;
    magicFind      += item.magicFind ?? 0;
    lifeRegen      += item.lifeRegen ?? 0;
    goldBonus      += item.goldBonus ?? 0;
    resistAll      += item.resistAll ?? 0;
    lifeLeech      += item.lifeLeech ?? 0;
    deadlyStrike   += item.deadlyStrike ?? 0;
    attackSpeed    += item.attackSpeed ?? 0;
    reflectDamage  += item.reflectDamage ?? 0;
  }

  // ── Set bonus detection ──────────────────────────────────────────────────────
  const setCount: Record<string, number> = {};
  for (const item of Object.values(equipment)) {
    if (!item?.setId) continue;
    setCount[item.setId] = (setCount[item.setId] ?? 0) + 1;
  }
  for (const [setId, count] of Object.entries(setCount)) {
    const setDef = ITEM_SETS.find(s => s.id === setId);
    if (!setDef) continue;
    for (const bonus of setDef.bonuses) {
      if (count < bonus.count) continue;
      for (const a of bonus.affixes) {
        switch (a.type) {
          case 'strength':        attackBonus    += a.value; break;
          case 'armour':          defenceBonus   += a.value; break;
          case 'vitality':    hpBonus    += a.value * 5; break;
          case 'dexterity':   critRating += a.value * 0.5; break;
          case 'intelligence': enhancedDamage += Math.floor(a.value * 0.5); break;
          case 'damage_percent': enhancedDamage += a.value; break;
          case 'life_on_hit':    lifeOnKill     += a.value; break;
          case 'overpower':      crushingBlow   += a.value; break;
          case 'lucky_hit':      magicFind      += a.value; break;
          case 'life_regen':     lifeRegen      += a.value; break;
          case 'resist_all':      resistAll      += a.value; break;
          case 'life_leech':      lifeLeech      += a.value; break;
          case 'crit_damage':   deadlyStrike   += a.value; break;
          case 'attack_speed':    attackSpeed    += a.value; break;
          case 'thorns':          reflectDamage  += a.value; break;
        }
      }
    }
  }

  return {
    attackBonus, defenceBonus, hpBonus, critRating,
    enhancedDamage, lifeOnKill, crushingBlow, magicFind,
    lifeRegen, goldBonus, resistAll,
    lifeLeech, deadlyStrike, attackSpeed, reflectDamage,
    activeSets: setCount,
  };
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
  bronze_sword:     { id: 'bronze_sword',     name: '青铜剑',   emoji: '🗡️', slot: 'weapon',  attackBonus: 9,  defenceBonus: 0,  ilvl: 5  },
  iron_sword:       { id: 'iron_sword',       name: '铁剑',     emoji: '⚔️', slot: 'weapon',  attackBonus: 17, defenceBonus: 0,  ilvl: 10 },
  steel_sword:      { id: 'steel_sword',      name: '钢剑',     emoji: '⚔️', slot: 'weapon',  attackBonus: 27, defenceBonus: 0,  ilvl: 15 },
  mithril_sword:    { id: 'mithril_sword',    name: '秘银剑',   emoji: '⚔️', slot: 'weapon',  attackBonus: 42, defenceBonus: 0,  ilvl: 25 },
  adamant_sword:    { id: 'adamant_sword',    name: '精金剑',   emoji: '⚔️', slot: 'weapon',  attackBonus: 60, defenceBonus: 0,  ilvl: 35 },
  rune_sword:       { id: 'rune_sword',       name: '符文剑',   emoji: '⚔️', slot: 'weapon',  attackBonus: 82, defenceBonus: 0,  ilvl: 50 },
  bronze_shield:    { id: 'bronze_shield',    name: '青铜盾',   emoji: '🛡️', slot: 'offhand', attackBonus: 0,  defenceBonus: 6,  ilvl: 5  },
  iron_shield:      { id: 'iron_shield',      name: '铁盾',     emoji: '🛡️', slot: 'offhand', attackBonus: 0,  defenceBonus: 12, ilvl: 10 },
  steel_shield:     { id: 'steel_shield',     name: '钢盾',     emoji: '🛡️', slot: 'offhand', attackBonus: 0,  defenceBonus: 20, ilvl: 15 },
  mithril_shield:   { id: 'mithril_shield',   name: '秘银盾',   emoji: '🛡️', slot: 'offhand', attackBonus: 0,  defenceBonus: 32, ilvl: 25 },
  bronze_helmet:    { id: 'bronze_helmet',    name: '青铜头盔', emoji: '⛑️', slot: 'helmet',  attackBonus: 0,  defenceBonus: 4,  ilvl: 5  },
  iron_helmet:      { id: 'iron_helmet',      name: '铁头盔',   emoji: '⛑️', slot: 'helmet',  attackBonus: 0,  defenceBonus: 8,  ilvl: 10 },
  steel_helmet:     { id: 'steel_helmet',     name: '钢头盔',   emoji: '⛑️', slot: 'helmet',  attackBonus: 0,  defenceBonus: 14, ilvl: 15 },
  bronze_body:      { id: 'bronze_body',      name: '青铜胸甲', emoji: '🧥', slot: 'chest',   attackBonus: 0,  defenceBonus: 9,  ilvl: 5  },
  iron_body:        { id: 'iron_body',        name: '铁胸甲',   emoji: '🧥', slot: 'chest',   attackBonus: 0,  defenceBonus: 18, ilvl: 10 },
  steel_body:       { id: 'steel_body',       name: '钢胸甲',   emoji: '🧥', slot: 'chest',   attackBonus: 0,  defenceBonus: 30, ilvl: 15 },
  bronze_legs:      { id: 'bronze_legs',      name: '青铜护腿', emoji: '👖', slot: 'legs',    attackBonus: 0,  defenceBonus: 7,  ilvl: 5  },
  iron_legs:        { id: 'iron_legs',        name: '铁护腿',   emoji: '👖', slot: 'legs',    attackBonus: 0,  defenceBonus: 14, ilvl: 10 },
  steel_legs:       { id: 'steel_legs',       name: '钢护腿',   emoji: '👖', slot: 'legs',    attackBonus: 0,  defenceBonus: 23, ilvl: 15 },
  bronze_gauntlets: { id: 'bronze_gauntlets', name: '青铜护手', emoji: '🥊', slot: 'gloves',  attackBonus: 3,  defenceBonus: 3,  ilvl: 5  },
  iron_gauntlets:   { id: 'iron_gauntlets',   name: '铁护手',   emoji: '🥊', slot: 'gloves',  attackBonus: 6,  defenceBonus: 6,  ilvl: 10 },
  steel_gauntlets:  { id: 'steel_gauntlets',  name: '钢护手',   emoji: '🥊', slot: 'gloves',  attackBonus: 10, defenceBonus: 10, ilvl: 15 },
  bronze_boots:     { id: 'bronze_boots',     name: '青铜靴',   emoji: '👢', slot: 'boots',   attackBonus: 0,  defenceBonus: 5,  ilvl: 5  },
  iron_boots:       { id: 'iron_boots',       name: '铁靴',     emoji: '👢', slot: 'boots',   attackBonus: 0,  defenceBonus: 10, ilvl: 10 },
  steel_boots:      { id: 'steel_boots',      name: '钢靴',     emoji: '👢', slot: 'boots',   attackBonus: 0,  defenceBonus: 16, ilvl: 15 },
};

export function smithedToGameItem(itemId: string): GameItem | null {
  const def = EQUIPMENT_ITEMS[itemId];
  if (!def) return null;
  const affix: ItemAffix[] = [];
  if (def.attackBonus > 0)  affix.push({ type: 'strength', value: def.attackBonus });
  if (def.defenceBonus > 0) affix.push({ type: 'armour',   value: def.defenceBonus });
  if (def.hpBonus && def.hpBonus > 0) affix.push({ type: 'vitality', value: Math.round(def.hpBonus / 5) });
  if (def.critRating && def.critRating > 0) affix.push({ type: 'dexterity', value: Math.round(def.critRating / 0.5) });
  return {
    instanceId: `smithed_${itemId}_${Date.now()}`,
    name: def.name, slot: def.slot, emoji: def.emoji,
    rarity: 'uncommon', ilvl: def.ilvl, affixes: affix,
    prefixes: [], suffixes: affix, minDamage: 0, maxDamage: 0,
    attackBonus: def.attackBonus, defenceBonus: def.defenceBonus,
    hpBonus: def.hpBonus ?? 0, critRating: def.critRating ?? 0,
    enhancedDamage: 0, lifeOnKill: 0, crushingBlow: 0,
    magicFind: 0, lifeRegen: 0, goldBonus: 0, resistAll: 0,
    lifeLeech: 0, deadlyStrike: 0, attackSpeed: 0, reflectDamage: 0,
    source: 'smithed', baseId: itemId,
    maxSockets: rollSockets('uncommon'), socketedGems: [], skills: [],
  };
}

// ─── Leather equipment items ───────────────────────────────────────────────────
// Uses hides from Hunting (hide_0..9)
export const LEATHER_ITEMS: Record<string, SmithedItemDef> = {
  // Rabbit hide (hide_0) — Tier 1
  leather_cap:       { id: 'leather_cap',       name: '皮革帽',     emoji: '🎩', slot: 'helmet',  attackBonus: 0,  defenceBonus: 3,   ilvl: 4  },
  leather_vest:      { id: 'leather_vest',      name: '皮革战衣',   emoji: '🧥', slot: 'chest',   attackBonus: 0,  defenceBonus: 6,   ilvl: 4  },
  leather_pants:     { id: 'leather_pants',     name: '皮革裤',     emoji: '👖', slot: 'legs',    attackBonus: 0,  defenceBonus: 4,   ilvl: 4  },
  leather_gloves:    { id: 'leather_gloves',    name: '皮革手套',   emoji: '🥊', slot: 'gloves',  attackBonus: 3,  defenceBonus: 2,   ilvl: 4  },
  leather_boots:     { id: 'leather_boots',     name: '皮革靴',     emoji: '👢', slot: 'boots',   attackBonus: 0,  defenceBonus: 3,   ilvl: 4  },
  // Fox hide (hide_2) — Tier 2
  studded_cap:       { id: 'studded_cap',       name: '铆钉帽',     emoji: '⛑️', slot: 'helmet',  attackBonus: 0,  defenceBonus: 10,  ilvl: 14 },
  studded_vest:      { id: 'studded_vest',      name: '铆钉战衣',   emoji: '🧥', slot: 'chest',   attackBonus: 0,  defenceBonus: 18,  ilvl: 14 },
  studded_pants:     { id: 'studded_pants',     name: '铆钉裤',     emoji: '👖', slot: 'legs',    attackBonus: 0,  defenceBonus: 13,  ilvl: 14 },
  studded_gloves:    { id: 'studded_gloves',    name: '铆钉手套',   emoji: '🥊', slot: 'gloves',  attackBonus: 7,  defenceBonus: 5,   ilvl: 14 },
  // Wolf hide (hide_3) — Tier 3
  wolf_cap:          { id: 'wolf_cap',          name: '狼皮帽',     emoji: '⛑️', slot: 'helmet',  attackBonus: 0,  defenceBonus: 15,  ilvl: 22 },
  wolf_vest:         { id: 'wolf_vest',         name: '狼皮战衣',   emoji: '🧥', slot: 'chest',   attackBonus: 0,  defenceBonus: 26,  ilvl: 22 },
  wolf_pants:        { id: 'wolf_pants',        name: '狼皮裤',     emoji: '👖', slot: 'legs',    attackBonus: 0,  defenceBonus: 20,  ilvl: 22 },
  wolf_gloves:       { id: 'wolf_gloves',       name: '狼皮手套',   emoji: '🥊', slot: 'gloves',  attackBonus: 12, defenceBonus: 7,   ilvl: 22 },
  // Bear hide (hide_4) — Tier 4
  bear_vest:         { id: 'bear_vest',         name: '熊皮战衣',   emoji: '🧥', slot: 'chest',   attackBonus: 0,  defenceBonus: 38,  ilvl: 32 },
  bear_pants:        { id: 'bear_pants',        name: '熊皮裤',     emoji: '👖', slot: 'legs',    attackBonus: 0,  defenceBonus: 28,  ilvl: 32 },
  // Dragon hide (hide_8) — Tier 5
  dragonhide_vest:   { id: 'dragonhide_vest',   name: '龙皮战衣',   emoji: '🧥', slot: 'chest',   attackBonus: 0,  defenceBonus: 72,  ilvl: 58 },
  dragonhide_boots:  { id: 'dragonhide_boots',  name: '龙皮靴',     emoji: '👢', slot: 'boots',   attackBonus: 0,  defenceBonus: 38,  ilvl: 58 },
  // Phoenix hide (hide_9) — Tier 6
  phoenix_vest:      { id: 'phoenix_vest',      name: '凤凰羽战衣', emoji: '🧥', slot: 'chest',   attackBonus: 5,  defenceBonus: 90,  ilvl: 72 },
};

// ─── Jewelry items ─────────────────────────────────────────────────────────────
// Uses crafting items (item_0..9) from the Crafting skill
export const JEWELRY_ITEMS: Record<string, SmithedItemDef> = {
  // Cloth (item_0) — Tier 1
  copper_ring:      { id: 'copper_ring',     name: '铜戒指',     emoji: '💍', slot: 'ring', attackBonus: 0, defenceBonus: 0, critRating: 1.5, ilvl: 3  },
  leather_amulet:   { id: 'leather_amulet',  name: '皮革护符',   emoji: '📿', slot: 'neck', attackBonus: 0, defenceBonus: 0, hpBonus: 10,     ilvl: 3  },
  // Leather (item_1) — Tier 2
  tin_band:         { id: 'tin_band',        name: '锡指环',     emoji: '💍', slot: 'ring', attackBonus: 0, defenceBonus: 0, critRating: 2.5, ilvl: 9  },
  cord_pendant:     { id: 'cord_pendant',    name: '绳吊坠',     emoji: '📿', slot: 'neck', attackBonus: 0, defenceBonus: 0, hpBonus: 20,     ilvl: 9  },
  // Jewelry (item_2) — Tier 3
  bronze_signet:    { id: 'bronze_signet',   name: '青铜印戒',   emoji: '💍', slot: 'ring', attackBonus: 2, defenceBonus: 0, critRating: 3.0, ilvl: 15 },
  iron_chain:       { id: 'iron_chain',      name: '铁项链',     emoji: '📿', slot: 'neck', attackBonus: 0, defenceBonus: 0, hpBonus: 30,     ilvl: 15 },
  // Armor (item_3) — Tier 4
  silver_ring:      { id: 'silver_ring',     name: '银戒指',     emoji: '💍', slot: 'ring', attackBonus: 0, defenceBonus: 0, critRating: 5.0, ilvl: 22 },
  silver_chain:     { id: 'silver_chain',    name: '银链',       emoji: '📿', slot: 'neck', attackBonus: 3, defenceBonus: 0, hpBonus: 35,     ilvl: 22 },
  // Weapon (item_4) — Tier 5
  gold_ring:        { id: 'gold_ring',       name: '金戒指',     emoji: '💍', slot: 'ring', attackBonus: 5, defenceBonus: 0, critRating: 6.0, ilvl: 30 },
  gold_locket:      { id: 'gold_locket',     name: '金锁扣',     emoji: '📿', slot: 'neck', attackBonus: 0, defenceBonus: 0, hpBonus: 50,     ilvl: 30 },
  // Artifact (item_5) — Tier 6
  mithril_signet:   { id: 'mithril_signet',  name: '秘银印戒',   emoji: '💍', slot: 'ring', attackBonus: 5, defenceBonus: 0, critRating: 8.0, ilvl: 38 },
  runed_pendant:    { id: 'runed_pendant',   name: '符文吊坠',   emoji: '📿', slot: 'neck', attackBonus: 5, defenceBonus: 5, hpBonus: 65,     ilvl: 38 },
  // Relic (item_6) — Tier 7
  arcane_band:      { id: 'arcane_band',     name: '奥术指环',   emoji: '💍', slot: 'ring', attackBonus: 8, defenceBonus: 0, critRating: 10.5,ilvl: 48 },
  arcane_locket:    { id: 'arcane_locket',   name: '奥术锁扣',   emoji: '📿', slot: 'neck', attackBonus: 5, defenceBonus: 5, hpBonus: 80,     ilvl: 48 },
  // Dragon ring (item_8) — Tier 8
  dragon_ring:      { id: 'dragon_ring',     name: '龙火戒指',   emoji: '💍', slot: 'ring', attackBonus:12, defenceBonus: 0, critRating: 13.0,ilvl: 62 },
  dragon_pendant:   { id: 'dragon_pendant',  name: '龙鳞吊坠',   emoji: '📿', slot: 'neck', attackBonus: 8, defenceBonus: 8, hpBonus: 100,    ilvl: 62 },
  // Divine (item_9) — Tier 9
  eternal_ring:     { id: 'eternal_ring',    name: '永恒戒指',   emoji: '💍', slot: 'ring', attackBonus:18, defenceBonus: 0, critRating: 18.0,ilvl: 78 },
  eternal_pendant:  { id: 'eternal_pendant', name: '永恒吊坠',   emoji: '📿', slot: 'neck', attackBonus:10, defenceBonus:10, hpBonus: 130,    ilvl: 78 },
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
  common:    ['破旧', '磨损', '粗制', '老旧', '残破'],
  uncommon:  ['坚固', '精良', '光泽', '强化', '锋利'],
  rare:      ['精工', '附魔', '精炼', '卓越', '淬火'],
  epic:      ['远古', '奥术', '神话', '符文', '圣洁'],
  legendary: ['传说', '永恒', '神赋', '炼狱', '不朽'],
};

const SLOT_BASE_NAMES: Record<EquipmentSlot, string[]> = {
  weapon:  ['剑', '刃', '斧', '锤', '战锤', '巨剑', '枪', '戟', '战刃'],
  offhand: ['盾', '圆盾', '法典', '法球', '匕首', '标盾', '神盾', '护壁'],
  helmet:  ['头盔', '王冠', '兜帽', '面罩', '颅盖', '护面', '头冠', '面甲'],
  chest:   ['胸甲', '法袍', '上衣', '锁子甲', '胸铠', '链甲', '战衣'],
  legs:    ['腿甲', '马裤', '护腿', '胫甲', '腿铠', '战裤'],
  gloves:  ['护手', '手套', '握把', '缠带', '护腕', '拳套'],
  boots:   ['靴子', '铁靴', '足甲', '重踏', '护靴', '软鞋'],
  neck:    ['项链', '护身符', '吊坠', '颈环', '链条', '颈圈', '锁扣'],
  ring:    ['戒指', '指环', '印戒', '环圈', '圆环', '封印', '线圈'],
};

// Slot-biased PREFIX pools (offensive affixes, go in item name prefix slot)
const SLOT_PREFIX_POOL: Record<EquipmentSlot, AffixType[]> = {
  weapon:  ['strength', 'strength', 'damage_percent', 'damage_percent', 'crit_damage', 'attack_speed', 'life_leech', 'dexterity'],
  offhand: ['strength', 'dexterity', 'damage_percent', 'crit_damage', 'attack_speed'],
  helmet:  ['strength', 'dexterity', 'vitality', 'damage_percent', 'crit_damage'],
  chest:   ['strength', 'dexterity', 'vitality', 'damage_percent'],
  legs:    ['strength', 'dexterity', 'vitality'],
  gloves:  ['strength', 'strength', 'damage_percent', 'crit_damage', 'attack_speed', 'life_leech', 'overpower'],
  boots:   ['dexterity', 'dexterity', 'attack_speed', 'crit_damage', 'damage_percent'],
  neck:    ['damage_percent', 'life_leech', 'crit_damage', 'attack_speed', 'dexterity', 'strength'],
  ring:    ['damage_percent', 'life_leech', 'crit_damage', 'attack_speed', 'dexterity', 'strength'],
};

// Slot-biased SUFFIX pools (defensive/utility affixes)
const SLOT_SUFFIX_POOL: Record<EquipmentSlot, AffixType[]> = {
  weapon:  ['life_on_hit', 'overpower', 'vitality'],
  offhand: ['armour', 'armour', 'vitality', 'resist_all', 'resist_all', 'life_regen', 'thorns'],
  helmet:  ['armour', 'vitality', 'vitality', 'lucky_hit', 'life_regen', 'resist_all', 'life_on_hit'],
  chest:   ['armour', 'armour', 'vitality', 'resist_all', 'life_regen', 'thorns'],
  legs:    ['armour', 'armour', 'vitality', 'resist_all', 'life_regen', 'thorns'],
  gloves:  ['armour', 'life_on_hit', 'thorns', 'vitality'],
  boots:   ['armour', 'vitality', 'intelligence', 'lucky_hit', 'resist_all', 'life_on_hit'],
  neck:    ['lucky_hit', 'life_on_hit', 'intelligence', 'life_regen', 'vitality', 'resist_all'],
  ring:    ['lucky_hit', 'life_on_hit', 'intelligence', 'life_regen', 'vitality', 'resist_all'],
};

// Legacy unified pool for backward compat
const SLOT_AFFIX_POOL: Record<EquipmentSlot, AffixType[]> = Object.fromEntries(
  (Object.keys(SLOT_PREFIX_POOL) as EquipmentSlot[]).map(slot => [
    slot,
    [...SLOT_PREFIX_POOL[slot], ...SLOT_SUFFIX_POOL[slot]],
  ])
) as Record<EquipmentSlot, AffixType[]>;

const RARITY_AFFIX_COUNT: Record<Rarity, number> = {
  common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5,
};

const RARITY_MULTIPLIER: Record<Rarity, number> = {
  common: 0.5, uncommon: 0.9, rare: 1.4, epic: 2.0, legendary: 3.2,
};

const AFFIX_SCALING: Record<AffixType, number> = {
  strength:       1.2,
  dexterity:      0.8,
  vitality:       0.7,
  intelligence:   0.6,
  armour:         1.3,
  damage_percent: 0.6,
  life_on_hit:    0.9,
  overpower:      0.35,
  lucky_hit:      0.55,
  life_regen:     0.5,
  resist_all:     0.45,
  life_leech:     0.25,
  crit_damage:    0.3,
  attack_speed:   0.35,
  thorns:         0.5,
};

function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min: number, max: number): number { return min + Math.floor(Math.random() * (max - min + 1)); }

function computeItemStats(affixes: ItemAffix[]) {
  const sum = (type: AffixType) => affixes.filter(a => a.type === type).reduce((s, a) => s + a.value, 0);
  return {
    attackBonus:    sum('strength'),
    defenceBonus:   sum('armour'),
    hpBonus:        sum('vitality') * 5,
    critRating:     sum('dexterity') * 0.5,
    enhancedDamage: sum('damage_percent') + Math.floor(sum('intelligence') * 0.5),
    lifeOnKill:     sum('life_on_hit'),
    crushingBlow:   sum('overpower'),
    magicFind:      sum('lucky_hit'),
    lifeRegen:      sum('life_regen'),
    goldBonus:      0,
    resistAll:      sum('resist_all'),
    lifeLeech:      sum('life_leech'),
    deadlyStrike:   sum('crit_damage'),
    attackSpeed:    sum('attack_speed'),
    reflectDamage:  sum('thorns'),
  };
}

// Enemy-tier ilvl drop bands (explicit, not formulaic)
const ENEMY_ILVL_BANDS: [number, number][] = [
  [1,  8],  // 0: chicken
  [5,  15], // 1: cow
  [10, 22], // 2: goblin
  [18, 32], // 3: skeleton
  [28, 45], // 4: troll
  [38, 55], // 5: giant
  [48, 65], // 6: dragon
  [58, 75], // 7: fire_dragon
];

// Prefix/suffix counts per rarity (Diablo-style rarity template)
function getRarityAffixCounts(rarity: Rarity): { numPrefix: number; numSuffix: number } {
  switch (rarity) {
    case 'common':    return { numPrefix: 0, numSuffix: 0 };
    // Uncommon: randomly one prefix OR one suffix (not always prefix)
    case 'uncommon':  return Math.random() < 0.5 ? { numPrefix: 1, numSuffix: 0 } : { numPrefix: 0, numSuffix: 1 };
    case 'rare':      return { numPrefix: randInt(1, 2), numSuffix: randInt(1, 2) };
    case 'epic':      return { numPrefix: 2, numSuffix: 2 }; // + implicit
    case 'legendary': return { numPrefix: 3, numSuffix: 3 };
  }
}

// ── Unique item builder (shared by early roll + legendary rarity path) ────────
function buildUniqueGameItem(def: UniqueItemDef): GameItem {
  const affixes = def.affixes;
  const setId = UNIQUE_SET_MAP[def.id];
  const stats = computeItemStats(affixes);
  const eligibleForUnique = SLOT_BASES[def.slot].filter(b => b.reqIlvl <= def.ilvl);
  const base = eligibleForUnique.length
    ? eligibleForUnique[eligibleForUnique.length - 1]
    : SLOT_BASES[def.slot][0];
  return {
    instanceId: `unique_${def.id}_${Date.now()}`,
    name: def.name,
    slot: def.slot, emoji: def.emoji, rarity: 'legendary', ilvl: def.ilvl,
    affixes, prefixes: [], suffixes: affixes,
    minDamage: base.minDamage, maxDamage: base.maxDamage,
    ...stats,
    source: 'unique', uniqueId: def.id, setId,
    flavorText: def.flavorText,
    maxSockets: 2, socketedGems: [],
    skills: (def.skills ?? []).map(s => ({ ...s })),
  };
}

export function generateDroppedItem(enemyIndex: number, playerMagicFind = 0): GameItem {
  const band = ENEMY_ILVL_BANDS[Math.min(enemyIndex, ENEMY_ILVL_BANDS.length - 1)];
  const ilvl = band[0] + randInt(0, band[1] - band[0]);

  // ── Unique drop check (enemy tier + ilvl gate) ───────────────────────────────
  const eligibleUniques = UNIQUE_ITEMS.filter(u => u.minEnemyIndex <= enemyIndex && u.ilvl <= ilvl + 10);
  const uniqueDropChance = 0.02 + enemyIndex * 0.005; // 2%–5.5%
  if (eligibleUniques.length && Math.random() < uniqueDropChance) {
    return buildUniqueGameItem(rand(eligibleUniques));
  }

  // Rarity weighting by enemy tier + player magic find bonus
  const mfBonus = Math.min(playerMagicFind, 200);
  const mfMult  = 1 + mfBonus / 100;
  const weights = [
    0,  // common — 打怪最低掉落蓝色（uncommon）
    Math.max(15, 60 - enemyIndex * 7),
    Math.min(25, Math.floor((enemyIndex * 3) * mfMult)),
    Math.min(15, Math.floor(enemyIndex * 1.2 * mfMult)),
    enemyIndex >= 5 ? Math.max(1, Math.floor(1.5 * mfMult)) : 0,
  ];
  // Legendaries are always unique named items — exclude from procedural rarity pool
  const pool: Rarity[] = [];
  (['common', 'uncommon', 'rare', 'epic'] as Rarity[]).forEach((r, i) => {
    for (let w = 0; w < weights[i]; w++) pool.push(r);
  });
  const rarity = rand(pool);

  const slot = rand(ALL_SLOTS);

  // ── Item base: pick eligible bases for this slot/ilvl ─────────────────────────
  const eligibleBases = SLOT_BASES[slot].filter(b => b.reqIlvl <= ilvl);
  const base = eligibleBases.length ? eligibleBases[eligibleBases.length - 1] : SLOT_BASES[slot][0];

  // ── Prefix/suffix split (Diablo rarity template) ─────────────────────────────
  const { numPrefix, numSuffix } = getRarityAffixCounts(rarity);
  const mult = RARITY_MULTIPLIER[rarity];

  const ALL_TYPES: AffixType[] = [
    'strength','dexterity','vitality','armour',
    'damage_percent','life_on_hit','overpower','lucky_hit',
    'life_regen','intelligence','resist_all',
    'life_leech','crit_damage','attack_speed','thorns',
  ];

  function pickAffixes(pool: AffixType[], count: number, used: Set<AffixType>): ItemAffix[] {
    const result: ItemAffix[] = [];
    for (let i = 0; i < count; i++) {
      const available = ALL_TYPES.filter(t => !used.has(t));
      if (!available.length) break;
      const candidate = rand(pool);
      const type = available.includes(candidate) ? candidate : rand(available);
      used.add(type);
      const value = Math.max(1, Math.round(ilvl * mult * AFFIX_SCALING[type]));
      result.push({ type, value });
    }
    return result;
  }

  const usedTypes = new Set<AffixType>();
  // Add implicit if present
  if (base.implicit) usedTypes.add(base.implicit.type);

  const prefixes = pickAffixes(SLOT_PREFIX_POOL[slot], numPrefix, usedTypes);
  const suffixes = pickAffixes(SLOT_SUFFIX_POOL[slot], numSuffix, usedTypes);
  const implicit = base.implicit ? [base.implicit] : [];
  const affixes  = [...implicit, ...prefixes, ...suffixes];

  const stats = computeItemStats(affixes);

  // ── Name generation: "[prefix] [base] [suffix]" Diablo-style ─────────────────
  const namePrefix = rarity !== 'common' ? rand(RARITY_PREFIXES[rarity]) + ' ' : '';
  const baseName   = base.name;
  const nameSuffix = rarity === 'epic' || rarity === 'legendary'
    ? ' · ' + rand(SLOT_BASE_NAMES[slot]) : '';

  return {
    instanceId: `drop_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name: `${namePrefix}${baseName}${nameSuffix}`,
    slot, emoji: base.emoji, rarity, ilvl, affixes, prefixes, suffixes,
    minDamage: base.minDamage, maxDamage: base.maxDamage,
    ...stats,
    source: 'dropped',
    baseType: base.id,
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
  { id: 'chicken',    name: '小鸡',   emoji: '🐔', maxHp: 15,   attack: 1,  defence: 0,  xp: 8,    drops: { gold: [1, 2] },               reqCombatLevel: 1  },
  { id: 'cow',        name: '奶牛',   emoji: '🐄', maxHp: 35,   attack: 4,  defence: 0,  xp: 20,   drops: { gold: [2, 5],  bones: 1 },    reqCombatLevel: 5  },
  { id: 'goblin',     name: '哥布林', emoji: '👺', maxHp: 70,   attack: 8,  defence: 2,  xp: 45,   drops: { gold: [4, 10], bones: 1 },    reqCombatLevel: 10 },
  { id: 'skeleton',   name: '骷髅',   emoji: '💀', maxHp: 140,  attack: 15, defence: 5,  xp: 100,  drops: { gold: [8, 18], bones: 2 },    reqCombatLevel: 20 },
  { id: 'troll',      name: '食人魔', emoji: '👹', maxHp: 280,  attack: 26, defence: 10, xp: 200,  drops: { gold: [18, 40], bones: 3 },   reqCombatLevel: 35 },
  { id: 'giant',      name: '巨人',   emoji: '🦣', maxHp: 500,  attack: 42, defence: 18, xp: 380,  drops: { gold: [35, 75] },             reqCombatLevel: 50 },
  { id: 'dragon',     name: '绿龙',   emoji: '🐲', maxHp: 850,  attack: 65, defence: 30, xp: 720,  drops: { gold: [70, 140], dragonBones: 1 }, reqCombatLevel: 65 },
  { id: 'fire_dragon',name: '火龙',   emoji: '🔥', maxHp: 1400, attack: 95, defence: 50, xp: 1400, drops: { gold: [140, 280], dragonBones: 2 }, reqCombatLevel: 80 },
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
  if (def.hpBonus && def.hpBonus > 0) affix.push({ type: 'vitality', value: Math.round(def.hpBonus / 5) });
  if (def.critRating && def.critRating > 0) affix.push({ type: 'dexterity', value: Math.round(def.critRating / 0.5) });
  const rarity: Rarity = 'uncommon';
  return {
    instanceId: `crafted_${itemId}_${Date.now()}`,
    name: def.name, slot: def.slot, emoji: def.emoji,
    rarity, ilvl: def.ilvl, affixes: affix, prefixes: [], suffixes: affix,
    minDamage: 0, maxDamage: 0,
    attackBonus: def.attackBonus, defenceBonus: def.defenceBonus,
    hpBonus: def.hpBonus ?? 0, critRating: def.critRating ?? 0,
    enhancedDamage: 0, lifeOnKill: 0, crushingBlow: 0,
    magicFind: 0, lifeRegen: 0, goldBonus: 0, resistAll: 0,
    lifeLeech: 0, deadlyStrike: 0, attackSpeed: 0, reflectDamage: 0,
    source: 'smithed', baseId: itemId,
    maxSockets: rollSockets(rarity), socketedGems: [], skills: [],
  };
}
