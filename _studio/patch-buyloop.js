// THE BUY LOOP patch: (1) dividend payout in $FOLIO, bought at market from the pot; (2) Vault tier 4× for a 30-day $FOLIO commitment. node _studio/patch-buyloop.js
const fs = require('fs'), path = require('path');
const S = path.join(__dirname, '..', 'server', 'index.js'), A = path.join(__dirname, '..', 'client', 'app.html');
const rep = (str, from, to) => { if (!str.includes(from)) throw new Error('miss: ' + from.slice(0, 90)); return str.replace(from, to); };
let s = fs.readFileSync(S, 'utf8').replace(/\r\n/g, '\n');

s = rep(s, "  AUTO_MINT_FRAC: 0.5,", "  AUTO_MINT_FRAC: 0.5,\n  VAULT: { share: 0.005, abs: 500000, mult: 4.0, days: 30 },   // Buy Loop: commit ≥0.5% of supply for 30 days → Vault tier 4× (above Diamond). Balance drops below the commitment → broken, streak reset.");
// vault helpers + boostOf override
s = rep(s, "function boostOf(u) {\n  const T = P.BOOST_TIERS; let tier = T[0], i = 0;",
`const vaultNeed = () => CHAIN.ok && CHAIN.supply > 0 ? P.VAULT.share * CHAIN.supply : P.VAULT.abs;
function vaultCheck(u) {   // a commitment is live while the wallet still holds ≥ the committed amount and the term has not ended
  const v = u.vault; if (!v) return null;
  if ((u.folio || 0) < v.amt) { delete u.vault; u.hstreak = 0; db.vaultStats = db.vaultStats || { broken: 0 }; db.vaultStats.broken++; ev('vault', 'Vault commitment BROKEN — balance fell below ' + Math.round(v.amt).toLocaleString() + ' $FOLIO · streak reset', u.wallet); save(); return null; }
  return v;
}
const vaultActive = (u) => { const v = vaultCheck(u); return !!(v && now() < v.until); };
function vaultCommit(w, amt) {
  const u = user(w); amt = +amt; const need = vaultNeed(); if (!(amt >= need)) throw 'Vault needs a commitment of at least ' + Math.round(need).toLocaleString() + ' $FOLIO';
  if ((u.folio || 0) < amt) throw 'wallet holds ' + Math.round(u.folio || 0).toLocaleString() + ' $FOLIO — buy more or commit less';
  if (u.vault && now() < u.vault.until) throw 'already committed until ' + new Date(u.vault.until).toISOString().slice(0, 10);
  u.vault = { amt, since: now(), until: now() + P.VAULT.days * 864e5 }; ev('vault', 'committed ' + Math.round(amt).toLocaleString() + ' $FOLIO for ' + P.VAULT.days + ' days → Vault tier ' + P.VAULT.mult + '×', u.wallet); save(); return u.vault;
}
function vaultRelease(w) { const u = user(w); if (!u.vault) throw 'no commitment'; if (now() < u.vault.until) throw 'committed until ' + new Date(u.vault.until).toISOString().slice(0, 10) + ' — breaking it early resets your streak: sell below the amount to break'; delete u.vault; ev('vault', 'commitment matured and released', u.wallet); save(); return { ok: true }; }
function boostOf(u) {
  const T = P.BOOST_TIERS; let tier = T[0], i = 0;
  if (vaultActive(u)) return { name: 'Vault', mult: P.VAULT.mult, idx: T.length, next: null, apy: P.STAKE_TARGET_APY * P.VAULT.mult, vault: true };`);
// payout in $FOLIO inside dividendTick
s = rep(s, "  for (const u of holders) { const s = shares * wt(u) / tot; add(u, sym, s); u.divs[sym] = (u.divs[sym] || 0) + s; if (u.auto && u.auto.on) { autoN++; autoMinted += autofolio(u, sym, s); } }",
`  let loopUsd = 0, loopFolio = 0, loopN = 0;
  for (const u of holders) {
    const usd = toStock * wt(u) / tot;
    if (u.payout === 'folio' && FOLIO_PRICE > 0) { const f = usd / FOLIO_PRICE; u.divs.FOLIO = (u.divs.FOLIO || 0) + f; loopUsd += usd; loopFolio += f; loopN++; continue; }   // Buy Loop: this slice buys $FOLIO at market instead of stock
    const s = usd / px; add(u, sym, s); u.divs[sym] = (u.divs[sym] || 0) + s; if (u.auto && u.auto.on) { autoN++; autoMinted += autofolio(u, sym, s); }
  }
  db.buyloop = db.buyloop || { usd: 0, folio: 0, epochs: 0 }; if (loopN) { db.buyloop.usd += loopUsd; db.buyloop.folio += loopFolio; db.buyloop.epochs++; }`);
