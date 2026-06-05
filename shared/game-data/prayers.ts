// ═══════════════════════════════════════════════════════════════════════════════
// Prayer system — types, constants, and helper functions
// ═══════════════════════════════════════════════════════════════════════════════

export interface Prayer {
  id: string;
  name: string;
  emoji: string;
  effect: string;
  baseBuff: number;
  buffPerLevel: number;
}

export const PRAYERS: Prayer[] = [
  { id: 'attack',     name: '战神祷言', emoji: '⚔️', effect: '攻击力',   baseBuff: 5,  buffPerLevel: 2 },
  { id: 'defence',    name: '钢铁祷言', emoji: '🛡️', effect: '防御力',   baseBuff: 5,  buffPerLevel: 2 },
  { id: 'fortune',    name: '幸运祷言', emoji: '🍀', effect: '掉落率',   baseBuff: 3,  buffPerLevel: 1.5 },
  { id: 'swiftness',  name: '疾风祷言', emoji: '💨', effect: '行动速度', baseBuff: 3,  buffPerLevel: 1 },
  { id: 'experience', name: '智慧祷言', emoji: '📖', effect: '经验获取', baseBuff: 5,  buffPerLevel: 2 },
];

export function getPrayerLevel(xp: number): number {
  return Math.floor(Math.sqrt(Math.max(0, xp)) / 3) + 1;
}
