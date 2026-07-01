'use client'
import { useState } from 'react'
import LoadScreen from '@/components/LoadScreen'
import Header from '@/components/Header'
import TopActions from '@/components/TopActions'
import NewsSection from '@/components/NewsSection'
import JournalSection from '@/components/JournalSection'
import TodoList from '@/components/TodoList'
import DareWidget from '@/components/DareWidget'
import SongBar from '@/components/SongBar'
import { tokens } from '@/lib/design-tokens'
import type { Article } from '@/components/NewsSection'

interface WeatherProps {
  temp: string
  description: string
  rain: string
  windspeed: number
  high: number
  low: number
}

interface SongData {
  title: string
  artist: string
  album: string
  year: number
}

interface DashboardClientProps {
  hasSnapshot: boolean
  weatherProps?: WeatherProps
  newsUS: Article[]
  newsIndia: Article[]
  journalQuestion: string
  dare: string
  song: SongData
}

export default function DashboardClient({
  hasSnapshot,
  weatherProps,
  newsUS,
  newsIndia,
  journalQuestion,
  dare,
  song,
}: DashboardClientProps) {
  const [loading, setLoading] = useState(true)

  return (
    <>
      {loading && <LoadScreen onComplete={() => setLoading(false)} />}
      {!loading && (
        <>
          <Header {...weatherProps} />

          {!hasSnapshot ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '60vh',
            }}>
              <p style={{
                fontFamily: tokens.fonts.serif,
                fontSize: 22,
                fontStyle: 'italic',
                color: tokens.colors.mid,
                textAlign: 'center',
              }}>
                Your morning brief will be ready at 7am.
              </p>
            </div>
          ) : (
            <>
              {/* Top row — Actions + News */}
              <div className="dashboard-grid" style={{
                display: 'grid',
                gridTemplateColumns: '1.1fr 0.9fr',
                gap: 0,
                background: tokens.colors.line,
                margin: '1px',
              }}>
                <div className="dashboard-section" style={{ background: tokens.colors.bg, padding: '24px 32px' }}>
                  <TopActions />
                </div>
                <div className="dashboard-section" style={{ background: tokens.colors.bg, padding: '24px 32px' }}>
                  <NewsSection us={newsUS} india={newsIndia} />
                </div>
              </div>

              {/* Journal — full width */}
              <JournalSection question={journalQuestion} />

              {/* Bottom row — Todos + Dare */}
              <div className="dashboard-grid" style={{
                display: 'grid',
                gridTemplateColumns: '1.1fr 0.9fr',
                gap: 0,
                background: tokens.colors.line,
                margin: '1px 1px 0',
              }}>
                <div className="dashboard-section" style={{ background: tokens.colors.bg, padding: '24px 32px' }}>
                  <TodoList />
                </div>
                <div className="dashboard-section" style={{ background: tokens.colors.bg, padding: '24px 32px' }}>
                  <DareWidget dare={dare} />
                </div>
              </div>

              {/* Song bar — full width */}
              <SongBar {...song} />
            </>
          )}
        </>
      )}
    </>
  )
}
