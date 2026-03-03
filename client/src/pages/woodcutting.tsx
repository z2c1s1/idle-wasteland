import { useGameState, useStartAction } from "@/hooks/use-game";
import { calculateLevel } from "@/lib/game-utils";
import { SkillActionView } from "@/components/skill-action-view";
import { TreePine } from "lucide-react";

export default function Woodcutting() {
  const { data: state } = useGameState();
  const { mutate: startAction, isPending } = useStartAction();

  if (!state) return null;

  const isActive = state.activeAction === 'woodcutting';
  const isGlobalActive = state.activeAction !== 'idle';
  const level = calculateLevel(state.woodcuttingXp);

  const handleToggle = () => {
    startAction(isActive ? 'idle' : 'woodcutting');
  };

  return (
    <SkillActionView
      title="Woodcutting"
      description="Chop down trees to gather wood and earn experience. Higher levels will allow you to gather faster in the future."
      level={level}
      xp={state.woodcuttingXp}
      resourceName="Logs"
      resourceCount={state.woodCount}
      isActive={isActive}
      isGlobalActive={isGlobalActive}
      icon={TreePine}
      themeColorClass="text-emerald-500"
      themeGlowClass="shadow-emerald-500/20"
      onToggle={handleToggle}
      isPending={isPending}
    />
  );
}
