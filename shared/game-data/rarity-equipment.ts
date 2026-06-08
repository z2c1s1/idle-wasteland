// ─── Rarity system ─────────────────────────────────────────────────────────────
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';

export const RARITY_LABEL: Record<Rarity, string> = {
  common:    '普通',
  uncommon:  '优良',
  rare:      '稀有',
  epic:      '史诗',
  legendary: '传说',
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
  vitality:      '体质',
  intelligence:  '科技',
  armour:        '护甲',
  damage_percent:'最终伤害',
  life_on_hit:   '命中回血',
  overpower:     '重击',
  lucky_hit:     '掉落概率',
  life_regen:    '生命回复',
  resist_all:    '辐射抗性',
  life_leech:    '生命汲取',
  crit_damage:   '暴击伤害',
  attack_speed:  '攻击速度',
  thorns:        '反伤',
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
  damage_percent:'+1% 最终伤害/点',
  life_on_hit:   '+1 生命/命中',
  overpower:     '+1% 强击概率 — 额外伤害等于最大生命 1%',
  lucky_hit:     '+1% 掉落概率 — 提升装备稀有度',
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
  { type:'spellblade',  name:'战斗技巧',   cMin:100,cMax:100,mMin:5,mMax:30, desc:(_,m)=>`攻击+${m}%` },
  { type:'vampiric',    name:'嗜血',       cMin:10,cMax:30,mMin:5,mMax:20, desc:(c,m)=>`${c}%概率击杀回${m}HP` },
  { type:'skill_rank',  name:'+技能等级',  cMin:100,cMax:100,mMin:1,mMax:3, desc:(_,m)=>`技能等级+${m}` },
  { type:'meteor',          name:'破片手雷',   cMin:1,cMax:25,mMin:100,mMax:200, desc:(c,m)=>`${c}%破片${m}%伤害` },
  { type:'chain_lightning', name:'电弧',       cMin:1,cMax:25,mMin:50,mMax:150, desc:(c,m)=>`${c}%电弧${m}%伤害` },
  { type:'frost_nova',      name:'液氮喷溅',   cMin:1,cMax:20,mMin:1,mMax:1, desc:(c,_)=>`${c}%冻结1回合` },
  { type:'blood_sacrifice', name:'肾上腺素',   cMin:100,cMax:100,mMin:5,mMax:20, desc:(_,m)=>`消耗${m}%HP换伤害` },
  { type:'shadow_clone',    name:'战术翻滚',   cMin:1,cMax:15,mMin:100,mMax:200, desc:(c,m)=>`${c}%闪避反击${m}%` },
  { type:'divine_shield',   name:'防弹插板',   cMin:1,cMax:20,mMin:1,mMax:1, desc:(c,_)=>`${c}%概率免伤` },
  { type:'execute',         name:'致命一击',   cMin:1,cMax:25,mMin:1,mMax:1, desc:(c,_)=>`${c}%斩杀HP<20%` },
  { type:'avalanche',       name:'连爆',       cMin:1,cMax:20,mMin:100,mMax:200, desc:(c,m)=>`暴击${c}%追加${m}%` },
  { type:'cleave',          name:'横扫',       cMin:1,cMax:25,mMin:50,mMax:150, desc:(c,m)=>`${c}%横扫${m}%` },
  { type:'corpse_explosion',name:'尸爆',       cMin:1,cMax:20,mMin:10,mMax:50, desc:(c,m)=>`${c}%尸爆${m}%` },
  { type:'iron_maiden',     name:'尖刺陷阱',   cMin:1,cMax:25,mMin:10,mMax:50, desc:(c,m)=>`${c}%反伤${m}%` },
  { type:'mortal_strike',   name:'破甲弹',     cMin:1,cMax:20,mMin:10,mMax:40, desc:(c,m)=>`${c}%弱化${m}%` },
  { type:'reincarnation',   name:'急救针',     cMin:1,cMax:15,mMin:20,mMax:60, desc:(c,m)=>`${c}%复活${m}%HP` },
  { type:'frenzy',          name:'狂暴',       cMin:1,cMax:20,mMin:10,mMax:40, desc:(c,m)=>`${c}%狂暴+${m}%` },
  { type:'arcane_barrage',  name:'连射',       cMin:1,cMax:20,mMin:2,mMax:5, desc:(c,m)=>`${c}%追加${m}击` },
  { type:'last_stand',      name:'背水一战',   cMin:1,cMax:25,mMin:20,mMax:60, desc:(c,m)=>`HP<${m}%时${Math.floor(m*0.8)}%减伤` },
];

const RARITY_SKILL_COUNT: Record<Rarity, number> = {
  common: 0, uncommon: 0, rare: 1, epic: 2, legendary: 3, mythic: 4,
};
const RARITY_MAX_SOCKETS: Record<Rarity, number> = {
  common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4, mythic: 5,
};

