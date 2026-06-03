---
name: clean-code
description: Clean Code原则：命名/函数大小/单一职责/代码异味消除
---
# Clean Code

## Naming
- Variables: descriptive nouns (enemyMaxHp, not e)
- Functions: verb + noun (calculateDamage, not doCalc)
- Booleans: is/has/can prefix (isActive, hasWeapon, canAfford)

## Function Size
- Functions < 20 lines, preferably < 10
- Single responsibility: does ONE thing
- Extract blocks with comments into named functions

## Avoid
- Magic numbers → named constants
- Deep nesting (>3 levels) → early return
- Duplicate logic → extract shared utility
- Comments explaining WHAT → code should be self-documenting
