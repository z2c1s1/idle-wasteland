// ═══════════════════════════════════════════════════════════════════════════════
// 资源列迁移脚本 — 将所有 wood_0-99 / ore_0-99 / ... 数据复制到 resourceStore
// 运行: npx tsx scripts/migrate-resources.ts
// ═══════════════════════════════════════════════════════════════════════════════

const PREFIXES = ["wood", "ore", "bar", "fish", "hide", "item"];

async function main() {
  const { client } = await import("../server/db");
  const { gameStates } = await import("@shared/schema");
  const { eq } = await import("drizzle-orm");
  const { db } = await import("../server/db");

  const [state] = await db.select().from(gameStates).limit(1);
  if (!state) {
    console.log("No game state found — nothing to migrate.");
    process.exit(0);
  }

  const store: Record<string, Record<number, number>> = {};
  try {
    const existing = JSON.parse((state as any).resourceStore ?? "{}");
    Object.assign(store, existing);
  } catch {}

  let migrated = 0;

  for (const prefix of PREFIXES) {
    if (!store[prefix]) store[prefix] = {};
    for (let tier = 0; tier <= 99; tier++) {
      const colName = `${prefix}_${tier}`;
      const colVal = (state as any)[colName];
      if (typeof colVal === "number" && colVal > 0) {
        store[prefix][tier] = Math.max(store[prefix][tier] ?? 0, colVal);
        migrated++;
      }
    }
  }

  console.log(`Migrated ${migrated} non-zero tier values to resourceStore`);

  await db.update(gameStates)
    .set({ resourceStore: JSON.stringify(store) } as any)
    .where(eq(gameStates.id, state.id));

  console.log("Migration complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
