// V3 patch: Hold Streak (dividend weight up to 2×, resets on sell) + Autofolio (dividend stock → collateral → mint → stake). node _studio/patch-v3.js
const fs = require('fs'), path = require('path');
const S = path.join(__dirname, '..', 'server', 'index.js'), A = path.join(__dirname, '..', 'client', 'app.html');
let s = fs.readFileSync(S, 'utf8').replace(/\r\n/g, '\n');
const rep = (str, from, to) => { if (!str.includes(from)) throw new Error('miss: ' + from.slice(0, 80)); return str.replace(from, to); };

// params
s = rep(s, "  DIVIDEND_EPOCH: 60 * 60e3,", "  DIVIDEND_EPOCH: 60 * 60e3,\n  STREAK_STEP: 0.05, STREAK_MAX: 20,   // V3 hold streak: +5% dividend weight per consecutive epoch held, capped at 2× after 20 epochs; selling resets\n  AUTO_MINT_FRAC: 0.5,                 // V3 autofolio: mint 50% of new borrowing headroom from reinvested dividend stock, then stake it");
// helpers after vaultView
s = rep(s, "function deposit(w, sym, amt) {", `const streakMult = (u) => 1 + P.STREAK_STEP * Math.min(P.STREAK_MAX, u.hstreak || 0);
function autofolio(u, sym, shares) {   // reinvest a dividend: stock → vault collateral → mint fUSD (half of new headroom) → sfUSD
  try {
    const v = db.vaults[vid(u.wallet, sym)] || (db.vaults[vid(u.wallet, sym)] = { wallet: u.wallet, sym, coll: 0, debt: 0, fees: 0, t: now() });
    accrue(v); add(u, sym, -shares); v.coll += shares;
    const vv = vaultView(v); const m = Math.floor(vv.maxMint * P.AUTO_MINT_FRAC * 100) / 100; let minted = 0;
    if (m >= 1) { const fee = m * P.ORIGINATION; v.debt += m; add(u, 'fUSD', m - fee); db.supply += m; db.surplus += fee; revenue(fee); minted = m - fee; stakeAccrue(); const sh = minted / stakePPS(); add(u, 'fUSD', -minted); u.sShares += sh; db.stake.pool += minted; db.stake.shares += sh; }
    u.auto = u.auto || { on: true, epochs: 0, shares: 0, minted: 0 }; u.auto.epochs++; u.auto.shares += shares; u.auto.minted += minted;
    return minted;
  } catch (e) { return 0; }
}
function deposit(w, sym, amt) {`);
// dividend distribution by streak weight + autofolio
s = rep(s, "  const shares = toStock / px; const holders = Object.values(db.users).filter((u) => u.folio > 0); const tot = holders.reduce((a, u) => a + u.folio, 0);\n  for (const u of holders) { const s = shares * u.folio / tot; add(u, sym, s); u.divs[sym] = (u.divs[sym] || 0) + s; }",
`  const shares = toStock / px;
  for (const u of Object.values(db.users)) { if (u.folio > 0 && (u.hprev || 0) > 0 && u.folio >= u.hprev * 0.95) u.hstreak = (u.hstreak || 0) + 1; else u.hstreak = u.folio > 0 ? 1 : 0; u.hprev = u.folio; }
  const holders = Object.values(db.users).filter((u) => u.folio > 0); const wt = (u) => u.folio * streakMult(u); const tot = holders.reduce((a, u) => a + wt(u), 0);
  let autoN = 0, autoMinted = 0;
  for (const u of holders) { const s = shares * wt(u) / tot; add(u, sym, s); u.divs[sym] = (u.divs[sym] || 0) + s; if (u.auto && u.auto.on) { autoN++; autoMinted += autofolio(u, sym, s); } }`);
s = rep(s, "  db.div.paid += toStock; for (const u of holders) ptsAdd(u, 'dividend', toStock * u.folio / tot * P.PTS.dividend * 100);",
  "  db.div.paid += toStock; for (const u of holders) ptsAdd(u, 'dividend', toStock * wt(u) / tot * P.PTS.dividend * 100);\n  db.div.autoN = autoN; db.div.autoMinted = (db.div.autoMinted || 0) + autoMinted; db.div.maxStreak = Math.max(0, ...holders.map((u) => u.hstreak || 0));");
