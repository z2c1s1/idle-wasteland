export type EquipmentSlot = 'weapon' | 'shield' | 'helmet' | 'body' | 'legs';

export interface Enemy {
  id: string;
  name: string;
  emoji: string;
  maxHp: number;
  attack: number;
  defence: number;
  xp: number;
  drops: { gold: [number, number]; bones?: number; dragonBones?: number };
  reqCombatLevel: number;
}

export const ENEMIES: Enemy[] = [
  { id: 'chicken',    name: 'Chicken',      emoji: '🐔', maxHp: 15,   attack: 1,  defence: 0,  xp: 8,    drops: { gold: [1, 2] },              reqCombatLevel: 1  },
  { id: 'cow',        name: 'Cow',          emoji: '🐄', maxHp: 35,   attack: 4,  defence: 0,  xp: 20,   drops: { gold: [2, 5],  bones: 1 },   reqCombatLevel: 5  },
  { id: 'goblin',     name: 'Goblin',       emoji: '👺', maxHp: 70,   attack: 8,  defence: 2,  xp: 45,   drops: { gold: [4, 10], bones: 1 },   reqCombatLevel: 10 },
  { id: 'skeleton',   name: 'Skeleton',     emoji: '💀', maxHp: 140,  attack: 15, defence: 5,  xp: 100,  drops: { gold: [8, 18], bones: 2 },   reqCombatLevel: 20 },
  { id: 'troll',      name: 'Troll',        emoji: '👹', maxHp: 280,  attack: 26, defence: 10, xp: 200,  drops: { gold: [18, 40], bones: 3 },  reqCombatLevel: 35 },
  { id: 'giant',      name: 'Giant',        emoji: '🦣', maxHp: 500,  attack: 42, defence: 18, xp: 380,  drops: { gold: [35, 75] },            reqCombatLevel: 50 },
  { id: 'dragon',     name: 'Green Dragon', emoji: '🐲', maxHp: 850,  attack: 65, defence: 30, xp: 720,  drops: { gold: [70, 140], dragonBones: 1 }, reqCombatLevel: 65 },
  { id: 'fire_dragon',name: 'Fire Dragon',  emoji: '🔥', maxHp: 1400, attack: 95, defence: 50, xp: 1400, drops: { gold: [140, 280], dragonBones: 2 }, reqCombatLevel: 80 },
];

export interface EquipmentItem {
  id: string;
  name: string;
  emoji: string;
  slot: EquipmentSlot;
  attackBonus: number;
  defenceBonus: number;
}

export const EQUIPMENT_ITEMS: Record<string, EquipmentItem> = {
  bronze_sword:   { id: 'bronze_sword',   name: 'Bronze Sword',      emoji: '🗡️', slot: 'weapon', attackBonus: 9,  defenceBonus: 0  },
  iron_sword:     { id: 'iron_sword',     name: 'Iron Sword',        emoji: '⚔️', slot: 'weapon', attackBonus: 17, defenceBonus: 0  },
  steel_sword:    { id: 'steel_sword',    name: 'Steel Sword',       emoji: '⚔️', slot: 'weapon', attackBonus: 27, defenceBonus: 0  },
  mithril_sword:  { id: 'mithril_sword',  name: 'Mithril Sword',     emoji: '⚔️', slot: 'weapon', attackBonus: 42, defenceBonus: 0  },
  adamant_sword:  { id: 'adamant_sword',  name: 'Adamant Sword',     emoji: '⚔️', slot: 'weapon', attackBonus: 60, defenceBonus: 0  },
  rune_sword:     { id: 'rune_sword',     name: 'Rune Sword',        emoji: '⚔️', slot: 'weapon', attackBonus: 82, defenceBonus: 0  },
  bronze_shield:  { id: 'bronze_shield',  name: 'Bronze Shield',     emoji: '🛡️', slot: 'shield', attackBonus: 0,  defenceBonus: 6  },
  iron_shield:    { id: 'iron_shield',    name: 'Iron Shield',       emoji: '🛡️', slot: 'shield', attackBonus: 0,  defenceBonus: 12 },
  steel_shield:   { id: 'steel_shield',   name: 'Steel Shield',      emoji: '🛡️', slot: 'shield', attackBonus: 0,  defenceBonus: 20 },
  mithril_shield: { id: 'mithril_shield', name: 'Mithril Shield',    emoji: '🛡️', slot: 'shield', attackBonus: 0,  defenceBonus: 32 },
  bronze_helmet:  { id: 'bronze_helmet',  name: 'Bronze Helmet',     emoji: '⛑️', slot: 'helmet', attackBonus: 0,  defenceBonus: 4  },
  iron_helmet:    { id: 'iron_helmet',    name: 'Iron Helmet',       emoji: '⛑️', slot: 'helmet', attackBonus: 0,  defenceBonus: 8  },
  steel_helmet:   { id: 'steel_helmet',   name: 'Steel Helmet',      emoji: '⛑️', slot: 'helmet', attackBonus: 0,  defenceBonus: 14 },
  bronze_body:    { id: 'bronze_body',    name: 'Bronze Platebody',  emoji: '🧥', slot: 'body',   attackBonus: 0,  defenceBonus: 9  },
  iron_body:      { id: 'iron_body',      name: 'Iron Platebody',    emoji: '🧥', slot: 'body',   attackBonus: 0,  defenceBonus: 18 },
  steel_body:     { id: 'steel_body',     name: 'Steel Platebody',   emoji: '🧥', slot: 'body',   attackBonus: 0,  defenceBonus: 30 },
  bronze_legs:    { id: 'bronze_legs',    name: 'Bronze Platelegs',  emoji: '👖', slot: 'legs',   attackBonus: 0,  defenceBonus: 7  },
  iron_legs:      { id: 'iron_legs',      name: 'Iron Platelegs',    emoji: '👖', slot: 'legs',   attackBonus: 0,  defenceBonus: 14 },
  steel_legs:     { id: 'steel_legs',     name: 'Steel Platelegs',   emoji: '👖', slot: 'legs',   attackBonus: 0,  defenceBonus: 23 },
};

