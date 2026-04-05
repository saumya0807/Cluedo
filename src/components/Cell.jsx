import { useState } from 'react'

function getStateConfig(state, lightMode) {
  if (lightMode) {
    const lm = {
      null:  { bg: '#e8e5e3', border: '#c4c0bb', content: null,   color: '#a8a29e' },
      tick:  { bg: '#dcfce7', border: '#16a34a', content: '✓',    color: '#15803d' },
      cross: { bg: '#fee2e2', border: '#dc2626', content: '✗',    color: '#b91c1c' },
      q:     { bg: '#fef3c7', border: '#d97706', content: '?',    color: '#92400e' },
      d1:    { bg: '#ede9fe', border: '#7c3aed', content: '●',    color: '#5b21b6' },
      d2:    { bg: '#ede9fe', border: '#7c3aed', content: '●●',   color: '#5b21b6' },
      d3:    { bg: '#ede9fe', border: '#7c3aed', content: '●●●',  color: '#5b21b6' },
    }
    return lm[state] ?? lm[null]
  }
  const dm = {
    null:  { bg: '#1c1917', border: '#3a3733', content: null,   color: '#44403c' },
    tick:  { bg: '#052e16', border: '#166534', content: '✓',    color: '#4ade80' },
    cross: { bg: '#1f0a0a', border: '#7f1d1d', content: '✗',    color: '#f87171' },
    q:     { bg: '#1c1200', border: '#92400e', content: '?',    color: '#fbbf24' },
    d1:    { bg: '#1a1a2e', border: '#3730a3', content: '●',    color: '#818cf8' },
    d2:    { bg: '#1a1a2e', border: '#3730a3', content: '●●',   color: '#818cf8' },
    d3:    { bg: '#1a1a2e', border: '#3730a3', content: '●●●',  color: '#818cf8' },
  }
  return dm[state] ?? dm[null]
}

function getNoteSubConfig(val, lightMode) {
  if (lightMode) {
    const lm = {
      0: { bg: '#e0dede', color: '#a8a29e', content: '·' },
      1: { bg: '#fef3c7', color: '#d97706', content: '●' },
      2: { bg: '#dcfce7', color: '#15803d', content: '●' },
    }
    return lm[val] ?? lm[0]
  }
  const dm = {
    0: { bg: '#151515', color: '#44403c', content: '·' },
    1: { bg: '#1c1200', color: '#fbbf24', content: '●' },
    2: { bg: '#052e16', color: '#4ade80', content: '●' },
  }
  return dm[val] ?? dm[0]
}

const STATE_LABELS = {
  null:  'empty',
  tick:  'confirmed',
  cross: 'eliminated',
  q:     'suspect',
  d1:    'seen once',
  d2:    'seen twice',
  d3:    'seen 3 times',
}

function NoteGhost({ noteArr, lightMode }) {
  const arr = noteArr ?? [0, 0, 0, 0, 0, 0, 0, 0, 0]
  if (!arr.some(v => v !== 0)) return null
  return (
    <div style={{
      position: 'absolute', inset: '3px',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridTemplateRows: 'repeat(3, 1fr)',
      gap: '1px', opacity: 0.25, pointerEvents: 'none',
    }} aria-hidden="true">
      {arr.map((val, i) => {
        const cfg = getNoteSubConfig(val, lightMode)
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: cfg.color, fontSize: '7px', fontWeight: 'bold' }}>
            {val !== 0 ? cfg.content : ''}
          </div>
        )
      })}
    </div>
  )
}

function StateGhost({ state, lightMode }) {
  if (!state) return null
  const cfg = getStateConfig(state, lightMode)
  if (!cfg?.content) return null
  return (
    <div aria-hidden="true" style={{
      position: 'absolute', inset: 0, zIndex: 2,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      pointerEvents: 'none', opacity: 0.28, color: cfg.color,
      fontSize: state === 'd2' || state === 'd3' ? '11px' : '22px',
      fontWeight: 'bold',
      letterSpacing: state === 'd2' || state === 'd3' ? '1px' : 'normal',
    }}>
      {cfg.content}
    </div>
  )
}

