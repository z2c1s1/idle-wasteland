// ═══════════════════════════════════════════════════════════════════════════════
// 共享战斗计算 — 消除 combat.ts 和 melee.ts 之间的重复逻辑
// ═══════════════════════════════════════════════════════════════════════════════

import type { GameState } from "@shared/schema";
import {
  getEquipmentBonuses,
  type GameItem, type ItemSkill, type EquipmentSlot,
} from "@shared/game-data";
import type { EquipmentState } from "@shared/game-data";

// ─── Skill extraction helpers ─────────────────────────────────────────────────

export function getSkillVal(allSkills: ItemSkill[], type: ItemSkill['type']): number {
  return allSkills
    .filter(s => s.type === type)
    .reduce((sum, s) => sum + ((s as any).magnitude ?? (s as any).value ?? 0), 0);
}

export function getSkillChance(allSkills: ItemSkill[], type: ItemSkill['type']): number {
  return allSkills
    .filter(s => s.type === type)
    .reduce((max, s) => Math.max(max, (s as any).chance ?? (s as any).value ?? 0), 0);
}

export function getSkillMag(allSkills: ItemSkill[], type: ItemSkill['type']): number {
  return allSkills
    .filter(s => s.type === type)
    .reduce((sum, s) => sum + ((s as any).magnitude ?? (s as any).value ?? 0), 0);
}

// ─── Collect all skill effects from equipment ─────────────────────────────────

export interface SkillEffects {
  spellbladePct: number;
  poisonDmg: number;
  thornsDmg: number;
  berserkPct: number;
  doubleStrikePct: number;
  dodgePct: number;
  executePct: number;
  frostNovaPct: number;
  bloodSacPct: number;
  avalanchePct: number;
  divineShieldPct: number;
  meteorPct: number;
  lifeStealPct: number;
  vampiricHp: number;
  effectiveResist: number;
}

export function computeSkillEffects(equipment: EquipmentState): SkillEffects {
  const allSkills: ItemSkill[] = Object.values(equipment).flatMap(item => item?.skills ?? []);
  const { resistAll } = getEquipmentBonuses(equipment);

  return {
    spellbladePct:   Math.min(60, getSkillVal(allSkills, 'spellblade')),
    poisonDmg:       getSkillVal(allSkills, 'poison'),
    thornsDmg:       getSkillVal(allSkills, 'thorns'),
    berserkPct:      Math.min(80, getSkillVal(allSkills, 'berserk')),
    doubleStrikePct: Math.min(50, getSkillVal(allSkills, 'doublestrike')),
    dodgePct:        Math.min(50, getSkillVal(allSkills, 'dodge')),
    executePct:      Math.min(40, getSkillChance(allSkills, 'execute')),
    frostNovaPct:    Math.min(40, getSkillChance(allSkills, 'frost_nova')),
    bloodSacPct:     Math.min(30, getSkillVal(allSkills, 'blood_sacrifice')),
    avalanchePct:    getSkillChance(allSkills, 'avalanche'),
    divineShieldPct: Math.min(50, getSkillChance(allSkills, 'divine_shield')),
    meteorPct:       getSkillVal(allSkills, 'meteor'),
    lifeStealPct:    Math.min(50, getSkillVal(allSkills, 'lifesteal')),
    vampiricHp:      getSkillVal(allSkills, 'vampiric'),
    effectiveResist: Math.min(50, resistAll),
  };
}

// ─── Combat speed ─────────────────────────────────────────────────────────────

import { BASE_COMBAT_SPEED, computeEffectiveCombatSpeed } from "@shared/game-math";

export { BASE_COMBAT_SPEED, computeEffectiveCombatSpeed };

// ─── Per-tick skill proc effects on enemy damage ──────────────────────────────

export interface SkillProcContext {
  enemyHp: number;
  enemyMaxHp: number;
  playerHp: number;
  playerMaxHp: number;
  perHitBase: number;
  effAtk: number;
}

/** Apply skill proc effects that add to total damage. Returns {extraDmg, playerHpDelta, extraXp}. */
export function applySkillProcDamage(
  ctx: SkillProcContext,
  eff: SkillEffects,
  allSkills: ItemSkill[],
  rng: () => number,
): { extraDmg: number; playerHpAfter: number; extraXp: number } {
  let extraDmg = 0;
  let playerHpAfter = ctx.playerHp;
  let extraXp = 0;

  // Execute: instakill below 20% HP
  if (eff.executePct > 0 && ctx.enemyHp < ctx.enemyMaxHp * 0.2 && rng() * 100 < eff.executePct) {
    extraDmg = ctx.enemyHp - extraDmg; // total becomes enemyHp
  }

  // Blood Sacrifice
  if (eff.bloodSacPct > 0) {
    const sacDmg = Math.floor(playerHpAfter * eff.bloodSacPct / 100);
    extraDmg += sacDmg;
    playerHpAfter -= sacDmg;
  }

  // Avalanche (on deadly strike — caller checks)
  if (eff.avalanchePct > 0 && rng() * 100 < eff.avalanchePct) {
    extraDmg += Math.floor(ctx.effAtk * getSkillMag(allSkills, 'avalanche') / 100);
  }

  // Meteor
  if (eff.meteorPct > 0 && rng() * 100 < eff.meteorPct) {
    extraDmg += Math.floor(ctx.perHitBase * getSkillMag(allSkills, 'meteor') / 100);
  }

  // Cleave
  const cleaveChance = getSkillChance(allSkills, 'cleave');
  if (cleaveChance > 0 && rng() * 100 < cleaveChance) {
    extraDmg += Math.floor(ctx.effAtk * getSkillMag(allSkills, 'cleave') / 100);
  }

  // Frenzy
  const frenzyChance = getSkillChance(allSkills, 'frenzy');
  if (frenzyChance > 0 && rng() * 100 < frenzyChance) {
    extraDmg += Math.floor(ctx.perHitBase * getSkillMag(allSkills, 'frenzy') / 100);
  }

  // Arcane Barrage
  const arcaneChance = getSkillChance(allSkills, 'arcane_barrage');
  if (arcaneChance > 0 && rng() * 100 < arcaneChance) {
    const extraHits = getSkillMag(allSkills, 'arcane_barrage');
    extraDmg += ctx.effAtk * extraHits;
    extraXp += 4 * extraHits;
  }

  return { extraDmg, playerHpAfter, extraXp };
}

