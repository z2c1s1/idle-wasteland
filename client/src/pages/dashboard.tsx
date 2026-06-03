import { useGameState } from "@/hooks/use-game";
import { useStartAction } from "@/hooks/use-game";
import { calculateLevel, levelProgress, formatNumber, getCombatLevel } from "@/lib/game-utils";
import {
  Axe, Pickaxe, Flame, Waves, PawPrint, Hammer,
  StopCircle, Skull, Shield, HandMetal, Crosshair, Wand,
  Footprints, Zap,
} from "lucide-react";
import { useLocation } from "wouter";
import { WORLD_TIER_LABEL } from "@shared/game-data";
import type { GameState } from "@shared/schema";

const GATHERING_SKILLS = [
  { title: "伐木", xpKey: "woodcuttingXp" as const, icon: Axe,      color: "text-green-400",  bg: "bg-green-900/30",  href: "/woodcutting" },
  { title: "采矿", xpKey: "miningXp"      as const, icon: Pickaxe,  color: "text-yellow-400", bg: "bg-yellow-900/30", href: "/mining"      },
  { title: "冶炼", xpKey: "smeltingXp"    as const, icon: Flame,    color: "text-orange-400", bg: "bg-orange-900/30", href: "/smelting"    },
  { title: "钓鱼", xpKey: "fishingXp"     as const, icon: Waves,    color: "text-blue-400",   bg: "bg-blue-900/30",   href: "/fishing"     },
  { title: "狩猎", xpKey: "huntingXp"     as const, icon: PawPrint, color: "text-red-400",    bg: "bg-red-900/30",    href: "/hunting"     },
  { title: "搜刮", xpKey: "thievingXp"    as const, icon: HandMetal,color: "text-purple-400", bg: "bg-purple-900/30", href: "/thieving"    },
  { title: "敏捷", xpKey: "agilityXp"     as const, icon: Footprints,color:"text-cyan-400",  bg: "bg-cyan-900/30",   href: "/agility"     },
];

const COMBAT_SKILLS = [
  { title: "攻击", xpKey: "attackXp"     as const, color: "text-red-400"    },
  { title: "防御", xpKey: "defenceXp"    as const, color: "text-blue-400"   },
  { title: "生命", xpKey: "hitpointsXp"  as const, color: "text-green-400"  },
  { title: "远程", xpKey: "rangedXp"     as const, color: "text-green-400"  },
  { title: "魔法", xpKey: "magicXp"      as const, color: "text-purple-400" },
];

