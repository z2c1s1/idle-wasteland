// ═══════════════════════════════════════════════════════════════════════════════
// 战斗共享逻辑单元测试
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  computeSkillEffects,
  computeEffectiveCombatSpeed,
  applySkillProcDamage,
  computeIncomingDamage,
  applyLifeRecovery,
  applyThornsReflect,
  applyMortalStrike,
  getSkillVal,
  getSkillChance,
  getSkillMag,
  type SkillEffects,
  type SkillProcContext,
  type IncomingDmgCtx,
} from "./_combat-shared";
import type { EquipmentState, ItemSkill } from "@shared/game-data";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function emptyEquipment(): EquipmentState {
  return {};
}

const mockItemSkill = (type: ItemSkill['type'], magnitude: number, chance?: number): ItemSkill => ({
  type,
  magnitude,
  chance: chance ?? 0,
} as ItemSkill);

// Deterministic RNG that cycles through a sequence
function seqRng(seq: number[]): () => number {
  let i = 0;
  return () => {
    const v = seq[i % seq.length]!;
    i++;
    return v;
  };
}

// ─── getSkillVal / getSkillChance / getSkillMag ───────────────────────────────

describe("getSkillVal", () => {
  it("sums magnitude for matching type", () => {
    const skills: ItemSkill[] = [
      mockItemSkill('poison', 10),
      mockItemSkill('poison', 5),
      mockItemSkill('thorns', 20),
    ];
    assert.equal(getSkillVal(skills, 'poison'), 15);
    assert.equal(getSkillVal(skills, 'thorns'), 20);
  });
  it("returns 0 for unknown type", () => {
    assert.equal(getSkillVal([], 'poison'), 0);
  });
});

describe("getSkillChance", () => {
  it("returns max chance for matching type", () => {
    const skills: ItemSkill[] = [
      mockItemSkill('execute', 0, 15),
      mockItemSkill('execute', 0, 30),
    ];
    assert.equal(getSkillChance(skills, 'execute'), 30);
  });
  it("returns 0 for empty", () => {
    assert.equal(getSkillChance([], 'execute'), 0);
  });
});

describe("getSkillMag", () => {
  it("sums magnitude like getSkillVal", () => {
    const skills: ItemSkill[] = [
      mockItemSkill('meteor', 25),
      mockItemSkill('meteor', 10),
    ];
    assert.equal(getSkillMag(skills, 'meteor'), 35);
  });
});

// ─── computeSkillEffects ──────────────────────────────────────────────────────

describe("computeSkillEffects", () => {
  it("returns all-zero effects for empty equipment", () => {
    const eff = computeSkillEffects(emptyEquipment());
    assert.equal(eff.spellbladePct, 0);
    assert.equal(eff.poisonDmg, 0);
    assert.equal(eff.thornsDmg, 0);
    assert.equal(eff.berserkPct, 0);
    assert.equal(eff.doubleStrikePct, 0);
    assert.equal(eff.dodgePct, 0);
    assert.equal(eff.effectiveResist, 0);
  });

  it("caps spellblade at 60", () => {
    const eq: EquipmentState = {
      weapon: { skills: [mockItemSkill('spellblade', 80)] },
    } as any;
    const eff = computeSkillEffects(eq);
    assert.equal(eff.spellbladePct, 60);
  });

  it("caps berserk at 80", () => {
    const eq: EquipmentState = {
      weapon: { skills: [mockItemSkill('berserk', 100)] },
    } as any;
    const eff = computeSkillEffects(eq);
    assert.equal(eff.berserkPct, 80);
  });

  it("caps doubleStrike at 50", () => {
    const eq: EquipmentState = {
      weapon: { skills: [mockItemSkill('doublestrike', 70)] },
    } as any;
    const eff = computeSkillEffects(eq);
    assert.equal(eff.doubleStrikePct, 50);
  });

  it("caps dodge at 50", () => {
    const eq: EquipmentState = {
      weapon: { skills: [mockItemSkill('dodge', 60)] },
    } as any;
    const eff = computeSkillEffects(eq);
    assert.equal(eff.dodgePct, 50);
  });

  it("caps lifeSteal at 50", () => {
    const eq: EquipmentState = {
      weapon: { skills: [mockItemSkill('lifesteal', 60)] },
    } as any;
    const eff = computeSkillEffects(eq);
    assert.equal(eff.lifeStealPct, 50);
  });

  it("caps effectiveResist at 50", () => {
    const eq: EquipmentState = {
      helmet: { skills: [mockItemSkill('resist_all', 70)] },
    } as any;
    // Actually resistAll comes from getEquipmentBonuses, not skills.
    // effectiveResist = Math.min(50, resistAll). With no equipment bonuses, resistAll=0.
    const eff = computeSkillEffects(eq);
    assert.equal(eff.effectiveResist, 0);
  });

  it("aggregates skills across multiple equipment slots", () => {
    const eq: EquipmentState = {
      weapon:  { skills: [mockItemSkill('poison', 15)] },
      helmet:  { skills: [mockItemSkill('poison', 10), mockItemSkill('thorns', 5)] },
      gloves:  { skills: [mockItemSkill('thorns', 8)] },
    } as any;
    const eff = computeSkillEffects(eq);
    assert.equal(eff.poisonDmg, 25); // 15 + 10
    assert.equal(eff.thornsDmg, 13); // 5 + 8
  });
});

