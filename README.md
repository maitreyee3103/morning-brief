# Morning Brief

A privately hosted personal morning dashboard that loads fresh every day at 7am. One place to see everything you need — actions, news, weather, journal, todos, a daily dare, and a song — before the day starts.

Live at [morning-brief-gray-mu.vercel.app](https://morning-brief-gray-mu.vercel.app)

---

## What it does

Every morning at 7am a cron job runs and fetches everything in parallel:

- **Weather** — current temperature, conditions, rain probability, wind, high/low (Open-Meteo)
- **Top actions** — overnight Gmail, Slack, and Notion activity ranked by Claude (urgency + what you missed while sleeping)
- **News** — top 5 headlines from the US and India (NewsAPI)
- **Journal question** — a single thoughtful question generated fresh each morning by Claude
- **Dare of the day** — a small witty dare on weekdays, something bigger on weekends (Claude)
- **Song of the day** — one track curated for the day's mood (Claude)
- **Priority todos** — top tasks from Todoist

All of this is cached in Supabase so the dashboard loads instantly. No waiting on 8 APIs at page load.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Hosting | Vercel (free tier) |
| Database | Supabase (Postgres + RLS) |
| Auth | Clerk (Google OAuth + passkey) |
| Cron | Vercel Cron Jobs (7am UTC daily) |
| AI | Anthropic Claude API (actions ranking, journal, dare, song) |
| Weather | Open-Meteo (free, no key required) |
| News | NewsAPI.org |
| Mobile | PWA — installable on Android home screen |

---

## Design

Warm editorial aesthetic inspired by [chungiyoo.com](https://www.chungiyoo.com). Cream base, no filled card boxes — sections float on the background separated by hairline rules. Terracotta red as the single accent colour used only where it means something.

- **Fonts** — DM Serif Display (headings, italic serif moments) + DM Sans (all data and body text)
- **Colours** — `#F4EFE4` cream base, `#D13820` terracotta accent, `#18120C` espresso text
- **Dark mode** — deep warm brown (`#1A1410`), not cold black
- **Load screen** — typographic entry animation: "Morning / Brief." rising up, red underline drawing across, progress bars filling as data resolves
- **Mobile** — 5 swipeable screens (Actions → Journal → Todos → News → Dare + Song)

---

## Project structure

```
/app
  /dashboard          — main dashboard (protected)
  /journal            — journal history (protected)
  /settings           — connect integrations, set location
  /api
    /cron/morning-brief  — 7am cron job endpoint
    /journal             — save journal entries
    /integrations        — OAuth callbacks

/components
  LoadScreen.tsx      — entry animation
  Header.tsx          — clock, weather, theme toggle
  TopActions.tsx      — overnight Gmail/Slack/Notion actions
  NewsSection.tsx     — US/India news tab toggle
  JournalSection.tsx  — daily question + save to Supabase
  TodoList.tsx        — priority task list
  DareWidget.tsx      — daily dare with accept/skip
  SongBar.tsx         — song of the day footer

/lib
  supabase/client.ts  — browser Supabase client
  supabase/server.ts  — server Supabase client
  supabase/service.ts — service role client (cron only)
  getSnapshot.ts      — fetch today's daily snapshot
  design-tokens.ts    — single source of truth for all colours/fonts
```

---

## Database

Four tables in Supabase, all with Row Level Security enforced at the database level.

**daily_snapshots** — written by cron at 7am, read by dashboard on load. One row per user per day containing all widget data as JSONB.

**journal_entries** — written by user from the dashboard. Stored permanently, one entry per day (upsert on conflict).

**user_preferences** — timezone, location, theme. Written once on setup.

**oauth_tokens** — encrypted OAuth tokens for Gmail, Notion, Slack, Spotify. Server-side only, never exposed to the browser.

---

## Security

Six layers, nothing left to chance.

1. **Transport** — Vercel enforces HTTPS on all routes, no HTTP fallback
2. **Authentication** — Clerk middleware runs at the edge on every request before anything loads
3. **Database** — Supabase RLS policies filter every query by `user_id` at the DB level, not just in code
4. **API keys** — all third-party keys in Vercel environment variables only, never in code or the browser
5. **OAuth tokens** — stored encrypted in Supabase, accessed server-side by cron only
6. **Cron endpoint** — protected by `CRON_SECRET` header; any external hit without the secret returns 401

---

## Environment variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# APIs
NEWS_API_KEY=
ANTHROPIC_API_KEY=

# Cron protection
CRON_SECRET=
ADMIN_USER_ID=
```

---

## Local development

```bash
# Clone and install
git clone <repo>
cd morning-brief
npm install

# Add environment variables
cp .env.example .env.local
# Fill in all values from your Supabase, Clerk, and API dashboards

# Run dev server
npm run dev

# Manually trigger the cron (to generate today's snapshot)
curl -X GET http://localhost:3000/api/cron/morning-brief \
  -H "x-cron-secret: your-cron-secret"

# Visit the dashboard
open http://localhost:3000/dashboard
```

---

## Deploying

The project deploys to Vercel automatically. The cron job is registered in `vercel.json` and runs at 7am UTC daily.

```json
{
  "crons": [
    {
      "path": "/api/cron/morning-brief",
      "schedule": "0 7 * * *"
    }
  ]
}
```

To deploy manually:

```bash
vercel --prod
```

---

## Android shortcut

The app is a PWA. To install on Android:

1. Open Chrome and sign in at your Vercel URL
2. Tap the three-dot menu → Add to Home Screen
3. The app installs with a custom icon and opens full-screen with no browser chrome

The load screen plays once per day. Subsequent opens go straight to the dashboard.

---

## Mac shortcut

Two options:

**Automator (free)** — Create a new Application in Automator with the "Open URLs" action pointing to your Vercel URL. Export as `.app`, assign a custom icon via Get Info, drag to the Dock.

**Fluid.app (free)** — Wraps any URL as a native Mac app with its own Dock icon and persistent session. Setup takes five minutes.

---

## Build order

This project was built in 10 steps:

1. Next.js scaffold + Vercel deploy + Clerk auth
2. Supabase schema + RLS policies + Clerk JWT integration
3. Settings page + OAuth connection flows
4. Cron job with fan-out parallel fetches + Claude ranking
5. Load screen animation (typographic entry)
6. Desktop dashboard shell — all components built
7. Real data wired from Supabase snapshot into every widget
8. Journal save — writes entries to Supabase
9. PWA manifest + mobile responsive layout
10. Android home screen + Mac desktop shortcuts

---

## Roadmap

- Gmail OAuth integration — real overnight email actions
- Slack OAuth integration — real mention and DM summary  
- Notion OAuth integration — real assigned task list
- Spotify OAuth integration — personalised song recommendations
- Todoist integration — real priority task list
- `/journal` history page — searchable past entries
- `/settings` page — location, timezone, theme, connect integrations
- Dark mode persistence — save theme preference to Supabase
- Weather location — use real user location from preferences

---

*Built with Claude.*