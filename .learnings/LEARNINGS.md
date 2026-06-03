# Learnings

## [LRN-20260602-001] correction

**Logged**: 2026-06-02T17:00:00Z
**Priority**: critical
**Status**: resolved
**Area**: infra

### Summary
Vite + tsx esbuild conflict causes server crashes on HMR

### Details
`server/vite.ts` had `process.exit(1)` in the Vite error handler. Every time
Vite encountered a transpile error (common with rapid tab switching), it would
kill the entire Express process.

### Suggested Action
1. Changed `process.exit(1)` to `console.error()` — ✅ DONE
2. Added `uncaughtException` handler that only exits on EADDRINUSE — ✅ DONE
3. Vite transform errors now return 500 instead of crashing — ✅ DONE

### Metadata
- Source: error
- Related Files: server/vite.ts, server/index.ts
- Tags: crash, vite, tsx, esbuild

---

## [LRN-20260602-002] correction

**Logged**: 2026-06-02T17:15:00Z
**Priority**: high
**Status**: resolved
**Area**: frontend

### Summary
`useState` inside `.map()` causes React "Rendered more hooks than previous render" crash

### Details
Each enemy row called `useState(1)` inside a `.map()` callback. When the enemy
list changed (e.g., combat starting/stopping), the hook count changed, causing
React to throw a runtime error.

### Suggested Action
Extract enemy row into standalone `EnemyRow` component with stable hook count — ✅ DONE

### Metadata
- Source: error
- Related Files: client/src/pages/combat.tsx
- Tags: react, hooks, map, crash

---

## [LRN-20260602-003] correction

**Logged**: 2026-06-02T17:30:00Z
**Priority**: high
**Status**: resolved
**Area**: frontend

### Summary
Crafted items use `baseId` not `baseType` — weapon detection failed for crafted weapons

### Details
Dropped items store `baseType`, crafted items store `baseId`. The combat page's
weaponStyle detection only checked `baseType`, so crafted bows/staffs defaulted to melee.

### Suggested Action
Check `baseId ?? baseType` in weapon detection — ✅ DONE

### Metadata
- Source: user_feedback
- Related Files: client/src/pages/combat.tsx
- Tags: crafting, weapon, detection

---

## [LRN-20260602-004] correction

**Logged**: 2026-06-02T17:45:00Z
**Priority**: medium
**Status**: resolved
**Area**: frontend

### Summary
Sidebar combat sub-items active on non-combat pages due to hash-only check

### Details
"副本战斗", "无尽爬塔", "诅咒试炼" used `hash === '#dungeons'` without
checking `location === '/combat'`, causing false highlights on gathering pages.

### Suggested Action
Add `location === '/combat' &&` to hash checks — ✅ DONE

### Metadata
- Source: user_feedback
- Related Files: client/src/components/layout/app-sidebar.tsx
- Tags: sidebar, routing, hash

---

## [LRN-20260602-005] knowledge_gap

**Logged**: 2026-06-02T18:00:00Z
**Priority**: medium
**Status**: pending
**Area**: infra

### Summary
Plan mode repeatedly locks out edits after plan approval

### Details
Multiple times during this session, `submit_plan` was approved but subsequent
`edit_file` calls still returned "unavailable in plan mode." Required marking
all steps complete or submitting empty plans to escape.

### Suggested Action
Investigate Reasonix plan mode lifecycle — may need a "exit plan mode" command
or earlier step-completion trigger.

### Metadata
- Source: error
- Related Files: N/A (platform issue)
- Tags: plan-mode, reasonix, workflow

---
