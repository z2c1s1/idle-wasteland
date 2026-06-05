// ═══════════════════════════════════════════════════════════════════════════════
// shared/resources 完整单元测试（补充 parseResourceStore / parseResourceKey / addToResourceStore）
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  parseResourceStore,
  parseResourceKey,
  addToResourceStore,
  getResourceCount,
  buildResourceUpdates,
  type ResourceStore,
} from "./resources";
import type { GameState } from "./schema";

function makeState(overrides: Partial<GameState> = {}): GameState {
  return {
    id: 1, activeAction: "idle", actionUpdatedAt: new Date(),
    woodcuttingXp: 0, miningXp: 0, smeltingXp: 0, fishingXp: 0, huntingXp: 0,
    craftingXp: 0, attackXp: 0, strengthXp: 0, defenceXp: 0, hitpointsXp: 0,
    smithingXp: 0, leatherworkingXp: 0, jewelcraftingXp: 0,
    thievingXp: 0, agilityXp: 0, rangedXp: 0, magicXp: 0,
    playerHp: -1, enemyHp: -1, gold: 0, bones: 0, dragonBones: 0,
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
    resourceStore: "{}", bloodShards: 0,
    worldTier: 1, tierBossKilled: "[]",
    extractedPowers: "[]", activePowers: '["","",""]',
    ...overrides,
  } as GameState;
}

// ─── parseResourceStore ────────────────────────────────────────────────────────

describe("parseResourceStore", () => {
  it("returns empty store for empty string", () => {
    assert.deepEqual(parseResourceStore("{}"), {});
  });

  it("returns empty store for null/undefined", () => {
    assert.deepEqual(parseResourceStore(null), {});
    assert.deepEqual(parseResourceStore(undefined), {});
  });

  it("returns empty store for invalid JSON", () => {
    assert.deepEqual(parseResourceStore("not-json"), {});
  });

  it("parses valid resource store", () => {
    const store = parseResourceStore(JSON.stringify({ wood: { 0: 10, 5: 3 }, ore: { 2: 7 } }));
    assert.deepEqual(store, { wood: { 0: 10, 5: 3 }, ore: { 2: 7 } });
  });
});

// ─── parseResourceKey ──────────────────────────────────────────────────────────

describe("parseResourceKey", () => {
  it("parses wood_0", () => {
    assert.deepEqual(parseResourceKey("wood_0"), { prefix: "wood", tier: 0 });
  });

  it("parses ore_99", () => {
    assert.deepEqual(parseResourceKey("ore_99"), { prefix: "ore", tier: 99 });
  });

  it("parses item_15", () => {
    assert.deepEqual(parseResourceKey("item_15"), { prefix: "item", tier: 15 });
  });

  it("returns null for invalid keys", () => {
    assert.equal(parseResourceKey("bones"), null);
    assert.equal(parseResourceKey("wood"), null);
    assert.equal(parseResourceKey("wood_"), null);
    assert.equal(parseResourceKey(""), null);
    assert.equal(parseResourceKey("123_abc"), null);
  });

  it("handles multi-word prefixes", () => {
    const result = parseResourceKey("dragon_bone_5");
    // "dragon" prefix, "bone_5" doesn't match digit pattern
    // Actually: /^([a-z]+)_(\d+)$/ → "dragon_bone" would not match. Let me verify.
    // The regex is ^([a-z]+)_(\d+)$ — [a-z]+ matches lowercase letters only, no underscores.
    // So "dragon_bone_5": "dragon" matches [a-z]+, then expects _ then \d+.
    // After "dragon", we have "_bone_5". The regex expects "_" then digits, but gets "bone_5".
    // So it returns null. Let me just test normal patterns.
    assert.equal(parseResourceKey("dragon_bone_5"), null);
  });
});

// ─── addToResourceStore ─────────────────────────────────────────────────────────

