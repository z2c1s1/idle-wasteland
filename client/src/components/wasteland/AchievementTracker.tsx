import { useMemo } from "react";
import { useLocation } from "wouter";
import { ACHIEVEMENTS, PETS } from "@shared/game-data";
import type { GameState } from "@shared/schema";
import { calculateLevel } from "@/lib/game-utils";
import { RustFrame } from "./RustFrame";

interface Props {
  state: GameState;
}

export function AchievementTracker({ state }: Props) {
  const [, navigate] = useLocation();
  const gs = state;

  const progress = useMemo(() => {
    const completed: Record<string, number> = (() => { try { return JSON.parse((gs as any).achievements ?? "{}"); } catch { return {}; } })();
    
    return ACHIEVEMENTS.map(a => {
      let current = 0;
      if (a.type === 'skill') {
        const xp = (gs as any)[a.target] as number ?? 0;
        current = calculateLevel(xp);
      } else if (a.type === 'kill') {
        current = completed[a.id] ?? 0;
      } else if (a.type === 'dungeon') {
        current = completed[a.id] ?? 0;
      }
      const pct = Math.min(100, Math.floor((current / a.count) * 100));
      const done = current >= a.count;
      return { ...a, current, pct, done };
    });
  }, [gs]);

  const nearest = progress.filter(a => !a.done).sort((a, b) => b.pct - a.pct).slice(0, 3);
  const recentDone = progress.filter(a => a.done).slice(-1);
  const display = [...recentDone, ...nearest].slice(0, 4);

  return (
    <RustFrame className="p-3">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-display text-sm font-semibold tracking-wide text-[hsl(var(--brass))]">🏆 成就</h2>
        <button type="button" onClick={() => navigate("/pets")}
          className="text-[10px] font-mono text-[hsl(var(--crt-green))] hover:underline">查看全部</button>
      </div>
      <ul className="space-y-1.5">
        {display.map(a => {
          const pet = PETS.find(p => p.achievement === a.id);
          return (
            <li key={a.id} className="space-y-0.5">
              <div className="flex items-center justify-between text-[10px]">
                <span className={a.done ? 'text-[hsl(var(--crt-green))]' : 'text-muted-foreground'}>
                  {a.done ? '✓' : '○'} {a.name}
                </span>
                <span className="font-mono text-muted-foreground">
                  {a.done ? '完成' : `${a.pct}%`}{pet && <span className="ml-1">{pet.emoji}</span>}
                </span>
              </div>
              <div className="h-1 bg-[hsl(var(--background))] rounded overflow-hidden border border-[hsl(var(--border-rust))/0.4]">
                <div className="h-full rounded transition-all" style={{
                  width: `${a.pct}%`,
                  background: a.done ? 'linear-gradient(90deg, hsl(120,100%,35%), hsl(120,100%,50%))' : 'linear-gradient(90deg, hsl(var(--brass)), hsl(var(--amber-warn)))',
                }} />
              </div>
            </li>
          );
        })}
      </ul>
    </RustFrame>
  );
}
