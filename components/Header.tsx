'use client'
import { useEffect, useState } from 'react'
import { tokens } from '@/lib/design-tokens'

const pad = (n: number) => String(n).padStart(2, '0')

function descToEmoji(desc: string): string {
  if (desc.includes('Clear')) return '☀️'
  if (desc.includes('Partly')) return '🌤️'
  if (desc.includes('Overcast')) return '⛅'
  if (desc.includes('Fog')) return '🌫️'
  if (desc.includes('Drizzle')) return '🌦️'
  if (desc.includes('Rain')) return '🌧️'
  if (desc.includes('Snow')) return '❄️'
  if (desc.includes('Thunder')) return '⛈️'
  return '⛅'
}

interface HeaderProps {
  temp?: string
  description?: string
  rain?: string
  windspeed?: number
  high?: number
  low?: number
  location?: string
}

export default function Header({
  temp,
  description,
  rain,
  windspeed,
  high,
  low,
  location = 'London, UK',
}: HeaderProps) {
  const [time, setTime] = useState(new Date())
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  function toggleTheme() {
    const next = !dark
    setDark(next)
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light')
  }

  const h = pad(time.getHours())
  const m = pad(time.getMinutes())
  const s = pad(time.getSeconds())
  const dateStr = time.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  const displayDesc = description ?? 'Partly cloudy'
  const weather = {
    emoji: descToEmoji(displayDesc),
    temp: temp ?? '19°C',
    description: displayDesc,
    rain: rain ?? '40% rain',
    high: high ?? 23,
    low: low ?? 14,
    wind: windspeed != null ? `${windspeed} km/h` : '12 km/h W',
  }

  return (
    <header className="dashboard-header" style={{
      width: '100%',
      background: tokens.colors.surface,
      borderBottom: `1px solid ${tokens.colors.line}`,
      padding: '18px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontFamily: tokens.fonts.sans,
    }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .pulse-dot { animation: pulse 2s ease-in-out infinite; }
        .theme-btn:hover { border-color: ${tokens.colors.red} !important; color: ${tokens.colors.red} !important; }
      `}</style>

      {/* LEFT — clock + date */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="pulse-dot" style={{
            width: 7, height: 7, borderRadius: '50%',
            background: tokens.colors.red, flexShrink: 0,
          }} />
          <span style={{
            fontSize: 10, fontWeight: 500, letterSpacing: '2px',
            textTransform: 'uppercase', color: tokens.colors.muted,
          }}>
            Morning Brief
          </span>
        </div>
        <div style={{
          fontFamily: tokens.fonts.serif, fontSize: 'clamp(32px, 8vw, 48px)',
          color: tokens.colors.black, lineHeight: 1, letterSpacing: '-1px',
        }}>
          {h}:{m}:<span style={{ color: tokens.colors.red }}>{s}</span>
        </div>
        <div style={{ fontSize: 11, color: tokens.colors.mid, letterSpacing: '0.3px' }}>
          {dateStr}&nbsp;&nbsp;·&nbsp;&nbsp;{location}
        </div>
      </div>

      {/* CENTRE — weather */}
      <div className="header-weather" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 28 }}>{weather.emoji}</span>
          <span style={{
            fontFamily: tokens.fonts.serif, fontSize: 34,
            color: tokens.colors.black, lineHeight: 1,
          }}>
            {weather.temp}
          </span>
        </div>
        <div style={{ fontSize: 11, color: tokens.colors.mid }}>
          {weather.description}&nbsp;·&nbsp;
          <span style={{ color: tokens.colors.sage }}>{weather.rain}</span>
        </div>
        <div style={{ fontSize: 10, color: tokens.colors.muted }}>
          ↑ {weather.high}°&nbsp;&nbsp;↓ {weather.low}°&nbsp;&nbsp;Wind {weather.wind}
        </div>
      </div>

      {/* RIGHT — theme toggle */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button className="theme-btn" onClick={toggleTheme} style={{
          background: tokens.colors.surface,
          border: `1px solid ${tokens.colors.line}`,
          borderRadius: tokens.radius.pill,
          padding: '7px 16px', fontSize: 10,
          color: tokens.colors.mid, cursor: 'pointer',
          fontFamily: tokens.fonts.sans,
          transition: 'border-color 0.15s, color 0.15s',
        }}>
          {dark ? '☀ Light mode' : '☽ Dark mode'}
        </button>
      </div>
    </header>
  )
}
