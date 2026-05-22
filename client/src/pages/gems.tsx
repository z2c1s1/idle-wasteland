import { useState } from "react";
import { useGameState, useSocketGem } from "@/hooks/use-game";
import {
  GEM_EMOJI, GEM_TYPE_LABEL, GEM_QUALITY_LABEL, GEM_TYPE_COLOR, GEM_QUALITY_COLOR,
  GEM_TYPES, GEM_QUALITIES, getGemName, getGemBonus, getGemBgClass,
  RARITY_COLOR, RARITY_BORDER, RARITY_BG, RARITY_LABEL, SLOT_LABEL, SLOT_EMOJI,
  type GameItem, type GemType, type GemQuality,
} from "@shared/game-data";
import { parseLootBag, parseEquipment, parseGems } from "@/lib/game-utils";
import type { GameState } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Gem, Package, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// ─── Gem stat preview ─────────────────────────────────────────────────────────
function GemStatLine({ gemKey }: { gemKey: string }) {
  const b = getGemBonus(gemKey);
  return (
    <span className="text-xs text-muted-foreground">
      {b.attackBonus  > 0 && <span className="text-red-300">⚔+{b.attackBonus} </span>}
      {b.defenceBonus > 0 && <span className="text-blue-300">🛡+{b.defenceBonus} </span>}
      {b.hpBonus      > 0 && <span className="text-green-300">❤+{b.hpBonus} </span>}
      {b.critRating   > 0 && <span className="text-yellow-300">✦+{b.critRating.toFixed(1)}% </span>}
    </span>
  );
}

