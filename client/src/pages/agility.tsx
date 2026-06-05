import { useGameState } from "@/hooks/use-game";
import { SkillPage } from "@/components/skill-page";
import { Footprints } from "lucide-react";

const NAMES = ["基础跑酷","平衡木","攀爬墙","障碍赛","绳索攀爬","独木桥","高空跳","翻滚训练","墙壁跑酷","倒立行走"];
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
  return (<SkillPage skillName="Agility" skillXp={state.agilityXp ?? 0} icon={Footprints} iconColor="text-cyan-400" state={state} resources={RESOURCES} />);
}