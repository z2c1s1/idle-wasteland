import { useEffect, useState } from "react";
import { useGameState, useStartAction } from "@/hooks/use-game";
import { useLanguage, useUIText } from "@/lib/i18n";
import { formatActionLabel } from "@/lib/action-label";
import { getActionProgress } from "@/lib/action-cycle";
import type { GameState } from "@shared/schema";
import { CrtPanel } from "./CrtPanel";
import { calculateLevel } from "@/lib/game-utils";
import { SHELTER_BUILDINGS } from "@shared/game-data";

export function ActionTerminal() {
  const { data: state } = useGameState();
  const { mutate: startAction, isPending } = useStartAction();
  const { lang } = useLanguage();
  const t = useUIText();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!state || state.activeAction === "idle") return;
    const id = setInterval(() => setTick(n => n + 1), 100);
    return () => clearInterval(id);
  }, [state?.activeAction, state]);

  if (!state) return null;
  const gs = state as GameState;
  const isActive = gs.activeAction !== "idle";
  const progress = isActive ? getActionProgress(gs.activeAction, gs) : null;
  void tick;

  return (
    <CrtPanel title={t.dashboard.terminalTitle}>
      {isActive ? (
        <div className="space-y-3">
          <p className="text-xs">
            <span className="text-[hsl(var(--crt-green)/0.6)]">{t.dashboard.terminalStatus} </span>
            {formatActionLabel(gs.activeAction, t, lang)}
          </p>
          {progress ? (
            <>
              <div className="h-2 overflow-hidden border border-[hsl(var(--crt-green)/0.3)] bg-[hsl(120_30%_6%)]">
                <div
                  className="h-full bg-[hsl(var(--crt-green))] transition-none"
                  style={{ width: `${progress.progress}%` }}
                />
              </div>
              <p className="text-[10px] text-[hsl(var(--crt-green)/0.7)]">
                {t.dashboard.terminalEta(progress.timeLeft.toFixed(1))}
              </p>
            </>
          ) : (
            <p className="text-[10px] text-[hsl(var(--crt-green)/0.7)]">{t.dashboard.terminalRunning}</p>
          )}
          <button
            type="button"
            onClick={() => startAction("idle")}
            disabled={isPending}
            className="w-full border border-[hsl(var(--danger-rust))] bg-[hsl(var(--danger-rust)/0.15)] py-2 text-xs font-bold uppercase tracking-wider text-[hsl(var(--danger-rust))] hover:bg-[hsl(var(--danger-rust)/0.25)] disabled:opacity-50"
          >
            {t.dashboard.stopAll}
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-[hsl(var(--crt-green)/0.7)]">{t.dashboard.terminalIdle}</p>
          <p className="text-[10px] text-[hsl(var(--crt-green)/0.45)]">{t.dashboard.terminalHint}</p>
          {/* Dynamic goal suggestion */}
          <GoalHint gs={gs} />
        </div>
      )}
    </CrtPanel>
  );
}

function GoalHint({ gs }: { gs: GameState }) {
  const homestead: Record<string, number> = (() => { try { return JSON.parse((gs as any).homestead ?? "{}"); } catch { return {}; } })();
  const worldTier = (gs.worldTier as number | undefined) ?? 1;
  
  // Find first unbuilt or upgradable building
  const nextBuilding = SHELTER_BUILDINGS.find(b => {
    const lv = homestead[b.id] ?? 0;
    return lv < b.maxLevel && (b.reqTier == null || worldTier >= b.reqTier);
  });
  
  // Find lowest-level scavenge skill
  const scavengeSkills = [
    { key: "woodcuttingXp" as const, name: "伐木" },
    { key: "miningXp" as const, name: "采矿" },
    { key: "fishingXp" as const, name: "钓鱼" },
    { key: "huntingXp" as const, name: "狩猎" },
  ];
  const lowest = scavengeSkills.reduce((a, b) => 
    calculateLevel(gs[a.key]) < calculateLevel(gs[b.key]) ? a : b
  );

  const hints: string[] = [];
  if (worldTier < 4) hints.push(`提升世界层级 (当前 Tier ${worldTier})`);
  if (nextBuilding) {
    const lv = homestead[nextBuilding.id] ?? 0;
    hints.push(`${nextBuilding.emoji} ${nextBuilding.name} → Lv.${lv + 1}`);
  }
  hints.push(`${lowest.name}技能提升`);

  return (
    <div className="mt-2 border-t border-[hsl(var(--crt-green)/0.15)] pt-2">
      <p className="text-[9px] text-[hsl(var(--crt-green)/0.4)] uppercase tracking-widest mb-1">{'>'} 建议目标</p>
      <ul className="space-y-0.5">
        {hints.slice(0, 3).map((h, i) => (
          <li key={i} className="text-[10px] text-[hsl(var(--crt-green))/0.5]">
            {'>'} {h}
          </li>
        ))}
      </ul>
    </div>
  );
}
