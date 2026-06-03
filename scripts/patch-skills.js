// Restructure: ItemSkill gets chance + magnitude, add 8 new skills
const fs=require('fs');
let g=fs.readFileSync('shared/game-data.ts','utf8');

// 1. Update ItemSkill interface
g=g.replace(
  'export interface ItemSkill {\n  type: SkillType;\n  name: string;\n  value: number;\n  description: string;\n}',
  'export interface ItemSkill {\n  type: SkillType;\n  name: string;\n  chance: number;\n  magnitude: number;\n  description: string;\n}'
);

// 2. Expand SkillType
g=g.replace(
  "| 'meteor' | 'chain_lightning' | 'frost_nova' | 'blood_sacrifice' | 'shadow_clone' | 'divine_shield' | 'execute' | 'avalanche';",
  "| 'meteor' | 'chain_lightning' | 'frost_nova' | 'blood_sacrifice' | 'shadow_clone' | 'divine_shield' | 'execute' | 'avalanche'\n  | 'cleave' | 'corpse_explosion' | 'iron_maiden' | 'mortal_strike' | 'reincarnation' | 'frenzy' | 'arcane_barrage' | 'last_stand';"
);

// 3. Add emoji + color for new skills
g=g.replace(
  "  execute: 'text-red-500', avalanche: 'text-blue-200',\n};",
  "  execute: 'text-red-500', avalanche: 'text-blue-200',\n  cleave: 'text-red-300', corpse_explosion: 'text-green-400', iron_maiden: 'text-purple-300',\n  mortal_strike: 'text-red-400', reincarnation: 'text-yellow-300', frenzy: 'text-orange-400',\n  arcane_barrage: 'text-blue-400', last_stand: 'text-cyan-400',\n};"
);
g=g.replace(
  "  execute: '💀', avalanche: '🏔️',\n};",
  "  execute: '💀', avalanche: '🏔️',\n  cleave: '🪓', corpse_explosion: '💥', iron_maiden: '⛓️',\n  mortal_strike: '⚔️', reincarnation: '🔄', frenzy: '😤',\n  arcane_barrage: '🔮', last_stand: '🛡️',\n};"
);

// 4. Replace SKILL_POOL with new format (chance + magnitude)
g=g.replace(
  /const SKILL_POOL: \{ type: SkillType; name: string; minVal: number; maxVal: number; desc: \(v: number\) => string \}\[\] = \[[\s\S]*?\];/,
  `const SKILL_POOL: { type: SkillType; name: string; cMin: number; cMax: number; mMin: number; mMax: number; desc: (c: number, m: number) => string }[] = [
  { type:'lifesteal',   name:'吸血',       cMin:3,cMax:15,mMin:3,mMax:15, desc:(c,m)=>`击中时 ${c}% 概率吸取 ${m}% 伤害恢复生命` },
  { type:'thorns',      name:'荆棘',       cMin:5,cMax:25,mMin:2,mMax:20, desc:(c,m)=>`${c}% 概率在被击中时反弹 ${m} 点伤害` },
  { type:'berserk',     name:'狂战',       cMin:10,cMax:30,mMin:10,mMax:50, desc:(c,m)=>`HP<30%时攻击力提升 ${m}%` },
  { type:'doublestrike',name:'双击',       cMin:10,cMax:35,mMin:10,mMax:35, desc:(c,m)=>`${c}% 概率每回合攻击两次` },
  { type:'dodge',       name:'闪避',       cMin:5,cMax:25,mMin:5,mMax:25, desc:(c,m)=>`${c}% 概率闪避所有伤害` },
  { type:'poison',      name:'淬毒',       cMin:10,cMax:30,mMin:2,mMax:12, desc:(c,m)=>`${c}% 概率附加 ${m} 点毒素伤害` },
  { type:'spellblade',  name:'剑术',       cMin:10,cMax:30,mMin:5,mMax:30, desc:(c,m)=>`攻击力额外提升 ${m}%` },
  { type:'vampiric',    name:'嗜血',       cMin:10,cMax:30,mMin:5,mMax:20, desc:(c,m)=>`${c}% 概率击杀时恢复 ${m} 点生命` },
  { type:'skill_rank',  name:'+技能等级',  cMin:1,cMax:3,mMin:1,mMax:3, desc:(c,m)=>`所有技能等级 +${m}` },
  { type:'meteor',          name:'陨石',       cMin:1,cMax:25,mMin:100,mMax:200, desc:(c,m)=>`${c}% 概率召唤陨石造成 ${m}% 武器伤害` },
  { type:'chain_lightning', name:'连锁闪电',   cMin:1,cMax:25,mMin:50,mMax:150, desc:(c,m)=>`${c}% 概率连锁闪电造成 ${m}% 武器伤害` },
  { type:'frost_nova',      name:'冰霜新星',   cMin:1,cMax:20,mMin:1,mMax:1, desc:(c,m)=>`${c}% 概率冻结敌人1回合` },
  { type:'blood_sacrifice', name:'血祭',       cMin:5,cMax:25,mMin:5,mMax:20, desc:(c,m)=>`消耗 ${m}% HP造成等量额外伤害` },
  { type:'shadow_clone',    name:'暗影分身',   cMin:1,cMax:15,mMin:100,mMax:200, desc:(c,m)=>`${c}% 概率分身造成 ${m}% 伤害` },
  { type:'divine_shield',   name:'神圣护盾',   cMin:1,cMax:20,mMin:1,mMax:1, desc:(c,m)=>`${c}% 概率格挡1次伤害` },
  { type:'execute',         name:'处决',       cMin:1,cMax:25,mMin:1,mMax:1, desc:(c,m)=>`${c}% 概率立即击杀HP<20%敌人` },
  { type:'avalanche',       name:'雪崩',       cMin:1,cMax:20,mMin:100,mMax:200, desc:(c,m)=>`暴击时 ${c}% 概率追加 ${m}% 伤害` },
  { type:'cleave',          name:'顺劈',       cMin:1,cMax:25,mMin:50,mMax:150, desc:(c,m)=>`${c}% 概率造成 ${m}% 溅射伤害` },
  { type:'corpse_explosion',name:'尸爆',       cMin:1,cMax:20,mMin:10,mMax:50, desc:(c,m)=>`${c}% 概率尸爆造成 ${m}% 最大生命伤害` },
  { type:'iron_maiden',     name:'铁处女',     cMin:1,cMax:25,mMin:10,mMax:50, desc:(c,m)=>`${c}% 概率反弹 ${m}% 伤害` },
  { type:'mortal_strike',   name:'致死打击',   cMin:1,cMax:20,mMin:10,mMax:40, desc:(c,m)=>`${c}% 概率降低敌人 ${m}% 攻击1回合` },
  { type:'reincarnation',   name:'复生',       cMin:1,cMax:15,mMin:20,mMax:60, desc:(c,m)=>`死亡时 ${c}% 概率以 ${m}% HP复活` },
  { type:'frenzy',          name:'狂乱',       cMin:1,cMax:20,mMin:10,mMax:40, desc:(c,m)=>`${c}% 概率提升 ${m}% 攻速2回合` },
  { type:'arcane_barrage',  name:'奥术弹幕',   cMin:1,cMax:20,mMin:2,mMax:5, desc:(c,m)=>`${c}% 概率追加 ${m} 次攻击` },
  { type:'last_stand',      name:'破釜沉舟',   cMin:1,cMax:25,mMin:20,mMax:60, desc:(c,m)=>`HP<${m}%时获得 ${Math.floor(m*0.8)}% 减伤` },
];`
);

