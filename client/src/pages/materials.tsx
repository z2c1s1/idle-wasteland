import { useGameState } from "@/hooks/use-game";
import { getResourceCount, formatNumber } from "@/lib/game-utils";
import type { GameState } from "@shared/schema";
import { Package, Skull, Pickaxe } from "lucide-react";

// Tile filenames for resource tiers (same as ResourceIcon)
const TILE_FILES = [
  '001_废木板','002_枯树枝','003_焦木','004_铁线木','005_石化木',
  '006_辐射瘤木','007_骨白杉','008_黑钢木','009_泰坦木','010_核融晶木',
  '011_废铁块','012_铜丝矿','013_铝罐矿','014_铅块','015_硫磺矿',
  '016_硝酸盐矿','017_铀矿石','018_钛金矿','019_钨钢矿','020_铱金矿',
  '021_辐射蝌蚪','022_癞皮鱼','023_电鳗仔','024_刺鳍鱼','025_肿眼鲶',
  '026_荧光鳗','027_铁甲鱼','028_双头鲨','029_深渊巨口','030_核融鲸',
  '031_辐射鼠','032_变异兔','033_铁鳞蜥','034_疯犬','035_钢鬃猪',
  '036_双头鹿','037_灰熊','038_辐射蝎','039_死亡爪','040_巨兽',
  '041_辐射鼠皮','042_变异兔皮','043_铁鳞蜥皮','044_疯犬皮','045_钢鬃猪皮',
  '046_双头鹿皮','047_灰熊厚皮','048_辐射蝎壳','049_死亡爪皮','050_巨兽硬皮',
  '051_辐射鼠肉','052_变异兔肉','053_铁鳞蜥肉','054_疯犬肉','055_钢鬃猪肉',
  '056_双头鹿肉','057_灰熊肉','058_辐射蝎肉','059_死亡爪肉','060_巨兽肉',
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
