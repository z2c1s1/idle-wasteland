import type { LucideIcon } from "lucide-react";
import { RustFrame } from "./RustFrame";

interface WorkstationLayoutProps {
  skillName: string;
  subtitle: string;
  icon: LucideIcon;
  iconColor: string;
  zoneLabel?: string;
  children: React.ReactNode;
}

/** Wasteland-themed shell for gathering / production skill pages */
export function WorkstationLayout({
  skillName,
  subtitle,
  icon: Icon,
  iconColor,
  zoneLabel,
  children,
}: WorkstationLayoutProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <RustFrame className="px-4 py-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-[hsl(var(--border-rust))] bg-[hsl(var(--background))]">
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
          <div className="min-w-0 flex-1">
            {zoneLabel && (
              <p className="mb-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-[hsl(var(--crt-green)/0.7)]">
                {zoneLabel}
              </p>
            )}
            <h1 className="font-display text-lg font-bold text-[hsl(var(--brass))]">{skillName}</h1>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
      </RustFrame>
      {children}
    </div>
  );
}
