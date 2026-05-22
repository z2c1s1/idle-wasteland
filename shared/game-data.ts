// ─── Rarity system ─────────────────────────────────────────────────────────────
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export const RARITY_LABEL: Record<Rarity, string> = {
  common:    'Common',
  uncommon:  'Uncommon',
  rare:      'Rare',
  epic:      'Epic',
  legendary: 'Legendary',
};

export const RARITY_COLOR: Record<Rarity, string> = {
  common:    'text-gray-300',
  uncommon:  'text-green-400',
  rare:      'text-blue-400',
  epic:      'text-purple-400',
  legendary: 'text-orange-400',
};

export const RARITY_BORDER: Record<Rarity, string> = {
  common:    'border-gray-500/40',
  uncommon:  'border-green-500/40',
  rare:      'border-blue-500/40',
  epic:      'border-purple-500/50',
  legendary: 'border-orange-500/60',
};

export const RARITY_BG: Record<Rarity, string> = {
  common:    'bg-gray-500/5',
  uncommon:  'bg-green-500/8',
  rare:      'bg-blue-500/10',
  epic:      'bg-purple-500/12',
  legendary: 'bg-orange-500/15',
};

// ─── Equipment slots ────────────────────────────────────────────────────────────
export type EquipmentSlot = 'weapon' | 'offhand' | 'helmet' | 'chest' | 'legs' | 'gloves' | 'boots' | 'neck' | 'ring';

export const SLOT_LABEL: Record<EquipmentSlot, string> = {
  weapon:  'Weapon',
  offhand: 'Off-Hand',
  helmet:  'Helmet',
  chest:   'Chest',
  legs:    'Legs',
  gloves:  'Gloves',
  boots:   'Boots',
  neck:    'Neck',
  ring:    'Ring',
};

export const SLOT_EMOJI: Record<EquipmentSlot, string> = {
  weapon:  '⚔️',
  offhand: '🛡️',
  helmet:  '⛑️',
  chest:   '🧥',
  legs:    '👖',
  gloves:  '🥊',
  boots:   '👢',
  neck:    '📿',
  ring:    '💍',
};

export const ALL_SLOTS: EquipmentSlot[] = ['weapon','offhand','helmet','chest','legs','gloves','boots','neck','ring'];

// ─── Affix types ────────────────────────────────────────────────────────────────
export type AffixType = 'strength' | 'agility' | 'stamina' | 'armour';

export const AFFIX_LABEL: Record<AffixType, string> = {
  strength: 'Strength',
  agility:  'Agility',
  stamina:  'Stamina',
  armour:   'Armour',
};

export const AFFIX_COLOR: Record<AffixType, string> = {
  strength: 'text-red-300',
  agility:  'text-yellow-300',
  stamina:  'text-green-300',
  armour:   'text-blue-300',
};

export const AFFIX_EFFECT: Record<AffixType, string> = {
  strength: '+1 Attack per point',
  agility:  '+0.5% Crit per point',
  stamina:  '+5 HP per point',
  armour:   '+1 Defence per point',
};

export interface ItemAffix {
  type: AffixType;
  value: number;
}

// ─── Game item interface ────────────────────────────────────────────────────────
export interface GameItem {
  instanceId: string;
  name: string;
  slot: EquipmentSlot;
  emoji: string;
  rarity: Rarity;
  ilvl: number;
  affixes: ItemAffix[];
  attackBonus: number;
  defenceBonus: number;
  hpBonus: number;
  critRating: number;
  source: 'smithed' | 'dropped';
  baseId?: string;
}

export type EquipmentState = Partial<Record<EquipmentSlot, GameItem | null>>;

// ─── Helpers ───────────────────────────────────────────────────────────────────
export function getEquipmentBonuses(equipment: EquipmentState) {
  let attackBonus = 0, defenceBonus = 0, hpBonus = 0, critRating = 0;
  for (const item of Object.values(equipment)) {
    if (!item) continue;
    attackBonus  += item.attackBonus;
    defenceBonus += item.defenceBonus;
    hpBonus      += item.hpBonus;
    critRating   += item.critRating;
  }
  return { attackBonus, defenceBonus, hpBonus, critRating };
}

