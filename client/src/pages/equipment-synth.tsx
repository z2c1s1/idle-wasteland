import { useGameState, useSynthEquip } from "@/hooks/use-game";
import { parseLootBag, parseEquipment, formatNumber, calculateLevel } from "@/lib/game-utils";
import { SLOT_LABEL, RARITY_COLOR, RARITY_LABEL, RARITY_BORDER, RARITY_BG, type Rarity, type GameItem } from "@shared/game-data";
import type { GameState } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Hammer, Trash2 } from "lucide-react";

export default function EquipmentSynth() {
  const { data: state } = useGameState();
  const synthEquip = useSynthEquip();
  const { toast } = useToast();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  if (!state) return null;
  const gs = state as GameState;
  const loot = parseLootBag(gs.lootBag);
  const equipment = parseEquipment(gs.equipment);

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else if (next.size < 5) next.add(id);
      return next;
    });
  };

  const selectedItems = loot.filter(i => selected.has(i.instanceId));
  const count = selectedItems.length;
  const chance = count === 3 ? '25%' : count === 4 ? '50%' : count === 5 ? '100%' : '—';
  const costMul = count === 3 ? 1 : count === 4 ? 2 : 5;
  const avgIlvl = count > 0 ? Math.max(1, Math.floor(selectedItems.reduce((s,i) => s + i.ilvl, 0) / count) - 5) : 0;
  const baseGoldCost = count > 0 ? Math.floor(avgIlvl * 50 * costMul) : 0;
  const synthLevel = calculateLevel((gs as any).synthesisXp ?? 0);
  const discount = synthLevel / 100;
  const goldCost = Math.max(1, Math.floor(baseGoldCost * (1 - discount)));

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
    <div className="p-4 max-w-6xl mx-auto space-y-4">
      <h1 className="text-xl font-bold flex items-center gap-2">
        <Hammer className="w-5 h-5 text-amber-400" /> 装备合成
      </h1>
      <p className="text-sm text-muted-foreground">合成等级 {synthLevel} · 金币折扣 {synthLevel}%</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Loot bag */}
        <div className="bg-card border border-border rounded-xl p-3 max-h-[500px] overflow-y-auto">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase mb-2">战利品袋 ({loot.length})</h2>
          <div className="space-y-1">
            {loot.map(item => {
              const sel = selected.has(item.instanceId);
              return (
                <div key={item.instanceId}
                  onClick={() => toggle(item.instanceId)}
                  className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${sel ? 'border-amber-400 bg-amber-500/10' : 'border-border hover:border-muted-foreground'}`}>
                  <span className="text-lg">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold truncate ${RARITY_COLOR[item.rarity]}`}>{item.name}</p>
                    <p className="text-[10px] text-muted-foreground">{SLOT_LABEL[item.slot]} · ilvl {item.ilvl} · {RARITY_LABEL[item.rarity]}</p>
                  </div>
                  {sel && <span className="text-amber-400 text-sm">✓</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Synth panel */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <h2 className="text-sm font-semibold text-amber-400 uppercase">合成预览</h2>
          <div className="flex gap-2 flex-wrap min-h-[60px] border border-dashed border-border rounded-lg p-3">
            {selectedItems.map(item => (
              <span key={item.instanceId} className="text-xl" title={item.name}>{item.emoji}</span>
            ))}
            {count === 0 && <span className="text-xs text-muted-foreground">点击左侧装备选择3-5件</span>}
          </div>

          {count > 0 && (
            <div className="text-xs space-y-1 p-2 bg-muted/20 rounded">
              <p>数量: <span className="font-bold">{count}</span> · 成功率: <span className={count===5?'text-green-400':'text-yellow-400'}>{chance}</span></p>
              <p>输出ilvl: <span className="font-bold">{avgIlvl}</span> (平均-5)</p>
              <p>金币消耗: <span className={gs.gold >= goldCost ? 'text-green-400' : 'text-red-400'}>{formatNumber(goldCost)}</span></p>
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
