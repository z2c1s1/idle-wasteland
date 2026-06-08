import type {
  AffixType,
  CombatStyle,
  EquipmentSlot,
  GameItem,
  ItemAffix,
  Rarity,
  SubStatType,
  SubStat,
  UniqueItemDef,
} from "./rarity-equipment";
import {
  ALL_SLOTS,
  rollSkills,
  rollSockets,
  SLOT_BASES,
  buildWeightedSubStatPool,
  rollSubStatValue,
  UNIQUE_ITEMS,
  UNIQUE_SET_MAP,
} from "./rarity-equipment";

// ─── Smithed equipment items ───────────────────────────────────────────────────
export interface SmithedItemDef {
  combatStyle?: CombatStyle;
  id: string;
  name: string;
  emoji: string;
  slot: EquipmentSlot;
  attackBonus: number;
  defenceBonus: number;
  hpBonus?: number;
  critRating?: number;
  ilvl: number;
}

export const EQUIPMENT_ITEMS: Record<string, SmithedItemDef> = {
  bronze_sword:     { id: 'bronze_sword',     name: '青铜剑',   emoji: '🗡️', slot: 'weapon',  attackBonus: 9,  defenceBonus: 0,  ilvl: 5  },
  iron_sword:       { id: 'iron_sword',       name: '铁剑',     emoji: '⚔️', slot: 'weapon',  attackBonus: 17, defenceBonus: 0,  ilvl: 10 },
  steel_sword:      { id: 'steel_sword',      name: '钢剑',     emoji: '⚔️', slot: 'weapon',  attackBonus: 27, defenceBonus: 0,  ilvl: 15 },
  mithril_sword:    { id: 'mithril_sword',    name: '秘银剑',   emoji: '⚔️', slot: 'weapon',  attackBonus: 42, defenceBonus: 0,  ilvl: 25 },
  adamant_sword:    { id: 'adamant_sword',    name: '精金剑',   emoji: '⚔️', slot: 'weapon',  attackBonus: 60, defenceBonus: 0,  ilvl: 35 },
  oak_bow:           { id: 'oak_bow',           name: '橡木弓',   emoji: '🏹', slot: 'weapon',  attackBonus: 7,  defenceBonus: 0,  ilvl: 5,  combatStyle: 'ranged'  },
  yew_bow:           { id: 'yew_bow',           name: '紫杉弓',   emoji: '🏹', slot: 'weapon',  attackBonus: 15, defenceBonus: 0,  ilvl: 12, combatStyle: 'ranged'  },
  maple_bow:         { id: 'maple_bow',         name: '枫木弓',   emoji: '🏹', slot: 'weapon',  attackBonus: 24, defenceBonus: 0,  ilvl: 20, combatStyle: 'ranged'  },
  mithril_bow:       { id: 'mithril_bow',       name: '秘银弓',   emoji: '🏹', slot: 'weapon',  attackBonus: 38, defenceBonus: 0,  ilvl: 32, combatStyle: 'ranged'  },
  adamant_bow:       { id: 'adamant_bow',       name: '精金弓',   emoji: '🏹', slot: 'weapon',  attackBonus: 56, defenceBonus: 0,  ilvl: 45, combatStyle: 'ranged'  },
  rune_bow_forged:   { id: 'rune_bow_forged',   name: '符文战弓', emoji: '🏹', slot: 'weapon',  attackBonus: 78, defenceBonus: 0,  ilvl: 60, combatStyle: 'ranged'  },
  rune_sword:       { id: 'rune_sword',       name: '符文剑',   emoji: '⚔️', slot: 'weapon',  attackBonus: 82, defenceBonus: 0,  ilvl: 50 },
  bronze_shield:    { id: 'bronze_shield',    name: '青铜盾',   emoji: '🛡️', slot: 'offhand', attackBonus: 0,  defenceBonus: 6,  ilvl: 5  },
  iron_shield:      { id: 'iron_shield',      name: '铁盾',     emoji: '🛡️', slot: 'offhand', attackBonus: 0,  defenceBonus: 12, ilvl: 10 },
  steel_shield:     { id: 'steel_shield',     name: '钢盾',     emoji: '🛡️', slot: 'offhand', attackBonus: 0,  defenceBonus: 20, ilvl: 15 },
  mithril_shield:   { id: 'mithril_shield',   name: '秘银盾',   emoji: '🛡️', slot: 'offhand', attackBonus: 0,  defenceBonus: 32, ilvl: 25 },
  bronze_helmet:    { id: 'bronze_helmet',    name: '青铜头盔', emoji: '⛑️', slot: 'helmet',  attackBonus: 0,  defenceBonus: 4,  ilvl: 5  },
  iron_helmet:      { id: 'iron_helmet',      name: '铁头盔',   emoji: '⛑️', slot: 'helmet',  attackBonus: 0,  defenceBonus: 8,  ilvl: 10 },
  steel_helmet:     { id: 'steel_helmet',     name: '钢头盔',   emoji: '⛑️', slot: 'helmet',  attackBonus: 0,  defenceBonus: 14, ilvl: 15 },
  bronze_body:      { id: 'bronze_body',      name: '青铜胸甲', emoji: '🧥', slot: 'chest',   attackBonus: 0,  defenceBonus: 9,  ilvl: 5  },
  iron_body:        { id: 'iron_body',        name: '铁胸甲',   emoji: '🧥', slot: 'chest',   attackBonus: 0,  defenceBonus: 18, ilvl: 10 },
  steel_body:       { id: 'steel_body',       name: '钢胸甲',   emoji: '🧥', slot: 'chest',   attackBonus: 0,  defenceBonus: 30, ilvl: 15 },
  bronze_legs:      { id: 'bronze_legs',      name: '青铜护腿', emoji: '👖', slot: 'legs',    attackBonus: 0,  defenceBonus: 7,  ilvl: 5  },
  iron_legs:        { id: 'iron_legs',        name: '铁护腿',   emoji: '👖', slot: 'legs',    attackBonus: 0,  defenceBonus: 14, ilvl: 10 },
  steel_legs:       { id: 'steel_legs',       name: '钢护腿',   emoji: '👖', slot: 'legs',    attackBonus: 0,  defenceBonus: 23, ilvl: 15 },
  bronze_gauntlets: { id: 'bronze_gauntlets', name: '青铜护手', emoji: '🥊', slot: 'gloves',  attackBonus: 3,  defenceBonus: 3,  ilvl: 5  },
  iron_gauntlets:   { id: 'iron_gauntlets',   name: '铁护手',   emoji: '🥊', slot: 'gloves',  attackBonus: 6,  defenceBonus: 6,  ilvl: 10 },
  steel_gauntlets:  { id: 'steel_gauntlets',  name: '钢护手',   emoji: '🥊', slot: 'gloves',  attackBonus: 10, defenceBonus: 10, ilvl: 15 },
  bronze_boots:     { id: 'bronze_boots',     name: '青铜靴',   emoji: '👢', slot: 'boots',   attackBonus: 0,  defenceBonus: 5,  ilvl: 5  },
  iron_boots:       { id: 'iron_boots',       name: '铁靴',     emoji: '👢', slot: 'boots',   attackBonus: 0,  defenceBonus: 10, ilvl: 10 },
  steel_boots:      { id: 'steel_boots',      name: '钢靴',     emoji: '👢', slot: 'boots',   attackBonus: 0,  defenceBonus: 16, ilvl: 15 },
};