export function NormalCell({ state, noteArr, onClick, lightMode, ariaLabel }) {
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const cfg = getStateConfig(state, lightMode)
  const focusRing = lightMode ? '#1c1917' : '#e7e5e4'

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setHovered(false)}
      aria-label={`${ariaLabel ?? 'cell'}: ${STATE_LABELS[state] ?? 'empty'}`}
      style={{
        position: 'relative',
        width: '54px', height: '54px',
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        borderRadius: '8px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        color: cfg.color,
        fontSize: state === 'd2' || state === 'd3' ? '9px' : '16px',
        fontWeight: 'bold',
        fontFamily: 'Georgia, serif',
        letterSpacing: state === 'd2' || state === 'd3' ? '1px' : 'normal',
        transform: hovered ? 'scale(1.06)' : 'scale(1)',
        transition: 'transform 0.12s, background 0.15s, box-shadow 0.12s',
        userSelect: 'none', flexShrink: 0, overflow: 'hidden',
        outline: 'none',
        boxShadow: focused ? `0 0 0 2px ${focusRing}` : 'none',
      }}
    >
      <NoteGhost noteArr={noteArr} lightMode={lightMode} />
      <span style={{ position: 'relative', zIndex: 1 }}>{cfg.content}</span>
    </div>
  )
}

export function NoteCell({ noteArr, state, onClickSub, lightMode, ariaLabel }) {
  const [hoveredSub, setHoveredSub] = useState(null)
  const [focusedSub, setFocusedSub] = useState(null)
  const focusRing = lightMode ? '#1c1917' : '#e7e5e4'
  const SUB_STATE_LABELS = ['empty', 'suspect', 'confirmed']

  return (
    <div
      role="group"
      aria-label={ariaLabel ?? 'note cell'}
      style={{
        position: 'relative',
        width: '54px', height: '54px',
        background: lightMode ? '#ebebeb' : '#151515',
        border: `1px solid ${lightMode ? '#c4c0bb' : '#2a2a3e'}`,
        borderRadius: '8px',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        gap: '1px', padding: '2px',
        flexShrink: 0, overflow: 'hidden',
      }}
    >
      <StateGhost state={state} lightMode={lightMode} />
      {(noteArr ?? [0,0,0,0,0,0,0,0,0]).map((val, i) => {
        const cfg = getNoteSubConfig(val, lightMode)
        const isHov = hoveredSub === i
        const isFoc = focusedSub === i
        const baseBg = val === 0 ? (lightMode ? '#e0dede' : '#151515') : cfg.bg
        const hovBg  = val === 0 ? (lightMode ? '#d4d2d2' : '#2a2a2a') : cfg.bg
        return (
          <div
            key={i}
            role="button"
            tabIndex={0}
            onClick={() => onClickSub(i)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClickSub(i) } }}
            onMouseEnter={() => setHoveredSub(i)}
            onMouseLeave={() => setHoveredSub(null)}
            onFocus={() => setFocusedSub(i)}
            onBlur={() => setFocusedSub(null)}
            aria-label={`Note ${i + 1}: ${SUB_STATE_LABELS[val] ?? 'empty'}`}
            aria-pressed={val !== 0}
            style={{
              position: 'relative', zIndex: 1,
              background: isHov ? hovBg : baseBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '2px', cursor: 'pointer',
              color: cfg.color, fontSize: '8px', fontWeight: 'bold',
              userSelect: 'none',
              transition: 'background 0.1s, box-shadow 0.1s',
              transform: isHov ? 'scale(1.1)' : 'scale(1)',
              outline: 'none',
              boxShadow: isFoc ? `0 0 0 1px ${focusRing}` : 'none',
            }}
          >
            {cfg.content}
          </div>
        )
      })}
    </div>
  )
}
