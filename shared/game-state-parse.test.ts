// ═══════════════════════════════════════════════════════════════════════════════
// shared/game-state-parse 单元测试
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  parseEquipment,
  parseCraftItems,
  parseLootBag,
  parseGems,
  parseDungeonStats,
} from "@shared/game-state-parse";
import type { GameItem, EquipmentSlot } from "@shared/game-data";

// ─── parseEquipment ────────────────────────────────────────────────────────────

describe("parseEquipment", () => {
  it("returns empty object for empty JSON", () => {
    assert.deepEqual(parseEquipment("{}"), {});
  });

  it("returns empty object for invalid JSON", () => {
    assert.deepEqual(parseEquipment("not-json"), {});
  });

  it("parses valid equipment state", () => {
    const item: Partial<GameItem> = {
      instanceId: "sword_1",
      name: "铁剑",
      slot: "weapon" as EquipmentSlot,
      rarity: "common",
      ilvl: 5,
    };
    const json = JSON.stringify({ weapon: item });
    const result = parseEquipment(json);
    assert.equal(result.weapon?.instanceId, "sword_1");
    assert.equal(result.weapon?.name, "铁剑");
  });

  it("parses equipment with multiple slots", () => {
    const eq: Record<string, Partial<GameItem>> = {
      weapon: { instanceId: "w1", slot: "weapon" as EquipmentSlot, name: "剑" },
      helmet: { instanceId: "h1", slot: "helmet" as EquipmentSlot, name: "头盔" },
    };
    const result = parseEquipment(JSON.stringify(eq));
    assert.equal(result.weapon?.name, "剑");
    assert.equal(result.helmet?.name, "头盔");
    assert.equal(result.chest, undefined);
  });
});

// ─── parseCraftItems ───────────────────────────────────────────────────────────

describe("parseCraftItems", () => {
  it("returns empty object for empty JSON", () => {
    assert.deepEqual(parseCraftItems("{}"), {});
  });

  it("returns empty for invalid", () => {
    assert.deepEqual(parseCraftItems("bad"), {});
  });

  it("parses craft quantities", () => {
    const result = parseCraftItems(JSON.stringify({ "iron_sword": 5, "steel_axe": 2 }));
    assert.deepEqual(result, { "iron_sword": 5, "steel_axe": 2 });
  });
});

// ─── parseLootBag ──────────────────────────────────────────────────────────────

describe("parseLootBag", () => {
  it("returns empty array for empty JSON", () => {
    assert.deepEqual(parseLootBag("[]"), []);
  });

  it("returns empty array for invalid", () => {
    assert.deepEqual(parseLootBag("bad"), []);
  });

  it("parses loot items", () => {
    const items: Partial<GameItem>[] = [
      { instanceId: "loot1", name: "破剑", rarity: "common" },
      { instanceId: "loot2", name: "龙鳞", rarity: "epic" },
    ];
    const result = parseLootBag(JSON.stringify(items));
    assert.equal(result.length, 2);
    assert.equal(result[0]!.instanceId, "loot1");
    assert.equal(result[1]!.rarity, "epic");
  });
});

// ─── parseGems ─────────────────────────────────────────────────────────────────

describe("parseGems", () => {
  it("returns empty for empty JSON", () => {
    assert.deepEqual(parseGems("{}"), {});
  });

  it("returns empty for invalid", () => {
    assert.deepEqual(parseGems("nope"), {});
  });

  it("parses gem counts", () => {
    const result = parseGems(JSON.stringify({ ruby: 3, diamond: 1 }));
    assert.deepEqual(result, { ruby: 3, diamond: 1 });
  });
});

// ─── parseDungeonStats ─────────────────────────────────────────────────────────

describe("parseDungeonStats", () => {
  it("returns empty for empty JSON", () => {
    assert.deepEqual(parseDungeonStats("{}"), {});
  });

  it("returns empty for invalid", () => {
    assert.deepEqual(parseDungeonStats("bad"), {});
  });

  it("parses dungeon stats", () => {
    const stats = JSON.stringify({
      dungeon_0: { clears: 5, fastestSec: 120 },
      dungeon_1: { clears: 2, fastestSec: null },
    });
    const result = parseDungeonStats(stats);
    assert.equal(result.dungeon_0?.clears, 5);
    assert.equal(result.dungeon_0?.fastestSec, 120);
    assert.equal(result.dungeon_1?.clears, 2);
    assert.equal(result.dungeon_1?.fastestSec, null);
  });
});