export function smithedToGameItem(itemId: string): GameItem | null {
  const def = EQUIPMENT_ITEMS[itemId];
  if (!def) return null;
  const affix: ItemAffix[] = [];
  if (def.attackBonus > 0)  affix.push({ type: 'strength', value: def.attackBonus });
  if (def.defenceBonus > 0) affix.push({ type: 'armour',   value: def.defenceBonus });
  if (def.hpBonus && def.hpBonus > 0) affix.push({ type: 'vitality', value: Math.round(def.hpBonus / 5) });
  if (def.critRating && def.critRating > 0) affix.push({ type: 'dexterity', value: Math.round(def.critRating / 0.5) });
  return {
    instanceId: `smithed_${itemId}_${Date.now()}`,
    name: def.name, slot: def.slot, emoji: def.emoji,
    rarity: 'uncommon', ilvl: def.ilvl, affixes: affix,
    prefixes: [], suffixes: affix, minDamage: 0, maxDamage: 0,
    attackBonus: def.attackBonus, defenceBonus: def.defenceBonus,
    hpBonus: def.hpBonus ?? 0, critRating: def.critRating ?? 0,
    enhancedDamage: 0, lifeOnKill: 0, crushingBlow: 0,
    magicFind: 0, lifeRegen: 0, goldBonus: 0, resistAll: 0,
    lifeLeech: 0, deadlyStrike: 0, attackSpeed: 0, reflectDamage: 0,
    source: 'smithed', baseId: itemId, combatStyle: (def as any).combatStyle,
    maxSockets: rollSockets('uncommon'), socketedGems: [], skills: [],
  };
}