// ─── Smithed equipment items ───────────────────────────────────────────────────
export interface SmithedItemDef {
  id: string;
  name: string;
  emoji: string;
  slot: EquipmentSlot;
  attackBonus: number;
  defenceBonus: number;
  ilvl: number;
}

export const EQUIPMENT_ITEMS: Record<string, SmithedItemDef> = {
  bronze_sword:     { id: 'bronze_sword',     name: 'Bronze Sword',      emoji: '🗡️', slot: 'weapon',  attackBonus: 9,  defenceBonus: 0,  ilvl: 5  },
  iron_sword:       { id: 'iron_sword',       name: 'Iron Sword',        emoji: '⚔️', slot: 'weapon',  attackBonus: 17, defenceBonus: 0,  ilvl: 10 },
  steel_sword:      { id: 'steel_sword',      name: 'Steel Sword',       emoji: '⚔️', slot: 'weapon',  attackBonus: 27, defenceBonus: 0,  ilvl: 15 },
  mithril_sword:    { id: 'mithril_sword',    name: 'Mithril Sword',     emoji: '⚔️', slot: 'weapon',  attackBonus: 42, defenceBonus: 0,  ilvl: 25 },
  adamant_sword:    { id: 'adamant_sword',    name: 'Adamant Sword',     emoji: '⚔️', slot: 'weapon',  attackBonus: 60, defenceBonus: 0,  ilvl: 35 },
  rune_sword:       { id: 'rune_sword',       name: 'Rune Sword',        emoji: '⚔️', slot: 'weapon',  attackBonus: 82, defenceBonus: 0,  ilvl: 50 },
  bronze_shield:    { id: 'bronze_shield',    name: 'Bronze Shield',     emoji: '🛡️', slot: 'offhand', attackBonus: 0,  defenceBonus: 6,  ilvl: 5  },
  iron_shield:      { id: 'iron_shield',      name: 'Iron Shield',       emoji: '🛡️', slot: 'offhand', attackBonus: 0,  defenceBonus: 12, ilvl: 10 },
  steel_shield:     { id: 'steel_shield',     name: 'Steel Shield',      emoji: '🛡️', slot: 'offhand', attackBonus: 0,  defenceBonus: 20, ilvl: 15 },
  mithril_shield:   { id: 'mithril_shield',   name: 'Mithril Shield',    emoji: '🛡️', slot: 'offhand', attackBonus: 0,  defenceBonus: 32, ilvl: 25 },
  bronze_helmet:    { id: 'bronze_helmet',    name: 'Bronze Helmet',     emoji: '⛑️', slot: 'helmet',  attackBonus: 0,  defenceBonus: 4,  ilvl: 5  },
  iron_helmet:      { id: 'iron_helmet',      name: 'Iron Helmet',       emoji: '⛑️', slot: 'helmet',  attackBonus: 0,  defenceBonus: 8,  ilvl: 10 },
  steel_helmet:     { id: 'steel_helmet',     name: 'Steel Helmet',      emoji: '⛑️', slot: 'helmet',  attackBonus: 0,  defenceBonus: 14, ilvl: 15 },
  bronze_body:      { id: 'bronze_body',      name: 'Bronze Platebody',  emoji: '🧥', slot: 'chest',   attackBonus: 0,  defenceBonus: 9,  ilvl: 5  },
  iron_body:        { id: 'iron_body',        name: 'Iron Platebody',    emoji: '🧥', slot: 'chest',   attackBonus: 0,  defenceBonus: 18, ilvl: 10 },
  steel_body:       { id: 'steel_body',       name: 'Steel Platebody',   emoji: '🧥', slot: 'chest',   attackBonus: 0,  defenceBonus: 30, ilvl: 15 },
  bronze_legs:      { id: 'bronze_legs',      name: 'Bronze Platelegs',  emoji: '👖', slot: 'legs',    attackBonus: 0,  defenceBonus: 7,  ilvl: 5  },
  iron_legs:        { id: 'iron_legs',        name: 'Iron Platelegs',    emoji: '👖', slot: 'legs',    attackBonus: 0,  defenceBonus: 14, ilvl: 10 },
  steel_legs:       { id: 'steel_legs',       name: 'Steel Platelegs',   emoji: '👖', slot: 'legs',    attackBonus: 0,  defenceBonus: 23, ilvl: 15 },
  bronze_gauntlets: { id: 'bronze_gauntlets', name: 'Bronze Gauntlets',  emoji: '🥊', slot: 'gloves',  attackBonus: 3,  defenceBonus: 3,  ilvl: 5  },
  iron_gauntlets:   { id: 'iron_gauntlets',   name: 'Iron Gauntlets',    emoji: '🥊', slot: 'gloves',  attackBonus: 6,  defenceBonus: 6,  ilvl: 10 },
  steel_gauntlets:  { id: 'steel_gauntlets',  name: 'Steel Gauntlets',   emoji: '🥊', slot: 'gloves',  attackBonus: 10, defenceBonus: 10, ilvl: 15 },
  bronze_boots:     { id: 'bronze_boots',     name: 'Bronze Boots',      emoji: '👢', slot: 'boots',   attackBonus: 0,  defenceBonus: 5,  ilvl: 5  },
  iron_boots:       { id: 'iron_boots',       name: 'Iron Boots',        emoji: '👢', slot: 'boots',   attackBonus: 0,  defenceBonus: 10, ilvl: 10 },
  steel_boots:      { id: 'steel_boots',      name: 'Steel Boots',       emoji: '👢', slot: 'boots',   attackBonus: 0,  defenceBonus: 16, ilvl: 15 },
};

