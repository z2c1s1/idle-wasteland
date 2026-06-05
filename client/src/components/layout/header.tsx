import { useGameState, useStartAction } from "@/hooks/use-game";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ENEMIES, DUNGEONS, THIEVING_NPCS } from "@shared/game-data";
import { useLanguage } from "@/lib/i18n";

const SKILL_LABELS: Record<string, string> = {
  woodcutting: "伐木", mining: "采矿", smelting: "冶炼",
  fishing: "钓鱼", hunting: "狩猎", thieving: "搜刮",
  smith: "锻造", leather: "皮革制作", jewel: "珠宝制作", tool: "工具制作",
  agility: "敏捷训练", exploration: "探索", crafting: "制作",
  cooking: "烹饪", alchemy: "炼金", prayer: "祷言",
};

/** Resource names per skill tier — matches SKILLS_DATA on server */
const RESOURCE_NAMES: Record<string, string[]> = {
  woodcutting: ["橡木","柳木","柚木","枫木","桃花心木","紫杉木","魔法木","古树木","红杉木","灵木"],
  mining: ["铜矿","锡矿","铁矿","煤矿","秘银矿","精金矿","符文矿","龙矿","黑曜矿","以太矿"],
  smelting: ["青铜锭","铁锭","钢锭","银锭","金锭","秘银锭","精金锭","符文锭","龙锭","永恒锭"],
  fishing: ["虾","沙丁鱼","鲱鱼","鳟鱼","三文鱼","金枪鱼","龙虾","旗鱼","鲨鱼","鲸鱼"],
  hunting: ["兔皮","鸟羽","狐皮","狼皮","熊皮","野猪皮","鹿皮","虎皮","龙皮","凤凰羽"],
  crafting: ["布匹","皮革","珠宝","护甲","武器","神器","遗物","杰作","天界","神圣"],
  agility: ["基础跑酷","平衡木","攀爬墙","障碍赛","绳索攀爬","独木桥","高空跳","翻滚训练","墙壁跑酷","倒立行走"],
  exploration: ["枯树林","废弃加油站","废墟小镇","辐射沼泽","破碎公路","废弃农场","地下掩体","酸雨平原","沙暴废土","雪地废墟"],
};

/** Parse raw action like "combat_0_1" → display name */
function actionLabel(action: string): string {
  // Combat: "combat_0_1" → enemy name
  if (action.startsWith("combat_")) {
    const idx = parseInt(action.split("_")[1]!);
    const e = ENEMIES[idx];
    const qty = action.split("_")[2];
    if (e) return `⚔️ ${e.name}${qty && qty !== "1" ? ` ×${qty}` : ""}`;
    return "战斗";
  }
  // Dungeon: "dungeon_0_0" → dungeon name
  if (action.startsWith("dungeon_")) {
    const idx = parseInt(action.split("_")[1]!);
    const d = DUNGEONS[idx];
    if (d) return `🏚️ ${d.name}`;
    return "副本探索";
  }
  // Tower
  if (action === "tower") return "🗼 高塔攀登";
  // Trial
  if (action.startsWith("trial_")) return "☢️ 辐射试炼";
  // Thieving: "thieve_drunkard" → "搜刮 · 醉汉"
  if (action.startsWith("thieve_")) {
    const npcId = action.replace("thieve_", "");
    const npc = THIEVING_NPCS.find(n => n.id === npcId);
    return "🥷 搜刮 · " + (npc?.name ?? npcId);
  }
  // Skills: "woodcutting_3" → "伐木 · 枫木"
  if (action.includes("_")) {
    const [skill, tier] = action.split("_");
    const label = SKILL_LABELS[skill!] ?? skill;
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

export function Header() {
  const { data: state } = useGameState();
  const { mutate: startAction, isPending } = useStartAction();
  const { lang, setLanguage } = useLanguage();

  if (!state) return null;

  const isActive = state.activeAction !== "idle";

  return (
    <header className="h-10 border-b border-border bg-[hsl(220_13%_8%)] flex items-center px-3 gap-3 flex-shrink-0">
      <SidebarTrigger className="md:hidden -ml-1" />
      <span className="text-xs text-muted-foreground">
        {isActive ? (
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse inline-block" />
            <span className="text-foreground font-medium">{actionLabel(state.activeAction)}</span>
          </span>
        ) : (
          lang === "zh" ? "空闲 — 无任务运行" : "Idle — No active task"
        )}
      </span>
      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={() => setLanguage(lang === "zh" ? "en" : "zh")}
          className="px-2 py-0.5 text-xs border border-border rounded hover:bg-muted/20 transition-colors"
          title={lang === "zh" ? "Switch to English" : "切换到中文"}
        >
          {lang === "zh" ? "EN" : "中"}
        </button>
        {isActive && (
          <button
            onClick={() => startAction("idle")}
            disabled={isPending}
            className="px-2.5 py-0.5 text-xs font-semibold bg-red-600 hover:bg-red-500 text-white rounded transition-colors disabled:opacity-50"
          >
            {lang === "zh" ? "停止" : "Stop"}
          </button>
        )}
      </div>
    </header>
  );
}
