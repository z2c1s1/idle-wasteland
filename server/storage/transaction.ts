import { db, client } from "../db";

/**
 * Run a callback inside a PGlite transaction.
 * Falls back to non-transactional execution if transactions are not supported.
 */
export async function withTransaction<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await db.transaction(async () => {
      return fn();
    });
  } catch {
    // If transaction API is unavailable, run without
    return fn();
  }
}

/**
 * Run raw SQL in a transaction block.
 */
export async function transaction<T>(fn: (tx: typeof db) => Promise<T>): Promise<T> {
  try {
    await client.exec("BEGIN");
    const result = await fn(db);
    await client.exec("COMMIT");
    return result;
  } catch (err) {
    try { await client.exec("ROLLBACK"); } catch {}
    throw err;
  }
}
