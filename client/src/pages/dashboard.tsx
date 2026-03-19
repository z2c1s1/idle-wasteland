import { useGameState } from "@/hooks/use-game";
import { useStartAction } from "@/hooks/use-game";
import { calculateLevel, levelProgress, xpForLevel, formatNumber } from "@/lib/game-utils";
import { Axe, Pickaxe, Flame, Waves, PawPrint, Hammer, StopCircle } from "lucide-react";
import { useLocation } from "wouter";

const SKILLS = [
  { title: "Woodcutting", xpKey: "woodcuttingXp" as const, icon: Axe, color: "text-green-400", bg: "bg-green-900/30", href: "/woodcutting", prefix: "woodcutting" },
  { title: "Mining", xpKey: "miningXp" as const, icon: Pickaxe, color: "text-yellow-400", bg: "bg-yellow-900/30", href: "/mining", prefix: "mining" },
  { title: "Smelting", xpKey: "smeltingXp" as const, icon: Flame, color: "text-orange-400", bg: "bg-orange-900/30", href: "/smelting", prefix: "smelting" },
  { title: "Fishing", xpKey: "fishingXp" as const, icon: Waves, color: "text-blue-400", bg: "bg-blue-900/30", href: "/fishing", prefix: "fishing" },
  { title: "Hunting", xpKey: "huntingXp" as const, icon: PawPrint, color: "text-red-400", bg: "bg-red-900/30", href: "/hunting", prefix: "hunting" },
  { title: "Crafting", xpKey: "craftingXp" as const, icon: Hammer, color: "text-purple-400", bg: "bg-purple-900/30", href: "/crafting", prefix: "crafting" },
];

export default function Dashboard() {
  const { data: state } = useGameState();
  const { mutate: startAction, isPending } = useStartAction();
  const [, setLocation] = useLocation();

  if (!state) return null;

  const isActive = state.activeAction !== "idle";
  const activeSkill = isActive ? state.activeAction.split("_")[0] : null;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-4 pb-4 border-b border-border">
        <h1 className="font-display text-xl font-bold text-foreground mb-0.5">Overview</h1>
        <p className="text-xs text-muted-foreground">Your skill progress at a glance</p>
      </div>

      {isActive && (
        <div className="mb-4 flex items-center justify-between bg-[hsl(217_50%_10%)] border border-primary/30 rounded px-4 py-2.5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-foreground font-medium capitalize">
              {state.activeAction.replace("_", " ")} in progress
            </span>
          </div>
          <button
            onClick={() => startAction("idle")}
            disabled={isPending}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-red-600 hover:bg-red-500 text-white rounded transition-colors disabled:opacity-50"
          >
            <StopCircle className="w-3.5 h-3.5" />
            Stop
          </button>
        </div>
      )}

      <div className="rounded border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[hsl(220_13%_8%)] text-muted-foreground text-xs">
              <th className="text-left px-4 py-2 font-semibold">Skill</th>
              <th className="text-center px-4 py-2 font-semibold">Level</th>
              <th className="text-left px-4 py-2 font-semibold w-48">Progress</th>
              <th className="text-right px-4 py-2 font-semibold">Total XP</th>
            </tr>
          </thead>
          <tbody>
            {SKILLS.map((skill) => {
              const xp = state[skill.xpKey];
              const level = calculateLevel(xp);
              const progress = levelProgress(xp);
              const isSkillActive = activeSkill === skill.prefix;

              return (
                <tr
                  key={skill.title}
                  onClick={() => setLocation(skill.href)}
                  className={`border-t border-border cursor-pointer transition-colors ${
                    isSkillActive ? "active-row" : "skill-row-hover"
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <skill.icon className={`w-4 h-4 ${skill.color}`} />
                      <span className={`font-medium ${isSkillActive ? "text-primary" : "text-foreground"}`}>
                        {skill.title}
                      </span>
                      {isSkillActive && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-primary/20 text-primary rounded font-semibold uppercase">
                          Active
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-display font-bold text-base text-foreground">{level}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-2.5 bg-[hsl(220_13%_8%)] rounded overflow-hidden border border-border">
                      <div
                        className="h-full xp-bar-fill rounded"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{progress.toFixed(1)}%</div>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted-foreground text-xs">
                    {formatNumber(xp)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
