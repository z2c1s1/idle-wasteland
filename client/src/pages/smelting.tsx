import { useGameState, useStartAction } from "@/hooks/use-game";
import { calculateLevel } from "@/lib/game-utils";
import { SkillActionView } from "@/components/skill-action-view";
import { Flame } from "lucide-react";

const BARS = ["Bronze", "Iron", "Steel", "Silver", "Gold", "Mithril", "Adamant", "Rune", "Dragon", "Eternal"];

export default function Smelting() {
  const { data: state } = useGameState();
  const { mutate: startAction, isPending } = useStartAction();
  if (!state) return null;

  const currentIdx = state.activeAction.startsWith('smelting_') ? parseInt(state.activeAction.split('_')[1]) : -1;
  const level = calculateLevel(state.smeltingXp);

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {BARS.map((name, i) => {
          const isActive = currentIdx === i;
          const time = 5 + i * 5;
          const reqLevel = i * 5 + 1;
          const isUnlocked = level >= reqLevel;
          const resourceCount = (state as any)[`bar_${i}`] || 0;
          return (
            <SkillActionView
              key={name}
              title={name}
              description={`Takes ${time}s per bar. Requires Level ${reqLevel}.`}
              level={level}
              xp={state.smeltingXp}
              resourceName={`${name} Bar`}
              resourceCount={resourceCount}
              isActive={isActive}
              isGlobalActive={state.activeAction !== 'idle'}
              icon={Flame}
              themeColorClass="text-orange-500"
              themeGlowClass="shadow-orange-500/20"
              onToggle={() => startAction(isActive ? 'idle' : `smelting_${i}`)}
              isPending={isPending}
              disabled={!isUnlocked}
              actionStartTime={state.actionUpdatedAt}
              cycleTime={time}
            />
          );
        })}
      </div>
    </div>
  );
}
