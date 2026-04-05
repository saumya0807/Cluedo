import { NormalCell, NoteCell } from './Cell'
import { PLAYER_COLORS, WHO, WHAT, WHERE } from '../constants'

const SECTIONS = [
  { label: 'Who?',   color: '#ef4444', items: WHO },
  { label: 'What?',  color: '#f97316', items: WHAT },
  { label: 'Where?', color: '#a78bfa', items: WHERE },
]

export default function Grid({ players, grid, noteGrid, noteMode, onCycleCell, onCycleNoteCell }) {
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

  // Header row with player names (rotated)
  const headerRowStyle = {
    display: 'flex',
    alignItems: 'flex-end',
    marginBottom: '6px',
    paddingLeft: `${LABEL_W}px`,
    gap: `${CELL_GAP}px`,
  }

  const rotatedNameStyle = (idx) => ({
    width: `${CELL_W}px`,
    height: '80px',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    flexShrink: 0,
  })

  const nameTextStyle = (idx) => ({
    writingMode: 'vertical-rl',
    transform: 'rotate(180deg)',
    fontSize: '12px',
    fontFamily: 'Georgia, serif',
    color: PLAYER_COLORS[idx % PLAYER_COLORS.length],
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    maxHeight: '78px',
    whiteSpace: 'nowrap',
    letterSpacing: '0.03em',
  })

  return (
    <div style={containerStyle}>
      <div style={tableStyle}>
        {/* Player name header */}
        <div style={headerRowStyle}>
          {players.map((p, idx) => (
            <div key={p.id} style={rotatedNameStyle(idx)}>
              <span style={nameTextStyle(idx)}>{p.name}</span>
            </div>
          ))}
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
                width: `${LABEL_W - 8}px`,
                height: '2px',
                background: 'transparent',
                flexShrink: 0,
              }} />
              <div style={{
                fontSize: '13px',
                fontFamily: 'Georgia, serif',
                fontWeight: 'bold',
                color: section.color,
                letterSpacing: '0.06em',
                paddingLeft: '4px',
                borderLeft: `3px solid ${section.color}`,
                lineHeight: '1.4',
              }}>
                {section.label}
              </div>
            </div>

            {/* Item rows */}
            {section.items.map(item => (
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
                  color: '#a8a29e',
                  textAlign: 'right',
                  paddingRight: '10px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  lineHeight: '54px',
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
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