// ─── Leather equipment items — 完整 10 级套装 ────────────────────────────────
export const LEATHER_ITEMS: Record<string, SmithedItemDef> = {
  // ── hide_0: 辐射鼠皮 ──
  rat_helm:   { id:'rat_helm',   name:'辐射鼠皮帽', emoji:'🎩', slot:'helmet', attackBonus:0, defenceBonus:3,  ilvl:3  },
  rat_vest:   { id:'rat_vest',   name:'辐射鼠皮衣', emoji:'🧥', slot:'chest',  attackBonus:0, defenceBonus:6,  ilvl:3  },
  rat_pants:  { id:'rat_pants',  name:'辐射鼠皮裤', emoji:'👖', slot:'legs',   attackBonus:0, defenceBonus:4,  ilvl:3  },
  rat_gloves: { id:'rat_gloves', name:'辐射鼠皮手套',emoji:'🥊',slot:'gloves', attackBonus:2, defenceBonus:2,  ilvl:3  },
  rat_boots:  { id:'rat_boots',  name:'辐射鼠皮靴', emoji:'👢', slot:'boots',  attackBonus:0, defenceBonus:2,  ilvl:3  },
  // ── hide_1: 变异兔皮 ──
  rabbit_helm:   { id:'rabbit_helm',   name:'变异兔皮帽', emoji:'⛑️', slot:'helmet', attackBonus:0, defenceBonus:8,  ilvl:8  },
  rabbit_vest:   { id:'rabbit_vest',   name:'变异兔皮衣', emoji:'🧥', slot:'chest',  attackBonus:0, defenceBonus:14, ilvl:8  },
  rabbit_pants:  { id:'rabbit_pants',  name:'变异兔皮裤', emoji:'👖', slot:'legs',   attackBonus:0, defenceBonus:10, ilvl:8  },
  rabbit_gloves: { id:'rabbit_gloves', name:'变异兔皮手套',emoji:'🥊',slot:'gloves',attackBonus:5, defenceBonus:3,  ilvl:8  },
  rabbit_boots:  { id:'rabbit_boots',  name:'变异兔皮靴', emoji:'👢', slot:'boots',  attackBonus:0, defenceBonus:5,  ilvl:8  },
  // ── hide_2: 铁鳞蜥皮 ──
  scale_helm:   { id:'scale_helm',   name:'铁鳞蜥皮盔',   emoji:'🪖', slot:'helmet', attackBonus:0, defenceBonus:14, ilvl:14 },
  scale_vest:   { id:'scale_vest',   name:'铁鳞蜥皮甲',   emoji:'🧥', slot:'chest',  attackBonus:0, defenceBonus:24, ilvl:14 },
  scale_pants:  { id:'scale_pants',  name:'铁鳞蜥皮裤',   emoji:'👖', slot:'legs',   attackBonus:0, defenceBonus:18, ilvl:14 },
  scale_gloves: { id:'scale_gloves', name:'铁鳞蜥皮手套', emoji:'🥊', slot:'gloves', attackBonus:9, defenceBonus:6,  ilvl:14 },
  scale_boots:  { id:'scale_boots',  name:'铁鳞蜥皮靴',   emoji:'👢', slot:'boots',  attackBonus:0, defenceBonus:10, ilvl:14 },
  // ── hide_3: 疯犬皮 ──
  dog_helm:   { id:'dog_helm',   name:'疯犬皮帽',   emoji:'⛑️', slot:'helmet', attackBonus:0, defenceBonus:20, ilvl:20 },
  dog_vest:   { id:'dog_vest',   name:'疯犬皮甲',   emoji:'🧥', slot:'chest',  attackBonus:0, defenceBonus:34, ilvl:20 },
  dog_pants:  { id:'dog_pants',  name:'疯犬皮裤',   emoji:'👖', slot:'legs',   attackBonus:0, defenceBonus:26, ilvl:20 },
  dog_gloves: { id:'dog_gloves', name:'疯犬皮手套', emoji:'🥊', slot:'gloves', attackBonus:13,defenceBonus:9,  ilvl:20 },
  dog_boots:  { id:'dog_boots',  name:'疯犬皮靴',   emoji:'👢', slot:'boots',  attackBonus:0, defenceBonus:14, ilvl:20 },
  // ── hide_4: 钢鬃猪皮 ──
  boar_helm:   { id:'boar_helm',   name:'钢鬃猪皮盔', emoji:'⛑️', slot:'helmet', attackBonus:0, defenceBonus:28, ilvl:28 },
  boar_vest:   { id:'boar_vest',   name:'钢鬃猪皮甲', emoji:'🧥', slot:'chest',  attackBonus:0, defenceBonus:46, ilvl:28 },
  boar_pants:  { id:'boar_pants',  name:'钢鬃猪皮裤', emoji:'👖', slot:'legs',   attackBonus:0, defenceBonus:34, ilvl:28 },
  boar_gloves: { id:'boar_gloves', name:'钢鬃猪皮手套',emoji:'🥊',slot:'gloves',attackBonus:18,defenceBonus:12, ilvl:28 },
  boar_boots:  { id:'boar_boots',  name:'钢鬃猪皮靴', emoji:'👢', slot:'boots',  attackBonus:0, defenceBonus:20, ilvl:28 },
  // ── hide_5: 双头鹿皮 ──
  deer_helm:   { id:'deer_helm',   name:'双头鹿皮帽', emoji:'⛑️', slot:'helmet', attackBonus:0, defenceBonus:36, ilvl:36 },
  deer_vest:   { id:'deer_vest',   name:'双头鹿皮衣', emoji:'🧥', slot:'chest',  attackBonus:0, defenceBonus:58, ilvl:36 },
  deer_pants:  { id:'deer_pants',  name:'双头鹿皮裤', emoji:'👖', slot:'legs',   attackBonus:0, defenceBonus:44, ilvl:36 },
  deer_gloves: { id:'deer_gloves', name:'双头鹿皮手套',emoji:'🥊',slot:'gloves',attackBonus:22,defenceBonus:15, ilvl:36 },
  deer_boots:  { id:'deer_boots',  name:'双头鹿皮靴', emoji:'👢', slot:'boots',  attackBonus:0, defenceBonus:26, ilvl:36 },
  // ── hide_6: 灰熊厚皮 ──
  bear_helm:   { id:'bear_helm',   name:'灰熊厚皮盔', emoji:'⛑️', slot:'helmet', attackBonus:0, defenceBonus:44, ilvl:45 },
  bear_vest:   { id:'bear_vest',   name:'灰熊厚皮衣', emoji:'🧥', slot:'chest',  attackBonus:0, defenceBonus:70, ilvl:45 },
  bear_pants:  { id:'bear_pants',  name:'灰熊厚皮裤', emoji:'👖', slot:'legs',   attackBonus:0, defenceBonus:52, ilvl:45 },
  bear_gloves: { id:'bear_gloves', name:'灰熊厚皮手套',emoji:'🥊',slot:'gloves',attackBonus:28,defenceBonus:19, ilvl:45 },
  bear_boots:  { id:'bear_boots',  name:'灰熊厚皮靴', emoji:'👢', slot:'boots',  attackBonus:0, defenceBonus:34, ilvl:45 },
  // ── hide_7: 辐射蝎壳 ──
  chitin_helm:   { id:'chitin_helm',   name:'辐射蝎壳盔', emoji:'🦂', slot:'helmet', attackBonus:4, defenceBonus:54, ilvl:55 },
  chitin_vest:   { id:'chitin_vest',   name:'辐射蝎壳铠', emoji:'🧥', slot:'chest',  attackBonus:6, defenceBonus:84, ilvl:55 },
  chitin_pants:  { id:'chitin_pants',  name:'辐射蝎壳裤', emoji:'👖', slot:'legs',   attackBonus:3, defenceBonus:62, ilvl:55 },
  chitin_gloves: { id:'chitin_gloves', name:'辐射蝎壳手', emoji:'🥊', slot:'gloves', attackBonus:34,defenceBonus:23, ilvl:55 },
  chitin_boots:  { id:'chitin_boots',  name:'辐射蝎壳靴', emoji:'👢', slot:'boots',  attackBonus:4, defenceBonus:42, ilvl:55 },
  // ── hide_8: 死亡爪皮 ──
  claw_helm:   { id:'claw_helm',   name:'死亡爪皮盔', emoji:'💀', slot:'helmet', attackBonus:8, defenceBonus:64, ilvl:66 },
  claw_vest:   { id:'claw_vest',   name:'死亡爪皮甲', emoji:'🧥', slot:'chest',  attackBonus:12,defenceBonus:96, ilvl:66 },
  claw_pants:  { id:'claw_pants',  name:'死亡爪皮裤', emoji:'👖', slot:'legs',   attackBonus:5, defenceBonus:72, ilvl:66 },
  claw_gloves: { id:'claw_gloves', name:'死亡爪皮手套',emoji:'🥊',slot:'gloves',attackBonus:40,defenceBonus:28, ilvl:66 },
  claw_boots:  { id:'claw_boots',  name:'死亡爪皮靴', emoji:'👢', slot:'boots',  attackBonus:8, defenceBonus:50, ilvl:66 },
  // ── hide_9: 巨兽硬皮 ──
  behemoth_helm:   { id:'behemoth_helm',   name:'巨兽硬皮盔',   emoji:'👑', slot:'helmet', attackBonus:12,defenceBonus:78, ilvl:80 },
  behemoth_vest:   { id:'behemoth_vest',   name:'巨兽硬皮战甲', emoji:'🧥', slot:'chest',  attackBonus:18,defenceBonus:110,ilvl:80 },
  behemoth_pants:  { id:'behemoth_pants',  name:'巨兽硬皮护腿', emoji:'👖', slot:'legs',   attackBonus:8, defenceBonus:86, ilvl:80 },
  behemoth_gloves: { id:'behemoth_gloves', name:'巨兽硬皮护手', emoji:'🥊', slot:'gloves', attackBonus:48,defenceBonus:34, ilvl:80 },
  behemoth_boots:  { id:'behemoth_boots',  name:'巨兽硬皮战靴', emoji:'👢', slot:'boots',  attackBonus:12,defenceBonus:62, ilvl:80 },
  // ── 法杖 ──
  scrap_staff:    { id:'scrap_staff',    name:'废料法杖', emoji:'🪄', slot:'weapon', attackBonus:4, defenceBonus:0, ilvl:3,  combatStyle:'magic' },
  bone_staff:     { id:'bone_staff',     name:'骨制法杖', emoji:'🪄', slot:'weapon', attackBonus:12,defenceBonus:0, ilvl:12, combatStyle:'magic' },
  ironbark_staff: { id:'ironbark_staff', name:'铁线木杖', emoji:'🪄', slot:'weapon', attackBonus:24,defenceBonus:0, ilvl:22, combatStyle:'magic' },
  crystal_staff:  { id:'crystal_staff',  name:'水晶法杖', emoji:'🪄', slot:'weapon', attackBonus:38,defenceBonus:0, ilvl:34, combatStyle:'magic' },
  uranium_staff:  { id:'uranium_staff',  name:'辐射法杖', emoji:'🪄', slot:'weapon', attackBonus:54,defenceBonus:0, ilvl:46, combatStyle:'magic' },
  plasma_staff:   { id:'plasma_staff',   name:'等离子杖', emoji:'🪄', slot:'weapon', attackBonus:72,defenceBonus:0, ilvl:58, combatStyle:'magic' },
  gauss_staff:    { id:'gauss_staff',    name:'高斯法杖', emoji:'🪄', slot:'weapon', attackBonus:88,defenceBonus:0, ilvl:72, combatStyle:'magic' },
};

