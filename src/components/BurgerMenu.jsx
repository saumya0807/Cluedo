import { useState, useRef } from 'react'
import { PLAYER_COLORS } from '../constants'

const LEGEND_ITEMS = [
  { key: 'tick',  preview: '✓', bg: '#052e16', color: '#4ade80', label: 'In hand / confirmed' },
  { key: 'cross', preview: '✗', bg: '#1f0a0a', color: '#f87171', label: 'Out / eliminated' },
  { key: 'q',     preview: '?', bg: '#1c1200', color: '#fbbf24', label: 'Suspect' },
  { key: 'd1',    preview: '●', bg: '#1a1a2e', color: '#818cf8', label: 'Seen once' },
  { key: 'd2',    preview: '●●', bg: '#1a1a2e', color: '#818cf8', label: 'Seen twice' },
  { key: 'd3',    preview: '●●●', bg: '#1a1a2e', color: '#818cf8', label: 'Seen 3×' },
  { key: 'empty', preview: '·', bg: '#1c1917', color: '#44403c', label: 'Unknown / clear' },
]

export default function BurgerMenu({ players, onAddPlayer, onRemovePlayer, onReorderPlayers, onReset, lightMode, onLightModeToggle }) {
  const [newName, setNewName] = useState('')
  const [confirmReset, setConfirmReset] = useState(false)
  const [legendOpen, setLegendOpen] = useState(false)

  // Drag-to-reorder state
  const [draggingId, setDraggingId] = useState(null)
  const [dragOverIdx, setDragOverIdx] = useState(null)
  const holdTimer = useRef(null)
  const isDragging = useRef(false)
  const listRef = useRef(null)

  const getPointerY = (e) => e.touches?.[0]?.clientY ?? e.clientY

  const getTargetIdx = (y) => {
    if (!listRef.current) return null
    const rows = listRef.current.querySelectorAll('[data-row-id]')
    let idx = rows.length - 1
    for (let i = 0; i < rows.length; i++) {
      const rect = rows[i].getBoundingClientRect()
      if (y < rect.top + rect.height * 0.5) { idx = i; break }
    }
    return Math.max(1, idx) // never before "Me"
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

  const onHandleUp = (e) => {
    clearTimeout(holdTimer.current)
    if (isDragging.current && draggingId !== null && dragOverIdx !== null) {
      onReorderPlayers(draggingId, dragOverIdx)
    }
    isDragging.current = false
    setDraggingId(null)
    setDragOverIdx(null)
  }

  const menuStyle = {
    position: 'absolute',
    top: '56px',
    left: 0,
    width: '280px',
    background: lightMode ? '#ffffff' : '#1c1917',
    border: lightMode ? '1px solid #d6d3d1' : '1px solid #44403c',
    borderTop: 'none',
    borderRadius: '0 0 12px 12px',
    zIndex: 99,
    boxShadow: '4px 8px 32px rgba(0,0,0,0.7)',
    maxHeight: 'calc(100vh - 80px)',
    overflowY: 'auto',
  }

  const sectionStyle = {
    padding: '14px 16px',
  }

  const dividerStyle = {
    height: '1px',
    background: lightMode ? '#e7e5e4' : '#44403c',
    margin: '0 16px',
  }

  const sectionTitleStyle = {
    fontSize: '11px',
    fontFamily: 'Georgia, serif',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#78716c',
    marginBottom: '10px',
  }

  const handleAdd = () => {
    const trimmed = newName.trim()
    if (!trimmed) return
    onAddPlayer(trimmed)
    setNewName('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd()
  }

  const inputStyle = {
    background: lightMode ? '#f5f3f0' : '#0d0d0d',
    border: lightMode ? '1px solid #c4c0bb' : '1px solid #44403c',
    borderRadius: '6px',
    color: lightMode ? '#1c1917' : '#e7e5e4',
    fontFamily: 'Georgia, serif',
    fontSize: '14px',
    padding: '6px 10px',
    flex: 1,
    outline: 'none',
  }

  const addBtnStyle = {
    background: '#292524',
    border: '1px solid #57534e',
    color: '#e7e5e4',
    borderRadius: '6px',
    padding: '6px 12px',
    cursor: 'pointer',
    fontFamily: 'Georgia, serif',
    fontSize: '13px',
    whiteSpace: 'nowrap',
  }

  const resetBtnStyle = {
    background: 'none',
    border: '1px solid #dc2626',
    color: '#f87171',
    borderRadius: '8px',
    padding: '8px 16px',
    cursor: 'pointer',
    fontFamily: 'Georgia, serif',
    fontSize: '14px',
    width: '100%',
    transition: 'background 0.15s',
  }

  const confirmBtnStyle = {
    background: '#7f1d1d',
    border: '1px solid #dc2626',
    color: '#fca5a5',
    borderRadius: '8px',
    padding: '8px 16px',
    cursor: 'pointer',
    fontFamily: 'Georgia, serif',
    fontSize: '13px',
    flex: 1,
  }

  const cancelBtnStyle = {
    background: '#292524',
    border: '1px solid #57534e',
    color: '#a8a29e',
    borderRadius: '8px',
    padding: '8px 16px',
    cursor: 'pointer',
    fontFamily: 'Georgia, serif',
    fontSize: '13px',
    flex: 1,
  }

  const lightPillTrack = {
    width: '32px',
    height: '18px',
    borderRadius: '9px',
    background: lightMode ? '#d97706' : '#44403c',
    position: 'relative',
    transition: 'background 0.2s',
    flexShrink: 0,
    cursor: 'pointer',
  }

  const lightPillThumb = {
    position: 'absolute',
    top: '2px',
    left: lightMode ? '16px' : '2px',
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    background: '#fff',
    transition: 'left 0.2s',
  }

  return (
    <div style={menuStyle}>
      {/* Players */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Players</div>
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
                {/* drop-zone insertion line above this row */}
                {isDropTarget && (
                  <div style={{
                    height: '2px',
                    background: '#fbbf24',
                    borderRadius: '2px',
                    margin: '2px 0',
                    transition: 'opacity 0.1s',
                  }} />
                )}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '5px 4px',
                  borderRadius: '6px',
                  background: isDraggingThis ? '#292524' : 'transparent',
                  opacity: isDraggingThis ? 0.5 : 1,
                  transition: 'background 0.15s, opacity 0.15s',
                  userSelect: 'none',
                }}>
                  {/* drag handle — only for non-Me players */}
                  {!p.isMe ? (
                    <span
                      onMouseDown={(e) => onHandleDown(e, p.id)}
                      onTouchStart={(e) => onHandleDown(e, p.id)}
                      style={{
                        fontSize: '15px',
                        color: draggingId === p.id ? '#fbbf24' : '#57534e',
                        cursor: 'grab',
                        touchAction: 'none',
                        paddingRight: '2px',
                        flexShrink: 0,
                        lineHeight: 1,
                        transition: 'color 0.15s',
                      }}
                      title="Hold to drag"
                    >
                      ⠿
                    </span>
                  ) : (
                    <span style={{ width: '17px', flexShrink: 0 }} />
                  )}
                  <div style={{
                    width: '10px', height: '10px', borderRadius: '50%',
                    background: PLAYER_COLORS[idx % PLAYER_COLORS.length],
                    flexShrink: 0,
                  }} />
                  <span style={{ flex: 1, fontSize: '14px', fontFamily: 'Georgia, serif', color: lightMode ? '#1c1917' : '#e7e5e4' }}>
                    {p.name}
                  </span>
                  {!p.isMe && (
                    <button
                      onClick={() => onRemovePlayer(p.id)}
                      style={{
                        background: 'none', border: 'none', color: '#78716c',
                        cursor: 'pointer', fontSize: '14px', padding: '2px 4px',
                        lineHeight: 1,
                      }}
                      aria-label={`Remove ${p.name}`}
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
            style={inputStyle}
            type="text"
            placeholder="Player name…"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={20}
          />
          <button style={addBtnStyle} onClick={handleAdd}>+ Add</button>
        </div>
      </div>

      <div style={dividerStyle} />

      {/* Legend — collapsible */}
      <div style={sectionStyle}>
        <div
          onClick={() => setLegendOpen(o => !o)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            marginBottom: legendOpen ? '10px' : 0,
            userSelect: 'none',
          }}
        >
          <div style={sectionTitleStyle}>Legend</div>
          <span style={{ fontSize: '11px', color: '#78716c', marginBottom: legendOpen ? '10px' : 0 }}>
            {legendOpen ? '▲' : '▼'}
          </span>
        </div>
        {legendOpen && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {LEGEND_ITEMS.map(item => (
              <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px',
                  height: '24px',
                  background: item.bg,
                  border: '1px solid #44403c',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: item.color,
                  fontSize: '11px',
                  fontWeight: 'bold',
                  flexShrink: 0,
                }}>
                  {item.preview}
                </div>
                <span style={{ fontSize: '13px', color: '#a8a29e', fontFamily: 'Georgia, serif' }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={dividerStyle} />

      {/* Appearance / Light mode toggle */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Appearance</div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
        }}>
          <span style={{ fontSize: '16px', color: lightMode ? '#d97706' : '#78716c', lineHeight: 1 }}>☀</span>
          <div style={lightPillTrack} onClick={onLightModeToggle} aria-label="Toggle light mode">
            <div style={lightPillThumb} />
          </div>
          <span style={{ fontSize: '16px', color: lightMode ? '#78716c' : '#a8a29e', lineHeight: 1 }}>☾</span>
        </div>
      </div>

      <div style={dividerStyle} />

      {/* Reset */}
      <div style={sectionStyle}>
        {!confirmReset ? (
          <button style={resetBtnStyle} onClick={() => setConfirmReset(true)}>
            Reset board
          </button>
        ) : (
          <div>
            <p style={{ fontSize: '13px', color: '#a8a29e', fontFamily: 'Georgia, serif', marginBottom: '10px', margin: '0 0 10px 0' }}>
              Clear all cells and notes?
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={confirmBtnStyle} onClick={() => { onReset(); setConfirmReset(false) }}>
                Yes, reset
              </button>
              <button style={cancelBtnStyle} onClick={() => setConfirmReset(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
