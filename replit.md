# Idle RPG

A Melvor Idle-inspired browser idle game with gathering skills, combat, smithing, and equipment systems.

## Architecture

**Full-stack TypeScript**: Express backend + React/Vite frontend, single PostgreSQL database.

- `shared/schema.ts` — Drizzle ORM schema (single `game_states` table, one row)
- `shared/game-data.ts` — Game definitions: enemies, equipment items, smithing recipes
- `shared/routes.ts` — API route definitions (typed with Zod)
- `server/storage.ts` — All game logic (gathering, combat, smithing, equip/unequip)
- `server/routes.ts` — Express route handlers
- `client/src/` — React frontend with wouter routing

## Game Systems

### Gathering Skills (6 skills × 10 tiers each)
| Skill | XP column | Resource prefix |
|-------|-----------|-----------------|
| Woodcutting | woodcuttingXp | wood_0..9 |
| Mining | miningXp | ore_0..9 |
| Smelting | smeltingXp | bar_0..9 |
| Fishing | fishingXp | fish_0..9 |
| Hunting | huntingXp | hide_0..9 |
| Crafting | craftingXp | item_0..9 |

Action format: `"woodcutting_0"`, `"mining_3"`, etc.

### Combat System
- 8 enemies (Chicken → Fire Dragon) locked by combat level
- Combat action: `"combat_N"` where N = ENEMIES array index
- Deterministic combat: 3-second rounds, no RNG
- Player dies → revives at 50% HP, action set to "idle"
- Drops: gold, bones, dragon bones
- XP: attackXp (4/round + enemy.xp on kill), defenceXp (2 per hit taken), hitpointsXp (1 per hit + kill bonus)

### Equipment System (5 slots)
- Slots: weapon, shield, helmet, body, legs
- 19 equipment items across Bronze/Iron/Steel/Mithril/Adamant/Rune tiers
- Equip/unequip via `/api/game/equip` and `/api/game/unequip`
- Equipment stored as JSON text in `equipment` column

### Smithing (production skill)
- 19 recipes using bars (bar_0..9) to produce equipment items
- smithingXp separate skill column
- Action format: `"smith_N"` where N = SMITHING_RECIPES index
- Stops automatically when resources run out
- Crafted items stored in `craftItems` JSON column

### Player Stats
- `attackLevel = calcLevel(attackXp)`, formula: `floor(sqrt(xp)) + 1`
- `playerMaxHp = 10 + (hitpointsLevel - 1) * 5`
- `playerAttack = max(1, floor(attackLevel * 1.2) + weaponBonus)`
- `playerDefence = floor(defenceLevel * 0.8) + defenceBonus`
- `combatLevel = floor((attackLevel + defenceLevel + hitpointsLevel) / 3)`

## Pages

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | Dashboard | All skills overview |
| `/woodcutting` | Woodcutting | Oak → Spirit logs |
| `/mining` | Mining | Copper → Ether ore |
| `/smelting` | Smelting | Bronze → Eternal bars |
| `/fishing` | Fishing | Shrimp → Whale fish |
| `/hunting` | Hunting | Rabbit → Phoenix hides |
| `/crafting` | Crafting | Cloth → Divine items |
| `/combat` | Combat | Fight enemies, earn loot |
| `/inventory` | Inventory | Resources, equipment, loot |
| `/smithing` | Smithing | Craft equipment from bars |

## Key Files

- `client/src/lib/game-utils.ts` — Level calculation, player stat helpers
- `client/src/hooks/use-game.ts` — React Query hooks (useGameState, useStartAction, useEquipItem, useUnequipItem)
- `client/src/components/skill-page.tsx` — Reusable gathering skill page
- `client/src/components/layout/app-sidebar.tsx` — Navigation sidebar

## Running

```
npm run dev        # Start dev server (Express + Vite on port 5000)
npm run db:push    # Apply schema changes to DB
npm run check      # TypeScript type check
```

## DB Columns (game_states)

Gathering XP: `woodcuttingXp`, `miningXp`, `smeltingXp`, `fishingXp`, `huntingXp`, `craftingXp`  
Combat XP: `attackXp`, `strengthXp`, `defenceXp`, `hitpointsXp`, `smithingXp`  
Combat state: `playerHp` (-1 = full), `enemyHp` (-1 = new enemy)  
Loot: `gold`, `bones`, `dragonBones`  
JSON: `equipment` (slot→itemId map), `craftItems` (itemId→qty map)  
Resources: `wood_0..9`, `ore_0..9`, `bar_0..9`, `fish_0..9`, `hide_0..9`, `item_0..9`
