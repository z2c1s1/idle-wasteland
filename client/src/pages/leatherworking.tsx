import { useGameState, useStartAction } from "@/hooks/use-game";
import { LEATHERWORKING_RECIPES, LEATHER_ITEMS } from "@shared/game-data"
import { getResourceCount } from "@shared/resources";
import { calculateLevel, formatNumber, levelProgress, parseCraftItems } from "@/lib/game-utils";
import type { GameState } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ItemSprite } from "@/components/sprites";
import { Progress } from "@/components/ui/progress";
import { PawPrint, CheckCircle2 } from "lucide-react";
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
  if (actionUpdatedAt !== prevStartRef.current) {
    prevStartRef.current = actionUpdatedAt;
    lastSyncRef.current = 0;
  }
  useEffect(() => {
    const startMs = new Date(actionUpdatedAt).getTime();
    const tick = () => {
      const secs = (Date.now() - startMs) / 1000;
      setProgress(((secs % time) / time) * 100);
      const cycles = Math.floor(secs / time);
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
  }, [actionUpdatedAt, time, queryClient]);
  return (
    <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
      <div className="h-full bg-amber-500 rounded-full transition-none" style={{ width: `${progress}%` }} />
    </div>
  );
}

const HIDE_NAMES = ["辐射鼠","变异兔","铁鳞蜥","疯犬","钢鬃猪","双头鹿","灰熊","辐射蝎","死亡爪","巨兽"];

