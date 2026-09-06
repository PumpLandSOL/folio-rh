// FOLIO 10s hype cut → brand/folio-update.mp4.  node _studio/hype.cjs
const fs = require('fs'), path = require('path');
const { record } = require('./rec.cjs');
const html = fs.readFileSync(path.join(__dirname, 'out', 'folio-banner.html'), 'utf8'); // reuse fonts+base css
const head = html.slice(0, html.indexOf('</style>'));
const MONKEY = html.match(/<svg class="seal"[^>]*>(.*?)<\/svg>/s)[1];
const HORSE = html.match(/<svg class="seal"[^>]*>.*?<\/svg>.*?<svg class="seal"[^>]*>(.*?)<\/svg>/s)[1];
const page = `${head}
.stage{width:1280px;height:720px}
.sc{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;opacity:0;transition:opacity .4s}
.sc.on{opacity:1}
.big{font-size:84px;max-width:1000px}
.k{font-size:13px;margin-top:22px}
.ln{width:110px;height:1px;background:var(--gold);margin-top:26px}
.seals{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:1300px;height:900px;opacity:.10;pointer-events:none}
.seals svg{position:absolute;stroke:var(--gold);fill:none;stroke-width:.5;stroke-linecap:round;stroke-linejoin:round;color:var(--gold)}
.row{display:flex;gap:26px;margin-top:38px}
.st{border:1px solid var(--rule);background:var(--card);padding:26px 34px;min-width:200px}
.st b{display:block;font-family:'Newsreader',serif;font-weight:300;font-size:58px;letter-spacing:-.02em}
.st span{display:block;font-size:11px;margin-top:6px}
.tick{position:absolute;left:0;right:0;top:0;height:34px;background:#1c1b18;color:#e6d5ab;font-family:'JetBrains Mono';font-size:12px;display:flex;align-items:center;gap:34px;padding:0 20px;white-space:nowrap;overflow:hidden}
.tick b{color:#f8f6f2;font-weight:500}.tick span{margin-right:34px}
.tick i{display:inline-block;animation:mv 18s linear infinite;font-style:normal}
@keyframes mv{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.mark{display:flex;justify-content:center;position:relative;width:340px;height:220px;margin-bottom:26px}
.mark svg{position:absolute;top:0;width:220px;height:220px;stroke:var(--gold);fill:none;stroke-width:1.1;stroke-linecap:round;stroke-linejoin:round;color:var(--gold)}
.pulse{animation:pl 1.6s ease-in-out infinite alternate}@keyframes pl{from{opacity:.55}to{opacity:1}}
</style></head><body><div class="stage">
<div class="tick"><i>${'<span><b>NVDA</b> $210.94</span><span><b>AAPL</b> $305.63</span><span><b>HOOD</b> $97.72</span><span><b>SPY</b> $753.89</span><span><b>ETH</b> $603.31</span><span><b>fUSD</b> $1.000</span><span><b>next dividend</b> 09:41</span>'.repeat(4)}</i></div>
<div class="seals"><svg viewBox="0 0 64 64" style="left:-40px;top:60px;width:700px;height:700px">${MONKEY}</svg><svg viewBox="0 0 64 64" style="right:-40px;top:120px;width:700px;height:700px">${HORSE}</svg></div>

<div class="sc" id="s1"><div class="mark"><svg viewBox="0 0 64 64" style="left:0">${MONKEY}</svg><svg viewBox="0 0 64 64" style="right:0">${HORSE}</svg></div><div class="serif big">Folio is <em>live.</em></div><div class="caps k">tech update · robinhood chain</div></div>
<div class="sc" id="s2"><div class="serif big">Contract deployed.<br><em>Price wired.</em></div><div class="ln"></div><div class="mono" style="font-family:'JetBrains Mono';font-size:22px;margin-top:22px;color:var(--ink)">0x2c4e63ead1936ba1fe963fa3cb918a7b34de7777</div><div class="caps k">on-chain holder balances · live oracle</div></div>
<div class="sc" id="s3"><div class="serif big">Fees are already<br><em>buying stock.</em></div><div class="row"><div class="st"><b id="rev">$0.00</b><span class="caps">revenue pot</span></div><div class="st"><b id="cd">15:00</b><span class="caps">next dividend</span></div><div class="st"><b>NVDA</b><span class="caps">this epoch</span></div></div></div>
<div class="sc" id="s4"><div class="serif big">Mint. Stake. Backstop.<br><em>Trade</em> at 25×.</div><div class="caps k">fUSD · sfUSD · stability pool · perps — all shipped</div></div>
<div class="sc" id="s5"><div class="serif big">Fees in. <em>Stock out.</em></div><div class="ln"></div><div class="caps k pulse">foliorh.xyz · $FOLIO · CA on site</div></div>
</div></body></html>`;
const f = path.join(__dirname, 'out', 'folio-update.html'); fs.writeFileSync(f, page);
record({ url: 'file:///' + f.replace(/\\/g, '/'), out: path.join(__dirname, '..', 'brand', 'folio-update.mp4'), warm: 1200, async run({ ev, sleep }) {
  const show = async (id, ms) => { await ev(`document.querySelectorAll('.sc').forEach(e=>e.classList.remove('on'));document.getElementById('${id}').classList.add('on')`); await sleep(ms); };
  await show('s1',1700); await show('s2',2300);
  await ev(`document.getElementById('s3').classList.add('on');document.querySelectorAll('.sc:not(#s3)').forEach(e=>e.classList.remove('on'));let r=0,t=900;setInterval(()=>{r+=Math.random()*3.7+1.2;t-=1;document.getElementById('rev').textContent='
} }).catch((e) => { console.error(e); process.exit(1); });
+r.toFixed(2);document.getElementById('cd').textContent='14:'+String(t%60).padStart(2,'0')},60)`); await sleep(2400);
  await show('s4',1800); await show('s5',1900);
} }).catch((e) => { console.error(e); process.exit(1); });
