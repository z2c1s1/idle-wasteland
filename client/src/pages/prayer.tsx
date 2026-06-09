import { useGameState } from "@/hooks/use-game";
import { PRAYERS, getPrayerLevel } from "@shared/game-data";
import { postGame } from "@/lib/api";
import { api } from "@shared/routes";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { CandlestickChart } from "lucide-react";
import { useUIText } from "@/lib/i18n";
import type { GameState } from "@shared/schema";
import { calculateLevel } from "@/lib/game-utils";

export default function Prayer() {
  const { data: state } = useGameState();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const t = useUIText();
  const pc = t.pages.crafting;
  if (!state) return null;
  const gs = state as GameState;
  const activePrayer = gs.activePrayer ?? '';
  const prayerXp = gs.prayerXp ?? 0;
  const pLevel = getPrayerLevel(prayerXp);
  const bones = gs.bones ?? 0;
  const dragonBones = gs.dragonBones ?? 0;

  const activate = async (prayerId: string) => {
    try {
      const next = await postGame(api.game.activatePrayer.path, { prayerId });
      queryClient.setQueryData([api.game.getState.path], next);
      toast({ title: '祷言已激活' });
    } catch (e: unknown) {
      toast({ title: '激活失败', description: e instanceof Error ? e.message : '未知错误', variant: 'destructive' });
    }
  };

  const deactivate = async () => {
    try {
      const next = await postGame(api.game.deactivatePrayer.path);
      queryClient.setQueryData([api.game.getState.path], next);
      toast({ title: '祷言已停用' });
    } catch (e: unknown) {
      toast({ title: '停用失败', description: e instanceof Error ? e.message : '未知错误', variant: 'destructive' });
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4 bg-card rounded-xl border border-border">
      <h1 className="text-xl font-bold flex items-center gap-2">
        <CandlestickChart className="w-5 h-5 text-amber-400" /> {pc.prayer}
      </h1>

      {/* Resources */}
      <div className="flex gap-4 text-sm">
        <span>🦴 骨头: {bones}</span>
        <span>🐉 龙骨: {dragonBones}</span>
        <span>📖 祷言等级: {pLevel}</span>
      </div>

      {activePrayer && (
        <div className="bg-amber-500/10 border border-amber-400/40 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-amber-400">
              {PRAYERS.find(p => p.id === activePrayer)?.emoji} {PRAYERS.find(p => p.id === activePrayer)?.name} 生效中
            </span>
            <button onClick={deactivate}
              className="px-3 py-1 text-xs rounded bg-red-600/30 hover:bg-red-500/40 text-red-300 transition-colors">
              停用
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            每秒消耗 1 根骨头 · 祈愿等级 {pLevel} · 
            当前加成: {(() => {
              const p = PRAYERS.find(p => p.id === activePrayer);
              if (!p) return 0;
              return p.baseBuff + (pLevel - 1) * p.buffPerLevel;
            })()}%
          </p>
        </div>
      )}

      <div className="grid gap-3">
        {PRAYERS.map(p => {
          const buff = p.baseBuff + (pLevel - 1) * p.buffPerLevel;
          const isActive = activePrayer === p.id;
          const costPerSec = 1;
          return (
            <div key={p.id} className={`p-4 rounded-xl border transition-colors ${
              isActive ? 'border-amber-400 bg-amber-500/10' : 'border-border bg-card'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{p.emoji}</span>
                  <div>
                    <p className="font-bold text-sm">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.effect} +{buff}%</p>
                  </div>
                </div>
                <button
                  disabled={isActive || bones < costPerSec}
                  onClick={() => activate(p.id)}
                  className={`px-3 py-1.5 text-xs rounded font-semibold transition-colors ${
                    isActive
                      ? 'bg-amber-600/30 text-amber-400 cursor-default'
                      : 'bg-amber-600 hover:bg-amber-500 text-white disabled:opacity-30'
                  }`}>
                  {isActive ? '生效中' : '激活'}
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2">
                🦴 {costPerSec} 骨头/秒 · 龙骨双倍经验
              </p>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        祈愿越久，等级越高，加成越强。骨头耗尽时自动停用。
      </p>
    </div>
  );
}
