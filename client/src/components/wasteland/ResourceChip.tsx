import { cn } from "@/lib/utils";

interface ResourceChipProps {
  icon: React.ReactNode;
  label?: string;
  value: string;
  warn?: boolean;
  className?: string;
}

export function ResourceChip({ icon, label, value, warn, className }: ResourceChipProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 px-2.5 py-1 font-mono text-base tabular-nums",
        "border border-[hsl(var(--border-rust))] bg-[hsl(var(--surface)/0.8)]",
        warn && "border-[hsl(var(--danger-rust))] text-[hsl(var(--danger-rust))]",
        className,
      )}
      title={label}
    >
      <span className="opacity-80">{icon}</span>
      <span className={cn(!warn && "text-[hsl(var(--crt-green))]")}>{value}</span>
    </div>
  );
}
