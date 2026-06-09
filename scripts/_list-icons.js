const fs = require('fs');
const path = require('path');
const atlasPath = path.resolve('D:/Idle Game/原画素材/配套文件/atlas.json');
const atlas = JSON.parse(fs.readFileSync(atlasPath, 'utf-8'));

atlas.icons.sort((a, b) => a.atlasY * 10 + a.atlasX - (b.atlasY * 10 + b.atlasX));

for (let r = 0; r < 11; r++) {
  const row = atlas.icons.filter(i => i.atlasY === r);
  console.log('第' + (r+1) + '行：' + row.map(i => i.name).join(' '));
}
