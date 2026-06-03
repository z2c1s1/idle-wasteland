// Combat triangle + ranged/magic implementation
const fs = require('fs');
const r = (p) => fs.readFileSync(p, 'utf-8');
const w = (p, c) => { fs.writeFileSync(p, c, 'utf-8'); console.log('OK: ' + p); };

// ── game-data.ts: combat style + new weapons + triangle ────────────────────
let gd = r('shared/game-data.ts');

// Add combatStyle to ItemBase
gd = gd.replace(
  '  minDamage: number;    // weapon: base min damage; armor: 0',
  '  combatStyle?: \'melee\' | \'ranged\' | \'magic\'; // weapon combat type\n  minDamage: number;    // weapon: base min damage; armor: 0'
);

// Add ranged weapons after last melee weapon (rune_blade)
gd = gd.replace(
  "    { id:'rune_blade', name:'符文刃', emoji:'✨', slot:'weapon', reqIlvl:60, minDamage:28, maxDamage:62, baseDefence:0 },",
  "    { id:'rune_blade',  name:'符文刃', emoji:'✨', slot:'weapon', reqIlvl:60, minDamage:28, maxDamage:62, baseDefence:0, combatStyle:'melee' },\n" +
  "    // Ranged weapons\n" +
  "    { id:'shortbow',   name:'短弓',   emoji:'🏹', slot:'weapon', reqIlvl:1,  minDamage:1, maxDamage:5,  baseDefence:0, combatStyle:'ranged' },\n" +
  "    { id:'longbow',    name:'长弓',   emoji:'🏹', slot:'weapon', reqIlvl:10, minDamage:3, maxDamage:9,  baseDefence:0, combatStyle:'ranged' },\n" +
  "    { id:'composite_bow',name:'复合弓',emoji:'🏹',slot:'weapon', reqIlvl:22, minDamage:5, maxDamage:14, baseDefence:0, combatStyle:'ranged' },\n" +
  "    { id:'crossbow',   name:'轻弩',   emoji:'🏹', slot:'weapon', reqIlvl:35, minDamage:8, maxDamage:22, baseDefence:0, combatStyle:'ranged' },\n" +
  "    { id:'heavy_crossbow',name:'重弩',emoji:'🏹',slot:'weapon', reqIlvl:48, minDamage:12,maxDamage:35, baseDefence:0, combatStyle:'ranged' },\n" +
  "    { id:'rune_bow',   name:'符文弓', emoji:'🏹', slot:'weapon', reqIlvl:62, minDamage:18,maxDamage:50, baseDefence:0, combatStyle:'ranged' },\n" +
  "    // Magic weapons\n" +
  "    { id:'apprentice_staff',name:'学徒杖',emoji:'🪄',slot:'weapon',reqIlvl:1, minDamage:2,maxDamage:7, baseDefence:0, combatStyle:'magic' },\n" +
  "    { id:'elemental_staff', name:'元素杖',emoji:'🪄',slot:'weapon',reqIlvl:12,minDamage:4,maxDamage:12,baseDefence:0, combatStyle:'magic' },\n" +
  "    { id:'arcane_staff',    name:'秘法杖',emoji:'🪄',slot:'weapon',reqIlvl:25,minDamage:6,maxDamage:18,baseDefence:0, combatStyle:'magic' },\n" +
  "    { id:'dragon_staff',    name:'龙语法杖',emoji:'🪄',slot:'weapon',reqIlvl:38,minDamage:9,maxDamage:26,baseDefence:0, combatStyle:'magic' },\n" +
  "    { id:'void_staff',      name:'虚空法杖',emoji:'🪄',slot:'weapon',reqIlvl:52,minDamage:13,maxDamage:38,baseDefence:0, combatStyle:'magic' },\n" +
  "    { id:'chaos_codex',     name:'混沌法典',emoji:'📖',slot:'weapon',reqIlvl:65,minDamage:18,maxDamage:52,baseDefence:0, combatStyle:'magic' },"
);

