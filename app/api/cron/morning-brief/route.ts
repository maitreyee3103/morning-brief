import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServiceClient } from '@/lib/supabase/service'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

async function fetchWeather() {
  const url =
    'https://api.open-meteo.com/v1/forecast' +
    '?latitude=51.5074&longitude=-0.1278' +
    '&current=temperature_2m,precipitation_probability,weathercode,windspeed_10m' +
    '&daily=temperature_2m_max,temperature_2m_min&timezone=Europe/London&forecast_days=1'
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Weather fetch failed: ${res.status}`)
  return res.json()
}

async function fetchNewsUS() {
  const url = 'https://newsapi.org/v2/top-headlines?country=us&pageSize=5'
  const res = await fetch(url, { headers: { 'X-Api-Key': process.env.NEWS_API_KEY! } })
  if (!res.ok) throw new Error(`News fetch failed (us): ${res.status}`)
  return res.json()
}

async function fetchNewsIndia() {
  const url = 'https://newsapi.org/v2/everything?q=india&language=en&pageSize=5&sortBy=publishedAt'
  const res = await fetch(url, { headers: { 'X-Api-Key': process.env.NEWS_API_KEY! } })
  if (!res.ok) throw new Error(`News fetch failed (india): ${res.status}`)
  return res.json()
}

async function fetchJournalQuestion(weekday: string) {
  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 256,
    system:
      'You generate a single thoughtful journaling question. Return only the question, no preamble.',
    messages: [
      { role: 'user', content: `Generate a journaling question for today, ${weekday}` },
    ],
  })
  return (msg.content[0] as { type: string; text: string }).text
}

async function fetchDare(weekday: string) {
  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 256,
    system:
      'You generate a small daily dare. Weekdays: small, witty, social, doable in one day. Weekends: bigger adventure. Return only the dare text, no preamble.',
    messages: [
      { role: 'user', content: `Generate a dare for today, ${weekday}` },
    ],
  })
  return (msg.content[0] as { type: string; text: string }).text
}

async function fetchSong(weekday: string) {
  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 256,
    system:
      'You suggest one song that matches the mood of the day. Return JSON only: {title, artist, album, year, reason}. No preamble, no markdown.',
    messages: [
      { role: 'user', content: `Suggest a song for ${weekday}` },
    ],
  })
  const raw = (msg.content[0] as { type: string; text: string }).text
  return JSON.parse(raw)
}

async function fetchAllData(userId: string) {
  const weekday = new Date().toLocaleDateString('en-GB', { weekday: 'long' })

  const [weather, newsUS, newsIndia, journalQuestion, dare, song] =
    await Promise.allSettled([
      fetchWeather(),
      fetchNewsUS(),
      fetchNewsIndia(),
      fetchJournalQuestion(weekday),
      fetchDare(weekday),
      fetchSong(weekday),
    ])

  return {
    userId,
    weather: weather.status === 'fulfilled' ? weather.value : null,
    news_us: newsUS.status === 'fulfilled' ? newsUS.value : null,
    news_india: newsIndia.status === 'fulfilled' ? newsIndia.value : null,
    journal_question:
      journalQuestion.status === 'fulfilled' ? journalQuestion.value : null,
    dare: dare.status === 'fulfilled' ? dare.value : null,
    song: song.status === 'fulfilled' ? song.value : null,
    errors: {
      weather: weather.status === 'rejected' ? weather.reason?.message : null,
      news_us: newsUS.status === 'rejected' ? newsUS.reason?.message : null,
      news_india: newsIndia.status === 'rejected' ? newsIndia.reason?.message : null,
      journal_question:
        journalQuestion.status === 'rejected'
          ? journalQuestion.reason?.message
          : null,
      dare: dare.status === 'rejected' ? dare.reason?.message : null,
      song: song.status === 'rejected' ? song.reason?.message : null,
    },
  }
}

async function writeSnapshot(userId: string, data: Awaited<ReturnType<typeof fetchAllData>>) {
  const supabase = createServiceClient()
  const snapshotDate = new Date().toISOString().split('T')[0]

  const { error } = await supabase.from('daily_snapshots').upsert(
    {
      user_id: userId,
      snapshot_date: snapshotDate,
      weather: data.weather,
      news_us: data.news_us,
      news_india: data.news_india,
      journal_question: data.journal_question,
      dare: data.dare,
      song_of_day: data.song,
      created_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,snapshot_date' }
  )

  if (error) throw new Error(`Snapshot write failed: ${error.message}`)
}

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const { data: users, error: userError } = await supabase
    .from('user_preferences')
    .select('user_id')

  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 })
  }

  let userIds: string[] = (users ?? []).map((u: { user_id: string }) => u.user_id)
  if (userIds.length === 0 && process.env.ADMIN_USER_ID) {
    userIds = [process.env.ADMIN_USER_ID]
  }

  const results = await Promise.allSettled(
    userIds.map(async (user_id: string) => {
      const data = await fetchAllData(user_id)
      await writeSnapshot(user_id, data)
      return { user_id, errors: data.errors }
    })
  )

  const summary = results.map((r) =>
    r.status === 'fulfilled'
      ? { status: 'ok', ...r.value }
      : { status: 'error', reason: r.reason?.message }
  )

  return NextResponse.json({ ok: true, processed: summary })
}
