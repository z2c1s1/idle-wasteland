import { z } from 'zod';
import { gameStates } from './schema';

export const api = {
  game: {
    getState: {
      method: 'GET' as const,
      path: '/api/game' as const,
      responses: { 200: z.custom<typeof gameStates.$inferSelect>() },
    },
    startAction: {
      method: 'POST' as const,
      path: '/api/game/action' as const,
      input: z.object({ action: z.string() }),
      responses: {
        200: z.custom<typeof gameStates.$inferSelect>(),
        400: z.object({ message: z.string(), field: z.string().optional() }),
      },
    },
    equip: {
      method: 'POST' as const,
      path: '/api/game/equip' as const,
      // instanceId = dropped item from lootBag, itemId = smithed item from craftItems
      input: z.object({
        instanceId: z.string().optional(),
        itemId: z.string().optional(),
      }),
      responses: { 200: z.custom<typeof gameStates.$inferSelect>() },
    },
    unequip: {
      method: 'POST' as const,
      path: '/api/game/unequip' as const,
      input: z.object({ slot: z.string() }),
      responses: { 200: z.custom<typeof gameStates.$inferSelect>() },
    },
    destroyLoot: {
      method: 'POST' as const,
      path: '/api/game/destroy-loot' as const,
      input: z.object({ instanceId: z.string() }),
      responses: { 200: z.custom<typeof gameStates.$inferSelect>() },
    },
  },
};

export type GameStateResponse = z.infer<typeof api.game.getState.responses[200]>;
export type StartActionInput = z.infer<typeof api.game.startAction.input>;
export type EquipInput = z.infer<typeof api.game.equip.input>;
export type UnequipInput = z.infer<typeof api.game.unequip.input>;
