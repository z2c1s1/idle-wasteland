import { useGameState, useStartAction } from "@/hooks/use-game";
import { calculateLevel } from "@/lib/game-utils";
import { SkillActionView } from "@/components/skill-action-view";
import { Pickaxe } from "lucide-react";

const ORES = [
  "Copper", "Tin", "Iron", "Coal", "Mithril",
  "Adamant", "Rune", "Dragon", "Obsidian", "Ether"
];

export default function Mining() {
  const { data: state } = useGameState();
  const { mutate: startAction, isPending } = useStartAction();

  if (!state) return null;

  const currentIdx = state.activeAction.startsWith('mining_') 
    ? parseInt(state.activeAction.split('_')[1]) 
    : -1;
  
  const level = calculateLevel(state.miningXp);

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ORES.map((name, i) => {
          const isActive = currentIdx === i;
          const time = 5 + i * 5;
          const reqLevel = i * 5 + 1;
          const isUnlocked = level >= reqLevel;
          const resourceCount = (state as any)[`ore_${i}`] || 0;

          return (
            <SkillActionView
              key={name}
              title={name}
              description={`Takes ${time}s per ore. Requires Level ${reqLevel}.`}
              level={level}
              xp={state.miningXp}
              resourceName={`${name} Ore`}
              resourceCount={resourceCount}
              isActive={isActive}
              isGlobalActive={state.activeAction !== 'idle'}
              icon={Pickaxe}
              themeColorClass="text-amber-500"
              themeGlowClass="shadow-amber-500/20"
              onToggle={() => startAction(isActive ? 'idle' : `mining_${i}`)}
              isPending={isPending}
              disabled={!isUnlocked}
            />
          );
        })}
      </div>
    </div>
  );
}
