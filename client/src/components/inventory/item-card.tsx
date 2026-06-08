import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import {
  SLOT_LABEL, RARITY_COLOR, RARITY_BORDER, RARITY_BG, RARITY_LABEL,
  GEM_EMOJI, SKILL_EMOJI, SKILL_COLOR,
  ITEM_SETS, UNIQUE_ITEMS,
  getGemName, getGemBgClass,
  SUB_STAT_LABEL, MAX_ENHANCE_LEVEL,
  type GameItem, type GemType,
} from "@shared/game-data";
import { AffixRow } from "./affix-row";
import { ItemSprite } from "@/components/sprites";


// ─── Item tooltip card ────────────────────────────────────────────────────────
export function ItemCard({ item, onEquip, onDestroy, onUnequip, onEnhance, isEquipped, compact, equippedSame }: {
  item: GameItem;
  onEquip?: () => void;
  onDestroy?: () => void;
  onUnequip?: () => void;
  onEnhance?: () => void;
  isEquipped?: boolean;
  compact?: boolean;
  equippedSame?: GameItem | null;
}) {
  const [expanded, setExpanded] = useState(false);

  const isUnique = item.source === 'unique' || !!item.uniqueId || item.instanceId?.startsWith('unique_');
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

  if (compact) {
    const [hover, setHover] = useState(false);
    const iconRef = useRef<HTMLDivElement>(null);
    return (
      <div className="relative"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div ref={iconRef}
          className={`rounded-lg border flex items-center justify-center aspect-square transition-all cursor-pointer ${borderClass} ${bgClass} hover:scale-105`}
          data-testid={`item-card-${item.instanceId}`}
          onContextMenu={(e) => {
            e.preventDefault();
            if (isEquipped && onUnequip) onUnequip();
            else if (!isEquipped && onEquip) onEquip();
          }}
          title=""
        >
          <ItemSprite slot={item.slot} baseId={(item as any).baseId ?? (item as any).baseType} rarity={item.rarity} ilvl={item.ilvl} size={32} />
        </div>
        {hover && createPortal(
          <div className="fixed z-[99999] w-56 bg-card border border-border rounded-lg p-3 shadow-2xl space-y-1.5 text-xs"
            style={{
              left: iconRef.current ? Math.min(iconRef.current.getBoundingClientRect().right + 8, window.innerWidth - 240) : 0,
              top: iconRef.current ? iconRef.current.getBoundingClientRect().top : 0,
            }}>
            <div className="flex items-center gap-2">
              <ItemSprite slot={item.slot} baseId={(item as any).baseId ?? (item as any).baseType} rarity={item.rarity} ilvl={item.ilvl} size={24} />
              <div>
                <p className={`text-sm font-bold ${nameClass}`}>{item.name}</p>
                <div className="flex items-center gap-1.5">
                  <p className="text-[10px] text-muted-foreground">{SLOT_LABEL[item.slot]} · ilvl {item.ilvl}</p>
                  {isSet && setDef && <span className="text-[9px] px-1 rounded border border-teal-400/50 text-teal-300 bg-teal-400/10">套装</span>}
                  {isUnique && !isSet && <span className="text-[9px] px-1 rounded border border-amber-400/50 text-amber-300 bg-amber-400/10">独特</span>}
                </div>
              </div>
            </div>
            {isSet && setDef && <p className="text-[10px] text-teal-300">{setDef.name} ({setDef.pieces.length}件套)</p>}
            <p className="text-orange-200">⚔ {item.minDamage ?? 0}-{item.maxDamage ?? 0} 武器伤害</p>
            <div className="flex flex-wrap gap-x-2 gap-y-0.5">
              {(item.attackBonus ?? 0) !== 0 && <span className="text-red-300">⚔ +{item.attackBonus} 攻击</span>}
              {(item.defenceBonus ?? 0) !== 0 && <span className="text-blue-300">🛡 +{item.defenceBonus} 防御</span>}
              {(item.hpBonus ?? 0) !== 0 && <span className="text-green-300">❤ +{item.hpBonus} 生命</span>}
              {(item.critRating ?? 0) !== 0 && <span className="text-yellow-300">✦ +{(item.critRating ?? 0).toFixed(1)}% 暴击</span>}
              {(item.enhancedDamage ?? 0) !== 0 && <span className="text-orange-300">🔥 +{item.enhancedDamage}% 最终伤害</span>}
              {(item.lifeLeech ?? 0) !== 0 && <span className="text-rose-300">🩸 {item.lifeLeech}% 吸血</span>}
              {(item.attackSpeed ?? 0) !== 0 && <span className="text-sky-300">⚡ -{item.attackSpeed}% 间隔</span>}
            </div>
            {/* Sub-stats */}
            {(item.subStats?.length ?? 0) > 0 && (
              <div className="border-t border-amber-400/20 pt-1.5 space-y-0.5">
                <div className="text-[9px] text-amber-400/70 uppercase tracking-widest font-semibold">副属性 +{item.enhanceLevel ?? 0}</div>
                {item.subStats!.map((s, i) => {
                  const q = s.quality ?? 1;
                  const qColors = ['text-amber-400/60', 'text-amber-300', 'text-orange-300 font-bold'];
                  const qMarks = ['▵', '◆', '★'];
                  return (
                    <div key={i} className="flex items-center gap-1.5 text-[10px]">
                      <span className={qColors[q]}>{qMarks[q]}</span>
                      <span className="text-amber-300/80">{SUB_STAT_LABEL[s.type] ?? s.type}</span>
                      <span className={qColors[q]}>+{s.value}</span>
                    </div>
                  );
                })}
              </div>
            )}
            {onEnhance && (item.enhanceLevel ?? 0) < MAX_ENHANCE_LEVEL && (
              <button onClick={onEnhance} className="w-full mt-1 py-1 text-[10px] bg-amber-500/10 border border-amber-500/30 rounded text-amber-400 hover:bg-amber-500/20 transition-colors font-semibold">
                🔨 强化 (+{item.enhanceLevel ?? 0}→+{(item.enhanceLevel ?? 0) + 1})
              </button>
            )}
            {(item.legendaryPower) && (
              <div className="border-t border-amber-400/30 pt-1.5 mt-1">
                <p className="text-[10px] text-amber-300 font-medium">⭐ 传奇特效：{item.legendaryPower}</p>
              </div>
            )}
            {equippedSame && (
              <div className="border-t border-border/50 pt-1.5 mt-1">
                <p className="text-[10px] text-muted-foreground">vs 已装备 <ItemSprite slot={equippedSame.slot} baseId={(equippedSame as any).baseId ?? (equippedSame as any).baseType} rarity={equippedSame.rarity} ilvl={equippedSame.ilvl} size={14} /> {equippedSame.name}</p>
              </div>
            )}

          </div>,
          document.body
        )}
      </div>
    );
  }

  return (
    <div className={`rounded-lg border p-3 gap-2 flex flex-col transition-all ${borderClass} ${bgClass}`}
      data-testid={`item-card-${item.instanceId}`}>
      <div className={`flex items-start gap-2`}>
        <ItemSprite slot={item.slot} baseId={(item as any).baseId ?? (item as any).baseType} rarity={item.rarity} ilvl={item.ilvl} size={28} />
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
          {/* Enhance level bar */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-muted-foreground">强化</span>
            <div className="flex-1 h-1.5 bg-muted/30 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${((item.enhanceLevel ?? 0) / MAX_ENHANCE_LEVEL) * 100}%` }} />
            </div>
            <span className="text-[10px] text-amber-400 font-bold tabular-nums">+{item.enhanceLevel ?? 0}</span>
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

      {/* Quick stat summary — hide zeros */}
      <div className="flex flex-wrap gap-x-3 gap-y-0.5">
        {(item.attackBonus ?? 0) !== 0 && <span className="text-xs text-red-300">⚔ +{item.attackBonus} 攻击</span>}
        {(item.defenceBonus ?? 0) !== 0 && <span className="text-xs text-blue-300">🛡 +{item.defenceBonus} 防御</span>}
        {(item.hpBonus ?? 0) !== 0 && <span className="text-xs text-green-300">❤ +{item.hpBonus} 生命</span>}
        {(item.critRating ?? 0) !== 0 && <span className="text-xs text-yellow-300">✦ +{(item.critRating ?? 0).toFixed(1)}% 暴击</span>}
        {(item.enhancedDamage ?? 0) !== 0 && <span className="text-xs text-orange-300">🔥 +{item.enhancedDamage}% 最终伤害</span>}
        {(item.lifeOnKill ?? 0) !== 0 && <span className="text-xs text-pink-300">💗 +{item.lifeOnKill} 命中回血</span>}
        {(item.crushingBlow ?? 0) !== 0 && <span className="text-xs text-red-500">💥 {item.crushingBlow}% 强击</span>}
        {(item.magicFind ?? 0) !== 0 && <span className="text-xs text-purple-300">🍀 {item.magicFind}% 掉落概率</span>}
        {(item.lifeRegen ?? 0) !== 0 && <span className="text-xs text-emerald-300">🌿 +{item.lifeRegen} 生命回复/回合</span>}
        {(item.resistAll ?? 0) !== 0 && <span className="text-xs text-cyan-300">🔵 -{item.resistAll} 受伤</span>}
        {(item.lifeLeech ?? 0) !== 0 && <span className="text-xs text-rose-300">🩸 {item.lifeLeech}% 吸血</span>}
        {(item.deadlyStrike ?? 0) !== 0 && <span className="text-xs text-amber-300">⚡ {item.deadlyStrike}% 暴击伤害</span>}
        {(item.attackSpeed ?? 0) !== 0 && <span className="text-xs text-sky-300">⚡ -{item.attackSpeed}% 攻击间隔</span>}
        {(item.reflectDamage ?? 0) !== 0 && <span className="text-xs text-lime-300">🌵 {item.reflectDamage}% 反弹</span>}
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

      {/* Sub-stats */}
      {(item.subStats?.length ?? 0) > 0 && (
        <div className="border-t border-amber-400/20 pt-1.5 space-y-0.5">
          <div className="text-[9px] text-amber-400/70 uppercase tracking-widest font-semibold">副属性</div>
          {item.subStats!.map((s, i) => {
            const q = s.quality ?? 1;
            const qColors = ['text-amber-400/60', 'text-amber-300', 'text-orange-300 font-bold'];
            const qMarks = ['▵', '◆', '★'];
            return (
              <div key={i} className="flex items-center gap-1.5 text-[11px]">
                <span className={qColors[q]}>{qMarks[q]}</span>
                <span className="text-amber-300/80">{SUB_STAT_LABEL[s.type] ?? s.type}</span>
                <span className={`${qColors[q]}`}>+{s.value}</span>
              </div>
            );
          })}
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
      <div className="flex gap-2 mt-1 flex-wrap">
        {onEnhance && (item.enhanceLevel ?? 0) < MAX_ENHANCE_LEVEL && (
          <Button size="sm" variant="outline" onClick={onEnhance} className="h-7 text-xs px-2 border-amber-500/30 text-amber-400 hover:bg-amber-500/10">
            🔨 +{item.enhanceLevel ?? 0}
          </Button>
        )}
        {isEquipped && onUnequip && (
          <Button size="sm" variant="outline" onClick={onUnequip} className="h-7 text-xs px-2" data-testid={`button-unequip-${item.slot}`}>
            卸下
          </Button>
        )}
        {!isEquipped && onEquip && (
          <CompareWrapper item={item} equipped={equippedSame}>
            <Button size="sm" onClick={onEquip} className="h-7 text-xs px-2 flex-1" data-testid={`button-equip-${item.instanceId}`}>
              装备
            </Button>
          </CompareWrapper>
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

// ─── Equip button with hover comparison ────────────────────────────────────
function CompareWrapper({ item, equipped, children }: { item: GameItem; equipped?: GameItem | null; children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  if (!equipped) return <>{children}</>;
  const diff = (a: number, b: number) => a === b ? null : <span className={a > b ? 'text-green-400' : 'text-red-400'}> {a > b ? '+' : ''}{a - b}</span>;
  return (
    <div className="relative" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && createPortal(
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[99999] w-64 bg-card border border-border rounded-lg p-3 shadow-2xl space-y-1.5 text-xs">
          <p className={`font-bold ${RARITY_COLOR[equipped.rarity]}`}><ItemSprite slot={equipped.slot} baseId={(equipped as any).baseId ?? (equipped as any).baseType} rarity={equipped.rarity} ilvl={equipped.ilvl} size={14} /> {equipped.name}</p>
          <p className="text-[10px] text-muted-foreground">{SLOT_LABEL[equipped.slot]} · 物品等级 {equipped.ilvl}</p>
          <div className="flex flex-wrap gap-x-2 gap-y-0.5">
            <span className="text-red-300">⚔ +{equipped.attackBonus ?? 0}{diff(item.attackBonus, equipped.attackBonus)}</span>
            <span className="text-blue-300">🛡 +{equipped.defenceBonus ?? 0}{diff(item.defenceBonus, equipped.defenceBonus)}</span>
            <span className="text-green-300">❤ +{equipped.hpBonus ?? 0}{diff(item.hpBonus, equipped.hpBonus)}</span>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
