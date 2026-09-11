// Diamond Update 10s cut → brand/folio-diamond.mp4.  node _studio/diamond-video.cjs
const fs = require('fs'), path = require('path');
const { record } = require('./rec.cjs');
const html = fs.readFileSync(path.join(__dirname, 'out', 'folio-banner.html'), 'utf8');
const head = html.slice(0, html.indexOf('</style>'));
const MONKEY = html.match(/<svg class="seal"[^>]*>(.*?)<\/svg>/s)[1];
const HORSE = html.match(/<svg class="seal"[^>]*>.*?<\/svg>.*?<svg class="seal"[^>]*>(.*?)<\/svg>/s)[1];
const bars = Array.from({ length: 20 }, (_, k) => `<div class="bar" style="height:${30 + k * 8}px;transition-delay:${k * 70}ms"></div>`).join('');
const page = `${head}
.stage{width:1280px;height:720px}
.sc{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;opacity:0;transition:opacity .4s}
.sc.on{opacity:1}
.big{font-size:84px;max-width:1000px}
.k{font-size:13px;margin-top:22px}
.ln{width:110px;height:1px;background:var(--gold);margin-top:26px}
.seals{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:1300px;height:900px;opacity:.10;pointer-events:none}
.seals svg{position:absolute;stroke:var(--gold);fill:none;stroke-width:.5;stroke-linecap:round;stroke-linejoin:round;color:var(--gold)}
.row{display:flex;gap:26px;margin-top:22px}
.st{border:1px solid var(--rule);background:var(--card);padding:18px 30px;min-width:180px}
.st b{display:block;font-family:'Newsreader',serif;font-weight:300;font-size:52px;letter-spacing:-.02em}
.st span{display:block;font-size:11px;margin-top:6px}
.tick{position:absolute;left:0;right:0;top:0;height:34px;background:#f4f4f1;color:#0f2e19;font-family:'JetBrains Mono';font-size:12px;display:flex;align-items:center;gap:34px;padding:0 20px;white-space:nowrap;overflow:hidden}
.tick b{color:#0a0a0a;font-weight:500}.tick span{margin-right:34px}
.tick i{display:inline-block;animation:mv 18s linear infinite;font-style:normal}
@keyframes mv{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.mark{display:flex;justify-content:center;position:relative;width:340px;height:220px;margin-bottom:26px}
.mark svg{position:absolute;top:0;width:220px;height:220px;stroke:var(--gold);fill:none;stroke-width:1.1;stroke-linecap:round;stroke-linejoin:round;color:var(--gold)}
.bars{display:flex;align-items:flex-end;gap:6px;height:190px;margin-top:26px}
.bar{width:34px;background:var(--gold);border-radius:3px 3px 0 0;transform:scaleY(0);transform-origin:bottom;transition:transform .35s ease-out}
.sc.on .bar{transform:scaleY(1)}
.loop{display:flex;align-items:center;gap:12px;margin-top:34px;font-family:'JetBrains Mono';font-size:22px;color:var(--ink2)}.loop b{color:var(--gold2);font-weight:500}.loop i{font-style:normal;color:var(--mut)}
.pulse{animation:pl 1.6s ease-in-out infinite alternate}@keyframes pl{from{opacity:.55}to{opacity:1}}
</style></head><body><div class="stage">
<div class="tick"><i>${'<span><b>NVDA</b> $219.37</span><span><b>AAPL</b> $333.61</span><span><b>HOOD</b> $113.29</span><span><b>SPY</b> $765.98</span><span><b>ETH</b> $2,570</span><span><b>fUSD</b> $1.000</span><span><b>next dividend</b> 41:12</span>'.repeat(4)}</i></div>
<div class="seals"><svg viewBox="0 0 64 64" style="left:-40px;top:60px;width:700px;height:700px">${MONKEY}</svg><svg viewBox="0 0 64 64" style="right:-40px;top:120px;width:700px;height:700px">${HORSE}</svg></div>
<div class="sc" id="s1"><div class="mark"><svg viewBox="0 0 64 64" style="left:0">${MONKEY}</svg><svg viewBox="0 0 64 64" style="right:0">${HORSE}</svg></div><div class="serif big">The Diamond Update</div><div class="caps k">$FOLIO · live now · Robinhood Chain</div></div>
<div class="sc" id="s2"><div class="serif big">Don’t sell.<br><em>Get paid double.</em></div><div class="ln"></div><div class="caps k">hold streak · +5% dividend weight every hour you hold</div></div>
<div class="sc" id="s3"><div class="serif big" style="font-size:60px">Every hour you hold,<br>your slice of the airdrop <em>grows.</em></div><div class="bars">${bars}</div><div class="row"><div class="st"><b>1.05×</b><span class="caps">hour 1</span></div><div class="st"><b>1.5×</b><span class="caps">hour 10</span></div><div class="st"><b>2.0×</b><span class="caps">hour 20 · max</span></div></div><div class="caps k" style="color:var(--red)">sell more than 5% → resets to zero</div></div>
<div class="sc" id="s4"><div class="serif big">Dividends buy<br><em>more dividends.</em></div><div class="loop"><b>stock airdrop</b><i>→</i><b>collateral</b><i>→</i><b>mint fUSD</b><i>→</i><b>stake</b><i>→</i><b>fee → pot</b></div><div class="caps k">autofolio · one toggle · compounds every hour without you</div></div>
<div class="sc" id="s5"><div class="serif big">Hold. <em>Compound.</em> Repeat.</div><div class="ln"></div><div class="caps k pulse">foliorh.xyz/app · $FOLIO · CA 0x2a28…7135</div></div>
</div></body></html>`;
const f = path.join(__dirname, 'out', 'folio-diamond.html'); fs.writeFileSync(f, page);
record({ url: 'file:///' + f.replace(/\\/g, '/'), out: path.join(__dirname, '..', 'brand', 'folio-diamond.mp4'), warm: 1200, async run({ ev, sleep }) {
  const show = async (id, ms) => { await ev(`document.querySelectorAll('.sc').forEach(e=>e.classList.remove('on'));document.getElementById('${id}').classList.add('on')`); await sleep(ms); };
  await show('s1', 1700); await show('s2', 1900); await show('s3', 2800); await show('s4', 2000); await show('s5', 1800);
} }).catch((e) => { console.error(e); process.exit(1); });
