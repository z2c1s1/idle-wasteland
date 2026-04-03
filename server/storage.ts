import { db } from "./db";
import { gameStates, type GameState } from "@shared/schema";
import { ENEMIES, EQUIPMENT_ITEMS, SMITHING_RECIPES, getEquipmentBonuses, type EquipmentState } from "@shared/game-data";
import { eq } from "drizzle-orm";

// ─── Skill data (gathering) ───────────────────────────────────────────────────
export const SKILLS_DATA: Record<string, { name: string; time: number; xp: number; prefix: string }[]> = {
  woodcutting: Array.from({ length: 10 }, (_, i) => ({
    name: ["Oak", "Willow", "Teak", "Maple", "Mahogany", "Yew", "Magic", "Elder", "Redwood", "Spirit"][i],
    time: 5 + i * 5, xp: 10 + i * 15, prefix: "wood",
  })),
  mining: Array.from({ length: 10 }, (_, i) => ({
    name: ["Copper", "Tin", "Iron", "Coal", "Mithril", "Adamant", "Rune", "Dragon", "Obsidian", "Ether"][i],
    time: 5 + i * 5, xp: 15 + i * 20, prefix: "ore",
  })),
  smelting: Array.from({ length: 10 }, (_, i) => ({
    name: ["Bronze", "Iron", "Steel", "Silver", "Gold", "Mithril", "Adamant", "Rune", "Dragon", "Eternal"][i],
    time: 5 + i * 5, xp: 20 + i * 25, prefix: "bar",
  })),
  fishing: Array.from({ length: 10 }, (_, i) => ({
    name: ["Shrimp", "Sardine", "Herring", "Trout", "Salmon", "Tuna", "Lobster", "Swordfish", "Shark", "Whale"][i],
    time: 5 + i * 5, xp: 12 + i * 18, prefix: "fish",
  })),
  hunting: Array.from({ length: 10 }, (_, i) => ({
    name: ["Rabbit", "Bird", "Fox", "Wolf", "Bear", "Boar", "Deer", "Tiger", "Dragon", "Phoenix"][i],
    time: 5 + i * 5, xp: 18 + i * 22, prefix: "hide",
  })),
  crafting: Array.from({ length: 10 }, (_, i) => ({
    name: ["Cloth", "Leather", "Jewelry", "Armor", "Weapon", "Artifact", "Relic", "Masterpiece", "Celestial", "Divine"][i],
    time: 5 + i * 5, xp: 25 + i * 30, prefix: "item",
  })),
};

// ─── Player stat helpers ───────────────────────────────────────────────────────
function calcLevel(xp: number): number {
  return Math.floor(Math.sqrt(Math.max(0, xp))) + 1;
}

function parseEquipment(raw: string): EquipmentState {
  try { return JSON.parse(raw) as EquipmentState; } catch { return {}; }
}

function parseCraftItems(raw: string): Record<string, number> {
  try { return JSON.parse(raw) as Record<string, number>; } catch { return {}; }
}

function getPlayerMaxHp(state: GameState): number {
  return 10 + (calcLevel(state.hitpointsXp) - 1) * 5;
}

function getPlayerAttack(state: GameState): number {
  const equipment = parseEquipment(state.equipment);
  const { attackBonus } = getEquipmentBonuses(equipment);
  return Math.max(1, Math.floor(calcLevel(state.attackXp) * 1.2) + attackBonus);
}

function getPlayerDefence(state: GameState): number {
  const equipment = parseEquipment(state.equipment);
  const { defenceBonus } = getEquipmentBonuses(equipment);
  return Math.floor(calcLevel(state.defenceXp) * 0.8) + defenceBonus;
}

export function getCombatLevel(state: GameState): number {
  const atk = calcLevel(state.attackXp);
  const def = calcLevel(state.defenceXp);
  const hp  = calcLevel(state.hitpointsXp);
  return Math.floor((atk + def + hp) / 3);
}

// ─── Storage interface ────────────────────────────────────────────────────────
export interface IStorage {
  getGameState(): Promise<GameState>;
  updateAction(action: string): Promise<GameState>;
  equipItem(itemId: string): Promise<GameState>;
  unequipItem(slot: string): Promise<GameState>;
}

