import sharp from "sharp";
import fs from "fs";
import path from "path";

const atlasPath = "D:/Idle Game/原画素材/配套文件/atlas.json";
const tilesDir = "D:/Idle Game/原画素材/tiles";
const outDir = "D:/Idle Game/原画素材/atlases";

async function main() {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const atlas = JSON.parse(fs.readFileSync(atlasPath, "utf-8"));
  atlas.icons.sort((a: any, b: any) => a.atlasY * 10 + a.atlasX - (b.atlasY * 10 + b.atlasX));

  // Group by category
  const groups: Record<string, any[]> = {};
  for (const icon of atlas.icons) {
    if (!groups[icon.category]) groups[icon.category] = [];
    groups[icon.category].push(icon);
  }

  // Get max cell size from tiles
  let cellSize = 0;
  const testFile = fs.readdirSync(tilesDir).find(f => f.endsWith('.png'));
  if (testFile) {
    const s = await sharp(path.join(tilesDir, testFile)).metadata();
    cellSize = Math.max(s.width, s.height);
  }

  for (const [category, icons] of Object.entries(groups)) {
    const COLS = Math.min(icons.length, 10);
    const ROWS = Math.ceil(icons.length / COLS);
    
    const composites = [];
    for (let i = 0; i < icons.length; i++) {
      const seq = atlas.icons.indexOf(icons[i]) + 1;
      const name = `${String(seq).padStart(3, '0')}_${icons[i].name}.png`;
      const fpath = path.join(tilesDir, name);
      if (fs.existsSync(fpath)) {
        composites.push({
          input: fpath,
          left: (i % COLS) * cellSize,
          top: Math.floor(i / COLS) * cellSize,
        });
      }
    }

    const outPath = path.join(outDir, `${category}.png`);
    await sharp({
      create: { width: COLS * cellSize, height: ROWS * cellSize, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
    }).composite(composites).png().toFile(outPath);

    console.log(`${category}: ${icons.length} icons → ${outPath} (${COLS}×${ROWS})`);
  }
}

main().catch(console.error);
