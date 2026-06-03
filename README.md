# Tinvest

Tinvest is a TON ecosystem investment intelligence platform. It helps users discover, analyze, monitor, and buy TON ecosystem tokens using AI-assisted research, STON.fi market data, watcher scores, Telegram-native workflows, and STON.fi-powered buying.

The current implementation includes a public landing page with a waitlist, a Telegram bot, a Telegram Mini App buying flow, deterministic token scoring, AI token checks, watchlists, alerts, and Vercel-ready serverless APIs.

## Product Surfaces

- `/` - public one-screen landing page with waitlist.
- `/app` - Telegram Mini App for token buying through STON.fi-powered routing and wallet approval.
- Telegram bot - token rankings, watchlists, AI reports, AI pre-buy checks, alerts, and Mini App entrypoints.
- Serverless API - Vercel API routes for data, buying flow, waitlist, Telegram webhook, and cron jobs.

## What It Does

- Collects TON token and pool data from STON.fi.
- Stores assets, pools, liquidity, volume, and metric snapshots in Postgres.
- Scores tokens by liquidity, activity, market health, stability, and ecosystem presence.
- Uses AI to explain token scores, summarize risks, and generate pre-buy checks.
- Lets users create token watchlists and receive alert-rule based updates.
- Lets users buy supported TON tokens through a STON.fi-powered Telegram Mini App.
- Captures waitlist submissions from the public website.

## Current Scope

This is the MVP foundation for a broader TON investment intelligence platform. Today, the system focuses on STON.fi market data, scoring, AI summaries, Telegram UX, and STON.fi-powered buying. The planned next stage expands into richer off-chain intelligence: ecosystem events, project announcements, Telegram/community signals, product launches, developer activity, campaigns, and other token-relevant context.

Tinvest is an informational product. It is not financial advice, automated portfolio management, or a custodial trading system. Users keep control of wallet connection and transaction approval.

## Tech Stack

- TypeScript
- React + Vite
- Telegram Bot API via grammY
- Telegram Mini App
- TON Connect
- STON.fi API/SDK integration
- Prisma + Postgres
- OpenAI-compatible Responses API
- Vercel serverless functions and cron jobs

## Project Structure

```text
api/                         Vercel serverless API routes
docs/user-guide.md           User-facing guide
miniapp/                     Landing page and Telegram Mini App frontend
prisma/                      Prisma schema and migrations
scripts/setup-telegram.ts    Telegram webhook/menu setup script
src/bot/                     Telegram bot commands
src/jobs/                    Local collector, scorer, alert workers
src/server/                  Shared API handlers and local Express server
src/services/                Collector, scoring, alerts, reports, buying services
src/stonfi/                  STON.fi client and normalizers
tests/                       Unit tests
```

## Environment Variables

Copy the sample env file:

```bash
cp .env.example .env
```

Required for production:

```bash
DATABASE_URL="postgresql://..."
TELEGRAM_BOT_TOKEN="..."
TELEGRAM_WEBHOOK_SECRET="generate-a-random-secret"
ADMIN_SECRET="generate-a-random-secret"
CRON_SECRET="generate-a-random-secret"
MINI_APP_PUBLIC_URL="https://your-domain.example"
MINI_APP_ICON_URL="https://your-domain.example/icon.png"
OPENAI_API_KEY="..."
OPENAI_BASE_URL="https://share-ai.ckbdev.com"
OPENAI_MODEL="gpt-5.4"
OPENAI_WIRE_API="responses"
OPENAI_REASONING_EFFORT="medium"
OPENAI_DISABLE_RESPONSE_STORAGE="true"
TON_RPC_ENDPOINT="https://toncenter.com/api/v2/jsonRPC"
TON_RPC_API_KEY=""
```

