import type { LucideIcon } from "lucide-react";
import {
  Tent, Skull, Search, Wrench, Backpack, Map,
} from "lucide-react";

export type ZoneId = "camp" | "wasteland" | "scavenge" | "workshop" | "stash" | "frontier";

export interface ZoneRoute {
  path: string;
  /** Key into uiText.sidebar */
  labelKey: keyof typeof import("@/lib/text").uiText.sidebar;
  hash?: string;
}

export interface ZoneDef {
  id: ZoneId;
  icon: LucideIcon;
  /** Key into uiText.shell.zones */
  labelKey: "camp" | "wasteland" | "scavenge" | "workshop" | "stash" | "frontier";
  defaultPath: string;
  routes: ZoneRoute[];
}

export const ZONES: ZoneDef[] = [
  {
    id: "stash",
    icon: Backpack,
    labelKey: "stash",
    defaultPath: "/inventory",
    routes: [
      { path: "/inventory", labelKey: "navInventory" },
      { path: "/gems", labelKey: "navGems" },
      { path: "/materials", labelKey: "navMaterials" },
    ],
  },
  {
    id: "camp",
    icon: Tent,
    labelKey: "camp",
    defaultPath: "/shelter",
    routes: [
      { path: "/shelter", labelKey: "navShelter" },
      { path: "/cooking", labelKey: "navCooking" },
      { path: "/alchemy", labelKey: "navAlchemy" },
      { path: "/prayer", labelKey: "navPrayer" },
      { path: "/agility", labelKey: "navAgility" },
      { path: "/talents", labelKey: "navTalents" },
      { path: "/pets", labelKey: "navPets" },
      { path: "/wasteland-tech", labelKey: "navWastelandTech" },
      { path: "/bounties", labelKey: "navBounties" },
    ],
  },
  {
    id: "workshop",
    icon: Wrench,
    labelKey: "workshop",
    defaultPath: "/smelting",
    routes: [
      { path: "/smelting", labelKey: "navSmelting" },
      { path: "/smithing", labelKey: "navSmithing" },
      { path: "/leatherworking", labelKey: "navLeatherworking" },
      { path: "/jewelcrafting", labelKey: "navJewelcrafting" },
      { path: "/tools", labelKey: "navTools" },
      { path: "/equipment-synth", labelKey: "navEquipmentSynth" },
    ],
  },
  {
    id: "scavenge",
    icon: Search,
    labelKey: "scavenge",
    defaultPath: "/woodcutting",
    routes: [
      { path: "/woodcutting", labelKey: "navWoodcutting" },
      { path: "/mining", labelKey: "navMining" },
      { path: "/fishing", labelKey: "navFishing" },
      { path: "/hunting", labelKey: "navHunting" },
      { path: "/thieving", labelKey: "navThieving" },
    ],
  },
  {
    id: "wasteland",
    icon: Skull,
    labelKey: "wasteland",
    defaultPath: "/combat",
    routes: [
      { path: "/combat", labelKey: "navCombat", hash: "#enemies" },
      { path: "/combat", labelKey: "navDungeons", hash: "#dungeons" },
      { path: "/combat", labelKey: "navTower", hash: "#tower" },
      { path: "/combat", labelKey: "navTrial", hash: "#trial" },
    ],
  },
  {
    id: "frontier",
    icon: Map,
    labelKey: "frontier",
    defaultPath: "/exploration",
    routes: [
      { path: "/exploration", labelKey: "navExploration" },
      { path: "/town", labelKey: "navTown" },
    ],
  },
];

const ALL_PATHS = ZONES.flatMap(z => z.routes.map(r => r.path));

export function getZoneForPath(pathname: string): ZoneId {
  for (const zone of ZONES) {
    if (zone.routes.some(r => r.path === pathname)) return zone.id;
  }
  if (pathname === "/") return "camp";
  const prefix = ALL_PATHS.find(p => p !== "/" && pathname.startsWith(p));
  if (prefix) {
    for (const zone of ZONES) {
      if (zone.routes.some(r => r.path === prefix)) return zone.id;
    }
  }
  return "camp";
}

export function isRouteActive(pathname: string, hash: string, route: ZoneRoute): boolean {
  if (route.path !== pathname) return false;
  if (route.hash) return hash === route.hash || (route.hash === "#enemies" && (hash === "" || hash === "#enemies"));
  return !route.hash;
}
