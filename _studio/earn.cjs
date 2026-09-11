'use strict';
// "Use it. Get paid." incentives graphic → brand/folio-earn.png.  node _studio/earn.cjs
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
const cell = (k, v, d, tag) => `<div class="c"><div class="st">${tag}</div><div class="k caps">${k}</div><div class="v serif">${v}</div><div class="d">${d}</div></div>`;
const html = `${head}
.stage{width:2400px;height:1350px}
.w{position:absolute;inset:0;padding:96px 150px;display:flex;flex-direction:column}.top{display:flex;justify-content:space-between;align-items:center;margin-bottom:36px}
.h{font-size:150px;margin-bottom:54px}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;flex:1}
.c{position:relative;background:var(--card);border:1px solid var(--goldl);border-radius:14px;padding:30px 32px;box-shadow:0 0 0 6px rgba(0,200,5,.05)}
.st{position:absolute;top:24px;right:26px;font-weight:700;font-size:16px;letter-spacing:.2em;color:#0a0a0a;background:var(--gold);padding:5px 12px;border-radius:999px}
.k{font-size:22px;margin-bottom:12px}.v{font-size:60px;margin-bottom:14px;line-height:1.05}.d{font-size:27px;color:var(--ink2);line-height:1.4}
.foot{display:flex;justify-content:space-between;font-size:30px;margin-top:36px;padding-top:26px;border-top:1px solid var(--rule)}
</style></head><body><div class="stage"><div class="w">
<div class="top">${mark(84)}<div class="caps" style="font-size:26px">$FOLIO · ROBINHOOD CHAIN · WHAT YOU EARN</div></div>
<div class="h serif">Use it. <em>Get paid.</em></div>
<div class="grid">
${cell('Hold $FOLIO', 'paid in stock', 'Every hour, protocol fees buy NVDA, AAPL, HOOD, SPY and airdrop it to holders. Hold, get stock.', 'HOURLY')}
${cell('Stake fUSD', 'up to 18% APY', '6% base. Your $FOLIO balance multiplies it: Bronze 1.5× · Silver 2× · Gold 2.5× · Diamond 3×.', 'BOOSTED')}
${cell('Lock fUSD', 'up to 50% APY', '30d 12% · 90d 20% · 180d 30% · 365d 50%. Times your tier, to 150%. Accrues every 3 s.', 'FIXED')}
${cell('Season 1', '5% of supply', 'Points on everything you stake, lock, pool, borrow or trade. Ends Nov 1. Early is everything.', 'AIRDROP')}
${cell('Refer', '10% forever', 'Your referee’s points pay you 10%, for as long as they play. They start +50.', 'PASSIVE')}
${cell('Trade', 'fund your own dividend', 'Perps on the stocks that back fUSD. Every fee you pay comes back as stock to holders. Including you.', 'PERPS')}
</div>
<div class="foot"><span class="mono">foliorh.xyz/app</span><span class="mono" style="color:var(--ink2)">CA 0x2a28d1654d64c1142c7c47324e802a7192837135</span></div>
</div></div></body></html>`;
(async () => { const f = path.join(OUT, 'folio-earn.html'); fs.writeFileSync(f, html); await shot(f, path.join(BRAND, 'folio-earn.png'), 2400, 1350); console.log('✓ folio-earn.png'); })().catch((e) => { console.error(e); process.exit(1); });
