import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  calculateLevel, xpForLevel, levelProgress,
  getPlayerMaxHp, getPlayerAttack, getPlayerDefence, getCombatLevel,
  getTemperatureMultiplier, getTemperatureHpLoss, getAgilityBonuses,
  MAX_LEVEL,
} from "./game-math";
import { getResourceCount, buildResourceUpdates } from "./resources";
import type { GameState } from "./schema";

// ─── Helper: minimal GameState ────────────────────────────────────────────────

function makeState(overrides: Partial<GameState> = {}): GameState {
  return {
    id: 1,
    activeAction: "idle",
    actionUpdatedAt: new Date(),
    woodcuttingXp: 0, miningXp: 0, smeltingXp: 0, fishingXp: 0, huntingXp: 0,
    craftingXp: 0, attackXp: 0, strengthXp: 0, defenceXp: 0, hitpointsXp: 0,
    smithingXp: 0, leatherworkingXp: 0, jewelcraftingXp: 0,
    thievingXp: 0, agilityXp: 0, rangedXp: 0, magicXp: 0,
    playerHp: -1, enemyHp: -1,
    gold: 0, bones: 0, dragonBones: 0,
    equipment: "{}", craftItems: "{}", lootBag: "[]", gems: "{}",
    lootFilter: "common", dungeonStats: "{}", tool: "{}", talents: "{}",
    speedMult: 1, towerFloor: 0, towerKey: 0, trialKey: 0,
    trialBuffs: "[]", trialCurses: "[]", synthesisXp: 0, lootBagSize: 50,
    homestead: "{}", temperature: 0, fuelEndsAt: null, stone: 0,
    achievements: "{}", pets: "[]", foods: "{}", potions: "{}",
    herbs: "{}", berries: "{}", farms: "{}", companions: "[]", outposts: "[]",
    npcEncounter: null, mastery: "{}", explorationXp: 0,
    activeBuffs: "[]", equippedSkill: "", activePrayer: "",
    prayerXp: 0, prayerStartedAt: null,
    slayerTask: null, slayerStreak: 0, enemyQty: 1,
    resourceStore: "{}",
    ...overrides,
  } as GameState;
}

// ─── Level calculations ───────────────────────────────────────────────────────

describe("calculateLevel", () => {
  it("returns 1 at 0 xp", () => {
    assert.equal(calculateLevel(0), 1);
  });
  it("level 2 at 1 xp", () => {
    assert.equal(calculateLevel(1), 2);
  });
  it("level 2 at 4 xp (new curve)", () => {
    assert.equal(calculateLevel(4), 2);
  });
  it("level 5 at 81 xp (new curve)", () => {
    assert.equal(calculateLevel(81), 5);
  });
  it("caps at MAX_LEVEL (99)", () => {
    assert.equal(calculateLevel(1_000_000), MAX_LEVEL);
  });
});

describe("xpForLevel", () => {
  it("level 2 requires 1 xp threshold", () => {
    assert.equal(xpForLevel(2), 1);
  });
  it("level 99 requires ~340k xp (new curve)", () => {
    assert.ok(xpForLevel(99) > 300000 && xpForLevel(99) < 400000);
  });
});

describe("levelProgress", () => {
  it("is 0 at 0 xp for level 1", () => {
    assert.equal(levelProgress(0), 0);
  });
  it("is between 0 and 100", () => {
    const p = levelProgress(50);
    assert.ok(p >= 0 && p <= 100);
  });
  it("clamped at 100 for max level", () => {
    const p = levelProgress(1_000_000);
    assert.equal(p, 100);
  });
});

// ─── Combat formulas ──────────────────────────────────────────────────────────

describe("getPlayerMaxHp", () => {
  it("base 10 HP at level 1 with no equipment", () => {
    const state = makeState({ hitpointsXp: 0 });
    assert.equal(getPlayerMaxHp(state), 10);
  });
  it("scales with hitpoints level (new curve)", () => {
    const state = makeState({ hitpointsXp: 16 }); // level 3
    assert.equal(getPlayerMaxHp(state), 20);
  });
});

describe("getPlayerAttack", () => {
  it("returns at least 1 at level 1", () => {
    const state = makeState({ attackXp: 0 });
    assert.ok(getPlayerAttack(state) >= 1);
  });
  it("scales with attack level (new curve)", () => {
    const state = makeState({ attackXp: 81 }); // level 5
    const atk = getPlayerAttack(state);
    assert.ok(atk >= 6); // floor(5 * 1.2) = 6
  });
});

describe("getPlayerDefence", () => {
  it("returns 0 at level 1", () => {
    const state = makeState({ defenceXp: 0 });
    assert.equal(getPlayerDefence(state), 0);
  });
  it("scales with defence level (new curve)", () => {
    const state = makeState({ defenceXp: 81 }); // level 5
    const def = getPlayerDefence(state);
    assert.equal(def, 4); // floor(5 * 0.8) = 4
  });
});

