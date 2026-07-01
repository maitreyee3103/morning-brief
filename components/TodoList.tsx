'use client'
import { useState } from 'react'
import { tokens } from '@/lib/design-tokens'

interface Todo {
  id: number
  label: string
  tag: string
  tagType: 'urgent' | 'today' | 'done' | 'plain'
}

const PLACEHOLDER_TODOS: Todo[] = [
  { id: 1, label: 'Reply to Sarah — Q3 deck feedback',       tag: 'Urgent',    tagType: 'urgent' },
  { id: 2, label: 'Prep talking points for 2pm client call', tag: 'Today',     tagType: 'today'  },
  { id: 3, label: 'Complete design spec — Sprint 14',        tag: 'Due today', tagType: 'today'  },
  { id: 4, label: 'Book Edinburgh flights — August',         tag: 'Done',      tagType: 'done'   },
  { id: 5, label: 'Pay Figma invoice',                       tag: 'Finance',   tagType: 'plain'  },
]

const tagStyles: Record<Todo['tagType'], React.CSSProperties> = {
  urgent: { color: tokens.colors.red,  background: tokens.colors.redBg,  border: `1px solid ${tokens.colors.redBorder}` },
  today:  { color: tokens.colors.red,  background: tokens.colors.redBg,  border: `1px solid ${tokens.colors.redBorder}` },
  done:   { color: tokens.colors.sage, background: tokens.colors.sageBg, border: `1px solid ${tokens.colors.sageBorder}` },
  plain:  { color: tokens.colors.muted, background: tokens.colors.surface, border: `1px solid ${tokens.colors.line}` },
}

export default function TodoList() {
  const [checked, setChecked] = useState<Record<number, boolean>>({ 4: true })

  function toggle(id: number) {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div>
      {/* Section label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <span style={{
          fontSize: 9, fontWeight: 500, letterSpacing: '2.5px',
          textTransform: 'uppercase', color: tokens.colors.muted, whiteSpace: 'nowrap',
        }}>
          To-do
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
        Today&apos;s <span style={{ color: tokens.colors.red }}>list</span>
      </div>

      {PLACEHOLDER_TODOS.map((todo, i) => {
        const done = !!checked[todo.id]
        return (
          <div
            key={todo.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 13,
              padding: '11px 0',
              borderBottom: i < PLACEHOLDER_TODOS.length - 1
                ? `1px solid ${tokens.colors.line}`
                : 'none',
            }}
          >
            {/* Checkbox */}
            <div
              onClick={() => toggle(todo.id)}
              style={{
                width: 15,
                height: 15,
                borderRadius: tokens.radius.check,
                border: `1.5px solid ${done ? tokens.colors.red : tokens.colors.line}`,
                flexShrink: 0,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'border-color 0.15s',
              }}
            >
              {done && (
                <svg width="9" height="9" viewBox="0 0 9 9">
                  <polyline
                    points="1,4.5 3.5,7.5 8,1.5"
                    stroke={tokens.colors.red}
                    strokeWidth="1.8"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </div>

            {/* Label */}
            <span style={{
              fontSize: 13,
              color: done ? tokens.colors.muted : tokens.colors.black,
              textDecoration: done ? 'line-through' : 'none',
              flex: 1,
              transition: 'color 0.15s',
            }}>
              {todo.label}
            </span>

            {/* Tag */}
            <span style={{
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              padding: '3px 10px',
              borderRadius: tokens.radius.pill,
              whiteSpace: 'nowrap',
              ...tagStyles[todo.tagType],
            }}>
              {todo.tag}
            </span>
          </div>
        )
      })}
    </div>
  )
}
