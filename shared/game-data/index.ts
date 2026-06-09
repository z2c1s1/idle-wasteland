/** Barrel: split from legacy game-data.ts */
export * from "./rarity-equipment";
export * from "./items-crafting";
export * from "./combat-world";
export * from "./skills-meta";
export * from "./prayers";

// NOTE: skills-meta.ts exports THIEVING_NPCS which conflicts with game-data.ts version.
// TypeScript resolves @shared/game-data to the .ts file, so skills-meta version is dead code.
