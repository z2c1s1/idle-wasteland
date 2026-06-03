import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "shared/game-data.ts"), "utf8");
const lines = src.split("\n");

const chunks = [
  { file: "rarity-equipment.ts", start: 1, end: 878 },
  { file: "items-crafting.ts", start: 879, end: 1378 },
  { file: "combat-world.ts", start: 1379, end: 1667 },
  { file: "skills-meta.ts", start: 1668, end: lines.length },
];

const outDir = join(root, "shared/game-data");
mkdirSync(outDir, { recursive: true });

for (const { file, start, end } of chunks) {
  const body = lines.slice(start - 1, end).join("\n");
  writeFileSync(join(outDir, file), body + "\n", "utf8");
}

const index = `/** Barrel: split from legacy game-data.ts */
export * from "./rarity-equipment";
export * from "./items-crafting";
export * from "./combat-world";
export * from "./skills-meta";
`;

writeFileSync(join(outDir, "index.ts"), index, "utf8");
console.log("Split game-data into", outDir);
