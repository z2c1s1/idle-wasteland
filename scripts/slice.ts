import sharp from "sharp";
import fs from "fs";
import path from "path";

const srcDir = "D:/Idle Game/原画素材/切图";
const outDir = "D:/Idle Game/原画素材/tiles";

async function main() {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // Read actual files from 切图/ — user has renamed them
  const files = fs.readdirSync(srcDir)
    .filter(f => f.endsWith('.png'))
    .sort();

  console.log(`Found ${files.length} files in 切图/`);
  console.log(`First: ${files[0]}, Last: ${files[files.length-1]}`);

  const atlas = JSON.parse(fs.readFileSync("D:/Idle Game/原画素材/配套文件/atlas.json", "utf-8"));
  atlas.icons.sort((a: any, b: any) => a.atlasY * 10 + a.atlasX - (b.atlasY * 10 + b.atlasX));

  // Process each file
  const processed: string[] = [];
  for (const filename of files) {
    const srcPath = path.join(srcDir, filename);
    const srcMeta = await sharp(srcPath).metadata();
    
    // Aggressive background removal: keep only dark/saturated pixels (the icon)
    const raw = await sharp(srcPath).ensureAlpha().raw().toBuffer();
    for (let i = 0; i < raw.length; i += 4) {
      const r = raw[i], g = raw[i+1], b = raw[i+2];
      const brightness = (r + g + b) / 3;
      const saturation = Math.max(r,g,b) - Math.min(r,g,b);
      
      // Remove if too bright (likely background/checkerboard)
      if (brightness > 230) { raw[i+3] = 0; continue; }
      // Remove if low saturation AND medium brightness (checkerboard gray)
      if (saturation < 20 && brightness > 60 && brightness < 230) { raw[i+3] = 0; continue; }
      // Make remaining content fully opaque
      if (raw[i+3] > 10) raw[i+3] = 255;
    }
    const cleaned = await sharp(raw, { raw: { width: srcMeta.width, height: srcMeta.height, channels: 4 } }).png().toBuffer();
    
    // Trim transparent edges
    const trimmed = await sharp(cleaned).trim({ threshold: 3 }).toBuffer();
    fs.writeFileSync(path.join(outDir, filename), trimmed);
    processed.push(filename);
  }

  console.log(`${processed.length} icons processed to tiles/ (original size)`);

  // Find max dimensions — use square cell
  let maxDim = 0;
  for (const f of processed) {
    const s = await sharp(path.join(outDir, f)).metadata();
    if (s.width > maxDim) maxDim = s.width;
    if (s.height > maxDim) maxDim = s.height;
  }
  console.log(`Cell size: ${maxDim}×${maxDim}`);

  // Pad all to max dimensions with transparent background, centered
  for (const f of processed) {
    const s = await sharp(path.join(outDir, f)).metadata();
    const padL = Math.floor((maxDim - s.width) / 2);
    const padR = maxDim - s.width - padL;
    const padT = Math.floor((maxDim - s.height) / 2);
    const padB = maxDim - s.height - padT;
    const padded = await sharp(path.join(outDir, f))
      .extend({ top: padT, bottom: padB, left: padL, right: padR, background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png().toBuffer();
    fs.writeFileSync(path.join(outDir, f), padded);
  }

  // Build atlas
  const composites = [];
  for (let i = 0; i < atlas.icons.length; i++) {
    const icon = atlas.icons[i];
    const name = `${String(i + 1).padStart(3, '0')}_${icon.name}.png`;
    const fpath = path.join(outDir, name);
    if (fs.existsSync(fpath)) {
      composites.push({ input: fpath, left: (i % 10) * maxDim, top: Math.floor(i / 10) * maxDim });
    }
  }

  const atlasOut = "D:/Idle Game/原画素材/wasteland_icons.png";
  const atlasRows = Math.ceil(atlas.icons.length / 10);
  await sharp({
    create: { width: 10 * maxDim, height: atlasRows * maxDim, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
  }).composite(composites).png().toFile(atlasOut);

  console.log(`Atlas: ${atlasOut} (${10 * maxDim}×${atlasRows * maxDim}), cell: ${maxDim}×${maxDim}`);
}

main().catch(console.error);
