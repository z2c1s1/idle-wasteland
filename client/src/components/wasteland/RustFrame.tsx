import { cn } from "@/lib/utils";

interface RustFrameProps {
  children: React.ReactNode;
  className?: string;
  /** Show corner rivet dots */
  rivets?: boolean;
}

export function RustFrame({ children, className, rivets = true }: RustFrameProps) {
  return (
    <div
      className={cn(
        "relative border border-[hsl(var(--border-rust))] bg-[hsl(var(--surface))]",
        "shadow-[inset_0_1px_0_hsl(40_30%_22%/0.4)]",
        className,
      )}
    >
      {rivets && (
        <>
          <span className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-[hsl(var(--brass)/0.5)] shadow-[inset_0_0_2px_hsl(0_0%_0%/0.8)]" aria-hidden />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[hsl(var(--brass)/0.5)] shadow-[inset_0_0_2px_hsl(0_0%_0%/0.8)]" aria-hidden />
          <span className="absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full bg-[hsl(var(--brass)/0.5)] shadow-[inset_0_0_2px_hsl(0_0%_0%/0.8)]" aria-hidden />
          <span className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-[hsl(var(--brass)/0.5)] shadow-[inset_0_0_2px_hsl(0_0%_0%/0.8)]" aria-hidden />
        </>
      )}
      {children}
    </div>
  );
}
