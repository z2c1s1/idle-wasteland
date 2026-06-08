export const WOOD_NAMES = ["废木板","枯树枝","焦木","铁线木","石化木","辐射瘤木","骨白杉","黑钢木","泰坦木","核融晶木","钢筋水泥块","锈蚀铁管","碳化木","玻璃化木","石棉板","酸蚀木","油污木","弹孔木","辐射尘木","废轮胎堆","电缆木","铅管","锌板","镍合金","钴钢","钨丝","铬板","铂金丝","铱合金","铑镀层","锇块","钌片","钯金丝","铼合金","锗晶","镓块","铟丝","铊块","铋块","钋块","砹块","氡晶","钫块","镭块","锕块","钍块","镤块","铀块","镎块","钚块","镅块","锔块","锫块","锎块","锿块","镄块","钔块","锘块","铹块","金属氢","反物质晶","暗物质块","奇异物质","量子泡沫","纳米丝","超导体","拓扑绝缘体","光子晶体","等离子团","玻色凝聚体","费米气体","中微子束","引力子簇","磁单极子","宇宙弦","夸克胶子浆","希格斯粒子","超对称粒子","额外维碎片","膜世界碎片","平行世界碎片","多元晶核","全能之石"];
export const ORE_NAMES = ["废铁块","铜丝矿","铝罐矿","铅块","硫磺矿","硝酸盐矿","铀矿石","钛金矿","钨钢矿","铱金矿","锌矿","镍矿","钴矿","锰矿","铬铁矿","钒矿","钼矿","锡矿","锑矿","铋矿","汞矿","银矿","金矿","铂矿","钯矿","铑矿","钌矿","锇矿","铼矿","镓矿","铟矿","铊矿","锗矿","硒矿","碲矿","钋矿","镭矿","钍矿","镤矿","铀矿","镎矿","钚矿","镅矿","锔矿","锫矿","锎矿","锿矿","镄矿","钔矿","锘矿","铹矿","锂矿","铍矿","硼矿","碳矿","氮矿","氧矿","氟矿","氖矿","氩矿","氪矿","氙矿","氡矿","钫矿","锕矿","稀土矿","轻稀土","重稀土","钇矿","镧矿","铈矿","镨矿","钕矿","钷矿","钐矿","铕矿","钆矿","铽矿","镝矿","钬矿","铒矿","铥矿","镱矿","镥矿","金属氢","反物质矿","暗物质矿","奇异矿","量子矿","纳米矿","超导矿","光子矿","等离子矿","玻色矿","费米矿","中微子矿","引力子矿","磁单极矿","宇宙弦矿","夸克矿","胶子矿","希格斯矿","额外维度矿","膜世界矿","平行世界矿","多元宇宙矿","创世神矿"];

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
    name: WOOD_NAMES[i] ?? `废木材${i + 1}`,
    time: MELVOR_WC.time[i], xp: MELVOR_WC.xp[i],
    prefix: "wood", reqLevel: lv,
  })),
  mining: MELVOR_LEVELS.map((lv, i) => ({
    name: ORE_NAMES[i] ?? `矿石${i + 1}`,
    time: MELVOR_MN.time[i], xp: MELVOR_MN.xp[i],
    prefix: "ore", reqLevel: lv,
  })),
  smelting: MELVOR_LEVELS.map((lv, i) => ({
    name: ORE_NAMES[i].replace('矿','锭'),
    time: MELVOR_MN.time[i] + 1, xp: Math.floor(MELVOR_MN.xp[i] * 1.3),
    prefix: "bar", reqLevel: lv,
  })),
  fishing: MELVOR_LEVELS.map((lv, i) => ({
    name: ["辐射蝌蚪","癞皮鱼","电鳗仔","刺鳍鱼","肿眼鲶","荧光鳗","铁甲鱼","双头鲨","深渊巨口","核融鲸"][i] ?? `变异鱼${i + 1}`,
    time: MELVOR_FS.time[i], xp: MELVOR_FS.xp[i],
    prefix: "fish", reqLevel: lv,
  })),
  hunting: MELVOR_LEVELS.map((lv, i) => ({
    name: ["辐射鼠皮","变异兔皮","铁鳞蜥皮","疯犬皮","钢鬃猪皮","双头鹿皮","灰熊厚皮","辐射蝎壳","死亡爪皮","巨兽硬皮"][i] ?? `变异兽皮${i + 1}`,
    time: MELVOR_MN.time[i], xp: Math.floor(MELVOR_MN.xp[i] * 0.9),
    prefix: "hide", reqLevel: lv,
  })),
  crafting: MELVOR_LEVELS.map((lv, i) => ({
    name: ["破布条","旧绳索","皮革碎片","铁钉","弹簧","齿轮","电路板","精密零件","军用元件","战前科技核心"][i] ?? `废料${i + 1}`,
    time: MELVOR_MN.time[i] + 1, xp: Math.floor(MELVOR_MN.xp[i] * 1.2),
    prefix: "item", reqLevel: lv,
  })),
  agility: MELVOR_LEVELS.map((lv, i) => ({
    name: ["基础跑酷","铁丝网穿越","坍塌楼攀爬","废墟障碍赛","下水道匍匐","断桥跳跃","高空索降","燃烧障碍跑","辐射区冲刺","垂直墙攀爬"][i] ?? `敏捷训练${i+1}`,
    time: [5,6,7,8,10,12,14,16,18,20][i],
    xp: [8,13,19,27,38,51,67,88,112,144][i],
    prefix: "", reqLevel: lv,
  })),
  exploration: Array.from({ length: 30 }, (_, i) => ({
    name: [
      // ── Tier 1: 安全区 (Lv 1-10) ──
      "废弃加油站","废弃超市","废墟小镇","郊外农田","断裂立交桥",
      // ── Tier 2: 危险区 (Lv 10-25) ──
      "枯树林","辐射沼泽","废弃矿洞","地下停车场","废弃医院",
      // ── Tier 3: 高危区 (Lv 25-45) ──
      "军事检查站","化工厂废墟","核电站外围","淹没地铁站","酸雨平原",
      // ── Tier 4: 极危区 (Lv 45-65) ──
      "沙暴废土","雪地废墟","火山灰地带","裂谷深渊","变异丛林",
      // ── Tier 5: 死亡区 (Lv 65-85) ──
      "巨兽骸骨场","军事禁区","高架桥废墟","实验室废墟","陨石坑",
      // ── Tier 6: 深渊区 (Lv 85-99) ──
      "深渊裂谷","辐射风暴区","避难所遗迹","搁浅航母","终末之门",
    ][i] ?? `探索区域${i + 1}`,
    time: 30 + i * 15,
    xp: 50 + i * 30,
    prefix: "",
    reqLevel: Math.min(99, Math.floor(i * 4) + 1),
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