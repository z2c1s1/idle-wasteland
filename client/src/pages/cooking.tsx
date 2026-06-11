import { useGameState, useCookFood } from "@/hooks/use-game";
import { COOKING_RECIPES } from "@shared/game-data";
import { safeJsonRecord, safeJsonArray } from "@shared/safe-parse";
import { useToast } from "@/hooks/use-toast";
import type { GameState } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Soup, Heart } from "lucide-react";
import { useUIText } from "@/lib/i18n";
import { getResourceCount } from "@/lib/game-utils";

const RESOURCE_LABELS: Record<string, string> = {
  meat_0:'辐射鼠肉',meat_1:'变异兔肉',meat_2:'铁鳞蜥肉',meat_3:'疯犬肉',meat_4:'钢鬃猪肉',
  meat_5:'双头鹿肉',meat_6:'灰熊肉',meat_7:'辐射蝎肉',meat_8:'死亡爪肉',meat_9:'巨兽肉',
  fish_0:'辐射蝌蚪',fish_1:'癞皮鱼',fish_2:'电鳗仔',fish_3:'刺鳍鱼',fish_4:'肿眼鲶',
  fish_5:'荧光鳗',fish_6:'铁甲鱼',fish_7:'双头鲨',fish_8:'深渊巨口',fish_9:'核融鲸',
};

export default function Cooking() {
  const { data: state } = useGameState();
  const cookFood = useCookFood();
  const { toast } = useToast();
  const t = useUIText();
  const pc = t.pages.crafting;
  if (!state) return null;
  const gs = state as GameState;
  const foods = safeJsonRecord((gs as any).foods);

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
    <div className="p-4 max-w-3xl mx-auto space-y-4 bg-card rounded-xl border border-border">
      <h1 className="text-xl font-bold flex items-center gap-2"><Soup className="w-5 h-5 text-orange-400" /> 即时恢复</h1>
      <p className="text-xs text-muted-foreground">每份消耗1个材料，直接回复HP。战斗中可食用。</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {COOKING_RECIPES.map(r => {
          const have = r.inputs.every(inp => {
            const v = getResourceCount(gs, inp.resource);
            return v >= inp.qty;
          });
          return (
            <div key={r.id} className="bg-card border border-border rounded-xl p-3 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{r.emoji}</span>
                <span className="font-bold text-sm">{r.name}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">材料: {r.inputs.map(i => `${RESOURCE_LABELS[i.resource] ?? i.resource} ×${i.qty}`).join('  ')}</p>
              <p className="text-xs text-red-300">
                <Heart className="w-3 h-3 inline mr-1" />+{r.hpRestore} HP
              </p>
              <p className="text-[10px] text-muted-foreground">拥有: {foods[r.id] ?? 0}</p>
              <Button size="sm" disabled={!have} onClick={() => cook(r.id)} className="w-full h-6 text-[10px] bg-red-600 hover:bg-red-500">
                {have ? '制作' : '材料不足'}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