// 5. Update rollSkills to generate chance + magnitude
g=g.replace(
  'function rollSkills(rarity: Rarity): ItemSkill[] {\n  const count = RARITY_SKILL_COUNT[rarity];\n  if (count === 0) return [];\n  const pool = [...SKILL_POOL];\n  const result: ItemSkill[] = [];\n  const used = new Set<SkillType>();\n  for (let i = 0; i < count; i++) {\n    const avail = pool.filter(s => !used.has(s.type));\n    if (!avail.length) break;\n    const s = avail[Math.floor(Math.random() * avail.length)];\n    used.add(s.type);\n    const value = Math.round(s.minVal + Math.random() * (s.maxVal - s.minVal));\n    result.push({ type: s.type, name: s.name, value, description: s.desc(value) });\n  }\n  return result;\n}',
  'function rollSkills(rarity: Rarity): ItemSkill[] {\n  const count = RARITY_SKILL_COUNT[rarity];\n  if (count === 0) return [];\n  const pool = [...SKILL_POOL];\n  const result: ItemSkill[] = [];\n  const used = new Set<SkillType>();\n  for (let i = 0; i < count; i++) {\n    const avail = pool.filter(s => !used.has(s.type));\n    if (!avail.length) break;\n    const s = avail[Math.floor(Math.random() * avail.length)];\n    used.add(s.type);\n    const chance = Math.round(s.cMin + Math.random() * (s.cMax - s.cMin));\n    const magnitude = Math.round(s.mMin + Math.random() * (s.mMax - s.mMin));\n    result.push({ type: s.type, name: s.name, chance, magnitude, description: s.desc(chance, magnitude) });\n  }\n  return result;\n}'
);

// 6. Update unique items with new skill format
g=g.replace(
  "skills:[{type:'poison',name:'寒毒',value:4,description:'每次攻击追加 4 点冰毒伤害'}]",
  "skills:[{type:'poison',name:'寒毒',chance:20,magnitude:4,description:'20%概率附加4点冰毒伤害'}]"
);
g=g.replace(
  "skills:[{type:'thorns',name:'骸骨',value:10,description:'被击中时反弹 10 点伤害'}]",
  "skills:[{type:'thorns',name:'骸骨',chance:25,magnitude:10,description:'25%概率反弹10点伤害'}]"
);
g=g.replace(
  "skills:[{type:'dodge',name:'幻影',value:18,description:'18% 概率闪避所有伤害'}]",
  "skills:[{type:'dodge',name:'幻影',chance:18,magnitude:18,description:'18%概率闪避所有伤害'}]"
);
g=g.replace(
  "skills:[{type:'berserk',name:'暴怒',value:35,description:'HP < 30% 时攻击力提升 35%'}]",
  "skills:[{type:'berserk',name:'暴怒',chance:100,magnitude:35,description:'HP<30%时攻击力提升35%'}]"
);
g=g.replace(
  "skills:[{type:'poison',name:'安达里尔毒液',value:8,description:'每次攻击追加 8 点毒素伤害'}]",
  "skills:[{type:'poison',name:'安达里尔毒液',chance:30,magnitude:8,description:'30%概率附加8点毒素伤害'}]"
);
g=g.replace(
  "skills:[{type:'doublestrike',name:'影分身',value:25,description:'25% 概率每回合攻击两次'}]",
  "skills:[{type:'doublestrike',name:'影分身',chance:25,magnitude:25,description:'25%概率攻击两次'}]"
);
g=g.replace(
  "skills:[{type:'berserk',name:'巨怒',value:30,description:'HP < 30% 时攻击力提升 30%'}]",
  "skills:[{type:'berserk',name:'巨怒',chance:100,magnitude:30,description:'HP<30%时攻击力提升30%'}]"
);

fs.writeFileSync('shared/game-data.ts',g);
console.log('game-data updated');