export interface SmithingRecipe {
  id: string;
  output: string;
  inputs: { resource: string; qty: number }[];
  reqLevel: number;
  xp: number;
  time: number;
}

export const SMITHING_RECIPES: SmithingRecipe[] = [
  { id: 'r_bronze_sword',   output: 'bronze_sword',   inputs: [{ resource: 'bar_0', qty: 2 }], reqLevel: 5,  xp: 25,  time: 8  },
  { id: 'r_bronze_shield',  output: 'bronze_shield',  inputs: [{ resource: 'bar_0', qty: 3 }], reqLevel: 5,  xp: 35,  time: 10 },
  { id: 'r_bronze_helmet',  output: 'bronze_helmet',  inputs: [{ resource: 'bar_0', qty: 2 }], reqLevel: 5,  xp: 25,  time: 8  },
  { id: 'r_bronze_body',    output: 'bronze_body',    inputs: [{ resource: 'bar_0', qty: 5 }], reqLevel: 10, xp: 60,  time: 15 },
  { id: 'r_bronze_legs',    output: 'bronze_legs',    inputs: [{ resource: 'bar_0', qty: 4 }], reqLevel: 10, xp: 48,  time: 12 },
  { id: 'r_iron_sword',     output: 'iron_sword',     inputs: [{ resource: 'bar_1', qty: 2 }], reqLevel: 20, xp: 50,  time: 8  },
  { id: 'r_iron_shield',    output: 'iron_shield',    inputs: [{ resource: 'bar_1', qty: 3 }], reqLevel: 20, xp: 70,  time: 10 },
  { id: 'r_iron_helmet',    output: 'iron_helmet',    inputs: [{ resource: 'bar_1', qty: 2 }], reqLevel: 20, xp: 50,  time: 8  },
  { id: 'r_iron_body',      output: 'iron_body',      inputs: [{ resource: 'bar_1', qty: 5 }], reqLevel: 25, xp: 120, time: 15 },
  { id: 'r_iron_legs',      output: 'iron_legs',      inputs: [{ resource: 'bar_1', qty: 4 }], reqLevel: 25, xp: 96,  time: 12 },
  { id: 'r_steel_sword',    output: 'steel_sword',    inputs: [{ resource: 'bar_2', qty: 2 }], reqLevel: 30, xp: 75,  time: 8  },
  { id: 'r_steel_shield',   output: 'steel_shield',   inputs: [{ resource: 'bar_2', qty: 3 }], reqLevel: 30, xp: 105, time: 10 },
  { id: 'r_steel_helmet',   output: 'steel_helmet',   inputs: [{ resource: 'bar_2', qty: 2 }], reqLevel: 30, xp: 75,  time: 8  },
  { id: 'r_steel_body',     output: 'steel_body',     inputs: [{ resource: 'bar_2', qty: 5 }], reqLevel: 35, xp: 180, time: 15 },
  { id: 'r_steel_legs',     output: 'steel_legs',     inputs: [{ resource: 'bar_2', qty: 4 }], reqLevel: 35, xp: 144, time: 12 },
  { id: 'r_mithril_sword',  output: 'mithril_sword',  inputs: [{ resource: 'bar_4', qty: 2 }], reqLevel: 50, xp: 120, time: 10 },
  { id: 'r_mithril_shield', output: 'mithril_shield', inputs: [{ resource: 'bar_4', qty: 3 }], reqLevel: 50, xp: 160, time: 12 },
  { id: 'r_adamant_sword',  output: 'adamant_sword',  inputs: [{ resource: 'bar_5', qty: 2 }], reqLevel: 60, xp: 160, time: 10 },
  { id: 'r_rune_sword',     output: 'rune_sword',     inputs: [{ resource: 'bar_6', qty: 2 }], reqLevel: 70, xp: 220, time: 10 },
];

export type EquipmentState = Partial<Record<EquipmentSlot, string | null>>;

export function getEquipmentBonuses(equipment: EquipmentState): { attackBonus: number; defenceBonus: number } {
  let attackBonus = 0;
  let defenceBonus = 0;
  for (const itemId of Object.values(equipment)) {
    if (itemId && EQUIPMENT_ITEMS[itemId]) {
      attackBonus += EQUIPMENT_ITEMS[itemId].attackBonus;
      defenceBonus += EQUIPMENT_ITEMS[itemId].defenceBonus;
    }
  }
  return { attackBonus, defenceBonus };
}
