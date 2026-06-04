import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { registerGamePost, registerGamePostVoid } from "./lib/route-handler";

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  const g = api.game;

  app.get(g.getState.path, async (_req, res) => {
    try {
      res.json(await storage.getGameState());
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  registerGamePost(app, g.startAction.path, g.startAction.input, (input) =>
    storage.updateAction(input.action),
  );
  registerGamePost(app, g.equip.path, g.equip.input, (input) =>
    storage.equipItem(input.instanceId, input.itemId),
  );
  registerGamePost(app, g.unequip.path, g.unequip.input, (input) =>
    storage.unequipItem(input.slot),
  );
  registerGamePost(app, g.destroyLoot.path, g.destroyLoot.input, (input) =>
    storage.destroyLoot(input.instanceId),
  );
  registerGamePost(app, g.socketGem.path, g.socketGem.input, (input) =>
    storage.socketGem(input.instanceId, input.gemKey),
  );
  registerGamePost(app, g.enterDungeon.path, g.enterDungeon.input, (input) =>
    storage.enterDungeon(input.dungeonIndex),
  );
  registerGamePost(app, g.setLootFilter.path, g.setLootFilter.input, (input) =>
    storage.setLootFilter(input.rarity),
  );
  registerGamePost(app, g.equipTool.path, g.equipTool.input, (input) =>
    storage.equipTool(input.toolId),
  );
  registerGamePost(app, g.addSocket.path, g.addSocket.input, (input) =>
    storage.addSocket(input.instanceId),
  );
  registerGamePost(app, g.cook.path, g.cook.input, (input) => storage.cookFood(input.recipeId));
  registerGamePost(app, g.brew.path, g.brew.input, (input) => storage.brewPotion(input.recipeId));
  registerGamePost(app, g.equipSkill.path, g.equipSkill.input, (input) =>
    storage.equipSkill(input.skillId),
  );
  registerGamePost(app, g.claimPet.path, g.claimPet.input, (input) =>
    storage.claimPet(input.achievementId),
  );
  registerGamePost(app, g.buildHomestead.path, g.buildHomestead.input, (input) =>
    storage.buildHomestead(input.buildingId),
  );
  registerGamePostVoid(app, g.expandLoot.path, () => storage.expandLootBag());
  registerGamePost(app, g.gamble.path, g.gamble.input, (input) =>
    storage.gambleItem(input.tierIdx, input.slot),
  );
  registerGamePost(app, g.synthEquip.path, g.synthEquip.input, (input) =>
    storage.synthEquip(input.instanceIds),
  );
  registerGamePost(app, g.synthGem.path, g.synthGem.input, (input) =>
    storage.synthGem(input.items),
  );
  registerGamePostVoid(app, g.startTrial.path, () => storage.startTrial());
  registerGamePost(app, g.chooseBuff.path, g.chooseBuff.input, (input) =>
    storage.chooseTrialBuff(input.buffId),
  );
  registerGamePostVoid(app, g.startTower.path, () => storage.startTower());
  registerGamePostVoid(app, g.resetTalents.path, () => storage.resetTalents());
  registerGamePost(app, g.unlockTalent.path, g.unlockTalent.input, (input) =>
    storage.unlockTalent(input.style, input.nodeId),
  );
  registerGamePost(app, g.addFuel.path, g.addFuel.input, (input) =>
    storage.addFuel(input.woodTier),
  );
  registerGamePost(app, g.activatePrayer.path, g.activatePrayer.input, (input) =>
    storage.activatePrayer(input.prayerId),
  );
  registerGamePostVoid(app, g.deactivatePrayer.path, () => storage.deactivatePrayer());
  registerGamePostVoid(app, g.getSlayerTask.path, () => storage.getSlayerTask());
  registerGamePostVoid(app, g.completeSlayerTask.path, () => storage.completeSlayerTask());
  registerGamePost(app, g.farmPlant.path, g.farmPlant.input, (input) =>
    storage.farmPlant(input.slot, input.seed),
  );
  registerGamePost(app, g.farmHarvest.path, g.farmHarvest.input, (input) =>
    storage.farmHarvest(input.slot),
  );
  registerGamePost(app, g.npcAction.path, g.npcAction.input, (input) =>
    storage.npcAction(input.npcId, input.actionIndex),
  );
  registerGamePostVoid(app, g.dismissNpc.path, () => storage.dismissNpc());

  registerGamePost(app, g.setWorldTier.path, g.setWorldTier.input, (input) =>
    storage.setWorldTier(input.tier),
  );
  registerGamePost(app, g.gambleSlot.path, g.gambleSlot.input, (input) =>
    storage.gambleSlot(input.slot, input.cost),
  );
  registerGamePost(app, g.extractPower.path, g.extractPower.input, (input) =>
    storage.extractPower(input.instanceId),
  );
  registerGamePost(app, g.equipPower.path, g.equipPower.input, (input) =>
    storage.equipPower(input.slot, input.powerId),
  );
  // Corrupt returns {gameState, result}
  app.post("/api/game/corrupt", async (req, res) => {
    try { res.json(await storage.corruptItem(req.body.instanceId)); }
    catch (err: any) { res.status(400).json({ message: err.message }); }
  });
  registerGamePost(app, g.enhance.path, g.enhance.input, (input) =>
    storage.enhanceItem(input.instanceId),
  );

  // Outpost routes
  app.post("/api/game/establish-outpost", async (req, res) => {
    try { res.json(await storage.establishOutpost(req.body.zoneIndex)); }
    catch (err: any) { res.status(400).json({ message: err.message }); }
  });
  app.post("/api/game/demolish-outpost", async (req, res) => {
    try { res.json(await storage.demolishOutpost(req.body.zoneIndex)); }
    catch (err: any) { res.status(400).json({ message: err.message }); }
  });
  app.post("/api/game/collect-outposts", async (_req, res) => {
    try { res.json(await storage.collectOutposts()); }
    catch (err: any) { res.status(400).json({ message: err.message }); }
  });

  // Debug: fast-forward game time
  app.post("/api/game/fast-forward", async (req, res) => {
    try {
      const seconds = req.body.seconds || 60;
      const state = await storage.fastForward(seconds);
      res.json(state);
    } catch (err: any) { res.status(500).json({ message: err.message }); }
  });

  // Export save
  app.get("/api/game/export", async (_req, res) => {
    try {
      const state = await storage.getGameState();
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
      const state = await storage.importSave(imported);
      res.json(state);
    } catch (err: any) { res.status(400).json({ message: err.message }); }
  });

  return httpServer;
}
