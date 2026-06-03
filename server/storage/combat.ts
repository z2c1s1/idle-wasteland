import { db } from "../db";
import { gameStates, type GameState } from "@shared/schema";
import {
  getEquipmentBonuses,
  generateDroppedItem,
  getDropChance,
  COMBAT_TRIANGLE,
  TRIANGLE_DAMAGE_BONUS,
  TRIANGLE_DAMAGE_PENALTY,
  type GameItem,
} from "@shared/game-data";
import { eq } from "drizzle-orm";
import { calculateLevel, getPlayerMaxHp, getPlayerDefence, getAgilityBonuses } from "@shared/game-math";
import { parseEquipment, parseLootBag, parseGems } from "@shared/game-state-parse";
import { DISENCHANT_GOLD, RARITY_ORDER } from "./constants";
import { mergeGems } from "./helpers";
import {
  computeSkillEffects, computeEffectiveCombatSpeed,
  applySkillProcDamage, applyMortalStrike,
  computeIncomingDamage, applyLifeRecovery, applyThornsReflect,
} from "./tick/_combat-shared";

export type CombatStyle = "melee" | "ranged" | "magic";

export async function handleTriangleCombat(
  state: GameState,
  enemy: { maxHp: number; attack: number; defence: number; combatStyle?: CombatStyle; drops: { gold: [number, number] }; xp: number },
  enemyIndex: number,
  style: CombatStyle,
  elapsedSeconds: number,
): Promise<GameState | null> {
  const equipment = parseEquipment(state.equipment);
  const eff = computeSkillEffects(equipment);

  const {
    attackBonus: eqAttackBonus,
    enhancedDamage,
    lifeOnKill,
    crushingBlow,
    lifeRegen,
    lifeLeech,
    deadlyStrike,
    attackSpeed,
    reflectDamage,
    resistAll,
    magicFind,
  } = getEquipmentBonuses(equipment);

  const BASE_COMBAT_SPEED = 3;
  const tempMul = 1; // triangle combat doesn't use temperature
  const effectiveCombatSpeed = Math.max(1.5, BASE_COMBAT_SPEED * (1 - attackSpeed / 200)) / tempMul;
  const ticks = Math.floor(elapsedSeconds / effectiveCombatSpeed);
  if (ticks <= 0) return state;

  const enemyStyle: CombatStyle = enemy.combatStyle ?? "melee";
  let triangleMult = 1;
  if (COMBAT_TRIANGLE[style].strong === enemyStyle) triangleMult = 1 + TRIANGLE_DAMAGE_BONUS;
  else if (COMBAT_TRIANGLE[style].weak === enemyStyle) triangleMult = 1 - TRIANGLE_DAMAGE_PENALTY;

  // World tier scaling
  const tier = (state as any).worldTier ?? 1;
  const tierHpMul = tier === 2 ? 2 : tier === 3 ? 4 : tier === 4 ? 8 : 1;
  const tierAtkMul = tier === 2 ? 1.5 : tier === 3 ? 2.5 : tier === 4 ? 4 : 1;

  const playerMaxHp = getPlayerMaxHp(state);
  let playerHp = state.playerHp < 0 ? playerMaxHp : state.playerHp;
  const scaledMaxHp = Math.floor(enemy.maxHp * tierHpMul);
  let enemyHp = state.enemyHp < 0 ? scaledMaxHp : state.enemyHp;
  const enemyAttack = Math.floor(enemy.attack * tierAtkMul);

  const weaponItem = equipment.weapon ?? null;
  const hasWeaponRange = weaponItem && (weaponItem.maxDamage ?? 0) > 0;
  const levelBaseDmg = Math.max(
    1,
    Math.floor(calculateLevel(style === "ranged" ? state.rangedXp : state.magicXp) * 1.2) + eqAttackBonus,
  );

  let goldGained = 0;
  let attackXpGained = 0;
  let defenceXpGained = 0;
  let hitpointsXpGained = 0;
  let playerDied = false;
  const newDrops: GameItem[] = [];
  const gemsGained: Record<string, number> = {};
  const agilityLuck = getAgilityBonuses(state).luckMul;
  const allSkills = Object.values(equipment).flatMap(item => item?.skills ?? []);
  const rng = () => Math.random();

  for (let i = 0; i < ticks; i++) {
    if (lifeRegen > 0) playerHp = Math.min(playerMaxHp, playerHp + lifeRegen);

    const weaponRoll =
      hasWeaponRange && weaponItem
        ? (weaponItem.minDamage ?? 0) +
          Math.floor(Math.random() * ((weaponItem.maxDamage ?? 0) - (weaponItem.minDamage ?? 0) + 1))
        : levelBaseDmg;
    const perHitBase = Math.max(1, weaponRoll + eqAttackBonus);
    let effAtk = Math.max(1, perHitBase - enemy.defence);
    if (eff.spellbladePct > 0) effAtk = Math.floor(effAtk * (1 + eff.spellbladePct / 100));
    if (enhancedDamage > 0) effAtk = Math.floor(effAtk * (1 + enhancedDamage / 100));
    if (eff.berserkPct > 0 && playerHp < playerMaxHp * 0.3) {
      effAtk = Math.floor(effAtk * (1 + eff.berserkPct / 100));
    }

    const deadlyStrikeHit = deadlyStrike > 0 && Math.random() * 100 < deadlyStrike;
    const strikes = eff.doubleStrikePct > 0 && Math.random() * 100 < eff.doubleStrikePct ? 2 : 1;
    let totalDmgToEnemy = Math.floor((effAtk * strikes * (deadlyStrikeHit ? 2 : 1) + eff.poisonDmg) * triangleMult);
    if (crushingBlow > 0 && Math.random() * 100 < crushingBlow) {
      totalDmgToEnemy += Math.max(1, Math.floor(playerMaxHp * 0.01));
    }

    // ── Shared skill proc effects ──────────────────────────────────────────
    const skillCtx = { enemyHp, enemyMaxHp: enemy.maxHp, playerHp, playerMaxHp, perHitBase, effAtk };
    const skillResult = applySkillProcDamage(skillCtx, eff, allSkills, rng);
    totalDmgToEnemy += skillResult.extraDmg;
    playerHp = skillResult.playerHpAfter;
    attackXpGained += skillResult.extraXp;

    // Mortal Strike debuff
    totalDmgToEnemy += applyMortalStrike(perHitBase, allSkills, rng);

    enemyHp -= totalDmgToEnemy;
    attackXpGained += 4 * strikes;

    // ── Life recovery (shared) ─────────────────────────────────────────────
    playerHp = applyLifeRecovery(playerHp, playerMaxHp, totalDmgToEnemy,
      lifeLeech, eff.lifeStealPct, lifeOnKill, magicFind, rng);

    if (enemyHp <= 0) {
      goldGained +=
        enemy.drops.gold[0] +
        Math.floor(Math.random() * (enemy.drops.gold[1] - enemy.drops.gold[0] + 1));
      attackXpGained += enemy.xp;
      hitpointsXpGained += Math.floor(enemy.xp / 3);
      if (Math.random() < getDropChance(enemyIndex) * agilityLuck) {
        const drop = generateDroppedItem(enemyIndex, 0);
        if (drop) {
          const filterThreshold = RARITY_ORDER[state.lootFilter ?? "common"] ?? 0;
          if ((RARITY_ORDER[drop.rarity] ?? 0) >= filterThreshold) newDrops.push(drop);
          else goldGained += DISENCHANT_GOLD[drop.rarity] ?? 5;
        }
      }
      if (eff.vampiricHp > 0) playerHp = Math.min(playerMaxHp, playerHp + eff.vampiricHp);
      enemyHp = scaledMaxHp;
    }

    // ── Incoming damage (shared, with enemy crit + tier scaling) ───────────
    const playerDef = style === "melee" ? getPlayerDefence(state) : Math.floor(calculateLevel(state.defenceXp) * 0.5);
    const incCtx = { enemyAttack, playerDef, effectiveResist: eff.effectiveResist, playerHp, playerMaxHp, enemyCritRating: (enemy as any).critRating, enemyCritDamage: (enemy as any).critDamage };
    const inc = computeIncomingDamage(incCtx, eff, allSkills, rng);
    if (!inc.dodged && inc.dmgToPlayer > 0) {
      playerHp -= inc.dmgToPlayer;
      defenceXpGained += 2;
      hitpointsXpGained += 1;
    }
    enemyHp = applyThornsReflect(enemyHp, inc.dmgToPlayer, eff.thornsDmg, reflectDamage);
    enemyHp -= inc.reflectDmg;

    if (playerHp <= 0) {
      playerDied = true;
      playerHp = Math.floor(playerMaxHp * 0.5);
      break;
    }
  }

  const usedTime = playerDied ? elapsedSeconds : ticks * effectiveCombatSpeed;
  const existingLoot = parseLootBag(state.lootBag);
  const combinedLoot = [...existingLoot, ...newDrops].slice(-(state.lootBagSize ?? 50));
  const existingGems = parseGems(state.gems);
  const mergedGemBag = mergeGems(existingGems, gemsGained);

  const xpKey = style === "ranged" ? "rangedXp" : "magicXp";
  const updates: Partial<GameState> = {
    playerHp,
    enemyHp,
    gold: state.gold + goldGained,
    [xpKey]: (state[xpKey] ?? 0) + attackXpGained,
    attackXp: style === "melee" ? state.attackXp + attackXpGained : state.attackXp,
    defenceXp: state.defenceXp + defenceXpGained,
    hitpointsXp: state.hitpointsXp + hitpointsXpGained,
    lootBag: JSON.stringify(combinedLoot),
    gems: JSON.stringify(mergedGemBag),
    actionUpdatedAt: new Date(new Date(state.actionUpdatedAt).getTime() + usedTime * 1000),
    ...(playerDied ? { activeAction: "idle" } : {}),
  };

  const [updated] = await db.update(gameStates).set(updates).where(eq(gameStates.id, state.id)).returning();
  return updated;
}