// Add combat triangle table before ENEMIES section
gd = gd.replace(
  '// ─── Enemy definitions (for combat page)',
  '// ─── Combat triangle ─────────────────────────────────────────────────────────\n' +
  'export type CombatStyle = \'melee\' | \'ranged\' | \'magic\';\n' +
  '\n' +
  'export const COMBAT_TRIANGLE: Record<CombatStyle, { strong: CombatStyle; weak: CombatStyle; label: string }> = {\n' +
  '  melee:  { strong: \'ranged\', weak: \'magic\',  label: \'近战\' },\n' +
  '  ranged: { strong: \'magic\',  weak: \'melee\',  label: \'远程\' },\n' +
  '  magic:  { strong: \'melee\',  weak: \'ranged\', label: \'魔法\' },\n' +
  '};\n' +
  '\n' +
  'export const TRIANGLE_DAMAGE_BONUS = 0.30; // +30% damage when strong\n' +
  'export const TRIANGLE_DAMAGE_PENALTY = 0.15; // -15% damage when weak\n' +
  '\n' +
  'export function getCombatStyle(item: { combatStyle?: CombatStyle } | null | undefined): CombatStyle {\n' +
  '  return item?.combatStyle ?? \'melee\';\n' +
  '}\n' +
  '\n' +
  '// ─── Enemy definitions (for combat page)'
);

// Add combatStyle to ENEMIES
const enemyStyleMap = {
  'Chicken': 'melee', 'Goblin': 'melee', 'Skeleton': 'melee',
  'Dark Wizard': 'magic', 'Orc': 'melee', 'Ice Troll': 'melee',
  'Black Knight': 'melee', 'Giant': 'melee',
  'Green Dragon': 'ranged', 'Fire Dragon': 'magic'
};
for (const [name, style] of Object.entries(enemyStyleMap)) {
  const p = `id:'${name.toLowerCase().replace(/ /g,'_')}',`;
  if (gd.includes(p)) {
    gd = gd.replace(
      `name:'${name}', emoji:`,
      `name:'${name}', emoji:`
    );
    // Add combatStyle after xp field
    const re = new RegExp(`(name:'${name}',[^}]+xp:\\s*\\d+)`, 'g');
    gd = gd.replace(re, `$1, combatStyle:'${style}'`);
  }
}

w('shared/game-data.ts', gd);
console.log('[1] game-data.ts done');

// ── storage.ts: ranged/magic combat handlers ────────────────────────────────
let st = r('server/storage.ts');

// Add imports
st = st.replace(
  "import { THIEVING_NPCS, calcStealth, calcThievingSuccessRate, calcThievingDoubleRate } from \"@shared/game-data\";",
  "import { THIEVING_NPCS, calcStealth, calcThievingSuccessRate, calcThievingDoubleRate, COMBAT_TRIANGLE, TRIANGLE_DAMAGE_BONUS, TRIANGLE_DAMAGE_PENALTY, getCombatStyle } from \"@shared/game-data\";"
);

// Add ranged/magic handlers right before the Thieving section
const rangedMagicHandler = `
    // ── Ranged combat ──────────────────────────────────────────────────────────
    if (action.startsWith("ranged_")) {
      const enemyIndex = parseInt(action.split("_")[1]);
      const enemy = ENEMIES[enemyIndex];
      if (!enemy) return state;

      return await handleTriangleCombat(state, enemy, enemyIndex, 'ranged', elapsedSeconds, now);
    }

    // ── Magic combat ───────────────────────────────────────────────────────────
    if (action.startsWith("magic_")) {
      const enemyIndex = parseInt(action.split("_")[1]);
      const enemy = ENEMIES[enemyIndex];
      if (!enemy) return state;

      return await handleTriangleCombat(state, enemy, enemyIndex, 'magic', elapsedSeconds, now);
    }

    // ── Thieving ─────────────────────────────────────────────────────────────`;

