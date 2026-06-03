import {
  db, gameStates, type GameState, eq,
  THIEVING_NPCS, calcStealth, calcThievingSuccessRate, calcThievingDoubleRate,
  COMBAT_GEM_POOLS,
  calculateLevel, getPlayerMaxHp, getPlayerAttack, getPlayerDefence,
  parseEquipment, parseLootBag, parseGems,
  getResourceCount, buildResourceUpdates,
  getAgilityBonuses,
  SKILLS_DATA, RARITY_ORDER, DISENCHANT_GOLD, mergeGems,
} from "./_shared";

const calcLevel = calculateLevel;

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
  const successRate = calcThievingSuccessRate(stealth, npc.perception) * agility.thievingMul;
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

      // Unique drop check
      if (npc.uniqueDrop) {
        const uniqueChance = 1 / (npc.uniqueDrop.chance / (1 + stealth / npc.perception));
        if (Math.random() < uniqueChance) {
          const item = generateDroppedItem(thievingLevel, 10);
          if (item) {
            item.name = npc.uniqueDrop.name;
            item.emoji = npc.uniqueDrop.emoji;
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
