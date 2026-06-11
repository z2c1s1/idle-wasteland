import type {
  AffixType,
  CombatStyle,
  EquipmentSlot,
  GameItem,
  ItemAffix,
  Rarity,
} from "./rarity-equipment";
import {
  ALL_SLOTS,
  ITEM_SETS,
  rollSockets,
  SLOT_BASES,
  UNIQUE_ITEMS,
} from "./rarity-equipment";
import { ALL_CRAFTABLE_ITEMS, buildUniqueGameItem } from "./items-crafting";

// ─── Combat triangle ─────────────────────────────────────────────────────────
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

// ─── World Tier ────────────────────────────────────────────────────────────────

export type WorldTier = 1 | 2 | 3 | 4;

export const WORLD_TIER_LABEL: Record<WorldTier, string> = {
  1: '☢️ 辐射废土',
  2: '🔥 燃烧废土',
  3: '💀 深渊废土',
  4: '👑 终末废土',
};

/** Enemy HP multiplier per tier */
export const TIER_HP_MUL: Record<WorldTier, number> = { 1: 1, 2: 2, 3: 4, 4: 8 };
/** Enemy ATK multiplier per tier */
export const TIER_ATK_MUL: Record<WorldTier, number> = { 1: 1, 2: 1.5, 3: 2.5, 4: 4 };
/** Item level bonus per tier */
export const TIER_ILVL_BONUS: Record<WorldTier, number> = { 1: 0, 2: 10, 3: 20, 4: 30 };
/** Mythic drop rate multiplier per tier */
export const TIER_DROP_MUL: Record<WorldTier, number> = { 1: 1, 2: 1.3, 3: 1.6, 4: 2 };

/** Unlock requirement: total skill levels needed */
export const TIER_UNLOCK_LEVELS: Partial<Record<WorldTier, number>> = {
  2: 500,
  3: 1200,
  4: 1700,
};

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
  /** 暴击率 0-100，默认 0 */
  critRating?: number;
  /** 暴击伤害倍率，默认 1.5 */
  critDamage?: number;
  /** 攻速加成%，加快战斗周期，默认 0 */
  attackSpeed?: number;
}

