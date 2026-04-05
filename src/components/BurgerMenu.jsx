import { useState } from 'react'
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

export default function BurgerMenu({ players, onAddPlayer, onRemovePlayer, onReset }) {
  const [newName, setNewName] = useState('')
  const [confirmReset, setConfirmReset] = useState(false)

  const menuStyle = {
    position: 'absolute',
    top: '56px',
    left: 0,
    width: '280px',
    background: '#1c1917',
    border: '1px solid #44403c',
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
    background: '#44403c',
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
    background: '#0d0d0d',
    border: '1px solid #44403c',
    borderRadius: '6px',
    color: '#e7e5e4',
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

  return (
    <div style={menuStyle}>
      {/* Legend */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Legend</div>
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
      </div>

      <div style={dividerStyle} />

      {/* Players */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Players</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
          {players.map((p, idx) => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '10px', height: '10px', borderRadius: '50%',
                background: PLAYER_COLORS[idx % PLAYER_COLORS.length],
                flexShrink: 0,
              }} />
              <span style={{ flex: 1, fontSize: '14px', fontFamily: 'Georgia, serif', color: '#e7e5e4' }}>
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
          ))}
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