s = rep(s, "autoN, autoMinted: Math.round(autoMinted * 100) / 100, maxStreak: db.div.maxStreak };", "autoN, autoMinted: Math.round(autoMinted * 100) / 100, maxStreak: db.div.maxStreak, loop: { n: loopN, usd: Math.round(loopUsd * 100) / 100, folio: Math.round(loopFolio * 100) / 100, px: FOLIO_PRICE } };");
s = s.replace("airdropped to ${holders.length} holders ·", "airdropped to ${holders.length - loopN} holders · ${loopN ? loopUsd.toFixed(2) + ' bought $FOLIO for ' + loopN + ' Buy Loop wallets · ' : ''}");
// me view
s = rep(s, "auto: u.auto || { on: false, epochs: 0, shares: 0, minted: 0 },", "auto: u.auto || { on: false, epochs: 0, shares: 0, minted: 0 }, payout: u.payout || 'stock', vault: { active: vaultActive(u), amt: u.vault ? u.vault.amt : 0, until: u.vault ? u.vault.until : 0, need: vaultNeed(), mult: P.VAULT.mult, days: P.VAULT.days },");
// protocol view
s = rep(s, "autoUsers: Object.values(db.users).filter((u) => u.auto && u.auto.on).length },", "autoUsers: Object.values(db.users).filter((u) => u.auto && u.auto.on).length, loopUsers: Object.values(db.users).filter((u) => u.payout === 'folio').length }, buyloop: db.buyloop || { usd: 0, folio: 0, epochs: 0 }, vault: { ...P.VAULT, need: vaultNeed(), active: Object.values(db.users).filter((u) => u.vault && now() < u.vault.until).length, committed: Object.values(db.users).reduce((a, u) => a + (u.vault && now() < u.vault.until ? u.vault.amt : 0), 0), broken: (db.vaultStats || {}).broken || 0 },");
// api
s = rep(s, "        case '/api/auto':", "        case '/api/payout': { const u = user(w); u.payout = d.mode === 'folio' ? 'folio' : 'stock'; ev('payout', 'dividends now paid in ' + (u.payout === 'folio' ? '$FOLIO (Buy Loop)' : 'stock'), u.wallet); save(); r = { payout: u.payout }; break; }\n        case '/api/vault/commit': r = vaultCommit(w, d.amount); break;\n        case '/api/vault/release': r = vaultRelease(w); break;\n        case '/api/dev/folio': if (process.env.DEV !== '1') throw 'no'; { const u = user(w); u.folio = +d.amount; save(); r = { folio: u.folio }; } break;\n        case '/api/auto':");
// the boost table uses S.tiers only; expose vault in tiers list for the client
fs.writeFileSync(S, s.replace(/\n/g, '\r\n'));

let a = fs.readFileSync(A, 'utf8').replace(/\r\n/g, '\n');
// payout selector in Dividends aside
a = rep(a, "<label style=\"display:flex;gap:10px;align-items:center;font-size:13px;margin:0 0 12px;cursor:pointer\"><input type=\"checkbox\" id=\"autoT\"",
  "<div style=\"margin:0 0 12px\"><span class=\"kicker\">Paid in</span><div class=\"seg\" style=\"display:grid;grid-template-columns:1fr 1fr;margin-top:6px\"><button class=\"${me.payout==='stock'?'on':''}\" onclick=\"act('/api/payout',{mode:'stock'})\">Stock<br><small>NVDA · AAPL · …</small></button><button class=\"${me.payout==='folio'?'on':''}\" onclick=\"act('/api/payout',{mode:'folio'})\">$FOLIO<br><small>bought at market</small></button></div><p style=\"font-size:11px;color:var(--mut);margin:6px 0 0\">${me.payout==='folio'?'<b style=\"color:var(--gold2)\">Buy Loop on.</b> Your hourly slice buys $FOLIO on the open market instead of stock.':'Flip to $FOLIO and your hourly dividend becomes an open-market buy.'}</p></div>\n   <label style=\"display:flex;gap:10px;align-items:center;font-size:13px;margin:0 0 12px;cursor:pointer\"><input type=\"checkbox\" id=\"autoT\"");
