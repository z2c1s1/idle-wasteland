import sharp from "sharp";
import fs from "fs";
import path from "path";

// Extract all visible tiles with grid coordinates as filenames
const inputPath = "D:/Idle Game/原画素材/ChatGPT Image 2026年6月7日 16_26_14.png";
const ICON = 32;
const outDir = "D:/Idle Game/原画素材/tiles";

async function main() {
  const meta = await sharp(inputPath).metadata();
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const COLS = Math.floor(meta.width! / ICON);
  const ROWS = Math.floor(meta.height! / ICON);

  let count = 0;
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const buf = await sharp(inputPath).extract({ left: col*ICON, top: row*ICON, width: ICON, height: ICON }).raw().toBuffer();
      let a = 0;
      for (let i = 3; i < buf.length; i += 4) a += buf[i];
      if (a / (ICON*ICON) < 10) continue; // skip transparent

      const tile = sharp(inputPath).extract({ left: col*ICON, top: row*ICON, width: ICON, height: ICON });
      const png = await tile.png().toBuffer();
      const filename = `r${String(row).padStart(2,'0')}_c${String(col).padStart(2,'0')}.png`;
      fs.writeFileSync(path.join(outDir, filename), png);
      count++;
    }
  }
  console.log(`Extracted ${count} visible tiles to ${outDir}/`);
  console.log(`Filenames: r{row}_c{col}.png (row, col = grid position)`);

  // Also create a reference grid HTML
  let html = '<html><body style="background:#111;color:#fff;font-family:monospace"><h3>Grid r00_c00 is top-left</h3><table>';
  for (let row = 0; row < ROWS; row++) {
    html += '<tr>';
    for (let col = 0; col < COLS; col++) {
      const fname = `r${String(row).padStart(2,'0')}_c${String(col).padStart(2,'0')}.png`;
      const fpath = path.join(outDir, fname);
      if (fs.existsSync(fpath)) {
        html += `<td style="border:1px solid #333;width:32px;height:32px"><img src="tiles/${fname}" width="32" height="32" title="r${row}c${col}"></td>`;
      } else {
        html += '<td style="border:1px solid #111;width:32px;height:32px"></td>';
      }
    }
    html += '</tr>';
  }
  html += '</table></body></html>';
  fs.writeFileSync("D:/Idle Game/原画素材/grid-map.html", html);
  console.log(`Grid map: D:/Idle Game/原画素材/grid-map.html`);
}

main().catch(console.error);
