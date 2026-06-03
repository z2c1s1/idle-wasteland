// Patch #12: Boss special skills (fixed template literal issue)
import * as fs from 'fs';

function read(p: string) { return fs.readFileSync(p, 'utf-8'); }
function write(p: string, content: string) { console.log(`write ${p} (${content.length} chars)`); fs.writeFileSync(p, content, 'utf-8'); }

console.log('=== Boss Skills Patcher ===\n');

// ─── STEP A: game-data.ts — add BossSkill type and skills to bosses ────────
let gd = read('shared/game-data.ts');

// A1: Add BossSkill type before DungeonBoss interface
const bossSkillTypes = [
  '// ─── Boss skills ──────────────────────────────────────────────────────────────',
  'export type BossSkillType = \'shield\' | \'aoe\' | \'heal\' | \'enrage\';',
  '',
  'export const BOSS_SKILL_LABEL: Record<BossSkillType, string> = {',
  '  shield: \'护盾\',',
  '  aoe: \'范围攻击\',',
  '  heal: \'自愈\',',
  '  enrage: \'狂暴\',',
  '};',
  '',
  'export const BOSS_SKILL_DESC: Record<BossSkillType, string> = {',
  '  shield: \'获得护盾，减免 50% 伤害\',',
  '  aoe: \'对所有玩家造成额外伤害\',',
  '  heal: \'恢复部分生命值\',',
  '  enrage: \'攻击力大幅提升\',',
  '};',
  '',
  'export interface BossSkill {',
  '  type: BossSkillType;',
  '  name: string;',
  '  cooldownSec: number;',
  '  value: number;',
  '  duration: number;',
  '}',
  '',
].join('\n');

gd = gd.replace(
  '// ─── Dungeon system ────────────────────────────────────────────────────────────\n' +
  'export interface DungeonBoss {\n' +
  '  name: string;\n' +
  '  emoji: string;\n' +
  '  maxHp: number;\n' +
  '  attack: number;\n' +
  '  defence: number;\n' +
  '  xp: number;\n' +
  '}',
  bossSkillTypes + '\n' +
  '// ─── Dungeon system ────────────────────────────────────────────────────────────\n' +
  'export interface DungeonBoss {\n' +
  '  name: string;\n' +
  '  emoji: string;\n' +
  '  maxHp: number;\n' +
  '  attack: number;\n' +
  '  defence: number;\n' +
  '  xp: number;\n' +
  '  skills?: BossSkill[];\n' +
  '}'
);
write('shared/game-data.ts', gd);
console.log('[A1] BossSkill types added');

// A2: Add skills to each boss
gd = read('shared/game-data.ts');

const bossReplacements: Array<[string, string]> = [
  [
    "boss: { name: '矿坑蠕变怪', emoji: '🦠', maxHp: 500, attack: 14, defence: 4, xp: 200 },",
    "boss: { name: '矿坑蠕变怪', emoji: '🦠', maxHp: 500, attack: 14, defence: 4, xp: 200, skills: [{ type: 'shield', name: '腐化甲壳', cooldownSec: 12, value: 50, duration: 1 }] },"
  ],
  [
    "boss: { name: '幽魂领主', emoji: '👻', maxHp: 1100, attack: 26, defence: 9, xp: 450 },",
    "boss: { name: '幽魂领主', emoji: '👻', maxHp: 1100, attack: 26, defence: 9, xp: 450, skills: [{ type: 'aoe', name: '幽魂嚎叫', cooldownSec: 15, value: 20, duration: 0 }] },"
  ],
  [
    "boss: { name: '裂焰祭司', emoji: '🔥', maxHp: 1800, attack: 42, defence: 15, xp: 900 },",
    "boss: { name: '裂焰祭司', emoji: '🔥', maxHp: 1800, attack: 42, defence: 15, xp: 900, skills: [{ type: 'heal', name: '烈焰洗礼', cooldownSec: 18, value: 300, duration: 0 }, { type: 'enrage', name: '火焰狂怒', cooldownSec: 24, value: 30, duration: 2 }] },"
  ],
  [
    "boss: { name: '虚空守卫', emoji: '🌀', maxHp: 2800, attack: 65, defence: 24, xp: 1800 },",
    "boss: { name: '虚空守卫', emoji: '🌀', maxHp: 2800, attack: 65, defence: 24, xp: 1800, skills: [{ type: 'shield', name: '虚空屏障', cooldownSec: 15, value: 50, duration: 1 }, { type: 'aoe', name: '虚空裂隙', cooldownSec: 20, value: 35, duration: 0 }] },"
  ],
  [
    "boss: { name: '远古龙灵', emoji: '🐲', maxHp: 4200, attack: 100, defence: 36, xp: 3500 },",
    "boss: { name: '远古龙灵', emoji: '🐲', maxHp: 4200, attack: 100, defence: 36, xp: 3500, skills: [{ type: 'aoe', name: '龙息烈焰', cooldownSec: 15, value: 45, duration: 0 }, { type: 'heal', name: '龙骨再生', cooldownSec: 22, value: 600, duration: 0 }, { type: 'enrage', name: '龙怒', cooldownSec: 30, value: 40, duration: 2 }] },"
  ],
  [
    "boss: { name: '混沌之主', emoji: '👹', maxHp: 6000, attack: 145, defence: 55, xp: 7000 },",
    "boss: { name: '混沌之主', emoji: '👹', maxHp: 6000, attack: 145, defence: 55, xp: 7000, skills: [{ type: 'shield', name: '混沌壁垒', cooldownSec: 18, value: 60, duration: 1 }, { type: 'aoe', name: '混沌风暴', cooldownSec: 15, value: 55, duration: 0 }, { type: 'enrage', name: '混沌狂怒', cooldownSec: 30, value: 50, duration: 3 }] },"
  ],
];

