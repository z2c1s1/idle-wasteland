import fs from "fs";
import sharp from "sharp";

const grid: {x:number,y:number,w:number,h:number}[] = JSON.parse(
  fs.readFileSync("D:/Idle Game/原画素材/grid.json", "utf-8")
);

const SRC = process.argv[2] || "D:/Idle Game/原画素材/gloves.png";
const meta = await sharp(SRC).metadata();
console.log(`Source: ${meta.width}x${meta.height}`);

const outDir = "D:/Idle Game/原画素材/equipment_tiles";
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

let count = 0;
for (const cell of grid) {
  const { x, y, w, h } = cell;
  if (w < 8 || h < 8) continue;
  if (x + w > meta.width! || y + h > meta.height!) {
    console.log(`Cell ${count+1} out of bounds: (${x},${y}) ${w}x${h} on ${meta.width}x${meta.height}`);
    continue;
  }

  const outPath = `${outDir}/${String(count + 1).padStart(3, "0")}_cell.png`;
  
  await sharp(SRC)
    .extract({ left: x, top: y, width: w, height: h })
    .png()
    .toFile(outPath);
  
  count++;
}

console.log(`Sliced ${count} cells to ${outDir}/`);
