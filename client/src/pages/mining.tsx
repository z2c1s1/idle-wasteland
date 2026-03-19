import { useGameState } from "@/hooks/use-game";
import { SkillPage } from "@/components/skill-page";
import { Pickaxe } from "lucide-react";

const RESOURCES = [
  { name: "Copper Ore", emoji: "🟤", time: 5, xp: 15, reqLevel: 1, resourceKey: "ore_0", actionKey: "mining_0" },
  { name: "Tin Ore", emoji: "⬜", time: 10, xp: 35, reqLevel: 6, resourceKey: "ore_1", actionKey: "mining_1" },
  { name: "Iron Ore", emoji: "🔩", time: 15, xp: 55, reqLevel: 11, resourceKey: "ore_2", actionKey: "mining_2" },
  { name: "Coal", emoji: "⚫", time: 20, xp: 75, reqLevel: 16, resourceKey: "ore_3", actionKey: "mining_3" },
  { name: "Mithril Ore", emoji: "🔵", time: 25, xp: 95, reqLevel: 21, resourceKey: "ore_4", actionKey: "mining_4" },
  { name: "Adamant Ore", emoji: "🟢", time: 30, xp: 115, reqLevel: 26, resourceKey: "ore_5", actionKey: "mining_5" },
  { name: "Rune Ore", emoji: "🔮", time: 35, xp: 135, reqLevel: 31, resourceKey: "ore_6", actionKey: "mining_6" },
  { name: "Dragon Ore", emoji: "🐉", time: 40, xp: 155, reqLevel: 36, resourceKey: "ore_7", actionKey: "mining_7" },
  { name: "Obsidian", emoji: "🖤", time: 45, xp: 175, reqLevel: 41, resourceKey: "ore_8", actionKey: "mining_8" },
  { name: "Ether Ore", emoji: "💎", time: 50, xp: 195, reqLevel: 46, resourceKey: "ore_9", actionKey: "mining_9" },
];

export default function Mining() {
  const { data: state } = useGameState();
  if (!state) return null;

  return (
    <SkillPage
      skillName="Mining"
      skillXp={state.miningXp}
      icon={Pickaxe}
      iconColor="text-yellow-400"
      state={state}
      resources={RESOURCES}
    />
  );
}