for (const [from, to] of bossReplacements) {
  if (gd.includes(from)) {
    gd = gd.replace(from, to);
    console.log(`  ✓ boss skills added: ${from.substring(20, 60)}...`);
  } else {
    console.log(`  ⚠ pattern not found: ${from.substring(20, 50)}...`);
  }
}

write('shared/game-data.ts', gd);
console.log('[A2] Boss skills applied to all dungeons');

// ─── STEP B: server/storage.ts — apply boss skills in combat ────────────────
let st = read('server/storage.ts');

// B1: Add boss skill tracking variables after BASE_COMBAT_SPEED
const skillTrackingCode = `      // Boss skill tracking
      const bossSkills = dungeon.boss.skills ?? [];
      const bossSkillCooldowns: number[] = bossSkills.map(() => Math.floor(Math.random() * dungeon.boss.skills![0]?.cooldownSec ?? 0));
      const bossActiveEffects: Array<{ skill: typeof bossSkills[0]; remainingTicks: number }> = [];`;

const target1 = `      const BASE_COMBAT_SPEED = 3;
      const effectiveCombatSpeed = Math.max(1.5, BASE_COMBAT_SPEED * (1 - attackSpeed / 200));
      const ticks = Math.floor(elapsedSeconds / effectiveCombatSpeed);
      if (ticks <= 0) return state;`;

const replacement1 = `      const BASE_COMBAT_SPEED = 3;
      const effectiveCombatSpeed = Math.max(1.5, BASE_COMBAT_SPEED * (1 - attackSpeed / 200));
      const ticks = Math.floor(elapsedSeconds / effectiveCombatSpeed);
      if (ticks <= 0) return state;

      // Boss skill tracking
      const bossSkills = (dungeon.boss.skills ?? []) as Array<{ type: string; name: string; cooldownSec: number; value: number; duration: number }>;
      const bossSkillCooldowns: number[] = bossSkills.map(() => 0);
      let bossActiveEffects: Array<{ skill: typeof bossSkills[0]; remainingTicks: number }> = [];`;

st = st.replace(target1, replacement1);
write('server/storage.ts', st);
console.log('[B1] Boss skill tracking variables added');

// B2: Add skill processing before the raw damage calculation
st = read('server/storage.ts');

const target2 = `        const rawDmg = Math.max(0, boss.attack - getPlayerDefence(state));
        const dmgToPlayer = Math.max(0, rawDmg - resistAll);
        const dodged = dodgePct > 0 && Math.random() * 100 < dodgePct;
        if (!dodged && dmgToPlayer > 0) {`;

const replacement2 = `        // Process boss skills
        let bossEnhancedAtk = boss.attack;
        let bossShieldActive = false;
        // Update active effects
        bossActiveEffects = bossActiveEffects.filter(e => {
          if (e.skill.type === 'enrage') bossEnhancedAtk = Math.floor(bossEnhancedAtk * (1 + e.skill.value / 100));
          if (e.skill.type === 'shield') bossShieldActive = true;
          e.remainingTicks--;
          return e.remainingTicks > 0;
        });
        // Tick cooldowns and trigger skills
        for (let si = 0; si < bossSkills.length; si++) {
          bossSkillCooldowns[si] -= effectiveCombatSpeed;
          if (bossSkillCooldowns[si] <= 0) {
            const skill = bossSkills[si];
            bossSkillCooldowns[si] = skill.cooldownSec;
            if (skill.type === 'shield') {
              bossActiveEffects.push({ skill, remainingTicks: skill.duration > 0 ? skill.duration : 1 });
            } else if (skill.type === 'heal') {
              enemyHp = Math.min(dungeon.boss.maxHp, enemyHp + skill.value);
            } else if (skill.type === 'aoe') {
              const aoeDmg = skill.value;
              if (aoeDmg > 0) playerHp -= aoeDmg;
              hitpointsXpGained += 1;
            } else if (skill.type === 'enrage') {
              bossActiveEffects.push({ skill, remainingTicks: skill.duration > 0 ? skill.duration : 1 });
            }
          }
        }

        const rawDmg = Math.max(0, bossEnhancedAtk - getPlayerDefence(state));
        const dmgToPlayer = Math.max(0, rawDmg - resistAll);
        const dodged = dodgePct > 0 && Math.random() * 100 < dodgePct;
        if (!dodged && dmgToPlayer > 0) {`;

st = st.replace(target2, replacement2);
write('server/storage.ts', st);
console.log('[B2] Boss skill combat logic added');

