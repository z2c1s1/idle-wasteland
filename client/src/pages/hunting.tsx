import { useGameState } from "@/hooks/use-game";
import { SkillPage } from "@/components/skill-page";
import { useUIText } from "@/lib/i18n";
import { PawPrint } from "lucide-react";
import { HUNTING_HERB_DROPS } from "@shared/game-data";

const ANIMALS = ["辐射鼠","变异兔","铁鳞蜥","疯犬","钢鬃猪","双头鹿","灰熊","辐射蝎","死亡爪","巨兽"];
const HIDES = ["辐射鼠皮","变异兔皮","铁鳞蜥皮","疯犬皮","钢鬃猪皮","双头鹿皮","灰熊厚皮","辐射蝎壳","死亡爪皮","巨兽硬皮"];
const MEATS = ["辐射鼠肉","变异兔肉","铁鳞蜥肉","疯犬肉","钢鬃猪肉","双头鹿肉","灰熊肉","辐射蝎肉","死亡爪肉","巨兽肉"];
const LV = [1,4,7,10,15,25,40,60,80,99];
const T = [3,4,5,6,8,10,12,14,16,18];
const X = [10,17,25,36,50,67,88,115,147,189];
const RESOURCES = LV.map((lv, i) => ({
  name: ANIMALS[i], emoji: "🪶", time: T[i], xp: X[i], reqLevel: lv,
  resourceKey: `hide_${i}`, actionKey: `hunting_${i}`, resourceType: "hide" as const,
  drops: [
    { name: HIDES[i], qty: 1, chance: "100%" },
    { name: MEATS[i], qty: 1, chance: "100%" },
    ...(HUNTING_HERB_DROPS.filter(h => h.hideTier === i).map(h => ({ name: h.name, qty: 1, chance: (h.chance*100).toFixed(0)+"%" }))),
  ],
}));

export default function Hunting() {
  const t = useUIText();
  const { data: state } = useGameState();
  if (!state) return null;
  return (<SkillPage skillKey="hunting" skillName={t.sidebar.navHunting} skillXp={state.huntingXp} icon={PawPrint} iconColor="text-red-400" state={state} resources={RESOURCES} />);
}