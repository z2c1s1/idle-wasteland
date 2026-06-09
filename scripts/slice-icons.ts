import sharp from "sharp";
import fs from "fs";
import path from "path";

const inputPath = "D:/Idle Game/原画素材/ChatGPT Image 2026年6月7日 16_37_28.png";
const outDir = "D:/Idle Game/原画素材/tiles";
const ICON = 32;

async function main() {
  const meta = await sharp(inputPath).metadata();
  const W = meta.width;
  const H = meta.height;
  
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // Strategy: find a 10×11 block where ALL tiles have significant content
  // Scan with step=1px to find exact grid alignment
  
  let bestOx = 0, bestOy = 0, bestFilled = 0;
  
  for (let ox = 0; ox <= W - 10*ICON; ox += 4) {
    for (let oy = 0; oy <= H - 11*ICON; oy += 4) {
      let filled = 0;
      // Check all 4 corners + center
      const checks = [
        [0,0], [9,0], [0,10], [9,10], [4,5]
      ];
      let allOk = true;
      for (const [cx, cy] of checks) {
        const x = ox + cx * ICON;
        const y = oy + cy * ICON;
        const buf = await sharp(inputPath).extract({ left: x, top: y, width: ICON, height: ICON }).raw().toBuffer();
        let a = 0;
        for (let i = 3; i < buf.length; i += 4) a += buf[i];
        if (a / (ICON*ICON) < 15) { allOk = false; break; }
      }
      if (allOk) {
        // Full check
        filled = 0;
        for (let r = 0; r < 11; r++) {
          for (let c = 0; c < 10; c++) {
            const x = ox + c * ICON;
            const y = oy + r * ICON;
            const buf = await sharp(inputPath).extract({ left: x, top: y, width: ICON, height: ICON }).raw().toBuffer();
            let a = 0;
            for (let i = 3; i < buf.length; i += 4) a += buf[i];
            if (a / (ICON*ICON) > 10) filled++;
          }
        }
        if (filled >= 105) {
          console.log(`Found perfect grid at (${ox},${oy}): ${filled}/105 filled`);
          bestOx = ox;
          bestOy = oy;
          bestFilled = filled;
          break;
        } else if (filled > bestFilled) {
          bestOx = ox;
          bestOy = oy;
          bestFilled = filled;
        }
      }
    }
    if (bestFilled >= 105) break;
  }

  console.log(`\nBest: (${bestOx},${bestOy}) with ${bestFilled}/105 filled`);

  if (bestFilled < 100) {
    console.log("⚠ Grid not found cleanly. Extracting best match anyway...");
  }

  // Extract using best origin
  for (let r = 0; r < 11; r++) {
    for (let c = 0; c < 10; c++) {
      const x = bestOx + c * ICON;
      const y = bestOy + r * ICON;
      const idx = r * 10 + c + 1;
      const tile = sharp(inputPath).extract({ left: x, top: y, width: ICON, height: ICON });
      const buf = await tile.png().toBuffer();
      fs.writeFileSync(path.join(outDir, `${String(idx).padStart(3,'0')}.png`), buf);
    }
  }

  // Build atlas
  const composites = [];
  for (let r = 0; r < 11; r++) {
    for (let c = 0; c < 10; c++) {
      const idx = r * 10 + c + 1;
      composites.push({
        input: path.join(outDir, `${String(idx).padStart(3,'0')}.png`),
        left: c * ICON,
        top: r * ICON,
      });
    }
  }

  const atlasOut = "D:/Idle Game/原画素材/wasteland_icons.png";
  await sharp({ create: { width: 320, height: 352, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite(composites)
    .png()
    .toFile(atlasOut);

  console.log(`Atlas: ${atlasOut}`);
  console.log(`Check first 3: tiles/001.png (废木板), tiles/011.png (废铁块), tiles/021.png (辐射蝌蚪)`);
}

main().catch(console.error);
