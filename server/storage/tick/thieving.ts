import {
  db, gameStates, type GameState, eq,
  THIEVING_NPCS, calcStealth, calcThievingSuccessRate, calcThievingDoubleRate,
  COMBAT_GEM_POOLS, getEquipmentBonuses, generateDroppedItem,
  type GameItem,
  calculateLevel, getPlayerMaxHp, getPlayerAttack, getPlayerDefence,
  parseEquipment, parseLootBag, parseGems,
  getResourceCount, buildResourceUpdates,
  getAgilityBonuses,
  SKILLS_DATA, RARITY_ORDER, DISENCHANT_GOLD, mergeGems,
  getPetBuffs,
} from "./_shared";

const calcLevel = calculateLevel;

/** Create a loot GameItem from a thieving common drop definition */
function makeLootItem(drop: { name: string; emoji: string; qty: number; chance: number }, thievingLevel: number): GameItem | null {
  // Simple item generation: give it a random ilvl based on thieving level
  const ilvl = Math.max(1, Math.floor(thievingLevel * 0.8 + Math.random() * thievingLevel * 0.4));
  const id = `thieve_${drop.name.replace(/\s/g,'_')}_${Date.now()}_${Math.random().toString(36).slice(2,6)}`;
  // Determine rarity based on drop chance (lower chance = higher rarity)
  let rarity: GameItem['rarity'] = 'common';
  if (drop.chance <= 0.03) rarity = 'mythic';
  else if (drop.chance <= 0.05) rarity = 'legendary';
  else if (drop.chance <= 0.08) rarity = 'epic';
  else if (drop.chance <= 0.12) rarity = 'rare';
  else if (drop.chance <= 0.18) rarity = 'uncommon';
  return {
    instanceId: id,
    name: drop.name,
    emoji: drop.emoji,
    slot: 'ring' as any, // misc item
    rarity,
    ilvl,
    attackBonus: 0, defenceBonus: 0, hpBonus: 0, critRating: 0,
    enhancedDamage: 0, lifeOnKill: 0, crushingBlow: 0, magicFind: 0,
    lifeRegen: 0, goldBonus: 0, resistAll: 0, lifeLeech: 0, deadlyStrike: 0,
    attackSpeed: 0, reflectDamage: 0,
    minDamage: 0, maxDamage: 0,
    source: 'dropped' as const,
    baseType: drop.name,
    maxSockets: 0, socketedGems: [], skills: [],
    affixes: [], prefixes: [], suffixes: [],
  };
}

export async function tickThieving(state: GameState, elapsedSeconds: number): Promise<GameState> {
  const action = state.activeAction;
  const npcId = action.replace("thieve_", "");
  const npc = THIEVING_NPCS.find(n => n.id === npcId);
  if (!npc) return state;

  const thievingLevel = calcLevel(state.thievingXp);
  if (thievingLevel < npc.level) return state;

  const equipment = parseEquipment(state.equipment);
  const { critRating } = getEquipmentBonuses(equipment);
  const stealth = calcStealth(thievingLevel, critRating);
  const agility = getAgilityBonuses(state);
  const petBuffs = getPetBuffs(state);
  const successRate = calcThievingSuccessRate(stealth, npc.perception) * agility.thievingMul * (1 + petBuffs.thiefRate);
  const doubleRate = calcThievingDoubleRate(stealth, npc.perception);

  const ticks = Math.floor(elapsedSeconds / npc.interval);
  if (ticks <= 0) return state;

  let goldGained = 0, thievingXpGained = 0;
  const newDrops: GameItem[] = [];
  const playerMaxHp = getPlayerMaxHp(state);
  let playerHp = state.playerHp < 0 ? playerMaxHp : state.playerHp;
  let playerDied = false;
  let successes = 0, fails = 0;

  for (let i = 0; i < ticks; i++) {
    if (Math.random() < successRate) {
      successes++;
      const gpBase = npc.gpMin + Math.floor(Math.random() * (npc.gpMax - npc.gpMin + 1));
      let gp = gpBase;
      if (Math.random() < doubleRate) gp += gpBase;
      goldGained += gp;
      thievingXpGained += npc.xp;

      // Common drop check: each common drop rolls independently
      for (const drop of npc.commonDrops) {
        if (Math.random() < drop.chance) {
          // Generate a loot item for the common drop
          const lootItem = makeLootItem(drop, thievingLevel);
          if (lootItem) newDrops.push(lootItem);
        }
      }

      // Unique drop check
      if (npc.uniqueDrop) {
        const uniqueChance = 1 / (npc.uniqueDrop.chance / (1 + stealth / npc.perception));
        if (Math.random() < uniqueChance) {
          const item = generateDroppedItem(thievingLevel, 10);
          if (item) {
            item.name = npc.uniqueDrop.name;
            item.emoji = npc.uniqueDrop.emoji;
            item.rarity = 'legendary';
            newDrops.push(item);
          }
        }
      }
    } else {
      fails++;
      const dmg = Math.max(1, Math.floor(npc.maxHit * (0.5 + Math.random() * 0.5)));
      playerHp -= dmg;
      if (playerHp <= 0) {
        playerDied = true;
        playerHp = Math.floor(playerMaxHp * 0.5);
        break;
      }
    }
  }

  const usedTime = Math.min(elapsedSeconds, ticks * npc.interval);
  const existingLoot = parseLootBag(state.lootBag);
  const combinedLoot = [...existingLoot, ...newDrops].slice(-50);

  const updates: Partial<GameState> = {
    playerHp,
    gold:        state.gold        + goldGained,
    thievingXp:  state.thievingXp  + thievingXpGained,
    lootBag:     JSON.stringify(combinedLoot),
    actionUpdatedAt: new Date(new Date(state.actionUpdatedAt).getTime() + usedTime * 1000),
    ...(playerDied ? { activeAction: "idle" } : {}),
  };

  const [updated] = await db.update(gameStates).set(updates).where(eq(gameStates.id, state.id)).returning();
  return updated;
}
