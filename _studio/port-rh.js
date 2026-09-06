// One-shot port: FOLIO (BNB Chain) → FOLIO on Robinhood Chain. Run from folio-rh/: node _studio/port-rh.js
// Every replacement uses the function form of String.replace (the `$'` gotcha).
'use strict';
const fs = require('fs'); const path = require('path');
const R = path.join(__dirname, '..');
const rd = (f) => fs.readFileSync(path.join(R, f), 'utf8'); const wr = (f, s) => fs.writeFileSync(path.join(R, f), s);
const rep = (s, a, b) => { if (!s.includes(a)) console.log('  MISS:', a.slice(0, 70)); return s.split(a).join(b); };
const EXPLORER = 'https://explorer.mainnet.chain.robinhood.com';

// ── server ────────────────────────────────────────────────────────────────────
let s = rd('server/index.js');
s = rep(s, '// BNB Chain. Dependency-free Node ≥18. Off-chain ledger, real Pyth oracle.', '// Robinhood Chain. Dependency-free Node ≥18. Off-chain ledger, real exchange-tape oracle (Yahoo), USDG pinned to $1.');
s = rep(s, "const FOLIO_MINT = process.env.FOLIO_MINT || '0x2c4e63ead1936ba1fe963fa3cb918a7b34de7777';", "const FOLIO_MINT = process.env.FOLIO_MINT || '';   // $FOLIO on Robinhood Chain — set at launch");
s = rep(s, "const TOKENS = { USDT: { addr: '0x55d398326f99059ff775485246999027b3197955', dec: 18 } };  // BSC-USDT (18 dp)", "const TOKENS = { USDG: { addr: '0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168', dec: 6 } };  // USDG on Robinhood Chain (6 dp)");
// oracle: Pyth → Yahoo tape (public Hermes is key-gated)
const oStart = s.indexOf('// ---------- oracle ----------'), oEnd = s.indexOf('let FOLIO_PRICE = 0');
s = s.slice(0, oStart) + `// ---------- oracle: exchange tape via Yahoo chart API (stocks, ETFs, crypto), refreshed every 15 s ----------
const YF = 'https://query1.finance.yahoo.com/v8/finance/chart/';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/128 Safari/537.36';
const FEED = { BTC: 'BTC-USD', ETH: 'ETH-USD', SOL: 'SOL-USD', HOOD: 'HOOD', NVDA: 'NVDA', TSLA: 'TSLA', SPY: 'SPY', COIN: 'COIN', MSTR: 'MSTR', AAPL: 'AAPL', GOOGL: 'GOOGL', META: 'META', GLD: 'GLD' };
const PX = { USDG: 1 }; let PRICE_OK = false; const PX_TS = {};
async function pollPyth() {   // name kept for the call sites; the source is the exchange tape
  let ok = 0;
  for (const [sym, q] of Object.entries(FEED)) {
    try {
      const ac = new AbortController(); const tm = setTimeout(() => ac.abort(), 9000);
      const r = await fetch(YF + encodeURIComponent(q) + '?range=1d&interval=1m&includePrePost=true', { headers: { accept: 'application/json', 'user-agent': UA }, signal: ac.signal }); clearTimeout(tm);
      if (!r.ok) continue;
      const res = (await r.json()).chart.result[0]; const m = res.meta; let v = +m.regularMarketPrice, ts = m.regularMarketTime * 1000;
      const T = res.timestamp || [], C = (res.indicators.quote[0] && res.indicators.quote[0].close) || [];
      for (let i = C.length - 1; i >= 0; i--) if (C[i] != null && T[i] * 1000 > ts) { v = +C[i]; ts = T[i] * 1000; break; }   // latest extended-hours print
      if (v > 0) { PX[sym] = v; PX_TS[sym] = ts; ok++; }
    } catch (e) {}
    await new Promise((r) => setTimeout(r, 120));
  }
  if (ok >= Object.keys(FEED).length - 2) PRICE_OK = true;
}
` + s.slice(oEnd);
s = rep(s, "p.chainId === 'bsc'", "p.chainId === 'robinhood'");
s = rep(s, '// ---------- BNB Chain reader (real $FOLIO holder balances) ----------', '// ---------- Robinhood Chain reader (real $FOLIO holder balances) ----------');
s = rep(s, "const RPCS = (process.env.BSC_RPCS || 'https://bsc-rpc.publicnode.com,https://1rpc.io/bnb,https://bsc-dataseed.binance.org,https://bsc-dataseed1.defibit.io').split(',');", "const RPCS = (process.env.RH_RPCS || 'https://rpc.mainnet.chain.robinhood.com').split(',');");
s = rep(s, '// real ERC-20 balanceOf on BNB Chain', '// real ERC-20 balanceOf on Robinhood Chain');
s = rep(s, '// ---------- treasury deposits: real BNB / USDT sent to TREASURY, verified on-chain, credited to ledger ----------', '// ---------- treasury deposits: real ETH / USDG sent to TREASURY, verified on-chain, credited to ledger ----------');
s = rep(s, "sym = 'BNB'; amt = hexToNum(tx.value, 18);", "sym = 'ETH'; amt = hexToNum(tx.value, 18);");
s = rep(s, "const bnb = hexToNum(await rpc('eth_getBalance', [TREASURY, 'latest']), 18);", "const eth = hexToNum(await rpc('eth_getBalance', [TREASURY, 'latest']), 18);");
s = rep(s, "const usdt = hexToNum(await rpc('eth_call', [{ to: TOKENS.USDT.addr, data: '0x70a08231' + TREASURY.slice(2).padStart(64, '0') }, 'latest']), 18);", "const usdg = hexToNum(await rpc('eth_call', [{ to: TOKENS.USDG.addr, data: '0x70a08231' + TREASURY.slice(2).padStart(64, '0') }, 'latest']), 6);");
s = rep(s, 'CHAIN.treasury = { BNB: bnb, USDT: usdt, FOLIO: folio, t: now() };', 'CHAIN.treasury = { ETH: eth, USDG: usdg, FOLIO: folio, t: now() };');
s = rep(s, "USDT:  { tier: 'Stable',   ltv: 0.90, liq: 0.95, cap: 5e6 },", "USDG:  { tier: 'Stable',   ltv: 0.90, liq: 0.95, cap: 5e6 },");
s = rep(s, "BNB:   { tier: 'Crypto',   ltv: 0.75, liq: 0.82, cap: 5e6 },", "ETH:   { tier: 'Crypto',   ltv: 0.75, liq: 0.82, cap: 5e6 },");
s = rep(s, 'const PERPS = { BTC: 25, ETH: 25, BNB: 25, SOL: 25,', 'const PERPS = { BTC: 25, ETH: 25, SOL: 25,');
s = rep(s, 'const STARTER = { USDT: 2500, BNB: 3,', 'const STARTER = { USDG: 2500, ETH: 1,');
s = s.split('psmUSDT').join('psmUSDG');
s = s.split("'insufficient USDT'").join("'insufficient USDG'");
s = rep(s, "throw 'PSM has ' + db.psmUSDG.toFixed(2) + ' USDT idle'", "throw 'PSM has ' + db.psmUSDG.toFixed(2) + ' USDG idle'");
s = rep(s, "add(u, 'USDT', -amt); add(u, 'fUSD', amt);", "add(u, 'USDG', -amt); add(u, 'fUSD', amt);");
s = rep(s, "add(u, 'fUSD', -amt); add(u, 'USDT', amt);", "add(u, 'fUSD', -amt); add(u, 'USDG', amt);");
s = rep(s, "bal(u, 'USDT') < amt", "bal(u, 'USDG') < amt");
s = rep(s, "'USDT → fUSD' : 'fUSD → USDT'", "'USDG → fUSD' : 'fUSD → USDG'");
s = rep(s, "location: 'https://x.com/FolioBNB'", "location: 'https://x.com/FolioRH'");
s = rep(s, 'setInterval(pollPyth, 5000)', 'setInterval(pollPyth, 15000)');
// any remaining token-symbol references
s = s.split("'USDT'").join("'USDG'").split('"USDT"').join('"USDG"');
wr('server/index.js', s);
console.log('server: BNB refs left', (s.match(/BNB|bsc|USDT/g) || []).length, (s.match(/BNB|bsc|USDT/g) || []).slice(0, 8));

