'use client'
import { useEffect, useState } from 'react'

const BARS = [
  { label: 'Weather',  delay: 2500, dur: 500  },
  { label: 'Actions',  delay: 2620, dur: 640  },
  { label: 'News',     delay: 2550, dur: 420  },
  { label: 'Journal',  delay: 2700, dur: 380  },
]

export default function LoadScreen({ onComplete }: { onComplete: () => void }) {
  const [bars, setBars] = useState(BARS.map(() => ({ width: 0, done: false })))
  const [shouldShow, setShouldShow] = useState(true)
  const [visible, setVisible] = useState(true)

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  useEffect(() => {
    const todayStr = new Date().toDateString()
    const lastShown = sessionStorage.getItem('loadScreenShown')
    if (lastShown === todayStr) {
      setShouldShow(false)
      onComplete()
      return
    }
    sessionStorage.setItem('loadScreenShown', todayStr)

    BARS.forEach((b, i) => {
      setTimeout(() => {
        setBars(prev => prev.map((bar, idx) => idx === i ? { ...bar, width: 100 } : bar))
        setTimeout(() => {
          setBars(prev => prev.map((bar, idx) => idx === i ? { ...bar, done: true } : bar))
        }, b.dur)
      }, b.delay)
    })
    setTimeout(() => {
      setVisible(false)
      onComplete()
    }, 3800)
  }, [onComplete])

  if (!shouldShow || !visible) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#F4EFE4',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Sans', sans-serif", zIndex: 50,
      padding: '0 24px',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Serif+Display:ital@0;1&display=swap');
        @keyframes up { from { opacity:0; transform:translateY(7px) } to { opacity:1; transform:translateY(0) } }
        @keyframes wordrise { from { opacity:0; transform:translateY(30px) } to { opacity:1; transform:translateY(0) } }
        @keyframes lineout { from { width:0 } to { width:100% } }
        .ls-greet { animation: up 0.5s ease 0.2s both }
        .ls-morning { animation: wordrise 0.65s cubic-bezier(0.22,1,0.36,1) 0.7s both }
        .ls-brief { animation: wordrise 0.65s cubic-bezier(0.22,1,0.36,1) 1.0s both }
        .ls-line { animation: lineout 0.55s cubic-bezier(0.4,0,0.2,1) 1.65s both }
        .ls-date { animation: up 0.45s ease 2.1s both }
        .ls-bars { animation: up 0.4s ease 2.4s both }
      `}</style>

      <p className="ls-greet" style={{ fontSize:11, fontWeight:500, letterSpacing:'2.5px', textTransform:'uppercase', color:'#B0A898' }}>
        Good morning —
      </p>

      <div style={{ display:'flex', alignItems:'baseline', gap:14, marginTop:10, overflow:'hidden' }}>
        <span className="ls-morning" style={{ fontFamily:"'DM Serif Display', serif", fontSize:'clamp(36px, 10vw, 64px)', color:'#18120C', fontStyle:'italic', letterSpacing:'-1.5px', lineHeight:1 }}>
          Morning
        </span>
        <span className="ls-brief" style={{ fontFamily:"'DM Serif Display', serif", fontSize:'clamp(36px, 10vw, 64px)', color:'#D13820', letterSpacing:'-1.5px', lineHeight:1 }}>
          Brief.
        </span>
      </div>

      <div className="ls-line" style={{ height:1.5, background:'#D13820', marginTop:10, borderRadius:99 }} />

      <p className="ls-date" style={{ fontSize:11, color:'#7A6E62', marginTop:10, letterSpacing:'0.5px' }}>
        {today}
      </p>

      <div className="ls-bars" style={{ marginTop:40, display:'flex', flexDirection:'column', gap:10, minWidth:'min(240px, 80vw)' }}>
        {BARS.map((b, i) => (
          <div key={b.label} style={{ display:'flex', alignItems:'center', gap:14 }}>
            <span style={{ fontSize:10, fontWeight:400, letterSpacing:'1px', textTransform:'uppercase', color:'#B0A898', flex:1 }}>
              {b.label}
            </span>
            <div style={{ width:90, height:1.5, background:'#E8DFD0', borderRadius:99, overflow:'hidden', flexShrink:0 }}>
              <div style={{
                height:'100%', background:'#D13820', borderRadius:99,
                width: bars[i].width + '%',
                transition: `width ${b.dur}ms cubic-bezier(0.4,0,0.2,1)`
              }} />
            </div>
            <span style={{ fontSize:10, color: bars[i].done ? '#D13820' : '#B0A898', minWidth:14, textAlign:'right' }}>
              {bars[i].done ? '✓' : '—'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
