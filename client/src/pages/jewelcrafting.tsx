import { useGameState, useStartAction } from "@/hooks/use-game";
import { JEWELCRAFTING_RECIPES, JEWELRY_ITEMS } from "@shared/game-data";
import { calculateLevel, formatNumber, levelProgress, parseCraftItems } from "@/lib/game-utils";
import type { GameState } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ItemSprite } from "@/components/sprites";
import { Progress } from "@/components/ui/progress";
import { Gem, CheckCircle2 } from "lucide-react";
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
      <div className="h-full bg-purple-500 rounded-full transition-none" style={{ width: `${progress}%` }} />
    </div>
  );
}

const BAR_NAMES: Record<string, string> = {
  bar_0: "废铁锭", bar_1: "铜丝锭", bar_2: "铝罐锭", bar_3: "铅锭", bar_4: "硫磺锭",
  bar_5: "硝酸盐锭", bar_6: "铀锭", bar_7: "钛金锭", bar_8: "钨钢锭", bar_9: "铱金锭",
  bones: "骨头", dragonBones: "龙骨",
};

export default function Jewelcrafting() {
  const { data: state } = useGameState();
  const startAction = useStartAction();

  if (!state) return null;
  const t = useUIText();
  const pc = t.pages.crafting;
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
          <Gem className="w-5 h-5 text-purple-400" /> {pc.jewelcrafting}
        </h1>
        <p className="text-sm text-muted-foreground">{level} 级 · {formatNumber(gs.jewelcraftingXp)} 经验</p>
        <Progress value={levelProgress(gs.jewelcraftingXp)} className="mt-2 h-1.5" />
      </div>

      {/* Bar inventory + crafted jewelry */}
      <div className="bg-card border border-border rounded-xl p-4">
        {/* Crafted items — shown first inside the materials card */}
        {Object.keys(JEWELRY_ITEMS).some(id => (craftItems[id] ?? 0) > 0) && (
          <div className="mb-4">
            <h2 className="text-xs font-semibold text-purple-300 uppercase tracking-wider mb-2">💍 合成产物</h2>
            <div className="flex flex-wrap gap-2">
              {Object.entries(JEWELRY_ITEMS).map(([itemId, def]) => {
                const qty = craftItems[itemId] ?? 0;
                if (qty <= 0) return null;
                return (
                  <div key={itemId} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-purple-500/30 bg-purple-500/5">
                    <ItemSprite slot={def.slot} baseId={itemId} rarity="uncommon" ilvl={def.ilvl} size={18} />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-purple-300 truncate">{def.name} <span className="text-muted-foreground">x{qty}</span></p>
                      <p className="text-[10px] text-muted-foreground">
                        ilvl {def.ilvl}
                        {def.critRating && def.critRating > 0 && <span className="text-yellow-300 ml-1">✦{def.critRating}%</span>}
                        {def.hpBonus && def.hpBonus > 0 && <span className="text-green-300 ml-1">❤{def.hpBonus}</span>}
                        {def.attackBonus > 0 && <span className="text-red-300 ml-1">⚔{def.attackBonus}</span>}
                        {def.defenceBonus > 0 && <span className="text-blue-300 ml-1">🛡{def.defenceBonus}</span>}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">🪙 金属锭 & 材料</h2>
        <div className="grid grid-cols-6 gap-2">
          {[...Array(10)].map((_, i) => {
            const key = `bar_${i}`;
            const qty = getQty(key);
            return (
              <div key={key} className={`text-center p-2 rounded-lg border ${qty > 0 ? 'border-purple-500/30 bg-purple-500/8' : 'border-border bg-muted/10 opacity-40'}`}>
                <p className="text-xs text-muted-foreground">{BAR_NAMES[key]}</p>
                <p className={`text-sm font-bold ${qty > 0 ? 'text-purple-300' : ''}`}>{qty}</p>
              </div>
            );
          })}
          {['bones', 'dragonBones'].map(key => {
            const qty = getQty(key);
            return (
              <div key={key} className={`text-center p-2 rounded-lg border ${qty > 0 ? 'border-amber-500/30 bg-amber-500/8' : 'border-border bg-muted/10 opacity-40'}`}>
                <p className="text-xs text-muted-foreground">{BAR_NAMES[key]}</p>
                <p className={`text-sm font-bold ${qty > 0 ? 'text-amber-300' : ''}`}>{qty}</p>
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
                正在制作 {JEWELRY_ITEMS[JEWELCRAFTING_RECIPES[activeIndex]?.output]?.name ?? "..."}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={() => startAction.mutate("idle")} data-testid="button-stop-jewelcrafting">停止</Button>
          </div>
          <ActionTimer actionUpdatedAt={gs.actionUpdatedAt as unknown as string} time={JEWELCRAFTING_RECIPES[activeIndex]?.time ?? 8} />
        </div>
      )}

      {/* Recipe list */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">配方</h2>
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

              <ItemSprite slot={item.slot} baseId={item.id} rarity={(item as any).rarity ?? 'common'} ilvl={item.ilvl} size={28} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">{item.name}</span>
                  {owned > 0 && <span className="text-xs text-green-400 border border-green-500/30 px-1 rounded">x{owned} 持有</span>}
                  {isRecipeActive && <span className="text-xs text-purple-300 font-medium">制作中...</span>}
                  {hasRes && !isRecipeActive && unlocked && <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />}
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5 text-xs text-muted-foreground">
                  {recipe.inputs.map(inp => {
                    const have = getQty(inp.resource);
                    const name = BAR_NAMES[inp.resource] ?? inp.resource;
                    const ok = have >= inp.qty;
                    return (
                      <span key={inp.resource} className={ok ? "text-green-400" : "text-red-400"}>
                        {name} x{inp.qty}（持有 {have}）
                      </span>
                    );
                  })}
                  <span>· {recipe.xp} 经验 · {recipe.time}s · 物品等级 {item.ilvl}</span>
                  {item.critRating && item.critRating > 0 && <span className="text-yellow-300">✦ +{item.critRating}% 暴击</span>}
                  {item.hpBonus && item.hpBonus > 0 && <span className="text-green-300">❤ +{item.hpBonus} 生命</span>}
                  {item.attackBonus > 0 && <span className="text-red-300">攻击 +{item.attackBonus}</span>}
                </div>
                {!unlocked && <p className="text-xs text-muted-foreground mt-0.5">需要珠宝制作等级 {recipe.reqLevel}</p>}
              </div>

              <div className="flex-shrink-0">
                {isRecipeActive ? (
                  <Button size="sm" variant="outline" onClick={() => startAction.mutate("idle")}>停止</Button>
                ) : (
                  <Button size="sm" disabled={!unlocked || !hasRes || startAction.isPending}
                    onClick={() => startAction.mutate(`jewel_${index}`)}
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
