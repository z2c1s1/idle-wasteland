import { useGameState } from "@/hooks/use-game";
import { SkillPage } from "@/components/skill-page";
import { Footprints } from "lucide-react";

const NAMES = ["基础跑酷","铁丝网穿越","坍塌楼攀爬","废墟障碍赛","下水道匍匐","断桥跳跃","高空索降","燃烧障碍跑","辐射区冲刺","垂直墙攀爬"];
const LV = [1,4,7,10,15,25,40,60,80,99];
const T = [5,6,7,8,10,12,14,16,18,20];
const X = [8,13,19,27,38,51,67,88,112,144];
const RESOURCES = LV.map((lv, i) => ({
  name: NAMES[i], emoji: "🏃", time: T[i], xp: X[i], reqLevel: lv,
  resourceKey: `agility_${i}`, actionKey: `agility_${i}`, resourceType: "agility" as const,
}));

export default function Agility() {
  const { data: state } = useGameState();
  if (!state) return null;
  return (<SkillPage skillKey="agility" skillName="Agility" skillXp={state.agilityXp ?? 0} icon={Footprints} iconColor="text-cyan-400" state={state} resources={RESOURCES} />);
}