st = st.replace(
  '    // ── Thieving ─────────────────────────────────────────────────────────────',
  rangedMagicHandler
);

// Now modify the existing combat_ handler to use triangle logic
// Find the combat_ handler and add triangle bonus
const triangleBonusCode = `
      // Combat triangle bonus
      const playerStyle: CombatStyle = (equipment.weapon as any)?.combatStyle ?? 'melee';
      const enemyStyle: CombatStyle = (enemy as any).combatStyle ?? 'melee';
      let triangleMult = 1;
      if (COMBAT_TRIANGLE[playerStyle].strong === enemyStyle) triangleMult = 1 + TRIANGLE_DAMAGE_BONUS;
      else if (COMBAT_TRIANGLE[playerStyle].weak === enemyStyle) triangleMult = 1 - TRIANGLE_DAMAGE_PENALTY;
`;

// Insert before "let goldGained = 0" in the combat_ section
st = st.replace(
  '      let goldGained = 0, bonesGained = 0, dragonBonesGained = 0;\n      let attackXpGained = 0, defenceXpGained = 0, hitpointsXpGained = 0;',
  `      // Combat triangle bonus
      const playerStyle: CombatStyle = (equipment.weapon as any)?.combatStyle ?? 'melee';
      const enemyStyle: CombatStyle = (enemy as any).combatStyle ?? 'melee';
      let triangleMult = 1;
      if (COMBAT_TRIANGLE[playerStyle].strong === enemyStyle) triangleMult = 1 + TRIANGLE_DAMAGE_BONUS;
      else if (COMBAT_TRIANGLE[playerStyle].weak === enemyStyle) triangleMult = 1 - TRIANGLE_DAMAGE_PENALTY;

      let goldGained = 0, bonesGained = 0, dragonBonesGained = 0;
      let attackXpGained = 0, defenceXpGained = 0, hitpointsXpGained = 0;`
);

// Apply triangleMult to damage
st = st.replace(
  '        let totalDmgToEnemy = effAtk * strikes * (deadlyStrikeHit ? 2 : 1) + poisonDmg;\n        // Overpower',
  '        let totalDmgToEnemy = Math.floor((effAtk * strikes * (deadlyStrikeHit ? 2 : 1) + poisonDmg) * triangleMult);\n        // Overpower'
);

