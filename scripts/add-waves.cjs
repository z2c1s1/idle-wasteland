var f=require('fs');
var g=f.readFileSync('shared/game-data.ts','utf8');

// Wave templates for each dungeon theme
var waves = {
  shadow_maze: [
    '迷途幽魂','👻',0.2,0.4,'暗影触手','🦑',0.3,0.5,'迷宫蜘蛛','🕷️',0.4,0.6,'黑暗幽灵','👻',0.5,0.7,
    '迷宫哨兵','🗿',0.6,0.8,'暗影刺客','🗡️',0.65,0.9,'幽魂护卫','👤',0.7,1.0,'迷宫巨虫','🪱',0.75,1.1,
    '暗影法师','🧙',0.82,1.15,'迷宫领主','👑',0.95,1.25
  ],
  flame_sanctum: [
    '火焰小鬼','👿',0.25,0.45,'熔岩蜗牛','🐌',0.35,0.55,'火焰蜥蜴','🦎',0.45,0.65,'熔岩傀儡','🗿',0.55,0.75,
    '炎蛇','🐍',0.65,0.85,'烈火精灵','🔥',0.7,0.95,'火焰巨魔','👹',0.78,1.05,'熔岩元素','🪨',0.82,1.12,
    '炎核信徒','🧟',0.88,1.18,'神殿狂战士','💢',0.95,1.3
  ],
  void_fortress: [
    '虚空蠕虫','🐛',0.3,0.5,'虚空蝙蝠','🦇',0.4,0.6,'虚空哨兵','👁️',0.5,0.7,'虚空蜘蛛','🕷️',0.6,0.8,
    '虚空卫士','🛡️',0.68,0.9,'虚空刺客','🗡️',0.74,1.0,'虚空术士','🧙',0.8,1.1,'虚空巨兽','🦣',0.85,1.15,
    '虚空骑士','⚔️',0.9,1.22,'虚空守护者','🛡️',0.96,1.3
  ],
  dragon_tomb: [
    '幼龙','🐉',0.35,0.55,'龙骨战士','💀',0.45,0.65,'龙血蠕虫','🐛',0.55,0.75,'龙墓守卫','🗿',0.62,0.85,
    '龙魂幻影','👻',0.7,0.95,'远古龙卫','🛡️',0.75,1.05,'龙火元素','🔥',0.82,1.12,'龙骨巨兽','🦴',0.86,1.18,
    '龙祭司','🧙',0.92,1.24,'龙王守卫','⚔️',0.97,1.32
  ],
  chaos_forge: [
    '混沌火苗','🔥',0.38,0.58,'熔炉傀儡','🗿',0.48,0.68,'混沌蝙蝠','🦇',0.56,0.78,'锻造恶魔','👿',0.64,0.88,
    '熔岩卫士','🛡️',0.72,0.98,'混沌刺客','🗡️',0.78,1.08,'熔炉元素','🪨',0.84,1.14,'混沌巨兽','🦣',0.88,1.2,
    '熔炉祭司','🧙',0.93,1.26,'混沌守卫','🛡️',0.98,1.35
  ]
};

function makeWaves(name, emoji, hpMul, atkMul) {
  var arr=[];
  for(var i=0;i<arguments.length;i+=4) arr.push(`{ name:'${arguments[i]}', emoji:'${arguments[i+1]}', hpMul:${arguments[i+2]}, atkMul:${arguments[i+3]} }`);
  return arr.join(',');
}

// Replace each dungeon's dropChance line followed by the closing brace
var dungeons = ['shadow_maze','flame_sanctum','void_fortress','dragon_tomb','chaos_forge'];
dungeons.forEach(k=>{
  var w=waves[k];
  var waveStr = '\n    waves: [\n      ' + makeWaves(...w) + '\n    ],\n  }';
  // Find "dropChance: X.X,\n  }" and replace
  g=g.replace(new RegExp(`(dropChance: [\\d.]+,\\n)  \\}`), '$1' + waveStr);
});

f.writeFileSync('shared/game-data.ts',g);
console.log('waves added');
