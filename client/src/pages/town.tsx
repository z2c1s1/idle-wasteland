import { useGameState } from "@/hooks/use-game";
import { TOWN_NPCS } from "@shared/game-data";
import { postGame } from "@/lib/api";
import { api } from "@shared/routes";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Building2, Users } from "lucide-react";
import { useUIText } from "@/lib/i18n";
import type { GameState } from "@shared/schema";
import { RARITY_COLOR, RARITY_LABEL, ALL_SLOTS, SLOT_LABEL } from "@shared/game-data";
import { useState } from "react";

export default function Town() {
  const { data: state } = useGameState();
  const queryClient = useQueryClient();
  const t = useUIText();
  const { toast } = useToast();
  if (!state) return null;
  const gs = state as GameState;
  const p = t.pages.town;

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
      toast({ title: p.operateSuccess });
    } catch (e: any) { toast({ title: p.operateFail, description: e.message, variant: 'destructive' }); }
  };

  const dismiss = async () => {
    try {
      const next = await postGame(api.game.dismissNpc.path);
      queryClient.setQueryData([api.game.getState.path], next);
      toast({ title: p.npcLeft });
    } catch (e: any) { toast({ title: p.operateFail, description: e.message, variant: 'destructive' }); }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4 bg-card rounded-xl border border-border">
      <h1 className="text-xl font-bold flex items-center gap-2">
        <Building2 className="w-5 h-5 text-amber-400" /> {p.title}
      </h1>

      {/* Town status */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold">{p.townLevel(townLevel)}</span>
          <span className="text-xs text-muted-foreground">{townLevel < 5 ? `🏕️ ${t.wasteland.townLevels[5]}` : townLevel < 15 ? `🏘️ ${t.wasteland.townLevels[15]}` : townLevel < 30 ? `🏙️ ${t.wasteland.townLevels[30]}` : `🏰 ${t.wasteland.townLevels[50]}`}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
{townLevel < 5 ? p.attractHint : p.attractHint2}
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
            {p.sendAway}
          </button>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-3xl mb-2">🏕️</p>
          <p className="text-sm">
{townLevel >= 5 ? p.noVisitors : p.attractHint}
          </p>
        </div>
      )}

      {/* Companion Roster */}
      {companions.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-4 space-y-2">
          <h2 className="text-sm font-bold flex items-center gap-2"><Users className="w-4 h-4 text-green-400" /> {p.campMembers} ({companions.length})</h2>
          <div className="flex flex-wrap gap-2 text-xs">
            {companiomBonuses}
          </div>
        </div>
      )}

      {/* Blood Shards Gambling */}
      <div className="bg-card border border-red-500/20 rounded-xl p-4 space-y-3">
        <h2 className="text-sm font-bold flex items-center gap-2">🩸 废土商人 — 血岩碎片定向赌博</h2>
        <p className="text-xs text-muted-foreground">消耗血岩碎片，赌博指定部位的装备。品质: 稀有40% / 史诗30% / 传说20% / 神话10%</p>
        <BloodGambler state={gs} refresh={(d:any) => queryClient.setQueryData([api.game.getState.path], d)} toast={toast} />
      </div>

      {/* NPC catalog — gated by town level and dungeon clears */}
      <div className="space-y-2">
        <h2 className="text-sm font-bold">已知旅人</h2>
        {TOWN_NPCS.map(n => {
          const dungeonStats = (() => { try { return JSON.parse(gs.dungeonStats ?? '{}'); } catch { return {}; } })();
          const dungeonClear = (n.reqDungeon ?? 0) > 0 ? ((dungeonStats[String(n.reqDungeon)] as any)?.clears ?? 0) > 0 : true;
          const unlocked = (!n.reqTownLevel || townLevel >= n.reqTownLevel) && dungeonClear;
          return (
          <div key={n.id} className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
            unlocked ? 'border-border bg-card' : 'border-border/30 bg-card/30 '
          }`}>
            <span className="text-2xl">{unlocked ? n.emoji : '❓'}</span>
            <div>
              <p className="text-sm font-bold">{unlocked ? n.name : '???'}</p>
              {unlocked ? (
                <>
                  <p className="text-xs text-muted-foreground">{n.desc}</p>
                  <div className="flex gap-1 mt-1">
                    {n.actions.map((a, i) => (
                      <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-700/50 text-muted-foreground">
                        {a.label}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-[10px] text-amber-400 mt-1">
                  {n.reqTownLevel && townLevel < n.reqTownLevel ? `需城镇等级 ${n.reqTownLevel}` : ''}
                  {(n.reqDungeon ?? 0) > 0 && !dungeonClear ? `需通关副本 ${n.reqDungeon}` : ''}
                </p>
              )}
            </div>
          </div>
        );})}
      </div>
    </div>
  );
}

function BloodGambler({ state, refresh, toast }: { state: any; refresh: (d: any) => void; toast: any }) {
  const [selSlot, setSelSlot] = useState<string>(ALL_SLOTS[0]);
  const [count, setCount] = useState(1);
  const bloodShards = state.bloodShards ?? 0;
  const cost = 50 * count;

  const gamble = async () => {
    try {
      const res = await fetch("/api/game/gamble-slot", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slot: selSlot, cost }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      refresh(data);
      toast({ title: `获得了一件${SLOT_LABEL[selSlot as keyof typeof SLOT_LABEL] ?? selSlot}装备` });
    } catch (e: any) {
      toast({ title: "赌博失败", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">🩸 血岩碎片: {bloodShards}</span>
      </div>
      <div className="flex gap-2 flex-wrap">
        <select value={selSlot} onChange={e => setSelSlot(e.target.value)}
          className="text-xs bg-muted/30 rounded p-1 border-none flex-1">
          {ALL_SLOTS.map(s => <option key={s} value={s}>{SLOT_LABEL[s]}</option>)}
        </select>
        <button onClick={() => setCount(Math.max(1, count - 1))} className="w-6 h-6 text-xs rounded bg-muted/20">-</button>
        <span className="text-xs w-6 text-center">{count}</span>
        <button onClick={() => setCount(Math.min(10, count + 1))} className="w-6 h-6 text-xs rounded bg-muted/20">+</button>
      </div>
      <button onClick={gamble} disabled={bloodShards < cost}
        className="w-full py-2 text-xs rounded bg-red-600 hover:bg-red-500 disabled:opacity-30 text-white">
        赌博 ({cost} 🩸)
      </button>
      <p className="text-[10px] text-muted-foreground">每击杀1级敌人获得2碎片</p>
    </div>
  );
}
