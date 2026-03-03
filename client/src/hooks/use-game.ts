import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type GameStateResponse, type StartActionInput } from "@shared/routes";

export function useGameState() {
  return useQuery({
    queryKey: [api.game.getState.path],
    queryFn: async () => {
      const res = await fetch(api.game.getState.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch game state");
      const data = await res.json();
      return api.game.getState.responses[200].parse(data);
    },
    // Required polling per specification
    refetchInterval: 1000,
  });
}

export function useStartAction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (action: StartActionInput['action']) => {
      const payload: StartActionInput = { action };
      const res = await fetch(api.game.startAction.path, {
        method: api.game.startAction.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.game.startAction.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to update action");
      }
      
      return api.game.startAction.responses[200].parse(await res.json());
    },
    onSuccess: (updatedState) => {
      // Optimistically update the cache immediately
      queryClient.setQueryData([api.game.getState.path], updatedState);
    },
  });
}
