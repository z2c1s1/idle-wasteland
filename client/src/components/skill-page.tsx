import React, { useState, useEffect, useRef } from "react";
import { useUIText } from "@/lib/i18n";
import { calculateLevel, levelProgress, xpForLevel, formatNumber, getResourceCount, getAgilityBonuses, getTemperatureMultiplier } from "@/lib/game-utils";
import { useStartAction } from "@/hooks/use-game";
import type { GameState } from "@shared/schema";
import type { LucideIcon } from "lucide-react";
import { ResourceIcon, type ResourceType } from "@/components/sprites";
import { getToolBonus } from "@shared/game-data";
import { getPlayerId } from "@/lib/api";
import { api } from "@shared/routes";
import { getPetSpeedMultiplier } from "@/lib/action-cycle";
import { useQueryClient } from "@tanstack/react-query";
import { WorkstationLayout, RustFrame } from "@/components/wasteland";
import { SCAVENGE_SKILLS } from "@/lib/scavenge-skills";

interface DropItem {
  name: string;
  qty: string | number;
  chance: string;
}

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
  extraHint?: string;
  drops?: DropItem[];
}

interface SkillPageProps {
  skillKey?: string;
  skillName: string;
  skillXp: number;
  icon: LucideIcon;
  iconColor: string;
  state: GameState;
  resources: ResourceDef[];
}

