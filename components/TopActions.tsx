'use client'
import { tokens } from '@/lib/design-tokens'

interface Action {
  num: string
  source: 'Gmail' | 'Slack' | 'Notion'
  title: string
  sub: string
  urgent?: boolean
}

interface TopActionsProps {
  actions?: Array<{
    source: string
    title: string
    sub: string
    urgent?: boolean
  }>
}

const NUMERALS = ['i.', 'ii.', 'iii.', 'iv.', 'v.']

const PLACEHOLDER_ACTIONS: Action[] = [
  { num: 'i.',   source: 'Gmail',  title: 'Sarah needs sign-off on Q3 deck before 10am', sub: 'Arrived 11:47pm · Unanswered overnight', urgent: true },
  { num: 'ii.',  source: 'Slack',  title: '3 mentions in #product — launch decision still open', sub: 'Last message 2:14am · Team waiting' },
  { num: 'iii.', source: 'Notion', title: 'Design spec assigned — Sprint 14, due today', sub: 'Unstarted · Blocks two other tasks' },
  { num: 'iv.',  source: 'Gmail',  title: 'Figma invoice — payment due today', sub: 'Arrived 1:03am · Auto-pay not enabled' },
  { num: 'v.',   source: 'Slack',  title: 'Jake flagged a blocker on API integration', sub: '3:52am · Needs a call or decision today' },
]

const sourceColor: Record<string, string> = {
  Gmail: tokens.colors.red,
  Slack: tokens.colors.muted,
  Notion: tokens.colors.muted,
}

export default function TopActions({ actions }: TopActionsProps) {
  const displayActions: Action[] = actions
    ? actions.slice(0, 5).map((a, i) => ({
        num: NUMERALS[i],
        source: (a.source as Action['source']) || 'Notion',
        title: a.title,
        sub: a.sub,
        urgent: a.urgent,
      }))
    : PLACEHOLDER_ACTIONS

  return (
    <div>
      {/* Section label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <span style={{
          fontSize: 9, fontWeight: 500, letterSpacing: '2.5px',
          textTransform: 'uppercase', color: tokens.colors.muted, whiteSpace: 'nowrap',
        }}>
          Top actions
        </span>
        <hr style={{ flex: 1, height: 1, background: tokens.colors.line, border: 'none', margin: 0 }} />
      </div>

      {/* Section title */}
      <div style={{
        fontFamily: tokens.fonts.serif, fontSize: 22,
        color: tokens.colors.black, fontStyle: 'italic',
        marginBottom: 16, lineHeight: 1.2,
      }}>
        Top <span style={{ color: tokens.colors.red }}>actions</span>
      </div>

      {displayActions.map((action, i) => (
        <div key={i} style={{
          display: 'flex', gap: 14, padding: '13px 0',
          borderBottom: i < displayActions.length - 1
            ? `1px solid ${tokens.colors.line}` : 'none',
        }}>
          <span style={{
            fontFamily: tokens.fonts.serif, fontSize: 13,
            color: tokens.colors.muted, fontStyle: 'italic',
            minWidth: 20, paddingTop: 1, flexShrink: 0,
          }}>
            {action.num}
          </span>

          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 9, fontWeight: 600, letterSpacing: '1px',
              textTransform: 'uppercase',
              color: sourceColor[action.source] ?? tokens.colors.muted,
              marginBottom: 4,
            }}>
              {action.source}
            </div>
            <div style={{ fontSize: 13, color: tokens.colors.black, lineHeight: 1.5 }}>
              {action.title}
            </div>
            <div style={{ fontSize: 10, color: tokens.colors.muted, marginTop: 3 }}>
              {action.sub}
            </div>
            {action.urgent && (
              <span style={{
                display: 'inline-block', marginTop: 6,
                fontSize: 9, fontWeight: 600, letterSpacing: '0.8px',
                textTransform: 'uppercase', color: tokens.colors.red,
                background: tokens.colors.redBg,
                border: `1px solid ${tokens.colors.redBorder}`,
                padding: '2px 9px', borderRadius: tokens.radius.pill,
              }}>
                Reply needed
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
