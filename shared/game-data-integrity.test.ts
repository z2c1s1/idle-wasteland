// ═══════════════════════════════════════════════════════════════════════════════
// shared/game-data 数据完整性测试
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  ENEMIES, DUNGEONS, COMBAT_TRIANGLE,
  ALL_SLOTS, SLOT_LABEL, SLOT_BASES,
  RARITY_LABEL, RARITY_COLOR,
  ITEM_SETS, UNIQUE_ITEMS,
  ALL_TOOLS, THIEVING_NPCS,
  HOMESTEAD_BUILDINGS, PRAYERS,
  ALL_CRAFTABLE_ITEMS,
} from "@shared/game-data";
import { COMBAT_GEM_POOLS, MINING_GEM_POOLS } from "@shared/game-data";
import { RARITY_ORDER } from "../server/storage/constants";

// ─── Enemies ───────────────────────────────────────────────────────────────────

describe("ENEMIES", () => {
  it("has at least 20 enemies", () => {
    assert.ok(ENEMIES.length >= 20, `only ${ENEMIES.length} enemies`);
  });

  it("every enemy has required fields", () => {
    for (const e of ENEMIES) {
      assert.ok(e.id, `enemy missing id`);
      assert.ok(e.name, `enemy ${e.id} missing name`);
      assert.ok(e.maxHp > 0, `enemy ${e.id} maxHp <= 0`);
      assert.ok(e.attack >= 0, `enemy ${e.id} attack < 0`);
      assert.ok(e.defence >= 0, `enemy ${e.id} defence < 0`);
      assert.ok(e.xp > 0, `enemy ${e.id} xp <= 0`);
      assert.ok(e.drops.gold[0] > 0, `enemy ${e.id} gold min <= 0`);
      assert.ok(e.drops.gold[1] >= e.drops.gold[0], `enemy ${e.id} gold range inverted`);
      assert.ok(e.reqCombatLevel >= 1, `enemy ${e.id} reqCombatLevel < 1`);
    }
  });

  it("enemies are sorted by reqCombatLevel", () => {
    for (let i = 1; i < ENEMIES.length; i++) {
      assert.ok(ENEMIES[i]!.reqCombatLevel >= ENEMIES[i-1]!.reqCombatLevel,
        `enemies not sorted: ${ENEMIES[i-1]!.id}(${ENEMIES[i-1]!.reqCombatLevel}) before ${ENEMIES[i]!.id}(${ENEMIES[i]!.reqCombatLevel})`);
    }
  });

  it("all enemies have valid combatStyle", () => {
    const valid = Object.keys(COMBAT_TRIANGLE);
    for (const e of ENEMIES) {
      assert.ok(valid.includes(e.combatStyle ?? 'melee'),
        `enemy ${e.id} invalid combatStyle: ${e.combatStyle}`);
    }
  });
});

// ─── Dungeons ──────────────────────────────────────────────────────────────────

describe("DUNGEONS", () => {
  it("has at least 5 dungeons", () => {
    assert.ok(DUNGEONS.length >= 5, `only ${DUNGEONS.length} dungeons`);
  });

  it("every dungeon has required structure", () => {
    for (const d of DUNGEONS) {
      assert.ok(d.id, "dungeon missing id");
      assert.ok(d.name, `dungeon ${d.id} missing name`);
      assert.ok(d.boss, `dungeon ${d.id} missing boss`);
      assert.ok(d.boss.maxHp > 0, `dungeon ${d.id} boss maxHp <= 0`);
      assert.ok(d.boss.attack > 0, `dungeon ${d.id} boss attack <= 0`);
      assert.ok(d.boss.xp > 0, `dungeon ${d.id} boss xp <= 0`);
    }
  });
});

// ─── Equipment slots ────────────────────────────────────────────────────────────

describe("ALL_SLOTS / SLOT_BASES", () => {
  it("has 9 equipment slots", () => {
    assert.equal(ALL_SLOTS.length, 9);
  });

  it("every slot has a label and base items", () => {
    for (const slot of ALL_SLOTS) {
      assert.ok(SLOT_LABEL[slot], `slot ${slot} missing label`);
      assert.ok(Array.isArray(SLOT_BASES[slot]), `slot ${slot} missing bases`);
      assert.ok(SLOT_BASES[slot]!.length > 0, `slot ${slot} has no base items`);
    }
  });

  it("every base item has name and emoji", () => {
    for (const slot of ALL_SLOTS) {
      for (const base of SLOT_BASES[slot]!) {
        assert.ok(base.name, `${slot} base missing name`);
        assert.ok(base.emoji, `${slot} base ${base.name} missing emoji`);
      }
    }
  });
});

// ─── Rarity system ─────────────────────────────────────────────────────────────

describe("Rarity system", () => {
  it("has 6 rarity tiers", () => {
    const rarities = Object.keys(RARITY_LABEL);
    assert.equal(rarities.length, 6);
  });

  it("every rarity has color, border, bg", () => {
    for (const r of Object.keys(RARITY_LABEL)) {
      assert.ok(RARITY_COLOR[r as keyof typeof RARITY_COLOR], `${r} missing color`);
      // mythic is not in RARITY_ORDER (it can't be disenchanted)
      if (r !== 'mythic') {
        assert.ok(RARITY_ORDER[r] !== undefined, `${r} missing order`);
      }
    }
  });

  it("rarity order is ascending (common→legendary)", () => {
    assert.ok(RARITY_ORDER.common < RARITY_ORDER.uncommon);
    assert.ok(RARITY_ORDER.uncommon < RARITY_ORDER.rare);
    assert.ok(RARITY_ORDER.rare < RARITY_ORDER.epic);
    assert.ok(RARITY_ORDER.epic < RARITY_ORDER.legendary);
  });
});

