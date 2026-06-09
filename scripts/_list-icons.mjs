import fs from 'fs';

const atlas = JSON.parse(fs.readFileSync('D:/Idle Game/原画素材/配套文件/atlas.json', 'utf-8'));
atlas.icons.sort((a, b) => a.atlasY * 10 + a.atlasX - (b.atlasY * 10 + b.atlasX));

for (let r = 0; r < 11; r++) {
  const row = atlas.icons.filter(i => i.atlasY === r);
  console.log('第' + (r+1) + '行：' + row.map(i => i.name).join(' '));
}

// Full list
console.log('\n=== 完整105个（左→右，上→下）===\n');
console.log(atlas.icons.map((i, idx) => (idx+1) + '. ' + i.name).join('\n'));