// ─── Socket gem modal ─────────────────────────────────────────────────────────
function SocketGemPanel({
  item, gems, onSocket, isPending,
}: {
  item: GameItem; gems: Record<string, number>;
  onSocket: (gemKey: string) => void; isPending: boolean;
}) {
  const availableGems = Object.entries(gems).filter(([, qty]) => qty > 0);
  const filledSockets = item.socketedGems ?? [];
  const maxSockets    = item.maxSockets ?? 0;
  const emptySlots    = maxSockets - filledSockets.length;

  return (
    <div className="bg-background border border-border rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-lg">{item.emoji}</span>
        <div>
          <p className={`text-sm font-semibold ${RARITY_COLOR[item.rarity]}`}>{item.name}</p>
          <p className="text-xs text-muted-foreground">{SLOT_LABEL[item.slot]} · ilvl {item.ilvl}</p>
        </div>
      </div>

      {/* Sockets */}
      <div className="flex gap-2 flex-wrap">
        {filledSockets.map((gk, i) => {
          const type = gk.split('_')[0] as GemType;
          return (
            <div key={i} className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm ${getGemBgClass(gk)}`}
              title={getGemName(gk)}>
              {GEM_EMOJI[type]}
            </div>
          );
        })}
        {Array.from({ length: emptySlots }).map((_, i) => (
          <div key={`empty-${i}`}
            className="w-8 h-8 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center text-muted-foreground/50 text-xs">
            ○
          </div>
        ))}
        {maxSockets === 0 && <span className="text-xs text-muted-foreground italic">No sockets</span>}
      </div>

      {emptySlots > 0 && availableGems.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-semibold">Select gem to socket:</p>
          <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto">
            {availableGems.map(([gemKey, qty]) => {
              const type = gemKey.split('_')[0] as GemType;
              return (
                <button key={gemKey} onClick={() => onSocket(gemKey)} disabled={isPending}
                  className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all hover:opacity-90 disabled:opacity-50 ${getGemBgClass(gemKey)}`}
                  data-testid={`socket-gem-${gemKey}`}>
                  <span className="text-lg">{GEM_EMOJI[type]}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{getGemName(gemKey)}</p>
                    <GemStatLine gemKey={gemKey} />
                  </div>
                  <span className="text-xs text-muted-foreground font-bold">×{qty}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
      {emptySlots > 0 && availableGems.length === 0 && (
        <p className="text-xs text-muted-foreground italic">You have no gems. Mine ores or fight enemies!</p>
      )}
      {emptySlots === 0 && maxSockets > 0 && (
        <p className="text-xs text-green-400">All sockets filled!</p>
      )}
    </div>
  );
}

// ─── Item row with socket button ──────────────────────────────────────────────
function ItemRow({
  item, gems, onSocket, isPending, isEquipped,
}: {
  item: GameItem; gems: Record<string, number>;
  onSocket: (instanceId: string, gemKey: string) => void;
  isPending: boolean; isEquipped?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const filledSockets = item.socketedGems ?? [];
  const maxSockets    = item.maxSockets ?? 0;

  return (
    <div className={`rounded-xl border p-3 space-y-2 ${RARITY_BORDER[item.rarity]} ${RARITY_BG[item.rarity]}`}
      data-testid={`gem-item-row-${item.instanceId}`}>
      <div className="flex items-center gap-2">
        <span className="text-xl">{item.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-sm font-semibold ${RARITY_COLOR[item.rarity]}`}>{item.name}</span>
            <span className={`text-[10px] px-1 rounded border uppercase font-bold ${RARITY_BORDER[item.rarity]} ${RARITY_COLOR[item.rarity]}`}>
              {RARITY_LABEL[item.rarity]}
            </span>
            {isEquipped && <span className="text-[10px] text-green-400 font-semibold">[Equipped]</span>}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
            <span>{SLOT_LABEL[item.slot]}</span>
            <span>·</span>
            <span className="text-yellow-500">ilvl {item.ilvl}</span>
            <span>·</span>
            {/* Socket indicators */}
            <span className="flex gap-0.5 items-center">
              {Array.from({ length: maxSockets }).map((_, i) => (
                <span key={i} className="text-sm">
                  {filledSockets[i] ? GEM_EMOJI[filledSockets[i].split('_')[0] as GemType] : '○'}
                </span>
              ))}
              {maxSockets === 0 && <span className="text-muted-foreground/40 text-[10px]">No sockets</span>}
            </span>
          </div>
        </div>
        {maxSockets > 0 && (
          <Button size="sm" variant="outline" className="h-7 text-xs px-2 flex-shrink-0"
            onClick={() => setExpanded(e => !e)} data-testid={`button-socket-toggle-${item.instanceId}`}>
            <Gem className="w-3 h-3 mr-1" />
            {filledSockets.length}/{maxSockets}
          </Button>
        )}
      </div>

      {expanded && maxSockets > 0 && (
        <SocketGemPanel
          item={item} gems={gems} isPending={isPending}
          onSocket={(gk) => { onSocket(item.instanceId, gk); setExpanded(false); }}
        />
      )}
    </div>
  );
}

// ─── Main Gems page ───────────────────────────────────────────────────────────
export default function GemsPage() {
  const { data: state }  = useGameState();
  const socketGem        = useSocketGem();
  const { toast }        = useToast();

  if (!state) return null;
  const gs = state as GameState;

  const gems      = parseGems(gs.gems);
  const lootBag   = parseLootBag(gs.lootBag);
  const equipment = parseEquipment(gs.equipment);

  const equippedItems = Object.values(equipment).filter(Boolean) as GameItem[];
  const lootWithSockets = lootBag.filter(i => (i.maxSockets ?? 0) > 0);

  const totalGems = Object.values(gems).reduce((a, b) => a + b, 0);

  function handleSocket(instanceId: string, gemKey: string) {
    socketGem.mutate({ instanceId, gemKey }, {
      onSuccess: () => toast({ title: "💎 Gem socketed!", description: `${getGemName(gemKey)} added to item.` }),
      onError: (err) => toast({ title: "Failed", description: err.message, variant: "destructive" }),
    });
  }

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Gem className="w-5 h-5 text-cyan-400" /> Gems
        </h1>
        <p className="text-sm text-muted-foreground">
          Socket gems into equipment to boost stats. Mine ores or defeat enemies to find gems.
        </p>
      </div>

      {/* Gem inventory */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Gem Inventory <span className="normal-case text-xs">({totalGems} total)</span>
          </h2>
        </div>

        {totalGems === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-3xl mb-2">💎</p>
            <p className="text-sm">No gems yet</p>
            <p className="text-xs mt-1">Mine ore or defeat monsters to find gems!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {GEM_TYPES.map(type => {
              const entries = GEM_QUALITIES
                .map(q => ({ key: `${type}_${q}`, qty: gems[`${type}_${q}`] ?? 0 }))
                .filter(e => e.qty > 0);
              if (!entries.length) return null;
              return (
                <div key={type}>
                  <p className={`text-xs font-semibold mb-1.5 ${GEM_TYPE_COLOR[type]}`}>
                    {GEM_EMOJI[type]} {GEM_TYPE_LABEL[type]}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {entries.map(({ key, qty }) => {
                      const quality = key.split('_')[1] as GemQuality;
                      const bonus   = getGemBonus(key);
                      return (
                        <div key={key} className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getGemBgClass(key)}`}
                          data-testid={`gem-inventory-${key}`}>
                          <span className="text-xl">{GEM_EMOJI[type]}</span>
                          <div>
                            <p className={`text-xs font-semibold ${GEM_QUALITY_COLOR[quality]}`}>
                              {GEM_QUALITY_LABEL[quality]} · ×{qty}
                            </p>
                            <div className="text-[10px] space-x-1">
                              {bonus.attackBonus  > 0 && <span className="text-red-300">⚔+{bonus.attackBonus}</span>}
                              {bonus.defenceBonus > 0 && <span className="text-blue-300">🛡+{bonus.defenceBonus}</span>}
                              {bonus.hpBonus      > 0 && <span className="text-green-300">❤+{bonus.hpBonus}</span>}
                              {bonus.critRating   > 0 && <span className="text-yellow-300">✦+{bonus.critRating.toFixed(1)}%</span>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Gem drop guide */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-yellow-400" /> Gem Drop Guide
        </h2>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <p className="font-semibold text-foreground mb-1.5">⛏️ Mining</p>
            <div className="space-y-0.5 text-muted-foreground">
              <p>Copper/Tin → 🔴🔵💚💛 残缺 (4%)</p>
              <p>Iron/Coal → 残缺/瑕疵 (5%)</p>
              <p>Mithril/Adamant → 瑕疵/普通 (6%)</p>
              <p>Rune/Dragon → 普通/无瑕 (7%)</p>
              <p>Obsidian → 无瑕/💎 (8%)</p>
              <p>Ether → 完美 + 💎 (9%)</p>
            </div>
          </div>
          <div>
            <p className="font-semibold text-foreground mb-1.5">⚔️ Combat</p>
            <div className="space-y-0.5 text-muted-foreground">
              <p>Chicken/Cow → 残缺 (3-4%)</p>
              <p>Goblin/Skeleton → 瑕疵 (5-6%)</p>
              <p>Troll/Giant → 普通 (8-9%)</p>
              <p>Dragon → 无瑕 + 💎普通 (11%)</p>
              <p>Fire Dragon → 无瑕/完美 + 💎 (13%)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Socket equipped items */}
      {equippedItems.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Socket — Equipped Items</h2>
          <div className="space-y-2">
            {equippedItems.map(item => (
              <ItemRow key={item.instanceId} item={item} gems={gems}
                onSocket={handleSocket} isPending={socketGem.isPending} isEquipped />
            ))}
          </div>
        </div>
      )}

      {/* Socket loot bag items */}
      {lootWithSockets.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Socket — Loot Bag ({lootWithSockets.length} items with sockets)
          </h2>
          <div className="space-y-2">
            {lootWithSockets.map(item => (
              <ItemRow key={item.instanceId} item={item} gems={gems}
                onSocket={handleSocket} isPending={socketGem.isPending} />
            ))}
          </div>
        </div>
      )}

      {equippedItems.length === 0 && lootWithSockets.length === 0 && totalGems > 0 && (
        <div className="bg-card border border-border rounded-xl p-6 text-center text-muted-foreground">
          <p className="text-sm">No items with sockets available.</p>
          <p className="text-xs mt-1">Fight enemies and craft/drop Uncommon+ items to get sockets.</p>
        </div>
      )}
    </div>
  );
}
