// The Buy Loop 10s cut → brand/folio-buyloop.mp4.  node _studio/buyloop-video.cjs
const fs = require('fs'), path = require('path');
const { record } = require('./rec.cjs');
const html = fs.readFileSync(path.join(__dirname, 'out', 'folio-banner.html'), 'utf8');
const head = html.slice(0, html.indexOf('</style>'));
const MONKEY = html.match(/<svg class="seal"[^>]*>(.*?)<\/svg>/s)[1];
const HORSE = html.match(/<svg class="seal"[^>]*>.*?<\/svg>.*?<svg class="seal"[^>]*>(.*?)<\/svg>/s)[1];
const tiers = [['1×', 'Paper'], ['1.5×', 'Bronze'], ['2×', 'Silver'], ['2.5×', 'Gold'], ['3×', 'Diamond'], ['4×', 'Vault']].map(([m, n], i) => `<div class="t${i === 5 ? ' v' : ''}" style="transition-delay:${i * 140}ms"><b>${m}</b><span>${n}</span></div>`).join('');
const page = `${head}
.stage{width:1280px;height:720px}
.sc{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;opacity:0;transition:opacity .4s}
.sc.on{opacity:1}
.big{font-size:84px;max-width:1040px}
.k{font-size:13px;margin-top:22px}
.ln{width:110px;height:1px;background:var(--gold);margin-top:26px}
.seals{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:1300px;height:900px;opacity:.10;pointer-events:none}
.seals svg{position:absolute;stroke:var(--gold);fill:none;stroke-width:.5;stroke-linecap:round;stroke-linejoin:round;color:var(--gold)}
.tick{position:absolute;left:0;right:0;top:0;height:34px;background:#f4f4f1;color:#0f2e19;font-family:'JetBrains Mono';font-size:12px;display:flex;align-items:center;gap:34px;padding:0 20px;white-space:nowrap;overflow:hidden}
.tick b{color:#0a0a0a;font-weight:500}.tick span{margin-right:34px}
.tick i{display:inline-block;animation:mv 18s linear infinite;font-style:normal}
@keyframes mv{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.mark{display:flex;justify-content:center;position:relative;width:340px;height:220px;margin-bottom:26px}
.mark svg{position:absolute;top:0;width:220px;height:220px;stroke:var(--gold);fill:none;stroke-width:1.1;stroke-linecap:round;stroke-linejoin:round;color:var(--gold)}
.loop{display:flex;align-items:center;gap:14px;margin-top:34px;font-family:'JetBrains Mono';font-size:22px;color:var(--ink2)}.loop b{color:var(--gold2);font-weight:500;opacity:0;transform:translateY(8px);transition:all .35s}.loop i{font-style:normal;color:var(--mut);opacity:0;transition:opacity .35s}
.sc.on .loop b,.sc.on .loop i{opacity:1;transform:none}
.loop .hot{color:var(--gold);font-size:30px}
.seg{display:flex;gap:14px;margin-top:30px}.seg div{border:1px solid var(--rule);background:var(--card);padding:18px 34px;font-size:22px;color:var(--mut)}.seg div.on{border-color:var(--gold);color:var(--gold2);box-shadow:0 0 0 4px rgba(0,200,5,.12)}
.tiers{display:flex;gap:10px;margin-top:30px}
.t{border:1px solid var(--rule);border-radius:8px;padding:14px 20px;min-width:120px;transform:scale(.85);opacity:0;transition:all .35s}
.sc.on .t{transform:scale(1);opacity:1}
.t b{display:block;font-family:'Newsreader',serif;font-weight:300;font-size:44px}.t span{font-family:'Hanken Grotesk';font-weight:700;letter-spacing:.14em;text-transform:uppercase;font-size:11px;color:var(--mut)}
.t.v{border-color:var(--gold);background:rgba(0,200,5,.1)}.t.v b,.t.v span{color:var(--gold2)}
.pulse{animation:pl 1.6s ease-in-out infinite alternate}@keyframes pl{from{opacity:.55}to{opacity:1}}
</style></head><body><div class="stage">
<div class="tick"><i>${'<span><b>NVDA</b> $219.37</span><span><b>AAPL</b> $333.61</span><span><b>HOOD</b> $113.29</span><span><b>SPY</b> $765.98</span><span><b>$FOLIO</b> $0.0000307</span><span><b>fUSD</b> $1.000</span><span><b>next dividend</b> 41:12</span>'.repeat(4)}</i></div>
<div class="seals"><svg viewBox="0 0 64 64" style="left:-40px;top:60px;width:700px;height:700px">${MONKEY}</svg><svg viewBox="0 0 64 64" style="right:-40px;top:120px;width:700px;height:700px">${HORSE}</svg></div>
<div class="sc" id="s1"><div class="mark"><svg viewBox="0 0 64 64" style="left:0">${MONKEY}</svg><svg viewBox="0 0 64 64" style="right:0">${HORSE}</svg></div><div class="serif big">The Buy Loop</div><div class="caps k">$FOLIO · live now · Robinhood Chain</div></div>
<div class="sc" id="s2"><div class="serif big">Your dividend<br><em>buys the token.</em></div><div class="seg"><div>Paid in stock</div><div class="on">Paid in $FOLIO</div></div><div class="caps k">one switch · your hourly slice buys $FOLIO at market</div></div>
<div class="sc" id="s3"><div class="serif big" style="font-size:64px">Every wallet on the loop is<br>an open-market bid, <em>every hour.</em></div><div class="loop"><b style="transition-delay:.1s">fees</b><i style="transition-delay:.2s">→</i><b style="transition-delay:.3s">pot</b><i style="transition-delay:.4s">→</i><b class="hot" style="transition-delay:.5s">buy $FOLIO</b><i style="transition-delay:.7s">→</i><b style="transition-delay:.8s">your wallet</b><i style="transition-delay:.9s">→</i><b style="transition-delay:1s">streak ↑</b></div><div class="caps k">24 buys a day · from protocol revenue · not from you</div></div>
<div class="sc" id="s4"><div class="serif big">Vault tier. <em>4×.</em></div><div class="tiers">${tiers}</div><div class="caps k">commit 0.5% of supply for 30 days · nothing leaves your wallet · break it and your streak resets</div></div>
<div class="sc" id="s5"><div class="serif big">Get paid in <em>$FOLIO.</em></div><div class="ln"></div><div class="caps k pulse">foliorh.xyz/app · 0x2a28…7135</div></div>
</div></body></html>`;
const f = path.join(__dirname, 'out', 'folio-buyloop.html'); fs.writeFileSync(f, page);
record({ url: 'file:///' + f.replace(/\\/g, '/'), out: path.join(__dirname, '..', 'brand', 'folio-buyloop.mp4'), warm: 1200, async run({ ev, sleep }) {
  const show = async (id, ms) => { await ev(`document.querySelectorAll('.sc').forEach(e=>e.classList.remove('on'));document.getElementById('${id}').classList.add('on')`); await sleep(ms); };
  await show('s1', 1600); await show('s2', 2000); await show('s3', 2600); await show('s4', 2200); await show('s5', 1800);
} }).catch((e) => { console.error(e); process.exit(1); });
