import { useState } from "react";
import { useGameState, useEquipItem, useUnequipItem, useDestroyLoot } from "@/hooks/use-game";
import {
  ALL_CRAFTABLE_ITEMS, ALL_SLOTS, SLOT_LABEL, SLOT_EMOJI,
  RARITY_COLOR, RARITY_BORDER, RARITY_BG, RARITY_LABEL,
  AFFIX_LABEL, AFFIX_COLOR,
  type GameItem, type EquipmentSlot,
} from "@shared/game-data";
import {
  parseCraftItems, parseEquipment, parseLootBag, formatNumber, getEquipmentStats,
} from "@/lib/game-utils";
import type { GameState } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Package, Shield, Sword, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// ─── Item tooltip card ────────────────────────────────────────────────────────
function ItemCard({ item, onEquip, onDestroy, onUnequip, isEquipped }: {
  item: GameItem;
  onEquip?: () => void;
  onDestroy?: () => void;
  onUnequip?: () => void;
  isEquipped?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`rounded-lg border p-3 flex flex-col gap-2 transition-all ${RARITY_BORDER[item.rarity]} ${RARITY_BG[item.rarity]}`}
      data-testid={`item-card-${item.instanceId}`}>
      <div className="flex items-start gap-2">
        <span className="text-2xl leading-none mt-0.5">{item.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`font-semibold text-sm leading-tight ${RARITY_COLOR[item.rarity]}`}>
              {item.name}
            </span>
            <span className={`text-[10px] px-1 py-0.5 rounded font-semibold uppercase border ${RARITY_BORDER[item.rarity]} ${RARITY_COLOR[item.rarity]}`}>
              {RARITY_LABEL[item.rarity]}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-muted-foreground">{SLOT_LABEL[item.slot]}</span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-yellow-500 font-medium">ilvl {item.ilvl}</span>
          </div>
        </div>
        <button className="text-muted-foreground hover:text-foreground p-0.5 transition-colors flex-shrink-0"
          onClick={() => setExpanded(e => !e)}>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Quick stat summary */}
      <div className="flex flex-wrap gap-x-3 gap-y-0.5">
        {item.attackBonus  > 0 && <span className="text-xs text-red-300">⚔ +{item.attackBonus} ATK</span>}
        {item.defenceBonus > 0 && <span className="text-xs text-blue-300">🛡 +{item.defenceBonus} DEF</span>}
        {item.hpBonus      > 0 && <span className="text-xs text-green-300">❤ +{item.hpBonus} HP</span>}
        {item.critRating   > 0 && <span className="text-xs text-yellow-300">✦ +{item.critRating.toFixed(1)}% Crit</span>}
      </div>

      {/* Expanded affix detail */}
      {expanded && (
        <div className="border-t border-border/50 pt-2 space-y-1">
          {item.affixes.map((affix, i) => (
            <div key={i} className={`text-xs flex items-center gap-1.5 ${AFFIX_COLOR[affix.type]}`}>
              <span className="font-semibold">+{affix.value} {AFFIX_LABEL[affix.type]}</span>
              <span className="text-muted-foreground text-[10px]">
                {affix.type === 'strength' && `(+${affix.value} ATK)`}
                {affix.type === 'armour'   && `(+${affix.value} DEF)`}
                {affix.type === 'stamina'  && `(+${affix.value * 5} HP)`}
                {affix.type === 'agility'  && `(+${(affix.value * 0.5).toFixed(1)}% Crit)`}
              </span>
            </div>
          ))}
          {item.source === 'smithed' && (
            <p className="text-[10px] text-muted-foreground mt-1">Crafted · Uncommon quality</p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-1">
        {isEquipped && onUnequip && (
          <Button size="sm" variant="outline" onClick={onUnequip} className="h-7 text-xs px-2" data-testid={`button-unequip-${item.slot}`}>
            Remove
          </Button>
        )}
        {!isEquipped && onEquip && (
          <Button size="sm" onClick={onEquip} className="h-7 text-xs px-2 flex-1" data-testid={`button-equip-${item.instanceId}`}>
            Equip
          </Button>
        )}
        {!isEquipped && onDestroy && (
          <Button size="sm" variant="ghost" onClick={onDestroy}
            className="h-7 text-xs px-2 text-red-400 hover:text-red-300 hover:bg-red-950/30"
            data-testid={`button-destroy-${item.instanceId}`}>
            <Trash2 className="w-3 h-3" />
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── Equipment slot ───────────────────────────────────────────────────────────
function EquipSlot({ slot, item, onUnequip }: {
  slot: EquipmentSlot;
  item: GameItem | null;
  onUnequip: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="relative" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className={`flex items-center gap-2 p-2 rounded-lg border transition-colors cursor-pointer ${
        item ? `${RARITY_BORDER[item.rarity]} ${RARITY_BG[item.rarity]}` : "border-border bg-muted/10"
      }`}
        onClick={item ? onUnequip : undefined}
        data-testid={`equip-slot-${slot}`}>
        <span className="text-lg w-7 text-center flex-shrink-0">{item ? item.emoji : SLOT_EMOJI[slot]}</span>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-muted-foreground leading-none">{SLOT_LABEL[slot]}</p>
          {item ? (
            <>
              <p className={`text-xs font-semibold truncate mt-0.5 ${RARITY_COLOR[item.rarity]}`}>{item.name}</p>
              <p className="text-[10px] text-yellow-500">ilvl {item.ilvl}</p>
            </>
          ) : (
            <p className="text-xs text-muted-foreground/50 mt-0.5">Empty</p>
          )}
        </div>
        {item && hovered && (
          <span className="text-[10px] text-red-400 flex-shrink-0">Remove</span>
        )}
      </div>
    </div>
  );
}

const RESOURCE_SECTIONS = [
  { label: "Woodcutting", prefix: "wood", emoji: "🪵", names: ["Oak","Willow","Teak","Maple","Mahogany","Yew","Magic","Elder","Redwood","Spirit"] },
  { label: "Mining",      prefix: "ore",  emoji: "⛏️", names: ["Copper","Tin","Iron","Coal","Mithril","Adamant","Rune","Dragon","Obsidian","Ether"] },
  { label: "Smelting",    prefix: "bar",  emoji: "🔩", names: ["Bronze","Iron","Steel","Silver","Gold","Mithril","Adamant","Rune","Dragon","Eternal"] },
  { label: "Fishing",     prefix: "fish", emoji: "🐟", names: ["Shrimp","Sardine","Herring","Trout","Salmon","Tuna","Lobster","Swordfish","Shark","Whale"] },
  { label: "Hunting",     prefix: "hide", emoji: "🪶", names: ["Rabbit","Bird","Fox","Wolf","Bear","Boar","Deer","Tiger","Dragon","Phoenix"] },
  { label: "Crafting",    prefix: "item", emoji: "🧵", names: ["Cloth","Leather","Jewelry","Armor","Weapon","Artifact","Relic","Masterpiece","Celestial","Divine"] },
];

export default function Inventory() {
  const { data: state } = useGameState();
  const equipItem    = useEquipItem();
  const unequipItem  = useUnequipItem();
  const destroyLoot  = useDestroyLoot();
  const { toast }    = useToast();

  if (!state) return null;
  const gs = state as GameState;

  const equipment  = parseEquipment(gs.equipment);
  const craftItems = parseCraftItems(gs.craftItems);
  const lootBag    = parseLootBag(gs.lootBag);

  const equipStats = getEquipmentStats(gs);

  function handleEquipDropped(instanceId: string) {
    equipItem.mutate({ instanceId }, {
      onError: (err) => toast({ title: "Equip failed", description: err.message, variant: "destructive" }),
    });
  }
  function handleEquipSmithed(itemId: string) {
    equipItem.mutate({ itemId }, {
      onError: (err) => toast({ title: "Equip failed", description: err.message, variant: "destructive" }),
    });
  }
  function handleUnequip(slot: string) {
    unequipItem.mutate(slot, {
      onError: (err) => toast({ title: "Unequip failed", description: err.message, variant: "destructive" }),
    });
  }
  function handleDestroy(instanceId: string) {
    destroyLoot.mutate(instanceId, {
      onError: (err) => toast({ title: "Failed", description: err.message, variant: "destructive" }),
    });
  }

  const lootByRarity = [...lootBag].sort((a, b) => {
    const order = { legendary: 0, epic: 1, rare: 2, uncommon: 3, common: 4 };
    return order[a.rarity] - order[b.rarity];
  });

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Package className="w-5 h-5 text-yellow-400" /> Inventory
        </h1>
        <p className="text-sm text-muted-foreground">
          {lootBag.length} item{lootBag.length !== 1 ? 's' : ''} in loot bag
          {equipStats.critRating > 0 && ` · ${equipStats.critRating.toFixed(1)}% Crit`}
          {equipStats.hpBonus > 0 && ` · +${equipStats.hpBonus} HP`}
        </p>
      </div>

      {/* Loot + Gold */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Loot</h2>
        <div className="flex gap-6 text-sm">
          <span>💰 <span className="font-bold text-yellow-400">{formatNumber(gs.gold)}</span> Gold</span>
          <span>🦴 <span className="font-bold">{formatNumber(gs.bones)}</span> Bones</span>
          {gs.dragonBones > 0 && <span>🐲 <span className="font-bold text-purple-400">{formatNumber(gs.dragonBones)}</span> Dragon Bones</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Character Equipment */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Equipped</h2>
          </div>

          {/* Stat summary */}
          {(equipStats.attackBonus > 0 || equipStats.defenceBonus > 0 || equipStats.hpBonus > 0 || equipStats.critRating > 0) && (
            <div className="flex flex-wrap gap-x-4 gap-y-1 bg-muted/20 rounded-lg px-3 py-2 text-xs">
              {equipStats.attackBonus > 0  && <span className="text-red-300">⚔ +{equipStats.attackBonus} ATK</span>}
              {equipStats.defenceBonus > 0 && <span className="text-blue-300">🛡 +{equipStats.defenceBonus} DEF</span>}
              {equipStats.hpBonus > 0      && <span className="text-green-300">❤ +{equipStats.hpBonus} HP</span>}
              {equipStats.critRating > 0   && <span className="text-yellow-300">✦ +{equipStats.critRating.toFixed(1)}% Crit</span>}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            {ALL_SLOTS.map(slot => (
              <EquipSlot
                key={slot}
                slot={slot}
                item={(equipment[slot] as GameItem | undefined) ?? null}
                onUnequip={() => handleUnequip(slot)}
              />
            ))}
          </div>
        </div>

        {/* Loot Bag — dropped items */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Sword className="w-4 h-4 text-yellow-400" />
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Loot Bag <span className="text-xs normal-case">({lootBag.length}/50)</span>
              </h2>
            </div>
          </div>

          {lootBag.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No items yet</p>
              <p className="text-xs mt-1">Fight enemies to collect loot!</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {lootByRarity.map(item => (
                <ItemCard
                  key={item.instanceId}
                  item={item}
                  onEquip={() => handleEquipDropped(item.instanceId)}
                  onDestroy={() => handleDestroy(item.instanceId)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Currently equipped items (as cards) */}
      {Object.values(equipment).some(Boolean) && (
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Equipped Items</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ALL_SLOTS.map(slot => {
              const item = (equipment[slot] as GameItem | undefined) ?? null;
              if (!item) return null;
              return (
                <ItemCard
                  key={slot}
                  item={item}
                  isEquipped
                  onUnequip={() => handleUnequip(slot)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Smithed items */}
      {Object.keys(craftItems).length > 0 && (
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Crafted Equipment</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {Object.entries(craftItems).map(([itemId, qty]) => {
              if (qty <= 0) return null;
              const def = ALL_CRAFTABLE_ITEMS[itemId];
              if (!def) return null;
              return (
                <div key={itemId} className="flex items-center gap-2 p-2 rounded-lg border border-green-500/30 bg-green-500/5"
                  data-testid={`smithed-item-${itemId}`}>
                  <span className="text-xl">{def.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-green-400 truncate">{def.name}</p>
                    <p className="text-[10px] text-muted-foreground">x{qty} · ilvl {def.ilvl}</p>
                  </div>
                  <Button size="sm" className="h-7 text-xs px-2 flex-shrink-0"
                    onClick={() => handleEquipSmithed(itemId)}
                    disabled={equipItem.isPending}
                    data-testid={`button-equip-smithed-${itemId}`}>
                    Equip
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Resources */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Resources</h2>
        {RESOURCE_SECTIONS.map(section => {
          const items = Array.from({ length: 10 }, (_, i) => ({
            name: section.names[i],
            qty: ((gs as Record<string, unknown>)[`${section.prefix}_${i}`] as number) ?? 0,
            key: `${section.prefix}_${i}`,
          })).filter(it => it.qty > 0);

          if (!items.length) return null;
          return (
            <div key={section.label} className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {section.emoji} {section.label}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                {items.map(item => (
                  <div key={item.key} className="bg-muted/20 rounded-lg p-2 text-center" data-testid={`resource-${item.key}`}>
                    <p className="text-xs text-muted-foreground truncate">{item.name}</p>
                    <p className="text-sm font-bold mt-0.5">{formatNumber(item.qty)}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
