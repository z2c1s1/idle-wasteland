import { useGameState } from "@/hooks/use-game";
import { SkillPage } from "@/components/skill-page";
import { Axe } from "lucide-react";

const WOODS = ["橡木","柳木","柚木","枫木","桃花心木","紫杉木","魔法木","古树木","红杉木","灵木","白蜡木","桦木","雪松木","榆木","铁木","血木","影木","月木","风暴木","霜木","余烬木","雷霆木","龙木","巨魔木","巨人木","暗木","水晶木","露木","荆棘木","骨木","墓木","虚空木","恶魔木","天使木","泰坦木","长老木","符文木","咒木","星木","深渊木","以太木","天界木","炼狱木","龙息木","凤凰木","狮鹫木","蛇妖木","海德拉木","巨兽木","巨像木","原始木","永恒木","不朽木","神木","世界树","梦木","夜木","暮木","晨木","黄昏木","日木","月影木","星尘木","星云木","星河木","宇宙木","星光木","以太之木","秘银木","精金木","山铜木","命运木","末日木","混沌木","秩序木","创世木","灭世木","起源木","天启木","超越木","全知木","无限木","至高木","终极木","完美木","无瑕木","全能木","永恒之木","不朽之木","无尽木","神谕木","圣光木","天罚木","终末木","涅槃木","万古长青木","创世神木"];
const LV = [1,4,7,10,15,25,40,60,80,99];
const T = [3,4,5,6,8,10,12,14,16,18];
const X = [10,16,24,34,48,64,84,110,140,180];
const RESOURCES = LV.map((lv, i) => ({
  name: WOODS[i], emoji: "🪵", time: T[i], xp: X[i], reqLevel: lv,
  resourceKey: `wood_${i}`, actionKey: `woodcutting_${i}`, resourceType: "wood" as const,
}));

export default function Woodcutting() {
  const { data: state } = useGameState();
  if (!state) return null;

  return (
    <SkillPage
      skillName="Woodcutting"
      skillXp={state.woodcuttingXp}
      icon={Axe}
      iconColor="text-green-400"
      state={state}
      resources={RESOURCES}
    />
  );
}
