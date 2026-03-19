import { useGameState } from "@/hooks/use-game";
import { SkillPage } from "@/components/skill-page";
import { PawPrint } from "lucide-react";

const RESOURCES = [
  { name: "Rabbit Hide", emoji: "🐇", time: 5, xp: 18, reqLevel: 1, resourceKey: "hide_0", actionKey: "hunting_0" },
  { name: "Bird Feathers", emoji: "🦅", time: 10, xp: 40, reqLevel: 6, resourceKey: "hide_1", actionKey: "hunting_1" },
  { name: "Fox Pelt", emoji: "🦊", time: 15, xp: 62, reqLevel: 11, resourceKey: "hide_2", actionKey: "hunting_2" },
  { name: "Wolf Hide", emoji: "🐺", time: 20, xp: 84, reqLevel: 16, resourceKey: "hide_3", actionKey: "hunting_3" },
  { name: "Bear Pelt", emoji: "🐻", time: 25, xp: 106, reqLevel: 21, resourceKey: "hide_4", actionKey: "hunting_4" },
  { name: "Boar Hide", emoji: "🐗", time: 30, xp: 128, reqLevel: 26, resourceKey: "hide_5", actionKey: "hunting_5" },
  { name: "Deer Antlers", emoji: "🦌", time: 35, xp: 150, reqLevel: 31, resourceKey: "hide_6", actionKey: "hunting_6" },
  { name: "Tiger Pelt", emoji: "🐯", time: 40, xp: 172, reqLevel: 36, resourceKey: "hide_7", actionKey: "hunting_7" },
  { name: "Dragon Scale", emoji: "🐉", time: 45, xp: 194, reqLevel: 41, resourceKey: "hide_8", actionKey: "hunting_8" },
  { name: "Phoenix Feather", emoji: "🔥", time: 50, xp: 216, reqLevel: 46, resourceKey: "hide_9", actionKey: "hunting_9" },
];

export default function Hunting() {
  const { data: state } = useGameState();
  if (!state) return null;

  return (
    <SkillPage
      skillName="Hunting"
      skillXp={state.huntingXp}
      icon={PawPrint}
      iconColor="text-red-400"
      state={state}
      resources={RESOURCES}
    />
  );
}
