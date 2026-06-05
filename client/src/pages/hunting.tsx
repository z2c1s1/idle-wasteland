import { useGameState } from "@/hooks/use-game";
import { SkillPage } from "@/components/skill-page";
import { PawPrint } from "lucide-react";

const HIDES = ["兔皮","鸟羽","狐皮","狼皮","熊皮","野猪皮","鹿皮","虎皮","龙皮","凤凰羽"];
const LV = [1,4,7,10,15,25,40,60,80,99];
const T = [3,4,5,6,8,10,12,14,16,18];
const X = [10,17,25,36,50,67,88,115,147,189];
const RESOURCES = LV.map((lv, i) => ({
  name: HIDES[i], emoji: "🪶", time: T[i], xp: X[i], reqLevel: lv,
  resourceKey: `hide_${i}`, actionKey: `hunting_${i}`, resourceType: "hide" as const,
}));

export default function Hunting() {
  const { data: state } = useGameState();
  if (!state) return null;
  return (<SkillPage skillName="Hunting" skillXp={state.huntingXp} icon={PawPrint} iconColor="text-red-400" state={state} resources={RESOURCES} />);
}