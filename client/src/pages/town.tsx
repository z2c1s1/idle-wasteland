import { useGameState } from "@/hooks/use-game";
import { TOWN_NPCS } from "@shared/game-data";
import { postGame } from "@/lib/api";
import { api } from "@shared/routes";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Building2, Users } from "lucide-react";
import type { GameState } from "@shared/schema";
import { RARITY_COLOR, RARITY_LABEL } from "@shared/game-data";

export default function Town() {
  const { data: state } = useGameState();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  if (!state) return null;
  const gs = state as GameState;

  const homestead: Record<string, number> = JSON.parse(gs.homestead ?? '{}');
  const townLevel = Object.values(homestead).reduce((s, v) => s + (v ?? 0), 0);

  const npcEncounter: { id: string; arrivedAt: number } | null = (() => {
    try { return JSON.parse(gs.npcEncounter ?? 'null'); } catch { return null; }
  })();
  const npc = npcEncounter ? TOWN_NPCS.find(n => n.id === npcEncounter.id) : null;
  // Companion roster
  const companions: any[] = (() => { try { return JSON.parse((gs as any).companions ?? '[]'); } catch { return []; } })();
  const companiomBonuses = companions.map((c: any) => (
    <span key={c.id} className={(RARITY_COLOR as any)[c.rarity] ?? 'text-muted-foreground'}>
      {c.emoji} {c.name} +{c.bonusValue}% {c.bonusName}
    </span>
  ));

  const doAction = async (actionIndex: number) => {
    if (!npc) return;
    try {
      const next = await postGame(api.game.npcAction.path, { npcId: npc.id, actionIndex });
      queryClient.setQueryData([api.game.getState.path], next);
      toast({ title: '操作成功' });
    } catch (e: any) { toast({ title: '操作失败', description: e.message, variant: 'destructive' }); }
  };

  const dismiss = async () => {
    try {
      const next = await postGame(api.game.dismissNpc.path);
      queryClient.setQueryData([api.game.getState.path], next);
      toast({ title: 'NPC已离开' });
    } catch (e: any) { toast({ title: '操作失败', description: e.message, variant: 'destructive' }); }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      <h1 className="text-xl font-bold flex items-center gap-2">
        <Building2 className="w-5 h-5 text-amber-400" /> 城镇
      </h1>

      {/* Town status */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold">城镇等级: {townLevel}</span>
          <span className="text-xs text-muted-foreground">{townLevel < 5 ? '🏕️ 小村庄' : townLevel < 15 ? '🏘️ 村庄' : townLevel < 30 ? '🏙️ 小镇' : '🏰 城镇'}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {townLevel < 5
            ? '继续建造家园建筑，达到等级5后会吸引NPC来访'
            : '城镇已经吸引了一些旅人，他们偶尔会路过这里'}
        </p>
      </div>

      {/* NPC encounter */}
      {npc ? (
        <div className="bg-amber-500/10 border border-amber-400/40 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{npc.emoji}</span>
            <div>
              <p className="font-bold text-amber-300">{npc.name}</p>
              <p className="text-xs text-muted-foreground">{npc.desc}</p>
            </div>
          </div>
          <div className="grid gap-2">
            {npc.actions.map((a, i) => (
              <button key={i} onClick={() => doAction(i)}
                className="w-full px-3 py-2 text-xs rounded bg-amber-600/30 hover:bg-amber-500/40 text-amber-200 transition-colors text-left">
                {a.label}
                <span className="block text-[10px] text-amber-400/60">{a.effect}</span>
              </button>
            ))}
          </div>
          <button onClick={dismiss}
            className="w-full py-1.5 text-xs rounded bg-slate-600/30 hover:bg-slate-500/40 text-slate-300 transition-colors">
            送别
          </button>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-3xl mb-2">🏕️</p>
          <p className="text-sm">
            {townLevel >= 5 ? '暂时没有旅人路过，稍后再来看看吧' : '继续建造家园来发展你的城镇'}
          </p>
        </div>
      )}

      {/* Companion Roster */}
      {companions.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-4 space-y-2">
          <h2 className="text-sm font-bold flex items-center gap-2"><Users className="w-4 h-4 text-green-400" /> 营地成员 ({companions.length})</h2>
          <div className="flex flex-wrap gap-2 text-xs">
            {companiomBonuses}
          </div>
        </div>
      )}

      {/* NPC catalog */}
      <div className="space-y-2">
        <h2 className="text-sm font-bold">已知旅人</h2>
        {TOWN_NPCS.map(n => (
          <div key={n.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
            <span className="text-2xl">{n.emoji}</span>
            <div>
              <p className="text-sm font-bold">{n.name}</p>
              <p className="text-xs text-muted-foreground">{n.desc}</p>
              <div className="flex gap-1 mt-1">
                {n.actions.map((a, i) => (
                  <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-700/50 text-muted-foreground">
                    {a.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
