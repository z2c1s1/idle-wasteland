import { useGameState } from "@/hooks/use-game";
import { SkillPage } from "@/components/skill-page";
import { Flame } from "lucide-react";

const ORES = ["铜矿","锡矿","铁矿","煤矿","秘银矿","精金矿","符文矿","龙矿","黑曜矿","以太矿"];
const LV = [1,4,7,10,15,25,40,60,80,99];
const T = [4,5,6,7,9,11,13,15,17,19];
const X = [15,24,36,52,72,97,127,166,213,273];
const RESOURCES = LV.map((lv, i) => ({
  name: `锭${i+1}`, emoji: "🔩", time: T[i], xp: X[i], reqLevel: lv,
  resourceKey: `bar_${i}`, actionKey: `smelting_${i}`,
  requiredKey: `ore_${i}`, requiredName: ORES[i],
}));

export default function Smelting() {
  const { data: state } = useGameState();
  if (!state) return null;
  return (<SkillPage skillName="Smelting" skillXp={state.smeltingXp} icon={Flame} iconColor="text-orange-400" state={state} resources={RESOURCES} />);
}