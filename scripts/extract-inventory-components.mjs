import fs from "fs";
import path from "path";

const root = path.resolve(import.meta.dirname, "..");
const invPath = path.join(root, "client/src/pages/inventory.tsx");
const lines = fs.readFileSync(invPath, "utf8").split(/\r?\n/);

const affixLines = lines.slice(18, 49);
const itemCardLines = lines.slice(50, 324);
const compareLines = lines.slice(820, 842);

const affixFile = `import { AFFIX_LABEL, AFFIX_COLOR } from "@shared/game-data";

${affixLines.join("\n").replace("function AffixRow", "export function AffixRow")}
`;

const itemCardFile = `import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import {
  SLOT_LABEL, RARITY_COLOR, RARITY_BORDER, RARITY_BG, RARITY_LABEL,
  GEM_EMOJI, SKILL_EMOJI, SKILL_COLOR,
  ITEM_SETS, UNIQUE_ITEMS,
  getGemName, getGemBgClass,
  type GameItem, type GemType,
} from "@shared/game-data";
import { AffixRow } from "./affix-row";

${itemCardLines.join("\n").replace("function ItemCard", "export function ItemCard")}

${compareLines.join("\n")}
`;

const outDir = path.join(root, "client/src/components/inventory");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "affix-row.tsx"), affixFile);
fs.writeFileSync(path.join(outDir, "item-card.tsx"), itemCardFile);

const out = [...lines];
out.splice(819, 23);
out.splice(18, 306);
fs.writeFileSync(invPath, out.join("\n"));
console.log("extracted; inventory lines:", out.length);