// B3: Shield reduces damage to boss
st = read('server/storage.ts');

const target3 = `        let totalDmgToEnemy = effAtk * strikes * (deadlyStrikeHit ? 2 : 1) + poisonDmg;`;

const replacement3 = `        let totalDmgToEnemy = effAtk * strikes * (deadlyStrikeHit ? 2 : 1) + poisonDmg;
        // Boss shield: 50% damage reduction
        if (bossShieldActive) totalDmgToEnemy = Math.floor(totalDmgToEnemy * 0.5);`;

st = st.replace(target3, replacement3);
write('server/storage.ts', st);
console.log('[B3] Shield damage reduction added');

// ─── STEP C: combat.tsx — show boss skills in UI ────────────────────────────
let cbt = read('client/src/pages/combat.tsx');

// C1: Add BOSS_SKILL_LABEL to import
cbt = cbt.replace(
  'import { ENEMIES, DUNGEONS, ALL_SLOTS, RARITY_COLOR, ITEM_SETS, UNIQUE_ITEMS, type GameItem } from "@shared/game-data";',
  'import { ENEMIES, DUNGEONS, ALL_SLOTS, RARITY_COLOR, ITEM_SETS, UNIQUE_ITEMS, BOSS_SKILL_LABEL, BOSS_SKILL_DESC, type GameItem } from "@shared/game-data";'
);
write('client/src/pages/combat.tsx', cbt);
console.log('[C1] Boss skill imports added');

// C2: Add skill display in active dungeon combat
cbt = read('client/src/pages/combat.tsx');

const activeDungeonTarget = [
  '            <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">',
  '              <div><span className="text-foreground font-medium">Boss 攻击：</span>{activeDungeon.boss.attack}</div>',
  '              <div><span className="text-foreground font-medium">Boss 防御：</span>{activeDungeon.boss.defence}</div>',
  '              <div><span className="text-foreground font-medium">我方伤害：</span>{Math.max(1, playerAtk - activeDungeon.boss.defence)}/3s</div>',
  '            </div>',
].join('\n');

const activeDungeonReplacement = [
  '            <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">',
  '              <div><span className="text-foreground font-medium">Boss 攻击：</span>{activeDungeon.boss.attack}</div>',
  '              <div><span className="text-foreground font-medium">Boss 防御：</span>{activeDungeon.boss.defence}</div>',
  '              <div><span className="text-foreground font-medium">我方伤害：</span>{Math.max(1, playerAtk - activeDungeon.boss.defence)}/3s</div>',
  '            </div>',
  '',
  '            {/* Boss skills */}',
  '            {(activeDungeon.boss.skills?.length ?? 0) > 0 && (',
  '              <div className="flex flex-wrap gap-1.5 items-start">',
  '                <span className="text-[10px] text-purple-400/70 font-semibold uppercase tracking-wider">⚡ Boss 技能：</span>',
  '                {activeDungeon.boss.skills!.map((skill: any, i: number) => (',
  '                  <span key={i} className="text-[10px] px-2 py-0.5 rounded border border-purple-400/40 text-purple-300 bg-purple-400/8"',
  '                    title={"冷却 " + skill.cooldownSec + "s — " + (BOSS_SKILL_DESC[skill.type] ?? "")}>',
  '                    {skill.name} ({BOSS_SKILL_LABEL[skill.type]}) · {skill.cooldownSec}s CD',
  '                  </span>',
  '                ))}',
  '              </div>',
  '            )}',
].join('\n');

cbt = cbt.replace(activeDungeonTarget, activeDungeonReplacement);
write('client/src/pages/combat.tsx', cbt);
console.log('[C2] Active dungeon skill display added');

// C3: Add skills preview in dungeon list cards
cbt = read('client/src/pages/combat.tsx');

const dungeonCardTarget = '                      {/* Boss skills preview */}';

if (cbt.includes(dungeonCardTarget)) {
  console.log('[C3] dungeon card skills already present');
} else {
  cbt = cbt.replace(
    '                      {/* Dungeon clear stats */}',
    [
      '                      {/* Boss skills preview */}',
      "                      {(dungeon.boss.skills?.length ?? 0) > 0 && (",
      '                        <div className="flex flex-wrap gap-1.5 items-start mb-2">',
      '                          <span className="text-[10px] text-purple-400/60 font-semibold">⚡ 技能：</span>',
      "                          {dungeon.boss.skills!.map((skill: any, i: number) => (",
      '                            <span key={i} className="text-[10px] px-1.5 py-0.5 rounded border border-purple-400/30 text-purple-300/80 bg-purple-400/5"',
      '                              title={"冷却 " + skill.cooldownSec + "s — " + (BOSS_SKILL_DESC[skill.type] ?? "")}>',
      '                              {skill.name}',
      '                            </span>',
      '                          ))}',
      '                        </div>',
      '                      ))}',
      '',
      '                      {/* Dungeon clear stats */}',
    ].join('\n')
  );
  write('client/src/pages/combat.tsx', cbt);
  console.log('[C3] Dungeon card skill preview added');
}

console.log('\n=== Boss Skills Patch Done! ===');
