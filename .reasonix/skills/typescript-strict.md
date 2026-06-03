---
name: typescript-strict
description: TypeScript 严格模式：禁止 any、接口优先、async/await、命名常量
---
# TypeScript Standards

## Rules
1. **No `as any`** — use proper types, `unknown` + narrowing, or `@ts-expect-error` with reason
2. **Interface for props** — `interface Props { ... }` not inline `{ x: number }`
3. **Discriminated unions** — shared `type` field unions over optional fields
4. **async/await** over `.then()`
5. **Named constants** over magic numbers
6. **`const` once** — cache `Date.now()`, `Math.random()` seeds
7. **No `console.log` in production paths** — use structured logging
