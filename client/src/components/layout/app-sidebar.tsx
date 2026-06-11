import { useLocation } from "wouter";
import { R } from "@/lib/routes";
import { useState, useEffect } from "react";
import {
  Axe, Pickaxe, LayoutDashboard, Swords, Flame, Waves, PawPrint, Soup,
  Hammer, Shield, Box, Package, Skull, Gem, HandMetal, Home, Scissors,
  Footprints, CandlestickChart, Building2, Map, Zap, Radiation, Trophy,
} from "lucide-react";
import { RadiationIcon } from "@/components/sprites";
import { useGameState } from "@/hooks/use-game";
import { calculateLevel, getCombatLevel, formatNumber, getResourceCount } from "@/lib/game-utils";
import { useUIText, type Language } from "@/lib/i18n";
import type { GameState } from "@shared/schema";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar,
} from "@/components/ui/sidebar";

function gatherSkills(t: ReturnType<typeof useUIText>) { return [
  { title: t.sidebar.navWoodcutting, url: R.woodcutting, icon: Axe,      xpKey: "woodcuttingXp" as const, color: "text-green-400"  },
  { title: t.sidebar.navMining,      url: R.mining,      icon: Pickaxe,  xpKey: "miningXp"      as const, color: "text-yellow-400" },
  { title: t.sidebar.navSmelting,    url: R.smelting,    icon: Flame,    xpKey: "smeltingXp"    as const, color: "text-orange-400" },
  { title: t.sidebar.navFishing,     url: R.fishing,     icon: Waves,    xpKey: "fishingXp"     as const, color: "text-blue-400"   },
  { title: t.sidebar.navHunting,     url: R.hunting,     icon: PawPrint, xpKey: "huntingXp"     as const, color: "text-red-400"    },
  { title: t.sidebar.navThieving,    url: R.thieving,    icon: HandMetal,xpKey: "thievingXp"    as const, color: "text-purple-400" },
]}

function prodSkills(t: ReturnType<typeof useUIText>) { return [
  { title: t.sidebar.navSmithing,       url: R.smithing,       icon: Shield,   xpKey: "smithingXp"       as const, color: "text-slate-400"  },
  { title: t.sidebar.navLeatherworking, url: R.leatherworking, icon: Scissors, xpKey: "leatherworkingXp"as const, color: "text-amber-400"  },
  { title: t.sidebar.navJewelcrafting,  url: R.jewelcrafting,  icon: Gem,      xpKey: "jewelcraftingXp"  as const, color: "text-purple-400" },
  { title: t.sidebar.navTools,          url: R.tools,          icon: Hammer,   xpKey: "smithingXp"       as const, color: "text-amber-400"  },
]}