export function rollSkills(rarity: Rarity): ItemSkill[] {
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

export function rollSockets(rarity: Rarity): number {
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
    { id:'pipe',         name:'水管',     emoji:'🔧', slot:'weapon', reqIlvl:1,  minDamage:2,  maxDamage:6,  baseDefence:0, combatStyle:'melee' },
    { id:'machete',      name:'砍刀',     emoji:'🔪', slot:'weapon', reqIlvl:8,  minDamage:4,  maxDamage:10, baseDefence:0, combatStyle:'melee' },
    { id:'fire_axe',     name:'消防斧',   emoji:'🪓', slot:'weapon', reqIlvl:15, minDamage:6,  maxDamage:15, baseDefence:0, combatStyle:'melee' },
    { id:'crowbar',      name:'撬棍',     emoji:'🔩', slot:'weapon', reqIlvl:25, minDamage:10, maxDamage:22, baseDefence:0, combatStyle:'melee' },
    { id:'sledgehammer', name:'大锤',     emoji:'🔨', slot:'weapon', reqIlvl:35, minDamage:14, maxDamage:30, baseDefence:0, combatStyle:'melee' },
    { id:'chainsaw',     name:'电锯',     emoji:'🪚', slot:'weapon', reqIlvl:48, minDamage:20, maxDamage:45, baseDefence:0, combatStyle:'melee' },
    { id:'power_fist',   name:'动力拳套', emoji:'🤛', slot:'weapon', reqIlvl:60, minDamage:28, maxDamage:62, baseDefence:0, combatStyle:'melee' },
    // Ranged weapons
    { id:'slingshot',     name:'弹弓',     emoji:'🏹', slot:'weapon', reqIlvl:1,  minDamage:1, maxDamage:5,  baseDefence:0, combatStyle:'ranged' },
    { id:'hunting_rifle', name:'猎枪',     emoji:'🔫', slot:'weapon', reqIlvl:10, minDamage:3, maxDamage:9,  baseDefence:0, combatStyle:'ranged' },
    { id:'assault_rifle', name:'突击步枪', emoji:'🔫', slot:'weapon', reqIlvl:22, minDamage:5, maxDamage:14, baseDefence:0, combatStyle:'ranged' },
    { id:'shotgun',       name:'霰弹枪',   emoji:'🔫', slot:'weapon', reqIlvl:35, minDamage:8, maxDamage:22, baseDefence:0, combatStyle:'ranged' },
    { id:'sniper_rifle',  name:'狙击枪',   emoji:'🔫', slot:'weapon', reqIlvl:48, minDamage:12,maxDamage:35, baseDefence:0, combatStyle:'ranged' },
    { id:'gauss_rifle',   name:'高斯步枪', emoji:'🔫', slot:'weapon', reqIlvl:62, minDamage:18,maxDamage:50, baseDefence:0, combatStyle:'ranged' },
    // 投掷物 / 重武器
    { id:'molotov',       name:'燃烧瓶',   emoji:'🍾', slot:'weapon',reqIlvl:1, minDamage:2,maxDamage:7, baseDefence:0, combatStyle:'magic' },
    { id:'pipe_bomb',     name:'土制炸药', emoji:'💣', slot:'weapon',reqIlvl:12,minDamage:4,maxDamage:12,baseDefence:0, combatStyle:'magic' },
    { id:'grenade',       name:'手榴弹',   emoji:'💣', slot:'weapon',reqIlvl:25,minDamage:6,maxDamage:18,baseDefence:0, combatStyle:'magic' },
    { id:'flamethrower',  name:'火焰喷射器',emoji:'🔥',slot:'weapon',reqIlvl:38,minDamage:9,maxDamage:26,baseDefence:0, combatStyle:'magic' },
    { id:'rpg',           name:'火箭筒',   emoji:'🚀', slot:'weapon',reqIlvl:52,minDamage:13,maxDamage:38,baseDefence:0, combatStyle:'magic' },
    { id:'dynamite_bundle',name:'炸药捆',  emoji:'🧨', slot:'weapon',reqIlvl:65,minDamage:18,maxDamage:52,baseDefence:0, combatStyle:'magic' },
  ],
  offhand: [
    { id:'scrap_shield',   name:'废铁盾',   emoji:'🛡️', slot:'offhand', reqIlvl:1,  minDamage:0, maxDamage:0, baseDefence:5,  implicit:{type:'armour',value:5} },
    { id:'riot_shield',    name:'防暴盾',   emoji:'🛡️', slot:'offhand', reqIlvl:15, minDamage:0, maxDamage:0, baseDefence:15, implicit:{type:'armour',value:12} },
    { id:'ballistic_shield',name:'防弹盾',  emoji:'🛡️', slot:'offhand', reqIlvl:30, minDamage:0, maxDamage:0, baseDefence:28, implicit:{type:'armour',value:22} },
    { id:'energy_shield',  name:'合金重盾', emoji:'🛡️', slot:'offhand', reqIlvl:55, minDamage:0, maxDamage:0, baseDefence:50, implicit:{type:'armour',value:40} },
  ],
  helmet: [
    { id:'cloth_hood',    name:'布兜帽',   emoji:'⛑️', slot:'helmet', reqIlvl:1,  minDamage:0, maxDamage:0, baseDefence:3 },
    { id:'hard_hat',      name:'安全帽',   emoji:'⛑️', slot:'helmet', reqIlvl:12, minDamage:0, maxDamage:0, baseDefence:10 },
    { id:'military_helmet',name:'军用头盔', emoji:'⛑️', slot:'helmet', reqIlvl:28, minDamage:0, maxDamage:0, baseDefence:22 },
    { id:'power_helmet',  name:'动力头盔', emoji:'⛑️', slot:'helmet', reqIlvl:55, minDamage:0, maxDamage:0, baseDefence:40 },
  ],
  chest: [
    { id:'leather_jacket',name:'皮夹克',   emoji:'🧥', slot:'chest', reqIlvl:1,  minDamage:0, maxDamage:0, baseDefence:8 },
    { id:'kevlar_vest',   name:'防弹背心', emoji:'🧥', slot:'chest', reqIlvl:18, minDamage:0, maxDamage:0, baseDefence:25 },
    { id:'combat_armor',  name:'战斗装甲', emoji:'🧥', slot:'chest', reqIlvl:35, minDamage:0, maxDamage:0, baseDefence:48 },
    { id:'power_armor',   name:'动力装甲', emoji:'🧥', slot:'chest', reqIlvl:58, minDamage:0, maxDamage:0, baseDefence:80 },
  ],
  legs: [
    { id:'cargo_pants',  name:'工装裤',   emoji:'👖', slot:'legs', reqIlvl:1,  minDamage:0, maxDamage:0, baseDefence:6 },
    { id:'combat_pants', name:'战斗裤',   emoji:'👖', slot:'legs', reqIlvl:20, minDamage:0, maxDamage:0, baseDefence:20 },
    { id:'armored_legs', name:'装甲护腿', emoji:'👖', slot:'legs', reqIlvl:40, minDamage:0, maxDamage:0, baseDefence:38 },
    { id:'power_legs',   name:'动力腿甲', emoji:'👖', slot:'legs', reqIlvl:60, minDamage:0, maxDamage:0, baseDefence:62 },
  ],
  gloves: [
    { id:'work_gloves',   name:'工作手套', emoji:'🧤', slot:'gloves', reqIlvl:1,  minDamage:0, maxDamage:0, baseDefence:2 },
    { id:'tactical_gloves',name:'战术手套', emoji:'🧤', slot:'gloves', reqIlvl:20, minDamage:0, maxDamage:0, baseDefence:8 },
    { id:'power_gloves',  name:'动力手套', emoji:'🧤', slot:'gloves', reqIlvl:42, minDamage:0, maxDamage:0, baseDefence:16 },
  ],
  boots: [
    { id:'work_boots',    name:'工装靴',   emoji:'👢', slot:'boots', reqIlvl:1,  minDamage:0, maxDamage:0, baseDefence:3 },
    { id:'combat_boots',  name:'战斗靴',   emoji:'👢', slot:'boots', reqIlvl:20, minDamage:0, maxDamage:0, baseDefence:10 },
    { id:'armored_boots', name:'装甲靴',   emoji:'👢', slot:'boots', reqIlvl:38, minDamage:0, maxDamage:0, baseDefence:20 },
    { id:'power_boots',   name:'动力靴',   emoji:'👢', slot:'boots', reqIlvl:58, minDamage:0, maxDamage:0, baseDefence:35 },
  ],
  neck: [
    { id:'dog_tag',       name:'军牌',     emoji:'📿', slot:'neck', reqIlvl:1,  minDamage:0, maxDamage:0, baseDefence:0 },
    { id:'geiger_counter',name:'盖革计数器',emoji:'📿', slot:'neck', reqIlvl:20, minDamage:0, maxDamage:0, baseDefence:0, implicit:{type:'vitality',value:5} },
    { id:'rad_badge',     name:'辐射徽章', emoji:'📿', slot:'neck', reqIlvl:40, minDamage:0, maxDamage:0, baseDefence:0, implicit:{type:'vitality',value:12} },
    { id:'quantum_locket',name:'量子吊坠', emoji:'📿', slot:'neck', reqIlvl:60, minDamage:0, maxDamage:0, baseDefence:0, implicit:{type:'vitality',value:20} },
  ],
  ring: [
    { id:'copper_ring', name:'铜戒指',   emoji:'💍', slot:'ring', reqIlvl:1,  minDamage:0, maxDamage:0, baseDefence:0 },
    { id:'silver_ring', name:'银戒指',   emoji:'💍', slot:'ring', reqIlvl:20, minDamage:0, maxDamage:0, baseDefence:0, implicit:{type:'dexterity',value:3} },
    { id:'gold_ring',   name:'金戒指',   emoji:'💍', slot:'ring', reqIlvl:38, minDamage:0, maxDamage:0, baseDefence:0, implicit:{type:'dexterity',value:6} },
    { id:'titanium_ring',name:'钛金戒',  emoji:'💍', slot:'ring', reqIlvl:60, minDamage:0, maxDamage:0, baseDefence:0, implicit:{type:'dexterity',value:12} },
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
  // ── 近战武器 ──────────────────────────────────────────────────────────────
  {
    id:'frost_fang', name:'急冻水管', emoji:'🔧', slot:'weapon', ilvl:8, minEnemyIndex:1,
    flavorText:'从废弃冷库拆下的液氮冷却管，一击即可让丧尸冻成冰棍。',
    affixes:[{type:'strength',value:8},{type:'dexterity',value:6},{type:'damage_percent',value:15}],
    skills:[{type:"poison",name:"冻伤",chance:4,magnitude:4,description:"每次攻击追加 4 点冻伤"}],
    legendaryPower:'攻击时 15% 概率触发液氮喷溅，冻结敌人 1 回合',
  },
  {
    id:'shadow_blade', name:'暗夜砍刀', emoji:'🔪', slot:'weapon', ilvl:38, minEnemyIndex:4,
    flavorText:'在废弃军营里找到的战术砍刀，黑暗中能悄无声息地割开丧尸的喉咙。',
    affixes:[{type:'dexterity',value:16},{type:'crit_damage',value:20},{type:'life_leech',value:10},{type:'attack_speed',value:15}],
    skills:[{type:"doublestrike",name:"连斩",chance:25,magnitude:25,description:"25% 概率每回合攻击两次"}],
    legendaryPower:'攻击时 10% 概率战术翻滚，复制本次全部伤害',
  },
  {
    id:'giant_smash_axe', name:'消防斧', emoji:'🪓', slot:'weapon', ilvl:42, minEnemyIndex:5,
    flavorText:'从废弃消防站找到的专业消防斧，劈开变异体的脑壳就像劈柴一样简单。',
    affixes:[{type:'strength',value:22},{type:'overpower',value:20},{type:'damage_percent',value:25}],
    skills:[{type:"berserk",name:"肾上腺素",chance:30,magnitude:30,description:"HP < 30% 时攻击力提升 30%"}],
  },
  {
    id:'flame_tongue_sword', name:'燃烧电锯', emoji:'🪚', slot:'weapon', ilvl:58, minEnemyIndex:6,
    flavorText:'改装过的工业电锯，油箱里灌满了从废弃加油站抽来的混合燃料。',
    affixes:[{type:'damage_percent',value:35},{type:'strength',value:24},{type:'crit_damage',value:18},{type:'life_leech',value:10}],
    skills:[{type:"spellblade",name:"引擎过载",chance:25,magnitude:25,description:"攻击力额外提升 25%"}],
  },
  {
    id:'eternity_blade', name:'废土制裁者', emoji:'🔩', slot:'weapon', ilvl:70, minEnemyIndex:7,
    flavorText:'一把用核反应堆废料锻造的动力锤，据说能一击打穿避难所科技的金库大门。',
    affixes:[{type:'strength',value:35},{type:'damage_percent',value:50},{type:'crit_damage',value:25},{type:'overpower',value:20},{type:'life_leech',value:15}],
    skills:[{type:"spellblade",name:"核能驱动",chance:30,magnitude:30,description:"攻击力额外提升 30%"}],
  },
  // ── 防具 ──────────────────────────────────────────────────────────────────
  {
    id:'skeletal_crown', name:'防化头盔', emoji:'⛑️', slot:'helmet', ilvl:22, minEnemyIndex:3,
    flavorText:'战前军方遗留的防化装备，内置呼吸器能过滤大部分辐射尘埃。',
    affixes:[{type:'vitality',value:12},{type:'armour',value:15},{type:'life_regen',value:5},{type:'resist_all',value:8}],
    skills:[{type:"thorns",name:"防化涂层",chance:10,magnitude:10,description:"被击中时反弹 10 点伤害"}],
  },
  {
    id:'andariel_visage', name:'辐射面罩', emoji:'⛑️', slot:'helmet', ilvl:35, minEnemyIndex:4,
    flavorText:'从医疗实验室搜刮来的防护面罩，镜片上还残留着前任主人的血迹。',
    affixes:[{type:'vitality',value:18},{type:'life_leech',value:8},{type:'crit_damage',value:15},{type:'damage_percent',value:15}],
    skills:[{type:"poison",name:"辐射残留",chance:8,magnitude:8,description:"每次攻击追加 8 点辐射伤害"}],
  },
  {
    id:'inferno_crown', name:'动力头盔', emoji:'⛑️', slot:'helmet', ilvl:65, minEnemyIndex:7,
    flavorText:'完整的动力装甲头盔，HUD 显示辐射剂量和生命体征，废土战士的终极装备。',
    affixes:[{type:'vitality',value:28},{type:'life_leech',value:18},{type:'lucky_hit',value:30},{type:'life_on_hit',value:25}],
    skills:[{type:"vampiric",name:"生命维持",chance:20,magnitude:20,description:"击杀时恢复 20 点生命"}],
  },
  {
    id:'giant_chest', name:'军用防弹衣', emoji:'🧥', slot:'chest', ilvl:45, minEnemyIndex:5,
    flavorText:'从军事基地捡来的重型防弹衣，插满了陶瓷防弹板，沉得要命但能救命。',
    affixes:[{type:'vitality',value:24},{type:'armour',value:35},{type:'resist_all',value:15},{type:'life_regen',value:8}],
  },
  {
    id:'dragonblood_plate', name:'动力装甲', emoji:'🧥', slot:'chest', ilvl:55, minEnemyIndex:6,
    flavorText:'避难所科技的最高杰作——T-60 动力装甲胸甲，核能电池驱动，坚不可摧。',
    affixes:[{type:'armour',value:55},{type:'vitality',value:30},{type:'resist_all',value:20},{type:'thorns',value:20}],
    skills:[{type:"thorns",name:"合金镀层",chance:20,magnitude:20,description:"被击中时反弹 20 点伤害"}],
  },
  {
    id:'dragonblood_legs', name:'动力腿甲', emoji:'👖', slot:'legs', ilvl:55, minEnemyIndex:6,
    flavorText:'T-60 动力装甲的液压护腿，穿着它可以踹飞一只死亡爪。',
    affixes:[{type:'armour',value:42},{type:'vitality',value:22},{type:'resist_all',value:15},{type:'life_regen',value:10}],
  },
  {
    id:'hellfire_plate', name:'核能反应甲', emoji:'🧥', slot:'chest', ilvl:65, minEnemyIndex:7,
    flavorText:'用反应堆外壳锻造的装甲，穿戴者仿佛站在反应堆核心，辐射护体。',
    affixes:[{type:'armour',value:70},{type:'vitality',value:35},{type:'thorns',value:25},{type:'resist_all',value:25},{type:'life_regen',value:15}],
    skills:[{type:"thorns",name:"辐射光环",chance:30,magnitude:30,description:"被击中时反弹 30 点伤害"}],
  },
  // ── 饰品 ──────────────────────────────────────────────────────────────────
  {
    id:'goblin_lucky_ring', name:'幸运瓶盖戒', emoji:'💍', slot:'ring', ilvl:12, minEnemyIndex:2,
    flavorText:'用核子可乐瓶盖打磨成的戒指，废土拾荒者相信它能带来好运。',
    affixes:[{type:'lucky_hit',value:25},{type:'intelligence',value:30},{type:'dexterity',value:4}],
  },
  {
    id:'tyrant_shield', name:'防暴盾牌', emoji:'🛡️', slot:'offhand', ilvl:35, minEnemyIndex:4,
    flavorText:'从废弃警局缴获的防暴盾牌，上面还留着变异体抓挠的痕迹。',
    affixes:[{type:'armour',value:30},{type:'resist_all',value:12},{type:'thorns',value:15},{type:'vitality',value:10}],
  },
  {
    id:'phantom_steps', name:'潜行靴', emoji:'👢', slot:'boots', ilvl:22, minEnemyIndex:3,
    flavorText:'软底战术靴，走在碎玻璃和瓦砾上几乎不发出声音——废土潜行者的最爱。',
    affixes:[{type:'dexterity',value:10},{type:'lucky_hit',value:20},{type:'intelligence',value:15}],
    skills:[{type:"dodge",name:"潜行",chance:18,magnitude:18,description:"18% 概率闪避所有伤害"}],
  },
  {
    id:'berserker_gloves', name:'狂战士拳套', emoji:'🧤', slot:'gloves', ilvl:28, minEnemyIndex:4,
    flavorText:'在废土格斗场里浸满鲜血的指虎拳套，佩戴者会感到一股原始的暴怒。',
    affixes:[{type:'strength',value:14},{type:'damage_percent',value:20},{type:'crit_damage',value:12},{type:'overpower',value:8}],
    skills:[{type:"berserk",name:"暴怒",chance:35,magnitude:35,description:"HP < 30% 时攻击力提升 35%"}],
  },
  {
    id:'hellhound_boots', name:'变异猎犬靴', emoji:'👢', slot:'boots', ilvl:42, minEnemyIndex:5,
    flavorText:'用变异猎犬皮缝制的靴子，穿上后奔跑速度快得惊人——就像在逃离尸潮。',
    affixes:[{type:'dexterity',value:14},{type:'attack_speed',value:20},{type:'life_on_hit',value:12}],
    skills:[{type:"vampiric",name:"猎杀本能",chance:15,magnitude:15,description:"击杀时恢复 15 点生命"}],
  },
  {
    id:'vampire_ring', name:'生命汲取戒', emoji:'💍', slot:'ring', ilvl:45, minEnemyIndex:5,
    flavorText:'一枚诡异的生物科技戒指，能将敌人的生命力转化为宿主的恢复能量。',
    affixes:[{type:'life_leech',value:12},{type:'life_on_hit',value:15},{type:'dexterity',value:8}],
    skills:[{type:"lifesteal",name:"生命汲取",chance:10,magnitude:10,description:"击中时吸取 10% 伤害恢复生命"}],
  },
  {
    id:'dragon_eye_necklace', name:'盖革计数器项坠', emoji:'📿', slot:'neck', ilvl:55, minEnemyIndex:6,
    flavorText:'改装过的盖革计数器，不仅能探测辐射，似乎还能感应到附近的物资。',
    affixes:[{type:'lucky_hit',value:40},{type:'intelligence',value:35},{type:'vitality',value:15},{type:'life_on_hit',value:20}],
  },
  {
    id:'touch_of_darkness', name:'战术手套', emoji:'🧤', slot:'gloves', ilvl:58, minEnemyIndex:6,
    flavorText:'特种部队留下的战术手套，指尖的碳纤维纹路让每一次攻击都精准致命。',
    affixes:[{type:'strength',value:20},{type:'crit_damage',value:25},{type:'life_leech',value:15},{type:'attack_speed',value:20}],
    skills:[{type:"doublestrike",name:"连击训练",chance:30,magnitude:30,description:"30% 概率每回合攻击两次"}],
  },
  {
    id:'time_keeper_ring', name:'战术计时戒', emoji:'💍', slot:'ring', ilvl:65, minEnemyIndex:7,
    flavorText:'一块还能工作的战前军表改装成的戒指，精准的计时让你在战斗中抢占先机。',
    affixes:[{type:'attack_speed',value:30},{type:'dexterity',value:20},{type:'crit_damage',value:20},{type:'lucky_hit',value:25}],
    skills:[{type:"doublestrike",name:"战术节奏",chance:35,magnitude:35,description:"35% 概率每回合攻击两次"}],
  },
  {
    id:'eternity_shield', name:'避难所大门', emoji:'🛡️', slot:'offhand', ilvl:70, minEnemyIndex:7,
    flavorText:'从一座废弃避难所拆下来的合金防爆门，没有东西能打穿这玩意儿。',
    affixes:[{type:'armour',value:80},{type:'vitality',value:40},{type:'resist_all',value:30},{type:'thorns',value:30},{type:'life_regen',value:20}],
  },
  // ── 副本独有：废弃超市 ────────────────────────────────────────────────────
  {
    id:'d_rotten_core', name:'腐烂防护服', emoji:'🪨', slot:'chest', ilvl:15, minEnemyIndex:99,
    flavorText:'从超市冷库找到的防护服，上面覆盖着厚厚一层不知名的有机黏液。',
    affixes:[{type:'armour',value:18},{type:'vitality',value:10},{type:'life_regen',value:4},{type:'resist_all',value:6}],
  },
  {
    id:'d_corrosion_pick', name:'锈蚀撬棍', emoji:'🔩', slot:'weapon', ilvl:13, minEnemyIndex:99,
    flavorText:'Gordon Freeman 会喜欢这把撬棍——锈迹斑斑但依然致命。',
    affixes:[{type:'strength',value:10},{type:'damage_percent',value:12}],
    skills:[{type:"poison",name:"破伤风",chance:6,magnitude:6,description:"每次攻击追加 6 点感染伤害"}],
  },
  // ── 副本独有：废弃医院 ────────────────────────────────────────────────────
  {
    id:'d_specter_cloak', name:'手术服披风', emoji:'🌑', slot:'chest', ilvl:25, minEnemyIndex:99,
    flavorText:'用医院消毒室的铅帘改造成的披风，能屏蔽部分辐射还能让你在黑暗中隐形。',
    affixes:[{type:'armour',value:22},{type:'dexterity',value:14},{type:'life_leech',value:6}],
    skills:[{type:"dodge",name:"铅幕",chance:22,magnitude:22,description:"22% 概率闪避所有伤害"}],
  },
  {
    id:'d_shadow_sigil', name:'医疗警报戒', emoji:'🔮', slot:'ring', ilvl:23, minEnemyIndex:99,
    flavorText:'一枚改装过的病人呼叫器，微弱电脉冲刺激神经让你的反应速度大幅提升。',
    affixes:[{type:'lucky_hit',value:30},{type:'dexterity',value:12},{type:'attack_speed',value:12}],
  },
  // ── 副本独有：废弃警局 ────────────────────────────────────────────────────
  {
    id:'d_flame_crown', name:'防暴头盔', emoji:'👑', slot:'helmet', ilvl:40, minEnemyIndex:99,
    flavorText:'防暴警察的标准装备，经历过无数次镇压，面罩上的裂痕是荣誉的证明。',
    affixes:[{type:'vitality',value:20},{type:'damage_percent',value:22},{type:'crit_damage',value:18}],
    skills:[{type:"poison",name:"催泪瓦斯",chance:10,magnitude:10,description:"每次攻击追加 10 点瓦斯伤害"}],
  },
  {
    id:'d_ember_ring', name:'警徽戒指', emoji:'💍', slot:'ring', ilvl:38, minEnemyIndex:99,
    flavorText:'用熔化了的旧警徽铸成的戒指，承载着法律与秩序的最后残光。',
    affixes:[{type:'dexterity',value:18},{type:'attack_speed',value:18},{type:'intelligence',value:20}],
    skills:[{type:"spellblade",name:"执法者",chance:18,magnitude:18,description:"攻击力额外提升 18%"}],
  },
  // ── 副本独有：废弃军事基地 ────────────────────────────────────────────────
  {
    id:'d_void_blade', name:'实验性振动刀', emoji:'🗡️', slot:'weapon', ilvl:55, minEnemyIndex:99,
    flavorText:'军方秘密研制的近战武器，高频振动分子刃能切开任何已知物质。',
    affixes:[{type:'strength',value:28},{type:'damage_percent',value:35},{type:'crit_damage',value:22},{type:'overpower',value:18}],
    skills:[{type:"doublestrike",name:"高频切割",chance:30,magnitude:30,description:"30% 概率每回合攻击两次"}],
  },
  {
    id:'d_nullity_plate', name:'军用复合装甲', emoji:'🛡️', slot:'chest', ilvl:58, minEnemyIndex:99,
    flavorText:'用坦克反应装甲改造的胸甲，能够吸收来自任何方向的攻击动能。',
    affixes:[{type:'armour',value:55},{type:'vitality',value:30},{type:'resist_all',value:18},{type:'life_regen',value:12}],
  },
  // ── 副本独有：核反应堆核心 ────────────────────────────────────────────────
  {
    id:'d_bone_dragon_shield', name:'反应堆护盾', emoji:'🦴', slot:'offhand', ilvl:68, minEnemyIndex:99,
    flavorText:'用反应堆控制棒材料铸成的盾牌，不仅能挡物理攻击还能吸收辐射。',
    affixes:[{type:'armour',value:65},{type:'resist_all',value:22},{type:'thorns',value:25}],
    skills:[{type:"vampiric",name:"辐射吸收",chance:20,magnitude:20,description:"击杀时恢复 20 点生命"}],
  },
  {
    id:'d_dracolich_mantle', name:'辐射防护服', emoji:'🧥', slot:'chest', ilvl:72, minEnemyIndex:99,
    flavorText:'全套辐射防护装备，内置的生命维持系统能在极端环境下维持穿戴者存活。',
    affixes:[{type:'vitality',value:40},{type:'armour',value:50},{type:'life_leech',value:14},{type:'crit_damage',value:20}],
  },
  // ── 副本独有：地下避难所金库 ──────────────────────────────────────────────
  {
    id:'d_chaos_edge', name:'避难所科技原型刀', emoji:'🔩', slot:'weapon', ilvl:85, minEnemyIndex:99,
    flavorText:'避难所科技的最高机密——一把使用未知合金锻造的近战武器，据说在实验阶段就杀死了 12 名研究员。',
    affixes:[{type:'strength',value:45},{type:'damage_percent',value:55},{type:'crit_damage',value:30},{type:'overpower',value:25},{type:'attack_speed',value:20}],
    skills:[{type:'spellblade',name:'实验过载',value:35,description:'攻击力额外提升 35%'},{type:'doublestrike',name:'双频振荡',value:30,description:'30% 概率每回合攻击两次'}],
  },
  {
    id:'d_primal_forge_armor', name:'避难所金库装甲', emoji:'🔱', slot:'chest', ilvl:88, minEnemyIndex:99,
    flavorText:'避难所科技金库的终极防御装备——据说穿上它的人可以走进核爆中心而毫发无伤。',
    affixes:[{type:'armour',value:90},{type:'vitality',value:55},{type:'resist_all',value:35},{type:'life_regen',value:25},{type:'life_leech',value:18}],
  },
  // ── 远程武器 ──────────────────────────────────────────────────────────────
  {
    id:'storm_bow', name:'电击弩', emoji:'🔫', slot:'weapon', ilvl:10, minEnemyIndex:1,
    flavorText:'用汽车电池和弩机改装的电击武器，射出的弩箭带着高压电流。',
    affixes:[{type:'dexterity',value:8},{type:'damage_percent',value:12},{type:'crit_damage',value:10}],
    skills:[{type:'chain_lightning',name:'电击箭',chance:15,magnitude:80,description:'15%概率释放电弧80%伤害'}],
    combatStyle:'ranged',
  },
  {
    id:'eagle_eye_crossbow', name:'猎鹿步枪', emoji:'🔫', slot:'weapon', ilvl:18, minEnemyIndex:2,
    flavorText:'一把保养良好的战前猎枪，带瞄准镜，废土上最可靠的伙伴之一。',
    affixes:[{type:'dexterity',value:14},{type:'crit_damage',value:20},{type:'attack_speed',value:10}],
    skills:[{type:'avalanche',name:'穿甲弹',chance:12,magnitude:150,description:'暴击时12%概率追加150%伤害'}],
    combatStyle:'ranged',
  },
  {
    id:'shadow_hunter_bow', name:'消音狙击枪', emoji:'🔫', slot:'weapon', ilvl:30, minEnemyIndex:3,
    flavorText:'用废铁和旧零件组装的消音狙击枪，一枪一个丧尸，不会惊动周围的尸群。',
    affixes:[{type:'dexterity',value:20},{type:'damage_percent',value:25},{type:'life_leech',value:8}],
    skills:[{type:'shadow_clone',name:'暗杀',chance:10,magnitude:180,description:'10%概率暗杀造成180%伤害'}],
    combatStyle:'ranged',
  },
  {
    id:'dragon_horn_bow', name:'自动霰弹枪', emoji:'🔫', slot:'weapon', ilvl:45, minEnemyIndex:4,
    flavorText:'一把改装过的 AA-12 全自动霰弹枪，近距离能把变异巨兽轰成筛子。',
    affixes:[{type:'dexterity',value:28},{type:'damage_percent',value:35},{type:'crit_damage',value:25},{type:'overpower',value:12}],
    skills:[{type:'meteor',name:'龙息弹',chance:15,magnitude:180,description:'15%概率龙息弹造成180%伤害'}],
    combatStyle:'ranged',
  },
  {
    id:'void_piercer', name:'反器材狙击枪', emoji:'🔫', slot:'weapon', ilvl:62, minEnemyIndex:5,
    flavorText:'.50 口径的反器材狙击步枪，子弹能穿透混凝土墙壁——对付死亡爪的终极方案。',
    affixes:[{type:'dexterity',value:36},{type:'damage_percent',value:45},{type:'crit_damage',value:35},{type:'overpower',value:15}],
    skills:[{type:'execute',name:'爆头',chance:18,magnitude:1,description:'18%概率直接爆头HP<20%敌人'}],
    combatStyle:'ranged',
  },
  // ── 能量武器 ──────────────────────────────────────────────────────────────
  {
    id:'flameheart_staff', name:'火焰喷射器', emoji:'🔥', slot:'weapon', ilvl:10, minEnemyIndex:1,
    flavorText:'用丙烷罐和喷灯改装成的简易火焰喷射器，对丧尸群有奇效。',
    affixes:[{type:'intelligence',value:9},{type:'damage_percent',value:15}],
    skills:[{type:'meteor',name:'燃烧弹',chance:12,magnitude:160,description:'12%概率燃烧弹造成160%伤害'}],
    combatStyle:'magic',
  },
  {
    id:'frost_weaver', name:'灭火器喷枪', emoji:'🧯', slot:'weapon', ilvl:20, minEnemyIndex:2,
    flavorText:'改装过的二氧化碳灭火器，近距离喷射能把丧尸冻僵在原地。',
    affixes:[{type:'intelligence',value:16},{type:'resist_all',value:8},{type:'armour',value:5}],
    skills:[{type:'frost_nova',name:'急冻',chance:18,magnitude:1,description:'18%概率冻结敌人1回合'}],
    combatStyle:'magic',
  },
  {
    id:'soul_reaper_staff', name:'电击棒', emoji:'⚡', slot:'weapon', ilvl:32, minEnemyIndex:3,
    flavorText:'用汽车电瓶和铜线圈自制的电击武器，每次电击都会反噬使用者。',
    affixes:[{type:'intelligence',value:24},{type:'life_leech',value:12},{type:'damage_percent',value:20}],
    skills:[{type:'blood_sacrifice',name:'过载',chance:100,magnitude:10,description:'消耗10%HP换取等量额外伤害'}],
    combatStyle:'magic',
  },
  {
    id:'arcane_infinity', name:'突击步枪', emoji:'🔫', slot:'weapon', ilvl:48, minEnemyIndex:4,
    flavorText:'从军事基地搜刮来的制式突击步枪，保养良好，弹匣容量惊人。',
    affixes:[{type:'intelligence',value:32},{type:'damage_percent',value:35},{type:'attack_speed',value:15},{type:'crit_damage',value:20}],
    skills:[{type:'arcane_barrage',name:'全自动',chance:12,magnitude:3,description:'12%概率追加3次射击'}],
    combatStyle:'magic',
  },
  {
    id:'cosmic_catalyst', name:'重型火焰喷射器', emoji:'🔥', slot:'weapon', ilvl:65, minEnemyIndex:5,
    flavorText:'军用级火焰喷射器，背囊式燃料罐能持续喷射凝固汽油，清理尸潮的不二之选。',
    affixes:[{type:'intelligence',value:45},{type:'damage_percent',value:50},{type:'crit_damage',value:30},{type:'resist_all',value:20},{type:'life_regen',value:10}],
    skills:[{type:'chain_lightning',name:'凝固汽油',chance:20,magnitude:150,description:'20%概率凝固汽油造成150%伤害'},{type:'divine_shield',name:'防火服',chance:10,magnitude:1,description:'10%概率获得防火护盾'}],
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
    name: '废土战士',
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
    name: '变异猎手',
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
    name: '辐射幸存者',
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

export type CombatStyle = "melee" | "ranged" | "magic";

// ─── Sub-stat system (Raid/SW-style weighted random) ────────────────────────────

export type SubStatType =
  | 'attackBonus' | 'defenceBonus' | 'hpBonus'
  | 'critRating' | 'enhancedDamage' | 'lifeLeech'
  | 'resistAll' | 'deadlyStrike' | 'crushingBlow';

export interface SubStat {
  type: SubStatType;
  value: number;
  /** Quality indicator: 0=low, 1=mid, 2=high roll (for display) */
  quality?: number;
}

export const SUB_STAT_LABEL: Record<SubStatType, string> = {
  attackBonus:    '攻击力',
  defenceBonus:   '防御力',
  hpBonus:        '生命值',
  critRating:     '暴击率',
  enhancedDamage: '最终伤害',
  lifeLeech:      '生命偷取',
  // attackSpeed removed — not meaningful in single-player idle combat
  resistAll:      '伤害减免',
  deadlyStrike:   '暴击伤害',
  crushingBlow:   '碾压打击',
};

/**
 * Raid/SW-style weighted sub-stat pool.
 * Flat stats (ATK/DEF/HP) = 50% total weight → common filler rolls.
 * Speed & rare procs = low weight → chase stats.
 */
export const SUB_STAT_WEIGHTS: Record<SubStatType, number> = {
  attackBonus:    3,   // flat ATK — common filler
  defenceBonus:   3,   // flat DEF — common filler
  hpBonus:        4,   // flat HP — most common, always useful
  critRating:     3,   // Crit Rate +1 from removed speed
  enhancedDamage: 2,   // Crit DMG
  lifeLeech:      1,   // Life Leech — rare
  resistAll:      2,   // Damage reduction
  deadlyStrike:   1,   // Double damage proc — rare
  crushingBlow:   1,   // Overpower proc — rare
};

/** Build a weighted pool array for random selection. */
export function buildWeightedSubStatPool(exclude: SubStatType[] = []): SubStatType[] {
  const pool: SubStatType[] = [];
  for (const [type, weight] of Object.entries(SUB_STAT_WEIGHTS)) {
    if (exclude.includes(type as SubStatType)) continue;
    for (let i = 0; i < weight; i++) pool.push(type as SubStatType);
  }
  return pool;
}

/**
 * Roll ranges per stat type, matching Raid/SW balance:
 * - Flat stats: wide range, but additive = weak at high ilvl
 * - % stats: tight low range, multiplicative = strong at high ilvl
 * - SPD: tiny range, most precious stat
 */
export function rollSubStatValue(type: SubStatType, ilvl: number): { value: number; quality: number } {
  const tier = Math.floor(ilvl / 10);
  const scale = 1 + tier * 0.15; // 15% per 10 ilvl tier

  let min: number, max: number, step: number;

  switch (type) {
    // ── Flat stats (wide range, filler) ──
    case 'attackBonus':
      min = 3;  max = 10;  step = 1;   break;
    case 'defenceBonus':
      min = 3;  max = 10;  step = 1;   break;
    case 'hpBonus':
      min = 10; max = 30;  step = 5;   break;

    // ── % stats (tight, multiplicative) ──
    case 'critRating':
      min = 2;  max = 6;   step = 1;   break;  // 2-6% per roll
    case 'enhancedDamage':
      min = 3;  max = 8;   step = 1;   break;  // 3-8% — wider than CR
    case 'lifeLeech':
      min = 1;  max = 3;   step = 0.5; break;  // 1-3% — small, sustain
    case 'deadlyStrike':
      min = 1;  max = 4;   step = 0.5; break;  // 1-4% — double damage proc
    case 'crushingBlow':
      min = 1;  max = 5;   step = 0.5; break;  // 1-5% — overpower proc

    // ── Flat reduction ──
    case 'resistAll':
      min = 1;  max = 4;   step = 1;   break;
  }

  // Quality: split range into thirds
  const third = (max - min) / 3;
  const roll = Math.random();
  let quality: number;
  let base: number;
  if (roll < 0.25)        { quality = 0; base = min + Math.random() * third; }
  else if (roll < 0.75)   { quality = 1; base = min + third + Math.random() * third; }
  else                     { quality = 2; base = min + 2 * third + Math.random() * third; }

  const scaled = Math.round((base * scale) / step) * step;
  const isPercent = ['critRating','enhancedDamage','lifeLeech','deadlyStrike','crushingBlow'].includes(type);
  const value = isPercent ? Math.round(scaled * 10) / 10 : Math.max(1, Math.floor(scaled));

  return { value, quality };
}

export const MAX_ENHANCE_LEVEL = 12;
export const ENHANCE_COST_PER_LEVEL = 30; // base gold per level × ilvl

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

