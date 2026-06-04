import { useGameState } from "@/hooks/use-game";
import { HOMESTEAD_BUILDINGS } from "@shared/game-data";
import { useToast } from "@/hooks/use-toast";
import type { GameState } from "@shared/schema";
import { getResourceCount, getTemperatureMultiplier } from "@/lib/game-utils";
import { postGame } from "@/lib/api";
import { api } from "@shared/routes";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Home, Flame } from "lucide-react";

const WOOD_NAMES = ["橡木","柳木","柚木","枫木","桃花心木","紫杉木","魔法木","古树木","红杉木","灵木"];

export default function Homestead() {
  const { data: state } = useGameState();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  if (!state) return null;
  const gs = state as GameState;
  const homestead: Record<string, number> = JSON.parse(gs.homestead ?? '{}');
  const furnaceLevel = homestead['furnace'] ?? 0;
  const wood = Array.from({length:10}, (_,i)=>getResourceCount(gs,`wood_${i}`)).reduce((a,b)=>a+b,0);
  const stone = gs.stone ?? 0;
  const temp = gs.temperature ?? 0;
  const tempLabel = temp >= 50 ? '温暖' : temp >= 30 ? '微凉' : temp >= 10 ? '寒冷' : temp > 0 ? '严寒' : '冰冻';
  const tempColor = temp >= 50 ? 'text-orange-400' : temp >= 30 ? 'text-yellow-400' : temp >= 10 ? 'text-blue-400' : temp > 0 ? 'text-cyan-400' : 'text-slate-400';

  const build = async (id: string) => {
    try {
      const next = await postGame(api.game.buildHomestead.path, { buildingId: id });
      queryClient.setQueryData([api.game.getState.path], next);
      toast({ title: '建造成功' });
    } catch (e: unknown) {
      toast({
        title: '建造失败',
        description: e instanceof Error ? e.message : '未知错误',
        variant: 'destructive',
      });
    }
  };

  const addFuel = async (woodTier: number) => {
    try {
      const next = await postGame(api.game.addFuel.path, { woodTier });
      queryClient.setQueryData([api.game.getState.path], next);
      toast({ title: `添加了${WOOD_NAMES[woodTier] ?? `木材${woodTier+1}`}作为燃料` });
    } catch (e: unknown) {
      toast({ title: '添加失败', description: e instanceof Error ? e.message : '未知错误', variant: 'destructive' });
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-4">
      <h1 className="text-xl font-bold flex items-center gap-2"><Home className="w-5 h-5 text-green-400" /> 家园</h1>
      <div className="flex gap-4 text-sm">
        <span>🪵 木材: {wood}</span>
        <span>🪨 石料: {stone}</span>
        <span>💰 金币: {gs.gold}</span>
      </div>

      {/* ─── 火炉 / 温度 ────────────────────────────────────────────────── */}
      {furnaceLevel > 0 && (
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold flex items-center gap-2">
              <Flame className={`w-4 h-4 ${tempColor}`} /> 火炉 Lv.{furnaceLevel}
            </h2>
            <span className={`text-lg font-bold ${tempColor}`}>{temp}°C {tempLabel}</span>
          </div>
          {/* Temperature bar */}
          <div className="h-3 bg-[hsl(220_13%_8%)] rounded overflow-hidden border border-border">
            <div className={`h-full rounded transition-all duration-500 ${
              temp >= 50 ? 'bg-orange-500' : temp >= 30 ? 'bg-yellow-500' : temp >= 10 ? 'bg-blue-500' : 'bg-slate-500'
            }`} style={{ width: `${temp}%` }} />
          </div>
          {temp < 50 && (
            <p className="text-xs text-muted-foreground">
              {temp < 10 ? '⚠️ 严寒！速度大幅降低，生命持续流失' : temp < 30 ? '❄️ 寒冷，速度降低' : '🌬️ 微凉，速度略微降低'}
            </p>
          )}
          {/* Fuel buttons */}
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 10 }, (_, i) => {
              const have = getResourceCount(gs, `wood_${i}`);
              return (
                <button key={i} disabled={have < 1} onClick={() => addFuel(i)}
                  className="px-2 py-1 text-[10px] rounded bg-[hsl(220_13%_8%)] border border-border hover:bg-accent disabled:opacity-30 transition-colors"
                  title={`${WOOD_NAMES[i] ?? `木材${i+1}`} — 提供 ${(i+1)*5}°C`}>
                  🪵{WOOD_NAMES[i] ?? `T${i+1}`} ×{have}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Total buffs summary */}
      <div className="bg-card border border-border rounded-xl p-3">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">家园总加成</h2>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
          {(() => {
            const lv = (id: string) => homestead[id] ?? 0;
            const buffs: { label: string; emoji: string; color: string }[] = [];
            if (lv('shelter') > 0) buffs.push({ label: `+${lv('shelter')*10} HP`, emoji: '❤️', color: 'text-green-300' });
            if (lv('farm') > 0) buffs.push({ label: `+${lv('farm')*3}金/分钟`, emoji: '💰', color: 'text-yellow-300' });
            if (lv('lumbermill') > 0) buffs.push({ label: `-${lv('lumbermill')*3}% 伐木时间`, emoji: '🪓', color: 'text-green-300' });
            if (lv('mine') > 0) buffs.push({ label: `-${lv('mine')*3}% 采矿时间`, emoji: '⛏️', color: 'text-yellow-300' });
            if (lv('workshop') > 0) buffs.push({ label: `-${lv('workshop')*3}% 制作时间`, emoji: '🔨', color: 'text-blue-300' });
            if (lv('wall') > 0) buffs.push({ label: `+${lv('wall')*3} 防御`, emoji: '🛡️', color: 'text-blue-300' });
            if (lv('warehouse') > 0) buffs.push({ label: `+${lv('warehouse')*2} 背包格`, emoji: '📦', color: 'text-purple-300' });
            if (lv('clinic') > 0) buffs.push({ label: `+${lv('clinic')} HP回复/回合`, emoji: '🏥', color: 'text-green-300' });
            if (lv('altar') > 0) buffs.push({ label: `+${lv('altar')*3}% 神话掉率`, emoji: '🔮', color: 'text-red-300' });
            if (lv('tower') > 0) buffs.push({ label: `+${lv('tower')*4}% 战斗经验`, emoji: '🗼', color: 'text-orange-300' });
            if (lv('furnace') > 0) buffs.push({ label: `-${lv('furnace')*15}% 温度衰减`, emoji: '🔥', color: 'text-orange-300' });
            if (lv('recycling') > 0) buffs.push({ label: `${lv('recycling')} 萃取槽`, emoji: '♻️', color: 'text-amber-300' });
            if (lv('radlab') > 0) buffs.push({ label: `+${lv('radlab')*5}% 辐射正面`, emoji: '☢️', color: 'text-lime-300' });
            if (buffs.length === 0) return <span className="text-muted-foreground">暂无建筑加成</span>;
            return buffs.map((b, i) => <span key={i} className={b.color}>{b.emoji} {b.label}</span>);
          })()}
        </div>
      </div>

      {[
        { label: '🏠 常规建筑', filter: (b: any) => !b.id.startsWith('wonder_') && (b.reqTier ?? 1) <= 1 },
        { label: '⚙️ 废土科技', filter: (b: any) => !b.id.startsWith('wonder_') && (b.reqTier ?? 1) >= 2 },
        { label: '🏛️ 奇观', filter: (b: any) => b.id.startsWith('wonder_') },
      ].map(group => {
        const items = HOMESTEAD_BUILDINGS.filter(group.filter)
          .sort((a, b) => (a.reqTier ?? 0) - (b.reqTier ?? 0));
        if (items.length === 0) return null;
        return (
          <div key={group.label} className="space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{group.label}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {items.map(b => {
                const level = homestead[b.id] ?? 0;
                const maxed = level >= b.maxLevel;
                const currentTier = (gs as any).worldTier ?? 1;
                const tierLocked = (b.reqTier ?? 1) > currentTier;
                const canAfford = wood >= b.costWood && stone >= b.costStone && gs.gold >= b.costGold;
                const locked = tierLocked && level === 0;
                return (
                  <div key={b.id} className={`p-3 rounded-xl border text-center transition-colors ${
                    locked ? 'border-border/30 opacity-40' :
                    level>0 ? 'border-green-400 bg-green-500/10' : 'border-border'
                  }`}>
                    <span className="text-2xl">{b.emoji}</span>
                    <p className="text-xs font-bold mt-1">{b.name}</p>
                    <p className="text-[10px] text-muted-foreground">{b.effect}: {b.effectPerLevel}</p>
                    {locked ? (
                      <p className="text-[9px] text-amber-400 mt-1">需世界层级 {b.reqTier}</p>
                    ) : (
                      <>
                        <p className="text-[10px] font-bold mt-1">{level}/{b.maxLevel} 级</p>
                        {!maxed && (
                          <div className="text-[9px] text-muted-foreground mt-1">
                            {b.costWood>0 && <span>🪵{b.costWood} </span>}
                            {b.costStone>0 && <span>🪨{b.costStone} </span>}
                            {b.costGold>0 && <span>💰{b.costGold}</span>}
                          </div>
                        )}
                      </>
                    )}
                    <Button size="sm" disabled={maxed || !canAfford || locked} onClick={() => build(b.id)}
                      className="mt-2 h-6 text-[10px] w-full bg-green-600 hover:bg-green-500">
                      {locked ? '🔒 锁定' : maxed ? '满级' : level === 0 ? '建造' : '升级'}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* ─── 农田 ────────────────────────────────────────────────────────── */}
      {(() => {
        const farmLevel = homestead['farm'] ?? 0;
        if (farmLevel <= 0) return null;
        const slots = farmLevel * 2;
        const farms: Record<string, any> = (() => { try { return JSON.parse((gs as any).farms ?? '{}'); } catch { return {}; } })();
        const berries: Record<string, number> = (() => { try { return JSON.parse(gs.berries ?? '{}'); } catch { return {}; } })();
        const berryList = Object.entries(berries).filter(([,v]) => v > 0);

        const plant = async (slot: number) => {
          if (berryList.length === 0) { toast({ title: '没有可用的种子', variant: 'destructive' }); return; }
          const seed = berryList[0][0]; // 使用第一个可用的种子
          try {
            const next = await postGame(api.game.farmPlant.path, { slot, seed });
            queryClient.setQueryData([api.game.getState.path], next);
            toast({ title: '种植成功' });
          } catch (e: any) { toast({ title: '种植失败', description: e.message, variant: 'destructive' }); }
        };
        const harvest = async (slot: number) => {
          try {
            const next = await postGame(api.game.farmHarvest.path, { slot });
            queryClient.setQueryData([api.game.getState.path], next);
            toast({ title: '收获成功' });
          } catch (e: any) { toast({ title: '收获失败', description: e.message, variant: 'destructive' }); }
        };

        return (
          <div className="space-y-2">
            <h2 className="text-sm font-bold flex items-center gap-2">🌾 农田 ({slots} 槽位)</h2>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: slots }, (_, i) => {
                const plot = farms[String(i)];
                const now = Date.now();
                const ready = plot && (now - plot.plantedAt) / 1000 >= plot.growTime;
                const remaining = plot ? Math.max(0, Math.ceil((plot.growTime - (now - plot.plantedAt) / 1000) / 60)) : 0;
                return (
                  <div key={i} className={`p-2 rounded-lg border text-center text-xs ${
                    plot ? (ready ? 'border-green-400 bg-green-500/10' : 'border-yellow-400/30 bg-yellow-500/5') : 'border-border bg-card'
                  }`}>
                    {plot ? (
                      <button onClick={() => ready ? harvest(i) : null} className="w-full">
                        <span className="text-lg">{ready ? '🌱' : '🌰'}</span>
                        <p className="text-[9px] mt-1">{plot.seed}</p>
                        {ready ? (
                          <span className="text-[9px] text-green-400">可收获</span>
                        ) : (
                          <span className="text-[9px] text-muted-foreground">{remaining}分</span>
                        )}
                      </button>
                    ) : (
                      <button onClick={() => plant(i)} className="w-full text-muted-foreground hover:text-foreground">
                        <span className="text-lg">➕</span>
                        <p className="text-[9px]">种植</p>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
