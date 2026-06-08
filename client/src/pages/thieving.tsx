import { useEffect, useRef, useState } from "react";
import { useGameState } from "@/hooks/use-game";
import { useStartAction } from "@/hooks/use-game";
import { useUIText } from "@/lib/i18n";
import { THIEVING_NPCS, calcStealth, calcThievingSuccessRate, calcThievingDoubleRate, type ThievingNPC } from "@shared/game-data";
import { calculateLevel, formatNumber, parseEquipment, getEquipmentStats } from "@/lib/game-utils";
import type { GameState } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { HandMetal, ShieldAlert, Star, Lock, Coins, Eye } from "lucide-react";

const NPC_TILES: Record<string, string> = {
  drunkard: '061_流浪汉', beggar: '062_废墟乞丐', peddler: '063_废品商人',
  scavenger: '064_废土行商', smuggler: '065_黑市走私犯', raider: '066_废土掠夺者',
  trader: '067_废土商人', warlord: '068_废土军阀', banker: '069_避难所银行家',
  ancient_king: '070_废土统治者',
};

function NpcIcon({ npcId }: { npcId: string }) {
  const name = NPC_TILES[npcId];
  if (!name) return <span className="text-2xl">👤</span>;
  return <img src={`/tiles/${name}.png`} alt="" style={{ width: 32, height: 32, imageRendering: 'pixelated', flexShrink: 0 }} />;
}
import { getPlayerId } from "@/lib/api";
import { api } from "@shared/routes";
import { useQueryClient } from "@tanstack/react-query";

