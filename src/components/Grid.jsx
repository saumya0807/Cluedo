import { NormalCell, NoteCell } from './Cell'
import { PLAYER_COLORS, WHO, WHAT, WHERE } from '../constants'

const SECTIONS = [
  { label: 'Who?',   color: '#ef4444', items: WHO },
  { label: 'What?',  color: '#f97316', items: WHAT },
  { label: 'Where?', color: '#a78bfa', items: WHERE },
]

export default function Grid({ players, grid, noteGrid, noteMode, onCycleCell, onCycleNoteCell, itemNotes, onSetItemNote }) {
  const CELL_W = 54
  const CELL_GAP = 8
  const LABEL_W = 130

  const containerStyle = {
    padding: '16px 12px 8px 12px',
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch',
  }

  const tableStyle = {
    display: 'inline-block',
    minWidth: '100%',
  }

  const NOTE_COL_W = 130

  // Header row with player names (horizontal)
  const headerRowStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '6px',
    paddingLeft: `${LABEL_W}px`,
    gap: `${CELL_GAP}px`,
  }

  const rotatedNameStyle = () => ({
    width: `${CELL_W}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  })

  const nameTextStyle = (idx) => ({
    fontSize: '11px',
    fontFamily: 'Georgia, serif',
    color: PLAYER_COLORS[idx % PLAYER_COLORS.length],
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    letterSpacing: '0.03em',
    textAlign: 'center',
  })

  return (
    <div style={containerStyle}>
      <div style={tableStyle}>
        {/* Player name header */}
        <div style={headerRowStyle}>
          {players.map((p, idx) => (
            <div key={p.id} style={rotatedNameStyle(idx)}>
              <span style={nameTextStyle(idx)}>{p.name.slice(0, 5)}</span>
            </div>
          ))}
          {/* Empty spacer above the row-notes column */}
          <div style={{ width: `${NOTE_COL_W}px`, flexShrink: 0 }} />
        </div>

        {/* Sections */}
        {SECTIONS.map(section => (
          <div key={section.label} style={{ marginBottom: '8px' }}>
            {/* Section header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '4px',
              paddingLeft: '4px',
            }}>
              <div style={{
                fontSize: '13px',
                fontFamily: 'Georgia, serif',
                fontWeight: 'bold',
                color: section.color,
                letterSpacing: '0.06em',
                paddingLeft: '6px',
                borderLeft: `3px solid ${section.color}`,
                lineHeight: '1.4',
              }}>
                {section.label}
              </div>
            </div>

            {/* Item rows */}
            {section.items.map(item => {
              const isTicked = players.some(p => (grid[p.id]?.[item] ?? null) === 'tick')
              return (
              <div
                key={item}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: `${CELL_GAP}px`,
                  gap: `${CELL_GAP}px`,
                }}
              >
                {/* Label */}
                <div style={{
                  width: `${LABEL_W}px`,
                  flexShrink: 0,
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  color: isTicked ? '#4ade80' : '#a8a29e',
                  textAlign: 'left',
                  paddingLeft: '8px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  lineHeight: '54px',
                  textDecoration: isTicked ? 'line-through' : 'none',
                  textDecorationColor: isTicked ? '#4ade80' : 'transparent',
                  transition: 'color 0.2s, text-decoration 0.2s',
                  opacity: isTicked ? 0.6 : 1,
                }}>
                  {item}
                </div>

                {/* Cells */}
                {players.map((p) => (
                  noteMode ? (
                    <NoteCell
                      key={p.id}
                      noteArr={noteGrid[p.id]?.[item]}
                      state={grid[p.id]?.[item] ?? null}
                      onClickSub={(subIdx) => onCycleNoteCell(p.id, item, subIdx)}
                    />
                  ) : (
                    <NormalCell
                      key={p.id}
                      state={grid[p.id]?.[item] ?? null}
                      noteArr={noteGrid[p.id]?.[item]}
                      onClick={() => onCycleCell(p.id, item)}
                    />
                  )
                ))}

                {/* Per-item row note */}
                <textarea
                  value={itemNotes?.[item] ?? ''}
                  onChange={e => onSetItemNote(item, e.target.value)}
                  placeholder="…"
                  rows={1}
                  style={{
                    width: `${NOTE_COL_W}px`,
                    height: `${CELL_W}px`,
                    flexShrink: 0,
                    background: '#111',
                    border: '1px solid',
                    borderColor: itemNotes?.[item] ? '#57534e' : '#2a2826',
                    borderRadius: '8px',
                    color: '#d4cfc9',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    lineHeight: '1.45',
                    padding: '6px 8px',
                    resize: 'none',
                    outline: 'none',
                    overflowY: 'auto',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.15s',
                    verticalAlign: 'top',
                  }}
                  onFocus={e => e.target.style.borderColor = '#78716c'}
                  onBlur={e => e.target.style.borderColor = itemNotes?.[item] ? '#57534e' : '#2a2826'}
                />
              </div>
            )})}
          </div>
        ))}
      </div>
    </div>
  )
}
