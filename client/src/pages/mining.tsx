import { useGameState } from "@/hooks/use-game";
import { SkillPage } from "@/components/skill-page";
import { useUIText } from "@/lib/i18n";
import { Pickaxe } from "lucide-react";
import { MINING_GEM_POOLS } from "@shared/game-data";

const ORES = ["废铁块","铜丝矿","铝罐矿","铅块","硫磺矿","硝酸盐矿","铀矿石","钛金矿","钨钢矿","铱金矿"];
const LV = [1,4,7,10,15,25,40,60,80,99];
const T = [3,4,5,6,8,10,12,14,16,18];
const X = [12,19,28,40,56,75,98,128,164,210];
const GEM_NAMES: Record<string, string> = {
  ruby_chipped:'红宝石(残缺)',sapphire_chipped:'蓝宝石(残缺)',emerald_chipped:'绿宝石(残缺)',topaz_chipped:'黄宝石(残缺)',
  ruby_flawed:'红宝石(瑕疵)',sapphire_flawed:'蓝宝石(瑕疵)',emerald_flawed:'绿宝石(瑕疵)',topaz_flawed:'黄宝石(瑕疵)',
  ruby_normal:'红宝石(普通)',sapphire_normal:'蓝宝石(普通)',emerald_normal:'绿宝石(普通)',topaz_normal:'黄宝石(普通)',
  ruby_flawless:'红宝石(无瑕)',sapphire_flawless:'蓝宝石(无瑕)',emerald_flawless:'绿宝石(无瑕)',topaz_flawless:'黄宝石(无瑕)',
  ruby_perfect:'红宝石(完美)',sapphire_perfect:'蓝宝石(完美)',emerald_perfect:'绿宝石(完美)',topaz_perfect:'黄宝石(完美)',
  diamond_normal:'钻石(普通)',diamond_flawless:'钻石(无瑕)',diamond_perfect:'钻石(完美)',
};
const RESOURCES = LV.map((lv, i) => ({
  name: ORES[i], emoji: "⛏️", time: T[i], xp: X[i], reqLevel: lv,
  resourceKey: `ore_${i}`, actionKey: `mining_${i}`, resourceType: "ore" as const,
  extraHint: `石料:13~33%概率+${i+1}`,
  drops: [
    { name: ORES[i], qty: 1, chance: "100%" },
    { name: "石料 ×" + (i+1), qty: "", chance: "13~33%" },
    ...(MINING_GEM_POOLS[i]?.pool.map(g => ({ name: GEM_NAMES[g] ?? g, qty: 1, chance: (MINING_GEM_POOLS[i].chance*100/MINING_GEM_POOLS[i].pool.length).toFixed(1)+"%" })) ?? []),
  ],
}));

export default function Mining() {
  const t = useUIText();
  const { data: state } = useGameState();
  if (!state) return null;
  return (<SkillPage skillKey="mining" skillName={t.sidebar.navMining} skillXp={state.miningXp} icon={Pickaxe} iconColor="text-yellow-400" state={state} resources={RESOURCES} />);
}