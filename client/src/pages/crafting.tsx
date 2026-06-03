import { useGameState } from "@/hooks/use-game";
import { SkillPage } from "@/components/skill-page";
import { Hammer } from "lucide-react";

const ITEMS = ["布匹","皮革","珠宝","护甲","武器","神器","遗物","杰作","天界","神圣"];
const LV = [1,4,7,10,15,25,40,60,80,99];
const T = [4,5,6,7,9,11,13,15,17,19];
const X = [14,22,33,48,67,90,118,153,197,252];
const RESOURCES = LV.map((lv, i) => ({
  name: ITEMS[i], emoji: "🧵", time: T[i], xp: X[i], reqLevel: lv,
  resourceKey: `item_${i}`, actionKey: `crafting_${i}`,
}));

export default function Crafting() {
  const { data: state } = useGameState();
  if (!state) return null;
  return (<SkillPage skillName="Crafting" skillXp={state.craftingXp} icon={Hammer} iconColor="text-purple-400" state={state} resources={RESOURCES} />);
}