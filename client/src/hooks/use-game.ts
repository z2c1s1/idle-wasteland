import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";

const QUERY_KEY = [api.game.getState.path];

async function fetchGameState() {
  const res = await fetch(api.game.getState.path, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch game state");
  return api.game.getState.responses[200].parse(await res.json());
}

export function useGameState() {
  return useQuery({ queryKey: QUERY_KEY, queryFn: fetchGameState, refetchInterval: 1000 });
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

export function useSetLootFilter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (rarity: string) => {
      const res = await fetch(api.game.setLootFilter.path, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rarity }), credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update loot filter");
      return api.game.setLootFilter.responses[200].parse(await res.json());
    },
    onSuccess: (state) => queryClient.setQueryData(QUERY_KEY, state),
  });
}
