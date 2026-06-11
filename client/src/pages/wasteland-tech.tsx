import { useGameState } from "@/hooks/use-game";
import { postGame } from "@/lib/api";
import { api } from "@shared/routes";
import { safeJsonRecord, safeJsonArray } from "@shared/safe-parse";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ItemSprite } from "@/components/sprites";
import { parseLootBag, parseEquipment } from "@/lib/game-utils";
import { RARITY_COLOR, RARITY_BORDER, type GameItem } from "@shared/game-data";
import { Zap, Trash2, Skull } from "lucide-react";
import type { GameState } from "@shared/schema";

export default function WastelandTech() {
  const { data: state } = useGameState();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  if (!state) return null;
  const gs = state as any;

  const lootBag = parseLootBag(gs.lootBag);
  const equipment = parseEquipment(gs.equipment);
  const allItems = [...lootBag, ...Object.values(equipment).filter(Boolean) as GameItem[]];

  const extracted: string[] = safeJsonArray(gs.extractedPowers);
  const active: string[] = JSON.parse(gs.activePowers ?? '["","",""]');

  const refresh = (data: any) => queryClient.setQueryData([api.game.getState.path], data);

  const handleExtract = async (instanceId: string) => {
    try {
      const res = await postGame(api.game.extractPower.path, { instanceId });
      refresh(res); toast({ title: "传奇特效已萃取" });
    } catch (e: any) { toast({ title: "萃取失败", description: e.message, variant: "destructive" }); }
  };

  const handleEquipPower = async (slot: number, powerId: string) => {
    try {
      const res = await postGame(api.game.equipPower.path, { slot, powerId });
      refresh(res); toast({ title: "威能已装备" });
    } catch (e: any) { toast({ title: "装备失败", description: e.message, variant: "destructive" }); }
  };

  const handleCorrupt = async (instanceId: string) => {
    try {
      const res = await fetch("/api/game/corrupt", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({instanceId}) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      refresh(data.gameState ?? data);
      toast({ title: "辐射完成", description: data.result });
    } catch (e: any) { toast({ title: "辐射失败", description: e.message, variant: "destructive" }); }
  };

  const extractableItems = allItems.filter(i => (i.legendaryPower || i.skills?.length) && !extracted.includes(i.legendaryPower || `skill_${i.skills?.[0]?.type}`));
  const corruptibleItems = allItems.filter(i => !(i as any).corrupted);

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 bg-card rounded-xl border border-border">
      <h1 className="text-xl font-bold flex items-center gap-2"><Zap className="w-5 h-5 text-amber-400" /> 废土科技</h1>

      {/* ── 传奇萃取 ── */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        <h2 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">♻️ 传奇萃取</h2>
        <p className="text-xs text-muted-foreground">销毁暗金/传奇装备，永久学会其特效</p>

        {extractableItems.length === 0 ? (
          <p className="text-xs text-muted-foreground">背包中没有可萃取的传奇装备</p>
        ) : (
          <div className="space-y-1">
            {extractableItems.map(item => (
              <div key={item.instanceId} className={`flex items-center justify-between p-2 rounded border ${RARITY_BORDER[item.rarity]}`}>
                <div className="flex items-center gap-2">
                  <ItemSprite slot={item.slot} baseId={(item as any).baseId ?? (item as any).baseType} rarity={item.rarity} ilvl={item.ilvl} size={16} />
                  <span className={`text-xs font-semibold ${RARITY_COLOR[item.rarity]}`}>{item.name}</span>
                  <span className="text-[10px] text-amber-400">{item.legendaryPower || item.skills?.[0]?.name}</span>
                </div>
                <button onClick={() => handleExtract(item.instanceId)} className="px-2 py-1 text-[10px] rounded bg-amber-600 hover:bg-amber-500 text-white">
                  萃取
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Active Power Slots */}
        <div className="border-t border-border pt-3">
          <h3 className="text-xs font-semibold text-muted-foreground mb-2">激活威能（最多3个）</h3>
          <div className="grid grid-cols-3 gap-2">
            {[0,1,2].map(slot => (
              <div key={slot} className="p-2 rounded border border-amber-500/30 bg-amber-500/5 text-center">
                <p className="text-[10px] text-muted-foreground mb-1">槽位 {slot+1}</p>
                <select value={active[slot] || ''} onChange={e => handleEquipPower(slot, e.target.value)}
                  className="w-full text-[10px] bg-muted/30 rounded p-1 border-none">
                  <option value="">空</option>
                  {extracted.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                {active[slot] && <p className="text-[9px] text-amber-400 mt-1">{active[slot]}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 装备辐射 ── */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        <h2 className="text-sm font-semibold text-lime-400 uppercase tracking-wider">☢️ 装备辐射</h2>
        <p className="text-xs text-muted-foreground">对装备施加不可逆辐射变异，30%正向/20%极正向/20%负向/15%极负向/15%无变化</p>

        {corruptibleItems.length === 0 ? (
          <p className="text-xs text-muted-foreground">没有可辐射的装备</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 max-h-60 overflow-y-auto">
            {corruptibleItems.slice(0, 20).map(item => (
              <button key={item.instanceId} onClick={() => handleCorrupt(item.instanceId)}
                className={`p-2 rounded border text-center text-[10px] ${RARITY_BORDER[item.rarity]} hover:border-lime-400 transition-colors`}>
                <ItemSprite slot={item.slot} baseId={(item as any).baseId ?? (item as any).baseType} rarity={item.rarity} ilvl={item.ilvl} size={24} />
                <span className={RARITY_COLOR[item.rarity]}>{item.name.slice(0, 6)}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}