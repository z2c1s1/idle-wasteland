import type { LucideIcon } from "lucide-react";
import { R } from "@/lib/routes";
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
    defaultPath: R.inventory,
    routes: [
      { path: R.inventory, labelKey: "navInventory" },
      { path: R.gems, labelKey: "navGems" },
      { path: R.materials, labelKey: "navMaterials" },
    ],
  },
  {
    id: "camp",
    icon: Tent,
    labelKey: "camp",
    defaultPath: R.shelter,
    routes: [
      { path: R.shelter, labelKey: "navShelter" },
      { path: R.cooking, labelKey: "navCooking" },
      { path: R.alchemy, labelKey: "navAlchemy" },
      { path: R.prayer, labelKey: "navPrayer" },
      { path: R.agility, labelKey: "navAgility" },
      { path: R.talents, labelKey: "navTalents" },
      { path: R.pets, labelKey: "navPets" },
      { path: R.wastelandTech, labelKey: "navWastelandTech" },
      { path: R.bounties, labelKey: "navBounties" },
      { path: R.gamble, labelKey: "navGamble" },
    ],
  },
  {
    id: "workshop",
    icon: Wrench,
    labelKey: "workshop",
    defaultPath: R.smelting,
    routes: [
      { path: R.smelting, labelKey: "navSmelting" },
      { path: R.smithing, labelKey: "navSmithing" },
      { path: R.leatherworking, labelKey: "navLeatherworking" },
      { path: R.jewelcrafting, labelKey: "navJewelcrafting" },
      { path: R.tools, labelKey: "navTools" },
      { path: R.equipmentSynth, labelKey: "navEquipmentSynth" },
      { path: R.crafting, labelKey: "navCrafting" },
    ],
  },
  {
    id: "scavenge",
    icon: Search,
    labelKey: "scavenge",
    defaultPath: R.woodcutting,
    routes: [
      { path: R.woodcutting, labelKey: "navWoodcutting" },
      { path: R.mining, labelKey: "navMining" },
      { path: R.fishing, labelKey: "navFishing" },
      { path: R.hunting, labelKey: "navHunting" },
      { path: R.thieving, labelKey: "navThieving" },
    ],
  },
  {
    id: "wasteland",
    icon: Skull,
    labelKey: "wasteland",
    defaultPath: R.combat,
    routes: [
      { path: R.combat, labelKey: "navCombat", hash: "#enemies" },
      { path: R.combat, labelKey: "navDungeons", hash: "#dungeons" },
      { path: R.combat, labelKey: "navTower", hash: "#tower" },
      { path: R.combat, labelKey: "navTrial", hash: "#trial" },
    ],
  },
  {
    id: "frontier",
    icon: Map,
    labelKey: "frontier",
    defaultPath: R.exploration,
    routes: [
      { path: R.exploration, labelKey: "navExploration" },
      { path: R.town, labelKey: "navTown" },
    ],
  },
];

const ALL_PATHS = ZONES.flatMap(z => z.routes.map(r => r.path));

export function getZoneForPath(pathname: string): ZoneId {
  for (const zone of ZONES) {
    if (zone.routes.some(r => r.path === pathname)) return zone.id;
  }
  if (pathname === R.dashboard) return "camp";
  const prefix = ALL_PATHS.find(p => p !== R.dashboard && pathname.startsWith(p));
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
