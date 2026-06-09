import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useUIText } from "@/lib/i18n";
import { useGameState } from "@/hooks/use-game";
import { parseLootBag } from "@shared/game-state-parse";
import type { GameState } from "@shared/schema";
import { ZONES, getZoneForPath } from "./zones";

export function ActionDock() {
  const t = useUIText();
  const [location, navigate] = useLocation();
  const { data: state } = useGameState();
  const gs = state as GameState | undefined;
  const activeZone = getZoneForPath(location);
  const zoneLabels = t.shell.zones;

  const lootCount = gs ? parseLootBag(gs.lootBag).length : 0;
  const lootMax = gs?.lootBagSize ?? 50;
  const lootWarn = lootCount >= lootMax * 0.85;
  const tempWarn = (gs?.temperature ?? 0) < 10;

  return (
    <nav
      className="flex h-14 flex-shrink-0 items-stretch border-t border-[hsl(var(--border-rust))] bg-[hsl(var(--surface))] md:hidden"
      aria-label={t.shell.dockTitle}
    >
      {ZONES.map((zone) => {
        const Icon = zone.icon;
        const isActive = activeZone === zone.id;
        const showBadge =
          (zone.id === "stash" && lootWarn) ||
          (zone.id === "camp" && tempWarn);

        return (
          <button
            key={zone.id}
            type="button"
            onClick={() => navigate(zone.defaultPath)}
            className={cn(
              "relative flex flex-1 flex-col items-center justify-center gap-0.5 px-1",
              "border-r border-[hsl(var(--border-rust)/0.5)] last:border-r-0",
              "transition-colors active:bg-[hsl(var(--accent))]",
              isActive && "bg-[hsl(120_30%_8%)] text-[hsl(var(--crt-green))]",
            )}
          >
            {showBadge && (
              <span className="absolute right-2 top-1.5 h-1.5 w-1.5 rounded-full bg-[hsl(var(--danger-rust))]" aria-hidden />
            )}
            <Icon className={cn("h-4 w-4", isActive && "text-[hsl(var(--crt-green))]")} />
            <span className="max-w-full truncate text-[9px] font-medium leading-none">
              {zoneLabels[zone.labelKey]}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