For Supabase pooler deployments, use a dedicated Prisma schema and pooler-safe settings:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/postgres?schema=watchers&pgbouncer=true&connection_limit=1&sslmode=require"
```

The `schema=watchers` part matters. Without it, Prisma will look for tables such as `public.Asset`.

## Local Development

Install dependencies:

```bash
npm install
```

Start local Postgres:

```bash
docker compose up -d postgres
```

Generate Prisma client and apply migrations:

```bash
npm run db:generate
npm run db:deploy
```

Bootstrap STON.fi data and scores:

```bash
npm run run:collector
npm run run:scorer
```

Run local services:

```bash
npm run dev:server
npm run dev:miniapp
npm run dev:bot
npm run dev:alerts
```

Local frontend routes:

- Landing page: `http://127.0.0.1:5173/`
- Mini App: `http://127.0.0.1:5173/app`
- Local API server: `http://127.0.0.1:3000`

## Telegram Commands

- `/start` - onboarding and command list.
- `/top` - top ranked tokens by latest watcher scores.
- `/risk` - highest-risk scored tokens.
- `/watch <symbol or address>` - add a token to your watchlist.
- `/unwatch <symbol or address>` - remove a token from your watchlist.
- `/watchlist` - show watched tokens with latest scores.
- `/report <symbol or address>` - explain the latest score.
- `/swapcheck <symbol or address> <TON amount>` - run an AI pre-buy risk check.
- `/buy <symbol or address> [TON amount]` - open the Telegram Mini App for user-approved buying.
- `/alerts` - show active alert rules.

## API Routes

Public/app routes:

- `GET /api/config`
- `GET /api/assets/:query`
- `POST /api/waitlist`
- `POST /api/ai/swap-check`
- `POST /api/swap/quote`
- `POST /api/swap/transaction`
- `GET /tonconnect-manifest.json`

Telegram and operations routes:

- `POST /api/telegram/webhook`
- `POST /api/telegram/setup`
- `GET|POST /api/cron/run`
- `GET|POST /api/cron/collector`
- `GET|POST /api/cron/scorer`
- `GET|POST /api/cron/alerts`

`/api/telegram/setup` requires:

```text
Authorization: Bearer $ADMIN_SECRET
```

Cron routes require:

```text
Authorization: Bearer $CRON_SECRET
```

## Vercel Deployment

Vercel serves the frontend from `dist/` and runs the API as serverless functions.

Build settings:

- Root directory: repository root
- Build command: `npm run vercel-build`
- Output directory: `dist`

Deploy:

```bash
npm run db:deploy
npm run vercel-build
vercel deploy --prod
```

After the production URL is live:

1. Set `MINI_APP_PUBLIC_URL` to the final HTTPS domain.
2. Set `MINI_APP_ICON_URL` to `https://your-domain/icon.png`.
3. Redeploy.
4. Register Telegram webhook and Mini App menu:

```bash
curl -X POST "https://your-domain/api/telegram/setup" \
  -H "Authorization: Bearer $ADMIN_SECRET"
```

Scheduled jobs are configured in `vercel.json`:

- `/api/cron/run` runs collector, scorer, then alerts.

Manual targeted cron routes are also available:

- `/api/cron/collector`
- `/api/cron/scorer`
- `/api/cron/alerts`

## Verification

Run:

```bash
npm run typecheck
npm test
npm run vercel-build
npm run health
```

`npm run health` expects recent successful collector and scorer runs in Postgres.

Useful smoke tests:

```bash
curl https://your-domain/api/config
curl https://your-domain/api/assets/STON
curl https://your-domain/tonconnect-manifest.json
```

Waitlist smoke test:

```bash
curl -X POST "https://your-domain/api/waitlist" \
  -H "content-type: application/json" \
  --data '{"email":"user@example.com","source":"manual"}'
```

AI pre-buy check smoke test:

```bash
curl -X POST "https://your-domain/api/ai/swap-check" \
  -H "content-type: application/json" \
  --data '{"token":"STON","amountTon":"0.1"}'
```

## Safety Notes

- Tinvest never asks users for seed phrases or private keys.
- The bot does not execute buys by itself.
- Users must connect their wallet and approve transactions through TON Connect.
- AI checks are informational and warn-only.
- Scores are deterministic and auditable; AI does not change rankings.
- The product should be presented as investment intelligence, not financial advice.

## User Guide

See [docs/user-guide.md](docs/user-guide.md).
