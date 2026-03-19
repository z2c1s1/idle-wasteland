import { useGameState } from "@/hooks/use-game";
import { SkillPage } from "@/components/skill-page";
import { Hammer } from "lucide-react";

const RESOURCES = [
  { name: "Cloth", emoji: "🧵", time: 5, xp: 25, reqLevel: 1, resourceKey: "item_0", actionKey: "crafting_0" },
  { name: "Leather", emoji: "🧤", time: 10, xp: 55, reqLevel: 6, resourceKey: "item_1", actionKey: "crafting_1" },
  { name: "Jewelry", emoji: "💍", time: 15, xp: 85, reqLevel: 11, resourceKey: "item_2", actionKey: "crafting_2" },
  { name: "Armor", emoji: "🛡️", time: 20, xp: 115, reqLevel: 16, resourceKey: "item_3", actionKey: "crafting_3" },
  { name: "Weapon", emoji: "⚔️", time: 25, xp: 145, reqLevel: 21, resourceKey: "item_4", actionKey: "crafting_4" },
  { name: "Artifact", emoji: "🏺", time: 30, xp: 175, reqLevel: 26, resourceKey: "item_5", actionKey: "crafting_5" },
  { name: "Relic", emoji: "🗿", time: 35, xp: 205, reqLevel: 31, resourceKey: "item_6", actionKey: "crafting_6" },
  { name: "Masterpiece", emoji: "🎨", time: 40, xp: 235, reqLevel: 36, resourceKey: "item_7", actionKey: "crafting_7" },
  { name: "Celestial", emoji: "🌙", time: 45, xp: 265, reqLevel: 41, resourceKey: "item_8", actionKey: "crafting_8" },
  { name: "Divine", emoji: "✨", time: 50, xp: 295, reqLevel: 46, resourceKey: "item_9", actionKey: "crafting_9" },
];

export default function Crafting() {
  const { data: state } = useGameState();
  if (!state) return null;

  return (
    <SkillPage
      skillName="Crafting"
      skillXp={state.craftingXp}
      icon={Hammer}
      iconColor="text-purple-400"
      state={state}
      resources={RESOURCES}
    />
  );
}