// ─── Jewelry items ─────────────────────────────────────────────────────────────
// Uses crafting items (item_0..9) from the Crafting skill
export const JEWELRY_ITEMS: Record<string, SmithedItemDef> = {
  // bar_0: 废铁锭 + bones
  scrap_ring:   { id:'scrap_ring',   name:'废铁戒指', emoji:'💍', slot:'ring', attackBonus:0, defenceBonus:0, critRating:1.0, ilvl:2  },
  scrap_neck:   { id:'scrap_neck',   name:'废铁吊坠', emoji:'📿', slot:'neck', attackBonus:0, defenceBonus:0, hpBonus:8,      ilvl:2  },
  // bar_1: 铜锭 + bones
  copper_ring:  { id:'copper_ring',  name:'铜戒指',   emoji:'💍', slot:'ring', attackBonus:2, defenceBonus:0, critRating:2.0, ilvl:6  },
  copper_neck:  { id:'copper_neck',  name:'铜吊坠',   emoji:'📿', slot:'neck', attackBonus:0, defenceBonus:0, hpBonus:18,     ilvl:6  },
  // bar_2: 铝锭 + bones
  alum_ring:    { id:'alum_ring',    name:'铝戒指',   emoji:'💍', slot:'ring', attackBonus:3, defenceBonus:0, critRating:3.5, ilvl:12 },
  alum_neck:    { id:'alum_neck',    name:'铝吊坠',   emoji:'📿', slot:'neck', attackBonus:2, defenceBonus:0, hpBonus:28,     ilvl:12 },
  // bar_3: 铅锭 + bones
  lead_ring:    { id:'lead_ring',    name:'铅戒指',   emoji:'💍', slot:'ring', attackBonus:5, defenceBonus:0, critRating:5.0, ilvl:20 },
  lead_neck:    { id:'lead_neck',    name:'铅吊坠',   emoji:'📿', slot:'neck', attackBonus:3, defenceBonus:3, hpBonus:40,     ilvl:20 },
  // bar_4: 硫磺锭 (special, no bones)
  sulfur_ring:  { id:'sulfur_ring',  name:'硫磺指环', emoji:'💍', slot:'ring', attackBonus:0, defenceBonus:3, critRating:7.0, ilvl:28 },
  sulfur_neck:  { id:'sulfur_neck',  name:'硫磺护符', emoji:'📿', slot:'neck', attackBonus:5, defenceBonus:0, hpBonus:55,     ilvl:28 },
  // bar_5: 硝酸盐锭 + dragonBones
  nitrate_ring: { id:'nitrate_ring', name:'硝酸盐戒', emoji:'💍', slot:'ring', attackBonus:8, defenceBonus:0, critRating:9.0, ilvl:36 },
  nitrate_neck: { id:'nitrate_neck', name:'硝酸盐坠', emoji:'📿', slot:'neck', attackBonus:5, defenceBonus:5, hpBonus:70,     ilvl:36 },
  // bar_6: 铀锭 + dragonBones
  uranium_ring: { id:'uranium_ring', name:'铀能戒指', emoji:'💍', slot:'ring', attackBonus:10,defenceBonus:0, critRating:12.0,ilvl:46 },
  uranium_neck: { id:'uranium_neck', name:'铀能吊坠', emoji:'📿', slot:'neck', attackBonus:8, defenceBonus:8, hpBonus:90,     ilvl:46 },
  // bar_7: 钛金锭 + dragonBones
  titanium_ring:{ id:'titanium_ring',name:'钛金戒指', emoji:'💍', slot:'ring', attackBonus:14,defenceBonus:0, critRating:15.0,ilvl:56 },
  titanium_neck:{ id:'titanium_neck',name:'钛金吊坠', emoji:'📿', slot:'neck', attackBonus:10,defenceBonus:10,hpBonus:110,    ilvl:56 },
  // bar_8: 钨钢锭 + dragonBones
  tungsten_ring:{ id:'tungsten_ring',name:'钨钢戒指', emoji:'💍', slot:'ring', attackBonus:18,defenceBonus:3, critRating:18.0,ilvl:68 },
  tungsten_neck:{ id:'tungsten_neck',name:'钨钢吊坠', emoji:'📿', slot:'neck', attackBonus:14,defenceBonus:14,hpBonus:140,    ilvl:68 },
  // bar_9: 铱金锭 + dragonBones
  iridium_ring: { id:'iridium_ring', name:'铱金戒指', emoji:'💍', slot:'ring', attackBonus:24,defenceBonus:5, critRating:22.0,ilvl:80 },
  iridium_neck: { id:'iridium_neck', name:'铱金吊坠', emoji:'📿', slot:'neck', attackBonus:18,defenceBonus:18,hpBonus:180,    ilvl:80 },
};

// Merged lookup including smithed, leather, and jewelry
export const ALL_CRAFTABLE_ITEMS: Record<string, SmithedItemDef> = {
  ...EQUIPMENT_ITEMS,
  ...LEATHER_ITEMS,
  ...JEWELRY_ITEMS,
};

// ─── Leatherworking recipes ────────────────────────────────────────────────────
export interface CraftingRecipe {
  id: string;
  output: string;
  inputs: { resource: string; qty: number }[];
  reqLevel: number;
  xp: number;
  time: number;
}

