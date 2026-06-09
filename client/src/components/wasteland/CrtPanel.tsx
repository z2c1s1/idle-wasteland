import { cn } from "@/lib/utils";
import { ScanlineOverlay } from "./ScanlineOverlay";

interface CrtPanelProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function CrtPanel({ children, className, title }: CrtPanelProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden border border-[hsl(var(--border-rust))]",
        "bg-[hsl(120_30%_4%)] font-mono text-[hsl(var(--crt-green))]",
        className,
      )}
    >
      <ScanlineOverlay />
      {title && (
        <div className="relative border-b border-[hsl(var(--crt-green)/0.2)] px-3 py-1.5 text-[10px] uppercase tracking-widest text-[hsl(var(--crt-green)/0.7)]">
          {">"} {title}
        </div>
      )}
      <div className="relative p-3 crt-glow">{children}</div>
    </div>
  );
}
