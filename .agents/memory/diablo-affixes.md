---
name: Diablo affix system
description: How the 11 AffixType values map to GameItem fields and combat effects
---

## AffixType union (shared/game-data.ts)
strength | agility | stamina | armour (original 4)
enhanced_damage | life_on_kill | crushing_blow | magic_find | life_regen | gold_bonus | resist_all (new 7)

## GameItem computed fields
- attackBonus = strength affixes
- defenceBonus = armour affixes
- hpBonus = stamina affixes × 5
- critRating = agility affixes × 0.5
- enhancedDamage = enhanced_damage affixes (%)
- lifeOnKill = life_on_kill affixes (flat HP)
- crushingBlow = crushing_blow affixes (% chance)
- magicFind = magic_find affixes (%)
- lifeRegen = life_regen affixes (HP/tick)
- goldBonus = gold_bonus affixes (%)
- resistAll = resist_all affixes (flat reduction)

**Why:** New fields must be explicitly zero-defaulted in craftedToGameItem/smithedToGameItem or old saved items without these fields will produce NaN when aggregated.

**How to apply:** Any new AffixType must be added to: AffixType union, AFFIX_LABEL/COLOR/EFFECT, SLOT_AFFIX_POOL (slot biases), AFFIX_SCALING, generateDroppedItem reduction, GameItem interface, getEquipmentBonuses aggregation, craftedToGameItem/smithedToGameItem defaults, server/storage.ts combat loop, and frontend display.

## Combat effects (server/storage.ts)
- enhancedDamage: multiplies effAtk by (1 + pct/100) after spellblade
- crushingBlow: random chance per tick to add floor(enemyHp * 0.25) bonus damage
- lifeOnKill: added to playerHp on each kill (capped at playerMaxHp)
- lifeRegen: added to playerHp at start of each tick (before damage calc)
- goldBonus: gold per kill = base + floor(base × pct/100)
- resistAll: rawDmg reduced by resistAll before applying to player
- magicFind: passed as playerMagicFind to generateDroppedItem(); scales rare/epic/legendary weights

## Slot affix biases
- weapon: strength, enhanced_damage, crushing_blow
- offhand: armour, resist_all, life_regen
- helmet: stamina, magic_find, life_regen
- chest: stamina, armour, resist_all, life_regen
- legs: armour, stamina, resist_all
- gloves: strength, agility, enhanced_damage, crushing_blow
- boots: agility, gold_bonus, magic_find
- neck/ring: magic_find, life_on_kill, gold_bonus
