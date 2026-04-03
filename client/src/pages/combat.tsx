import { useGameState, useStartAction } from "@/hooks/use-game";
import { ENEMIES, EQUIPMENT_ITEMS, type EquipmentState } from "@shared/game-data";
import {
  calculateLevel, getCombatLevel, getPlayerMaxHp, getPlayerAttack,
  getPlayerDefence, parseEquipment, formatNumber, levelProgress,
} from "@/lib/game-utils";
import type { GameState } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useEffect, useRef, useState } from "react";
import { Skull, Sword, Shield, Heart, Zap } from "lucide-react";

function HpBar({ current, max, label, color }: { current: number; max: number; label: string; color: string }) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (current / max) * 100)) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-medium">
        <span className="text-muted-foreground">{label}</span>
        <span>{current} / {max}</span>
      </div>
      <div className="h-3 bg-muted/30 rounded-full overflow-hidden border border-border">
        <div className={`h-full rounded-full transition-all duration-300 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function StatBox({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string | number; color: string }) {
  return (
    <div className="bg-card/50 border border-border rounded-lg px-3 py-2 flex items-center gap-2">
      <Icon className={`w-4 h-4 ${color}`} />
      <div>
        <p className="text-xs text-muted-foreground leading-none">{label}</p>
        <p className="text-sm font-bold mt-0.5">{value}</p>
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
  const { data: state } = useGameState();
  const startAction = useStartAction();

  if (!state) return null;

  const gameState = state as GameState;
  const combatLevel = getCombatLevel(gameState);
  const playerMaxHp = getPlayerMaxHp(gameState);
  const currentPlayerHp = gameState.playerHp < 0 ? playerMaxHp : gameState.playerHp;
  const playerAtk = getPlayerAttack(gameState);
  const playerDef = getPlayerDefence(gameState);
  const equipment = parseEquipment(gameState.equipment);

  const activeAction = gameState.activeAction;
  const isCombat = activeAction.startsWith("combat_");
  const activeEnemyIndex = isCombat ? parseInt(activeAction.split("_")[1]) : -1;
  const activeEnemy = activeEnemyIndex >= 0 ? ENEMIES[activeEnemyIndex] : null;
  const currentEnemyHp = activeEnemy
    ? (gameState.enemyHp < 0 ? activeEnemy.maxHp : gameState.enemyHp)
    : 0;

  function startCombat(index: number) {
    startAction.mutate(`combat_${index}`);
  }

  function stopCombat() {
    startAction.mutate("idle");
  }

  const attackLevel = calculateLevel(gameState.attackXp);
  const defenceLevel = calculateLevel(gameState.defenceXp);
  const hitpointsLevel = calculateLevel(gameState.hitpointsXp);

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Skull className="w-5 h-5 text-red-400" /> Combat
        </h1>
        <p className="text-sm text-muted-foreground">Combat Level {combatLevel}</p>
      </div>

      {/* Player Stats */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Player Stats</h2>
        <HpBar current={currentPlayerHp} max={playerMaxHp} label="Hitpoints" color="bg-green-500" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <StatBox icon={Sword} label="Attack" value={playerAtk} color="text-red-400" />
          <StatBox icon={Shield} label="Defence" value={playerDef} color="text-blue-400" />
          <StatBox icon={Heart} label="HP" value={`${hitpointsLevel}`} color="text-green-400" />
          <StatBox icon={Zap} label="Combat Lv" value={combatLevel} color="text-yellow-400" />
        </div>

        {/* Skill levels */}
        <div className="grid grid-cols-3 gap-3 pt-1 border-t border-border">
          {[
            { label: "Attack", xp: gameState.attackXp },
            { label: "Defence", xp: gameState.defenceXp },
            { label: "Hitpoints", xp: gameState.hitpointsXp },
          ].map(({ label, xp }) => {
            const lv = calculateLevel(xp);
            return (
              <div key={label} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-bold">Lv {lv}</span>
                </div>
                <Progress value={levelProgress(xp)} className="h-1" />
                <p className="text-[10px] text-muted-foreground">{formatNumber(xp)} XP</p>
              </div>
            );
          })}
        </div>

        {/* Equipment display */}
        <div className="flex gap-2 flex-wrap pt-1 border-t border-border">
          {(["weapon", "shield", "helmet", "body", "legs"] as const).map(slot => {
            const itemId = (equipment as Record<string, string | null>)[slot];
            const item = itemId ? EQUIPMENT_ITEMS[itemId] : null;
            return (
              <div key={slot} className={`flex items-center gap-1 px-2 py-1 rounded text-xs border ${
                item ? "border-primary/40 bg-primary/10" : "border-border bg-muted/20 text-muted-foreground"
              }`}>
                <span>{item ? item.emoji : "—"}</span>
                <span>{item ? item.name : slot}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active combat */}
      {isCombat && activeEnemy && (
        <div className="bg-card border border-red-500/30 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold flex items-center gap-2 text-red-300">
              <span className="text-2xl">{activeEnemy.emoji}</span>
              Fighting: {activeEnemy.name}
            </h2>
            <Button variant="outline" size="sm" onClick={stopCombat} data-testid="button-stop-combat">
              Flee
            </Button>
          </div>
          <HpBar current={currentEnemyHp} max={activeEnemy.maxHp} label="Enemy HP" color="bg-red-500" />
          <CombatTimer actionUpdatedAt={gameState.actionUpdatedAt as unknown as string} speed={3} />
          <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
            <div><span className="text-foreground font-medium">Enemy ATK:</span> {activeEnemy.attack}</div>
            <div><span className="text-foreground font-medium">Enemy DEF:</span> {activeEnemy.defence}</div>
            <div><span className="text-foreground font-medium">Your DPS:</span> {Math.max(1, playerAtk - activeEnemy.defence)}/3s</div>
          </div>
        </div>
      )}

      {/* Enemy list */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Select Enemy</h2>
        <div className="space-y-2">
          {ENEMIES.map((enemy, index) => {
            const locked = combatLevel < enemy.reqCombatLevel;
            const isActive = activeEnemyIndex === index;
            const dmgPerRound = Math.max(1, playerAtk - enemy.defence);
            const takeDmg = Math.max(0, enemy.attack - playerDef);
            const canSurvive = takeDmg === 0 || currentPlayerHp > takeDmg;

            return (
              <div
                key={enemy.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  locked ? "border-border bg-muted/10 opacity-50" :
                  isActive ? "border-red-400/50 bg-red-500/10" :
                  "border-border bg-card hover:border-primary/40"
                }`}
                data-testid={`enemy-row-${enemy.id}`}
              >
                <span className="text-2xl">{enemy.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{enemy.name}</span>
                    {locked && <span className="text-xs text-muted-foreground">(Req. combat {enemy.reqCombatLevel})</span>}
                    {!canSurvive && !locked && (
                      <span className="text-xs text-red-400 font-medium">⚠ Dangerous</span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground flex gap-3 mt-0.5">
                    <span>HP {enemy.maxHp}</span>
                    <span>ATK {enemy.attack}</span>
                    <span>DEF {enemy.defence}</span>
                    <span>XP {enemy.xp}</span>
                    <span>💰 {enemy.drops.gold[0]}+</span>
                  </div>
                  <div className="text-xs mt-0.5">
                    <span className="text-green-400">↑{dmgPerRound}/hit</span>
                    {takeDmg > 0 && <span className="text-red-400 ml-2">↓{takeDmg}/hit</span>}
                    {takeDmg === 0 && <span className="text-blue-400 ml-2">No dmg taken</span>}
                  </div>
                </div>
                <div>
                  {isActive ? (
                    <Button size="sm" variant="destructive" onClick={stopCombat} data-testid={`button-stop-${enemy.id}`}>Flee</Button>
                  ) : (
                    <Button size="sm" disabled={locked} onClick={() => startCombat(index)} data-testid={`button-fight-${enemy.id}`}>
                      Fight
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Drops summary */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Loot</h2>
        <div className="flex gap-4 text-sm">
          <span>💰 Gold: <span className="font-bold text-yellow-400">{formatNumber(gameState.gold)}</span></span>
          <span>🦴 Bones: <span className="font-bold">{formatNumber(gameState.bones)}</span></span>
          {gameState.dragonBones > 0 && (
            <span>🐲 Dragon Bones: <span className="font-bold text-purple-400">{formatNumber(gameState.dragonBones)}</span></span>
          )}
        </div>
      </div>
    </div>
  );
}