export const ENEMIES: Enemy[] = [
  // LV 1-10: 废土底层生物
  { id:'rad_roach',   name:'变异蟑螂', emoji:'🪳', maxHp:12,  attack:1,  defence:0, xp:6,  drops:{gold:[1,2]},                    reqCombatLevel:1,  combatStyle:'melee' },
  { id:'rad_rat',     name:'辐射鼠',   emoji:'🐀', maxHp:18,  attack:2,  defence:0, xp:10, drops:{gold:[1,3]},                    reqCombatLevel:2,  combatStyle:'melee' },
  { id:'mutant_worm', name:'变异蠕虫', emoji:'🐛', maxHp:25,  attack:3,  defence:0, xp:14, drops:{gold:[2,4]},                    reqCombatLevel:3,  combatStyle:'melee' },
  { id:'stray_dog',   name:'流浪犬',   emoji:'🐕', maxHp:35,  attack:4,  defence:1, xp:20, drops:{gold:[2,5],bones:1},           reqCombatLevel:4,  combatStyle:'melee' },
  { id:'rad_mite',    name:'辐射螨虫', emoji:'🕷️', maxHp:45,  attack:5,  defence:1, xp:26, drops:{gold:[3,6]},                   reqCombatLevel:5,  combatStyle:'melee' },
  { id:'mutant_fly',  name:'变异蝇',   emoji:'🪰', maxHp:55,  attack:6,  defence:2, xp:32, drops:{gold:[3,7]},                   reqCombatLevel:6,  combatStyle:'ranged' },
  { id:'rad_hare',    name:'辐射野兔', emoji:'🐇', maxHp:65,  attack:7,  defence:2, xp:38, drops:{gold:[4,8],bones:1},           reqCombatLevel:7,  combatStyle:'melee' },
  { id:'mutant_crab', name:'变异蟹',   emoji:'🦀', maxHp:80,  attack:8,  defence:3, xp:45, drops:{gold:[4,9]},                   reqCombatLevel:8,  combatStyle:'melee' },
  { id:'rad_bat',     name:'辐射蝙蝠', emoji:'🦇', maxHp:90,  attack:9,  defence:3, xp:52, drops:{gold:[5,10]},                  reqCombatLevel:9,  combatStyle:'ranged', critRating:5 },
  { id:'mutant_hound',name:'变异猎犬', emoji:'🐺', maxHp:105, attack:10, defence:4, xp:60, drops:{gold:[5,12],bones:1},          reqCombatLevel:10, combatStyle:'melee' },
  // LV 11-20: 丧尸与变异体
  { id:'zombie_walk', name:'蹒跚丧尸', emoji:'🧟', maxHp:120, attack:11, defence:4, xp:68, drops:{gold:[6,14],bones:1},          reqCombatLevel:11, combatStyle:'melee' },
  { id:'rad_vulture', name:'辐射秃鹫', emoji:'🦅', maxHp:135, attack:12, defence:5, xp:76, drops:{gold:[7,16]},                  reqCombatLevel:12, combatStyle:'ranged' },
  { id:'mutant_spider',name:'变异蜘蛛',emoji:'🕸️',maxHp:150, attack:13, defence:5, xp:84, drops:{gold:[8,18]},                   reqCombatLevel:13, combatStyle:'melee' },
  { id:'ghoul_flesh', name:'食尸鬼',   emoji:'👹', maxHp:170, attack:14, defence:6, xp:92, drops:{gold:[9,20],bones:1},          reqCombatLevel:14, combatStyle:'melee' },
  { id:'rad_scorpion',name:'辐射蝎',  emoji:'🦂', maxHp:190, attack:15, defence:6, xp:100,drops:{gold:[10,22]},                  reqCombatLevel:15, combatStyle:'melee' },
  { id:'zombie_fast', name:'奔跑丧尸', emoji:'🏃', maxHp:210, attack:16, defence:7, xp:110,drops:{gold:[11,24],bones:1},         reqCombatLevel:16, combatStyle:'melee', attackSpeed:10 },
  { id:'mutant_snake',name:'变异蛇',   emoji:'🐍', maxHp:230, attack:17, defence:7, xp:120,drops:{gold:[12,26]},                 reqCombatLevel:17, combatStyle:'magic' },
  { id:'rad_crawler', name:'辐射爬行者',emoji:'🦎',maxHp:250, attack:18, defence:8, xp:130,drops:{gold:[13,28]},                 reqCombatLevel:18, combatStyle:'melee' },
  { id:'mutant_boar', name:'变异野猪', emoji:'🐗', maxHp:275, attack:19, defence:9, xp:140,drops:{gold:[14,30],bones:2},         reqCombatLevel:19, combatStyle:'melee' },
  { id:'zombie_brute',name:'壮硕丧尸', emoji:'💪', maxHp:300, attack:20, defence:10,xp:150,drops:{gold:[15,32],bones:2},         reqCombatLevel:20, combatStyle:'melee' },
  // LV 21-30: 变异掠食者
  { id:'rad_wolf',    name:'辐射狼',   emoji:'🐺', maxHp:325, attack:22, defence:11,xp:165,drops:{gold:[16,35],bones:2},         reqCombatLevel:21, combatStyle:'melee' },
  { id:'mutant_hyena',name:'变异鬣狗', emoji:'🦊', maxHp:350, attack:24, defence:12,xp:180,drops:{gold:[18,38],bones:2},         reqCombatLevel:22, combatStyle:'melee' },
  { id:'rad_wraith',  name:'辐射幽魂', emoji:'👻', maxHp:380, attack:26, defence:6, xp:195,drops:{gold:[20,42]},                 reqCombatLevel:23, combatStyle:'magic' },
  { id:'mutant_troll',name:'变异巨魔', emoji:'👹', maxHp:410, attack:28, defence:14,xp:210,drops:{gold:[22,46],bones:3},         reqCombatLevel:24, combatStyle:'melee' },
  { id:'rad_element', name:'辐射元素', emoji:'☢️', maxHp:440, attack:30, defence:8, xp:225,drops:{gold:[24,50]},                 reqCombatLevel:25, combatStyle:'magic' },
  { id:'mutant_bear', name:'变异熊',   emoji:'🐻', maxHp:475, attack:32, defence:16,xp:240,drops:{gold:[26,54],bones:3},         reqCombatLevel:26, combatStyle:'melee' },
  { id:'zombie_toxic',name:'毒雾丧尸', emoji:'☣️', maxHp:510, attack:34, defence:10,xp:255,drops:{gold:[28,58],bones:3},         reqCombatLevel:27, combatStyle:'magic' },
  { id:'rad_scream',  name:'辐射尖啸者',emoji:'📢',maxHp:545, attack:36, defence:11,xp:270,drops:{gold:[30,62]},                 reqCombatLevel:28, combatStyle:'ranged' },
  { id:'mutant_ape',  name:'变异猿',   emoji:'🦍', maxHp:580, attack:38, defence:18,xp:290,drops:{gold:[32,66],bones:4},         reqCombatLevel:29, combatStyle:'melee' },
  { id:'ghoul_rav',   name:'狂暴食尸鬼',emoji:'😡',maxHp:620, attack:40, defence:20,xp:310,drops:{gold:[35,70],bones:4},         reqCombatLevel:30, combatStyle:'melee' },
  // LV 31-40: 废土猎手
  { id:'rad_stalker', name:'辐射潜行者',emoji:'🦎',maxHp:660, attack:42, defence:22,xp:330,drops:{gold:[38,75],bones:4},         reqCombatLevel:31, combatStyle:'melee' },
  { id:'mutant_croc', name:'变异鳄',   emoji:'🐊', maxHp:700, attack:44, defence:24,xp:350,drops:{gold:[40,80],bones:5},         reqCombatLevel:32, combatStyle:'melee' },
  { id:'rad_horror',  name:'辐射恐魔', emoji:'👾', maxHp:745, attack:46, defence:12,xp:370,drops:{gold:[43,85]},                 reqCombatLevel:33, combatStyle:'magic' },
  { id:'mutant_wyrm', name:'变异巨蟒', emoji:'🐍', maxHp:790, attack:48, defence:14,xp:390,drops:{gold:[46,90]},                 reqCombatLevel:34, combatStyle:'magic' },
  { id:'zombie_armor',name:'装甲丧尸', emoji:'🛡️', maxHp:840, attack:50, defence:28,xp:415,drops:{gold:[50,95],bones:5},         reqCombatLevel:35, combatStyle:'melee' },
  { id:'rad_golem',   name:'辐射魔像', emoji:'🗿', maxHp:890, attack:52, defence:30,xp:440,drops:{gold:[54,100]},                reqCombatLevel:36, combatStyle:'melee' },
  { id:'mutant_rhino',name:'变异犀牛', emoji:'🦏', maxHp:940, attack:54, defence:32,xp:465,drops:{gold:[58,108],bones:6},        reqCombatLevel:37, combatStyle:'melee' },
  { id:'rad_banshee', name:'辐射女妖', emoji:'👻', maxHp:990, attack:56, defence:16,xp:490,drops:{gold:[62,115]},                reqCombatLevel:38, combatStyle:'ranged' },
  { id:'mutant_ogre', name:'变异食人魔',emoji:'👹',maxHp:1050,attack:58, defence:35,xp:520,drops:{gold:[66,122],bones:7},        reqCombatLevel:39, combatStyle:'melee' },
  { id:'deathclaw_pup',name:'死亡爪幼体',emoji:'🦎',maxHp:1100,attack:60,defence:38,xp:550,drops:{gold:[70,130],bones:8},       reqCombatLevel:40, combatStyle:'ranged' },
  // LV 41-50: 废土精英
  { id:'rad_titan',   name:'辐射巨人', emoji:'🦣', maxHp:1160,attack:64,defence:40,xp:580,drops:{gold:[75,140],bones:8},         reqCombatLevel:41, combatStyle:'melee' },
  { id:'mutant_drake',name:'变异龙兽', emoji:'🐉', maxHp:1220,attack:68,defence:22,xp:610,drops:{gold:[80,150],dragonBones:1},  reqCombatLevel:42, combatStyle:'magic' },
  { id:'zombie_alpha',name:'头目丧尸',emoji:'🧠',maxHp:1280,attack:72,defence:42,xp:640,drops:{gold:[85,160],bones:10},         reqCombatLevel:43, combatStyle:'melee' },
  { id:'rad_reaver',  name:'辐射掠夺者',emoji:'💀',maxHp:1340,attack:76,defence:25,xp:670,drops:{gold:[90,170],bones:10},        reqCombatLevel:44, combatStyle:'ranged' },
  { id:'mutant_hulk', name:'变异巨人', emoji:'💪', maxHp:1400,attack:80,defence:45,xp:700,drops:{gold:[95,180],bones:12},        reqCombatLevel:45, combatStyle:'melee' },
  { id:'rad_behemoth',name:'辐射巨兽', emoji:'☢️', maxHp:1470,attack:84,defence:28,xp:735,drops:{gold:[100,190],dragonBones:1}, reqCombatLevel:46, combatStyle:'magic' },
  { id:'ghoul_king',  name:'食尸鬼王', emoji:'👑', maxHp:1540,attack:88,defence:48,xp:770,drops:{gold:[108,200],bones:15},       reqCombatLevel:47, combatStyle:'melee' },
  { id:'mutant_tyrant',name:'变异暴君',emoji:'🦖',maxHp:1610,attack:92,defence:30,xp:805,drops:{gold:[115,215],dragonBones:2},  reqCombatLevel:48, combatStyle:'ranged' },
  { id:'rad_leviathan',name:'辐射海兽',emoji:'🐋',maxHp:1680,attack:96,defence:50,xp:840,drops:{gold:[125,230],dragonBones:2},  reqCombatLevel:49, combatStyle:'magic' },
  { id:'war_bot_mk1', name:'战争机甲MK1',emoji:'🤖',maxHp:1750,attack:100,defence:52,xp:880,drops:{gold:[135,250],dragonBones:2},reqCombatLevel:50,combatStyle:'ranged' },
  // LV 51-60: 机械化威胁
  { id:'war_bot_mk2', name:'战争机甲MK2',emoji:'🤖',maxHp:1830,attack:105,defence:54,xp:920,drops:{gold:[145,270],dragonBones:3},reqCombatLevel:51,combatStyle:'ranged' },
  { id:'drone_swarm', name:'无人机群', emoji:'🛸', maxHp:1910,attack:110,defence:35,xp:960,drops:{gold:[155,290]},                reqCombatLevel:52, combatStyle:'ranged' },
  { id:'rad_juggernaut',name:'辐射主宰',emoji:'🦾',maxHp:2000,attack:115,defence:58,xp:1000,drops:{gold:[165,310],dragonBones:3},reqCombatLevel:53,combatStyle:'melee' },
  { id:'mutant_horror',name:'变异恐兽',emoji:'🦑',maxHp:2090,attack:120,defence:38,xp:1040,drops:{gold:[175,330]},               reqCombatLevel:54, combatStyle:'magic' },
  { id:'deathclaw_alp',name:'死亡爪首领',emoji:'🦖',maxHp:2190,attack:125,defence:60,xp:1090,drops:{gold:[185,350],dragonBones:3},reqCombatLevel:55,combatStyle:'melee' },
  { id:'tank_wreck',  name:'废土坦克', emoji:'🚛', maxHp:2290,attack:130,defence:65,xp:1140,drops:{gold:[195,370],dragonBones:4},reqCombatLevel:56,combatStyle:'ranged' },
  { id:'rad_phantom', name:'辐射幻影', emoji:'👤', maxHp:2390,attack:135,defence:40,xp:1190,drops:{gold:[205,390]},               reqCombatLevel:57, combatStyle:'magic' },
  { id:'mutant_colossus',name:'变异巨像',emoji:'🗽',maxHp:2500,attack:140,defence:68,xp:1250,drops:{gold:[215,410],dragonBones:4},reqCombatLevel:58,combatStyle:'melee' },
  { id:'war_zeppelin',name:'武装飞艇', emoji:'🎈', maxHp:2610,attack:145,defence:45,xp:1310,drops:{gold:[225,430],dragonBones:4},reqCombatLevel:59,combatStyle:'ranged' },
  { id:'rad_archon',  name:'辐射执政官',emoji:'😇',maxHp:2730,attack:150,defence:70,xp:1370,drops:{gold:[235,450],dragonBones:5},reqCombatLevel:60,combatStyle:'magic' },
  // LV 61-70: 废土领主
  { id:'doom_reaver', name:'末日掠夺者',emoji:'💀',maxHp:2850,attack:155,defence:72,xp:1430,drops:{gold:[250,470],dragonBones:5},reqCombatLevel:61,combatStyle:'melee' },
  { id:'plague_bearer',name:'瘟疫使者',emoji:'☠️',maxHp:2980,attack:160,defence:50,xp:1490,drops:{gold:[265,490]},               reqCombatLevel:62, combatStyle:'magic' },
  { id:'war_goliath', name:'战争巨人', emoji:'🤖', maxHp:3110,attack:165,defence:75,xp:1550,drops:{gold:[280,510],dragonBones:5},reqCombatLevel:63,combatStyle:'melee' },
  { id:'rad_sphinx',  name:'辐射狮鹫', emoji:'🦅', maxHp:3240,attack:170,defence:55,xp:1620,drops:{gold:[295,530],dragonBones:6},reqCombatLevel:64,combatStyle:'magic' },
  { id:'mutant_lord', name:'变异领主', emoji:'👹', maxHp:3380,attack:175,defence:78,xp:1690,drops:{gold:[310,550],dragonBones:6},reqCombatLevel:65,combatStyle:'melee' },
  { id:'deathclaw_queen',name:'死亡爪女王',emoji:'👑',maxHp:3520,attack:180,defence:60,xp:1760,drops:{gold:[325,570],dragonBones:7},reqCombatLevel:66,combatStyle:'ranged' },
  { id:'rad_abomination',name:'辐射憎恶',emoji:'🫠',maxHp:3670,attack:185,defence:80,xp:1830,drops:{gold:[340,590],dragonBones:7},reqCombatLevel:67,combatStyle:'melee' },
  { id:'war_titan',   name:'战争泰坦', emoji:'🦾', maxHp:3820,attack:190,defence:85,xp:1910,drops:{gold:[355,615],dragonBones:8},reqCombatLevel:68,combatStyle:'ranged' },
  { id:'void_rift',   name:'虚空裂隙', emoji:'🌌', maxHp:3980,attack:195,defence:65,xp:1990,drops:{gold:[370,640],dragonBones:8},reqCombatLevel:69,combatStyle:'magic' },
  { id:'rad_dragon',  name:'辐射龙',   emoji:'🐲', maxHp:4150,attack:200,defence:88,xp:2070,drops:{gold:[390,665],dragonBones:10},reqCombatLevel:70,combatStyle:'magic' },
  // LV 71-80: 末日生物
  { id:'doom_knight', name:'末日骑士', emoji:'⚔️', maxHp:4320,attack:205,defence:90,xp:2160,drops:{gold:[410,690],dragonBones:10},reqCombatLevel:71,combatStyle:'melee' },
  { id:'plague_dragon',name:'瘟疫龙',  emoji:'🐉', maxHp:4490,attack:210,defence:70,xp:2250,drops:{gold:[430,715],dragonBones:12},reqCombatLevel:72,combatStyle:'magic' },
  { id:'war_leviathan',name:'战争海兽',emoji:'🐋',maxHp:4670,attack:215,defence:93,xp:2340,drops:{gold:[450,740],dragonBones:12},reqCombatLevel:73,combatStyle:'melee' },
  { id:'rad_phoenix', name:'辐射凤凰', emoji:'🔥', maxHp:4860,attack:220,defence:75,xp:2430,drops:{gold:[470,765],dragonBones:15},reqCombatLevel:74,combatStyle:'magic' },
  { id:'mutant_god',  name:'变异神',   emoji:'👁️', maxHp:5050,attack:225,defence:95,xp:2520,drops:{gold:[490,790],dragonBones:15},reqCombatLevel:75,combatStyle:'magic' },
  { id:'deathclaw_emp',name:'死亡爪帝皇',emoji:'🦖',maxHp:5250,attack:230,defence:80,xp:2620,drops:{gold:[515,815],dragonBones:18},reqCombatLevel:76,combatStyle:'melee' },
  { id:'rad_apocalypse',name:'辐射天启',emoji:'🌋',maxHp:5450,attack:235,defence:98,xp:2720,drops:{gold:[540,840],dragonBones:18},reqCombatLevel:77,combatStyle:'magic' },
  { id:'war_archon',  name:'战争大君', emoji:'🤖', maxHp:5660,attack:240,defence:100,xp:2830,drops:{gold:[565,870],dragonBones:20},reqCombatLevel:78,combatStyle:'ranged' },
  { id:'void_lord',   name:'虚空领主', emoji:'🌑', maxHp:5880,attack:245,defence:85,xp:2940,drops:{gold:[590,900],dragonBones:20},reqCombatLevel:79,combatStyle:'magic' },
  { id:'rad_titan',   name:'辐射泰坦', emoji:'🗿', maxHp:6100,attack:250,defence:105,xp:3050,drops:{gold:[615,930],dragonBones:25},reqCombatLevel:80,combatStyle:'melee' },
  // LV 81-90: 传说级
  { id:'fission_col', name:'裂变巨像', emoji:'⚛️', maxHp:6330,attack:258,defence:108,xp:3170,drops:{gold:[640,960],dragonBones:28},reqCombatLevel:81,combatStyle:'melee' },
  { id:'nuclear_wyrm',name:'核能巨龙', emoji:'🐲', maxHp:6570,attack:266,defence:90,xp:3290,drops:{gold:[665,995],dragonBones:30},reqCombatLevel:82,combatStyle:'magic' },
  { id:'doom_bringer',name:'末日使者', emoji:'💀', maxHp:6810,attack:274,defence:112,xp:3410,drops:{gold:[690,1030],dragonBones:35},reqCombatLevel:83,combatStyle:'melee' },
  { id:'rad_immortal',name:'辐射不朽者',emoji:'🦴',maxHp:7060,attack:282,defence:95,xp:3530,drops:{gold:[715,1065],dragonBones:35},reqCombatLevel:84,combatStyle:'magic' },
  { id:'war_god',     name:'战争之神', emoji:'⚡', maxHp:7320,attack:290,defence:115,xp:3660,drops:{gold:[740,1100],dragonBones:40},reqCombatLevel:85,combatStyle:'ranged' },
  { id:'void_emperor',name:'虚空皇帝', emoji:'🌌', maxHp:7580,attack:298,defence:100,xp:3790,drops:{gold:[765,1135],dragonBones:40},reqCombatLevel:86,combatStyle:'magic' },
  { id:'mutant_primordial',name:'变异原初',emoji:'🧬',maxHp:7850,attack:306,defence:118,xp:3920,drops:{gold:[790,1170],dragonBones:45},reqCombatLevel:87,combatStyle:'melee' },
  { id:'rad_eternal', name:'辐射永恒', emoji:'♾️', maxHp:8130,attack:314,defence:105,xp:4060,drops:{gold:[815,1205],dragonBones:50},reqCombatLevel:88,combatStyle:'magic' },
  { id:'omega_drone', name:'Ω型无人机',emoji:'🛸',maxHp:8410,attack:322,defence:122,xp:4200,drops:{gold:[840,1240],dragonBones:50},reqCombatLevel:89,combatStyle:'ranged' },
  { id:'rad_overlord',name:'辐射霸王', emoji:'👑', maxHp:8700,attack:330,defence:125,xp:4350,drops:{gold:[865,1280],dragonBones:55},reqCombatLevel:90,combatStyle:'melee' },
  // LV 91-99: 神话级
  { id:'apocalypse_beast',name:'天启兽',emoji:'🐲',maxHp:9000,attack:340,defence:128,xp:4500,drops:{gold:[890,1320],dragonBones:60},reqCombatLevel:91,combatStyle:'magic' },
  { id:'oblivion_knight',name:'湮灭骑士',emoji:'⚔️',maxHp:9300,attack:350,defence:130,xp:4650,drops:{gold:[915,1360],dragonBones:65},reqCombatLevel:92,combatStyle:'melee' },
  { id:'rad_genesis', name:'辐射创世', emoji:'🌟', maxHp:9610,attack:360,defence:115,xp:4800,drops:{gold:[940,1400],dragonBones:70},reqCombatLevel:93,combatStyle:'magic' },
  { id:'war_armageddon',name:'末日兵器',emoji:'💣',maxHp:9930,attack:370,defence:135,xp:4960,drops:{gold:[965,1440],dragonBones:75},reqCombatLevel:94,combatStyle:'ranged' },
  { id:'void_annihilator',name:'虚空歼灭者',emoji:'🕳️',maxHp:10250,attack:380,defence:120,xp:5120,drops:{gold:[990,1480],dragonBones:80},reqCombatLevel:95,combatStyle:'magic' },
  { id:'rad_cataclysm',name:'辐射浩劫',emoji:'🌋',maxHp:10580,attack:390,defence:138,xp:5280,drops:{gold:[1015,1520],dragonBones:85},reqCombatLevel:96,combatStyle:'melee' },
  { id:'omega_titan', name:'Ω泰坦',   emoji:'🗿', maxHp:10920,attack:400,defence:140,xp:5440,drops:{gold:[1040,1560],dragonBones:90},reqCombatLevel:97,combatStyle:'melee' },
  { id:'rad_ultima',  name:'辐射终焉', emoji:'☢️', maxHp:11270,attack:410,defence:125,xp:5600,drops:{gold:[1065,1600],dragonBones:100},reqCombatLevel:98,combatStyle:'magic' },
  { id:'nuclear_god', name:'核能之神', emoji:'⚛️', maxHp:12000,attack:430,defence:145,xp:6000,drops:{gold:[1200,1800],dragonBones:120},reqCombatLevel:99,combatStyle:'magic' },
];

