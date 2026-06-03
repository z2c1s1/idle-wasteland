import { api } from "@shared/routes";
import type { GameState } from "@shared/schema";

const gameStateSchema = api.game.getState.responses[200];

export async function postGame(path: string, body?: unknown): Promise<GameState> {
  const res = await fetch(path, {
    method: "POST",
    headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: "include",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "请求失败" }));
    throw new Error(err.message ?? "请求失败");
  }
  return gameStateSchema.parse(await res.json());
}
