import { useMemo } from "react";
import { useGameState } from "@/hooks/use-game";
import { calculateLevel, formatNumber, getCombatLevel } from "@/lib/game-utils";
import { Skull, Shield, Zap, Download, Upload, Radiation } from "lucide-react";
import { useLocation } from "wouter";
import { R } from "@/lib/routes";
import { WORLD_TIER_LABEL } from "@shared/game-data";
import type { GameState } from "@shared/schema";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { useUIText, useLanguage } from "@/lib/i18n";
import {
  BuildingGrid,
  ActionTerminal,
  SkillMonitor,
  RustFrame,
  AchievementTracker,
} from "@/components/wasteland";

export default function Dashboard() {
  const { data: state } = useGameState();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const t = useUIText();
  const { lang } = useLanguage();

  const handleExport = () => {
    const a = document.createElement("a");
    a.href = "/api/game/export";
    a.download = "wasteland-save.json";
    a.click();
    toast({ title: t.dashboard.exportTitle });
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        const res = await fetch("/api/game/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error((await res.json()).message);
        queryClient.invalidateQueries({ queryKey: [api.game.getState.path] });
        toast({ title: t.dashboard.importSuccess });
      } catch (e: unknown) {
        toast({
          title: t.dashboard.importFail,
          description: e instanceof Error ? e.message : "Unknown error",
          variant: "destructive",
        });
      }
    };
    input.click();
  };

  const survivalTip = useMemo(() => {
    const tips = t.wasteland.survivalTips;
    return tips[Math.floor(Math.random() * tips.length)];
  }, [lang, t]);

  if (!state) return null;
  const gs = state as GameState;
  const combatLevel = getCombatLevel(gs);

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <div className="border-b border-[hsl(var(--border-rust))] pb-3">
        <h1 className="font-display text-xl font-bold text-[hsl(var(--brass))]">{t.dashboard.title}</h1>
        <p className="text-xs text-muted-foreground">{t.dashboard.subtitle}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          <BuildingGrid state={gs} />
          <ActionTerminal />

          <button
            type="button"
            onClick={() => setLocation(R.exploration)}
            className="w-full border border-[hsl(var(--amber-warn)/0.4)] bg-[hsl(var(--card))] px-4 py-3 text-left transition-colors hover:border-[hsl(var(--amber-warn)/0.6)]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-[hsl(var(--amber-warn))]" />
                <span className="text-sm font-semibold text-[hsl(var(--amber-warn))]">
                  {WORLD_TIER_LABEL[(gs.worldTier as 1 | 2 | 3 | 4 | undefined) ?? 1]}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">{t.dashboard.switchTier}</span>
            </div>
          </button>
        </div>

        <div className="space-y-4">
          <SkillMonitor state={gs} />

          <RustFrame className="grid grid-cols-3 gap-px bg-[hsl(var(--border-rust))] p-px">
            {[
              { icon: Skull, label: t.dashboard.combatLevel, value: String(combatLevel), color: "text-red-400" },
              { icon: Shield, label: t.dashboard.smithingLevel, value: String(calculateLevel(gs.smithingXp)), color: "text-slate-400" },
              { icon: null, label: t.dashboard.gold, value: formatNumber(gs.gold), color: "text-[hsl(var(--amber-warn))]" },
            ].map((stat) => (
              <div key={stat.label} className="bg-[hsl(var(--surface))] px-2 py-3 text-center">
                {stat.icon ? (
                  <stat.icon className={`mx-auto mb-1 h-5 w-5 ${stat.color}`} />
                ) : (
                  <span className="mx-auto mb-1 block text-lg leading-none">💰</span>
                )}
                <p className="text-[9px] text-muted-foreground">{stat.label}</p>
                <p className={`font-display text-lg font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </RustFrame>

          <AchievementTracker state={gs} />

          <RustFrame className="px-4 py-3">
            <div className="mb-1 flex items-center gap-2">
              <Radiation className="h-3.5 w-3.5 text-[hsl(var(--amber-warn))]" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[hsl(var(--amber-warn))]">
                {t.dashboard.wastelandTipTitle}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">{survivalTip}</p>
          </RustFrame>
        </div>
      </div>

      <div className="flex justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={handleExport}
          className="flex items-center gap-2 border border-[hsl(var(--border-rust))] px-4 py-2 text-xs hover:bg-[hsl(var(--accent))]"
        >
          <Download className="h-3.5 w-3.5" /> {t.dashboard.exportTitle}
        </button>
        <button
          type="button"
          onClick={handleImport}
          className="flex items-center gap-2 border border-[hsl(var(--border-rust))] px-4 py-2 text-xs hover:bg-[hsl(var(--accent))]"
        >
          <Upload className="h-3.5 w-3.5" /> {t.dashboard.importTitle}
        </button>
      </div>
    </div>
  );
}
