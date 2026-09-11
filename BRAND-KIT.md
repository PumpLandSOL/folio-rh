# FOLIO — Brand Kit

**A folio of stocks. A dollar that pays you back.** fUSD stock-collateral stablecoin + sfUSD + stability pool + hourly stock dividends + perps, on Robinhood Chain.

- Site: https://foliorh.xyz · X: @FolioOnRH (placeholder — site `/x` redirects) · Ticker: **$FOLIO**

## Assets (`brand/`)
| File | Size | Use |
|---|---|---|
| folio-pfp.png | 2000×2000 | X / Telegram avatar (twin zodiac seals + wordmark, circle-safe) |
| folio-banner.png | 3000×1000 | X header |
| folio-og.png | 2400×1260 | Link preview |
| folio-wordmark.png | 2400×800 | Logo lockup |
| folio-ledger.png | 2400×1350 | "One dollar. Five lines." explainer (hold/stake/backstop/dividend/trade) |
| folio-markets.png | 2400×1350 | Collateral tiers (Stables 90 · ETH 75 · T1 55 · T2 40) |
| folio-perps.png | 2400×1350 | Dark perps key-art ("Trade the folio. Fund the dividend.") |
| **folio-hype.mp4** | 1280×720 · 10s | Hype cut — seals → mint → hourly dividend → stake/backstop/trade → endcard |
| **folio-demo-mint.mp4** | 1280×720 · 15s | Tech demo 1 — real app: pick NVDA vault → deposit 5 → mint 500 fUSD → stake → sfUSD |
| **folio-demo-perps.mp4** | 1280×720 · 15s | Tech demo 2 — real app: HOOD 10× long on fUSD margin → fee lands in revenue pot → dividend engine |

Regenerate (needs headless Chrome + ffmpeg, server on :8188 for demos):
`node _studio/brand.cjs` · `node _studio/hype.cjs` · `node _studio/demo.cjs mint` · `node _studio/demo.cjs perps`

## Identity
- **Mark**: fine line-art monkey + horse zodiac seals (dashed outer ring), overlapping as a twin lockup.
- **Palette**: paper `#f8f6f2` · card `#fffdf9` · ink `#1c1b18` · ink2 `#5a5852` · muted `#8f8b82` · rule `#e6e1d8` · gold `#b8933d` · gold-dark `#8f6f25` · gold-light `#e6d5ab` · green `#2f6b4a` · red `#a83b2b`. Dark surface (perps terminal): `#1c1b18` + `#e6d5ab`.
- **Type**: Newsreader 300 (thin serif display, italic gold emphasis) · Hanken Grotesk 700 small-caps (0.18em tracking, labels) · JetBrains Mono (numbers, tape).
- **Texture**: paper grain overlay, gold hairline dividers, ruled tables, seal watermarks.

## Voice
Brokerage-statement calm. Short declaratives. Never "demo", "beta", "simulated", "guaranteed".

Taglines: "A folio of stocks. A dollar that pays you back." · "Your stocks, working." · "Fees in. Stock out." · "Trade the folio. Fund the dividend." · "One dollar. Five lines."

## X bio
> A folio of stocks. A dollar that pays you back. Mint fUSD against tokenized equities & ETH — every hour protocol fees buy stock for $FOLIO holders. Robinhood Chain · foliorh.xyz

## Tweets

**1 · Intro (attach folio-hype.mp4)**
```
introducing FOLIO

a folio of stocks. a dollar that pays you back.

mint fUSD against NVDA, AAPL, HOOD, SPY, ETH. stake it. every hour, protocol fees buy stock and airdrop it to $FOLIO holders.

Robinhood Chain → foliorh.xyz
```

**2 · Tech demo — mint & stake (attach folio-demo-mint.mp4)**
```
how fUSD works, in 15 seconds:

→ pick a vault (isolated, tiered LTV, exchange-tape oracle)
→ lock 5 NVDA at 55% LTV
→ mint 500 fUSD · 3% APR, 0.10% origination
→ stake → sfUSD, 6% target from borrower fees

every fee you just paid goes to the dividend engine. foliorh.xyz
```

