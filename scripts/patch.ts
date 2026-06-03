// Batch patch script: implement all 6 plan steps
import * as fs from 'fs';

function read(p: string) { return fs.readFileSync(p, 'utf-8'); }
function write(p: string, content: string) { console.log(`  write ${p} (${content.length} chars)`); fs.writeFileSync(p, content, 'utf-8'); }
function replace(p: string, from: string, to: string) {
  let content = read(p);
  if (content.includes(from)) {
    content = content.replace(from, to);
    write(p, content);
    console.log(`  ✓ replaced in ${p}`);
  } else {
    console.log(`  ⚠ pattern not found in ${p}`);
  }
}

console.log('=== Starting patcher ===\n');

// ─── STEP 1: combat.tsx ────────────────────────────────────────────────────
let combat = read('client/src/pages/combat.tsx');

// 1a: Add UNIQUE_ITEMS to import
replace('client/src/pages/combat.tsx',
  'import { ENEMIES, DUNGEONS, ALL_SLOTS, RARITY_COLOR, ITEM_SETS, type GameItem } from "@shared/game-data";',
  'import { ENEMIES, DUNGEONS, ALL_SLOTS, RARITY_COLOR, ITEM_SETS, UNIQUE_ITEMS, type GameItem } from "@shared/game-data";'
);

// 1b: Add parseDungeonStats import
combat = read('client/src/pages/combat.tsx');
combat = combat.replace(
  `import { useGameState, useStartAction, useEnterDungeon } from "@/hooks/use-game";`,
  `import { useGameState, useStartAction, useEnterDungeon } from "@/hooks/use-game";
import { parseDungeonStats } from "@/lib/game-utils";`
);
write('client/src/pages/combat.tsx', combat);

// 1c: Active dungeon combat - show names
combat = read('client/src/pages/combat.tsx');
combat = combat.replace(
  `{activeDungeon.uniqueDropIds.map(uid => (
              <span key={uid} className="text-[11px] px-1.5 py-0.5 rounded border border-orange-400/40 text-orange-300 bg-orange-400/10">✦ 传奇</span>
            ))}`,
  `{activeDungeon.uniqueDropIds.map(uid => {
              const def = UNIQUE_ITEMS.find(u => u.id === uid);
              return def
                ? <span key={uid} className="text-[11px] px-1.5 py-0.5 rounded border border-orange-400/40 text-orange-300 bg-orange-400/8 font-medium">{def.emoji} {def.name}</span>
                : <span key={uid} className="text-[11px] px-1.5 py-0.5 rounded border border-orange-400/40 text-orange-300 bg-orange-400/10">✦ 传奇</span>;
            })}`
);
write('client/src/pages/combat.tsx', combat);

// 1d: Dungeon list - show names
combat = read('client/src/pages/combat.tsx');
combat = combat.replace(
  `{dungeon.uniqueDropIds.map(uid => (
                          <span key={uid} className="text-[11px] px-1.5 py-0.5 rounded border border-orange-400/40 text-orange-300 bg-orange-400/8 font-medium">
                            ✦ 传奇物品
                          </span>
                        ))}`,
  `{dungeon.uniqueDropIds.map(uid => {
                          const def = UNIQUE_ITEMS.find(u => u.id === uid);
                          return def ? (
                            <span key={uid} className="text-[11px] px-1.5 py-0.5 rounded border border-orange-400/40 text-orange-300 bg-orange-400/8 font-medium">
                              {def.emoji} {def.name}
                            </span>
                          ) : (
                            <span key={uid} className="text-[11px] px-1.5 py-0.5 rounded border border-orange-400/40 text-orange-300 bg-orange-400/8 font-medium">
                              ✦ 传奇物品
                            </span>
                          );
                        })}`
);
write('client/src/pages/combat.tsx', combat);

console.log('\n[Step 1] combat.tsx done');

// ─── STEP 2: game-utils.ts — add parseDungeonStats ─────────────────────────
let utils = read('client/src/lib/game-utils.ts');
utils += `

export interface DungeonStat {
  clears: number;
  fastestSec: number | null;
}
export type DungeonStats = Record<string, DungeonStat>;
export function parseDungeonStats(raw: string): DungeonStats {
  try { return JSON.parse(raw) as DungeonStats; } catch { return {}; }
}
`;
write('client/src/lib/game-utils.ts', utils);
console.log('[Step 2] game-utils.ts done');