export function SkillPage({ skillKey, skillName, skillXp, icon: Icon, iconColor, state, resources }: SkillPageProps) {
  const t = useUIText();
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
    const petSpeedMul = getPetSpeedMultiplier(state, skill);
    return baseTime * toolBonus.timeMult / agilityMul / Math.max(0.1, tempMul) / petSpeedMul;
  };

  const isScavenge = skillKey != null && SCAVENGE_SKILLS.some(s => s.id === skillKey);
  const zoneLabel = isScavenge ? t.dashboard.scavengeZone : undefined;

  return (
    <WorkstationLayout
      skillName={skillName}
      subtitle={t.skillPage.subtitle(level, formatNumber(skillXp))}
      icon={Icon}
      iconColor={iconColor}
      zoneLabel={zoneLabel}
    >
      {/* XP Bar */}
      <RustFrame className="space-y-2 p-4">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">{t.skillPage.xpProgress}</span>
          <span className="font-bold">{progress.toFixed(1)}%</span>
        </div>
        <div className="h-3 bg-muted/30 rounded-full overflow-hidden border border-border">
          <div className="h-full rounded-full transition-all duration-500 bg-primary" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-[10px] text-muted-foreground text-right">{t.skillPage.xpToLevel(formatNumber(skillXp), formatNumber(xpNext), level + 1)}</p>
      </RustFrame>

      {/* Mastery */}
      {(() => {
        const key = skillKey || skillName.toLowerCase().replace(/\s+/g, '');
        const mastery: Record<string, number> = (() => { try { return JSON.parse((state as any).mastery ?? '{}'); } catch { return {}; } })();
        const count = mastery[key] ?? 0;
        if (count === 0) return null;
        return (
          <RustFrame className="flex items-center gap-3 p-3">
            <span className="text-lg">⭐</span>
            <div>
              <p className="text-xs font-semibold text-amber-400">Mastery</p>
              <p className="text-[10px] text-muted-foreground">{formatNumber(count)} actions completed</p>
            </div>
          </RustFrame>
        );
      })()}

      {/* Temperature warning */}
      {tempMul < 1 && (
        <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-400/30 rounded-lg p-3 text-xs">
          <span className="text-lg">❄️</span>
          <div className="flex-1">
            <p className="font-semibold text-blue-300">寒冷影响</p>
            <p className="text-blue-200/70">
              温度过低，行动速度降低 {Math.round((1 - tempMul) * 100)}%。
              前往 <a href="/shelter" className="underline text-amber-400 hover:text-amber-300">营地生火</a> 恢复。
            </p>
          </div>
        </div>
      )}

      {/* Active progress */}
      {activeResource && (
        <ActiveBar name={activeResource.name} cycleTime={getEffectiveTime(activeResource.time)} startMs={new Date(state.actionUpdatedAt as unknown as string).getTime()} onStop={() => startAction("idle")} isPending={isPending} />
      )}

      {/* Resource list */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t.skillPage.gatheringResources}</h2>
        {resources.map(res => {
          const isActive = state.activeAction === res.actionKey;
          const isUnlocked = level >= res.reqLevel;
          const isOtherActive = isGlobalActive && !isActive;
          const owned = getResourceCount(state, res.resourceKey);

          const rowClass = isActive
            ? "border-[hsl(var(--crt-green)/0.4)] bg-[hsl(120_30%_8%)]"
            : "border-[hsl(var(--border-rust))] bg-[hsl(var(--card))] hover:border-[hsl(var(--crt-green)/0.3)]";

          return (
            <div key={res.actionKey} className={`border transition-colors ${rowClass}`}>
            <div
              className={`flex items-center gap-3 p-3 ${res.drops && res.drops.length > 0 ? 'pb-1' : ''}`}>
              {res.resourceType
                ? <ResourceIcon type={res.resourceType} size={42} tier={parseInt(res.resourceKey.split('_')[1] ?? '0') || 0} className="flex-shrink-0" />
                : <span className="text-4xl flex-shrink-0">{res.emoji}</span>}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium">{res.name}</span>
                  {!isUnlocked && <span className="text-xs text-muted-foreground">（{t.skillPage.levelLocked(res.reqLevel)}）</span>}
                  {isActive && <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary font-semibold">{t.skillPage.activeBadge}</span>}
                </div>
                <div className="text-xs text-muted-foreground flex gap-3 mt-0.5 flex-wrap">
                  <span>{t.skillPage.timeSeconds(res.time)}{tempMul < 1 ? <span className="text-blue-300 ml-1">❄️ {t.skillPage.timeSeconds(Math.round(res.time / tempMul))}</span> : ''}</span>
                  <span>{t.skillPage.xpGain(res.xp)}</span>
                  <span>{t.skillPage.resourceOwned(formatNumber(owned))}</span>
                  {res.requiredKey && (
                    <span className={((state as any)[res.requiredKey] ?? 0) > 0 ? 'text-muted-foreground' : 'text-red-400 font-medium'}>
                      🔧 {res.requiredName ?? res.requiredKey} x{((state as any)[res.requiredKey] ?? 0)}
                    </span>
                  )}
                  {res.extraHint && <span className="text-muted-foreground text-xs">{res.extraHint}</span>}
                </div>
              </div>
              <div className="flex-shrink-0">
                {!isUnlocked ? (
                  <span className="px-3 py-1 text-xs text-muted-foreground bg-muted/30 rounded">{t.skillPage.lockedLabel(res.reqLevel)}</span>
                ) : isActive ? (
                  <button onClick={() => startAction("idle")} disabled={isPending}
                    className="px-3 py-1 text-xs font-semibold bg-red-600 hover:bg-red-500 text-white rounded">{t.skillPage.stop}</button>
                ) : (
                  <button onClick={() => {
                    if (res.requiredKey && ((state as any)[res.requiredKey] ?? 0) <= 0) return;
                    startAction(res.actionKey);
                  }} disabled={isPending || isOtherActive || !!(res.requiredKey && ((state as any)[res.requiredKey] ?? 0) <= 0)}
                    className="px-3 py-1 text-xs font-semibold bg-primary hover:bg-primary/80 text-primary-foreground rounded disabled:opacity-40">
                    {t.skillPage.start}
                  </button>
                )}
              </div>
            </div>
            {/* Detailed drops — inline like combat drops */}
            {res.drops && res.drops.length > 0 && (
              <div className="ml-9 flex flex-wrap gap-x-2 gap-y-0 text-[10px] text-muted-foreground px-3 pb-2">
                {res.drops!.map((d, di) => (
                  <span key={di}>{d.name}{d.qty !== 1 && d.qty !== '' ? ` ×${d.qty}` : ''} {d.chance}{di < res.drops!.length - 1 ? ' · ' : ''}</span>
                ))}
              </div>
            )}
            </div>
          );
        })}
      </div>
    </WorkstationLayout>
  );
}

function ActiveBar({ name, cycleTime, startMs, onStop, isPending }: { name: string; cycleTime: number; startMs: number; onStop: () => void; isPending: boolean }) {
  const t = useUIText();
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
    <RustFrame className="space-y-2 border-[hsl(var(--crt-green)/0.3)] p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{t.skillPage.activeTitle}</p>
          <p className="text-sm font-semibold">{name}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground tabular-nums">{timeLeft.toFixed(1)}s</span>
          <button onClick={onStop} disabled={isPending}
            className="px-3 py-1 text-xs font-semibold bg-red-600 hover:bg-red-500 text-white rounded disabled:opacity-50">{t.skillPage.stop}</button>
        </div>
      </div>
      <div className="h-3 overflow-hidden border border-[hsl(var(--border-rust))] bg-[hsl(var(--background))]">
        <div className="progress-bar-fill h-full transition-none" style={{ width: `${progress}%` }} />
      </div>
    </RustFrame>
  );
}