**3 · Tech demo — perps → dividend (attach folio-demo-perps.mp4)**
```
the loop that makes $FOLIO different:

→ open a HOOD 10× long on fUSD margin (0.06% fee)
→ that fee lands in the revenue pot
→ every hour: 50% buys stock at oracle → airdropped to holders, 50% → locked LP

fees in. stock out. foliorh.xyz
```

**4 · Ledger (attach folio-ledger.png)**
```
one dollar. five lines.

01 hold — fUSD, redeemable 1:1 via PSM
02 stake — sfUSD, 6% target
03 backstop — stability pool, 5% liq. discount
04 dividend — stock airdrop every hour
05 trade — perps, 25× crypto / 10× stocks

$FOLIO · Robinhood Chain
```

**5 · Markets (attach folio-markets.png)**
```
tiered like a prime broker.

USDG 90% · ETH 75% · NVDA AAPL GOOGL SPY 55% · HOOD META TSLA 40%

isolated vaults. liquidation at health < 1.0 — the stability pool burns the debt and takes collateral 5% under oracle. foliorh.xyz/docs
```

---

## LAUNCH DAY · 5 tweets ($FOLIO on Robinhood Chain) — 2026-09-11
Post in order, ~1 hour apart. Pin tweet 1. CA baked into server default FOLIO_MINT.

**1 · Launch (attach folio-hype.mp4 · pin)**
```
$FOLIO is live on Robinhood Chain.

A folio of stocks. A dollar that pays you back.

Mint fUSD against NVDA, AAPL, HOOD, SPY, ETH. Every hour protocol fees buy real stock and airdrop it to holders.

foliorh.xyz
CA: 0x2a28d1654d64c1142c7c47324e802a7192837135
```

**2 · How it works (attach folio-demo-mint.mp4)**
```
fUSD in 15 seconds:

→ pick a vault, tiered LTV, priced off the exchange tape
→ lock tokenized stock or ETH
→ mint fUSD at 3% APR
→ stake → sfUSD, 6% base

Every fee you just paid feeds the dividend engine. Stock out, every hour.

foliorh.xyz/app
```

**3 · Holder boost (attach folio-tech-boost.png)**
```
Every stable pays everyone the same rate. Folio pays $FOLIO holders the most.

Your on-chain balance sets a tier. No staking, no snapshot.
Bronze 1.5× · Silver 2× · Gold 2.5× · Diamond 3×

sfUSD 6% → 18%. Term locks to 50%. Demand is written into the yield curve.
```

**4 · Buyback & burn (attach folio-tech-burn.png)**
```
Every hour the fee pot splits:

40% buys stock for holders
30% locks LP
30% buys back & burns $FOLIO

24 burns a day. Live ledger on the site. Same fee pays you in NVDA and shrinks the float in the same epoch.

foliorh.xyz/proof
```

**5 · Trade the folio (attach folio-demo-perps.mp4)**
```
The stocks that back fUSD are the stocks you can trade.

Perps on HOOD, NVDA, TSLA, SPY up to 10×. BTC, ETH, SOL to 25×. Margin in fUSD.

Every trade fee lands in the same pot that pays the hourly dividend.

Trade the folio. Fund the dividend.
foliorh.xyz/app
```

Reply under tweet 1: "Not financial advice. Overcollateralized lending, leveraged trading and locked deposits can lose money."

---

## MORE TWEETS · unused assets (2026-09-11)

**folio-ledger.png** (258 chars)
```
One dollar. Five lines.

Hold fUSD, backed by stock, redeemable 1:1
Stake → sfUSD earns borrower fees
Backstop the stability pool, take liquidations at a discount
Dividend: hourly stock airdrop to $FOLIO holders
Trade perps on the collateral

foliorh.xyz/app
```

**folio-markets.png** (224 chars)
```
What backs fUSD, and at what LTV:

Stables 90%
ETH 75%
Tier 1 stocks (SPY, AAPL, NVDA) 55%
Tier 2 (HOOD, COIN, MSTR) 40%

Isolated vaults. Exchange-tape oracle. Overcollateralized by design, not by promise.

foliorh.xyz/docs
```

**folio-perps.png** (226 chars)
```
Trade the folio. Fund the dividend.

Perps on the same stocks that back fUSD. HOOD, NVDA, TSLA, SPY to 10×. BTC, ETH, SOL to 25×. fUSD margin.

Every fee lands in the pot that pays holders in stock every hour.

foliorh.xyz/app
```

