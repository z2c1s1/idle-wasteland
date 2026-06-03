---
name: refactoring
description: 重构：提取函数/消除重复/简化条件/SOLID模式
---
# Code Refactoring

## When to refactor
- Same logic appears 3+ times → extract function
- Function > 20 lines with multiple concerns → split
- Long if-else chains → strategy pattern or lookup table
- Tight coupling between modules → dependency inversion

## SOLID
- **S**ingle responsibility: one reason to change
- **O**pen/closed: extend, don't modify
- **L**iskov: subtypes must be substitutable
- **I**nterface segregation: small focused interfaces
- **D**ependency inversion: depend on abstractions

## Quick wins
- Extract repeated JSX into component
- Replace magic numbers with constants
- Pull shared logic into utility functions
- Use early return to reduce nesting