function SkillRow({ title, xp, icon: Icon, color, href, isActive, onClick }: {
  title: string; xp: number; icon: React.ElementType; color: string;
  href: string; isActive: boolean; onClick: () => void;
}) {
  const level = calculateLevel(xp);
  const progress = levelProgress(xp);
  return (
    <tr onClick={onClick}
      className={`border-t border-border cursor-pointer transition-colors ${isActive ? "active-row" : "skill-row-hover"}`}
      data-testid={`skill-row-${title.toLowerCase()}`}
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <Icon className={`w-4 h-4 ${color}`} />
          <span className={`font-medium ${isActive ? "text-primary" : "text-foreground"}`}>{title}</span>
          {isActive && (
            <span className="text-[10px] px-1.5 py-0.5 bg-primary/20 text-primary rounded font-semibold uppercase">进行中</span>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-center">
        <span className="font-display font-bold text-base">{level}</span>
      </td>
      <td className="px-4 py-3">
        <div className="h-2.5 bg-[hsl(220_13%_8%)] rounded overflow-hidden border border-border">
          <div className="h-full xp-bar-fill rounded" style={{ width: `${progress}%` }} />
        </div>
        <div className="text-[10px] text-muted-foreground mt-0.5">{progress.toFixed(1)}%</div>
      </td>
      <td className="px-4 py-3 text-right tabular-nums text-muted-foreground text-xs">{formatNumber(xp)}</td>
    </tr>
  );
}

export default function Dashboard() {
  const { data: state } = useGameState();
  const { mutate: startAction, isPending } = useStartAction();
  const [, setLocation] = useLocation();

  if (!state) return null;
  const gs = state as GameState;

  const isActive = gs.activeAction !== "idle";
  const activeSkill = isActive ? gs.activeAction.split("_")[0] : null;
  const combatLevel = getCombatLevel(gs);

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-5">
      <div className="pb-4 border-b border-border">
        <h1 className="font-display text-xl font-bold text-foreground mb-0.5">辐射废土总览</h1>
        <p className="text-xs text-muted-foreground">在废土中生存下去</p>
      </div>

      {/* World Tier banner */}
      <div onClick={() => setLocation("/exploration")}
        className="bg-card border border-amber-500/30 rounded-xl px-4 py-3 cursor-pointer hover:border-amber-400/50 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-semibold text-amber-300">
              {WORLD_TIER_LABEL[(gs.worldTier as 1|2|3|4|undefined) ?? 1]}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">切换层级 →</span>
        </div>
      </div>

      {isActive && (
        <div className="flex items-center justify-between bg-[hsl(217_50%_10%)] border border-primary/30 rounded px-4 py-2.5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-foreground font-medium capitalize">
              {gs.activeAction.replace(/_/g, " ")} 进行中
            </span>
          </div>
          <button onClick={() => startAction("idle")} disabled={isPending}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-red-600 hover:bg-red-500 text-white rounded transition-colors disabled:opacity-50"
            data-testid="button-stop-all">
            <StopCircle className="w-3.5 h-3.5" /> 停止
          </button>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-border rounded-lg px-3 py-2 text-center">
          <Skull className="w-4 h-4 text-red-400 mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">战斗等级</p>
          <p className="text-xl font-bold">{combatLevel}</p>
        </div>
        <div className="bg-card border border-border rounded-lg px-3 py-2 text-center">
          <span className="text-lg">💰</span>
          <p className="text-xs text-muted-foreground">金币</p>
          <p className="text-xl font-bold text-yellow-400">{formatNumber(gs.gold)}</p>
        </div>
        <div className="bg-card border border-border rounded-lg px-3 py-2 text-center">
          <Shield className="w-4 h-4 text-slate-400 mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">锻造等级</p>
          <p className="text-xl font-bold">{calculateLevel(gs.smithingXp)}</p>
        </div>
      </div>

      {/* Gathering skills */}
      <div className="rounded border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[hsl(220_13%_8%)] text-muted-foreground text-xs">
              <th className="text-left px-4 py-2 font-semibold">采集技能</th>
              <th className="text-center px-4 py-2 font-semibold">等级</th>
              <th className="text-left px-4 py-2 font-semibold w-48">进度</th>
              <th className="text-right px-4 py-2 font-semibold">总经验</th>
            </tr>
          </thead>
          <tbody>
            {GATHERING_SKILLS.map((skill) => (
              <SkillRow
                key={skill.title}
                title={skill.title}
                xp={gs[skill.xpKey]}
                icon={skill.icon}
                color={skill.color}
                href={skill.href}
                isActive={activeSkill === skill.href.slice(1)}
                onClick={() => setLocation(skill.href)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Combat skills */}
      <div className="rounded border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[hsl(220_13%_8%)] text-muted-foreground text-xs">
              <th className="text-left px-4 py-2 font-semibold">战斗技能</th>
              <th className="text-center px-4 py-2 font-semibold">等级</th>
              <th className="text-left px-4 py-2 font-semibold w-48">进度</th>
              <th className="text-right px-4 py-2 font-semibold">总经验</th>
            </tr>
          </thead>
          <tbody>
            {COMBAT_SKILLS.map((skill) => (
              <SkillRow
                key={skill.title}
                title={skill.title}
                xp={gs[skill.xpKey]}
                icon={Skull}
                color={skill.color}
                href="/combat"
                isActive={false}
                onClick={() => setLocation("/combat")}
              />
            ))}
            <tr className="border-t border-border cursor-pointer skill-row-hover transition-colors"
              onClick={() => setLocation("/smithing")} data-testid="skill-row-smithing">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-slate-400" />
                  <span className="font-medium">锻造</span>
                </div>
              </td>
              <td className="px-4 py-3 text-center">
                <span className="font-display font-bold text-base">{calculateLevel(gs.smithingXp)}</span>
              </td>
              <td className="px-4 py-3">
                <div className="h-2.5 bg-[hsl(220_13%_8%)] rounded overflow-hidden border border-border">
                  <div className="h-full xp-bar-fill rounded" style={{ width: `${levelProgress(gs.smithingXp)}%` }} />
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{levelProgress(gs.smithingXp).toFixed(1)}%</div>
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-muted-foreground text-xs">{formatNumber(gs.smithingXp)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
