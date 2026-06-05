import type { CombatStyle, Rarity } from "./rarity-equipment";

// ─── Thieving skill ───────────────────────────────────────────────────────────
export interface ThievingNPC {
  id: string; name: string; emoji: string; level: number;
  perception: number; maxHit: number; interval: number;
  xp: number; gpMin: number; gpMax: number;
  commonDrops: { name: string; emoji: string; qty: number; chance: number }[];
  uniqueDrop?: { id: string; name: string; emoji: string; chance: number };
  hidden?: boolean; unlockCondition?: string; unlockHint?: string;
}

// 废土搜刮 — 原创废土世界观搜刮系统
// 每个地点是一个可搜刮的废墟/建筑，不是偷NPC
export const THIEVING_NPCS: ThievingNPC[] = [
  // ═══ 公开搜刮点 ═══
  { id:'convenience',name:'废弃便利店',emoji:'🏪',level:1,perception:30,maxHit:1,interval:3,xp:5,gpMin:5,gpMax:15,
    commonDrops:[{name:'过期罐头',emoji:'🥫',qty:1,chance:0.3},{name:'塑料瓶',emoji:'🧴',qty:1,chance:0.25}],
    uniqueDrop:{id:'register_key',name:'收银机钥匙',emoji:'🔑',chance:200} },
  { id:'apartment',name:'倒塌公寓楼',emoji:'🏚️',level:8,perception:60,maxHit:3,interval:3,xp:10,gpMin:10,gpMax:30,
    commonDrops:[{name:'破衣物',emoji:'🧶',qty:1,chance:0.25},{name:'旧照片',emoji:'📷',qty:1,chance:0.18}],
    uniqueDrop:{id:'survivor_diary',name:'幸存者日记',emoji:'📔',chance:250} },
  { id:'gas_station',name:'废弃加油站',emoji:'⛽',level:15,perception:100,maxHit:5,interval:3,xp:18,gpMin:20,gpMax:50,
    commonDrops:[{name:'机油',emoji:'🛢️',qty:1,chance:0.2},{name:'打火机',emoji:'🔥',qty:1,chance:0.15}],
    uniqueDrop:{id:'fuel_drum',name:'油桶',emoji:'🛢️',chance:220} },
  { id:'police_armory',name:'警察局军械库',emoji:'🚔',level:25,perception:150,maxHit:8,interval:3,xp:30,gpMin:35,gpMax:80,
    commonDrops:[{name:'弹药盒',emoji:'🔫',qty:1,chance:0.18},{name:'弹壳',emoji:'🔩',qty:1,chance:0.15}],
    uniqueDrop:{id:'riot_shield',name:'防暴盾牌',emoji:'🛡️',chance:200} },
  { id:'black_market',name:'地下黑市',emoji:'🌃',level:35,perception:210,maxHit:12,interval:3,xp:50,gpMin:60,gpMax:130,
    commonDrops:[{name:'违禁品',emoji:'📦',qty:1,chance:0.15},{name:'走私药品',emoji:'💊',qty:1,chance:0.12}],
    uniqueDrop:{id:'market_pass',name:'黑市通行证',emoji:'🎫',chance:180} },
  // ═══ 隐藏搜刮点 ═══
  { id:'supply_depot',name:'军用补给站',emoji:'🏭',level:45,perception:280,maxHit:16,interval:3,xp:80,gpMin:100,gpMax:200,
    commonDrops:[{name:'军用零件',emoji:'⚙️',qty:1,chance:0.12},{name:'手雷',emoji:'💣',qty:1,chance:0.08}],
    uniqueDrop:{id:'tactical_vest',name:'战术背心',emoji:'🦺',chance:160},
    hidden:true, unlockCondition:'combat_50', unlockHint:'累计击杀 50 个敌人后，废土掠夺者的秘密补给站向你敞开' },
  { id:'vault_ruins',name:'避难所科技废墟',emoji:'🏛️',level:55,perception:360,maxHit:22,interval:3,xp:120,gpMin:150,gpMax:300,
    commonDrops:[{name:'科技零件',emoji:'🔬',qty:1,chance:0.1},{name:'核融合电池',emoji:'🔋',qty:1,chance:0.06}],
    uniqueDrop:{id:'pipboy',name:'哔哔小子',emoji:'📟',chance:140},
    hidden:true, unlockCondition:'town_15', unlockHint:'城镇繁荣到一定程度后，幸存者告诉你避难所的位置' },
  { id:'rad_vault',name:'辐射区金库',emoji:'☢️',level:65,perception:450,maxHit:30,interval:3,xp:180,gpMin:250,gpMax:500,
    commonDrops:[{name:'金条',emoji:'🪙',qty:1,chance:0.06},{name:'辐射药',emoji:'🧪',qty:1,chance:0.1}],
    uniqueDrop:{id:'vault_keycard',name:'金库钥匙卡',emoji:'🔑',chance:130},
    hidden:true, unlockCondition:'dungeon_2', unlockHint:'通关第2个副本后，在废墟深处发现了金库的线索' },
  { id:'warlord_fort',name:'军阀堡垒',emoji:'🏰',level:75,perception:560,maxHit:40,interval:3,xp:280,gpMin:400,gpMax:800,
    commonDrops:[{name:'军需物资',emoji:'📋',qty:1,chance:0.08},{name:'加密情报',emoji:'📜',qty:1,chance:0.05}],
    uniqueDrop:{id:'warlord_ring',name:'军阀之戒',emoji:'💍',chance:110},
    hidden:true, unlockCondition:'tier_2', unlockHint:'世界层级达到2后，军阀堡垒的防御系统出现漏洞' },
  { id:'ancient_bunker',name:'远古避难所',emoji:'🗿',level:90,perception:700,maxHit:55,interval:3,xp:500,gpMin:800,gpMax:1600,
    commonDrops:[{name:'不朽碎片',emoji:'🌟',qty:1,chance:0.05},{name:'战前科技',emoji:'💎',qty:1,chance:0.03}],
    uniqueDrop:{id:'immortal_badge',name:'不朽徽章',emoji:'🏅',chance:80},
    hidden:true, unlockCondition:'thieving_90', unlockHint:'只有最资深的废土拾荒者才能找到传说中的远古避难所' },
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
  { id:'shelter', name:'避难室', emoji:'🏠', maxLevel:10, costWood:30, costStone:0, costGold:0, effect:'最大HP', effectPerLevel:'+10 HP' },
  { id:'farm', name:'室内农场', emoji:'🌾', maxLevel:10, costWood:30, costStone:0, costGold:0, effect:'金币产量', effectPerLevel:'+3金/分钟' },
  { id:'lumbermill', name:'伐木站', emoji:'🪓', maxLevel:5, costWood:50, costStone:0, costGold:0, effect:'伐木时间', effectPerLevel:'-3%' },
  { id:'mine', name:'采石场', emoji:'⛏️', maxLevel:5, costWood:0, costStone:50, costGold:0, effect:'采矿时间', effectPerLevel:'-3%' },
  { id:'workshop', name:'工作台', emoji:'🔨', maxLevel:5, costWood:100, costStone:50, costGold:0, effect:'制作时间', effectPerLevel:'-3%' },
  { id:'wall', name:'防御工事', emoji:'🛡️', maxLevel:10, costWood:60, costStone:20, costGold:0, effect:'防御', effectPerLevel:'+3' },
  { id:'warehouse', name:'储物间', emoji:'📦', maxLevel:5, costWood:80, costStone:30, costGold:0, effect:'背包容量', effectPerLevel:'+2格' },
  { id:'clinic', name:'急救室', emoji:'🏥', maxLevel:5, costWood:100, costStone:50, costGold:0, effect:'生命回复', effectPerLevel:'+1/回合' },
  { id:'altar', name:'辐射净化器', emoji:'🔮', maxLevel:3, costWood:0, costStone:100, costGold:500, effect:'神话掉率', effectPerLevel:'+3%' },
  { id:'tower', name:'瞭望哨', emoji:'🗼', maxLevel:5, costWood:0, costStone:200, costGold:0, effect:'战斗经验', effectPerLevel:'+4%' },
  { id:'furnace', name:'火炉', emoji:'🔥', maxLevel:5, costWood:100, costStone:50, costGold:0, effect:'温度衰减', effectPerLevel:'-15% 衰减速度' },
  { id:'recycling', name:'废品回收站', emoji:'♻️', maxLevel:3, costWood:0, costStone:200, costGold:2000, effect:'传奇萃取槽', effectPerLevel:'+1 槽位', reqTier:2 },
  { id:'radlab', name:'辐射实验室', emoji:'☢️', maxLevel:3, costWood:0, costStone:400, costGold:5000, effect:'辐射成功率', effectPerLevel:'+5% 正面概率', reqTier:3 },
  // ── 奇观（一次性建筑）──
  { id:'wonder_corpse', name:'尸山', emoji:'💀', maxLevel:1, costWood:0, costStone:500, costGold:10000, effect:'非Boss敌人HP', effectPerLevel:'-5%', reqTier:2 },
  { id:'wonder_beacon', name:'辐射灯塔', emoji:'🗼', maxLevel:1, costWood:300, costStone:300, costGold:8000, effect:'副本Boss伤害', effectPerLevel:'-8%', reqTier:2 },
  { id:'wonder_radio', name:'废土广播塔', emoji:'📡', maxLevel:1, costWood:200, costStone:500, costGold:6000, effect:'NPC来访频率', effectPerLevel:'+30%', reqTier:3 },
  { id:'wonder_greenhouse', name:'地下温室', emoji:'🌿', maxLevel:1, costWood:500, costStone:200, costGold:5000, effect:'农田产量', effectPerLevel:'+40%', reqTier:1 },
  { id:'wonder_furnace', name:'废铁熔炉', emoji:'🔥', maxLevel:1, costWood:100, costStone:400, costGold:7000, effect:'分解金币', effectPerLevel:'+25%', reqTier:1 },
];

