import { useGameState, useStartAction, useEnterDungeon, useStartTower, useStartTrial } from "@/hooks/use-game";
import { parseDungeonStats } from "@/lib/game-utils";
import { ENEMIES, DUNGEONS, COMBAT_TRIANGLE, getCombatStyle, COMBAT_GEM_POOLS, getDropChance } from "@shared/game-data";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import type { GameState } from "@shared/schema";
import { Skull, Sword, Shield, Heart, Target, Building2 } from "lucide-react";
import { EnemySprite, RadiationIcon } from "@/components/sprites";
import { useToast } from "@/hooks/use-toast";
import { useUIText, useLanguage } from "@/lib/i18n";
import { calculateLevel, formatNumber, parseEquipment, getPlayerAttack, getPlayerMaxHp, getPlayerDefence, getTemperatureMultiplier, getEquipmentStats } from "@/lib/game-utils";
import { getEquipmentBonuses } from "@shared/game-data";
import { postGame, getPlayerId } from "@/lib/api";
import { api } from "@shared/routes";
import { computeEffectiveCombatSpeed } from "@shared/game-math";
import { useQueryClient } from "@tanstack/react-query";

/** Pick localized name: prefer nameEn when lang is English */
function lname(obj: { name: string; nameEn?: string }, lang: string): string {
  return lang === "en" && obj.nameEn ? obj.nameEn : obj.name;
}

// ═══════════════════════ ActiveCombat ═══════════════════════════════════════════

