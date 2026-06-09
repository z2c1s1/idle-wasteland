import sharp from "sharp";

const inputPath = "D:/Idle Game/原画素材/ChatGPT Image 2026年6月7日 16_37_28.png";

(async () => {
  const meta = await sharp(inputPath).metadata();
  const w = meta.width;
  const h = meta.height;
  console.log(`Size: ${w}×${h}, hasAlpha: ${meta.hasAlpha}`);
  
  if (w === 320 && h === 352) {
    console.log("✓ PERFECT MATCH! 320×352 = 10×11 grid of 32px icons");
    console.log("Proceed to slice...");
  } else {
    const cols = Math.floor(w / 32);
    const rows = Math.floor(h / 32);
    console.log(`Grid: ${cols}×${rows} = ${cols*rows} tiles`);
  }
})();
