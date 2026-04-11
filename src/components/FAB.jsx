const FONT_BODY = "'Inter', system-ui, sans-serif"

function UndoIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <path d="M3 6.5h7a4.5 4.5 0 1 1 0 9H6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 6.5L5.5 4M3 6.5L5.5 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function RedoIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <path d="M14 6.5H7a4.5 4.5 0 1 0 0 9h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 6.5L11.5 4M14 6.5L11.5 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LockIcon({ locked }) {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <rect x="2.5" y="7.5" width="12" height="8" rx="1.5" fill="currentColor" />
      {locked ? (
        <path d="M5 7.5V6A3.5 3.5 0 0 1 12 6v1.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M5 7.5V6A3.5 3.5 0 0 1 12 6" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      )}
    </svg>
  )
}

export default function FAB({ canUndo, canRedo, locked, onUndo, onRedo, onToggleLock, lightMode }) {
  const shadow = lightMode
    ? '0 2px 10px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.08)'
    : '0 2px 10px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.4)'

  const btnBase = {
    width: '44px', height: '44px',
    borderRadius: '50%',
    border: lightMode ? '1px solid #d6d3d1' : '1px solid #2a2826',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
    fontFamily: FONT_BODY,
    transition: 'background 0.15s, color 0.15s, opacity 0.15s',
    boxShadow: shadow,
    outline: 'none',
  }

  const actionBtn = (active) => ({
    ...btnBase,
    background: lightMode ? '#eceae6' : '#1f1d1b',
    color: active
      ? (lightMode ? '#1c1917' : '#e7e5e4')
      : (lightMode ? '#c4c0bb' : '#44403c'),
    opacity: active ? 1 : 0.55,
    cursor: active ? 'pointer' : 'default',
  })

  const lockBtn = {
    ...btnBase,
    background: locked
      ? (lightMode ? '#fef3c7' : '#3a1e00')
      : (lightMode ? '#eceae6' : '#1f1d1b'),
    color: locked
      ? (lightMode ? '#92400e' : '#fbbf24')
      : (lightMode ? '#1c1917' : '#e7e5e4'),
    border: locked
      ? (lightMode ? '1px solid #fcd34d' : '1px solid #78350f')
      : btnBase.border,
  }

  return (
    <div
      role="group"
      aria-label="Board controls"
      style={{
        position: 'fixed', bottom: '24px', right: '16px',
        display: 'flex', flexDirection: 'column', gap: '10px',
        zIndex: 100,
      }}
    >
      <button
        onClick={onUndo}
        disabled={!canUndo}
        aria-label="Undo last change"
        style={actionBtn(canUndo)}
      >
        <UndoIcon />
      </button>
      <button
        onClick={onRedo}
        disabled={!canRedo}
        aria-label="Redo last change"
        style={actionBtn(canRedo)}
      >
        <RedoIcon />
      </button>
      <button
        onClick={onToggleLock}
        aria-label={locked ? 'Unlock board' : 'Lock board'}
        aria-pressed={locked}
        style={lockBtn}
      >
        <LockIcon locked={locked} />
      </button>
    </div>
  )
}