describe("getCombatLevel", () => {
  it("returns 1 when all combat skills are level 1", () => {
    const state = makeState();
    assert.equal(getCombatLevel(state), 1);
  });
  it("averages attack/defence/hitpoints levels (new curve)", () => {
    const state = makeState({ attackXp: 81, defenceXp: 81, hitpointsXp: 81 }); // all level 5
    assert.equal(getCombatLevel(state), 5);
  });
});

// ─── Temperature ──────────────────────────────────────────────────────────────

describe("getTemperatureMultiplier", () => {
  it("returns 0.5 at 0 temp (frozen)", () => {
    const state = makeState({ temperature: 0 });
    assert.equal(getTemperatureMultiplier(state), 0.5);
  });
  it("returns 0.6 at temp 1-9", () => {
    const state = makeState({ temperature: 5 });
    assert.equal(getTemperatureMultiplier(state), 0.6);
  });
  it("returns 0.75 at temp 10-29", () => {
    const state = makeState({ temperature: 20 });
    assert.equal(getTemperatureMultiplier(state), 0.75);
  });
  it("returns 0.9 at temp 30-49", () => {
    const state = makeState({ temperature: 35 });
    assert.equal(getTemperatureMultiplier(state), 0.9);
  });
  it("returns 1 at temp >= 50", () => {
    const state = makeState({ temperature: 60 });
    assert.equal(getTemperatureMultiplier(state), 1);
  });
});

describe("getTemperatureHpLoss", () => {
  it("no HP loss at temp >= 10", () => {
    const state = makeState({ temperature: 15 });
    assert.equal(getTemperatureHpLoss(state), 0);
  });
  it("slow HP loss at temp 1-9", () => {
    const state = makeState({ temperature: 5 });
    assert.equal(getTemperatureHpLoss(state), 0.1); // 1/10 per second
  });
  it("faster HP loss at temp 0", () => {
    const state = makeState({ temperature: 0 });
    assert.equal(getTemperatureHpLoss(state), 0.2); // 1/5 per second
  });
});

// ─── Agility ──────────────────────────────────────────────────────────────────

describe("getAgilityBonuses", () => {
  it("returns ~1x multipliers at agility level 1", () => {
    const state = makeState({ agilityXp: 0 });
    const b = getAgilityBonuses(state);
    // level 1 = 1 + 1*0.01 = 1.01
    assert.ok(b.thievingMul >= 1 && b.thievingMul < 1.02);
    assert.ok(b.fishingMul >= 1 && b.fishingMul < 1.01);
    assert.ok(b.luckMul >= 1 && b.luckMul < 1.01);
  });
  it("approaches 2x thieving bonus at level 99", () => {
    const state = makeState({ agilityXp: 1_000_000 }); // level 99
    const b = getAgilityBonuses(state);
    // 1 + 99*0.01 = 1.99, capped at 2
    assert.ok(b.thievingMul >= 1.98 && b.thievingMul <= 2);
  });
});

// ─── Resource helpers ─────────────────────────────────────────────────────────

describe("getResourceCount", () => {
  it("reads from resourceStore JSON", () => {
    const state = makeState({
      resourceStore: JSON.stringify({ wood: { 0: 20 } }),
    });
    assert.equal(getResourceCount(state, "wood_0"), 20);
  });
  it("returns bones from state.bones", () => {
    const state = makeState({ bones: 42 });
    assert.equal(getResourceCount(state, "bones"), 42);
  });
  it("returns 0 for unknown keys", () => {
    const state = makeState();
    assert.equal(getResourceCount(state, "unknown_999"), 0);
  });
});

describe("buildResourceUpdates", () => {
  it("writes to resourceStore JSON only", () => {
    const state = makeState();
    const patch = buildResourceUpdates(state, { wood_0: 12 });
    // No longer writes to individual column
    assert.equal(patch.wood_0, undefined);
    const store = JSON.parse(patch.resourceStore!);
    assert.equal(store.wood[0], 12);
  });
  it("writes high tiers to resourceStore", () => {
    const state = makeState();
    const patch = buildResourceUpdates(state, { wood_99: 5 });
    const store = JSON.parse(patch.resourceStore!);
    assert.equal(store.wood[99], 5);
  });
  it("preserves existing store data", () => {
    const state = makeState({ resourceStore: JSON.stringify({ ore: { 3: 10 } }) });
    const patch = buildResourceUpdates(state, { wood_0: 3 });
    const store = JSON.parse(patch.resourceStore!);
    assert.equal(store.ore[3], 10);
    assert.equal(store.wood[0], 3);
  });
});
