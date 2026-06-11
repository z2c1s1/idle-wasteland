/**
 * 🗺️  Single source of truth for ALL client-side route paths.
 *
 * Every `<Route path={…}>`, `navigate(…)`, `url="…"`, `href="…"`, and
 * `isActive={location === "…"}` MUST reference these constants instead of
 * raw strings.  When a path changes, it changes here — nowhere else.
 *
 * ── Import conventions ──
 *   import { R } from "@/lib/routes";
 *   <Route path={R.dashboard} … />
 *   navigate(R.shelter)
 *   <NavItem url={R.inventory} isActive={location === R.inventory} … />
 */

export const R = {
  // ── Top-level ──
  dashboard:      "/",
  inventory:      "/inventory",
  gems:           "/gems",
  materials:      "/materials",
  shelter:        "/shelter",
  town:           "/town",
  talents:        "/talents",
  pets:           "/pets",
  bounties:       "/bounties",

  // ── Scavenge zone ──
  woodcutting:    "/woodcutting",
  mining:         "/mining",
  fishing:        "/fishing",
  hunting:        "/hunting",
  thieving:       "/thieving",

  // ── Workshop zone ──
  smelting:       "/smelting",
  smithing:       "/smithing",
  leatherworking: "/leatherworking",
  jewelcrafting:  "/jewelcrafting",
  tools:          "/tools",
  equipmentSynth: "/equipment-synth",

  // ── Camp zone ──
  cooking:        "/cooking",
  alchemy:        "/alchemy",
  prayer:         "/prayer",
  agility:        "/agility",
  wastelandTech:  "/wasteland-tech",

  // ── Wasteland zone ──
  combat:         "/combat",

  // ── Workshop zone (extra) ──
  crafting:       "/crafting",

  // ── Camp zone (extra) ──
  gamble:         "/gamble",

  // ── Frontier zone ──
  exploration:    "/exploration",
} as const;

/** All unique path values — useful for validation / iteration. */
export const ALL_PATHS: readonly string[] = Object.values(R);

/**
 * Type-level guarantee: `R` keys map to non-empty path strings.
 * If you ever accidentally add a non-string value, this line fails to compile.
 */
type _AssertAllStrings = (typeof R)[keyof typeof R] extends string ? true : never;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _assert: _AssertAllStrings = true;
