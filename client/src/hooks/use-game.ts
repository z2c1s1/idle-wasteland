import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { postGame, getGame, getPlayerId } from "@/lib/api";
import type { GameState } from "@shared/schema";

const QUERY_KEY = [api.game.getState.path];

export function useGameState() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: getGame,
    refetchInterval: 2500,
    refetchIntervalInBackground: true,
  });
}

export function useStartAction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (action: string) => postGame(api.game.startAction.path, { action }),
    onSuccess: (state) => queryClient.setQueryData(QUERY_KEY, state),
    onError: (err: any) => {
      console.error("Start action failed:", err?.message ?? err);
    },
  });
}

export function useEquipItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { instanceId?: string; itemId?: string }) => postGame(api.game.equip.path, input),
    onSuccess: (state) => queryClient.setQueryData(QUERY_KEY, state),
  });
}

export function useUnequipItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slot: string) => postGame(api.game.unequip.path, { slot }),
    onSuccess: (state) => queryClient.setQueryData(QUERY_KEY, state),
  });
}

export function useDestroyLoot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (instanceId: string) => postGame(api.game.destroyLoot.path, { instanceId }),
    onSuccess: (state) => queryClient.setQueryData(QUERY_KEY, state),
  });
}

export function useSocketGem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { instanceId: string; gemKey: string }) => postGame(api.game.socketGem.path, input),
    onSuccess: (state) => queryClient.setQueryData(QUERY_KEY, state),
  });
}

export function useEnterDungeon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dungeonIndex: number) => postGame(api.game.enterDungeon.path, { dungeonIndex }),
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
    onError: (err: any) => {
      console.error("Game mutation failed:", err);
    },
  });
}

export const useCookFood = () =>
  useGameMutation((recipeId: string) => postGame(api.game.cook.path, { recipeId }));
export const useBrewPotion = () =>
  useGameMutation((recipeId: string) => postGame(api.game.brew.path, { recipeId }));
export const useGamble = () =>
  useGameMutation((input: { tierIdx: number; slot?: string }) => postGame(api.game.gamble.path, input));
export const useSynthEquip = () =>
  useGameMutation((instanceIds: string[]) => postGame(api.game.synthEquip.path, { instanceIds }));
export const useSynthGem = () =>
  useGameMutation((items: { type: string; quality: string }[]) => postGame(api.game.synthGem.path, { items }));
export const useUnlockTalent = () =>
  useGameMutation((input: { style: "melee" | "ranged" | "magic"; nodeId: string }) => postGame(api.game.unlockTalent.path, input));
export const useResetTalents = () =>
  useGameMutation<void>(() => postGame(api.game.resetTalents.path));
export const useExpandLootBag = () =>
  useGameMutation<void>(() => postGame(api.game.expandLoot.path));
export const useEquipSkill = () =>
  useGameMutation((skillId: string) => postGame(api.game.equipSkill.path, { skillId }));
export const useEnhanceItem = () =>
  useGameMutation((instanceId: string) => postGame(api.game.enhance.path, { instanceId }));
