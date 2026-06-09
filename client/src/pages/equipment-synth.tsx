import { useGameState, useSynthEquip } from "@/hooks/use-game";
import { parseLootBag, parseEquipment, formatNumber, calculateLevel } from "@/lib/game-utils";
import { SLOT_LABEL, RARITY_LABEL, type Rarity, type GameItem, type EquipmentSlot } from "@shared/game-data";
import { getCombatLevel } from "@shared/game-math";
import type { GameState } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ItemCard } from "@/components/inventory/item-card";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Hammer, ArrowUpDown } from "lucide-react";

const RARITY_ORDER: Record<string, number> = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4, mythic: 5 };
const ALL_SLOTS_FILTER: (EquipmentSlot | 'all')[] = ['all', 'weapon', 'offhand', 'helmet', 'chest', 'legs', 'gloves', 'boots', 'ring', 'neck'];
const ALL_RARITIES: (Rarity | 'all')[] = ['all', 'common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];
const ATTR_OPTIONS = [
  { key: 'all', label: '全部' },
  { key: 'critRating', label: '暴击' },
  { key: 'hpBonus', label: '生命' },
  { key: 'attackBonus', label: '攻击' },
  { key: 'defenceBonus', label: '防御' },
  { key: 'enhancedDamage', label: '增伤' },
  { key: 'lifeOnKill', label: '击杀回血' },
  { key: 'crushingBlow', label: '粉碎打击' },
  { key: 'magicFind', label: '寻魔' },
  { key: 'lifeRegen', label: '生命回复' },
  { key: 'resistAll', label: '全抗' },
];

export default function EquipmentSynth() {
  const { data: state } = useGameState();
  const synthEquip = useSynthEquip();
  const { toast } = useToast();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');
  const [filterSlot, setFilterSlot] = useState<string>('all');
  const [filterRarity, setFilterRarity] = useState<string>('all');
  const [filterAttr, setFilterAttr] = useState<string>('all');
  if (!state) return null;
  const gs = state as GameState;
  const loot = parseLootBag(gs.lootBag);
  const equipment = parseEquipment(gs.equipment);

  // Filter & sort (inline, no useMemo to avoid stale closure with rapid polling)
  const filteredLoot = (() => {
    let result = [...loot];
    if (filterSlot !== 'all') result = result.filter(i => i.slot === filterSlot);
    if (filterRarity !== 'all') result = result.filter(i => i.rarity === filterRarity);
    if (filterAttr !== 'all') {
      result = result.filter(i => {
        const val = (i as any)[filterAttr];
        return val !== undefined && val > 0;
      });
    }
    result.sort((a, b) => {
      const rDiff = (RARITY_ORDER[a.rarity] ?? 0) - (RARITY_ORDER[b.rarity] ?? 0);
      if (rDiff !== 0) return sortDir === 'desc' ? -rDiff : rDiff;
      return sortDir === 'desc' ? b.ilvl - a.ilvl : a.ilvl - b.ilvl;
    });
    return result;
  })();

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else if (next.size < 5) next.add(id);
      return next;
    });
  };

  const selectedItems = filteredLoot.filter(i => selected.has(i.instanceId));
  // Cost = baseGold × rarityWeight × ilvlFactor, summed per item
  const RARITY_WEIGHT: Record<string, number> = {
    common: 0.2, uncommon: 0.6, rare: 1.0, epic: 1.8, legendary: 3.0, mythic: 5.0,
  };
  const count = selectedItems.length;
  const chance = count === 3 ? '25%' : count === 4 ? '50%' : count === 5 ? '100%' : '—';
  const avgIlvl = count > 0 ? Math.max(1, Math.floor(selectedItems.reduce((s,i) => s + i.ilvl, 0) / count) - 5) : 0;
  const combatLevel = getCombatLevel(gs);
  const baseGold = 500 + combatLevel * 300;
  const baseGoldCost = count >= 3
    ? selectedItems.reduce((sum, item) => {
        const ilvlFactor = item.ilvl / 10; // ilvl 1→0.1x, ilvl 100→10x, ilvl 200→20x
        return sum + baseGold * (RARITY_WEIGHT[item.rarity] ?? 0.6) * ilvlFactor;
      }, 0)
    : 0;
  const synthLevel = calculateLevel((gs as any).synthesisXp ?? 0);
  const discount = Math.min(0.5, synthLevel / 200); // max 50% discount at synthesis level 100
  const goldCost = count >= 3 ? Math.max(1, Math.floor(baseGoldCost * (1 - discount))) : 0;

  const synth = async () => {
    if (count < 3) return;
    try {
      await synthEquip.mutateAsync(Array.from(selected));
      toast({ title: "合成完成" });
      setSelected(new Set());
    } catch (e: unknown) {
      toast({
        title: "合成失败",
        description: e instanceof Error ? e.message : "未知错误",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-4 bg-card rounded-xl border border-border">
      <h1 className="text-xl font-bold flex items-center gap-2">
        <Hammer className="w-5 h-5 text-amber-400" /> 装备合成
      </h1>
      <p className="text-sm text-muted-foreground">合成等级 {synthLevel} · 金币折扣 {synthLevel}%</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Loot bag */}
        <div className="bg-card border border-border rounded-xl p-3 max-h-[500px] overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase">战利品袋 ({filteredLoot.length}/{loot.length})</h2>
            <button onClick={() => setSortDir(d => d === 'desc' ? 'asc' : 'desc')}
              className="p-1 rounded hover:bg-muted/30 text-muted-foreground" title={sortDir === 'desc' ? '降序：高品高等级优先' : '升序：低品低等级优先'}>
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
          {/* Filter bar — buttons, not selects, to avoid React controlled-select issues */}
          <div className="flex flex-wrap gap-1 mb-3">
            {ALL_SLOTS_FILTER.map(s => (
              <button key={s} onClick={() => setFilterSlot(s)}
                className={`text-[10px] px-1.5 py-0.5 rounded border transition-colors ${
                  filterSlot === s ? 'border-amber-400 bg-amber-500/10 text-amber-300' : 'border-border text-muted-foreground hover:border-muted-foreground'
                }`}>
                {s === 'all' ? '全部' : SLOT_LABEL[s]}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1 mb-3">
            {ALL_RARITIES.map(r => (
              <button key={r} onClick={() => setFilterRarity(r)}
                className={`text-[10px] px-1.5 py-0.5 rounded border transition-colors ${
                  filterRarity === r ? 'border-amber-400 bg-amber-500/10 text-amber-300' : 'border-border text-muted-foreground hover:border-muted-foreground'
                }`}>
                {r === 'all' ? '全部' : RARITY_LABEL[r]}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1 mb-3">
            {ATTR_OPTIONS.map(a => (
              <button key={a.key} onClick={() => setFilterAttr(a.key)}
                className={`text-[10px] px-1.5 py-0.5 rounded border transition-colors ${
                  filterAttr === a.key ? 'border-amber-400 bg-amber-500/10 text-amber-300' : 'border-border text-muted-foreground hover:border-muted-foreground'
                }`}>
                {a.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-1.5" key={`${filterSlot}|${filterRarity}|${filterAttr}|${sortDir}`}>
            {filteredLoot.map(item => {
              const sel = selected.has(item.instanceId);
              return (
                <div key={item.instanceId}
                  onClick={() => toggle(item.instanceId)}
                  className={`relative rounded-lg cursor-pointer transition-all ${
                    sel ? 'ring-2 ring-amber-400 scale-95' : 'hover:scale-105'
                  }`}>
                  <ItemCard item={item} compact />
                  {sel && (
                    <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-xs text-black font-bold">
                      {Array.from(selected).indexOf(item.instanceId) + 1}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Synth panel */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <h2 className="text-sm font-semibold text-amber-400 uppercase">合成预览</h2>
          <div className="flex gap-2 flex-wrap min-h-[60px] border border-dashed border-border rounded-lg p-3 items-start">
            {selectedItems.map(item => (
              <div key={item.instanceId} className="cursor-pointer" onClick={() => toggle(item.instanceId)} title="点击移除">
                <ItemCard item={item} compact />
              </div>
            ))}
            {count === 0 && <span className="text-xs text-muted-foreground">点击左侧装备选择3-5件</span>}
          </div>

          {count > 0 && (
            <div className="text-xs space-y-1 p-2 bg-muted/20 rounded">
              <p>数量: <span className="font-bold">{count}</span> · 成功率: <span className={count===5?'text-green-400':'text-yellow-400'}>{chance}</span></p>
              <p>输出ilvl: <span className="font-bold">{avgIlvl}</span> (平均-5)</p>
              {count >= 3 && <p>金币消耗: <span className={gs.gold >= goldCost ? 'text-green-400' : 'text-red-400'}>{formatNumber(goldCost)}</span></p>}
              {count >= 3 && selectedItems.every(i => i.slot === selectedItems[0].slot) && (
                <p className="text-green-300">✓ 同位置合成 → {SLOT_LABEL[selectedItems[0].slot]}</p>
              )}
            </div>
          )}

          <Button onClick={synth} disabled={count < 3 || gs.gold < goldCost} className="w-full bg-amber-600 hover:bg-amber-500">
            {count < 3 ? `选 ${3-count} 件` : gs.gold < goldCost ? '金币不足' : `合成 (${formatNumber(goldCost)} 金)`}
          </Button>
          <p className="text-[10px] text-muted-foreground">3件25% · 4件50% · 5件100% · 失败消耗金币和材料</p>
        </div>
      </div>
    </div>
  );
}
