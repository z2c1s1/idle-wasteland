
// ─── Cursed Trial: Roguelike boss rush ─────────────────────────────────────────
export interface TrialBuff {
  id: string; name: string; emoji: string; effect: string;
  attackMul: number; hpMul: number; defMul: number; regenBonus: number;
}
export interface TrialCurse {
  id: string; name: string; emoji: string; effect: string;
  hpMul: number; dmgTakenMul: number;
}
export const TRIAL_BUFFS: TrialBuff[] = [
  { id:'b_atk',name:'肾上腺素',emoji:'💉',effect:'攻击+25%',attackMul:1.25,hpMul:1,defMul:1,regenBonus:0 },
  { id:'b_hp',name:'变异体质',emoji:'🧬',effect:'HP+30%',attackMul:1,hpMul:1.3,defMul:1,regenBonus:0 },
  { id:'b_def',name:'防弹衣',emoji:'🛡️',effect:'防御+40%',attackMul:1,hpMul:1,defMul:1.4,regenBonus:0 },
  { id:'b_leech',name:'生命汲取',emoji:'🩸',effect:'+10%吸血',attackMul:1.05,hpMul:1,defMul:1,regenBonus:0 },
  { id:'b_regen',name:'快速愈合',emoji:'🩹',effect:'+8回复/回合',attackMul:1,hpMul:1,defMul:1,regenBonus:8 },
  { id:'b_crit',name:'弱点感知',emoji:'🎯',effect:'暴击+20%',attackMul:1.1,hpMul:1,defMul:1,regenBonus:0 },
  { id:'b_gold',name:'物资嗅觉',emoji:'📦',effect:'金币+100%',attackMul:1,hpMul:1,defMul:1,regenBonus:0 },
  { id:'b_speed',name:'兴奋剂',emoji:'💊',effect:'攻速+30%',attackMul:1.15,hpMul:1,defMul:1,regenBonus:0 },
];
export const TRIAL_CURSES: TrialCurse[] = [
  { id:'c_frail',name:'辐射病',emoji:'☢️',effect:'HP-15%',hpMul:0.85,dmgTakenMul:1 },
  { id:'c_wound',name:'伤口感染',emoji:'🦠',effect:'受伤+20%',hpMul:1,dmgTakenMul:1.2 },
  { id:'c_slow',name:'乏力',emoji:'🐌',effect:'攻速-15%',hpMul:1,dmgTakenMul:1 },
  { id:'c_curse',name:'装备故障',emoji:'🔧',effect:'暴击-10%',hpMul:1,dmgTakenMul:1 },
  { id:'c_decay',name:'腐败',emoji:'🥫',effect:'回复-5/回合',hpMul:1,dmgTakenMul:1 },
  { id:'c_fog',name:'辐射尘暴',emoji:'🌫️',effect:'10%攻击落空',hpMul:1,dmgTakenMul:1 },
  { id:'c_magnet',name:'金属疲劳',emoji:'🧲',effect:'敌人攻击+25%',hpMul:1,dmgTakenMul:1.25 },
  { id:'c_poor',name:'物资短缺',emoji:'📦',effect:'金币-50%',hpMul:1,dmgTakenMul:1 },
];
