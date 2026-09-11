// Buy Loop E2E: $FOLIO payout + Vault tier. Server: DEV=1 FOLIO_MINT=none DIVIDEND_EPOCH_MS=4000 PORT=8191 DATA_PATH=_studio/bl.json
// FOLIO_PRICE is 0 without a mint, so the test sets a paper price via /api/dev/folio? No: price comes from DexScreener. We run with the REAL mint so FOLIO_PRICE resolves, and disable chain holder reads by pointing wallets at paper balances via /api/dev/folio.
const B = 'http://localhost:8191'; const A = '0x00000000000000000000000000000000000000a1', C = '0x00000000000000000000000000000000000000c2';
const get = (u) => fetch(B + u).then((r) => r.json()); const post = (u, b) => fetch(B + u, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b) }).then((r) => r.json());
let fails = 0; const ok = (n, c, x) => { console.log((c ? 'PASS ' : 'FAIL ') + n + (x ? '  · ' + x : '')); if (!c) fails++; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const waitEpoch = async () => { const e = (await get('/api/state')).div.epoch; for (let i = 0; i < 25; i++) { await sleep(500); if ((await get('/api/state')).div.epoch > e) return; } };
(async () => {
  await sleep(2500);
  const s0 = await get('/api/state'); ok('vault + buyloop exposed', s0.vault && s0.vault.mult === 4 && s0.buyloop && 'usd' in s0.buyloop, JSON.stringify({ need: s0.vault.need, px: s0.folio.price }));
  ok('$FOLIO price resolved for buys', s0.folio.price > 0, 'px ' + s0.folio.price);
  await get('/api/state?w=' + A); await get('/api/state?w=' + C); await sleep(2500);
  await post('/api/dev/folio', { wallet: A, amount: 10000 }); await post('/api/dev/folio', { wallet: C, amount: 10000 });
  const p = await post('/api/payout', { wallet: C, mode: 'folio' }); ok('C flips payout to $FOLIO', p.r && p.r.payout === 'folio' && p.me.payout === 'folio');
  for (const w of [A, C]) { await post('/api/deposit', { wallet: w, sym: 'NVDA', amount: 5 }); await post('/api/mint', { wallet: w, sym: 'NVDA', amount: 300 }); }
  await waitEpoch(); await sleep(300);
  const mA = (await get('/api/state?w=' + A)).me, mC = (await get('/api/state?w=' + C)).me, s1 = await get('/api/state');
  ok('A paid in stock', Object.keys(mA.divs).some((k) => k !== 'FOLIO') && !mA.divs.FOLIO, JSON.stringify(mA.divs));
  ok('C paid in $FOLIO (Buy Loop)', mC.divs.FOLIO > 0 && !Object.keys(mC.divs).some((k) => k !== 'FOLIO'), JSON.stringify(mC.divs));
  ok('buyloop ledger + receipt', s1.buyloop.usd > 0 && s1.buyloop.folio > 0 && s1.div.history[0].loop.n === 1 && Math.abs(s1.div.history[0].loop.folio - mC.divs.FOLIO) < 0.01, JSON.stringify(s1.div.history[0].loop));
  ok('C $FOLIO = usd / price', Math.abs(mC.divs.FOLIO - s1.div.history[0].loop.usd / s1.div.history[0].loop.px) < 1e-6);
  // vault tier
  const need = s1.vault.need; const low = await post('/api/vault/commit', { wallet: A, amount: need }); ok('commit refused when wallet holds less than the commitment', /holds/.test(low.error || ''), low.error);
  await post('/api/dev/folio', { wallet: A, amount: need + 1 });
  const small = await post('/api/vault/commit', { wallet: A, amount: need / 2 }); ok('commit below minimum refused', /at least/.test(small.error || ''), small.error);
  const vc = await post('/api/vault/commit', { wallet: A, amount: need }); ok('A commits → Vault tier 4×', vc.r && vc.r.amt === need && vc.me.boost.name === 'Vault' && vc.me.boost.mult === 4 && vc.me.vault.active, JSON.stringify(vc.me.boost));
  const dup = await post('/api/vault/commit', { wallet: A, amount: need }); ok('double commit refused', /already/.test(dup.error || ''));
  const rel = await post('/api/vault/release', { wallet: A }); ok('early release refused', /committed until/.test(rel.error || ''));
  ok('sfUSD APY at 4× = 24%', Math.abs(vc.me.boost.apy - 0.24) < 1e-9, 'apy ' + vc.me.boost.apy);
  await post('/api/dev/folio', { wallet: A, amount: need - 10 });
  const br = (await get('/api/state?w=' + A)).me; ok('balance drops below commitment → Vault broken, streak reset', !br.vault.active && br.boost.name !== 'Vault' && br.streak.epochs === 0, JSON.stringify({ tier: br.boost.name, streak: br.streak.epochs }));
  const s2 = await get('/api/state'); ok('broken counter incremented', s2.vault.broken === 1);
  console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exitCode = fails ? 1 : 0;
})();
