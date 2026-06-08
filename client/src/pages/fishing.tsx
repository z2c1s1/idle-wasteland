import { useGameState } from "@/hooks/use-game";
import { SkillPage } from "@/components/skill-page";
import { useUIText } from "@/lib/i18n";
import { Waves } from "lucide-react";

const FISH = ["辐射蝌蚪","癞皮鱼","电鳗仔","刺鳍鱼","肿眼鲶","荧光鳗","铁甲鱼","双头鲨","深渊巨口","核融鲸"];
const LV = [1,4,7,10,15,25,40,60,80,99];
const T = [3,4,5,6,7,9,11,13,15,17];
const X = [10,16,24,34,48,62,80,104,132,168];
const RESOURCES = LV.map((lv, i) => ({
  name: FISH[i], emoji: "🐟", time: T[i], xp: X[i], reqLevel: lv,
  resourceKey: `fish_${i}`, actionKey: `fishing_${i}`, resourceType: "fish" as const,
  drops: [
    { name: FISH[i], qty: 1, chance: "100%" },
    ...(i >= 3 ? [{ name: "宝箱(随机装备)", qty: 1, chance: i >= 6 ? "8%" : i >= 4 ? "5%" : "3%" }] : []),
    ...(i >= 5 ? [{ name: "稀有戒指", qty: 1, chance: "0.5%" }] : []),
  ],
}));

export default function Fishing() {
  const t = useUIText();
  const { data: state } = useGameState();
  if (!state) return null;
  return (<SkillPage skillKey="fishing" skillName={t.sidebar.navFishing} skillXp={state.fishingXp} icon={Waves} iconColor="text-blue-400" state={state} resources={RESOURCES} />);
}