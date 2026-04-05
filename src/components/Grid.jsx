import { NormalCell, NoteCell } from './Cell'
import { PLAYER_COLORS, PLAYER_COLORS_LIGHT, WHO, WHAT, WHERE } from '../constants'

const FONT_PRIMARY = "'Coconat', Georgia, serif"
const FONT_BODY    = "'Inter', system-ui, sans-serif"

const SECTIONS = [
  { label: 'Who?',   color: '#ef4444', lightColor: '#b91c1c', items: WHO },
  { label: 'What?',  color: '#f97316', lightColor: '#c2410c', items: WHAT },
  { label: 'Where?', color: '#a78bfa', lightColor: '#5b21b6', items: WHERE },
]

export default function Grid({ players, grid, noteGrid, noteMode, onCycleCell, onCycleNoteCell, itemNotes, onSetItemNote, lightMode }) {
  const CELL_W = 54
  const CELL_GAP = 8
  const LABEL_W = 130
  const NOTE_COL_W = 130

  const colors = lightMode ? PLAYER_COLORS_LIGHT : PLAYER_COLORS
  // Background for sticky label column — must be opaque to cover scrolling cells
  const stickyBg = lightMode ? '#f0ede9' : '#111111'

  return (
    <div style={{ padding: '8px 0 8px 0', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <div style={{ display: 'inline-block', minWidth: '100%', paddingRight: '12px' }}>

        {/* Player name header */}
        <div
          role="row"
          style={{
            display: 'flex', alignItems: 'center',
            marginBottom: '6px',
            gap: `${CELL_GAP}px`,
          }}
        >
          {/* Sticky spacer — covers label area when cells scroll horizontally */}
          <div style={{
            width: `${LABEL_W}px`, flexShrink: 0,
            position: 'sticky', left: 0, zIndex: 3,
            background: stickyBg,
          }} />
          {players.map((p, idx) => (
            <div
              key={p.id}
              role="columnheader"
              style={{ width: `${CELL_W}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
            >
              <span style={{
                fontSize: '11px',
                fontFamily: FONT_BODY,
                color: colors[idx % colors.length],
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                letterSpacing: '0.03em',
                textAlign: 'center',
                fontWeight: p.isMe ? 'bold' : 'normal',
              }}>
                {p.name.slice(0, 5)}
              </span>
            </div>
          ))}
          <div style={{ width: `${NOTE_COL_W}px`, flexShrink: 0 }} />
        </div>

        {/* Sections */}
        {SECTIONS.map(section => {
          const headerColor = lightMode ? section.lightColor : section.color
          return (
            <div key={section.label} style={{ marginBottom: '8px' }}>
              {/* Section header — sticky so label stays visible while cells scroll */}
              <div
                role="rowgroup"
                style={{
                  position: 'sticky', left: 0, zIndex: 3,
                  display: 'inline-flex', alignItems: 'center',
                  marginBottom: '4px', paddingLeft: '4px',
                  background: stickyBg,
                }}
              >
                <h2 style={{
                  margin: 0,
                  fontSize: '13px',
                  fontFamily: FONT_PRIMARY,
                  fontWeight: 'bold',
                  color: headerColor,
                  letterSpacing: '0.06em',
                  paddingLeft: '6px',
                  borderLeft: `3px solid ${headerColor}`,
                  lineHeight: '1.4',
                }}>
                  {section.label}
                </h2>
              </div>

              {section.items.map(item => {
                const isTicked = players.some(p => (grid[p.id]?.[item] ?? null) === 'tick')
                const tickColor = lightMode ? '#15803d' : '#4ade80'
                return (
                  <div
                    key={item}
                    role="row"
                    style={{
                      display: 'flex', alignItems: 'center',
                      marginBottom: `${CELL_GAP}px`,
                      gap: `${CELL_GAP}px`,
                    }}
                  >
                    {/* Label — sticky so it stays visible while cells scroll right */}
                    <div
                      role="rowheader"
                      style={{
                        width: `${LABEL_W}px`, flexShrink: 0,
                        position: 'sticky', left: 0, zIndex: 2,
                        background: stickyBg,
                        fontSize: '12px', fontFamily: 'monospace',
                        color: isTicked ? (lightMode ? '#b0ada9' : '#57534e') : (lightMode ? '#57534e' : '#a8a29e'),
                        textAlign: 'left', paddingLeft: '12px',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        lineHeight: '54px',
                        textDecoration: isTicked ? 'line-through' : 'none',
                        textDecorationColor: isTicked ? (lightMode ? '#b0ada9' : '#57534e') : 'transparent',
                        textDecorationThickness: '2px',
                        transition: 'color 0.2s, text-decoration 0.2s',
                      }}
                    >
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
                          lightMode={lightMode}
                          ariaLabel={`${p.name} – ${item} notes`}
                        />
                      ) : (
                        <NormalCell
                          key={p.id}
                          state={grid[p.id]?.[item] ?? null}
                          noteArr={noteGrid[p.id]?.[item]}
                          onClick={() => onCycleCell(p.id, item)}
                          lightMode={lightMode}
                          ariaLabel={`${p.name} – ${item}`}
                        />
                      )
                    ))}

                    {/* Per-item row note */}
                    <textarea
                      value={itemNotes?.[item] ?? ''}
                      onChange={e => onSetItemNote(item, e.target.value)}
                      placeholder="…"
                      rows={1}
                      aria-label={`Notes for ${item}`}
                      style={{
                        width: `${NOTE_COL_W}px`,
                        height: `${CELL_W}px`,
                        flexShrink: 0,
                        background: lightMode ? '#f5f3f0' : '#111',
                        border: '1px solid',
                        borderColor: itemNotes?.[item]
                          ? (lightMode ? '#a8a29e' : '#57534e')
                          : (lightMode ? '#d6d3d1' : '#2a2826'),
                        borderRadius: '8px',
                        color: lightMode ? '#1c1917' : '#d4cfc9',
                        fontFamily: 'monospace',
                        fontSize: '11px',
                        lineHeight: '1.45',
                        padding: '6px 8px',
                        resize: 'none',
                        overflowY: 'auto',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.15s, box-shadow 0.15s',
                        verticalAlign: 'top',
                        outline: 'none',
                      }}
                      onFocus={e => { e.target.style.borderColor = lightMode ? '#57534e' : '#78716c'; e.target.style.boxShadow = `0 0 0 2px ${lightMode ? '#1c191740' : '#e7e5e430'}` }}
                      onBlur={e => { e.target.style.borderColor = itemNotes?.[item] ? (lightMode ? '#a8a29e' : '#57534e') : (lightMode ? '#d6d3d1' : '#2a2826'); e.target.style.boxShadow = 'none' }}
                    />
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
