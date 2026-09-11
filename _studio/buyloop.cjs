'use strict';
// The Buy Loop graphic → brand/folio-buyloop.png.  node _studio/buyloop.cjs
const fs = require('fs'), path = require('path');
const { shot } = require('./rec.cjs');
const OUT = path.join(__dirname, 'out'); fs.mkdirSync(OUT, { recursive: true });
const BRAND = path.join(__dirname, '..', 'brand');
const src = fs.readFileSync(path.join(OUT, 'folio-banner.html'), 'utf8');
const head = src.slice(0, src.indexOf('</style>'));
const MONKEY = src.match(/<svg class="seal"[^>]*>(.*?)<\/svg>/s)[1];
const HORSE = src.match(/<svg class="seal"[^>]*>.*?<\/svg>.*?<svg class="seal"[^>]*>(.*?)<\/svg>/s)[1];
const seal = (which, size, style) => `<svg class="seal" width="${size}" height="${size}" viewBox="0 0 64 64" style="stroke-width:1.1;${style}">${which === 'h' ? HORSE : MONKEY}</svg>`;
const mark = (size) => `<div style="position:relative;width:${size * 1.55}px;height:${size}px">${seal('m', size, 'position:absolute;left:0;top:0')}${seal('h', size, 'position:absolute;right:0;top:0')}</div>`;
const html = `${head}
.stage{width:2400px;height:1350px}
.w{position:absolute;inset:0;padding:96px 150px;display:flex;flex-direction:column}.top{display:flex;justify-content:space-between;align-items:center;margin-bottom:34px}
.h{font-size:140px;margin-bottom:40px}
.two{display:grid;grid-template-columns:1fr 1fr;gap:26px;flex:1}
.c{position:relative;background:var(--card);border:1px solid var(--goldl);border-radius:16px;padding:36px 40px;box-shadow:0 0 0 6px rgba(0,200,5,.05);display:flex;flex-direction:column}
.k{font-size:22px;margin-bottom:14px}.v{font-size:76px;margin-bottom:12px;line-height:1.02}.d{font-size:28px;color:var(--ink2);line-height:1.42}
.loop{display:flex;align-items:center;justify-content:center;gap:16px;margin-top:auto;padding-top:24px;border-top:1px solid var(--rule);font-family:'JetBrains Mono';font-size:26px;color:var(--ink2);flex-wrap:wrap}
.loop b{color:var(--gold2)}.loop i{font-style:normal;color:var(--mut)}.loop .big{color:var(--gold);font-size:34px}
.tiers{display:grid;grid-template-columns:repeat(6,1fr);gap:10px;margin-top:auto;padding-top:24px;border-top:1px solid var(--rule)}
.t{border:1px solid var(--rule);border-radius:10px;padding:14px 10px;text-align:center}
.t b{display:block;font-family:'Newsreader',serif;font-weight:300;font-size:46px;letter-spacing:-.02em}.t span{font-family:'Hanken Grotesk';font-weight:700;letter-spacing:.14em;text-transform:uppercase;font-size:14px;color:var(--mut)}
.t.v{border-color:var(--gold);background:rgba(0,200,5,.08)}.t.v b{color:var(--gold2)}.t.v span{color:var(--gold2)}
.foot{display:flex;justify-content:space-between;font-size:30px;margin-top:34px;padding-top:26px;border-top:1px solid var(--rule)}
</style></head><body><div class="stage"><div class="w">
<div class="top">${mark(84)}<div class="caps" style="font-size:26px">$FOLIO · THE BUY LOOP · LIVE NOW</div></div>
<div class="h serif">Your dividend <em>buys the token.</em></div>
<div class="two">
  <div class="c"><div class="k caps">Paid in $FOLIO</div><div class="v serif">Every hour, an open-market bid</div><div class="d">Flip your payout from stock to <b>$FOLIO</b>. Your hourly slice of the pot buys $FOLIO at market instead of NVDA. Every wallet on the loop turns protocol revenue into a buy, 24 times a day.</div>
    <div class="loop"><b>fees</b><i>→</i><b>pot</b><i>→</i><b class="big">buy $FOLIO</b><i>→</i><b>your wallet</b><i>→</i><b>hold streak ↑</b><i>→</i><b>bigger slice</b></div></div>
  <div class="c"><div class="k caps">Vault tier</div><div class="v serif">4× for a 30-day promise</div><div class="d">Commit <b>0.5% of supply</b> for 30 days. Nothing leaves your wallet; the chain is re-read every hour. Hold it and every yield line runs at <b>4×</b>. Drop below it and the commitment breaks and your streak resets.</div>
    <div class="tiers"><div class="t"><b>1×</b><span>Paper</span></div><div class="t"><b>1.5×</b><span>Bronze</span></div><div class="t"><b>2×</b><span>Silver</span></div><div class="t"><b>2.5×</b><span>Gold</span></div><div class="t"><b>3×</b><span>Diamond</span></div><div class="t v"><b>4×</b><span>Vault</span></div></div></div>
</div>
<div class="foot"><span class="mono">foliorh.xyz/app</span><span class="mono" style="color:var(--ink2)">0x2a28d1654d64c1142c7c47324e802a7192837135</span></div>
</div></div></body></html>`;
(async () => { const f = path.join(OUT, 'folio-buyloop.html'); fs.writeFileSync(f, html); await shot(f, path.join(BRAND, 'folio-buyloop.png'), 2400, 1350); console.log('✓ folio-buyloop.png'); })().catch((e) => { console.error(e); process.exit(1); });
