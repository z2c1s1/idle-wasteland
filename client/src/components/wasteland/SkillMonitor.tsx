import { useLocation } from "wouter";
import type { GameState } from "@shared/schema";
import { calculateLevel, levelProgress } from "@/lib/game-utils";
import { SCAVENGE_SKILLS, getScavengeSkillFromAction } from "@/lib/scavenge-skills";
import { RustFrame } from "./RustFrame";
import { useUIText } from "@/lib/i18n";
import type { uiText } from "@/lib/text";

const LABEL_KEYS: Record<string, keyof typeof uiText.sidebar> = {
  woodcutting: "navWoodcutting",
  mining: "navMining",
  fishing: "navFishing",
  hunting: "navHunting",
  thieving: "navThieving",
};

interface SkillMonitorProps {
  state: GameState;
}

export function SkillMonitor({ state }: SkillMonitorProps) {
  const t = useUIText();
  const [, navigate] = useLocation();
  const activeSkill = state.activeAction !== "idle" ? getScavengeSkillFromAction(state.activeAction) : null;

  return (
    <RustFrame className="p-3">
      <h2 className="mb-2 font-display text-sm font-semibold tracking-wide text-[hsl(var(--brass))]">
        {t.dashboard.scavengeSkills}
      </h2>
      <ul className="space-y-1">
        {SCAVENGE_SKILLS.map((skill) => {
          const xp = state[skill.xpKey];
          const level = calculateLevel(xp);
          const pct = levelProgress(xp);
          const isActive = activeSkill === skill.id;
          const Icon = skill.icon;

          return (
            <li key={skill.id}>
              <button
                type="button"
                onClick={() => navigate(skill.path)}
                className={`flex w-full items-center gap-2 px-2 py-1.5 text-left transition-colors hover:bg-[hsl(var(--accent))] ${
                  isActive ? "border-l-2 border-[hsl(var(--crt-green))] bg-[hsl(120_30%_8%)] pl-[calc(0.5rem-2px)]" : ""
                }`}
              >
                <Icon className={`h-3.5 w-3.5 flex-shrink-0 ${skill.color}`} />
                <span className="min-w-0 flex-1 truncate text-[11px]">{t.sidebar[LABEL_KEYS[skill.id]!]}</span>
                <span className="font-mono text-[10px] tabular-nums text-muted-foreground">{level}</span>
                <div className="h-1 w-12 overflow-hidden border border-[hsl(var(--border-rust))] bg-[hsl(var(--background))]">
                  <div className="h-full xp-bar-fill" style={{ width: `${pct}%` }} />
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </RustFrame>
  );
}
