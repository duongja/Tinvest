# Tinvest User Guide

Tinvest helps users research TON ecosystem tokens, monitor opportunities, and buy supported tokens through a STON.fi-powered Telegram Mini App. It combines watcher scores, STON.fi market data, and AI-generated explanations.

Tinvest is informational. It does not provide financial advice and does not control your wallet.

## Main Ways To Use Tinvest

- Visit the website to join the waitlist.
- Use the Telegram bot to discover and analyze TON tokens.
- Use watchlists to monitor tokens.
- Use AI checks before buying.
- Use the Telegram Mini App to buy tokens with wallet approval.

## Website

Open:

```text
https://your-domain/
```

The landing page shows a short overview of Tinvest and a waitlist form.

To join the waitlist:

1. Enter your email address.
2. Select **Join**.
3. Wait for the confirmation message.

If you already joined before, submitting the same email updates the existing waitlist entry instead of creating a duplicate.

## Telegram Bot

Open the Tinvest Telegram bot and send:

```text
/start
```

The bot returns the available commands.

## Discover Top Tokens

Use:

```text
/top
```

This shows the highest-ranked tokens from the latest watcher scores.

Each line includes:

- Rank
- Token symbol
- Opportunity score
- Risk score
- Volume
- Recent change when available

Example:

```text
/top
```

Use this as a starting point for research, not as a buy instruction.

## Review High-Risk Tokens

Use:

```text
/risk
```

This shows tokens with higher risk scores in the scored token universe. It is useful for identifying tokens that need extra caution before buying or watching.

## Add Tokens To Your Watchlist

Use:

```text
/watch STON
```

You can use a token symbol or token address:

```text
/watch <symbol or token address>
```

If the token exists in the collected STON.fi asset set, the bot adds it to your watchlist.

## Remove Tokens From Your Watchlist

Use:

```text
/unwatch STON
```

## View Your Watchlist

Use:

```text
/watchlist
```

The bot returns your watched tokens with their latest scores.

## Generate A Token Report

Use:

```text
/report STON
```

The report explains the latest deterministic watcher score in plain language.

Reports can include:

- Main score drivers
- Risk context
- Liquidity and activity observations
- Market health context

The AI report uses supplied data only. It should not be treated as financial advice.

## Run An AI Pre-Buy Check

Use:

```text
/swapcheck STON 0.1
```

Despite the command name, this is an AI pre-buy risk check. It reviews the current STON.fi quote and watcher score context for buying a token with the specified amount of TON.

The response includes:

- Token being reviewed
- TON amount
- Expected receive amount
- Minimum receive amount
- Price impact
- AI verdict
- Positive signals
- Risk signals
- Invalidation signals

Possible verdicts:

- `Favorable`
- `Mixed`
- `High risk`
- `Insufficient data`

The AI check is warn-only. It does not block you from buying and does not execute anything.

## Buy A Token

Use:

```text
/buy STON 0.1
```

The bot returns a message with an **Open Mini App** button.

Inside the Mini App:

1. Confirm the token symbol or token address.
2. Confirm the TON amount.
3. Review the STON.fi quote.
4. Review the AI pre-buy check card.
5. Connect your TON wallet through TON Connect.
6. Select **Review in wallet**.
7. Approve or reject the transaction in your wallet.

Tinvest does not touch private keys and does not approve transactions for you.

## Mini App URL

The Mini App is available at:

```text
https://your-domain/app
```

You can prefill a token and amount:

```text
https://your-domain/app?token=STON&amount=0.1
```

In normal use, you should open it from the Telegram bot so Telegram Mini App and wallet context are available.

## Alerts

Use:

```text
/alerts
```

This shows active alert rules connected to your Telegram user. Alerts are based on watcher conditions such as score, risk, ranking, liquidity movement, or volume changes.

## Understanding Scores

Tinvest scores are deterministic. The AI does not decide rankings.

The scoring system considers:

- Liquidity
- Trading activity
- Market health
- Stability
- STON.fi ecosystem presence
- Risk indicators

Scores are useful for screening and comparison, but they are not guarantees of performance.

## Understanding AI Outputs

AI is used to make token data easier to understand.

AI can:

- Explain score drivers.
- Summarize risk.
- Compare positive and negative signals.
- Highlight invalidation signals.
- Provide concise token research summaries.

AI should not:

- Be treated as financial advice.
- Be assumed to know private or unverifiable information.
- Replace your own research.
- Be used as an automated buying system.

## Wallet Safety

Tinvest will never ask for:

- Seed phrases
- Private keys
- Wallet recovery words
- Direct custody of funds

All buying actions require user-controlled wallet approval through TON Connect.

Before approving a transaction:

- Check the token symbol and address.
- Check the TON amount.
- Check the expected receive amount.
- Check the minimum receive amount.
- Check price impact.
- Review wallet transaction details.

## Common Issues

### No scores are available

The backend collector and scorer need to run first. In production this is handled by cron jobs. In local development, run:

```bash
npm run run:collector
npm run run:scorer
```

### Token not found

The token may not exist in the collected STON.fi asset set. Try a token address instead of a symbol, or wait for the collector to refresh.

### Mini App does not open

Check that:

- The deployed URL uses HTTPS.
- `MINI_APP_PUBLIC_URL` is set correctly.
- Telegram setup has been run.
- The bot button points to `/app`.

### Wallet connection fails

Check that:

- `tonconnect-manifest.json` is reachable.
- `MINI_APP_ICON_URL` points to a public image.
- The wallet supports TON Connect.

### Waitlist submit fails

Check that:

- The email is valid.
- `/api/waitlist` is deployed.
- The database has the `WaitlistEntry` migration applied.

## Privacy Notes

The waitlist stores email addresses. Telegram usage stores Telegram user IDs and optional usernames/first names needed for watchlists and alerts. AI pre-buy checks and reports are stored for auditability and product improvement.

Do not submit sensitive wallet secrets or private keys anywhere in Tinvest.

## Disclaimer

Tinvest is an informational TON ecosystem intelligence platform. It is not financial advice, legal advice, tax advice, or automated portfolio management. Users are responsible for their own research and decisions.
