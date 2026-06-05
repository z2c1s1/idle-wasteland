import React, { useState, useRef } from "react";
import { useGameState, useEquipItem, useUnequipItem, useDestroyLoot, useSetLootFilter, useExpandLootBag, useEnhanceItem } from "@/hooks/use-game";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { ItemCard } from "@/components/inventory/item-card";
import { ItemSprite, ResourceIcon, type ResourceType } from "@/components/sprites";
import {
  ALL_CRAFTABLE_ITEMS, ALL_SLOTS, SLOT_LABEL,
  RARITY_COLOR, RARITY_BORDER, RARITY_BG, RARITY_LABEL,
  AFFIX_LABEL, SKILL_EMOJI, SKILL_COLOR,
  ITEM_SETS, getEquipmentBonuses,
  type GameItem, type EquipmentSlot, type GemType, type Rarity,
} from "@shared/game-data";
import {
  parseCraftItems, parseEquipment, parseLootBag, formatNumber, getEquipmentStats, getPlayerAttack, getPlayerDefence, getPlayerMaxHp, getResourceCount,
} from "@/lib/game-utils";
import type { GameState } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Package, Shield, Sword, Trash2, ChevronDown, ChevronUp, Download, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// ─── Equipment slot with hover tooltip ────────────────────────────────────────
function EquipSlot({ slot, item, onUnequip }: {
  slot: EquipmentSlot;
  item: GameItem | null;
  onUnequip: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const slotRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div ref={slotRef} className={`flex items-center gap-2 p-2 rounded-lg border transition-colors cursor-pointer ${
        item ? `${RARITY_BORDER[item.rarity]} ${RARITY_BG[item.rarity]}` : "border-border bg-muted/10"
      }`}
        onClick={item ? onUnequip : undefined}
        data-testid={`equip-slot-${slot}`}>
        <ItemSprite
          slot={slot}
          baseId={item ? ((item as any).baseId ?? (item as any).baseType) : undefined}
          rarity={item?.rarity ?? 'common'}
          ilvl={item?.ilvl ?? 0}
          size={28}
          className={item ? '' : 'opacity-30'}
        />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-muted-foreground leading-none">{SLOT_LABEL[slot]}</p>
          {item ? (
            <>
              <p className={`text-xs font-semibold truncate mt-0.5 ${RARITY_COLOR[item.rarity]}`}>{item.name}</p>
              <p className="text-[10px] text-yellow-500">物品等级 {item.ilvl}</p>
            </>
          ) : (
            <p className="text-xs text-muted-foreground/50 mt-0.5">空</p>
          )}
        </div>
      </div>
      {/* Hover tooltip */}
      {hovered && item && (
        <div className="fixed z-[99999] w-64 bg-card border border-border rounded-xl p-3 shadow-2xl space-y-1.5"
          style={{
            left: slotRef.current ? Math.min(slotRef.current.getBoundingClientRect().right + 8, window.innerWidth - 270) : 0,
            top: slotRef.current ? slotRef.current.getBoundingClientRect().top : 0,
          }}>
          <div className="flex items-center gap-2">
            <ItemSprite slot={item.slot} baseId={(item as any).baseId ?? (item as any).baseType} rarity={item.rarity} ilvl={item.ilvl} size={24} />
            <div>
              <p className={`text-sm font-bold ${RARITY_COLOR[item.rarity]}`}>{item.name}</p>
              <p className="text-[10px] text-muted-foreground">{SLOT_LABEL[item.slot]} · 物品等级 {item.ilvl}</p>
            </div>
          </div>
          {(item.maxDamage ?? 0) > 0 && <p className="text-xs text-orange-200">⚔ 武器伤害：{item.minDamage}–{item.maxDamage}</p>}
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs">
            {item.attackBonus    > 0 && <span className="text-red-300">⚔ +{item.attackBonus} 攻击</span>}
            {item.defenceBonus   > 0 && <span className="text-blue-300">🛡 +{item.defenceBonus} 防御</span>}
            {item.hpBonus        > 0 && <span className="text-green-300">❤ +{item.hpBonus} 生命</span>}
            {item.critRating     > 0 && <span className="text-yellow-300">✦ +{item.critRating.toFixed(1)}% 暴击</span>}
            {(item.enhancedDamage ?? 0) > 0 && <span className="text-orange-300">🔥 +{item.enhancedDamage}% 伤害</span>}
            {(item.lifeLeech ?? 0)      > 0 && <span className="text-rose-300">🩸 {item.lifeLeech}% 吸血</span>}
            {(item.attackSpeed ?? 0)    > 0 && <span className="text-sky-300">⚡ +{item.attackSpeed}% 攻速</span>}
          </div>
          {(item.skills?.length ?? 0) > 0 && (
            <div className="flex flex-wrap gap-1">
              {item.skills.map((s, i) => (
                <span key={i} className="text-[10px] px-1 py-0.5 rounded bg-muted/30 border border-border/50">{SKILL_EMOJI[s.type]} {s.name}</span>
              ))}
            </div>
          )}
          <button onClick={onUnequip} className="text-xs text-red-400 hover:text-red-300 mt-1">点击卸下</button>
        </div>
      )}
    </div>
  );
}

