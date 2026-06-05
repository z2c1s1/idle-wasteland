import { useState, useEffect, useRef } from "react";
import { calculateLevel, levelProgress, xpForLevel, formatNumber, getResourceCount, getAgilityBonuses, getTemperatureMultiplier } from "@/lib/game-utils";
import { useStartAction } from "@/hooks/use-game";
import type { GameState } from "@shared/schema";
import type { LucideIcon } from "lucide-react";
import { ResourceIcon, type ResourceType } from "@/components/sprites";
import { getToolBonus } from "@shared/game-data";
import { getPlayerId } from "@/lib/api";
import { api } from "@shared/routes";
import { useQueryClient } from "@tanstack/react-query";

interface ResourceDef {
  name: string;
  emoji: string;
  time: number;
  xp: number;
  reqLevel: number;
  resourceKey: string;
  actionKey: string;
  requiredKey?: string;
  requiredName?: string;
  resourceType?: ResourceType;
}

interface SkillPageProps {
  skillName: string;
  skillXp: number;
  icon: LucideIcon;
  iconColor: string;
  state: GameState;
  resources: ResourceDef[];
}

export function SkillPage({ skillName, skillXp, icon: Icon, iconColor, state, resources }: SkillPageProps) {
  const { mutate: startAction, isPending } = useStartAction();
  const level = calculateLevel(skillXp);
  const progress = levelProgress(skillXp);
  const xpCurrent = xpForLevel(level);
  const xpNext = xpForLevel(level + 1);

  const isGlobalActive = state.activeAction !== "idle";
  const activeResource = resources.find((r) => state.activeAction === r.actionKey) ?? null;

  // Effective cycle time matching server (gathering.ts)
  const toolBonus = getToolBonus(state.tool ?? '{}');
  const agility = getAgilityBonuses(state);
  const tempMul = getTemperatureMultiplier(state);
  const getEffectiveTime = (baseTime: number) => {
    const skill = activeResource?.actionKey?.split('_')[0] ?? '';
    const agilityMul = skill === 'fishing' ? agility.fishingMul : 1;
    return baseTime * toolBonus.timeMult / agilityMul / Math.max(0.1, tempMul);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Icon className={`w-5 h-5 ${iconColor}`} /> {skillName}
        </h1>
        <p className="text-sm text-muted-foreground">等级 {level} · 经验 {formatNumber(skillXp)}</p>
      </div>

      {/* XP Bar */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">经验进度</span>
          <span className="font-bold">{progress.toFixed(1)}%</span>
        </div>
        <div className="h-3 bg-muted/30 rounded-full overflow-hidden border border-border">
          <div className="h-full rounded-full transition-all duration-500 bg-primary" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-[10px] text-muted-foreground text-right">{formatNumber(skillXp)} / {formatNumber(xpNext)} 经验 → {level + 1} 级</p>
      </div>

      {/* Active progress */}
      {activeResource && (
        <ActiveBar name={activeResource.name} cycleTime={getEffectiveTime(activeResource.time)} startMs={new Date(state.actionUpdatedAt as unknown as string).getTime()} onStop={() => startAction("idle")} isPending={isPending} />
      )}

      {/* Resource list */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">采集资源</h2>
        {resources.map(res => {
          const isActive = state.activeAction === res.actionKey;
          const isUnlocked = level >= res.reqLevel;
          const isOtherActive = isGlobalActive && !isActive;
          const owned = getResourceCount(state, res.resourceKey);

          return (
            <div key={res.actionKey}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                !isUnlocked ? "border-border bg-muted/10 opacity-50" :
                isActive    ? "border-primary/40 bg-primary/10" :
                              "border-border bg-card hover:border-primary/40"
              }`}>
              {res.resourceType
                ? <ResourceIcon type={res.resourceType} size={28} className="flex-shrink-0" />
                : <span className="text-2xl flex-shrink-0">{res.emoji}</span>}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium">{res.name}</span>
                  {!isUnlocked && <span className="text-xs text-muted-foreground">（等级 {res.reqLevel}）</span>}
                  {isActive && <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary font-semibold">进行中</span>}
                </div>
                <div className="text-xs text-muted-foreground flex gap-3 mt-0.5 flex-wrap">
                  <span>⏱ {res.time}s</span>
                  <span>⭐ {res.xp} 经验</span>
                  <span>📦 持有 {formatNumber(owned)}</span>
                  {res.requiredKey && (
                    <span className={((state as any)[res.requiredKey] ?? 0) > 0 ? 'text-muted-foreground' : 'text-red-400 font-medium'}>
                      🔧 {res.requiredName ?? res.requiredKey} x{((state as any)[res.requiredKey] ?? 0)}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex-shrink-0">
                {!isUnlocked ? (
                  <span className="px-3 py-1 text-xs text-muted-foreground bg-muted/30 rounded">🔒 {res.reqLevel}级</span>
                ) : isActive ? (
                  <button onClick={() => startAction("idle")} disabled={isPending}
                    className="px-3 py-1 text-xs font-semibold bg-red-600 hover:bg-red-500 text-white rounded">停止</button>
                ) : (
                  <button onClick={() => {
                    if (res.requiredKey && ((state as any)[res.requiredKey] ?? 0) <= 0) return;
                    startAction(res.actionKey);
                  }} disabled={isPending || isOtherActive || !!(res.requiredKey && ((state as any)[res.requiredKey] ?? 0) <= 0)}
                    className="px-3 py-1 text-xs font-semibold bg-primary hover:bg-primary/80 text-primary-foreground rounded disabled:opacity-40">
                    开始
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ActiveBar({ name, cycleTime, startMs, onStop, isPending }: { name: string; cycleTime: number; startMs: number; onStop: () => void; isPending: boolean }) {
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(cycleTime);
  const lastSyncRef = useRef(0);
  const prevStartRef = useRef(startMs);
  const queryClient = useQueryClient();
  const rafRef = useRef<number | null>(null);
  if (startMs !== prevStartRef.current) {
    prevStartRef.current = startMs;
    lastSyncRef.current = 0;
  }

  useEffect(() => {
    function tick() {
      const elapsed = (Date.now() - startMs) / 1000;
      const cycleElapsed = elapsed % cycleTime;
      setProgress((cycleElapsed / cycleTime) * 100);
      setTimeLeft(Math.max(0, cycleTime - cycleElapsed));
      const cycles = Math.floor(elapsed / cycleTime);
      if (cycles > lastSyncRef.current) {
        lastSyncRef.current = cycles;
        fetch(api.game.getState.path, { headers: { "x-player-id": getPlayerId() } })
          .then(r => r.ok && r.json().then(d => queryClient.setQueryData([api.game.getState.path], d)))
          .catch(() => {});
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, [startMs, cycleTime, queryClient]);

  return (
    <div className="bg-card border border-primary/30 rounded-xl p-4 space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">当前进行中</p>
          <p className="text-sm font-semibold">{name}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground tabular-nums">{timeLeft.toFixed(1)}s</span>
          <button onClick={onStop} disabled={isPending}
            className="px-3 py-1 text-xs font-semibold bg-red-600 hover:bg-red-500 text-white rounded disabled:opacity-50">停止</button>
        </div>
      </div>
      <div className="h-3 bg-muted/30 rounded-full overflow-hidden border border-border">
        <div className="h-full bg-primary rounded-full transition-none" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
