import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { postGame } from "@/lib/api";
import type { GameState } from "@shared/schema";

const QUERY_KEY = [api.game.getState.path];

async function fetchGameState() {
  const res = await fetch(api.game.getState.path, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch game state");
  return api.game.getState.responses[200].parse(await res.json());
}

export function useGameState() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchGameState,
    refetchInterval: 2500,
    refetchIntervalInBackground: true,
  });
}

export function useStartAction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (action: string) => {
      const res = await fetch(api.game.startAction.path, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }), credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update action");
      return api.game.startAction.responses[200].parse(await res.json());
    },
    onSuccess: (state) => queryClient.setQueryData(QUERY_KEY, state),
  });
}

export function useEquipItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { instanceId?: string; itemId?: string }) => {
      const res = await fetch(api.game.equip.path, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input), credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Failed to equip" }));
        throw new Error(err.message);
      }
      return api.game.equip.responses[200].parse(await res.json());
    },
    onSuccess: (state) => queryClient.setQueryData(QUERY_KEY, state),
  });
}

export function useUnequipItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (slot: string) => {
      const res = await fetch(api.game.unequip.path, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slot }), credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to unequip");
      return api.game.unequip.responses[200].parse(await res.json());
    },
    onSuccess: (state) => queryClient.setQueryData(QUERY_KEY, state),
  });
}

export function useDestroyLoot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (instanceId: string) => {
      const res = await fetch(api.game.destroyLoot.path, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instanceId }), credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to destroy item");
      return api.game.destroyLoot.responses[200].parse(await res.json());
    },
    onSuccess: (state) => queryClient.setQueryData(QUERY_KEY, state),
  });
}

export function useSocketGem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { instanceId: string; gemKey: string }) => {
      const res = await fetch(api.game.socketGem.path, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input), credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Failed to socket gem" }));
        throw new Error(err.message);
      }
      return api.game.socketGem.responses[200].parse(await res.json());
    },
    onSuccess: (state) => queryClient.setQueryData(QUERY_KEY, state),
  });
}

export function useEnterDungeon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dungeonIndex: number) => {
      const res = await fetch(api.game.enterDungeon.path, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dungeonIndex }), credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "进入副本失败" }));
        throw new Error(err.message);
      }
      return api.game.enterDungeon.responses[200].parse(await res.json());
    },
    onSuccess: (state) => queryClient.setQueryData(QUERY_KEY, state),
  });
}

export function useStartTower() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => postGame(api.game.startTower.path),
    onSuccess: (state) => queryClient.setQueryData(QUERY_KEY, state),
  });
}

export function useStartTrial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => postGame(api.game.startTrial.path),
    onSuccess: (state) => queryClient.setQueryData(QUERY_KEY, state),
  });
}

export function useChooseBuff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (buffId: string) => postGame(api.game.chooseBuff.path, { buffId }),
    onSuccess: (state) => queryClient.setQueryData(QUERY_KEY, state),
  });
}

export function useSetLootFilter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (rarity: string) => postGame(api.game.setLootFilter.path, { rarity }),
    onSuccess: (state) => queryClient.setQueryData(QUERY_KEY, state),
  });
}

function useGameMutation<TInput = void>(fn: (input: TInput) => Promise<GameState>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: (state) => queryClient.setQueryData(QUERY_KEY, state),
  });
}

export const useCookFood = () =>
  useGameMutation((recipeId: string) => postGame(api.game.cook.path, { recipeId }));

export const useBrewPotion = () =>
  useGameMutation((recipeId: string) => postGame(api.game.brew.path, { recipeId }));

export const useGamble = () =>
  useGameMutation((input: { tierIdx: number; slot?: string }) =>
    postGame(api.game.gamble.path, input));

export const useSynthEquip = () =>
  useGameMutation((instanceIds: string[]) =>
    postGame(api.game.synthEquip.path, { instanceIds }));

export const useSynthGem = () =>
  useGameMutation((items: { type: string; quality: string }[]) =>
    postGame(api.game.synthGem.path, { items }));

export const useUnlockTalent = () =>
  useGameMutation((input: { style: "melee" | "ranged" | "magic"; nodeId: string }) =>
    postGame(api.game.unlockTalent.path, input));

export const useResetTalents = () =>
  useGameMutation<void>(() => postGame(api.game.resetTalents.path));

export const useExpandLootBag = () =>
  useGameMutation<void>(() => postGame(api.game.expandLoot.path));

export const useEquipSkill = () =>
  useGameMutation((skillId: string) => postGame(api.game.equipSkill.path, { skillId }));

export const useEnhanceItem = () =>
  useGameMutation((instanceId: string) => postGame(api.game.enhance.path, { instanceId }));
