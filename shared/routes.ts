import { z } from "zod";
import { gameStates } from "./schema";

const gameStateResponse = z.custom<typeof gameStates.$inferSelect>();
const postOk = { 200: gameStateResponse };
const postErr = {
  200: gameStateResponse,
  400: z.object({ message: z.string() }),
};

const gemSynthItem = z.object({
  type: z.string().min(1),
  quality: z.string().min(1),
});

export const api = {
  game: {
    getState: {
      method: "GET" as const,
      path: "/api/game" as const,
      responses: { 200: gameStateResponse },
    },
    startAction: {
      method: "POST" as const,
      path: "/api/game/action" as const,
      input: z.object({ action: z.string().min(1) }),
      responses: postErr,
    },
    equip: {
      method: "POST" as const,
      path: "/api/game/equip" as const,
      input: z.object({
        instanceId: z.string().optional(),
        itemId: z.string().optional(),
      }),
      responses: postErr,
    },
    unequip: {
      method: "POST" as const,
      path: "/api/game/unequip" as const,
      input: z.object({ slot: z.string().min(1) }),
      responses: postErr,
    },
    destroyLoot: {
      method: "POST" as const,
      path: "/api/game/destroy-loot" as const,
      input: z.object({ instanceId: z.string().min(1) }),
      responses: postErr,
    },
    socketGem: {
      method: "POST" as const,
      path: "/api/game/socket-gem" as const,
      input: z.object({ instanceId: z.string().min(1), gemKey: z.string().min(1) }),
      responses: postErr,
    },
    enterDungeon: {
      method: "POST" as const,
      path: "/api/game/enter-dungeon" as const,
      input: z.object({ dungeonIndex: z.number().int().min(0) }),
      responses: postErr,
    },
    setLootFilter: {
      method: "POST" as const,
      path: "/api/game/loot-filter" as const,
      input: z.object({
        rarity: z.enum(["common", "uncommon", "rare", "epic", "legendary"]),
      }),
      responses: postErr,
    },
    equipTool: {
      method: "POST" as const,
      path: "/api/game/equip-tool" as const,
      input: z.object({ toolId: z.string().min(1) }),
      responses: postErr,
    },
    addSocket: {
      method: "POST" as const,
      path: "/api/game/add-socket" as const,
      input: z.object({ instanceId: z.string().min(1) }),
      responses: postErr,
    },
    cook: {
      method: "POST" as const,
      path: "/api/game/cook" as const,
      input: z.object({ recipeId: z.string().min(1) }),
      responses: postErr,
    },
    brew: {
      method: "POST" as const,
      path: "/api/game/brew" as const,
      input: z.object({ recipeId: z.string().min(1) }),
      responses: postErr,
    },
    equipSkill: {
      method: "POST" as const,
      path: "/api/game/equip-skill" as const,
      input: z.object({ skillId: z.string().min(1, "技能ID不能为空") }),
      responses: postErr,
    },
    claimPet: {
      method: "POST" as const,
      path: "/api/game/claim-pet" as const,
      input: z.object({ achievementId: z.string().min(1) }),
      responses: postErr,
    },
    buildHomestead: {
      method: "POST" as const,
      path: "/api/game/build-homestead" as const,
      input: z.object({ buildingId: z.string().min(1) }),
      responses: postErr,
    },
    expandLoot: {
      method: "POST" as const,
      path: "/api/game/expand-loot" as const,
      input: z.object({}).optional(),
      responses: postErr,
    },
    gamble: {
      method: "POST" as const,
      path: "/api/game/gamble" as const,
      input: z.object({
        tierIdx: z.number().int().min(0),
        slot: z.string().optional(),
      }),
      responses: postErr,
    },
    synthEquip: {
      method: "POST" as const,
      path: "/api/game/synth-equip" as const,
      input: z.object({ instanceIds: z.array(z.string().min(1)).min(2) }),
      responses: postErr,
    },
    synthGem: {
      method: "POST" as const,
      path: "/api/game/synth-gem" as const,
      input: z.object({ items: z.array(gemSynthItem).min(3).max(5) }),
      responses: postErr,
    },
    startTrial: {
      method: "POST" as const,
      path: "/api/game/start-trial" as const,
      input: z.object({}).optional(),
      responses: postErr,
    },
    chooseBuff: {
      method: "POST" as const,
      path: "/api/game/choose-buff" as const,
      input: z.object({ buffId: z.string().min(1) }),
      responses: postErr,
    },
    startTower: {
      method: "POST" as const,
      path: "/api/game/start-tower" as const,
      input: z.object({}).optional(),
      responses: postErr,
    },
    resetTalents: {
      method: "POST" as const,
      path: "/api/game/reset-talents" as const,
      input: z.object({}).optional(),
      responses: postErr,
    },
    unlockTalent: {
      method: "POST" as const,
      path: "/api/game/unlock-talent" as const,
      input: z.object({
        style: z.enum(["melee", "ranged", "magic"]),
        nodeId: z.string().min(1),
      }),
      responses: postErr,
    },
    addFuel: {
      method: "POST" as const,
      path: "/api/game/add-fuel" as const,
      input: z.object({ woodTier: z.number().int().min(0).max(98) }),
      responses: postErr,
    },
    activatePrayer: {
      method: "POST" as const,
      path: "/api/game/activate-prayer" as const,
      input: z.object({ prayerId: z.string().min(1) }),
      responses: postErr,
    },
    deactivatePrayer: {
      method: "POST" as const,
      path: "/api/game/deactivate-prayer" as const,
      input: z.object({}).optional(),
      responses: postErr,
    },
    getSlayerTask: {
      method: "POST" as const,
      path: "/api/game/slayer-task" as const,
      input: z.object({}).optional(),
      responses: postErr,
    },
    completeSlayerTask: {
      method: "POST" as const,
      path: "/api/game/slayer-complete" as const,
      input: z.object({}).optional(),
      responses: postErr,
    },
    farmPlant: {
      method: "POST" as const,
      path: "/api/game/farm-plant" as const,
      input: z.object({ slot: z.number().int().min(0).max(19), seed: z.string().min(1) }),
      responses: postErr,
    },
    farmHarvest: {
      method: "POST" as const,
      path: "/api/game/farm-harvest" as const,
      input: z.object({ slot: z.number().int().min(0).max(19) }),
      responses: postErr,
    },
    npcAction: {
      method: "POST" as const,
      path: "/api/game/npc-action" as const,
      input: z.object({ npcId: z.string().min(1), actionIndex: z.number().int().min(0) }),
      responses: postErr,
    },
    dismissNpc: {
      method: "POST" as const,
      path: "/api/game/dismiss-npc" as const,
      input: z.object({}).optional(),
      responses: postErr,
    },
    setWorldTier: {
      method: "POST" as const,
      path: "/api/game/set-world-tier" as const,
      input: z.object({ tier: z.number().int().min(1).max(4) }),
      responses: postErr,
    },
    enhance: {
      method: "POST" as const,
      path: "/api/game/enhance" as const,
      input: z.object({ instanceId: z.string().min(1) }),
      responses: postErr,
    },
  },
} as const;

export type GameStateResponse = z.infer<typeof api.game.getState.responses[200]>;
export type StartActionInput = z.infer<typeof api.game.startAction.input>;
export type EquipInput = z.infer<typeof api.game.equip.input>;
export type UnequipInput = z.infer<typeof api.game.unequip.input>;
