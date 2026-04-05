const FONT_PRIMARY = "'Coconat', Georgia, serif"
const FONT_BODY    = "'Inter', system-ui, sans-serif"

export default function TopBar({ menuOpen, onMenuToggle, noteMode, onNoteModeToggle, lightMode }) {
  const bg        = lightMode ? '#f5f3f0' : '#1c1917'
  const borderBot = lightMode ? '1px solid #d6d3d1' : '1px solid #44403c'
  const textColor = lightMode ? '#1c1917' : '#e7e5e4'

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, height: '56px',
      background: bg, borderBottom: borderBot,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 12px', zIndex: 100,
    }}>
      {/* Left: Notes toggle */}
      <button
        onClick={onNoteModeToggle}
        role="switch"
        aria-checked={noteMode}
        aria-label="Note mode"
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: noteMode ? (lightMode ? '#fef3c7' : '#1c1200') : 'none',
          border: noteMode
            ? '1px solid #d97706'
            : (lightMode ? '1px solid #c4c0bb' : '1px solid #44403c'),
          borderRadius: '20px', padding: '4px 10px 4px 8px',
          cursor: 'pointer',
          color: noteMode ? (lightMode ? '#92400e' : '#fbbf24') : (lightMode ? '#57534e' : '#a8a29e'),
          fontSize: '13px', fontFamily: FONT_BODY,
          transition: 'all 0.2s', userSelect: 'none', outline: 'none',
        }}
        onFocus={e => e.target.style.boxShadow = `0 0 0 2px ${lightMode ? '#1c1917' : '#e7e5e4'}`}
        onBlur={e => e.target.style.boxShadow = 'none'}
      >
        <span>Notes</span>
        <div aria-hidden="true" style={{
          width: '32px', height: '18px', borderRadius: '9px',
          background: noteMode ? '#d97706' : (lightMode ? '#c4c0bb' : '#44403c'),
          position: 'relative', transition: 'background 0.2s', flexShrink: 0,
        }}>
          <div style={{
            position: 'absolute', top: '2px',
            left: noteMode ? '16px' : '2px',
            width: '14px', height: '14px', borderRadius: '50%',
            background: '#fff', transition: 'left 0.2s',
          }} />
        </div>
      </button>

      {/* Centre: b1205 + CLUEDO stacked */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0px', userSelect: 'none' }}>
        <span style={{
          fontFamily: FONT_BODY,
          fontSize: '8px',
          fontWeight: 500,
          letterSpacing: '0.5em',
          textTransform: 'uppercase',
          color: lightMode ? '#a8a29e' : '#57534e',
          alignSelf: 'stretch',
          textAlign: 'center',
        }}>
          b1205
        </span>
        <span style={{
          fontFamily: FONT_PRIMARY,
          fontSize: '20px',
          fontWeight: 700,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: textColor,
          lineHeight: 1.1,
        }}>
          CLUEDO
        </span>
      </div>

      {/* Right: Burger menu */}
      <button
        onClick={onMenuToggle}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        aria-haspopup="dialog"
        style={{
          background: 'none', border: 'none',
          cursor: 'pointer', fontSize: '22px', color: textColor,
          width: '40px', height: '40px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: '6px',
          transition: 'background 0.15s, box-shadow 0.12s',
          padding: 0, outline: 'none',
        }}
        onFocus={e => e.target.style.boxShadow = `0 0 0 2px ${lightMode ? '#1c1917' : '#e7e5e4'}`}
        onBlur={e => e.target.style.boxShadow = 'none'}
      >
        <span style={{ display: 'inline-block', transition: 'transform 0.2s', transform: menuOpen ? 'rotate(90deg)' : 'none' }}>
          {menuOpen ? '✕' : '☰'}
        </span>
      </button>
    </div>
  )
}
