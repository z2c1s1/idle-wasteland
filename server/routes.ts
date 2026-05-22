import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  app.get(api.game.getState.path, async (_req, res) => {
    try {
      const state = await storage.getGameState();
      res.json(state);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.game.startAction.path, async (req, res) => {
    try {
      const input = api.game.startAction.input.parse(req.body);
      const state = await storage.updateAction(input.action);
      res.json(state);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.game.equip.path, async (req, res) => {
    try {
      const input = api.game.equip.input.parse(req.body);
      const state = await storage.equipItem(input.instanceId, input.itemId);
      res.json(state);
    } catch (err) {
      if (err instanceof Error) return res.status(400).json({ message: err.message });
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.game.unequip.path, async (req, res) => {
    try {
      const input = api.game.unequip.input.parse(req.body);
      const state = await storage.unequipItem(input.slot);
      res.json(state);
    } catch (err) {
      if (err instanceof Error) return res.status(400).json({ message: err.message });
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.game.destroyLoot.path, async (req, res) => {
    try {
      const input = api.game.destroyLoot.input.parse(req.body);
      const state = await storage.destroyLoot(input.instanceId);
      res.json(state);
    } catch (err) {
      if (err instanceof Error) return res.status(400).json({ message: err.message });
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
