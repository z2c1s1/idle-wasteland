import { useState } from "react";
import { useGameState, useEquipItem, useUnequipItem, useDestroyLoot } from "@/hooks/use-game";
import {
  ALL_CRAFTABLE_ITEMS, ALL_SLOTS, SLOT_LABEL, SLOT_EMOJI,
  RARITY_COLOR, RARITY_BORDER, RARITY_BG, RARITY_LABEL,
  AFFIX_LABEL, AFFIX_COLOR, GEM_EMOJI, SKILL_EMOJI, SKILL_COLOR,
  ITEM_SETS, UNIQUE_ITEMS, getEquipmentBonuses,
  getGemName, getGemBgClass,
  type GameItem, type EquipmentSlot, type GemType,
} from "@shared/game-data";
import {
  parseCraftItems, parseEquipment, parseLootBag, formatNumber, getEquipmentStats,
} from "@/lib/game-utils";
import type { GameState } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Package, Shield, Sword, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// ─── Shared affix row with optional blue/gold tint ───────────────────────────
function AffixRow({ affix, tint }: { affix: { type: string; value: number }; tint?: 'blue' | 'gold' }) {
  const baseColor = AFFIX_COLOR[affix.type as keyof typeof AFFIX_COLOR] ?? 'text-foreground';
  const labelColor = tint === 'blue' ? 'text-blue-300' : tint === 'gold' ? 'text-yellow-300' : baseColor;
  const label = AFFIX_LABEL[affix.type as keyof typeof AFFIX_LABEL] ?? affix.type;
  const hints: Record<string, string> = {
    strength: `+${affix.value} 攻击`,
    armour: `+${affix.value} 防御`,
    stamina: `+${affix.value * 5} 生命`,
    agility: `+${(affix.value * 0.5).toFixed(1)}% 暴击`,
    enhanced_damage: `所有伤害 +${affix.value}%`,
    life_on_kill: `击杀恢复 ${affix.value} 生命`,
    crushing_blow: `${affix.value}% 概率造成敌方当前 25% 生命伤害`,
    magic_find: `掉落品质 +${affix.value}%`,
    life_regen: `每回合恢复 ${affix.value} 生命`,
    gold_bonus: `金币获取 +${affix.value}%`,
    resist_all: `所有伤害减免 ${affix.value} 点`,
    life_leech: `造成伤害的 ${affix.value}% 恢复生命`,
    deadly_strike: `${affix.value}% 概率本次攻击伤害翻倍`,
    attack_speed: `攻击伤害 +${affix.value}%，模拟快速出击`,
    thorns: `被击时对攻击者反弹 ${affix.value} 伤害`,
  };
  const hint = hints[affix.type];
  return (
    <div className={`text-xs flex items-center gap-1.5 ${labelColor}`}>
      <span className="font-semibold">+{affix.value} {label}</span>
      {hint && <span className="text-muted-foreground text-[10px]">({hint})</span>}
    </div>
  );
}