function NavItem({ title, url, icon: Icon, color, level, isActive }: {
  title: string; url: string; icon: React.ElementType;
  color?: string; level: number | null; isActive: boolean;
}) {
  const [, navigate] = useLocation();
  const { setOpenMobile } = useSidebar();
  const click = () => { const [path, hashPart] = url.split('#'); navigate(path); if (hashPart) window.location.hash = hashPart; setOpenMobile(false); };
  return (
    <SidebarMenuItem>
      <SidebarMenuButton onClick={click} isActive={isActive} tooltip={title}>
        <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-primary" : (color ?? "")}`} />
        <span className="flex-1 min-w-0 truncate">{title}</span>
        {level !== null && <span className={`text-xs font-bold tabular-nums ml-auto ${isActive ? "text-primary" : "text-muted-foreground"}`}>{level}</span>}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  const t = useUIText();
  const [location] = useLocation();
  const { data: state } = useGameState();
  const gs = state as GameState | undefined;
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => { const cb = () => setHash(window.location.hash); window.addEventListener('hashchange', cb); return () => window.removeEventListener('hashchange', cb); }, []);

  return (
    <Sidebar className="bg-[hsl(220_13%_8%)] border-r border-border">
      <SidebarHeader className="border-b border-border px-3 py-4">
        <div className="flex items-center gap-2">
          <RadiationIcon size={20} className="text-yellow-400" />
          <span className="font-display font-bold text-base text-foreground">{t.sidebar.title}</span>
        </div>
        {gs && <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground"><span>💰 {formatNumber(gs.gold)}</span>{getResourceCount(gs, "bones") > 0 && <span>🦴 {formatNumber(getResourceCount(gs, "bones"))}</span>}</div>}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t.sidebar.sectionGeneral}</SidebarGroupLabel>
          <SidebarMenu>
            <NavItem title={t.sidebar.navDashboard} url={R.dashboard} icon={LayoutDashboard} level={null} isActive={location === R.dashboard} />
            <NavItem title={t.sidebar.navInventory} url={R.inventory} icon={Package} level={null} isActive={location === R.inventory} color="text-yellow-400" />
            <NavItem title={t.sidebar.navGems} url={R.gems} icon={Gem} level={null} isActive={location === R.gems} color="text-purple-400" />
            <NavItem title={t.sidebar.navMaterials} url={R.materials} icon={Box} level={null} isActive={location === R.materials} color="text-cyan-400" />
            <NavItem title={t.sidebar.navShelter} url={R.shelter} icon={Home} level={null} isActive={location === R.shelter} color="text-green-400" />
            <NavItem title={t.sidebar.navTown} url={R.town} icon={Building2} level={null} isActive={location === R.town} color="text-amber-400" />
            <NavItem title={t.sidebar.navTalents} url={R.talents} icon={Gem} level={null} isActive={location === R.talents} color="text-amber-400" />
            <NavItem title={t.sidebar.navPets || "Pets"} url={R.pets} icon={Trophy} level={null} isActive={location === R.pets} color="text-yellow-400" />
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>{t.sidebar.sectionCombat}</SidebarGroupLabel>
          <SidebarMenu>
            <NavItem title={t.sidebar.navCombat} url={`${R.combat}#enemies`} icon={Skull} level={null} isActive={location === R.combat && (hash === '' || hash === '#enemies')} color="text-red-400" />
            <NavItem title={t.sidebar.navDungeons} url={`${R.combat}#dungeons`} icon={Skull} level={null} isActive={location === R.combat && hash === '#dungeons'} color="text-purple-400" />
            <NavItem title={t.sidebar.navTower} url={`${R.combat}#tower`} icon={Gem} level={null} isActive={location === R.combat && hash === '#tower'} color="text-red-400" />
            <NavItem title={t.sidebar.navTrial} url={`${R.combat}#trial`} icon={Radiation} level={null} isActive={location === R.combat && hash === '#trial'} color="text-amber-400" />
            <NavItem title={t.sidebar.navBounties} url={R.bounties} icon={Swords} level={null} isActive={location === R.bounties} color="text-yellow-400" />
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>{t.sidebar.sectionGathering}</SidebarGroupLabel>
          <SidebarMenu>
            {gatherSkills(t).map(skill => (
              <NavItem key={skill.title} title={skill.title} url={skill.url} icon={skill.icon} color={skill.color} level={gs ? calculateLevel(gs[skill.xpKey]) : null} isActive={location === skill.url} />
            ))}
            <NavItem title={t.sidebar.navAgility} url={R.agility} icon={Footprints} level={gs ? calculateLevel((gs as any).agilityXp ?? 0) : null} isActive={location === R.agility} color="text-cyan-400" />
            <NavItem title={t.sidebar.navExploration} url={R.exploration} icon={Map} level={gs ? calculateLevel((gs as any).explorationXp ?? 0) : null} isActive={location === R.exploration} color="text-indigo-400" />
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>{t.sidebar.sectionProduction}</SidebarGroupLabel>
          <SidebarMenu>
            {prodSkills(t).map(skill => {
              const xp = gs ? ((gs as Record<string, unknown>)[skill.xpKey] as number | undefined) ?? 0 : null;
              return <NavItem key={skill.title} title={skill.title} url={skill.url} icon={skill.icon} color={skill.color} level={xp !== null ? calculateLevel(xp) : null} isActive={location === skill.url} />;
            })}
            <NavItem title={t.sidebar.navEquipmentSynth} url={R.equipmentSynth} icon={Hammer} level={gs ? calculateLevel((gs as any).synthesisXp ?? 0) : null} isActive={location === R.equipmentSynth} color="text-amber-400" />
            <NavItem title={t.sidebar.navCooking} url={R.cooking} icon={Soup} level={null} isActive={location === R.cooking} color="text-orange-400" />
            <NavItem title={t.sidebar.navAlchemy} url={R.alchemy} icon={Flame} level={null} isActive={location === R.alchemy} color="text-purple-400" />
            <NavItem title={t.sidebar.navPrayer} url={R.prayer} icon={CandlestickChart} level={null} isActive={location === R.prayer} color="text-amber-400" />
            <NavItem title={t.sidebar.navCrafting} url={R.crafting} icon={Hammer} level={null} isActive={location === R.crafting} color="text-purple-400" />
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>{t.sidebar.sectionTech}</SidebarGroupLabel>
          <SidebarMenu>
            <NavItem title={t.sidebar.navWastelandTech} url={R.wastelandTech} icon={Zap} level={null} isActive={location === R.wastelandTech} color="text-amber-400" />
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <p className="text-[10px] text-muted-foreground text-center py-3 border-t border-border">{t.sidebar.version}</p>
      </SidebarFooter>
    </Sidebar>
  );
}
