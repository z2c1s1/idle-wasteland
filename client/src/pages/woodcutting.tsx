import { useGameState, useStartAction } from "@/hooks/use-game";
import { calculateLevel } from "@/lib/game-utils";
import { SkillActionView } from "@/components/skill-action-view";
import { TreePine } from "lucide-react";

const WOODS = [
  "Oak", "Willow", "Teak", "Maple", "Mahogany", 
  "Yew", "Magic", "Elder", "Redwood", "Spirit"
];

export default function Woodcutting() {
  const { data: state } = useGameState();
  const { mutate: startAction, isPending } = useStartAction();

  if (!state) return null;

  const currentIdx = state.activeAction.startsWith('woodcutting_') 
    ? parseInt(state.activeAction.split('_')[1]) 
    : -1;
  
  const level = calculateLevel(state.woodcuttingXp);

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {WOODS.map((name, i) => {
          const isActive = currentIdx === i;
          const time = 5 + i * 5;
          const reqLevel = i * 5 + 1;
          const isUnlocked = level >= reqLevel;
          const resourceCount = (state as any)[`wood_${i}`] || 0;

          return (
            <SkillActionView
              key={name}
              title={name}
              description={`Takes ${time}s per log. Requires Level ${reqLevel}.`}
              level={level}
              xp={state.woodcuttingXp}
              resourceName={`${name} Logs`}
              resourceCount={resourceCount}
              isActive={isActive}
              isGlobalActive={state.activeAction !== 'idle'}
              icon={TreePine}
              themeColorClass="text-emerald-500"
              themeGlowClass="shadow-emerald-500/20"
              onToggle={() => startAction(isActive ? 'idle' : `woodcutting_${i}`)}
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
