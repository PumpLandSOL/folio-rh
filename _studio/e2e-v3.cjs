// V3 E2E: hold streak weight + autofolio. Server: FOLIO_MINT=none DIVIDEND_EPOCH_MS=4000 PORT=8191 DATA_PATH=_studio/v3.json
const B = 'http://localhost:8191'; const A = '0x00000000000000000000000000000000000000a1', C = '0x00000000000000000000000000000000000000c2';
const get = (u) => fetch(B + u).then((r) => r.json()); const post = (u, b) => fetch(B + u, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b) }).then((r) => r.json());
let fails = 0; const ok = (n, c, x) => { console.log((c ? 'PASS ' : 'FAIL ') + n + (x ? '  · ' + x : '')); if (!c) fails++; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  await sleep(2000);
  const s0 = await get('/api/state'); ok('streak params exposed', s0.div.streak && s0.div.streak.max === 2 && s0.div.streak.cap === 20);
  await get('/api/state?w=' + A); await get('/api/state?w=' + C);
  const au = await post('/api/auto', { wallet: C, on: true }); ok('autofolio toggle on for C', au.r && au.r.on === true && au.me.auto.on === true);
  for (const w of [A, C]) { await post('/api/deposit', { wallet: w, sym: 'NVDA', amount: 5 }); const m = await post('/api/mint', { wallet: w, sym: 'NVDA', amount: 300 }); if (m.error) console.log('mint err', m.error); }
  const s1 = await get('/api/state'); ok('revenue accrued from origination fees', s1.div.revenue > 0, '$' + s1.div.revenue.toFixed(2));
  await sleep(5500);
  const mA = (await get('/api/state?w=' + A)).me, mC = (await get('/api/state?w=' + C)).me;
  ok('epoch 1: both received dividend stock', Object.keys(mA.divs).length === 1 && Object.keys(mC.divs).length === 1, JSON.stringify(mA.divs));
  ok('streak = 1 after first held epoch, mult 1.05', mA.streak.epochs === 1 && Math.abs(mA.streak.mult - 1.05) < 1e-9, 'streak ' + mA.streak.epochs + ' mult ' + mA.streak.mult);
  const sym = Object.keys(mC.divs)[0]; const vC = mC.vaults.find((v) => v.sym === sym);
  ok('autofolio: C dividend stock became vault collateral', mC.auto.epochs === 1 && vC && Math.abs(vC.coll - mC.divs[sym]) < 1e-12, `sym ${sym} coll ${vC && vC.coll} minted ${mC.auto.minted} sfUSD ${mC.sfusd}`);
  ok('A (autofolio off) keeps stock in balance', mA.bal[sym] > 0);
  const e1 = (await get('/api/state')).div.epoch; await post('/api/mint', { wallet: A, sym: 'NVDA', amount: 100 }); for (let i = 0; i < 20; i++) { await sleep(600); if ((await get('/api/state')).div.epoch > e1) break; } await sleep(300);
  const mA2 = (await get('/api/state?w=' + A)).me; ok('epoch 2: streak 2, mult 1.10', mA2.streak.epochs === 2 && Math.abs(mA2.streak.mult - 1.10) < 1e-9, 'streak ' + mA2.streak.epochs);
  const h = (await get('/api/state')).div.history[0]; ok('receipt carries streak/auto fields', 'autoN' in h && 'maxStreak' in h && h.maxStreak >= 2, JSON.stringify({ autoN: h.autoN, maxStreak: h.maxStreak }));
  console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exitCode = fails ? 1 : 0;
})();
