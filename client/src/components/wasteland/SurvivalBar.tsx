import { useGameState, useStartAction } from "@/hooks/use-game";
import { useLanguage, useUIText } from "@/lib/i18n";
import { formatActionLabel } from "@/lib/action-label";
import { formatNumber, getCombatLevel } from "@/lib/game-utils";
import { parseLootBag } from "@shared/game-state-parse";
import type { GameState } from "@shared/schema";
import { RadiationIcon } from "@/components/sprites";
import { ResourceChip } from "./ResourceChip";
import { Menu } from "lucide-react";

interface SurvivalBarProps {
  onOpenNav?: () => void;
}

export function SurvivalBar({ onOpenNav }: SurvivalBarProps) {
  const { data: state } = useGameState();
  const { mutate: startAction, isPending } = useStartAction();
  const { lang, setLanguage } = useLanguage();
  const t = useUIText();

  if (!state) return null;
  const gs = state as GameState;
  const isActive = gs.activeAction !== "idle";
  const temp = gs.temperature ?? 0;
  const worldTier = (gs.worldTier as number | undefined) ?? 1;
  const radPct = Math.min(99, worldTier * 18 + (100 - Math.min(100, temp)) * 0.1);
  const lootCount = parseLootBag(gs.lootBag).length;
  const lootMax = gs.lootBagSize ?? 50;
  const lootWarn = lootCount >= lootMax * 0.85;
  const tempWarn = temp < 10;

  return (
    <header className="relative z-20 flex h-12 flex-shrink-0 items-center gap-2 border-b border-[hsl(var(--border-rust))] bg-[hsl(var(--surface))] px-2 md:px-3">
      <button
        type="button"
        onClick={onOpenNav}
        className="flex h-10 w-10 items-center justify-center border border-[hsl(var(--border-rust))] text-muted-foreground hover:bg-[hsl(var(--accent))] md:hidden"
        aria-label={t.shell.openNav}
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-1.5 min-w-0">
        <RadiationIcon size={28} className="flex-shrink-0 text-[hsl(var(--amber-warn))]" />
        <span className="hidden font-display text-lg font-bold tracking-wide text-[hsl(var(--brass))] sm:inline">
          {t.sidebar.title}
        </span>
        <span className="hidden text-[10px] font-mono text-[hsl(var(--crt-green))/0.7] sm:inline">
          {(() => { const tier = worldTier; return tier >= 4 ? '☠ 废土之王' : tier >= 3 ? '⚔ 军阀' : tier >= 2 ? '📦 流浪商人' : '🔧 拾荒者'; })()}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1 md:gap-1.5">
        <ResourceChip
          icon="☢"
          label={t.shell.radiation}
          value={`${Math.round(radPct)}%`}
          warn={radPct > 50}
        />
        <ResourceChip
          icon="🌡"
          label={t.shell.temperature}
          value={`${Math.round(temp)}°`}
          warn={tempWarn}
        />
        <ResourceChip icon="💰" label={t.dashboard.gold} value={formatNumber(gs.gold)} />
        <ResourceChip
          icon="🎒"
          label={t.shell.lootBag}
          value={`${lootCount}/${lootMax}`}
          warn={lootWarn}
        />
        <ResourceChip
          icon="⚔"
          label={t.dashboard.combatLevel}
          value={String(getCombatLevel(gs))}
          className="hidden lg:flex"
        />
      </div>

      <div className="ml-auto flex min-w-0 items-center gap-2">
        <div className="hidden min-w-0 max-w-[280px] items-center gap-1.5 text-base md:flex">
          {isActive ? (
            <>
              <span className="status-led flex-shrink-0" />
              <span className="truncate font-mono text-[hsl(var(--crt-green))] crt-glow">
                {formatActionLabel(gs.activeAction, t, lang)}
              </span>
            </>
          ) : (
            <span className="truncate text-muted-foreground">{t.header.idle}</span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setLanguage(lang === "zh" ? "en" : "zh")}
          className="flex-shrink-0 border border-[hsl(var(--border-rust))] px-2.5 py-1 text-sm font-mono hover:bg-[hsl(var(--accent))]"
          title={lang === "zh" ? "Switch to English" : "切换到中文"}
        >
          {lang === "zh" ? "EN" : "中"}
        </button>

        {isActive && (
          <button
            type="button"
            onClick={() => startAction("idle")}
            disabled={isPending}
            className="flex-shrink-0 bg-[hsl(var(--danger-rust))] px-3 py-1 text-sm font-bold uppercase tracking-wide text-white hover:brightness-110 disabled:opacity-50"
          >
            {t.header.stop}
          </button>
        )}
      </div>
    </header>
  );
}
