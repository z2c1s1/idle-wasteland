import { useGameState } from "@/hooks/use-game";
import { SkillPage } from "@/components/skill-page";
import { Flame } from "lucide-react";

const RESOURCES = [
  { name: "Bronze Bar", emoji: "🟫", time: 5, xp: 20, reqLevel: 1, resourceKey: "bar_0", actionKey: "smelting_0" },
  { name: "Iron Bar", emoji: "🔘", time: 10, xp: 45, reqLevel: 6, resourceKey: "bar_1", actionKey: "smelting_1" },
  { name: "Steel Bar", emoji: "⚙️", time: 15, xp: 70, reqLevel: 11, resourceKey: "bar_2", actionKey: "smelting_2" },
  { name: "Silver Bar", emoji: "🥈", time: 20, xp: 95, reqLevel: 16, resourceKey: "bar_3", actionKey: "smelting_3" },
  { name: "Gold Bar", emoji: "🥇", time: 25, xp: 120, reqLevel: 21, resourceKey: "bar_4", actionKey: "smelting_4" },
  { name: "Mithril Bar", emoji: "🔷", time: 30, xp: 145, reqLevel: 26, resourceKey: "bar_5", actionKey: "smelting_5" },
  { name: "Adamant Bar", emoji: "🟩", time: 35, xp: 170, reqLevel: 31, resourceKey: "bar_6", actionKey: "smelting_6" },
  { name: "Rune Bar", emoji: "🔹", time: 40, xp: 195, reqLevel: 36, resourceKey: "bar_7", actionKey: "smelting_7" },
  { name: "Dragon Bar", emoji: "🐲", time: 45, xp: 220, reqLevel: 41, resourceKey: "bar_8", actionKey: "smelting_8" },
  { name: "Eternal Bar", emoji: "⭐", time: 50, xp: 245, reqLevel: 46, resourceKey: "bar_9", actionKey: "smelting_9" },
];

export default function Smelting() {
  const { data: state } = useGameState();
  if (!state) return null;

  return (
    <SkillPage
      skillName="Smelting"
      skillXp={state.smeltingXp}
      icon={Flame}
      iconColor="text-orange-400"
      state={state}
      resources={RESOURCES}
    />
  );
}
