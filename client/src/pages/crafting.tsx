import { useGameState } from "@/hooks/use-game";
import { SkillPage } from "@/components/skill-page";
import { useUIText } from "@/lib/i18n";
import { Hammer } from "lucide-react";

const ITEMS = ["破布条","旧绳索","皮革碎片","铁钉","弹簧","齿轮","电路板","精密零件","军用元件","战前科技核心"];
const LV = [1,4,7,10,15,25,40,60,80,99];
const T = [4,5,6,7,9,11,13,15,17,19];
const X = [14,22,33,48,67,90,118,153,197,252];
const RESOURCES = LV.map((lv, i) => ({
  name: ITEMS[i], emoji: "🧵", time: T[i], xp: X[i], reqLevel: lv,
  resourceKey: `item_${i}`, actionKey: `crafting_${i}`, resourceType: "craft" as const,
}));

export default function Crafting() {
  const t = useUIText();
  const { data: state } = useGameState();
  if (!state) return null;
  return (<SkillPage skillKey="crafting" skillName={t.sidebar.navCrafting} skillXp={state.craftingXp} icon={Hammer} iconColor="text-purple-400" state={state} resources={RESOURCES} />);
}