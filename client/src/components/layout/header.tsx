import { useGameState, useStartAction } from "@/hooks/use-game";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useLanguage, useUIText } from "@/lib/i18n";
import { formatActionLabel } from "@/lib/action-label";

export function Header() {
  const { data: state } = useGameState();
  const { mutate: startAction, isPending } = useStartAction();
  const { lang, setLanguage } = useLanguage();
  const t = useUIText();

  if (!state) return null;

  const isActive = state.activeAction !== "idle";

  return (
    <header className="h-10 border-b border-border bg-[hsl(220_13%_8%)] flex items-center px-3 gap-3 flex-shrink-0">
      <SidebarTrigger className="md:hidden -ml-1" />
      <span className="text-xs text-muted-foreground">
        {isActive ? (
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse inline-block" />
            <span className="text-foreground font-medium">{formatActionLabel(state.activeAction, t, lang)}</span>
          </span>
        ) : (
          t.header.idle
        )}
      </span>
      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={() => setLanguage(lang === "zh" ? "en" : "zh")}
          className="px-2 py-0.5 text-xs border border-border rounded hover:bg-muted/20 transition-colors"
          title={lang === "zh" ? "Switch to English" : "切换到中文"}
        >
          {lang === "zh" ? "EN" : "中"}
        </button>
        {isActive && (
          <button
            onClick={() => startAction("idle")}
            disabled={isPending}
            className="px-2.5 py-0.5 text-xs font-semibold bg-red-600 hover:bg-red-500 text-white rounded transition-colors disabled:opacity-50"
          >
            {t.header.stop}
          </button>
        )}
      </div>
    </header>
  );
}
