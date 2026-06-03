export const WOOD_NAMES = ["橡木","柳木","柚木","枫木","桃花心木","紫杉木","魔法木","古树木","红杉木","灵木","白蜡木","桦木","雪松木","榆木","铁木","血木","影木","月木","风暴木","霜木","余烬木","雷霆木","龙木","巨魔木","巨人木","暗木","水晶木","露木","荆棘木","骨木","墓木","虚空木","恶魔木","天使木","泰坦木","长老木","符文木","咒木","星木","深渊木","以太木","天界木","炼狱木","龙息木","凤凰木","狮鹫木","蛇妖木","海德拉木","巨兽木","巨像木","原始木","永恒木","不朽木","神木","世界树","梦木","夜木","暮木","晨木","黄昏木","日木","月影木","星尘木","星云木","星河木","宇宙木","星光木","以太之木","秘银木","精金木","山铜木","命运木","末日木","混沌木","秩序木","创世木","灭世木","起源木","天启木","超越木","全知木","无限木","至高木","终极木","完美木","无瑕木","全能木","永恒之木","不朽之木","无尽木","神谕木","圣光木","天罚木","终末木","涅槃木","万古长青木","创世神木"];
export const ORE_NAMES = ["铜矿","锡矿","铁矿","煤矿","秘银矿","精金矿","符文矿","龙矿","黑曜矿","以太矿","铅矿","锌矿","镍矿","钴矿","钨矿","钛矿","铬矿","锰矿","铂矿","钯矿","水晶矿","紫晶矿","黄玉矿","翡翠矿","蓝宝石矿","钻石矿","月长石","太阳石","猫眼石","血石","灵魂石","暗影石","虚空晶","深渊矿","炼狱矿","天界晶","混沌石","星陨铁","龙晶","凤晶","狮鹫石","蛇妖矿","海德拉矿","巨兽矿","巨像矿","原始矿","永恒晶","不朽矿","神矿","世界石","梦境矿","暗夜矿","暮光矿","黎明矿","黄昏石","日光石","月光晶","星尘矿","星云矿","星核","宇宙矿","星光晶","以太之矿","秘银晶","精金晶","山铜矿","命运石","末日矿","混沌矿","秩序矿","创世矿","灭世矿","起源石","天启矿","超越石","全知矿","无限矿","至高矿","终极矿","完美晶","无瑕矿","全能矿","永恒之矿","不朽之晶","无尽晶","神谕石","圣光晶","天罚矿","终末矿","涅槃矿","万古晶","创世神矿"];

// Melvor-style: 10 tiers, front-loaded for early game pace
const MELVOR_LEVELS = [1, 4, 7, 10, 15, 25, 40, 60, 80, 99];
const MELVOR_COUNT = MELVOR_LEVELS.length; // 10 tiers

// XP/s curve: starts ~3 XP/s, ends ~12 XP/s (like Melvor Normal→Redwood)
// time: 3s → 18s, XP: 10 → 200+
const MELVOR_WC = { time: [3,4,5,6,8,10,12,14,16,18], xp: [10,16,24,34,48,64,84,110,140,180] };
const MELVOR_MN = { time: [3,4,5,6,8,10,12,14,16,18], xp: [12,19,28,40,56,75,98,128,164,210] };
const MELVOR_FS = { time: [3,4,5,6,7,9,11,13,15,17], xp: [10,16,24,34,48,62,80,104,132,168] };

export const SKILLS_DATA: Record<string, { name: string; time: number; xp: number; prefix: string; reqLevel: number }[]> = {
  woodcutting: MELVOR_LEVELS.map((lv, i) => ({
    name: WOOD_NAMES[i] ?? `木材${i + 1}`,
    time: MELVOR_WC.time[i], xp: MELVOR_WC.xp[i],
    prefix: "wood", reqLevel: lv,
  })),
  mining: MELVOR_LEVELS.map((lv, i) => ({
    name: ORE_NAMES[i] ?? `矿石${i + 1}`,
    time: MELVOR_MN.time[i], xp: MELVOR_MN.xp[i],
    prefix: "ore", reqLevel: lv,
  })),
  smelting: MELVOR_LEVELS.map((lv, i) => ({
    name: `锭${i + 1}`,
    time: MELVOR_MN.time[i] + 1, xp: Math.floor(MELVOR_MN.xp[i] * 1.3),
    prefix: "bar", reqLevel: lv,
  })),
  fishing: MELVOR_LEVELS.map((lv, i) => ({
    name: `鱼${i + 1}`,
    time: MELVOR_FS.time[i], xp: MELVOR_FS.xp[i],
    prefix: "fish", reqLevel: lv,
  })),
  hunting: MELVOR_LEVELS.map((lv, i) => ({
    name: `兽皮${i + 1}`,
    time: MELVOR_MN.time[i], xp: Math.floor(MELVOR_MN.xp[i] * 0.9),
    prefix: "hide", reqLevel: lv,
  })),
  crafting: MELVOR_LEVELS.map((lv, i) => ({
    name: `材料${i + 1}`,
    time: MELVOR_MN.time[i] + 1, xp: Math.floor(MELVOR_MN.xp[i] * 1.2),
    prefix: "item", reqLevel: lv,
  })),
  agility: MELVOR_LEVELS.map((lv, i) => ({
    name: ["基础跑酷","平衡木","攀爬墙","障碍赛","绳索攀爬","独木桥","高空跳","翻滚训练","墙壁跑酷","倒立行走"][i] ?? `敏捷训练${i+1}`,
    time: [5,6,7,8,10,12,14,16,18,20][i],
    xp: [8,13,19,27,38,51,67,88,112,144][i],
    prefix: "", reqLevel: lv,
  })),
  exploration: Array.from({ length: 7 }, (_, i) => ({
    name: [
      "附近森林","废弃矿洞","古老废墟","河畔遗迹","山间洞穴",
      "遗忘神庙","地下墓穴","迷雾沼泽","沙漠神殿","冰封要塞",
      "火山口","海底洞窟","天空浮岛","深渊裂隙","龙巢废墟",
      "巨人墓地","精灵遗迹","矮人金库","吸血鬼城堡","狼人森林",
      "幽灵船","海盗岛","魔法塔","时间迷宫","梦境之门",
      "星辰祭坛","虚空边界","混沌领域","创世神殿","终末之门",
    ][i] ?? `探索区域${i + 1}`,
    time: 30 + i * 15,
    xp: 50 + i * 30,
    prefix: "",
    reqLevel: i + 1,
  })),
};

export const RARITY_ORDER: Record<string, number> = {
  common: 0,
  uncommon: 1,
  rare: 2,
  epic: 3,
  legendary: 4,
};

export const DISENCHANT_GOLD: Record<string, number> = {
  common: 5,
  uncommon: 15,
  rare: 40,
  epic: 100,
  legendary: 0,
};
