import { useGameState } from "@/hooks/use-game";
import { SkillPage } from "@/components/skill-page";
import { Pickaxe } from "lucide-react";

const ORES = ["铜矿","锡矿","铁矿","煤矿","秘银矿","精金矿","符文矿","龙矿","黑曜矿","以太矿"];
const LV = [1,4,7,10,15,25,40,60,80,99];
const T = [3,4,5,6,8,10,12,14,16,18];
const X = [12,19,28,40,56,75,98,128,164,210];
const RESOURCES = LV.map((lv, i) => ({
  name: ORES[i], emoji: "⛏️", time: T[i], xp: X[i], reqLevel: lv,
  resourceKey: `ore_${i}`, actionKey: `mining_${i}`,
}));

export default function Mining() {
  const { data: state } = useGameState();
  if (!state) return null;
  return (<SkillPage skillName="Mining" skillXp={state.miningXp} icon={Pickaxe} iconColor="text-yellow-400" state={state} resources={RESOURCES} />);
}