// ─── Cooking & Alchemy ─────────────────────────────────────────────────────────
// ─── NPC Companions (drop from combat like loot) ──────────────────────────
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
  // ── Fish-based recipes ──────────────────────────────────────────────────
  { id:'grilled_fish', name:'烤鱼', emoji:'🐟', inputs:[{resource:'fish_0',qty:3},{resource:'dandelion',qty:1}], effect:'+15%钓鱼速度', durationMin:30 },
  { id:'fish_soup', name:'鲜鱼汤', emoji:'🍜', inputs:[{resource:'fish_2',qty:2},{resource:'mint',qty:2},{resource:'blueberry',qty:1}], effect:'+20%经验获取', durationMin:45 },
  { id:'sushi_plate', name:'刺身拼盘', emoji:'🍣', inputs:[{resource:'fish_4',qty:2},{resource:'goji',qty:2},{resource:'rosemary',qty:1}], effect:'+20%暴击伤害', durationMin:45 },
  { id:'seafood_platter', name:'海鲜大餐', emoji:'🦞', inputs:[{resource:'fish_6',qty:2},{resource:'dragonherb',qty:1},{resource:'spiritberry',qty:1}], effect:'+15%全属性', durationMin:90 },
  { id:'feast_of_the_deep', name:'深渊盛宴', emoji:'🦑', inputs:[{resource:'fish_8',qty:3},{resource:'dragonblood',qty:1},{resource:'nightberry',qty:2}], effect:'+20%全属性 +10%掉率', durationMin:120 },
  // ── Berry gap fill ─────────────────────────────────────────────────────
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

// ─── Prayer system ────────────────────────────────────────────────────────────
/* Prayers moved to ./prayers.ts — barrel re-exports via index.ts */


