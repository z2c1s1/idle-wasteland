// ─── Rarity system ─────────────────────────────────────────────────────────────
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';

export const RARITY_LABEL: Record<Rarity, string> = {
  common:    '普通',
  uncommon:  '魔法',
  rare:      '稀有',
  epic:      '神圣',
  legendary: '独特',
  mythic:    '神话',
};

export const RARITY_COLOR: Record<Rarity, string> = {
  common:    'text-gray-300',      // 普通 — 白
  uncommon:  'text-blue-400',      // 魔法 — 蓝
  rare:      'text-purple-400',    // 稀有 — 紫
  epic:      'text-yellow-400',    // 神圣 — 黄
  legendary: 'text-orange-400',    // 独特 — 橙
  mythic:    'text-red-400',       // 神话 — 红
};

export const RARITY_BORDER: Record<Rarity, string> = {
  common:    'border-gray-400/40',
  uncommon:  'border-blue-500/40',
  rare:      'border-purple-500/40',
  epic:      'border-yellow-500/40',
  legendary: 'border-orange-500/60',
  mythic:    'border-red-500/60',
};

export const RARITY_BG: Record<Rarity, string> = {
  common:    'bg-gray-300/8',
  uncommon:  'bg-blue-400/10',
  rare:      'bg-purple-400/10',
  epic:      'bg-yellow-400/12',
  legendary: 'bg-orange-400/15',
  mythic:    'bg-red-400/15',
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
  { chance:0.03, pool:['ruby_chipped','sapphire_chipped'] },
  { chance:0.04, pool:['ruby_chipped','sapphire_chipped','emerald_chipped'] },
  { chance:0.04, pool:['ruby_chipped','sapphire_chipped','emerald_chipped','topaz_chipped'] },
  { chance:0.05, pool:['ruby_flawed','sapphire_flawed','emerald_flawed'] },
  { chance:0.05, pool:['ruby_flawed','sapphire_flawed','emerald_flawed','topaz_flawed'] },
  { chance:0.06, pool:['ruby_normal','sapphire_normal','emerald_normal'] },
  { chance:0.06, pool:['ruby_normal','sapphire_normal','emerald_normal','topaz_normal'] },
  { chance:0.07, pool:['ruby_normal','sapphire_normal','emerald_normal','topaz_normal','ruby_flawless'] },
  { chance:0.07, pool:['ruby_flawless','sapphire_flawless','emerald_flawless','topaz_flawless'] },
  { chance:0.08, pool:['ruby_flawless','sapphire_flawless','emerald_flawless','topaz_flawless','diamond_normal'] },
  { chance:0.08, pool:['ruby_flawless','sapphire_flawless','emerald_flawless','topaz_flawless','diamond_flawless'] },
  { chance:0.09, pool:['ruby_flawless','sapphire_flawless','emerald_flawless','topaz_flawless','diamond_flawless','ruby_perfect'] },
  { chance:0.09, pool:['ruby_perfect','sapphire_perfect','emerald_perfect'] },
  { chance:0.10, pool:['ruby_perfect','sapphire_perfect','emerald_perfect','topaz_perfect'] },
  { chance:0.10, pool:['ruby_perfect','sapphire_perfect','emerald_perfect','topaz_perfect','diamond_flawless'] },
  { chance:0.11, pool:['ruby_perfect','sapphire_perfect','emerald_perfect','topaz_perfect','diamond_perfect'] },
  { chance:0.12, pool:['ruby_perfect','sapphire_perfect','emerald_perfect','topaz_perfect','diamond_perfect','ruby_perfect'] },
  { chance:0.12, pool:['ruby_perfect','sapphire_perfect','emerald_perfect','topaz_perfect','diamond_perfect'] },
  { chance:0.14, pool:['ruby_perfect','sapphire_perfect','emerald_perfect','topaz_perfect','diamond_perfect'] },
  { chance:0.16, pool:['ruby_perfect','sapphire_perfect','emerald_perfect','topaz_perfect','diamond_perfect'] },
  { chance:0.18, pool:['ruby_perfect','sapphire_perfect','emerald_perfect','topaz_perfect','diamond_perfect'] },
  { chance:0.20, pool:['ruby_perfect','sapphire_perfect','emerald_perfect','topaz_perfect','diamond_perfect'] },
];

// ─── Item skills (Diablo-style procs) ──────────────────────────────────────────
export type SkillType = 'lifesteal' | 'thorns' | 'berserk' | 'doublestrike' | 'dodge' | 'poison' | 'spellblade' | 'vampiric' | 'skill_rank'
  | 'meteor' | 'chain_lightning' | 'frost_nova' | 'blood_sacrifice' | 'shadow_clone' | 'divine_shield' | 'execute' | 'avalanche'
  | 'cleave' | 'corpse_explosion' | 'iron_maiden' | 'mortal_strike' | 'reincarnation' | 'frenzy' | 'arcane_barrage' | 'last_stand';

export interface ItemSkill {
  type: SkillType;
  name: string;
  description: string;
  chance?: number;
  magnitude?: number;
  value?: number;
}

export const SKILL_EMOJI: Record<SkillType, string> = {
  lifesteal:   '🩸', thorns: '🌵', berserk: '💢', doublestrike: '⚡',
  dodge:       '💨', poison: '☠️', spellblade: '✨', vampiric: '🧛',
  skill_rank:  '📖',
  meteor: '☄️', chain_lightning: '⚡', frost_nova: '❄️', blood_sacrifice: '🩸',
  shadow_clone: '👥', divine_shield: '🛡️', execute: '💀', avalanche: '🏔️',
  cleave: '🪓', corpse_explosion: '💥', iron_maiden: '⛓️',
  mortal_strike: '⚔️', reincarnation: '🔄', frenzy: '😤',
  arcane_barrage: '🔮', last_stand: '🛡️',
};
export const SKILL_COLOR: Record<SkillType, string> = {
  lifesteal: 'text-red-300', thorns: 'text-green-300', berserk: 'text-orange-300',
  doublestrike: 'text-yellow-300', dodge: 'text-blue-300', poison: 'text-purple-300',
  spellblade: 'text-cyan-300', vampiric: 'text-pink-300',
  skill_rank: 'text-violet-300',
  meteor: 'text-red-400', chain_lightning: 'text-blue-300', frost_nova: 'text-cyan-300',
  blood_sacrifice: 'text-red-500', shadow_clone: 'text-purple-400', divine_shield: 'text-yellow-300',
  execute: 'text-red-500', avalanche: 'text-blue-200',
  cleave: 'text-red-300', corpse_explosion: 'text-green-400', iron_maiden: 'text-purple-300',
  mortal_strike: 'text-red-400', reincarnation: 'text-yellow-300', frenzy: 'text-orange-400',
  arcane_barrage: 'text-blue-400', last_stand: 'text-cyan-400',
};

const SKILL_POOL: { type: SkillType; name: string; cMin: number; cMax: number; mMin: number; mMax: number; desc: (c: number, m: number) => string }[] = [
  { type:'lifesteal',   name:'吸血',       cMin:3,cMax:15,mMin:3,mMax:15, desc:(c,m)=>`${c}%概率吸取${m}%伤害` },
  { type:'thorns',      name:'荆棘',       cMin:5,cMax:25,mMin:2,mMax:20, desc:(c,m)=>`${c}%概率反弹${m}点伤害` },
  { type:'berserk',     name:'狂战',       cMin:100,cMax:100,mMin:10,mMax:50, desc:(_,m)=>`HP<30%时攻击+${m}%` },
  { type:'doublestrike',name:'双击',       cMin:10,cMax:35,mMin:10,mMax:35, desc:(c,_)=>`${c}%概率双击` },
  { type:'dodge',       name:'闪避',       cMin:5,cMax:25,mMin:5,mMax:25, desc:(c,_)=>`${c}%概率闪避` },
  { type:'poison',      name:'淬毒',       cMin:10,cMax:30,mMin:2,mMax:12, desc:(c,m)=>`${c}%概率+${m}毒伤` },
  { type:'spellblade',  name:'剑术',       cMin:100,cMax:100,mMin:5,mMax:30, desc:(_,m)=>`攻击+${m}%` },
  { type:'vampiric',    name:'嗜血',       cMin:10,cMax:30,mMin:5,mMax:20, desc:(c,m)=>`${c}%概率击杀回${m}HP` },
  { type:'skill_rank',  name:'+技能等级',  cMin:100,cMax:100,mMin:1,mMax:3, desc:(_,m)=>`技能等级+${m}` },
  { type:'meteor',          name:'陨石',       cMin:1,cMax:25,mMin:100,mMax:200, desc:(c,m)=>`${c}%陨石${m}%伤害` },
  { type:'chain_lightning', name:'连锁闪电',   cMin:1,cMax:25,mMin:50,mMax:150, desc:(c,m)=>`${c}%闪电${m}%伤害` },
  { type:'frost_nova',      name:'冰霜新星',   cMin:1,cMax:20,mMin:1,mMax:1, desc:(c,_)=>`${c}%冻结1回合` },
  { type:'blood_sacrifice', name:'血祭',       cMin:100,cMax:100,mMin:5,mMax:20, desc:(_,m)=>`消耗${m}%HP换伤害` },
  { type:'shadow_clone',    name:'暗影分身',   cMin:1,cMax:15,mMin:100,mMax:200, desc:(c,m)=>`${c}%分身${m}%伤害` },
  { type:'divine_shield',   name:'神圣护盾',   cMin:1,cMax:20,mMin:1,mMax:1, desc:(c,_)=>`${c}%概率免伤` },
  { type:'execute',         name:'处决',       cMin:1,cMax:25,mMin:1,mMax:1, desc:(c,_)=>`${c}%处决HP<20%` },
  { type:'avalanche',       name:'雪崩',       cMin:1,cMax:20,mMin:100,mMax:200, desc:(c,m)=>`暴击${c}%追加${m}%` },
  { type:'cleave',          name:'顺劈',       cMin:1,cMax:25,mMin:50,mMax:150, desc:(c,m)=>`${c}%顺劈${m}%` },
  { type:'corpse_explosion',name:'尸爆',       cMin:1,cMax:20,mMin:10,mMax:50, desc:(c,m)=>`${c}%尸爆${m}%` },
  { type:'iron_maiden',     name:'铁处女',     cMin:1,cMax:25,mMin:10,mMax:50, desc:(c,m)=>`${c}%反伤${m}%` },
  { type:'mortal_strike',   name:'致死打击',   cMin:1,cMax:20,mMin:10,mMax:40, desc:(c,m)=>`${c}%弱化${m}%` },
  { type:'reincarnation',   name:'复生',       cMin:1,cMax:15,mMin:20,mMax:60, desc:(c,m)=>`${c}%复活${m}%HP` },
  { type:'frenzy',          name:'狂乱',       cMin:1,cMax:20,mMin:10,mMax:40, desc:(c,m)=>`${c}%狂乱+${m}%` },
  { type:'arcane_barrage',  name:'奥术弹幕',   cMin:1,cMax:20,mMin:2,mMax:5, desc:(c,m)=>`${c}%追加${m}击` },
  { type:'last_stand',      name:'破釜沉舟',   cMin:1,cMax:25,mMin:20,mMax:60, desc:(c,m)=>`HP<${m}%时${Math.floor(m*0.8)}%减伤` },
];

const RARITY_SKILL_COUNT: Record<Rarity, number> = {
  common: 0, uncommon: 0, rare: 1, epic: 2, legendary: 3, mythic: 4,
};
const RARITY_MAX_SOCKETS: Record<Rarity, number> = {
  common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4, mythic: 5,
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
    const chance = Math.round(s.cMin + Math.random() * (s.cMax - s.cMin));
    const magnitude = Math.round(s.mMin + Math.random() * (s.mMax - s.mMin));
    result.push({ type: s.type, name: s.name, chance, magnitude, description: s.desc(chance, magnitude) });
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
  combatStyle?: 'melee' | 'ranged' | 'magic'; // weapon combat type
  minDamage: number;    // weapon: base min damage; armor: 0
  maxDamage: number;    // weapon: base max damage; armor: 0
  baseDefence: number;  // armor base defence value; weapon: 0
  implicit?: { type: AffixType; value: number }; // always-present affix (not randomized)
}

