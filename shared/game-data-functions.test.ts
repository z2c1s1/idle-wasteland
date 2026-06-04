// ═══════════════════════════════════════════════════════════════════════════════
// shared/game-data 纯函数单元测试
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  getGemName, getGemBonus, getGemBgClass,
  getEquipmentBonuses,
} from "@shared/game-data";
import { getPrayerLevel } from "@shared/game-data";
import type { EquipmentState } from "@shared/game-data";

// ─── Gem functions ─────────────────────────────────────────────────────────────

describe("getGemName", () => {
  it("returns name for known gems", () => {
    assert.ok(getGemName("ruby").length > 0);
    assert.ok(getGemName("sapphire").length > 0);
    assert.ok(getGemName("diamond").length > 0);
  });

  it("returns the key itself for unknown gems", () => {
    assert.equal(getGemName("nonexistent_gem_xyz"), "nonexistent_gem_xyz");
  });
});

describe("getGemBonus", () => {
  it("returns valid bonus structure for known gems", () => {
    const bonus = getGemBonus("ruby");
    assert.ok(typeof bonus.attackBonus === "number");
    assert.ok(typeof bonus.defenceBonus === "number");
    assert.ok(typeof bonus.hpBonus === "number");
    assert.ok(typeof bonus.critRating === "number");
  });

  it("returns zero bonuses for unknown gems", () => {
    const bonus = getGemBonus("nonexistent");
    assert.equal(bonus.attackBonus, 0);
    assert.equal(bonus.defenceBonus, 0);
    assert.equal(bonus.hpBonus, 0);
    assert.equal(bonus.critRating, 0);
  });

  it("different gems have different bonuses", () => {
    const ruby = getGemBonus("ruby");
    const sapphire = getGemBonus("sapphire");
    const same = ruby.attackBonus === sapphire.attackBonus
      && ruby.defenceBonus === sapphire.defenceBonus
      && ruby.hpBonus === sapphire.hpBonus
      && ruby.critRating === sapphire.critRating;
    assert.ok(!same, "all gem bonuses are identical");
  });
});

describe("getGemBgClass", () => {
  it("returns a CSS class string", () => {
    assert.ok(getGemBgClass("ruby").length > 0);
    assert.ok(getGemBgClass("diamond").length > 0);
  });

  it("returns default class for unknown gem", () => {
    const cls = getGemBgClass("nonexistent");
    assert.ok(cls.length > 0, "should return a default class");
  });
});

// ─── getEquipmentBonuses ───────────────────────────────────────────────────────

describe("getEquipmentBonuses", () => {
  const emptyEq: EquipmentState = {};

  it("returns zeros for empty equipment", () => {
    const bonuses = getEquipmentBonuses(emptyEq);
    assert.equal(bonuses.attackBonus, 0);
    assert.equal(bonuses.defenceBonus, 0);
    assert.equal(bonuses.hpBonus, 0);
    assert.equal(bonuses.critRating, 0);
  });

  it("sums bonuses across slots", () => {
    const eq: EquipmentState = {
      weapon: { attackBonus: 10, defenceBonus: 0, hpBonus: 0, instanceId: "w1" } as any,
      helmet: { attackBonus: 0, defenceBonus: 5, hpBonus: 3, instanceId: "h1" } as any,
    };
    const bonuses = getEquipmentBonuses(eq);
    assert.equal(bonuses.attackBonus, 10);
    assert.equal(bonuses.defenceBonus, 5);
    assert.equal(bonuses.hpBonus, 3);
  });

  it("skips missing slots gracefully", () => {
    const eq: EquipmentState = {
      weapon: { attackBonus: 10, defenceBonus: 0, hpBonus: 0, instanceId: "w1" } as any,
    };
    const bonuses = getEquipmentBonuses(eq);
    assert.equal(bonuses.attackBonus, 10);
  });

  it("returns all expected bonus fields", () => {
    const bonuses = getEquipmentBonuses(emptyEq);
    const keys = Object.keys(bonuses).sort();
    assert.ok(keys.includes("attackBonus"));
    assert.ok(keys.includes("defenceBonus"));
    assert.ok(keys.includes("hpBonus"));
    assert.ok(keys.includes("critRating"));
    assert.ok(keys.includes("attackSpeed"));
    assert.ok(keys.includes("enhancedDamage"));
    assert.ok(keys.includes("lifeLeech"));
    assert.ok(keys.includes("magicFind"));
  });
});

// ─── getPrayerLevel ────────────────────────────────────────────────────────────

describe("getPrayerLevel", () => {
  it("returns 1 at 0 xp", () => {
    assert.equal(getPrayerLevel(0), 1);
  });

  it("scales with xp", () => {
    const lv10 = getPrayerLevel(100);
    const lv50 = getPrayerLevel(10000);
    assert.ok(lv50 > lv10, `lv10=${lv10}, lv50=${lv50}`);
  });

  it("returns integer level", () => {
    for (const xp of [0, 50, 100, 1000, 10000]) {
      assert.ok(Number.isInteger(getPrayerLevel(xp)), `${xp} -> ${getPrayerLevel(xp)}`);
    }
  });

  it("monotonically increases with xp", () => {
    let prev = 0;
    for (const xp of [0, 10, 50, 100, 500, 1000, 5000, 10000]) {
      const lv = getPrayerLevel(xp);
      assert.ok(lv >= prev, `xp=${xp}: ${lv} < prev=${prev}`);
      prev = lv;
    }
  });
});
