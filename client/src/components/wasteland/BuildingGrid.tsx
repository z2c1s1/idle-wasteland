import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { SHELTER_BUILDINGS } from "@shared/game-data";
import type { GameState } from "@shared/schema";
import { RustFrame } from "./RustFrame";
import { useUIText } from "@/lib/i18n";

const GRID_BUILDINGS = SHELTER_BUILDINGS.slice(0, 9);

interface BuildingGridProps {
  state: GameState;
}

export function BuildingGrid({ state }: BuildingGridProps) {
  const t = useUIText();
  const [, navigate] = useLocation();
  const homestead: Record<string, number> = JSON.parse(state.homestead ?? "{}");
  const worldTier = (state.worldTier as number | undefined) ?? 1;

  return (
    <RustFrame className="p-3">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-sm font-semibold tracking-wide text-[hsl(var(--brass))]">
          {t.dashboard.shelterTitle}
        </h2>
        <button
          type="button"
          onClick={() => navigate("/shelter")}
          className="text-[10px] font-mono text-[hsl(var(--crt-green))] hover:underline"
        >
          {t.dashboard.manageShelter}
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {GRID_BUILDINGS.map((b) => {
          const level = homestead[b.id] ?? 0;
          const locked = b.reqTier != null && worldTier < b.reqTier;
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => navigate("/homestead")}
              className={`flex flex-col items-center justify-center gap-1 border p-2 text-center transition-colors hover:bg-[hsl(var(--accent))] ${
                level >= 8
                  ? "border-[hsl(var(--crt-green))/0.6] bg-[hsl(120_30%_8%)] shadow-[0_0_8px_hsl(120_100%_65%/0.1)]"
                  : level >= 5
                    ? "border-[hsl(var(--brass))/0.5] bg-[hsl(var(--card))]"
                    : level > 0
                      ? "border-[hsl(var(--border-rust))] bg-[hsl(var(--card))]"
                      : locked
                        ? "border-dashed border-[hsl(var(--border-rust))] "
                        : "border-dashed border-[hsl(var(--crt-green)/0.3)]"
              }`}
              title={locked ? t.dashboard.buildingLocked(b.reqTier!) : b.name}
            >
              <span className="text-xl leading-none">{b.emoji}</span>
              <span className="w-full truncate text-[9px] text-muted-foreground">{b.name}</span>
              {level > 0 ? (
                <div className="flex flex-col items-center gap-0.5">
                  <span className="font-mono text-[10px] font-bold text-[hsl(var(--crt-green))]">Lv.{level}</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: Math.min(level, 10) }).map((_, i) => (
                      <span key={i} className={`w-1 h-1 rounded-full ${i >= 7 ? 'bg-[hsl(var(--crt-green))]' : i >= 4 ? 'bg-[hsl(var(--brass))]' : 'bg-[hsl(var(--border-rust))]'}`} />
                    ))}
                  </div>
                </div>
              ) : (
                <span className="text-[9px] text-muted-foreground">{locked ? "🔒" : t.dashboard.buildable}</span>
              )}
            </button>
          );
        })}
      </div>
      {/* NPC resident log */}
      <ResidentLog homestead={homestead} worldTier={worldTier} />
    </RustFrame>
  );
}

const RESIDENT_QUOTES: Record<string, string[]> = {
  shelter: ["终于有个像样的地方了...","墙壁还在漏风，但比外面好多了","避难所就是我们的家"],
  farm: ["今天收了三颗辐射菇，能吃。","室内农场的LED灯坏了两次","食物勉强够，但需要更多种子"],
  lumbermill: ["木材产量稳定，可以扩建了","斧头又钝了，得去工坊磨一下"],
  workshop: ["新到的零件可以用在熔炉上","我正在修理那台旧发电机"],
  furnace: ["温度上来了，大家可以脱下外套了","火焰让这个避难所有了生气"],
};

function ResidentLog({ homestead, worldTier }: { homestead: Record<string, number>; worldTier: number }) {
  const built = Object.entries(homestead).filter(([_, lv]) => lv > 0);
  if (built.length === 0) return null;
  
  // Pick a random building that has been built
  const [bldId] = built[Math.floor(Math.random() * built.length)]!;
  const quotes = RESIDENT_QUOTES[bldId] ?? [`${bldId} 运转正常。`];
  const quote = quotes[Math.floor(Math.random() * quotes.length)]!;
  
  return (
    <div className="mt-3 border-t border-[hsl(var(--border-rust))/0.4] pt-2">
      <p className="text-[9px] font-mono text-[hsl(var(--crt-green))/0.4] uppercase tracking-widest mb-0.5">{'>'} 居民日志</p>
      <p className="text-[10px] text-[hsl(var(--crt-green))/0.5] italic">"{quote}"</p>
    </div>
  );
}