export const SLOT_BASES: Record<EquipmentSlot, ItemBase[]> = {
  weapon: [
    { id:'dagger',     name:'匕首',   emoji:'🗡️', slot:'weapon', reqIlvl:1,  minDamage:2,  maxDamage:6,  baseDefence:0, combatStyle:'melee' },
    { id:'short_sword',name:'短剑',   emoji:'⚔️', slot:'weapon', reqIlvl:8,  minDamage:4,  maxDamage:10, baseDefence:0, combatStyle:'melee' },
    { id:'scimitar',   name:'弯刀',   emoji:'⚔️', slot:'weapon', reqIlvl:15, minDamage:6,  maxDamage:15, baseDefence:0, combatStyle:'melee' },
    { id:'long_sword', name:'长剑',   emoji:'⚔️', slot:'weapon', reqIlvl:25, minDamage:10, maxDamage:22, baseDefence:0, combatStyle:'melee' },
    { id:'battle_axe', name:'战斧',   emoji:'🪓', slot:'weapon', reqIlvl:35, minDamage:14, maxDamage:30, baseDefence:0, combatStyle:'melee' },
    { id:'great_sword',name:'巨剑',   emoji:'⚔️', slot:'weapon', reqIlvl:48, minDamage:20, maxDamage:45, baseDefence:0, combatStyle:'melee' },
    { id:'rune_blade',  name:'符文刃', emoji:'✨', slot:'weapon', reqIlvl:60, minDamage:28, maxDamage:62, baseDefence:0, combatStyle:'melee' },
    // Ranged weapons
    { id:'shortbow',   name:'短弓',   emoji:'🏹', slot:'weapon', reqIlvl:1,  minDamage:1, maxDamage:5,  baseDefence:0, combatStyle:'ranged' },
    { id:'longbow',    name:'长弓',   emoji:'🏹', slot:'weapon', reqIlvl:10, minDamage:3, maxDamage:9,  baseDefence:0, combatStyle:'ranged' },
    { id:'composite_bow',name:'复合弓',emoji:'🏹',slot:'weapon', reqIlvl:22, minDamage:5, maxDamage:14, baseDefence:0, combatStyle:'ranged' },
    { id:'crossbow',   name:'轻弩',   emoji:'🏹', slot:'weapon', reqIlvl:35, minDamage:8, maxDamage:22, baseDefence:0, combatStyle:'ranged' },
    { id:'heavy_crossbow',name:'重弩',emoji:'🏹',slot:'weapon', reqIlvl:48, minDamage:12,maxDamage:35, baseDefence:0, combatStyle:'ranged' },
    { id:'rune_bow',   name:'符文弓', emoji:'🏹', slot:'weapon', reqIlvl:62, minDamage:18,maxDamage:50, baseDefence:0, combatStyle:'ranged' },
    // Magic weapons
    { id:'apprentice_staff',name:'学徒杖',emoji:'🪄',slot:'weapon',reqIlvl:1, minDamage:2,maxDamage:7, baseDefence:0, combatStyle:'magic' },
    { id:'elemental_staff', name:'元素杖',emoji:'🪄',slot:'weapon',reqIlvl:12,minDamage:4,maxDamage:12,baseDefence:0, combatStyle:'magic' },
    { id:'arcane_staff',    name:'秘法杖',emoji:'🪄',slot:'weapon',reqIlvl:25,minDamage:6,maxDamage:18,baseDefence:0, combatStyle:'magic' },
    { id:'dragon_staff',    name:'龙语法杖',emoji:'🪄',slot:'weapon',reqIlvl:38,minDamage:9,maxDamage:26,baseDefence:0, combatStyle:'magic' },
    { id:'void_staff',      name:'虚空法杖',emoji:'🪄',slot:'weapon',reqIlvl:52,minDamage:13,maxDamage:38,baseDefence:0, combatStyle:'magic' },
    { id:'chaos_codex',     name:'混沌法典',emoji:'📖',slot:'weapon',reqIlvl:65,minDamage:18,maxDamage:52,baseDefence:0, combatStyle:'magic' },
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
  minEnemyIndex: number;
  affixes: ItemAffix[];
  skills?: { type: SkillType; name: string; chance?: number; magnitude?: number; value?: number; description: string }[];
  legendaryPower?: string;
  combatStyle?: CombatStyle;
}

export const UNIQUE_ITEMS: UniqueItemDef[] = [
  {
    id:'frost_fang', name:'急冻水管', emoji:'🔧', slot:'weapon', ilvl:8, minEnemyIndex:1,
    flavorText:'从废弃冷库拆下的液氮冷却管，缠上布条就是一把致命的冰冻武器。',
    affixes:[{type:'strength',value:8},{type:'dexterity',value:6},{type:'damage_percent',value:15}],
    skills:[{type:"poison",name:"冻伤",chance:4,magnitude:4,description:"每次攻击追加 4 点冷冻伤害"}],
    legendaryPower:'攻击时 15% 概率触发急冻，冻结敌人 1 回合',
  },
  {
    id:'goblin_lucky_ring', name:'幸运瓶盖戒', emoji:'💍', slot:'ring', ilvl:12, minEnemyIndex:2,
    flavorText:'用核子可乐瓶盖打磨成的戒指，据说能带来战前的运气。',
    affixes:[{type:'lucky_hit',value:25},{type:'intelligence',value:30},{type:'dexterity',value:4}],
  },
  {
    id:'skeletal_crown', name:'防化头盔', emoji:'⛑️', slot:'helmet', ilvl:22, minEnemyIndex:3,
    flavorText:'战前军方遗留的防化装备，滤芯虽已过期，但外壳仍坚不可摧。',
    affixes:[{type:'vitality',value:12},{type:'armour',value:15},{type:'life_regen',value:5},{type:'resist_all',value:8}],
    skills:[{type:"thorns",name:"碎片",chance:10,magnitude:10,description:"被击中时反弹 10 点伤害"}],
  },
  {
    id:'phantom_steps', name:'消音战术靴', emoji:'👢', slot:'boots', ilvl:22, minEnemyIndex:3,
    flavorText:'特种部队遗留的消音作战靴，橡胶底垫让你在废墟中悄然穿行。',
    affixes:[{type:'dexterity',value:10},{type:'lucky_hit',value:20},{type:'intelligence',value:15}],
    skills:[{type:"dodge",name:"规避",chance:18,magnitude:18,description:"18% 概率闪避所有伤害"}],
  },
  {
    id:'berserker_gloves', name:'动力拳套', emoji:'🥊', slot:'gloves', ilvl:28, minEnemyIndex:4,
    flavorText:'改装过的液压助力拳套，一拳下去连钢板都能打穿。',
    affixes:[{type:'strength',value:14},{type:'damage_percent',value:20},{type:'crit_damage',value:12},{type:'overpower',value:8}],
    skills:[{type:"berserk",name:"过载",chance:35,magnitude:35,description:"HP < 30% 时攻击力提升 35%"}],
  },
  {
    id:'andariel_visage', name:'辐射面罩', emoji:'⛑️', slot:'helmet', ilvl:35, minEnemyIndex:4,
    flavorText:'从医疗实验室搜刮来的防护面罩，绿色的目镜能过滤辐射尘埃。',
    affixes:[{type:'vitality',value:18},{type:'life_leech',value:8},{type:'crit_damage',value:15},{type:'damage_percent',value:15}],
    skills:[{type:"poison",name:"辐射毒",chance:8,magnitude:8,description:"每次攻击追加 8 点辐射伤害"}],
  },
  {
    id:'tyrant_shield', name:'防暴盾牌', emoji:'🛡️', slot:'offhand', ilvl:35, minEnemyIndex:4,
    flavorText:'警局军械库里的最后一面防暴盾，承受过无数次暴乱冲击。',
    affixes:[{type:'armour',value:30},{type:'resist_all',value:12},{type:'thorns',value:15},{type:'vitality',value:10}],
  },
  {
    id:'shadow_blade', name:'战术匕首', emoji:'🗡️', slot:'weapon', ilvl:38, minEnemyIndex:4,
    flavorText:'特种部队标配的近战武器，涂层吸收光线，在暗处几乎看不见。',
    affixes:[{type:'dexterity',value:16},{type:'crit_damage',value:20},{type:'life_leech',value:10},{type:'attack_speed',value:15}],
    skills:[{type:"doublestrike",name:"连刺",chance:25,magnitude:25,description:"25% 概率每回合攻击两次"}],
    legendaryPower:'攻击时 10% 概率触发快速连击，复制本次全部伤害',
  },
  {
    id:'giant_smash_axe', name:'液压战斧', emoji:'🪓', slot:'weapon', ilvl:42, minEnemyIndex:5,
    flavorText:'改装自工业液压锤，一击足以砸碎混凝土墙。',
    affixes:[{type:'strength',value:22},{type:'overpower',value:20},{type:'damage_percent',value:25}],
    skills:[{type:"berserk",name:"暴怒",chance:30,magnitude:30,description:"HP < 30% 时攻击力提升 30%"}],
  },
  {
    id:'hellhound_boots', name:'机动战靴', emoji:'👢', slot:'boots', ilvl:42, minEnemyIndex:5,
    flavorText:'军用级动力辅助战靴，穿戴者可长时间高速奔袭。',
    affixes:[{type:'dexterity',value:14},{type:'attack_speed',value:20},{type:'life_on_hit',value:12}],
    skills:[{type:"vampiric",name:"追击",chance:15,magnitude:15,description:"击杀时恢复 15 点生命"}],
  },
  {
    id:'vampire_ring', name:'吸血义体', emoji:'💍', slot:'ring', ilvl:45, minEnemyIndex:5,
    flavorText:'黑市医生植入的皮下芯片，能从每次攻击中汲取敌人的生命力。',
    affixes:[{type:'life_leech',value:12},{type:'life_on_hit',value:15},{type:'dexterity',value:8}],
    skills:[{type:"lifesteal",name:"生命吸取",chance:10,magnitude:10,description:"击中时吸取 10% 伤害恢复生命"}],
  },
  {
    id:'giant_chest', name:'重型钢板甲', emoji:'🧥', slot:'chest', ilvl:45, minEnemyIndex:5,
    flavorText:'用废弃车辆钢板焊接而成的重型护甲，虽笨重但能扛住变异熊的一爪。',
    affixes:[{type:'vitality',value:24},{type:'armour',value:35},{type:'resist_all',value:15},{type:'life_regen',value:8}],
  },
  {
    id:'dragon_eye_necklace', name:'探测器挂坠', emoji:'📿', slot:'neck', ilvl:55, minEnemyIndex:6,
    flavorText:'改装自战前辐射探测器的核心芯片，佩戴者能感知附近的有价值物资。',
    affixes:[{type:'lucky_hit',value:40},{type:'intelligence',value:35},{type:'vitality',value:15},{type:'life_on_hit',value:20}],
  },
  {
    id:'dragonblood_plate', name:'动力装甲', emoji:'🧥', slot:'chest', ilvl:55, minEnemyIndex:6,
    flavorText:'T-60 动力装甲的胸甲部件，核能电池驱动，坚如磐石。',
    affixes:[{type:'armour',value:55},{type:'vitality',value:30},{type:'resist_all',value:20},{type:'thorns',value:20}],
    skills:[{type:"thorns",name:"装甲反冲",chance:20,magnitude:20,description:"被击中时反弹 20 点伤害"}],
  },
  {
    id:'dragonblood_legs', name:'动力护腿', emoji:'👖', slot:'legs', ilvl:55, minEnemyIndex:6,
    flavorText:'T-60 动力装甲的护腿部件，液压助力，让穿戴者屹立不倒。',
    affixes:[{type:'armour',value:42},{type:'vitality',value:22},{type:'resist_all',value:15},{type:'life_regen',value:10}],
  },
  {
    id:'touch_of_darkness', name:'黑色行动手套', emoji:'🥊', slot:'gloves', ilvl:58, minEnemyIndex:6,
    flavorText:'特种作战部队的遗产，指尖的碳纤维刀刃能切开一切。',
    affixes:[{type:'strength',value:20},{type:'crit_damage',value:25},{type:'life_leech',value:15},{type:'attack_speed',value:20}],
    skills:[{type:"doublestrike",name:"双连击",chance:30,magnitude:30,description:"30% 概率每回合攻击两次"}],
  },
  {
    id:'flame_tongue_sword', name:'燃烧电锯', emoji:'🔧', slot:'weapon', ilvl:58, minEnemyIndex:6,
    flavorText:'改装过的工业电锯，灌满了从废弃加油站抽出的混合燃料。',
    affixes:[{type:'damage_percent',value:35},{type:'strength',value:24},{type:'crit_damage',value:18},{type:'life_leech',value:10}],
    skills:[{type:"spellblade",name:"燃烧",chance:25,magnitude:25,description:"攻击力额外提升 25%"}],
  },
  {
    id:'hellfire_plate', name:'核能反应甲', emoji:'🧥', slot:'chest', ilvl:65, minEnemyIndex:7,
    flavorText:'用报废反应堆的外壳锻造而成，炽热的辐射让靠近的敌人自焚。',
    affixes:[{type:'armour',value:70},{type:'vitality',value:35},{type:'thorns',value:25},{type:'resist_all',value:25},{type:'life_regen',value:15}],
    skills:[{type:"thorns",name:"辐射灼烧",chance:30,magnitude:30,description:"被击中时反弹 30 点伤害"}],
  },
  {
    id:'inferno_crown', name:'动力头盔', emoji:'⛑️', slot:'helmet', ilvl:65, minEnemyIndex:7,
    flavorText:'完整的 T-60 动力装甲头盔，HUD 显示器仍能正常运作。',
    affixes:[{type:'vitality',value:28},{type:'life_leech',value:18},{type:'lucky_hit',value:30},{type:'life_on_hit',value:25}],
    skills:[{type:"vampiric",name:"战斗亢奋",chance:20,magnitude:20,description:"击杀时恢复 20 点生命"}],
  },
  {
    id:'time_keeper_ring', name:'精确计时器', emoji:'💍', slot:'ring', ilvl:65, minEnemyIndex:7,
    flavorText:'战前军事实验室的精密计时芯片，让你在战斗中快人一步。',
    affixes:[{type:'attack_speed',value:30},{type:'dexterity',value:20},{type:'crit_damage',value:20},{type:'lucky_hit',value:25}],
    skills:[{type:"doublestrike",name:"快速反应",chance:35,magnitude:35,description:"35% 概率每回合攻击两次"}],
  },
  {
    id:'eternity_blade', name:'废土制裁者', emoji:'🔧', slot:'weapon', ilvl:70, minEnemyIndex:7,
    flavorText:'用报废核反应堆的废料锻造的动力锤，一击足以粉碎任何变异生物。',
    affixes:[{type:'strength',value:35},{type:'damage_percent',value:50},{type:'crit_damage',value:25},{type:'overpower',value:20},{type:'life_leech',value:15}],
    skills:[{type:"spellblade",name:"核能驱动",chance:30,magnitude:30,description:"攻击力额外提升 30%"}],
  },
  {
    id:'eternity_shield', name:'反应堆护盾', emoji:'🛡️', slot:'offhand', ilvl:70, minEnemyIndex:7,
    flavorText:'用反应堆控制棒材料铸成的盾牌，辐射本身成为了最强的防护。',
    affixes:[{type:'armour',value:80},{type:'vitality',value:40},{type:'resist_all',value:30},{type:'thorns',value:30},{type:'life_regen',value:20}],
  },
  // ── Dungeon-exclusive unique items ─────────────────────────────────────────
  // Dungeon 1: 腐化矿穴
  {
    id:'d_rotten_core', name:'矿坑护甲', emoji:'🪨', slot:'chest', ilvl:15, minEnemyIndex:99,
    flavorText:'从废弃矿洞中回收的防爆护甲，矿工们在塌方中全靠它活命。',
    affixes:[{type:'armour',value:18},{type:'vitality',value:10},{type:'life_regen',value:4},{type:'resist_all',value:6}],
  },
  {
    id:'d_corrosion_pick', name:'酸蚀镐', emoji:'⛏️', slot:'weapon', ilvl:13, minEnemyIndex:99,
    flavorText:'长期浸泡在化学废料中的矿镐，金属已腐蚀出致命的毒性。',
    affixes:[{type:'strength',value:10},{type:'damage_percent',value:12}],
    skills:[{type:"poison",name:"酸蚀",chance:6,magnitude:6,description:"每次攻击追加 6 点酸性伤害"}],
  },
  // Dungeon 2: 幽影迷宫
  {
    id:'d_specter_cloak', name:'隐身斗篷', emoji:'🌑', slot:'chest', ilvl:25, minEnemyIndex:99,
    flavorText:'军用光学迷彩斗篷的残骸，虽然破损但仍能扭曲光线。',
    affixes:[{type:'armour',value:22},{type:'dexterity',value:14},{type:'life_leech',value:6}],
    skills:[{type:"dodge",name:"迷彩",chance:22,magnitude:22,description:"22% 概率闪避所有伤害"}],
  },
  {
    id:'d_shadow_sigil', name:'战术芯片', emoji:'🔮', slot:'ring', ilvl:23, minEnemyIndex:99,
    flavorText:'嵌入了特种作战算法的微型芯片，显著提升反应速度。',
    affixes:[{type:'lucky_hit',value:30},{type:'dexterity',value:12},{type:'attack_speed',value:12}],
  },
  // Dungeon 3: 裂焰神殿
  {
    id:'d_flame_crown', name:'耐热头盔', emoji:'👑', slot:'helmet', ilvl:40, minEnemyIndex:99,
    flavorText:'消防队遗留的耐高温头盔，能在熔炉般的环境中保护头部。',
    affixes:[{type:'vitality',value:20},{type:'damage_percent',value:22},{type:'crit_damage',value:18}],
    skills:[{type:"poison",name:"高温灼烧",chance:10,magnitude:10,description:"每次攻击追加 10 点灼烧伤害"}],
  },
  {
    id:'d_ember_ring', name:'火种戒指', emoji:'💍', slot:'ring', ilvl:38, minEnemyIndex:99,
    flavorText:'从废弃发电站找到的微型核电池，散发的热量令人热血沸腾。',
    affixes:[{type:'dexterity',value:18},{type:'attack_speed',value:18},{type:'intelligence',value:20}],
    skills:[{type:"spellblade",name:"热能爆发",chance:18,magnitude:18,description:"攻击力额外提升 18%"}],
  },
  // Dungeon 4: 虚空要塞
  {
    id:'d_void_blade', name:'实验性振动刀', emoji:'🗡️', slot:'weapon', ilvl:55, minEnemyIndex:99,
    flavorText:'高频振动分子刃，战前军工科技的最高机密之一。',
    affixes:[{type:'strength',value:28},{type:'damage_percent',value:35},{type:'crit_damage',value:22},{type:'overpower',value:18}],
    skills:[{type:"doublestrike",name:"高频切割",chance:30,magnitude:30,description:"30% 概率每回合攻击两次"}],
  },
  {
    id:'d_nullity_plate', name:'军用复合装甲', emoji:'🛡️', slot:'chest', ilvl:58, minEnemyIndex:99,
    flavorText:'多层复合材料压制的军用级装甲，能抵御多种攻击类型。',
    affixes:[{type:'armour',value:55},{type:'vitality',value:30},{type:'resist_all',value:18},{type:'life_regen',value:12}],
  },
  // Dungeon 5: 龙冢秘境
  {
    id:'d_bone_dragon_shield', name:'反应堆护盾', emoji:'🛡️', slot:'offhand', ilvl:68, minEnemyIndex:99,
    flavorText:'用反应堆控制棒材料铸成的防护盾，每次受击都会反弹辐射能量。',
    affixes:[{type:'armour',value:65},{type:'resist_all',value:22},{type:'thorns',value:25}],
    skills:[{type:"vampiric",name:"能量回收",chance:20,magnitude:20,description:"击杀时恢复 20 点生命"}],
  },
  {
    id:'d_dracolich_mantle', name:'辐射防护服', emoji:'🧥', slot:'chest', ilvl:72, minEnemyIndex:99,
    flavorText:'全套军用级辐射防护装备，能在反应堆核心区域存活数小时。',
    affixes:[{type:'vitality',value:40},{type:'armour',value:50},{type:'life_leech',value:14},{type:'crit_damage',value:20}],
  },
  // Dungeon 6: 混沌熔炉
  {
    id:'d_chaos_edge', name:'避难所科技原型刀', emoji:'⚔️', slot:'weapon', ilvl:85, minEnemyIndex:99,
    flavorText:'使用未知合金锻造的 Vault-Tec 原型武器，切割能力远超现有科技。',
    affixes:[{type:'strength',value:45},{type:'damage_percent',value:55},{type:'crit_damage',value:30},{type:'overpower',value:25},{type:'attack_speed',value:20}],
    skills:[{type:'spellblade',name:'超频',value:35,description:'攻击力额外提升 35%'},{type:'doublestrike',name:'双频切割',value:30,description:'30% 概率每回合攻击两次'}],
  },
  {
    id:'d_primal_forge_armor', name:'原始熔炉甲', emoji:'🔱', slot:'chest', ilvl:88, minEnemyIndex:99,
    flavorText:'混沌熔炉最终产物，集混沌能量与宇宙秩序于一身，堪称神器之首。',
    affixes:[{type:'armour',value:90},{type:'vitality',value:55},{type:'resist_all',value:35},{type:'life_regen',value:25},{type:'life_leech',value:18}],
  },
  // Dungeon 7: 毒液下水道
  {
    id:'d_toxic_plate', name:'毒液护甲', emoji:'🟢', slot:'chest', ilvl:32, minEnemyIndex:99,
    flavorText:'以变异毒液淬炼的护甲，穿戴者在剧毒中如鱼得水。',
    affixes:[{type:'armour',value:25},{type:'resist_all',value:10},{type:'life_regen',value:6}],
    skills:[{type:'poison',name:'毒液反噬',chance:15,magnitude:15,description:'被击中时对敌人造成15点毒伤'}],
  },
  {
    id:'d_poison_dagger', name:'毒液匕首', emoji:'🗡️', slot:'weapon', ilvl:30, minEnemyIndex:99,
    flavorText:'匕首刃上永远滴落着致命的绿色毒液。',
    affixes:[{type:'strength',value:16},{type:'damage_percent',value:20}],
    skills:[{type:'poison',name:'致命毒液',chance:20,magnitude:20,description:'每次攻击追加20点毒伤'}],
  },
  // Dungeon 8: 冰封陵墓
  {
    id:'d_frost_crown', name:'冰霜王冠', emoji:'👑', slot:'helmet', ilvl:58, minEnemyIndex:99,
    flavorText:'戴上此冠，永冻之冰的力量环绕佩戴者。',
    affixes:[{type:'vitality',value:30},{type:'intelligence',value:22},{type:'damage_percent',value:28}],
    skills:[{type:'chain_lightning',name:'冰霜新星',chance:20,magnitude:100,description:'20%概率释放冰霜新星'}],
  },
  {
    id:'d_ice_shard', name:'寒冰碎片', emoji:'❄️', slot:'offhand', ilvl:56, minEnemyIndex:99,
    flavorText:'永冻之冰的核心碎片，触碰即冻结一切。',
    affixes:[{type:'armour',value:35},{type:'resist_all',value:16},{type:'attack_speed',value:15}],
    skills:[{type:'spellblade',name:'冰冻',chance:15,magnitude:15,description:'攻击力额外提升15%'}],
  },
  // Dungeon 9: 淹没古城
  {
    id:'d_abyssal_blade', name:'深渊之刃', emoji:'⚔️', slot:'weapon', ilvl:75, minEnemyIndex:99,
    flavorText:'从深海中打捞出的上古兵器，蕴含着海洋的狂暴之力。',
    affixes:[{type:'strength',value:40},{type:'damage_percent',value:45},{type:'overpower',value:20},{type:'life_leech',value:12}],
    skills:[{type:'doublestrike',name:'波涛双击',chance:28,magnitude:28,description:'28%概率每回合攻击两次'},{type:'vampiric',name:'漩涡',chance:18,magnitude:18,description:'击杀时恢复18点生命'}],
  },
  {
    id:'d_tide_armor', name:'潮汐重甲', emoji:'🌊', slot:'chest', ilvl:78, minEnemyIndex:99,
    flavorText:'深海之底的金属铸造，海水本身成为了穿戴者的盾牌。',
    affixes:[{type:'armour',value:72},{type:'vitality',value:38},{type:'resist_all',value:22},{type:'life_regen',value:18},{type:'life_leech',value:10}],
  },

  // ── Ranged unique weapons ───────────────────────────────────────────────────
  {
    id:'storm_bow', name:'风暴之弓', emoji:'🏹', slot:'weapon', ilvl:10, minEnemyIndex:1,
    flavorText:'弓弦震动之间，雷电之力汇聚于箭尖。',
    affixes:[{type:'dexterity',value:8},{type:'damage_percent',value:12},{type:'crit_damage',value:10}],
    skills:[{type:'chain_lightning',name:'雷箭',chance:15,magnitude:80,description:'15%概率释放闪电链80%伤害'}],
    combatStyle:'ranged',
  },
  {
    id:'eagle_eye_crossbow', name:'鹰眼弩', emoji:'🏹', slot:'weapon', ilvl:18, minEnemyIndex:2,
    flavorText:'精准如鹰，千米之外取敌性命。',
    affixes:[{type:'dexterity',value:14},{type:'crit_damage',value:20},{type:'attack_speed',value:10}],
    skills:[{type:'avalanche',name:'穿甲',chance:12,magnitude:150,description:'暴击时12%概率追加150%伤害'}],
    combatStyle:'ranged',
  },
  {
    id:'shadow_hunter_bow', name:'暗影猎手弓', emoji:'🏹', slot:'weapon', ilvl:30, minEnemyIndex:3,
    flavorText:'隐匿于黑暗之中，猎物无处遁形。',
    affixes:[{type:'dexterity',value:20},{type:'damage_percent',value:25},{type:'life_leech',value:8}],
    skills:[{type:'shadow_clone',name:'暗影射击',chance:10,magnitude:180,description:'10%概率分身造成180%伤害'}],
    combatStyle:'ranged',
  },
  {
    id:'dragon_horn_bow', name:'龙角弓', emoji:'🏹', slot:'weapon', ilvl:45, minEnemyIndex:4,
    flavorText:'以龙角为弓臂，以龙筋为弦，射出的箭矢如龙息般炽烈。',
    affixes:[{type:'dexterity',value:28},{type:'damage_percent',value:35},{type:'crit_damage',value:25},{type:'overpower',value:12}],
    skills:[{type:'meteor',name:'龙息箭',chance:15,magnitude:180,description:'15%概率龙息造成180%伤害'}],
    combatStyle:'ranged',
  },
  {
    id:'void_piercer', name:'虚空穿刺者', emoji:'🏹', slot:'weapon', ilvl:62, minEnemyIndex:5,
    flavorText:'此弓以虚空碎片锻造，射出的箭矢穿过维度，无可阻拦。',
    affixes:[{type:'dexterity',value:36},{type:'damage_percent',value:45},{type:'crit_damage',value:35},{type:'overpower',value:15}],
    skills:[{type:'execute',name:'虚空裁决',chance:18,magnitude:1,description:'18%概率处决HP<20%敌人'}],
    combatStyle:'ranged',
  },

  // ── Magic unique weapons ────────────────────────────────────────────────────
  {
    id:'flameheart_staff', name:'炎心法杖', emoji:'🪄', slot:'weapon', ilvl:10, minEnemyIndex:1,
    flavorText:'杖身内封印着一颗不灭的火焰之心。',
    affixes:[{type:'intelligence',value:9},{type:'damage_percent',value:15}],
    skills:[{type:'meteor',name:'火焰陨石',chance:12,magnitude:160,description:'12%概率陨石造成160%伤害'}],
    combatStyle:'magic',
  },
  {
    id:'frost_weaver', name:'冰霜编织者', emoji:'🪄', slot:'weapon', ilvl:20, minEnemyIndex:2,
    flavorText:'寒冰之气从杖尖蔓延，凝结为不可穿透的冰墙。',
    affixes:[{type:'intelligence',value:16},{type:'resist_all',value:8},{type:'armour',value:5}],
    skills:[{type:'frost_nova',name:'霜冻新星',chance:18,magnitude:1,description:'18%概率冻结敌人1回合'}],
    combatStyle:'magic',
  },
  {
    id:'soul_reaper_staff', name:'夺魂法杖', emoji:'🪄', slot:'weapon', ilvl:32, minEnemyIndex:3,
    flavorText:'收割敌人的灵魂，化为自身的力量。',
    affixes:[{type:'intelligence',value:24},{type:'life_leech',value:12},{type:'damage_percent',value:20}],
    skills:[{type:'blood_sacrifice',name:'灵魂献祭',chance:100,magnitude:10,description:'消耗10%HP换取等量额外伤害'}],
    combatStyle:'magic',
  },
  {
    id:'arcane_infinity', name:'无尽秘法杖', emoji:'🪄', slot:'weapon', ilvl:48, minEnemyIndex:4,
    flavorText:'秘法能量在杖芯内无限循环，永不枯竭。',
    affixes:[{type:'intelligence',value:32},{type:'damage_percent',value:35},{type:'attack_speed',value:15},{type:'crit_damage',value:20}],
    skills:[{type:'arcane_barrage',name:'奥术风暴',chance:12,magnitude:3,description:'12%概率追加3次攻击'}],
    combatStyle:'magic',
  },
  {
    id:'cosmic_catalyst', name:'宇宙催化器', emoji:'🪄', slot:'weapon', ilvl:65, minEnemyIndex:5,
    flavorText:'宇宙诞生之初的原初能量汇聚于此，持杖者即是造物主。',
    affixes:[{type:'intelligence',value:45},{type:'damage_percent',value:50},{type:'crit_damage',value:30},{type:'resist_all',value:20},{type:'life_regen',value:10}],
    skills:[{type:'chain_lightning',name:'宇宙闪电',chance:20,magnitude:150,description:'20%概率闪电链造成150%伤害'},{type:'divine_shield',name:'原初护盾',chance:10,magnitude:1,description:'10%概率获得免伤护盾'}],
    combatStyle:'magic',
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
  combatStyle?: CombatStyle;
  baseId?: string;
  baseType?: string;
  uniqueId?: string;
  setId?: string;
  flavorText?: string;
  maxSockets: number;
  socketedGems: string[];
  skills: ItemSkill[];
  legendaryPower?: string;
  // ── Sub-stat enhancement ──
  subStats?: SubStat[];
  enhanceLevel?: number;
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
  combatStyle?: CombatStyle;
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
  oak_bow:           { id: 'oak_bow',           name: '橡木弓',   emoji: '🏹', slot: 'weapon',  attackBonus: 7,  defenceBonus: 0,  ilvl: 5,  combatStyle: 'ranged'  },
  yew_bow:           { id: 'yew_bow',           name: '紫杉弓',   emoji: '🏹', slot: 'weapon',  attackBonus: 15, defenceBonus: 0,  ilvl: 12, combatStyle: 'ranged'  },
  maple_bow:         { id: 'maple_bow',         name: '枫木弓',   emoji: '🏹', slot: 'weapon',  attackBonus: 24, defenceBonus: 0,  ilvl: 20, combatStyle: 'ranged'  },
  mithril_bow:       { id: 'mithril_bow',       name: '秘银弓',   emoji: '🏹', slot: 'weapon',  attackBonus: 38, defenceBonus: 0,  ilvl: 32, combatStyle: 'ranged'  },
  adamant_bow:       { id: 'adamant_bow',       name: '精金弓',   emoji: '🏹', slot: 'weapon',  attackBonus: 56, defenceBonus: 0,  ilvl: 45, combatStyle: 'ranged'  },
  rune_bow_forged:   { id: 'rune_bow_forged',   name: '符文战弓', emoji: '🏹', slot: 'weapon',  attackBonus: 78, defenceBonus: 0,  ilvl: 60, combatStyle: 'ranged'  },
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
  // Obsidian (bar_3)
  obsidian_sword:    { id: 'obsidian_sword',    name: '黑曜石剑', emoji: '⚔️', slot: 'weapon',  attackBonus: 22, defenceBonus: 0,  ilvl: 25 },
  obsidian_shield:   { id: 'obsidian_shield',   name: '黑曜石盾', emoji: '🛡️', slot: 'offhand', attackBonus: 0,  defenceBonus: 35, ilvl: 25 },
  obsidian_helmet:   { id: 'obsidian_helmet',   name: '黑曜石头盔',emoji: '⛑️', slot: 'helmet',  attackBonus: 0,  defenceBonus: 25, ilvl: 25 },
  obsidian_body:     { id: 'obsidian_body',     name: '黑曜石胸甲',emoji: '🧥', slot: 'chest',   attackBonus: 0,  defenceBonus: 55, ilvl: 30 },
  obsidian_legs:     { id: 'obsidian_legs',     name: '黑曜石腿甲',emoji: '👖', slot: 'legs',    attackBonus: 0,  defenceBonus: 35, ilvl: 28 },
  obsidian_gauntlets:{ id: 'obsidian_gauntlets',name: '黑曜石护手',emoji: '🥊', slot: 'gloves',  attackBonus: 12, defenceBonus: 12, ilvl: 25 },
  obsidian_boots:    { id: 'obsidian_boots',    name: '黑曜石靴', emoji: '👢', slot: 'boots',   attackBonus: 0,  defenceBonus: 22, ilvl: 25 },
  // Dragon (bar_7)
  dragon_sword:      { id: 'dragon_sword',      name: '龙鳞剑',   emoji: '⚔️', slot: 'weapon',  attackBonus: 38, defenceBonus: 0,  ilvl: 45 },
  dragon_shield:     { id: 'dragon_shield',     name: '龙鳞盾',   emoji: '🛡️', slot: 'offhand', attackBonus: 0,  defenceBonus: 65, ilvl: 45 },
  dragon_helmet:     { id: 'dragon_helmet',     name: '龙鳞头盔', emoji: '⛑️', slot: 'helmet',  attackBonus: 0,  defenceBonus: 45, ilvl: 45 },
  dragon_body:       { id: 'dragon_body',       name: '龙鳞战甲', emoji: '🧥', slot: 'chest',   attackBonus: 0,  defenceBonus: 95, ilvl: 48 },
  dragon_legs:       { id: 'dragon_legs',       name: '龙鳞腿甲', emoji: '👖', slot: 'legs',    attackBonus: 0,  defenceBonus: 60, ilvl: 46 },
  dragon_gauntlets:  { id: 'dragon_gauntlets',  name: '龙鳞护手', emoji: '🥊', slot: 'gloves',  attackBonus: 18, defenceBonus: 18, ilvl: 45 },
  dragon_boots:      { id: 'dragon_boots',      name: '龙鳞战靴', emoji: '👢', slot: 'boots',   attackBonus: 0,  defenceBonus: 38, ilvl: 45 },
  // Eternal (bar_8)
  eternal_sword:     { id: 'eternal_sword',     name: '永恒之刃', emoji: '⚔️', slot: 'weapon',  attackBonus: 52, defenceBonus: 0,  ilvl: 58 },
  eternal_shield:    { id: 'eternal_shield',    name: '永恒之盾', emoji: '🛡️', slot: 'offhand', attackBonus: 0,  defenceBonus: 90, ilvl: 58 },
  eternal_helmet:    { id: 'eternal_helmet',    name: '永恒战盔', emoji: '⛑️', slot: 'helmet',  attackBonus: 0,  defenceBonus: 62, ilvl: 58 },
  eternal_body:      { id: 'eternal_body',      name: '永恒战甲', emoji: '🧥', slot: 'chest',   attackBonus: 0,  defenceBonus: 130,ilvl: 60 },
  eternal_legs:      { id: 'eternal_legs',      name: '永恒腿甲', emoji: '👖', slot: 'legs',    attackBonus: 0,  defenceBonus: 82, ilvl: 58 },
  // Divine (bar_9)
  divine_sword:      { id: 'divine_sword',      name: '神造之剑', emoji: '⚔️', slot: 'weapon',  attackBonus: 70, defenceBonus: 0,  ilvl: 80 },
  divine_shield:     { id: 'divine_shield',     name: '神造之盾', emoji: '🛡️', slot: 'offhand', attackBonus: 0,  defenceBonus: 125,ilvl: 80 },
  divine_helmet:     { id: 'divine_helmet',     name: '神造战盔', emoji: '⛑️', slot: 'helmet',  attackBonus: 0,  defenceBonus: 85, ilvl: 80 },
  divine_body:       { id: 'divine_body',       name: '神造战甲', emoji: '🧥', slot: 'chest',   attackBonus: 0,  defenceBonus: 180,ilvl: 85 },
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
    source: 'smithed', baseId: itemId, combatStyle: (def as any).combatStyle,
    maxSockets: rollSockets('uncommon'), socketedGems: [], skills: [],
  };
}

// ─── Leather equipment items — 完整 10 级套装 ────────────────────────────────
export const LEATHER_ITEMS: Record<string, SmithedItemDef> = {
  // ── hide_0: 辐射鼠皮 ──
  rat_helm:   { id:'rat_helm',   name:'辐射鼠皮帽', emoji:'🎩', slot:'helmet', attackBonus:0, defenceBonus:3,  ilvl:3  },
  rat_vest:   { id:'rat_vest',   name:'辐射鼠皮衣', emoji:'🧥', slot:'chest',  attackBonus:0, defenceBonus:6,  ilvl:3  },
  rat_pants:  { id:'rat_pants',  name:'辐射鼠皮裤', emoji:'👖', slot:'legs',   attackBonus:0, defenceBonus:4,  ilvl:3  },
  rat_gloves: { id:'rat_gloves', name:'辐射鼠皮手套',emoji:'🥊',slot:'gloves', attackBonus:2, defenceBonus:2,  ilvl:3  },
  rat_boots:  { id:'rat_boots',  name:'辐射鼠皮靴', emoji:'👢', slot:'boots',  attackBonus:0, defenceBonus:2,  ilvl:3  },
  // ── hide_1: 变异兔皮 ──
  rabbit_helm:   { id:'rabbit_helm',   name:'变异兔皮帽', emoji:'⛑️', slot:'helmet', attackBonus:0, defenceBonus:8,  ilvl:8  },
  rabbit_vest:   { id:'rabbit_vest',   name:'变异兔皮衣', emoji:'🧥', slot:'chest',  attackBonus:0, defenceBonus:14, ilvl:8  },
  rabbit_pants:  { id:'rabbit_pants',  name:'变异兔皮裤', emoji:'👖', slot:'legs',   attackBonus:0, defenceBonus:10, ilvl:8  },
  rabbit_gloves: { id:'rabbit_gloves', name:'变异兔皮手套',emoji:'🥊',slot:'gloves',attackBonus:5, defenceBonus:3,  ilvl:8  },
  rabbit_boots:  { id:'rabbit_boots',  name:'变异兔皮靴', emoji:'👢', slot:'boots',  attackBonus:0, defenceBonus:5,  ilvl:8  },
  // ── hide_2: 铁鳞蜥皮 ──
  scale_helm:   { id:'scale_helm',   name:'铁鳞蜥皮盔',   emoji:'🪖', slot:'helmet', attackBonus:0, defenceBonus:14, ilvl:14 },
  scale_vest:   { id:'scale_vest',   name:'铁鳞蜥皮甲',   emoji:'🧥', slot:'chest',  attackBonus:0, defenceBonus:24, ilvl:14 },
  scale_pants:  { id:'scale_pants',  name:'铁鳞蜥皮裤',   emoji:'👖', slot:'legs',   attackBonus:0, defenceBonus:18, ilvl:14 },
  scale_gloves: { id:'scale_gloves', name:'铁鳞蜥皮手套', emoji:'🥊', slot:'gloves', attackBonus:9, defenceBonus:6,  ilvl:14 },
  scale_boots:  { id:'scale_boots',  name:'铁鳞蜥皮靴',   emoji:'👢', slot:'boots',  attackBonus:0, defenceBonus:10, ilvl:14 },
  // ── hide_3: 疯犬皮 ──
  dog_helm:   { id:'dog_helm',   name:'疯犬皮帽',   emoji:'⛑️', slot:'helmet', attackBonus:0, defenceBonus:20, ilvl:20 },
  dog_vest:   { id:'dog_vest',   name:'疯犬皮甲',   emoji:'🧥', slot:'chest',  attackBonus:0, defenceBonus:34, ilvl:20 },
  dog_pants:  { id:'dog_pants',  name:'疯犬皮裤',   emoji:'👖', slot:'legs',   attackBonus:0, defenceBonus:26, ilvl:20 },
  dog_gloves: { id:'dog_gloves', name:'疯犬皮手套', emoji:'🥊', slot:'gloves', attackBonus:13,defenceBonus:9,  ilvl:20 },
  dog_boots:  { id:'dog_boots',  name:'疯犬皮靴',   emoji:'👢', slot:'boots',  attackBonus:0, defenceBonus:14, ilvl:20 },
  // ── hide_4: 钢鬃猪皮 ──
  boar_helm:   { id:'boar_helm',   name:'钢鬃猪皮盔', emoji:'⛑️', slot:'helmet', attackBonus:0, defenceBonus:28, ilvl:28 },
  boar_vest:   { id:'boar_vest',   name:'钢鬃猪皮甲', emoji:'🧥', slot:'chest',  attackBonus:0, defenceBonus:46, ilvl:28 },
  boar_pants:  { id:'boar_pants',  name:'钢鬃猪皮裤', emoji:'👖', slot:'legs',   attackBonus:0, defenceBonus:34, ilvl:28 },
  boar_gloves: { id:'boar_gloves', name:'钢鬃猪皮手套',emoji:'🥊',slot:'gloves',attackBonus:18,defenceBonus:12, ilvl:28 },
  boar_boots:  { id:'boar_boots',  name:'钢鬃猪皮靴', emoji:'👢', slot:'boots',  attackBonus:0, defenceBonus:20, ilvl:28 },
  // ── hide_5: 双头鹿皮 ──
  deer_helm:   { id:'deer_helm',   name:'双头鹿皮帽', emoji:'⛑️', slot:'helmet', attackBonus:0, defenceBonus:36, ilvl:36 },
  deer_vest:   { id:'deer_vest',   name:'双头鹿皮衣', emoji:'🧥', slot:'chest',  attackBonus:0, defenceBonus:58, ilvl:36 },
  deer_pants:  { id:'deer_pants',  name:'双头鹿皮裤', emoji:'👖', slot:'legs',   attackBonus:0, defenceBonus:44, ilvl:36 },
  deer_gloves: { id:'deer_gloves', name:'双头鹿皮手套',emoji:'🥊',slot:'gloves',attackBonus:22,defenceBonus:15, ilvl:36 },
  deer_boots:  { id:'deer_boots',  name:'双头鹿皮靴', emoji:'👢', slot:'boots',  attackBonus:0, defenceBonus:26, ilvl:36 },
  // ── hide_6: 灰熊厚皮 ──
  bear_helm:   { id:'bear_helm',   name:'灰熊厚皮盔', emoji:'⛑️', slot:'helmet', attackBonus:0, defenceBonus:44, ilvl:45 },
  bear_vest:   { id:'bear_vest',   name:'灰熊厚皮衣', emoji:'🧥', slot:'chest',  attackBonus:0, defenceBonus:70, ilvl:45 },
  bear_pants:  { id:'bear_pants',  name:'灰熊厚皮裤', emoji:'👖', slot:'legs',   attackBonus:0, defenceBonus:52, ilvl:45 },
  bear_gloves: { id:'bear_gloves', name:'灰熊厚皮手套',emoji:'🥊',slot:'gloves',attackBonus:28,defenceBonus:19, ilvl:45 },
  bear_boots:  { id:'bear_boots',  name:'灰熊厚皮靴', emoji:'👢', slot:'boots',  attackBonus:0, defenceBonus:34, ilvl:45 },
  // ── hide_7: 辐射蝎壳 ──
  chitin_helm:   { id:'chitin_helm',   name:'辐射蝎壳盔', emoji:'🦂', slot:'helmet', attackBonus:4, defenceBonus:54, ilvl:55 },
  chitin_vest:   { id:'chitin_vest',   name:'辐射蝎壳铠', emoji:'🧥', slot:'chest',  attackBonus:6, defenceBonus:84, ilvl:55 },
  chitin_pants:  { id:'chitin_pants',  name:'辐射蝎壳裤', emoji:'👖', slot:'legs',   attackBonus:3, defenceBonus:62, ilvl:55 },
  chitin_gloves: { id:'chitin_gloves', name:'辐射蝎壳手', emoji:'🥊', slot:'gloves', attackBonus:34,defenceBonus:23, ilvl:55 },
  chitin_boots:  { id:'chitin_boots',  name:'辐射蝎壳靴', emoji:'👢', slot:'boots',  attackBonus:4, defenceBonus:42, ilvl:55 },
  // ── hide_8: 死亡爪皮 ──
  claw_helm:   { id:'claw_helm',   name:'死亡爪皮盔', emoji:'💀', slot:'helmet', attackBonus:8, defenceBonus:64, ilvl:66 },
  claw_vest:   { id:'claw_vest',   name:'死亡爪皮甲', emoji:'🧥', slot:'chest',  attackBonus:12,defenceBonus:96, ilvl:66 },
  claw_pants:  { id:'claw_pants',  name:'死亡爪皮裤', emoji:'👖', slot:'legs',   attackBonus:5, defenceBonus:72, ilvl:66 },
  claw_gloves: { id:'claw_gloves', name:'死亡爪皮手套',emoji:'🥊',slot:'gloves',attackBonus:40,defenceBonus:28, ilvl:66 },
  claw_boots:  { id:'claw_boots',  name:'死亡爪皮靴', emoji:'👢', slot:'boots',  attackBonus:8, defenceBonus:50, ilvl:66 },
  // ── hide_9: 巨兽硬皮 ──
  behemoth_helm:   { id:'behemoth_helm',   name:'巨兽硬皮盔',   emoji:'👑', slot:'helmet', attackBonus:12,defenceBonus:78, ilvl:80 },
  behemoth_vest:   { id:'behemoth_vest',   name:'巨兽硬皮战甲', emoji:'🧥', slot:'chest',  attackBonus:18,defenceBonus:110,ilvl:80 },
  behemoth_pants:  { id:'behemoth_pants',  name:'巨兽硬皮护腿', emoji:'👖', slot:'legs',   attackBonus:8, defenceBonus:86, ilvl:80 },
  behemoth_gloves: { id:'behemoth_gloves', name:'巨兽硬皮护手', emoji:'🥊', slot:'gloves', attackBonus:48,defenceBonus:34, ilvl:80 },
  behemoth_boots:  { id:'behemoth_boots',  name:'巨兽硬皮战靴', emoji:'👢', slot:'boots',  attackBonus:12,defenceBonus:62, ilvl:80 },
  // ── 法杖 ──
  scrap_staff:    { id:'scrap_staff',    name:'废料法杖', emoji:'🪄', slot:'weapon', attackBonus:4, defenceBonus:0, ilvl:3,  combatStyle:'magic' },
  bone_staff:     { id:'bone_staff',     name:'骨制法杖', emoji:'🪄', slot:'weapon', attackBonus:12,defenceBonus:0, ilvl:12, combatStyle:'magic' },
  ironbark_staff: { id:'ironbark_staff', name:'铁线木杖', emoji:'🪄', slot:'weapon', attackBonus:24,defenceBonus:0, ilvl:22, combatStyle:'magic' },
  crystal_staff:  { id:'crystal_staff',  name:'水晶法杖', emoji:'🪄', slot:'weapon', attackBonus:38,defenceBonus:0, ilvl:34, combatStyle:'magic' },
  uranium_staff:  { id:'uranium_staff',  name:'辐射法杖', emoji:'🪄', slot:'weapon', attackBonus:54,defenceBonus:0, ilvl:46, combatStyle:'magic' },
  plasma_staff:   { id:'plasma_staff',   name:'等离子杖', emoji:'🪄', slot:'weapon', attackBonus:72,defenceBonus:0, ilvl:58, combatStyle:'magic' },
  gauss_staff:    { id:'gauss_staff',    name:'高斯法杖', emoji:'🪄', slot:'weapon', attackBonus:88,defenceBonus:0, ilvl:72, combatStyle:'magic' },
};

// ─── Jewelry items — 金属锭 + 战斗材料 ──────────────────────────────────────
export const JEWELRY_ITEMS: Record<string, SmithedItemDef> = {
  // bar_0: 废铁锭 + bones
  scrap_ring:   { id:'scrap_ring',   name:'废铁戒指', emoji:'💍', slot:'ring', attackBonus:0, defenceBonus:0, critRating:1.0, ilvl:2  },
  scrap_neck:   { id:'scrap_neck',   name:'废铁吊坠', emoji:'📿', slot:'neck', attackBonus:0, defenceBonus:0, hpBonus:8,      ilvl:2  },
  // bar_1: 铜锭 + bones
  copper_ring:  { id:'copper_ring',  name:'铜戒指',   emoji:'💍', slot:'ring', attackBonus:2, defenceBonus:0, critRating:2.0, ilvl:6  },
  copper_neck:  { id:'copper_neck',  name:'铜吊坠',   emoji:'📿', slot:'neck', attackBonus:0, defenceBonus:0, hpBonus:18,     ilvl:6  },
  // bar_2: 铝锭 + bones
  alum_ring:    { id:'alum_ring',    name:'铝戒指',   emoji:'💍', slot:'ring', attackBonus:3, defenceBonus:0, critRating:3.5, ilvl:12 },
  alum_neck:    { id:'alum_neck',    name:'铝吊坠',   emoji:'📿', slot:'neck', attackBonus:2, defenceBonus:0, hpBonus:28,     ilvl:12 },
  // bar_3: 铅锭 + bones
  lead_ring:    { id:'lead_ring',    name:'铅戒指',   emoji:'💍', slot:'ring', attackBonus:5, defenceBonus:0, critRating:5.0, ilvl:20 },
  lead_neck:    { id:'lead_neck',    name:'铅吊坠',   emoji:'📿', slot:'neck', attackBonus:3, defenceBonus:3, hpBonus:40,     ilvl:20 },
  // bar_4: 硫磺锭 (special, no bones)
  sulfur_ring:  { id:'sulfur_ring',  name:'硫磺指环', emoji:'💍', slot:'ring', attackBonus:0, defenceBonus:3, critRating:7.0, ilvl:28 },
  sulfur_neck:  { id:'sulfur_neck',  name:'硫磺护符', emoji:'📿', slot:'neck', attackBonus:5, defenceBonus:0, hpBonus:55,     ilvl:28 },
  // bar_5: 硝酸盐锭 + dragonBones
  nitrate_ring: { id:'nitrate_ring', name:'硝酸盐戒', emoji:'💍', slot:'ring', attackBonus:8, defenceBonus:0, critRating:9.0, ilvl:36 },
  nitrate_neck: { id:'nitrate_neck', name:'硝酸盐坠', emoji:'📿', slot:'neck', attackBonus:5, defenceBonus:5, hpBonus:70,     ilvl:36 },
  // bar_6: 铀锭 + dragonBones
  uranium_ring: { id:'uranium_ring', name:'铀能戒指', emoji:'💍', slot:'ring', attackBonus:10,defenceBonus:0, critRating:12.0,ilvl:46 },
  uranium_neck: { id:'uranium_neck', name:'铀能吊坠', emoji:'📿', slot:'neck', attackBonus:8, defenceBonus:8, hpBonus:90,     ilvl:46 },
  // bar_7: 钛金锭 + dragonBones
  titanium_ring:{ id:'titanium_ring',name:'钛金戒指', emoji:'💍', slot:'ring', attackBonus:14,defenceBonus:0, critRating:15.0,ilvl:56 },
  titanium_neck:{ id:'titanium_neck',name:'钛金吊坠', emoji:'📿', slot:'neck', attackBonus:10,defenceBonus:10,hpBonus:110,    ilvl:56 },
  // bar_8: 钨钢锭 + dragonBones
  tungsten_ring:{ id:'tungsten_ring',name:'钨钢戒指', emoji:'💍', slot:'ring', attackBonus:18,defenceBonus:3, critRating:18.0,ilvl:68 },
  tungsten_neck:{ id:'tungsten_neck',name:'钨钢吊坠', emoji:'📿', slot:'neck', attackBonus:14,defenceBonus:14,hpBonus:140,    ilvl:68 },
  // bar_9: 铱金锭 + dragonBones
  iridium_ring: { id:'iridium_ring', name:'铱金戒指', emoji:'💍', slot:'ring', attackBonus:24,defenceBonus:5, critRating:22.0,ilvl:80 },
  iridium_neck: { id:'iridium_neck', name:'铱金吊坠', emoji:'📿', slot:'neck', attackBonus:18,defenceBonus:18,hpBonus:180,    ilvl:80 },
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
  // hide_0: 鼠皮
  { id:'lw_rat_helm',   output:'rat_helm',   inputs:[{resource:'hide_0',qty:2}],reqLevel:1, xp:15,time:5},
  { id:'lw_rat_vest',   output:'rat_vest',   inputs:[{resource:'hide_0',qty:4}],reqLevel:1, xp:30,time:10},
  { id:'lw_rat_pants',  output:'rat_pants',  inputs:[{resource:'hide_0',qty:3}],reqLevel:1, xp:22,time:7},
  { id:'lw_rat_gloves', output:'rat_gloves', inputs:[{resource:'hide_0',qty:2}],reqLevel:1, xp:15,time:5},
  { id:'lw_rat_boots',  output:'rat_boots',  inputs:[{resource:'hide_0',qty:2}],reqLevel:1, xp:15,time:5},
  // hide_1: 兔皮
  { id:'lw_rabbit_helm',   output:'rabbit_helm',   inputs:[{resource:'hide_1',qty:2}],reqLevel:8, xp:35,time:7},
  { id:'lw_rabbit_vest',   output:'rabbit_vest',   inputs:[{resource:'hide_1',qty:4}],reqLevel:8, xp:70,time:14},
  { id:'lw_rabbit_pants',  output:'rabbit_pants',  inputs:[{resource:'hide_1',qty:3}],reqLevel:8, xp:52,time:10},
  { id:'lw_rabbit_gloves', output:'rabbit_gloves', inputs:[{resource:'hide_1',qty:2}],reqLevel:8, xp:35,time:7},
  { id:'lw_rabbit_boots',  output:'rabbit_boots',  inputs:[{resource:'hide_1',qty:2}],reqLevel:8, xp:35,time:7},
  // hide_2: 蜥蜴鳞皮
  { id:'lw_scale_helm',   output:'scale_helm',   inputs:[{resource:'hide_2',qty:3}],reqLevel:16,xp:60,time:9},
  { id:'lw_scale_vest',   output:'scale_vest',   inputs:[{resource:'hide_2',qty:5}],reqLevel:16,xp:120,time:16},
  { id:'lw_scale_pants',  output:'scale_pants',  inputs:[{resource:'hide_2',qty:4}],reqLevel:16,xp:90,time:13},
  { id:'lw_scale_gloves', output:'scale_gloves', inputs:[{resource:'hide_2',qty:3}],reqLevel:16,xp:60,time:9},
  { id:'lw_scale_boots',  output:'scale_boots',  inputs:[{resource:'hide_2',qty:3}],reqLevel:16,xp:60,time:9},
  // hide_3: 犬皮
  { id:'lw_dog_helm',   output:'dog_helm',   inputs:[{resource:'hide_3',qty:3}],reqLevel:24,xp:90,time:10},
  { id:'lw_dog_vest',   output:'dog_vest',   inputs:[{resource:'hide_3',qty:5}],reqLevel:24,xp:180,time:18},
  { id:'lw_dog_pants',  output:'dog_pants',  inputs:[{resource:'hide_3',qty:4}],reqLevel:24,xp:135,time:14},
  { id:'lw_dog_gloves', output:'dog_gloves', inputs:[{resource:'hide_3',qty:3}],reqLevel:24,xp:90,time:10},
  { id:'lw_dog_boots',  output:'dog_boots',  inputs:[{resource:'hide_3',qty:3}],reqLevel:24,xp:90,time:10},
  // hide_4: 野猪硬皮
  { id:'lw_boar_helm',   output:'boar_helm',   inputs:[{resource:'hide_4',qty:4}],reqLevel:34,xp:140,time:12},
  { id:'lw_boar_vest',   output:'boar_vest',   inputs:[{resource:'hide_4',qty:6}],reqLevel:34,xp:260,time:22},
  { id:'lw_boar_pants',  output:'boar_pants',  inputs:[{resource:'hide_4',qty:5}],reqLevel:34,xp:200,time:18},
  { id:'lw_boar_gloves', output:'boar_gloves', inputs:[{resource:'hide_4',qty:4}],reqLevel:34,xp:140,time:12},
  { id:'lw_boar_boots',  output:'boar_boots',  inputs:[{resource:'hide_4',qty:4}],reqLevel:34,xp:140,time:12},
  // hide_5: 变异鹿皮
  { id:'lw_deer_helm',   output:'deer_helm',   inputs:[{resource:'hide_5',qty:4}],reqLevel:42,xp:200,time:14},
  { id:'lw_deer_vest',   output:'deer_vest',   inputs:[{resource:'hide_5',qty:6}],reqLevel:42,xp:350,time:24},
  { id:'lw_deer_pants',  output:'deer_pants',  inputs:[{resource:'hide_5',qty:5}],reqLevel:42,xp:270,time:20},
  { id:'lw_deer_gloves', output:'deer_gloves', inputs:[{resource:'hide_5',qty:4}],reqLevel:42,xp:200,time:14},
  { id:'lw_deer_boots',  output:'deer_boots',  inputs:[{resource:'hide_5',qty:4}],reqLevel:42,xp:200,time:14},
  // hide_6: 熊皮
  { id:'lw_bear_helm',   output:'bear_helm',   inputs:[{resource:'hide_6',qty:5}],reqLevel:52,xp:280,time:16},
  { id:'lw_bear_vest',   output:'bear_vest',   inputs:[{resource:'hide_6',qty:8}],reqLevel:52,xp:480,time:26},
  { id:'lw_bear_pants',  output:'bear_pants',  inputs:[{resource:'hide_6',qty:6}],reqLevel:52,xp:370,time:22},
  { id:'lw_bear_gloves', output:'bear_gloves', inputs:[{resource:'hide_6',qty:5}],reqLevel:52,xp:280,time:16},
  { id:'lw_bear_boots',  output:'bear_boots',  inputs:[{resource:'hide_6',qty:5}],reqLevel:52,xp:280,time:16},
  // hide_7: 巨蝎甲壳
  { id:'lw_chitin_helm',   output:'chitin_helm',   inputs:[{resource:'hide_7',qty:5}],reqLevel:64,xp:380,time:18},
  { id:'lw_chitin_vest',   output:'chitin_vest',   inputs:[{resource:'hide_7',qty:8}],reqLevel:64,xp:620,time:28},
  { id:'lw_chitin_pants',  output:'chitin_pants',  inputs:[{resource:'hide_7',qty:6}],reqLevel:64,xp:480,time:24},
  { id:'lw_chitin_gloves', output:'chitin_gloves', inputs:[{resource:'hide_7',qty:5}],reqLevel:64,xp:380,time:18},
  { id:'lw_chitin_boots',  output:'chitin_boots',  inputs:[{resource:'hide_7',qty:5}],reqLevel:64,xp:380,time:18},
  // hide_8: 死亡爪皮
  { id:'lw_claw_helm',   output:'claw_helm',   inputs:[{resource:'hide_8',qty:6}],reqLevel:76,xp:520,time:22},
  { id:'lw_claw_vest',   output:'claw_vest',   inputs:[{resource:'hide_8',qty:9}],reqLevel:76,xp:800,time:30},
  { id:'lw_claw_pants',  output:'claw_pants',  inputs:[{resource:'hide_8',qty:7}],reqLevel:76,xp:640,time:26},
  { id:'lw_claw_gloves', output:'claw_gloves', inputs:[{resource:'hide_8',qty:6}],reqLevel:76,xp:520,time:22},
  { id:'lw_claw_boots',  output:'claw_boots',  inputs:[{resource:'hide_8',qty:6}],reqLevel:76,xp:520,time:22},
  // hide_9: 巨兽厚皮
  { id:'lw_behemoth_helm',   output:'behemoth_helm',   inputs:[{resource:'hide_9',qty:7}],reqLevel:88,xp:700,time:26},
  { id:'lw_behemoth_vest',   output:'behemoth_vest',   inputs:[{resource:'hide_9',qty:10}],reqLevel:88,xp:1050,time:34},
  { id:'lw_behemoth_pants',  output:'behemoth_pants',  inputs:[{resource:'hide_9',qty:8}],reqLevel:88,xp:850,time:30},
  { id:'lw_behemoth_gloves', output:'behemoth_gloves', inputs:[{resource:'hide_9',qty:7}],reqLevel:88,xp:700,time:26},
  { id:'lw_behemoth_boots',  output:'behemoth_boots',  inputs:[{resource:'hide_9',qty:7}],reqLevel:88,xp:700,time:26},
  // ── 法杖 ──
  { id:'lw_scrap_staff',    output:'scrap_staff',    inputs:[{resource:'hide_0',qty:2}],reqLevel:1, xp:18,time:5},
  { id:'lw_bone_staff',     output:'bone_staff',     inputs:[{resource:'hide_2',qty:3}],reqLevel:12,xp:50,time:8},
  { id:'lw_ironbark_staff', output:'ironbark_staff', inputs:[{resource:'hide_4',qty:4}],reqLevel:26,xp:100,time:12},
  { id:'lw_crystal_staff',  output:'crystal_staff',  inputs:[{resource:'hide_5',qty:4}],reqLevel:38,xp:160,time:16},
  { id:'lw_uranium_staff',  output:'uranium_staff',  inputs:[{resource:'hide_6',qty:4}],reqLevel:50,xp:240,time:20},
  { id:'lw_plasma_staff',   output:'plasma_staff',   inputs:[{resource:'hide_7',qty:5}],reqLevel:62,xp:340,time:24},
  { id:'lw_gauss_staff',    output:'gauss_staff',    inputs:[{resource:'hide_8',qty:5}],reqLevel:74,xp:460,time:28},
];

// ─── Jewelcrafting recipes ──────────────────────────────────────────────────────
export const JEWELCRAFTING_RECIPES: CraftingRecipe[] = [
  // bar_0: 废铁锭 + bones
  { id:'jc_scrap_ring',  output:'scrap_ring',  inputs:[{resource:'bar_0',qty:2},{resource:'bones',qty:2}],  reqLevel:1,  xp:20,time:8},
  { id:'jc_scrap_neck',  output:'scrap_neck',  inputs:[{resource:'bar_0',qty:3},{resource:'bones',qty:3}],  reqLevel:1,  xp:28,time:10},
  // bar_1: 铜锭 + bones
  { id:'jc_copper_ring', output:'copper_ring', inputs:[{resource:'bar_1',qty:2},{resource:'bones',qty:3}],  reqLevel:8,  xp:40,time:8},
  { id:'jc_copper_neck', output:'copper_neck', inputs:[{resource:'bar_1',qty:3},{resource:'bones',qty:4}],  reqLevel:8,  xp:50,time:10},
  // bar_2: 铝锭 + bones
  { id:'jc_alum_ring',   output:'alum_ring',   inputs:[{resource:'bar_2',qty:2},{resource:'bones',qty:4}],  reqLevel:16,xp:60,time:9},
  { id:'jc_alum_neck',   output:'alum_neck',   inputs:[{resource:'bar_2',qty:3},{resource:'bones',qty:5}],  reqLevel:16,xp:75,time:11},
  // bar_3: 铅锭 + bones
  { id:'jc_lead_ring',   output:'lead_ring',   inputs:[{resource:'bar_3',qty:2},{resource:'bones',qty:6}],  reqLevel:24,xp:90,time:10},
  { id:'jc_lead_neck',   output:'lead_neck',   inputs:[{resource:'bar_3',qty:3},{resource:'bones',qty:8}],  reqLevel:24,xp:110,time:12},
  // bar_4: 硫磺锭 (no bones)
  { id:'jc_sulfur_ring', output:'sulfur_ring', inputs:[{resource:'bar_4',qty:2}],                          reqLevel:32,xp:130,time:10},
  { id:'jc_sulfur_neck', output:'sulfur_neck', inputs:[{resource:'bar_4',qty:3}],                          reqLevel:32,xp:160,time:12},
  // bar_5: 硝酸盐锭 + dragonBones
  { id:'jc_nitrate_ring',output:'nitrate_ring',inputs:[{resource:'bar_5',qty:2},{resource:'dragonBones',qty:1}],reqLevel:40,xp:180,time:12},
  { id:'jc_nitrate_neck',output:'nitrate_neck',inputs:[{resource:'bar_5',qty:3},{resource:'dragonBones',qty:2}],reqLevel:40,xp:220,time:14},
  // bar_6: 铀锭 + dragonBones
  { id:'jc_uranium_ring',output:'uranium_ring',inputs:[{resource:'bar_6',qty:2},{resource:'dragonBones',qty:2}],reqLevel:50,xp:260,time:14},
  { id:'jc_uranium_neck',output:'uranium_neck',inputs:[{resource:'bar_6',qty:3},{resource:'dragonBones',qty:3}],reqLevel:50,xp:310,time:16},
  // bar_7: 钛金锭 + dragonBones
  { id:'jc_titanium_ring',output:'titanium_ring',inputs:[{resource:'bar_7',qty:3},{resource:'dragonBones',qty:3}],reqLevel:62,xp:360,time:16},
  { id:'jc_titanium_neck',output:'titanium_neck',inputs:[{resource:'bar_7',qty:4},{resource:'dragonBones',qty:4}],reqLevel:62,xp:420,time:18},
  // bar_8: 钨钢锭 + dragonBones
  { id:'jc_tungsten_ring',output:'tungsten_ring',inputs:[{resource:'bar_8',qty:3},{resource:'dragonBones',qty:4}],reqLevel:74,xp:500,time:18},
  { id:'jc_tungsten_neck',output:'tungsten_neck',inputs:[{resource:'bar_8',qty:4},{resource:'dragonBones',qty:5}],reqLevel:74,xp:580,time:22},
  // bar_9: 铱金锭 + dragonBones
  { id:'jc_iridium_ring',output:'iridium_ring',inputs:[{resource:'bar_9',qty:4},{resource:'dragonBones',qty:6}],reqLevel:86,xp:680,time:22},
  { id:'jc_iridium_neck',output:'iridium_neck',inputs:[{resource:'bar_9',qty:5},{resource:'dragonBones',qty:8}],reqLevel:86,xp:800,time:26},
];

// ─── Tool crafting recipes ────────────────────────────────────────────────────
export const TOOL_RECIPES: CraftingRecipe[] = [
  // Axes: wood + bars
  { id:'tool_scrap_axe',    output:'scrap_axe',    inputs:[{resource:'wood_0',qty:3},{resource:'bar_0',qty:2}], reqLevel:1,  xp:15, time:8 },
  { id:'tool_copper_axe',   output:'copper_axe',   inputs:[{resource:'wood_1',qty:3},{resource:'bar_1',qty:2}], reqLevel:8,  xp:30, time:10 },
  { id:'tool_alum_axe',     output:'alum_axe',     inputs:[{resource:'wood_2',qty:3},{resource:'bar_2',qty:2}], reqLevel:16, xp:50, time:12 },
  { id:'tool_lead_axe',     output:'lead_axe',     inputs:[{resource:'wood_3',qty:3},{resource:'bar_3',qty:2}], reqLevel:28, xp:80, time:14 },
  { id:'tool_uranium_axe',  output:'uranium_axe',  inputs:[{resource:'wood_5',qty:3},{resource:'bar_6',qty:2},{resource:'dragonBones',qty:1}], reqLevel:42, xp:130,time:16 },
  { id:'tool_titanium_axe', output:'titanium_axe', inputs:[{resource:'wood_7',qty:3},{resource:'bar_7',qty:2},{resource:'dragonBones',qty:2}], reqLevel:60, xp:200,time:18 },
  { id:'tool_iridium_axe',  output:'iridium_axe',  inputs:[{resource:'wood_9',qty:3},{resource:'bar_9',qty:2},{resource:'dragonBones',qty:4}], reqLevel:80, xp:320,time:24 },
  // Pickaxes: bars + bones
  { id:'tool_scrap_pick',    output:'scrap_pick',    inputs:[{resource:'bar_0',qty:2},{resource:'bones',qty:2}],  reqLevel:1,  xp:15, time:8 },
  { id:'tool_copper_pick',   output:'copper_pick',   inputs:[{resource:'bar_1',qty:2},{resource:'bones',qty:3}],  reqLevel:8,  xp:30, time:10 },
  { id:'tool_alum_pick',     output:'alum_pick',     inputs:[{resource:'bar_2',qty:2},{resource:'bones',qty:5}],  reqLevel:16, xp:50, time:12 },
  { id:'tool_lead_pick',     output:'lead_pick',     inputs:[{resource:'bar_3',qty:2},{resource:'bones',qty:8}],  reqLevel:28, xp:80, time:14 },
  { id:'tool_uranium_pick',  output:'uranium_pick',  inputs:[{resource:'bar_6',qty:2},{resource:'dragonBones',qty:1}], reqLevel:42, xp:130,time:16 },
  { id:'tool_titanium_pick', output:'titanium_pick', inputs:[{resource:'bar_7',qty:2},{resource:'dragonBones',qty:2}], reqLevel:60, xp:200,time:18 },
  { id:'tool_iridium_pick',  output:'iridium_pick',  inputs:[{resource:'bar_9',qty:2},{resource:'dragonBones',qty:4}], reqLevel:80, xp:320,time:24 },
  // Fishing rods: wood
  { id:'tool_scrap_rod',    output:'scrap_rod',    inputs:[{resource:'wood_0',qty:5}],  reqLevel:1,  xp:12, time:5 },
  { id:'tool_copper_rod',   output:'copper_rod',   inputs:[{resource:'wood_1',qty:5}],  reqLevel:6,  xp:25, time:8 },
  { id:'tool_alum_rod',     output:'alum_rod',     inputs:[{resource:'wood_2',qty:4},{resource:'bar_2',qty:1}], reqLevel:16, xp:45, time:10 },
  { id:'tool_lead_rod',     output:'lead_rod',     inputs:[{resource:'wood_3',qty:4},{resource:'bar_3',qty:1}], reqLevel:28, xp:75, time:12 },
  { id:'tool_titanium_rod', output:'titanium_rod', inputs:[{resource:'wood_7',qty:4},{resource:'bar_7',qty:1},{resource:'dragonBones',qty:1}], reqLevel:55, xp:170,time:16 },
  { id:'tool_iridium_rod',  output:'iridium_rod',  inputs:[{resource:'wood_9',qty:4},{resource:'bar_9',qty:1},{resource:'dragonBones',qty:3}], reqLevel:72, xp:250,time:20 },
  // Hunting knives: hide + bars
  { id:'tool_scrap_knife',   output:'scrap_knife',   inputs:[{resource:'hide_0',qty:2},{resource:'bones',qty:3}], reqLevel:1,  xp:15, time:8 },
  { id:'tool_copper_knife',  output:'copper_knife',  inputs:[{resource:'hide_1',qty:2},{resource:'bar_1',qty:1}], reqLevel:8,  xp:30, time:10 },
  { id:'tool_alum_knife',    output:'alum_knife',    inputs:[{resource:'hide_2',qty:2},{resource:'bar_2',qty:1}], reqLevel:16, xp:50, time:12 },
  { id:'tool_lead_knife',    output:'lead_knife',    inputs:[{resource:'hide_3',qty:2},{resource:'bar_3',qty:1}], reqLevel:28, xp:80, time:14 },
  { id:'tool_uranium_knife', output:'uranium_knife', inputs:[{resource:'hide_5',qty:2},{resource:'bar_6',qty:1},{resource:'dragonBones',qty:1}], reqLevel:42, xp:130,time:16 },
  { id:'tool_titanium_knife',output:'titanium_knife',inputs:[{resource:'hide_7',qty:2},{resource:'bar_7',qty:1},{resource:'dragonBones',qty:2}], reqLevel:58, xp:200,time:18 },
  { id:'tool_iridium_knife', output:'iridium_knife', inputs:[{resource:'hide_9',qty:2},{resource:'bar_9',qty:1},{resource:'dragonBones',qty:4}], reqLevel:75, xp:300,time:24 },
];

// ─── Item generation (Diablo-style) ───────────────────────────────────────────
const RARITY_PREFIXES: Record<Rarity, string[]> = {
  common:    ['破旧', '磨损', '粗制', '老旧', '残破'],
  uncommon:  ['坚固', '精良', '光泽', '强化', '锋利'],
  rare:      ['精工', '附魔', '精炼', '卓越', '淬火'],
  epic:      ['远古', '奥术', '神话', '符文', '圣洁'],
  legendary: ['传说', '永恒', '神赋', '炼狱', '不朽'],
  mythic:    ['混沌', '创世', '灭世', '神谕', '终焉'],
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
  common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5, mythic: 6,
};

const RARITY_MULTIPLIER: Record<Rarity, number> = {
  common: 0.5, uncommon: 0.9, rare: 1.4, epic: 2.0, legendary: 3.2, mythic: 5.0,
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
  [1,   5],  // 0: rad_roach
  [3,   8],  // 1: rad_rat
  [5,  12],  // 2: stray_dog
  [8,  18],  // 3: mutant_spider
  [12, 24],  // 4: zombie_walk
  [18, 30],  // 5: rad_scorpion
  [24, 38],  // 6: ghoul_flesh
  [30, 48],  // 7: mutant_hound
  [38, 55],  // 8: bandit_scav
  [48, 62],  // 9: rad_elemental
  [55, 70],  // 10: mutant_bear
  [62, 78],  // 11: zombie_brute
  [70, 86],  // 12: wasteland_raider
  [78, 94],  // 13: sentry_bot
  [86, 102], // 14: rad_drake
  [94, 110], // 15: deathclaw
  [102,120], // 16: mutant_behemoth
  [110,130], // 17: ancient_wraith
  [120,145], // 18: warlord
  [130,160], // 19: glowing_one (hidden)
  [145,180], // 20: elder_dragon (hidden)
  [160,200], // 21: overlord (hidden)
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
    case 'mythic':    return { numPrefix: 4, numSuffix: 4 };
    default: return { numPrefix: 0, numSuffix: 0 };
  }
}