// Add handleTriangleCombat function before the class
st = st.replace(
  'export class DatabaseStorage implements IStorage {',
  `type CombatStyle = 'melee' | 'ranged' | 'magic';

async function handleTriangleCombat(
  state: any, enemy: any, enemyIndex: number, style: CombatStyle, elapsedSeconds: number, now: Date
): Promise<any | null> {
  const equipment = parseEquipment(state.equipment);
  const allSkills = Object.values(equipment).flatMap((item: any) => item?.skills ?? []);
  const getSkillVal = (type: string) => allSkills.filter((s: any) => s.type === type).reduce((sum: number, s: any) => sum + s.value, 0);

  const { attackBonus: eqAttackBonus, enhancedDamage, lifeOnKill, crushingBlow, magicFind, lifeRegen, lifeLeech, deadlyStrike, attackSpeed, reflectDamage, resistAll } = getEquipmentBonuses(equipment);
  const spellbladePct = getSkillVal('spellblade');
  const poisonDmg = getSkillVal('poison');
  const thornsDmg = getSkillVal('thorns');
  const berserkPct = getSkillVal('berserk');
  const doubleStrikePct = getSkillVal('doublestrike');
  const dodgePct = getSkillVal('dodge');

  const BASE_COMBAT_SPEED = 3;
  const effectiveCombatSpeed = Math.max(1.5, BASE_COMBAT_SPEED * (1 - attackSpeed / 200));
  const ticks = Math.floor(elapsedSeconds / effectiveCombatSpeed);
  if (ticks <= 0) return state;

  const enemyStyle: CombatStyle = enemy.combatStyle ?? 'melee';
  let triangleMult = 1;
  if (COMBAT_TRIANGLE[style].strong === enemyStyle) triangleMult = 1 + TRIANGLE_DAMAGE_BONUS;
  else if (COMBAT_TRIANGLE[style].weak === enemyStyle) triangleMult = 1 - TRIANGLE_DAMAGE_PENALTY;

  const playerMaxHp = getPlayerMaxHp(state);
  let playerHp = state.playerHp < 0 ? playerMaxHp : state.playerHp;
  let enemyHp = state.enemyHp < 0 ? enemy.maxHp : state.enemyHp;

  const weaponItem = equipment.weapon ?? null;
  const hasWeaponRange = weaponItem && (weaponItem.maxDamage ?? 0) > 0;
  const levelBaseDmg = Math.max(1, Math.floor(calcLevel(style === 'ranged' ? state.rangedXp : state.magicXp) * 1.2) + eqAttackBonus);

  let goldGained = 0, attackXpGained = 0, defenceXpGained = 0, hitpointsXpGained = 0;
  let playerDied = false;
  const newDrops: GameItem[] = [];
  let gemsGained: Record<string, number> = {};

  for (let i = 0; i < ticks; i++) {
    if (lifeRegen > 0) playerHp = Math.min(playerMaxHp, playerHp + lifeRegen);

    const weaponRoll = hasWeaponRange && weaponItem ? (weaponItem.minDamage ?? 0) + Math.floor(Math.random() * ((weaponItem.maxDamage ?? 0) - (weaponItem.minDamage ?? 0) + 1)) : levelBaseDmg;
    const perHitBase = Math.max(1, weaponRoll + eqAttackBonus);
    let effAtk = Math.max(1, perHitBase - enemy.defence);
    if (spellbladePct > 0) effAtk = Math.floor(effAtk * (1 + spellbladePct / 100));
    if (enhancedDamage > 0) effAtk = Math.floor(effAtk * (1 + enhancedDamage / 100));
    if (berserkPct > 0 && playerHp < playerMaxHp * 0.3) effAtk = Math.floor(effAtk * (1 + berserkPct / 100));

    const deadlyStrikeHit = deadlyStrike > 0 && Math.random() * 100 < deadlyStrike;
    const strikes = (doubleStrikePct > 0 && Math.random() * 100 < doubleStrikePct) ? 2 : 1;
    let totalDmgToEnemy = Math.floor((effAtk * strikes * (deadlyStrikeHit ? 2 : 1) + poisonDmg) * triangleMult);
    if (crushingBlow > 0 && Math.random() * 100 < crushingBlow) totalDmgToEnemy += Math.max(1, Math.floor(playerMaxHp * 0.01));

    enemyHp -= totalDmgToEnemy;
    attackXpGained += 4 * strikes;
    if (lifeLeech > 0) playerHp = Math.min(playerMaxHp, playerHp + Math.floor(totalDmgToEnemy * lifeLeech / 100));
    if (lifeOnKill > 0) playerHp = Math.min(playerMaxHp, playerHp + lifeOnKill);

    if (enemyHp <= 0) {
      goldGained += enemy.drops.gold[0] + Math.floor(Math.random() * (enemy.drops.gold[1] - enemy.drops.gold[0] + 1));
      attackXpGained += enemy.xp;
      hitpointsXpGained += Math.floor(enemy.xp / 3);
      // Loot drop
      if (Math.random() < getDropChance(enemyIndex)) {
        const drop = generateDroppedItem(enemyIndex, 0);
        if (drop) { const filterThreshold = RARITY_ORDER[state.lootFilter ?? 'common'] ?? 0; if ((RARITY_ORDER[drop.rarity] ?? 0) >= filterThreshold) newDrops.push(drop); else goldGained += DISENCHANT_GOLD[drop.rarity] ?? 5; }
      }
      enemyHp = enemy.maxHp;
      // Reset to new enemy
    }

    const rawDmg = Math.max(0, enemy.attack - (style === 'melee' ? getPlayerDefence(state) : Math.floor(calcLevel(state.defenceXp) * 0.5)));
    const dmgToPlayer = Math.max(0, rawDmg - resistAll);
    const dodged = dodgePct > 0 && Math.random() * 100 < dodgePct;
    if (!dodged && dmgToPlayer > 0) {
      playerHp -= dmgToPlayer;
      defenceXpGained += 2;
      hitpointsXpGained += 1;
      if (thornsDmg > 0) enemyHp -= thornsDmg;
      if (reflectDamage > 0) enemyHp -= reflectDamage;
    }
    if (playerHp <= 0) { playerDied = true; playerHp = Math.floor(playerMaxHp * 0.5); break; }
  }

  const usedTime = playerDied ? elapsedSeconds : ticks * effectiveCombatSpeed;
  const existingLoot = parseLootBag(state.lootBag);
  const combinedLoot = [...existingLoot, ...newDrops].slice(-50);
  const existingGems = parseGems(state.gems);
  const mergedGems = mergeGems(existingGems, gemsGained);

  const updates: Partial<GameState> = {
    playerHp, enemyHp,
    gold: state.gold + goldGained,
    attackXp: state.attackXp + attackXpGained,
    defenceXp: state.defenceXp + defenceXpGained,
    hitpointsXp: state.hitpointsXp + hitpointsXpGained,
    [style === 'ranged' ? 'rangedXp' : 'magicXp']: (state[style === 'ranged' ? 'rangedXp' : 'magicXp'] ?? 0) + attackXpGained,
    lootBag: JSON.stringify(combinedLoot),
    gems: JSON.stringify(mergedGems),
    actionUpdatedAt: new Date(new Date(state.actionUpdatedAt).getTime() + usedTime * 1000),
    ...(playerDied ? { activeAction: "idle" } : {}),
  };

  const [updated] = await db.update(gameStates).set(updates).where(eq(gameStates.id, state.id)).returning();
  return updated;
}

export class DatabaseStorage implements IStorage {`
);

