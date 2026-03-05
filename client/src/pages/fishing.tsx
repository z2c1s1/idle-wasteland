import { useGameState, useStartAction } from "@/hooks/use-game";
import { calculateLevel } from "@/lib/game-utils";
import { SkillActionView } from "@/components/skill-action-view";
import { Waves } from "lucide-react";

const FISH = ["Shrimp", "Sardine", "Herring", "Trout", "Salmon", "Tuna", "Lobster", "Swordfish", "Shark", "Whale"];

export default function Fishing() {
  const { data: state } = useGameState();
  const { mutate: startAction, isPending } = useStartAction();
  if (!state) return null;

  const currentIdx = state.activeAction.startsWith('fishing_') ? parseInt(state.activeAction.split('_')[1]) : -1;
  const level = calculateLevel(state.fishingXp);

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {FISH.map((name, i) => {
          const isActive = currentIdx === i;
          const time = 5 + i * 5;
          const reqLevel = i * 5 + 1;
          const isUnlocked = level >= reqLevel;
          const resourceCount = (state as any)[`fish_${i}`] || 0;
          return (
            <SkillActionView
              key={name}
              title={name}
              description={`Takes ${time}s per fish. Requires Level ${reqLevel}.`}
              level={level}
              xp={state.fishingXp}
              resourceName={name}
              resourceCount={resourceCount}
              isActive={isActive}
              isGlobalActive={state.activeAction !== 'idle'}
              icon={Waves}
              themeColorClass="text-blue-500"
              themeGlowClass="shadow-blue-500/20"
              onToggle={() => startAction(isActive ? 'idle' : `fishing_${i}`)}
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