export function smithedToGameItem(itemId: string): GameItem | null {
  const def = EQUIPMENT_ITEMS[itemId];
  if (!def) return null;
  const affix: ItemAffix[] = [];
  if (def.attackBonus > 0)  affix.push({ type: 'strength', value: def.attackBonus });
  if (def.defenceBonus > 0) affix.push({ type: 'armour',   value: def.defenceBonus });
  return {
    instanceId: `smithed_${itemId}_${Date.now()}`,
    name: def.name,
    slot: def.slot,
    emoji: def.emoji,
    rarity: 'uncommon',
    ilvl: def.ilvl,
    affixes: affix,
    attackBonus: def.attackBonus,
    defenceBonus: def.defenceBonus,
    hpBonus: 0,
    critRating: 0,
    source: 'smithed',
    baseId: itemId,
  };
}

// ─── Item generation (Diablo-style) ───────────────────────────────────────────
const RARITY_PREFIXES: Record<Rarity, string[]> = {
  common:    ['Battered', 'Worn', 'Crude', 'Old', 'Tattered'],
  uncommon:  ['Sturdy', 'Fine', 'Polished', 'Reinforced', 'Honed'],
  rare:      ['Masterwork', 'Enchanted', 'Refined', 'Superior', 'Tempered'],
  epic:      ['Ancient', 'Arcane', 'Mythic', 'Runic', 'Hallowed'],
  legendary: ['Legendary', 'Eternal', 'Godly', 'Infernal', 'Immortal'],
};

const SLOT_BASE_NAMES: Record<EquipmentSlot, string[]> = {
  weapon:  ['Sword', 'Blade', 'Axe', 'Mace', 'Warhammer', 'Greatsword', 'Spear', 'Halberd', 'Cleaver'],
  offhand: ['Shield', 'Buckler', 'Tome', 'Orb', 'Dagger', 'Targe', 'Aegis', 'Barrier'],
  helmet:  ['Helm', 'Crown', 'Hood', 'Cowl', 'Skullcap', 'Visor', 'Crest', 'Faceguard'],
  chest:   ['Chestplate', 'Robe', 'Tunic', 'Hauberk', 'Breastplate', 'Chainmail', 'Vest'],
  legs:    ['Legplates', 'Breeches', 'Leggings', 'Greaves', 'Cuisses', 'Pants'],
  gloves:  ['Gauntlets', 'Gloves', 'Grips', 'Wraps', 'Handguards', 'Fists'],
  boots:   ['Boots', 'Sabatons', 'Treads', 'Stompers', 'Greaves', 'Slippers'],
  neck:    ['Necklace', 'Amulet', 'Pendant', 'Choker', 'Chain', 'Collar', 'Locket'],
  ring:    ['Ring', 'Band', 'Signet', 'Loop', 'Circle', 'Seal', 'Coil'],
};