const RESOURCE_SECTIONS: { label: string; prefix: string; emoji: string; names: string[]; resourceType: ResourceType }[] = [
  { label: "伐木", prefix: "wood", emoji: "🪵", names: ["橡木","柳木","柚木","枫木","桃花心木","紫杉木","魔法木","古树木","红杉木","灵木"], resourceType: "wood" },
  { label: "采矿", prefix: "ore",  emoji: "⛏️", names: ["铜矿","锡矿","铁矿","煤矿","秘银矿","精金矿","符文矿","龙矿","黑曜矿","以太矿"], resourceType: "ore" },
  { label: "冶炼", prefix: "bar",  emoji: "🔩", names: ["青铜锭","铁锭","钢锭","银锭","金锭","秘银锭","精金锭","符文锭","龙锭","永恒锭"], resourceType: "bar" },
  { label: "钓鱼", prefix: "fish", emoji: "🐟", names: ["虾","沙丁鱼","鲱鱼","鳟鱼","三文鱼","金枪鱼","龙虾","旗鱼","鲨鱼","鲸鱼"], resourceType: "fish" },
  { label: "狩猎", prefix: "hide", emoji: "🪶", names: ["兔皮","鸟羽","狐皮","狼皮","熊皮","野猪皮","鹿皮","虎皮","龙皮","凤凰羽"], resourceType: "hide" },
];

const FILTER_RARITIES: Rarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];
const FILTER_LABELS: Record<Rarity, string> = {
  common:    '保留全部',
  uncommon:  '魔法+',
  rare:      '稀有+',
  epic:      '神圣+',
  legendary: '传说+',
  mythic:    '仅神话',
};
const DISENCHANT_GOLD_PREVIEW: Record<Rarity, string> = {
  common:    '—',
  uncommon:  '普通 →5金',
  rare:      '普通 →5金 · 魔法 →15金',
  epic:      '普通/魔法/稀有各→5/15/40金',
  legendary: '普通→5 · 魔法→15 · 稀有→40 · 神圣→100金',
  mythic:    '不可分解',
};

