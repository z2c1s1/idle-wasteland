import { useGameState, useStartAction } from "@/hooks/use-game";
import { JEWELCRAFTING_RECIPES, JEWELRY_ITEMS } from "@shared/game-data";
import { calculateLevel, formatNumber, levelProgress, parseCraftItems } from "@/lib/game-utils";
import type { GameState } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Gem, CheckCircle2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function ActionTimer({ actionUpdatedAt, time }: { actionUpdatedAt: string; time: number }) {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);
  useEffect(() => {
    const startMs = new Date(actionUpdatedAt).getTime();
    const tick = () => {
      const elapsed = (Date.now() - startMs) % (time * 1000);
      setProgress((elapsed / (time * 1000)) * 100);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [actionUpdatedAt, time]);
  return (
    <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
      <div className="h-full bg-purple-500 rounded-full transition-none" style={{ width: `${progress}%` }} />
    </div>
  );
}

const ITEM_NAMES = ["Cloth","Leather","Jewelry","Armor","Weapon","Artifact","Relic","Masterpiece","Celestial","Divine"];

export default function Jewelcrafting() {
  const { data: state } = useGameState();
  const startAction = useStartAction();

  if (!state) return null;
  const gs = state as GameState;
  const level = calculateLevel(gs.jewelcraftingXp);
  const craftItems = parseCraftItems(gs.craftItems);

  const activeAction = gs.activeAction;
  const isActive = activeAction.startsWith("jewel_");
  const activeIndex = isActive ? parseInt(activeAction.split("_")[1]) : -1;

  function getQty(resource: string): number {
    return ((gs as Record<string, unknown>)[resource] as number) ?? 0;
  }
  function canCraft(idx: number): boolean {
    const r = JEWELCRAFTING_RECIPES[idx];
    if (!r || level < r.reqLevel) return false;
    return r.inputs.every(i => getQty(i.resource) >= i.qty);
  }

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Gem className="w-5 h-5 text-purple-400" /> Jewelcrafting
        </h1>
        <p className="text-sm text-muted-foreground">Level {level} · {formatNumber(gs.jewelcraftingXp)} XP</p>
        <Progress value={levelProgress(gs.jewelcraftingXp)} className="mt-2 h-1.5" />
      </div>

      {/* Item inventory */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">🧵 Crafting Materials</h2>
        <div className="grid grid-cols-5 gap-2">
          {ITEM_NAMES.map((name, i) => {
            const qty = getQty(`item_${i}`);
            return (
              <div key={i} className={`text-center p-2 rounded-lg border ${qty > 0 ? 'border-purple-500/30 bg-purple-500/8' : 'border-border bg-muted/10 opacity-40'}`}>
                <p className="text-xs text-muted-foreground">{name}</p>
                <p className={`text-sm font-bold ${qty > 0 ? 'text-purple-300' : ''}`}>{qty}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active crafting */}
      {isActive && activeIndex >= 0 && (
        <div className="bg-card border border-purple-500/30 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span className="font-medium text-purple-300">
                Crafting {JEWELRY_ITEMS[JEWELCRAFTING_RECIPES[activeIndex]?.output]?.name ?? "..."}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={() => startAction.mutate("idle")} data-testid="button-stop-jewelcrafting">Stop</Button>
          </div>
          <ActionTimer actionUpdatedAt={gs.actionUpdatedAt as unknown as string} time={JEWELCRAFTING_RECIPES[activeIndex]?.time ?? 8} />
        </div>
      )}

      {/* Recipe list */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Recipes</h2>
        {JEWELCRAFTING_RECIPES.map((recipe, index) => {
          const item = JEWELRY_ITEMS[recipe.output];
          if (!item) return null;
          const unlocked = level >= recipe.reqLevel;
          const hasRes = canCraft(index);
          const isRecipeActive = activeIndex === index;
          const owned = craftItems[recipe.output] ?? 0;

          return (
            <div key={recipe.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                !unlocked ? "border-border bg-muted/10 opacity-50" :
                isRecipeActive ? "border-purple-500/50 bg-purple-500/10" :
                "border-border bg-card hover:border-purple-500/30"
              }`}
              data-testid={`recipe-${recipe.id}`}>

              <span className="text-2xl">{item.emoji}</span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">{item.name}</span>
                  {owned > 0 && <span className="text-xs text-green-400 border border-green-500/30 px-1 rounded">x{owned} owned</span>}
                  {isRecipeActive && <span className="text-xs text-purple-300 font-medium">Crafting...</span>}
                  {hasRes && !isRecipeActive && unlocked && <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />}
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5 text-xs text-muted-foreground">
                  {recipe.inputs.map(inp => {
                    const have = getQty(inp.resource);
                    const itemIdx = parseInt(inp.resource.split("_")[1]);
                    const ok = have >= inp.qty;
                    return (
                      <span key={inp.resource} className={ok ? "text-green-400" : "text-red-400"}>
                        {ITEM_NAMES[itemIdx]} x{inp.qty} ({have} owned)
                      </span>
                    );
                  })}
                  <span>· {recipe.xp} XP · {recipe.time}s · ilvl {item.ilvl}</span>
                  {item.critRating && item.critRating > 0 && <span className="text-yellow-300">✦ +{item.critRating}% Crit</span>}
                  {item.hpBonus && item.hpBonus > 0 && <span className="text-green-300">❤ +{item.hpBonus} HP</span>}
                  {item.attackBonus > 0 && <span className="text-red-300">ATK +{item.attackBonus}</span>}
                </div>
                {!unlocked && <p className="text-xs text-muted-foreground mt-0.5">Requires Jewelcrafting level {recipe.reqLevel}</p>}
              </div>

              <div className="flex-shrink-0">
                {isRecipeActive ? (
                  <Button size="sm" variant="outline" onClick={() => startAction.mutate("idle")}>Stop</Button>
                ) : (
                  <Button size="sm" disabled={!unlocked || !hasRes || startAction.isPending}
                    onClick={() => startAction.mutate(`jewel_${index}`)}
                    data-testid={`button-craft-${recipe.id}`}>
                    {!unlocked ? `Lv ${recipe.reqLevel}` : "Craft"}
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
