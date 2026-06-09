import sharp from "sharp";
import fs from "fs";
import path from "path";

const inputPath = "D:/Idle Game/原画素材/ChatGPT Image 2026年6月7日 16_37_28.png";
const outDir = "D:/Idle Game/原画素材/tiles";

async function main() {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const meta = await sharp(inputPath).metadata();
  const W = meta.width;
  const H = meta.height;

  // Read entire image as raw RGBA
  const raw = await sharp(inputPath).raw().toBuffer();

  // Step 1: Create a binary mask (transparent vs non-transparent)
  const mask = new Uint8Array(W * H);
  for (let i = 0; i < raw.length; i += 4) {
    mask[i / 4] = raw[i + 3] > 30 ? 1 : 0; // alpha threshold
  }

  // Step 2: Flood-fill to find connected components
  const visited = new Uint8Array(W * H);
  const clusters: { minX: number; minY: number; maxX: number; maxY: number; pixelCount: number }[] = [];

  function flood(startX: number, startY: number) {
    const stack: [number, number][] = [[startX, startY]];
    let minX = startX, minY = startY, maxX = startX, maxY = startY;
    let count = 0;

    while (stack.length > 0) {
      const [x, y] = stack.pop()!;
      const idx = y * W + x;
      if (x < 0 || x >= W || y < 0 || y >= H || visited[idx] || !mask[idx]) continue;
      visited[idx] = 1;
      count++;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
      // Check 8 neighbors
      stack.push([x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1],
                 [x - 1, y - 1], [x + 1, y - 1], [x - 1, y + 1], [x + 1, y + 1]);
    }

    return { minX, minY, maxX, maxY, pixelCount: count };
  }

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const idx = y * W + x;
      if (mask[idx] && !visited[idx]) {
        const cluster = flood(x, y);
        // Filter out tiny noise (less than 50 pixels)
        if (cluster.pixelCount > 50) {
          clusters.push(cluster);
        }
      }
    }
  }

  console.log(`Found ${clusters.length} icon clusters`);

  // Sort clusters: top-to-bottom, then left-to-right
  clusters.sort((a, b) => {
    // Group by row (use minY with some tolerance)
    const rowA = Math.floor(a.minY / 20);
    const rowB = Math.floor(b.minY / 20);
    if (rowA !== rowB) return rowA - rowB;
    return a.minX - b.minX;
  });

  // Extract and save each cluster as 32×32 icon
  for (let i = 0; i < Math.min(clusters.length, 150); i++) {
    const c = clusters[i];
    const pad = 4;
    const ex = Math.max(0, c.minX - pad);
    const ey = Math.max(0, c.minY - pad);
    const ew = Math.min(W - ex, (c.maxX - c.minX + 1) + pad * 2);
    const eh = Math.min(H - ey, (c.maxY - c.minY + 1) + pad * 2);

    const icon = await sharp(inputPath)
      .extract({ left: ex, top: ey, width: ew, height: eh })
      .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();

    const fname = path.join(outDir, `${String(i + 1).padStart(3, '0')}.png`);
    fs.writeFileSync(fname, icon);

    if (i < 5 || i >= clusters.length - 5) {
      console.log(`  Icon ${i + 1}: (${c.minX},${c.minY})-(${c.maxX},${c.maxY}) size ${c.maxX-c.minX+1}×${c.maxY-c.minY+1} pixels=${c.pixelCount}`);
    }
  }

  // Build atlas from first 105 (or as many as we have)
  const count = Math.min(clusters.length, 105);
  const composites = [];
  for (let i = 0; i < count; i++) {
    const fname = path.join(outDir, `${String(i + 1).padStart(3, '0')}.png`);
    if (!fs.existsSync(fname)) continue;
    const r = Math.floor(i / 10);
    const c = i % 10;
    composites.push({ input: fname, left: c * 32, top: r * 32 });
  }

  const atlasOut = "D:/Idle Game/原画素材/wasteland_icons.png";
  const atlasRows = Math.ceil(count / 10);
  await sharp({
    create: { width: 320, height: atlasRows * 32, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
  })
    .composite(composites)
    .png()
    .toFile(atlasOut);

  console.log(`\nAtlas: ${atlasOut} (320×${atlasRows * 32})`);
  console.log(`Total icons in atlas: ${count}`);

  // Print cluster positions as a visual map
  console.log(`\nCluster positions (row groups):`);
  let lastY = -100;
  for (let i = 0; i < Math.min(clusters.length, 150); i++) {
    const c = clusters[i];
    if (c.minY - lastY > 30) console.log('--- new row ---');
    lastY = c.minY;
    console.log(`  [${i+1}] x=${c.minX} y=${c.minY} size=${c.maxX-c.minX+1}×${c.maxY-c.minY+1}`);
  }
}

main().catch(console.error);
