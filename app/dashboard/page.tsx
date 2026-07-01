import { getSnapshot } from '@/lib/getSnapshot'
import DashboardClient from '@/components/DashboardClient'
import { US_PLACEHOLDER, INDIA_PLACEHOLDER } from '@/components/NewsSection'
import type { Article } from '@/components/NewsSection'

function weatherCodeToDesc(code: number): string {
  if (code === 0) return 'Clear sky'
  if (code <= 2) return 'Partly cloudy'
  if (code === 3) return 'Overcast'
  if (code <= 48) return 'Foggy'
  if (code <= 57) return 'Drizzle'
  if (code <= 67) return 'Rain'
  if (code <= 77) return 'Snow'
  if (code <= 82) return 'Rain showers'
  if (code <= 86) return 'Snow showers'
  return 'Thunderstorm'
}

function mapArticles(articles: {
  source?: { name?: string }
  title?: string
}[]): Article[] {
  return articles
    .filter(a => a.title && a.title !== '[Removed]')
    .map(a => ({
      category: a.source?.name || 'News',
      timeAgo: '—',
      headline: a.title!,
    }))
}

export default async function DashboardPage() {
  const snapshot = await getSnapshot()

  const weatherProps = snapshot?.weather ? {
    temp: Math.round(snapshot.weather.current.temperature_2m) + '°C',
    description: weatherCodeToDesc(snapshot.weather.current.weathercode),
    rain: snapshot.weather.current.precipitation_probability + '% rain',
    windspeed: snapshot.weather.current.windspeed_10m,
    high: Math.round(snapshot.weather.daily.temperature_2m_max[0]),
    low: Math.round(snapshot.weather.daily.temperature_2m_min[0]),
  } : undefined

  const newsUS = snapshot?.news_us?.articles?.length
    ? mapArticles(snapshot.news_us.articles)
    : US_PLACEHOLDER

  const newsIndia = snapshot?.news_india?.articles?.length
    ? mapArticles(snapshot.news_india.articles)
    : INDIA_PLACEHOLDER

  const journalQuestion = snapshot?.journal_question
    ?? "What's one thing unresolved from yesterday — and what would it look like to close it today?"

  const dare = snapshot?.dare
    ?? "Walk up to a stranger today and give them a genuine, specific compliment. Not 'nice shoes' — something real you actually noticed. See what happens."

  const song = snapshot?.song_of_day ?? {
    title: 'Teardrop', artist: 'Massive Attack', album: 'Mezzanine', year: 1998,
  }

  return (
    <DashboardClient
      hasSnapshot={!!snapshot}
      weatherProps={weatherProps}
      newsUS={newsUS}
      newsIndia={newsIndia}
      journalQuestion={journalQuestion}
      dare={dare}
      song={song}
    />
  )
}
