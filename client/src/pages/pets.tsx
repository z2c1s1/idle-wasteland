import { useGameState, useClaimPet } from "@/hooks/use-game";
import { ACHIEVEMENTS, PETS, ENEMIES, MILESTONES, type Milestone } from "@shared/game-data";
import { calculateLevel } from "@/lib/game-utils";
import { useUIText } from "@/lib/i18n";
import type { GameState } from "@shared/schema";
import { Trophy, PawPrint, Gift, CheckCircle2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type AchieveEntry = { id:string;name:string;desc:string;type:'kill'|'dungeon'|'skill';target:string;count:number;reward:string };

function ProgressBar({ pct }: { pct: number }) {
  return (
    <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
      <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${Math.min(100, pct)}%` }} />
    </div>
  );
}

export default function PetsPage() {
  const { data: state } = useGameState();
  const claimPet = useClaimPet();
  const { toast } = useToast();
  const t = useUIText();
  if (!state) return null;
  const gs = state as GameState;

  const progress: Record<string, number> = JSON.parse(gs.achievements ?? '{}');
  const ownedPets: string[] = JSON.parse(gs.pets ?? '[]');

  // Group achievements by type
  const skillAchs = ACHIEVEMENTS.filter(a => a.type === 'skill');
  const killAchs = ACHIEVEMENTS.filter(a => a.type === 'kill');
  const dungeonAchs = ACHIEVEMENTS.filter(a => a.type === 'dungeon');

  function getProgress(ach: AchieveEntry): number {
    const key = `${ach.type}_${ach.target}`;
    const raw = Math.max(0, progress[key] ?? 0);
    // Skill achievements: target is XP key (e.g. "woodcuttingXp"), convert to level
    if (ach.type === 'skill') {
      return calculateLevel(raw);
    }
    return raw;
  }

  function getVal(target: string): number {
    const gs = state as any;
    switch (target) {
      case 'woodcutting': return gs.woodcuttingXp ?? 0;
      case 'mining': return gs.miningXp ?? 0;
      case 'fishing': return gs.fishingXp ?? 0;
      case 'hunting': return gs.huntingXp ?? 0;
      case 'smelting': return gs.smeltingXp ?? 0;
      case 'smithing': return gs.smithingXp ?? 0;
      case 'cooking': return gs.cookingXp ?? 0;
      case 'kills': return gs.totalKills ?? 0;
      case 'dungeons': return gs.dungeonCount ?? 0;
      case 'actions': return (gs.totalActions ?? 0);
      case 'gold': return gs.gold ?? 0;
      case 'maxLevel': {
        const xps = ['woodcuttingXp','miningXp','fishingXp','huntingXp','smeltingXp','smithingXp','cookingXp','combatXp','attackXp'];
        let max = 0;
        for (const k of xps) {
          const xp = gs[k] ?? 0;
          const lvl = Math.floor(xp / 100) + 1;
          if (lvl > max) max = lvl;
        }
        return max;
      }
      default: return 0;
    }
  }

  function isComplete(ach: AchieveEntry): boolean {
    return getProgress(ach) >= ach.count;
  }

  function isClaimed(ach: AchieveEntry): boolean {
    return ownedPets.includes(ach.reward);
  }

  function handleClaim(achId: string) {
    claimPet.mutate(achId, {
      onSuccess: () => toast({ title: "宠物已领取！🎉" }),
      onError: (e: any) => toast({ title: "领取失败", description: e.message, variant: "destructive" }),
    });
  }

  // Count stats
  const totalAchs = ACHIEVEMENTS.length;
  const completedAchs = ACHIEVEMENTS.filter(a => isComplete(a)).length;
  const claimedPets = ownedPets.length;

  function AchCard({ ach }: { ach: AchieveEntry }) {
    const prog = getProgress(ach);
    const pct = Math.min(100, (prog / ach.count) * 100);
    const complete = isComplete(ach);
    const claimed = isClaimed(ach);

    return (
      <div className={`rounded-lg border p-3 space-y-1.5 transition-colors ${
        claimed ? 'border-green-400/40 bg-green-500/5' :
        complete ? 'border-amber-400/40 bg-amber-500/5' :
        'border-border bg-card'
      }`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              {claimed && <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />}
              {complete && !claimed && <Gift className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 animate-pulse" />}
              {!complete && <Lock className="w-3.5 h-3.5 text-muted-foreground/40 flex-shrink-0" />}
              <span className={`text-sm font-medium ${claimed ? 'text-green-400' : complete ? 'text-amber-400' : 'text-foreground'}`}>{ach.name}</span>
            </div>
            <p className="text-[9px] text-muted-foreground">{ach.desc}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1"><ProgressBar pct={pct} /></div>
              <span className="text-[9px] text-muted-foreground tabular-nums whitespace-nowrap">{prog}/{ach.count}</span>
            </div>
          </div>
          {complete && !claimed && (
            <Button size="sm" className="h-7 text-xs flex-shrink-0" onClick={() => handleClaim(ach.id)}
              disabled={claimPet.isPending}>
              领取
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-5 bg-card rounded-xl border border-border">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" /> 成就系统
        </h1>
        <p className="text-sm text-muted-foreground">
          完成成就领取奖励 · 已解锁 {claimedPets} 只 · 进度 {completedAchs}/{totalAchs}
        </p>
      </div>

      {/* Owned pets quick view */}
      {ownedPets.length > 0 && (
        <div className="bg-card border border-amber-500/20 rounded-xl p-4">
          <h2 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <PawPrint className="w-3.5 h-3.5" /> 我的宠物
          </h2>
          <div className="flex flex-wrap gap-3">
            {PETS.filter(p => ownedPets.includes(p.id)).map(pet => (
              <div key={pet.id} className="flex items-center gap-2 bg-muted/20 rounded-lg px-3 py-2">
                <span className="text-2xl">{pet.emoji}</span>
                <div>
                  <p className="text-xs font-bold">{pet.name}</p>
                  <p className="text-[10px] text-amber-400/80">{pet.buffDesc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skill achievements */}
      <details open className="space-y-2">
        <summary className="text-sm font-semibold text-green-400 uppercase tracking-wider cursor-pointer">技能成就 ({skillAchs.filter(a => isComplete(a)).length}/{skillAchs.length})</summary>
        <div className="space-y-2 mt-2">
          {skillAchs.map(ach => (
            <AchCard key={ach.id} ach={ach} />
          ))}
        </div>
      </details>

      {/* Kill achievements */}
      <details className="space-y-2">
        <summary className="text-sm font-semibold text-red-400 uppercase tracking-wider cursor-pointer">击杀成就 ({killAchs.filter(a => isComplete(a)).length}/{killAchs.length})</summary>
        <div className="space-y-2 mt-2">
          {killAchs.map(ach => <AchCard key={ach.id} ach={ach} />)}
        </div>
      </details>

      {/* Dungeon achievements */}
      <details className="space-y-2">
        <summary className="text-sm font-semibold text-purple-400 uppercase tracking-wider cursor-pointer">副本成就 ({dungeonAchs.filter(a => isComplete(a)).length}/{dungeonAchs.length})</summary>
        <div className="space-y-2 mt-2">
          {dungeonAchs.map(ach => <AchCard key={ach.id} ach={ach} />)}
        </div>
      </details>

      {/* Milestones */}
      <details className="space-y-2">
        <summary className="text-sm font-semibold text-amber-400 uppercase tracking-wider cursor-pointer">
          里程碑 ({MILESTONES.filter(m => {
            const v = getVal(m.target);
            return v >= m.threshold;
          }).length}/{MILESTONES.length})
        </summary>
        <div className="space-y-2 mt-2">
          {MILESTONES.map(m => {
            const v = getVal(m.target);
            const done = v >= m.threshold;
            return (
              <div key={m.id} className={`flex items-center gap-3 p-2 rounded-lg border ${done ? 'border-amber-400/40 bg-amber-400/5' : 'border-border bg-muted/10'}`}>
                <span className="text-lg">{done ? '🏆' : '🔒'}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium ${done ? 'text-amber-300' : 'text-muted-foreground'}`}>{m.title}</p>
                  <p className="text-[10px] text-muted-foreground">{m.desc}</p>
                  <div className="w-full h-1 bg-muted/30 rounded-full mt-1">
                    <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${Math.min(100, (v / m.threshold) * 100)}%` }} />
                  </div>
                  <p className="text-[10px] text-amber-400/60">{done ? m.bonusLabel : `${v}/${m.threshold}`}</p>
                </div>
              </div>
            );
          })}
        </div>
      </details>
    </div>
  );
}
