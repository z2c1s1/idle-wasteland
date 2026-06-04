import { useGameState, useStartAction } from "@/hooks/use-game";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function Header() {
  const { data: state } = useGameState();
  const { mutate: startAction, isPending } = useStartAction();

  if (!state) return null;

  const isActive = state.activeAction !== "idle";

  return (
    <header className="h-10 border-b border-border bg-[hsl(220_13%_8%)] flex items-center px-3 gap-3 flex-shrink-0">
      <SidebarTrigger className="md:hidden -ml-1" />
      <span className="text-xs text-muted-foreground">
        {isActive ? (
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse inline-block" />
            <span className="text-foreground font-medium capitalize">{state.activeAction.replace("_", " ")}</span>
          </span>
        ) : (
          "空闲 — 无任务运行"
        )}
      </span>
      <div className="ml-auto flex items-center gap-2">
        {isActive && (
          <button
            onClick={() => startAction("idle")}
            disabled={isPending}
            className="px-2.5 py-0.5 text-xs font-semibold bg-red-600 hover:bg-red-500 text-white rounded transition-colors disabled:opacity-50"
          >
            停止
          </button>
        )}
      </div>
    </header>
  );
}