export default function Thieving() {
  const { data: state } = useGameState();
  const startAction = useStartAction();
  if (!state) return null;
  const gs = state as GameState;

  const t = useUIText();
  const thievingLevel = calculateLevel(gs.thievingXp ?? 0);
  const equipment = parseEquipment(gs.equipment);
  const { critRating } = getEquipmentStats(gs);
  const stealth = calcStealth(thievingLevel, critRating);

  const isThieving = gs.activeAction.startsWith("thieve_");
  const activeNpcId = isThieving ? gs.activeAction.replace("thieve_", "") : null;

  // Check hidden NPC unlock conditions
  function isUnlocked(npc: ThievingNPC): boolean {
    if (!npc.hidden) return true;
    const cond = npc.unlockCondition ?? "";
    if (cond === 'thieving_60') return thievingLevel >= 60;
    if (cond === 'shadow_maze') return true; // simplified — dungeon clear check
    if (cond === 'any_amulet') return Object.values(equipment).some(item => item?.slot === 'neck');
    if (cond === 'dragon_tomb') return true; // simplified
    if (cond === 'chaos_forge') return true; // simplified
    return false;
  }

  const npcs = THIEVING_NPCS.filter(n => !n.hidden || isUnlocked(n));

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <HandMetal className="w-5 h-5 text-purple-400" /> {t.pages.thieving.title}
        </h1>
        <p className="text-sm text-muted-foreground">等级 {thievingLevel} · 潜行值 {stealth} · {npcs.filter(n => !n.hidden).length} 个目标</p>
      </div>

      {/* Stealth stat bar */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t.pages.thieving.stealthSkill}</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-muted/20 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground">{t.pages.thieving.stealth}</p>
            <p className="text-lg font-bold text-purple-400">{stealth}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">等级 ×2 + 暴击×0.5</p>
          </div>
          <div className="bg-muted/20 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground">{t.pages.thieving.level}</p>
            <p className="text-lg font-bold text-purple-300">{thievingLevel}</p>
          </div>
          <div className="bg-muted/20 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground">{t.pages.thieving.xpPer}</p>
            <p className="text-lg font-bold">{formatNumber(gs.thievingXp ?? 0)}</p>
          </div>
        </div>
      </div>

      {/* Active thieving progress */}
      {isThieving && activeNpcId && (() => {
        const npc = THIEVING_NPCS.find(n => n.id === activeNpcId);
        if (!npc) return null;
        return (
          <div className="bg-card border border-primary/30 rounded-xl p-4 space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{t.pages.thieving.activeTarget}</p>
                <p className="text-sm font-semibold">{npc.emoji} {npc.name}</p>
              </div>
              <button onClick={() => startAction.mutate("idle")}
                className="px-3 py-1 text-xs font-semibold bg-red-600 hover:bg-red-500 text-white rounded">{t.pages.thieving.stop}</button>
            </div>
            <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
              <ThievingBar startMs={new Date(gs.actionUpdatedAt as unknown as string).getTime()} cycleTime={npc.interval} />
            </div>
          </div>
        );
      })()}

      {/* NPC list */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t.pages.thieving.selectTarget}</h2>
        {npcs.map(npc => {
          const locked = thievingLevel < npc.level;
          const isActive = activeNpcId === npc.id;
          const sRate = calcThievingSuccessRate(stealth, npc.perception);
          const dRate = calcThievingDoubleRate(stealth, npc.perception);
          const avgGp = Math.floor((npc.gpMin + npc.gpMax) / 2);

          return (
            <div key={npc.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                locked   ? "border-border bg-muted/10 opacity-50" :
                isActive ? "border-purple-400/50 bg-purple-500/10" :
                           "border-border bg-card hover:border-purple-400/40"
              }`}
              data-testid={`thieve-row-${npc.id}`}>
              <NpcIcon npcId={npc.id} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium">{npc.name}</span>
                  {npc.hidden && <span className="text-[10px] px-1.5 py-0.5 rounded border border-amber-400/40 text-amber-300 bg-amber-400/8">{t.pages.thieving.hidden}</span>}
                  {locked && <span className="text-xs text-muted-foreground">（盗窃 {npc.level}）</span>}
                </div>
                <div className="text-xs text-muted-foreground flex gap-3 mt-0.5 flex-wrap">
                  <span>{t.pages.thieving.perception} {npc.perception}</span>
                  <span>💰 {npc.gpMin}-{npc.gpMax} {t.pages.thieving.goldPer}</span>
                  <span>{npc.xp} {t.pages.thieving.xpPer}</span>
                  <span className="text-yellow-500">{npc.interval}s {t.pages.thieving.interval}</span>
                </div>
                <div className="text-xs mt-0.5 flex gap-3">
                  <span className="text-green-400">✅ {(sRate * 100).toFixed(1)}% {t.pages.thieving.successRate}</span>
                  <span className="text-blue-400">📦 {(dRate * 100).toFixed(1)}% {t.pages.thieving.doubleRate}</span>
                  <span className="text-yellow-400">📊 {t.pages.thieving.goldPerAttempt(avgGp)}</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                {isActive ? (
                  <Button size="sm" variant="destructive" onClick={() => startAction.mutate("idle")}>{t.pages.thieving.stop}</Button>
                ) : (
                  <Button size="sm" disabled={locked} onClick={() => startAction.mutate(`thieve_${npc.id}`)}>
                    {locked ? `${npc.level}级` : t.pages.thieving.steal}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Hidden NPC hints */}
      {THIEVING_NPCS.filter(n => n.hidden && !isUnlocked(n)).length > 0 && (
        <div className="bg-card border border-amber-500/30 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-2 mb-3">
            <Lock className="w-4 h-4" /> {t.pages.thieving.noHidden}
          </h2>
          <div className="space-y-2">
            {THIEVING_NPCS.filter(n => n.hidden && !isUnlocked(n)).map(npc => (
              <div key={npc.id} className="flex items-center gap-3 p-2 rounded-lg border border-border bg-muted/10 opacity-60">
                <span className="text-xl">❓</span>
                <div>
                  <p className="text-sm text-muted-foreground">{npc.unlockHint}</p>
                  <p className="text-[10px] text-amber-400/60">{t.pages.thieving.uniqueUnlock}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ThievingBar({ startMs, cycleTime }: { startMs: number; cycleTime: number }) {
  const [progress, setProgress] = useState(0);
  const lastSyncRef = useRef(0);
  const prevStartRef = useRef(startMs);
  const queryClient = useQueryClient();
  const rafRef = useRef<number | null>(null);
  // Reset sync counter when server advances actionUpdatedAt
  if (startMs !== prevStartRef.current) {
    prevStartRef.current = startMs;
    lastSyncRef.current = 0;
  }
  useEffect(() => {
    const tick = () => {
      const elapsed = (Date.now() - startMs) / 1000;
      setProgress(((elapsed % cycleTime) / cycleTime) * 100);
      const cycles = Math.floor(elapsed / cycleTime);
      if (cycles > lastSyncRef.current) {
        lastSyncRef.current = cycles;
        fetch(api.game.getState.path, { headers: { "x-player-id": getPlayerId() } })
          .then(r => r.ok && r.json().then(d => queryClient.setQueryData([api.game.getState.path], d)))
          .catch(() => {});
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, [startMs, cycleTime, queryClient]);
  return <div className="h-full bg-primary rounded-full transition-none" style={{ width: `${progress}%` }} />;
}
