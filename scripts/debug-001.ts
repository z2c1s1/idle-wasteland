import sharp from "sharp";

const SIZE = 72;

async function main() {
  const checkerBuf = Buffer.alloc(SIZE * SIZE * 4);
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const i = (y * SIZE + x) * 4;
      const bright = (Math.floor(x/9) + Math.floor(y/9)) % 2 === 0;
      checkerBuf[i] = bright ? 180 : 100;
      checkerBuf[i+1] = bright ? 180 : 100;
      checkerBuf[i+2] = bright ? 180 : 100;
      checkerBuf[i+3] = 255;
    }
  }
  const checkerBg = await sharp(checkerBuf, { raw: { width: SIZE, height: SIZE, channels: 4 } }).png().toBuffer();

  const scales = [0.85, 0.88, 0.90, 0.92, 0.95];
  for (const s of scales) {
    const dim = Math.round(SIZE * s);
    const icon = await sharp("D:/Idle Game/原画素材/tiles/001.png")
      .resize(dim, dim, { kernel: 'lanczos3' })
      .toBuffer();
    const pad = Math.floor((SIZE - dim) / 2);
    await sharp(checkerBg)
      .composite([{ input: icon, left: pad, top: pad }])
      .png()
      .toFile(`D:/Idle Game/原画素材/checker/001_s${Math.round(s*100)}.png`);
  }
  console.log("Generated scale variants: 85, 88, 90, 92, 95");
}

main().catch(console.error);
