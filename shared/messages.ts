// ═══════════════════════════════════════════════════════════════════════════════
// 统一错误消息 — 所有用户可见的错误消息集中管理，支持多语言
// ═══════════════════════════════════════════════════════════════════════════════

const messages = {

  // ── 通用 ─────────────────────────────────────────────────────────────────
  notEnoughGold:           (need?: number) => need != null ? `金币不足（需${need}）` : "金币不足",
  notEnoughMaterials:       "材料不足",
  notEnoughOre:             "矿石不足",
  notEnoughWood:            "木材不足",
  notEnoughStone:           "石料不足",
  notEnoughHerbs:           "草药不足",
  notEnoughGems:            "宝石不足",
  notEnoughSeeds:           "种子不足",
  itemNotFound:             "物品不存在",
  recipeNotFound:           "食谱不存在",
  potionRecipeNotFound:     "配方不存在",

  // ── 装备 ─────────────────────────────────────────────────────────────────
  need3to5Items:            "需要3-5件装备",
  need3to5Gems:             "需要3-5粒",
  lootBagMax:               "已达上限200格",
  socketMax:                "已达最大孔数",
  itemNotInLootBag:         "战利品袋中未找到物品",
  itemNotInInventory:       "背包中未找到物品",
  mustProvideId:            "必须提供物品ID",

  // ── 战斗 ─────────────────────────────────────────────────────────────────
  dungeonNotFound:          "副本不存在",
  needCombatLevel:          (need: number, current: number) => `需要战斗等级 ${need}（当前 ${current}）`,
  needCurseKey:             "需要诅咒钥匙",
  noSlayerTarget:           "没有合适的猎杀目标",
  noSlayerTask:             "没有进行中的猎杀任务",
  slayerKillRemaining:      (remaining: number) => `还需击杀 ${remaining} 个目标`,

  // ── 家园 ─────────────────────────────────────────────────────────────────
  buildingNotFound:         "建筑不存在",
  buildingMaxLevel:         "已满级",
  needFurnace:              "需要先建造火炉",
  needFarm:                 "需要先建造农田",
  farmSlotLocked:           "农田槽位未解锁",
  farmSlotOccupied:         "该槽位已有作物",
  farmSlotEmpty:            "该槽位没有作物",
  farmNotReady:             (min: number) => `还需 ${min} 分钟成熟`,

  // ── NPC ──────────────────────────────────────────────────────────────────
  noNpcVisiting:            "没有来访的NPC",
  npcNotFound:              "NPC不存在",
  invalidAction:            "无效操作",

  // ── 天赋 ─────────────────────────────────────────────────────────────────
  talentAlreadyUnlocked:    "天赋已解锁",
  talentNotFound:           "天赋不存在",
  needCombatLevel15:        "需要对应战斗技能达到15级",
  prereqNotUnlocked:        "前置天赋未解锁",
  notEnoughTalentPoints:    "天赋点不足",

  // ── 成就/宠物 ───────────────────────────────────────────────────────────
  achievementNotFound:      "成就不存在",
  achievementNotMet:        "未达成",
  petAlreadyClaimed:        "已领取",

  // ── 祷言 ─────────────────────────────────────────────────────────────────
  prayerNotFound:           "祷言不存在",

  // ── 前哨站 ──────────────────────────────────────────────────────────────
  outpostExists:            "该区域已有前哨站",
  noOutposts:               "没有前哨站",

  // ── 赌博 ─────────────────────────────────────────────────────────────────
  invalidTier:              "无效等级",
} as const;

export default messages;

/** 获取消息并替换模板变量 */
export function msg(key: keyof typeof messages, ...args: any[]): string {
  const m = messages[key];
  if (typeof m === "function") return (m as Function)(...args);
  return m;
}