// ─── STEP 3: schema.ts — add dungeonStats column ───────────────────────────
replace('shared/schema.ts',
  '  lootFilter: text("loot_filter").notNull().default("common"),',
  '  lootFilter: text("loot_filter").notNull().default("common"),\n  // dungeonStats: { [dungeonId]: { clears, fastestSec } }\n  dungeonStats: text("dungeon_stats").notNull().default("{}"),'
);
console.log('[Step 3] schema.ts done');

// ─── STEP 4: server/index.ts — CREATE TABLE dungeon_stats ──────────────────
replace('server/index.ts',
  `      loot_filter TEXT NOT NULL DEFAULT 'common',`,
  `      loot_filter TEXT NOT NULL DEFAULT 'common',
      dungeon_stats TEXT NOT NULL DEFAULT '{}',`
);
console.log('[Step 4] server/index.ts done');

// ─── STEP 5: server/storage.ts — dungeon stats + destroyLoot gold ──────────
let storage = read('server/storage.ts');

// 5a: Add parseDungeonStats helper
storage = storage.replace(
  `function parseGems(raw: string): Record<string, number> {
  try { return JSON.parse(raw) as Record<string, number>; } catch { return {}; }
}`,
  `function parseGems(raw: string): Record<string, number> {
  try { return JSON.parse(raw) as Record<string, number>; } catch { return {}; }
}
function parseDungeonStats(raw: string): Record<string, { clears: number; fastestSec: number | null }> {
  try { return JSON.parse(raw); } catch { return {}; }
}`
);

// 5b: Track dungeon stats on boss kill
storage = storage.replace(
  `      const usedTime = (playerDied || bossKilled) ? elapsedSeconds : ticks * effectiveCombatSpeed;
      const existingLoot = parseLootBag(state.lootBag);
      const combinedLoot = [...existingLoot, ...newDrops].slice(-50);

      const updates: Partial<GameState> = {
        playerHp,
        enemyHp: bossKilled ? dungeon.boss.maxHp : enemyHp,
        gold:        state.gold        + goldGained,
        attackXp:    state.attackXp    + attackXpGained,
        defenceXp:   state.defenceXp   + defenceXpGained,
        hitpointsXp: state.hitpointsXp + hitpointsXpGained,
        lootBag: JSON.stringify(combinedLoot),
        actionUpdatedAt: new Date(new Date(state.actionUpdatedAt).getTime() + usedTime * 1000),
        ...(bossKilled || playerDied ? { activeAction: "idle", enemyHp: -1 } : {}),
      };`,
  `      const usedTime = (playerDied || bossKilled) ? elapsedSeconds : ticks * effectiveCombatSpeed;
      const existingLoot = parseLootBag(state.lootBag);
      const combinedLoot = [...existingLoot, ...newDrops].slice(-50);

      // Track dungeon clear stats
      let dungeonStatsObj = parseDungeonStats(state.dungeonStats);
      if (bossKilled) {
        const dungeonId = DUNGEONS[dungeonIndex].id;
        const current = dungeonStatsObj[dungeonId] ?? { clears: 0, fastestSec: null };
        current.clears = (current.clears ?? 0) + 1;
        if (current.fastestSec === null || usedTime < current.fastestSec) {
          current.fastestSec = usedTime;
        }
        dungeonStatsObj[dungeonId] = current;
      }

      const updates: Partial<GameState> = {
        playerHp,
        enemyHp: bossKilled ? dungeon.boss.maxHp : enemyHp,
        gold:        state.gold        + goldGained,
        attackXp:    state.attackXp    + attackXpGained,
        defenceXp:   state.defenceXp   + defenceXpGained,
        hitpointsXp: state.hitpointsXp + hitpointsXpGained,
        lootBag: JSON.stringify(combinedLoot),
        dungeonStats: JSON.stringify(dungeonStatsObj),
        actionUpdatedAt: new Date(new Date(state.actionUpdatedAt).getTime() + usedTime * 1000),
        ...(bossKilled || playerDied ? { activeAction: "idle", enemyHp: -1 } : {}),
      };`
);

