import { useGameState, useEquipItem, useUnequipItem } from "@/hooks/use-game";
import { EQUIPMENT_ITEMS, type EquipmentSlot } from "@shared/game-data";
import { parseCraftItems, parseEquipment, formatNumber } from "@/lib/game-utils";
import type { GameState } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Package, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const RESOURCE_SECTIONS = [
  { label: "Woodcutting", prefix: "wood", emoji: "🪵", count: 10 },
  { label: "Mining",      prefix: "ore",  emoji: "⛏️", count: 10 },
  { label: "Smelting",    prefix: "bar",  emoji: "🔩", count: 10 },
  { label: "Fishing",     prefix: "fish", emoji: "🐟", count: 10 },
  { label: "Hunting",     prefix: "hide", emoji: "🪶", count: 10 },
  { label: "Crafting",    prefix: "item", emoji: "🧵", count: 10 },
];

const RESOURCE_NAMES: Record<string, string[]> = {
  wood: ["Oak", "Willow", "Teak", "Maple", "Mahogany", "Yew", "Magic", "Elder", "Redwood", "Spirit"],
  ore:  ["Copper", "Tin", "Iron", "Coal", "Mithril", "Adamant", "Rune", "Dragon", "Obsidian", "Ether"],
  bar:  ["Bronze", "Iron", "Steel", "Silver", "Gold", "Mithril", "Adamant", "Rune", "Dragon", "Eternal"],
  fish: ["Shrimp", "Sardine", "Herring", "Trout", "Salmon", "Tuna", "Lobster", "Swordfish", "Shark", "Whale"],
  hide: ["Rabbit", "Bird", "Fox", "Wolf", "Bear", "Boar", "Deer", "Tiger", "Dragon", "Phoenix"],
  item: ["Cloth", "Leather", "Jewelry", "Armor", "Weapon", "Artifact", "Relic", "Masterpiece", "Celestial", "Divine"],
};

const SLOTS: EquipmentSlot[] = ["weapon", "shield", "helmet", "body", "legs"];
const SLOT_LABELS: Record<EquipmentSlot, string> = {
  weapon: "Weapon", shield: "Shield", helmet: "Helmet", body: "Platebody", legs: "Platelegs",
};

export default function Inventory() {
  const { data: state } = useGameState();
  const equipItem = useEquipItem();
  const unequipItem = useUnequipItem();
  const { toast } = useToast();

  if (!state) return null;
  const gameState = state as GameState;
  const equipment = parseEquipment(gameState.equipment);
  const craftItems = parseCraftItems(gameState.craftItems);

  function handleEquip(itemId: string) {
    equipItem.mutate(itemId, {
      onError: (err) => toast({ title: "Failed to equip", description: err.message, variant: "destructive" }),
    });
  }

  function handleUnequip(slot: string) {
    unequipItem.mutate(slot, {
      onError: (err) => toast({ title: "Failed to unequip", description: err.message, variant: "destructive" }),
    });
  }

  const totalResources = RESOURCE_SECTIONS.reduce((sum, sec) => {
    for (let i = 0; i < sec.count; i++) {
      sum += (gameState as Record<string, unknown>)[`${sec.prefix}_${i}`] as number ?? 0;
    }
    return sum;
  }, 0);

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Package className="w-5 h-5 text-yellow-400" /> Inventory
        </h1>
        <p className="text-sm text-muted-foreground">{formatNumber(totalResources)} total resources</p>
      </div>

      {/* Loot */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Loot</h2>
        <div className="flex gap-6 text-sm">
          <span>💰 <span className="font-bold text-yellow-400">{formatNumber(gameState.gold)}</span> Gold</span>
          <span>🦴 <span className="font-bold">{formatNumber(gameState.bones)}</span> Bones</span>
          {gameState.dragonBones > 0 && (
            <span>🐲 <span className="font-bold text-purple-400">{formatNumber(gameState.dragonBones)}</span> Dragon Bones</span>
          )}
        </div>
      </div>

      {/* Equipment */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Shield className="w-4 h-4" /> Equipment
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SLOTS.map(slot => {
            const itemId = (equipment as Record<string, string | null>)[slot];
            const item = itemId ? EQUIPMENT_ITEMS[itemId] : null;
            return (
              <div key={slot} className={`flex items-center gap-3 p-3 rounded-lg border ${
                item ? "border-primary/40 bg-primary/10" : "border-border bg-muted/10"
              }`} data-testid={`equipment-slot-${slot}`}>
                <div className="text-2xl w-8 text-center">{item ? item.emoji : "—"}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">{SLOT_LABELS[slot]}</p>
                  <p className="text-sm font-medium truncate">{item ? item.name : "Empty"}</p>
                  {item && (
                    <p className="text-xs text-muted-foreground">
                      {item.attackBonus > 0 && `ATK +${item.attackBonus}`}
                      {item.defenceBonus > 0 && `DEF +${item.defenceBonus}`}
                    </p>
                  )}
                </div>
                {item && (
                  <Button size="sm" variant="ghost" onClick={() => handleUnequip(slot)}
                    disabled={unequipItem.isPending} data-testid={`button-unequip-${slot}`}>
                    Remove
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Crafted items (equipment in inventory) */}
      {Object.keys(craftItems).length > 0 && (
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Crafted Equipment</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {Object.entries(craftItems).map(([itemId, qty]) => {
              if (qty <= 0) return null;
              const item = EQUIPMENT_ITEMS[itemId];
              if (!item) return null;
              return (
                <div key={itemId} className="flex items-center gap-3 p-2 rounded-lg border border-border bg-card/50"
                  data-testid={`craft-item-${itemId}`}>
                  <span className="text-xl">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      x{qty} · {item.attackBonus > 0 ? `ATK +${item.attackBonus}` : `DEF +${item.defenceBonus}`}
                    </p>
                  </div>
                  <Button size="sm" onClick={() => handleEquip(itemId)}
                    disabled={equipItem.isPending} data-testid={`button-equip-${itemId}`}>
                    Equip
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Gathered Resources */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Resources</h2>
        {RESOURCE_SECTIONS.map(section => {
          const items = Array.from({ length: section.count }, (_, i) => ({
            name: RESOURCE_NAMES[section.prefix]?.[i] ?? `Tier ${i + 1}`,
            key: `${section.prefix}_${i}` as keyof GameState,
            qty: ((gameState as Record<string, unknown>)[`${section.prefix}_${i}`] as number) ?? 0,
          })).filter(it => it.qty > 0);

          if (items.length === 0) return null;

          return (
            <div key={section.label} className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {section.emoji} {section.label}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {items.map(item => (
                  <div key={item.key} className="bg-muted/20 rounded-lg p-2 text-center"
                    data-testid={`resource-${item.key}`}>
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
