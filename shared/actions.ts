// ═══════════════════════════════════════════════════════════════════════════════
// 统一 action 字符串常量 — 避免前端和后端各自硬编码
// ═══════════════════════════════════════════════════════════════════════════════

export const Action = {
  // ── Combat ────────────────────────────────────────────────────────────────
  combat: (enemyIndex: number, quantity: number = 1) => `combat_${enemyIndex}_${quantity}` as const,
  dungeon: (dungeonIndex: number, floor: number = 0) => `dungeon_${dungeonIndex}_${floor}` as const,
  tower: "tower" as const,
  trial: (phase: number = 0, round: number = 0) => `trial_${phase}_${round}` as const,

  // ── Gathering ─────────────────────────────────────────────────────────────
  woodcutting: (tier: number) => `woodcutting_${tier}` as const,
  mining: (tier: number) => `mining_${tier}` as const,
  smelting: (tier: number) => `smelting_${tier}` as const,
  fishing: (tier: number) => `fishing_${tier}` as const,
  hunting: (tier: number) => `hunting_${tier}` as const,
  crafting: (tier: number) => `crafting_${tier}` as const,
  agility: (tier: number) => `agility_${tier}` as const,
  exploration: (tier: number) => `exploration_${tier}` as const,

  // ── Production ────────────────────────────────────────────────────────────
  smith: (index: number) => `smith_${index}` as const,
  leather: (index: number) => `leather_${index}` as const,
  jewel: (index: number) => `jewel_${index}` as const,
  tool: (index: number) => `tool_${index}` as const,

  // ── Thieving ──────────────────────────────────────────────────────────────
  thieve: (npcId: string) => `thieve_${npcId}` as const,

  // ── Idle ──────────────────────────────────────────────────────────────────
  idle: "idle" as const,
} as const;

/** Check if an action string is a combat action */
export function isCombatAction(action: string): boolean {
  return action.startsWith("combat_") || action.startsWith("dungeon_") || action === "tower" || action.startsWith("trial_");
}

/** Check if an action string is a gathering skill action */
export function isGatheringAction(action: string): boolean {
  return ["woodcutting_", "mining_", "smelting_", "fishing_", "hunting_", "crafting_", "agility_", "exploration_"].some(p => action.startsWith(p));
}

/** Check if an action string is a production skill action */
export function isProductionAction(action: string): boolean {
  return ["smith_", "leather_", "jewel_", "tool_"].some(p => action.startsWith(p));
}

/** Generate skill prefix for resource tracking from an action string */
export function skillFromAction(action: string): string | null {
  const parts = action.split("_");
  if (parts.length >= 2) return parts[0]!;
  if (action === "tower" || action === "idle") return null;
  return null;
}
