import { useState, useRef } from 'react'
import { PLAYER_COLORS, PLAYER_COLORS_LIGHT } from '../constants'

const FONT_PRIMARY = "'Coconat', Georgia, serif"
const FONT_BODY    = "'Inter', system-ui, sans-serif"

const LEGEND_ITEMS_DARK = [
  { key: 'tick',  preview: '✓',   bg: '#052e16', color: '#4ade80', label: 'In hand / confirmed' },
  { key: 'cross', preview: '✗',   bg: '#1f0a0a', color: '#f87171', label: 'Out / eliminated' },
  { key: 'q',     preview: '?',   bg: '#1c1200', color: '#fbbf24', label: 'Suspect' },
  { key: 'd1',    preview: '●',   bg: '#1a1a2e', color: '#818cf8', label: 'Seen once' },
  { key: 'd2',    preview: '●●',  bg: '#1a1a2e', color: '#818cf8', label: 'Seen twice' },
  { key: 'd3',    preview: '●●●', bg: '#1a1a2e', color: '#818cf8', label: 'Seen 3x' },
  { key: 'empty', preview: '·',   bg: '#1c1917', color: '#44403c', label: 'Unknown / clear' },
]
const LEGEND_ITEMS_LIGHT = [
  { key: 'tick',  preview: '✓',   bg: '#dcfce7', color: '#15803d', label: 'In hand / confirmed' },
  { key: 'cross', preview: '✗',   bg: '#fee2e2', color: '#b91c1c', label: 'Out / eliminated' },
  { key: 'q',     preview: '?',   bg: '#fef3c7', color: '#92400e', label: 'Suspect' },
  { key: 'd1',    preview: '●',   bg: '#ede9fe', color: '#5b21b6', label: 'Seen once' },
  { key: 'd2',    preview: '●●',  bg: '#ede9fe', color: '#5b21b6', label: 'Seen twice' },
  { key: 'd3',    preview: '●●●', bg: '#ede9fe', color: '#5b21b6', label: 'Seen 3x' },
  { key: 'empty', preview: '·',   bg: '#e8e5e3', color: '#78716c', label: 'Unknown / clear' },
]

const TOGGLEABLE_KEYS = new Set(['q', 'd1', 'd2', 'd3'])

