import { useState, useEffect } from "react";
import { useGameState } from "@/hooks/use-game";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ScrollText, Skull, Pickaxe, Hammer, CheckCircle2, Clock } from "lucide-react";
import { BOUNTIES, type Bounty, ENEMIES } from "@shared/game-data";
import { calculateLevel } from "@/lib/game-utils";

const STORAGE_KEY = "wasteland_bounties";
const CLAIMED_KEY = "wasteland_bounties_claimed";

function getTrack(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { return {}; }
}
function getClaimed(): string[] {
  try { return JSON.parse(localStorage.getItem(CLAIMED_KEY) || "[]"); } catch { return []; }
}

function getBountyProgress(bounty: Bounty): { current: number; done: boolean } {
  const track = getTrack();
  const current = track[bounty.id] ?? 0;
  return { current, done: current >= bounty.count };
}

export default function Bounties() {
  const { data: state } = useGameState();
  const { toast } = useToast();
  const [dailyBounties, setDailyBounties] = useState<Bounty[]>([]);
  const [claiming, setClaiming] = useState<string | null>(null);

  useEffect(() => {
    if (!state) return;
    const gs = state as any;
    const combatXp = Math.max(gs.attackXp || 0, gs.strengthXp || 0, gs.rangedXp || 0, gs.magicXp || 0);
    const combatLevel = calculateLevel(combatXp);

    // Filter kill bounties to enemies within ±10 levels of player
    const eligibleKill = BOUNTIES.filter(b => {
      if (b.type !== 'kill') return true;
      const enemy = ENEMIES.find(e => e.id === b.target);
      if (!enemy) return true;
      return enemy.reqCombatLevel <= combatLevel + 5;
    });

    // Pick 1 kill + 1 gather + 1 craft = 3 bounties
    const seed = new Date().toDateString();
    const hash = (s: string) => { let h=0;for(let i=0;i<s.length;i++)h=((h<<5)-h)+s.charCodeAt(i);return h&0x7fffffff};
    const shuffle = (arr: any[]) => { const seeded = arr.map((item,i) => ({item, r: hash(seed+item.id+i)/0x7fffffff})); return seeded.sort((a,b)=>a.r-b.r).map(s=>s.item); };

    const killBounties = eligibleKill.filter(b => b.type === 'kill');
    const gatherBounties = BOUNTIES.filter(b => b.type === 'gather');
    const craftBounties = BOUNTIES.filter(b => b.type === 'craft');

    const picked = [
      ...shuffle(killBounties).slice(0, 1),
      ...shuffle(gatherBounties).slice(0, 1),
      ...shuffle(craftBounties).slice(0, 1),
    ];

    setDailyBounties(picked);
  }, [state]);

  if (!state) return null;

  const handleClaim = (bounty: Bounty) => {
    const claimed = getClaimed();
    if (claimed.includes(bounty.id)) return;
    claimed.push(bounty.id);
    localStorage.setItem(CLAIMED_KEY, JSON.stringify(claimed));
    toast({ title: `领取成功！+${bounty.rewardGold} 瓶盖` });
    setClaiming(null);
  };

  const typeIcons: Record<string, React.ReactNode> = {
    kill: <Skull className="w-4 h-4 text-red-400" />,
    gather: <Pickaxe className="w-4 h-4 text-green-400" />,
    craft: <Hammer className="w-4 h-4 text-amber-400" />,
  };

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      <h1 className="text-xl font-bold flex items-center gap-2">
        <ScrollText className="w-5 h-5 text-yellow-400" /> 悬赏任务板
      </h1>
      <p className="text-sm text-muted-foreground">
        每日刷新 3 个悬赏任务，完成可领取奖励。今日任务：
      </p>

      <div className="space-y-3">
        {dailyBounties.map(bounty => {
          const { current, done } = getBountyProgress(bounty);
          return (
            <div key={bounty.id} className={`bg-card border rounded-xl p-4 space-y-2 ${done ? 'border-green-400/40' : 'border-border'}`}>
              <div className="flex items-center gap-2">
                {typeIcons[bounty.type]}
                <span className="font-medium text-sm">{bounty.desc}</span>
                {done && <CheckCircle2 className="w-4 h-4 text-green-400 ml-auto" />}
              </div>
              
              {/* Progress bar */}
              <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full transition-all" 
                  style={{ width: `${Math.min(100, (current / bounty.count) * 100)}%` }} />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{current} / {bounty.count}</span>
                <span className="flex items-center gap-2">
                  💰 {bounty.rewardGold} 瓶盖
                  {bounty.rewardBones && <span>🦴 {bounty.rewardBones}</span>}
                  {bounty.rewardBox && <span>📦 {bounty.rewardBox}装备箱</span>}
                </span>
              </div>

              <Button size="sm" disabled={!done || claiming === bounty.id}
                onClick={() => handleClaim(bounty)}
                className="w-full">
                {done ? (claiming === bounty.id ? '领取中...' : '领取奖励') : '进行中'}
              </Button>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        <Clock className="w-3 h-3 inline mr-1" />每日 0 点刷新
      </p>
    </div>
  );
}
