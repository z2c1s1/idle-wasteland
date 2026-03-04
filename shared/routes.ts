import { z } from 'zod';
import { gameStates } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  game: {
    getState: {
      method: 'GET' as const,
      path: '/api/game' as const,
      responses: {
        200: z.custom<typeof gameStates.$inferSelect>(),
      },
    },
    startAction: {
      method: 'POST' as const,
      path: '/api/game/action' as const,
      input: z.object({
        action: z.string(),
      }),
      responses: {
        200: z.custom<typeof gameStates.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type GameStateResponse = z.infer<typeof api.game.getState.responses[200]>;
export type StartActionInput = z.infer<typeof api.game.startAction.input>;