// buy loop stat + card on Dividends tab
a = rep(a, "<div class=\"stat\"><b>${d.autoUsers||0}</b><span>autofolio on</span></div></div>", "<div class=\"stat\"><b>${d.autoUsers||0}</b><span>autofolio on</span></div><div class=\"stat acc\"><b>$${fmt(S.buyloop.usd)}</b><span>Buy Loop · $FOLIO bought</span></div></div>");
a = rep(a, "<div class=\"card green\"><span class=\"n\">Diamond Update · Autofolio</span>", "<div class=\"card green\"><span class=\"n\">Buy Loop · Paid in $FOLIO</span><h4 style=\"font-size:24px\">Your dividend buys the token.</h4><p>Flip your payout to <b>$FOLIO</b> and your hourly slice of the pot buys $FOLIO at market instead of stock. Every wallet on the Buy Loop turns protocol revenue into an open-market bid, every hour. ${S.div.loopUsers||0} wallets on it · ${fmt(S.buyloop.folio,0)} $FOLIO bought so far.</p></div><div class=\"card green\"><span class=\"n\">Diamond Update · Autofolio</span>");
// vault tier in boost tab
a = rep(a, "<table><thead><tr><th>Tier</th><th class=\"num\">Hold</th><th class=\"num\">Multiplier</th><th class=\"num\">sfUSD APY</th><th class=\"num\">365d lock APY</th><th class=\"num\">Points</th></tr></thead><tbody>${tiers}</tbody></table>",
  "<table><thead><tr><th>Tier</th><th class=\"num\">Hold</th><th class=\"num\">Multiplier</th><th class=\"num\">sfUSD APY</th><th class=\"num\">365d lock APY</th><th class=\"num\">Points</th></tr></thead><tbody>${tiers}<tr style=\"${b&&b.vault?'background:rgba(184,147,61,.12)':''};border-top:2px solid var(--gold)\"><td><b>Vault</b> <span class=\"tag acc\">30-day commit</span>${b&&b.vault?' <span class=\"tag acc\">you</span>':''}</td><td class=\"num\">${fmt(S.vault.need,0)}+ $FOLIO · committed</td><td class=\"num\">${S.vault.mult}×</td><td class=\"num\">${(S.stake.apy*S.vault.mult*100).toFixed(0)}%</td><td class=\"num\">${(terms[365]*S.vault.mult*100).toFixed(0)}%</td><td class=\"num\">${S.vault.mult}×</td></tr></tbody></table>\n   <div class=\"panel\" style=\"margin-top:22px;border-color:var(--gold)\"><span class=\"kicker\">Vault tier · commit $FOLIO, don’t custody it</span><h3>${S.vault.mult}× on everything for a 30-day promise.</h3><p style=\"font-size:13px;color:var(--ink2)\">Commit at least <b>${fmt(S.vault.need,0)} $FOLIO</b> (0.5% of supply) for ${S.vault.days} days. Nothing leaves your wallet: the protocol re-reads your on-chain balance every hour. Hold at or above the commitment and every yield line runs at <b>${S.vault.mult}×</b>, one rung above Diamond. Drop below it and the commitment breaks and your hold streak resets to zero. ${S.vault.active} wallets committed · ${fmt(S.vault.committed,0)} $FOLIO.</p>${me?(me.vault.active?`<div class=\"stats\" style=\"border:1px solid var(--rule)\"><div class=\"stat acc\"><b>${fmt(me.vault.amt,0)}</b><span>$FOLIO committed</span></div><div class=\"stat\"><b>${new Date(me.vault.until).toISOString().slice(0,10)}</b><span>until</span></div><div class=\"stat\"><b>${me.vault.mult}×</b><span>your multiplier</span></div></div>${Date.now()>=me.vault.until?'<button class=\"btn ghost\" style=\"margin-top:10px\" onclick=\"act(\\'/api/vault/release\\',{})\">Release</button>':''}`:`<div style=\"display:flex;gap:10px;align-items:end;margin-top:8px\">${inp('vtAmt','$FOLIO to commit',String(Math.round(Math.max(me.vault.need,me.folio))),'you hold '+fmt(me.folio,0))}<button class=\"btn acc\" onclick=\"act('/api/vault/commit',{amount:val('vtAmt')})\">Commit ${S.vault.days} days</button></div>`):'<p style=\"color:var(--mut);font-size:12px\">Connect a wallet.</p>'}</div>");
fs.writeFileSync(A, a.replace(/\n/g, '\r\n'));
console.log('patched');