// ── client ────────────────────────────────────────────────────────────────────
const CHAIN_JS = "try{await window.ethereum.request({method:'wallet_switchEthereumChain',params:[{chainId:'0x1237'}]})}catch(e){if(e.code===4902)await window.ethereum.request({method:'wallet_addEthereumChain',params:[{chainId:'0x1237',chainName:'Robinhood Chain',nativeCurrency:{name:'Ether',symbol:'ETH',decimals:18},rpcUrls:['https://rpc.mainnet.chain.robinhood.com'],blockExplorerUrls:['" + EXPLORER + "']}]})}";
let a = rd('client/app.html');
a = a.replace(/try\{await window\.ethereum\.request\(\{method:'wallet_switchEthereumChain',params:\[\{chainId:'0x38'\}\]\}\)\}catch\(e\)\{if\(e\.code===4902\)await window\.ethereum\.request\(\{method:'wallet_addEthereumChain',params:\[\{[^\n]*?\}\]\}\)\}/, () => CHAIN_JS);
a = rep(a, "const wei=BigInt(Math.round(amt*1e6))*BigInt(1e12);const hex='0x'+wei.toString(16);let tx;", "const wei=sym==='ETH'?BigInt(Math.round(amt*1e6))*BigInt(1e12):BigInt(Math.round(amt*1e6));const hex='0x'+wei.toString(16);let tx;");
a = rep(a, "if(sym==='BNB')tx={from:acc,to:S.treasury.addr,value:hex};", "if(sym==='ETH')tx={from:acc,to:S.treasury.addr,value:hex};");
a = rep(a, 'to:S.treasury.tokens.USDT,', 'to:S.treasury.tokens.USDG,');
a = a.split('https://bscscan.com/').join(EXPLORER + '/');
// CA strip: only when the mint is set (rendered from state instead of a hard-coded BNB address)
a = a.replace(/<div class="castrip" onclick="navigator\.clipboard\.writeText\('0x2c4e63ead1936ba1fe963fa3cb918a7b34de7777'\)[^\n]*?<\/div>/, () => '<div id="castrip"></div>');
a = a.split('Treasury · BNB Chain').join('Treasury · Robinhood Chain');
a = a.split('BNB in treasury').join('ETH in treasury').split('USDT in treasury').join('USDG in treasury');
a = a.split('verified on BNB Chain').join('verified on Robinhood Chain').split('read live from BNB Chain').join('read live from Robinhood Chain');
a = a.split('pyth mark').join('tape mark').split('Pyth').join('oracle');
a = a.split("'BNB'").join("'ETH'").split('BNB').join('ETH').split('USDT').join('USDG');
wr('client/app.html', a);
console.log('app: refs left', (a.match(/BNB|bsc|USDT|0x38/g) || []).length);

let ix = rd('client/index.html');
ix = ix.split('https://foliobnb.xyz').join('https://foliorh.xyz').split('@FolioBNB').join('@FolioRH');
ix = ix.replace(/<div class="castrip" onclick="navigator\.clipboard\.writeText\('0x2c4e63ead1936ba1fe963fa3cb918a7b34de7777'\)[^\n]*?<\/div>/, () => '<div id="castrip"></div>');
ix = ix.split('<span>BNB Chain</span>').join('<span>Robinhood Chain</span>');
ix = ix.split('BNB Chain (EVM). Connect any EVM wallet.').join('Robinhood Chain (EVM, chain id 4663). Connect any EVM wallet.');
ix = ix.split('<td>Chain</td><td>BNB</td>').join('<td>Chain</td><td>Robinhood</td>');
ix = ix.split('Stocks · BNB · USDT').join('Stocks · ETH · USDG');
ix = ix.split('priced by Pyth every five seconds').join('priced from the exchange tape every fifteen seconds').split('marked to Pyth').join('marked to the exchange tape').split('Pyth').join('the oracle');
ix = ix.split('BNB Chain').join('Robinhood Chain').split('BTC/ETH/BNB/SOL').join('BTC/ETH/SOL').split(', BTC, BNB').join(', BTC, ETH').split('BNB or USDT').join('ETH or USDG').split('BNB').join('ETH').split('USDT').join('USDG');
wr('client/index.html', ix);
console.log('index: refs left', (ix.match(/BNB|bsc|USDT|foliobnb/g) || []).length);

let d = rd('client/docs.html');
d = d.split('<td>Stable</td><td>USDT</td>').join('<td>Stable</td><td>USDG</td>').split('<td>Crypto</td><td>BNB</td>').join('<td>Crypto</td><td>ETH</td>');
d = d.split('Oracle: Pyth for every price; USDT pinned to $1.').join('Oracle: the exchange tape (regular and extended hours) for every price, refreshed every 15 s; USDG pinned to $1.');
d = d.split('Mark = Pyth.').join('Mark = exchange tape.').split('Markets: BTC, ETH, BNB, SOL').join('Markets: BTC, ETH, SOL');
d = d.split('BNB Chain').join('Robinhood Chain').split('Pyth').join('the oracle').split('BNB').join('ETH').split('USDT').join('USDG');
wr('client/docs.html', d);
console.log('docs: refs left', (d.match(/BNB|bsc|USDT|Pyth/g) || []).length);

let pr = rd('client/proof.html');
pr = pr.split('https://bscscan.com/').join(EXPLORER + '/');
pr = pr.split("row('BNB',fmt(o.BNB||0,4))+row('USDT',fmt(o.USDT))").join("row('ETH',fmt(o.ETH||0,4))+row('USDG',fmt(o.USDG))");
pr = pr.split('stock bought at Pyth oracle').join('stock bought at oracle price').split('Pyth, every 5 s').join('exchange tape, every 15 s');
pr = pr.split('BNB Chain').join('Robinhood Chain').split('o.BNB').join('o.ETH').split('o.USDT').join('o.USDG').split('credited.BNB').join('credited.ETH').split('credited.USDT').join('credited.USDG').split('BNB').join('ETH').split('USDT').join('USDG');
wr('client/proof.html', pr);
console.log('proof: refs left', (pr.match(/BNB|bsc|USDT|Pyth/g) || []).length);

// ── docs / kits ───────────────────────────────────────────────────────────────
for (const f of ['README.md', 'BRAND-KIT.md', 'brand/X-KIT-V2.md']) {
  let t = rd(f);
  t = t.split('foliobnb.xyz').join('foliorh.xyz').split('@FolioBNB').join('@FolioRH').split('BNB Chain').join('Robinhood Chain').split('BSC token address').join('Robinhood Chain token address').split('BscScan').join('the Robinhood Chain explorer').split('Pyth oracle').join('exchange-tape oracle').split('Pyth').join('the oracle').split('BNB').join('ETH').split('USDT').join('USDG').split('bnb chain').join('robinhood chain');
  wr(f, t);
}
let pk = rd('package.json'); pk = pk.replace('"name":"folio"', '"name":"folio-rh"'); wr('package.json', pk);
console.log('done');