s = rep(s, "block: CHAIN.block, weight: tot, onchain: CHAIN.ok };", "block: CHAIN.block, weight: tot, onchain: CHAIN.ok, autoN, autoMinted: Math.round(autoMinted * 100) / 100, maxStreak: db.div.maxStreak };");
// holder view
s = rep(s, "deposited: u.deposited || {}, folio: u.folio,", "deposited: u.deposited || {}, folio: u.folio, streak: { epochs: u.hstreak || 0, mult: streakMult(u), max: 1 + P.STREAK_STEP * P.STREAK_MAX, step: P.STREAK_STEP, cap: P.STREAK_MAX }, auto: u.auto || { on: false, epochs: 0, shares: 0, minted: 0 },");
// protocol state
s = rep(s, "div: { ...db.div, next: db.div.next || 0, revenue: db.div.revenue },", "div: { ...db.div, next: db.div.next || 0, revenue: db.div.revenue, streak: { step: P.STREAK_STEP, cap: P.STREAK_MAX, max: 1 + P.STREAK_STEP * P.STREAK_MAX }, autoUsers: Object.values(db.users).filter((u) => u.auto && u.auto.on).length },");
// api
s = rep(s, "        case '/api/checkin': r = checkin(w); break;", "        case '/api/checkin': r = checkin(w); break;\n        case '/api/auto': { const u = user(w); u.auto = u.auto || { on: false, epochs: 0, shares: 0, minted: 0 }; u.auto.on = !!d.on; ev('auto', 'autofolio ' + (u.auto.on ? 'ON — dividends reinvest as collateral' : 'off'), u.wallet); save(); r = u.auto; break; }");
fs.writeFileSync(S, s.replace(/\n/g, '\r\n'));

let a = fs.readFileSync(A, 'utf8').replace(/\r\n/g, '\n');
a = rep(a, "<div class=\"head\"><span>Dividend engine · every hour</span>", "<div class=\"head\"><span>Dividend engine · every hour · <span style=\"color:var(--gold)\">V3</span></span>");
a = rep(a, "<div class=\"stat\"><b>${S.users}</b><span>holders</span></div></div>", "<div class=\"stat\"><b>${S.users}</b><span>holders</span></div><div class=\"stat\"><b>${d.maxStreak||0}h</b><span>longest hold streak</span></div><div class=\"stat\"><b>${d.autoUsers||0}</b><span>autofolio on</span></div></div>");
a = rep(a, "Rotation: NVDA → AAPL → GOOGL → HOOD → META → SPY.</p>",
  "Rotation: NVDA → AAPL → GOOGL → HOOD → META → SPY.</p>\n   <div class=\"grid\" style=\"margin:0 0 18px\"><div class=\"card green\"><span class=\"n\">V3 · Hold streak</span><h4 style=\"font-size:24px\">Don’t sell, get paid more.</h4><p>Every consecutive hourly epoch you hold adds <b>+5%</b> to your dividend weight, up to <b>2×</b> after 20 hours. Sell more than 5% and the streak resets to zero. Same pot, bigger slice for diamond hands.</p></div><div class=\"card green\"><span class=\"n\">V3 · Autofolio</span><h4 style=\"font-size:24px\">Dividends buy more dividends.</h4><p>Flip it on and every stock airdrop is deposited as collateral, <b>half the new headroom minted as fUSD</b>, and staked to sfUSD at your boosted APY. The mint fee goes back into the pot you’re paid from. Your folio compounds every hour without you.</p></div></div>");
a = rep(a, "<span class=\"kicker\">Your dividends</span><h3>Stock received</h3>",
  "<span class=\"kicker\">Your dividends</span><h3>Stock received</h3>\n   ${me?`<div class=\"stat acc\" style=\"margin:6px 0 10px\"><b>${me.streak.mult.toFixed(2)}× <span style=\"font-size:13px;font-weight:400;color:var(--ink2)\">· ${me.streak.epochs}h streak</span></b><span>dividend weight · +5%/h, max ${me.streak.max}× · resets if you sell</span></div><label style=\"display:flex;gap:10px;align-items:center;font-size:13px;margin:0 0 12px;cursor:pointer\"><input type=\"checkbox\" id=\"autoT\" ${me.auto.on?'checked':''} onchange=\"api('/api/auto',{on:this.checked}).then(load)\"> <b>Autofolio</b> <span style=\"color:var(--mut)\">reinvest dividends → collateral → mint → stake${me.auto.epochs?` · ${me.auto.epochs} epochs · ${fmt(me.auto.minted)} fUSD minted &amp; staked`:''}</span></label>`:''}");
fs.writeFileSync(A, a.replace(/\n/g, '\r\n'));
console.log('patched');