export default function Leatherworking() {
  const { data: state } = useGameState();
  const startAction = useStartAction();

  if (!state) return null;
  const t = useUIText();
  const pc = t.pages.crafting;
  const gs = state as GameState;
  const level = calculateLevel(gs.leatherworkingXp);
  const craftItems = parseCraftItems(gs.craftItems);

  const activeAction = gs.activeAction;
  const isActive = activeAction.startsWith("leather_");
  const activeIndex = isActive ? parseInt(activeAction.split("_")[1]) : -1;

  function getQty(resource: string): number {
    return getResourceCount(gs, resource);
  }
  function canCraft(idx: number): boolean {
    const r = LEATHERWORKING_RECIPES[idx];
    if (!r || level < r.reqLevel) return false;
    return r.inputs.every(i => getQty(i.resource) >= i.qty);
  }

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-5 bg-card rounded-xl border border-border">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <PawPrint className="w-5 h-5 text-amber-400" /> {pc.leatherworking}
        </h1>
        <p className="text-sm text-muted-foreground">{level} 级 · {formatNumber(gs.leatherworkingXp)} 经验</p>
        <Progress value={levelProgress(gs.leatherworkingXp)} className="mt-2 h-1.5" />
      </div>

      {/* Hide inventory + crafted leather items */}
      <div className="bg-card border border-border rounded-xl p-4">
        {/* Crafted items — shown first inside the materials card */}
        {Object.keys(LEATHER_ITEMS).some(id => (craftItems[id] ?? 0) > 0) && (
          <div className="mb-4">
            <h2 className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2">🦴 合成产物</h2>
            <div className="flex flex-wrap gap-2">
              {Object.entries(LEATHER_ITEMS).map(([itemId, def]) => {
                const qty = craftItems[itemId] ?? 0;
                if (qty <= 0) return null;
                return (
                  <div key={itemId} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/5">
                    <ItemSprite slot={def.slot} baseId={itemId} rarity="uncommon" ilvl={def.ilvl} size={18} />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-amber-300 truncate">{def.name} <span className="text-muted-foreground">x{qty}</span></p>
                      <p className="text-[10px] text-muted-foreground">
                        ilvl {def.ilvl}
                        {def.attackBonus > 0 && <span className="text-red-300 ml-1">⚔{def.attackBonus}</span>}
                        {def.defenceBonus > 0 && <span className="text-blue-300 ml-1">🛡{def.defenceBonus}</span>}
                        {def.hpBonus && def.hpBonus > 0 && <span className="text-green-300 ml-1">❤{def.hpBonus}</span>}
                        {def.critRating && def.critRating > 0 && <span className="text-yellow-300 ml-1">✦{def.critRating}%</span>}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">🪶 可用兽皮</h2>
        <div className="grid grid-cols-5 gap-2">
          {HIDE_NAMES.map((name, i) => {
            const qty = getQty(`hide_${i}`);
            return (
              <div key={i} className={`text-center p-2 rounded-lg border ${qty > 0 ? 'border-amber-500/30 bg-amber-500/8' : 'border-border bg-card'}`}>
                <p className="text-xs text-muted-foreground">{name}皮</p>
                <p className={`text-sm font-bold ${qty > 0 ? 'text-amber-300' : ''}`}>{qty}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active crafting */}
      {isActive && activeIndex >= 0 && (
        <div className="bg-card border border-amber-500/30 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-medium text-amber-300">
                正在制作 {LEATHER_ITEMS[LEATHERWORKING_RECIPES[activeIndex]?.output]?.name ?? "..."}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={() => startAction.mutate("idle")} data-testid="button-stop-leatherworking">停止</Button>
          </div>
          <ActionTimer actionUpdatedAt={gs.actionUpdatedAt as unknown as string} time={LEATHERWORKING_RECIPES[activeIndex]?.time ?? 8} />
        </div>
      )}

      {/* Recipe list */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">配方</h2>
        {LEATHERWORKING_RECIPES.map((recipe, index) => {
          const item = LEATHER_ITEMS[recipe.output];
          if (!item) return null;
          const unlocked = level >= recipe.reqLevel;
          const hasRes = canCraft(index);
          const isRecipeActive = activeIndex === index;
          const owned = craftItems[recipe.output] ?? 0;

          return (
            <div key={recipe.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                !unlocked ? "border-border bg-card" :
                isRecipeActive ? "border-amber-500/50 bg-amber-500/10" :
                "border-border bg-card hover:border-amber-500/30"
              }`}
              data-testid={`recipe-${recipe.id}`}>

              <ItemSprite slot={item.slot} baseId={item.id} rarity={(item as any).rarity ?? 'common'} ilvl={item.ilvl} size={28} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">{item.name}</span>
                  {owned > 0 && <span className="text-xs text-green-400 border border-green-500/30 px-1 rounded">x{owned} 持有</span>}
                  {isRecipeActive && <span className="text-xs text-amber-300 font-medium">制作中...</span>}
                  {hasRes && !isRecipeActive && unlocked && <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />}
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5 text-xs text-muted-foreground">
                  {recipe.inputs.map(inp => {
                    const have = getQty(inp.resource);
                    const hideIdx = parseInt(inp.resource.split("_")[1]);
                    const ok = have >= inp.qty;
                    return (
                      <span key={inp.resource} className={ok ? "text-green-400" : "text-red-400"}>
                        {HIDE_NAMES[hideIdx]}皮 x{inp.qty}（持有 {have}）
                      </span>
                    );
                  })}
                  <span>· {recipe.xp} 经验 · {recipe.time}s · 物品等级 {item.ilvl}</span>
                  {item.attackBonus > 0 && <span className="text-red-300">攻击 +{item.attackBonus}</span>}
                  {item.defenceBonus > 0 && <span className="text-blue-300">防御 +{item.defenceBonus}</span>}
                </div>
                {!unlocked && <p className="text-xs text-muted-foreground mt-0.5">需要皮革制作等级 {recipe.reqLevel}</p>}
              </div>

              <div className="flex-shrink-0">
                {isRecipeActive ? (
                  <Button size="sm" variant="outline" onClick={() => startAction.mutate("idle")}>停止</Button>
                ) : (
                  <Button size="sm" disabled={!unlocked || !hasRes || startAction.isPending}
                    onClick={() => startAction.mutate(`leather_${index}`)}
                    data-testid={`button-craft-${recipe.id}`}>
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
