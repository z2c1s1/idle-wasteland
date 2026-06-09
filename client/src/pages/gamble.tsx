import { useGameState, useGamble } from "@/hooks/use-game";
import { useToast } from "@/hooks/use-toast";
import { GAMBLE_TIERS, ALL_SLOTS, SLOT_LABEL, RARITY_COLOR, RARITY_LABEL, type Rarity } from "@shared/game-data";
import { getCombatLevel, formatNumber } from "@/lib/game-utils";
import type { GameState } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dice1 } from "lucide-react";

export default function Gamble() {
  const { data: state } = useGameState();
  const gambleMut = useGamble();
  const { toast } = useToast();
  const [tier, setTier] = useState(0);
  const [slot, setSlot] = useState<string | undefined>(undefined);
  if (!state) return null;
  const gs = state as GameState;
  const cl = getCombatLevel(gs);
  const tierDef = GAMBLE_TIERS[tier];
  const cost = tierDef ? tierDef.costPerLevel * Math.max(1, cl) : 0;

  const gamble = async () => {
    try {
      await gambleMut.mutateAsync({ tierIdx: tier, slot });
      toast({ title: "赌博完成，查看战利品袋" });
    } catch (e: unknown) {
      toast({
        title: "赌博失败",
        description: e instanceof Error ? e.message : "未知错误",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-5 bg-card rounded-xl border border-border">
      <h1 className="text-xl font-bold flex items-center gap-2"><Dice1 className="w-5 h-5 text-yellow-400" /> 装备赌博</h1>
      <p className="text-sm text-muted-foreground">战斗等级 {cl} · 金币 {formatNumber(gs.gold)}</p>

      <div className="grid grid-cols-3 gap-2">
        {GAMBLE_TIERS.map((t,i) => {
          const tc = t.costPerLevel * Math.max(1, cl);
          return (
            <button key={t.id} onClick={() => setTier(i)}
              className={`p-3 rounded-xl border text-center transition-colors ${i===tier ? 'border-yellow-400 bg-yellow-500/10' : 'border-border hover:border-muted-foreground'}`}>
              <p className="text-lg">{t.emoji}</p>
              <p className="text-xs font-bold">{t.name}</p>
              <p className="text-[10px] text-muted-foreground">{formatNumber(tc)} 金</p>
            </button>
          );
        })}
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setSlot(undefined)} className={`px-2 py-1 text-xs rounded ${!slot ? 'bg-yellow-500/20 border border-yellow-400' : 'border border-border'}`}>随机</button>
        {ALL_SLOTS.map(s => (
          <button key={s} onClick={() => setSlot(s)}
            className={`px-2 py-1 text-xs rounded ${slot===s ? 'bg-yellow-500/20 border border-yellow-400' : 'border border-border'}`}>
            {SLOT_LABEL[s]}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-4 space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase">概率预览</h2>
        <div className="flex gap-2 text-xs">
          {tierDef?.rarities.map(r => (
            <span key={r.rarity} className={RARITY_COLOR[r.rarity]}>{RARITY_LABEL[r.rarity]} {r.weight}%</span>
          ))}
          {tierDef?.uniqueChance > 0 && <span className="text-orange-400">暗金 {(tierDef.uniqueChance*100).toFixed(1)}%</span>}
        </div>
        <p className="text-[10px] text-muted-foreground">ilvl: {Math.max(1, cl - tierDef?.ilvlSpread)} ~ {cl + (tierDef?.ilvlSpread||0)}</p>
      </div>

      <Button onClick={gamble} disabled={gs.gold < cost} className="w-full bg-yellow-600 hover:bg-yellow-500">
        赌博 ({formatNumber(cost)} 金)
      </Button>
    </div>
  );
}
