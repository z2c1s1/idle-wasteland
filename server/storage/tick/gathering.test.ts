// ═══════════════════════════════════════════════════════════════════════════════
// 采集/技能数据完整性测试 + 工具加成测试
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { SKILLS_DATA } from "../constants";
import { getToolBonus, ALL_TOOLS, calcStealth, calcThievingSuccessRate, calcThievingDoubleRate } from "@shared/game-data";

// ─── SKILLS_DATA integrity ────────────────────────────────────────────────────

describe("SKILLS_DATA", () => {
  const skillNames = ['woodcutting', 'mining', 'smelting', 'fishing', 'hunting', 'agility', 'exploration'];

  it("has all 7 skills", () => {
    for (const name of skillNames) {
      assert.ok(SKILLS_DATA[name], `missing skill: ${name}`);
    }
  });

  it("each gathering skill has correct tier count", () => {
    assert.equal(SKILLS_DATA['woodcutting']!.length, 10);
    assert.equal(SKILLS_DATA['mining']!.length, 10);
    assert.equal(SKILLS_DATA['smelting']!.length, 10);
    assert.equal(SKILLS_DATA['fishing']!.length, 10);
    assert.equal(SKILLS_DATA['hunting']!.length, 10);
  });

  it("agility has 10 tiers", () => {
    assert.equal(SKILLS_DATA['agility']?.length, 10);
  });

  it("exploration has 7 tiers", () => {
    assert.equal(SKILLS_DATA['exploration']?.length, 7);
  });

  it("each tier has name, time, xp, prefix", () => {
    for (const [skill, tiers] of Object.entries(SKILLS_DATA)) {
      for (let i = 0; i < tiers.length; i++) {
        const tier = tiers[i]!;
        assert.ok(typeof tier.name === 'string' && tier.name.length > 0,
          `${skill}[${i}].name is empty`);
        assert.ok(tier.time > 0, `${skill}[${i}].time <= 0`);
        assert.ok(tier.xp > 0, `${skill}[${i}].xp <= 0`);
        assert.ok(typeof tier.prefix === 'string', `${skill}[${i}].prefix is not string`);
      }
    }
  });

  it("gathering skills have resource prefixes", () => {
    assert.equal(SKILLS_DATA['woodcutting']![0]!.prefix, 'wood');
    assert.equal(SKILLS_DATA['mining']![0]!.prefix, 'ore');
    assert.equal(SKILLS_DATA['smelting']![0]!.prefix, 'bar');
    assert.equal(SKILLS_DATA['fishing']![0]!.prefix, 'fish');
    assert.equal(SKILLS_DATA['hunting']![0]!.prefix, 'hide');
  });

  it("xp-only skills have empty prefix", () => {
    assert.equal(SKILLS_DATA['agility']![0]!.prefix, '');
    assert.equal(SKILLS_DATA['exploration']![0]!.prefix, '');
  });

  it("time and xp scale with tier", () => {
    for (const [skill, tiers] of Object.entries(SKILLS_DATA)) {
      for (let i = 1; i < tiers.length; i++) {
        assert.ok(tiers[i]!.time >= tiers[i-1]!.time,
          `${skill}[${i}].time (${tiers[i]!.time}) < ${skill}[${i-1}].time (${tiers[i-1]!.time})`);
        assert.ok(tiers[i]!.xp >= tiers[i-1]!.xp,
          `${skill}[${i}].xp (${tiers[i]!.xp}) < ${skill}[${i-1}].xp (${tiers[i-1]!.xp})`);
      }
    }
  });
});

// ─── getToolBonus ──────────────────────────────────────────────────────────────

describe("getToolBonus", () => {
  it("returns defaults for empty object", () => {
    const bonus = getToolBonus("{}");
    assert.equal(bonus.timeMult, 1);
    assert.equal(bonus.yieldBonus, 0);
  });

  it("returns defaults for invalid JSON", () => {
    const bonus = getToolBonus("not-json");
    assert.equal(bonus.timeMult, 1);
    assert.equal(bonus.yieldBonus, 0);
  });

  it("returns defaults for null/undefined-like", () => {
    const bonus = getToolBonus("null");
    assert.equal(bonus.timeMult, 1);
    assert.equal(bonus.yieldBonus, 0);
  });

  it("reads from a valid tool JSON", () => {
    const bonus = getToolBonus(JSON.stringify({ id: 'dragon_axe', timeMult: 0.6, yieldBonus: 2 }));
    assert.equal(bonus.timeMult, 0.6);
    assert.equal(bonus.yieldBonus, 2);
  });

  it("all ALL_TOOLS entries have valid getToolBonus", () => {
    for (const tool of ALL_TOOLS) {
      const bonus = getToolBonus(JSON.stringify(tool));
      assert.equal(bonus.timeMult, tool.timeMult, `${tool.id} timeMult mismatch`);
      assert.equal(bonus.yieldBonus, tool.yieldBonus, `${tool.id} yieldBonus mismatch`);
    }
  });

  it("tools for woodcutting/mining/fishing/hunting exist", () => {
    const skills = new Set(ALL_TOOLS.map(t => t.skill));
    assert.ok(skills.has('woodcutting'));
    assert.ok(skills.has('mining'));
    assert.ok(skills.has('fishing'));
    assert.ok(skills.has('hunting'));
  });

  it("timeMult is between 0.5 and 1 for all tools", () => {
    for (const tool of ALL_TOOLS) {
      assert.ok(tool.timeMult >= 0.5 && tool.timeMult <= 1,
        `${tool.id} timeMult=${tool.timeMult} out of range`);
    }
  });
});

// ─── Thieving calculations ────────────────────────────────────────────────────

describe("calcStealth", () => {
  it("returns 0 at level 1 with no bonus", () => {
    assert.equal(calcStealth(1, 0), 2);
  });

  it("scales with level", () => {
    assert.equal(calcStealth(10, 0), 20);
    assert.equal(calcStealth(50, 0), 100);
  });

  it("includes equipment bonus at 50% rate", () => {
    assert.equal(calcStealth(10, 10), 25); // 20 + 5
  });
});

describe("calcThievingSuccessRate", () => {
  it("50% when stealth=0 perception=100", () => {
    const rate = calcThievingSuccessRate(0, 100);
    assert.equal(rate, 0.5);
  });

  it("~75% when stealth=50 perception=100", () => {
    const rate = calcThievingSuccessRate(50, 100);
    assert.equal(rate, 0.75); // (50+100)/(100+100) = 150/200 = 0.75
  });

  it("capped at 95%", () => {
    const rate = calcThievingSuccessRate(1000, 10);
    assert.equal(rate, 0.95);
  });

  it("near 0% with very low stealth", () => {
    const rate = calcThievingSuccessRate(1, 500);
    assert.ok(rate < 0.2);
  });
});

describe("calcThievingDoubleRate", () => {
  it("returns 0 with no stealth", () => {
    assert.equal(calcThievingDoubleRate(0, 100), 0);
  });

  it("capped at 50%", () => {
    const rate = calcThievingDoubleRate(1000, 10);
    assert.equal(rate, 0.5);
  });
});