export const LEATHERWORKING_RECIPES: CraftingRecipe[] = [
  // Rabbit hides (hide_0) — basic leather
  { id: 'lw_leather_cap',     output: 'leather_cap',     inputs: [{ resource: 'hide_0', qty: 2 }], reqLevel: 1,  xp: 20,  time: 6  },
  { id: 'lw_leather_vest',    output: 'leather_vest',    inputs: [{ resource: 'hide_0', qty: 4 }], reqLevel: 1,  xp: 40,  time: 12 },
  { id: 'lw_leather_pants',   output: 'leather_pants',   inputs: [{ resource: 'hide_0', qty: 3 }], reqLevel: 1,  xp: 30,  time: 9  },
  { id: 'lw_leather_gloves',  output: 'leather_gloves',  inputs: [{ resource: 'hide_0', qty: 2 }], reqLevel: 1,  xp: 20,  time: 6  },
  { id: 'lw_leather_boots',   output: 'leather_boots',   inputs: [{ resource: 'hide_0', qty: 2 }], reqLevel: 1,  xp: 20,  time: 6  },
  // Fox hides (hide_2) — studded leather
  { id: 'lw_studded_cap',     output: 'studded_cap',     inputs: [{ resource: 'hide_2', qty: 2 }], reqLevel: 15, xp: 55,  time: 8  },
  { id: 'lw_studded_vest',    output: 'studded_vest',    inputs: [{ resource: 'hide_2', qty: 4 }], reqLevel: 15, xp: 110, time: 15 },
  { id: 'lw_studded_pants',   output: 'studded_pants',   inputs: [{ resource: 'hide_2', qty: 3 }], reqLevel: 15, xp: 82,  time: 12 },
  { id: 'lw_studded_gloves',  output: 'studded_gloves',  inputs: [{ resource: 'hide_2', qty: 2 }], reqLevel: 15, xp: 55,  time: 8  },
  // Wolf hides (hide_3) — wolf leather
  { id: 'lw_wolf_cap',        output: 'wolf_cap',        inputs: [{ resource: 'hide_3', qty: 2 }], reqLevel: 25, xp: 85,  time: 8  },
  { id: 'lw_wolf_vest',       output: 'wolf_vest',       inputs: [{ resource: 'hide_3', qty: 4 }], reqLevel: 25, xp: 170, time: 15 },
  { id: 'lw_wolf_pants',      output: 'wolf_pants',      inputs: [{ resource: 'hide_3', qty: 3 }], reqLevel: 25, xp: 128, time: 12 },
  { id: 'lw_wolf_gloves',     output: 'wolf_gloves',     inputs: [{ resource: 'hide_3', qty: 2 }], reqLevel: 25, xp: 85,  time: 8  },
  // Bear hides (hide_4) — bear leather
  { id: 'lw_bear_vest',       output: 'bear_vest',       inputs: [{ resource: 'hide_4', qty: 5 }], reqLevel: 35, xp: 230, time: 18 },
  { id: 'lw_bear_pants',      output: 'bear_pants',      inputs: [{ resource: 'hide_4', qty: 4 }], reqLevel: 35, xp: 185, time: 15 },
  // Dragon hides (hide_8) — dragonhide
  { id: 'lw_dragonhide_vest', output: 'dragonhide_vest', inputs: [{ resource: 'hide_8', qty: 4 }], reqLevel: 60, xp: 480, time: 22 },
  { id: 'lw_dragonhide_boots',output: 'dragonhide_boots',inputs: [{ resource: 'hide_8', qty: 3 }], reqLevel: 60, xp: 360, time: 18 },
  // Phoenix hides (hide_9) — phoenix
  { id: 'lw_phoenix_vest',    output: 'phoenix_vest',    inputs: [{ resource: 'hide_9', qty: 4 }], reqLevel: 70, xp: 650, time: 25 },
  // Magic staves
  { id: 'lw_wooden_staff',      output: 'wooden_staff',      inputs: [{ resource: 'hide_0', qty: 1 }], reqLevel: 1,  xp: 20,  time: 6  },
  { id: 'lw_bone_staff',        output: 'bone_staff',        inputs: [{ resource: 'hide_2', qty: 2 }], reqLevel: 10, xp: 50,  time: 8  },
  { id: 'lw_enchanted_staff',   output: 'enchanted_staff',   inputs: [{ resource: 'hide_4', qty: 2 }], reqLevel: 20, xp: 80,  time: 12 },
  { id: 'lw_crystal_staff',     output: 'crystal_staff',     inputs: [{ resource: 'hide_6', qty: 3 }], reqLevel: 32, xp: 130, time: 16 },
  { id: 'lw_dragonbone_staff',  output: 'dragonbone_staff',  inputs: [{ resource: 'hide_7', qty: 3 }], reqLevel: 48, xp: 200, time: 22 },
  { id: 'lw_etherial_staff',    output: 'etherial_staff',    inputs: [{ resource: 'hide_9', qty: 4 }], reqLevel: 62, xp: 300, time: 28 },
];

// ─── Jewelcrafting recipes ──────────────────────────────────────────────────────
export const JEWELCRAFTING_RECIPES: CraftingRecipe[] = [
  // bar_0: 废铁锭 + bones
  { id:'jc_scrap_ring',  output:'scrap_ring',  inputs:[{resource:'bar_0',qty:2},{resource:'bones',qty:2}],  reqLevel:1,  xp:20,time:8},
  { id:'jc_scrap_neck',  output:'scrap_neck',  inputs:[{resource:'bar_0',qty:3},{resource:'bones',qty:3}],  reqLevel:1,  xp:28,time:10},
  // bar_1: 铜锭 + bones
  { id:'jc_copper_ring', output:'copper_ring', inputs:[{resource:'bar_1',qty:2},{resource:'bones',qty:3}],  reqLevel:8,  xp:40,time:8},
  { id:'jc_copper_neck', output:'copper_neck', inputs:[{resource:'bar_1',qty:3},{resource:'bones',qty:4}],  reqLevel:8,  xp:50,time:10},
  // bar_2: 铝锭 + bones
  { id:'jc_alum_ring',   output:'alum_ring',   inputs:[{resource:'bar_2',qty:2},{resource:'bones',qty:4}],  reqLevel:16,xp:60,time:9},
  { id:'jc_alum_neck',   output:'alum_neck',   inputs:[{resource:'bar_2',qty:3},{resource:'bones',qty:5}],  reqLevel:16,xp:75,time:11},
  // bar_3: 铅锭 + bones
  { id:'jc_lead_ring',   output:'lead_ring',   inputs:[{resource:'bar_3',qty:2},{resource:'bones',qty:6}],  reqLevel:24,xp:90,time:10},
  { id:'jc_lead_neck',   output:'lead_neck',   inputs:[{resource:'bar_3',qty:3},{resource:'bones',qty:8}],  reqLevel:24,xp:110,time:12},
  // bar_4: 硫磺锭 (no bones)
  { id:'jc_sulfur_ring', output:'sulfur_ring', inputs:[{resource:'bar_4',qty:2}],                          reqLevel:32,xp:130,time:10},
  { id:'jc_sulfur_neck', output:'sulfur_neck', inputs:[{resource:'bar_4',qty:3}],                          reqLevel:32,xp:160,time:12},
  // bar_5: 硝酸盐锭 + dragonBones
  { id:'jc_nitrate_ring',output:'nitrate_ring',inputs:[{resource:'bar_5',qty:2},{resource:'dragonBones',qty:1}],reqLevel:40,xp:180,time:12},
  { id:'jc_nitrate_neck',output:'nitrate_neck',inputs:[{resource:'bar_5',qty:3},{resource:'dragonBones',qty:2}],reqLevel:40,xp:220,time:14},
  // bar_6: 铀锭 + dragonBones
  { id:'jc_uranium_ring',output:'uranium_ring',inputs:[{resource:'bar_6',qty:2},{resource:'dragonBones',qty:2}],reqLevel:50,xp:260,time:14},
  { id:'jc_uranium_neck',output:'uranium_neck',inputs:[{resource:'bar_6',qty:3},{resource:'dragonBones',qty:3}],reqLevel:50,xp:310,time:16},
  // bar_7: 钛金锭 + dragonBones
  { id:'jc_titanium_ring',output:'titanium_ring',inputs:[{resource:'bar_7',qty:3},{resource:'dragonBones',qty:3}],reqLevel:62,xp:360,time:16},
  { id:'jc_titanium_neck',output:'titanium_neck',inputs:[{resource:'bar_7',qty:4},{resource:'dragonBones',qty:4}],reqLevel:62,xp:420,time:18},
  // bar_8: 钨钢锭 + dragonBones
  { id:'jc_tungsten_ring',output:'tungsten_ring',inputs:[{resource:'bar_8',qty:3},{resource:'dragonBones',qty:4}],reqLevel:74,xp:500,time:18},
  { id:'jc_tungsten_neck',output:'tungsten_neck',inputs:[{resource:'bar_8',qty:4},{resource:'dragonBones',qty:5}],reqLevel:74,xp:580,time:22},
  // bar_9: 铱金锭 + dragonBones
  { id:'jc_iridium_ring',output:'iridium_ring',inputs:[{resource:'bar_9',qty:4},{resource:'dragonBones',qty:6}],reqLevel:86,xp:680,time:22},
  { id:'jc_iridium_neck',output:'iridium_neck',inputs:[{resource:'bar_9',qty:5},{resource:'dragonBones',qty:8}],reqLevel:86,xp:800,time:26},
];

