import { useGameState, useStartAction } from "@/hooks/use-game";
import { SMITHING_RECIPES, EQUIPMENT_ITEMS } from "@shared/game-data";
import { calculateLevel, formatNumber, levelProgress, parseCraftItems } from "@/lib/game-utils";
import type { GameState } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ItemSprite } from "@/components/sprites";
import { Progress } from "@/components/ui/progress";
import { Shield, CheckCircle2 } from "lucide-react";
import { useUIText } from "@/lib/i18n";
import { useEffect, useRef, useState } from "react";
import { getPlayerId } from "@/lib/api";
import { api } from "@shared/routes";
import { useQueryClient } from "@tanstack/react-query";

function ActionTimer({ actionUpdatedAt, time }: { actionUpdatedAt: string; time: number }) {
  const [progress, setProgress] = useState(0);
  const lastSyncRef = useRef(0);
  const prevStartRef = useRef("");
  const queryClient = useQueryClient();
  const rafRef = useRef<number>(0);
  const startMs = new Date(actionUpdatedAt).getTime();
  if (actionUpdatedAt !== prevStartRef.current) {
    prevStartRef.current = actionUpdatedAt;
    lastSyncRef.current = 0;
  }

  useEffect(() => {
    const tick = () => {
      const elapsed = (Date.now() - startMs) / 1000;
      setProgress(((elapsed % time) / time) * 100);
      const cycles = Math.floor(elapsed / time);
      if (cycles > lastSyncRef.current) {
        lastSyncRef.current = cycles;
        fetch(api.game.getState.path, { headers: { "x-player-id": getPlayerId() } })
          .then(r => r.ok && r.json().then(d => queryClient.setQueryData([api.game.getState.path], d)))
          .catch(() => {});
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [startMs, time, queryClient]);

  return (
    <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
      <div className="h-full bg-primary rounded-full transition-none" style={{ width: `${progress}%` }} />
    </div>
  );
}

export default function SmithingCraft() {
  const t = useUIText();
  const pc = t.pages.crafting;
  const { data: state } = useGameState();
  const startAction = useStartAction();

  if (!state) return null;
  const gameState = state as GameState;
  const smithingLevel = calculateLevel(gameState.smithingXp);
  const smithingXp = gameState.smithingXp;
  const craftItems = parseCraftItems(gameState.craftItems);

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

  const BAR_NAMES = ["废铁","铜","铝","铅","硫磺","硝酸盐","铀","钛金","钨钢","铱金"];

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-5 bg-card rounded-xl border border-border">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Shield className="w-5 h-5 text-slate-400" /> {pc.smithing}
        </h1>
        <p className="text-sm text-muted-foreground">{pc.levelSuffix(smithingLevel)} · {formatNumber(smithingXp)} XP</p>
        <Progress value={levelProgress(smithingXp)} className="mt-2 h-1.5" />
      </div>

      {/* Bar inventory + crafted items */}
      <div className="bg-card border border-border rounded-xl p-4">
        {Object.keys(EQUIPMENT_ITEMS).some(id => (craftItems[id] ?? 0) > 0) && (
          <div className="mb-4">
            <h2 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">⚔ 已锻造装备</h2>
            <div className="flex flex-wrap gap-2">
              {Object.entries(EQUIPMENT_ITEMS).map(([itemId, def]) => {
                const qty = craftItems[itemId] ?? 0;
                if (qty <= 0) return null;
                return (
                  <div key={itemId} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-500/30 bg-slate-500/5">
                    <ItemSprite slot={def.slot} baseId={itemId} rarity="uncommon" ilvl={def.ilvl} size={18} />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-300 truncate">{def.name} <span className="text-muted-foreground">x{qty}</span></p>
                      <p className="text-[10px] text-muted-foreground">ilvl {def.ilvl}{def.attackBonus > 0 && <span className="text-red-300 ml-1">⚔{def.attackBonus}</span>}{def.defenceBonus > 0 && <span className="text-blue-300 ml-1">🛡{def.defenceBonus}</span>}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">🪙 金属锭</h2>
        <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
          {[...Array(10)].map((_, i) => {
            const qty = getInputQty(`bar_${i}`);
            return (
              <div key={`bar_${i}`} className={`text-center p-2 rounded-lg border ${qty > 0 ? 'border-slate-500/30 bg-slate-500/8' : 'border-border bg-muted/20'}`}>
                <p className="text-[10px] text-muted-foreground">{BAR_NAMES[i]}锭</p>
                <p className={`text-xs font-bold ${qty > 0 ? 'text-slate-300' : ''}`}>{qty}</p>
              </div>
            );
          })}
          <div className={`text-center p-2 rounded-lg border ${getInputQty('bones') > 0 ? 'border-amber-500/30 bg-amber-500/8' : 'border-border bg-muted/20'}`}>
            <p className="text-[10px] text-muted-foreground">骨头</p>
            <p className={`text-xs font-bold ${getInputQty('bones') > 0 ? 'text-amber-300' : ''}`}>{getInputQty('bones')}</p>
          </div>
          <div className={`text-center p-2 rounded-lg border ${getInputQty('dragonBones') > 0 ? 'border-amber-500/30 bg-amber-500/8' : 'border-border bg-muted/20'}`}>
            <p className="text-[10px] text-muted-foreground">龙骨</p>
            <p className={`text-xs font-bold ${getInputQty('dragonBones') > 0 ? 'text-amber-300' : ''}`}>{getInputQty('dragonBones')}</p>
          </div>
        </div>
      </div>

      {/* Active smithing */}
      {isSmithing && activeIndex >= 0 && (
        <div className="bg-card border border-primary/30 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-medium text-primary">
                {pc.activeCraft(EQUIPMENT_ITEMS[SMITHING_RECIPES[activeIndex]?.output]?.name ?? "...")}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={stopSmithing} data-testid="button-stop-smithing">{pc.stop}</Button>
          </div>
          <ActionTimer actionUpdatedAt={gameState.actionUpdatedAt as unknown as string} time={SMITHING_RECIPES[activeIndex]?.time ?? 8} />
        </div>
      )}

      {/* Recipe list */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{pc.recipe}</h2>
        {/* Crafted items inline */}
        {Object.keys(EQUIPMENT_ITEMS).some(id => (craftItems[id] ?? 0) > 0) && (
          <div className="flex flex-wrap gap-2 mb-1">
            {Object.entries(EQUIPMENT_ITEMS).map(([itemId, def]) => {
              const qty = craftItems[itemId] ?? 0;
              if (qty <= 0) return null;
              return (
                <div key={itemId} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-500/30 bg-slate-500/5">
                  <ItemSprite slot={def.slot} baseId={itemId} rarity="uncommon" ilvl={def.ilvl} size={16} />
                  <span className="text-xs text-slate-300">{def.name} <span className="text-muted-foreground">x{qty}</span></span>
                </div>
              );
            })}
          </div>
        )}
        {SMITHING_RECIPES.map((recipe, index) => {
          const item = EQUIPMENT_ITEMS[recipe.output];
          if (!item) return null;
          const unlocked = smithingLevel >= recipe.reqLevel;
          const hasResources = canCraft(index);
          const isActive = activeIndex === index;

          return (
            <div key={recipe.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                !unlocked ? "border-border bg-card" :
                isActive ? "border-primary/50 bg-primary/10" :
                "border-border bg-card hover:border-primary/30"
              }`}
              data-testid={`recipe-${recipe.id}`}>

              <ItemSprite slot={item.slot} baseId={item.id} rarity={(item as any).rarity ?? 'common'} ilvl={item.ilvl} size={28} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{item.name}</span>
                  {isActive && <span className="text-xs text-primary font-medium">{pc.crafting_}</span>}
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
                        {barName} bar x{inp.qty} ({pc.ownLabel} {have})
                      </span>
                    );
                  })}
                  <span>· {recipe.xp} XP · {recipe.time}s</span>
                  {item.attackBonus > 0 && <span className="text-red-300">ATK +{item.attackBonus}</span>}
                  {item.defenceBonus > 0 && <span className="text-blue-300">DEF +{item.defenceBonus}</span>}
                </div>
                {!unlocked && (
                  <p className="text-xs text-muted-foreground mt-0.5">{pc.reqSmithingLevel} {recipe.reqLevel}</p>
                )}
              </div>

              <div className="flex-shrink-0">
                {isActive ? (
                  <Button size="sm" variant="outline" onClick={stopSmithing} data-testid={`button-stop-${recipe.id}`}>{pc.stop}</Button>
                ) : (
                  <Button size="sm" disabled={!unlocked || !hasResources || startAction.isPending}
                    onClick={() => startRecipe(index)} data-testid={`button-craft-${recipe.id}`}>
                    {!unlocked ? pc.levelSuffix(recipe.reqLevel) : pc.craft}
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
