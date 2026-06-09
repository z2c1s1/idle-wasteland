import { ENEMIES, DUNGEONS, THIEVING_NPCS } from "@shared/game-data";
import type { uiText } from "./text";

/** Resource names per skill tier — matches SKILLS_DATA on server */
const RESOURCE_NAMES: Record<string, string[]> = {
  woodcutting: ["废木板","枯树枝","焦木","铁线木","石化木","辐射瘤木","骨白杉","黑钢木","泰坦木","核融晶木"],
  mining: ["废铁块","铜丝矿","铝罐矿","铅块","硫磺矿","硝酸盐矿","铀矿石","钛金矿","钨钢矿","铱金矿"],
  smelting: ["废铁锭","铜锭","铝锭","铅锭","硫磺锭","硝酸盐锭","铀锭","钛金锭","钨钢锭","铱金锭"],
  fishing: ["辐射蝌蚪","癞皮鱼","电鳗仔","刺鳍鱼","肿眼鲶","荧光鳗","铁甲鱼","双头鲨","深渊巨口","核融鲸"],
  hunting: ["辐射鼠皮","变异兔皮","铁鳞蜥皮","疯犬皮","钢鬃猪皮","双头鹿皮","灰熊厚皮","辐射蝎壳","死亡爪皮","巨兽硬皮"],
  crafting: ["破布条","旧绳索","皮革碎片","铁钉","弹簧","齿轮","电路板","精密零件","军用元件","战前科技核心"],
  agility: ["基础跑酷","铁丝网穿越","坍塌楼攀爬","废墟障碍赛","下水道匍匐","断桥跳跃","高空索降","燃烧障碍跑","辐射区冲刺","垂直墙攀爬"],
  exploration: [
    "废弃加油站","废弃超市","废墟小镇","郊外农田","断裂立交桥",
    "枯树林","辐射沼泽","废弃矿洞","地下停车场","废弃医院",
    "军事检查站","化工厂废墟","核电站外围","淹没地铁站","酸雨平原",
    "沙暴废土","雪地废墟","火山灰地带","裂谷深渊","变异丛林",
    "巨兽骸骨场","军事禁区","高架桥废墟","实验室废墟","陨石坑",
    "深渊裂谷","辐射风暴区","避难所遗迹","搁浅航母","终末之门",
  ],
};

function lname(obj: { name: string; nameEn?: string }, lang: string): string {
  return lang === "en" && obj.nameEn ? obj.nameEn : obj.name;
}

/** Parse raw action like "combat_0_1" → display name */
export function formatActionLabel(
  action: string,
  t: typeof uiText,
  lang: string,
): string {
  if (action.startsWith("combat_")) {
    const idx = parseInt(action.split("_")[1]!);
    const e = ENEMIES[idx];
    const qty = action.split("_")[2];
    if (e) return `⚔ ${lname(e, lang)}${qty && qty !== "1" ? ` ×${qty}` : ""}`;
    return t.header.combat;
  }
  if (action.startsWith("dungeon_")) {
    const idx = parseInt(action.split("_")[1]!);
    const d = DUNGEONS[idx];
    if (d) return `🏚 ${lname(d, lang)}`;
    return t.header.dungeon;
  }
  if (action === "tower") return `🗼 ${t.header.tower}`;
  if (action.startsWith("trial_")) return `☢ ${t.header.trial}`;
  if (action.startsWith("thieve_")) {
    const npcId = action.replace("thieve_", "");
    const npc = THIEVING_NPCS.find(n => n.id === npcId);
    return `🥷 ${t.header.thieving} · ${npc?.name ?? npcId}`;
  }
  if (action.includes("_")) {
    const [skill, tier] = action.split("_");
    const label = t.header.skills[skill!] ?? skill;
    const tierNum = parseInt(tier!);
    if (!isNaN(tierNum)) {
      const names = RESOURCE_NAMES[skill!];
      const resName = names?.[tierNum];
      return resName ? `${label} · ${resName}` : `${label} Lv.${tierNum + 1}`;
    }
    return action.replace(/_/g, " ");
  }
  return action;
}
