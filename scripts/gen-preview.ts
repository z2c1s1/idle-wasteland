import { writeFileSync } from "fs";
import { ENEMY_PIXELS, ARCHETYPE_PIXEL_COLORS, EQUIPMENT_PIXELS, ITEM_COLORS, SKILL_PIXELS, RESOURCE_PIXELS, GEM_PIXEL } from "../client/src/components/sprites/spriteData";

function g(p: number[][], cs: number, c: string[]): string {
  let s = `<svg viewBox="0 0 ${16*cs} ${16*cs}" width="${16*cs}" height="${16*cs}" shapeRendering="crispEdges">`;
  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
    const i = p[y]?.[x] ?? 0;
    if (i) s += `<rect x="${x*cs}" y="${y*cs}" width="${cs}" height="${cs}" fill="${c[i] || c[1]!}" />`;
  }
  return s + "</svg>";
}
function pc2a(pc: any) { return ["#000","#000", pc.dark, pc.main, pc.light, pc.highlight, pc.eye] as string[]; }
function cc(l: string, s: string) {
  return `<div style="display:inline-block;margin:6px;padding:10px;background:#1a1a2e;border:1px solid #333;border-radius:8px;text-align:center;width:130px"><div style="height:90px;display:flex;align-items:center;justify-content:center">${s}</div><div style="color:#aaa;font-size:10px;margin-top:4px">${l}</div></div>`;
}

let h = `<!DOCTYPE html><html><head><meta charset=utf-8><style>body{background:#0a0a14;color:#eee;font-family:monospace;padding:20px}h2{color:#ff0;border-bottom:1px solid #333}</style></head><body>`;

h += "<h2>🧟 Enemies 16×16</h2><div>";
for (const [k, v] of Object.entries(ENEMY_PIXELS)) {
  const pc = ARCHETYPE_PIXEL_COLORS[k];
  if (!pc) continue;
  h += cc(k, g(v, 2, pc2a(pc)));
}
h += "</div>";

h += "<h2>⚔️ Equipment 16×16</h2><div>";
const tc = pc2a(ITEM_COLORS[3]!);
for (const [k, v] of Object.entries(EQUIPMENT_PIXELS)) h += cc(k, g(v, 2, tc));
h += "</div>";

h += "<h2>💎 Gems 16×16</h2><div>";
const gems: [string,string[]][] = [
  ["Ruby",     ["#000","#000","#600","#c00","#f44","#f88","#fcc"]],
  ["Sapphire", ["#000","#000","#006","#00c","#44f","#88f","#ccf"]],
  ["Emerald",  ["#000","#000","#060","#0c0","#4f4","#8f8","#cfc"]],
  ["Diamond",  ["#000","#000","#666","#aaa","#ccc","#eee","#fff"]],
  ["Amethyst", ["#000","#000","#506","#80c","#c4f","#e8f","#fcf"]],
];
for (const [nm, cl] of gems) h += cc(nm, g(GEM_PIXEL, 2, cl));
h += "</div>";

h += "<h2>🎯 Skills 16×16</h2><div>";
const sc = ["#000","#000","#050","#0a0","#0f0","#5f5","#afa"];
for (const [k, v] of Object.entries(SKILL_PIXELS)) h += cc(k, g(v, 2, sc));
h += "</div>";

h += "<h2>📦 Resources 16×16</h2><div>";
const rc = ["#000","#000","#630","#a50","#fd0","#fe8","#ffc"];
for (const [k, v] of Object.entries(RESOURCE_PIXELS)) h += cc(k, g(v, 2, rc));
h += "</div>";

h += "</body></html>";
writeFileSync("sprite-preview.html", h);
console.log("Written", h.length, "bytes");