export default function Inventory() {
  const { data: state } = useGameState();
  const equipItem      = useEquipItem();
  const unequipItem    = useUnequipItem();
  const destroyLoot    = useDestroyLoot();
  const setLootFilter  = useSetLootFilter();
  const expandLootBag  = useExpandLootBag();
  const enhanceItem    = useEnhanceItem();
  const queryClient    = useQueryClient();
  const { toast }      = useToast();

  const handleExport = () => {
    const a = document.createElement("a");
    a.href = "/api/game/export";
    a.download = "wasteland-save.json";
    a.click();
  };
  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file"; input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const data = JSON.parse(await file.text());
        const res = await fetch("/api/game/import", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(data) });
        if (!res.ok) throw new Error((await res.json()).message);
        queryClient.invalidateQueries({ queryKey: [api.game.getState.path] });
        toast({ title: "存档导入成功！请刷新页面" });
      } catch (e: any) { toast({ title:"导入失败", description:e.message, variant:"destructive" }); }
    };
    input.click();
  };
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem("idlerpg_inventory_collapsed");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  if (!state) return null;
  const gs = state as GameState;

  const equipment  = parseEquipment(gs.equipment);
  const craftItems = parseCraftItems(gs.craftItems);
  const lootBag    = parseLootBag(gs.lootBag);

  const equipStats = getEquipmentStats(gs);
  const eqBonuses  = getEquipmentBonuses(equipment);
  const activeSets = eqBonuses.activeSets ?? {};

  function handleEquipDropped(instanceId: string) {
    equipItem.mutate({ instanceId }, {
      onError: (err) => toast({ title: "装备失败", description: err.message, variant: "destructive" }),
    });
  }
  function handleEquipSmithed(itemId: string) {
    equipItem.mutate({ itemId }, {
      onError: (err) => toast({ title: "装备失败", description: err.message, variant: "destructive" }),
    });
  }
  function handleUnequip(slot: string) {
    unequipItem.mutate(slot, {
      onError: (err) => toast({ title: "卸装失败", description: err.message, variant: "destructive" }),
    });
  }
  function handleDestroy(instanceId: string) {
    destroyLoot.mutate(instanceId, {
      onError: (err) => toast({ title: "失败", description: err.message, variant: "destructive" }),
    });
  }

  const lootByRarity = [...lootBag].sort((a, b) => {
    const order = { mythic: 0, legendary: 1, epic: 2, rare: 3, uncommon: 4, common: 5 };
    return order[a.rarity] - order[b.rarity];
  });

  const currentFilter = (gs.lootFilter ?? 'common') as Rarity;

  function handleSetFilter(rarity: Rarity) {
    setLootFilter.mutate(rarity, {
      onError: () => toast({ title: "筛选器设置失败", variant: "destructive" }),
    });
  }

  const [sellMode, setSellMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  function toggleSelect(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }
  async function handleSellSelected() {
    if (selectedIds.size === 0) { setSellMode(false); return; }
    const count = selectedIds.size;
    setSelectedIds(new Set());
    setSellMode(false);
    let failed = 0;
    for (const id of Array.from(selectedIds)) {
      try { await destroyLoot.mutateAsync(id); }
      catch (e: any) { failed++; console.error(e); }
    }
    if (failed > 0) {
      toast({ title: `出售 ${count - failed} 件（${failed} 件失败）`, variant: "destructive" });
    } else {
      toast({ title: `出售 ${count} 件装备` });
    }
  }

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Package className="w-5 h-5 text-yellow-400" /> 背包
          </h1>
          <p className="text-sm text-muted-foreground">
            战利品袋中有 {lootBag.length} 件物品
            {equipStats.hpBonus > 0 && ` · +${equipStats.hpBonus} 生命`}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport} className="flex items-center gap-1 px-2.5 py-1.5 text-xs rounded border border-border hover:bg-muted/20">
            <Download className="w-3 h-3" /> 导出
          </button>
          <button onClick={handleImport} className="flex items-center gap-1 px-2.5 py-1.5 text-xs rounded border border-border hover:bg-muted/20">
            <Upload className="w-3 h-3" /> 导入
          </button>
        </div>
      </div>

      {/* Total stats (base + equipment) — grouped by category */}
      <div className="bg-card border border-border rounded-xl p-3 space-y-3">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">总属性</h2>

        {/* 基础战斗 */}
        <div>
          <h3 className="text-[10px] text-muted-foreground/60 mb-1">基础战斗</h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
            <span className="text-red-300">⚔ {getPlayerAttack(gs)} 攻击</span>
            <span className="text-blue-300">🛡 {getPlayerDefence(gs)} 防御</span>
            <span className="text-green-300">❤ {getPlayerMaxHp(gs)} 生命</span>
          </div>
        </div>

        {/* 暴击 */}
        <div>
          <h3 className="text-[10px] text-muted-foreground/60 mb-1">暴击</h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
            <span className="text-yellow-300">✦ {(equipStats.critRating ?? 0).toFixed(1)}% 暴击率</span>
            <span className="text-purple-300">💀 +{equipStats.deadlyStrike ?? 0}% 暴击伤害</span>
          </div>
        </div>

        {/* 伤害增幅 */}
        <div>
          <h3 className="text-[10px] text-muted-foreground/60 mb-1">伤害增幅</h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
            <span className="text-orange-300">🔥 +{equipStats.enhancedDamage ?? 0}% 最终伤害</span>
            <span className="text-sky-300">⚡ -{equipStats.attackSpeed ?? 0}% 攻击间隔</span>
            <span className="text-amber-300">💥 +{equipStats.crushingBlow ?? 0}% 碾压打击</span>
          </div>
        </div>

        {/* 生存与回复 */}
        <div>
          <h3 className="text-[10px] text-muted-foreground/60 mb-1">生存与回复</h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
            <span className="text-emerald-300">🌿 +{equipStats.lifeRegen ?? 0} 生命回复</span>
            <span className="text-pink-300">💗 +{equipStats.lifeOnKill ?? 0} 击杀回血</span>
            <span className="text-rose-300">🩸 {equipStats.lifeLeech ?? 0}% 生命偷取</span>
            <span className="text-cyan-300">🔵 -{equipStats.resistAll ?? 0} 伤害减免</span>
          </div>
        </div>

        {/* 特殊 */}
        <div>
          <h3 className="text-[10px] text-muted-foreground/60 mb-1">特殊属性</h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
            <span className="text-lime-300">🍀 +{equipStats.magicFind ?? 0}% 掉落概率</span>
            <span className="text-teal-300">💰 +{equipStats.goldBonus ?? 0}% 金币加成</span>
            <span className="text-indigo-300">🔄 +{equipStats.reflectDamage ?? 0}% 反弹伤害</span>
          </div>
        </div>
      </div>

      {/* Loot Filter Panel */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-3" data-testid="loot-filter-panel">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">⚗ 战利品筛选器</span>
          <span className="text-xs text-muted-foreground">— 低于阈值的物品自动分解为金币</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTER_RARITIES.map((rarity) => {
            const isActive = currentFilter === rarity;
            const colorCls = RARITY_COLOR[rarity];
            return (
              <button
                key={rarity}
                data-testid={`filter-btn-${rarity}`}
                onClick={() => handleSetFilter(rarity)}
                className={[
                  "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all",
                  isActive
                    ? `border-current ${colorCls} bg-muted/40 ring-1 ring-current`
                    : `border-border text-muted-foreground hover:border-muted-foreground`,
                ].join(" ")}
              >
                {FILTER_LABELS[rarity]}
              </button>
            );
          })}
        </div>
        {currentFilter !== 'common' && (
          <p className="text-xs text-amber-400/80">
            🔥 自动分解：{DISENCHANT_GOLD_PREVIEW[currentFilter]}
          </p>
        )}
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Character Equipment */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">已装备</h2>
          </div>

          {/* Stat summary */}
          {(equipStats.attackBonus > 0 || equipStats.defenceBonus > 0 || equipStats.hpBonus > 0) && (
            <div className="flex flex-wrap gap-x-4 gap-y-1 bg-muted/20 rounded-lg px-3 py-2 text-xs">
              {equipStats.attackBonus > 0  && <span className="text-red-300">⚔ +{equipStats.attackBonus} 攻击</span>}
              {equipStats.defenceBonus > 0 && <span className="text-blue-300">🛡 +{equipStats.defenceBonus} 防御</span>}
              {equipStats.hpBonus > 0      && <span className="text-green-300">❤ +{equipStats.hpBonus} 生命</span>}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            {ALL_SLOTS.map(slot => (
              <EquipSlot
                key={slot}
                slot={slot}
                item={(equipment[slot] as GameItem | undefined) ?? null}
                onUnequip={() => handleUnequip(slot)}
              />
            ))}
          </div>

          {/* Set progress panel */}
          {ITEM_SETS.filter(s => {
            const count = activeSets[s.id] ?? 0;
            // Show any set where player has at least 1 piece equipped
            return count > 0;
          }).map(set => {
            const count = activeSets[set.id] ?? 0;
            const total = set.pieces.length;
            return (
              <div key={set.id} className="mt-2 rounded-lg border border-teal-500/30 bg-teal-500/5 p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-teal-300">{set.name}</span>
                  <span className="text-[10px] text-teal-400/70 bg-teal-500/10 px-1.5 py-0.5 rounded">
                    {count}/{total} 件已穿戴
                  </span>
                </div>
                <div className="w-full h-1 bg-muted/30 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-400 rounded-full transition-all" style={{ width: `${(count / total) * 100}%` }} />
                </div>
                <div className="space-y-0.5">
                  {set.bonuses.map((bonus, i) => {
                    const active = count >= bonus.count;
                    return (
                      <div key={i} className={`text-[10px] flex items-center gap-1.5 ${active ? 'text-teal-300' : 'text-muted-foreground/40'}`}>
                        <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[8px] flex-shrink-0 ${active ? 'border-teal-400 bg-teal-400/20 text-teal-300' : 'border-border/40'}`}>
                          {active ? '✓' : bonus.count}
                        </span>
                        <span className="font-medium">{bonus.count}件套：</span>
                        <span>{bonus.affixes.map(a => `+${a.value} ${AFFIX_LABEL[a.type] ?? a.type}`).join('，')}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Loot Bag — dropped items */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Sword className="w-4 h-4 text-yellow-400" />
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                战利品袋 <span className="text-xs normal-case">({lootBag.length}/{gs.lootBagSize ?? 50})</span>
              </h2>
              {(gs.lootBagSize ?? 50) < 100 && (
                <button onClick={async () => {
                  try {
                    const cost = Math.floor(Math.pow((gs.lootBagSize ?? 50) - 49, 2) * 100);
                    if (!confirm(`扩容1格消耗${cost}金币？`)) return;
                    await expandLootBag.mutateAsync();
                    toast({ title: "扩容成功" });
                  } catch (e: unknown) {
                    toast({
                      title: "扩容失败",
                      description: e instanceof Error ? e.message : "未知错误",
                      variant: "destructive",
                    });
                  }
                }} className="h-6 text-[10px] px-2 rounded border border-border hover:bg-muted/20 text-muted-foreground">
                  +扩容
                </button>
              )}
            </div>
            <button
              onClick={() => sellMode ? handleSellSelected() : setSellMode(true)}
              className={`h-7 text-xs px-3 rounded font-semibold transition-colors ${
                sellMode ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-muted/30 hover:bg-muted/50 text-muted-foreground'
              }`}
            >
              {sellMode ? `出售 (${selectedIds.size})` : '出售'}
            </button>
          </div>

          {lootBag.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">暂无物品</p>
              <p className="text-xs mt-1">击败敌人以获取战利品！</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-1.5 max-h-[400px] overflow-y-auto pr-1">
              {lootByRarity.map(item => {
                const equipSame = (equipment[item.slot] as GameItem | undefined) ?? null;
                const isSelected = selectedIds.has(item.instanceId);
                return (
                <div key={item.instanceId} className="relative">
                  <ItemCard
                    item={item}
                    compact
                    onEquip={() => handleEquipDropped(item.instanceId)}
                    onDestroy={() => handleDestroy(item.instanceId)}
                    onEnhance={() => enhanceItem.mutate(item.instanceId, {
                      onError: (err) => toast({ title: "强化失败", description: err.message, variant: "destructive" }),
                    })}
                    equippedSame={equipSame}
                  />
                  {sellMode && (
                    <div
                      className={`absolute top-1 left-1 w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer text-xs font-bold transition-colors ${
                        isSelected ? 'bg-red-500 border-red-500 text-white' : 'border-border bg-muted/30 text-transparent hover:border-red-400'
                      }`}
                      onClick={() => toggleSelect(item.instanceId)}
                    >
                      {isSelected ? '✓' : ''}
                    </div>
                  )}
                </div>
                );
              })}
            </div>
          )}
        </div>
      </div>



      {/* Smithed items */}
      {Object.keys(craftItems).length > 0 && (
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">已制作装备</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {Object.entries(craftItems).map(([itemId, qty]) => {
              if (qty <= 0) return null;
              const def = ALL_CRAFTABLE_ITEMS[itemId];
              if (!def) return null;
              return (
                <div key={itemId} className="flex items-center gap-2 p-2 rounded-lg border border-green-500/30 bg-green-500/5"
                  data-testid={`smithed-item-${itemId}`}>
                  <ItemSprite slot={def.slot} baseId={itemId} rarity="uncommon" ilvl={def.ilvl} size={20} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-green-400 truncate">{def.name}</p>
                    <p className="text-[10px] text-muted-foreground">x{qty} · 物品等级 {def.ilvl}</p>
                  </div>
                  <Button size="sm" className="h-7 text-xs px-2 flex-shrink-0"
                    onClick={() => handleEquipSmithed(itemId)}
                    disabled={equipItem.isPending}
                    data-testid={`button-equip-smithed-${itemId}`}>
                    装备
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Resources — split into 采集类 / 战斗类 */}
      <div className="space-y-6">
        {/* ── 采集类 ── */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-base">🌿</span>
            <h2 className="text-sm font-semibold text-green-400 uppercase tracking-wider">采集类</h2>
          </div>
          {RESOURCE_SECTIONS.map(section => {
            const items = Array.from({ length: 10 }, (_, i) => ({
              name: section.names[i],
              qty: getResourceCount(gs, `${section.prefix}_${i}`),
              key: `${section.prefix}_${i}`,
            })).filter(it => it.qty > 0);
            if (!items.length) return null;
            const isCollapsed = !!collapsedSections[section.label];
            return (
              <div key={section.label} className="bg-card border border-border rounded-xl p-4">
                <button
                  className="w-full flex items-center justify-between group mb-0"
                  onClick={() => setCollapsedSections(prev => {
                    const next = { ...prev, [section.label]: !prev[section.label] };
                    try { localStorage.setItem("idlerpg_inventory_collapsed", JSON.stringify(next)); } catch {}
                    return next;
                  })}
                  data-testid={`toggle-section-${section.prefix}`}
                >
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider group-hover:text-foreground transition-colors flex items-center gap-1">
                    <ResourceIcon type={section.resourceType} size={14} /> {section.label}
                    <span className="ml-2 font-normal normal-case text-muted-foreground/60">{items.length} 种</span>
                  </h3>
                  {isCollapsed
                    ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
                    : <ChevronUp className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
                  }
                </button>
                {!isCollapsed && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {items.map(item => (
                      <div key={item.key} className="flex flex-col items-center justify-center bg-muted/20 rounded-md w-14 h-14 p-0.5" data-testid={`resource-${item.key}`}>
                        <ResourceIcon type={section.resourceType} size={18} />
                        <span className="text-[10px] font-bold text-foreground leading-tight">{formatNumber(item.qty)}</span>
                        <span className="text-[9px] text-muted-foreground text-center leading-none">{item.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {RESOURCE_SECTIONS.every(section =>
            Array.from({ length: 10 }, (_, i) => ((gs as Record<string, unknown>)[`${section.prefix}_${i}`] as number) ?? 0).every(q => q === 0)
          ) && (
            <p className="text-sm text-muted-foreground/50 pl-1">暂无采集资源，去采集技能页面开始吧！</p>
          )}
        </div>

        {/* ── 战斗类 ── */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-base">⚔️</span>
            <h2 className="text-sm font-semibold text-red-400 uppercase tracking-wider">战斗类</h2>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex flex-wrap gap-1">
              <div className="flex flex-col items-center justify-center bg-muted/20 rounded-md w-14 h-14 p-0.5" data-testid="resource-gold">
                <span className="text-base leading-none">💰</span>
                <span className="text-[10px] font-bold text-yellow-400 leading-tight">{formatNumber(gs.gold)}</span>
                <span className="text-[9px] text-muted-foreground text-center leading-none">金币</span>
              </div>
              <div className="flex flex-col items-center justify-center bg-muted/20 rounded-md w-14 h-14 p-0.5" data-testid="resource-bones">
                <span className="text-base leading-none">🦴</span>
                <span className="text-[10px] font-bold text-foreground leading-tight">{formatNumber(gs.bones)}</span>
                <span className="text-[9px] text-muted-foreground text-center leading-none">骨头</span>
              </div>
              {gs.dragonBones > 0 && (
                <div className="flex flex-col items-center justify-center bg-muted/20 rounded-md w-14 h-14 p-0.5" data-testid="resource-dragon-bones">
                  <span className="text-base leading-none">🐲</span>
                  <span className="text-[10px] font-bold text-purple-400 leading-tight">{formatNumber(gs.dragonBones)}</span>
                  <span className="text-[9px] text-muted-foreground text-center leading-none">龙骨</span>
                </div>
              )}
            </div>
            {gs.gold === 0 && gs.bones === 0 && gs.dragonBones === 0 && (
              <p className="text-sm text-muted-foreground/50 mt-2">暂无战斗资源，去战斗页面击败敌人吧！</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