// ── Unique item builder (shared by early roll + legendary rarity path) ────────
export function buildUniqueGameItem(def: UniqueItemDef): GameItem {
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
    combatStyle: def.combatStyle,
    flavorText: def.flavorText,
    maxSockets: 2, socketedGems: [],
    skills: (def.skills ?? []).map(s => ({ ...s })),
  };
}

export function generateDroppedItem(enemyIndex: number, playerMagicFind = 0, enemyUniqueDropIds?: string[], altarBonus = 0): GameItem {
  const band = ENEMY_ILVL_BANDS[Math.min(enemyIndex, ENEMY_ILVL_BANDS.length - 1)];
  const ilvl = band[0] + randInt(0, band[1] - band[0]);

  // ── Enemy-specific unique drop check (per-enemy loot table) ─────────────────
  if (enemyUniqueDropIds && enemyUniqueDropIds.length > 0 && Math.random() < 0.03) {
    const uid = enemyUniqueDropIds[randInt(0, enemyUniqueDropIds.length - 1)];
    const item = UNIQUE_ITEMS.find(u => u.id === uid);
    if (item) return buildUniqueGameItem(item);
  }

  // ── Generic unique drop check (enemy tier + ilvl gate) ──────────────────────
  const eligibleUniques = UNIQUE_ITEMS.filter(u => u.minEnemyIndex <= enemyIndex && u.ilvl <= ilvl + 10);
  const uniqueDropChance = 0.02 + enemyIndex * 0.005 + altarBonus * 0.03; // 2%–5.5%
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

// ─── Sub-stat system (equipment enhancement) ────────────────────────────────────

export type SubStatType =
  | 'attackBonus' | 'defenceBonus' | 'hpBonus'
  | 'critRating' | 'enhancedDamage' | 'lifeLeech'
  | 'resistAll' | 'deadlyStrike' | 'crushingBlow';

export interface SubStat {
  type: SubStatType;
  value: number;
  quality?: number;
}

export const SUB_STAT_LABEL: Record<SubStatType, string> = {
  attackBonus:    '攻击力',   defenceBonus:   '防御力',
  hpBonus:        '生命值',   critRating:     '暴击率',
  enhancedDamage: '暴击伤害', lifeLeech:      '生命偷取',
  resistAll:      '伤害减免',
  deadlyStrike:   '致命打击', crushingBlow:   '碾压打击',
};

export const SUB_STAT_WEIGHTS: Record<SubStatType, number> = {
  attackBonus:    3, defenceBonus: 3, hpBonus: 4,
  critRating:     3, enhancedDamage: 2, lifeLeech: 1,
  resistAll: 2, deadlyStrike: 1, crushingBlow: 1,
};

export function buildWeightedSubStatPool(exclude: SubStatType[] = []): SubStatType[] {
  const pool: SubStatType[] = [];
  for (const [type, weight] of Object.entries(SUB_STAT_WEIGHTS)) {
    if (exclude.includes(type as SubStatType)) continue;
    for (let i = 0; i < weight; i++) pool.push(type as SubStatType);
  }
  return pool;
}

export function rollSubStatValue(type: SubStatType, ilvl: number): { value: number; quality: number } {
  const tier = Math.floor(ilvl / 10);
  const scale = 1 + tier * 0.15;
  let min: number, max: number, step: number;
  switch (type) {
    case 'attackBonus':   min = 3;  max = 10;  step = 1;   break;
    case 'defenceBonus':  min = 3;  max = 10;  step = 1;   break;
    case 'hpBonus':       min = 10; max = 30;  step = 5;   break;
    case 'critRating':    min = 2;  max = 6;   step = 1;   break;
    case 'enhancedDamage': min = 3;  max = 8;  step = 1;   break;
    case 'lifeLeech':     min = 1;  max = 3;   step = 0.5; break;
    case 'deadlyStrike':  min = 1;  max = 4;   step = 0.5; break;
    case 'crushingBlow':  min = 1;  max = 5;   step = 0.5; break;
    case 'resistAll':     min = 1;  max = 4;   step = 1;   break;
  }
  const third = (max - min) / 3;
  const roll = Math.random();
  let quality: number, base: number;
  if (roll < 0.25)       { quality = 0; base = min + Math.random() * third; }
  else if (roll < 0.75)  { quality = 1; base = min + third + Math.random() * third; }
  else                    { quality = 2; base = min + 2 * third + Math.random() * third; }
  const scaled = Math.round((base * scale) / step) * step;
  const isPercent = ['critRating','enhancedDamage','lifeLeech','deadlyStrike','crushingBlow'].includes(type);
  const value = isPercent ? Math.round(scaled * 10) / 10 : Math.max(1, Math.floor(scaled));
  return { value, quality };
}

export const MAX_ENHANCE_LEVEL = 12;
export const ENHANCE_COST_PER_LEVEL = 30;

// ─── World Tier ────────────────────────────────────────────────────────────────

export type WorldTier = 1 | 2 | 3 | 4;

export const WORLD_TIER_LABEL: Record<WorldTier, string> = { 1: '☢️ 辐射废土', 2: '🔥 燃烧废土', 3: '💀 深渊废土', 4: '👑 终末废土' };
export const TIER_HP_MUL: Record<WorldTier, number> = { 1: 1, 2: 2, 3: 4, 4: 8 };
export const TIER_ATK_MUL: Record<WorldTier, number> = { 1: 1, 2: 1.5, 3: 2.5, 4: 4 };
export const TIER_ILVL_BONUS: Record<WorldTier, number> = { 1: 0, 2: 10, 3: 20, 4: 30 };
export const TIER_DROP_MUL: Record<WorldTier, number> = { 1: 1, 2: 1.3, 3: 1.6, 4: 2 };
export const TIER_UNLOCK_LEVELS: Partial<Record<WorldTier, number>> = { 2: 500, 3: 1500, 4: 3000 };

// ─── Combat triangle ─────────────────────────────────────────────────────────
export type CombatStyle = 'melee' | 'ranged' | 'magic';

export const COMBAT_TRIANGLE: Record<CombatStyle, { strong: CombatStyle; weak: CombatStyle; label: string }> = {
  melee:  { strong: 'ranged', weak: 'magic',  label: '近战' },
  ranged: { strong: 'magic',  weak: 'melee',  label: '远程' },
  magic:  { strong: 'melee',  weak: 'ranged', label: '投掷' },
};

export const TRIANGLE_DAMAGE_BONUS = 0.30;
export const TRIANGLE_DAMAGE_PENALTY = 0.15;

export function getCombatStyle(item: { combatStyle?: CombatStyle } | null | undefined): CombatStyle {
  return item?.combatStyle ?? 'melee';
}

// ─── Enemies ───────────────────────────────────────────────────────────────────
export interface Enemy {
  id: string;
  name: string;
  nameEn?: string;
  emoji: string;
  maxHp: number;
  attack: number;
  defence: number;
  xp: number;
  drops: { gold: [number, number]; bones?: number; dragonBones?: number };
  uniqueDropIds?: string[];
  reqCombatLevel: number;
  combatStyle?: CombatStyle;
  critRating?: number;
  critDamage?: number;
  attackSpeed?: number;
  hidden?: boolean;
}

// ═══ Melvor-style: 19 regular + 3 hidden — balanced 1-99 ════════════════════
export const ENEMIES: Enemy[] = [
  // ── LV 1-15 ──────────────────────────────────────────────────────────────
  { id:'rad_roach',     name:'变异蟑螂',   nameEn:'Mutant Roach',    emoji:'🪳',  maxHp:12,  attack:1,  defence:0,  xp:8,   drops:{gold:[1,3]},                     reqCombatLevel:1,  combatStyle:'melee',  uniqueDropIds:['storm_bow'] },
  { id:'rad_rat',       name:'辐射鼠',     nameEn:'Rad Rat',         emoji:'🐀',  maxHp:22,  attack:2,  defence:0,  xp:16,  drops:{gold:[2,4]},                     reqCombatLevel:5,  combatStyle:'melee',  uniqueDropIds:['eagle_eye_crossbow'] },
  { id:'stray_dog',     name:'流浪犬',     nameEn:'Stray Dog',       emoji:'🐕',  maxHp:45,  attack:4,  defence:1,  xp:30,  drops:{gold:[3,6],bones:1},            reqCombatLevel:10, combatStyle:'melee',  uniqueDropIds:['shadow_hunter_bow'] },
  { id:'mutant_spider', name:'变异蜘蛛',   nameEn:'Mutant Spider',   emoji:'🕷️',  maxHp:80,  attack:7,  defence:2,  xp:50,  drops:{gold:[5,10]},                   reqCombatLevel:15, combatStyle:'magic',  uniqueDropIds:['dragon_horn_bow'] },
  // ── LV 20-35 ──────────────────────────────────────────────────────────────
  { id:'zombie_walk',   name:'蹒跚丧尸',   nameEn:'Shambling Zombie',emoji:'🧟',  maxHp:140, attack:11, defence:4,  xp:80,  drops:{gold:[8,16],bones:2},           reqCombatLevel:20, combatStyle:'melee',  uniqueDropIds:['touch_of_darkness'] },
  { id:'rad_scorpion',  name:'辐射蝎',     nameEn:'Rad Scorpion',    emoji:'🦂',  maxHp:220, attack:15, defence:6,  xp:120, drops:{gold:[12,24]},                  reqCombatLevel:25, combatStyle:'ranged', uniqueDropIds:['dragonblood_plate'] },
  { id:'ghoul_flesh',   name:'食尸鬼',     nameEn:'Flesh Ghoul',     emoji:'👹',  maxHp:340, attack:20, defence:8,  xp:170, drops:{gold:[18,35],bones:3},          reqCombatLevel:30, combatStyle:'magic',  uniqueDropIds:['dragonblood_legs'] },
  { id:'mutant_hound',  name:'变异猎犬',   nameEn:'Mutant Hound',    emoji:'🐺',  maxHp:500, attack:26, defence:12, xp:230, drops:{gold:[25,50],bones:4},          reqCombatLevel:35, combatStyle:'melee',  uniqueDropIds:['flame_tongue_sword'] },
  // ── LV 40-55 ──────────────────────────────────────────────────────────────
  { id:'bandit_scav',   name:'废土拾荒者', nameEn:'Wasteland Scav',   emoji:'🏴', maxHp:700, attack:34, defence:16, xp:300, drops:{gold:[35,70],bones:5},          reqCombatLevel:40, combatStyle:'ranged', uniqueDropIds:['void_piercer'] },
  { id:'rad_elemental', name:'辐射元素',   nameEn:'Rad Elemental',    emoji:'☢️', maxHp:900, attack:42, defence:12, xp:380, drops:{gold:[45,90]},                  reqCombatLevel:45, combatStyle:'magic',  uniqueDropIds:['hellfire_plate'] },
  { id:'mutant_bear',   name:'变异熊',     nameEn:'Mutant Bear',      emoji:'🐻', maxHp:1150,attack:50, defence:22, xp:470, drops:{gold:[55,110],bones:6},         reqCombatLevel:50, combatStyle:'melee',  uniqueDropIds:['inferno_crown'] },
  { id:'zombie_brute',  name:'壮硕丧尸',   nameEn:'Zombie Brute',     emoji:'💪', maxHp:1450,attack:58, defence:28, xp:570, drops:{gold:[70,140],bones:6},         reqCombatLevel:55, combatStyle:'magic',  uniqueDropIds:['time_keeper_ring'] },
  // ── LV 60-75 ──────────────────────────────────────────────────────────────
  { id:'wasteland_raider',name:'废土掠夺者',nameEn:'Wasteland Raider',emoji:'⚔️',maxHp:1800,attack:68, defence:34, xp:680, drops:{gold:[85,170],dragonBones:3},  reqCombatLevel:60, combatStyle:'ranged', uniqueDropIds:['eternity_blade'] },
  { id:'sentry_bot',    name:'哨卫机器人', nameEn:'Sentry Bot',       emoji:'🤖', maxHp:2200,attack:76, defence:40, xp:800, drops:{gold:[100,200],dragonBones:4},  reqCombatLevel:65, combatStyle:'ranged', uniqueDropIds:['eternity_shield'] },
  { id:'rad_drake',     name:'辐射亚龙',   nameEn:'Rad Drake',        emoji:'🐉', maxHp:2700,attack:86, defence:46, xp:940, drops:{gold:[120,240],dragonBones:5}, reqCombatLevel:70, combatStyle:'magic', uniqueDropIds:['dracolich_mantle'] },
  { id:'deathclaw',     name:'死亡爪',     nameEn:'Deathclaw',        emoji:'🦖', maxHp:3300,attack:96, defence:52, xp:1100,drops:{gold:[140,280],dragonBones:6}, reqCombatLevel:75, combatStyle:'melee', uniqueDropIds:['void_blade'] },
  // ── LV 80-90 ──────────────────────────────────────────────────────────────
  { id:'mutant_behemoth',name:'变异巨兽',  nameEn:'Mutant Behemoth',  emoji:'🦣', maxHp:4000,attack:108,defence:58, xp:1300,drops:{gold:[170,340],dragonBones:8}, reqCombatLevel:80, combatStyle:'ranged', uniqueDropIds:['nullity_plate'] },
  { id:'ancient_wraith', name:'远古幽魂',  nameEn:'Ancient Wraith',   emoji:'👻', maxHp:4800,attack:120,defence:40, xp:1500,drops:{gold:[200,400],dragonBones:10},reqCombatLevel:85, combatStyle:'magic',  uniqueDropIds:['void_piercer','chaos_edge'] },
  { id:'warlord',        name:'废土军阀',  nameEn:'Wasteland Warlord',emoji:'👑', maxHp:5800,attack:135,defence:65, xp:1800,drops:{gold:[250,500],dragonBones:12},reqCombatLevel:90, combatStyle:'melee',  uniqueDropIds:['eternity_blade','inferno_crown'] },
  // ── HIDDEN (3) — only visible when unlocked ──────────────────────────────
  { id:'glowing_one',    name:'辐射辉光者',nameEn:'Glowing One',      emoji:'✨', maxHp:7500,attack:155,defence:60, xp:2500,drops:{gold:[350,700],dragonBones:20},  reqCombatLevel:95, combatStyle:'ranged',  hidden:true, uniqueDropIds:['bone_dragon_shield','chaos_edge'] },
  { id:'elder_dragon',   name:'远古巨龙',  nameEn:'Elder Dragon',     emoji:'🐲', maxHp:10000,attack:180,defence:75, xp:3500,drops:{gold:[500,1000],dragonBones:30},reqCombatLevel:98, combatStyle:'magic',   hidden:true, uniqueDropIds:['primal_forge_armor','flame_crown'] },
  { id:'overlord',       name:'终末霸主',  nameEn:'The Overlord',     emoji:'💀', maxHp:15000,attack:220,defence:90, xp:5000,drops:{gold:[800,1600],dragonBones:50},reqCombatLevel:99, combatStyle:'melee',   hidden:true, uniqueDropIds:['wasteland_plate','voidblade'] },
];

// ─── Boss skills ──────────────────────────────────────────────────────────────
export type BossSkillType = 'shield' | 'aoe' | 'heal' | 'enrage' | 'poison';

export const BOSS_SKILL_LABEL: Record<BossSkillType, string> = {
  shield: '护盾',
  aoe: '范围攻击',
  heal: '自愈',
  enrage: '狂暴',
  poison: '毒液',
};

export const BOSS_SKILL_DESC: Record<BossSkillType, string> = {
  shield: '获得护盾，减免 50% 伤害',
  aoe: '对所有玩家造成额外伤害',
  heal: '恢复部分生命值',
  enrage: '攻击力大幅提升',
  poison: '持续造成毒素伤害',
};

export interface BossSkill {
  type: BossSkillType;
  name: string;
  cooldownSec: number;
  value: number;
  duration: number;
}

// ─── Dungeon system ────────────────────────────────────────────────────────────
export interface DungeonBoss {
  name: string;
  emoji: string;
  maxHp: number;
  attack: number;
  defence: number;
  xp: number;
  skills?: BossSkill[];
}

export interface Dungeon {
  id: string;
  name: string;
  nameEn?: string;
  emoji: string;
  theme: string;
  reqCombatLevel: number;
  cost: { gold: number; bones?: number; dragonBones?: number };
  boss: DungeonBoss;
  uniqueDropIds: string[];
  dropChance: number;
  waves: DungeonWave[];
}

export interface DungeonWave {
  name: string;
  emoji: string;
  hpMul: number;
  atkMul: number;
}

export const DUNGEONS: Dungeon[] = [
  {
    id: 'corrupted_mine',
    name: '废弃矿坑',    nameEn: 'Abandoned Mine',
    emoji: '⛏️',
    theme: '战前的铀矿在被废弃后成了变异生物的巢穴，辐射瓦斯弥漫每一条通道。',
    reqCombatLevel: 10,
    cost: { gold: 100 },
    boss: { name: '矿坑变异体', emoji: '🦠', maxHp: 500, attack: 14, defence: 4, xp: 200, skills: [{ type: 'shield', name: '辐射甲壳', cooldownSec: 12, value: 50, duration: 1 }] },
    uniqueDropIds: ['d_rotten_core', 'd_corrosion_pick'],
    dropChance: 0.6,
    waves: [
      { name:'矿坑鼠', emoji:'🐀', hpMul:0.15, atkMul:0.3 },{ name:'变异蝙蝠', emoji:'🦇', hpMul:0.25, atkMul:0.4 },{ name:'辐射蠕虫', emoji:'🐛', hpMul:0.35, atkMul:0.5 },{ name:'矿工丧尸', emoji:'🧟', hpMul:0.45, atkMul:0.6 },{ name:'碎石魔像', emoji:'🗿', hpMul:0.55, atkMul:0.7 },{ name:'狂犬变异体', emoji:'🐕', hpMul:0.65, atkMul:0.8 },{ name:'矿坑蜘蛛', emoji:'🕷️', hpMul:0.7, atkMul:0.9 },{ name:'变异蝮蛇', emoji:'🐍', hpMul:0.75, atkMul:1.0 },{ name:'巨型蠕虫', emoji:'🪱', hpMul:0.85, atkMul:1.1 },{ name:'矿坑守卫者', emoji:'⛑️', hpMul:0.95, atkMul:1.2 },
    ],
  },
  {
    id: 'shadow_maze',
    name: '废弃地铁站',    nameEn: 'Abandoned Station',
    emoji: '🚇',
    theme: '战前的地铁枢纽现在成了拾荒者的迷宫，黑暗的隧道深处潜伏着无数危险。',
    reqCombatLevel: 20,
    cost: { gold: 400, bones: 10 },
    boss: { name: '隧道食人魔', emoji: '👹', maxHp: 1100, attack: 26, defence: 9, xp: 450, skills: [{ type: 'aoe', name: '隧道咆哮', cooldownSec: 15, value: 20, duration: 0 }] },
    uniqueDropIds: ['d_specter_cloak', 'd_shadow_sigil'],
    dropChance: 0.55,
    waves: [
      { name:'流浪者', emoji:'🏃', hpMul:0.2, atkMul:0.4 },{ name:'变异鼠群', emoji:'🐀', hpMul:0.3, atkMul:0.5 },{ name:'隧道蜘蛛', emoji:'🕷️', hpMul:0.4, atkMul:0.6 },{ name:'暗影拾荒者', emoji:'🥷', hpMul:0.5, atkMul:0.7 },{ name:'铁轨哨兵', emoji:'🗿', hpMul:0.6, atkMul:0.8 },{ name:'隧道刺客', emoji:'🗡️', hpMul:0.65, atkMul:0.9 },{ name:'变异守卫', emoji:'👤', hpMul:0.7, atkMul:1 },{ name:'巨型蟑螂', emoji:'🪳', hpMul:0.75, atkMul:1.1 },{ name:'毒气僵尸', emoji:'🧟', hpMul:0.82, atkMul:1.15 },{ name:'地铁领主', emoji:'👑', hpMul:0.95, atkMul:1.25 }
    ],
  },
  {
    id: 'flame_sanctum',
    name: '废弃炼油厂',    nameEn: 'Abandoned Refinery',
    emoji: '🏭',
    theme: '废弃的炼油厂充满了易燃气体和变异的火焰生物，任何火花都可能引发爆炸。',
    reqCombatLevel: 35,
    cost: { gold: 1200, bones: 35 },
    boss: { name: '炼油厂主管', emoji: '🧑‍🏭', maxHp: 2400, attack: 44, defence: 17, xp: 900, skills: [{ type: 'heal', name: '紧急注油', cooldownSec: 18, value: 300, duration: 0 }, { type: 'enrage', name: '过载燃烧', cooldownSec: 24, value: 30, duration: 2 }] },
    uniqueDropIds: ['d_flame_crown', 'd_ember_ring'],
    dropChance: 0.5,
    waves: [
      { name:'燃油史莱姆', emoji:'🟤', hpMul:0.25, atkMul:0.45 },{ name:'管道蠕虫', emoji:'🐛', hpMul:0.35, atkMul:0.55 },{ name:'火蜥蜴', emoji:'🦎', hpMul:0.45, atkMul:0.65 },{ name:'燃烧魔像', emoji:'🗿', hpMul:0.55, atkMul:0.75 },{ name:'烈焰蛇', emoji:'🐍', hpMul:0.65, atkMul:0.85 },{ name:'火焰精魂', emoji:'🔥', hpMul:0.7, atkMul:0.95 },{ name:'燃油巨人', emoji:'👹', hpMul:0.78, atkMul:1.05 },{ name:'熔渣元素', emoji:'🪨', hpMul:0.82, atkMul:1.12 },{ name:'炼油工人', emoji:'🧟', hpMul:0.88, atkMul:1.18 },{ name:'工厂保安', emoji:'💢', hpMul:0.95, atkMul:1.3 }
    ],
  },
  {
    id: 'void_fortress',
    name: '军事基地废墟',    nameEn: 'Military Base Ruins',
    emoji: '🏚️',
    theme: '废弃的军事基地中，失控的自动防御系统和变异士兵仍在执行最后的命令。',
    reqCombatLevel: 50,
    cost: { gold: 4000, bones: 80 },
    boss: { name: '军事AI核心', emoji: '🤖', maxHp: 4500, attack: 68, defence: 28, xp: 1800, skills: [{ type: 'shield', name: '能量护盾', cooldownSec: 15, value: 50, duration: 1 }, { type: 'aoe', name: '导弹齐射', cooldownSec: 20, value: 35, duration: 0 }] },
    uniqueDropIds: ['d_void_blade', 'd_nullity_plate'],
    dropChance: 0.45,
    waves: [
      { name:'哨兵无人机', emoji:'🛸', hpMul:0.3, atkMul:0.5 },{ name:'机械蝙蝠', emoji:'🦇', hpMul:0.4, atkMul:0.6 },{ name:'自动炮台', emoji:'📡', hpMul:0.5, atkMul:0.7 },{ name:'机甲蜘蛛', emoji:'🕷️', hpMul:0.6, atkMul:0.8 },{ name:'重装卫兵', emoji:'🛡️', hpMul:0.68, atkMul:0.9 },{ name:'隐形刺客', emoji:'🗡️', hpMul:0.74, atkMul:1 },{ name:'战术军官', emoji:'🎖️', hpMul:0.8, atkMul:1.1 },{ name:'机甲巨兽', emoji:'🦣', hpMul:0.85, atkMul:1.15 },{ name:'精英骑士', emoji:'⚔️', hpMul:0.9, atkMul:1.22 },{ name:'基地指挥官', emoji:'🛡️', hpMul:0.96, atkMul:1.3 }
    ],
  },
  {
    id: 'dragon_tomb',
    name: '辐射废料场',    nameEn: 'Radiation Dump',
    emoji: '☢️',
    theme: '高浓度辐射废料的填埋场，变异生物在此进化成了前所未有的恐怖形态。',
    reqCombatLevel: 65,
    cost: { gold: 10000, dragonBones: 8 },
    boss: { name: '辐射巨兽', emoji: '☣️', maxHp: 8000, attack: 100, defence: 44, xp: 3500, skills: [{ type: 'aoe', name: '辐射喷涌', cooldownSec: 15, value: 45, duration: 0 }, { type: 'heal', name: '细胞再生', cooldownSec: 22, value: 600, duration: 0 }, { type: 'enrage', name: '基因狂暴', cooldownSec: 30, value: 40, duration: 2 }] },
    uniqueDropIds: ['d_bone_dragon_shield', 'd_dracolich_mantle'],
    dropChance: 0.4,
    waves: [
      { name:'辐射鼠群', emoji:'🐀', hpMul:0.35, atkMul:0.55 },{ name:'废料魔像', emoji:'🗿', hpMul:0.45, atkMul:0.65 },{ name:'辐射蠕虫', emoji:'🐛', hpMul:0.55, atkMul:0.75 },{ name:'废料守卫', emoji:'🛡️', hpMul:0.62, atkMul:0.85 },{ name:'辐射幻影', emoji:'👻', hpMul:0.7, atkMul:0.95 },{ name:'变异卫兵', emoji:'💂', hpMul:0.75, atkMul:1.05 },{ name:'辐射元素', emoji:'☢️', hpMul:0.82, atkMul:1.12 },{ name:'巨型变异体', emoji:'🦣', hpMul:0.86, atkMul:1.18 },{ name:'辐射祭司', emoji:'🧙', hpMul:0.92, atkMul:1.24 },{ name:'废料之王', emoji:'👑', hpMul:0.97, atkMul:1.32 }
    ],
  },
  {
    id: 'chaos_forge',
    name: '反应堆核心',    nameEn: 'Reactor Core',
    emoji: '⚛️',
    theme: '失控的核反应堆内部，辐射浓度极高，只有最强悍的幸存者才能在这里存活。',
    reqCombatLevel: 80,
    cost: { gold: 25000, dragonBones: 20 },
    boss: { name: '核心守护者', emoji: '🤖', maxHp: 16000, attack: 160, defence: 70, xp: 8000, skills: [{ type: 'shield', name: '防护屏障', cooldownSec: 18, value: 60, duration: 1 }, { type: 'aoe', name: '辐射风暴', cooldownSec: 15, value: 55, duration: 0 }, { type: 'enrage', name: '核心过载', cooldownSec: 30, value: 50, duration: 3 }] },
    uniqueDropIds: ['d_chaos_edge', 'd_primal_forge_armor'],
    dropChance: 0.35,

    waves: [
      { name:'混沌火苗', emoji:'🔥', hpMul:0.38, atkMul:0.58 },{ name:'熔炉傀儡', emoji:'🗿', hpMul:0.48, atkMul:0.68 },{ name:'混沌蝙蝠', emoji:'🦇', hpMul:0.56, atkMul:0.78 },{ name:'锻造恶魔', emoji:'👿', hpMul:0.64, atkMul:0.88 },{ name:'熔岩卫士', emoji:'🛡️', hpMul:0.72, atkMul:0.98 },{ name:'混沌刺客', emoji:'🗡️', hpMul:0.78, atkMul:1.08 },{ name:'熔炉元素', emoji:'🪨', hpMul:0.84, atkMul:1.14 },{ name:'混沌巨兽', emoji:'🦣', hpMul:0.88, atkMul:1.2 },{ name:'熔炉祭司', emoji:'🧙', hpMul:0.93, atkMul:1.26 },{ name:'混沌守卫', emoji:'🛡️', hpMul:0.98, atkMul:1.35 }
    ],
  },
  // ── NEW: Dungeon 7 (Lv 30) ────────────────────────────────────────────────
  {
    id: 'toxic_sewer',
    name: '毒液下水道', nameEn: 'Toxic Sewer',
    emoji: '☣️',
    theme: '城市废墟之下的下水道系统，变异生物在毒液中繁衍生息，散发致命的化学废料。',
    reqCombatLevel: 30,
    cost: { gold: 800, bones: 25 },
    boss: { name: '毒液巨蜥', emoji: '🦎', maxHp: 2800, attack: 38, defence: 14, xp: 700, skills: [{ type: 'poison', name: '毒液喷溅', cooldownSec: 12, value: 25, duration: 2 }] },
    uniqueDropIds: ['d_toxic_plate', 'd_poison_dagger'],
    dropChance: 0.5,
    waves: [
      { name:'下水道鼠', emoji:'🐀', hpMul:0.3, atkMul:0.45 },{ name:'毒液蠕虫', emoji:'🐛', hpMul:0.4, atkMul:0.55 },{ name:'变异水蛭', emoji:'🪱', hpMul:0.5, atkMul:0.65 },{ name:'化学废料团', emoji:'🟢', hpMul:0.58, atkMul:0.75 },{ name:'毒雾幽灵', emoji:'👻', hpMul:0.65, atkMul:0.85 },{ name:'下水道爬行者', emoji:'🕷️', hpMul:0.72, atkMul:0.95 },{ name:'酸蚀傀儡', emoji:'🗿', hpMul:0.78, atkMul:1.05 },{ name:'毒液喷射者', emoji:'🐍', hpMul:0.84, atkMul:1.12 },{ name:'化学巨兽', emoji:'🦠', hpMul:0.9, atkMul:1.2 },{ name:'下水道守卫', emoji:'🛡️', hpMul:0.96, atkMul:1.28 }
    ],
  },
  // ── NEW: Dungeon 8 (Lv 55) ────────────────────────────────────────────────
  {
    id: 'frozen_tomb',
    name: '冰封陵墓', nameEn: 'Frozen Tomb',
    emoji: '❄️',
    theme: '核冬天将这座古墓永远冰封，墓中亡魂在永恒的寒冷中嘶吼，守卫着冰封的宝藏。',
    reqCombatLevel: 55,
    cost: { gold: 6000, dragonBones: 5 },
    boss: { name: '冰霜女巫', emoji: '🧙‍♀️', maxHp: 6000, attack: 80, defence: 36, xp: 2200, skills: [{ type: 'aoe', name: '暴风雪', cooldownSec: 14, value: 40, duration: 0 }, { type: 'shield', name: '冰霜护盾', cooldownSec: 16, value: 55, duration: 1 }, { type: 'heal', name: '寒冰再生', cooldownSec: 20, value: 400, duration: 0 }] },
    uniqueDropIds: ['d_frost_crown', 'd_ice_shard'],
    dropChance: 0.45,
    waves: [
      { name:'冰霜小鬼', emoji:'👿', hpMul:0.32, atkMul:0.48 },{ name:'寒冰蝙蝠', emoji:'🦇', hpMul:0.42, atkMul:0.58 },{ name:'雪地僵尸', emoji:'🧟', hpMul:0.52, atkMul:0.68 },{ name:'冰刺魔像', emoji:'🗿', hpMul:0.6, atkMul:0.78 },{ name:'寒冰射手', emoji:'🏹', hpMul:0.68, atkMul:0.88 },{ name:'冰霜骑士', emoji:'⚔️', hpMul:0.74, atkMul:0.98 },{ name:'雪崩元素', emoji:'🌨️', hpMul:0.8, atkMul:1.08 },{ name:'冰封龙兽', emoji:'🐉', hpMul:0.85, atkMul:1.15 },{ name:'寒冰祭司', emoji:'🧙', hpMul:0.9, atkMul:1.22 },{ name:'陵墓守护者', emoji:'🛡️', hpMul:0.95, atkMul:1.3 }
    ],
  },
  // ── NEW: Dungeon 9 (Lv 72) ────────────────────────────────────────────────
  {
    id: 'sunken_city',
    name: '淹没古城', nameEn: 'Sunken City',
    emoji: '🌊',
    theme: '洪水淹没的古城遗迹，深水之下潜伏着变异的深海怪物，上古秘密等待发掘。',
    reqCombatLevel: 72,
    cost: { gold: 16000, dragonBones: 12 },
    boss: { name: '深渊巨人', emoji: '🦑', maxHp: 12000, attack: 135, defence: 55, xp: 5000, skills: [{ type: 'aoe', name: '漩涡', cooldownSec: 13, value: 50, duration: 0 }, { type: 'heal', name: '深海再生', cooldownSec: 18, value: 800, duration: 0 }, { type: 'enrage', name: '深渊狂怒', cooldownSec: 25, value: 45, duration: 2 }] },
    uniqueDropIds: ['d_abyssal_blade', 'd_tide_armor'],
    dropChance: 0.4,
    waves: [
      { name:'深水鱼人', emoji:'🐟', hpMul:0.34, atkMul:0.5 },{ name:'海藻缠绕者', emoji:'🌿', hpMul:0.44, atkMul:0.6 },{ name:'珊瑚傀儡', emoji:'🪸', hpMul:0.54, atkMul:0.7 },{ name:'电鳗', emoji:'⚡', hpMul:0.62, atkMul:0.8 },{ name:'深海鲨鱼', emoji:'🦈', hpMul:0.7, atkMul:0.9 },{ name:'水元素', emoji:'💧', hpMul:0.76, atkMul:1.0 },{ name:'沧龙', emoji:'🦎', hpMul:0.82, atkMul:1.1 },{ name:'深渊守卫', emoji:'🛡️', hpMul:0.87, atkMul:1.18 },{ name:'深海祭司', emoji:'🧙', hpMul:0.92, atkMul:1.25 },{ name:'古城守护者', emoji:'🔱', hpMul:0.97, atkMul:1.32 }
    ],
  },
];

// Build dungeon unique item lookup: uniqueId → dungeonIndex
export const DUNGEON_UNIQUE_MAP: Record<string, number> = {};
for (let i = 0; i < DUNGEONS.length; i++) {
  for (const uid of DUNGEONS[i].uniqueDropIds) DUNGEON_UNIQUE_MAP[uid] = i;
}

export function generateDungeonDrop(dungeonIndex: number): GameItem | null {
  const dungeon = DUNGEONS[dungeonIndex];
  if (!dungeon) return null;
  if (Math.random() > dungeon.dropChance) return null;
  const id = dungeon.uniqueDropIds[Math.floor(Math.random() * dungeon.uniqueDropIds.length)];
  const def = UNIQUE_ITEMS.find(u => u.id === id);
  if (!def) return null;
  return buildUniqueGameItem(def);
}

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
  { id: 'smith_oak_bow',       output: 'oak_bow',           inputs: [{ resource: 'bar_0', qty: 1 }], reqLevel: 1,  xp: 25,  time: 8  },
  { id: 'r_bronze_sword',      output: 'bronze_sword',      inputs: [{ resource: 'bar_0', qty: 2 }], reqLevel: 5,  xp: 25,  time: 8  },
  { id: 'r_bronze_shield',     output: 'bronze_shield',     inputs: [{ resource: 'bar_0', qty: 3 }], reqLevel: 5,  xp: 35,  time: 10 },
  { id: 'r_bronze_helmet',     output: 'bronze_helmet',     inputs: [{ resource: 'bar_0', qty: 2 }], reqLevel: 5,  xp: 25,  time: 8  },
  { id: 'r_bronze_body',       output: 'bronze_body',       inputs: [{ resource: 'bar_0', qty: 5 }], reqLevel: 10, xp: 60,  time: 15 },
  { id: 'r_bronze_legs',       output: 'bronze_legs',       inputs: [{ resource: 'bar_0', qty: 4 }], reqLevel: 10, xp: 48,  time: 12 },
  { id: 'r_bronze_gauntlets',  output: 'bronze_gauntlets',  inputs: [{ resource: 'bar_0', qty: 2 }], reqLevel: 5,  xp: 22,  time: 7  },
  { id: 'r_bronze_boots',      output: 'bronze_boots',      inputs: [{ resource: 'bar_0', qty: 2 }], reqLevel: 5,  xp: 22,  time: 7  },
  // Iron (bar_1)
  { id: 'smith_yew_bow',       output: 'yew_bow',           inputs: [{ resource: 'bar_1', qty: 1 }], reqLevel: 8,  xp: 45,  time: 10 },
  { id: 'r_iron_sword',        output: 'iron_sword',        inputs: [{ resource: 'bar_1', qty: 2 }], reqLevel: 20, xp: 50,  time: 8  },
  { id: 'r_iron_shield',       output: 'iron_shield',       inputs: [{ resource: 'bar_1', qty: 3 }], reqLevel: 20, xp: 70,  time: 10 },
  { id: 'r_iron_helmet',       output: 'iron_helmet',       inputs: [{ resource: 'bar_1', qty: 2 }], reqLevel: 20, xp: 50,  time: 8  },
  { id: 'r_iron_body',         output: 'iron_body',         inputs: [{ resource: 'bar_1', qty: 5 }], reqLevel: 25, xp: 120, time: 15 },
  { id: 'r_iron_legs',         output: 'iron_legs',         inputs: [{ resource: 'bar_1', qty: 4 }], reqLevel: 25, xp: 96,  time: 12 },
  { id: 'r_iron_gauntlets',    output: 'iron_gauntlets',    inputs: [{ resource: 'bar_1', qty: 2 }], reqLevel: 20, xp: 45,  time: 7  },
  { id: 'r_iron_boots',        output: 'iron_boots',        inputs: [{ resource: 'bar_1', qty: 2 }], reqLevel: 20, xp: 45,  time: 7  },
  // Steel (bar_2)
  { id: 'smith_maple_bow',     output: 'maple_bow',         inputs: [{ resource: 'bar_2', qty: 2 }], reqLevel: 16, xp: 70,  time: 12 },
  { id: 'r_steel_sword',       output: 'steel_sword',       inputs: [{ resource: 'bar_2', qty: 2 }], reqLevel: 30, xp: 75,  time: 8  },
  { id: 'r_steel_shield',      output: 'steel_shield',      inputs: [{ resource: 'bar_2', qty: 3 }], reqLevel: 30, xp: 105, time: 10 },
  { id: 'r_steel_helmet',      output: 'steel_helmet',      inputs: [{ resource: 'bar_2', qty: 2 }], reqLevel: 30, xp: 75,  time: 8  },
  { id: 'r_steel_body',        output: 'steel_body',        inputs: [{ resource: 'bar_2', qty: 5 }], reqLevel: 35, xp: 180, time: 15 },
  { id: 'r_steel_legs',        output: 'steel_legs',        inputs: [{ resource: 'bar_2', qty: 4 }], reqLevel: 35, xp: 144, time: 12 },
  { id: 'r_steel_gauntlets',   output: 'steel_gauntlets',   inputs: [{ resource: 'bar_2', qty: 2 }], reqLevel: 30, xp: 70,  time: 7  },
  { id: 'r_steel_boots',       output: 'steel_boots',       inputs: [{ resource: 'bar_2', qty: 2 }], reqLevel: 30, xp: 70,  time: 7  },
  // Mithril (bar_4)
  { id: 'smith_mithril_bow',   output: 'mithril_bow',       inputs: [{ resource: 'bar_4', qty: 2 }], reqLevel: 28, xp: 120, time: 15 },
  { id: 'r_mithril_sword',     output: 'mithril_sword',     inputs: [{ resource: 'bar_4', qty: 2 }], reqLevel: 50, xp: 120, time: 10 },
  { id: 'r_mithril_shield',    output: 'mithril_shield',    inputs: [{ resource: 'bar_4', qty: 3 }], reqLevel: 50, xp: 160, time: 12 },
  // Adamant (bar_5)
  { id: 'smith_adamant_bow',   output: 'adamant_bow',       inputs: [{ resource: 'bar_5', qty: 3 }], reqLevel: 40, xp: 180, time: 18 },
  { id: 'r_adamant_sword',     output: 'adamant_sword',     inputs: [{ resource: 'bar_5', qty: 2 }], reqLevel: 60, xp: 160, time: 10 },
  // Rune (bar_6)
  { id: 'smith_rune_bow',      output: 'rune_bow_forged',   inputs: [{ resource: 'bar_6', qty: 3 }], reqLevel: 55, xp: 260, time: 22 },
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

// ─── Thieving skill ───────────────────────────────────────────────────────────
export interface ThievingNPC {
  id: string; name: string; emoji: string; level: number;
  perception: number; maxHit: number; interval: number;
  xp: number; gpMin: number; gpMax: number;
  commonDrops: { name: string; emoji: string; qty: number; chance: number }[];
  uniqueDrop?: { id: string; name: string; emoji: string; chance: number };
  hidden?: boolean; unlockCondition?: string; unlockHint?: string;
}

export const THIEVING_NPCS: ThievingNPC[] = [
  { id:'drunkard',name:'流浪汉',emoji:'🤢',level:1,perception:40,maxHit:2,interval:3,xp:5,gpMin:5,gpMax:15,
    commonDrops:[{name:'空瓶盖',emoji:'🍾',qty:1,chance:0.3},{name:'发霉面包',emoji:'🍞',qty:1,chance:0.2}],
    uniqueDrop:{id:'lucky_coin',name:'幸运硬币',emoji:'🪙',chance:250} },
  { id:'beggar',name:'废墟乞丐',emoji:'🧙',level:8,perception:80,maxHit:3,interval:3,xp:10,gpMin:10,gpMax:30,
    commonDrops:[{name:'破布',emoji:'🧶',qty:1,chance:0.25},{name:'幸运草',emoji:'🍀',qty:1,chance:0.15}],
    uniqueDrop:{id:'beggar_pouch',name:'乞丐钱袋',emoji:'💰',chance:300} },
  { id:'peddler',name:'废品商人',emoji:'🧑',level:15,perception:120,maxHit:5,interval:3,xp:18,gpMin:20,gpMax:50,
    commonDrops:[{name:'旧布料',emoji:'🧵',qty:1,chance:0.2},{name:'植物种子',emoji:'🌱',qty:1,chance:0.15}],
    uniqueDrop:{id:'discount_coupon',name:'打折券',emoji:'🎫',chance:250} },
  { id:'scavenger',name:'废土行商',emoji:'🎒',level:25,perception:180,maxHit:8,interval:3,xp:30,gpMin:35,gpMax:80,
    commonDrops:[{name:'废金属',emoji:'🔩',qty:1,chance:0.2},{name:'机械零件',emoji:'⚙️',qty:1,chance:0.12}],
    uniqueDrop:{id:'scrap_backpack',name:'废料背包',emoji:'🎒',chance:220} },
  { id:'smuggler',name:'黑市走私犯',emoji:'🕵️',level:35,perception:250,maxHit:12,interval:3,xp:50,gpMin:60,gpMax:130,
    commonDrops:[{name:'走私品',emoji:'📦',qty:1,chance:0.15},{name:'稀有草药',emoji:'🌿',qty:1,chance:0.1}],
    uniqueDrop:{id:'smuggler_map',name:'走私地图',emoji:'🗺️',chance:200} },
  { id:'raider',name:'废土掠夺者',emoji:'🏴',level:45,perception:340,maxHit:16,interval:3,xp:80,gpMin:100,gpMax:200,
    commonDrops:[{name:'弹药箱',emoji:'🔫',qty:1,chance:0.12},{name:'手雷',emoji:'💣',qty:1,chance:0.06}],
    uniqueDrop:{id:'raider_gloves',name:'掠夺者手套',emoji:'🧤',chance:180},
    hidden:true, unlockCondition:'combat_50', unlockHint:'击杀 50 个敌人' },
  { id:'trader',name:'废土商人',emoji:'🧳',level:55,perception:450,maxHit:22,interval:3,xp:120,gpMin:150,gpMax:300,
    commonDrops:[{name:'金粉',emoji:'✨',qty:1,chance:0.1},{name:'宝石碎片',emoji:'💠',qty:1,chance:0.08}],
    uniqueDrop:{id:'trader_license',name:'商人执照',emoji:'📜',chance:160},
    hidden:true, unlockCondition:'town_15', unlockHint:'城镇等级达到 15' },
  { id:'warlord',name:'废土军阀',emoji:'👑',level:65,perception:580,maxHit:30,interval:3,xp:180,gpMin:250,gpMax:500,
    commonDrops:[{name:'军需物资',emoji:'⚙️',qty:1,chance:0.08},{name:'情报文件',emoji:'📜',qty:1,chance:0.05}],
    uniqueDrop:{id:'warlord_ring',name:'军阀之戒',emoji:'💍',chance:140},
    hidden:true, unlockCondition:'dungeon_2', unlockHint:'通关第 2 个副本' },
  { id:'banker',name:'避难所银行家',emoji:'🏦',level:75,perception:750,maxHit:40,interval:3,xp:280,gpMin:400,gpMax:800,
    commonDrops:[{name:'债券',emoji:'📄',qty:1,chance:0.06},{name:'金币袋',emoji:'💰',qty:1,chance:0.04}],
    uniqueDrop:{id:'banker_key',name:'银行家钥匙',emoji:'🔑',chance:120},
    hidden:true, unlockCondition:'tier_2', unlockHint:'世界层级达到 2' },
  { id:'ancient_king',name:'废土统治者',emoji:'👑',level:90,perception:1000,maxHit:60,interval:3,xp:500,gpMin:800,gpMax:1600,
    commonDrops:[{name:'不朽碎片',emoji:'🌟',qty:1,chance:0.06},{name:'龙鳞',emoji:'🛡️',qty:1,chance:0.03}],
    uniqueDrop:{id:'immortal_badge',name:'不朽徽章',emoji:'🏅',chance:80},
    hidden:true, unlockCondition:'thieving_90', unlockHint:'搜刮等级达到 90' },
];

export function calcStealth(thievingLevel: number, equipmentBonus: number): number {
  return Math.floor(thievingLevel * 2 + equipmentBonus * 0.5);
}
export function calcThievingSuccessRate(stealth: number, perception: number): number {
  return Math.min(0.95, (stealth + 100) / (perception + 100));
}
export function calcThievingDoubleRate(stealth: number, perception: number): number {
  return Math.min(0.5, stealth / (perception * 2));
}

// ─── Tools ────────────────────────────────────────────────────────────────────
export interface GameTool {
  id: string; name: string; emoji: string; skill: string; timeMult: number; yieldBonus: number;
}

export const ALL_TOOLS: GameTool[] = [
  // Axes (woodcutting)
  { id:'scrap_axe',    name:'废铁斧', emoji:'🟤🪓', skill:'woodcutting', timeMult:0.95, yieldBonus:0 },
  { id:'copper_axe',   name:'铜斧',   emoji:'🟠🪓', skill:'woodcutting', timeMult:0.90, yieldBonus:0 },
  { id:'alum_axe',     name:'铝斧',   emoji:'⬜🪓', skill:'woodcutting', timeMult:0.85, yieldBonus:0 },
  { id:'lead_axe',     name:'铅斧',   emoji:'🔘🪓', skill:'woodcutting', timeMult:0.80, yieldBonus:1 },
  { id:'uranium_axe',  name:'铀斧',   emoji:'🟢🪓', skill:'woodcutting', timeMult:0.75, yieldBonus:1 },
  { id:'titanium_axe', name:'钛金斧', emoji:'🔵🪓', skill:'woodcutting', timeMult:0.70, yieldBonus:2 },
  { id:'iridium_axe',  name:'铱金斧', emoji:'🟣🪓', skill:'woodcutting', timeMult:0.60, yieldBonus:2 },
  // Pickaxes (mining)
  { id:'scrap_pick',    name:'废铁镐', emoji:'🟤⛏️', skill:'mining', timeMult:0.95, yieldBonus:0 },
  { id:'copper_pick',   name:'铜镐',   emoji:'🟠⛏️', skill:'mining', timeMult:0.90, yieldBonus:0 },
  { id:'alum_pick',     name:'铝镐',   emoji:'⬜⛏️', skill:'mining', timeMult:0.85, yieldBonus:0 },
  { id:'lead_pick',     name:'铅镐',   emoji:'🔘⛏️', skill:'mining', timeMult:0.80, yieldBonus:1 },
  { id:'uranium_pick',  name:'铀镐',   emoji:'🟢⛏️', skill:'mining', timeMult:0.75, yieldBonus:1 },
  { id:'titanium_pick', name:'钛金镐', emoji:'🔵⛏️', skill:'mining', timeMult:0.70, yieldBonus:2 },
  { id:'iridium_pick',  name:'铱金镐', emoji:'🟣⛏️', skill:'mining', timeMult:0.60, yieldBonus:2 },
  // Fishing rods
  { id:'scrap_rod',     name:'废铁竿', emoji:'🟤🎣', skill:'fishing', timeMult:0.95, yieldBonus:0 },
  { id:'copper_rod',    name:'铜鱼竿', emoji:'🟠🎣', skill:'fishing', timeMult:0.90, yieldBonus:0 },
  { id:'alum_rod',      name:'铝鱼竿', emoji:'⬜🎣', skill:'fishing', timeMult:0.85, yieldBonus:0 },
  { id:'lead_rod',      name:'铅鱼竿', emoji:'🔘🎣', skill:'fishing', timeMult:0.80, yieldBonus:1 },
  { id:'titanium_rod',  name:'钛金竿', emoji:'🔵🎣', skill:'fishing', timeMult:0.70, yieldBonus:2 },
  { id:'iridium_rod',   name:'铱金竿', emoji:'🟣🎣', skill:'fishing', timeMult:0.60, yieldBonus:2 },
  // Hunting knives
  { id:'scrap_knife',   name:'废铁刀', emoji:'🟤🔪', skill:'hunting', timeMult:0.95, yieldBonus:0 },
  { id:'copper_knife',  name:'铜猎刀', emoji:'🟠🔪', skill:'hunting', timeMult:0.90, yieldBonus:0 },
  { id:'alum_knife',    name:'铝猎刀', emoji:'⬜🔪', skill:'hunting', timeMult:0.85, yieldBonus:0 },
  { id:'lead_knife',    name:'铅猎刀', emoji:'🔘🔪', skill:'hunting', timeMult:0.80, yieldBonus:1 },
  { id:'uranium_knife', name:'铀猎刀', emoji:'🟢🔪', skill:'hunting', timeMult:0.75, yieldBonus:1 },
  { id:'titanium_knife',name:'钛金刀', emoji:'🔵🔪', skill:'hunting', timeMult:0.70, yieldBonus:2 },
  { id:'iridium_knife', name:'铱金刀', emoji:'🟣🔪', skill:'hunting', timeMult:0.60, yieldBonus:2 },
];

export function getToolBonus(toolJson: string): { timeMult: number; yieldBonus: number } {
  try {
    const tool = JSON.parse(toolJson) as GameTool | {};
    if (!('id' in tool)) return { timeMult: 1, yieldBonus: 0 };
    return { timeMult: (tool as GameTool).timeMult, yieldBonus: (tool as GameTool).yieldBonus };
  } catch { return { timeMult: 1, yieldBonus: 0 }; }
}

// ─── Talent trees ─────────────────────────────────────────────────────────────
export interface TalentNode {
  id: string;
  name: string;
  emoji: string;
  style: CombatStyle;
  class: string;        // class name
  tier: number;         // 0=center, 1=branch, 2=ultimate
  cost: number;         // talent points required
  requires: string[];  // prerequisite node ids
  effect: string;       // bonus description
  x: number; y: number; // position in SVG grid (0-100)
}


export const TALENT_TREES: Record<CombatStyle, TalentNode[]> = {
  melee: [
    { id:'m_center',name:'近战之道',emoji:'⚔️',style:'melee',class:'',tier:0,cost:0,effect:'',x:50,y:50,requires:[] },
    { id:'m_p_str1',name:'力量',emoji:'💪',style:'melee',class:'圣骑士',tier:1,cost:1,effect:'+2攻击',x:40,y:40,requires:['m_center'] },
    { id:'m_p_str2',name:'巨力',emoji:'💪',style:'melee',class:'圣骑士',tier:2,cost:1,effect:'+3攻击',x:35,y:35,requires:['m_p_str1'] },
    { id:'m_p_vit1',name:'活力',emoji:'❤️',style:'melee',class:'圣骑士',tier:1,cost:1,effect:'+10HP',x:45,y:35,requires:['m_center'] },
    { id:'m_p_vit2',name:'坚韧',emoji:'❤️',style:'melee',class:'圣骑士',tier:2,cost:1,effect:'+15HP',x:42,y:28,requires:['m_p_vit1'] },
    { id:'m_p_arm1',name:'护甲',emoji:'🛡️',style:'melee',class:'圣骑士',tier:1,cost:1,effect:'+2防御',x:38,y:30,requires:['m_center'] },
    { id:'m_p_arm2',name:'铁壁',emoji:'🛡️',style:'melee',class:'圣骑士',tier:2,cost:1,effect:'+3防御',x:32,y:25,requires:['m_p_arm1'] },
    { id:'m_p_reg', name:'再生',emoji:'🌿',style:'melee',class:'圣骑士',tier:2,cost:2,effect:'+2回复',x:28,y:20,requires:['m_p_vit1','m_p_arm1'] },
    { id:'m_p_ult', name:'圣盾',emoji:'✨',style:'melee',class:'圣骑士',tier:3,cost:5,effect:'+15%防+20%HP',x:22,y:12,requires:['m_p_reg'] },
    { id:'m_b_atk1',name:'蛮力',emoji:'💢',style:'melee',class:'狂战士',tier:1,cost:1,effect:'+3攻击',x:60,y:40,requires:['m_center'] },
    { id:'m_b_atk2',name:'狂怒',emoji:'💢',style:'melee',class:'狂战士',tier:2,cost:1,effect:'+5攻击',x:65,y:35,requires:['m_b_atk1'] },
    { id:'m_b_cr1', name:'暴击',emoji:'💥',style:'melee',class:'狂战士',tier:1,cost:1,effect:'+1%暴击',x:55,y:35,requires:['m_center'] },
    { id:'m_b_cr2', name:'致命',emoji:'💥',style:'melee',class:'狂战士',tier:2,cost:1,effect:'+2%暴击',x:58,y:28,requires:['m_b_cr1'] },
    { id:'m_b_spd1',name:'攻速',emoji:'⚡',style:'melee',class:'狂战士',tier:1,cost:1,effect:'+1%攻速',x:62,y:30,requires:['m_center'] },
    { id:'m_b_spd2',name:'疾风',emoji:'⚡',style:'melee',class:'狂战士',tier:2,cost:1,effect:'+2%攻速',x:68,y:25,requires:['m_b_spd1'] },
    { id:'m_b_ult', name:'嗜血',emoji:'🩸',style:'melee',class:'狂战士',tier:3,cost:5,effect:'+5%吸血+10%攻',x:78,y:12,requires:['m_b_atk2','m_b_cr2'] },
    { id:'m_s_pr1', name:'精准',emoji:'🎯',style:'melee',class:'武士',tier:1,cost:1,effect:'+1%暴击',x:45,y:60,requires:['m_center'] },
    { id:'m_s_pr2', name:'心眼',emoji:'👁️',style:'melee',class:'武士',tier:2,cost:1,effect:'+2%暴击',x:42,y:68,requires:['m_s_pr1'] },
    { id:'m_s_dmg1',name:'剑术',emoji:'⚔️',style:'melee',class:'武士',tier:1,cost:1,effect:'+2攻击',x:55,y:60,requires:['m_center'] },
    { id:'m_s_dmg2',name:'居合',emoji:'⚔️',style:'melee',class:'武士',tier:2,cost:1,effect:'+3攻击',x:58,y:68,requires:['m_s_dmg1'] },
    { id:'m_s_exe', name:'处决',emoji:'💀',style:'melee',class:'武士',tier:2,cost:2,effect:'+3%处决',x:50,y:75,requires:['m_s_pr1','m_s_dmg1'] },
    { id:'m_s_ult', name:'一刀两断',emoji:'💀',style:'melee',class:'武士',tier:3,cost:5,effect:'+5%处决+10%暴伤',x:50,y:90,requires:['m_s_exe'] },
  ],
  ranged: [
    { id:'r_center',name:'远程之道',emoji:'🏹',style:'ranged',class:'',tier:0,cost:0,effect:'',x:50,y:50,requires:[] },
    { id:'r_a_spd1',name:'迅捷',emoji:'💨',style:'ranged',class:'刺客',tier:1,cost:1,effect:'+1%攻速',x:40,y:40,requires:['r_center'] },
    { id:'r_a_spd2',name:'疾步',emoji:'💨',style:'ranged',class:'刺客',tier:2,cost:1,effect:'+2%攻速',x:35,y:35,requires:['r_a_spd1'] },
    { id:'r_a_cr1', name:'暗杀',emoji:'🗡️',style:'ranged',class:'刺客',tier:1,cost:1,effect:'+1%暴击',x:45,y:35,requires:['r_center'] },
    { id:'r_a_cr2', name:'影袭',emoji:'🗡️',style:'ranged',class:'刺客',tier:2,cost:1,effect:'+2%暴击',x:42,y:28,requires:['r_a_cr1'] },
    { id:'r_a_dge1',name:'闪避',emoji:'🌀',style:'ranged',class:'刺客',tier:1,cost:1,effect:'+2%闪避',x:38,y:30,requires:['r_center'] },
    { id:'r_a_dge2',name:'幻影',emoji:'🌀',style:'ranged',class:'刺客',tier:2,cost:1,effect:'+3%闪避',x:32,y:25,requires:['r_a_dge1'] },
    { id:'r_a_ult', name:'影步',emoji:'🌑',style:'ranged',class:'刺客',tier:3,cost:5,effect:'+10%双击+10%闪避',x:22,y:12,requires:['r_a_spd2','r_a_cr2'] },
    { id:'r_r_hp1', name:'野性',emoji:'🐺',style:'ranged',class:'游侠',tier:1,cost:1,effect:'+10HP',x:60,y:40,requires:['r_center'] },
    { id:'r_r_hp2', name:'兽王',emoji:'🐺',style:'ranged',class:'游侠',tier:2,cost:1,effect:'+15HP',x:65,y:35,requires:['r_r_hp1'] },
    { id:'r_r_reg1',name:'回复',emoji:'🌿',style:'ranged',class:'游侠',tier:1,cost:1,effect:'+1回复',x:55,y:35,requires:['r_center'] },
    { id:'r_r_reg2',name:'自然',emoji:'🌿',style:'ranged',class:'游侠',tier:2,cost:1,effect:'+2回复',x:58,y:28,requires:['r_r_reg1'] },
    { id:'r_r_trp', name:'陷阱',emoji:'🕳️',style:'ranged',class:'游侠',tier:2,cost:2,effect:'+5毒伤',x:62,y:22,requires:['r_r_hp1','r_r_reg1'] },
    { id:'r_r_ult', name:'自然之力',emoji:'🌳',style:'ranged',class:'游侠',tier:3,cost:5,effect:'+5回复+20%HP',x:78,y:12,requires:['r_r_trp'] },
    { id:'r_s_dmg1',name:'瞄准',emoji:'🎯',style:'ranged',class:'神射手',tier:1,cost:1,effect:'+2攻击',x:45,y:60,requires:['r_center'] },
    { id:'r_s_dmg2',name:'鹰眼',emoji:'🦅',style:'ranged',class:'神射手',tier:2,cost:1,effect:'+3攻击',x:42,y:68,requires:['r_s_dmg1'] },
    { id:'r_s_ava1',name:'雪崩',emoji:'🏔️',style:'ranged',class:'神射手',tier:1,cost:1,effect:'+2%雪崩',x:55,y:60,requires:['r_center'] },
    { id:'r_s_ava2',name:'冰雹',emoji:'❄️',style:'ranged',class:'神射手',tier:2,cost:1,effect:'+3%雪崩',x:58,y:68,requires:['r_s_ava1'] },
    { id:'r_s_ult', name:'致命射击',emoji:'💥',style:'ranged',class:'神射手',tier:3,cost:5,effect:'+10%暴伤+5%雪崩',x:50,y:90,requires:['r_s_dmg2','r_s_ava2'] },
  ],
  magic: [
    { id:'mg_center',name:'魔法之道',emoji:'🪄',style:'magic',class:'',tier:0,cost:0,effect:'',x:50,y:50,requires:[] },
    { id:'mg_n_hp1', name:'骨盾',emoji:'🦴',style:'magic',class:'死灵法师',tier:1,cost:1,effect:'+10HP',x:40,y:40,requires:['mg_center'] },
    { id:'mg_n_hp2', name:'血盾',emoji:'🩸',style:'magic',class:'死灵法师',tier:2,cost:1,effect:'+15HP',x:35,y:35,requires:['mg_n_hp1'] },
    { id:'mg_n_db1', name:'召唤',emoji:'💀',style:'magic',class:'死灵法师',tier:1,cost:1,effect:'+2%双击',x:45,y:35,requires:['mg_center'] },
    { id:'mg_n_db2', name:'亡灵',emoji:'👻',style:'magic',class:'死灵法师',tier:2,cost:1,effect:'+3%双击',x:42,y:28,requires:['mg_n_db1'] },
    { id:'mg_n_cur', name:'诅咒',emoji:'👁️',style:'magic',class:'死灵法师',tier:2,cost:2,effect:'+3%致死',x:38,y:22,requires:['mg_n_hp1','mg_n_db1'] },
    { id:'mg_n_ult', name:'亡灵大军',emoji:'💀',style:'magic',class:'死灵法师',tier:3,cost:5,effect:'+5%双击+10%尸爆',x:22,y:12,requires:['mg_n_cur'] },
    { id:'mg_p_ps1', name:'毒液',emoji:'🧪',style:'magic',class:'剧毒术士',tier:1,cost:1,effect:'+2毒伤',x:60,y:40,requires:['mg_center'] },
    { id:'mg_p_ps2', name:'猛毒',emoji:'☠️',style:'magic',class:'剧毒术士',tier:2,cost:1,effect:'+3毒伤',x:65,y:35,requires:['mg_p_ps1'] },
    { id:'mg_p_cr1', name:'尸爆',emoji:'💥',style:'magic',class:'剧毒术士',tier:1,cost:1,effect:'+2%尸爆',x:55,y:35,requires:['mg_center'] },
    { id:'mg_p_cr2', name:'瘟疫',emoji:'🦠',style:'magic',class:'剧毒术士',tier:2,cost:1,effect:'+3%尸爆',x:58,y:28,requires:['mg_p_cr1'] },
    { id:'mg_p_ult', name:'毒云',emoji:'☠️',style:'magic',class:'剧毒术士',tier:3,cost:5,effect:'+5毒伤+5%尸爆',x:78,y:12,requires:['mg_p_ps2','mg_p_cr2'] },
    { id:'mg_e_me1', name:'陨石',emoji:'☄️',style:'magic',class:'元素师',tier:1,cost:1,effect:'+2%陨石',x:45,y:60,requires:['mg_center'] },
    { id:'mg_e_me2', name:'流星',emoji:'🌠',style:'magic',class:'元素师',tier:2,cost:1,effect:'+3%陨石',x:42,y:68,requires:['mg_e_me1'] },
    { id:'mg_e_ch1', name:'闪电',emoji:'⚡',style:'magic',class:'元素师',tier:1,cost:1,effect:'+2%连锁',x:55,y:60,requires:['mg_center'] },
    { id:'mg_e_ch2', name:'雷暴',emoji:'🌩️',style:'magic',class:'元素师',tier:2,cost:1,effect:'+3%连锁',x:58,y:68,requires:['mg_e_ch1'] },
    { id:'mg_e_ult', name:'元素掌控',emoji:'🔥',style:'magic',class:'元素师',tier:3,cost:5,effect:'+5%陨石+5%连锁',x:50,y:90,requires:['mg_e_me2','mg_e_ch2'] },
  ],
};

// ─── Gambling ──────────────────────────────────────────────────────────────────
export interface GambleTier {
  id: string; name: string; emoji: string; costPerLevel: number;
  ilvlSpread: number; rarities: { rarity: Rarity; weight: number}[];
  uniqueChance: number;
}
export const GAMBLE_TIERS: GambleTier[] = [
  { id:'normal', name:'普通', emoji:'🎲', costPerLevel:100, ilvlSpread:15,
    rarities:[{rarity:'common',weight:70},{rarity:'uncommon',weight:25},{rarity:'rare',weight:5}], uniqueChance:0 },
  { id:'rare', name:'稀有', emoji:'🎲', costPerLevel:1000, ilvlSpread:8,
    rarities:[{rarity:'uncommon',weight:40},{rarity:'rare',weight:40},{rarity:'epic',weight:15},{rarity:'legendary',weight:5}], uniqueChance:0.005 },
  { id:'legendary', name:'传说', emoji:'🎲', costPerLevel:10000, ilvlSpread:3,
    rarities:[{rarity:'rare',weight:30},{rarity:'epic',weight:40},{rarity:'legendary',weight:25},{rarity:'mythic',weight:5}], uniqueChance:0.01 },
];

// ─── Homestead ─────────────────────────────────────────────────────────────────
export interface HomesteadBuilding {
  id: string; name: string; emoji: string; maxLevel: number;
  costWood: number; costStone: number; costGold: number;
  effect: string; effectPerLevel: string;
  reqTier?: number;
}
export const SHELTER_BUILDINGS: HomesteadBuilding[] = [
  { id:'shelter', name:'庇护所', emoji:'🏠', maxLevel:10, costWood:30, costStone:0, costGold:0, effect:'最大HP', effectPerLevel:'+10 HP' },
  { id:'farm', name:'农田', emoji:'🌾', maxLevel:10, costWood:30, costStone:0, costGold:0, effect:'金币产量', effectPerLevel:'+3金/分钟' },
  { id:'lumbermill', name:'伐木场', emoji:'🪓', maxLevel:5, costWood:50, costStone:0, costGold:0, effect:'伐木时间', effectPerLevel:'-3%' },
  { id:'mine', name:'矿场', emoji:'⛏️', maxLevel:5, costWood:0, costStone:100, costGold:0, effect:'采矿时间', effectPerLevel:'-3%' },
  { id:'workshop', name:'工坊', emoji:'🔨', maxLevel:5, costWood:200, costStone:100, costGold:0, effect:'制作时间', effectPerLevel:'-3%' },
  { id:'wall', name:'围墙', emoji:'🛡️', maxLevel:10, costWood:150, costStone:50, costGold:0, effect:'防御', effectPerLevel:'+3' },
  { id:'warehouse', name:'仓库', emoji:'📦', maxLevel:5, costWood:200, costStone:100, costGold:0, effect:'背包容量', effectPerLevel:'+2格' },
  { id:'clinic', name:'医疗站', emoji:'🏥', maxLevel:5, costWood:300, costStone:100, costGold:0, effect:'生命回复', effectPerLevel:'+1/回合' },
  { id:'altar', name:'神秘祭坛', emoji:'🔮', maxLevel:3, costWood:0, costStone:100, costGold:500, effect:'神话掉率', effectPerLevel:'+3%' },
  { id:'tower', name:'瞭望塔', emoji:'🗼', maxLevel:5, costWood:0, costStone:400, costGold:0, effect:'战斗经验', effectPerLevel:'+4%' },
  { id:'furnace', name:'火炉', emoji:'🔥', maxLevel:5, costWood:20, costStone:20, costGold:0, effect:'温度衰减', effectPerLevel:'-15% 衰减速度' },
  { id:'recycling', name:'废品回收站', emoji:'♻️', maxLevel:3, costWood:0, costStone:200, costGold:2000, effect:'传奇萃取槽', effectPerLevel:'+1 槽位', reqTier:2 },
  { id:'radlab', name:'辐射实验室', emoji:'☢️', maxLevel:3, costWood:0, costStone:400, costGold:5000, effect:'辐射成功率', effectPerLevel:'+5% 正面概率', reqTier:3 },
  { id:'wonder_corpse', name:'尸山', emoji:'💀', maxLevel:1, costWood:0, costStone:500, costGold:10000, effect:'非Boss敌人HP', effectPerLevel:'-5%', reqTier:2 },
  { id:'wonder_beacon', name:'辐射灯塔', emoji:'🗼', maxLevel:1, costWood:300, costStone:300, costGold:8000, effect:'副本Boss伤害', effectPerLevel:'-8%', reqTier:2 },
  { id:'wonder_radio', name:'废土广播塔', emoji:'📡', maxLevel:1, costWood:200, costStone:500, costGold:6000, effect:'NPC来访频率', effectPerLevel:'+30%', reqTier:3 },
  { id:'wonder_greenhouse', name:'地下温室', emoji:'🌿', maxLevel:1, costWood:500, costStone:200, costGold:5000, effect:'农田产量', effectPerLevel:'+40%', reqTier:1 },
  { id:'wonder_furnace', name:'废铁熔炉', emoji:'🔥', maxLevel:1, costWood:100, costStone:400, costGold:7000, effect:'分解金币', effectPerLevel:'+25%', reqTier:1 },
];

// ─── Cooking & Alchemy ─────────────────────────────────────────────────────────
export const WOODCUTTING_BERRY_DROPS: { woodTier: number; berryId: string; name: string; emoji: string; chance: number }[] = [
  { woodTier:0, berryId:'blueberry', name:'蓝莓', emoji:'🫐', chance:0.25 },
  { woodTier:1, berryId:'raspberry', name:'树莓', emoji:'🍇', chance:0.22 },
  { woodTier:2, berryId:'elderberry', name:'接骨木莓', emoji:'🫛', chance:0.20 },
  { woodTier:3, berryId:'blackberry', name:'黑莓', emoji:'🍇', chance:0.18 },
  { woodTier:4, berryId:'goji', name:'枸杞', emoji:'🔴', chance:0.16 },
  { woodTier:5, berryId:'nightberry', name:'夜光莓', emoji:'🌙', chance:0.15 },
  { woodTier:5, berryId:'moonberry', name:'月光莓', emoji:'🌝', chance:0.08 },
  { woodTier:6, berryId:'magicberry', name:'魔法莓', emoji:'✨', chance:0.14 },
  { woodTier:7, berryId:'ancientberry', name:'远古莓', emoji:'🍇', chance:0.13 },
  { woodTier:8, berryId:'cranberry', name:'蔓越莓', emoji:'🍒', chance:0.12 },
  { woodTier:8, berryId:'sunberry', name:'日光莓', emoji:'☀️', chance:0.06 },
  { woodTier:9, berryId:'spiritberry', name:'灵魂莓', emoji:'👻', chance:0.10 },
  { woodTier:9, berryId:'dragonblood', name:'龙血果', emoji:'🩸', chance:0.05 },
];
export const HUNTING_HERB_DROPS: { hideTier: number; herbId: string; name: string; emoji: string; chance: number }[] = [
  { hideTier:0, herbId:'dandelion', name:'蒲公英', emoji:'🌼', chance:0.30 },
  { hideTier:1, herbId:'mint', name:'薄荷', emoji:'🌿', chance:0.28 },
  { hideTier:2, herbId:'rosemary', name:'迷迭香', emoji:'🌿', chance:0.25 },
  { hideTier:3, herbId:'marigold', name:'金盏花', emoji:'🌻', chance:0.22 },
  { hideTier:4, herbId:'ginseng', name:'人参', emoji:'🥕', chance:0.20 },
  { hideTier:5, herbId:'lingzhi', name:'灵芝', emoji:'🍄', chance:0.18 },
  { hideTier:6, herbId:'thyme', name:'百里香', emoji:'🌿', chance:0.16 },
  { hideTier:7, herbId:'dragonherb', name:'龙骨草', emoji:'🐉', chance:0.14 },
  { hideTier:8, herbId:'dragonblood', name:'龙血草', emoji:'🩸', chance:0.12 },
  { hideTier:9, herbId:'phoenix_flower', name:'凤凰花', emoji:'🔥', chance:0.10 },
];
// ─── Cooking = instant HP recovery (1 ingredient → HP restore) ─────────────────
export const COOKING_RECIPES: { id:string;name:string;emoji:string;inputs:{resource:string;qty:number}[];effect:string;hpRestore:number }[] = [
  { id:'grilled_rat', name:'烤鼠肉串', emoji:'🍢', inputs:[{resource:'meat_0',qty:1}], effect:'回复50HP', hpRestore:50 },
  { id:'roast_rabbit', name:'烤兔腿', emoji:'🍗', inputs:[{resource:'meat_1',qty:1}], effect:'回复100HP', hpRestore:100 },
  { id:'lizard_steak', name:'蜥蜴肉排', emoji:'🥩', inputs:[{resource:'meat_2',qty:1}], effect:'回复150HP', hpRestore:150 },
  { id:'dog_jerky', name:'疯犬肉干', emoji:'🥓', inputs:[{resource:'meat_3',qty:1}], effect:'回复200HP', hpRestore:200 },
  { id:'boar_chop', name:'猪排', emoji:'🍖', inputs:[{resource:'meat_4',qty:1}], effect:'回复250HP', hpRestore:250 },
  { id:'deer_roast', name:'烤鹿肉', emoji:'🍗', inputs:[{resource:'meat_5',qty:1}], effect:'回复300HP', hpRestore:300 },
  { id:'bear_ribs', name:'熊肋排', emoji:'🦴', inputs:[{resource:'meat_6',qty:1}], effect:'回复350HP', hpRestore:350 },
  { id:'scorpion_tail', name:'炸蝎尾', emoji:'🦂', inputs:[{resource:'meat_7',qty:1}], effect:'回复400HP', hpRestore:400 },
  { id:'deathclaw_steak', name:'死亡爪排', emoji:'🥩', inputs:[{resource:'meat_8',qty:1}], effect:'回复450HP', hpRestore:450 },
  { id:'behemoth_fillet', name:'巨兽肉片', emoji:'🍖', inputs:[{resource:'meat_9',qty:1}], effect:'回复500HP', hpRestore:500 },
  { id:'grilled_tadpole', name:'烤蝌蚪', emoji:'🐟', inputs:[{resource:'fish_0',qty:1}], effect:'回复75HP', hpRestore:75 },
  { id:'smoked_eel', name:'熏鳗鱼', emoji:'🐟', inputs:[{resource:'fish_1',qty:1}], effect:'回复125HP', hpRestore:125 },
  { id:'fried_fin', name:'炸鱼鳍', emoji:'🐟', inputs:[{resource:'fish_2',qty:1}], effect:'回复175HP', hpRestore:175 },
  { id:'catfish_grill', name:'烤鲶鱼', emoji:'🐟', inputs:[{resource:'fish_4',qty:1}], effect:'回复225HP', hpRestore:225 },
  { id:'eel_kabob', name:'鳗鱼串', emoji:'🐟', inputs:[{resource:'fish_5',qty:1}], effect:'回复275HP', hpRestore:275 },
  { id:'armorfish_soup', name:'铁甲鱼汤', emoji:'🍲', inputs:[{resource:'fish_6',qty:1}], effect:'回复325HP', hpRestore:325 },
  { id:'shark_fin', name:'鲨鱼翅', emoji:'🦈', inputs:[{resource:'fish_7',qty:1}], effect:'回复375HP', hpRestore:375 },
  { id:'abyss_roast', name:'深渊烤鱼', emoji:'🐙', inputs:[{resource:'fish_8',qty:1}], effect:'回复425HP', hpRestore:425 },
  { id:'whale_steak', name:'巨鲸排', emoji:'🐋', inputs:[{resource:'fish_9',qty:1}], effect:'回复500HP', hpRestore:500 },
];

// ─── Alchemy = buff potions (all duration-based) ───────────────────────────────
export const POTION_RECIPES: { id:string;name:string;emoji:string;inputs:{resource:string;qty:number}[];effect:string;durationMin:number }[] = [
  { id:'berry_juice', name:'浆果汁', emoji:'🧃', inputs:[{resource:'blueberry',qty:3},{resource:'raspberry',qty:2}], effect:'+10%全局经验', durationMin:30 },
  { id:'strength_potion', name:'力量药水', emoji:'💪', inputs:[{resource:'rosemary',qty:3},{resource:'ginseng',qty:1}], effect:'+25%攻击力', durationMin:30 },
  { id:'iron_potion', name:'铁皮药水', emoji:'🛡️', inputs:[{resource:'marigold',qty:3},{resource:'thyme',qty:2}], effect:'+25%防御力', durationMin:30 },
  { id:'speed_potion', name:'速度药水', emoji:'⚡', inputs:[{resource:'mint',qty:4},{resource:'rosemary',qty:1}], effect:'+20%采集速度', durationMin:30 },
  { id:'luck_potion', name:'幸运药水', emoji:'🍀', inputs:[{resource:'marigold',qty:3},{resource:'lingzhi',qty:2}], effect:'+15%掉率', durationMin:45 },
  { id:'crit_potion', name:'精准药水', emoji:'🎯', inputs:[{resource:'thyme',qty:3},{resource:'dragonherb',qty:1}], effect:'+15%暴击率', durationMin:30 },
  { id:'leech_potion', name:'吸血药水', emoji:'🩸', inputs:[{resource:'dragonblood',qty:2},{resource:'dragonherb',qty:1}], effect:'+10%吸血', durationMin:30 },
  { id:'mercury_elixir', name:'深海灵药', emoji:'🌊', inputs:[{resource:'fish_5',qty:3},{resource:'dragonherb',qty:2}], effect:'+30%钓鱼速度', durationMin:45 },
  { id:'combat_stim', name:'战斗兴奋剂', emoji:'💉', inputs:[{resource:'ginseng',qty:3},{resource:'dandelion',qty:2}], effect:'+30%战斗经验', durationMin:60 },
  { id:'woodcutter_brew', name:'伐木工酿', emoji:'🪓', inputs:[{resource:'goji',qty:3},{resource:'thyme',qty:2}], effect:'-15%伐木时间', durationMin:45 },
  { id:'miner_brew', name:'矿工酿', emoji:'⛏️', inputs:[{resource:'elderberry',qty:3},{resource:'marigold',qty:2}], effect:'-15%采矿时间', durationMin:45 },
  { id:'hunter_brew', name:'猎手酿', emoji:'🏹', inputs:[{resource:'blackberry',qty:3},{resource:'lingzhi',qty:2}], effect:'-15%狩猎时间', durationMin:45 },
  { id:'dragon_elixir', name:'龙息灵药', emoji:'🐲', inputs:[{resource:'dragonblood',qty:2},{resource:'spiritberry',qty:2}], effect:'+10%全属性', durationMin:120 },
  { id:'feast_of_the_deep', name:'深渊盛宴', emoji:'🦑', inputs:[{resource:'fish_8',qty:3},{resource:'dragonblood',qty:1},{resource:'nightberry',qty:2}], effect:'+20%全属性 +10%掉率', durationMin:120 },
  { id:'magic_brew', name:'魔莓酿', emoji:'🍷', inputs:[{resource:'nightberry',qty:3},{resource:'magicberry',qty:2}], effect:'+25%元素伤害', durationMin:45 },
  { id:'ancient_elixir', name:'远古灵药', emoji:'🧪', inputs:[{resource:'ancientberry',qty:2},{resource:'cranberry',qty:2},{resource:'dragonblood',qty:1}], effect:'+30%全经验获取', durationMin:60 },
];
// ═══════════════════════ Achievements (Melvor-style) ════════════════════════════
// type: 'kill' = kill specific enemy, 'skill' = reach skill level, 'dungeon' = clear dungeon
// target: enemy id / skill xp key / dungeon index
// reward: pet id to grant on claim
export const ACHIEVEMENTS: { id:string;name:string;desc:string;type:'kill'|'dungeon'|'skill';target:string;count:number;reward:string }[] = [
  // ── Skill milestones (Lv 20 & Lv 50 & Lv 99) ───────────────────────────
  // Gathering
  { id:'skill_wood_20',  name:'伐木新手',  desc:'伐木达到20级',  type:'skill',target:'woodcuttingXp',count:20, reward:'pet_beaver' },
  { id:'skill_wood_60',  name:'伐木大师',  desc:'伐木达到60级',  type:'skill',target:'woodcuttingXp',count:60, reward:'pet_ent' },
  { id:'skill_wood_99',  name:'伐木传奇',  desc:'伐木达到99级',  type:'skill',target:'woodcuttingXp',count:99, reward:'' },
  { id:'skill_mine_20',  name:'采矿新手',  desc:'采矿达到20级',  type:'skill',target:'miningXp',     count:20, reward:'pet_mole' },
  { id:'skill_mine_60',  name:'采矿大师',  desc:'采矿达到60级',  type:'skill',target:'miningXp',     count:60, reward:'pet_golem' },
  { id:'skill_mine_99',  name:'采矿传奇',  desc:'采矿达到99级',  type:'skill',target:'miningXp',     count:99, reward:'' },
  { id:'skill_smelt_20', name:'冶炼新手',  desc:'冶炼达到20级',  type:'skill',target:'smeltingXp',   count:20, reward:'pet_salamander' },
  { id:'skill_smelt_60', name:'冶炼大师',  desc:'冶炼达到60级',  type:'skill',target:'smeltingXp',   count:60, reward:'pet_phoenix' },
  { id:'skill_fish_20',  name:'钓鱼新手',  desc:'钓鱼达到20级',  type:'skill',target:'fishingXp',    count:20, reward:'pet_pelican' },
  { id:'skill_fish_60',  name:'钓鱼大师',  desc:'钓鱼达到60级',  type:'skill',target:'fishingXp',    count:60, reward:'pet_shark' },
  { id:'skill_hunt_20',  name:'狩猎新手',  desc:'狩猎达到20级',  type:'skill',target:'huntingXp',    count:20, reward:'pet_wolf' },
  { id:'skill_hunt_60',  name:'狩猎大师',  desc:'狩猎达到60级',  type:'skill',target:'huntingXp',    count:60, reward:'pet_falcon' },
  { id:'skill_thief_20', name:'搜刮新手',  desc:'搜刮达到20级',  type:'skill',target:'thievingXp',   count:20, reward:'pet_raccoon' },
  { id:'skill_thief_60', name:'搜刮大师',  desc:'搜刮达到60级',  type:'skill',target:'thievingXp',   count:60, reward:'pet_fox' },
  { id:'skill_agile_20', name:'敏捷新手',  desc:'敏捷达到20级',  type:'skill',target:'agilityXp',    count:20, reward:'pet_monkey' },
  { id:'skill_agile_60', name:'敏捷大师',  desc:'敏捷达到60级',  type:'skill',target:'agilityXp',    count:60, reward:'pet_cheetah' },
  { id:'skill_explore_20',name:'探索新手', desc:'探索达到20级',  type:'skill',target:'explorationXp',count:20, reward:'pet_eagle' },
  { id:'skill_explore_60',name:'探索大师', desc:'探索达到60级',  type:'skill',target:'explorationXp',count:60, reward:'pet_owl' },
  // Production
  { id:'skill_smith_20', name:'锻造新手',  desc:'锻造达到20级',  type:'skill',target:'smithingXp',   count:20, reward:'pet_anvil' },
  { id:'skill_smith_60', name:'锻造大师',  desc:'锻造达到60级',  type:'skill',target:'smithingXp',   count:60, reward:'pet_dragon' },
  { id:'skill_leather_20',name:'皮革新手', desc:'皮革制作20级',  type:'skill',target:'leatherworkingXp',count:20,reward:'pet_deer' },
  { id:'skill_leather_60',name:'皮革大师', desc:'皮革制作60级',  type:'skill',target:'leatherworkingXp',count:60,reward:'pet_bear' },
  { id:'skill_jewel_20', name:'珠宝新手',  desc:'珠宝制作20级',  type:'skill',target:'jewelcraftingXp',count:20,reward:'pet_magpie' },
  { id:'skill_jewel_60', name:'珠宝大师',  desc:'珠宝制作60级',  type:'skill',target:'jewelcraftingXp',count:60,reward:'pet_dragonfly' },
  // Combat
  { id:'skill_att_20',   name:'攻击新手',  desc:'攻击达到20级',  type:'skill',target:'attackXp',     count:20, reward:'pet_tiger' },
  { id:'skill_att_60',   name:'攻击大师',  desc:'攻击达到60级',  type:'skill',target:'attackXp',     count:60, reward:'pet_lion' },
  { id:'skill_def_20',   name:'防御新手',  desc:'防御达到20级',  type:'skill',target:'defenceXp',    count:20, reward:'pet_tortoise' },
  { id:'skill_def_60',   name:'防御大师',  desc:'防御达到60级',  type:'skill',target:'defenceXp',    count:60, reward:'pet_rhino' },
  { id:'skill_hp_20',    name:'生命新手',  desc:'生命达到20级',  type:'skill',target:'hitpointsXp',  count:20, reward:'pet_boar' },
  { id:'skill_hp_60',    name:'生命大师',  desc:'生命达到60级',  type:'skill',target:'hitpointsXp',  count:60, reward:'pet_elephant' },
  { id:'skill_ranged_20',name:'远程新手',  desc:'远程达到20级',  type:'skill',target:'rangedXp',     count:20, reward:'pet_hawk' },
  { id:'skill_ranged_60',name:'远程大师',  desc:'远程达到60级',  type:'skill',target:'rangedXp',     count:60, reward:'pet_eagle_owl' },
  { id:'skill_magic_20', name:'魔法新手',  desc:'魔法达到20级',  type:'skill',target:'magicXp',      count:20, reward:'pet_imp' },
  { id:'skill_magic_60', name:'魔法大师',  desc:'魔法达到60级',  type:'skill',target:'magicXp',      count:60, reward:'pet_wisp' },
  // Support
  { id:'skill_cook_20',  name:'烹饪新手',  desc:'烹饪达到20级',  type:'skill',target:'cookingXp',    count:20, reward:'pet_rat' },
  { id:'skill_cook_60',  name:'烹饪大师',  desc:'烹饪达到60级',  type:'skill',target:'cookingXp',    count:60, reward:'pet_pig' },
  { id:'skill_alch_20',  name:'炼金新手',  desc:'炼金达到20级',  type:'skill',target:'alchemyXp',    count:20, reward:'pet_snake' },
  { id:'skill_alch_60',  name:'炼金大师',  desc:'炼金达到60级',  type:'skill',target:'alchemyXp',    count:60, reward:'pet_slime' },
  { id:'skill_pray_20',  name:'祷言新手',  desc:'祷言达到20级',  type:'skill',target:'prayerXp',     count:20, reward:'pet_dove' },
  { id:'skill_pray_60',  name:'祷言大师',  desc:'祷言达到60级',  type:'skill',target:'prayerXp',     count:60, reward:'pet_angel' },

  // ── Enemy kill milestones (10 / 100 kills) ──────────────────────────────
  { id:'kill_rad_roach_10',    name:'害虫克星',   desc:'击杀10只变异蟑螂',   type:'kill',target:'rad_roach',     count:10,  reward:'pet_scorpion' },
  { id:'kill_rad_roach_100',   name:'灭虫专家',   desc:'击杀100只变异蟑螂',  type:'kill',target:'rad_roach',     count:100, reward:'pet_ant' },
  { id:'kill_rad_rat_10',      name:'灭鼠能手',   desc:'击杀10只辐射鼠',     type:'kill',target:'rad_rat',       count:10,  reward:'pet_mouse' },
  { id:'kill_rad_rat_100',     name:'鼠患终结者', desc:'击杀100只辐射鼠',    type:'kill',target:'rad_rat',       count:100, reward:'pet_rat_king' },
  { id:'kill_stray_dog_10',    name:'流浪动物救助',desc:'击杀10只流浪犬',    type:'kill',target:'stray_dog',     count:10,  reward:'pet_hyena' },
  { id:'kill_stray_dog_100',   name:'狗王猎手',   desc:'击杀100只流浪犬',    type:'kill',target:'stray_dog',     count:100, reward:'pet_wolf_dire' },
  { id:'kill_mutant_spider_10',name:'驱蛛人',     desc:'击杀10只变异蜘蛛',   type:'kill',target:'mutant_spider', count:10,  reward:'pet_tarantula' },
  { id:'kill_mutant_spider_100',name:'蜘蛛女王克星',desc:'击杀100只变异蜘蛛',type:'kill',target:'mutant_spider', count:100, reward:'pet_spider_queen' },
  { id:'kill_zombie_walk_10',  name:'丧尸杀手',   desc:'击杀10只蹒跚丧尸',   type:'kill',target:'zombie_walk',   count:10,  reward:'pet_zombie' },
  { id:'kill_zombie_walk_100', name:'亡灵天灾',   desc:'击杀100只蹒跚丧尸',  type:'kill',target:'zombie_walk',   count:100, reward:'pet_lich' },
  { id:'kill_rad_scorpion_10', name:'蝎子杀手',   desc:'击杀10只辐射蝎',     type:'kill',target:'rad_scorpion',  count:10,  reward:'pet_scorpion_king' },
  { id:'kill_rad_scorpion_100',name:'沙漠之王',   desc:'击杀100只辐射蝎',    type:'kill',target:'rad_scorpion',  count:100, reward:'pet_scorpion_god' },
  { id:'kill_ghoul_flesh_10',  name:'食尸鬼猎人', desc:'击杀10只食尸鬼',     type:'kill',target:'ghoul_flesh',   count:10,  reward:'pet_ghost' },
  { id:'kill_ghoul_flesh_100', name:'亡灵克星',   desc:'击杀100只食尸鬼',    type:'kill',target:'ghoul_flesh',   count:100, reward:'pet_wraith' },
  { id:'kill_mutant_hound_10', name:'猎犬训练师', desc:'击杀10只变异猎犬',   type:'kill',target:'mutant_hound',  count:10,  reward:'pet_hellhound' },
  { id:'kill_mutant_hound_100',name:'犬王',       desc:'击杀100只变异猎犬',  type:'kill',target:'mutant_hound',  count:100, reward:'pet_cerberus' },
  { id:'kill_bandit_scav_10',  name:'治安官',     desc:'击杀10名废土拾荒者', type:'kill',target:'bandit_scav',   count:10,  reward:'pet_bandit' },
  { id:'kill_bandit_scav_100', name:'荒野警长',   desc:'击杀100名废土拾荒者',type:'kill',target:'bandit_scav',   count:100, reward:'pet_outlaw' },
  { id:'kill_rad_elemental_10',name:'元素使',     desc:'击杀10只辐射元素',   type:'kill',target:'rad_elemental', count:10,  reward:'pet_elemental' },
  { id:'kill_rad_elemental_100',name:'元素领主',  desc:'击杀100只辐射元素',  type:'kill',target:'rad_elemental', count:100, reward:'pet_elemental_lord' },
  { id:'kill_mutant_bear_10',  name:'猎熊人',     desc:'击杀10只变异熊',     type:'kill',target:'mutant_bear',   count:10,  reward:'pet_bear_cub' },
  { id:'kill_mutant_bear_100', name:'巨熊杀手',   desc:'击杀100只变异熊',    type:'kill',target:'mutant_bear',   count:100, reward:'pet_bear_grizzly' },
  { id:'kill_zombie_brute_10', name:'巨人杀手',   desc:'击杀10只壮硕丧尸',   type:'kill',target:'zombie_brute',  count:10,  reward:'pet_ogre' },
  { id:'kill_zombie_brute_100',name:'屠魔勇士',   desc:'击杀100只壮硕丧尸',  type:'kill',target:'zombie_brute',  count:100, reward:'pet_titan' },
  { id:'kill_wasteland_raider_10',name:'废土游侠',desc:'击杀10名废土掠夺者', type:'kill',target:'wasteland_raider',count:10,reward:'pet_raider' },
  { id:'kill_wasteland_raider_100',name:'废土霸主',desc:'击杀100名废土掠夺者',type:'kill',target:'wasteland_raider',count:100,reward:'pet_warlord' },
  { id:'kill_sentry_bot_10',  name:'技工',       desc:'击杀10台哨卫机器人',  type:'kill',target:'sentry_bot',    count:10,  reward:'pet_drone' },
  { id:'kill_sentry_bot_100', name:'机械师',     desc:'击杀100台哨卫机器人', type:'kill',target:'sentry_bot',    count:100, reward:'pet_mech' },
  { id:'kill_rad_drake_10',   name:'屠龙者',     desc:'击杀10只辐射亚龙',    type:'kill',target:'rad_drake',     count:10,  reward:'pet_drake' },
  { id:'kill_rad_drake_100',  name:'龙骑士',     desc:'击杀100只辐射亚龙',   type:'kill',target:'rad_drake',     count:100, reward:'pet_wyvern' },
  { id:'kill_deathclaw_10',   name:'死亡爪猎手', desc:'击杀10只死亡爪',      type:'kill',target:'deathclaw',     count:10,  reward:'pet_raptor' },
  { id:'kill_deathclaw_100',  name:'传奇猎人',   desc:'击杀100只死亡爪',     type:'kill',target:'deathclaw',     count:100, reward:'pet_rex' },
  { id:'kill_ancient_wraith_10',name:'灵魂收割者',desc:'击杀10只远古幽魂',   type:'kill',target:'ancient_wraith',count:10,  reward:'pet_spectre' },
  { id:'kill_ancient_wraith_100',name:'冥界之王',desc:'击杀100只远古幽魂',   type:'kill',target:'ancient_wraith',count:100,reward:'pet_reaper' },
  { id:'kill_warlord_10',     name:'挑战者',     desc:'击杀10名废土军阀',    type:'kill',target:'warlord',       count:10,  reward:'pet_knight' },
  { id:'kill_warlord_100',    name:'征服者',     desc:'击杀100名废土军阀',   type:'kill',target:'warlord',       count:100, reward:'pet_paladin' },

  // ── Dungeon milestones ──────────────────────────────────────────────────
  { id:'dungeon_0_1',  name:'深入矿穴',   desc:'通关腐化矿穴1次',  type:'dungeon',target:'0',count:1,  reward:'pet_bat' },
  { id:'dungeon_0_10', name:'矿穴常客',   desc:'通关腐化矿穴10次', type:'dungeon',target:'0',count:10, reward:'pet_cave_spider' },
  { id:'dungeon_1_1',  name:'迷宫探险家', desc:'通关幽影迷宫1次',  type:'dungeon',target:'1',count:1,  reward:'pet_shade' },
  { id:'dungeon_1_10', name:'迷宫征服者', desc:'通关幽影迷宫10次', type:'dungeon',target:'1',count:10, reward:'pet_shadow' },
  { id:'dungeon_2_1',  name:'火焰行者',   desc:'通关裂焰神殿1次',  type:'dungeon',target:'2',count:1,  reward:'pet_ember' },
  { id:'dungeon_2_10', name:'火神眷顾',   desc:'通关裂焰神殿10次', type:'dungeon',target:'2',count:10, reward:'pet_ifrit' },
  { id:'dungeon_3_1',  name:'虚空行者',   desc:'通关虚空要塞1次',  type:'dungeon',target:'3',count:1,  reward:'pet_voidling' },
  { id:'dungeon_3_10', name:'虚空领主',   desc:'通关虚空要塞10次', type:'dungeon',target:'3',count:10, reward:'pet_voidlord' },
  { id:'dungeon_4_1',  name:'龙墓探险家', desc:'通关龙冢秘境1次',  type:'dungeon',target:'4',count:1,  reward:'pet_whelp' },
  { id:'dungeon_4_10', name:'龙墓霸主',   desc:'通关龙冢秘境10次', type:'dungeon',target:'4',count:10, reward:'pet_draconic' },
  { id:'dungeon_5_1',  name:'混沌探索者', desc:'通关混沌熔炉1次',  type:'dungeon',target:'5',count:1,  reward:'pet_chaos_spark' },
  { id:'dungeon_5_10', name:'混沌之主',   desc:'通关混沌熔炉10次', type:'dungeon',target:'5',count:10, reward:'pet_chaos_lord' },

  // ── Special milestones ──────────────────────────────────────────────────
  { id:'kill_total_100',  name:'百人斩',   desc:'累计击杀100个敌人',  type:'kill',target:'_total', count:100,  reward:'pet_skeleton' },
  { id:'kill_total_1000', name:'千人斩',   desc:'累计击杀1000个敌人', type:'kill',target:'_total', count:1000, reward:'pet_reaver' },
  { id:'kill_total_5000', name:'万人屠',   desc:'累计击杀5000个敌人', type:'kill',target:'_total', count:5000, reward:'pet_death_knight' },
];

// ═══════════════════════ Pets (Melvor-style) ═══════════════════════════════════
export const PETS: { id:string;name:string;nameEn:string;emoji:string;achievement:string;buff:string;buffDesc:string;buffDescEn:string }[] = [
  // Skill pets
  { id:'pet_beaver',     name:'河狸',   nameEn:'Beaver',   emoji:'🦫', achievement:'skill_wood_20',  buff:'woodSpeed',  buffDesc:'-5%伐木时间',    buffDescEn:'-5% Woodcutting Time' },
  { id:'pet_ent',        name:'树精',   nameEn:'Ent',      emoji:'🌳', achievement:'skill_wood_60',  buff:'woodSpeed',  buffDesc:'-10%伐木时间',   buffDescEn:'-10% Woodcutting Time' },
  { id:'pet_mole',       name:'鼹鼠',   nameEn:'Mole',     emoji:'🐹', achievement:'skill_mine_20',  buff:'mineSpeed',  buffDesc:'-5%采矿时间',    buffDescEn:'-5% Mining Time' },
  { id:'pet_golem',      name:'石魔像', nameEn:'Golem',    emoji:'🗿', achievement:'skill_mine_60',  buff:'mineSpeed',  buffDesc:'-10%采矿时间',   buffDescEn:'-10% Mining Time' },
  { id:'pet_salamander', name:'火蜥蜴', nameEn:'Salamander',emoji:'🦎', achievement:'skill_smelt_20', buff:'smeltSpeed', buffDesc:'-5%冶炼时间',    buffDescEn:'-5% Smelting Time' },
  { id:'pet_phoenix',    name:'凤凰',   nameEn:'Phoenix',  emoji:'🔥', achievement:'skill_smelt_60', buff:'smeltSpeed', buffDesc:'-10%冶炼时间',   buffDescEn:'-10% Smelting Time' },
  { id:'pet_pelican',    name:'鹈鹕',   nameEn:'Pelican',  emoji:'🦤', achievement:'skill_fish_20',  buff:'fishSpeed',  buffDesc:'-5%钓鱼时间',    buffDescEn:'-5% Fishing Time' },
  { id:'pet_shark',      name:'鲨鱼',   nameEn:'Shark',    emoji:'🦈', achievement:'skill_fish_60',  buff:'fishSpeed',  buffDesc:'-10%钓鱼时间',   buffDescEn:'-10% Fishing Time' },
  { id:'pet_wolf',       name:'狼',     nameEn:'Wolf',     emoji:'🐺', achievement:'skill_hunt_20',  buff:'huntSpeed',  buffDesc:'-5%狩猎时间',    buffDescEn:'-5% Hunting Time' },
  { id:'pet_falcon',     name:'猎鹰',   nameEn:'Falcon',   emoji:'🦅', achievement:'skill_hunt_60',  buff:'huntSpeed',  buffDesc:'-10%狩猎时间',   buffDescEn:'-10% Hunting Time' },
  { id:'pet_raccoon',    name:'浣熊',   nameEn:'Raccoon',  emoji:'🦝', achievement:'skill_thief_20', buff:'thiefRate',  buffDesc:'+5%偷窃成功率',  buffDescEn:'+5% Thieving Success' },
  { id:'pet_fox',        name:'狐狸',   nameEn:'Fox',      emoji:'🦊', achievement:'skill_thief_60', buff:'thiefRate',  buffDesc:'+10%偷窃成功率', buffDescEn:'+10% Thieving Success' },
  { id:'pet_monkey',     name:'猴子',   nameEn:'Monkey',   emoji:'🐒', achievement:'skill_agile_20', buff:'agileSpeed', buffDesc:'-5%敏捷时间',    buffDescEn:'-5% Agility Time' },
  { id:'pet_cheetah',    name:'猎豹',   nameEn:'Cheetah',  emoji:'🐆', achievement:'skill_agile_60', buff:'agileSpeed', buffDesc:'-10%敏捷时间',   buffDescEn:'-10% Agility Time' },
  { id:'pet_eagle',      name:'鹰',     nameEn:'Eagle',    emoji:'🦅', achievement:'skill_explore_20',buff:'exploreSpeed',buffDesc:'-5%探索时间',  buffDescEn:'-5% Exploration Time' },
  { id:'pet_owl',        name:'猫头鹰', nameEn:'Owl',      emoji:'🦉', achievement:'skill_explore_60',buff:'exploreSpeed',buffDesc:'-10%探索时间', buffDescEn:'-10% Exploration Time' },
  { id:'pet_anvil',      name:'铁砧精', nameEn:'Anvil Sprite',emoji:'⚒️', achievement:'skill_smith_20',buff:'smithSpeed',buffDesc:'-5%锻造时间',  buffDescEn:'-5% Smithing Time' },
  { id:'pet_dragon',     name:'小龙',   nameEn:'Drake',    emoji:'🐲', achievement:'skill_smith_60', buff:'smithSpeed',buffDesc:'-10%锻造时间', buffDescEn:'-10% Smithing Time' },
  { id:'pet_deer',       name:'鹿',     nameEn:'Deer',     emoji:'🦌', achievement:'skill_leather_20',buff:'leatherSpeed',buffDesc:'-5%皮革时间',buffDescEn:'-5% Leatherworking Time' },
  { id:'pet_bear',       name:'熊',     nameEn:'Bear',     emoji:'🐻', achievement:'skill_leather_60',buff:'leatherSpeed',buffDesc:'-10%皮革时间',buffDescEn:'-10% Leatherworking Time' },
  { id:'pet_magpie',     name:'喜鹊',   nameEn:'Magpie',   emoji:'🐦', achievement:'skill_jewel_20', buff:'jewelSpeed',buffDesc:'-5%珠宝时间',  buffDescEn:'-5% Jewelcrafting Time' },
  { id:'pet_dragonfly',  name:'蜻蜓',   nameEn:'Dragonfly',emoji:'🪰', achievement:'skill_jewel_60', buff:'jewelSpeed',buffDesc:'-10%珠宝时间', buffDescEn:'-10% Jewelcrafting Time' },
  { id:'pet_tiger',      name:'虎',     nameEn:'Tiger',    emoji:'🐯', achievement:'skill_att_20',   buff:'meleeDmg',  buffDesc:'+5%近战伤害',   buffDescEn:'+5% Melee Damage' },
  { id:'pet_lion',       name:'狮',     nameEn:'Lion',     emoji:'🦁', achievement:'skill_att_60',   buff:'meleeDmg',  buffDesc:'+10%近战伤害',  buffDescEn:'+10% Melee Damage' },
  { id:'pet_tortoise',   name:'龟',     nameEn:'Tortoise', emoji:'🐢', achievement:'skill_def_20',   buff:'defence',    buffDesc:'+5防御',         buffDescEn:'+5 Defence' },
  { id:'pet_rhino',      name:'犀牛',   nameEn:'Rhino',    emoji:'🦏', achievement:'skill_def_60',   buff:'defence',    buffDesc:'+10防御',        buffDescEn:'+10 Defence' },
  { id:'pet_boar',       name:'野猪',   nameEn:'Boar',     emoji:'🐗', achievement:'skill_hp_20',    buff:'maxHp',      buffDesc:'+20生命上限',    buffDescEn:'+20 Max HP' },
  { id:'pet_elephant',   name:'大象',   nameEn:'Elephant', emoji:'🐘', achievement:'skill_hp_60',    buff:'maxHp',      buffDesc:'+50生命上限',    buffDescEn:'+50 Max HP' },
  { id:'pet_hawk',       name:'隼',     nameEn:'Hawk',     emoji:'🦅', achievement:'skill_ranged_20',buff:'rangedDmg', buffDesc:'+5%远程伤害',   buffDescEn:'+5% Ranged Damage' },
  { id:'pet_eagle_owl',  name:'雕鸮',   nameEn:'Eagle Owl',emoji:'🦉', achievement:'skill_ranged_60',buff:'rangedDmg', buffDesc:'+10%远程伤害',  buffDescEn:'+10% Ranged Damage' },
  { id:'pet_imp',        name:'辐射蝠', nameEn:'Rad Bat',   emoji:'🦇', achievement:'skill_magic_20', buff:'magicDmg',  buffDesc:'+5%能量伤害',   buffDescEn:'+5% Energy Damage' },
  { id:'pet_wisp',       name:'荧光蛾', nameEn:'Glow Moth', emoji:'🦋', achievement:'skill_magic_60', buff:'magicDmg',  buffDesc:'+10%能量伤害',  buffDescEn:'+10% Energy Damage' },
  { id:'pet_rat',        name:'老鼠',   nameEn:'Rat',      emoji:'🐀', achievement:'skill_cook_20',  buff:'cookSpeed', buffDesc:'-5%烹饪时间',   buffDescEn:'-5% Cooking Time' },
  { id:'pet_pig',        name:'猪',     nameEn:'Pig',      emoji:'🐖', achievement:'skill_cook_60',  buff:'cookSpeed', buffDesc:'-10%烹饪时间',  buffDescEn:'-10% Cooking Time' },
  { id:'pet_snake',      name:'蛇',     nameEn:'Snake',    emoji:'🐍', achievement:'skill_alch_20',  buff:'alchSpeed', buffDesc:'-5%炼金时间',   buffDescEn:'-5% Alchemy Time' },
  { id:'pet_slime',      name:'史莱姆', nameEn:'Slime',    emoji:'🟢', achievement:'skill_alch_60',  buff:'alchSpeed', buffDesc:'-10%炼金时间',  buffDescEn:'-10% Alchemy Time' },
  { id:'pet_dove',       name:'鸽子',   nameEn:'Dove',     emoji:'🕊️', achievement:'skill_pray_20',  buff:'prayerXp',  buffDesc:'+10%祷言经验',  buffDescEn:'+10% Prayer XP' },
  { id:'pet_angel',      name:'无人机', nameEn:'Drone Buddy',emoji:'🛸', achievement:'skill_pray_60',  buff:'prayerXp',  buffDesc:'+25%祷言经验',  buffDescEn:'+25% Prayer XP' },
  // Combat pets
  { id:'pet_scorpion',   name:'蝎子',   nameEn:'Scorpion', emoji:'🦂', achievement:'kill_rad_roach_10',  buff:'critChance', buffDesc:'+2%暴击率', buffDescEn:'+2% Crit Chance' },
  { id:'pet_ant',        name:'蚂蚁',   nameEn:'Ant',      emoji:'🐜', achievement:'kill_rad_roach_100', buff:'goldDrop', buffDesc:'+5%瓶盖掉落',buffDescEn:'+5% Cap Drop' },
  { id:'pet_mouse',      name:'小鼠',   nameEn:'Mouse',    emoji:'🐭', achievement:'kill_rad_rat_10',    buff:'combatXp', buffDesc:'+3%战斗XP',buffDescEn:'+3% Combat XP' },
  { id:'pet_rat_king',   name:'鼠王',   nameEn:'Rat King', emoji:'👑', achievement:'kill_rad_rat_100',   buff:'combatXp', buffDesc:'+8%战斗XP',buffDescEn:'+8% Combat XP' },
  { id:'pet_hyena',      name:'鬣狗',   nameEn:'Hyena',    emoji:'🐕', achievement:'kill_stray_dog_10',  buff:'lifeLeech', buffDesc:'+2%吸血',  buffDescEn:'+2% Life Leech' },
  { id:'pet_wolf_dire',  name:'恐狼',   nameEn:'Dire Wolf',emoji:'🐺', achievement:'kill_stray_dog_100', buff:'lifeLeech', buffDesc:'+6%吸血',  buffDescEn:'+6% Life Leech' },
  { id:'pet_tarantula',  name:'狼蛛',   nameEn:'Tarantula',emoji:'🕷️', achievement:'kill_mutant_spider_10',buff:'poisonDmg',buffDesc:'+5%毒伤',  buffDescEn:'+5% Poison Damage' },
  { id:'pet_spider_queen',name:'蜘蛛女王',nameEn:'Spider Queen',emoji:'🕸️',achievement:'kill_mutant_spider_100',buff:'poisonDmg',buffDesc:'+12%毒伤',buffDescEn:'+12% Poison Damage' },
  { id:'pet_zombie',     name:'小丧尸', nameEn:'Zombie',   emoji:'🧟', achievement:'kill_zombie_walk_10', buff:'maxHp',  buffDesc:'+15生命', buffDescEn:'+15 Max HP' },
  { id:'pet_lich',       name:'辐化丧尸',nameEn:'Rad Zombie',emoji:'🧟', achievement:'kill_zombie_walk_100',buff:'maxHp',  buffDesc:'+40生命', buffDescEn:'+40 Max HP' },
  { id:'pet_scorpion_king',name:'蝎子王',nameEn:'Scorpion King',emoji:'🦂',achievement:'kill_rad_scorpion_10',buff:'thorns',buffDesc:'+3%荆棘',buffDescEn:'+3% Thorns' },
  { id:'pet_scorpion_god',name:'巨蝎王',  nameEn:'Scorpion King',emoji:'🦂',achievement:'kill_rad_scorpion_100',buff:'thorns',buffDesc:'+8%荆棘',buffDescEn:'+8% Thorns' },
  { id:'pet_ghost',      name:'辐射幻影',nameEn:'Rad Shade',emoji:'👻', achievement:'kill_ghoul_flesh_10',  buff:'dodge',    buffDesc:'+2%闪避',  buffDescEn:'+2% Dodge' },
  { id:'pet_wraith',     name:'变异怨魂',nameEn:'Mutant Soul',emoji:'💫', achievement:'kill_ghoul_flesh_100', buff:'dodge',    buffDesc:'+6%闪避',  buffDescEn:'+6% Dodge' },
  { id:'pet_hellhound',  name:'烈焰犬', nameEn:'Flame Hound',emoji:'🐕', achievement:'kill_mutant_hound_10',  buff:'fireDmg',  buffDesc:'+5%火焰伤害',buffDescEn:'+5% Fire Damage' },
  { id:'pet_cerberus',   name:'三头变异犬',nameEn:'Tri-Head Dog',emoji:'🐕',achievement:'kill_mutant_hound_100', buff:'fireDmg',buffDesc:'+12%火焰伤害',buffDescEn:'+12% Fire Damage' },
  { id:'pet_bandit',     name:'土匪',   nameEn:'Bandit',   emoji:'🥷', achievement:'kill_bandit_scav_10',  buff:'goldDrop', buffDesc:'+10%瓶盖',  buffDescEn:'+10% Caps' },
  { id:'pet_outlaw',     name:'亡命徒', nameEn:'Outlaw',   emoji:'🤠', achievement:'kill_bandit_scav_100', buff:'goldDrop',buffDesc:'+25%瓶盖',  buffDescEn:'+25% Caps' },
  { id:'pet_elemental',  name:'辐射尘暴',nameEn:'Rad Storm',emoji:'🌪️',achievement:'kill_rad_elemental_10',buff:'magicDmg',buffDesc:'+5%魔法伤害',buffDescEn:'+5% Magic Damage' },
  { id:'pet_elemental_lord',name:'辐射领主',nameEn:'Rad Lord',emoji:'☢️',achievement:'kill_rad_elemental_100',buff:'magicDmg',buffDesc:'+12%魔法伤害',buffDescEn:'+12% Magic Damage' },
  { id:'pet_bear_cub',   name:'小熊',   nameEn:'Bear Cub', emoji:'🐻', achievement:'kill_mutant_bear_10',  buff:'meleeDmg', buffDesc:'+5%近战伤害',buffDescEn:'+5% Melee Damage' },
  { id:'pet_bear_grizzly',name:'灰熊',  nameEn:'Grizzly',  emoji:'🐻', achievement:'kill_mutant_bear_100', buff:'meleeDmg',buffDesc:'+12%近战伤害',buffDescEn:'+12% Melee Damage' },
  { id:'pet_ogre',       name:'巨魔人', nameEn:'Brute',    emoji:'👹', achievement:'kill_zombie_brute_10', buff:'crushRate',buffDesc:'+3%碾压率',buffDescEn:'+3% Crush Rate' },
  { id:'pet_titan',      name:'巨像',   nameEn:'Colossus', emoji:'🗿', achievement:'kill_zombie_brute_100',buff:'crushRate',buffDesc:'+8%碾压率',buffDescEn:'+8% Crush Rate' },
  { id:'pet_raider',     name:'掠夺者', nameEn:'Raider',   emoji:'🏴', achievement:'kill_wasteland_raider_10',buff:'dropRate',buffDesc:'+5%掉率',buffDescEn:'+5% Drop Rate' },
  { id:'pet_warlord',    name:'军阀',   nameEn:'Warlord',  emoji:'⚔️', achievement:'kill_wasteland_raider_100',buff:'dropRate',buffDesc:'+12%掉率',buffDescEn:'+12% Drop Rate' },
  { id:'pet_drone',      name:'无人机', nameEn:'Drone',    emoji:'🛸', achievement:'kill_sentry_bot_10',   buff:'rangedDmg',buffDesc:'+5%远程伤害',buffDescEn:'+5% Ranged Damage' },
  { id:'pet_mech',       name:'机甲',   nameEn:'Mech',     emoji:'🤖', achievement:'kill_sentry_bot_100',  buff:'rangedDmg',buffDesc:'+12%远程伤害',buffDescEn:'+12% Ranged Damage' },
  { id:'pet_drake',      name:'幼龙',   nameEn:'Drake',    emoji:'🐉', achievement:'kill_rad_drake_10',    buff:'fireDmg',  buffDesc:'+5%火焰伤害',buffDescEn:'+5% Fire Damage' },
  { id:'pet_wyvern',     name:'双足飞龙',nameEn:'Wyvern',  emoji:'🐲', achievement:'kill_rad_drake_100',   buff:'fireDmg',  buffDesc:'+15%火焰伤害',buffDescEn:'+15% Fire Damage' },
  { id:'pet_raptor',     name:'迅猛龙', nameEn:'Raptor',   emoji:'🦖', achievement:'kill_deathclaw_10',    buff:'bleedDmg', buffDesc:'+5%流血伤害',buffDescEn:'+5% Bleed Damage' },
  { id:'pet_rex',        name:'霸王龙', nameEn:'Rex',      emoji:'🦖', achievement:'kill_deathclaw_100',   buff:'bleedDmg', buffDesc:'+15%流血伤害',buffDescEn:'+15% Bleed Damage' },
  { id:'pet_spectre',    name:'幽灵',   nameEn:'Spectre',  emoji:'👻', achievement:'kill_ancient_wraith_10',buff:'frostDmg',buffDesc:'+5%冰霜伤害',buffDescEn:'+5% Frost Damage' },
  { id:'pet_reaper',     name:'死神',   nameEn:'Reaper',   emoji:'💀', achievement:'kill_ancient_wraith_100',buff:'frostDmg',buffDesc:'+15%冰霜伤害',buffDescEn:'+15% Frost Damage' },
  { id:'pet_knight',     name:'重装兵', nameEn:'Heavy Trooper',emoji:'🛡️', achievement:'kill_warlord_10',      buff:'defence',  buffDesc:'+8防御', buffDescEn:'+8 Defence' },
  { id:'pet_paladin',    name:'精英守卫',nameEn:'Elite Guard',emoji:'🎖️', achievement:'kill_warlord_100',     buff:'defence',  buffDesc:'+20防御',buffDescEn:'+20 Defence' },
  // Dungeon pets
  { id:'pet_bat',        name:'蝙蝠',   nameEn:'Bat',      emoji:'🦇', achievement:'dungeon_0_1',  buff:'dungeonSpeed',buffDesc:'-5%副本时间',buffDescEn:'-5% Dungeon Time' },
  { id:'pet_cave_spider',name:'洞窟蜘蛛',nameEn:'Cave Spider',emoji:'🕷️',achievement:'dungeon_0_10',buff:'dungeonSpeed',buffDesc:'-10%副本时间',buffDescEn:'-10% Dungeon Time' },
  { id:'pet_shade',      name:'隧道漫步者',nameEn:'Tunnel Walker',emoji:'🚶', achievement:'dungeon_1_1',  buff:'shadowDmg', buffDesc:'+5%暗影伤害',buffDescEn:'+5% Shadow Damage' },
  { id:'pet_shadow',     name:'地铁幽灵',nameEn:'Metro Ghost',emoji:'👻', achievement:'dungeon_1_10', buff:'shadowDmg', buffDesc:'+12%暗影伤害',buffDescEn:'+12% Shadow Damage' },
  { id:'pet_ember',      name:'余烬',   nameEn:'Ember',    emoji:'🔥', achievement:'dungeon_2_1',  buff:'fireDmg',   buffDesc:'+8%火焰伤害',buffDescEn:'+8% Fire Damage' },
  { id:'pet_ifrit',      name:'燃烧者',  nameEn:'Burner',   emoji:'🔥', achievement:'dungeon_2_10', buff:'fireDmg',   buffDesc:'+18%火焰伤害',buffDescEn:'+18% Fire Damage' },
  { id:'pet_voidling',   name:'机械哨兵',nameEn:'Mech Sentry',emoji:'🤖', achievement:'dungeon_3_1',  buff:'voidDmg',   buffDesc:'+5%虚空伤害',buffDescEn:'+5% Void Damage' },
  { id:'pet_voidlord',   name:'钢铁巨人',nameEn:'Steel Giant',emoji:'🦾', achievement:'dungeon_3_10', buff:'voidDmg',   buffDesc:'+15%虚空伤害',buffDescEn:'+15% Void Damage' },
  { id:'pet_whelp',      name:'小变异体',nameEn:'Mutant Hatchling',emoji:'🐣', achievement:'dungeon_4_1',  buff:'dragonDmg', buffDesc:'+5%龙系伤害',buffDescEn:'+5% Dragon Damage' },
  { id:'pet_draconic',   name:'超级变异体',nameEn:'Super Mutant',emoji:'🦎', achievement:'dungeon_4_10', buff:'dragonDmg', buffDesc:'+15%龙系伤害',buffDescEn:'+15% Dragon Damage' },
  { id:'pet_chaos_spark',name:'核心火花',nameEn:'Core Spark',emoji:'⚡',achievement:'dungeon_5_1', buff:'chaosDmg',buffDesc:'+5%混沌伤害',buffDescEn:'+5% Chaos Damage' },
  { id:'pet_chaos_lord', name:'核心卫士',nameEn:'Core Guardian',emoji:'⚛️',achievement:'dungeon_5_10',buff:'chaosDmg',buffDesc:'+15%混沌伤害',buffDescEn:'+15% Chaos Damage' },
  // Special pets
  { id:'pet_skeleton',   name:'骷髅幸存者',nameEn:'Bone Survivor',emoji:'💀', achievement:'kill_total_100',  buff:'combatXp',  buffDesc:'+5%战斗XP',  buffDescEn:'+5% Combat XP' },
  { id:'pet_reaver',     name:'屠戮者', nameEn:'Slayer',   emoji:'⚔️', achievement:'kill_total_1000', buff:'combatXp',  buffDesc:'+12%战斗XP', buffDescEn:'+12% Combat XP' },
  { id:'pet_death_knight',name:'废土骑士',nameEn:'Wasteland Knight',emoji:'⚔️',achievement:'kill_total_5000',buff:'combatXp',buffDesc:'+25%战斗XP',buffDescEn:'+25% Combat XP' },
];

// ─── Combat Skills ─────────────────────────────────────────────────────
export interface CombatSkill {
  id:string;name:string;emoji:string;style:CombatStyle;class?:string;
  type:'nuke'|'aoe'|'dot'|'buff';dmgMul:number;dotTicks:number;
  cooldownSec:number;desc:string;
}
export const COMBAT_SKILLS: CombatSkill[] = [
  { id:'slam',name:'猛击',emoji:'💥',style:'melee',type:'nuke',dmgMul:1.5,dotTicks:0,cooldownSec:8,desc:'单体150%' },
  { id:'whirlwind',name:'旋风斩',emoji:'🌪️',style:'melee',type:'aoe',dmgMul:0.6,dotTicks:0,cooldownSec:12,desc:'群体60%' },
  { id:'rend',name:'撕裂',emoji:'🩸',style:'melee',type:'dot',dmgMul:0.15,dotTicks:3,cooldownSec:15,desc:'Dot15%×3' },
  { id:'snipe',name:'狙击',emoji:'🎯',style:'ranged',type:'nuke',dmgMul:1.8,dotTicks:0,cooldownSec:10,desc:'单体180%' },
  { id:'arrow_rain',name:'箭雨',emoji:'🏹',style:'ranged',type:'aoe',dmgMul:0.7,dotTicks:0,cooldownSec:12,desc:'群体70%' },
  { id:'poison_arrow',name:'毒箭',emoji:'☠️',style:'ranged',type:'dot',dmgMul:0.18,dotTicks:4,cooldownSec:14,desc:'Dot18%×4' },
  { id:'fireball',name:'火球',emoji:'🔥',style:'magic',type:'nuke',dmgMul:1.7,dotTicks:0,cooldownSec:8,desc:'单体170%' },
  { id:'blizzard',name:'冰风暴',emoji:'❄️',style:'magic',type:'aoe',dmgMul:0.65,dotTicks:0,cooldownSec:12,desc:'群体65%' },
  { id:'curse',name:'辐射标记',emoji:'☢️',style:'magic',type:'dot',dmgMul:0.15,dotTicks:3,cooldownSec:14,desc:'Dot15%×3' },
  { id:'holy_strike',name:'高压电击',emoji:'⚡',style:'melee',type:'nuke',class:'突击兵',dmgMul:2.0,dotTicks:0,cooldownSec:10,desc:'200%' },
  { id:'furious_slash',name:'狂暴斩',emoji:'💢',style:'melee',type:'nuke',class:'狂战士',dmgMul:2.5,dotTicks:0,cooldownSec:10,desc:'250%' },
  { id:'iaido',name:'精确打击',emoji:'⚔️',style:'melee',type:'nuke',class:'剑术大师',dmgMul:2.8,dotTicks:0,cooldownSec:12,desc:'280%' },
  { id:'assassinate',name:'暗杀',emoji:'🗡️',style:'ranged',type:'nuke',class:'渗透者',dmgMul:2.8,dotTicks:0,cooldownSec:14,desc:'280%' },
  { id:'power_shot',name:'强力射击',emoji:'🏹',style:'ranged',type:'nuke',class:'侦察兵',dmgMul:2.2,dotTicks:0,cooldownSec:9,desc:'220%' },
  { id:'piercing_shot',name:'穿甲弹',emoji:'🎯',style:'ranged',type:'nuke',class:'狙击手',dmgMul:2.4,dotTicks:0,cooldownSec:8,desc:'240%' },
  { id:'soul_drain',name:'能量吸取',emoji:'⚡',style:'magic',type:'nuke',class:'生化兵',dmgMul:2.1,dotTicks:0,cooldownSec:9,desc:'210%' },
  { id:'toxic_burst',name:'毒雾弹',emoji:'🧪',style:'magic',type:'nuke',class:'化学兵',dmgMul:2.0,dotTicks:0,cooldownSec:8,desc:'200%' },
  { id:'meteor_storm',name:'燃烧弹',emoji:'🔥',style:'magic',type:'nuke',class:'爆破手',dmgMul:2.5,dotTicks:0,cooldownSec:12,desc:'250%' },
];

// ─── Prayers moved to shared/game-data/prayers.ts — forwarded for backward compat
export { PRAYERS, getPrayerLevel, type Prayer } from "./game-data/prayers";

// ─── Town NPCs ────────────────────────────────────────────────────────────────
export interface TownNPC {
  id: string; name: string; emoji: string; desc: string;
  actions: { label: string; effect: string }[];
  reqTownLevel?: number;
  reqDungeon?: number;
}
export const TOWN_NPCS: TownNPC[] = [
  { id:'merchant', name:'废土商人', emoji:'🧳', desc:'推着破旧的手推车，在废土上兜售捡来的物资', reqTownLevel:3,
    actions:[
      { label:'购买装备 (500金)', effect:'随机获得一件稀有装备' },
      { label:'出售杂物', effect:'自动出售背包中普通品质以下物品' },
    ]},
  { id:'blacksmith', name:'武器匠', emoji:'⚒️', desc:'用废铁和零件打造和修理装备', reqTownLevel:5,
    actions:[
      { label:'强化武器 (300金)', effect:'武器ilvl+1' },
      { label:'修复装备', effect:'恢复所有装备耐久' },
    ]},
  { id:'traveler', name:'流浪幸存者', emoji:'🧭', desc:'从远方带来了救命的物资和消息', reqTownLevel:8,
    actions:[
      { label:'接受物资', effect:'获得金币+骨头+随机材料' },
      { label:'交换情报', effect:'获得大量经验' },
    ]},
  { id:'sage', name:'老幸存者', emoji:'🧙', desc:'在废土上活了大半辈子，懂得许多生存技巧', reqTownLevel:15,
    actions:[
      { label:'重置天赋 (免费)', effect:'重置所有天赋点' },
      { label:'学习生存技能', effect:'随机获得500技能经验' },
    ]},
  { id:'gambler', name:'拾荒赌徒', emoji:'🎲', desc:'用捡来的瓶盖和你赌装备', reqTownLevel:25, reqDungeon:2,
    actions:[
      { label:'普通拾荒 (50金/级)', effect:'随机普通~稀有装备' },
      { label:'稀有拾荒 (1000金/级)', effect:'随机稀有~传说装备' },
      { label:'传说拾荒 (10000金/级)', effect:'随机传说~神话装备' },
    ]},
];

// ─── NPC Companions (drop from combat) ────────────────────────────────────
export interface CompanionNPC {
  id: string; name: string; emoji: string; rarity: Rarity;
  dropChance: number; bonusType: string; bonusName: string; bonusRange: [number, number];
}
export const COMPANION_NPCS: CompanionNPC[] = [
  { id:'scavenger_c', name:'拾荒者',   emoji:'🧹', rarity:'common',    dropChance:0.08, bonusType:'gold',     bonusName:'金币加成',   bonusRange:[3,8] },
  { id:'guard_c',     name:'守卫',     emoji:'💂', rarity:'common',    dropChance:0.08, bonusType:'defence',  bonusName:'防御加成',   bonusRange:[3,8] },
  { id:'cook_c',      name:'厨子',     emoji:'👨‍🍳', rarity:'common',    dropChance:0.08, bonusType:'foodBuff', bonusName:'食物效果',   bonusRange:[5,12] },
  { id:'scavenger_u', name:'老拾荒者', emoji:'🧓', rarity:'uncommon',  dropChance:0.04, bonusType:'gold',     bonusName:'金币加成',   bonusRange:[8,18] },
  { id:'medic_u',     name:'战地医生', emoji:'👨‍⚕️', rarity:'uncommon',  dropChance:0.04, bonusType:'hpRegen',  bonusName:'生命回复',   bonusRange:[2,5] },
  { id:'engineer_u',  name:'工程师',   emoji:'👷', rarity:'uncommon',  dropChance:0.04, bonusType:'craftSpd', bonusName:'制作速度',   bonusRange:[5,15] },
  { id:'hunter_r',    name:'废土猎人', emoji:'🎯', rarity:'rare',      dropChance:0.02, bonusType:'combatXp', bonusName:'战斗经验',   bonusRange:[8,20] },
  { id:'surgeon_r',   name:'外科医生', emoji:'🧑‍⚕️', rarity:'rare',      dropChance:0.02, bonusType:'maxHp',    bonusName:'最大HP',     bonusRange:[10,25] },
  { id:'scout_r',     name:'侦察兵',   emoji:'🔭', rarity:'rare',      dropChance:0.02, bonusType:'dropRate', bonusName:'掉率加成',   bonusRange:[5,12] },
  { id:'veteran_e',   name:'老兵',     emoji:'🎖️', rarity:'epic',      dropChance:0.008,bonusType:'allCombat',bonusName:'全战斗属性', bonusRange:[8,15] },
  { id:'scientist_e', name:'科学家',   emoji:'🧑‍🔬', rarity:'epic',      dropChance:0.008,bonusType:'allSkill', bonusName:'全技能经验', bonusRange:[5,12] },
  { id:'warlord_l',   name:'废土军阀', emoji:'👑', rarity:'legendary', dropChance:0.003,bonusType:'all',      bonusName:'全属性',     bonusRange:[10,20] },
];

// ─── Bounty Board (daily quests) ────────────────────────────────────────
export type BountyType = 'kill' | 'gather' | 'craft';

export interface Bounty {
  id: string;
  type: BountyType;
  desc: string;
  target: string;
  count: number;
  rewardGold: number;
  rewardBones?: number;
  rewardBox?: 'common' | 'uncommon' | 'rare';
}

export const BOUNTIES: Bounty[] = [
  { id:'b_kill_roach',   type:'kill',   desc:'消灭 8 只变异蟑螂',     target:'rad_roach',      count:8,  rewardGold:200,  rewardBones:20 },
  { id:'b_kill_rat',     type:'kill',   desc:'消灭 6 只辐射鼠',       target:'rad_rat',        count:6,  rewardGold:300,  rewardBones:30 },
  { id:'b_kill_spider',  type:'kill',   desc:'消灭 5 只变异蜘蛛',     target:'mutant_spider',  count:5,  rewardGold:500,  rewardBones:40 },
  { id:'b_kill_zombie',  type:'kill',   desc:'消灭 4 只蹒跚丧尸',     target:'zombie_walk',    count:4,  rewardGold:700,  rewardBones:50 },
  { id:'b_kill_scorpion',type:'kill',   desc:'消灭 3 只辐射蝎',       target:'rad_scorpion',   count:3,  rewardGold:900,  rewardBones:60 },
  { id:'b_kill_raider',  type:'kill',   desc:'消灭 1 个废土掠夺者',   target:'wasteland_raider',count:1, rewardGold:2000, rewardBox:'rare' },
  { id:'b_gather_wood',  type:'gather', desc:'采集木材 50 次',         target:'wood',           count:50, rewardGold:300 },
  { id:'b_gather_ore',   type:'gather', desc:'采矿 50 次',              target:'ore',            count:50, rewardGold:300 },
  { id:'b_gather_fish',  type:'gather', desc:'钓鱼 40 次',              target:'fish',           count:40, rewardGold:350 },
  { id:'b_gather_hide',  type:'gather', desc:'狩猎 40 次',              target:'hide',           count:40, rewardGold:350 },
  { id:'b_craft_smelt',  type:'craft',  desc:'熔炼 30 个金属锭',        target:'smelting',       count:30, rewardGold:400 },
  { id:'b_craft_smith',  type:'craft',  desc:'锻造 15 件装备',          target:'smithing',       count:15, rewardGold:500 },
  { id:'b_craft_cook',   type:'craft',  desc:'烹饪 20 份食物',          target:'cooking',        count:20, rewardGold:300 },
  { id:'b_craft_alchemy',type:'craft',  desc:'炼制 15 瓶药水',          target:'alchemy',        count:15, rewardGold:400 },
  { id:'b_any_skill',    type:'craft',  desc:'完成任意技能动作 100 次', target:'any',            count:100,rewardGold:500, rewardBox:'uncommon' },
];

// ─── Milestones / Achievements ───────────────────────────────────────────
export type MilestoneCategory = 'gathering' | 'combat' | 'crafting' | 'special';

export interface Milestone {
  id: string;
  category: MilestoneCategory;
  title: string;
  desc: string;
  target: string;       // skill key or stat
  threshold: number;     // number to reach
  bonusType: string;     // bonus effect type
  bonusValue: number;    // bonus amount
  bonusLabel: string;    // display text
}

export const MILESTONES: Milestone[] = [
  // ── Gathering ──
  { id:'m_wood_100',   category:'gathering',title:'伐木新手',   desc:'完成伐木 100 次',  target:'woodcutting',threshold:100, bonusType:'woodXp',  bonusValue:5,  bonusLabel:'伐木经验 +5%' },
  { id:'m_wood_1000',  category:'gathering',title:'伐木达人',   desc:'完成伐木 1000 次', target:'woodcutting',threshold:1000,bonusType:'woodXp',  bonusValue:10, bonusLabel:'伐木经验 +10%' },
  { id:'m_mine_100',   category:'gathering',title:'矿工入门',   desc:'完成采矿 100 次',  target:'mining',     threshold:100, bonusType:'mineXp',  bonusValue:5,  bonusLabel:'采矿经验 +5%' },
  { id:'m_mine_1000',  category:'gathering',title:'矿工大师',   desc:'完成采矿 1000 次', target:'mining',     threshold:1000,bonusType:'mineXp',  bonusValue:10, bonusLabel:'采矿经验 +10%' },
  { id:'m_fish_100',   category:'gathering',title:'钓鱼新星',   desc:'钓鱼 100 次',      target:'fishing',    threshold:100, bonusType:'fishXp',  bonusValue:5,  bonusLabel:'钓鱼经验 +5%' },
  { id:'m_hunt_100',   category:'gathering',title:'狩猎入门',   desc:'狩猎 100 次',      target:'hunting',    threshold:100, bonusType:'huntXp',  bonusValue:5,  bonusLabel:'狩猎经验 +5%' },
  // ── Combat ──
  { id:'m_kill_50',    category:'combat',   title:'废土清道夫', desc:'击杀 50 个敌人',   target:'kills',      threshold:50,  bonusType:'attack',  bonusValue:5,  bonusLabel:'攻击 +5' },
  { id:'m_kill_200',   category:'combat',   title:'废土猎人',   desc:'击杀 200 个敌人',  target:'kills',      threshold:200, bonusType:'attack',  bonusValue:10, bonusLabel:'攻击 +10' },
  { id:'m_kill_500',   category:'combat',   title:'废土屠夫',   desc:'击杀 500 个敌人',  target:'kills',      threshold:500, bonusType:'hp',      bonusValue:50, bonusLabel:'生命 +50' },
  { id:'m_dungeon_10', category:'combat',   title:'遗迹探索者', desc:'完成废墟探索 10 次',target:'dungeons',   threshold:10,  bonusType:'defence', bonusValue:8,  bonusLabel:'防御 +8' },
  // ── Crafting ──
  { id:'m_smelt_50',   category:'crafting',title:'熔炉初燃',   desc:'熔炼 50 次',       target:'smelting',   threshold:50,  bonusType:'craftSpd',bonusValue:5,  bonusLabel:'制作速度 +5%' },
  { id:'m_smith_50',   category:'crafting',title:'铁匠学徒',   desc:'锻造 50 件装备',   target:'smithing',   threshold:50,  bonusType:'smithXp', bonusValue:8,  bonusLabel:'锻造经验 +8%' },
  { id:'m_cook_30',    category:'crafting',title:'营地厨师',   desc:'烹饪 30 次',       target:'cooking',    threshold:30,  bonusType:'cookXp',  bonusValue:5,  bonusLabel:'烹饪经验 +5%' },
  // ── Special ──
  { id:'m_skills_500', category:'special', title:'全能幸存者', desc:'累计完成任意技能 500 次',target:'actions',threshold:500,bonusType:'allXp',   bonusValue:5,  bonusLabel:'全技能经验 +5%' },
  { id:'m_gold_10k',   category:'special', title:'废土富豪',   desc:'累计获得 10000 瓶盖',target:'gold',   threshold:10000,bonusType:'goldDrop',bonusValue:10,bonusLabel:'瓶盖获取 +10%' },
  { id:'m_level_50',   category:'special', title:'废土老兵',   desc:'任意技能达到 50 级',target:'maxLevel',threshold:50, bonusType:'allXp',   bonusValue:10,bonusLabel:'全技能经验 +10%' },
  { id:'m_level_99',   category:'special', title:'废土传奇',   desc:'任意技能达到 99 级',target:'maxLevel',threshold:99, bonusType:'allXp',   bonusValue:25,bonusLabel:'全技能经验 +25%' },
];

