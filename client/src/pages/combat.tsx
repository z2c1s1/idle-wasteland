import { useGameState, useStartAction, useEnterDungeon, useStartTower, useStartTrial, useChooseBuff, useEquipSkill } from "@/hooks/use-game";
import { parseDungeonStats } from "@/lib/game-utils";
import { ENEMIES, DUNGEONS, COMBAT_SKILLS, COMBAT_TRIANGLE, getCombatStyle, type BossSkillType } from "@shared/game-data";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useEffect, useRef, useState, useCallback } from "react";
import { Skull, Sword, Shield, Heart, Zap, Star, ChevronRight, Lock, Swords, Crosshair, Wand, Target } from "lucide-react";
import { EnemySprite } from "@/components/sprites";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { calculateLevel, formatNumber, parseEquipment, getPlayerAttack, getPlayerMaxHp, getPlayerDefence } from "@/lib/game-utils";
import { postGame } from "@/lib/api";
import { api } from "@shared/routes";
import { useQueryClient } from "@tanstack/react-query";

export default function Combat() {
  const { data: state } = useGameState();
  const startAction = useStartAction();
  const enterDungeon = useEnterDungeon();
  const startTower = useStartTower();
  const startTrial = useStartTrial();
  const chooseBuff = useChooseBuff();
  const equipSkill = useEquipSkill();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  if (!state) return null;
  const gs = state;

  const equipment = parseEquipment(gs.equipment);
  const baseId = (equipment.weapon as any)?.baseId ?? (equipment.weapon as any)?.baseType ?? '';
  const weaponStyle = baseId.includes('bow') || baseId.includes('rifle') || baseId.includes('shotgun') || baseId.includes('sniper') || baseId.includes('Bow') ? 'ranged' :
    baseId.includes('molotov') || baseId.includes('bomb') || baseId.includes('grenade') || baseId.includes('flamethrower') || baseId.includes('rpg') || baseId.includes('dynamite') ? 'magic' : 'melee';
  const [eqSkill, setEqSkill] = useState((gs as any).equippedSkill ?? '');

  const getHashTab = () => {
    if (window.location.hash === '#dungeons') return 'dungeons';
    if (window.location.hash === '#tower') return 'tower';
    if (window.location.hash === '#trial') return 'trial';
    return 'enemies';
  };
  const [activeTab, setActiveTabState] = useState(getHashTab());
  useEffect(() => {
    const onHash = () => setActiveTabState(getHashTab());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const combatLevel = calculateLevel(Math.max(gs.attackXp, gs.strengthXp, gs.rangedXp, gs.magicXp));

  // Slayer task
  const slayerTask = (() => { try { return JSON.parse((gs as any).slayerTask ?? 'null'); } catch { return null; } })();
  const slayerStreak = (gs as any).slayerStreak ?? 0;
  const slayerTarget = slayerTask ? ENEMIES[slayerTask.enemyIndex] : null;
  const getSlayer = async () => {
    try { const next = await postGame(api.game.getSlayerTask.path); queryClient.setQueryData([api.game.getState.path], next); toast({ title: '悬赏已发布' }); }
    catch (e: any) { toast({ title: '获取失败', description: e.message, variant: 'destructive' }); }
  };
  const completeSlayer = async () => {
    try { const next = await postGame(api.game.completeSlayerTask.path); queryClient.setQueryData([api.game.getState.path], next); toast({ title: `悬赏完成！` }); }
    catch (e: any) { toast({ title: '提交失败', description: e.message, variant: 'destructive' }); }
  };

  function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
    return (
      <div className="bg-card border border-border rounded-lg p-2 text-center">
        <Icon className={`w-4 h-4 mx-auto ${color}`} />
        <p className="text-[10px] text-muted-foreground">{label}</p>
        <p className={`text-sm font-bold ${color}`}>{value}</p>
      </div>
    );
  }

  function EnemyRow({ enemy, index }: { enemy: any; index: number }) {
    const [q, setQ] = useState(1);
    const style = getCombatStyle(enemy);
    const tri = (COMBAT_TRIANGLE as any)[weaponStyle];
    const isStrong = tri && style && tri.strongAgainst === style;
    const isWeak = tri && style && tri.weakTo === style;
    const isActive = gs.activeAction.startsWith(`combat_${index}_`);
    const qty = isActive ? (parseInt(gs.activeAction.split('_')[2]) || 1) : 1;
    const displayQ = isActive ? qty : q;
    const eMaxHp = (enemy as any).maxHp ?? 0;
    const curTotal = isActive && gs.enemyHp > 0 ? gs.enemyHp * displayQ : eMaxHp * displayQ;
    const fullUnits = Math.floor(curTotal / eMaxHp);
    const partialHp = curTotal % eMaxHp;

    return (
      <div className={`w-full rounded-lg border text-left ${isActive ? 'border-red-400 bg-red-500/5' : isStrong ? 'border-green-500/30 bg-green-500/5' : isWeak ? 'border-red-500/20 bg-red-500/5' : 'border-border'}`}>
        <button onClick={() => startAction.mutate(`combat_${index}_${q}`)}
          className="w-full px-2 pt-2 pb-1 hover:bg-muted/20 transition-colors rounded-t-lg">
          <div className="flex items-center gap-2 mb-1">
            <EnemySprite enemyId={enemy.id} size={36} />
            <span className="text-xs font-bold">{enemy.name} ×{displayQ}</span>
            <span className="text-[9px] text-muted-foreground">LV.{index+1}</span>
            {isStrong && <span className="text-[9px] text-green-400">克制</span>}
            {isWeak && <span className="text-[9px] text-red-400">被克</span>}
            {enemy.radLevel > 0 && <span className="text-[9px] text-yellow-400">☢{enemy.radLevel}</span>}
          </div>
          <div className="flex items-center gap-1">
            {Array.from({length: displayQ}).map((_,u) => (
              <span key={u} className="text-[10px] text-muted-foreground">
                {u < fullUnits ? '❤️' : u === fullUnits && partialHp > 0 ? '💛' : '🖤'}
              </span>
            ))}
          </div>
        </button>
        <div className="flex items-center justify-between px-2 pb-2">
          <div className="flex gap-1">
            <button onClick={(e) => { e.stopPropagation(); setQ(Math.max(1, q-1)); }}
              className="w-5 h-5 text-[10px] rounded bg-muted/20 hover:bg-muted/40">-</button>
            <span className="text-[10px] text-muted-foreground w-6 text-center">{q}</span>
            <button onClick={(e) => { e.stopPropagation(); setQ(Math.min(7, q+1)); }}
              className="w-5 h-5 text-[10px] rounded bg-muted/20 hover:bg-muted/40">+</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2"><Skull className="w-5 h-5 text-red-400" /> 废土战斗</h1>
          <p className="text-sm text-muted-foreground">战斗等级 {combatLevel} · 武器: {weaponStyle}</p>
        </div>
        <div className="flex gap-2">
          {!slayerTask && (
            <button onClick={getSlayer} className="px-3 py-1.5 text-xs rounded bg-purple-600 hover:bg-purple-500 text-white transition-colors flex items-center gap-1">
              <Target className="w-3 h-3" /> 悬赏任务
            </button>
          )}
          {slayerTask && slayerTask.killed >= slayerTask.qty && (
            <button onClick={completeSlayer} className="px-3 py-1.5 text-xs rounded bg-green-600 hover:bg-green-500 text-white transition-colors animate-pulse">
              提交悬赏
            </button>
          )}
        </div>
      </div>

      {slayerTask && (
        <div className="bg-purple-500/10 border border-purple-400/30 rounded-xl p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-bold text-purple-300">悬赏: {slayerTarget?.name ?? '???'}</span>
              <span className="text-xs text-muted-foreground">连杀 ×{slayerStreak}</span>
            </div>
            {!slayerTask.killed || slayerTask.killed < slayerTask.qty ? (
              <span className="text-xs text-purple-300">{slayerTask.killed ?? 0}/{slayerTask.qty} 击杀</span>
            ) : (
              <span className="text-xs text-green-400 font-bold">✓ 已完成</span>
            )}
          </div>
          <div className="h-2 bg-[hsl(220_13%_8%)] rounded overflow-hidden mt-2">
            <div className="h-full bg-purple-500 rounded transition-all" style={{ width: `${Math.min(100, ((slayerTask.killed ?? 0) / slayerTask.qty) * 100)}%` }} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatCard icon={Heart} label="生命" value={getPlayerMaxHp(gs)} color="text-red-400" />
        <StatCard icon={Sword} label="攻击" value={getPlayerAttack(gs)} color="text-orange-400" />
        <StatCard icon={Shield} label="防御" value={getPlayerDefence(gs)} color="text-blue-400" />
        <StatCard icon={Radiation} label="辐射抗性" value={combatLevel} color="text-yellow-400" />
      </div>

      {/* Active combat */}
      {(gs.activeAction.startsWith('combat') || gs.activeAction.startsWith('dungeon') || gs.activeAction.startsWith('tower') || gs.activeAction.startsWith('trial')) && (
        <div className="bg-card border border-red-500/30 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-muted-foreground">战斗中</span>
          </div>
        </div>
      )}

      {/* Tab bar */}
      <div className="flex gap-1 bg-[hsl(220_13%_8%)] rounded-lg p-1">
        {[
          { id: 'enemies', label: '废土生物' },
          { id: 'dungeons', label: '废墟探索' },
          { id: 'tower', label: '高塔攀登' },
          { id: 'trial', label: '辐射试炼' },
        ].map(tab => (
          <button key={tab.id} onClick={() => window.location.hash = tab.id}
            className={`flex-1 py-1.5 text-xs rounded-md font-medium transition-colors ${activeTab === tab.id ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'enemies' && (
        <div className="space-y-2">
          {ENEMIES.map((enemy, i) => <EnemyRow key={i} enemy={enemy} index={i} />)}
        </div>
      )}

      {activeTab === 'dungeons' && (
        <div className="space-y-2">
          {DUNGEONS.map((d, i) => {
            const stats = parseDungeonStats(gs.dungeonStats)[String(i)];
            const isActive = gs.activeAction.startsWith(`dungeon_${i}_`);
            return (
              <div key={i} className={`p-3 rounded-lg border ${isActive ? 'border-purple-400 bg-purple-500/5' : 'border-border'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold">{d.name}</p>
                    <p className="text-[10px] text-muted-foreground">{d.theme}</p>
                  </div>
                  <Button size="sm" disabled={isActive} onClick={() => enterDungeon.mutate(i)}
                    className="h-7 text-xs bg-purple-600 hover:bg-purple-500">
                    探索
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'tower' && (
        <div className="text-center py-8 space-y-3">
          <p className="text-3xl">🏢</p>
          <p className="text-sm font-bold">废弃摩天楼</p>
          <p className="text-xs text-muted-foreground">当前楼层: {gs.towerFloor ?? 0}</p>
          <Button onClick={() => startTower.mutate()} className="bg-red-600 hover:bg-red-500">攀登高塔</Button>
        </div>
      )}

      {activeTab === 'trial' && (
        <div className="text-center py-8 space-y-3">
          <p className="text-3xl">☢️</p>
          <p className="text-sm font-bold">辐射试炼</p>
          <p className="text-xs text-muted-foreground">钥匙: {(gs as any).trialKey ?? 0}</p>
          <Button onClick={() => startTrial.mutate()} disabled={(gs as any).trialKey < 1}
            className="bg-amber-600 hover:bg-amber-500 disabled:opacity-30">
            进入辐射区
          </Button>
        </div>
      )}
    </div>
  );
}