describe("addToResourceStore", () => {
  it("adds to empty store", () => {
    const store: ResourceStore = {};
    addToResourceStore(store, "wood", 0, 10);
    assert.deepEqual(store, { wood: { 0: 10 } });
  });

  it("adds to existing prefix", () => {
    const store: ResourceStore = { wood: { 0: 5 } };
    addToResourceStore(store, "wood", 0, 3);
    assert.equal(store.wood![0], 8);
  });

  it("adds new tier to existing prefix", () => {
    const store: ResourceStore = { wood: { 0: 5 } };
    addToResourceStore(store, "wood", 3, 7);
    assert.equal(store.wood![0], 5);
    assert.equal(store.wood![3], 7);
  });

  it("adds new prefix", () => {
    const store: ResourceStore = { wood: { 0: 5 } };
    addToResourceStore(store, "ore", 1, 3);
    assert.equal(store.ore![1], 3);
    assert.equal(store.wood![0], 5); // unchanged
  });

  it("mutates the original store", () => {
    const store: ResourceStore = {};
    const result = addToResourceStore(store, "wood", 0, 1);
    assert.equal(result, undefined); // returns void
    assert.equal(store.wood![0], 1);
  });
});

// ─── getResourceCount (extended) ───────────────────────────────────────────────

describe("getResourceCount (extended)", () => {
  it("reads high tiers from resourceStore only", () => {
    const state = makeState({
      resourceStore: JSON.stringify({ wood: { 50: 99 } }),
    });
    assert.equal(getResourceCount(state, "wood_50"), 99);
  });

  it("returns 0 for missing tier in existing prefix", () => {
    const state = makeState({
      resourceStore: JSON.stringify({ wood: { 0: 10 } }),
    });
    assert.equal(getResourceCount(state, "wood_5"), 0);
  });

  it("returns 0 for unknown prefix", () => {
    const state = makeState({ resourceStore: JSON.stringify({ wood: { 0: 1 } }) });
    assert.equal(getResourceCount(state, "ore_0"), 0);
  });

  it("handles corrupted resourceStore gracefully", () => {
    const state = makeState({ resourceStore: "{{{broken" } as any);
    assert.equal(getResourceCount(state, "wood_0"), 0);
  });
});

// ─── buildResourceUpdates (extended) ────────────────────────────────────────────

describe("buildResourceUpdates (extended)", () => {
  it("handles multiple resource types in one call", () => {
    const state = makeState({
      resourceStore: JSON.stringify({ wood: { 0: 10 }, ore: { 0: 5 } }),
    });
    const patch = buildResourceUpdates(state, { wood_0: 3, ore_0: 7, fish_2: 4 });
    const store = JSON.parse(patch.resourceStore!);
    assert.equal(store.wood[0], 3);
    assert.equal(store.ore[0], 7);
    assert.equal(store.fish[2], 4);
  });

  it("handles bones and dragonBones separately", () => {
    const state = makeState();
    const patch = buildResourceUpdates(state, { bones: 42, dragonBones: 7 });
    assert.equal(patch.bones, 42);
    assert.equal(patch.dragonBones, 7);
    assert.deepEqual(JSON.parse(patch.resourceStore!), {}); // no resource keys
  });

  it("overwrites existing tier values (absolute)", () => {
    const state = makeState({
      resourceStore: JSON.stringify({ wood: { 0: 100 } }),
    });
    const patch = buildResourceUpdates(state, { wood_0: 20 });
    const store = JSON.parse(patch.resourceStore!);
    assert.equal(store.wood[0], 20); // overwritten, not added
  });

  it("writes to both resourceStore and individual columns", () => {
    const state = makeState();
    const patch = buildResourceUpdates(state, { wood_0: 12 });
    // Both resourceStore and legacy column are updated
    assert.equal((patch as any).wood_0, 12);
    const store = JSON.parse(patch.resourceStore!);
    assert.equal(store.wood[0], 12);
  });
});