// ─── Tools ─────────────────────────────────────────────────────────────────────

describe("ALL_TOOLS", () => {
  it("has tools for all 4 gathering skills", () => {
    const skills = new Set(ALL_TOOLS.map(t => t.skill));
    assert.ok(skills.has('woodcutting'));
    assert.ok(skills.has('mining'));
    assert.ok(skills.has('fishing'));
    assert.ok(skills.has('hunting'));
  });

  it("every tool has required fields", () => {
    for (const t of ALL_TOOLS) {
      assert.ok(t.id, "tool missing id");
      assert.ok(t.name, `tool ${t.id} missing name`);
      assert.ok(t.timeMult > 0 && t.timeMult <= 1, `tool ${t.id} timeMult out of range`);
    }
  });

  it("timeMult decreases for better tools within a skill", () => {
    for (const skill of ['woodcutting', 'mining', 'fishing', 'hunting']) {
      const tools = ALL_TOOLS.filter(t => t.skill === skill);
      for (let i = 1; i < tools.length; i++) {
        assert.ok(tools[i]!.timeMult <= tools[i-1]!.timeMult,
          `${skill}: ${tools[i-1]!.id}(${tools[i-1]!.timeMult}) > ${tools[i]!.id}(${tools[i]!.timeMult})`);
      }
    }
  });
});

// ─── Thieving ──────────────────────────────────────────────────────────────────

describe("THIEVING_NPCS", () => {
  it("has at least 10 NPCs", () => {
    assert.ok(THIEVING_NPCS.length >= 10, `only ${THIEVING_NPCS.length}`);
  });

  it("every NPC has required fields", () => {
    for (const n of THIEVING_NPCS) {
      assert.ok(n.id, "NPC missing id");
      assert.ok(n.name, `NPC ${n.id} missing name`);
      assert.ok(n.level >= 1, `NPC ${n.id} level < 1`);
      assert.ok(n.perception > 0, `NPC ${n.id} perception <= 0`);
      assert.ok(n.xp > 0, `NPC ${n.id} xp <= 0`);
    }
  });
});

// ─── Homestead ─────────────────────────────────────────────────────────────────

describe("HOMESTEAD_BUILDINGS", () => {
  it("has at least 5 buildings", () => {
    assert.ok(HOMESTEAD_BUILDINGS.length >= 5);
  });

  it("every building has required fields", () => {
    for (const b of HOMESTEAD_BUILDINGS) {
      assert.ok(b.id, "building missing id");
      assert.ok(b.name, `building ${b.id} missing name`);
      assert.ok(b.maxLevel >= 1, `building ${b.id} maxLevel < 1`);
      assert.ok(b.costWood >= 0, `building ${b.id} costWood < 0`);
    }
  });
});

// ─── Prayers ───────────────────────────────────────────────────────────────────

describe("PRAYERS", () => {
  it("has at least 5 prayers", () => {
    assert.ok(PRAYERS.length >= 5);
  });

  it("every prayer has required fields", () => {
    for (const p of PRAYERS) {
      assert.ok(p.id, "prayer missing id");
      assert.ok(p.name, `prayer ${p.id} missing name`);
      assert.ok(p.baseBuff > 0, `prayer ${p.id} baseBuff <= 0`);
      assert.ok(p.buffPerLevel > 0, `prayer ${p.id} buffPerLevel <= 0`);
    }
  });
});

// ─── Gem pools ─────────────────────────────────────────────────────────────────

describe("COMBAT_GEM_POOLS", () => {
  it("has pools for each enemy tier", () => {
    assert.ok(COMBAT_GEM_POOLS.length > 0);
    for (const pool of COMBAT_GEM_POOLS) {
      assert.ok(pool.chance > 0, "pool chance <= 0");
      assert.ok(pool.pool.length > 0, "pool empty");
    }
  });
});

describe("MINING_GEM_POOLS", () => {
  it("has pools for mining tiers", () => {
    assert.ok(MINING_GEM_POOLS.length > 0);
    for (const pool of MINING_GEM_POOLS) {
      assert.ok(pool.pool.length > 0, "pool empty");
    }
  });
});

// ─── Craftable items ───────────────────────────────────────────────────────────

describe("ALL_CRAFTABLE_ITEMS", () => {
  it("has at least 50 items", () => {
    const count = Object.keys(ALL_CRAFTABLE_ITEMS).length;
    assert.ok(count >= 50, `only ${count} items`);
  });

  it("every item has id, name, slot", () => {
    for (const [id, item] of Object.entries(ALL_CRAFTABLE_ITEMS)) {
      assert.ok(id, "item missing id");
      assert.ok((item as any).name, `item ${id} missing name`);
      assert.ok((item as any).slot || (item as any).type,
        `item ${id} missing slot/type`);
    }
  });

  it("no duplicate ids", () => {
    const ids = Object.keys(ALL_CRAFTABLE_ITEMS);
    const uniqueIds = new Set(ids);
    assert.equal(uniqueIds.size, ids.length,
      `duplicate ids: ${ids.length - uniqueIds.size}`);
  });
});
