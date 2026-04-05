import { useState } from 'react'

const STATE_CONFIG = {
  null:  { bg: '#1c1917', border: '#3a3733', content: null },
  tick:  { bg: '#052e16', border: '#166534', content: '✓', color: '#4ade80' },
  cross: { bg: '#1f0a0a', border: '#7f1d1d', content: '✗', color: '#f87171' },
  q:     { bg: '#1c1200', border: '#92400e', content: '?', color: '#fbbf24' },
  d1:    { bg: '#1a1a2e', border: '#3730a3', content: '●', color: '#818cf8' },
  d2:    { bg: '#1a1a2e', border: '#3730a3', content: '●●', color: '#818cf8' },
  d3:    { bg: '#1a1a2e', border: '#3730a3', content: '●●●', color: '#818cf8' },
}

const NOTE_SUB_CONFIG = {
  0: { bg: '#151515', color: '#44403c', content: '·' },
  1: { bg: '#1c1200', color: '#fbbf24', content: '?' },
  2: { bg: '#052e16', color: '#4ade80', content: '●' },
}

export function NormalCell({ state, onClick }) {
  const [hovered, setHovered] = useState(false)
  const cfg = STATE_CONFIG[state] ?? STATE_CONFIG[null]

  const style = {
    width: '54px',
    height: '54px',
    background: cfg.bg,
    border: `1px solid ${cfg.border}`,
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: cfg.color ?? '#44403c',
    fontSize: state === 'd2' || state === 'd3' ? '9px' : '16px',
    fontWeight: 'bold',
    fontFamily: 'Georgia, serif',
    letterSpacing: state === 'd2' || state === 'd3' ? '1px' : 'normal',
    transform: hovered ? 'scale(1.06)' : 'scale(1)',
    transition: 'transform 0.12s, background 0.15s',
    userSelect: 'none',
    flexShrink: 0,
  }

  return (
    <div
      style={style}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setHovered(false)}
    >
      {cfg.content}
    </div>
  )
}

export function NoteCell({ noteArr, onClickSub }) {
  const [hoveredSub, setHoveredSub] = useState(null)

  const outerStyle = {
    width: '54px',
    height: '54px',
    background: '#151515',
    border: '1px solid #2a2a3e',
    borderRadius: '8px',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridTemplateRows: 'repeat(3, 1fr)',
    gap: '1px',
    padding: '2px',
    flexShrink: 0,
    overflow: 'hidden',
  }

  return (
    <div style={outerStyle}>
      {(noteArr ?? [0,0,0,0,0,0,0,0,0]).map((val, i) => {
        const cfg = NOTE_SUB_CONFIG[val] ?? NOTE_SUB_CONFIG[0]
        const isHov = hoveredSub === i
        return (
          <div
            key={i}
            onClick={() => onClickSub(i)}
            onMouseEnter={() => setHoveredSub(i)}
            onMouseLeave={() => setHoveredSub(null)}
            style={{
              background: isHov ? (val === 0 ? '#2a2a2a' : cfg.bg) : cfg.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '2px',
              cursor: 'pointer',
              color: cfg.color,
              fontSize: '8px',
              fontWeight: 'bold',
              userSelect: 'none',
              transition: 'background 0.1s',
              transform: isHov ? 'scale(1.1)' : 'scale(1)',
            }}
          >
            {cfg.content}
          </div>
        )
      })}
    </div>
  )
}
