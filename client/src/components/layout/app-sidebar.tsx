import { Link, useLocation } from "wouter";
import { Axe, Pickaxe, LayoutDashboard, Swords, Flame, Waves, PawPrint, Hammer } from "lucide-react";
import { useGameState } from "@/hooks/use-game";
import { calculateLevel } from "@/lib/game-utils";

const SKILLS = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, xpKey: null },
  { title: "Woodcutting", url: "/woodcutting", icon: Axe, xpKey: "woodcuttingXp" as const, color: "text-green-400" },
  { title: "Mining", url: "/mining", icon: Pickaxe, xpKey: "miningXp" as const, color: "text-yellow-400" },
  { title: "Smelting", url: "/smelting", icon: Flame, xpKey: "smeltingXp" as const, color: "text-orange-400" },
  { title: "Fishing", url: "/fishing", icon: Waves, xpKey: "fishingXp" as const, color: "text-blue-400" },
  { title: "Hunting", url: "/hunting", icon: PawPrint, xpKey: "huntingXp" as const, color: "text-red-400" },
  { title: "Crafting", url: "/crafting", icon: Hammer, xpKey: "craftingXp" as const, color: "text-purple-400" },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { data: state } = useGameState();

  return (
    <aside className="w-48 flex-shrink-0 bg-[hsl(220_13%_8%)] border-r border-border flex flex-col overflow-y-auto">
      <div className="px-3 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Swords className="w-5 h-5 text-primary" />
          <span className="font-display font-bold text-base text-foreground">Melvor Lite</span>
        </div>
      </div>

      <nav className="flex-1 py-2">
        <div className="px-2 py-1 mb-1">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Skills</span>
        </div>

        {SKILLS.map((skill) => {
          const isActive = location === skill.url;
          const level = skill.xpKey && state ? calculateLevel(state[skill.xpKey]) : null;

          return (
            <Link key={skill.title} href={skill.url}>
              <div
                className={`flex items-center gap-2.5 px-3 py-2 mx-1 rounded cursor-pointer transition-colors ${
                  isActive
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <skill.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-primary" : (skill.color ?? "")}`} />
                <span className="text-sm font-medium flex-1 min-w-0 truncate">{skill.title}</span>
                {level !== null && (
                  <span className={`text-xs font-bold tabular-nums ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                    {level}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-3 border-t border-border">
        <p className="text-[10px] text-muted-foreground text-center">Idle RPG v1.0</p>
      </div>
    </aside>
  );
}
