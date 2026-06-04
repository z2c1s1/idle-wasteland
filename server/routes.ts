import type { Express, Request } from "express";
import type { Server } from "http";
import { DatabaseStorage, storageFor } from "./storage";
import { api } from "@shared/routes";
import { registerGamePost, registerGamePostVoid } from "./lib/route-handler";

function getStorage(req: Request): DatabaseStorage {
  const sessionId = req.sessionID || "default";
  return storageFor(sessionId);
}

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  const g = api.game;

  app.get(g.getState.path, async (req, res) => {
    try {
      res.json(await getStorage(req).getGameState());
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Helper: wraps route registration to use per-session storage
  function registerAuthedPost<T>(path: string, input: { parse: (body: any) => T }, fn: (storage: DatabaseStorage, input: T) => Promise<any>) {
    app.post(path, async (req, res) => {
      try {
        const parsed = input.parse(req.body) as T;
        res.json(await fn(getStorage(req), parsed));
      } catch (err: any) {
        res.status(400).json({ message: err.message });
      }
    });
  }

  registerAuthedPost(g.startAction.path, g.startAction.input, (s, i) => s.updateAction(i.action));
  registerAuthedPost(g.equip.path, g.equip.input, (s, i) => s.equipItem(i.instanceId, i.itemId));
  registerAuthedPost(g.unequip.path, g.unequip.input, (s, i) => s.unequipItem(i.slot));
  registerAuthedPost(g.destroyLoot.path, g.destroyLoot.input, (s, i) => s.destroyLoot(i.instanceId));
  registerAuthedPost(g.socketGem.path, g.socketGem.input, (s, i) => s.socketGem(i.instanceId, i.gemKey));
  registerAuthedPost(g.enterDungeon.path, g.enterDungeon.input, (s, i) => s.enterDungeon(i.dungeonIndex));
  registerAuthedPost(g.setLootFilter.path, g.setLootFilter.input, (s, i) => s.setLootFilter(i.rarity));
  registerAuthedPost(g.equipTool.path, g.equipTool.input, (s, i) => s.equipTool(i.toolId));
  registerAuthedPost(g.addSocket.path, g.addSocket.input, (s, i) => s.addSocket(i.instanceId));
  registerAuthedPost(g.cook.path, g.cook.input, (s, i) => s.cookFood(i.recipeId));
  registerAuthedPost(g.brew.path, g.brew.input, (s, i) => s.brewPotion(i.recipeId));
  registerAuthedPost(g.equipSkill.path, g.equipSkill.input, (s, i) => s.equipSkill(i.skillId));
  registerAuthedPost(g.claimPet.path, g.claimPet.input, (s, i) => s.claimPet(i.achievementId));
  registerAuthedPost(g.buildHomestead.path, g.buildHomestead.input, (s, i) => s.buildHomestead(i.buildingId));
  registerAuthedPost(g.gamble.path, g.gamble.input, (s, i) => s.gambleItem(i.tierIdx, i.slot));
  registerAuthedPost(g.synthEquip.path, g.synthEquip.input, (s, i) => s.synthEquip(i.instanceIds));
  registerAuthedPost(g.synthGem.path, g.synthGem.input, (s, i) => s.synthGem(i.items));
  registerAuthedPost(g.chooseBuff.path, g.chooseBuff.input, (s, i) => s.chooseTrialBuff(i.buffId));
  registerAuthedPost(g.unlockTalent.path, g.unlockTalent.input, (s, i) => s.unlockTalent(i.style, i.nodeId));
  registerAuthedPost(g.addFuel.path, g.addFuel.input, (s, i) => s.addFuel(i.woodTier));
  registerAuthedPost(g.activatePrayer.path, g.activatePrayer.input, (s, i) => s.activatePrayer(i.prayerId));
  registerAuthedPost(g.farmPlant.path, g.farmPlant.input, (s, i) => s.farmPlant(i.slot, i.seed));
  registerAuthedPost(g.farmHarvest.path, g.farmHarvest.input, (s, i) => s.farmHarvest(i.slot));
  registerAuthedPost(g.npcAction.path, g.npcAction.input, (s, i) => s.npcAction(i.npcId, i.actionIndex));
  registerAuthedPost(g.setWorldTier.path, g.setWorldTier.input, (s, i) => s.setWorldTier(i.tier));
  registerAuthedPost(g.gambleSlot.path, g.gambleSlot.input, (s, i) => s.gambleSlot(i.slot, i.cost));
  registerAuthedPost(g.extractPower.path, g.extractPower.input, (s, i) => s.extractPower(i.instanceId));
  registerAuthedPost(g.equipPower.path, g.equipPower.input, (s, i) => s.equipPower(i.slot, i.powerId));
  registerAuthedPost(g.enhance.path, g.enhance.input, (s, i) => s.enhanceItem(i.instanceId));

  // Void returns
  app.post(g.expandLoot.path, async (req, res) => {
    try { res.json(await getStorage(req).expandLootBag()); }
    catch (e: any) { res.status(400).json({ message: e.message }); }
  });
  app.post(g.startTrial.path, async (req, res) => {
    try { res.json(await getStorage(req).startTrial()); }
    catch (e: any) { res.status(400).json({ message: e.message }); }
  });
  app.post(g.startTower.path, async (req, res) => {
    try { res.json(await getStorage(req).startTower()); }
    catch (e: any) { res.status(400).json({ message: e.message }); }
  });
  app.post(g.resetTalents.path, async (req, res) => {
    try { res.json(await getStorage(req).resetTalents()); }
    catch (e: any) { res.status(400).json({ message: e.message }); }
  });
  app.post(g.deactivatePrayer.path, async (req, res) => {
    try { res.json(await getStorage(req).deactivatePrayer()); }
    catch (e: any) { res.status(400).json({ message: e.message }); }
  });
  app.post(g.getSlayerTask.path, async (req, res) => {
    try { res.json(await getStorage(req).getSlayerTask()); }
    catch (e: any) { res.status(400).json({ message: e.message }); }
  });
  app.post(g.completeSlayerTask.path, async (req, res) => {
    try { res.json(await getStorage(req).completeSlayerTask()); }
    catch (e: any) { res.status(400).json({ message: e.message }); }
  });
  app.post(g.dismissNpc.path, async (req, res) => {
    try { res.json(await getStorage(req).dismissNpc()); }
    catch (e: any) { res.status(400).json({ message: e.message }); }
  });

  // Corrupt returns {gameState, result}
  app.post("/api/game/corrupt", async (req, res) => {
    try { res.json(await getStorage(req).corruptItem(req.body.instanceId)); }
    catch (err: any) { res.status(400).json({ message: err.message }); }
  });

  // Outpost routes
  app.post("/api/game/establish-outpost", async (req, res) => {
    try { res.json(await getStorage(req).establishOutpost(req.body.zoneIndex)); }
    catch (err: any) { res.status(400).json({ message: err.message }); }
  });
  app.post("/api/game/demolish-outpost", async (req, res) => {
    try { res.json(await getStorage(req).demolishOutpost(req.body.zoneIndex)); }
    catch (err: any) { res.status(400).json({ message: err.message }); }
  });
  app.post("/api/game/collect-outposts", async (req, res) => {
    try { res.json(await getStorage(req).collectOutposts()); }
    catch (err: any) { res.status(400).json({ message: err.message }); }
  });

  // Fast-forward
  app.post("/api/game/fast-forward", async (req, res) => {
    try {
      const state = await getStorage(req).fastForward(req.body.seconds || 60);
      res.json(state);
    } catch (err: any) { res.status(500).json({ message: err.message }); }
  });

  // Export save
  app.get("/api/game/export", async (req, res) => {
    try {
      const state = await getStorage(req).getGameState();
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", "attachment; filename=wasteland-save.json");
      res.json(state);
    } catch (err: any) { res.status(500).json({ message: err.message }); }
  });

  // Import save
  app.post("/api/game/import", async (req, res) => {
    try {
      const imported = req.body;
      if (!imported || typeof imported !== "object") throw new Error("无效的存档数据");
      const state = await getStorage(req).importSave(imported);
      res.json(state);
    } catch (err: any) { res.status(400).json({ message: err.message }); }
  });

  return httpServer;
}
