import { useGameState, useStartAction } from "@/hooks/use-game";
import { calculateLevel } from "@/lib/game-utils";
import { SkillActionView } from "@/components/skill-action-view";
import { Pickaxe } from "lucide-react";

export default function Mining() {
  const { data: state } = useGameState();
  const { mutate: startAction, isPending } = useStartAction();

  if (!state) return null;

  const isActive = state.activeAction === 'mining';
  const isGlobalActive = state.activeAction !== 'idle';
  const level = calculateLevel(state.miningXp);

  const handleToggle = () => {
    startAction(isActive ? 'idle' : 'mining');
  };

  return (
    <SkillActionView
      title="Mining"
      description="Strike the earth to gather valuable ores. Copper is the foundation of all early metalworking."
      level={level}
      xp={state.miningXp}
      resourceName="Copper Ore"
      resourceCount={state.copperOreCount}
      isActive={isActive}
      isGlobalActive={isGlobalActive}
      icon={Pickaxe}
      themeColorClass="text-amber-500"
      themeGlowClass="shadow-amber-500/20"
      onToggle={handleToggle}
      isPending={isPending}
    />
  );
}
