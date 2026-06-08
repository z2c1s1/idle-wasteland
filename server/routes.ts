import type { Express, Request } from "express";
import type { Server } from "http";
import { DatabaseStorage, storageFor } from "./storage";
import { api } from "@shared/routes";

function getStorage(req: Request): DatabaseStorage {
  const playerId = (req.headers["x-player-id"] as string) || "default";
  return storageFor(playerId);
}

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  const g = api.game;

  app.get(g.getState.path, async (req, res) => {
    try { res.json(await getStorage(req).getGameState()); }
    catch (err) { console.error(err); res.status(500).json({ message: "Internal server error" }); }
  });

  function authed<T>(path: string, input: { parse: (body: any) => T }, fn: (s: DatabaseStorage, i: T) => Promise<any>) {
    app.post(path, async (req, res) => {
      try { res.json(await fn(getStorage(req), input.parse(req.body) as T)); }
      catch (e: any) { res.status(400).json({ message: e.message }); }
    });
  }

  authed(g.startAction.path, g.startAction.input, (s, i) => s.updateAction(i.action));
  authed(g.equip.path, g.equip.input, (s, i) => s.equipItem(i.instanceId, i.itemId));
  authed(g.unequip.path, g.unequip.input, (s, i) => s.unequipItem(i.slot));
  authed(g.destroyLoot.path, g.destroyLoot.input, (s, i) => s.destroyLoot(i.instanceId));
  authed(g.socketGem.path, g.socketGem.input, (s, i) => s.socketGem(i.instanceId, i.gemKey));
  authed(g.enterDungeon.path, g.enterDungeon.input, (s, i) => s.enterDungeon(i.dungeonIndex));
  authed(g.setLootFilter.path, g.setLootFilter.input, (s, i) => s.setLootFilter(i.rarity));
  authed(g.equipTool.path, g.equipTool.input, (s, i) => s.equipTool(i.toolId));
  authed(g.addSocket.path, g.addSocket.input, (s, i) => s.addSocket(i.instanceId));
  authed(g.cook.path, g.cook.input, (s, i) => s.cookFood(i.recipeId));
  authed(g.brew.path, g.brew.input, (s, i) => s.brewPotion(i.recipeId));
  authed(g.equipSkill.path, g.equipSkill.input, (s, i) => s.equipSkill(i.skillId));
  authed(g.claimPet.path, g.claimPet.input, (s, i) => s.claimPet(i.achievementId));
  authed(g.buildHomestead.path, g.buildHomestead.input, (s, i) => s.buildHomestead(i.buildingId));
  authed(g.gamble.path, g.gamble.input, (s, i) => s.gambleItem(i.tierIdx, i.slot));
  authed(g.synthEquip.path, g.synthEquip.input, (s, i) => s.synthEquip(i.instanceIds));
  authed(g.synthGem.path, g.synthGem.input, (s, i) => s.synthGem(i.items));
  authed(g.chooseBuff.path, g.chooseBuff.input, (s, i) => s.chooseTrialBuff(i.buffId));
  authed(g.unlockTalent.path, g.unlockTalent.input, (s, i) => s.unlockTalent(i.style, i.nodeId));
  authed(g.addFuel.path, g.addFuel.input, (s, i) => s.addFuel(i.woodTier));
  authed(g.activatePrayer.path, g.activatePrayer.input, (s, i) => s.activatePrayer(i.prayerId));
  authed(g.farmPlant.path, g.farmPlant.input, (s, i) => s.farmPlant(i.slot, i.seed));
  authed(g.farmHarvest.path, g.farmHarvest.input, (s, i) => s.farmHarvest(i.slot));
  authed(g.npcAction.path, g.npcAction.input, (s, i) => s.npcAction(i.npcId, i.actionIndex));
  authed(g.setWorldTier.path, g.setWorldTier.input, (s, i) => s.setWorldTier(i.tier));
  authed(g.gambleSlot.path, g.gambleSlot.input, (s, i) => s.gambleSlot(i.slot, i.cost));
  authed(g.extractPower.path, g.extractPower.input, (s, i) => s.extractPower(i.instanceId));
  authed(g.equipPower.path, g.equipPower.input, (s, i) => s.equipPower(i.slot, i.powerId));
  authed(g.enhance.path, g.enhance.input, (s, i) => s.enhanceItem(i.instanceId));

  // Void returns
  const voidPost = (path: string, fn: (s: DatabaseStorage) => Promise<any>) => {
    app.post(path, async (req, res) => {
      try { res.json(await fn(getStorage(req))); }
      catch (e: any) { res.status(400).json({ message: e.message }); }
    });
  };
  voidPost(g.expandLoot.path, s => s.expandLootBag());
  voidPost(g.startTrial.path, s => s.startTrial());
  voidPost(g.startTower.path, s => s.startTower());
  voidPost(g.resetTalents.path, s => s.resetTalents());
  voidPost(g.deactivatePrayer.path, s => s.deactivatePrayer());
  voidPost(g.getSlayerTask.path, s => s.getSlayerTask());
  voidPost(g.completeSlayerTask.path, s => s.completeSlayerTask());
  voidPost(g.dismissNpc.path, s => s.dismissNpc());

  app.post("/api/game/corrupt", async (req, res) => {
    try { res.json(await getStorage(req).corruptItem(req.body.instanceId)); }
    catch (e: any) { res.status(400).json({ message: e.message }); }
  });
  app.post("/api/game/establish-outpost", async (req, res) => {
    try { res.json(await getStorage(req).establishOutpost(req.body.zoneIndex)); }
    catch (e: any) { res.status(400).json({ message: e.message }); }
  });
  app.post("/api/game/demolish-outpost", async (req, res) => {
    try { res.json(await getStorage(req).demolishOutpost(req.body.zoneIndex)); }
    catch (e: any) { res.status(400).json({ message: e.message }); }
  });
  app.post("/api/game/collect-outposts", async (req, res) => {
    try { res.json(await getStorage(req).collectOutposts()); }
    catch (e: any) { res.status(400).json({ message: e.message }); }
  });
  app.post("/api/game/fast-forward", async (req, res) => {
    try { res.json(await getStorage(req).fastForward(req.body.seconds || 60)); }
    catch (e: any) { res.status(500).json({ message: e.message }); }
  });
  app.get("/api/game/export", async (req, res) => {
    try {
      const state = await getStorage(req).getGameState();
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", "attachment; filename=wasteland-save.json");
      res.json(state);
    } catch (e: any) { res.status(500).json({ message: e.message }); }
  });
  app.post("/api/game/import", async (req, res) => {
    try {
      if (!req.body || typeof req.body !== "object") throw new Error("无效的存档数据");
      res.json(await getStorage(req).importSave(req.body));
    } catch (e: any) { res.status(400).json({ message: e.message }); }
  });

  app.post("/api/game/claim-pet", async (req, res) => {
    try {
      res.json(await getStorage(req).claimPet(req.body.achievementId));
    } catch (e: any) { res.status(400).json({ message: e.message }); }
  });

  return httpServer;
}