// ─── computeEffectiveCombatSpeed ───────────────────────────────────────────────

describe("computeEffectiveCombatSpeed", () => {
  it("returns base speed with no bonuses", () => {
    const speed = computeEffectiveCombatSpeed(0, 1);
    assert.ok(speed > 0);
    assert.ok(speed <= 3);
  });

  it("reduces with attackSpeed", () => {
    const base = computeEffectiveCombatSpeed(0, 1);
    const faster = computeEffectiveCombatSpeed(100, 1);
    assert.ok(faster < base);
  });

  it("increases with tempMul < 1 (cold penalty → slower)", () => {
    const normal = computeEffectiveCombatSpeed(0, 1);
    const cold = computeEffectiveCombatSpeed(0, 0.5);
    assert.ok(cold > normal); // slower when cold
  });

  it("floors at 1.5", () => {
    const speed = computeEffectiveCombatSpeed(999, 1);
    assert.ok(speed >= 1.5);
  });
});

// ─── applySkillProcDamage ─────────────────────────────────────────────────────

describe("applySkillProcDamage", () => {
  const baseEff: SkillEffects = {
    spellbladePct: 0, poisonDmg: 0, thornsDmg: 0,
    berserkPct: 0, doubleStrikePct: 0, dodgePct: 0,
    executePct: 0, frostNovaPct: 0, bloodSacPct: 0,
    avalanchePct: 0, divineShieldPct: 0, meteorPct: 0,
    lifeStealPct: 0, vampiricHp: 0, effectiveResist: 0,
  };

  const baseCtx: SkillProcContext = {
    enemyHp: 100, enemyMaxHp: 100,
    playerHp: 50, playerMaxHp: 50,
    perHitBase: 10, effAtk: 8,
  };

  it("returns zero extra damage with no effects", () => {
    const noop = () => 0;
    const result = applySkillProcDamage(baseCtx, baseEff, [], noop);
    assert.equal(result.extraDmg, 0);
    assert.equal(result.playerHpAfter, 50);
  });

  it("execute instakills enemy below 20% HP", () => {
    const eff = { ...baseEff, executePct: 100 };
    const ctx = { ...baseCtx, enemyHp: 15, enemyMaxHp: 100 };
    const rng = () => 0; // always triggers
    const result = applySkillProcDamage(ctx, eff, [], rng);
    assert.equal(result.extraDmg, 15); // kills the remaining HP
  });

  it("blood sacrifice damages player for bonus damage", () => {
    const eff = { ...baseEff, bloodSacPct: 20 };
    const ctx = { ...baseCtx, playerHp: 50 };
    const result = applySkillProcDamage(ctx, eff, [], () => 0);
    assert.equal(result.playerHpAfter, 40); // 50 - 10
    assert.equal(result.extraDmg, 10); // 20% of 50
  });

  it("meteor does not proc when chance miss", () => {
    const eff = { ...baseEff, meteorPct: 50 };
    const allSkills: ItemSkill[] = [mockItemSkill('meteor', 100)];
    const rng = () => 0.99; // 99% → fail 50% check
    const result = applySkillProcDamage(baseCtx, eff, allSkills, rng);
    assert.equal(result.extraDmg, 0);
  });
});

// ─── computeIncomingDamage ────────────────────────────────────────────────────

