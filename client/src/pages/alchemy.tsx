import { useGameState, useBrewPotion } from "@/hooks/use-game";
import { POTION_RECIPES } from "@shared/game-data";
import { safeJsonRecord, safeJsonArray } from "@shared/safe-parse";
import { useToast } from "@/hooks/use-toast";
import type { GameState } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { FlaskConical, Clock } from "lucide-react";
import { useUIText } from "@/lib/i18n";

const ALL_LABELS: Record<string, string> = {
  dandelion:'蒲公英',mint:'薄荷',rosemary:'迷迭香',thyme:'百里香',
  marigold:'金盏花',ginseng:'人参',lingzhi:'灵芝',dragonherb:'龙草',
  blueberry:'蓝莓',raspberry:'覆盆子',blackberry:'黑莓',elderberry:'接骨木莓',
  goji:'枸杞',spiritberry:'灵莓',dragonblood:'龙血果',
  nightberry:'夜光莓',moonberry:'月光莓',sunberry:'日光莓',
  magicberry:'魔法莓',ancientberry:'远古莓',cranberry:'蔓越莓',
  fish_1:'癞皮鱼',fish_5:'荧光鳗',fish_8:'深渊巨口',
  dragonBones:'龙骨',phoenix_flower:'凤凰花',
};

export default function Alchemy() {
  const { data: state } = useGameState();
  const brewPotion = useBrewPotion();
  const { toast } = useToast();
  const t = useUIText();
  const pc = t.pages.crafting;
  if (!state) return null;
  const gs = state as GameState;
  const potions = safeJsonRecord((gs as any).potions);
  const herbs = safeJsonRecord((gs as any).herbs);
  const berries = safeJsonRecord((gs as any).berries);

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
    <div className="p-4 max-w-3xl mx-auto space-y-4 bg-card rounded-xl border border-border">
      <h1 className="text-xl font-bold flex items-center gap-2"><FlaskConical className="w-5 h-5 text-purple-400" /> 增益药剂</h1>
      <p className="text-xs text-muted-foreground">草药+浆果+特殊材料炼制成持续buff药剂。</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {POTION_RECIPES.map(r => {
          const have = r.inputs.every(inp => {
            const total = (herbs[inp.resource] ?? 0) + (berries[inp.resource] ?? 0) + ((gs as any)[inp.resource] ?? 0);
            return total >= inp.qty;
          });
          return (
            <div key={r.id} className="bg-card border border-border rounded-xl p-3 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{r.emoji}</span>
                <span className="font-bold text-sm">{r.name}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">材料: {r.inputs.map(i => `${ALL_LABELS[i.resource] ?? i.resource} ×${i.qty}`).join('  ')}</p>
              <p className="text-xs text-purple-300">
                {r.effect}
                {r.durationMin > 0 && <span className="ml-1"><Clock className="w-3 h-3 inline" /> {r.durationMin}分钟</span>}
              </p>
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
