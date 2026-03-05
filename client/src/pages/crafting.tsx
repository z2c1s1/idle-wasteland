import { useGameState, useStartAction } from "@/hooks/use-game";
import { calculateLevel } from "@/lib/game-utils";
import { SkillActionView } from "@/components/skill-action-view";
import { Hammer } from "lucide-react";

const ITEMS = ["Cloth", "Leather", "Jewelry", "Armor", "Weapon", "Artifact", "Relic", "Masterpiece", "Celestial", "Divine"];

export default function Crafting() {
  const { data: state } = useGameState();
  const { mutate: startAction, isPending } = useStartAction();
  if (!state) return null;

  const currentIdx = state.activeAction.startsWith('crafting_') ? parseInt(state.activeAction.split('_')[1]) : -1;
  const level = calculateLevel(state.craftingXp);

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ITEMS.map((name, i) => {
          const isActive = currentIdx === i;
          const time = 5 + i * 5;
          const reqLevel = i * 5 + 1;
          const isUnlocked = level >= reqLevel;
          const resourceCount = (state as any)[`item_${i}`] || 0;
          return (
            <SkillActionView
              key={name}
              title={name}
              description={`Takes ${time}s per item. Requires Level ${reqLevel}.`}
              level={level}
              xp={state.craftingXp}
              resourceName={name}
              resourceCount={resourceCount}
              isActive={isActive}
              isGlobalActive={state.activeAction !== 'idle'}
              icon={Hammer}
              themeColorClass="text-purple-500"
              themeGlowClass="shadow-purple-500/20"
              onToggle={() => startAction(isActive ? 'idle' : `crafting_${i}`)}
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
