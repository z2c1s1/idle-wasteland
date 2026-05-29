import { db } from "./db";
import { gameStates, type GameState } from "@shared/schema";
import {
  ENEMIES, SMITHING_RECIPES, LEATHERWORKING_RECIPES, JEWELCRAFTING_RECIPES,
  getEquipmentBonuses, generateDroppedItem, getDropChance, craftedToGameItem,
  MINING_GEM_POOLS, COMBAT_GEM_POOLS, getGemBonus,
  type GameItem, type EquipmentState, type EquipmentSlot, type CraftingRecipe, type ItemSkill,
} from "@shared/game-data";
import { eq } from "drizzle-orm";

// ─── Gathering skill data ──────────────────────────────────────────────────────
export const SKILLS_DATA: Record<string, { name: string; time: number; xp: number; prefix: string }[]> = {
  woodcutting: Array.from({ length: 10 }, (_, i) => ({
    name: ["橡木","柳木","柚木","枫木","桃花心木","紫杉木","魔法木","古树木","红杉木","灵木"][i],
    time: 5 + i * 5, xp: 10 + i * 15, prefix: "wood",
  })),
  mining: Array.from({ length: 10 }, (_, i) => ({
    name: ["铜矿","锡矿","铁矿","煤矿","秘银矿","精金矿","符文矿","龙矿","黑曜矿","以太矿"][i],
    time: 5 + i * 5, xp: 15 + i * 20, prefix: "ore",
  })),
  smelting: Array.from({ length: 10 }, (_, i) => ({
    name: ["青铜锭","铁锭","钢锭","银锭","金锭","秘银锭","精金锭","符文锭","龙锭","永恒锭"][i],
    time: 5 + i * 5, xp: 20 + i * 25, prefix: "bar",
  })),
  fishing: Array.from({ length: 10 }, (_, i) => ({
    name: ["虾","沙丁鱼","鲱鱼","鳟鱼","三文鱼","金枪鱼","龙虾","旗鱼","鲨鱼","鲸鱼"][i],
    time: 5 + i * 5, xp: 12 + i * 18, prefix: "fish",
  })),
  hunting: Array.from({ length: 10 }, (_, i) => ({
    name: ["兔皮","鸟羽","狐皮","狼皮","熊皮","野猪皮","鹿皮","虎皮","龙皮","凤凰羽"][i],
    time: 5 + i * 5, xp: 18 + i * 22, prefix: "hide",
  })),
  crafting: Array.from({ length: 10 }, (_, i) => ({
    name: ["布料","皮革","珠宝料","甲料","兵器料","神器料","遗物料","杰作料","天界料","神圣料"][i],
    time: 5 + i * 5, xp: 25 + i * 30, prefix: "item",
  })),
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
function calcLevel(xp: number): number { return Math.floor(Math.sqrt(Math.max(0, xp))) + 1; }

function parseEquipment(raw: string): EquipmentState {
  try { return JSON.parse(raw) as EquipmentState; } catch { return {}; }
}
function parseCraftItems(raw: string): Record<string, number> {
  try { return JSON.parse(raw) as Record<string, number>; } catch { return {}; }
}
function parseLootBag(raw: string): GameItem[] {
  try { return JSON.parse(raw) as GameItem[]; } catch { return []; }
}
function parseGems(raw: string): Record<string, number> {
  try { return JSON.parse(raw) as Record<string, number>; } catch { return {}; }
}

function getPlayerMaxHp(state: GameState): number {
  const equipment = parseEquipment(state.equipment);
  const { hpBonus } = getEquipmentBonuses(equipment);
  return 10 + (calcLevel(state.hitpointsXp) - 1) * 5 + hpBonus;
}

function getPlayerAttack(state: GameState): number {
  const equipment = parseEquipment(state.equipment);
  const { attackBonus, critRating } = getEquipmentBonuses(equipment);
  const baseAtk = Math.max(1, Math.floor(calcLevel(state.attackXp) * 1.2) + attackBonus);
  const critMult = 1 + (critRating / 100) * 0.5;
  return Math.floor(baseAtk * critMult);
}

function getPlayerDefence(state: GameState): number {
  const equipment = parseEquipment(state.equipment);
  const { defenceBonus } = getEquipmentBonuses(equipment);
  return Math.floor(calcLevel(state.defenceXp) * 0.8) + defenceBonus;
}

export function getCombatLevel(state: GameState): number {
  return Math.floor((calcLevel(state.attackXp) + calcLevel(state.defenceXp) + calcLevel(state.hitpointsXp)) / 3);
}

// Roll gems from a pool using expected-value distribution
function rollGemDropsFromPool(completions: number, chance: number, pool: string[]): Record<string, number> {
  const expected = completions * chance;
  const total = Math.floor(expected) + (Math.random() < (expected % 1) ? 1 : 0);
  const gems: Record<string, number> = {};
  for (let i = 0; i < total; i++) {
    const key = pool[Math.floor(Math.random() * pool.length)];
    gems[key] = (gems[key] ?? 0) + 1;
  }
  return gems;
}

function mergeGems(a: Record<string, number>, b: Record<string, number>): Record<string, number> {
  const out = { ...a };
  for (const [k, v] of Object.entries(b)) out[k] = (out[k] ?? 0) + v;
  return out;
}

// Generic production recipe handler
async function handleProductionRecipe(
  state: GameState,
  recipes: CraftingRecipe[],
  recipeIndex: number,
  xpKey: keyof GameState,
  now: Date,
): Promise<{ updates: Partial<GameState>; updated?: GameState } | null> {
  const recipe = recipes[recipeIndex];
  if (!recipe) return null;

  const elapsedSeconds = (now.getTime() - new Date(state.actionUpdatedAt).getTime()) / 1000;
  const ticks = Math.floor(elapsedSeconds / recipe.time);
  if (ticks <= 0) return null;

  const craftItems = parseCraftItems(state.craftItems);
  const tempRes: Record<string, number> = {};
  for (const inp of recipe.inputs) tempRes[inp.resource] = ((state as Record<string, unknown>)[inp.resource] as number) ?? 0;

  let actualTicks = 0;
  for (let i = 0; i < ticks; i++) {
    if (!recipe.inputs.every(inp => (tempRes[inp.resource] ?? 0) >= inp.qty)) break;
    for (const inp of recipe.inputs) tempRes[inp.resource] -= inp.qty;
    craftItems[recipe.output] = (craftItems[recipe.output] ?? 0) + 1;
    actualTicks++;
  }

  const updates: Partial<GameState> = {
    [xpKey]: (state[xpKey] as number) + actualTicks * recipe.xp,
    craftItems: JSON.stringify(craftItems),
    actionUpdatedAt: new Date(new Date(state.actionUpdatedAt).getTime() + actualTicks * recipe.time * 1000),
  };
  for (const inp of recipe.inputs) (updates as Record<string, unknown>)[inp.resource] = tempRes[inp.resource];
  if (actualTicks === 0 || actualTicks < ticks) updates.activeAction = "idle";

  return { updates };
}

// ─── Storage interface ─────────────────────────────────────────────────────────
export interface IStorage {
  getGameState(): Promise<GameState>;
  updateAction(action: string): Promise<GameState>;
  equipItem(instanceId?: string, itemId?: string): Promise<GameState>;
  unequipItem(slot: string): Promise<GameState>;
  destroyLoot(instanceId: string): Promise<GameState>;
  socketGem(instanceId: string, gemKey: string): Promise<GameState>;
}

// ─── DatabaseStorage ───────────────────────────────────────────────────────────
export class DatabaseStorage implements IStorage {
  async getGameState(): Promise<GameState> {
    let [state] = await db.select().from(gameStates).limit(1);
    if (!state) {
      const [newState] = await db.insert(gameStates).values({}).returning();
      state = newState;
    }

    const action = state.activeAction;
    if (action === "idle") return state;

    const now = new Date();
    const elapsedSeconds = (now.getTime() - new Date(state.actionUpdatedAt).getTime()) / 1000;
    if (elapsedSeconds <= 0) return state;

    // ── Combat ────────────────────────────────────────────────────────────────
    if (action.startsWith("combat_")) {
      const enemyIndex = parseInt(action.split("_")[1]);
      const enemy = ENEMIES[enemyIndex];
      if (!enemy) return state;

      // Parse equipment early so attack_speed can shorten the combat cycle
      const equipment = parseEquipment(state.equipment);
      const allSkills: ItemSkill[] = Object.values(equipment).flatMap(item => item?.skills ?? []);
      const getSkillVal = (type: ItemSkill['type']) =>
        allSkills.filter(s => s.type === type).reduce((sum, s) => sum + s.value, 0);

      // Diablo-style equipment stats (all 15 affix types)
      const {
        attackBonus: eqAttackBonus,
        enhancedDamage, lifeOnKill, crushingBlow, magicFind,
        lifeRegen, goldBonus, resistAll,
        lifeLeech, deadlyStrike, attackSpeed, reflectDamage,
      } = getEquipmentBonuses(equipment);

      const spellbladePct  = getSkillVal('spellblade');
      const poisonDmg      = getSkillVal('poison');
      const thornsDmg      = getSkillVal('thorns');
      const lifeStealPct   = getSkillVal('lifesteal');
      const vampiricHp     = getSkillVal('vampiric');
      const berserkPct     = getSkillVal('berserk');
      const doubleStrikePct= getSkillVal('doublestrike');
      const dodgePct       = getSkillVal('dodge');

      // Attack Speed: reduces combat cycle time (true interval reduction, not DPS multiplier)
      // Each % of attack speed shrinks the 3-second round by 0.5%, capped at 50% reduction (1.5s min)
      const BASE_COMBAT_SPEED = 3;
      const effectiveCombatSpeed = Math.max(1.5, BASE_COMBAT_SPEED * (1 - attackSpeed / 200));
      const ticks = Math.floor(elapsedSeconds / effectiveCombatSpeed);
      if (ticks <= 0) return state;

      const playerMaxHp = getPlayerMaxHp(state);
      let playerHp = state.playerHp < 0 ? playerMaxHp : state.playerHp;
      let enemyHp  = state.enemyHp  < 0 ? enemy.maxHp  : state.enemyHp;

      const playerAtk = getPlayerAttack(state);
      const playerDef = getPlayerDefence(state);

      // Weapon damage: per-hit roll from equipped weapon's min/max range (Diablo-style)
      const weaponItem = equipment.weapon ?? null;
      const hasWeaponRange = weaponItem && (weaponItem.maxDamage ?? 0) > 0;
      // Level-based base damage (attack level × 1.2), excluding equipment attack bonus
      const levelBaseDmg = Math.max(1, playerAtk - eqAttackBonus);

      let goldGained = 0, bonesGained = 0, dragonBonesGained = 0;
      let attackXpGained = 0, defenceXpGained = 0, hitpointsXpGained = 0;
      let playerDied = false;
      const newDrops: GameItem[] = [];
      let gemsGained: Record<string, number> = {};
      const dropChance = getDropChance(enemyIndex);
      const gemPool = COMBAT_GEM_POOLS[Math.min(enemyIndex, COMBAT_GEM_POOLS.length - 1)];

      for (let i = 0; i < ticks; i++) {
        // Life Regeneration (Diablo: passive HP regen per tick)
        if (lifeRegen > 0) playerHp = Math.min(playerMaxHp, playerHp + lifeRegen);

        // Per-hit weapon damage roll (Diablo-style: random from weapon min–max range)
        const weaponRoll = hasWeaponRange && weaponItem
          ? (weaponItem.minDamage ?? 0) + Math.floor(Math.random() * ((weaponItem.maxDamage ?? 0) - (weaponItem.minDamage ?? 0) + 1))
          : levelBaseDmg;
        // Total base = rolled weapon damage + affix attack bonus
        const perHitBase = Math.max(1, weaponRoll + eqAttackBonus);

        // Calculate effective attack
        let effAtk = Math.max(1, perHitBase - enemy.defence);
        if (spellbladePct > 0)  effAtk = Math.floor(effAtk * (1 + spellbladePct / 100));
        if (enhancedDamage > 0) effAtk = Math.floor(effAtk * (1 + enhancedDamage / 100));
        if (berserkPct > 0 && playerHp < playerMaxHp * 0.3) effAtk = Math.floor(effAtk * (1 + berserkPct / 100));
        // (Attack speed is handled via cycle-time reduction above, not a per-tick multiplier)

        // Deadly Strike (Diablo: % chance to double all damage for this strike)
        const deadlyStrikeHit = deadlyStrike > 0 && Math.random() * 100 < deadlyStrike;
        const strikes = (doubleStrikePct > 0 && Math.random() * 100 < doubleStrikePct) ? 2 : 1;
        let totalDmgToEnemy = effAtk * strikes * (deadlyStrikeHit ? 2 : 1) + poisonDmg;

        // Crushing Blow (Diablo: % chance to deal 25% of enemy current HP)
        if (crushingBlow > 0 && Math.random() * 100 < crushingBlow) {
          totalDmgToEnemy += Math.max(1, Math.floor(enemyHp * 0.25));
        }

        enemyHp -= totalDmgToEnemy;
        attackXpGained += 4 * strikes;

        // Life Leech (Diablo: % of damage dealt healed to player)
        if (lifeLeech > 0) {
          playerHp = Math.min(playerMaxHp, playerHp + Math.floor(totalDmgToEnemy * lifeLeech / 100));
        }

        // Lifesteal (skill-based)
        if (lifeStealPct > 0) {
          playerHp = Math.min(playerMaxHp, playerHp + Math.floor(totalDmgToEnemy * lifeStealPct / 100));
        }

        if (enemyHp <= 0) {
          const rawGold = enemy.drops.gold[0];
          const bonusGold = goldBonus > 0 ? Math.floor(rawGold * goldBonus / 100) : 0;
          goldGained        += rawGold + bonusGold;
          bonesGained       += enemy.drops.bones ?? 0;
          dragonBonesGained += enemy.drops.dragonBones ?? 0;
          attackXpGained    += enemy.xp;
          hitpointsXpGained += Math.floor(enemy.xp / 3);
          if (Math.random() < dropChance) newDrops.push(generateDroppedItem(enemyIndex, magicFind));
          // Gem drop on kill
          if (Math.random() < gemPool.chance) {
            const gk = gemPool.pool[Math.floor(Math.random() * gemPool.pool.length)];
            gemsGained[gk] = (gemsGained[gk] ?? 0) + 1;
          }
          // Life on Kill (Diablo)
          if (lifeOnKill > 0) playerHp = Math.min(playerMaxHp, playerHp + lifeOnKill);
          // Vampiric on kill
          if (vampiricHp > 0) playerHp = Math.min(playerMaxHp, playerHp + vampiricHp);
          enemyHp = enemy.maxHp;
        }

        // Incoming damage — Resist All reduces flat damage
        const rawDmg = Math.max(0, enemy.attack - playerDef);
        const dmgToPlayer = Math.max(0, rawDmg - resistAll);
        const dodged = dodgePct > 0 && Math.random() * 100 < dodgePct;
        if (!dodged && dmgToPlayer > 0) {
          playerHp -= dmgToPlayer;
          defenceXpGained   += 2;
          hitpointsXpGained += 1;
          // Thorns (skill)
          if (thornsDmg > 0) enemyHp -= thornsDmg;
          // Reflect Damage (Diablo: flat damage returned to attacker per hit)
          if (reflectDamage > 0) enemyHp -= reflectDamage;
        }

        if (playerHp <= 0) {
          playerDied = true;
          playerHp = Math.floor(playerMaxHp * 0.5);
          break;
        }
      }

      const usedTime = playerDied ? elapsedSeconds : ticks * effectiveCombatSpeed;
      const existingLoot = parseLootBag(state.lootBag);
      const combinedLoot = [...existingLoot, ...newDrops].slice(-50);
      const existingGems = parseGems(state.gems);

      const updates: Partial<GameState> = {
        playerHp, enemyHp,
        gold:        state.gold        + goldGained,
        bones:       state.bones       + bonesGained,
        dragonBones: state.dragonBones + dragonBonesGained,
        attackXp:    state.attackXp    + attackXpGained,
        defenceXp:   state.defenceXp   + defenceXpGained,
        hitpointsXp: state.hitpointsXp + hitpointsXpGained,
        lootBag: JSON.stringify(combinedLoot),
        gems:    JSON.stringify(mergeGems(existingGems, gemsGained)),
        actionUpdatedAt: new Date(new Date(state.actionUpdatedAt).getTime() + usedTime * 1000),
        ...(playerDied ? { activeAction: "idle" } : {}),
      };

      const [updated] = await db.update(gameStates).set(updates).where(eq(gameStates.id, state.id)).returning();
      return updated;
    }

    // ── Smithing ──────────────────────────────────────────────────────────────
    if (action.startsWith("smith_")) {
      const recipeIndex = parseInt(action.split("_")[1]);
      const result = await handleProductionRecipe(state, SMITHING_RECIPES, recipeIndex, "smithingXp", now);
      if (!result) return state;
      const [updated] = await db.update(gameStates).set(result.updates).where(eq(gameStates.id, state.id)).returning();
      return updated;
    }

    // ── Leatherworking ────────────────────────────────────────────────────────
    if (action.startsWith("leather_")) {
      const recipeIndex = parseInt(action.split("_")[1]);
      const result = await handleProductionRecipe(state, LEATHERWORKING_RECIPES, recipeIndex, "leatherworkingXp", now);
      if (!result) return state;
      const [updated] = await db.update(gameStates).set(result.updates).where(eq(gameStates.id, state.id)).returning();
      return updated;
    }

    // ── Jewelcrafting ─────────────────────────────────────────────────────────
    if (action.startsWith("jewel_")) {
      const recipeIndex = parseInt(action.split("_")[1]);
      const result = await handleProductionRecipe(state, JEWELCRAFTING_RECIPES, recipeIndex, "jewelcraftingXp", now);
      if (!result) return state;
      const [updated] = await db.update(gameStates).set(result.updates).where(eq(gameStates.id, state.id)).returning();
      return updated;
    }

    // ── Gathering ─────────────────────────────────────────────────────────────
    const [skill, indexStr] = action.split("_");
    const index = parseInt(indexStr);
    const skillData = SKILLS_DATA[skill];
    const data = skillData?.[index];
    if (!data) return state;

    const completions = Math.floor(elapsedSeconds / data.time);
    if (completions <= 0) return state;

    const xpKey = `${skill}Xp` as keyof GameState;
    const resourceKey = `${data.prefix}_${index}` as keyof GameState;
    const updates: Partial<GameState> = {
      [xpKey]: (state[xpKey] as number) + completions * data.xp,
      [resourceKey]: (state[resourceKey] as number) + completions,
      actionUpdatedAt: new Date(new Date(state.actionUpdatedAt).getTime() + completions * data.time * 1000),
    };

    // Mining gem drops
    if (skill === 'mining') {
      const gemConfig = MINING_GEM_POOLS[Math.min(index, MINING_GEM_POOLS.length - 1)];
      const newGems = rollGemDropsFromPool(completions, gemConfig.chance, gemConfig.pool);
      if (Object.keys(newGems).length > 0) {
        const existingGems = parseGems(state.gems);
        updates.gems = JSON.stringify(mergeGems(existingGems, newGems));
      }
    }

    const [updated] = await db.update(gameStates).set(updates).where(eq(gameStates.id, state.id)).returning();
    return updated;
  }

  async updateAction(action: string): Promise<GameState> {
    const currentState = await this.getGameState();
    const [updated] = await db.update(gameStates)
      .set({ activeAction: action, actionUpdatedAt: new Date() })
      .where(eq(gameStates.id, currentState.id)).returning();
    return updated;
  }

  async equipItem(instanceId?: string, itemId?: string): Promise<GameState> {
    const state = await this.getGameState();
    const equipment = parseEquipment(state.equipment);
    const craftItems = parseCraftItems(state.craftItems);
    const lootBag = parseLootBag(state.lootBag);

    let newItem: GameItem | null = null;

    if (instanceId) {
      const idx = lootBag.findIndex(i => i.instanceId === instanceId);
      if (idx < 0) throw new Error("Item not found in loot bag");
      newItem = lootBag[idx];
      lootBag.splice(idx, 1);
    } else if (itemId) {
      if ((craftItems[itemId] ?? 0) < 1) throw new Error("Item not in inventory");
      craftItems[itemId]--;
      if (craftItems[itemId] <= 0) delete craftItems[itemId];
      newItem = craftedToGameItem(itemId);
      if (!newItem) throw new Error("Unknown item");
    } else {
      throw new Error("Must provide instanceId or itemId");
    }

    const prev = equipment[newItem.slot as EquipmentSlot] ?? null;
    if (prev) {
      if (prev.source === 'smithed' && prev.baseId) {
        craftItems[prev.baseId] = (craftItems[prev.baseId] ?? 0) + 1;
      } else {
        lootBag.push(prev);
      }
    }

    equipment[newItem.slot as EquipmentSlot] = newItem;

    const [updated] = await db.update(gameStates).set({
      equipment:  JSON.stringify(equipment),
      craftItems: JSON.stringify(craftItems),
      lootBag:    JSON.stringify(lootBag),
    }).where(eq(gameStates.id, state.id)).returning();
    return updated;
  }

  async unequipItem(slot: string): Promise<GameState> {
    const state = await this.getGameState();
    const equipment = parseEquipment(state.equipment);
    const item = equipment[slot as EquipmentSlot] ?? null;
    if (!item) throw new Error("Nothing equipped in that slot");

    const craftItems = parseCraftItems(state.craftItems);
    const lootBag = parseLootBag(state.lootBag);

    if (item.source === 'smithed' && item.baseId) {
      craftItems[item.baseId] = (craftItems[item.baseId] ?? 0) + 1;
    } else {
      lootBag.push(item);
    }
    delete equipment[slot as EquipmentSlot];

    const [updated] = await db.update(gameStates).set({
      equipment:  JSON.stringify(equipment),
      craftItems: JSON.stringify(craftItems),
      lootBag:    JSON.stringify(lootBag),
    }).where(eq(gameStates.id, state.id)).returning();
    return updated;
  }

  async destroyLoot(instanceId: string): Promise<GameState> {
    const state = await this.getGameState();
    const lootBag = parseLootBag(state.lootBag).filter(i => i.instanceId !== instanceId);
    const [updated] = await db.update(gameStates)
      .set({ lootBag: JSON.stringify(lootBag) })
      .where(eq(gameStates.id, state.id)).returning();
    return updated;
  }

  async socketGem(instanceId: string, gemKey: string): Promise<GameState> {
    const state = await this.getGameState();
    const gems = parseGems(state.gems);
    if ((gems[gemKey] ?? 0) < 1) throw new Error("You don't have that gem");

    const lootBag  = parseLootBag(state.lootBag);
    const equipment = parseEquipment(state.equipment);

    // Find item in lootBag first, then equipped
    let item: GameItem | null = null;
    let inLoot = false;
    const lootIdx = lootBag.findIndex(i => i.instanceId === instanceId);
    if (lootIdx >= 0) { item = lootBag[lootIdx]; inLoot = true; }
    else {
      for (const slot of Object.keys(equipment) as EquipmentSlot[]) {
        if (equipment[slot]?.instanceId === instanceId) { item = equipment[slot]!; break; }
      }
    }

    if (!item) throw new Error("Item not found");
    const sockets = item.socketedGems ?? [];
    const maxSockets = item.maxSockets ?? 0;
    if (sockets.length >= maxSockets) throw new Error("No empty sockets");

    // Apply gem bonus to item stats
    const bonus = getGemBonus(gemKey);
    const updatedItem: GameItem = {
      ...item,
      socketedGems: [...sockets, gemKey],
      attackBonus:  item.attackBonus  + bonus.attackBonus,
      defenceBonus: item.defenceBonus + bonus.defenceBonus,
      hpBonus:      item.hpBonus      + bonus.hpBonus,
      critRating:   item.critRating   + bonus.critRating,
    };

    // Update gem inventory
    gems[gemKey]--;
    if (gems[gemKey] <= 0) delete gems[gemKey];

    // Put updated item back
    if (inLoot) lootBag[lootIdx] = updatedItem;
    else {
      for (const slot of Object.keys(equipment) as EquipmentSlot[]) {
        if (equipment[slot]?.instanceId === instanceId) { equipment[slot] = updatedItem; break; }
      }
    }

    const [updated] = await db.update(gameStates).set({
      gems:      JSON.stringify(gems),
      lootBag:   JSON.stringify(lootBag),
      equipment: JSON.stringify(equipment),
    }).where(eq(gameStates.id, state.id)).returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
