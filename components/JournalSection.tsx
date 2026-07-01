'use client'
import { useState } from 'react'
import { tokens } from '@/lib/design-tokens'

interface JournalSectionProps { question: string }

export default function JournalSection({ question }: JournalSectionProps) {
  const [focused, setFocused] = useState(false)
  const [answer, setAnswer] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveLabel, setSaveLabel] = useState('Save entry →')

  const isError = saveLabel.startsWith('Error')

  const handleSave = async () => {
    if (!answer.trim()) return
    setSaving(true)
    try {
      const res = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, answer }),
      })
      setSaveLabel(res.ok ? 'Saved ✓' : 'Error — try again')
    } catch {
      setSaveLabel('Error — try again')
    } finally {
      setSaving(false)
      setTimeout(() => setSaveLabel('Save entry →'), 2000)
    }
  }

  // Highlight last occurrence of "today" in red
  const todayIdx = question.lastIndexOf('today')
  const before = todayIdx >= 0 ? question.slice(0, todayIdx) : question
  const after  = todayIdx >= 0 ? question.slice(todayIdx + 5) : ''
  const hasToday = todayIdx >= 0

  return (
    <div className="dashboard-section" style={{
      padding: '28px 32px',
      background: tokens.colors.bg,
      borderTop: `1px solid ${tokens.colors.line}`,
    }}>
      <style>{`
        .journal-textarea { outline: none; }
        .save-btn:hover:not(:disabled) { border-color: ${tokens.colors.red} !important; color: ${tokens.colors.red} !important; }
      `}</style>

      {/* Section label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <span style={{
          fontSize: 9, fontWeight: 500, letterSpacing: '2.5px',
          textTransform: 'uppercase', color: tokens.colors.muted, whiteSpace: 'nowrap',
        }}>
          Field journal
        </span>
        <hr style={{ flex: 1, height: 1, background: tokens.colors.line, border: 'none', margin: 0 }} />
      </div>

      {/* Inner two-column grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 32, alignItems: 'start' }}>

        {/* Left — question */}
        <div style={{ maxWidth: 380 }}>
          <p style={{
            fontFamily: tokens.fonts.serif, fontSize: 20,
            fontStyle: 'italic', color: tokens.colors.black,
            lineHeight: 1.5, margin: 0,
          }}>
            {hasToday ? (
              <>
                {before}
                <span style={{ color: tokens.colors.red, fontStyle: 'normal' }}>today</span>
                {after}
              </>
            ) : question}
          </p>
        </div>

        {/* Right — textarea + save */}
        <div>
          <textarea
            className="journal-textarea"
            placeholder="This is just for you..."
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              width: '100%',
              background: tokens.colors.surface,
              border: `1px solid ${focused ? tokens.colors.sage : tokens.colors.line}`,
              borderRadius: tokens.radius.card,
              color: tokens.colors.black,
              fontFamily: tokens.fonts.sans,
              fontSize: 13,
              padding: '12px 14px',
              resize: 'none',
              height: focused ? 96 : 56,
              lineHeight: 1.6,
              transition: 'border-color 0.2s, height 0.25s',
              boxSizing: 'border-box',
            }}
          />
          <button
            className="save-btn"
            onClick={handleSave}
            disabled={saving || !answer.trim()}
            style={{
              marginTop: 10,
              fontFamily: tokens.fonts.sans,
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              color: isError ? tokens.colors.red : tokens.colors.sage,
              background: tokens.colors.surface,
              border: `1px solid ${isError ? tokens.colors.redBorder : tokens.colors.line}`,
              padding: '8px 16px',
              borderRadius: tokens.radius.pill,
              cursor: saving || !answer.trim() ? 'default' : 'pointer',
              opacity: !answer.trim() ? 0.5 : 1,
              transition: 'border-color 0.15s, color 0.15s',
            }}
          >
            {saving ? 'Saving...' : saveLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