// ─── Tool crafting recipes ────────────────────────────────────────────────────
export const TOOL_RECIPES: CraftingRecipe[] = [
  // Axes: wood + bars
  { id:'tool_scrap_axe',    output:'scrap_axe',    inputs:[{resource:'wood_0',qty:3},{resource:'bar_0',qty:2}], reqLevel:1,  xp:15, time:8 },
  { id:'tool_copper_axe',   output:'copper_axe',   inputs:[{resource:'wood_1',qty:3},{resource:'bar_1',qty:2}], reqLevel:8,  xp:30, time:10 },
  { id:'tool_alum_axe',     output:'alum_axe',     inputs:[{resource:'wood_2',qty:3},{resource:'bar_2',qty:2}], reqLevel:16, xp:50, time:12 },
  { id:'tool_lead_axe',     output:'lead_axe',     inputs:[{resource:'wood_3',qty:3},{resource:'bar_3',qty:2}], reqLevel:28, xp:80, time:14 },
  { id:'tool_uranium_axe',  output:'uranium_axe',  inputs:[{resource:'wood_5',qty:3},{resource:'bar_6',qty:2},{resource:'dragonBones',qty:1}], reqLevel:42, xp:130,time:16 },
  { id:'tool_titanium_axe', output:'titanium_axe', inputs:[{resource:'wood_7',qty:3},{resource:'bar_7',qty:2},{resource:'dragonBones',qty:2}], reqLevel:60, xp:200,time:18 },
  { id:'tool_iridium_axe',  output:'iridium_axe',  inputs:[{resource:'wood_9',qty:3},{resource:'bar_9',qty:2},{resource:'dragonBones',qty:4}], reqLevel:80, xp:320,time:24 },
  // Pickaxes: bars + bones
  { id:'tool_scrap_pick',    output:'scrap_pick',    inputs:[{resource:'bar_0',qty:2},{resource:'bones',qty:2}],  reqLevel:1,  xp:15, time:8 },
  { id:'tool_copper_pick',   output:'copper_pick',   inputs:[{resource:'bar_1',qty:2},{resource:'bones',qty:3}],  reqLevel:8,  xp:30, time:10 },
  { id:'tool_alum_pick',     output:'alum_pick',     inputs:[{resource:'bar_2',qty:2},{resource:'bones',qty:5}],  reqLevel:16, xp:50, time:12 },
  { id:'tool_lead_pick',     output:'lead_pick',     inputs:[{resource:'bar_3',qty:2},{resource:'bones',qty:8}],  reqLevel:28, xp:80, time:14 },
  { id:'tool_uranium_pick',  output:'uranium_pick',  inputs:[{resource:'bar_6',qty:2},{resource:'dragonBones',qty:1}], reqLevel:42, xp:130,time:16 },
  { id:'tool_titanium_pick', output:'titanium_pick', inputs:[{resource:'bar_7',qty:2},{resource:'dragonBones',qty:2}], reqLevel:60, xp:200,time:18 },
  { id:'tool_iridium_pick',  output:'iridium_pick',  inputs:[{resource:'bar_9',qty:2},{resource:'dragonBones',qty:4}], reqLevel:80, xp:320,time:24 },
  // Fishing rods: wood
  { id:'tool_scrap_rod',    output:'scrap_rod',    inputs:[{resource:'wood_0',qty:5}],  reqLevel:1,  xp:12, time:5 },
  { id:'tool_copper_rod',   output:'copper_rod',   inputs:[{resource:'wood_1',qty:5}],  reqLevel:6,  xp:25, time:8 },
  { id:'tool_alum_rod',     output:'alum_rod',     inputs:[{resource:'wood_2',qty:4},{resource:'bar_2',qty:1}], reqLevel:16, xp:45, time:10 },
  { id:'tool_lead_rod',     output:'lead_rod',     inputs:[{resource:'wood_3',qty:4},{resource:'bar_3',qty:1}], reqLevel:28, xp:75, time:12 },
  { id:'tool_titanium_rod', output:'titanium_rod', inputs:[{resource:'wood_7',qty:4},{resource:'bar_7',qty:1},{resource:'dragonBones',qty:1}], reqLevel:55, xp:170,time:16 },
  { id:'tool_iridium_rod',  output:'iridium_rod',  inputs:[{resource:'wood_9',qty:4},{resource:'bar_9',qty:1},{resource:'dragonBones',qty:3}], reqLevel:72, xp:250,time:20 },
  // Hunting knives: hide + bars
  { id:'tool_scrap_knife',   output:'scrap_knife',   inputs:[{resource:'hide_0',qty:2},{resource:'bones',qty:3}], reqLevel:1,  xp:15, time:8 },
  { id:'tool_copper_knife',  output:'copper_knife',  inputs:[{resource:'hide_1',qty:2},{resource:'bar_1',qty:1}], reqLevel:8,  xp:30, time:10 },
  { id:'tool_alum_knife',    output:'alum_knife',    inputs:[{resource:'hide_2',qty:2},{resource:'bar_2',qty:1}], reqLevel:16, xp:50, time:12 },
  { id:'tool_lead_knife',    output:'lead_knife',    inputs:[{resource:'hide_3',qty:2},{resource:'bar_3',qty:1}], reqLevel:28, xp:80, time:14 },
  { id:'tool_uranium_knife', output:'uranium_knife', inputs:[{resource:'hide_5',qty:2},{resource:'bar_6',qty:1},{resource:'dragonBones',qty:1}], reqLevel:42, xp:130,time:16 },
  { id:'tool_titanium_knife',output:'titanium_knife',inputs:[{resource:'hide_7',qty:2},{resource:'bar_7',qty:1},{resource:'dragonBones',qty:2}], reqLevel:58, xp:200,time:18 },
  { id:'tool_iridium_knife', output:'iridium_knife', inputs:[{resource:'hide_9',qty:2},{resource:'bar_9',qty:1},{resource:'dragonBones',qty:4}], reqLevel:75, xp:300,time:24 },
];