// Slot-biased affix pools (slot favors certain stats but can roll anything)
const SLOT_AFFIX_POOL: Record<EquipmentSlot, AffixType[]> = {
  weapon:  ['strength', 'agility', 'strength', 'strength', 'agility', 'stamina'],
  offhand: ['armour', 'stamina', 'armour', 'armour', 'agility', 'strength'],
  helmet:  ['stamina', 'armour', 'agility', 'stamina', 'armour', 'strength'],
  chest:   ['stamina', 'armour', 'armour', 'stamina', 'strength', 'agility'],
  legs:    ['armour', 'stamina', 'agility', 'armour', 'strength', 'stamina'],
  gloves:  ['strength', 'agility', 'strength', 'agility', 'armour', 'stamina'],
  boots:   ['agility', 'stamina', 'armour', 'agility', 'strength', 'armour'],
  neck:    ['strength', 'agility', 'stamina', 'armour', 'agility', 'strength'],
  ring:    ['strength', 'agility', 'stamina', 'armour', 'strength', 'agility'],
};

const RARITY_AFFIX_COUNT: Record<Rarity, number> = {
  common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5,
};

const RARITY_MULTIPLIER: Record<Rarity, number> = {
  common: 0.5, uncommon: 0.9, rare: 1.4, epic: 2.0, legendary: 3.2,
};

const AFFIX_SCALING: Record<AffixType, number> = {
  strength: 1.2,
  agility:  0.8,
  stamina:  0.7,
  armour:   1.3,
};

function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min: number, max: number): number { return min + Math.floor(Math.random() * (max - min + 1)); }

