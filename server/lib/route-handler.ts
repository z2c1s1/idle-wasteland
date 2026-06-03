import type { Express, Request, Response } from "express";
import { z } from "zod";
import type { GameState } from "@shared/schema";

type GameHandler<T> = (input: T) => Promise<GameState>;
type GameHandlerVoid = () => Promise<GameState>;

function sendError(res: Response, err: unknown) {
  if (err instanceof z.ZodError) {
    return res.status(400).json({ message: err.errors[0]?.message ?? "Invalid input" });
  }
  if (err instanceof Error) {
    return res.status(400).json({ message: err.message });
  }
  console.error(err);
  return res.status(500).json({ message: "Internal server error" });
}

export function registerGamePost<T extends z.ZodType>(
  app: Express,
  path: string,
  schema: T,
  handler: GameHandler<z.infer<T>>,
) {
  app.post(path, async (req: Request, res: Response) => {
    try {
      const input = schema.parse(req.body ?? {});
      const state = await handler(input);
      res.json(state);
    } catch (err) {
      sendError(res, err);
    }
  });
}

export function registerGamePostVoid(app: Express, path: string, handler: GameHandlerVoid) {
  app.post(path, async (_req: Request, res: Response) => {
    try {
      const state = await handler();
      res.json(state);
    } catch (err) {
      sendError(res, err);
    }
  });
}