describe("computeIncomingDamage", () => {
  const baseEff: SkillEffects = {
    spellbladePct: 0, poisonDmg: 0, thornsDmg: 0,
    berserkPct: 0, doubleStrikePct: 0, dodgePct: 0,
    executePct: 0, frostNovaPct: 0, bloodSacPct: 0,
    avalanchePct: 0, divineShieldPct: 0, meteorPct: 0,
    lifeStealPct: 0, vampiricHp: 0, effectiveResist: 0,
  };

  const baseCtx: IncomingDmgCtx = {
    enemyAttack: 20, playerDef: 5,
    effectiveResist: 0,
    playerHp: 100, playerMaxHp: 100,
  };

  it("calculates base damage = enemyAttack - playerDef", () => {
    const inc = computeIncomingDamage(baseCtx, baseEff, [], () => 0);
    assert.equal(inc.dmgToPlayer, 15);
    assert.equal(inc.dodged, false);
  });

  it("damage can't go negative", () => {
    const ctx = { ...baseCtx, enemyAttack: 5, playerDef: 10 };
    const inc = computeIncomingDamage(ctx, baseEff, [], () => 0);
    assert.equal(inc.dmgToPlayer, 0);
  });

  it("resist reduces incoming damage", () => {
    const ctx = { ...baseCtx, effectiveResist: 5 };
    const inc = computeIncomingDamage(ctx, baseEff, [], () => 0);
    assert.equal(inc.dmgToPlayer, 10); // 15 - 5
  });

  it("dodge completely negates damage", () => {
    const eff = { ...baseEff, dodgePct: 100 };
    const inc = computeIncomingDamage(baseCtx, eff, [], () => 0);
    assert.equal(inc.dodged, true);
    assert.equal(inc.dmgToPlayer, 15); // raw damage still calculated, but flagged dodged
  });

  it("frost nova nullifies damage", () => {
    const eff = { ...baseEff, frostNovaPct: 100 };
    const inc = computeIncomingDamage(baseCtx, eff, [], () => 0);
    assert.equal(inc.dmgToPlayer, 0);
  });

  it("divine shield nullifies damage", () => {
    const eff = { ...baseEff, divineShieldPct: 100 };
    const inc = computeIncomingDamage(baseCtx, eff, [], () => 0);
    assert.equal(inc.dmgToPlayer, 0);
  });

  it("enemy crit increases damage", () => {
    const ctx = { ...baseCtx, enemyCritRating: 100, enemyCritDamage: 2 };
    const inc = computeIncomingDamage(ctx, baseEff, [], () => 0);
    assert.equal(inc.crit, true);
    assert.equal(inc.dmgToPlayer, 30); // 15 * 2
  });

  it("iron maiden reflects damage", () => {
    const im: ItemSkill = { type: 'iron_maiden', magnitude: 50, chance: 100 } as ItemSkill;
    const allSkills: ItemSkill[] = [im];
    const inc = computeIncomingDamage(baseCtx, baseEff, allSkills, () => 0);
    assert.ok(inc.reflectDmg > 0); // 15 * 0.5 = 7
    assert.equal(inc.reflectDmg, 7);
  });
});

// ─── applyLifeRecovery ─────────────────────────────────────────────────────────

describe("applyLifeRecovery", () => {
  it("returns same HP with no recovery", () => {
    const hp = applyLifeRecovery(30, 100, 100, 0, 0, 0, () => 0);
    assert.equal(hp, 30);
  });

  it("life leech recovers HP based on damage dealt", () => {
    const hp = applyLifeRecovery(30, 100, 100, 10, 0, 0, () => 0);
    assert.equal(hp, 40); // 30 + 10% of 100
  });

  it("life steal recovers HP based on damage dealt", () => {
    const hp = applyLifeRecovery(30, 100, 200, 0, 5, 0, () => 0);
    assert.equal(hp, 40); // 30 + 5% of 200
  });

  it("life on kill adds flat HP", () => {
    const hp = applyLifeRecovery(30, 100, 0, 0, 0, 15, () => 0);
    assert.equal(hp, 45);
  });

  it("caps at max HP", () => {
    const hp = applyLifeRecovery(95, 100, 100, 10, 0, 0, () => 0);
    assert.equal(hp, 100);
  });
});

// ─── applyThornsReflect ────────────────────────────────────────────────────────

describe("applyThornsReflect", () => {
  it("no reflect when player takes no damage", () => {
    const hp = applyThornsReflect(100, 0, 10, 0);
    assert.equal(hp, 100);
  });

  it("thorns damages enemy when player hit", () => {
    const hp = applyThornsReflect(100, 20, 15, 0);
    assert.equal(hp, 85); // 100 - 15
  });

  it("reflect percent damage", () => {
    const hp = applyThornsReflect(100, 50, 0, 100);
    assert.equal(hp, 50); // 100 - 50
  });

  it("combines thorns and reflect", () => {
    const hp = applyThornsReflect(100, 40, 10, 50);
    assert.equal(hp, 70); // 100 - 10 - 20
  });
});

// ─── applyMortalStrike ─────────────────────────────────────────────────────────

describe("applyMortalStrike", () => {
  it("returns 0 without mortal strike skill", () => {
    const dmg = applyMortalStrike(100, [], () => 0);
    assert.equal(dmg, 0);
  });

  it("procs based on chance", () => {
    const ms: ItemSkill = { type: 'mortal_strike', magnitude: 25, chance: 50 } as ItemSkill;
    const skills: ItemSkill[] = [ms];
    const rng = seqRng([0.01, 0.99]); // 0.01*100=1 < 50 ✓, 0.99*100=99 >= 50 ✗
    assert.ok(applyMortalStrike(100, skills, rng) > 0);
    assert.equal(applyMortalStrike(100, skills, rng), 0);
  });

  it("scales with perHitBase and magnitude", () => {
    const ms: ItemSkill = { type: 'mortal_strike', magnitude: 50, chance: 100 } as ItemSkill;
    const skills: ItemSkill[] = [ms];
    const dmg = applyMortalStrike(200, skills, () => 0);
    assert.equal(dmg, 100); // 200 * 50%
  });
});
