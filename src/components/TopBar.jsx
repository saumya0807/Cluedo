export default function TopBar({ menuOpen, onMenuToggle, noteMode, onNoteModeToggle }) {
  const barStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '56px',
    background: '#1c1917',
    borderBottom: '1px solid #44403c',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 12px',
    zIndex: 100,
  }

  const burgerStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '22px',
    color: '#e7e5e4',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '6px',
    transition: 'background 0.15s',
    padding: 0,
  }

  const titleStyle = {
    fontFamily: 'Georgia, serif',
    fontSize: '18px',
    fontWeight: 'bold',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: '#e7e5e4',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    userSelect: 'none',
  }

  const noteToggleStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: noteMode ? '#1c1200' : 'none',
    border: noteMode ? '1px solid #92400e' : '1px solid #44403c',
    borderRadius: '20px',
    padding: '4px 10px 4px 8px',
    cursor: 'pointer',
    color: noteMode ? '#fbbf24' : '#a8a29e',
    fontSize: '13px',
    fontFamily: 'Georgia, serif',
    transition: 'all 0.2s',
    userSelect: 'none',
  }

  const pillTrack = {
    width: '32px',
    height: '18px',
    borderRadius: '9px',
    background: noteMode ? '#d97706' : '#44403c',
    position: 'relative',
    transition: 'background 0.2s',
    flexShrink: 0,
  }

  const pillThumb = {
    position: 'absolute',
    top: '2px',
    left: noteMode ? '16px' : '2px',
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    background: '#fff',
    transition: 'left 0.2s',
  }

  return (
    <div style={barStyle}>
      <button
        style={burgerStyle}
        onClick={onMenuToggle}
        aria-label="Toggle menu"
      >
        <span style={{ display: 'inline-block', transition: 'transform 0.2s', transform: menuOpen ? 'rotate(90deg)' : 'none' }}>
          {menuOpen ? '✕' : '☰'}
        </span>
      </button>

      <div style={titleStyle}>
        <span>CLUEDO</span>
      </div>

      <button style={noteToggleStyle} onClick={onNoteModeToggle} aria-label="Toggle note mode">
        <span>Notes</span>
        <div style={pillTrack}>
          <div style={pillThumb} />
        </div>
      </button>
    </div>
  )
}
