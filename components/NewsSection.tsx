'use client'
import { useState } from 'react'
import { tokens } from '@/lib/design-tokens'

export interface Article { category: string; timeAgo: string; headline: string }
interface NewsSectionProps { us: Article[]; india: Article[] }

export const US_PLACEHOLDER: Article[] = [
  { category: 'Politics', timeAgo: '2h ago', headline: 'Senate passes infrastructure amendment in narrow bipartisan vote' },
  { category: 'Economy',  timeAgo: '3h ago', headline: 'Fed signals rate hold through Q3 amid cooling inflation data' },
  { category: 'Markets',  timeAgo: '4h ago', headline: 'S&P 500 hits record close; AI and energy stocks lead gains' },
  { category: 'Science',  timeAgo: '5h ago', headline: 'NASA confirms Artemis IV crew for 2027 lunar mission' },
  { category: 'World',    timeAgo: '6h ago', headline: 'US and EU reach preliminary trade framework on EVs' },
]

export const INDIA_PLACEHOLDER: Article[] = [
  { category: 'Politics', timeAgo: '1h ago', headline: 'Monsoon session of Parliament opens in New Delhi today' },
  { category: 'Economy',  timeAgo: '3h ago', headline: 'RBI holds rates; GDP forecast upgraded to 7.2% for FY27' },
  { category: 'Tech',     timeAgo: '4h ago', headline: 'Reliance acquires strategic stake in AI startup Sarvam' },
  { category: 'Sport',    timeAgo: '5h ago', headline: 'India retain Test rankings after Birmingham draw' },
  { category: 'World',    timeAgo: '7h ago', headline: 'PM Modi meets Gulf leaders on two-day state visit' },
]

function NewsItem({ article, last }: { article: Article; last: boolean }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      style={{
        padding: '11px 0',
        borderBottom: last ? 'none' : `1px solid ${tokens.colors.line}`,
        cursor: 'pointer',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        fontSize: 9,
        fontWeight: 600,
        letterSpacing: '1px',
        textTransform: 'uppercase',
        color: tokens.colors.muted,
        marginBottom: 3,
      }}>
        {article.category} · {article.timeAgo}
      </div>
      <div style={{
        fontSize: 13,
        color: hovered ? tokens.colors.black : tokens.colors.mid,
        lineHeight: 1.5,
        transition: 'color 0.15s',
      }}>
        {article.headline}
      </div>
    </div>
  )
}

export default function NewsSection({ us, india }: NewsSectionProps) {
  const [tab, setTab] = useState<'us' | 'india'>('us')
  const articles = tab === 'us' ? us : india

  return (
    <div>
      {/* Section label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <span style={{
          fontSize: 9, fontWeight: 500, letterSpacing: '2.5px',
          textTransform: 'uppercase', color: tokens.colors.muted, whiteSpace: 'nowrap',
        }}>
          News
        </span>
        <hr style={{ flex: 1, height: 1, background: tokens.colors.line, border: 'none', margin: 0 }} />
      </div>

      {/* Section title */}
      <div style={{
        fontFamily: tokens.fonts.serif,
        fontSize: 22,
        fontStyle: 'italic',
        marginBottom: 14,
        lineHeight: 1.2,
      }}>
        <span style={{ color: tokens.colors.red }}>News</span>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {(['us', 'india'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              fontFamily: tokens.fonts.sans,
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              padding: '6px 14px',
              borderRadius: tokens.radius.pill,
              border: `1px solid ${tab === t ? tokens.colors.sage : tokens.colors.line}`,
              background: tokens.colors.surface,
              color: tab === t ? tokens.colors.black : tokens.colors.muted,
              cursor: 'pointer',
              transition: 'border-color 0.15s, color 0.15s',
            }}
          >
            {t === 'us' ? 'US' : 'India'}
          </button>
        ))}
      </div>

      {/* Articles */}
      {articles.map((a, i) => (
        <NewsItem key={i} article={a} last={i === articles.length - 1} />
      ))}
    </div>
  )
}
