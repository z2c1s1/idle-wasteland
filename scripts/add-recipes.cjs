var f=require('fs');
var g=f.readFileSync('shared/game-data.ts','utf8');

// Add bow smithing recipes before rune_sword recipe
var bowRecipes = [
  '  { id: \'smith_oak_bow\',     output: \'oak_bow\',     inputs: [{ resource: \'bar_0\', qty: 1 }], reqLevel: 1,  xp: 25,  time: 8  },',
  '  { id: \'smith_yew_bow\',     output: \'yew_bow\',     inputs: [{ resource: \'bar_1\', qty: 1 }], reqLevel: 8,  xp: 45,  time: 10 },',
  '  { id: \'smith_maple_bow\',   output: \'maple_bow\',   inputs: [{ resource: \'bar_2\', qty: 2 }], reqLevel: 16, xp: 70,  time: 12 },',
  '  { id: \'smith_mithril_bow\', output: \'mithril_bow\', inputs: [{ resource: \'bar_4\', qty: 2 }], reqLevel: 28, xp: 120, time: 15 },',
  '  { id: \'smith_adamant_bow\', output: \'adamant_bow\', inputs: [{ resource: \'bar_5\', qty: 3 }], reqLevel: 40, xp: 180, time: 18 },',
  '  { id: \'smith_rune_bow\',    output: \'rune_bow_forged\', inputs: [{ resource: \'bar_6\', qty: 3 }], reqLevel: 55, xp: 260, time: 22 },',
].join('\n') + '\n';

// Insert before the last sword recipe  
g=g.replace('  { id: \'smith_rune_sword\',   inputs:', bowRecipes + '  { id: \'smith_rune_sword\',   inputs:');

// Add staff leatherworking recipes (last recipes in leatherworking)
var staffRecipes = [
  '  { id: \'lw_wooden_staff\',      output: \'wooden_staff\',      inputs: [{ resource: \'hide_0\', qty: 1 }], reqLevel: 1,  xp: 20,  time: 6  },',
  '  { id: \'lw_bone_staff\',        output: \'bone_staff\',        inputs: [{ resource: \'hide_2\', qty: 2 }], reqLevel: 10, xp: 50,  time: 8  },',
  '  { id: \'lw_enchanted_staff\',   output: \'enchanted_staff\',   inputs: [{ resource: \'hide_4\', qty: 2 }], reqLevel: 20, xp: 80,  time: 12 },',
  '  { id: \'lw_crystal_staff\',     output: \'crystal_staff\',     inputs: [{ resource: \'hide_6\', qty: 3 }], reqLevel: 32, xp: 130, time: 16 },',
  '  { id: \'lw_dragonbone_staff\',  output: \'dragonbone_staff\',  inputs: [{ resource: \'hide_7\', qty: 3 }], reqLevel: 48, xp: 200, time: 22 },',
  '  { id: \'lw_etherial_staff\',    output: \'etherial_staff\',    inputs: [{ resource: \'hide_9\', qty: 4 }], reqLevel: 62, xp: 300, time: 28 },',
].join('\n') + '\n';

// Insert at end of leatherworking recipes (before the closing ])
g=g.replace('  { id: \'lw_ancient_vest\',    output:', staffRecipes + '  { id: \'lw_ancient_vest\',    output:');

// Also need to add combatStyle handling in smithedToGameItem function
g=g.replace(
  '    source: \'smithed\', baseId: itemId,',
  '    source: \'smithed\', baseId: itemId, combatStyle: (def as any).combatStyle,'
);

f.writeFileSync('shared/game-data.ts',g);
console.log('recipes added');
