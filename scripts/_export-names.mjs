import fs from "fs";

const atlas = JSON.parse(fs.readFileSync("D:/Idle Game/原画素材/配套文件/atlas.json", "utf-8"));

// Sort by position in atlas
atlas.icons.sort((a, b) => a.atlasY * 10 + a.atlasX - (b.atlasY * 10 + b.atlasX));

const lines = ["序号,文件名,应改为,类别,图集位置(atlasX×atlasY)"];
for (let i = 0; i < atlas.icons.length; i++) {
  const icon = atlas.icons[i];
  const seq = i + 1;
  const filename = `icon_${String(seq).padStart(3, '0')}.png`;
  const targetName = `${String(seq).padStart(3, '0')}_${icon.name}.png`;
  lines.push(`${seq},${filename},${targetName},${icon.category},${icon.atlasX}×${icon.atlasY}`);
}

fs.writeFileSync("D:/Idle Game/原画素材/rename_map.csv", "\ufeff" + lines.join("\n"), "utf-8");
console.log(`CSV saved: rename_map.csv (${atlas.icons.length} rows)`);
