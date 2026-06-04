// E2E player simulation - optimized with longer waits
const B = 'http://localhost:5001';
const post = (u, b) => fetch(B + u, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) }).then(r => r.json());
const get = () => fetch(B + '/api/game').then(r => r.json());
const sleep = ms => new Promise(r => setTimeout(r, ms));

const bugs = [];
function log(msg) { console.log(`[${new Date().toLocaleTimeString()}] ${msg}`); }

async function levelSkill(skillName, targetLevel) {
  const xpKey = skillName + 'Xp';
  let tier = 0;

  // Start action
  await post('/api/game/action', { action: `${skillName}_${tier}` });

  while (true) {
    // Wait enough for ~10 cycles at current tier
    const cycleTime = 3 + tier * 2;
    const waitMs = cycleTime * 1000 * 3; // 3 cycles per check
    await sleep(Math.max(5000, waitMs));

    const s = await get();
    const xp = s[xpKey] || 0;
    const level = Math.floor(Math.pow(Math.max(0, xp), 0.375)) + 1;

    if (level >= targetLevel) {
      log(`  ${skillName}: Lv${level} (${xp} XP) DONE`);
      break;
    }

    // Auto-tier based on reqLevels: [1,4,7,10,15,25,40,60,80,99]
    const REQ = [1,4,7,10,15,25,40,60,80,99];
    let newTier = tier;
    for (let t = REQ.length-1; t >= 0; t--) {
      if (level >= REQ[t]) { newTier = t; break; }
    }
    if (newTier !== tier) {
      tier = newTier;
      await post('/api/game/action', { action: `${skillName}_${tier}` });
    }

    log(`  ${skillName}: Lv${level} T${tier}`);
  }

  await post('/api/game/action', { action: 'idle' });
}

async function main() {
  let s;
  log('=== E2E SIMULATION ===');

  // Phase 1: Gathering to 30
  log('PHASE 1: Gathering skills to Lv30');
  for (const name of ['woodcutting', 'mining', 'fishing', 'hunting']) {
    await levelSkill(name, 30);
  }

  // Agility
  log('  Agility...');
  await post('/api/game/action', { action: 'agility_0' });
  await sleep(90000);
  s = await get();
  log(`  Agility: Lv${Math.floor(Math.pow(Math.max(0,s.agilityXp||0),0.375))+1}`);
  await post('/api/game/action', { action: 'idle' });

  // Phase 2: Build + talents
  log('PHASE 2: Build & talents');
  const buildings = ['shelter','farm','lumbermill','wall','warehouse','clinic','workshop'];
  for (const b of buildings) {
    s = await post('/api/game/build-homestead', { buildingId: b });
    log(`  ${b}: ${s.message||'OK'}`);
  }

  s = await get();
  const skills = [s.attackXp,s.defenceXp,s.hitpointsXp,s.rangedXp||0,s.magicXp||0,
    s.woodcuttingXp,s.miningXp,s.smeltingXp,s.fishingXp,s.huntingXp,
    s.thievingXp,s.agilityXp||0];
  const points = skills.reduce((sum,xp)=>sum+Math.floor((Math.floor(Math.pow(Math.max(0,xp),0.375))+1)/9),0);
  log(`  Talent points: ${points}`);

  // Phase 3: Combat + loot
  log('PHASE 3: Combat for loot');
  for (let e=0; e<=5; e++) {
    await post('/api/game/action', { action: `combat_${e}_1` });
    await sleep(20000);
    s = await get();
    const loot = JSON.parse(s.lootBag||'[]');
    log(`  Enemy ${e}: ${loot.length} loot, HP=${s.playerHp}`);
    if (s.activeAction === 'idle') break;
  }
  await post('/api/game/action', { action: 'idle' });

  // Phase 4: Production skills
  log('PHASE 4: Production');
  await levelSkill('smelting', 10);

  // Phase 5: Dungeon/Tower/Trial
  log('PHASE 5: Dungeon/Tower/Trial');
  s = await post('/api/game/enter-dungeon', { dungeonIndex: 0 });
  log(`  Dungeon: ${s.message||'started: '+s.activeAction}`);
  await sleep(30000);
  s = await get();
  log(`  Dungeon result: ${s.activeAction}, HP=${s.playerHp}`);

  s = await post('/api/game/start-tower', {});
  log(`  Tower: ${s.message||'started: '+s.activeAction}`);
  await sleep(20000);

  s = await post('/api/game/start-trial', {});
  log(`  Trial: ${s.message||'started'}`);

  // Phase 6: Enhance
  log('PHASE 6: Enhance gear');
  s = await get();
  const loot = JSON.parse(s.lootBag||'[]');
  for (let i=0; i<Math.min(loot.length, 9); i++) {
    for (let lv=0; lv<4; lv++) {
      s = await post('/api/game/enhance', { instanceId: loot[i].instanceId });
      if (s.message) { log(`  ${loot[i].name}: ${s.message}`); break; }
    }
  }
  s = await get();
  const eq = JSON.parse(s.equipment||'{}');
  log(`  Equipment: ${Object.keys(eq).length} slots filled`);

  // Final
  s = await get();
  log(`\nFINAL: Gold=${s.gold} Tier=${s.worldTier} Loot=${JSON.parse(s.lootBag||'[]').length}`);
  if (bugs.length) { log('\nBUGS:'); bugs.forEach(b=>log('  '+b)); }
  log('DONE');
}

main().catch(e => { console.error(e.message); bugs.push('FATAL: '+e.message); });
