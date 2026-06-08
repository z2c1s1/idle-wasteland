import { useGameState } from "@/hooks/use-game";
import { SkillPage } from "@/components/skill-page";
import { useUIText } from "@/lib/i18n";
import { Flame } from "lucide-react";

const ORES = ["废铁块","铜丝矿","铝罐矿","铅块","硫磺矿","硝酸盐矿","铀矿石","钛金矿","钨钢矿","铱金矿"];
const LV = [1,4,7,10,15,25,40,60,80,99];
const T = [4,5,6,7,9,11,13,15,17,19];
const X = [15,24,36,52,72,97,127,166,213,273];
const RESOURCES = LV.map((lv, i) => ({
  name: `${ORES[i]}锭`, emoji: "🔩", time: T[i], xp: X[i], reqLevel: lv,
  resourceKey: `bar_${i}`, actionKey: `smelting_${i}`, resourceType: "bar" as const,
  requiredKey: `ore_${i}`, requiredName: ORES[i],
}));

export default function Smelting() {
  const t = useUIText();
  const { data: state } = useGameState();
  if (!state) return null;
  return (<SkillPage skillKey="smelting" skillName={t.sidebar.navSmelting} skillXp={state.smeltingXp} icon={Flame} iconColor="text-orange-400" state={state} resources={RESOURCES} />);
}