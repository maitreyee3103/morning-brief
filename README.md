# Morning Brief

A privately hosted personal morning dashboard that loads fresh every day at 7am. One place to see everything you need — actions, news, weather, journal, todos, a daily dare, and a song before the day starts.

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

