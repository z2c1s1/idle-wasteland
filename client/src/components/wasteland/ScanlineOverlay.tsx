import { cn } from "@/lib/utils";

export function ScanlineOverlay({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 opacity-[0.04]",
        "bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,hsl(0_0%_0%)_2px,hsl(0_0%_0%)_4px)]",
        className,
      )}
      aria-hidden
    />
  );
}
