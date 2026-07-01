'use client'
import { useState } from 'react'
import { tokens } from '@/lib/design-tokens'

interface DareWidgetProps { dare: string }

export default function DareWidget({ dare }: DareWidgetProps) {
  const [accepted, setAccepted] = useState(false)

  const weekday = new Date().toLocaleDateString('en-GB', { weekday: 'long' })
  const isWeekend = [0, 6].includes(new Date().getDay())
  const missionType = isWeekend ? 'Weekend adventure' : 'Weekday mission'

  return (
    <div>
      {/* Section label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <span style={{
          fontSize: 9, fontWeight: 500, letterSpacing: '2.5px',
          textTransform: 'uppercase', color: tokens.colors.muted, whiteSpace: 'nowrap',
        }}>
          Daily dare
        </span>
        <hr style={{ flex: 1, height: 1, background: tokens.colors.line, border: 'none', margin: 0 }} />
      </div>

      {/* Section title */}
      <div style={{
        fontFamily: tokens.fonts.serif,
        fontSize: 22,
        color: tokens.colors.black,
        fontStyle: 'italic',
        marginBottom: 16,
        lineHeight: 1.2,
      }}>
        The <span style={{ color: tokens.colors.red }}>dare</span>
      </div>

      {/* Day label */}
      <div style={{
        fontSize: 9,
        fontWeight: 600,
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        color: tokens.colors.muted,
        marginBottom: 12,
      }}>
        {weekday} · {missionType}
      </div>

      {/* Dare text */}
      <p style={{
        fontFamily: tokens.fonts.serif,
        fontSize: 17,
        fontStyle: 'italic',
        color: tokens.colors.black,
        lineHeight: 1.65,
        marginBottom: 20,
        margin: '0 0 20px 0',
      }}>
        {dare}
      </p>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => setAccepted(true)}
          disabled={accepted}
          style={{
            fontFamily: tokens.fonts.sans,
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
            padding: '9px 20px',
            borderRadius: tokens.radius.pill,
            border: `1px solid ${accepted ? tokens.colors.sageBorder : tokens.colors.redBorder}`,
            background: accepted ? tokens.colors.sageBg : tokens.colors.redBg,
            color: accepted ? tokens.colors.sage : tokens.colors.red,
            cursor: accepted ? 'default' : 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {accepted ? '✓ Accepted' : 'Accept'}
        </button>

        <button
          style={{
            fontFamily: tokens.fonts.sans,
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
            padding: '9px 16px',
            borderRadius: tokens.radius.pill,
            border: `1px solid ${tokens.colors.line}`,
            background: tokens.colors.surface,
            color: tokens.colors.muted,
            cursor: 'pointer',
          }}
          onMouseEnter={e => {
            const b = e.currentTarget
            b.style.color = tokens.colors.mid
            b.style.borderColor = tokens.colors.mid
          }}
          onMouseLeave={e => {
            const b = e.currentTarget
            b.style.color = tokens.colors.muted
            b.style.borderColor = tokens.colors.line
          }}
        >
          Skip
        </button>
      </div>
    </div>
  )
}
