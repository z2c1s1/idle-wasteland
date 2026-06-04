import { api } from "@shared/routes";
import type { GameState } from "@shared/schema";

const gameStateSchema = api.game.getState.responses[200];

// ─── Player ID (localStorage, one per device) ──────────────────────────────

function getPlayerId(): string {
  let id = localStorage.getItem("wasteland_playerId");
  if (!id) {
    id = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("wasteland_playerId", id);
  }
  return id;
}

function playerHeaders(extra?: Record<string, string>): Record<string, string> {
  return { "x-player-id": getPlayerId(), ...extra };
}

// ─── API helpers ────────────────────────────────────────────────────────────

export async function postGame(path: string, body?: unknown): Promise<GameState> {
  const res = await fetch(path, {
    method: "POST",
    headers: playerHeaders(body !== undefined ? { "Content-Type": "application/json" } : undefined),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "请求失败" }));
    throw new Error(err.message ?? "请求失败");
  }
  return gameStateSchema.parse(await res.json());
}

export async function getGame(): Promise<GameState> {
  const res = await fetch(api.game.getState.path, { headers: playerHeaders() });
  if (!res.ok) throw new Error("Failed to fetch game state");
  return gameStateSchema.parse(await res.json());
}

export { getPlayerId };
