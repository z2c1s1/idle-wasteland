import { useGameState, useStartAction } from "@/hooks/use-game";
import { SMITHING_RECIPES, EQUIPMENT_ITEMS } from "@shared/game-data";
import { calculateLevel, formatNumber, levelProgress } from "@/lib/game-utils";
import type { GameState } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Shield, CheckCircle2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function ActionTimer({ actionUpdatedAt, time }: { actionUpdatedAt: string; time: number }) {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);
  const startMs = new Date(actionUpdatedAt).getTime();

  useEffect(() => {
    const tick = () => {
      const elapsed = (Date.now() - startMs) % (time * 1000);
      setProgress((elapsed / (time * 1000)) * 100);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [startMs, time]);

  return (
    <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
      <div className="h-full bg-primary rounded-full transition-none" style={{ width: `${progress}%` }} />
    </div>
  );
}

export default function SmithingCraft() {
  const { data: state } = useGameState();
  const startAction = useStartAction();

  if (!state) return null;
  const gameState = state as GameState;
  const smithingLevel = calculateLevel(gameState.smithingXp);
  const smithingXp = gameState.smithingXp;

  const activeAction = gameState.activeAction;
  const isSmithing = activeAction.startsWith("smith_");
  const activeIndex = isSmithing ? parseInt(activeAction.split("_")[1]) : -1;

  function startRecipe(index: number) {
    startAction.mutate(`smith_${index}`);
  }

  function stopSmithing() {
    startAction.mutate("idle");
  }

  function getInputQty(resource: string): number {
    return ((gameState as Record<string, unknown>)[resource] as number) ?? 0;
  }

  function canCraft(recipeIndex: number): boolean {
    const recipe = SMITHING_RECIPES[recipeIndex];
    if (!recipe) return false;
    if (smithingLevel < recipe.reqLevel) return false;
    return recipe.inputs.every(inp => getInputQty(inp.resource) >= inp.qty);
  }

  const BAR_NAMES = ["青铜", "铁", "钢", "银", "金", "秘银", "精金", "符文", "龙", "永恒"];

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Shield className="w-5 h-5 text-slate-400" /> 锻造
        </h1>
        <p className="text-sm text-muted-foreground">{smithingLevel} 级 · {formatNumber(smithingXp)} 经验</p>
        <Progress value={levelProgress(smithingXp)} className="mt-2 h-1.5" />
      </div>

      {/* Active smithing */}
      {isSmithing && activeIndex >= 0 && (
        <div className="bg-card border border-primary/30 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-medium text-primary">
                正在锻造 {EQUIPMENT_ITEMS[SMITHING_RECIPES[activeIndex]?.output]?.name ?? "..."}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={stopSmithing} data-testid="button-stop-smithing">停止</Button>
          </div>
          <ActionTimer actionUpdatedAt={gameState.actionUpdatedAt as unknown as string} time={SMITHING_RECIPES[activeIndex]?.time ?? 8} />
        </div>
      )}

      {/* Recipe list */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">配方</h2>
        {SMITHING_RECIPES.map((recipe, index) => {
          const item = EQUIPMENT_ITEMS[recipe.output];
          if (!item) return null;
          const unlocked = smithingLevel >= recipe.reqLevel;
          const hasResources = canCraft(index);
          const isActive = activeIndex === index;

          return (
            <div key={recipe.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                !unlocked ? "border-border bg-muted/10 opacity-50" :
                isActive ? "border-primary/50 bg-primary/10" :
                "border-border bg-card hover:border-primary/30"
              }`}
              data-testid={`recipe-${recipe.id}`}>

              <span className="text-2xl">{item.emoji}</span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{item.name}</span>
                  {isActive && <span className="text-xs text-primary font-medium">制作中...</span>}
                  {hasResources && !isActive && unlocked && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                  )}
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5 text-xs text-muted-foreground">
                  {recipe.inputs.map(inp => {
                    const have = getInputQty(inp.resource);
                    const barIdx = parseInt(inp.resource.split("_")[1]);
                    const barName = BAR_NAMES[barIdx] ?? inp.resource;
                    const ok = have >= inp.qty;
                    return (
                      <span key={inp.resource} className={ok ? "text-green-400" : "text-red-400"}>
                        {barName}锭 x{inp.qty}（持有 {have}）
                      </span>
                    );
                  })}
                  <span>· {recipe.xp} 经验 · {recipe.time}s</span>
                  {item.attackBonus > 0 && <span className="text-red-300">攻击 +{item.attackBonus}</span>}
                  {item.defenceBonus > 0 && <span className="text-blue-300">防御 +{item.defenceBonus}</span>}
                </div>
                {!unlocked && (
                  <p className="text-xs text-muted-foreground mt-0.5">需要锻造等级 {recipe.reqLevel}</p>
                )}
              </div>

              <div className="flex-shrink-0">
                {isActive ? (
                  <Button size="sm" variant="outline" onClick={stopSmithing} data-testid={`button-stop-${recipe.id}`}>停止</Button>
                ) : (
                  <Button size="sm" disabled={!unlocked || !hasResources || startAction.isPending}
                    onClick={() => startRecipe(index)} data-testid={`button-craft-${recipe.id}`}>
                    {!unlocked ? `${recipe.reqLevel}级` : "制作"}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
