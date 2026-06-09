import sharp from "sharp";
import fs from "fs";

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

  // Just 001 on checkerboard at full size
  const icon = await sharp("D:/Idle Game/原画素材/tiles/001.png").toBuffer();
  await sharp(checkerBg)
    .composite([{ input: icon }])
    .png()
    .toFile("D:/Idle Game/原画素材/checker/001.png");

  console.log("Checker/001.png updated with 92% scale version");
}

main().catch(console.error);
