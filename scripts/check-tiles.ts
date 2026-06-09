import sharp from "sharp";
import fs from "fs";
import path from "path";

const inputPath = "D:/Idle Game/原画素材/ChatGPT Image 2026年6月7日 16_26_14.png";
const atlasPath = "D:/Idle Game/原画素材/配套文件/atlas.json";
const ICON = 32;

async function main() {
  const meta = await sharp(inputPath).metadata();
  const atlas = JSON.parse(fs.readFileSync(atlasPath, "utf-8"));

  // Find the first row and column with visible content
  let firstContentX = -1, firstContentY = -1;
  
  // Scan columns for first non-empty
  for (let x = 0; x < meta.width!; x += ICON) {
    // Sample middle row
    const buf = await sharp(inputPath).extract({ left: x, top: meta.height!/2, width: ICON, height: ICON }).raw().toBuffer();
    let a = 0;
    for (let i = 3; i < buf.length; i += 4) a += buf[i];
    if (a / (ICON*ICON) > 10) { firstContentX = x; break; }
  }
  
  // Scan rows for first non-empty
  for (let y = 0; y < meta.height!; y += ICON) {
    const buf = await sharp(inputPath).extract({ left: meta.width!/2, top: y, width: ICON, height: ICON }).raw().toBuffer();
    let a = 0;
    for (let i = 3; i < buf.length; i += 4) a += buf[i];
    if (a / (ICON*ICON) > 10) { firstContentY = y; break; }
  }

  console.log(`First content at column ${firstContentX/ICON} (x=${firstContentX}), row ${firstContentY/ICON} (y=${firstContentY})`);

  // Now try grid starting at firstContentX, firstContentY
  // But icons might not start exactly there - the grid may have margins
  // Try a few offsets around this area
  for (let ox of [firstContentX, firstContentX + ICON]) {
    for (let oy of [firstContentY, firstContentY + ICON]) {
      let filled = 0;
      for (let row = 0; row < 11; row++) {
        for (let col = 0; col < 10; col++) {
          const x = ox + col * ICON;
          const y = oy + row * ICON;
          if (x >= meta.width! || y >= meta.height!) continue;
          const buf = await sharp(inputPath).extract({ left: x, top: y, width: ICON, height: ICON }).raw().toBuffer();
          let a = 0;
          for (let i = 3; i < buf.length; i += 4) a += buf[i];
          if (a / (ICON*ICON) > 10) filled++;
        }
      }
      console.log(`  Origin (${ox},${oy}): ${filled}/105 filled`);
    }
  }

  // Best approach: just use (32,32) which gave 102/105
  // Extract and build atlas
  const OX = 32, OY = 32;
  const outDir = "D:/Idle Game/原画素材/tiles";
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  for (const icon of atlas.icons) {
    const x = OX + icon.atlasX * ICON;
    const y = OY + icon.atlasY * ICON;
    const tile = sharp(inputPath).extract({ left: x, top: y, width: ICON, height: ICON });
    const buf = await tile.png().toBuffer();
    fs.writeFileSync(path.join(outDir, `${icon.id}_${icon.name}.png`), buf);
  }

  // Build atlas
  const atlasW = 10 * ICON;
  const atlasH = 11 * ICON;
  const composites = atlas.icons.map(icon => ({
    input: path.join(outDir, `${icon.id}_${icon.name}.png`),
    left: icon.atlasX * ICON,
    top: icon.atlasY * ICON,
  }));

  const atlasOut = "D:/Idle Game/原画素材/wasteland_icons.png";
  await sharp({ create: { width: atlasW, height: atlasH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite(composites)
    .png()
    .toFile(atlasOut);

  console.log(`\nAtlas saved: ${atlasOut} (${atlasW}×${atlasH})`);
  console.log(`Tiles: ${outDir}/`);
}

main().catch(console.error);