export default function BurgerMenu({ players, onAddPlayer, onRemovePlayer, onReorderPlayers, onReset, lightMode, onLightModeToggle, enabledStates = { q: true, d1: true, d2: true, d3: true }, onToggleState }) {
  const [newName, setNewName] = useState('')
  const [confirmReset, setConfirmReset] = useState(false)
  const [legendOpen, setLegendOpen] = useState(false)
  const [draggingId, setDraggingId] = useState(null)
  const [dragOverIdx, setDragOverIdx] = useState(null)
  const holdTimer = useRef(null)
  const isDragging = useRef(false)
  const listRef = useRef(null)

  const colors = lightMode ? PLAYER_COLORS_LIGHT : PLAYER_COLORS
  const LEGEND_ITEMS = lightMode ? LEGEND_ITEMS_LIGHT : LEGEND_ITEMS_DARK

  const bg       = lightMode ? '#ffffff' : '#1c1917'
  const border   = lightMode ? '1px solid #d6d3d1' : '1px solid #44403c'
  const dividerBg = lightMode ? '#e7e5e4' : '#44403c'
  const textMain  = lightMode ? '#1c1917' : '#e7e5e4'
  const textMuted = lightMode ? '#57534e' : '#78716c'
  const textDim   = lightMode ? '#78716c' : '#a8a29e'
  const inputBg   = lightMode ? '#f5f3f0' : '#0d0d0d'
  const inputBorder = lightMode ? '#c4c0bb' : '#44403c'

  const getPointerY = (e) => e.touches?.[0]?.clientY ?? e.clientY
  const getTargetIdx = (y) => {
    if (!listRef.current) return null
    const rows = listRef.current.querySelectorAll('[data-row-id]')
    let idx = rows.length - 1
    for (let i = 0; i < rows.length; i++) {
      const rect = rows[i].getBoundingClientRect()
      if (y < rect.top + rect.height * 0.5) { idx = i; break }
    }
    return Math.max(1, idx)
  }

  const onHandleDown = (e, playerId) => {
    e.preventDefault()
    isDragging.current = false
    holdTimer.current = setTimeout(() => {
      isDragging.current = true
      setDraggingId(playerId)
      setDragOverIdx(players.findIndex(p => p.id === playerId))
      navigator.vibrate?.(40)
    }, 320)
  }
  const onHandleMove = (e) => {
    if (!isDragging.current) return
    e.preventDefault()
    setDragOverIdx(getTargetIdx(getPointerY(e)))
  }
  const onHandleUp = () => {
    clearTimeout(holdTimer.current)
    if (isDragging.current && draggingId !== null && dragOverIdx !== null) {
      onReorderPlayers(draggingId, dragOverIdx)
    }
    isDragging.current = false
    setDraggingId(null)
    setDragOverIdx(null)
  }

  const handleAdd = () => {
    const trimmed = newName.trim()
    if (!trimmed) return
    onAddPlayer(trimmed)
    setNewName('')
  }

  return (
    <div
      style={{
        position: 'absolute', top: '56px', left: 0, width: '280px',
        background: bg, border, borderTop: 'none',
        borderRadius: '0 0 12px 12px', zIndex: 99,
        boxShadow: '4px 8px 32px rgba(0,0,0,0.45)',
        maxHeight: 'calc(100vh - 80px)', overflowY: 'auto',
      }}
      role="dialog"
      aria-label="Menu"
    >
      {/* Players section */}
      <div style={{ padding: '14px 16px' }}>
        <div style={{ fontSize: '11px', fontFamily: FONT_PRIMARY, letterSpacing: '0.12em', textTransform: 'uppercase', color: textMuted, marginBottom: '10px' }}>
          Players
        </div>
        <div
          ref={listRef}
          style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '10px' }}
          onMouseMove={onHandleMove}
          onTouchMove={onHandleMove}
          onMouseUp={onHandleUp}
          onTouchEnd={onHandleUp}
        >
          {players.map((p, idx) => {
            const isDraggingThis = draggingId === p.id
            const isDropTarget = draggingId && !isDraggingThis && dragOverIdx === idx
            return (
              <div key={p.id} data-row-id={p.id}>
                {isDropTarget && (
                  <div style={{ height: '2px', background: '#fbbf24', borderRadius: '2px', margin: '2px 0' }} />
                )}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '5px 4px', borderRadius: '6px',
                  background: isDraggingThis ? (lightMode ? '#e7e5e4' : '#292524') : 'transparent',
                  opacity: isDraggingThis ? 0.5 : 1,
                  transition: 'background 0.15s, opacity 0.15s', userSelect: 'none',
                }}>
                  {!p.isMe ? (
                    <span
                      onMouseDown={(e) => onHandleDown(e, p.id)}
                      onTouchStart={(e) => onHandleDown(e, p.id)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Drag to reorder ${p.name}`}
                      style={{
                        fontSize: '15px',
                        color: draggingId === p.id ? '#fbbf24' : (lightMode ? '#a8a29e' : '#57534e'),
                        cursor: 'grab', touchAction: 'none',
                        paddingRight: '2px', flexShrink: 0, lineHeight: 1,
                      }}
                    >
                      ⠿
                    </span>
                  ) : (
                    <span style={{ width: '17px', flexShrink: 0 }} />
                  )}
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: colors[idx % colors.length], flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: '14px', fontFamily: FONT_BODY, color: textMain }}>
                    {p.name}
                  </span>
                  {!p.isMe && (
                    <button
                      onClick={() => onRemovePlayer(p.id)}
                      aria-label={`Remove ${p.name}`}
                      style={{
                        background: 'none', border: 'none',
                        color: lightMode ? '#a8a29e' : '#78716c',
                        cursor: 'pointer', fontSize: '14px', padding: '2px 6px',
                        lineHeight: 1, borderRadius: '4px',
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            style={{
              background: inputBg,
              border: `1px solid ${inputBorder}`,
              borderRadius: '6px',
              color: textMain,
              fontFamily: FONT_BODY,
              fontSize: '14px',
              padding: '6px 10px',
              flex: 1,
              outline: 'none',
              transition: 'box-shadow 0.15s',
            }}
            type="text"
            placeholder="Player name…"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            onFocus={e => e.target.style.boxShadow = `0 0 0 2px ${lightMode ? '#1c1917' : '#e7e5e4'}`}
            onBlur={e => e.target.style.boxShadow = 'none'}
            maxLength={20}
            aria-label="New player name"
          />
          <button
            onClick={handleAdd}
            style={{
              background: lightMode ? '#1c1917' : '#292524',
              border: `1px solid ${lightMode ? '#44403c' : '#57534e'}`,
              color: lightMode ? '#f5f3f0' : '#e7e5e4',
              borderRadius: '6px', padding: '6px 12px',
              cursor: 'pointer', fontFamily: FONT_BODY, fontSize: '13px', whiteSpace: 'nowrap',
            }}
          >
            + Add
          </button>
        </div>
      </div>

      <div style={{ height: '1px', background: dividerBg, margin: '0 16px' }} />

      {/* Legend — collapsible */}
      <div style={{ padding: '14px 16px' }}>
        <button
          onClick={() => setLegendOpen(o => !o)}
          aria-expanded={legendOpen}
          aria-controls="legend-content"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            width: '100%', background: 'none', border: 'none',
            cursor: 'pointer', padding: 0, marginBottom: legendOpen ? '10px' : 0,
          }}
        >
          <span style={{ fontSize: '11px', fontFamily: FONT_PRIMARY, letterSpacing: '0.12em', textTransform: 'uppercase', color: textMuted }}>
            Legend
          </span>
          <span style={{ fontSize: '11px', color: textDim }}>{legendOpen ? '▲' : '▼'}</span>
        </button>
        {legendOpen && (
          <div id="legend-content" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {LEGEND_ITEMS.map(item => {
              const isToggleable = TOGGLEABLE_KEYS.has(item.key)
              const isOn = !isToggleable || (enabledStates?.[item.key] !== false)
              return (
                <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: isToggleable && !isOn ? 0.45 : 1, transition: 'opacity 0.2s' }}>
                  <div style={{
                    width: '32px', height: '24px',
                    background: item.bg,
                    border: `1px solid ${lightMode ? '#d1d0ce' : '#44403c'}`,
                    borderRadius: '4px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: item.color, fontSize: '11px', fontWeight: 'bold', flexShrink: 0,
                  }}>
                    {item.preview}
                  </div>
                  <span style={{ flex: 1, fontSize: '13px', color: textDim, fontFamily: FONT_BODY }}>{item.label}</span>
                  {isToggleable && (
                    <button
                      role="switch"
                      aria-checked={isOn}
                      aria-label={`${isOn ? 'Disable' : 'Enable'} ${item.label} state`}
                      onClick={() => onToggleState?.(item.key)}
                      style={{
                        flexShrink: 0,
                        width: '28px', height: '16px', borderRadius: '8px',
                        background: isOn ? '#4ade80' : (lightMode ? '#c4c0bb' : '#44403c'),
                        border: 'none', position: 'relative',
                        cursor: 'pointer', padding: 0, outline: 'none',
                        transition: 'background 0.2s',
                      }}
                      onFocus={e => e.target.style.boxShadow = `0 0 0 2px ${lightMode ? '#1c1917' : '#e7e5e4'}`}
                      onBlur={e => e.target.style.boxShadow = 'none'}
                    >
                      <div style={{
                        position: 'absolute', top: '2px',
                        left: isOn ? '14px' : '2px',
                        width: '12px', height: '12px', borderRadius: '50%',
                        background: '#fff', transition: 'left 0.2s',
                        pointerEvents: 'none',
                      }} />
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div style={{ height: '1px', background: dividerBg, margin: '0 16px' }} />

      {/* Light mode toggle */}
      <div style={{ padding: '14px 16px' }}>
        <div style={{ fontSize: '11px', fontFamily: FONT_PRIMARY, letterSpacing: '0.12em', textTransform: 'uppercase', color: textMuted, marginBottom: '10px' }}>
          Appearance
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <span style={{ fontSize: '16px', color: lightMode ? '#d97706' : textDim, lineHeight: 1 }} aria-hidden="true">☀</span>
          <button
            role="switch"
            aria-checked={lightMode}
            aria-label="Toggle light mode"
            onClick={onLightModeToggle}
            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onLightModeToggle()}
            style={{
              width: '32px', height: '18px', borderRadius: '9px',
              background: lightMode ? '#d97706' : '#44403c',
              border: 'none', position: 'relative',
              transition: 'background 0.2s', flexShrink: 0,
              cursor: 'pointer', padding: 0, outline: 'none',
            }}
            onFocus={e => e.target.style.boxShadow = `0 0 0 2px ${lightMode ? '#1c1917' : '#e7e5e4'}`}
            onBlur={e => e.target.style.boxShadow = 'none'}
          >
            <div style={{
              position: 'absolute', top: '2px',
              left: lightMode ? '16px' : '2px',
              width: '14px', height: '14px', borderRadius: '50%',
              background: '#fff', transition: 'left 0.2s',
            }} />
          </button>
          <span style={{ fontSize: '16px', color: lightMode ? textDim : '#a8a29e', lineHeight: 1 }} aria-hidden="true">☾</span>
        </div>
      </div>

      <div style={{ height: '1px', background: dividerBg, margin: '0 16px' }} />

      {/* Reset */}
      <div style={{ padding: '14px 16px' }}>
        {!confirmReset ? (
          <button
            onClick={() => setConfirmReset(true)}
            style={{
              background: 'none',
              border: `1px solid ${lightMode ? '#dc2626' : '#dc2626'}`,
              color: lightMode ? '#dc2626' : '#f87171',
              borderRadius: '8px', padding: '8px 16px',
              cursor: 'pointer', fontFamily: FONT_BODY, fontSize: '14px', width: '100%',
            }}
          >
            Reset board
          </button>
        ) : (
          <div>
            <p style={{ fontSize: '13px', color: textDim, fontFamily: FONT_BODY, margin: '0 0 10px 0' }}>
              Clear all cells and notes?
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => { onReset(); setConfirmReset(false) }}
                style={{
                  background: lightMode ? '#fee2e2' : '#7f1d1d',
                  border: '1px solid #dc2626',
                  color: lightMode ? '#b91c1c' : '#fca5a5',
                  borderRadius: '8px', padding: '8px 16px',
                  cursor: 'pointer', fontFamily: FONT_BODY, fontSize: '13px', flex: 1,
                }}
              >
                Yes, reset
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                style={{
                  background: lightMode ? '#f5f3f0' : '#292524',
                  border: `1px solid ${lightMode ? '#c4c0bb' : '#57534e'}`,
                  color: lightMode ? '#57534e' : '#a8a29e',
                  borderRadius: '8px', padding: '8px 16px',
                  cursor: 'pointer', fontFamily: FONT_BODY, fontSize: '13px', flex: 1,
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
