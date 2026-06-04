import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import os from "os";
import { client } from "./db";
import { ensurePlayerColumn } from "./storage";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (req.path.startsWith("/api")) {
      log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
    }
  });
  next();
});

// ─── Create table on startup ─────────────────────────────────────────────────
async function initDatabase() {
  await client.exec(`
    CREATE TABLE IF NOT EXISTS game_states (
      id SERIAL PRIMARY KEY,
      active_action TEXT NOT NULL DEFAULT 'idle',
      action_updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
      woodcutting_xp INTEGER NOT NULL DEFAULT 0,
      mining_xp INTEGER NOT NULL DEFAULT 0,
      smelting_xp INTEGER NOT NULL DEFAULT 0,
      fishing_xp INTEGER NOT NULL DEFAULT 0,
      hunting_xp INTEGER NOT NULL DEFAULT 0,
      crafting_xp INTEGER NOT NULL DEFAULT 0,
      attack_xp INTEGER NOT NULL DEFAULT 0,
      strength_xp INTEGER NOT NULL DEFAULT 0,
      defence_xp INTEGER NOT NULL DEFAULT 0,
      hitpoints_xp INTEGER NOT NULL DEFAULT 0,
      smithing_xp INTEGER NOT NULL DEFAULT 0,
      leatherworking_xp INTEGER NOT NULL DEFAULT 0,
      jewelcrafting_xp INTEGER NOT NULL DEFAULT 0,
      thieving_xp INTEGER NOT NULL DEFAULT 0,
      agility_xp INTEGER NOT NULL DEFAULT 0,
      ranged_xp INTEGER NOT NULL DEFAULT 0,
      magic_xp INTEGER NOT NULL DEFAULT 0,
      player_hp INTEGER NOT NULL DEFAULT -1,
      enemy_hp INTEGER NOT NULL DEFAULT -1,
      gold INTEGER NOT NULL DEFAULT 0,
      bones INTEGER NOT NULL DEFAULT 0,
      dragon_bones INTEGER NOT NULL DEFAULT 0,
      equipment TEXT NOT NULL DEFAULT '{}',
      craft_items TEXT NOT NULL DEFAULT '{}',
      loot_bag TEXT NOT NULL DEFAULT '[]',
      gems TEXT NOT NULL DEFAULT '{}',
      loot_filter TEXT NOT NULL DEFAULT 'common',
      dungeon_stats TEXT NOT NULL DEFAULT '{}',
      tool TEXT NOT NULL DEFAULT '{}',
      talents TEXT NOT NULL DEFAULT '{}',
      speed_mult INTEGER NOT NULL DEFAULT 1,
      tower_floor INTEGER NOT NULL DEFAULT 0,
      tower_key INTEGER NOT NULL DEFAULT 0,
      trial_key INTEGER NOT NULL DEFAULT 0,
      trial_buffs TEXT NOT NULL DEFAULT '[]',
      trial_curses TEXT NOT NULL DEFAULT '[]',
      synthesis_xp INTEGER NOT NULL DEFAULT 0,
      loot_bag_size INTEGER NOT NULL DEFAULT 50,
      homestead TEXT NOT NULL DEFAULT '{}',
      temperature INTEGER NOT NULL DEFAULT 0,
      fuel_ends_at TIMESTAMP,
      stone INTEGER NOT NULL DEFAULT 0,
      achievements TEXT NOT NULL DEFAULT '{}',
      pets TEXT NOT NULL DEFAULT '[]',
      foods TEXT NOT NULL DEFAULT '{}',
      potions TEXT NOT NULL DEFAULT '{}',
      herbs TEXT NOT NULL DEFAULT '{}',
      berries TEXT NOT NULL DEFAULT '{}',
      farms TEXT NOT NULL DEFAULT '{}',
      companions TEXT NOT NULL DEFAULT '[]',
      outposts TEXT NOT NULL DEFAULT '[]',
      npc_encounter TEXT,
      mastery TEXT NOT NULL DEFAULT '{}',
      exploration_xp INTEGER NOT NULL DEFAULT 0,
      active_buffs TEXT NOT NULL DEFAULT '[]',
      equipped_skill TEXT NOT NULL DEFAULT '',
      active_prayer TEXT NOT NULL DEFAULT '',
      prayer_xp INTEGER NOT NULL DEFAULT 0,
      prayer_started_at TIMESTAMP,
      slayer_task TEXT,
      slayer_streak INTEGER NOT NULL DEFAULT 0,
      enemy_qty INTEGER NOT NULL DEFAULT 1,
      wood_0 INTEGER NOT NULL DEFAULT 0, wood_1 INTEGER NOT NULL DEFAULT 0,
      wood_2 INTEGER NOT NULL DEFAULT 0, wood_3 INTEGER NOT NULL DEFAULT 0,
      wood_4 INTEGER NOT NULL DEFAULT 0, wood_5 INTEGER NOT NULL DEFAULT 0,
      wood_6 INTEGER NOT NULL DEFAULT 0, wood_7 INTEGER NOT NULL DEFAULT 0,
      wood_8 INTEGER NOT NULL DEFAULT 0, wood_9 INTEGER NOT NULL DEFAULT 0,
      ore_0 INTEGER NOT NULL DEFAULT 0, ore_1 INTEGER NOT NULL DEFAULT 0,
      ore_2 INTEGER NOT NULL DEFAULT 0, ore_3 INTEGER NOT NULL DEFAULT 0,
      ore_4 INTEGER NOT NULL DEFAULT 0, ore_5 INTEGER NOT NULL DEFAULT 0,
      ore_6 INTEGER NOT NULL DEFAULT 0, ore_7 INTEGER NOT NULL DEFAULT 0,
      ore_8 INTEGER NOT NULL DEFAULT 0, ore_9 INTEGER NOT NULL DEFAULT 0,
      bar_0 INTEGER NOT NULL DEFAULT 0, bar_1 INTEGER NOT NULL DEFAULT 0,
      bar_2 INTEGER NOT NULL DEFAULT 0, bar_3 INTEGER NOT NULL DEFAULT 0,
      bar_4 INTEGER NOT NULL DEFAULT 0, bar_5 INTEGER NOT NULL DEFAULT 0,
      bar_6 INTEGER NOT NULL DEFAULT 0, bar_7 INTEGER NOT NULL DEFAULT 0,
      bar_8 INTEGER NOT NULL DEFAULT 0, bar_9 INTEGER NOT NULL DEFAULT 0,
      fish_0 INTEGER NOT NULL DEFAULT 0, fish_1 INTEGER NOT NULL DEFAULT 0,
      fish_2 INTEGER NOT NULL DEFAULT 0, fish_3 INTEGER NOT NULL DEFAULT 0,
      fish_4 INTEGER NOT NULL DEFAULT 0, fish_5 INTEGER NOT NULL DEFAULT 0,
      fish_6 INTEGER NOT NULL DEFAULT 0, fish_7 INTEGER NOT NULL DEFAULT 0,
      fish_8 INTEGER NOT NULL DEFAULT 0, fish_9 INTEGER NOT NULL DEFAULT 0,
      hide_0 INTEGER NOT NULL DEFAULT 0, hide_1 INTEGER NOT NULL DEFAULT 0,
      hide_2 INTEGER NOT NULL DEFAULT 0, hide_3 INTEGER NOT NULL DEFAULT 0,
      hide_4 INTEGER NOT NULL DEFAULT 0, hide_5 INTEGER NOT NULL DEFAULT 0,
      hide_6 INTEGER NOT NULL DEFAULT 0, hide_7 INTEGER NOT NULL DEFAULT 0,
      hide_8 INTEGER NOT NULL DEFAULT 0, hide_9 INTEGER NOT NULL DEFAULT 0,
      item_0 INTEGER NOT NULL DEFAULT 0, item_1 INTEGER NOT NULL DEFAULT 0,
      item_2 INTEGER NOT NULL DEFAULT 0, item_3 INTEGER NOT NULL DEFAULT 0,
      item_4 INTEGER NOT NULL DEFAULT 0, item_5 INTEGER NOT NULL DEFAULT 0,
      item_6 INTEGER NOT NULL DEFAULT 0, item_7 INTEGER NOT NULL DEFAULT 0,
      item_8 INTEGER NOT NULL DEFAULT 0, item_9 INTEGER NOT NULL DEFAULT 0,
      resource_store TEXT NOT NULL DEFAULT '{}'
    );
  `);

  const migrations = [
    `ALTER TABLE game_states ADD COLUMN agility_xp INTEGER NOT NULL DEFAULT 0`,
    `ALTER TABLE game_states ADD COLUMN temperature INTEGER NOT NULL DEFAULT 0`,
    `ALTER TABLE game_states ADD COLUMN fuel_ends_at TIMESTAMP`,
    `ALTER TABLE game_states ADD COLUMN active_prayer TEXT NOT NULL DEFAULT ''`,
    `ALTER TABLE game_states ADD COLUMN prayer_xp INTEGER NOT NULL DEFAULT 0`,
    `ALTER TABLE game_states ADD COLUMN prayer_started_at TIMESTAMP`,
    `ALTER TABLE game_states ADD COLUMN slayer_task TEXT`,
    `ALTER TABLE game_states ADD COLUMN slayer_streak INTEGER NOT NULL DEFAULT 0`,
    `ALTER TABLE game_states ADD COLUMN farms TEXT NOT NULL DEFAULT '{}'`,
    `ALTER TABLE game_states ADD COLUMN npc_encounter TEXT`,
    `ALTER TABLE game_states ADD COLUMN mastery TEXT NOT NULL DEFAULT '{}'`,
    `ALTER TABLE game_states ADD COLUMN exploration_xp INTEGER NOT NULL DEFAULT 0`,
    `ALTER TABLE game_states ADD COLUMN companions TEXT NOT NULL DEFAULT '[]'`,
    `ALTER TABLE game_states ADD COLUMN outposts TEXT NOT NULL DEFAULT '[]'`,
    `ALTER TABLE game_states ADD COLUMN world_tier INTEGER NOT NULL DEFAULT 1`,
    `ALTER TABLE game_states ADD COLUMN tier_boss_killed TEXT NOT NULL DEFAULT '[]'`,
    `ALTER TABLE game_states ADD COLUMN extracted_powers TEXT NOT NULL DEFAULT '[]'`,
    `ALTER TABLE game_states ADD COLUMN active_powers TEXT NOT NULL DEFAULT '["","",""]'`,
    `ALTER TABLE game_states ADD COLUMN blood_shards INTEGER NOT NULL DEFAULT 0`,
  ];
  for (const sql of migrations) {
    try { await client.exec(sql); } catch { /* already exists */ }
  }

  // Auto-migrate player_id column (safe, preserves old data)
  await ensurePlayerColumn();

  log("Database initialized");
}

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err: any) => {
  if (err?.code === 'EADDRINUSE') {
    console.error('Port already in use — exiting');
    process.exit(1);
  }
  console.error('Uncaught Exception:', err.message);
});

(async () => {
  await initDatabase();
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) return next(err);
    return res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
  });

  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  const port = parseInt(process.env.PORT || "5001", 10);
  const host = (process.env.HOST || "").trim() || "127.0.0.1";
  httpServer.listen({ port, host }, () => {
    log(`serving on http://localhost:${port}`);
    if (host === "0.0.0.0") {
      for (const lanUrl of getLanUrls(port)) {
        log(`内网访问: ${lanUrl}`, "intranet");
      }
    }
  });
})();

function getLanUrls(port: number): string[] {
  const urls: string[] = [];
  for (const ifaces of Object.values(os.networkInterfaces())) {
    for (const iface of ifaces ?? []) {
      if ((iface.family === "IPv4" || String(iface.family) === "4") && !iface.internal) {
        urls.push(`http://${iface.address}:${port}`);
      }
    }
  }
  return urls;
}
