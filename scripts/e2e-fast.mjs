// Fast E2E simulation using fast-forward debug API
const B = 'http://localhost:5001';
const post = (u, b) => fetch(B + u, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) }).then(r => r.json());
const get = () => fetch(B + '/api/game').then(r => r.json());
const ff = (s) => post('/api/game/fast-forward', { seconds: s });

const bugs = [];
function log(msg) { console.log(msg); }

async function autoEquip() {
  const s = await get();
  const loot = JSON.parse(s.lootBag || '[]');
  const slots = {};
  for (const item of loot) {
    if (!slots[item.slot] || item.ilvl > slots[item.slot].ilvl) slots[item.slot] = item;
  }
  let equipped = 0;
  for (const [slot, item] of Object.entries(slots)) {
    const r = await post('/api/game/equip', { instanceId: item.instanceId });
    if (!r.message) equipped++;
  }
  if (equipped > 0) log(`  Auto-equipped ${equipped} items`);
}

async function main() {
  let s;
  log('=== FAST E2E SIMULATION ===\n');

  // Start woodcutting
  log('PHASE 1: Woodcutting to Lv30');
  await post('/api/game/action', { action: 'woodcutting_0' });
  
  // Fast-forward in chunks, auto-tiering
  const REQ = [1,4,7,10,15,25,40,60,80,99];
  let tier = 0;
  while (true) {
    await ff(30); // 30 seconds per chunk
    s = await get();
    const level = Math.floor(Math.pow(Math.max(0, s.woodcuttingXp), 0.375)) + 1;
    if (level >= 30) { log(`  Woodcutting: Lv${level} DONE`); break; }
    
    let newTier = tier;
    for (let t = REQ.length-1; t >= 0; t--) { if (level >= REQ[t]) { newTier = t; break; } }
    if (newTier !== tier) {
      tier = newTier;
      await post('/api/game/action', { action: `woodcutting_${tier}` });
    }
    log(`  Woodcutting: Lv${level} T${tier}`);
  }
  await post('/api/game/action', { action: 'idle' });

  // Mining
  log('PHASE 2: Mining to Lv30');
  tier = 0;
  await post('/api/game/action', { action: 'mining_0' });
  while (true) {
    await ff(30);
    s = await get();
    const level = Math.floor(Math.pow(Math.max(0, s.miningXp), 0.375)) + 1;
    if (level >= 30) { log(`  Mining: Lv${level} DONE`); break; }
    let newTier = tier;
    for (let t = REQ.length-1; t >= 0; t--) { if (level >= REQ[t]) { newTier = t; break; } }
    if (newTier !== tier) { tier = newTier; await post('/api/game/action', { action: `mining_${tier}` }); }
    log(`  Mining: Lv${level} T${tier}`);
  }
  await post('/api/game/action', { action: 'idle' });

  // Fishing
  log('PHASE 3: Fishing to Lv30');
  tier = 0;
  await post('/api/game/action', { action: 'fishing_0' });
  while (true) {
    await ff(30);
    s = await get();
    const level = Math.floor(Math.pow(Math.max(0, s.fishingXp), 0.375)) + 1;
    if (level >= 30) { log(`  Fishing: Lv${level} DONE`); break; }
    let newTier = tier;
    for (let t = REQ.length-1; t >= 0; t--) { if (level >= REQ[t]) { newTier = t; break; } }
    if (newTier !== tier) { tier = newTier; await post('/api/game/action', { action: `fishing_${tier}` }); }
    log(`  Fishing: Lv${level} T${tier}`);
  }
  await post('/api/game/action', { action: 'idle' });

  // Hunting
  log('PHASE 4: Hunting to Lv30');
  tier = 0;
  await post('/api/game/action', { action: 'hunting_0' });
  while (true) {
    await ff(30);
    s = await get();
    const level = Math.floor(Math.pow(Math.max(0, s.huntingXp), 0.375)) + 1;
    if (level >= 30) { log(`  Hunting: Lv${level} DONE`); break; }
    let newTier = tier;
    for (let t = REQ.length-1; t >= 0; t--) { if (level >= REQ[t]) { newTier = t; break; } }
    if (newTier !== tier) { tier = newTier; await post('/api/game/action', { action: `hunting_${tier}` }); }
    log(`  Hunting: Lv${level} T${tier}`);
  }
  await post('/api/game/action', { action: 'idle' });

  // Combat — fight in batches, equip between
  log('PHASE 5: Combat');
  for (let e=0; e<=10; e++) {
    s = await post('/api/game/action', { action: `combat_${e}_1` });
    if (s.message) { bugs.push(`Combat enemy ${e}: ${s.message}`); break; }
    await ff(30);
    s = await get();
    // Auto-equip after each fight
    await autoEquip();
    log(`  Enemy ${e}: HP=${s.playerHp}/${Math.floor(Math.pow(Math.max(0,s.hitpointsXp),0.375))*5+10} Gold=${s.gold} Gear=${Object.keys(JSON.parse(s.equipment||'{}')).length}slots`);
    if (s.activeAction === 'idle' && s.playerHp <= 0) { bugs.push(`Died on enemy ${e}`); break; }
    if (s.activeAction === 'idle') break; // enemy killed, action complete
  }
  await post('/api/game/action', { action: 'idle' });
  await autoEquip();

  // Build & talents
  log('PHASE 6: Build homestead');
  for (const b of ['shelter','farm','lumbermill','wall','warehouse','clinic','workshop']) {
    s = await post('/api/game/build-homestead', { buildingId: b });
    log(`  ${b}: ${s.message||'OK'}`);
  }

  s = await get();
  const talents = JSON.parse(s.talents||'{}');
  log(`  Talents: melee=${(talents.melee||[]).length}`);

  // Dungeon, Tower, Trial
  log('PHASE 7: Dungeon/Tower/Trial');
  s = await post('/api/game/enter-dungeon', { dungeonIndex: 0 });
  log(`  Dungeon: ${s.message||s.activeAction}`);
  if (!s.message) { await ff(120); s = await get(); log(`  Dungeon result: ${s.activeAction}`); }

  s = await post('/api/game/start-tower', {});
  log(`  Tower: ${s.message||'started'}`);
  if (!s.message) { await ff(60); }

  s = await post('/api/game/start-trial', {});
  log(`  Trial: ${s.message||'started'}`);

  // Enhance
  log('PHASE 8: Enhance gear');
  await autoEquip();
  s = await get();
  const loot = JSON.parse(s.lootBag||'[]');
  for (let i=0; i<Math.min(loot.length, 9); i++) {
    for (let lv=0; lv<4; lv++) {
      s = await post('/api/game/enhance', { instanceId: loot[i].instanceId });
      if (s.message) { log(`  ${loot[i].name}: ${s.message}`); break; }
    }
  }

  // Smelting
  log('PHASE 9: Smelting to Lv10');
  tier = 0;
  await post('/api/game/action', { action: 'smelting_0' });
  while (true) {
    await ff(30);
    s = await get();
    const level = Math.floor(Math.pow(Math.max(0, s.smeltingXp), 0.375)) + 1;
    if (level >= 10) { log(`  Smelting: Lv${level} DONE`); break; }
    if (s.activeAction === 'idle') { bugs.push('Smelting stopped — out of ore'); break; }
    log(`  Smelting: Lv${level}`);
  }
  await post('/api/game/action', { action: 'idle' });

  // Final
  s = await get();
  const levels = {};
  for (const k of Object.keys(s)) {
    if (k.endsWith('Xp')) levels[k] = Math.floor(Math.pow(Math.max(0,s[k]),0.375))+1;
  }
  log('\n=== FINAL ===');
  log(JSON.stringify(levels));
  log(`Gold: ${s.gold} Tier: ${s.worldTier}`);
  log(`Equipment: ${Object.keys(JSON.parse(s.equipment||'{}')).length} slots`);
  if (bugs.length) { log('\nBUGS:'); bugs.forEach(b=>log('  '+b)); }
  log('DONE');
}
main().catch(e => { console.error(e.message); });
