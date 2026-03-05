import { useGameState, useStartAction } from "@/hooks/use-game";
import { calculateLevel } from "@/lib/game-utils";
import { SkillActionView } from "@/components/skill-action-view";
import { PawPrint } from "lucide-react";

const HIDES = ["Rabbit", "Bird", "Fox", "Wolf", "Bear", "Boar", "Deer", "Tiger", "Dragon", "Phoenix"];

export default function Hunting() {
  const { data: state } = useGameState();
  const { mutate: startAction, isPending } = useStartAction();
  if (!state) return null;

  const currentIdx = state.activeAction.startsWith('hunting_') ? parseInt(state.activeAction.split('_')[1]) : -1;
  const level = calculateLevel(state.huntingXp);

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {HIDES.map((name, i) => {
          const isActive = currentIdx === i;
          const time = 5 + i * 5;
          const reqLevel = i * 5 + 1;
          const isUnlocked = level >= reqLevel;
          const resourceCount = (state as any)[`hide_${i}`] || 0;
          return (
            <SkillActionView
              key={name}
              title={name}
              description={`Takes ${time}s per hide. Requires Level ${reqLevel}.`}
              level={level}
              xp={state.huntingXp}
              resourceName={`${name} Hide`}
              resourceCount={resourceCount}
              isActive={isActive}
              isGlobalActive={state.activeAction !== 'idle'}
              icon={PawPrint}
              themeColorClass="text-red-500"
              themeGlowClass="shadow-red-500/20"
              onToggle={() => startAction(isActive ? 'idle' : `hunting_${i}`)}
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
