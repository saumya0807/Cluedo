export default function NotesArea({ notes, onChange, lightMode }) {
  const wrapStyle = {
    padding: '12px 12px 24px 12px',
    borderTop: lightMode ? '1px solid #e7e5e4' : '1px solid #292524',
  }

  const labelStyle = {
    fontSize: '12px',
    fontFamily: 'Georgia, serif',
    color: '#78716c',
    letterSpacing: '0.08em',
    marginBottom: '6px',
    userSelect: 'none',
  }

  const textareaStyle = {
    width: '100%',
    height: '90px',
    background: lightMode ? '#f5f3f0' : '#111110',
    border: lightMode ? '1px solid #c4c0bb' : '1px solid #44403c',
    borderRadius: '8px',
    color: lightMode ? '#1c1917' : '#d6d3d1',
    fontFamily: 'monospace',
    fontSize: '13px',
    padding: '8px 10px',
    resize: 'none',
    outline: 'none',
    boxSizing: 'border-box',
    lineHeight: '1.5',
  }

  return (
    <div style={wrapStyle}>
      <div style={labelStyle}>Notes</div>
      <textarea
        style={textareaStyle}
        value={notes}
        onChange={e => onChange(e.target.value)}
        placeholder="Jot down clues, player tells, deductions…"
        spellCheck={false}
      />
    </div>
  )
}
