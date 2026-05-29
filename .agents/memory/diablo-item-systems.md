---
name: Diablo item systems
description: SLOT_BASES, UNIQUE_ITEMS (22), ITEM_SETS (3), and set bonus detection architecture
---

## Item base system (SLOT_BASES in shared/game-data.ts)
- Keyed by EquipmentSlot, each slot has 3–7 base types with reqIlvl
- Weapon bases: dagger→short_sword→scimitar→long_sword→battle_axe→great_sword→rune_blade
- Armor bases: leather→chain/iron→plate→dragon (4 tiers per slot)
- Each base: `{ id, name, emoji, slot, reqIlvl, minDamage, maxDamage, baseDefence, implicit? }`
- generateDroppedItem picks `eligibleBases.filter(b => b.reqIlvl <= ilvl)` then takes the last (highest tier)

**Why:** Code reviewer required multiple item bases with min/max weapon damage for Diablo authenticity.

## Unique items (UNIQUE_ITEMS array, 22 items)
- Each `UniqueItemDef`: `{ id, name, flavorText, slot, emoji, ilvl, minEnemyIndex, affixes, skills? }`
- Unique drop: 2%–5.5% chance per kill (0.02 + enemyIndex × 0.005), rolled BEFORE rarity roll
- Eligible uniques filtered by `minEnemyIndex <= enemyIndex`
- Returned with `source: 'unique'`, `uniqueId`, `setId` (if in a set)
- UNIQUE_SET_MAP: `Record<uniqueId, setId>` — computed at module init from ITEM_SETS

## Set items (ITEM_SETS array, 3 sets)
- Sets: 战士传承 (3pc), 龙猎者 (4pc), 幽灵圣者 (4pc)
- Set pieces identified by `item.setId` on equipped items
- `getEquipmentBonuses` detects set via `setCount` map, applies bonuses cumulatively

## Set bonus detection (in getEquipmentBonuses)
1. Scan equipped items for `item.setId`, tally count per setId
2. For each set with count >= bonus.count, apply bonus affixes to running totals
3. Return `activeSets: Record<string, number>` alongside stat totals

**Why:** Code reviewer required set bonus integration in getEquipmentBonuses and set progress UI.

## Frontend visual treatments
- Unique items: `border-amber-400/70`, `bg-amber-500/10`, `text-amber-300`, badge: "传说独特"
- Set items: `border-teal-400/70`, `bg-teal-500/8`, `text-teal-300`, badge: "套装"
- Combat page: active set bonus panel (teal bg, shows active/locked bonuses)
- Set name badge in ItemCard shows set name and piece count

## How to add a new unique item
1. Add entry to UNIQUE_ITEMS array in shared/game-data.ts
2. If it should be part of a set, add its id to the set's `pieces` array in ITEM_SETS
3. UNIQUE_SET_MAP is auto-computed from ITEM_SETS — no manual update needed