// ─── Database storage ─────────────────────────────────────────────────────────
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

    // ── Combat ──────────────────────────────────────────────────────────────
    if (action.startsWith("combat_")) {
      const enemyIndex = parseInt(action.split("_")[1]);
      const enemy = ENEMIES[enemyIndex];
      if (!enemy) return state;

      const COMBAT_SPEED = 3;
      const ticks = Math.floor(elapsedSeconds / COMBAT_SPEED);
      if (ticks <= 0) return state;

      const playerMaxHp = getPlayerMaxHp(state);
      let playerHp = state.playerHp < 0 ? playerMaxHp : state.playerHp;
      let enemyHp  = state.enemyHp  < 0 ? enemy.maxHp  : state.enemyHp;

      const playerAtk = getPlayerAttack(state);
      const playerDef = getPlayerDefence(state);
      const dmgToEnemy  = Math.max(1, playerAtk - enemy.defence);
      const dmgToPlayer = Math.max(0, enemy.attack - playerDef);

      let goldGained = 0, bonesGained = 0, dragonBonesGained = 0;
      let attackXpGained = 0, defenceXpGained = 0, hitpointsXpGained = 0;
      let playerDied = false;

      for (let i = 0; i < ticks; i++) {
        // Player attacks
        enemyHp -= dmgToEnemy;
        attackXpGained += 4;

        if (enemyHp <= 0) {
          goldGained        += enemy.drops.gold[0];
          bonesGained       += enemy.drops.bones ?? 0;
          dragonBonesGained += enemy.drops.dragonBones ?? 0;
          attackXpGained    += enemy.xp;
          hitpointsXpGained += Math.floor(enemy.xp / 3);
          enemyHp = enemy.maxHp; // respawn
        }

        // Enemy attacks
        if (dmgToPlayer > 0) {
          playerHp -= dmgToPlayer;
          defenceXpGained   += 2;
          hitpointsXpGained += 1;
        }

        if (playerHp <= 0) {
          playerDied = true;
          playerHp = Math.floor(playerMaxHp * 0.5);
          break;
        }
      }

      const usedTime = playerDied
        ? elapsedSeconds
        : ticks * COMBAT_SPEED;

      const updates: Partial<GameState> = {
        playerHp,
        enemyHp,
        gold:         state.gold         + goldGained,
        bones:        state.bones        + bonesGained,
        dragonBones:  state.dragonBones  + dragonBonesGained,
        attackXp:     state.attackXp     + attackXpGained,
        defenceXp:    state.defenceXp    + defenceXpGained,
        hitpointsXp:  state.hitpointsXp  + hitpointsXpGained,
        actionUpdatedAt: new Date(new Date(state.actionUpdatedAt).getTime() + usedTime * 1000),
        ...(playerDied ? { activeAction: "idle" } : {}),
      };

      const [updated] = await db.update(gameStates).set(updates).where(eq(gameStates.id, state.id)).returning();
      return updated;
    }

    // ── Smithing ─────────────────────────────────────────────────────────────
    if (action.startsWith("smith_")) {
      const recipeIndex = parseInt(action.split("_")[1]);
      const recipe = SMITHING_RECIPES[recipeIndex];
      if (!recipe) return state;

      const ticks = Math.floor(elapsedSeconds / recipe.time);
      if (ticks <= 0) return state;

      const craftItems = parseCraftItems(state.craftItems);
      const tempRes: Record<string, number> = {};
      for (const inp of recipe.inputs) {
        tempRes[inp.resource] = ((state as Record<string, unknown>)[inp.resource] as number) ?? 0;
      }

      let actualTicks = 0;
      for (let i = 0; i < ticks; i++) {
        const canCraft = recipe.inputs.every(inp => (tempRes[inp.resource] ?? 0) >= inp.qty);
        if (!canCraft) break;
        for (const inp of recipe.inputs) tempRes[inp.resource] -= inp.qty;
        craftItems[recipe.output] = (craftItems[recipe.output] ?? 0) + 1;
        actualTicks++;
      }

      if (actualTicks === 0 && ticks > 0) {
        // Ran out of materials immediately — stop
        const [updated] = await db.update(gameStates)
          .set({ activeAction: "idle", actionUpdatedAt: now })
          .where(eq(gameStates.id, state.id)).returning();
        return updated;
      }

      const updates: Partial<GameState> = {
        smithingXp:  state.smithingXp + actualTicks * recipe.xp,
        craftItems:  JSON.stringify(craftItems),
        actionUpdatedAt: new Date(new Date(state.actionUpdatedAt).getTime() + actualTicks * recipe.time * 1000),
      };
      for (const inp of recipe.inputs) (updates as Record<string, unknown>)[inp.resource] = tempRes[inp.resource];
      if (actualTicks < ticks) updates.activeAction = "idle";

      const [updated] = await db.update(gameStates).set(updates).where(eq(gameStates.id, state.id)).returning();
      return updated;
    }

    // ── Gathering (existing skills) ──────────────────────────────────────────
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

    const [updated] = await db.update(gameStates).set(updates).where(eq(gameStates.id, state.id)).returning();
    return updated;
  }

  async updateAction(action: string): Promise<GameState> {
    const currentState = await this.getGameState();
    const [updated] = await db.update(gameStates)
      .set({ activeAction: action, actionUpdatedAt: new Date() })
      .where(eq(gameStates.id, currentState.id))
      .returning();
    return updated;
  }

  async equipItem(itemId: string): Promise<GameState> {
    const state = await this.getGameState();
    const item = EQUIPMENT_ITEMS[itemId];
    if (!item) throw new Error("Unknown item");

    const craftItems = parseCraftItems(state.craftItems);
    if ((craftItems[itemId] ?? 0) < 1) throw new Error("Item not in inventory");

    const equipment = parseEquipment(state.equipment);
    const prevItem = equipment[item.slot] ?? null;

    // Return previously equipped item to inventory
    if (prevItem) craftItems[prevItem] = (craftItems[prevItem] ?? 0) + 1;

    // Consume the new item from inventory
    craftItems[itemId] = (craftItems[itemId] ?? 0) - 1;
    if (craftItems[itemId] <= 0) delete craftItems[itemId];

    equipment[item.slot] = itemId;

    const [updated] = await db.update(gameStates)
      .set({ equipment: JSON.stringify(equipment), craftItems: JSON.stringify(craftItems) })
      .where(eq(gameStates.id, state.id))
      .returning();
    return updated;
  }

  async unequipItem(slot: string): Promise<GameState> {
    const state = await this.getGameState();
    const equipment = parseEquipment(state.equipment);
    const itemId = equipment[slot as keyof typeof equipment] ?? null;
    if (!itemId) throw new Error("Nothing equipped in that slot");

    const craftItems = parseCraftItems(state.craftItems);
    craftItems[itemId] = (craftItems[itemId] ?? 0) + 1;
    delete equipment[slot as keyof typeof equipment];

    const [updated] = await db.update(gameStates)
      .set({ equipment: JSON.stringify(equipment), craftItems: JSON.stringify(craftItems) })
      .where(eq(gameStates.id, state.id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
