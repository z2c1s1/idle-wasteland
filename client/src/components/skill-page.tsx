import { useState, useEffect, useRef } from "react";
import { calculateLevel, levelProgress, xpForLevel, formatNumber } from "@/lib/game-utils";
import { useStartAction } from "@/hooks/use-game";
import type { GameState } from "@shared/schema";
import type { LucideIcon } from "lucide-react";

interface ResourceDef {
  name: string;
  emoji: string;
  time: number;
  xp: number;
  reqLevel: number;
  resourceKey: string;
  actionKey: string;
}

interface SkillPageProps {
  skillName: string;
  skillXp: number;
  icon: LucideIcon;
  iconColor: string;
  state: GameState;
  resources: ResourceDef[];
}

function ActiveProgressBar({
  resourceName,
  cycleTime,
  actionStartMs,
  onStop,
  isPending,
}: {
  resourceName: string;
  cycleTime: number;
  actionStartMs: number;
  onStop: () => void;
  isPending: boolean;
}) {
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(cycleTime);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    function tick() {
      const elapsed = (Date.now() - actionStartMs) / 1000;
      const cycleElapsed = elapsed % cycleTime;
      setProgress((cycleElapsed / cycleTime) * 100);
      setTimeLeft(Math.max(0, cycleTime - cycleElapsed));
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [actionStartMs, cycleTime]);

  return (
    <div className="bg-[hsl(217_50%_10%)] border border-primary/30 rounded p-3 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Currently Active</span>
          <div className="text-sm font-semibold text-foreground">{resourceName}</div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground tabular-nums w-10 text-right">
            {timeLeft.toFixed(1)}s
          </span>
          <button
            onClick={onStop}
            disabled={isPending}
            className="px-3 py-1 text-xs font-semibold bg-red-600 hover:bg-red-500 text-white rounded transition-colors disabled:opacity-50"
          >
            Stop
          </button>
        </div>
      </div>
      <div className="h-4 bg-[hsl(220_13%_8%)] rounded overflow-hidden border border-border">
        <div
          className="h-full progress-bar-fill rounded"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export function SkillPage({ skillName, skillXp, icon: Icon, iconColor, state, resources }: SkillPageProps) {
  const { mutate: startAction, isPending } = useStartAction();
  const level = calculateLevel(skillXp);
  const progress = levelProgress(skillXp);
  const xpCurrent = xpForLevel(level);
  const xpNext = xpForLevel(level + 1);
  const xpInLevel = skillXp - xpCurrent;
  const xpNeeded = xpNext - xpCurrent;

  const isGlobalActive = state.activeAction !== "idle";
  const activeResource = resources.find((r) => state.activeAction === r.actionKey) ?? null;

  // Convert actionUpdatedAt to a stable epoch number to avoid ref-equality issues with Date objects
  const actionStartMs = new Date(state.actionUpdatedAt as unknown as string).getTime();

  return (
    <div className="h-full flex flex-col">
      <div className="bg-[hsl(220_13%_10%)] border-b border-border px-4 py-3">
        <div className="flex items-center gap-3 mb-3">
          <Icon className={`w-6 h-6 ${iconColor}`} />
          <div>
            <h1 className="font-display text-lg font-bold text-foreground">{skillName}</h1>
            <span className="text-xs text-muted-foreground">Skill</span>
          </div>
          <div className="ml-auto text-right">
            <div className="text-2xl font-display font-bold text-foreground">Level {level}</div>
            <div className="text-xs text-muted-foreground">
              {formatNumber(xpInLevel)} / {formatNumber(xpNeeded)} XP
            </div>
          </div>
        </div>

        <div className="h-3 bg-[hsl(220_13%_8%)] rounded overflow-hidden border border-border">
          <div
            className="h-full xp-bar-fill rounded transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-muted-foreground">XP: {formatNumber(skillXp)}</span>
          <span className="text-[10px] text-muted-foreground">{progress.toFixed(1)}%</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeResource && (
          <ActiveProgressBar
            resourceName={activeResource.name}
            cycleTime={activeResource.time}
            actionStartMs={actionStartMs}
            onStop={() => startAction("idle")}
            isPending={isPending}
          />
        )}

        <div className="rounded border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[hsl(220_13%_8%)] text-muted-foreground text-xs">
                <th className="text-left px-3 py-2 font-semibold w-8"></th>
                <th className="text-left px-3 py-2 font-semibold">Name</th>
                <th className="text-center px-3 py-2 font-semibold">Level</th>
                <th className="text-center px-3 py-2 font-semibold">XP</th>
                <th className="text-center px-3 py-2 font-semibold">Time</th>
                <th className="text-center px-3 py-2 font-semibold">Owned</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {resources.map((res) => {
                const isActive = state.activeAction === res.actionKey;
                const isUnlocked = level >= res.reqLevel;
                const owned = (state as any)[res.resourceKey] ?? 0;
                const isOtherActive = isGlobalActive && !isActive;

                return (
                  <tr
                    key={res.name}
                    className={`border-t border-border transition-colors ${
                      isActive
                        ? "active-row"
                        : isUnlocked
                        ? "skill-row-hover"
                        : "opacity-50"
                    }`}
                  >
                    <td className="px-3 py-2.5 text-center text-base leading-none">{res.emoji}</td>
                    <td className="px-3 py-2.5">
                      <span className={`font-medium ${isActive ? "text-primary" : "text-foreground"}`}>
                        {res.name}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${
                        level >= res.reqLevel
                          ? "bg-green-900/60 text-green-400"
                          : "bg-red-900/60 text-red-400"
                      }`}>
                        {res.reqLevel}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-center text-muted-foreground">{res.xp}</td>
                    <td className="px-3 py-2.5 text-center text-muted-foreground">{res.time}s</td>
                    <td className="px-3 py-2.5 text-center font-semibold tabular-nums">
                      {formatNumber(owned)}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      {!isUnlocked ? (
                        <span className="text-xs text-muted-foreground px-3 py-1 bg-accent rounded">
                          Locked
                        </span>
                      ) : isActive ? (
                        <button
                          onClick={() => startAction("idle")}
                          disabled={isPending}
                          className="px-3 py-1 text-xs font-semibold bg-red-600 hover:bg-red-500 text-white rounded transition-colors disabled:opacity-50"
                        >
                          Stop
                        </button>
                      ) : (
                        <button
                          onClick={() => startAction(res.actionKey)}
                          disabled={isPending || isOtherActive}
                          className="px-3 py-1 text-xs font-semibold bg-primary hover:bg-primary/80 text-primary-foreground rounded transition-colors disabled:opacity-40"
                        >
                          Start
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
