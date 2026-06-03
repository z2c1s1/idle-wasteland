import { AFFIX_LABEL, AFFIX_COLOR } from "@shared/game-data";


// ─── Shared affix row with optional blue/gold tint ───────────────────────────
export function AffixRow({ affix, tint }: { affix: { type: string; value: number }; tint?: 'blue' | 'gold' }) {
  const baseColor = AFFIX_COLOR[affix.type as keyof typeof AFFIX_COLOR] ?? 'text-foreground';
  const labelColor = tint === 'blue' ? 'text-blue-300' : tint === 'gold' ? 'text-yellow-300' : baseColor;
  const label = AFFIX_LABEL[affix.type as keyof typeof AFFIX_LABEL] ?? affix.type;
  const hints: Record<string, string> = {
    strength:       `+${affix.value} 攻击力`,
    armour:         `+${affix.value} 防御`,
    dexterity:      `+${(affix.value * 0.5).toFixed(1)}% 暴击率`,
    vitality:       `+${affix.value * 5} 最大生命`,
    intelligence:   `所有技能伤害 +${Math.floor(affix.value * 0.5)}%`,
    damage_percent: `所有伤害 +${affix.value}%`,
    life_on_hit:    `每次命中恢复 ${affix.value} 生命`,
    overpower:      `${affix.value}% 概率触发强击（额外造成最大 HP 1% 伤害）`,
    lucky_hit:      `${affix.value}% 概率幸运命中（触发时恢复生命）`,
    life_regen:     `每回合恢复 ${affix.value} 生命`,
    resist_all:     `所有伤害减免 ${affix.value} 点`,
    life_leech:     `造成伤害的 ${affix.value}% 恢复生命`,
    crit_damage:    `暴击伤害 +${affix.value}%`,
    attack_speed:   `攻击间隔缩短 ${affix.value}%`,
    thorns:         `被击时对攻击者反弹 ${affix.value} 伤害`,
    skill_rank:     `所有技能等级 +${affix.value}（提升 ${affix.value * 5}% 战斗效能）`,
  };
  const hint = hints[affix.type];
  return (
    <div className={`text-xs flex items-center gap-1.5 ${labelColor}`}>
      <span className="font-semibold">+{affix.value} {label}</span>
      {hint && <span className="text-muted-foreground text-[10px]">({hint})</span>}
    </div>
  );
}