export function generateDroppedItem(enemyIndex: number): GameItem {
  const enemy = ENEMIES[enemyIndex];
  const ilvlBase = enemyIndex * 7 + 1;
  const ilvl = ilvlBase + randInt(0, 5);

  // Rarity weighting by enemy tier
  const weights = [
    Math.max(10, 60 - enemyIndex * 7),   // common
    Math.min(40, 20 + enemyIndex * 3),    // uncommon
    Math.min(25, enemyIndex * 3),         // rare
    Math.min(10, Math.floor(enemyIndex * 1.2)), // epic
    enemyIndex >= 6 ? 2 : 0,             // legendary (dragons only)
  ];
  const pool: Rarity[] = [];
  (['common', 'uncommon', 'rare', 'epic', 'legendary'] as Rarity[]).forEach((r, i) => {
    for (let w = 0; w < weights[i]; w++) pool.push(r);
  });
  const rarity = rand(pool);

  const slot = rand(ALL_SLOTS);
  const numAffixes = RARITY_AFFIX_COUNT[rarity];
  const mult = RARITY_MULTIPLIER[rarity];
  const slotPool = SLOT_AFFIX_POOL[slot];

  const usedTypes = new Set<AffixType>();
  const affixes: ItemAffix[] = [];
  const allTypes: AffixType[] = ['strength', 'agility', 'stamina', 'armour'];

  for (let i = 0; i < numAffixes; i++) {
    const available = allTypes.filter(t => !usedTypes.has(t));
    if (!available.length) break;
    const candidate = rand(slotPool);
    const type = available.includes(candidate) ? candidate : rand(available);
    usedTypes.add(type);
    const value = Math.max(1, Math.round(ilvl * mult * AFFIX_SCALING[type]));
    affixes.push({ type, value });
  }

  const attackBonus  = affixes.filter(a => a.type === 'strength').reduce((s, a) => s + a.value, 0);
  const defenceBonus = affixes.filter(a => a.type === 'armour').reduce((s, a) => s + a.value, 0);
  const hpBonus      = affixes.filter(a => a.type === 'stamina').reduce((s, a) => s + a.value, 0) * 5;
  const critRating   = affixes.filter(a => a.type === 'agility').reduce((s, a) => s + a.value * 0.5, 0);

  const prefix = rand(RARITY_PREFIXES[rarity]);
  const base   = rand(SLOT_BASE_NAMES[slot]);

  return {
    instanceId: `drop_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name: `${prefix} ${base}`,
    slot,
    emoji: SLOT_EMOJI[slot],
    rarity,
    ilvl,
    affixes,
    attackBonus,
    defenceBonus,
    hpBonus,
    critRating,
    source: 'dropped',
  };
}

export function getDropChance(enemyIndex: number): number {
  return 0.15 + enemyIndex * 0.02; // 15% for Chicken → 29% for Fire Dragon
}

// ─── Enemies ───────────────────────────────────────────────────────────────────
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
  { id: 'chicken',    name: 'Chicken',      emoji: '🐔', maxHp: 15,   attack: 1,  defence: 0,  xp: 8,    drops: { gold: [1, 2] },               reqCombatLevel: 1  },
  { id: 'cow',        name: 'Cow',          emoji: '🐄', maxHp: 35,   attack: 4,  defence: 0,  xp: 20,   drops: { gold: [2, 5],  bones: 1 },    reqCombatLevel: 5  },
  { id: 'goblin',     name: 'Goblin',       emoji: '👺', maxHp: 70,   attack: 8,  defence: 2,  xp: 45,   drops: { gold: [4, 10], bones: 1 },    reqCombatLevel: 10 },
  { id: 'skeleton',   name: 'Skeleton',     emoji: '💀', maxHp: 140,  attack: 15, defence: 5,  xp: 100,  drops: { gold: [8, 18], bones: 2 },    reqCombatLevel: 20 },
  { id: 'troll',      name: 'Troll',        emoji: '👹', maxHp: 280,  attack: 26, defence: 10, xp: 200,  drops: { gold: [18, 40], bones: 3 },   reqCombatLevel: 35 },
  { id: 'giant',      name: 'Giant',        emoji: '🦣', maxHp: 500,  attack: 42, defence: 18, xp: 380,  drops: { gold: [35, 75] },             reqCombatLevel: 50 },
  { id: 'dragon',     name: 'Green Dragon', emoji: '🐲', maxHp: 850,  attack: 65, defence: 30, xp: 720,  drops: { gold: [70, 140], dragonBones: 1 }, reqCombatLevel: 65 },
  { id: 'fire_dragon',name: 'Fire Dragon',  emoji: '🔥', maxHp: 1400, attack: 95, defence: 50, xp: 1400, drops: { gold: [140, 280], dragonBones: 2 }, reqCombatLevel: 80 },
];

// ─── Smithing recipes ──────────────────────────────────────────────────────────
export interface SmithingRecipe {
  id: string;
  output: string;
  inputs: { resource: string; qty: number }[];
  reqLevel: number;
  xp: number;
  time: number;
}

export const SMITHING_RECIPES: SmithingRecipe[] = [
  // Bronze (bar_0)
  { id: 'r_bronze_sword',      output: 'bronze_sword',      inputs: [{ resource: 'bar_0', qty: 2 }], reqLevel: 5,  xp: 25,  time: 8  },
  { id: 'r_bronze_shield',     output: 'bronze_shield',     inputs: [{ resource: 'bar_0', qty: 3 }], reqLevel: 5,  xp: 35,  time: 10 },
  { id: 'r_bronze_helmet',     output: 'bronze_helmet',     inputs: [{ resource: 'bar_0', qty: 2 }], reqLevel: 5,  xp: 25,  time: 8  },
  { id: 'r_bronze_body',       output: 'bronze_body',       inputs: [{ resource: 'bar_0', qty: 5 }], reqLevel: 10, xp: 60,  time: 15 },
  { id: 'r_bronze_legs',       output: 'bronze_legs',       inputs: [{ resource: 'bar_0', qty: 4 }], reqLevel: 10, xp: 48,  time: 12 },
  { id: 'r_bronze_gauntlets',  output: 'bronze_gauntlets',  inputs: [{ resource: 'bar_0', qty: 2 }], reqLevel: 5,  xp: 22,  time: 7  },
  { id: 'r_bronze_boots',      output: 'bronze_boots',      inputs: [{ resource: 'bar_0', qty: 2 }], reqLevel: 5,  xp: 22,  time: 7  },
  // Iron (bar_1)
  { id: 'r_iron_sword',        output: 'iron_sword',        inputs: [{ resource: 'bar_1', qty: 2 }], reqLevel: 20, xp: 50,  time: 8  },
  { id: 'r_iron_shield',       output: 'iron_shield',       inputs: [{ resource: 'bar_1', qty: 3 }], reqLevel: 20, xp: 70,  time: 10 },
  { id: 'r_iron_helmet',       output: 'iron_helmet',       inputs: [{ resource: 'bar_1', qty: 2 }], reqLevel: 20, xp: 50,  time: 8  },
  { id: 'r_iron_body',         output: 'iron_body',         inputs: [{ resource: 'bar_1', qty: 5 }], reqLevel: 25, xp: 120, time: 15 },
  { id: 'r_iron_legs',         output: 'iron_legs',         inputs: [{ resource: 'bar_1', qty: 4 }], reqLevel: 25, xp: 96,  time: 12 },
  { id: 'r_iron_gauntlets',    output: 'iron_gauntlets',    inputs: [{ resource: 'bar_1', qty: 2 }], reqLevel: 20, xp: 45,  time: 7  },
  { id: 'r_iron_boots',        output: 'iron_boots',        inputs: [{ resource: 'bar_1', qty: 2 }], reqLevel: 20, xp: 45,  time: 7  },
  // Steel (bar_2)
  { id: 'r_steel_sword',       output: 'steel_sword',       inputs: [{ resource: 'bar_2', qty: 2 }], reqLevel: 30, xp: 75,  time: 8  },
  { id: 'r_steel_shield',      output: 'steel_shield',      inputs: [{ resource: 'bar_2', qty: 3 }], reqLevel: 30, xp: 105, time: 10 },
  { id: 'r_steel_helmet',      output: 'steel_helmet',      inputs: [{ resource: 'bar_2', qty: 2 }], reqLevel: 30, xp: 75,  time: 8  },
  { id: 'r_steel_body',        output: 'steel_body',        inputs: [{ resource: 'bar_2', qty: 5 }], reqLevel: 35, xp: 180, time: 15 },
  { id: 'r_steel_legs',        output: 'steel_legs',        inputs: [{ resource: 'bar_2', qty: 4 }], reqLevel: 35, xp: 144, time: 12 },
  { id: 'r_steel_gauntlets',   output: 'steel_gauntlets',   inputs: [{ resource: 'bar_2', qty: 2 }], reqLevel: 30, xp: 70,  time: 7  },
  { id: 'r_steel_boots',       output: 'steel_boots',       inputs: [{ resource: 'bar_2', qty: 2 }], reqLevel: 30, xp: 70,  time: 7  },
  // Mithril (bar_4)
  { id: 'r_mithril_sword',     output: 'mithril_sword',     inputs: [{ resource: 'bar_4', qty: 2 }], reqLevel: 50, xp: 120, time: 10 },
  { id: 'r_mithril_shield',    output: 'mithril_shield',    inputs: [{ resource: 'bar_4', qty: 3 }], reqLevel: 50, xp: 160, time: 12 },
  // Adamant (bar_5)
  { id: 'r_adamant_sword',     output: 'adamant_sword',     inputs: [{ resource: 'bar_5', qty: 2 }], reqLevel: 60, xp: 160, time: 10 },
  // Rune (bar_6)
  { id: 'r_rune_sword',        output: 'rune_sword',        inputs: [{ resource: 'bar_6', qty: 2 }], reqLevel: 70, xp: 220, time: 10 },
];
