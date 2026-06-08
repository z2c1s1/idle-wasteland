import {
  db, gameStates, type GameState, eq,
  getToolBonus, ALL_TOOLS,
  WOODCUTTING_BERRY_DROPS, HUNTING_HERB_DROPS,
  MINING_GEM_POOLS,
  calculateLevel, getPlayerMaxHp,
  parseEquipment, getResourceCount, buildResourceUpdates,
  getAgilityBonuses, getTemperatureMultiplier,
  SKILLS_DATA, RARITY_ORDER, DISENCHANT_GOLD, mergeGems, rollGemDropsFromPool, parseGems,
  trackAchievement, getPetBuffs,
} from "./_shared";

const calcLevel = calculateLevel;

export async function tickGathering(state: GameState, elapsedSeconds: number): Promise<GameState> {
  const action = state.activeAction;
  const [skill, indexStr] = action.split("_");
const index = parseInt(indexStr);
const skillData = SKILLS_DATA[skill];
const data = skillData?.[index];
if (!data) return state;

// Tool bonus + agility (钓鱼速度加成)
const toolBonus = getToolBonus(state.tool ?? '{}');
const agility = getAgilityBonuses(state);
const agilitySpeedMul = skill === 'fishing' ? agility.fishingMul : 1;
const tempMul = getTemperatureMultiplier(state);
const petBuffs = getPetBuffs(state);
const petSpeedMap: Record<string, number> = {
  woodcutting: petBuffs.woodSpeed, mining: petBuffs.mineSpeed, smelting: petBuffs.smeltSpeed,
  fishing: petBuffs.fishSpeed, hunting: petBuffs.huntSpeed,
  agility: petBuffs.agileSpeed, exploration: petBuffs.exploreSpeed,
};
const petSpeedMul = 1 + (petSpeedMap[skill] ?? 0);
const effectiveTime = data.time * toolBonus.timeMult / agilitySpeedMul / tempMul / petSpeedMul;

const completions = Math.floor(elapsedSeconds / effectiveTime);
if (completions <= 0) return state;

const extraYield = toolBonus.yieldBonus;

// Smelting: requires ore to produce bars
if (skill === 'smelting') {
  const oreKey = `ore_${index}`;
  const oreOwned = getResourceCount(state, oreKey);
  const possible = Math.min(completions, oreOwned);
  if (possible <= 0) {
    const [idle] = await db.update(gameStates)
      .set({ activeAction: "idle" } as any)
      .where(eq(gameStates.id, state.id)).returning();
    return idle;
  }
  const xpKey = `${skill}Xp` as keyof GameState;
  const resourceKey = `${data.prefix}_${index}`;
  const oreLeft = oreOwned - possible;
  // Track achievement progress for skill XP
  state.achievements = trackAchievement(state, 'skill', xpKey, possible);
  const barCount = getResourceCount(state, resourceKey) + possible;
  const resourcePatch = buildResourceUpdates(state, { [oreKey]: oreLeft, [resourceKey]: barCount });
  const updates: Partial<GameState> = {
    [xpKey]: (state[xpKey] as number) + possible * data.xp,
    ...resourcePatch,
    achievements: state.achievements,
    activeAction: (possible < completions || oreLeft <= 0) ? "idle" : state.activeAction,
    actionUpdatedAt: new Date(new Date(state.actionUpdatedAt).getTime() + possible * effectiveTime * 1000),
  };
  const [updated] = await db.update(gameStates).set(updates).where(eq(gameStates.id, state.id)).returning();
  return updated;
}

// 纯经验技能（如敏捷/探索）：无资源产出，仅给 XP
if (!data.prefix) {
  const xpKey = `${skill}Xp` as keyof GameState;
  // Track achievement + mastery
  state.achievements = trackAchievement(state, 'skill', xpKey, completions);
  const mastery: Record<string, number> = JSON.parse((state as any).mastery ?? '{}');
  mastery[skill] = (mastery[skill] ?? 0) + completions;
  const updates: Partial<GameState> = {
    [xpKey]: (state[xpKey] as number) + completions * data.xp,
    mastery: JSON.stringify(mastery),
    achievements: state.achievements,
    actionUpdatedAt: new Date(new Date(state.actionUpdatedAt).getTime() + completions * effectiveTime * 1000),
  };
  const [updated] = await db.update(gameStates).set(updates).where(eq(gameStates.id, state.id)).returning();
  return updated;
}

const xpKey = `${skill}Xp` as keyof GameState;
const resourceKey = `${data.prefix}_${index}`;
const yieldTotal = completions + extraYield * completions;
const newAmount = getResourceCount(state, resourceKey) + yieldTotal;
const resourcePatch = buildResourceUpdates(state, { [resourceKey]: newAmount });
// Track achievement progress
state.achievements = trackAchievement(state, 'skill', xpKey, completions);
const updates: Partial<GameState> = {
  [xpKey]: (state[xpKey] as number) + completions * data.xp,
  ...resourcePatch,
  achievements: state.achievements,
  actionUpdatedAt: new Date(new Date(state.actionUpdatedAt).getTime() + completions * effectiveTime * 1000),
};

// Woodcutting: wood + berries (13~33% chance per completion, quantity = tier+1)
if (skill === 'woodcutting') {
  const woodChance = 0.13 + Math.random() * 0.2;
  let woodGain = 0;
  for (let i = 0; i < completions; i++) {
    if (Math.random() < woodChance) woodGain += (index + 1);
  }
  updates.wood = (state.wood ?? 0) + woodGain;
  const berryDrop = WOODCUTTING_BERRY_DROPS.find(b => b.woodTier === index);
  if (berryDrop && Math.random() < berryDrop.chance) {
    const berries = JSON.parse(state.berries ?? '{}');
    berries[berryDrop.berryId] = (berries[berryDrop.berryId] ?? 0) + completions;
    updates.berries = JSON.stringify(berries);
  }
}

// Hunting: hide + meat + herbs
if (skill === 'hunting') {
  const meatKey = `meat_${index}`;
  const currentMeat = getResourceCount(state, meatKey);
  const meatPatch = buildResourceUpdates(state, { [meatKey]: currentMeat + yieldTotal });
  Object.assign(updates, meatPatch);
  const herbDrop = HUNTING_HERB_DROPS.find(h => h.hideTier === index);
  if (herbDrop && Math.random() < herbDrop.chance) {
    const herbs = JSON.parse(state.herbs ?? '{}');
    herbs[herbDrop.herbId] = (herbs[herbDrop.herbId] ?? 0) + completions;
    updates.herbs = JSON.stringify(herbs);
  }
}

// Mining: stone + gems (13~33% chance per completion, quantity = tier+1)
if (skill === 'mining') {
  const stoneChance = 0.13 + Math.random() * 0.2;
  let stoneGain = 0;
  for (let i = 0; i < completions; i++) {
    if (Math.random() < stoneChance) stoneGain += (index + 1);
  }
  updates.stone = (state.stone ?? 0) + stoneGain;
  const gemConfig = MINING_GEM_POOLS[Math.min(index, MINING_GEM_POOLS.length - 1)];
  const newGems = rollGemDropsFromPool(completions, gemConfig.chance, gemConfig.pool);
  if (Object.keys(newGems).length > 0) {
    const existingGems = parseGems(state.gems);
    updates.gems = JSON.stringify(mergeGems(existingGems, newGems));
  }
}

// 更新精通计数
const mastery: Record<string, number> = JSON.parse((state as any).mastery ?? '{}');
mastery[skill] = (mastery[skill] ?? 0) + completions;
updates.mastery = JSON.stringify(mastery) as any;

const [updated] = await db.update(gameStates).set(updates).where(eq(gameStates.id, state.id)).returning();
return updated;
}
