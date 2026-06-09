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
  common:    'text-gray-400',
  uncommon:  'text-blue-400',
  rare:      'text-yellow-400',
  epic:      'text-amber-300',
  legendary: 'text-orange-400',
  mythic:    'text-red-400',
};

export const RARITY_BORDER: Record<Rarity, string> = {
  common:    'border-gray-500/40',
  uncommon:  'border-blue-500/40',
  rare:      'border-yellow-500/40',
  epic:      'border-amber-400/60',
  legendary: 'border-orange-500/60',
  mythic:    'border-red-500/60',
};

export const RARITY_BG: Record<Rarity, string> = {
  common:    'bg-gray-500/5',
  uncommon:  'bg-blue-500/8',
  rare:      'bg-yellow-500/10',
  epic:      'bg-amber-500/12',
  legendary: 'bg-orange-500/15',
  mythic:    'bg-red-500/15',
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
    id:'frost_fang', name:'冰霜之牙', emoji:'⚔️', slot:'weapon', ilvl:8, minEnemyIndex:1,
    flavorText:'寒意从刀身渗入每一个伤口，令敌人冻僵战栗。',
    affixes:[{type:'strength',value:8},{type:'dexterity',value:6},{type:'damage_percent',value:15}],
    skills:[{type:"poison",name:"寒毒",chance:4,magnitude:4,description:"每次攻击追加 4 点冰毒伤害"}],
    legendaryPower:'攻击时 15% 概率触发冰霜新星，冻结敌人 1 回合',
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
    skills:[{type:"thorns",name:"骸骨",chance:10,magnitude:10,description:"被击中时反弹 10 点伤害"}],
  },
  {
    id:'phantom_steps', name:'幽灵之踪', emoji:'👢', slot:'boots', ilvl:22, minEnemyIndex:3,
    flavorText:'步伐如鬼魅，触地无声，敌人难以追踪。',
    affixes:[{type:'dexterity',value:10},{type:'lucky_hit',value:20},{type:'intelligence',value:15}],
    skills:[{type:"dodge",name:"幻影",chance:18,magnitude:18,description:"18% 概率闪避所有伤害"}],
  },
  {
    id:'berserker_gloves', name:'狂战士之拳', emoji:'🥊', slot:'gloves', ilvl:28, minEnemyIndex:4,
    flavorText:'佩戴此手套后，战士体内涌现出原始的暴怒。',
    affixes:[{type:'strength',value:14},{type:'damage_percent',value:20},{type:'crit_damage',value:12},{type:'overpower',value:8}],
    skills:[{type:"berserk",name:"暴怒",chance:35,magnitude:35,description:"HP < 30% 时攻击力提升 35%"}],
  },
  {
    id:'andariel_visage', name:'安达里尔的凝视', emoji:'⛑️', slot:'helmet', ilvl:35, minEnemyIndex:4,
    flavorText:'毁灭之女神的目光令所有人恐惧战栗，她的力量注入其中。',
    affixes:[{type:'vitality',value:18},{type:'life_leech',value:8},{type:'crit_damage',value:15},{type:'damage_percent',value:15}],
    skills:[{type:"poison",name:"安达里尔毒液",chance:8,magnitude:8,description:"每次攻击追加 8 点毒素伤害"}],
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
    skills:[{type:"doublestrike",name:"影分身",chance:25,magnitude:25,description:"25% 概率每回合攻击两次"}],
    legendaryPower:'攻击时 10% 概率召唤暗影分身，复制本次全部伤害',
  },
  {
    id:'giant_smash_axe', name:'巨人粉碎斧', emoji:'🪓', slot:'weapon', ilvl:42, minEnemyIndex:5,
    flavorText:'锻造自巨人骨骼，一击足以粉碎磐石。',
    affixes:[{type:'strength',value:22},{type:'overpower',value:20},{type:'damage_percent',value:25}],
    skills:[{type:"berserk",name:"巨怒",chance:30,magnitude:30,description:"HP < 30% 时攻击力提升 30%"}],
  },
  {
    id:'hellhound_boots', name:'地狱猎犬靴', emoji:'👢', slot:'boots', ilvl:42, minEnemyIndex:5,
    flavorText:'穿上此靴，战士的速度媲美地狱犬的追猎。',
    affixes:[{type:'dexterity',value:14},{type:'attack_speed',value:20},{type:'life_on_hit',value:12}],
    skills:[{type:"vampiric",name:"猎杀",chance:15,magnitude:15,description:"击杀时恢复 15 点生命"}],
  },
  {
    id:'vampire_ring', name:'吸血鬼戒指', emoji:'💍', slot:'ring', ilvl:45, minEnemyIndex:5,
    flavorText:'戴上此戒，战士可汲取敌人的生命维系自身。',
    affixes:[{type:'life_leech',value:12},{type:'life_on_hit',value:15},{type:'dexterity',value:8}],
    skills:[{type:"lifesteal",name:"吸血鬼",chance:10,magnitude:10,description:"击中时吸取 10% 伤害恢复生命"}],
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
    skills:[{type:"thorns",name:"龙鳞",chance:20,magnitude:20,description:"被击中时反弹 20 点伤害"}],
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
    skills:[{type:"doublestrike",name:"黑暗双击",chance:30,magnitude:30,description:"30% 概率每回合攻击两次"}],
  },
  {
    id:'flame_tongue_sword', name:'炎语之剑', emoji:'⚔️', slot:'weapon', ilvl:58, minEnemyIndex:6,
    flavorText:'剑身常燃烈焰，斩出的每一剑都灼烧敌人的灵魂。',
    affixes:[{type:'damage_percent',value:35},{type:'strength',value:24},{type:'crit_damage',value:18},{type:'life_leech',value:10}],
    skills:[{type:"spellblade",name:"炎语",chance:25,magnitude:25,description:"攻击力额外提升 25%"}],
  },
  {
    id:'hellfire_plate', name:'炼狱铠甲', emoji:'🧥', slot:'chest', ilvl:65, minEnemyIndex:7,
    flavorText:'地狱烈火锻造，穿戴者如站在炼狱核心，烈焰护体。',
    affixes:[{type:'armour',value:70},{type:'vitality',value:35},{type:'thorns',value:25},{type:'resist_all',value:25},{type:'life_regen',value:15}],
    skills:[{type:"thorns",name:"地狱之焰",chance:30,magnitude:30,description:"被击中时反弹 30 点伤害"}],
  },
  {
    id:'inferno_crown', name:'炼狱王冠', emoji:'👑', slot:'helmet', ilvl:65, minEnemyIndex:7,
    flavorText:'戴上此冠，战士的意志如炼狱之火，永不熄灭。',
    affixes:[{type:'vitality',value:28},{type:'life_leech',value:18},{type:'lucky_hit',value:30},{type:'life_on_hit',value:25}],
    skills:[{type:"vampiric",name:"火龙嗜血",chance:20,magnitude:20,description:"击杀时恢复 20 点生命"}],
  },
  {
    id:'time_keeper_ring', name:'时间守护戒', emoji:'💍', slot:'ring', ilvl:65, minEnemyIndex:7,
    flavorText:'时间的主宰，万物皆在其掌控之中。',
    affixes:[{type:'attack_speed',value:30},{type:'dexterity',value:20},{type:'crit_damage',value:20},{type:'lucky_hit',value:25}],
    skills:[{type:"doublestrike",name:"时之双击",chance:35,magnitude:35,description:"35% 概率每回合攻击两次"}],
  },
  {
    id:'eternity_blade', name:'永恒之刃', emoji:'⚔️', slot:'weapon', ilvl:70, minEnemyIndex:7,
    flavorText:'自混沌之初便存在的神器，凡持有者皆无敌于天下。',
    affixes:[{type:'strength',value:35},{type:'damage_percent',value:50},{type:'crit_damage',value:25},{type:'overpower',value:20},{type:'life_leech',value:15}],
    skills:[{type:"spellblade",name:"永恒剑意",chance:30,magnitude:30,description:"攻击力额外提升 30%"}],
  },
  {
    id:'eternity_shield', name:'永恒之盾', emoji:'🛡️', slot:'offhand', ilvl:70, minEnemyIndex:7,
    flavorText:'护佑者永恒不灭的意志铸成此盾，任何攻击都无法将其击碎。',
    affixes:[{type:'armour',value:80},{type:'vitality',value:40},{type:'resist_all',value:30},{type:'thorns',value:30},{type:'life_regen',value:20}],
  },
  // ── Dungeon-exclusive unique items ─────────────────────────────────────────
  // Dungeon 1: 腐化矿穴
  {
    id:'d_rotten_core', name:'腐核护甲', emoji:'🪨', slot:'chest', ilvl:15, minEnemyIndex:99,
    flavorText:'深渊矿脉中提炼的腐化结晶铸造而成，穿戴者散发出令敌人恐惧的腐臭。',
    affixes:[{type:'armour',value:18},{type:'vitality',value:10},{type:'life_regen',value:4},{type:'resist_all',value:6}],
  },
  {
    id:'d_corrosion_pick', name:'腐蚀鹤嘴锄', emoji:'⛏️', slot:'weapon', ilvl:13, minEnemyIndex:99,
    flavorText:'每次击中都会在敌人体内注入腐化毒素，令其溃烂至死。',
    affixes:[{type:'strength',value:10},{type:'damage_percent',value:12}],
    skills:[{type:"poison",name:"腐化毒液",chance:6,magnitude:6,description:"每次攻击追加 6 点腐化伤害"}],
  },
  // Dungeon 2: 幽影迷宫
  {
    id:'d_specter_cloak', name:'幽灵披风', emoji:'🌑', slot:'chest', ilvl:25, minEnemyIndex:99,
    flavorText:'由亡灵的幽光编织而成，穿戴者如同幽灵般难以捕捉。',
    affixes:[{type:'armour',value:22},{type:'dexterity',value:14},{type:'life_leech',value:6}],
    skills:[{type:"dodge",name:"幻影步",chance:22,magnitude:22,description:"22% 概率闪避所有伤害"}],
  },
  {
    id:'d_shadow_sigil', name:'暗影符印', emoji:'🔮', slot:'ring', ilvl:23, minEnemyIndex:99,
    flavorText:'刻有古老幽影印记的戒指，令持有者行动如鬼魅迅疾。',
    affixes:[{type:'lucky_hit',value:30},{type:'dexterity',value:12},{type:'attack_speed',value:12}],
  },
  // Dungeon 3: 裂焰神殿
  {
    id:'d_flame_crown', name:'裂焰王冠', emoji:'👑', slot:'helmet', ilvl:40, minEnemyIndex:99,
    flavorText:'神殿祭司用千年焰火淬炼而成，冠上的烈焰永不熄灭。',
    affixes:[{type:'vitality',value:20},{type:'damage_percent',value:22},{type:'crit_damage',value:18}],
    skills:[{type:"poison",name:"裂焰灼烧",chance:10,magnitude:10,description:"每次攻击追加 10 点灼烧伤害"}],
  },
  {
    id:'d_ember_ring', name:'余烬戒环', emoji:'💍', slot:'ring', ilvl:38, minEnemyIndex:99,
    flavorText:'神殿深处永燃的余烬凝结成戒，赋予佩戴者炽热的战斗意志。',
    affixes:[{type:'dexterity',value:18},{type:'attack_speed',value:18},{type:'intelligence',value:20}],
    skills:[{type:"spellblade",name:"裂焰剑气",chance:18,magnitude:18,description:"攻击力额外提升 18%"}],
  },
  // Dungeon 4: 虚空要塞
  {
    id:'d_void_blade', name:'虚空裂剑', emoji:'🗡️', slot:'weapon', ilvl:55, minEnemyIndex:99,
    flavorText:'由虚空之力锻造，斩击时会撕裂空间本身，造成无法抵御的伤害。',
    affixes:[{type:'strength',value:28},{type:'damage_percent',value:35},{type:'crit_damage',value:22},{type:'overpower',value:18}],
    skills:[{type:"doublestrike",name:"虚空双裂",chance:30,magnitude:30,description:"30% 概率每回合攻击两次"}],
  },
  {
    id:'d_nullity_plate', name:'虚无重甲', emoji:'🛡️', slot:'chest', ilvl:58, minEnemyIndex:99,
    flavorText:'以虚空金属锻造，能够吸收来自任何维度的攻击。',
    affixes:[{type:'armour',value:55},{type:'vitality',value:30},{type:'resist_all',value:18},{type:'life_regen',value:12}],
  },
  // Dungeon 5: 龙冢秘境
  {
    id:'d_bone_dragon_shield', name:'龙骸圣盾', emoji:'🦴', slot:'offhand', ilvl:68, minEnemyIndex:99,
    flavorText:'以古龙骸骨铸成，每次受击都会让攻击者付出痛苦的代价。',
    affixes:[{type:'armour',value:65},{type:'resist_all',value:22},{type:'thorns',value:25}],
    skills:[{type:"vampiric",name:"骨血汲取",chance:20,magnitude:20,description:"击杀时恢复 20 点生命"}],
  },
  {
    id:'d_dracolich_mantle', name:'龙灵战甲', emoji:'🧥', slot:'chest', ilvl:72, minEnemyIndex:99,
    flavorText:'龙冢中沉睡的龙灵将自身力量灌注其中，赋予佩戴者近乎不死的生命力。',
    affixes:[{type:'vitality',value:40},{type:'armour',value:50},{type:'life_leech',value:14},{type:'crit_damage',value:20}],
  },
  // Dungeon 6: 混沌熔炉
  {
    id:'d_chaos_edge', name:'混沌熔刃', emoji:'⚔️', slot:'weapon', ilvl:85, minEnemyIndex:99,
    flavorText:'混沌熔炉中诞生的终极之刃，集所有破坏力量于一身，斩断一切存在。',
    affixes:[{type:'strength',value:45},{type:'damage_percent',value:55},{type:'crit_damage',value:30},{type:'overpower',value:25},{type:'attack_speed',value:20}],
    skills:[{type:'spellblade',name:'混沌剑意',value:35,description:'攻击力额外提升 35%'},{type:'doublestrike',name:'混沌双裂',value:30,description:'30% 概率每回合攻击两次'}],
  },
  {
    id:'d_primal_forge_armor', name:'原始熔炉甲', emoji:'🔱', slot:'chest', ilvl:88, minEnemyIndex:99,
    flavorText:'混沌熔炉最终产物，集混沌能量与宇宙秩序于一身，堪称神器之首。',
    affixes:[{type:'armour',value:90},{type:'vitality',value:55},{type:'resist_all',value:35},{type:'life_regen',value:25},{type:'life_leech',value:18}],
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

// ─── Leather equipment items ───────────────────────────────────────────────────
// Uses hides from Hunting (hide_0..9)
export const LEATHER_ITEMS: Record<string, SmithedItemDef> = {
  // Rabbit hide (hide_0) — Tier 1
  leather_cap:       { id: 'leather_cap',       name: '皮革帽',     emoji: '🎩', slot: 'helmet',  attackBonus: 0,  defenceBonus: 3,   ilvl: 4  },
  leather_vest:      { id: 'leather_vest',      name: '皮革战衣',   emoji: '🧥', slot: 'chest',   attackBonus: 0,  defenceBonus: 6,   ilvl: 4  },
  leather_pants:     { id: 'leather_pants',     name: '皮革裤',     emoji: '👖', slot: 'legs',    attackBonus: 0,  defenceBonus: 4,   ilvl: 4  },
  leather_gloves:    { id: 'leather_gloves',    name: '皮革手套',   emoji: '🥊', slot: 'gloves',  attackBonus: 3,  defenceBonus: 2,   ilvl: 4  },
  wooden_staff:      { id: 'wooden_staff',      name: '木制法杖', emoji: '🪄', slot: 'weapon',  attackBonus: 6,  defenceBonus: 0,  ilvl: 4,  combatStyle: 'magic'  },
  bone_staff:        { id: 'bone_staff',        name: '骨制法杖', emoji: '🪄', slot: 'weapon',  attackBonus: 13, defenceBonus: 0,  ilvl: 13, combatStyle: 'magic'  },
  enchanted_staff:   { id: 'enchanted_staff',   name: '附魔法杖', emoji: '🪄', slot: 'weapon',  attackBonus: 22, defenceBonus: 0,  ilvl: 24, combatStyle: 'magic'  },
  crystal_staff:     { id: 'crystal_staff',     name: '水晶法杖', emoji: '🪄', slot: 'weapon',  attackBonus: 35, defenceBonus: 0,  ilvl: 38, combatStyle: 'magic'  },
  dragonbone_staff:  { id: 'dragonbone_staff',  name: '龙骨法杖', emoji: '🪄', slot: 'weapon',  attackBonus: 52, defenceBonus: 0,  ilvl: 52, combatStyle: 'magic'  },
  etherial_staff:    { id: 'etherial_staff',    name: '以太法杖', emoji: '🪄', slot: 'weapon',  attackBonus: 74, defenceBonus: 0,  ilvl: 68, combatStyle: 'magic'  },
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
  // Magic staves
  { id: 'lw_wooden_staff',      output: 'wooden_staff',      inputs: [{ resource: 'hide_0', qty: 1 }], reqLevel: 1,  xp: 20,  time: 6  },
  { id: 'lw_bone_staff',        output: 'bone_staff',        inputs: [{ resource: 'hide_2', qty: 2 }], reqLevel: 10, xp: 50,  time: 8  },
  { id: 'lw_enchanted_staff',   output: 'enchanted_staff',   inputs: [{ resource: 'hide_4', qty: 2 }], reqLevel: 20, xp: 80,  time: 12 },
  { id: 'lw_crystal_staff',     output: 'crystal_staff',     inputs: [{ resource: 'hide_6', qty: 3 }], reqLevel: 32, xp: 130, time: 16 },
  { id: 'lw_dragonbone_staff',  output: 'dragonbone_staff',  inputs: [{ resource: 'hide_7', qty: 3 }], reqLevel: 48, xp: 200, time: 22 },
  { id: 'lw_etherial_staff',    output: 'etherial_staff',    inputs: [{ resource: 'hide_9', qty: 4 }], reqLevel: 62, xp: 300, time: 28 },
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

// ─── Tool crafting recipes ────────────────────────────────────────────────────
export const TOOL_RECIPES: CraftingRecipe[] = [
  // Axes: wood + bars
  { id:'tool_bronze_axe',   output:'bronze_axe',   inputs:[{resource:'wood_0',qty:3},{resource:'bar_0',qty:2}], reqLevel:1,  xp:15, time:8 },
  { id:'tool_iron_axe',     output:'iron_axe',     inputs:[{resource:'wood_1',qty:3},{resource:'bar_1',qty:2}], reqLevel:10, xp:30, time:10 },
  { id:'tool_steel_axe',    output:'steel_axe',    inputs:[{resource:'wood_2',qty:3},{resource:'bar_2',qty:2}], reqLevel:20, xp:50, time:12 },
  { id:'tool_mithril_axe',  output:'mithril_axe',  inputs:[{resource:'wood_4',qty:3},{resource:'bar_4',qty:2}], reqLevel:35, xp:80, time:14 },
  { id:'tool_adamant_axe',  output:'adamant_axe',  inputs:[{resource:'wood_5',qty:3},{resource:'bar_5',qty:2}], reqLevel:45, xp:120,time:16 },
  { id:'tool_rune_axe',     output:'rune_axe',     inputs:[{resource:'wood_6',qty:3},{resource:'bar_6',qty:2},{resource:'dragonBones',qty:1}], reqLevel:55, xp:180,time:18 },
  { id:'tool_dragon_axe',   output:'dragon_axe',   inputs:[{resource:'wood_8',qty:3},{resource:'bar_8',qty:2},{resource:'dragonBones',qty:3}], reqLevel:70, xp:280,time:22 },
  // Pickaxes: bars + bones
  { id:'tool_bronze_pick',  output:'bronze_pick',  inputs:[{resource:'bar_0',qty:2},{resource:'bones',qty:2}],  reqLevel:1,  xp:15, time:8 },
  { id:'tool_iron_pick',    output:'iron_pick',    inputs:[{resource:'bar_1',qty:2},{resource:'bones',qty:3}],  reqLevel:10, xp:30, time:10 },
  { id:'tool_steel_pick',   output:'steel_pick',   inputs:[{resource:'bar_2',qty:2},{resource:'bones',qty:5}],  reqLevel:20, xp:50, time:12 },
  { id:'tool_mithril_pick', output:'mithril_pick', inputs:[{resource:'bar_4',qty:2},{resource:'bones',qty:8}],  reqLevel:35, xp:80, time:14 },
  { id:'tool_adamant_pick', output:'adamant_pick', inputs:[{resource:'bar_5',qty:2},{resource:'bones',qty:12}], reqLevel:45, xp:120,time:16 },
  { id:'tool_rune_pick',    output:'rune_pick',    inputs:[{resource:'bar_6',qty:2},{resource:'dragonBones',qty:1}], reqLevel:55, xp:180,time:18 },
  { id:'tool_dragon_pick',  output:'dragon_pick',  inputs:[{resource:'bar_8',qty:2},{resource:'dragonBones',qty:3}], reqLevel:70, xp:280,time:22 },
  // Fishing rods: wood
  { id:'tool_basic_rod',    output:'basic_rod',    inputs:[{resource:'wood_0',qty:5}],  reqLevel:1,  xp:12, time:5 },
  { id:'tool_oak_rod',      output:'oak_rod',      inputs:[{resource:'wood_1',qty:5}],  reqLevel:8,  xp:25, time:8 },
  { id:'tool_steel_rod',    output:'steel_rod',    inputs:[{resource:'wood_2',qty:4},{resource:'bar_2',qty:1}], reqLevel:20, xp:45, time:10 },
  { id:'tool_mithril_rod',  output:'mithril_rod',  inputs:[{resource:'wood_4',qty:4},{resource:'bar_4',qty:1}], reqLevel:35, xp:75, time:12 },
  { id:'tool_rune_rod',     output:'rune_rod',     inputs:[{resource:'wood_6',qty:4},{resource:'bar_6',qty:1},{resource:'dragonBones',qty:1}], reqLevel:55, xp:170,time:16 },
  // Hunting knives: bars + hide
  { id:'tool_bone_knife',   output:'bone_knife',   inputs:[{resource:'hide_0',qty:2},{resource:'bones',qty:3}], reqLevel:1,  xp:15, time:8 },
  { id:'tool_iron_knife',   output:'iron_knife',   inputs:[{resource:'hide_1',qty:2},{resource:'bar_1',qty:1}], reqLevel:10, xp:30, time:10 },
  { id:'tool_steel_knife',  output:'steel_knife',  inputs:[{resource:'hide_2',qty:2},{resource:'bar_2',qty:1}], reqLevel:20, xp:50, time:12 },
  { id:'tool_mithril_knife',output:'mithril_knife', inputs:[{resource:'hide_4',qty:2},{resource:'bar_4',qty:1}], reqLevel:35, xp:80, time:14 },
  { id:'tool_rune_knife',   output:'rune_knife',   inputs:[{resource:'hide_6',qty:2},{resource:'bar_6',qty:1},{resource:'dragonBones',qty:1}], reqLevel:55, xp:170,time:18 },
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
  emoji: string;
  maxHp: number;
  attack: number;
  defence: number;
  xp: number;
  drops: { gold: [number, number]; bones?: number; dragonBones?: number };
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
  { id:'rad_roach',     name:'变异蟑螂',   emoji:'🪳',  maxHp:12,  attack:1,  defence:0,  xp:8,   drops:{gold:[1,3]},                     reqCombatLevel:1,  combatStyle:'melee' },
  { id:'rad_rat',       name:'辐射鼠',     emoji:'🐀',  maxHp:22,  attack:2,  defence:0,  xp:16,  drops:{gold:[2,4]},                     reqCombatLevel:5,  combatStyle:'melee' },
  { id:'stray_dog',     name:'流浪犬',     emoji:'🐕',  maxHp:45,  attack:4,  defence:1,  xp:30,  drops:{gold:[3,6],bones:1},            reqCombatLevel:10, combatStyle:'melee' },
  { id:'mutant_spider', name:'变异蜘蛛',   emoji:'🕷️',  maxHp:80,  attack:7,  defence:2,  xp:50,  drops:{gold:[5,10]},                   reqCombatLevel:15, combatStyle:'magic' },
  // ── LV 20-35 ──────────────────────────────────────────────────────────────
  { id:'zombie_walk',   name:'蹒跚丧尸',   emoji:'🧟',  maxHp:140, attack:11, defence:4,  xp:80,  drops:{gold:[8,16],bones:2},           reqCombatLevel:20, combatStyle:'melee' },
  { id:'rad_scorpion',  name:'辐射蝎',     emoji:'🦂',  maxHp:220, attack:15, defence:6,  xp:120, drops:{gold:[12,24]},                  reqCombatLevel:25, combatStyle:'ranged' },
  { id:'ghoul_flesh',   name:'食尸鬼',     emoji:'👹',  maxHp:340, attack:20, defence:8,  xp:170, drops:{gold:[18,35],bones:3},          reqCombatLevel:30, combatStyle:'magic' },
  { id:'mutant_hound',  name:'变异猎犬',   emoji:'🐺',  maxHp:500, attack:26, defence:12, xp:230, drops:{gold:[25,50],bones:4},          reqCombatLevel:35, combatStyle:'melee' },
  // ── LV 40-55 ──────────────────────────────────────────────────────────────
  { id:'bandit_scav',   name:'废土拾荒者', emoji:'🏴',  maxHp:700, attack:34, defence:16, xp:300, drops:{gold:[35,70],bones:5},          reqCombatLevel:40, combatStyle:'ranged' },
  { id:'rad_elemental', name:'辐射元素',   emoji:'☢️',  maxHp:900, attack:42, defence:12, xp:380, drops:{gold:[45,90]},                  reqCombatLevel:45, combatStyle:'magic' },
  { id:'mutant_bear',   name:'变异熊',     emoji:'🐻',  maxHp:1150,attack:50, defence:22, xp:470, drops:{gold:[55,110],bones:6},         reqCombatLevel:50, combatStyle:'melee' },
  { id:'zombie_brute',  name:'壮硕丧尸',   emoji:'💪',  maxHp:1450,attack:58, defence:28, xp:570, drops:{gold:[70,140],bones:6},         reqCombatLevel:55, combatStyle:'magic' },
  // ── LV 60-75 ──────────────────────────────────────────────────────────────
  { id:'wasteland_raider',name:'废土掠夺者',emoji:'⚔️',maxHp:1800,attack:68, defence:34, xp:680, drops:{gold:[85,170],dragonBones:3},  reqCombatLevel:60, combatStyle:'ranged' },
  { id:'sentry_bot',    name:'哨卫机器人', emoji:'🤖',  maxHp:2200,attack:76, defence:40, xp:800, drops:{gold:[100,200],dragonBones:4},  reqCombatLevel:65, combatStyle:'ranged' },
  { id:'rad_drake',     name:'辐射亚龙',   emoji:'🐉',  maxHp:2700,attack:86, defence:46, xp:940, drops:{gold:[120,240],dragonBones:5}, reqCombatLevel:70, combatStyle:'magic' },
  { id:'deathclaw',     name:'死亡爪',     emoji:'🦖',  maxHp:3300,attack:96, defence:52, xp:1100,drops:{gold:[140,280],dragonBones:6}, reqCombatLevel:75, combatStyle:'melee' },
  // ── LV 80-90 ──────────────────────────────────────────────────────────────
  { id:'mutant_behemoth',name:'变异巨兽',  emoji:'🦣',  maxHp:4000,attack:108,defence:58, xp:1300,drops:{gold:[170,340],dragonBones:8}, reqCombatLevel:80, combatStyle:'ranged' },
  { id:'ancient_wraith', name:'远古幽魂',  emoji:'👻',  maxHp:4800,attack:120,defence:40, xp:1500,drops:{gold:[200,400],dragonBones:10},reqCombatLevel:85, combatStyle:'magic' },
  { id:'warlord',        name:'废土军阀',  emoji:'👑',  maxHp:5800,attack:135,defence:65, xp:1800,drops:{gold:[250,500],dragonBones:12},reqCombatLevel:90, combatStyle:'melee' },
  // ── HIDDEN (3) — only visible when unlocked ──────────────────────────────
  { id:'glowing_one',    name:'辐射辉光者',emoji:'✨',  maxHp:7500,attack:155,defence:60, xp:2500,drops:{gold:[350,700],dragonBones:20},  reqCombatLevel:95, combatStyle:'ranged',  hidden:true },
  { id:'elder_dragon',   name:'远古巨龙',   emoji:'🐲',  maxHp:10000,attack:180,defence:75, xp:3500,drops:{gold:[500,1000],dragonBones:30},reqCombatLevel:98, combatStyle:'magic',   hidden:true },
  { id:'overlord',       name:'终末霸主',   emoji:'💀',  maxHp:15000,attack:220,defence:90, xp:5000,drops:{gold:[800,1600],dragonBones:50},reqCombatLevel:99, combatStyle:'melee',   hidden:true },
];

// ─── Boss skills ──────────────────────────────────────────────────────────────
export type BossSkillType = 'shield' | 'aoe' | 'heal' | 'enrage';

export const BOSS_SKILL_LABEL: Record<BossSkillType, string> = {
  shield: '护盾',
  aoe: '范围攻击',
  heal: '自愈',
  enrage: '狂暴',
};

export const BOSS_SKILL_DESC: Record<BossSkillType, string> = {
  shield: '获得护盾，减免 50% 伤害',
  aoe: '对所有玩家造成额外伤害',
  heal: '恢复部分生命值',
  enrage: '攻击力大幅提升',
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
    name: '腐化矿穴',
    emoji: '⛏️',
    theme: '地下矿洞中滋生的腐化怪物统治着这片黑暗领域，矿工们再也无法入内。',
    reqCombatLevel: 10,
    cost: { gold: 100 },
    boss: { name: '矿坑蠕变怪', emoji: '🦠', maxHp: 500, attack: 14, defence: 4, xp: 200, skills: [{ type: 'shield', name: '腐化甲壳', cooldownSec: 12, value: 50, duration: 1 }] },
    uniqueDropIds: ['d_rotten_core', 'd_corrosion_pick'],
    dropChance: 0.6,
    waves: [
      { name:'矿鼠', emoji:'🐀', hpMul:0.15, atkMul:0.3 },
      { name:'矿蝠', emoji:'🦇', hpMul:0.25, atkMul:0.4 },
      { name:'腐化蠕虫', emoji:'🐛', hpMul:0.35, atkMul:0.5 },
      { name:'暗影矿工', emoji:'👤', hpMul:0.45, atkMul:0.6 },
      { name:'岩石魔像', emoji:'🗿', hpMul:0.55, atkMul:0.7 },
      { name:'腐化矿工', emoji:'🧟', hpMul:0.65, atkMul:0.8 },
      { name:'矿坑蜘蛛', emoji:'🕷️', hpMul:0.7, atkMul:0.9 },
      { name:'地下毒蛇', emoji:'🐍', hpMul:0.75, atkMul:1.0 },
      { name:'腐化巨虫', emoji:'🪱', hpMul:0.85, atkMul:1.1 },
      { name:'矿坑守卫', emoji:'⛑️', hpMul:0.95, atkMul:1.2 },
    ],
  },
  {
    id: 'shadow_maze',
    name: '幽影迷宫',
    emoji: '🌑',
    theme: '无尽的黑暗走廊中，幽魂在迷宫深处永无止境地游荡，等待活人进入。',
    reqCombatLevel: 20,
    cost: { gold: 400, bones: 10 },
    boss: { name: '幽魂领主', emoji: '👻', maxHp: 1100, attack: 26, defence: 9, xp: 450, skills: [{ type: 'aoe', name: '幽魂嚎叫', cooldownSec: 15, value: 20, duration: 0 }] },
    uniqueDropIds: ['d_specter_cloak', 'd_shadow_sigil'],
    dropChance: 0.55,

    waves: [
      { name:'迷途幽魂', emoji:'👻', hpMul:0.2, atkMul:0.4 },{ name:'暗影触手', emoji:'🦑', hpMul:0.3, atkMul:0.5 },{ name:'迷宫蜘蛛', emoji:'🕷️', hpMul:0.4, atkMul:0.6 },{ name:'黑暗幽灵', emoji:'👻', hpMul:0.5, atkMul:0.7 },{ name:'迷宫哨兵', emoji:'🗿', hpMul:0.6, atkMul:0.8 },{ name:'暗影刺客', emoji:'🗡️', hpMul:0.65, atkMul:0.9 },{ name:'幽魂护卫', emoji:'👤', hpMul:0.7, atkMul:1 },{ name:'迷宫巨虫', emoji:'🪱', hpMul:0.75, atkMul:1.1 },{ name:'暗影法师', emoji:'🧙', hpMul:0.82, atkMul:1.15 },{ name:'迷宫领主', emoji:'👑', hpMul:0.95, atkMul:1.25 }
    ],
  },
  {
    id: 'flame_sanctum',
    name: '裂焰神殿',
    emoji: '🔥',
    theme: '炽热的熔岩在神殿中流淌，祭司们用永恒的焰火维系着古老神明的意志。',
    reqCombatLevel: 35,
    cost: { gold: 1200, bones: 35 },
    boss: { name: '炎核祭司', emoji: '🧙', maxHp: 2400, attack: 44, defence: 17, xp: 900, skills: [{ type: 'heal', name: '烈焰洗礼', cooldownSec: 18, value: 300, duration: 0 }, { type: 'enrage', name: '火焰狂怒', cooldownSec: 24, value: 30, duration: 2 }] },
    uniqueDropIds: ['d_flame_crown', 'd_ember_ring'],
    dropChance: 0.5,

    waves: [
      { name:'火焰小鬼', emoji:'👿', hpMul:0.25, atkMul:0.45 },{ name:'熔岩蜗牛', emoji:'🐌', hpMul:0.35, atkMul:0.55 },{ name:'火焰蜥蜴', emoji:'🦎', hpMul:0.45, atkMul:0.65 },{ name:'熔岩傀儡', emoji:'🗿', hpMul:0.55, atkMul:0.75 },{ name:'炎蛇', emoji:'🐍', hpMul:0.65, atkMul:0.85 },{ name:'烈火精灵', emoji:'🔥', hpMul:0.7, atkMul:0.95 },{ name:'火焰巨魔', emoji:'👹', hpMul:0.78, atkMul:1.05 },{ name:'熔岩元素', emoji:'🪨', hpMul:0.82, atkMul:1.12 },{ name:'炎核信徒', emoji:'🧟', hpMul:0.88, atkMul:1.18 },{ name:'神殿狂战士', emoji:'💢', hpMul:0.95, atkMul:1.3 }
    ],
  },
  {
    id: 'void_fortress',
    name: '虚空要塞',
    emoji: '🌌',
    theme: '漂浮于虚空之中的要塞，守卫着通往另一个维度的裂口，一切逻辑在此失效。',
    reqCombatLevel: 50,
    cost: { gold: 4000, bones: 80 },
    boss: { name: '虚空铁卫', emoji: '🤖', maxHp: 4500, attack: 68, defence: 28, xp: 1800, skills: [{ type: 'shield', name: '虚空屏障', cooldownSec: 15, value: 50, duration: 1 }, { type: 'aoe', name: '虚空裂隙', cooldownSec: 20, value: 35, duration: 0 }] },
    uniqueDropIds: ['d_void_blade', 'd_nullity_plate'],
    dropChance: 0.45,

    waves: [
      { name:'虚空蠕虫', emoji:'🐛', hpMul:0.3, atkMul:0.5 },{ name:'虚空蝙蝠', emoji:'🦇', hpMul:0.4, atkMul:0.6 },{ name:'虚空哨兵', emoji:'👁️', hpMul:0.5, atkMul:0.7 },{ name:'虚空蜘蛛', emoji:'🕷️', hpMul:0.6, atkMul:0.8 },{ name:'虚空卫士', emoji:'🛡️', hpMul:0.68, atkMul:0.9 },{ name:'虚空刺客', emoji:'🗡️', hpMul:0.74, atkMul:1 },{ name:'虚空术士', emoji:'🧙', hpMul:0.8, atkMul:1.1 },{ name:'虚空巨兽', emoji:'🦣', hpMul:0.85, atkMul:1.15 },{ name:'虚空骑士', emoji:'⚔️', hpMul:0.9, atkMul:1.22 },{ name:'虚空守护者', emoji:'🛡️', hpMul:0.96, atkMul:1.3 }
    ],
  },
  {
    id: 'dragon_tomb',
    name: '龙冢秘境',
    emoji: '🐲',
    theme: '远古龙族的最后安息之地，亡龙的灵魂守护着传说中的神器，非强者莫入。',
    reqCombatLevel: 65,
    cost: { gold: 10000, dragonBones: 8 },
    boss: { name: '古龙亡灵', emoji: '💀', maxHp: 8000, attack: 100, defence: 44, xp: 3500, skills: [{ type: 'aoe', name: '龙息烈焰', cooldownSec: 15, value: 45, duration: 0 }, { type: 'heal', name: '龙骨再生', cooldownSec: 22, value: 600, duration: 0 }, { type: 'enrage', name: '龙怒', cooldownSec: 30, value: 40, duration: 2 }] },
    uniqueDropIds: ['d_bone_dragon_shield', 'd_dracolich_mantle'],
    dropChance: 0.4,

    waves: [
      { name:'幼龙', emoji:'🐉', hpMul:0.35, atkMul:0.55 },{ name:'龙骨战士', emoji:'💀', hpMul:0.45, atkMul:0.65 },{ name:'龙血蠕虫', emoji:'🐛', hpMul:0.55, atkMul:0.75 },{ name:'龙墓守卫', emoji:'🗿', hpMul:0.62, atkMul:0.85 },{ name:'龙魂幻影', emoji:'👻', hpMul:0.7, atkMul:0.95 },{ name:'远古龙卫', emoji:'🛡️', hpMul:0.75, atkMul:1.05 },{ name:'龙火元素', emoji:'🔥', hpMul:0.82, atkMul:1.12 },{ name:'龙骨巨兽', emoji:'🦴', hpMul:0.86, atkMul:1.18 },{ name:'龙祭司', emoji:'🧙', hpMul:0.92, atkMul:1.24 },{ name:'龙王守卫', emoji:'⚔️', hpMul:0.97, atkMul:1.32 }
    ],
  },
  {
    id: 'chaos_forge',
    name: '混沌熔炉',
    emoji: '⚗️',
    theme: '宇宙尽头的熔炉，混沌能量在此汇聚，锻造出超越神器的传说装备，唯有最强者方能通关。',
    reqCombatLevel: 80,
    cost: { gold: 25000, dragonBones: 20 },
    boss: { name: '混沌熔魂', emoji: '😈', maxHp: 16000, attack: 160, defence: 70, xp: 8000, skills: [{ type: 'shield', name: '混沌壁垒', cooldownSec: 18, value: 60, duration: 1 }, { type: 'aoe', name: '混沌风暴', cooldownSec: 15, value: 55, duration: 0 }, { type: 'enrage', name: '混沌狂怒', cooldownSec: 30, value: 50, duration: 3 }] },
    uniqueDropIds: ['d_chaos_edge', 'd_primal_forge_armor'],
    dropChance: 0.35,

    waves: [
      { name:'混沌火苗', emoji:'🔥', hpMul:0.38, atkMul:0.58 },{ name:'熔炉傀儡', emoji:'🗿', hpMul:0.48, atkMul:0.68 },{ name:'混沌蝙蝠', emoji:'🦇', hpMul:0.56, atkMul:0.78 },{ name:'锻造恶魔', emoji:'👿', hpMul:0.64, atkMul:0.88 },{ name:'熔岩卫士', emoji:'🛡️', hpMul:0.72, atkMul:0.98 },{ name:'混沌刺客', emoji:'🗡️', hpMul:0.78, atkMul:1.08 },{ name:'熔炉元素', emoji:'🪨', hpMul:0.84, atkMul:1.14 },{ name:'混沌巨兽', emoji:'🦣', hpMul:0.88, atkMul:1.2 },{ name:'熔炉祭司', emoji:'🧙', hpMul:0.93, atkMul:1.26 },{ name:'混沌守卫', emoji:'🛡️', hpMul:0.98, atkMul:1.35 }
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
  // Obsidian (bar_3)
  { id: 'r_obsidian_sword',    output: 'obsidian_sword',    inputs: [{ resource: 'bar_3', qty: 2 }], reqLevel: 40, xp: 100, time: 9  },
  { id: 'r_obsidian_shield',   output: 'obsidian_shield',   inputs: [{ resource: 'bar_3', qty: 3 }], reqLevel: 40, xp: 140, time: 11 },
  { id: 'r_obsidian_helmet',   output: 'obsidian_helmet',   inputs: [{ resource: 'bar_3', qty: 2 }], reqLevel: 40, xp: 100, time: 9  },
  { id: 'r_obsidian_body',     output: 'obsidian_body',     inputs: [{ resource: 'bar_3', qty: 5 }], reqLevel: 45, xp: 240, time: 16 },
  { id: 'r_obsidian_legs',     output: 'obsidian_legs',     inputs: [{ resource: 'bar_3', qty: 4 }], reqLevel: 45, xp: 190, time: 13 },
  { id: 'r_obsidian_gauntlets',output: 'obsidian_gauntlets',inputs: [{ resource: 'bar_3', qty: 2 }], reqLevel: 40, xp: 90,  time: 8  },
  { id: 'r_obsidian_boots',    output: 'obsidian_boots',    inputs: [{ resource: 'bar_3', qty: 2 }], reqLevel: 40, xp: 90,  time: 8  },
  // Rune (bar_6)
  { id: 'smith_rune_bow',      output: 'rune_bow_forged',   inputs: [{ resource: 'bar_6', qty: 3 }], reqLevel: 55, xp: 260, time: 22 },
  { id: 'r_rune_sword',        output: 'rune_sword',        inputs: [{ resource: 'bar_6', qty: 2 }], reqLevel: 70, xp: 220, time: 10 },
  // Dragon (bar_7)
  { id: 'r_dragon_sword',      output: 'dragon_sword',      inputs: [{ resource: 'bar_7', qty: 3 }], reqLevel: 75, xp: 300, time: 12 },
  { id: 'r_dragon_shield',     output: 'dragon_shield',     inputs: [{ resource: 'bar_7', qty: 4 }], reqLevel: 75, xp: 400, time: 14 },
  { id: 'r_dragon_helmet',     output: 'dragon_helmet',     inputs: [{ resource: 'bar_7', qty: 3 }], reqLevel: 75, xp: 300, time: 12 },
  { id: 'r_dragon_body',       output: 'dragon_body',       inputs: [{ resource: 'bar_7', qty: 6 }], reqLevel: 80, xp: 500, time: 18 },
  { id: 'r_dragon_legs',       output: 'dragon_legs',       inputs: [{ resource: 'bar_7', qty: 5 }], reqLevel: 80, xp: 400, time: 15 },
  { id: 'r_dragon_gauntlets',  output: 'dragon_gauntlets',  inputs: [{ resource: 'bar_7', qty: 3 }], reqLevel: 75, xp: 280, time: 10 },
  { id: 'r_dragon_boots',      output: 'dragon_boots',      inputs: [{ resource: 'bar_7', qty: 3 }], reqLevel: 75, xp: 280, time: 10 },
  // Eternal (bar_8)
  { id: 'r_eternal_sword',     output: 'eternal_sword',     inputs: [{ resource: 'bar_8', qty: 4 }], reqLevel: 85, xp: 450, time: 15 },
  { id: 'r_eternal_shield',    output: 'eternal_shield',    inputs: [{ resource: 'bar_8', qty: 5 }], reqLevel: 85, xp: 550, time: 18 },
  { id: 'r_eternal_helmet',    output: 'eternal_helmet',    inputs: [{ resource: 'bar_8', qty: 4 }], reqLevel: 85, xp: 450, time: 15 },
  { id: 'r_eternal_body',      output: 'eternal_body',      inputs: [{ resource: 'bar_8', qty: 8 }], reqLevel: 90, xp: 700, time: 22 },
  { id: 'r_eternal_legs',      output: 'eternal_legs',      inputs: [{ resource: 'bar_8', qty: 6 }], reqLevel: 90, xp: 560, time: 18 },
  // Divine (bar_9)
  { id: 'r_divine_sword',      output: 'divine_sword',      inputs: [{ resource: 'bar_9', qty: 5 }], reqLevel: 95, xp: 650, time: 20 },
  { id: 'r_divine_shield',     output: 'divine_shield',     inputs: [{ resource: 'bar_9', qty: 6 }], reqLevel: 95, xp: 750, time: 24 },
  { id: 'r_divine_helmet',     output: 'divine_helmet',     inputs: [{ resource: 'bar_9', qty: 5 }], reqLevel: 95, xp: 650, time: 20 },
  { id: 'r_divine_body',       output: 'divine_body',       inputs: [{ resource: 'bar_9', qty: 10}], reqLevel: 99, xp: 1000,time: 30 },
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
  { id:'drunkard',name:'醉汉',emoji:'🍺',level:1,perception:40,maxHit:2,interval:3,xp:5,gpMin:5,gpMax:15,
    commonDrops:[{name:'空瓶盖',emoji:'🍾',qty:1,chance:0.3},{name:'发霉面包',emoji:'🍞',qty:1,chance:0.2}],
    uniqueDrop:{id:'lucky_coin',name:'幸运硬币',emoji:'🪙',chance:250} },
  { id:'beggar',name:'乞丐',emoji:'🧙',level:8,perception:80,maxHit:3,interval:3,xp:10,gpMin:10,gpMax:30,
    commonDrops:[{name:'破布',emoji:'🧶',qty:1,chance:0.25},{name:'幸运草',emoji:'🍀',qty:1,chance:0.15}],
    uniqueDrop:{id:'beggar_pouch',name:'乞丐钱袋',emoji:'💰',chance:300} },
  { id:'peddler',name:'小贩',emoji:'🧑',level:15,perception:120,maxHit:5,interval:3,xp:18,gpMin:20,gpMax:50,
    commonDrops:[{name:'旧布料',emoji:'🧵',qty:1,chance:0.2},{name:'植物种子',emoji:'🌱',qty:1,chance:0.15}],
    uniqueDrop:{id:'discount_coupon',name:'打折券',emoji:'🎫',chance:250} },
  { id:'scavenger',name:'拾荒者',emoji:'🎒',level:25,perception:180,maxHit:8,interval:3,xp:30,gpMin:35,gpMax:80,
    commonDrops:[{name:'废金属',emoji:'🔩',qty:1,chance:0.2},{name:'机械零件',emoji:'⚙️',qty:1,chance:0.12}],
    uniqueDrop:{id:'scrap_backpack',name:'废料背包',emoji:'🎒',chance:220} },
  { id:'smuggler',name:'走私贩',emoji:'🕵️',level:35,perception:250,maxHit:12,interval:3,xp:50,gpMin:60,gpMax:130,
    commonDrops:[{name:'走私品',emoji:'📦',qty:1,chance:0.15},{name:'稀有草药',emoji:'🌿',qty:1,chance:0.1}],
    uniqueDrop:{id:'smuggler_map',name:'走私地图',emoji:'🗺️',chance:200} },
  { id:'raider',name:'掠夺者',emoji:'🏴',level:45,perception:340,maxHit:16,interval:3,xp:80,gpMin:100,gpMax:200,
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
  { id:'ancient_king',name:'远古王者之魂',emoji:'👑',level:90,perception:1000,maxHit:60,interval:3,xp:500,gpMin:800,gpMax:1600,
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
  { id:'bronze_axe',   name:'青铜斧', emoji:'🟢🪓', skill:'woodcutting', timeMult:0.95, yieldBonus:0 },
  { id:'iron_axe',     name:'铁斧',   emoji:'⬜🪓', skill:'woodcutting', timeMult:0.90, yieldBonus:0 },
  { id:'steel_axe',    name:'钢斧',   emoji:'🔵🪓', skill:'woodcutting', timeMult:0.85, yieldBonus:0 },
  { id:'mithril_axe',  name:'秘银斧', emoji:'🤍🪓', skill:'woodcutting', timeMult:0.80, yieldBonus:1 },
  { id:'adamant_axe',  name:'精金斧', emoji:'🟡🪓', skill:'woodcutting', timeMult:0.75, yieldBonus:1 },
  { id:'rune_axe',     name:'符文斧', emoji:'🔴🪓', skill:'woodcutting', timeMult:0.70, yieldBonus:2 },
  { id:'dragon_axe',   name:'龙斧',   emoji:'🌈🪓', skill:'woodcutting', timeMult:0.60, yieldBonus:2 },
  // Pickaxes (mining)
  { id:'bronze_pick',  name:'青铜镐', emoji:'🟢⛏️', skill:'mining', timeMult:0.95, yieldBonus:0 },
  { id:'iron_pick',    name:'铁镐',   emoji:'⬜⛏️', skill:'mining', timeMult:0.90, yieldBonus:0 },
  { id:'steel_pick',   name:'钢镐',   emoji:'🔵⛏️', skill:'mining', timeMult:0.85, yieldBonus:0 },
  { id:'mithril_pick', name:'秘银镐', emoji:'🤍⛏️', skill:'mining', timeMult:0.80, yieldBonus:1 },
  { id:'adamant_pick', name:'精金镐', emoji:'🟡⛏️', skill:'mining', timeMult:0.75, yieldBonus:1 },
  { id:'rune_pick',    name:'符文镐', emoji:'🔴⛏️', skill:'mining', timeMult:0.70, yieldBonus:2 },
  { id:'dragon_pick',  name:'龙镐',   emoji:'🌈⛏️', skill:'mining', timeMult:0.60, yieldBonus:2 },
  // Fishing rods
  { id:'basic_rod',    name:'基础鱼竿',emoji:'🟢🎣',skill:'fishing', timeMult:0.95, yieldBonus:0 },
  { id:'oak_rod',      name:'橡木鱼竿',emoji:'⬜🎣',skill:'fishing', timeMult:0.90, yieldBonus:0 },
  { id:'steel_rod',    name:'钢鱼竿',  emoji:'🔵🎣',skill:'fishing', timeMult:0.85, yieldBonus:0 },
  { id:'mithril_rod',  name:'秘银鱼竿',emoji:'🤍🎣',skill:'fishing', timeMult:0.80, yieldBonus:1 },
  { id:'rune_rod',     name:'符文鱼竿',emoji:'🔴🎣',skill:'fishing', timeMult:0.70, yieldBonus:2 },
  // Hunting knives
  { id:'bone_knife',   name:'骨刀',   emoji:'🟢🔪', skill:'hunting', timeMult:0.95, yieldBonus:0 },
  { id:'iron_knife',   name:'铁猎刀', emoji:'⬜🔪', skill:'hunting', timeMult:0.90, yieldBonus:0 },
  { id:'steel_knife',  name:'钢猎刀', emoji:'🔵🔪', skill:'hunting', timeMult:0.85, yieldBonus:0 },
  { id:'mithril_knife',name:'秘银猎刀',emoji:'🤍🔪', skill:'hunting', timeMult:0.80, yieldBonus:1 },
  { id:'rune_knife',   name:'符文猎刀',emoji:'🔴🔪', skill:'hunting', timeMult:0.70, yieldBonus:2 },
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
export const HOMESTEAD_BUILDINGS: HomesteadBuilding[] = [
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
  { id:'furnace', name:'火炉', emoji:'🔥', maxLevel:5, costWood:200, costStone:100, costGold:0, effect:'温度衰减', effectPerLevel:'-15% 衰减速度' },
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
  { woodTier:5, berryId:'nightberry', name:'紫莓', emoji:'🍇', chance:0.15 },
  { woodTier:6, berryId:'magicberry', name:'魔法莓', emoji:'✨', chance:0.14 },
  { woodTier:7, berryId:'ancientberry', name:'远古莓', emoji:'🍇', chance:0.13 },
  { woodTier:8, berryId:'cranberry', name:'蔓越莓', emoji:'🍒', chance:0.12 },
  { woodTier:9, berryId:'spiritberry', name:'灵魂莓', emoji:'👻', chance:0.10 },
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
export const COOKING_RECIPES: { id:string;name:string;emoji:string;inputs:{resource:string;qty:number}[];effect:string;durationMin:number }[] = [
  { id:'roasted_meat', name:'烤兔肉', emoji:'🍖', inputs:[{resource:'hide_0',qty:2},{resource:'blueberry',qty:1}], effect:'+20%最大HP', durationMin:60 },
  { id:'berry_juice', name:'浆果汁', emoji:'🧃', inputs:[{resource:'blueberry',qty:3},{resource:'raspberry',qty:2}], effect:'+10%全局经验', durationMin:30 },
  { id:'herb_stew', name:'草药炖狼肉', emoji:'🍲', inputs:[{resource:'hide_3',qty:2},{resource:'dandelion',qty:2},{resource:'mint',qty:1}], effect:'+15%攻击力', durationMin:45 },
  { id:'ginseng_soup', name:'参鸡汤', emoji:'🍜', inputs:[{resource:'hide_1',qty:3},{resource:'ginseng',qty:2}], effect:'+30%战斗经验', durationMin:60 },
  { id:'honey_roast', name:'蜜汁熊肉', emoji:'🍯', inputs:[{resource:'hide_4',qty:3},{resource:'blackberry',qty:3},{resource:'rosemary',qty:1}], effect:'+20%防御力', durationMin:60 },
  { id:'elf_bread', name:'精灵面包', emoji:'🍞', inputs:[{resource:'goji',qty:3},{resource:'thyme',qty:2}], effect:'-15%伐木时间', durationMin:45 },
  { id:'miner_pie', name:'矿工派', emoji:'🥧', inputs:[{resource:'hide_2',qty:2},{resource:'elderberry',qty:2},{resource:'marigold',qty:1}], effect:'-15%采矿时间', durationMin:45 },
  { id:'fisherman_stew', name:'渔夫炖汤', emoji:'🍵', inputs:[{resource:'hide_0',qty:2},{resource:'dandelion',qty:3},{resource:'mint',qty:1}], effect:'-15%钓鱼时间', durationMin:45 },
  { id:'hunter_pie', name:'猎人馅饼', emoji:'🥟', inputs:[{resource:'hide_5',qty:2},{resource:'lingzhi',qty:2},{resource:'ginseng',qty:1}], effect:'-15%狩猎时间', durationMin:45 },
  { id:'dragon_feast', name:'龙肉盛宴', emoji:'🍗', inputs:[{resource:'hide_8',qty:3},{resource:'dragonblood',qty:2},{resource:'spiritberry',qty:2}], effect:'+10%全属性', durationMin:120 },
  { id:'grilled_fish', name:'烤鱼', emoji:'🐟', inputs:[{resource:'fish_0',qty:3},{resource:'dandelion',qty:1}], effect:'+15%钓鱼速度', durationMin:30 },
  { id:'fish_soup', name:'鲜鱼汤', emoji:'🍜', inputs:[{resource:'fish_2',qty:2},{resource:'mint',qty:2},{resource:'blueberry',qty:1}], effect:'+20%经验获取', durationMin:45 },
  { id:'sushi_plate', name:'刺身拼盘', emoji:'🍣', inputs:[{resource:'fish_4',qty:2},{resource:'goji',qty:2},{resource:'rosemary',qty:1}], effect:'+20%暴击伤害', durationMin:45 },
  { id:'seafood_platter', name:'海鲜大餐', emoji:'🦞', inputs:[{resource:'fish_6',qty:2},{resource:'dragonherb',qty:1},{resource:'spiritberry',qty:1}], effect:'+15%全属性', durationMin:90 },
  { id:'feast_of_the_deep', name:'深渊盛宴', emoji:'🦑', inputs:[{resource:'fish_8',qty:3},{resource:'dragonblood',qty:1},{resource:'nightberry',qty:2}], effect:'+20%全属性 +10%掉率', durationMin:120 },
  { id:'magic_brew', name:'魔莓酿', emoji:'🍷', inputs:[{resource:'nightberry',qty:3},{resource:'magicberry',qty:2}], effect:'+25%法术伤害', durationMin:45 },
  { id:'ancient_elixir', name:'远古灵药', emoji:'🧪', inputs:[{resource:'ancientberry',qty:2},{resource:'cranberry',qty:2},{resource:'dragonblood',qty:1}], effect:'+30%全经验获取', durationMin:60 },
];
export const POTION_RECIPES: { id:string;name:string;emoji:string;inputs:{resource:string;qty:number}[];effect:string;durationMin:number }[] = [
  { id:'health_potion', name:'生命药水', emoji:'❤️', inputs:[{resource:'dandelion',qty:3}], effect:'回复50%HP', durationMin:0 },
  { id:'greater_health', name:'强效生命药水', emoji:'💖', inputs:[{resource:'ginseng',qty:2},{resource:'lingzhi',qty:1},{resource:'dandelion',qty:2}], effect:'回复100%HP', durationMin:0 },
  { id:'strength_potion', name:'力量药水', emoji:'💪', inputs:[{resource:'rosemary',qty:3},{resource:'ginseng',qty:1}], effect:'+25%攻击力', durationMin:30 },
  { id:'iron_potion', name:'铁皮药水', emoji:'🛡️', inputs:[{resource:'marigold',qty:3},{resource:'thyme',qty:2}], effect:'+25%防御力', durationMin:30 },
  { id:'speed_potion', name:'速度药水', emoji:'⚡', inputs:[{resource:'mint',qty:4},{resource:'rosemary',qty:1}], effect:'+20%采集速度', durationMin:30 },
  { id:'luck_potion', name:'幸运药水', emoji:'🍀', inputs:[{resource:'marigold',qty:3},{resource:'lingzhi',qty:2}], effect:'+15%掉率', durationMin:45 },
  { id:'crit_potion', name:'精准药水', emoji:'🎯', inputs:[{resource:'thyme',qty:3},{resource:'dragonherb',qty:1}], effect:'+15%暴击率', durationMin:30 },
  { id:'leech_potion', name:'吸血药水', emoji:'🩸', inputs:[{resource:'dragonblood',qty:2},{resource:'phoenix_flower',qty:1}], effect:'+10%吸血', durationMin:30 },
  { id:'fish_oil', name:'鱼油精华', emoji:'🐟', inputs:[{resource:'fish_1',qty:5}], effect:'+10%掉率', durationMin:30 },
  { id:'mercury_elixir', name:'深海灵药', emoji:'🌊', inputs:[{resource:'fish_5',qty:3},{resource:'dragonherb',qty:2}], effect:'+30%钓鱼速度', durationMin:45 },
];
export const ACHIEVEMENTS: { id:string;name:string;desc:string;type:'kill'|'dungeon'|'skill';target:string;count:number;reward:string }[] = [
  { id:'kill_chicken_1000', name:'养鸡场主', desc:'击杀1000只小鸡', type:'kill', target:'chicken', count:1000, reward:'pet_chicken' },
  { id:'kill_cow_500', name:'牧场主人', desc:'击杀500头牛', type:'kill', target:'cow', count:500, reward:'pet_cow' },
  { id:'skill_wood_50', name:'伐木大师', desc:'伐木50级', type:'skill', target:'woodcutting', count:50, reward:'pet_beaver' },
];
export const PETS: { id:string;name:string;emoji:string;achievement:string;buff:string;buffDesc:string }[] = [
  { id:'pet_chicken', name:'小鸡', emoji:'🐔', achievement:'kill_chicken_1000', buff:'combatXp', buffDesc:'+5%战斗XP' },
  { id:'pet_cow', name:'小牛', emoji:'🐄', achievement:'kill_cow_500', buff:'gold', buffDesc:'+10%金币' },
  { id:'pet_beaver', name:'河狸', emoji:'🦫', achievement:'skill_wood_50', buff:'woodSpeed', buffDesc:'-10%伐木时间' },
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
  { id:'blizzard',name:'暴风雪',emoji:'❄️',style:'magic',type:'aoe',dmgMul:0.65,dotTicks:0,cooldownSec:12,desc:'群体65%' },
  { id:'curse',name:'诅咒',emoji:'👁️',style:'magic',type:'dot',dmgMul:0.15,dotTicks:3,cooldownSec:14,desc:'Dot15%×3' },
  { id:'holy_strike',name:'圣光打击',emoji:'⚡',style:'melee',type:'nuke',class:'圣骑士',dmgMul:2.0,dotTicks:0,cooldownSec:10,desc:'200%' },
  { id:'furious_slash',name:'狂暴斩',emoji:'💢',style:'melee',type:'nuke',class:'狂战士',dmgMul:2.5,dotTicks:0,cooldownSec:10,desc:'250%' },
  { id:'iaido',name:'居合斩',emoji:'⚔️',style:'melee',type:'nuke',class:'武士',dmgMul:2.8,dotTicks:0,cooldownSec:12,desc:'280%' },
  { id:'assassinate',name:'暗杀',emoji:'🗡️',style:'ranged',type:'nuke',class:'刺客',dmgMul:2.8,dotTicks:0,cooldownSec:14,desc:'280%' },
  { id:'power_shot',name:'强力射击',emoji:'🏹',style:'ranged',type:'nuke',class:'游侠',dmgMul:2.2,dotTicks:0,cooldownSec:9,desc:'220%' },
  { id:'piercing_shot',name:'穿甲箭',emoji:'🎯',style:'ranged',type:'nuke',class:'神射手',dmgMul:2.4,dotTicks:0,cooldownSec:8,desc:'240%' },
  { id:'soul_drain',name:'灵魂吸取',emoji:'💀',style:'magic',type:'nuke',class:'死灵法师',dmgMul:2.1,dotTicks:0,cooldownSec:9,desc:'210%' },
  { id:'toxic_burst',name:'毒爆',emoji:'🧪',style:'magic',type:'nuke',class:'剧毒术士',dmgMul:2.0,dotTicks:0,cooldownSec:8,desc:'200%' },
  { id:'meteor_storm',name:'陨石',emoji:'☄️',style:'magic',type:'nuke',class:'元素师',dmgMul:2.5,dotTicks:0,cooldownSec:12,desc:'250%' },
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