// ─── Boss skills ──────────────────────────────────────────────────────────────
export type BossSkillType = 'shield' | 'aoe' | 'heal' | 'enrage';

export const BOSS_SKILL_LABEL: Record<BossSkillType, string> = {
  shield: '防御姿态',
  aoe: '范围扫射',
  heal: '自我修复',
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
    id: 'supermarket',
    name: '废弃超市',
    emoji: '🏪',
    theme: '战前的大型超市，货架倒塌，黑暗中潜伏着变异生物和搜刮者。',
    reqCombatLevel: 10,
    cost: { gold: 100 },
    boss: { name: '超市变异体', emoji: '🦠', maxHp: 500, attack: 14, defence: 4, xp: 200, skills: [{ type: 'shield', name: '硬化皮肤', cooldownSec: 12, value: 50, duration: 1 }] },
    uniqueDropIds: ['d_rotten_core', 'd_corrosion_pick'],
    dropChance: 0.6,
    waves: [
      { name:'辐射鼠', emoji:'🐀', hpMul:0.15, atkMul:0.3 },{ name:'变异蟑螂', emoji:'🪳', hpMul:0.25, atkMul:0.4 },{ name:'流浪丧尸', emoji:'🧟', hpMul:0.35, atkMul:0.5 },{ name:'搜刮者', emoji:'👤', hpMul:0.45, atkMul:0.6 },{ name:'变异犬', emoji:'🐕', hpMul:0.55, atkMul:0.7 },{ name:'丧尸保安', emoji:'🧟', hpMul:0.65, atkMul:0.8 },{ name:'变异蜘蛛', emoji:'🕷️', hpMul:0.7, atkMul:0.9 },{ name:'变异蛇', emoji:'🐍', hpMul:0.75, atkMul:1.0 },{ name:'巨鼠', emoji:'🐀', hpMul:0.85, atkMul:1.1 },{ name:'超市守卫', emoji:'💂', hpMul:0.95, atkMul:1.2 },
    ],
  },
  {
    id: 'hospital',
    name: '废弃医院',
    emoji: '🏥',
    theme: '曾经的圣玛丽医院，如今遍布辐射尘埃和变异病患的鬼魂。',
    reqCombatLevel: 20,
    cost: { gold: 400, bones: 10 },
    boss: { name: '外科变异体', emoji: '👨‍⚕️', maxHp: 1100, attack: 26, defence: 9, xp: 450, skills: [{ type: 'aoe', name: '辐射嚎叫', cooldownSec: 15, value: 20, duration: 0 }] },
    uniqueDropIds: ['d_specter_cloak', 'd_shadow_sigil'],
    dropChance: 0.55,
    waves: [
      { name:'变异护士', emoji:'👩‍⚕️', hpMul:0.2, atkMul:0.4 },{ name:'辐射触手', emoji:'🦑', hpMul:0.3, atkMul:0.5 },{ name:'丧尸病人', emoji:'🧟', hpMul:0.4, atkMul:0.6 },{ name:'变异医生', emoji:'👨‍⚕️', hpMul:0.5, atkMul:0.7 },{ name:'医院守卫', emoji:'💂', hpMul:0.6, atkMul:0.8 },{ name:'暗影刺客', emoji:'🗡️', hpMul:0.65, atkMul:0.9 },{ name:'变异体', emoji:'🧬', hpMul:0.7, atkMul:1 },{ name:'巨虫', emoji:'🪱', hpMul:0.75, atkMul:1.1 },{ name:'辐射术士', emoji:'🧙', hpMul:0.82, atkMul:1.15 },{ name:'医院主管', emoji:'👑', hpMul:0.95, atkMul:1.25 },
    ],
  },
  {
    id: 'police_station',
    name: '废弃警局',
    emoji: '🏛️',
    theme: '战前警察局，军械库可能还有未开封的武器和弹药，但守卫也同样致命。',
    reqCombatLevel: 35,
    cost: { gold: 1200, bones: 35 },
    boss: { name: '防暴变异体', emoji: '👮', maxHp: 2400, attack: 44, defence: 17, xp: 900, skills: [{ type: 'heal', name: '急救包', cooldownSec: 18, value: 300, duration: 0 }, { type: 'enrage', name: '狂暴', cooldownSec: 24, value: 30, duration: 2 }] },
    uniqueDropIds: ['d_flame_crown', 'd_ember_ring'],
    dropChance: 0.5,
    waves: [
      { name:'丧尸警察', emoji:'👮', hpMul:0.25, atkMul:0.45 },{ name:'变异警犬', emoji:'🐕', hpMul:0.35, atkMul:0.55 },{ name:'辐射蜥蜴', emoji:'🦎', hpMul:0.45, atkMul:0.65 },{ name:'防暴丧尸', emoji:'🛡️', hpMul:0.55, atkMul:0.75 },{ name:'变异蛇', emoji:'🐍', hpMul:0.65, atkMul:0.85 },{ name:'辐射精灵', emoji:'☢️', hpMul:0.7, atkMul:0.95 },{ name:'变异巨魔', emoji:'👹', hpMul:0.78, atkMul:1.05 },{ name:'辐射元素', emoji:'🪨', hpMul:0.82, atkMul:1.12 },{ name:'邪教徒', emoji:'🧟', hpMul:0.88, atkMul:1.18 },{ name:'特警丧尸', emoji:'💢', hpMul:0.95, atkMul:1.3 },
    ],
  },
  {
    id: 'military_base',
    name: '废弃军事基地',
    emoji: '🏭',
    theme: '战前秘密军事基地，高墙后的实验室仍在运转着可怕的实验。',
    reqCombatLevel: 50,
    cost: { gold: 4000, bones: 80 },
    boss: { name: '军用机甲', emoji: '🤖', maxHp: 4500, attack: 68, defence: 28, xp: 1800, skills: [{ type: 'shield', name: '反应装甲', cooldownSec: 15, value: 50, duration: 1 }, { type: 'aoe', name: '导弹齐射', cooldownSec: 20, value: 35, duration: 0 }] },
    uniqueDropIds: ['d_void_blade', 'd_nullity_plate'],
    dropChance: 0.45,

    waves: [
      { name:'虚空蠕虫', emoji:'🐛', hpMul:0.3, atkMul:0.5 },{ name:'虚空蝙蝠', emoji:'🦇', hpMul:0.4, atkMul:0.6 },{ name:'虚空哨兵', emoji:'👁️', hpMul:0.5, atkMul:0.7 },{ name:'虚空蜘蛛', emoji:'🕷️', hpMul:0.6, atkMul:0.8 },{ name:'虚空卫士', emoji:'🛡️', hpMul:0.68, atkMul:0.9 },{ name:'虚空刺客', emoji:'🗡️', hpMul:0.74, atkMul:1 },{ name:'虚空术士', emoji:'🧙', hpMul:0.8, atkMul:1.1 },{ name:'虚空巨兽', emoji:'🦣', hpMul:0.85, atkMul:1.15 },{ name:'虚空骑士', emoji:'⚔️', hpMul:0.9, atkMul:1.22 },{ name:'虚空守护者', emoji:'🛡️', hpMul:0.96, atkMul:1.3 }
    ],
  },
  {
    id: 'reactor_core',
    name: '核反应堆核心',
    emoji: '☢️',
    theme: '废弃核电站的反应堆核心，辐射浓度极高，变异生物在此筑巢。',
    reqCombatLevel: 65,
    cost: { gold: 10000, dragonBones: 8 },
    boss: { name: '辐射巨兽', emoji: '☢️', maxHp: 8000, attack: 100, defence: 44, xp: 3500, skills: [{ type: 'aoe', name: '辐射喷吐', cooldownSec: 15, value: 45, duration: 0 }, { type: 'heal', name: '细胞再生', cooldownSec: 22, value: 600, duration: 0 }, { type: 'enrage', name: '核能狂暴', cooldownSec: 30, value: 40, duration: 2 }] },
    uniqueDropIds: ['d_bone_dragon_shield', 'd_dracolich_mantle'],
    dropChance: 0.4,
    waves: [
      { name:'辐射鼠群', emoji:'🐀', hpMul:0.35, atkMul:0.55 },{ name:'变异工人', emoji:'🧟', hpMul:0.45, atkMul:0.65 },{ name:'辐射蠕虫', emoji:'🐛', hpMul:0.55, atkMul:0.75 },{ name:'反应堆哨兵', emoji:'🤖', hpMul:0.62, atkMul:0.85 },{ name:'辐射幻影', emoji:'👻', hpMul:0.7, atkMul:0.95 },{ name:'防化兵', emoji:'🛡️', hpMul:0.75, atkMul:1.05 },{ name:'辐射元素', emoji:'☢️', hpMul:0.82, atkMul:1.12 },{ name:'变异巨兽', emoji:'🦴', hpMul:0.86, atkMul:1.18 },{ name:'辐射祭司', emoji:'🧙', hpMul:0.92, atkMul:1.24 },{ name:'核心守卫', emoji:'⚔️', hpMul:0.97, atkMul:1.32 }
    ],
  },
  {
    id: 'bunker_vault',
    name: '地下避难所金库',
    emoji: '🔐',
    theme: '战前政府建造的秘密避难所，据说储存着战前科技的最高成果。',
    reqCombatLevel: 80,
    cost: { gold: 25000, dragonBones: 20 },
    boss: { name: '金库防御系统', emoji: '🤖', maxHp: 16000, attack: 160, defence: 70, xp: 8000, skills: [{ type: 'shield', name: '能量屏障', cooldownSec: 18, value: 60, duration: 1 }, { type: 'aoe', name: '自动炮台', cooldownSec: 15, value: 55, duration: 0 }, { type: 'enrage', name: '过载模式', cooldownSec: 30, value: 50, duration: 3 }] },
    uniqueDropIds: ['d_chaos_edge', 'd_primal_forge_armor'],
    dropChance: 0.35,
    waves: [
      { name:'安保无人机', emoji:'🛸', hpMul:0.38, atkMul:0.58 },{ name:'防御炮塔', emoji:'🗿', hpMul:0.48, atkMul:0.68 },{ name:'变异蝙蝠', emoji:'🦇', hpMul:0.56, atkMul:0.78 },{ name:'警卫机器人', emoji:'🤖', hpMul:0.64, atkMul:0.88 },{ name:'精英卫兵', emoji:'🛡️', hpMul:0.72, atkMul:0.98 },{ name:'暗影特工', emoji:'🗡️', hpMul:0.78, atkMul:1.08 },{ name:'能量元素', emoji:'⚡', hpMul:0.84, atkMul:1.14 },{ name:'机甲巨兽', emoji:'🦣', hpMul:0.88, atkMul:1.2 },{ name:'科技祭司', emoji:'🧙', hpMul:0.93, atkMul:1.26 },{ name:'金库主控', emoji:'🛡️', hpMul:0.98, atkMul:1.35 }
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

