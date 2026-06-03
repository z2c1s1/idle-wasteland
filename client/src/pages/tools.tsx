import { useGameState } from "@/hooks/use-game";
import { useStartAction } from "@/hooks/use-game";
import { ALL_TOOLS, TOOL_RECIPES, type GameTool } from "@shared/game-data";
import { formatNumber } from "@/lib/game-utils";
import { useToast } from "@/hooks/use-toast";
import { Wrench } from "lucide-react";
import { ToolIcon } from "@/components/tool-icon";
import type { GameState } from "@shared/schema";

const SKILL_LABELS: Record<string, string> = {
  woodcutting: '伐木', mining: '采矿', fishing: '钓鱼', hunting: '狩猎',
};
const RESOURCE_EMOJI: Record<string, string> = {
  bones:'🦴', dragonBones:'🐲', wood_0:'🪵', wood_1:'🌿', wood_2:'🌳', wood_4:'🌲', wood_5:'🎋', wood_6:'✨', wood_8:'🎑',
  bar_0:'🔩', bar_1:'🔩', bar_2:'🔩', bar_4:'🔩', bar_5:'🔩', bar_6:'🔩', bar_8:'🔩',
  hide_0:'🪶', hide_1:'🪶', hide_2:'🪶', hide_4:'🪶', hide_6:'🪶',
};

export default function Tools() {
  const { data: state } = useGameState();
  const startAction = useStartAction();
  const { toast } = useToast();
  if (!state) return null;

  const gs = state as any;
  const equippedTool: GameTool | null = (() => { try { const t = JSON.parse(gs.tool ?? '{}'); return t.id ? t : null; } catch { return null; } })();
  const isCrafting = gs.activeAction?.startsWith('tool_');
  const activeRecipeIdx = isCrafting ? parseInt(gs.activeAction.split('_')[1]) : -1;

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Wrench className="w-5 h-5 text-amber-400" /> 生产工具
        </h1>
        <p className="text-sm text-muted-foreground">
          {equippedTool ? `已装备：${equippedTool.name}` : '未装备工具'}
        </p>
      </div>

      {equippedTool && (
        <div className="bg-card border border-amber-400/30 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-2">当前工具</h2>
          <div className="flex items-center gap-3">
            <ToolIcon toolId={equippedTool.id} size={32} />
            <div>
              <p className="font-bold text-amber-300">{equippedTool.name}</p>
              <p className="text-xs text-muted-foreground">
                {SKILL_LABELS[equippedTool.skill] ?? equippedTool.skill} · 速度 ×{equippedTool.timeMult.toFixed(2)} · 产量 +{equippedTool.yieldBonus}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Craftable tools list */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">制造工具</h2>
        <p className="text-xs text-muted-foreground">消耗伐木、冶炼材料和副本掉落物合成，制造后自动装备</p>
        {TOOL_RECIPES.map((recipe, idx) => {
          const tool = ALL_TOOLS.find(t => t.id === recipe.output);
          if (!tool) return null;
          const isActive = isCrafting && activeRecipeIdx === idx;
          const canCraft = recipe.inputs.every(inp => {
            if (inp.resource === 'bones') return (gs.bones ?? 0) >= inp.qty;
            if (inp.resource === 'dragonBones') return (gs.dragonBones ?? 0) >= inp.qty;
            return (gs[inp.resource] ?? 0) >= inp.qty;
          });
          const busy = gs.activeAction !== 'idle' && !isActive;
          const isEquipped = equippedTool?.id === tool.id;

          return (
            <div key={recipe.id} className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
              isActive ? 'border-amber-400/50 bg-amber-500/10' :
              isEquipped ? 'border-amber-400/30 bg-amber-500/5' :
              'border-border bg-card hover:border-amber-400/30'
            }`}>
              <ToolIcon toolId={tool.id} size={24} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium">{tool.name}</span>
                  <span className="text-[10px] text-muted-foreground">{SKILL_LABELS[tool.skill]}</span>
                  {isEquipped && <span className="text-[10px] px-1 py-0.5 rounded bg-amber-500/20 text-amber-400">已装备</span>}
                  {isActive && <span className="text-[10px] px-1 py-0.5 rounded bg-primary/20 text-primary">制造中</span>}
                </div>
                <div className="text-xs text-muted-foreground flex gap-2 mt-0.5 flex-wrap">
                  <span>⏱ {recipe.time}s</span>
                  <span>⭐ {recipe.xp} 锻造经验</span>
                  <span>🔧 需要 {recipe.reqLevel} 级</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {recipe.inputs.map((inp, i) => {
                    const have = inp.resource === 'bones' ? (gs.bones ?? 0) : inp.resource === 'dragonBones' ? (gs.dragonBones ?? 0) : (gs[inp.resource] ?? 0);
                    const enough = have >= inp.qty;
                    return (
                      <span key={i} className={`text-[10px] px-1.5 py-0.5 rounded border ${enough ? 'border-border text-muted-foreground' : 'border-red-400/40 text-red-400'}`}>
                        {RESOURCE_EMOJI[inp.resource] ?? '📦'} {inp.qty}/{formatNumber(have)}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="flex-shrink-0">
                {isActive ? (
                  <button onClick={() => startAction.mutate('idle')}
                    className="px-3 py-1 text-xs font-semibold bg-red-600 hover:bg-red-500 text-white rounded">停止</button>
                ) : (
                  <button disabled={!canCraft || busy} onClick={() => startAction.mutate(`tool_${idx}`)}
                    className="px-3 py-1 text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white rounded disabled:opacity-40">
                    {!canCraft ? '材料不足' : busy ? '忙碌中' : '制造'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