// ─── Item generation (Diablo-style) ───────────────────────────────────────────
const RARITY_PREFIXES: Record<Rarity, string[]> = {
  common:    ['破旧', '磨损', '粗制', '老旧', '残破'],
  uncommon:  ['坚固', '精良', '光泽', '强化', '锋利'],
  rare:      ['精工', '附魔', '精炼', '卓越', '淬火'],
  epic:      ['远古', '奥术', '神话', '符文', '圣洁'],
  legendary: ['传说', '永恒', '神赋', '炼狱', '不朽'],
  mythic:    ['混沌', '创世', '灭世', '神谕', '终焉'],
};

const SLOT_BASE_NAMES: Record<EquipmentSlot, string[]> = {
  weapon:  ['剑', '刃', '斧', '锤', '战锤', '巨剑', '枪', '戟', '战刃'],
  offhand: ['盾', '圆盾', '法典', '法球', '匕首', '标盾', '神盾', '护壁'],
  helmet:  ['头盔', '王冠', '兜帽', '面罩', '颅盖', '护面', '头冠', '面甲'],
  chest:   ['胸甲', '法袍', '上衣', '锁子甲', '胸铠', '链甲', '战衣'],
  legs:    ['腿甲', '马裤', '护腿', '胫甲', '腿铠', '战裤'],
  gloves:  ['护手', '手套', '握把', '缠带', '护腕', '拳套'],
  boots:   ['靴子', '铁靴', '足甲', '重踏', '护靴', '软鞋'],
  neck:    ['项链', '护身符', '吊坠', '颈环', '链条', '颈圈', '锁扣'],
  ring:    ['戒指', '指环', '印戒', '环圈', '圆环', '封印', '线圈'],
};

// Slot-biased PREFIX pools (offensive affixes, go in item name prefix slot)
const SLOT_PREFIX_POOL: Record<EquipmentSlot, AffixType[]> = {
  weapon:  ['strength', 'strength', 'damage_percent', 'damage_percent', 'crit_damage', 'attack_speed', 'life_leech', 'dexterity'],
  offhand: ['strength', 'dexterity', 'damage_percent', 'crit_damage', 'attack_speed'],
  helmet:  ['strength', 'dexterity', 'vitality', 'damage_percent', 'crit_damage'],
  chest:   ['strength', 'dexterity', 'vitality', 'damage_percent'],
  legs:    ['strength', 'dexterity', 'vitality'],
  gloves:  ['strength', 'strength', 'damage_percent', 'crit_damage', 'attack_speed', 'life_leech', 'overpower'],
  boots:   ['dexterity', 'dexterity', 'attack_speed', 'crit_damage', 'damage_percent'],
  neck:    ['damage_percent', 'life_leech', 'crit_damage', 'attack_speed', 'dexterity', 'strength'],
  ring:    ['damage_percent', 'life_leech', 'crit_damage', 'attack_speed', 'dexterity', 'strength'],
};

// Slot-biased SUFFIX pools (defensive/utility affixes)
const SLOT_SUFFIX_POOL: Record<EquipmentSlot, AffixType[]> = {
  weapon:  ['life_on_hit', 'overpower', 'vitality'],
  offhand: ['armour', 'armour', 'vitality', 'resist_all', 'resist_all', 'life_regen', 'thorns'],
  helmet:  ['armour', 'vitality', 'vitality', 'lucky_hit', 'life_regen', 'resist_all', 'life_on_hit'],
  chest:   ['armour', 'armour', 'vitality', 'resist_all', 'life_regen', 'thorns'],
  legs:    ['armour', 'armour', 'vitality', 'resist_all', 'life_regen', 'thorns'],
  gloves:  ['armour', 'life_on_hit', 'thorns', 'vitality'],
  boots:   ['armour', 'vitality', 'intelligence', 'lucky_hit', 'resist_all', 'life_on_hit'],
  neck:    ['lucky_hit', 'life_on_hit', 'intelligence', 'life_regen', 'vitality', 'resist_all'],
  ring:    ['lucky_hit', 'life_on_hit', 'intelligence', 'life_regen', 'vitality', 'resist_all'],
};

// Legacy unified pool for backward compat
const SLOT_AFFIX_POOL: Record<EquipmentSlot, AffixType[]> = Object.fromEntries(
  (Object.keys(SLOT_PREFIX_POOL) as EquipmentSlot[]).map(slot => [
    slot,
    [...SLOT_PREFIX_POOL[slot], ...SLOT_SUFFIX_POOL[slot]],
  ])
) as Record<EquipmentSlot, AffixType[]>;

const RARITY_AFFIX_COUNT: Record<Rarity, number> = {
  common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5, mythic: 6,
};

const RARITY_MULTIPLIER: Record<Rarity, number> = {
  common: 0.5, uncommon: 0.9, rare: 1.4, epic: 2.0, legendary: 3.2, mythic: 5.0,
};

const AFFIX_SCALING: Record<AffixType, number> = {
  strength:       1.2,
  dexterity:      0.8,
  vitality:       0.7,
  intelligence:   0.6,
  armour:         1.3,
  damage_percent: 0.6,
  life_on_hit:    0.9,
  overpower:      0.35,
  lucky_hit:      0.55,
  life_regen:     0.5,
  resist_all:     0.45,
  life_leech:     0.25,
  crit_damage:    0.3,
  attack_speed:   0.35,
  thorns:         0.5,
};

function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min: number, max: number): number { return min + Math.floor(Math.random() * (max - min + 1)); }

function computeItemStats(affixes: ItemAffix[]) {
  const sum = (type: AffixType) => affixes.filter(a => a.type === type).reduce((s, a) => s + a.value, 0);
  return {
    attackBonus:    sum('strength'),
    defenceBonus:   sum('armour'),
    hpBonus:        sum('vitality') * 5,
    critRating:     sum('dexterity') * 0.5,
    enhancedDamage: sum('damage_percent') + Math.floor(sum('intelligence') * 0.5),
    lifeOnKill:     sum('life_on_hit'),
    crushingBlow:   sum('overpower'),
    magicFind:      sum('lucky_hit'),
    lifeRegen:      sum('life_regen'),
    goldBonus:      0,
    resistAll:      sum('resist_all'),
    lifeLeech:      sum('life_leech'),
    deadlyStrike:   sum('crit_damage'),
    attackSpeed:    sum('attack_speed'),
    reflectDamage:  sum('thorns'),
  };
}

// Enemy-tier ilvl drop bands (explicit, not formulaic)
const ENEMY_ILVL_BANDS: [number, number][] = [
  [1,  8],  // 0: chicken
  [5,  15], // 1: cow
  [10, 22], // 2: goblin
  [18, 32], // 3: skeleton
  [28, 45], // 4: troll
  [38, 55], // 5: giant
  [48, 65], // 6: dragon
  [58, 75], // 7: fire_dragon
];

