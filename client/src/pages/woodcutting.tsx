import { useGameState } from "@/hooks/use-game";
import { SkillPage } from "@/components/skill-page";
import { useUIText } from "@/lib/i18n";
import { Axe } from "lucide-react";
import { WOODCUTTING_BERRY_DROPS } from "@shared/game-data";

const WOODS = ["废木板","枯树枝","焦木","铁线木","石化木","辐射瘤木","骨白杉","黑钢木","泰坦木","核融晶木"];
const LV = [1,4,7,10,15,25,40,60,80,99];
const T = [3,4,5,6,8,10,12,14,16,18];
const X = [10,16,24,34,48,64,84,110,140,180];
const RESOURCES = LV.map((lv, i) => ({
  name: WOODS[i], emoji: "🪵", time: T[i], xp: X[i], reqLevel: lv,
  resourceKey: `wood_${i}`, actionKey: `woodcutting_${i}`, resourceType: "wood" as const,
  extraHint: `木材:13~33%概率+${i+1}`,
  drops: [
    { name: WOODS[i], qty: 1, chance: "100%" },
    { name: "木材 ×" + (i+1), qty: "", chance: "13~33%" },
    ...(WOODCUTTING_BERRY_DROPS.filter(b => b.woodTier === i).map(b => ({ name: b.name, qty: 1, chance: (b.chance*100).toFixed(0)+"%" }))),
  ],
}));

export default function Woodcutting() {
  const t = useUIText();
  const { data: state } = useGameState();
  if (!state) return null;
  return (
    <SkillPage
      skillKey="woodcutting"
      skillName={t.sidebar.navWoodcutting}
      skillXp={state.woodcuttingXp}
      icon={Axe}
      iconColor="text-green-400"
      state={state}
      resources={RESOURCES}
    />
  );
}