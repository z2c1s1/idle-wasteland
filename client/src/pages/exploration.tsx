import { useGameState } from "@/hooks/use-game";
import { SkillPage } from "@/components/skill-page";
import { postGame } from "@/lib/api";
import { api } from "@shared/routes";
import { useQueryClient } from "@tanstack/react-query";
import { WORLD_TIER_LABEL, TIER_UNLOCK_LEVELS, TIER_HP_MUL, TIER_ATK_MUL, TIER_ILVL_BONUS, TIER_DROP_MUL, type WorldTier } from "@shared/game-data";
import { Map, Flag, Skull, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { calculateLevel as calcLevel } from "@/lib/game-utils";
import type { GameState } from "@shared/schema";
import { useState } from "react";

const ZONES = [
  "枯树林","废弃加油站","废墟小镇","辐射沼泽","破碎公路",
  "废弃农场","地下掩体","酸雨平原","沙暴废土","雪地废墟",
  "火山灰地带","淹没城区","高架桥废墟","裂谷深渊","变异丛林",
  "巨兽骸骨场","精灵废墟","矮人矿场","吸血鬼巢穴","狼人森林",
  "搁浅货轮","海盗码头","天文台废墟","迷宫地铁","梦境实验室",
  "陨石坑","虚空边界","混沌荒原","避难所遗迹","终末之门",
];

const EXPLORE_LEVELS = [1,4,7,10,15,25,40,60,80,99];
const RESOURCES = EXPLORE_LEVELS.map((lv, i) => ({
  name: ZONES[i],
  emoji: "🗺️",
  time: 30 + i * 15, xp: 50 + i * 30,
  reqLevel: lv,
  resourceKey: `exploration_${i}`,
  actionKey: `exploration_${i}`, resourceType: "exploration" as const,
}));

export default function Exploration() {
  const { data: state } = useGameState();
  const { toast } = useToast();
  const [tab, setTab] = useState<'explore'|'outposts'>('explore');
  if (!state) return null;
  const gs = state as any;
  const outposts: any[] = JSON.parse(gs.outposts ?? '[]');

  const establish = async (zoneIndex: number) => {
    try {
      const res = await fetch('/api/game/establish-outpost', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ zoneIndex }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '建立失败');
      queryClient.setQueryData([api.game.getState.path], data);
      toast({ title: '前哨站已建立' });
    } catch(e:any) { toast({ title:'建立失败', description:e.message, variant:'destructive' }); }
  };

  const collect = async () => {
    try {
      const res = await fetch('/api/game/collect-outposts', { method:'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '收取失败');
      queryClient.setQueryData([api.game.getState.path], data);
      toast({ title: '资源已收取' });
    } catch(e:any) { toast({ title:'收取失败', description:e.message, variant:'destructive' }); }
  };

  const queryClient = useQueryClient();
  const currentTier = (gs.worldTier ?? 1) as WorldTier;

  const totalLevels = [
    gs.attackXp, gs.defenceXp, gs.hitpointsXp,
    gs.rangedXp ?? 0, gs.magicXp ?? 0,
    gs.woodcuttingXp, gs.miningXp, gs.smeltingXp,
    gs.fishingXp, gs.huntingXp, gs.thievingXp,
    gs.agilityXp ?? 0, gs.explorationXp ?? 0,
    gs.smithingXp, gs.leatherworkingXp, gs.jewelcraftingXp,
    gs.prayerXp ?? 0, gs.synthesisXp ?? 0,
  ].reduce((s, xp) => s + calcLevel(xp), 0);

  const switchTier = async (tier: WorldTier) => {
    try {
      const next = await postGame(api.game.setWorldTier.path, { tier });
      queryClient.setQueryData([api.game.getState.path], next);
      toast({ title: `切换至 ${WORLD_TIER_LABEL[tier]}` });
    } catch (e: any) {
      toast({ title: "切换失败", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-4 bg-card rounded-xl border border-border">
      <h1 className="text-xl font-bold flex items-center gap-2"><Map className="w-5 h-5 text-indigo-400" /> 探索</h1>

      {/* World Tier selector */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">世界层级</h2>
          <span className="text-xs text-muted-foreground ml-auto">总技能等级: {totalLevels}</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {([1,2,3,4] as WorldTier[]).map(tier => {
            const isActive = tier === currentTier;
            const req = TIER_UNLOCK_LEVELS[tier];
            const locked = req != null && totalLevels < req;
            const killed: number[] = JSON.parse(gs.tierBossKilled ?? '[]');
            const bossLocked = tier === 2 && !killed.includes(1) || tier === 3 && !killed.includes(2) || tier === 4 && !killed.includes(3);
            const canUse = tier <= currentTier || (!locked && !bossLocked);
            return (
              <button key={tier}
                onClick={() => canUse && switchTier(tier)}
                disabled={!canUse}
                className={`p-3 rounded-lg border text-xs transition-all ${
                  isActive
                    ? 'border-amber-400 bg-amber-500/10 text-amber-300 ring-1 ring-amber-400'
                    : canUse
                    ? 'border-border hover:border-amber-400/50 text-muted-foreground hover:text-foreground'
                    : 'border-border/30 text-muted-foreground/30 cursor-not-allowed'
                }`}
              >
                <div className="text-lg mb-1">{WORLD_TIER_LABEL[tier].split(' ')[0]}</div>
                <div className="font-semibold text-[11px]">{WORLD_TIER_LABEL[tier].split(' ').slice(1).join(' ')}</div>
                {locked && <div className="text-[9px] text-red-400 mt-1">需 {req} 级</div>}
                {bossLocked && <div className="text-[9px] text-red-400 mt-1">需击败Boss</div>}
                {isActive && (
                  <div className="mt-1 space-y-0.5 text-[9px] text-amber-400/70">
                    <div>敌人HP ×{TIER_HP_MUL[tier]}</div>
                    <div>攻击 ×{TIER_ATK_MUL[tier]}</div>
                    <div>物品等级 +{TIER_ILVL_BONUS[tier]}</div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setTab('explore')} className={`px-3 py-1 text-xs rounded border ${tab==='explore'?'bg-indigo-500/20 border-indigo-400':'border-border'}`}>探索区域</button>
        <button onClick={() => setTab('outposts')} className={`px-3 py-1 text-xs rounded border ${tab==='outposts'?'bg-indigo-500/20 border-indigo-400':'border-border'}`}>前哨站 ({outposts.length}/5)</button>
      </div>

      {tab === 'explore' && (
        <SkillPage
          skillKey="exploration"
          skillName="Exploration"
          skillXp={state.explorationXp ?? 0}
          icon={Map}
          iconColor="text-indigo-400"
          state={state}
          resources={RESOURCES}
        />
      )}

      {tab === 'outposts' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>前哨站: {outposts.length}/{currentTier} 槽位</span>
            {outposts.length > 0 && (
              <button onClick={collect} className="px-3 py-1 rounded bg-green-600 hover:bg-green-500 text-white text-xs">
                🎒 收取全部
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {outposts.map((o: any, i: number) => {
              const elapsed = Math.floor((Date.now() - (o.establishedAt ?? Date.now())) / 60000);
              const yield_ = Math.floor(elapsed * o.level * 2);
              const demolish = async () => {
                try {
                  const res = await fetch('/api/game/demolish-outpost', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ zoneIndex: o.zoneIndex }) });
                  const data = await res.json();
                  if (!res.ok) throw new Error(data.message || '拆除失败');
                  queryClient.setQueryData([api.game.getState.path], data);
                  toast({ title: '前哨站已拆除' });
                } catch(e:any) { toast({ title:'拆除失败', description:e.message, variant:'destructive' }); }
              };
              return (
                <div key={i} className="p-3 rounded-xl border border-green-500/30 bg-green-500/5 text-xs relative">
                  <div className="flex items-center gap-1 mb-1">
                    <Flag className="w-3 h-3 text-green-400" />
                    <span className="font-bold">{o.zoneName}</span>
                  </div>
                  <p className="text-muted-foreground">产出: {o.resource}</p>
                  <p className="text-muted-foreground">累积: {yield_} (Lv.{o.level})</p>
                  <p className="text-[10px] text-muted-foreground">{elapsed}分钟</p>
                  <button onClick={demolish} className="absolute top-1 right-1 text-[10px] text-red-400 hover:text-red-300">✕ 拆除</button>
                </div>
              );
            })}
          </div>
          {outposts.length < currentTier && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">建立新前哨站（消耗木材+石料）:</p>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1">
                {ZONES.slice(0, calcLevel(gs.explorationXp ?? 0)).map((name, i) => {
                  const hasOutpost = outposts.some((o:any) => o.zoneIndex === i);
                  const costWood = Math.floor(50 + i * 30);
                  const costStone = Math.floor(30 + i * 20);
                  return (
                    <button key={i} disabled={hasOutpost} onClick={() => establish(i)}
                      className={`p-1 text-[10px] rounded border ${hasOutpost ? 'border-green-400/30 bg-green-500/10 text-green-400' : 'border-border hover:border-indigo-400'}`}>
                      <div>{name}</div>
                      {!hasOutpost && <div className="text-[8px] text-muted-foreground">🪵{costWood} 🪨{costStone}</div>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
