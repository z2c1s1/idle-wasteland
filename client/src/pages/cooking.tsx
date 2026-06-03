import { useGameState, useCookFood } from "@/hooks/use-game";
import { COOKING_RECIPES } from "@shared/game-data";
import { useToast } from "@/hooks/use-toast";
import type { GameState } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Soup } from "lucide-react";

export default function Cooking() {
  const { data: state } = useGameState();
  const cookFood = useCookFood();
  const { toast } = useToast();
  if (!state) return null;
  const gs = state as GameState;
  const foods = JSON.parse((gs as any).foods ?? '{}');
  const berries = JSON.parse((gs as any).berries ?? '{}');
  const herbs = JSON.parse((gs as any).herbs ?? '{}');

  const cook = async (id: string) => {
    try {
      await cookFood.mutateAsync(id);
      toast({ title: "烹饪完成" });
    } catch (e: unknown) {
      toast({
        title: "烹饪失败",
        description: e instanceof Error ? e.message : "未知错误",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-4">
      <h1 className="text-xl font-bold flex items-center gap-2"><Soup className="w-5 h-5 text-orange-400" /> 烹饪</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {COOKING_RECIPES.map(r => {
          const have = r.inputs.every(inp => {
            const b = berries[inp.resource] ?? 0;
            const h = herbs[inp.resource] ?? 0;
            const r2 = ((gs as any)[inp.resource]) ?? 0;
            return b + h + r2 >= inp.qty;
          });
          return (
            <div key={r.id} className="bg-card border border-border rounded-xl p-3 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{r.emoji}</span>
                <span className="font-bold text-sm">{r.name}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">材料: {r.inputs.map(i => `${i.resource}×${i.qty}`).join(' + ')}</p>
              <p className="text-xs text-green-300">{r.effect} · {r.durationMin}分钟</p>
              <p className="text-[10px] text-muted-foreground">拥有: {foods[r.id] ?? 0}</p>
              <Button size="sm" disabled={!have} onClick={() => cook(r.id)} className="w-full h-6 text-[10px] bg-orange-600 hover:bg-orange-500">
                {have ? '制作' : '材料不足'}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
