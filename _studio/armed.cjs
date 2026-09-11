'use strict';
// "Every engine is armed" bullish status graphic → brand/folio-armed.png.  node _studio/armed.cjs
const fs = require('fs'), path = require('path');
const { shot } = require('./rec.cjs');
const OUT = path.join(__dirname, 'out'); fs.mkdirSync(OUT, { recursive: true });
const BRAND = path.join(__dirname, '..', 'brand');
// reuse fonts + base css + seal mark from the brand kit output
const src = fs.readFileSync(path.join(OUT, 'folio-banner.html'), 'utf8');
const head = src.slice(0, src.indexOf('</style>'));
const MONKEY = src.match(/<svg class="seal"[^>]*>(.*?)<\/svg>/s)[1];
const HORSE = src.match(/<svg class="seal"[^>]*>.*?<\/svg>.*?<svg class="seal"[^>]*>(.*?)<\/svg>/s)[1];
const seal = (which, size, style) => `<svg class="seal" width="${size}" height="${size}" viewBox="0 0 64 64" style="stroke-width:1.1;${style}">${which === 'h' ? HORSE : MONKEY}</svg>`;
const mark = (size) => `<div style="position:relative;width:${size * 1.55}px;height:${size}px">${seal('m', size, 'position:absolute;left:0;top:0')}${seal('h', size, 'position:absolute;right:0;top:0')}</div>`;
const cell = (k, v, d) => `<div class="c"><div class="st">LIVE</div><div class="k caps">${k}</div><div class="v serif">${v}</div><div class="d">${d}</div></div>`;
const html = `${head}
.stage{width:2400px;height:1350px}
.w{position:absolute;inset:0;padding:96px 150px;display:flex;flex-direction:column}.top{display:flex;justify-content:space-between;align-items:center;margin-bottom:36px}
.h{font-size:150px;margin-bottom:54px}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;flex:1;align-content:stretch}
.c{position:relative;background:var(--card);border:1px solid var(--goldl);border-radius:14px;padding:30px 32px;box-shadow:0 0 0 6px rgba(0,200,5,.05)}
.st{position:absolute;top:24px;right:26px;font-weight:700;font-size:16px;letter-spacing:.2em;color:#0a0a0a;background:var(--gold);padding:5px 12px;border-radius:999px}
.k{font-size:22px;margin-bottom:12px}.v{font-size:64px;margin-bottom:14px}.d{font-size:28px;color:var(--ink2);line-height:1.4}
.foot{display:flex;justify-content:space-between;font-size:30px;margin-top:36px;padding-top:26px;border-top:1px solid var(--rule)}
</style></head><body><div class="stage"><div class="w">
<div class="top">${mark(84)}<div class="caps" style="font-size:26px">$FOLIO · ROBINHOOD CHAIN · SYSTEM STATUS</div></div>
<div class="h serif">Every engine is <em>armed.</em></div>
<div class="grid">
${cell('Token', '$FOLIO on-chain', 'CA baked into the app. Holder balances read live from Robinhood Chain.')}
${cell('Holder boost', 'up to 3×', 'Bronze 1.5 · Silver 2 · Gold 2.5 · Diamond 3. No staking, no snapshot.')}
${cell('Dividend engine', 'every hour', 'Fees buy real stock and airdrop it to holders. 24 epochs a day.')}
${cell('Buyback &amp; burn', '30% of revenue', 'Priced against the live pair. Every burn receipted on the ledger.')}
${cell('Treasury', 'public', 'One wallet. Every deposit verified on-chain. Proof page open.')}
${cell('Perps', '10× stocks · 25× crypto', 'Trade the collateral. Fund the dividend.')}
</div>
<div class="foot"><span class="mono">foliorh.xyz/app</span><span class="mono" style="color:var(--ink2)">CA 0x2a28d1654d64c1142c7c47324e802a7192837135</span></div>
</div></div></body></html>`;
(async () => { const f = path.join(OUT, 'folio-armed.html'); fs.writeFileSync(f, html); await shot(f, path.join(BRAND, 'folio-armed.png'), 2400, 1350); console.log('✓ folio-armed.png'); })().catch((e) => { console.error(e); process.exit(1); });