// ─── Incoming damage reduction ────────────────────────────────────────────────

export interface IncomingDmgCtx {
  enemyAttack: number;
  playerDef: number;
  effectiveResist: number;
  playerHp: number;
  playerMaxHp: number;
  /** Enemy crit chance (0-100) */
  enemyCritRating?: number;
  /** Enemy crit multiplier (default 1.5) */
  enemyCritDamage?: number;
}

export function computeIncomingDamage(
  ctx: IncomingDmgCtx,
  eff: SkillEffects,
  allSkills: ItemSkill[],
  rng: () => number,
): { dmgToPlayer: number; dodged: boolean; reflectDmg: number; crit: boolean } {
  let rawDmg = Math.max(0, ctx.enemyAttack - ctx.playerDef);
  let crit = false;
  if ((ctx.enemyCritRating ?? 0) > 0 && rng() * 100 < (ctx.enemyCritRating ?? 0)) {
    rawDmg = Math.floor(rawDmg * (ctx.enemyCritDamage ?? 1.5));
    crit = true;
  }
  let dmgToPlayer = Math.max(0, rawDmg - ctx.effectiveResist);

  // Frost Nova
  if (eff.frostNovaPct > 0 && rng() * 100 < eff.frostNovaPct) dmgToPlayer = 0;

  const dodged = eff.dodgePct > 0 && rng() * 100 < eff.dodgePct;

  // Divine Shield
  if (eff.divineShieldPct > 0 && !dodged && dmgToPlayer > 0 && rng() * 100 < eff.divineShieldPct) dmgToPlayer = 0;

  let reflectDmg = 0;

  if (!dodged && dmgToPlayer > 0) {
    // Iron Maiden
    const ironMaidenChance = getSkillChance(allSkills, 'iron_maiden');
    if (ironMaidenChance > 0 && rng() * 100 < ironMaidenChance) {
      reflectDmg += Math.floor(dmgToPlayer * getSkillMag(allSkills, 'iron_maiden') / 100);
    }

    // Last Stand
    const lastStandChance = getSkillChance(allSkills, 'last_stand');
    if (lastStandChance > 0 && ctx.playerHp < ctx.playerMaxHp * 0.35 && rng() * 100 < lastStandChance) {
      dmgToPlayer = Math.floor(dmgToPlayer * (1 - getSkillMag(allSkills, 'last_stand') / 100));
    }
  }

  return { dmgToPlayer, dodged, reflectDmg, crit };
}

// ─── Life recovery effects ────────────────────────────────────────────────────

export function applyLifeRecovery(
  playerHp: number, playerMaxHp: number, totalDmgToEnemy: number,
  lifeLeech: number, lifeStealPct: number, lifeOnKill: number,
  rng: () => number,
): number {
  let hp = playerHp;
  if (lifeLeech > 0) hp = Math.min(playerMaxHp, hp + Math.floor(totalDmgToEnemy * lifeLeech / 100));
  if (lifeStealPct > 0) hp = Math.min(playerMaxHp, hp + Math.floor(totalDmgToEnemy * lifeStealPct / 100));
  if (lifeOnKill > 0) hp = Math.min(playerMaxHp, hp + lifeOnKill);
  return hp;
}

// ─── Thorns / reflect damage to enemy ─────────────────────────────────────────

export function applyThornsReflect(enemyHp: number, dmgToPlayer: number, thornsDmg: number, reflectDamage: number): number {
  let hp = enemyHp;
  if (dmgToPlayer > 0) {
    if (thornsDmg > 0) hp -= thornsDmg;
    if (reflectDamage > 0) hp -= Math.floor(dmgToPlayer * reflectDamage / 100);
  }
  return hp;
}

// ─── Mortal Strike debuff damage ──────────────────────────────────────────────

export function applyMortalStrike(
  perHitBase: number,
  allSkills: ItemSkill[],
  rng: () => number,
): number {
  const mortalChance = getSkillChance(allSkills, 'mortal_strike');
  if (mortalChance > 0 && rng() * 100 < mortalChance) {
    return Math.floor(perHitBase * getSkillMag(allSkills, 'mortal_strike') / 100);
  }
  return 0;
}
