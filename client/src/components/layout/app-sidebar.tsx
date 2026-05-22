import { Link, useLocation } from "wouter";
import {
  Axe, Pickaxe, LayoutDashboard, Swords, Flame, Waves, PawPrint,
  Hammer, Shield, Package, Skull, Gem,
} from "lucide-react";
import { useGameState } from "@/hooks/use-game";
import { calculateLevel, getCombatLevel, formatNumber } from "@/lib/game-utils";
import type { GameState } from "@shared/schema";

const GATHERING_SKILLS = [
  { title: "Woodcutting", url: "/woodcutting", icon: Axe,      xpKey: "woodcuttingXp" as const, color: "text-green-400"  },
  { title: "Mining",      url: "/mining",      icon: Pickaxe,  xpKey: "miningXp"      as const, color: "text-yellow-400" },
  { title: "Smelting",    url: "/smelting",    icon: Flame,    xpKey: "smeltingXp"    as const, color: "text-orange-400" },
  { title: "Fishing",     url: "/fishing",     icon: Waves,    xpKey: "fishingXp"     as const, color: "text-blue-400"   },
  { title: "Hunting",     url: "/hunting",     icon: PawPrint, xpKey: "huntingXp"     as const, color: "text-red-400"    },
  { title: "Crafting",    url: "/crafting",    icon: Hammer,   xpKey: "craftingXp"    as const, color: "text-purple-400" },
];

const PRODUCTION_SKILLS = [
  { title: "Smithing",      url: "/smithing",      icon: Shield, xpKey: "smithingXp"       as const, color: "text-slate-400"  },
  { title: "Leatherworking",url: "/leatherworking",icon: PawPrint,xpKey: "leatherworkingXp"as const, color: "text-amber-400"  },
  { title: "Jewelcrafting", url: "/jewelcrafting", icon: Gem,    xpKey: "jewelcraftingXp"  as const, color: "text-purple-400" },
];

function NavItem({ title, url, icon: Icon, color, level, isActive }: {
  title: string; url: string; icon: React.ElementType;
  color?: string; level: number | null; isActive: boolean;
}) {
  return (
    <Link href={url}>
      <div className={`flex items-center gap-2.5 px-3 py-2 mx-1 rounded cursor-pointer transition-colors ${
        isActive
          ? "bg-primary/20 text-primary border border-primary/30"
          : "text-muted-foreground hover:text-foreground hover:bg-accent"
      }`}>
        <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-primary" : (color ?? "")}`} />
        <span className="text-sm font-medium flex-1 min-w-0 truncate">{title}</span>
        {level !== null && (
          <span className={`text-xs font-bold tabular-nums ${isActive ? "text-primary" : "text-muted-foreground"}`}>
            {level}
          </span>
        )}
      </div>
    </Link>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="px-2 pt-3 pb-1">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</span>
    </div>
  );
}

export function AppSidebar() {
  const [location] = useLocation();
  const { data: state } = useGameState();
  const gs = state as GameState | undefined;
  const combatLevel = gs ? getCombatLevel(gs) : null;

  return (
    <aside className="w-48 flex-shrink-0 bg-[hsl(220_13%_8%)] border-r border-border flex flex-col overflow-y-auto">
      <div className="px-3 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Swords className="w-5 h-5 text-primary" />
          <span className="font-display font-bold text-base text-foreground">Idle RPG</span>
        </div>
        {gs && (
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <span>💰 {formatNumber(gs.gold)}</span>
            {gs.bones > 0 && <span>🦴 {formatNumber(gs.bones)}</span>}
          </div>
        )}
      </div>

      <nav className="flex-1 py-1">
        <SectionLabel label="General" />
        <NavItem title="Dashboard" url="/" icon={LayoutDashboard} level={null} isActive={location === "/"} />
        <NavItem title="Inventory" url="/inventory" icon={Package} level={null}
          isActive={location === "/inventory"} color="text-yellow-400" />

        <SectionLabel label="Gathering" />
        {GATHERING_SKILLS.map(skill => (
          <NavItem
            key={skill.title}
            title={skill.title}
            url={skill.url}
            icon={skill.icon}
            color={skill.color}
            level={gs ? calculateLevel(gs[skill.xpKey]) : null}
            isActive={location === skill.url}
          />
        ))}

        <SectionLabel label="Combat" />
        <NavItem title="Combat" url="/combat" icon={Skull}
          level={combatLevel} isActive={location === "/combat"} color="text-red-400" />

        <SectionLabel label="Production" />
        {PRODUCTION_SKILLS.map(skill => {
          const xp = gs ? ((gs as Record<string, unknown>)[skill.xpKey] as number | undefined) ?? 0 : null;
          return (
            <NavItem
              key={skill.title}
              title={skill.title}
              url={skill.url}
              icon={skill.icon}
              color={skill.color}
              level={xp !== null ? calculateLevel(xp) : null}
              isActive={location === skill.url}
            />
          );
        })}

        <SectionLabel label="Items" />
        <NavItem title="Gems" url="/gems" icon={Gem} level={null}
          isActive={location === "/gems"} color="text-cyan-400" />
      </nav>

      <div className="px-3 py-3 border-t border-border">
        <p className="text-[10px] text-muted-foreground text-center">Idle RPG v2.0</p>
      </div>
    </aside>
  );
}
