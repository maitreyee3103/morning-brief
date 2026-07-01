'use client'
import { tokens } from '@/lib/design-tokens'

interface SongBarProps {
  title: string
  artist: string
  album: string
  year: number
  spotifyUrl?: string
}

const DELAYS = ['0s', '0.11s', '0.22s', '0.07s', '0.17s']

export default function SongBar({ title, artist, album, year, spotifyUrl }: SongBarProps) {
  const weekday = new Date().toLocaleDateString('en-GB', { weekday: 'long' })

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      padding: '14px 32px',
      background: tokens.colors.surface,
      borderTop: `1px solid ${tokens.colors.line}`,
    }}>
      <style>{`
        @keyframes sv { from { height: 3px } to { height: 14px } }
        .play-btn:hover { background: ${tokens.colors.black} !important; color: ${tokens.colors.bg} !important; }
      `}</style>

      {/* Animated wave */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2.5, height: 18, flexShrink: 0 }}>
        {DELAYS.map((delay, i) => (
          <div
            key={i}
            style={{
              width: 2,
              borderRadius: tokens.radius.pill,
              background: tokens.colors.red,
              animation: `sv 0.9s ease-in-out ${delay} infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* Text */}
      <div>
        <div style={{
          fontSize: 9,
          fontWeight: 600,
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          color: tokens.colors.red,
          marginBottom: 3,
        }}>
          Song of the day
        </div>
        <div style={{
          fontFamily: tokens.fonts.serif,
          fontSize: 15,
          color: tokens.colors.black,
        }}>
          {title} — {artist}
        </div>
        <div style={{ fontSize: 10, color: tokens.colors.muted, marginTop: 2 }}>
          {album} · {year} · Curated for your {weekday}
        </div>
      </div>

      {/* Play button */}
      <button
        className="play-btn"
        onClick={() => spotifyUrl && window.open(spotifyUrl, '_blank')}
        style={{
          marginLeft: 'auto',
          fontFamily: tokens.fonts.sans,
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.8px',
          textTransform: 'uppercase',
          padding: '8px 18px',
          borderRadius: tokens.radius.pill,
          border: `1.5px solid ${tokens.colors.black}`,
          color: tokens.colors.black,
          background: 'none',
          cursor: 'pointer',
          transition: 'background 0.15s, color 0.15s',
          flexShrink: 0,
        }}
      >
        ▶ Play on Spotify
      </button>
    </div>
  )
}
