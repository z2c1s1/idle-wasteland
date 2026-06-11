import { useGameState } from "@/hooks/use-game";
import { getResourceCount, formatNumber } from "@/lib/game-utils";
import type { GameState } from "@shared/schema";
import { Package, Skull, Pickaxe } from "lucide-react";

// Tile filenames for resource tiers (same as ResourceIcon)
const TILE_FILES = [
  '001_cell','002_cell','003_cell','004_cell','005_cell',
  '006_cell','007_cell','008_cell','009_cell','010_cell',
  '011_cell','012_cell','013_cell','014_cell','015_cell',
  '016_cell','017_cell','018_cell','019_cell','020_cell',
  '021_cell','022_cell','023_cell','024_cell','025_cell',
  '026_cell','027_cell','028_cell','029_cell','030_cell',
  '031_cell','032_cell','033_cell','034_cell','035_cell',
  '036_cell','037_cell','038_cell','039_cell','040_cell',
  '041_cell','042_cell','043_cell','044_cell','045_cell',
  '046_cell','047_cell','048_cell','049_cell','050_cell',
  '051_cell','052_cell','053_cell','054_cell','055_cell',
  '056_cell','057_cell','058_cell','059_cell','060_cell',
];

interface ResourceEntry { name: string; key: string; count: number; tier: number; tileFile?: string; }

function ResourceCard({ entry }: { entry: ResourceEntry }) {
  return (
    <div className="flex items-center gap-2 bg-muted/10 rounded-lg p-2 border border-border/50">
      {entry.tileFile ? (
        <img src={`/tiles/${entry.tileFile}.png`} alt="" className="w-8 h-8 flex-shrink-0" style={{ imageRendering: 'pixelated' }} />
      ) : (
        <span className="text-lg flex-shrink-0 w-8 h-8 flex items-center justify-center">{entry.name === '骨头' ? '🦴' : entry.name === '龙骨' ? '🐉' : entry.name === '瓶盖' ? '💰' : '📦'}</span>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate">{entry.name}</p>
        <p className="text-[10px] text-muted-foreground font-mono">{formatNumber(entry.count)}</p>
      </div>
    </div>
  );
}

export default function Materials() {
  const { data: state } = useGameState();
  if (!state) return null;
  const gs = state as GameState;

  // 采集材料: wood, ore, fish, hide, meat (10 tiers each)
  const gathering: ResourceEntry[] = [];
  const woodNames = TILE_FILES.slice(0, 10);
  const oreNames = TILE_FILES.slice(10, 20);
  const fishNames = TILE_FILES.slice(20, 30);
  const hideNames = TILE_FILES.slice(40, 50);
  const meatNames = TILE_FILES.slice(50, 60);

  for (let i = 0; i < 10; i++) {
    gathering.push({ name: woodNames[i].split('_').slice(1).join(''), key: `wood_${i}`, count: getResourceCount(gs, `wood_${i}`), tier: i, tileFile: woodNames[i] });
    gathering.push({ name: oreNames[i].split('_').slice(1).join(''), key: `ore_${i}`, count: getResourceCount(gs, `ore_${i}`), tier: i, tileFile: oreNames[i] });
    gathering.push({ name: fishNames[i].split('_').slice(1).join(''), key: `fish_${i}`, count: getResourceCount(gs, `fish_${i}`), tier: i, tileFile: fishNames[i] });
    gathering.push({ name: hideNames[i].split('_').slice(1).join(''), key: `hide_${i}`, count: getResourceCount(gs, `hide_${i}`), tier: i, tileFile: hideNames[i] });
    gathering.push({ name: meatNames[i].split('_').slice(1).join(''), key: `meat_${i}`, count: getResourceCount(gs, `meat_${i}`), tier: i, tileFile: meatNames[i] });
  }

  // 战斗材料
  const combat: ResourceEntry[] = [
    { name: '骨头', key: 'bones', count: gs.bones ?? 0, tier: 0 },
    { name: '龙骨', key: 'dragonBones', count: gs.dragonBones ?? 0, tier: 0 },
    { name: '瓶盖', key: 'gold', count: gs.gold, tier: 0 },
  ];

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-4 bg-card rounded-xl border border-border">
      <h1 className="text-xl font-bold flex items-center gap-2">
        <Package className="w-5 h-5 text-amber-400" /> 材料
      </h1>

      {/* 采集材料 */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
          <Pickaxe className="w-3.5 h-3.5 text-green-400" /> 采集材料
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
          {gathering.filter(e => e.count > 0).map(e => (
            <ResourceCard key={e.key} entry={e} />
          ))}
          {gathering.filter(e => e.count > 0).length === 0 && (
            <p className="text-xs text-muted-foreground col-span-full py-4 text-center">暂无采集材料</p>
          )}
        </div>
      </div>

      {/* 战斗材料 */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
          <Skull className="w-3.5 h-3.5 text-red-400" /> 战斗材料
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {combat.map(e => (
            <ResourceCard key={e.key} entry={e} />
          ))}
        </div>
      </div>
    </div>
  );
}
