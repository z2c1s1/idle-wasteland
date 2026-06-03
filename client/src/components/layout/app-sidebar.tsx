import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import {
  Axe, Pickaxe, LayoutDashboard, Swords, Flame, Waves, PawPrint, Soup,
  Hammer, Shield, Package, Skull, Gem, HandMetal, Home, Scissors,
  Footprints, CandlestickChart, Building2, Map, Radiation,
} from "lucide-react";
import { useGameState } from "@/hooks/use-game";
import { calculateLevel, getCombatLevel, formatNumber } from "@/lib/game-utils";
import type { GameState } from "@shared/schema";

const GATHERING_SKILLS = [
  { title: "伐木", url: "/woodcutting", icon: Axe,      xpKey: "woodcuttingXp" as const, color: "text-green-400"  },
  { title: "采矿", url: "/mining",      icon: Pickaxe,  xpKey: "miningXp"      as const, color: "text-yellow-400" },
  { title: "冶炼", url: "/smelting",    icon: Flame,    xpKey: "smeltingXp"    as const, color: "text-orange-400" },
  { title: "钓鱼", url: "/fishing",     icon: Waves,    xpKey: "fishingXp"     as const, color: "text-blue-400"   },
  { title: "狩猎", url: "/hunting",     icon: PawPrint, xpKey: "huntingXp"     as const, color: "text-red-400"    },
  { title: "搜刮", url: "/thieving",    icon: HandMetal,xpKey: "thievingXp"    as const, color: "text-purple-400" },
];

const PRODUCTION_SKILLS = [
  { title: "锻造",     url: "/smithing",      icon: Shield, xpKey: "smithingXp"       as const, color: "text-slate-400"  },
  { title: "皮革制作", url: "/leatherworking",icon: Scissors,xpKey: "leatherworkingXp"as const, color: "text-amber-400"  },
  { title: "珠宝制作", url: "/jewelcrafting", icon: Gem,    xpKey: "jewelcraftingXp"  as const, color: "text-purple-400" },
  { title: "工具制作", url: "/tools",         icon: Hammer, xpKey: "smithingXp"       as const, color: "text-amber-400"  },
];

function NavItem({ title, url, icon: Icon, color, level, isActive }: {
  title: string; url: string; icon: React.ElementType;
  color?: string; level: number | null; isActive: boolean;
}) {
  const [, navigate] = useLocation();
  const click = () => {
    const [path, hashPart] = url.split('#');
    navigate(path);
    if (hashPart) window.location.hash = hashPart;
  };
  return (
    <div onClick={click} className={`flex items-center gap-2.5 px-3 py-2 mx-1 rounded cursor-pointer transition-colors ${
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
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const cb = () => setHash(window.location.hash);
    window.addEventListener('hashchange', cb);
    return () => window.removeEventListener('hashchange', cb);
  }, []);
  return (
    <aside className="w-48 flex-shrink-0 bg-[hsl(220_13%_8%)] border-r border-border flex flex-col overflow-y-auto">
      <div className="px-3 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Radiation className="w-5 h-5 text-yellow-400" />
          <span className="font-display font-bold text-base text-foreground">辐射废土</span>
        </div>
        {gs && (
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <span>💰 {formatNumber(gs.gold)}</span>
            {gs.bones > 0 && <span>🦴 {formatNumber(gs.bones)}</span>}
          </div>
        )}
      </div>

      <nav className="flex-1 py-1">
        <SectionLabel label="常规" />
        <NavItem title="总览" url="/" icon={LayoutDashboard} level={null} isActive={location === "/"} />
        <NavItem title="背包" url="/inventory" icon={Package} level={null}
          isActive={location === "/inventory"} color="text-yellow-400" />
        <NavItem title="宝石" url="/gems" icon={Gem} level={null}
          isActive={location === "/gems"} color="text-purple-400" />
        <NavItem title="避难所" url="/homestead" icon={Home} level={null}
          isActive={location === "/homestead"} color="text-green-400" />
        <NavItem title="幸存者营地" url="/town" icon={Building2}
          level={null}
          isActive={location === "/town"} color="text-amber-400" />
        <NavItem title="天赋" url="/talents" icon={Gem} level={null}
          isActive={location === "/talents"} color="text-amber-400" />

        <SectionLabel label="战斗" />
        <NavItem title="废土战斗" url="/combat#enemies" icon={Skull}
          level={null} isActive={location === "/combat" && (hash === '' || hash === '#enemies')} color="text-red-400" />
        <NavItem title="废墟探索" url="/combat#dungeons" icon={Skull}
          level={null} isActive={location === "/combat" && hash === '#dungeons'} color="text-purple-400" />
        <NavItem title="高塔攀登" url="/combat#tower" icon={Gem} level={null}
          isActive={location === "/combat" && hash === '#tower'} color="text-red-400" />
        <NavItem title="辐射试炼" url="/combat#trial" icon={Radiation} level={null}
          isActive={location === "/combat" && hash === '#trial'} color="text-amber-400" />

        <SectionLabel label="采集" />
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
        <NavItem title="敏捷" url="/agility" icon={Footprints}
          level={gs ? calculateLevel((gs as any).agilityXp ?? 0) : null}
          isActive={location === "/agility"} color="text-cyan-400" />
        <NavItem title="探索" url="/exploration" icon={Map}
          level={gs ? calculateLevel((gs as any).explorationXp ?? 0) : null}
          isActive={location === "/exploration"} color="text-indigo-400" />

        <SectionLabel label="生产" />
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
        <NavItem title="装备合成" url="/equipment-synth" icon={Hammer}
          level={gs ? calculateLevel((gs as any).synthesisXp ?? 0) : null}
          isActive={location === "/equipment-synth"} color="text-amber-400" />
        <NavItem title="烹饪" url="/cooking" icon={Soup} level={null}
          isActive={location === "/cooking"} color="text-orange-400" />
        <NavItem title="炼金" url="/alchemy" icon={Flame} level={null}
          isActive={location === "/alchemy"} color="text-purple-400" />
        <NavItem title="祷言" url="/prayer" icon={CandlestickChart}
          level={null}
          isActive={location === "/prayer"} color="text-amber-400" />

      </nav>

      <div className="px-3 py-3 border-t border-border">
        <p className="text-[10px] text-muted-foreground text-center">辐射废土 v1.0</p>
      </div>
    </aside>
  );
}
