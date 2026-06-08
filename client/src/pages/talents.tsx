import { useGameState, useUnlockTalent, useResetTalents } from "@/hooks/use-game";
import { TALENT_TREES, type TalentNode, type CombatStyle } from "@shared/game-data";
import { calculateLevel, getTotalTalentPoints } from "@/lib/game-utils";
import { useToast } from "@/hooks/use-toast";
import type { GameState } from "@shared/schema";
import { Gem } from "lucide-react";
import { useUIText } from "@/lib/i18n";

const STYLE_LABELS: Record<CombatStyle, string> = { melee: '近战', ranged: '远程', magic: '魔法' };

const CENTER_REQUIREMENTS: Record<CombatStyle, { label: string; skillName: string }> = {
  melee: { label: '近战', skillName: '攻击' },
  ranged: { label: '远程', skillName: '远程' },
  magic: { label: '魔法', skillName: '魔法' },
};

function TalentTreeSVG({ style, nodes, unlocked, combatLevel, centerId, onUnlock, onCenterInfo }: {
  style: CombatStyle;
  nodes: TalentNode[];
  unlocked: string[];
  combatLevel: number;
  centerId: string;
  onUnlock: (nodeId: string) => void;
  onCenterInfo?: () => void;
}) {
  const t = useUIText();
  const centerUnlocked = combatLevel >= 15;
  return (
    <div className="bg-card border border-border rounded-xl p-3">
      <h3 className="text-sm font-semibold text-amber-400 text-center mb-2">{STYLE_LABELS[style]} 天赋树</h3>
      <div className="relative w-full" style={{ aspectRatio: '1', maxWidth: 400 }}>
        <svg viewBox="0 0 300 300" className="w-full h-full block">
          {nodes.map(n =>
            n.requires.map(reqId => {
              const req = nodes.find(x => x.id === reqId);
              if (!req) return null;
              const reqOk = unlocked.includes(reqId) || (reqId === centerId && centerUnlocked);
              const isActive = reqOk && unlocked.includes(n.id);
              return (
                <line key={`${reqId}-${n.id}`} x1={req.x * 3} y1={req.y * 3} x2={n.x * 3} y2={n.y * 3}
                  stroke={isActive ? '#f59e0b' : '#2a2a3e'} strokeWidth={isActive ? 2.5 : 1} />
              );
            })
          )}
          {nodes.map(n => {
            const isCenter = n.tier === 0;
            const isUnlocked = isCenter ? centerUnlocked : unlocked.includes(n.id);
            const prereqs = n.requires.every(r => unlocked.includes(r) || (r === centerId && centerUnlocked));
            const canUnlock = prereqs && !isUnlocked && n.cost > 0;
            const r = isCenter ? 16 : n.tier === 3 ? 12 : 9;
            return (
              <g key={n.id}>
                <circle cx={n.x * 3} cy={n.y * 3} r={r}
                  fill={isUnlocked ? '#f59e0b' : canUnlock ? '#334155' : '#1a1a2e'}
                  stroke={isUnlocked ? '#fbbf24' : canUnlock ? '#64748b' : '#2a2a3e'}
                  strokeWidth={isCenter ? 2.5 : n.tier === 3 ? 2 : 1.5}
                />
                <text x={n.x * 3} y={n.y * 3 + 1} textAnchor="middle" dominantBaseline="middle"
                  fontSize={isCenter ? 16 : n.tier === 3 ? 11 : 10}
                  fill={isUnlocked ? '#fff' : canUnlock ? '#94a3b8' : '#555'}
                  fontWeight={isCenter || n.tier === 3 ? 'bold' : 'normal'}>
                  {n.emoji}
                </text>
                {n.tier === 3 && (
                  <text x={n.x * 3} y={n.y * 3 + r + 8} textAnchor="middle"
                    fontSize={7} fill="#f59e0b" opacity={isUnlocked ? 1 : 0.3}>
                    {n.name}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        {/* HTML overlay buttons for reliable clicking */}
        {nodes.map(n => {
          const isCenter = n.tier === 0;
          const isUnlocked = isCenter ? centerUnlocked : unlocked.includes(n.id);
          const prereqs = n.requires.every(r => unlocked.includes(r) || (r === centerId && centerUnlocked));
          const canUnlock = prereqs && !isUnlocked && n.cost > 0;
          // Center node: always clickable (shows info if level too low)
          const canClick = isCenter ? (combatLevel >= 15 && !unlocked.includes(n.id)) : (!isUnlocked && n.cost > 0);
          return (
            <button key={`btn-${n.id}`}
              disabled={isCenter ? false : !canClick}
              onClick={() => { 
                if (isCenter && !centerUnlocked && onCenterInfo) onCenterInfo();
                else if (canClick) onUnlock(n.id);
              }}
              className="absolute border-0 bg-transparent p-0 rounded-full"
              style={{
                left: `${n.x}%`, top: `${n.y}%`,
                width: isCenter ? '12%' : n.tier === 3 ? '9%' : '8%',
                aspectRatio: '1',
                transform: 'translate(-50%, -50%)',
                cursor: (!isUnlocked && n.cost > 0) ? 'pointer' : 'default',
                zIndex: 10,
              }}
              title={canUnlock ? `${n.name}\n${n.effect}\n消耗 ${n.cost} 点` : ''}
            />
          );
        })}
      </div>
      <div className="flex justify-center gap-4 mt-2 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span> {t.pages.talents.unlocked}</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-slate-700 inline-block border border-slate-500"></span> {t.pages.talents.canUnlock}</span>
      </div>
    </div>
  );
}

export default function Talents() {
  const t = useUIText();
  const { data: state } = useGameState();
  const unlockTalent = useUnlockTalent();
  const resetTalents = useResetTalents();
  const { toast } = useToast();
  if (!state) return null;
  const gs = state as GameState;

  const parseTalents = (): Record<string, string[]> => {
    try {
      return JSON.parse((gs as any).talents ?? '{}');
    } catch { return {}; }
  };

  // Combat levels for center node requirements
  const meleeLevel = calculateLevel(gs.attackXp);
  const rangedLevel = calculateLevel(gs.rangedXp ?? 0);
  const magicLevel = calculateLevel(gs.magicXp ?? 0);
  const styleLevels: Record<string, number> = { melee: meleeLevel, ranged: rangedLevel, magic: magicLevel };
  const centerReqs: Record<string, string> = { melee: 'm_center', ranged: 'r_center', magic: 'mg_center' };
  const talents = parseTalents();
  const points = getTotalTalentPoints(gs);
  // Count spent: exclude center nodes (cost 0)
  const allNodes = [...TALENT_TREES.melee, ...TALENT_TREES.ranged, ...TALENT_TREES.magic];
  const freeIds = new Set(allNodes.filter(n => n.cost === 0).map(n => n.id));
  const spent = Object.values(talents).reduce((sum, arr) => sum + arr.filter(id => !freeIds.has(id)).length, 0);

  const unlock = async (style: CombatStyle, nodeId: string) => {
    try {
      await unlockTalent.mutateAsync({ style, nodeId });
      toast({ title: t.pages.talents.unlockSuccess });
    } catch (e: unknown) {
      toast({
        title: t.pages.talents.unlockFail,
        description: e instanceof Error ? e.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Gem className="w-5 h-5 text-amber-400" /> {t.pages.talents.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t.pages.talents.available} {points} · {t.pages.talents.used} {spent} · {t.pages.talents.remaining} {points - spent}
          </p>
        </div>
        <button
          onClick={async () => {
            if (!confirm(t.pages.talents.resetConfirm)) return;
            try {
              await resetTalents.mutateAsync();
              toast({ title: t.pages.talents.resetSuccess });
            } catch (e: unknown) {
              toast({
                title: t.pages.talents.resetFail,
                description: e instanceof Error ? e.message : "Unknown error",
                variant: "destructive",
              });
            }
          }}
          className="h-7 text-xs px-3 rounded bg-red-600/30 hover:bg-red-600/50 text-red-300 transition-colors"
        >
          重置
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {(['melee','ranged','magic'] as CombatStyle[]).map(style => (
          <TalentTreeSVG
            key={style}
            style={style}
            nodes={TALENT_TREES[style]}
            unlocked={talents[style] ?? []}
            combatLevel={styleLevels[style] ?? 1}
            centerId={centerReqs[style]}
            onUnlock={(nodeId) => unlock(style, nodeId)}
            onCenterInfo={() => {
              const info = CENTER_REQUIREMENTS[style];
              toast({ title: `${info.label}天赋树`, description: `${info.skillName}技能达到15级自动解锁中心点` });
            }}
          />
        ))}
      </div>
    </div>
  );
}