**folio-vs-nest-index.png** (215 chars)
```
Nest: stock-backed dollar, no dividend.
Arrow: tiered CDPs, no stock.
The Index: stock dividends, no stablecoin.

Folio is all three on one chain, and adds perps, holder boost and an hourly $FOLIO burn.

foliorh.xyz
```

**folio-recap-vs-nest.png** (212 chars)
```
The recap, side by side.

fUSD backed by tokenized stock. sfUSD to 18%. Stability pool. Hourly stock dividends. 30% of revenue burns $FOLIO. Perps on the collateral.

One protocol on Robinhood Chain.

foliorh.xyz
```

**folio-v21-proof.png** (165 chars)
```
Verify, don't trust.

The treasury wallet is public. Every hourly epoch is receipted with the block it was pinned to. Every burn is on the ledger.

foliorh.xyz/proof
```

**folio-v2.mp4** (216 chars)
```
Hold $FOLIO → up to 3× on every yield in the protocol.

sfUSD 6% → 18%
Term locks to 50%
Season 1: 5% of supply to points holders
30% of revenue buys back & burns $FOLIO

Same fUSD. Now it compounds.

foliorh.xyz/app
```

**folio-update.mp4** (245 chars)
```
Fees are already buying stock.

Every mint, borrow, trade and liquidation feeds one pot. Every hour it buys real stock and airdrops it to $FOLIO holders.

Hold and get paid in NVDA.

foliorh.xyz/app
CA: 0x2a28d1654d64c1142c7c47324e802a7192837135
```

**folio-armed.png · bullish status update** (275 chars)
```
$FOLIO: every engine is armed.

CA live → holder boost reads your balance on-chain, up to 3×
Hourly dividends buying real stock for holders
30% of revenue → buyback & burn, receipted
Treasury public. Perps live.

foliorh.xyz/app
CA: 0x2a28d1654d64c1142c7c47324e802a7192837135
```

**folio-earn.png · bullish incentives update** (273 chars)
```
Hold $FOLIO → paid in real stock every hour
Stake fUSD → up to 18% APY, boosted by your balance
Lock fUSD → up to 50% APY
Season 1 → 5% of supply, ends Nov 1
Refer → 10% forever

Every fee comes back as stock.

foliorh.xyz/app
CA: 0x2a28d1654d64c1142c7c47324e802a7192837135
```

**folio-diamond.png / folio-diamond.mp4 · The Diamond Update** (321 chars)
```
The Diamond Update is live on $FOLIO.

HOLD STREAK: every hour you don't sell, your share of the stock airdrop grows +5%. 2× after 20 hours. Sell and it resets.

AUTOFOLIO: one toggle. Dividends → collateral → mint fUSD → stake. Your folio compounds itself.

foliorh.xyz/app
CA: 0x2a28d1654d64c1142c7c47324e802a7192837135
```

---

## Reference · The Index ($INDEX, Robinhood Chain) — checked 2026-09-11
CA 0x56910D4409F3a0C78C64DD8D0545FF0705389870 · supply 1B · GeckoTerminal daily OHLCV, main pair 0xD298…28Ff
- ATH price ≈ $0.0757 intraday (2026-09-04), daily close ATH $0.0740 (2026-09-03) → **ATH mcap ≈ $74–76M**
- Now ≈ $0.033 → mcap ≈ $33M, liquidity ≈ $0.95M, 24h vol ≈ $4.6M
- Launch-week wicks ($0.21 / $1.59 / $3.34 on Jul 11–14) are thin-liquidity prints on $0–$750 volume; not a real ATH.
- $FOLIO at check: mcap ≈ $29.6K, liq ≈ $16K. 1% of INDEX ATH = $750K (≈25×); INDEX ATH = ≈2,560×.

**folio-vs-nest-index.png · INDEX comparison** (280 chars)
```
$INDEX hit $76M paying stock dividends. Nothing else.

$FOLIO pays the same hourly dividend, plus:
fUSD, backed by stocks
sfUSD to 18%, locks to 50%
perps on the collateral
30% burn
hold streak → 2× airdrop

$FOLIO: $30K

foliorh.xyz/app
0x2a28d1654d64c1142c7c47324e802a7192837135
```
