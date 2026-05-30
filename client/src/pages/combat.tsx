import { useGameState, useStartAction, useEnterDungeon } from "@/hooks/use-game";
import { ENEMIES, DUNGEONS, ALL_SLOTS, RARITY_COLOR, ITEM_SETS, type GameItem } from "@shared/game-data";
import {
  calculateLevel, getCombatLevel, getPlayerMaxHp, getPlayerAttack,
  getPlayerDefence, parseEquipment, parseLootBag, formatNumber, levelProgress, getEquipmentStats,
} from "@/lib/game-utils";
import type { GameState } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useEffect, useRef, useState } from "react";
import { Skull, Sword, Shield, Heart, Zap, Star, ChevronRight, Lock, Swords } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

function HpBar({ current, max, label, color }: { current: number; max: number; label: string; color: string }) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (current / max) * 100)) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-medium">
        <span className="text-muted-foreground">{label}</span>
        <span>{formatNumber(current)} / {formatNumber(max)}</span>
      </div>
      <div className="h-3 bg-muted/30 rounded-full overflow-hidden border border-border">
        <div className={`h-full rounded-full transition-all duration-300 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function StatBox({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; color: string;
}) {
  return (
    <div className="bg-card/50 border border-border rounded-lg px-3 py-2 flex items-center gap-2">
      <Icon className={`w-4 h-4 flex-shrink-0 ${color}`} />
      <div>
        <p className="text-xs text-muted-foreground leading-none">{label}</p>
        <p className="text-sm font-bold mt-0.5">{value}</p>
        {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );
}

function CombatTimer({ actionUpdatedAt, speed }: { actionUpdatedAt: string; speed: number }) {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);
  const startMs = new Date(actionUpdatedAt).getTime();

  useEffect(() => {
    const tick = () => {
      const elapsed = (Date.now() - startMs) % (speed * 1000);
      setProgress((elapsed / (speed * 1000)) * 100);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [startMs, speed]);

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>下次攻击</span>
        <span>{speed}s</span>
      </div>
      <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full transition-none" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

export default function Combat() {
  const { data: state }   = useGameState();
  const startAction       = useStartAction();
  const enterDungeon      = useEnterDungeon();
  const { toast }         = useToast();
  const [activeTab, setActiveTab] = useState<'enemies' | 'dungeons'>('enemies');

  if (!state) return null;
  const gs = state as GameState;

  const combatLevel  = getCombatLevel(gs);
  const playerMaxHp  = getPlayerMaxHp(gs);
  const currentHp    = gs.playerHp < 0 ? playerMaxHp : gs.playerHp;
  const playerAtk    = getPlayerAttack(gs);
  const playerDef    = getPlayerDefence(gs);
  const eqStats      = getEquipmentStats(gs);
  const equipment    = parseEquipment(gs.equipment);
  const lootBag      = parseLootBag(gs.lootBag);

  const isCombat      = gs.activeAction.startsWith("combat_");
  const isDungeon     = gs.activeAction.startsWith("dungeon_");
  const activeIdx     = isCombat ? parseInt(gs.activeAction.split("_")[1]) : -1;
  const activeDungIdx = isDungeon ? parseInt(gs.activeAction.split("_")[1]) : -1;
  const activeEnemy   = activeIdx >= 0 ? ENEMIES[activeIdx] : null;
  const activeDungeon = activeDungIdx >= 0 ? DUNGEONS[activeDungIdx] : null;
  const currentEnemyHp = activeEnemy ? (gs.enemyHp < 0 ? activeEnemy.maxHp : gs.enemyHp) : 0;
  const currentBossHp  = activeDungeon ? (gs.enemyHp < 0 ? activeDungeon.boss.maxHp : gs.enemyHp) : 0;

  const attackLevel    = calculateLevel(gs.attackXp);
  const defenceLevel   = calculateLevel(gs.defenceXp);
  const hitpointsLevel = calculateLevel(gs.hitpointsXp);

  function handleEnterDungeon(index: number) {
    enterDungeon.mutate(index, {
      onError: (err) => toast({ title: "无法进入副本", description: err.message, variant: "destructive" }),
    });
  }

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Skull className="w-5 h-5 text-red-400" /> 战斗
          </h1>
          <p className="text-sm text-muted-foreground">战斗等级 {combatLevel}</p>
        </div>
        {lootBag.length > 0 && (
          <Link href="/inventory">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-yellow-500/40 bg-yellow-500/10 text-yellow-400 text-xs font-medium cursor-pointer hover:bg-yellow-500/20 transition-colors">
              <Star className="w-3.5 h-3.5" />
              {lootBag.length} 件新物品
              <ChevronRight className="w-3 h-3" />
            </div>
          </Link>
        )}
      </div>

      {/* Player Stats */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">玩家属性</h2>
        <HpBar current={currentHp} max={playerMaxHp} label="生命值" color="bg-green-500" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <StatBox icon={Sword}  label="攻击"     value={playerAtk}  color="text-red-400" sub={eqStats.attackBonus > 0 ? `+${eqStats.attackBonus} 装备` : undefined} />
          <StatBox icon={Shield} label="防御"     value={playerDef}  color="text-blue-400" sub={eqStats.defenceBonus > 0 ? `+${eqStats.defenceBonus} 装备` : undefined} />
          <StatBox icon={Heart}  label="最大生命" value={playerMaxHp} color="text-green-400" sub={eqStats.hpBonus > 0 ? `+${eqStats.hpBonus} 装备` : undefined} />
          <StatBox icon={Zap}    label="暴击"     value={`${eqStats.critRating.toFixed(1)}%`} color="text-yellow-400"
            sub={eqStats.critRating > 0 ? "+50% 额外伤害" : "无暴击"} />
        </div>

        {/* Advanced stats */}
        {(eqStats.enhancedDamage > 0 || eqStats.crushingBlow > 0 || eqStats.magicFind > 0 ||
          eqStats.lifeOnKill > 0 || eqStats.lifeRegen > 0 || eqStats.goldBonus > 0 ||
          eqStats.resistAll > 0 || eqStats.lifeLeech > 0 || eqStats.deadlyStrike > 0 ||
          eqStats.attackSpeed > 0 || eqStats.reflectDamage > 0) && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 bg-muted/15 rounded-lg px-3 py-2 text-xs border border-border/40">
            {eqStats.enhancedDamage > 0 && <span className="text-orange-300">🔥 +{eqStats.enhancedDamage}% 强化伤害</span>}
            {eqStats.crushingBlow   > 0 && <span className="text-red-400">💥 {eqStats.crushingBlow}% 重击</span>}
            {eqStats.lifeOnKill     > 0 && <span className="text-pink-300">💗 +{eqStats.lifeOnKill} 击杀回血</span>}
            {eqStats.lifeRegen      > 0 && <span className="text-emerald-300">🌿 +{eqStats.lifeRegen}/回合 回复</span>}
            {eqStats.magicFind      > 0 && <span className="text-purple-300">✨ +{eqStats.magicFind}% 魔法发现</span>}
            {eqStats.goldBonus      > 0 && <span className="text-yellow-400">💰 +{eqStats.goldBonus}% 金币</span>}
            {eqStats.resistAll      > 0 && <span className="text-cyan-300">🔵 -{eqStats.resistAll} 受伤</span>}
            {eqStats.lifeLeech      > 0 && <span className="text-rose-300">🩸 {eqStats.lifeLeech}% 吸血</span>}
            {eqStats.deadlyStrike   > 0 && <span className="text-amber-300">⚡ {eqStats.deadlyStrike}% 致命一击</span>}
            {eqStats.attackSpeed    > 0 && <span className="text-sky-300">⚡ +{eqStats.attackSpeed}% 攻速</span>}
            {eqStats.reflectDamage  > 0 && <span className="text-lime-300">🌵 {eqStats.reflectDamage} 反伤</span>}
          </div>
        )}

        {/* Active set bonuses */}
        {eqStats.activeSets && Object.entries(eqStats.activeSets).some(([, c]) => c >= 2) && (
          <div className="bg-teal-500/8 border border-teal-400/30 rounded-lg px-3 py-2 space-y-1">
            <div className="text-[10px] text-teal-400 uppercase tracking-wider font-semibold">激活套装</div>
            {Object.entries(eqStats.activeSets).filter(([, c]) => c >= 2).map(([setId, count]) => {
              const setDef = ITEM_SETS.find(s => s.id === setId);
              if (!setDef) return null;
              return (
                <div key={setId} className="space-y-0.5">
                  <div className="text-xs text-teal-300 font-medium">{setDef.name} ({count}/{setDef.pieces.length})</div>
                  {setDef.bonuses.filter(b => count >= b.count).map((b, i) => (
                    <div key={i} className="text-[10px] text-teal-200/70">✦ {b.count}件: {b.description}</div>
                  ))}
                  {setDef.bonuses.filter(b => count < b.count).map((b, i) => (
                    <div key={i} className="text-[10px] text-muted-foreground/40">◇ {b.count}件: {b.description}</div>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {/* Skill XP */}
        <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border">
          {[
            { label: "攻击", xp: gs.attackXp,    lv: attackLevel    },
            { label: "防御", xp: gs.defenceXp,   lv: defenceLevel   },
            { label: "生命", xp: gs.hitpointsXp, lv: hitpointsLevel },
          ].map(({ label, xp, lv }) => (
            <div key={label} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-bold">{lv} 级</span>
              </div>
              <Progress value={levelProgress(xp)} className="h-1" />
              <p className="text-[10px] text-muted-foreground">{formatNumber(xp)} 经验</p>
            </div>
          ))}
        </div>

        {/* Equipped gear summary */}
        {ALL_SLOTS.some(s => equipment[s]) && (
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border">
            {ALL_SLOTS.map(slot => {
              const item = (equipment[slot] as GameItem | undefined) ?? null;
              if (!item) return null;
              return (
                <div key={slot} className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] border ${RARITY_COLOR[item.rarity]} border-current/30 bg-current/5`}>
                  <span>{item.emoji}</span>
                  <span>{item.name.split(' ').slice(-1)[0]}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Active combat — normal enemy */}
      {isCombat && activeEnemy && (
        <div className="bg-card border border-red-500/30 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold flex items-center gap-2 text-red-300">
              <span className="text-3xl">{activeEnemy.emoji}</span>
              战斗中：{activeEnemy.name}
            </h2>
            <Button variant="outline" size="sm" onClick={() => startAction.mutate("idle")} data-testid="button-stop-combat">
              逃跑
            </Button>
          </div>
          <HpBar current={currentEnemyHp} max={activeEnemy.maxHp} label="敌人生命" color="bg-red-500" />
          <CombatTimer actionUpdatedAt={gs.actionUpdatedAt as unknown as string} speed={3} />
          <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground">
            <div><span className="text-foreground font-medium">敌人攻击：</span>{activeEnemy.attack}</div>
            <div><span className="text-foreground font-medium">敌人防御：</span>{activeEnemy.defence}</div>
            <div><span className="text-foreground font-medium">我方伤害：</span>{Math.max(1, playerAtk - activeEnemy.defence)}/3s</div>
            <div><span className="text-foreground font-medium">掉落率：</span>{Math.round((0.15 + ENEMIES.indexOf(activeEnemy) * 0.02) * 100)}%</div>
          </div>
        </div>
      )}

      {/* Active dungeon combat */}
      {isDungeon && activeDungeon && (
        <div className="bg-card border border-purple-500/40 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{activeDungeon.emoji}</span>
              <div>
                <h2 className="font-bold text-purple-300">{activeDungeon.name} — Boss 战</h2>
                <p className="text-xs text-muted-foreground">击败 Boss 以获得专属传奇装备</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => startAction.mutate("idle")} data-testid="button-escape-dungeon">
              撤退
            </Button>
          </div>
          <div className="bg-purple-500/10 border border-purple-400/30 rounded-lg p-3 space-y-3">
            <div className="flex items-center gap-2 text-purple-200 font-semibold">
              <span className="text-2xl">{activeDungeon.boss.emoji}</span>
              <span>{activeDungeon.boss.name}</span>
              <span className="ml-auto text-xs px-2 py-0.5 rounded border border-purple-400/40 bg-purple-500/20 text-purple-300">BOSS</span>
            </div>
            <HpBar current={currentBossHp} max={activeDungeon.boss.maxHp} label="Boss 生命" color="bg-purple-500" />
            <CombatTimer actionUpdatedAt={gs.actionUpdatedAt as unknown as string} speed={3} />
            <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
              <div><span className="text-foreground font-medium">Boss 攻击：</span>{activeDungeon.boss.attack}</div>
              <div><span className="text-foreground font-medium">Boss 防御：</span>{activeDungeon.boss.defence}</div>
              <div><span className="text-foreground font-medium">我方伤害：</span>{Math.max(1, playerAtk - activeDungeon.boss.defence)}/3s</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[11px] text-muted-foreground">专属掉落：</span>
            {activeDungeon.uniqueDropIds.map(uid => (
              <span key={uid} className="text-[11px] px-1.5 py-0.5 rounded border border-orange-400/40 text-orange-300 bg-orange-400/10">✦ 传奇</span>
            ))}
            <span className="text-[11px] text-purple-300">掉率 {Math.round(activeDungeon.dropChance * 100)}%</span>
          </div>
        </div>
      )}

      {/* Tab switcher */}
      <div className="flex gap-1 bg-muted/20 rounded-lg p-1">
        <button
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'enemies' ? 'bg-card shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('enemies')}
          data-testid="tab-enemies"
        >
          <Swords className="w-4 h-4" /> 普通战斗
        </button>
        <button
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'dungeons' ? 'bg-card shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('dungeons')}
          data-testid="tab-dungeons"
        >
          <Skull className="w-4 h-4" /> 副本挑战
        </button>
      </div>

      {/* Enemy list */}
      {activeTab === 'enemies' && (
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">选择敌人</h2>
          <div className="space-y-2">
            {ENEMIES.map((enemy, index) => {
              const locked    = combatLevel < enemy.reqCombatLevel;
              const isActive  = activeIdx === index;
              const dmgToUs   = Math.max(0, enemy.attack - playerDef);
              const dmgToThem = Math.max(1, playerAtk - enemy.defence);

              return (
                <div key={enemy.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    locked   ? "border-border bg-muted/10 opacity-50" :
                    isActive ? "border-red-400/50 bg-red-500/10" :
                               "border-border bg-card hover:border-primary/40"
                  }`}
                  data-testid={`enemy-row-${enemy.id}`}>
                  <span className="text-2xl">{enemy.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{enemy.name}</span>
                      <span className="text-[10px] text-yellow-500 border border-yellow-500/30 px-1 rounded">物品等级 {index * 7 + 1}-{index * 7 + 6}</span>
                      {locked && <span className="text-xs text-muted-foreground">（战斗 {enemy.reqCombatLevel}）</span>}
                      {!locked && dmgToUs > currentHp && <span className="text-xs text-red-400 font-medium">⚠ 致命</span>}
                    </div>
                    <div className="text-xs text-muted-foreground flex gap-3 mt-0.5 flex-wrap">
                      <span>生命 {enemy.maxHp}</span>
                      <span>攻击 {enemy.attack}</span>
                      <span>防御 {enemy.defence}</span>
                      <span className="text-yellow-500">{enemy.xp} 经验/击杀</span>
                      <span>💰 {enemy.drops.gold[0]}+ 金币</span>
                      {enemy.drops.dragonBones && <span className="text-purple-400">🐲 龙骨</span>}
                    </div>
                    <div className="text-xs mt-0.5 flex gap-3">
                      <span className="text-green-400">⚔ {dmgToThem}/每击</span>
                      {dmgToUs > 0 ? <span className="text-red-400">💔 {dmgToUs}/每击</span> : <span className="text-blue-400">🛡 无法受伤</span>}
                      <span className="text-yellow-400">📦 {Math.round((0.15 + index * 0.02) * 100)}% 掉落</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {isActive ? (
                      <Button size="sm" variant="destructive" onClick={() => startAction.mutate("idle")} data-testid={`button-stop-${enemy.id}`}>逃跑</Button>
                    ) : (
                      <Button size="sm" disabled={locked} onClick={() => startAction.mutate(`combat_${index}`)} data-testid={`button-fight-${enemy.id}`}>
                        {locked ? `${enemy.reqCombatLevel}级` : "战斗"}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Dungeon list */}
      {activeTab === 'dungeons' && (
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">选择副本</h2>
          <p className="text-xs text-muted-foreground mb-3">每个副本含 1 个强力 Boss，击杀后有概率掉落专属传奇装备</p>
          <div className="space-y-3">
            {DUNGEONS.map((dungeon, index) => {
              const locked     = combatLevel < dungeon.reqCombatLevel;
              const isActive   = activeDungIdx === index;
              const canAfford  = gs.gold >= dungeon.cost.gold
                && gs.bones >= (dungeon.cost.bones ?? 0)
                && gs.dragonBones >= (dungeon.cost.dragonBones ?? 0);
              const busy       = isCombat || isDungeon;
              const canEnter   = !locked && canAfford && !busy;

              return (
                <div key={dungeon.id}
                  className={`p-4 rounded-xl border transition-colors ${
                    isActive   ? "border-purple-400/60 bg-purple-500/10" :
                    locked     ? "border-border bg-muted/10 opacity-60" :
                    !canAfford ? "border-border bg-card opacity-75" :
                                 "border-border bg-card hover:border-purple-400/40"
                  }`}
                  data-testid={`dungeon-card-${dungeon.id}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl mt-0.5">{dungeon.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-bold text-base">{dungeon.name}</span>
                        {locked && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground border border-border px-1.5 py-0.5 rounded">
                            <Lock className="w-3 h-3" /> 战斗 {dungeon.reqCombatLevel} 解锁
                          </span>
                        )}
                        {isActive && (
                          <span className="text-xs text-purple-300 border border-purple-400/40 bg-purple-500/15 px-1.5 py-0.5 rounded font-medium">
                            挑战中
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2 leading-relaxed">{dungeon.theme}</p>

                      {/* Boss info */}
                      <div className="flex items-center gap-3 text-xs mb-2 flex-wrap">
                        <span className="font-medium text-purple-200">{dungeon.boss.emoji} {dungeon.boss.name}</span>
                        <span className="text-muted-foreground">生命 {formatNumber(dungeon.boss.maxHp)}</span>
                        <span className="text-red-400">攻击 {dungeon.boss.attack}</span>
                        <span className="text-blue-400">防御 {dungeon.boss.defence}</span>
                        <span className="text-yellow-400">💰 {formatNumber(dungeon.boss.xp * 2)} 金币奖励</span>
                        <span className="text-green-300">⚔ {dungeon.boss.xp} 经验</span>
                      </div>

                      {/* Drop preview */}
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-[11px] text-muted-foreground">专属传奇：</span>
                        {dungeon.uniqueDropIds.map(uid => (
                          <span key={uid} className="text-[11px] px-1.5 py-0.5 rounded border border-orange-400/40 text-orange-300 bg-orange-400/8 font-medium">
                            ✦ 传奇物品
                          </span>
                        ))}
                        <span className="text-[11px] text-purple-300">{Math.round(dungeon.dropChance * 100)}% 掉率</span>
                      </div>

                      {/* Entry cost */}
                      <div className="flex items-center gap-3 text-xs flex-wrap">
                        <span className="text-muted-foreground">入场消耗：</span>
                        <span className={gs.gold < dungeon.cost.gold ? "text-red-400" : "text-yellow-400"}>
                          💰 {formatNumber(dungeon.cost.gold)} 金币
                        </span>
                        {dungeon.cost.bones && (
                          <span className={gs.bones < dungeon.cost.bones ? "text-red-400" : "text-foreground"}>
                            🦴 {dungeon.cost.bones} 骨头
                          </span>
                        )}
                        {dungeon.cost.dragonBones && (
                          <span className={gs.dragonBones < dungeon.cost.dragonBones ? "text-red-400" : "text-purple-300"}>
                            🐲 {dungeon.cost.dragonBones} 龙骨
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      {isActive ? (
                        <Button size="sm" variant="outline" onClick={() => startAction.mutate("idle")} data-testid={`button-escape-${dungeon.id}`}>
                          撤退
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          disabled={locked || !canEnter || enterDungeon.isPending}
                          variant={canEnter ? "default" : "outline"}
                          onClick={() => handleEnterDungeon(index)}
                          data-testid={`button-enter-dungeon-${dungeon.id}`}
                          className={canEnter ? "bg-purple-600 hover:bg-purple-700 text-white" : ""}
                        >
                          {locked ? `${dungeon.reqCombatLevel}级` : !canAfford ? "资源不足" : busy ? "战斗中" : "进入"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Drops summary */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">战斗战利品</h2>
        <div className="flex gap-4 text-sm flex-wrap">
          <span>💰 <span className="font-bold text-yellow-400">{formatNumber(gs.gold)}</span> 金币</span>
          <span>🦴 <span className="font-bold">{formatNumber(gs.bones)}</span> 骨头</span>
          {gs.dragonBones > 0 && <span>🐲 <span className="font-bold text-purple-400">{formatNumber(gs.dragonBones)}</span> 龙骨</span>}
        </div>
        {lootBag.length > 0 && (
          <Link href="/inventory">
            <div className="mt-3 flex items-center gap-2 text-sm text-yellow-400 hover:text-yellow-300 cursor-pointer">
              <Star className="w-4 h-4" />
              <span>{lootBag.length} 件物品待收取</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
