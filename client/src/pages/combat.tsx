import { useGameState, useStartAction } from "@/hooks/use-game";
import { ENEMIES, ALL_SLOTS, SLOT_LABEL, SLOT_EMOJI, RARITY_COLOR, type GameItem } from "@shared/game-data";
import {
  calculateLevel, getCombatLevel, getPlayerMaxHp, getPlayerAttack,
  getPlayerDefence, parseEquipment, parseLootBag, formatNumber, levelProgress, getEquipmentStats,
} from "@/lib/game-utils";
import type { GameState } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useEffect, useRef, useState } from "react";
import { Skull, Sword, Shield, Heart, Zap, Star, ChevronRight } from "lucide-react";
import { Link } from "wouter";

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
        <span>Next attack</span>
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
  const activeIdx     = isCombat ? parseInt(gs.activeAction.split("_")[1]) : -1;
  const activeEnemy   = activeIdx >= 0 ? ENEMIES[activeIdx] : null;
  const currentEnemyHp = activeEnemy
    ? (gs.enemyHp < 0 ? activeEnemy.maxHp : gs.enemyHp)
    : 0;

  const attackLevel    = calculateLevel(gs.attackXp);
  const defenceLevel   = calculateLevel(gs.defenceXp);
  const hitpointsLevel = calculateLevel(gs.hitpointsXp);

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Skull className="w-5 h-5 text-red-400" /> Combat
          </h1>
          <p className="text-sm text-muted-foreground">Combat Level {combatLevel}</p>
        </div>
        {lootBag.length > 0 && (
          <Link href="/inventory">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-yellow-500/40 bg-yellow-500/10 text-yellow-400 text-xs font-medium cursor-pointer hover:bg-yellow-500/20 transition-colors">
              <Star className="w-3.5 h-3.5" />
              {lootBag.length} new item{lootBag.length !== 1 ? 's' : ''}
              <ChevronRight className="w-3 h-3" />
            </div>
          </Link>
        )}
      </div>

      {/* Player Stats */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Player Stats</h2>
        <HpBar current={currentHp} max={playerMaxHp} label="Hitpoints" color="bg-green-500" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <StatBox icon={Sword}  label="Attack"   value={playerAtk}  color="text-red-400" sub={eqStats.attackBonus > 0 ? `+${eqStats.attackBonus} gear` : undefined} />
          <StatBox icon={Shield} label="Defence"  value={playerDef}  color="text-blue-400" sub={eqStats.defenceBonus > 0 ? `+${eqStats.defenceBonus} gear` : undefined} />
          <StatBox icon={Heart}  label="Max HP"   value={playerMaxHp} color="text-green-400" sub={eqStats.hpBonus > 0 ? `+${eqStats.hpBonus} gear` : undefined} />
          <StatBox icon={Zap}    label="Crit"     value={`${eqStats.critRating.toFixed(1)}%`} color="text-yellow-400"
            sub={eqStats.critRating > 0 ? "+50% bonus dmg" : "No crit"} />
        </div>

        {/* Skill XP */}
        <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border">
          {[
            { label: "Attack",    xp: gs.attackXp,    lv: attackLevel    },
            { label: "Defence",   xp: gs.defenceXp,   lv: defenceLevel   },
            { label: "Hitpoints", xp: gs.hitpointsXp, lv: hitpointsLevel },
          ].map(({ label, xp, lv }) => (
            <div key={label} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-bold">Lv {lv}</span>
              </div>
              <Progress value={levelProgress(xp)} className="h-1" />
              <p className="text-[10px] text-muted-foreground">{formatNumber(xp)} XP</p>
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

      {/* Active combat */}
      {isCombat && activeEnemy && (
        <div className="bg-card border border-red-500/30 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold flex items-center gap-2 text-red-300">
              <span className="text-3xl">{activeEnemy.emoji}</span>
              Fighting: {activeEnemy.name}
            </h2>
            <Button variant="outline" size="sm" onClick={() => startAction.mutate("idle")} data-testid="button-stop-combat">
              Flee
            </Button>
          </div>
          <HpBar current={currentEnemyHp} max={activeEnemy.maxHp} label="Enemy HP" color="bg-red-500" />
          <CombatTimer actionUpdatedAt={gs.actionUpdatedAt as unknown as string} speed={3} />
          <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground">
            <div><span className="text-foreground font-medium">Enemy ATK:</span> {activeEnemy.attack}</div>
            <div><span className="text-foreground font-medium">Enemy DEF:</span> {activeEnemy.defence}</div>
            <div><span className="text-foreground font-medium">Your DPS:</span> {Math.max(1, playerAtk - activeEnemy.defence)}/3s</div>
            <div><span className="text-foreground font-medium">Drop %:</span> {Math.round((0.15 + ENEMIES.indexOf(activeEnemy) * 0.02) * 100)}%</div>
          </div>
        </div>
      )}

      {/* Enemy list */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Select Enemy</h2>
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
                    <span className="text-[10px] text-yellow-500 border border-yellow-500/30 px-1 rounded">ilvl {index * 7 + 1}-{index * 7 + 6}</span>
                    {locked && <span className="text-xs text-muted-foreground">(Combat {enemy.reqCombatLevel})</span>}
                    {!locked && dmgToUs > currentHp && <span className="text-xs text-red-400 font-medium">⚠ Lethal</span>}
                  </div>
                  <div className="text-xs text-muted-foreground flex gap-3 mt-0.5 flex-wrap">
                    <span>HP {enemy.maxHp}</span>
                    <span>ATK {enemy.attack}</span>
                    <span>DEF {enemy.defence}</span>
                    <span className="text-yellow-500">{enemy.xp} XP/kill</span>
                    <span>💰 {enemy.drops.gold[0]}+ gold</span>
                    {enemy.drops.dragonBones && <span className="text-purple-400">🐲 dragon bones</span>}
                  </div>
                  <div className="text-xs mt-0.5 flex gap-3">
                    <span className="text-green-400">⚔ {dmgToThem}/hit</span>
                    {dmgToUs > 0 ? <span className="text-red-400">💔 {dmgToUs}/hit</span> : <span className="text-blue-400">🛡 invincible</span>}
                    <span className="text-yellow-400">📦 {Math.round((0.15 + index * 0.02) * 100)}% drop</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {isActive ? (
                    <Button size="sm" variant="destructive" onClick={() => startAction.mutate("idle")} data-testid={`button-stop-${enemy.id}`}>Flee</Button>
                  ) : (
                    <Button size="sm" disabled={locked} onClick={() => startAction.mutate(`combat_${index}`)} data-testid={`button-fight-${enemy.id}`}>
                      {locked ? `Lv ${enemy.reqCombatLevel}` : "Fight"}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Drops summary */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Combat Loot</h2>
        <div className="flex gap-4 text-sm flex-wrap">
          <span>💰 <span className="font-bold text-yellow-400">{formatNumber(gs.gold)}</span> Gold</span>
          <span>🦴 <span className="font-bold">{formatNumber(gs.bones)}</span> Bones</span>
          {gs.dragonBones > 0 && <span>🐲 <span className="font-bold text-purple-400">{formatNumber(gs.dragonBones)}</span> Dragon Bones</span>}
        </div>
        {lootBag.length > 0 && (
          <Link href="/inventory">
            <div className="mt-3 flex items-center gap-2 text-sm text-yellow-400 hover:text-yellow-300 cursor-pointer">
              <Star className="w-4 h-4" />
              <span>{lootBag.length} item{lootBag.length !== 1 ? 's' : ''} waiting in loot bag</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
