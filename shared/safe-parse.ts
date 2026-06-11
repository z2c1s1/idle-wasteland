/**
 * 🛡️  Safe JSON.parse wrapper — prevents SyntaxError crashes from corrupt data.
 *
 * Usage:
 *   import { safeJsonParse } from "@shared/safe-parse";
 *   const obj = safeJsonParse(state.equipment, {} as EquipmentState);
 *   const arr = safeJsonParse(state.lootBag, [] as GameItem[]);
 *
 * On parse failure, logs a warning and returns the fallback value.
 * This means corrupt JSON fields never crash the server or the UI.
 */

export function safeJsonParse<T>(raw: string | null | undefined, fallback: T): T {
  if (raw == null || raw === "") return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    // Truncate the raw string for logging (avoid flooding logs)
    const preview = raw.length > 80 ? raw.slice(0, 80) + "..." : raw;
    console.warn(`[safeJsonParse] Corrupt JSON, using fallback. Preview: ${preview}`);
    return fallback;
  }
}

/**
 * Parse a JSON string that should be a Record<string, number>.
 * Convenience wrapper for the most common case.
 */
export function safeJsonRecord(raw: string | null | undefined): Record<string, number> {
  return safeJsonParse<Record<string, number>>(raw, {});
}

/**
 * Parse a JSON string that should be an array.
 * Convenience wrapper for the most common case.
 */
export function safeJsonArray<T = unknown>(raw: string | null | undefined): T[] {
  return safeJsonParse<T[]>(raw, []);
}
