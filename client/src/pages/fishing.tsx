import { useGameState } from "@/hooks/use-game";
import { SkillPage } from "@/components/skill-page";
import { Waves } from "lucide-react";

const FISH = ["虾","沙丁鱼","鲱鱼","鳟鱼","三文鱼","金枪鱼","龙虾","旗鱼","鲨鱼","鲸鱼"];
const LV = [1,4,7,10,15,25,40,60,80,99];
const T = [3,4,5,6,7,9,11,13,15,17];
const X = [10,16,24,34,48,62,80,104,132,168];
const RESOURCES = LV.map((lv, i) => ({
  name: FISH[i], emoji: "🐟", time: T[i], xp: X[i], reqLevel: lv,
  resourceKey: `fish_${i}`, actionKey: `fishing_${i}`,
}));

export default function Fishing() {
  const { data: state } = useGameState();
  if (!state) return null;
  return (<SkillPage skillName="Fishing" skillXp={state.fishingXp} icon={Waves} iconColor="text-blue-400" state={state} resources={RESOURCES} />);
}