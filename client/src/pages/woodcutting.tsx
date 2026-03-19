import { useGameState } from "@/hooks/use-game";
import { SkillPage } from "@/components/skill-page";
import { Axe } from "lucide-react";

const RESOURCES = [
  { name: "Oak Logs", emoji: "🪵", time: 5, xp: 10, reqLevel: 1, resourceKey: "wood_0", actionKey: "woodcutting_0" },
  { name: "Willow Logs", emoji: "🌿", time: 10, xp: 25, reqLevel: 6, resourceKey: "wood_1", actionKey: "woodcutting_1" },
  { name: "Teak Logs", emoji: "🌳", time: 15, xp: 40, reqLevel: 11, resourceKey: "wood_2", actionKey: "woodcutting_2" },
  { name: "Maple Logs", emoji: "🍁", time: 20, xp: 55, reqLevel: 16, resourceKey: "wood_3", actionKey: "woodcutting_3" },
  { name: "Mahogany Logs", emoji: "🌲", time: 25, xp: 70, reqLevel: 21, resourceKey: "wood_4", actionKey: "woodcutting_4" },
  { name: "Yew Logs", emoji: "🎋", time: 30, xp: 85, reqLevel: 26, resourceKey: "wood_5", actionKey: "woodcutting_5" },
  { name: "Magic Logs", emoji: "✨", time: 35, xp: 100, reqLevel: 31, resourceKey: "wood_6", actionKey: "woodcutting_6" },
  { name: "Elder Logs", emoji: "🌟", time: 40, xp: 115, reqLevel: 36, resourceKey: "wood_7", actionKey: "woodcutting_7" },
  { name: "Redwood Logs", emoji: "🎑", time: 45, xp: 130, reqLevel: 41, resourceKey: "wood_8", actionKey: "woodcutting_8" },
  { name: "Spirit Logs", emoji: "💫", time: 50, xp: 145, reqLevel: 46, resourceKey: "wood_9", actionKey: "woodcutting_9" },
];

export default function Woodcutting() {
  const { data: state } = useGameState();
  if (!state) return null;

  return (
    <SkillPage
      skillName="Woodcutting"
      skillXp={state.woodcuttingXp}
      icon={Axe}
      iconColor="text-green-400"
      state={state}
      resources={RESOURCES}
    />
  );
}
