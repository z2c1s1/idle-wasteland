// ─── Talent effect application ──────────────────────────────────────────────
import type { GameState } from "@shared/schema";
import { TALENT_TREES } from "@shared/game-data";
import type { CombatStyle } from "./_shared";

export interface TalentBonuses {
  attack: number;
  defence: number;
  maxHp: number;
  critRating: number;
  attackSpeed: number;
  enhancedDamage: number;
  dodgePct: number;
  xpBonus: number;
  goldBonus: number;
  magicFind: number;
}

/** Parse simple talent effects like "+2攻击", "+10HP", "+1%暴击" */
function parseTalentEffect(effect: string): Partial<TalentBonuses> {
  const bonuses: Partial<TalentBonuses> = {};
  const parts = effect.split(',').map(s => s.trim());

  for (const part of parts) {
    // Flat adds: "+5攻击", "+10HP", "+3防御"
    const flatMatch = part.match(/^\+(\d+)\s*(攻击|防御|HP|生命)/);
    if (flatMatch) {
      const val = parseInt(flatMatch[1]);
      if (flatMatch[2] === '攻击') bonuses.attack = (bonuses.attack || 0) + val;
      if (flatMatch[2] === '防御') bonuses.defence = (bonuses.defence || 0) + val;
      if (flatMatch[2] === 'HP' || flatMatch[2] === '生命') bonuses.maxHp = (bonuses.maxHp || 0) + val;
    }
    // Percentage adds: "+1%暴击", "+2%攻速", "+3%增伤", "+1%闪避"
    const pctMatch = part.match(/^\+(\d+)%\s*(暴击|攻速|增伤|闪避|经验|掉落|金币)/);
    if (pctMatch) {
      const val = parseInt(pctMatch[1]);
      if (pctMatch[2] === '暴击') bonuses.critRating = (bonuses.critRating || 0) + val;
      if (pctMatch[2] === '攻速') bonuses.attackSpeed = (bonuses.attackSpeed || 0) + val;
      if (pctMatch[2] === '增伤') bonuses.enhancedDamage = (bonuses.enhancedDamage || 0) + val;
      if (pctMatch[2] === '闪避') bonuses.dodgePct = (bonuses.dodgePct || 0) + val;
      if (pctMatch[2] === '经验') bonuses.xpBonus = (bonuses.xpBonus || 0) + val;
      if (pctMatch[2] === '掉落') bonuses.magicFind = (bonuses.magicFind || 0) + val;
      if (pctMatch[2] === '金币') bonuses.goldBonus = (bonuses.goldBonus || 0) + val;
    }
  }
  return bonuses;
}

/** Apply all unlocked talent nodes to get total bonuses */
export function getTalentBonuses(state: GameState): TalentBonuses {
  const bonuses: TalentBonuses = {
    attack: 0, defence: 0, maxHp: 0, critRating: 0,
    attackSpeed: 0, enhancedDamage: 0, dodgePct: 0,
    xpBonus: 0, goldBonus: 0, magicFind: 0,
  };

  const talents: Record<string, string[]> = JSON.parse((state as any).talents ?? '{}');
  for (const style of ['melee', 'ranged', 'magic'] as CombatStyle[]) {
    const tree = TALENT_TREES[style];
    if (!tree) continue;
    const unlocked = talents[style] ?? [];
    for (const nodeId of unlocked) {
      const node = tree.find(n => n.id === nodeId);
      if (!node || !node.effect) continue;
      const parsed = parseTalentEffect(node.effect);
      for (const [k, v] of Object.entries(parsed)) {
        if (v) (bonuses as any)[k] = (bonuses as any)[k] + v;
      }
    }
  }
  return bonuses;
}