// ─── Item tooltip card ────────────────────────────────────────────────────────
function ItemCard({ item, onEquip, onDestroy, onUnequip, isEquipped }: {
  item: GameItem;
  onEquip?: () => void;
  onDestroy?: () => void;
  onUnequip?: () => void;
  isEquipped?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  const isUnique = item.source === 'unique';
  const isSet    = !!item.setId;
  const setDef   = isSet ? ITEM_SETS.find(s => s.id === item.setId) : undefined;
  const uniqueDef= isUnique ? UNIQUE_ITEMS.find(u => u.id === item.uniqueId) : undefined;

  const borderClass = isSet
    ? 'border-teal-400/70 shadow-teal-400/15 shadow-sm'
    : isUnique
    ? 'border-amber-400/70 shadow-amber-400/20 shadow-md'
    : RARITY_BORDER[item.rarity];
  const bgClass = isSet
    ? 'bg-teal-500/8'
    : isUnique
    ? 'bg-amber-500/10'
    : RARITY_BG[item.rarity];
  const nameClass = isSet
    ? 'text-teal-300 font-bold'
    : isUnique
    ? 'text-amber-300 font-bold'
    : `font-semibold ${RARITY_COLOR[item.rarity]}`;

  return (
    <div className={`rounded-lg border p-3 flex flex-col gap-2 transition-all ${borderClass} ${bgClass}`}
      data-testid={`item-card-${item.instanceId}`}>
      <div className="flex items-start gap-2">
        <span className="text-2xl leading-none mt-0.5">{item.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-sm leading-tight ${nameClass}`}>
              {item.name}
            </span>
            {isSet && setDef && (
              <span className="text-[10px] px-1 py-0.5 rounded font-semibold uppercase border border-teal-400/50 text-teal-300 bg-teal-400/10">
                套装
              </span>
            )}
            {!isSet && isUnique && (
              <span className="text-[10px] px-1 py-0.5 rounded font-semibold uppercase border border-amber-400/50 text-amber-300 bg-amber-400/10">
                传说独特
              </span>
            )}
            {!isSet && !isUnique && (
              <span className={`text-[10px] px-1 py-0.5 rounded font-semibold uppercase border ${RARITY_BORDER[item.rarity]} ${RARITY_COLOR[item.rarity]}`}>
                {RARITY_LABEL[item.rarity]}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-muted-foreground">{SLOT_LABEL[item.slot]}</span>
            {item.baseType && <><span className="text-xs text-muted-foreground">·</span><span className="text-xs text-muted-foreground/60">{item.baseType}</span></>}
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-yellow-500 font-medium">物品等级 {item.ilvl}</span>
          </div>
          {/* Weapon damage range */}
          {(item.maxDamage ?? 0) > 0 && (
            <div className="text-xs text-orange-200 mt-0.5">⚔ 武器伤害：{item.minDamage}–{item.maxDamage}</div>
          )}
          {/* Flavor text for uniques */}
          {(uniqueDef?.flavorText || item.flavorText) && (
            <div className="text-[10px] text-amber-200/60 italic mt-0.5 leading-tight">
              "{uniqueDef?.flavorText ?? item.flavorText}"
            </div>
          )}
        </div>
        <button className="text-muted-foreground hover:text-foreground p-0.5 transition-colors flex-shrink-0"
          onClick={() => setExpanded(e => !e)}>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Set name badge */}
      {setDef && (
        <div className="text-[10px] text-teal-300 font-semibold tracking-wide">
          ◆ {setDef.name} — {setDef.pieces.length}件套
        </div>
      )}

      {/* Quick stat summary */}
      <div className="flex flex-wrap gap-x-3 gap-y-0.5">
        {item.attackBonus    > 0 && <span className="text-xs text-red-300">⚔ +{item.attackBonus} 攻击</span>}
        {item.defenceBonus   > 0 && <span className="text-xs text-blue-300">🛡 +{item.defenceBonus} 防御</span>}
        {item.hpBonus        > 0 && <span className="text-xs text-green-300">❤ +{item.hpBonus} 生命</span>}
        {item.critRating     > 0 && <span className="text-xs text-yellow-300">✦ +{item.critRating.toFixed(1)}% 暴击</span>}
        {(item.enhancedDamage ?? 0) > 0 && <span className="text-xs text-orange-300">🔥 +{item.enhancedDamage}% 伤害</span>}
        {(item.lifeOnKill ?? 0)     > 0 && <span className="text-xs text-pink-300">💗 +{item.lifeOnKill} 击杀回血</span>}
        {(item.crushingBlow ?? 0)   > 0 && <span className="text-xs text-red-400">💥 {item.crushingBlow}% 重击</span>}
        {(item.magicFind ?? 0)      > 0 && <span className="text-xs text-purple-300">✨ +{item.magicFind}% 魔法发现</span>}
        {(item.lifeRegen ?? 0)      > 0 && <span className="text-xs text-emerald-300">🌿 +{item.lifeRegen} 回复/回合</span>}
        {(item.goldBonus ?? 0)      > 0 && <span className="text-xs text-yellow-400">💰 +{item.goldBonus}% 金币</span>}
        {(item.resistAll ?? 0)      > 0 && <span className="text-xs text-cyan-300">🔵 -{item.resistAll} 受伤</span>}
        {(item.lifeLeech ?? 0)      > 0 && <span className="text-xs text-rose-300">🩸 {item.lifeLeech}% 吸血</span>}
        {(item.deadlyStrike ?? 0)   > 0 && <span className="text-xs text-amber-300">⚡ {item.deadlyStrike}% 致命一击</span>}
        {(item.attackSpeed ?? 0)    > 0 && <span className="text-xs text-sky-300">⚡ +{item.attackSpeed}% 攻速</span>}
        {(item.reflectDamage ?? 0)  > 0 && <span className="text-xs text-lime-300">🌵 {item.reflectDamage} 反伤</span>}
      </div>

      {/* Gem sockets row */}
      {(item.maxSockets ?? 0) > 0 && (
        <div className="flex gap-1.5 items-center">
          {Array.from({ length: item.maxSockets }).map((_, i) => {
            const gk = item.socketedGems?.[i];
            if (gk) {
              const type = gk.split('_')[0] as GemType;
              return (
                <span key={i} className={`w-5 h-5 rounded-full border flex items-center justify-center text-[11px] ${getGemBgClass(gk)}`}
                  title={getGemName(gk)}>{GEM_EMOJI[type]}</span>
              );
            }
            return <span key={i} className="w-5 h-5 rounded-full border border-dashed border-muted-foreground/30 flex items-center justify-center text-[9px] text-muted-foreground/40">○</span>;
          })}
          <span className="text-[10px] text-muted-foreground">{(item.socketedGems?.length ?? 0)}/{item.maxSockets} 宝石孔</span>
        </div>
      )}

      {/* Skills row */}
      {(item.skills?.length ?? 0) > 0 && (
        <div className="flex flex-wrap gap-1">
          {item.skills.map((skill, i) => (
            <span key={i} className={`text-[10px] px-1.5 py-0.5 rounded bg-muted/30 border border-border/50 font-medium ${SKILL_COLOR[skill.type]}`}
              title={skill.description}>
              {SKILL_EMOJI[skill.type]} {skill.name}
            </span>
          ))}
        </div>
      )}

      {/* Expanded affix detail — prefix/suffix split (Diablo-style) */}
      {expanded && (
        <div className="border-t border-border/50 pt-2 space-y-1.5">
          {/* Implicit affix (from item base) */}
          {(() => {
            const prefixTypes = new Set(item.prefixes?.map(a => a.type) ?? []);
            const suffixTypes = new Set(item.suffixes?.map(a => a.type) ?? []);
            const implicits = item.affixes.filter(a => !prefixTypes.has(a.type) && !suffixTypes.has(a.type));
            return implicits.length > 0 && (
              <div className="space-y-0.5">
                <div className="text-[9px] text-muted-foreground/50 uppercase tracking-widest font-semibold">固有属性</div>
                {implicits.map((affix, i) => <AffixRow key={i} affix={affix} />)}
              </div>
            );
          })()}

          {/* Prefixes (offensive, blue) */}
          {(item.prefixes?.length ?? 0) > 0 && (
            <div className="space-y-0.5">
              <div className="text-[9px] text-blue-400/70 uppercase tracking-widest font-semibold">前缀</div>
              {item.prefixes!.map((affix, i) => <AffixRow key={i} affix={affix} tint="blue" />)}
            </div>
          )}

          {/* Suffixes (defensive/utility, gold) */}
          {(item.suffixes?.length ?? 0) > 0 && (
            <div className="space-y-0.5">
              <div className="text-[9px] text-yellow-400/70 uppercase tracking-widest font-semibold">后缀</div>
              {item.suffixes!.map((affix, i) => <AffixRow key={i} affix={affix} tint="gold" />)}
            </div>
          )}

          {/* Fallback for smithed/unique items with no prefix/suffix split */}
          {((item.prefixes?.length ?? 0) === 0 && (item.suffixes?.length ?? 0) === 0) && item.affixes.map((affix, i) => (
            <AffixRow key={i} affix={affix} />
          ))}

          {(item.skills?.length ?? 0) > 0 && (
            <div className="mt-1 space-y-0.5 border-t border-border/30 pt-1">
              {item.skills.map((skill, i) => (
                <p key={i} className={`text-[10px] ${SKILL_COLOR[skill.type]}`}>
                  {SKILL_EMOJI[skill.type]} <span className="font-semibold">{skill.name}：</span>{skill.description}
                </p>
              ))}
            </div>
          )}
          {item.source === 'smithed' && (
            <p className="text-[10px] text-muted-foreground mt-1">制作 · 精良品质</p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-1">
        {isEquipped && onUnequip && (
          <Button size="sm" variant="outline" onClick={onUnequip} className="h-7 text-xs px-2" data-testid={`button-unequip-${item.slot}`}>
            卸下
          </Button>
        )}
        {!isEquipped && onEquip && (
          <Button size="sm" onClick={onEquip} className="h-7 text-xs px-2 flex-1" data-testid={`button-equip-${item.instanceId}`}>
            装备
          </Button>
        )}
        {!isEquipped && onDestroy && (
          <Button size="sm" variant="ghost" onClick={onDestroy}
            className="h-7 text-xs px-2 text-red-400 hover:text-red-300 hover:bg-red-950/30"
            data-testid={`button-destroy-${item.instanceId}`}>
            <Trash2 className="w-3 h-3" />
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── Equipment slot ───────────────────────────────────────────────────────────
function EquipSlot({ slot, item, onUnequip }: {
  slot: EquipmentSlot;
  item: GameItem | null;
  onUnequip: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="relative" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className={`flex items-center gap-2 p-2 rounded-lg border transition-colors cursor-pointer ${
        item ? `${RARITY_BORDER[item.rarity]} ${RARITY_BG[item.rarity]}` : "border-border bg-muted/10"
      }`}
        onClick={item ? onUnequip : undefined}
        data-testid={`equip-slot-${slot}`}>
        <span className="text-lg w-7 text-center flex-shrink-0">{item ? item.emoji : SLOT_EMOJI[slot]}</span>
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
        {item && hovered && (
          <span className="text-[10px] text-red-400 flex-shrink-0">卸下</span>
        )}
      </div>
    </div>
  );
}

const RESOURCE_SECTIONS = [
  { label: "伐木", prefix: "wood", emoji: "🪵", names: ["橡木","柳木","柚木","枫木","桃花心木","紫杉木","魔法木","古树木","红杉木","灵木"] },
  { label: "采矿", prefix: "ore",  emoji: "⛏️", names: ["铜矿","锡矿","铁矿","煤矿","秘银矿","精金矿","符文矿","龙矿","黑曜矿","以太矿"] },
  { label: "冶炼", prefix: "bar",  emoji: "🔩", names: ["青铜锭","铁锭","钢锭","银锭","金锭","秘银锭","精金锭","符文锭","龙锭","永恒锭"] },
  { label: "钓鱼", prefix: "fish", emoji: "🐟", names: ["虾","沙丁鱼","鲱鱼","鳟鱼","三文鱼","金枪鱼","龙虾","旗鱼","鲨鱼","鲸鱼"] },
  { label: "狩猎", prefix: "hide", emoji: "🪶", names: ["兔皮","鸟羽","狐皮","狼皮","熊皮","野猪皮","鹿皮","虎皮","龙皮","凤凰羽"] },
  { label: "制作", prefix: "item", emoji: "🧵", names: ["布料","皮革","珠宝料","甲料","兵器料","神器料","遗物料","杰作料","天界料","神圣料"] },
];

export default function Inventory() {
  const { data: state } = useGameState();
  const equipItem    = useEquipItem();
  const unequipItem  = useUnequipItem();
  const destroyLoot  = useDestroyLoot();
  const { toast }    = useToast();

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
    const order = { legendary: 0, epic: 1, rare: 2, uncommon: 3, common: 4 };
    return order[a.rarity] - order[b.rarity];
  });

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Package className="w-5 h-5 text-yellow-400" /> 背包
        </h1>
        <p className="text-sm text-muted-foreground">
          战利品袋中有 {lootBag.length} 件物品
          {equipStats.critRating > 0 && ` · ${equipStats.critRating.toFixed(1)}% 暴击`}
          {equipStats.hpBonus > 0 && ` · +${equipStats.hpBonus} 生命`}
        </p>
      </div>

      {/* Loot + Gold */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">战利品</h2>
        <div className="flex gap-6 text-sm">
          <span>💰 <span className="font-bold text-yellow-400">{formatNumber(gs.gold)}</span> 金币</span>
          <span>🦴 <span className="font-bold">{formatNumber(gs.bones)}</span> 骨头</span>
          {gs.dragonBones > 0 && <span>🐲 <span className="font-bold text-purple-400">{formatNumber(gs.dragonBones)}</span> 龙骨</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Character Equipment */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">已装备</h2>
          </div>

          {/* Stat summary */}
          {(equipStats.attackBonus > 0 || equipStats.defenceBonus > 0 || equipStats.hpBonus > 0 || equipStats.critRating > 0) && (
            <div className="flex flex-wrap gap-x-4 gap-y-1 bg-muted/20 rounded-lg px-3 py-2 text-xs">
              {equipStats.attackBonus > 0  && <span className="text-red-300">⚔ +{equipStats.attackBonus} 攻击</span>}
              {equipStats.defenceBonus > 0 && <span className="text-blue-300">🛡 +{equipStats.defenceBonus} 防御</span>}
              {equipStats.hpBonus > 0      && <span className="text-green-300">❤ +{equipStats.hpBonus} 生命</span>}
              {equipStats.critRating > 0   && <span className="text-yellow-300">✦ +{equipStats.critRating.toFixed(1)}% 暴击</span>}
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
                战利品袋 <span className="text-xs normal-case">({lootBag.length}/50)</span>
              </h2>
            </div>
          </div>

          {lootBag.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">暂无物品</p>
              <p className="text-xs mt-1">击败敌人以获取战利品！</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {lootByRarity.map(item => (
                <ItemCard
                  key={item.instanceId}
                  item={item}
                  onEquip={() => handleEquipDropped(item.instanceId)}
                  onDestroy={() => handleDestroy(item.instanceId)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Currently equipped items (as cards) */}
      {Object.values(equipment).some(Boolean) && (
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">已装备物品</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ALL_SLOTS.map(slot => {
              const item = (equipment[slot] as GameItem | undefined) ?? null;
              if (!item) return null;
              return (
                <ItemCard
                  key={slot}
                  item={item}
                  isEquipped
                  onUnequip={() => handleUnequip(slot)}
                />
              );
            })}
          </div>
        </div>
      )}

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
                  <span className="text-xl">{def.emoji}</span>
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

      {/* Resources */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">资源</h2>
        {RESOURCE_SECTIONS.map(section => {
          const items = Array.from({ length: 10 }, (_, i) => ({
            name: section.names[i],
            qty: ((gs as Record<string, unknown>)[`${section.prefix}_${i}`] as number) ?? 0,
            key: `${section.prefix}_${i}`,
          })).filter(it => it.qty > 0);

          if (!items.length) return null;
          return (
            <div key={section.label} className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {section.emoji} {section.label}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                {items.map(item => (
                  <div key={item.key} className="bg-muted/20 rounded-lg p-2 text-center" data-testid={`resource-${item.key}`}>
                    <p className="text-xs text-muted-foreground truncate">{item.name}</p>
                    <p className="text-sm font-bold mt-0.5">{formatNumber(item.qty)}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
