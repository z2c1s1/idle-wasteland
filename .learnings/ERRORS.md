# Errors

## [ERR-20260602-001] Vite HMR

**Logged**: 2026-06-02T17:00:00Z
**Priority**: high
**Status**: resolved
**Area**: infra

### Summary
Server repeatedly crashed with esbuild parse errors during rapid page navigation

### Error
```
Build failed with 1 error:
.../node_modules/vite/node_modules/esbuild/lib/main.js:...
Error: The JSX expression was not closed
```

### Context
- Triggered by rapid switching between combat tabs (enemies/dungeons/tower/trial)
- Each tab change causes hash change → React re-render → Vite HMR transform
- tsx and Vite both use esbuild, causing concurrent compilation conflicts

### Suggested Fix
1. Remove `process.exit(1)` in Vite error handler ✅
2. Add global uncaughtException handler ✅
3. Eventually separate frontend/backend processes

### Metadata
- Reproducible: yes
- Related Files: server/vite.ts, server/index.ts

---

## [ERR-20260602-002] combat.tsx corruption

**Logged**: 2026-06-02T17:20:00Z
**Priority**: critical
**Status**: resolved
**Area**: frontend

### Summary
combat.tsx became corrupted (0 bytes) after repeated edit_file operations

### Error
File became empty after a node.js string replacement operation failed.

### Context
- Multiple edit_file calls during combat page redesign
- A node -e script to fix JSX duplicated className issue
- The fix accidentally truncated the file

### Suggested Fix
Recreated file from scratch with all features — ✅ DONE

### Metadata
- Reproducible: yes (when chaining multiple complex edits)
- Related Files: client/src/pages/combat.tsx
- See Also: LRN-20260602-002

---

## [ERR-20260602-003] port EADDRINUSE

**Logged**: 2026-06-02T17:50:00Z
**Priority**: medium
**Status**: resolved
**Area**: infra

### Summary
Port 5001 remains occupied after server crash, preventing restart

### Error
```
Error: listen EADDRINUSE: address already in use 127.0.0.1:5001
```

### Context
- Server crashes from esbuild error but Node process survives
- kill_port requires manual PID lookup via netstat

### Suggested Fix
Auto-recovery in progress — uncaughtException handler now exits on EADDRINUSE
so the port is freed immediately.

### Metadata
- Reproducible: yes
- Related Files: server/index.ts
- See Also: ERR-20260602-001

---