// 5c: destroyLoot gives gold
storage = storage.replace(
  `  async destroyLoot(instanceId: string): Promise<GameState> {
    const state = await this.getGameState();
    const lootBag = parseLootBag(state.lootBag).filter(i => i.instanceId !== instanceId);
    const [updated] = await db.update(gameStates)
      .set({ lootBag: JSON.stringify(lootBag) })
      .where(eq(gameStates.id, state.id)).returning();
    return updated;
  }`,
  `  async destroyLoot(instanceId: string): Promise<GameState> {
    const state = await this.getGameState();
    const lootBag = parseLootBag(state.lootBag);
    const item = lootBag.find(i => i.instanceId === instanceId);
    const goldRefund = item ? (DISENCHANT_GOLD[item.rarity] ?? 5) : 0;
    const filtered = lootBag.filter(i => i.instanceId !== instanceId);
    const [updated] = await db.update(gameStates)
      .set({ lootBag: JSON.stringify(filtered), gold: state.gold + goldRefund })
      .where(eq(gameStates.id, state.id)).returning();
    return updated;
  }`
);

write('server/storage.ts', storage);
console.log('[Step 5] server/storage.ts done');

// ─── STEP 6: inventory.tsx — icons + toggle + gold toast ───────────────────
let inv = read('client/src/pages/inventory.tsx');

// 6a: ItemCard icon size
inv = inv.replace(
  '<span className="w-5 h-5 flex-shrink-0 flex items-center justify-center text-base leading-none">{item.emoji}</span>',
  '<span className="w-6 h-6 flex-shrink-0 flex items-center justify-center text-sm leading-none">{item.emoji}</span>'
);

// 6b: Resource grid icon size
inv = inv.replaceAll(
  'text-3xl mb-1',
  'text-xl mb-0.5'
);

// 6c: Add toggle-all button before resource sections
inv = inv.replace(
  `{/* Gold / Bones */}`,
  `{/* Resource toggle-all */}
      <div className="flex justify-end mb-1">
        <button
          className="text-[10px] h-6 px-2 text-muted-foreground hover:text-foreground rounded border border-border hover:bg-muted/30 transition-colors"
          onClick={() => {
            const allLabels = RESOURCE_SECTIONS.map(s => s.label);
            const anyExpanded = allLabels.some(k => !collapsedSections[k]);
            const next: Record<string, boolean> = {};
            allLabels.forEach(k => { next[k] = anyExpanded; });
            setCollapsedSections(next);
            localStorage.setItem("idlerpg_inventory_collapsed", JSON.stringify(next));
          }}
        >
          {(() => {
            const allLabels = RESOURCE_SECTIONS.map(s => s.label);
            const anyExpanded = allLabels.some(k => !collapsedSections[k]);
            return anyExpanded ? '▲ 全部折叠' : '▼ 全部展开';
          })()}
        </button>
      </div>

      {/* Gold / Bones */}`
);

write('client/src/pages/inventory.tsx', inv);
console.log('[Step 6] inventory.tsx done');

// ─── EXTRA: combat.tsx — dungeon stats display ─────────────────────────────
combat = read('client/src/pages/combat.tsx');

// Add dungeon stats after boss info, before drop preview
combat = combat.replace(
  `                      {/* Drop preview */}`,
  `                      {/* Dungeon clear stats */}
                      {(() => {
                        const stats = parseDungeonStats((gs as any).dungeonStats ?? '{}');
                        const st = stats[dungeon.id];
                        if (!st) return null;
                        return (
                          <div className="flex items-center gap-3 text-[10px] text-muted-foreground mb-2">
                            <span>🏆 通关 {st.clears} 次</span>
                            {st.fastestSec !== null && <span>⏱ 最快 {Math.floor(st.fastestSec)}s</span>}
                          </div>
                        );
                      })()}

                      {/* Drop preview */}`
);

write('client/src/pages/combat.tsx', combat);
console.log('[Extra] combat.tsx dungeon stats display done');

console.log('\n=== All patches applied successfully! ===');