w('server/storage.ts', st);
console.log('[2] storage.ts done');

// ── combat.tsx: show triangle + add ranged/magic attack buttons ──────────────
let cbt = r('client/src/pages/combat.tsx');

// Add COMBAT_TRIANGLE import
cbt = cbt.replace(
  "import { ENEMIES, DUNGEONS, ALL_SLOTS, RARITY_COLOR, ITEM_SETS, UNIQUE_ITEMS, BOSS_SKILL_LABEL, BOSS_SKILL_DESC, type GameItem, type BossSkillType } from \"@shared/game-data\";",
  "import { ENEMIES, DUNGEONS, ALL_SLOTS, RARITY_COLOR, ITEM_SETS, UNIQUE_ITEMS, BOSS_SKILL_LABEL, BOSS_SKILL_DESC, COMBAT_TRIANGLE, getCombatStyle, type GameItem, type BossSkillType, type CombatStyle } from \"@shared/game-data\";"
);

// Show combat style info near the player stats
cbt = cbt.replace(
  '          <StatBox icon={Zap}    label="暴击"     value={`${eqStats.critRating.toFixed(1)}%`} color="text-yellow-400"',
  `          {/* Combat style */}
          {(() => {
            const weapon = (equipment.weapon as any) ?? null;
            const style = getCombatStyle(weapon);
            const tri = COMBAT_TRIANGLE[style];
            return (
              <StatBox icon={Zap} label="战斗风格" value={tri.label} color="text-yellow-400"
                sub={\`克制 \${COMBAT_TRIANGLE[tri.strong].label} · 弱于 \${COMBAT_TRIANGLE[tri.weak].label}\`} />
            );
          })()}
          <StatBox icon={Zap}    label="暴击"     value={\`\${eqStats.critRating.toFixed(1)}%\`} color="text-yellow-400"`
);

