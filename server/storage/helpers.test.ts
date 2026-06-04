// ═══════════════════════════════════════════════════════════════════════════════
// server/storage helpers 单元测试
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { mergeGems, rollGemDropsFromPool } from "./helpers";

// ─── mergeGems ─────────────────────────────────────────────────────────────────

describe("mergeGems", () => {
  it("merges two empty records", () => {
    assert.deepEqual(mergeGems({}, {}), {});
  });

  it("returns first when second is empty", () => {
    assert.deepEqual(mergeGems({ ruby: 3 }, {}), { ruby: 3 });
  });

  it("returns second when first is empty", () => {
    assert.deepEqual(mergeGems({}, { ruby: 3 }), { ruby: 3 });
  });

  it("sums overlapping keys", () => {
    assert.deepEqual(mergeGems({ ruby: 3, sapphire: 1 }, { ruby: 2, emerald: 5 }), {
      ruby: 5, sapphire: 1, emerald: 5,
    });
  });

  it("handles zero values", () => {
    assert.deepEqual(mergeGems({ ruby: 0 }, { ruby: 0 }), { ruby: 0 });
  });

  it("does not mutate inputs", () => {
    const a = { ruby: 3 };
    const aCopy = { ...a };
    const b = { ruby: 2 };
    mergeGems(a, b);
    assert.deepEqual(a, aCopy);
  });
});

// ─── rollGemDropsFromPool ──────────────────────────────────────────────────────

describe("rollGemDropsFromPool", () => {
  it("returns empty with 0 completions", () => {
    const result = rollGemDropsFromPool(0, 0.5, ["ruby", "sapphire"]);
    assert.deepEqual(result, {});
  });

  it("returns empty with 0 chance", () => {
    const result = rollGemDropsFromPool(100, 0, ["ruby"]);
    assert.deepEqual(result, {});
  });

  it("returns empty with empty pool", () => {
    const result = rollGemDropsFromPool(100, 0.5, []);
    assert.deepEqual(result, {});
  });

  it("produces expected count range", () => {
    // 1000 completions * 0.3 chance = ~300 expected
    // Run multiple times, total should be roughly 300
    let total = 0;
    const trials = 10;
    for (let i = 0; i < trials; i++) {
      const gems = rollGemDropsFromPool(1000, 0.3, ["ruby", "sapphire", "emerald", "diamond"]);
      const count = Object.values(gems).reduce((s, v) => s + v, 0);
      total += count;
    }
    const avg = total / trials;
    // Should be within 50% of expected 300
    assert.ok(avg > 150 && avg < 450, `avg ${avg} not in [150, 450]`);
  });

  it("only produces gems from the given pool", () => {
    const pool = ["ruby", "emerald"];
    const gems = rollGemDropsFromPool(100, 0.5, pool);
    for (const key of Object.keys(gems)) {
      assert.ok(pool.includes(key), `${key} not in pool`);
    }
  });

  it("all counts are positive", () => {
    const gems = rollGemDropsFromPool(100, 0.5, ["ruby", "sapphire"]);
    for (const count of Object.values(gems)) {
      assert.ok(count > 0);
    }
  });
});
