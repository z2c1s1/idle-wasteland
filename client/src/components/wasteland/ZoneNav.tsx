import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useUIText } from "@/lib/i18n";
import { ZONES, getZoneForPath, isRouteActive, type ZoneId } from "./zones";
import { Radio } from "lucide-react";

interface ZoneNavProps {
  className?: string;
  expandedZone?: ZoneId | null;
  onZoneChange?: (zone: ZoneId) => void;
  onNavigate?: () => void;
}

export function ZoneNav({ className, expandedZone: controlledZone, onZoneChange, onNavigate }: ZoneNavProps) {
  const t = useUIText();
  const [location, navigate] = useLocation();
  const [hash, setHash] = useState(() => window.location.hash);
  const [internalZone, setInternalZone] = useState<ZoneId>(() => getZoneForPath(location));

  useEffect(() => {
    const cb = () => setHash(window.location.hash);
    window.addEventListener("hashchange", cb);
    return () => window.removeEventListener("hashchange", cb);
  }, []);

  useEffect(() => {
    setInternalZone(getZoneForPath(location));
  }, [location]);

  const activeZone = location === "/" ? null : (controlledZone ?? internalZone);
  const zoneLabels = t.shell.zones;

  const go = (path: string, h?: string) => {
    navigate(path);
    if (h) window.location.hash = h;
    else if (window.location.hash) window.location.hash = "";
    onNavigate?.();
  };

  return (
    <nav className={cn("flex flex-col border-r border-[hsl(var(--border-rust))] bg-[hsl(var(--surface))]", className)}>
      <div className="border-b border-[hsl(var(--border-rust))] px-3 py-2.5">
        <p className="text-base font-mono uppercase tracking-[0.2em] text-[hsl(var(--brass))]">
          {t.shell.zoneNavTitle}
        </p>
      </div>

      <div className="flex flex-col gap-1 p-2">
        {/* Dashboard — same level as zones */}
        <button
          type="button"
          onClick={() => go("/")}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 text-left text-base transition-colors",
            "border border-transparent hover:border-[hsl(var(--border-rust))] hover:bg-[hsl(var(--accent))]",
            location === "/" && "border-[hsl(var(--brass)/0.5)] bg-[hsl(var(--accent))] text-[hsl(var(--brass))]",
          )}
        >
          <Radio className={cn("h-8 w-8 flex-shrink-0", location === "/" && "text-[hsl(var(--crt-green))]")} />
          <span className="truncate font-medium">{t.sidebar.navDashboard}</span>
        </button>

        {ZONES.map((zone) => {
          const Icon = zone.icon;
          const isZoneActive = activeZone === zone.id;
          return (
            <button
              key={zone.id}
              type="button"
              onClick={() => {
                setInternalZone(zone.id);
                onZoneChange?.(zone.id);
                if (!isZoneActive) go(zone.defaultPath);
              }}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-left text-base transition-colors",
                "border border-transparent hover:border-[hsl(var(--border-rust))] hover:bg-[hsl(var(--accent))]",
                isZoneActive && "border-[hsl(var(--brass)/0.5)] bg-[hsl(var(--accent))] text-[hsl(var(--brass))]",
              )}
            >
              <Icon className={cn("h-8 w-8 flex-shrink-0", isZoneActive && "text-[hsl(var(--crt-green))]")} />
              <span className="truncate font-medium">{zoneLabels[zone.labelKey]}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-auto flex-1 overflow-y-auto border-t border-[hsl(var(--border-rust))] p-2">
        {location === "/" ? (
          <p className="mb-1.5 px-1 text-base font-mono uppercase tracking-wider text-muted-foreground">
            {t.sidebar.navDashboard}
          </p>
        ) : (
          <>
            <p className="mb-1.5 px-1 text-base font-mono uppercase tracking-wider text-muted-foreground">
              {zoneLabels[ZONES.find(z => z.id === activeZone)!.labelKey]}
            </p>
            <ul className="space-y-1">
              {ZONES.find(z => z.id === activeZone)!.routes.map((route) => {
                const active = isRouteActive(location, hash, route);
                const label = t.sidebar[route.labelKey];
                const key = `${route.path}${route.hash ?? ""}`;
                return (
                  <li key={key}>
                    <button
                      type="button"
                      onClick={() => go(route.path, route.hash)}
                      className={cn(
                        "w-full truncate px-3 py-2 text-left text-base transition-colors",
                        "hover:bg-[hsl(var(--accent))]",
                        active && "border-l-2 border-[hsl(var(--crt-green))] bg-[hsl(120_30%_8%)] pl-[calc(0.75rem-2px)] font-medium text-[hsl(var(--crt-green))]",
                      )}
                    >
                      {label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </nav>
  );
}
