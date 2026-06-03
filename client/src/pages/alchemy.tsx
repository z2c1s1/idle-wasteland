import { useGameState, useBrewPotion } from "@/hooks/use-game";
import { POTION_RECIPES } from "@shared/game-data";
import { useToast } from "@/hooks/use-toast";
import type { GameState } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { FlaskConical } from "lucide-react";

export default function Alchemy() {
  const { data: state } = useGameState();
  const brewPotion = useBrewPotion();
  const { toast } = useToast();
  if (!state) return null;
  const gs = state as GameState;
  const potions = JSON.parse((gs as any).potions ?? '{}');
  const herbs = JSON.parse((gs as any).herbs ?? '{}');

  const brew = async (id: string) => {
    try {
      await brewPotion.mutateAsync(id);
      toast({ title: "炼金完成" });
    } catch (e: unknown) {
      toast({
        title: "炼金失败",
        description: e instanceof Error ? e.message : "未知错误",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-4">
      <h1 className="text-xl font-bold flex items-center gap-2"><FlaskConical className="w-5 h-5 text-purple-400" /> 炼金</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {POTION_RECIPES.map(r => {
          const have = r.inputs.every(inp => (herbs[inp.resource] ?? 0) >= inp.qty);
          return (
            <div key={r.id} className="bg-card border border-border rounded-xl p-3 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{r.emoji}</span>
                <span className="font-bold text-sm">{r.name}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">材料: {r.inputs.map(i => `${i.resource}×${i.qty}`).join(' + ')}</p>
              <p className="text-xs text-purple-300">{r.effect}{r.durationMin > 0 ? ` · ${r.durationMin}分钟` : ''}</p>
              <p className="text-[10px] text-muted-foreground">拥有: {potions[r.id] ?? 0}</p>
              <Button size="sm" disabled={!have} onClick={() => brew(r.id)} className="w-full h-6 text-[10px] bg-purple-600 hover:bg-purple-500">
                {have ? '炼制' : '材料不足'}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