function ActiveCombat({ gs, onStop, queryClient }: { gs: GameState; onStop: () => void; queryClient: any }) {
  const t = useUIText();
  const { lang } = useLanguage();
  const [elapsed, setElapsed] = useState(0);
  const startMs = new Date(gs.actionUpdatedAt as unknown as string).getTime();
  const lastSyncRef = useRef(0);
  const prevStartRef = useRef(startMs);

  // Match server's attack speed calculation via same functions
  const equipment = parseEquipment(gs.equipment);
  const { attackSpeed: playerAS } = getEquipmentBonuses(equipment);
  const tempMul = getTemperatureMultiplier(gs);

  let enemySpeedBonus = 0;
  try {
    if (gs.activeAction.startsWith('combat_')) {
      const idx = parseInt(gs.activeAction.split('_')[1]!);
      const e = ENEMIES[idx];
      if (e?.attackSpeed) enemySpeedBonus = (e as any).attackSpeed;
    }
  } catch {}
  const cycleTime = computeEffectiveCombatSpeed(playerAS - enemySpeedBonus, tempMul);

  // RAF-driven elapsed timer + reset sync counter on server tick
  useEffect(() => {
    if (startMs !== prevStartRef.current) {
      prevStartRef.current = startMs;
      lastSyncRef.current = 0;
    }
    let raf: number;
    function tick() { setElapsed((Date.now() - startMs) / 1000); raf = requestAnimationFrame(tick); }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [startMs]);

  const progress = (elapsed % cycleTime) / cycleTime * 100;
  const hits = Math.floor(elapsed / cycleTime);

  // Sync on each completed attack cycle
  useEffect(() => {
    if (hits > lastSyncRef.current) {
      lastSyncRef.current = hits;
      fetch(api.game.getState.path, { headers: { "x-player-id": getPlayerId() } })
        .then(r => r.ok && r.json().then(d => queryClient.setQueryData([api.game.getState.path], d)))
        .catch(() => {});
    }
  }, [hits, queryClient]);

  // ═══ Predict HP (world tier scaling) ═══
  const worldTier = (gs as any).worldTier ?? 1;
  const tierHpMul = worldTier === 2 ? 2 : worldTier === 3 ? 4 : worldTier === 4 ? 8 : 1;
  const tierAtkMul = worldTier === 2 ? 1.5 : worldTier === 3 ? 2.5 : worldTier === 4 ? 4 : 1;
  const playerAtk = getPlayerAttack(gs);
  const playerDef = getPlayerDefence(gs);

  const isNormalCombat = gs.activeAction.startsWith('combat_');
  const playerMax = getPlayerMaxHp(gs);
  let enemyMaxHp = 100;
  let predEnemyHp = 100;
  let predPlayerHp = playerMax;

  if (isNormalCombat) {
    const idx = parseInt(gs.activeAction.split('_')[1]!);
    const e = ENEMIES[idx] ?? { maxHp: 12, attack: 1, defence: 0 };
    enemyMaxHp = Math.floor(e.maxHp * tierHpMul);
    const dmg = Math.max(1, playerAtk - (e.defence ?? 0));
    const enemyAtk = Math.floor((e.attack ?? 1) * tierAtkMul);
    const incoming = Math.max(0, enemyAtk - playerDef);
    predEnemyHp = Math.max(0, enemyMaxHp - dmg * hits);
    predPlayerHp = Math.max(0, playerMax - incoming * hits);
  }
  // For dungeon/tower/trial: don't fake predict — prefer server HP
  const showE = gs.enemyHp >= 0 ? gs.enemyHp : (isNormalCombat ? predEnemyHp : enemyMaxHp);
  const showP = gs.playerHp >= 0 ? gs.playerHp : (isNormalCombat ? predPlayerHp : playerMax);

  // Enemy name
  const action = gs.activeAction;
  let ename: string = t.combat.enemyLabel;
  if (action.startsWith('combat_')) { const e = ENEMIES[parseInt(action.split('_')[1]!)]; if (e) ename = lname(e, lang); }
  else if (action.startsWith('dungeon_')) { const d = DUNGEONS[parseInt(action.split('_')[1]!)]; if (d) ename = lname(d, lang); }
  else if (action.startsWith('tower')) ename = t.combat.towerFloorActive(gs.towerFloor || 0);
  else if (action.startsWith('trial_')) ename = t.combat.trialWaveActive((parseInt(action.split('_')[1]!) || 0) + 1);

  const lbl = action.startsWith('dungeon_') ? t.combat.dungeonStatus : action.startsWith('tower') ? t.combat.towerStatus : action.startsWith('trial_') ? t.combat.trialStatus : t.combat.fighting;

  return (
    <div className="bg-card border border-red-500/30 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-sm font-semibold text-red-300">{lbl}</span>
        </div>
        <button onClick={onStop} className="px-3 py-1 text-xs font-semibold bg-red-600 hover:bg-red-500 text-white rounded">{t.combat.stop}</button>
      </div>

      {/* Combat reward summary */}
      <div className="flex gap-3 text-[10px] text-muted-foreground">
        <span>💰 {formatNumber(gs.gold)}</span>
        <span>{t.combat.xpLabel}</span>
        <span>{t.combat.lootLabel((() => { try { return JSON.parse(gs.lootBag ?? "[]").length; } catch { return 0; } })())}</span>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-[10px] text-muted-foreground"><span>{t.combat.attackInterval}</span><span>{elapsed.toFixed(1)}s / {cycleTime.toFixed(1)}s</span></div>
        <div className="h-3 bg-muted/30 rounded-full overflow-hidden border border-border">
          <div className="h-full bg-red-500 rounded-full transition-none" style={{ width: `${Math.min(100, progress)}%` }} />
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-[10px]"><span>👹 {ename}</span><span className="text-muted-foreground">{showE} / {enemyMaxHp}</span></div>
        <div className="h-3 bg-muted/30 rounded-full overflow-hidden border border-border">
          <div className="h-full rounded-full transition-all duration-200" style={{ width: `${Math.max(0,Math.min(100,(showE/Math.max(1,enemyMaxHp))*100))}%`, background: showE > enemyMaxHp*0.3 ? '#dc2626' : '#fbbf24' }} />
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-[10px]"><span>{t.combat.health}</span><span className={showP < playerMax*0.3 ? 'text-red-400 font-bold' : 'text-muted-foreground'}>{showP} / {playerMax}</span></div>
        <div className="h-3 bg-muted/30 rounded-full overflow-hidden border border-border">
          <div className="h-full rounded-full transition-all duration-200" style={{ width: `${Math.max(0,Math.min(100,(showP/Math.max(1,playerMax))*100))}%`, background: showP > playerMax*0.5 ? '#22c55e' : showP > playerMax*0.25 ? '#eab308' : '#ef4444' }} />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════ EnemyCard (separate component for hook rules) ═════════

function EnemyCard({ enemy, index, gs, combatLevel, weaponStyle, isFighting, startAction, toast, hasWeapon }: {
  enemy: any; index: number; gs: GameState; combatLevel: number; weaponStyle: string;
  isFighting: boolean; startAction: any; toast: any; hasWeapon: boolean;
}) {
  const t = useUIText();
  const { lang } = useLanguage();
  const [qty, setQty] = useState(1);
  const isActive = gs.activeAction === `combat_${index}_1` || gs.activeAction.startsWith(`combat_${index}_`);
  const tri = (COMBAT_TRIANGLE as any)[weaponStyle];
  const style = getCombatStyle(enemy);
  const locked = combatLevel < enemy.reqCombatLevel;

  return (
    <div className={`rounded-lg border p-3 ${isActive ? 'border-red-400 bg-red-500/5' : tri?.strongAgainst === style ? 'border-green-500/30 bg-green-500/5' : tri?.weakTo === style ? 'border-red-500/20 bg-red-500/5' : 'border-border'}`}>
      <div className="flex items-center gap-3">
        <EnemySprite enemyId={enemy.id} size={40} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold">{lname(enemy, lang)}</span>
            <span className="text-[10px] text-muted-foreground">LV.{enemy.reqCombatLevel}</span>
            {tri?.strongAgainst === style && <span className="text-[9px] text-green-400">{t.combat.strongAgainst}</span>}
            {tri?.weakTo === style && <span className="text-[9px] text-red-400">{t.combat.weakTo}</span>}
          </div>
          <div className="flex gap-2 text-[10px] text-muted-foreground mt-0.5">
            <span>❤️ {enemy.maxHp}</span><span>⚔️ {enemy.attack}</span><span>⭐ {enemy.xp}XP</span><span>💰 {enemy.drops.gold[0]}-{enemy.drops.gold[1]}G</span>
            {enemy.drops.bones && <span>🦴 {t.combat.bones}</span>}
            {enemy.drops.dragonBones && <span>🐉 {t.combat.dragonBones}</span>}
          </div>
          <div className="flex gap-x-2 gap-y-0 text-[10px] text-muted-foreground/60 mt-1 flex-wrap">
            <span>宝石 {(COMBAT_GEM_POOLS[Math.min(index, COMBAT_GEM_POOLS.length - 1)]?.chance ?? 0) * 100}%</span>
            <span>装备 {(getDropChance(index) * 100).toFixed(1)}%</span>
            {enemy.drops.bones ? <span>骨头 ×{enemy.drops.bones} 100%</span> : null}
            {enemy.drops.dragonBones ? <span>龙骨 ×{enemy.drops.dragonBones} 100%</span> : null}
          </div>
          {locked && <p className="text-[9px] text-red-400/70">{t.combat.reqLevel(enemy.reqCombatLevel)}</p>}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {isActive ? (
            <button onClick={() => startAction.mutate("idle", { onError: (e: any) => toast({ title: t.combat.stopFailed, description: e.message, variant: "destructive" }) })}
              className="px-3 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-500 text-white rounded">{t.combat.stopButton}</button>
          ) : (
            <>
              <button onClick={(e) => { e.stopPropagation(); setQty(Math.max(1, qty-1)); }} className="w-6 h-6 text-xs rounded bg-muted/30 hover:bg-muted/50">-</button>
              <span className="text-xs w-6 text-center">{qty}</span>
              <button onClick={(e) => { e.stopPropagation(); setQty(Math.min(7, qty+1)); }} className="w-6 h-6 text-xs rounded bg-muted/30 hover:bg-muted/50">+</button>
              <button onClick={() => startAction.mutate(`combat_${index}_${qty}`, { onError: (e: any) => toast({ title: t.combat.cannotFight, description: e.message, variant: "destructive" }) })}
                disabled={locked || isFighting || !hasWeapon} className="ml-1 px-3 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-500 text-white rounded disabled:opacity-40">{t.combat.attackButton}</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════ Combat Page ══════════════════════════════════════════

export default function Combat() {
  const t = useUIText();
  const { data: state } = useGameState();
  const startAction = useStartAction();
  const enterDungeon = useEnterDungeon();
  const startTower = useStartTower();
  const startTrial = useStartTrial();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  if (!state) return null;
  const gs = state;

  const equipment = parseEquipment(gs.equipment);
  const baseId = (equipment.weapon as any)?.baseId ?? (equipment.weapon as any)?.baseType ?? '';
  const weaponStyle = baseId.includes('bow') || baseId.includes('rifle') ? 'ranged' : baseId.includes('staff') || baseId.includes('wand') || baseId.includes('codex') ? 'magic' : 'melee';

  const [activeTab, setActiveTabState] = useState(() => {
    if (window.location.hash === '#dungeons') return 'dungeons';
    if (window.location.hash === '#tower') return 'tower';
    if (window.location.hash === '#trial') return 'trial';
    return 'enemies';
  });
  useEffect(() => {
    const onHash = () => setActiveTabState(window.location.hash === '#dungeons' ? 'dungeons' : window.location.hash === '#tower' ? 'tower' : window.location.hash === '#trial' ? 'trial' : 'enemies');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const combatLevel = calculateLevel(Math.max(gs.attackXp, gs.strengthXp, gs.rangedXp, gs.magicXp));
  const isFighting = gs.activeAction.startsWith('combat_') || gs.activeAction.startsWith('dungeon_') || gs.activeAction.startsWith('tower') || gs.activeAction.startsWith('trial_');
  const hasWeapon = !!equipment.weapon;
  const equipStats = getEquipmentStats(gs);

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-4 bg-card rounded-xl border border-border">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2"><Skull className="w-5 h-5 text-red-400" />{t.combat.title}</h1>
          <p className="text-sm text-muted-foreground">
            {hasWeapon
              ? t.combat.pageSubtitle(combatLevel, weaponStyle)
              : <span>战斗等级 {combatLevel} · <span className="text-red-400">武器: 无 — 请先打造装备</span></span>
            }
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatCard icon={Heart} label={t.combat.statLife} value={gs.playerHp < 0 ? getPlayerMaxHp(gs) : gs.playerHp} max={getPlayerMaxHp(gs)} color="text-red-400" />
        <StatCard icon={Sword} label={t.combat.statAttack} value={getPlayerAttack(gs)} color="text-orange-400" />
        <StatCard icon={Shield} label={t.combat.statDefence} value={getPlayerDefence(gs)} color="text-blue-400" />
        <StatCard icon={RadiationIcon} label={t.combat.statCombatLevel} value={combatLevel} color="text-yellow-400" />
      </div>

      {/* Extended stats */}
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-1.5">
        {[
          { label: "暴击率", value: `${(equipStats.critRating ?? 0).toFixed(1)}%`, color: "text-yellow-300" },
          { label: "暴击伤害", value: `+${equipStats.deadlyStrike ?? 0}%`, color: "text-purple-300" },
          { label: "最终伤害", value: `+${equipStats.enhancedDamage ?? 0}%`, color: "text-orange-300" },
          { label: "攻击间隔", value: `-${equipStats.attackSpeed ?? 0}%`, color: "text-sky-300" },
          { label: "粉碎打击", value: `+${equipStats.crushingBlow ?? 0}%`, color: "text-amber-300" },
          { label: "吸血", value: `${equipStats.lifeLeech ?? 0}%`, color: "text-rose-300" },
          { label: "生命回复", value: `+${equipStats.lifeRegen ?? 0}`, color: "text-emerald-300" },
          { label: "击杀回血", value: `+${equipStats.lifeOnKill ?? 0}`, color: "text-pink-300" },
          { label: "全抗", value: `-${equipStats.resistAll ?? 0}`, color: "text-cyan-300" },
          { label: "掉落概率", value: `+${equipStats.magicFind ?? 0}%`, color: "text-lime-300" },
          { label: "金币加成", value: `+${equipStats.goldBonus ?? 0}%`, color: "text-teal-300" },
          { label: "反弹伤害", value: `+${equipStats.reflectDamage ?? 0}%`, color: "text-indigo-300" },
        ].map(s => {
          const v = parseFloat(s.value);
          const isZero = isNaN(v) || v === 0;
          return (
            <div key={s.label} className={`bg-card border rounded p-1.5 text-center ${isZero ? 'border-border/30 opacity-40' : 'border-border'}`}>
              <p className="text-[9px] text-muted-foreground">{s.label}</p>
              <p className={`text-[11px] font-bold ${isZero ? 'text-muted-foreground/30' : s.color}`}>{isZero ? '—' : s.value}</p>
            </div>
          );
        })}
      </div>

      {isFighting && <ActiveCombat gs={gs} queryClient={queryClient} onStop={() => startAction.mutate("idle", { onError: (e: any) => toast({ title: t.combat.stopFailed, description: e.message, variant: "destructive" }) })} />}

      <div className="flex gap-1 bg-[hsl(220_13%_8%)] rounded-lg p-1">
        {[['enemies',t.combat.tabLabelEnemies],['dungeons',t.combat.tabLabelDungeons],['tower',t.combat.tabLabelTower],['trial',t.combat.tabLabelTrial]].map(([id,label]) => (
          <button key={id} onClick={() => window.location.hash = id} className={`flex-1 py-1.5 text-xs rounded-md font-medium ${activeTab === id ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`}>{label}</button>
        ))}
      </div>

      {activeTab === 'enemies' && (
        <div className="space-y-2">
          {ENEMIES
            .filter(enemy => !enemy.hidden || combatLevel >= enemy.reqCombatLevel)
            .map((enemy, i) => (
              <EnemyCard key={i} enemy={enemy} index={ENEMIES.indexOf(enemy)} gs={gs} combatLevel={combatLevel} weaponStyle={weaponStyle} isFighting={isFighting} startAction={startAction} toast={toast} hasWeapon={hasWeapon} />
            ))}
        </div>
      )}

      {activeTab === 'dungeons' && (
        <div className="space-y-2">
          {DUNGEONS.map((d, i) => {
            const isActive = gs.activeAction.startsWith(`dungeon_${i}_`);
            const stats = parseDungeonStats(gs.dungeonStats)[String(i)];
            const can = hasWeapon && combatLevel >= d.reqCombatLevel && gs.gold >= d.cost.gold && (!d.cost.bones || gs.bones >= d.cost.bones) && (!d.cost.dragonBones || gs.dragonBones >= d.cost.dragonBones);
            return (
              <div key={i} className={`rounded-lg border p-3 ${isActive ? 'border-purple-400 bg-purple-500/5' : can ? 'border-border' : 'border-border bg-muted/10'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold">{d.name}</p>
                    <div className="flex flex-wrap gap-x-3 text-[10px] text-muted-foreground">
                      <span>⚔{d.reqCombatLevel}</span><span>💰{d.cost.gold}G</span>
                      {d.cost.bones && <span>🦴{d.cost.bones}</span>}
                      {d.cost.dragonBones && <span>🐉{d.cost.dragonBones}</span>}
                      {stats?.clears > 0 && <span className="text-green-400">✅{stats.clears}x</span>}
                    </div>
                  </div>
                  <Button size="sm" disabled={isActive || !can}
                    onClick={() => enterDungeon.mutate(i, { onError: (e: any) => toast({ title: t.combat.cannotEnter, description: e.message, variant: "destructive" }) })}
                    className="h-7 text-xs bg-purple-600 hover:bg-purple-500 disabled:opacity-40">{isActive ? t.combat.dungeonInProgress : t.combat.dungeonEnter}</Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'tower' && (
        <div className="text-center py-8 space-y-3 bg-card border border-border rounded-xl p-6">
          <Building2 size={48} className="text-red-400 mx-auto" /><p className="text-sm font-bold">{t.combat.towerTitle}</p><p className="text-xs text-muted-foreground">{t.combat.towerFloor(gs.towerFloor ?? 0)}</p>
          <Button onClick={() => startTower.mutate(undefined, { onError: (e: any) => toast({ title: t.combat.cannotEnter, description: e.message, variant: "destructive" }) })} disabled={!hasWeapon} className="bg-red-600 hover:bg-red-500 disabled:opacity-40">{t.combat.towerButton}</Button>
        </div>
      )}

      {activeTab === 'trial' && (
        <div className="text-center py-8 space-y-3 bg-card border border-border rounded-xl p-6">
          <RadiationIcon size={48} className="text-amber-400 mx-auto" /><p className="text-sm font-bold">{t.combat.trialTitle}</p><p className="text-xs text-muted-foreground">{t.combat.trialKey((gs as any).trialKey ?? 0)}</p>
          <Button onClick={() => startTrial.mutate(undefined, { onError: (e: any) => toast({ title: t.combat.cannotEnter, description: e.message, variant: "destructive" }) })}
            disabled={(gs as any).trialKey < 1 || !hasWeapon} className="bg-amber-600 hover:bg-amber-500 disabled:opacity-30">{t.combat.trialButton}</Button>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, max, color }: { icon: any; label: string; value: number; max?: number; color: string }) {
  return (
    <div className="bg-card border border-border rounded-lg p-2 text-center">
      <Icon className={`w-4 h-4 mx-auto ${color}`} />
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className={`text-sm font-bold ${color}`}>{max ? <>{value}<span className="text-[10px] text-muted-foreground">/{max}</span></> : value}</p>
    </div>
  );
}
