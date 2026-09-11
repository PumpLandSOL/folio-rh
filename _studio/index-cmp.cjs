'use strict';
// $INDEX vs $FOLIO comparison → brand/folio-vs-index.png.  node _studio/index-cmp.cjs
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
const Y = '<span class="y">●</span> ', N = '<span class="n">—</span>';
const ROWS = [
  ['Stock dividends to holders', Y + 'yes', Y + 'yes · every hour'],
  ['A stablecoin backed by the stocks', N, Y + 'fUSD · isolated vaults · PSM'],
  ['Yield on the dollar', N, Y + 'sfUSD 6 → 18% · locks to 50%'],
  ['Perps on the collateral', N, Y + '10× stocks · 25× crypto'],
  ['Token buyback & burn', N, Y + '30% of revenue, dynamic to 60%'],
  ['Holder boost by balance', N, Y + 'Bronze 1.5× → Diamond 3×'],
  ['Reward for not selling', N, Y + 'hold streak → 2× airdrop weight'],
  ['Auto-compounding', N, Y + 'Autofolio: airdrop → collateral → mint → stake'],
];
const html = `${head}
.stage{width:2400px;height:1350px}
.w{position:absolute;inset:0;padding:90px 150px;display:flex;flex-direction:column}.top{display:flex;justify-content:space-between;align-items:center;margin-bottom:30px}
.h{font-size:120px;margin-bottom:34px}
table{width:100%;border-collapse:collapse;font-size:30px}
th{text-align:left;padding:14px 18px;border-bottom:3px solid var(--gold);font-family:'Hanken Grotesk';font-weight:700;letter-spacing:.16em;text-transform:uppercase;font-size:22px;color:var(--gold2)}
td{padding:17px 18px;border-bottom:1px solid var(--rule);color:var(--ink2);vertical-align:middle}
td:first-child{color:var(--ink);font-weight:600;width:34%}td.f{background:rgba(0,200,5,.05);color:var(--ink)}
.y{color:var(--gold);font-size:22px}.n{color:var(--mut)}
.caps2{display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-top:auto;padding-top:26px}
.cap{background:var(--card);border:1px solid var(--goldl);border-radius:14px;padding:22px 30px;display:flex;justify-content:space-between;align-items:center}
.cap .k{font-family:'Hanken Grotesk';font-weight:700;letter-spacing:.16em;text-transform:uppercase;font-size:20px;color:var(--mut)}
.cap b{font-family:'Newsreader',serif;font-weight:300;font-size:64px;letter-spacing:-.02em}
.foot{display:flex;justify-content:space-between;font-size:28px;margin-top:26px;padding-top:22px;border-top:1px solid var(--rule)}
</style></head><body><div class="stage"><div class="w">
<div class="top">${mark(84)}<div class="caps" style="font-size:26px">$INDEX vs $FOLIO · ROBINHOOD CHAIN</div></div>
<div class="h serif">Same dividend. <em>Everything else.</em></div>
<table><thead><tr><th></th><th>$INDEX</th><th>$FOLIO</th></tr></thead><tbody>
${ROWS.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td class="f">${r[2]}</td></tr>`).join('')}
</tbody></table>
<div class="caps2"><div class="cap"><span class="k">$INDEX · ATH market cap</span><b>$76M</b></div><div class="cap" style="border-color:var(--gold)"><span class="k">$FOLIO · today</span><b style="color:var(--gold2)">$30K</b></div></div>
<div class="foot"><span class="mono">foliorh.xyz/app</span><span class="mono" style="color:var(--ink2)">0x2a28d1654d64c1142c7c47324e802a7192837135</span></div>
</div></div></body></html>`;
(async () => { const f = path.join(OUT, 'folio-vs-index.html'); fs.writeFileSync(f, html); await shot(f, path.join(BRAND, 'folio-vs-index.png'), 2400, 1350); console.log('✓ folio-vs-index.png'); })().catch((e) => { console.error(e); process.exit(1); });
