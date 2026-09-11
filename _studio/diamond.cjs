'use strict';
// Diamond Update announcement graphic → brand/folio-diamond.png.  node _studio/v3.cjs
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
const bars = Array.from({ length: 20 }, (_, i) => `<div class="b" style="height:${34 + i * 9}px;opacity:${.35 + i * .033}"></div>`).join('');
const html = `${head}
.stage{width:2400px;height:1350px}
.w{position:absolute;inset:0;padding:96px 150px;display:flex;flex-direction:column}.top{display:flex;justify-content:space-between;align-items:center;margin-bottom:34px}
.h{font-size:140px;margin-bottom:40px}
.two{display:grid;grid-template-columns:1fr 1fr;gap:26px;flex:1}
.c{position:relative;background:var(--card);border:1px solid var(--goldl);border-radius:16px;padding:36px 40px;box-shadow:0 0 0 6px rgba(0,200,5,.05);display:flex;flex-direction:column}
.k{font-size:22px;margin-bottom:14px}.v{font-size:76px;margin-bottom:12px;line-height:1.02}.d{font-size:28px;color:var(--ink2);line-height:1.42;max-width:900px}
.chart{display:flex;align-items:flex-end;gap:8px;height:220px;margin-top:auto;padding-top:20px;border-top:1px solid var(--rule)}
.b{flex:1;background:var(--gold);border-radius:4px 4px 0 0}
.lbl{display:flex;justify-content:space-between;font-family:'JetBrains Mono';font-size:20px;color:var(--mut);margin-top:10px}
.loop{display:flex;align-items:center;gap:14px;margin-top:auto;padding-top:20px;border-top:1px solid var(--rule);font-family:'JetBrains Mono';font-size:24px;color:var(--ink2);flex-wrap:wrap}
.loop b{color:var(--gold2)}.loop i{font-style:normal;color:var(--mut)}
.foot{display:flex;justify-content:space-between;font-size:30px;margin-top:34px;padding-top:26px;border-top:1px solid var(--rule)}
</style></head><body><div class="stage"><div class="w">
<div class="top">${mark(84)}<div class="caps" style="font-size:26px">$FOLIO · THE DIAMOND UPDATE · LIVE NOW</div></div>
<div class="h serif">Don’t sell. <em>Get paid double.</em></div>
<div class="two">
  <div class="c"><div class="k caps">Diamond Update · Hold streak</div><div class="v serif">+5% every hour you hold</div><div class="d">Your share of every hourly stock airdrop grows with every epoch you don’t sell. <b>2× weight after 20 hours.</b> Sell more than 5% and it resets to zero. Same pot. Bigger slice for diamond hands.</div>
    <div class="chart">${bars}</div><div class="lbl"><span>hour 1 · 1.05×</span><span>hour 10 · 1.5×</span><span>hour 20 · 2.0×</span></div></div>
  <div class="c"><div class="k caps">Diamond Update · Autofolio</div><div class="v serif">Dividends buy more dividends</div><div class="d">One toggle. Every stock airdrop is deposited as collateral, <b>half the new headroom minted as fUSD</b>, and staked at your boosted APY. The mint fee flows back into the pot you’re paid from. Your folio compounds every hour without you.</div>
    <div class="loop"><b>stock airdrop</b><i>→</i><b>vault collateral</b><i>→</i><b>mint fUSD</b><i>→</i><b>stake sfUSD</b><i>→</i><b>fee → pot</b><i>→</i><b>stock airdrop</b></div></div>
</div>
<div class="foot"><span class="mono">foliorh.xyz/app</span><span class="mono" style="color:var(--ink2)">CA 0x2a28d1654d64c1142c7c47324e802a7192837135</span></div>
</div></div></body></html>`;
(async () => { const f = path.join(OUT, 'folio-diamond.html'); fs.writeFileSync(f, html); await shot(f, path.join(BRAND, 'folio-diamond.png'), 2400, 1350); console.log('✓ folio-diamond.png'); })().catch((e) => { console.error(e); process.exit(1); });