// Add ranged/magic buttons next to the fight button in enemy list
// Find the button: startAction.mutate(\`combat_\${index}\`) and add alternatives
cbt = cbt.replace(
  '                      <Button size="sm" disabled={locked} onClick={() => startAction.mutate(`combat_${index}`)} data-testid={`button-fight-${enemy.id}`}>',
  '                      <Button size="sm" disabled={locked} onClick={() => startAction.mutate(`combat_${index}`)} data-testid={`button-fight-${enemy.id}`} title="近战">'
);

// Add ranged/magic buttons after the melee button  
cbt = cbt.replace(
  '                        {locked ? `${enemy.reqCombatLevel}级` : "战斗"}\n                      </Button>',
  '                        {locked ? `${enemy.reqCombatLevel}级` : "⚔ 近战"}\n                      </Button>\n' +
  '                      <Button size="sm" disabled={locked} variant="outline" onClick={() => startAction.mutate(`ranged_${index}`)} className="h-7 text-xs px-2" title="远程">\n' +
  '                        {locked ? "" : "🏹"}\n' +
  '                      </Button>\n' +
  '                      <Button size="sm" disabled={locked} variant="outline" onClick={() => startAction.mutate(`magic_${index}`)} className="h-7 text-xs px-2" title="魔法">\n' +
  '                        {locked ? "" : "🔮"}\n' +
  '                      </Button>'
);

w('client/src/pages/combat.tsx', cbt);
console.log('[3] combat.tsx done');

// ── sidebar: ranged/magic nav items ──────────────────────────────────────────
let sbar = r('client/src/components/layout/app-sidebar.tsx');

// Add ranged/magic below combat sub-items  
sbar = sbar.replace(
  '        <NavItem title="副本战斗" url="/combat#dungeons" icon={Skull}',
  '        <NavItem title="远程战斗" url="/combat#enemies" icon={Skull}\n' +
  '          level={null} isActive={location === "/combat" && hash === \'#ranged\'} color="text-green-400" />\n' +
  '        <NavItem title="魔法战斗" url="/combat#enemies" icon={Skull}\n' +
  '          level={null} isActive={location === "/combat" && hash === \'#magic\'} color="text-blue-400" />\n' +
  '        <NavItem title="副本战斗" url="/combat#dungeons" icon={Skull}'
);

w('client/src/components/layout/app-sidebar.tsx', sbar);
console.log('[4] sidebar done');

// ── dashboard: ranged/magic skill cards ──────────────────────────────────────
let dash = r('client/src/pages/dashboard.tsx');

dash = dash.replace(
  "import {\n  Axe, Pickaxe, Flame, Waves, PawPrint, Hammer,\n  StopCircle, Skull, Shield, HandMetal,\n} from \"lucide-react\";",
  "import {\n  Axe, Pickaxe, Flame, Waves, PawPrint, Hammer,\n  StopCircle, Skull, Shield, HandMetal, Crosshair, Wand,\n} from \"lucide-react\";"
);

// Add ranged/magic to combat skills
dash = dash.replace(
  'const COMBAT_SKILLS = [\n  { title: "攻击", xpKey: "attackXp"     as const, color: "text-red-400"    },\n  { title: "防御", xpKey: "defenceXp"    as const, color: "text-blue-400"   },\n  { title: "生命", xpKey: "hitpointsXp"  as const, color: "text-green-400"  },\n];',
  'const COMBAT_SKILLS = [\n  { title: "攻击", xpKey: "attackXp"     as const, color: "text-red-400"    },\n  { title: "防御", xpKey: "defenceXp"    as const, color: "text-blue-400"   },\n  { title: "生命", xpKey: "hitpointsXp"  as const, color: "text-green-400"  },\n  { title: "远程", xpKey: "rangedXp"     as const, color: "text-green-400"  },\n  { title: "魔法", xpKey: "magicXp"      as const, color: "text-purple-400" },\n];'
);

w('client/src/pages/dashboard.tsx', dash);
console.log('[5] dashboard done');

console.log('\n=== Triangle Patch Done! ===');
