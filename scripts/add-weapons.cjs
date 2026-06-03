var f=require('fs');
var g=f.readFileSync('shared/game-data.ts','utf8');

var insertBow = [
  '  oak_bow:           { id: \'oak_bow\',           name: \'橡木弓\',   emoji: \'🏹\', slot: \'weapon\',  attackBonus: 7,  defenceBonus: 0,  ilvl: 5,  combatStyle: \'ranged\'  },',
  '  yew_bow:           { id: \'yew_bow\',           name: \'紫杉弓\',   emoji: \'🏹\', slot: \'weapon\',  attackBonus: 15, defenceBonus: 0,  ilvl: 12, combatStyle: \'ranged\'  },',
  '  maple_bow:         { id: \'maple_bow\',         name: \'枫木弓\',   emoji: \'🏹\', slot: \'weapon\',  attackBonus: 24, defenceBonus: 0,  ilvl: 20, combatStyle: \'ranged\'  },',
  '  mithril_bow:       { id: \'mithril_bow\',       name: \'秘银弓\',   emoji: \'🏹\', slot: \'weapon\',  attackBonus: 38, defenceBonus: 0,  ilvl: 32, combatStyle: \'ranged\'  },',
  '  adamant_bow:       { id: \'adamant_bow\',       name: \'精金弓\',   emoji: \'🏹\', slot: \'weapon\',  attackBonus: 56, defenceBonus: 0,  ilvl: 45, combatStyle: \'ranged\'  },',
  '  rune_bow_forged:   { id: \'rune_bow_forged\',   name: \'符文战弓\', emoji: \'🏹\', slot: \'weapon\',  attackBonus: 78, defenceBonus: 0,  ilvl: 60, combatStyle: \'ranged\'  },',
].join('\n') + '\n';

g=g.replace('  rune_sword:       { id:',insertBow+'  rune_sword:       { id:');

var insertStaff = [
  '  wooden_staff:      { id: \'wooden_staff\',      name: \'木制法杖\', emoji: \'🪄\', slot: \'weapon\',  attackBonus: 6,  defenceBonus: 0,  ilvl: 4,  combatStyle: \'magic\'  },',
  '  bone_staff:        { id: \'bone_staff\',        name: \'骨制法杖\', emoji: \'🪄\', slot: \'weapon\',  attackBonus: 13, defenceBonus: 0,  ilvl: 13, combatStyle: \'magic\'  },',
  '  enchanted_staff:   { id: \'enchanted_staff\',   name: \'附魔法杖\', emoji: \'🪄\', slot: \'weapon\',  attackBonus: 22, defenceBonus: 0,  ilvl: 24, combatStyle: \'magic\'  },',
  '  crystal_staff:     { id: \'crystal_staff\',     name: \'水晶法杖\', emoji: \'🪄\', slot: \'weapon\',  attackBonus: 35, defenceBonus: 0,  ilvl: 38, combatStyle: \'magic\'  },',
  '  dragonbone_staff:  { id: \'dragonbone_staff\',  name: \'龙骨法杖\', emoji: \'🪄\', slot: \'weapon\',  attackBonus: 52, defenceBonus: 0,  ilvl: 52, combatStyle: \'magic\'  },',
  '  etherial_staff:    { id: \'etherial_staff\',    name: \'以太法杖\', emoji: \'🪄\', slot: \'weapon\',  attackBonus: 74, defenceBonus: 0,  ilvl: 68, combatStyle: \'magic\'  },',
].join('\n') + '\n';

g=g.replace('  leather_boots:     { id:',insertStaff+'  leather_boots:     { id:');

g=g.replace('export interface SmithedItemDef {','export interface SmithedItemDef {\n  combatStyle?: CombatStyle;');

f.writeFileSync('shared/game-data.ts',g);
console.log('done');
