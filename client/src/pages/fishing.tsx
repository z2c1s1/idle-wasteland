import { useGameState } from "@/hooks/use-game";
import { SkillPage } from "@/components/skill-page";
import { Waves } from "lucide-react";

const RESOURCES = [
  { name: "Shrimp", emoji: "🦐", time: 5, xp: 12, reqLevel: 1, resourceKey: "fish_0", actionKey: "fishing_0" },
  { name: "Sardine", emoji: "🐟", time: 10, xp: 30, reqLevel: 6, resourceKey: "fish_1", actionKey: "fishing_1" },
  { name: "Herring", emoji: "🐠", time: 15, xp: 48, reqLevel: 11, resourceKey: "fish_2", actionKey: "fishing_2" },
  { name: "Trout", emoji: "🎣", time: 20, xp: 66, reqLevel: 16, resourceKey: "fish_3", actionKey: "fishing_3" },
  { name: "Salmon", emoji: "🍣", time: 25, xp: 84, reqLevel: 21, resourceKey: "fish_4", actionKey: "fishing_4" },
  { name: "Tuna", emoji: "🐡", time: 30, xp: 102, reqLevel: 26, resourceKey: "fish_5", actionKey: "fishing_5" },
  { name: "Lobster", emoji: "🦞", time: 35, xp: 120, reqLevel: 31, resourceKey: "fish_6", actionKey: "fishing_6" },
  { name: "Swordfish", emoji: "⚔️", time: 40, xp: 138, reqLevel: 36, resourceKey: "fish_7", actionKey: "fishing_7" },
  { name: "Shark", emoji: "🦈", time: 45, xp: 156, reqLevel: 41, resourceKey: "fish_8", actionKey: "fishing_8" },
  { name: "Whale", emoji: "🐳", time: 50, xp: 174, reqLevel: 46, resourceKey: "fish_9", actionKey: "fishing_9" },
];

export default function Fishing() {
  const { data: state } = useGameState();
  if (!state) return null;

  return (
    <SkillPage
      skillName="Fishing"
      skillXp={state.fishingXp}
      icon={Waves}
      iconColor="text-blue-400"
      state={state}
      resources={RESOURCES}
    />
  );
}