// Prefix/suffix counts per rarity (Diablo-style rarity template)
function getRarityAffixCounts(rarity: Rarity): { numPrefix: number; numSuffix: number } {
  switch (rarity) {
    case 'common':    return { numPrefix: 0, numSuffix: 0 };
    // Uncommon: randomly one prefix OR one suffix (not always prefix)
    case 'uncommon':  return Math.random() < 0.5 ? { numPrefix: 1, numSuffix: 0 } : { numPrefix: 0, numSuffix: 1 };
    case 'rare':      return { numPrefix: randInt(1, 2), numSuffix: randInt(1, 2) };
    case 'epic':      return { numPrefix: 2, numSuffix: 2 }; // + implicit
    case 'legendary': return { numPrefix: 3, numSuffix: 3 };
    case 'mythic':    return { numPrefix: 4, numSuffix: 4 };
    default: return { numPrefix: 0, numSuffix: 0 };
  }
}

// ── Unique item builder (shared by early roll + legendary rarity path) ────────
export function buildUniqueGameItem(def: UniqueItemDef): GameItem {
  const affixes = def.affixes;
  const setId = UNIQUE_SET_MAP[def.id];
  const stats = computeItemStats(affixes);
  const eligibleForUnique = SLOT_BASES[def.slot].filter(b => b.reqIlvl <= def.ilvl);
  const base = eligibleForUnique.length
    ? eligibleForUnique[eligibleForUnique.length - 1]
    : SLOT_BASES[def.slot][0];
  return {
    instanceId: `unique_${def.id}_${Date.now()}`,
    name: def.name,
    slot: def.slot, emoji: def.emoji, rarity: 'legendary', ilvl: def.ilvl,
    affixes, prefixes: [], suffixes: affixes,
    minDamage: base.minDamage, maxDamage: base.maxDamage,
    ...stats,
    source: 'unique', uniqueId: def.id, setId,
    combatStyle: def.combatStyle,
    flavorText: def.flavorText,
    maxSockets: 2, socketedGems: [],
    skills: (def.skills ?? []).map(s => ({ ...s })),
  };
}

export function generateDroppedItem(enemyIndex: number, playerMagicFind = 0): GameItem {
  const band = ENEMY_ILVL_BANDS[Math.min(enemyIndex, ENEMY_ILVL_BANDS.length - 1)];
  const ilvl = band[0] + randInt(0, band[1] - band[0]);

  // ── Unique drop check (enemy tier + ilvl gate) ───────────────────────────────
  const eligibleUniques = UNIQUE_ITEMS.filter(u => u.minEnemyIndex <= enemyIndex && u.ilvl <= ilvl + 10);
  const uniqueDropChance = 0.02 + enemyIndex * 0.005; // 2%–5.5%
  if (eligibleUniques.length && Math.random() < uniqueDropChance) {
    return buildUniqueGameItem(rand(eligibleUniques));
  }

  // Rarity weighting by enemy tier + player magic find bonus
  const mfBonus = Math.min(playerMagicFind, 200);
  const mfMult  = 1 + mfBonus / 100;
  const weights = [
    0,  // common — 打怪最低掉落蓝色（uncommon）
    Math.max(15, 60 - enemyIndex * 7),
    Math.min(25, Math.floor((enemyIndex * 3) * mfMult)),
    Math.min(15, Math.floor(enemyIndex * 1.2 * mfMult)),
    enemyIndex >= 5 ? Math.max(1, Math.floor(1.5 * mfMult)) : 0,
  ];
  // Legendaries are always unique named items — exclude from procedural rarity pool
  const pool: Rarity[] = [];
  (['common', 'uncommon', 'rare', 'epic'] as Rarity[]).forEach((r, i) => {
    for (let w = 0; w < weights[i]; w++) pool.push(r);
  });
  const rarity = rand(pool);

  const slot = rand(ALL_SLOTS);

  // ── Item base: pick eligible bases for this slot/ilvl ─────────────────────────
  const eligibleBases = SLOT_BASES[slot].filter(b => b.reqIlvl <= ilvl);
  const base = eligibleBases.length ? eligibleBases[eligibleBases.length - 1] : SLOT_BASES[slot][0];

  // ── Prefix/suffix split (Diablo rarity template) ─────────────────────────────
  const { numPrefix, numSuffix } = getRarityAffixCounts(rarity);
  const mult = RARITY_MULTIPLIER[rarity];

  const ALL_TYPES: AffixType[] = [
    'strength','dexterity','vitality','armour',
    'damage_percent','life_on_hit','overpower','lucky_hit',
    'life_regen','intelligence','resist_all',
    'life_leech','crit_damage','attack_speed','thorns',
  ];

  function pickAffixes(pool: AffixType[], count: number, used: Set<AffixType>): ItemAffix[] {
    const result: ItemAffix[] = [];
    for (let i = 0; i < count; i++) {
      const available = ALL_TYPES.filter(t => !used.has(t));
      if (!available.length) break;
      const candidate = rand(pool);
      const type = available.includes(candidate) ? candidate : rand(available);
      used.add(type);
      const value = Math.max(1, Math.round(ilvl * mult * AFFIX_SCALING[type]));
      result.push({ type, value });
    }
    return result;
  }

  const usedTypes = new Set<AffixType>();
  // Add implicit if present
  if (base.implicit) usedTypes.add(base.implicit.type);

  const prefixes = pickAffixes(SLOT_PREFIX_POOL[slot], numPrefix, usedTypes);
  const suffixes = pickAffixes(SLOT_SUFFIX_POOL[slot], numSuffix, usedTypes);
  const implicit = base.implicit ? [base.implicit] : [];
  const affixes  = [...implicit, ...prefixes, ...suffixes];

  const stats = computeItemStats(affixes);

  // ── Name generation: "[prefix] [base] [suffix]" Diablo-style ─────────────────
  const namePrefix = rarity !== 'common' ? rand(RARITY_PREFIXES[rarity]) + ' ' : '';
  const baseName   = base.name;
  const nameSuffix = rarity === 'epic' || rarity === 'legendary'
    ? ' · ' + rand(SLOT_BASE_NAMES[slot]) : '';

  // ── Roll sub-stats (4 random types, unique, weighted) ─────────────────────────
  const subStatTypes = new Set<SubStatType>();
  const subStats: SubStat[] = [];
  const weightedPool = buildWeightedSubStatPool();
  while (subStatTypes.size < 4) {
    const t = rand(weightedPool);
    if (!subStatTypes.has(t)) {
      subStatTypes.add(t);
      const rolled = rollSubStatValue(t, ilvl);
      subStats.push({ type: t, value: rolled.value, quality: rolled.quality });
    }
  }

  return {
    instanceId: `drop_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name: `${namePrefix}${baseName}${nameSuffix}`,
    slot, emoji: base.emoji, rarity, ilvl, affixes, prefixes, suffixes,
    minDamage: base.minDamage, maxDamage: base.maxDamage,
    ...stats,
    source: 'dropped',
    baseType: base.id,
    maxSockets: rollSockets(rarity), socketedGems: [], skills: rollSkills(rarity),
    subStats,
    enhanceLevel: 0,
  };
}

export function getDropChance(enemyIndex: number): number {
  return 0.15 + enemyIndex * 0.02; // 15% for Chicken → 29% for Fire Dragon
}

