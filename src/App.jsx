import { useState, useCallback, useRef, useEffect } from 'react'
import TopBar from './components/TopBar'
import BurgerMenu from './components/BurgerMenu'
import Grid from './components/Grid'
import NotesArea from './components/NotesArea'
import { ALL_ITEMS } from './constants'

const INITIAL_PLAYERS = [{ id: 'me', name: 'Me', isMe: true }]
const STORAGE_KEY = 'cluedo_state'

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {}
}

function buildEmptyGrid(players) {
  const g = {}
  for (const p of players) {
    g[p.id] = {}
    for (const item of ALL_ITEMS) {
      g[p.id][item] = null
    }
  }
  return g
}

function buildEmptyNoteGrid(players) {
  const g = {}
  for (const p of players) {
    g[p.id] = {}
    for (const item of ALL_ITEMS) {
      g[p.id][item] = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
  }
  return g
}

function mergePlayerIntoGrid(grid, newPlayer) {
  const updated = { ...grid, [newPlayer.id]: {} }
  for (const item of ALL_ITEMS) {
    updated[newPlayer.id][item] = null
  }
  return updated
}

function mergePlayerIntoNoteGrid(noteGrid, newPlayer) {
  const updated = { ...noteGrid, [newPlayer.id]: {} }
  for (const item of ALL_ITEMS) {
    updated[newPlayer.id][item] = [0, 0, 0, 0, 0, 0, 0, 0, 0]
  }
  return updated
}

export default function App() {
  const [players, setPlayers] = useState(() => loadState()?.players ?? INITIAL_PLAYERS)
  const [grid, setGrid] = useState(() => loadState()?.grid ?? buildEmptyGrid(INITIAL_PLAYERS))
  const [noteGrid, setNoteGrid] = useState(() => loadState()?.noteGrid ?? buildEmptyNoteGrid(INITIAL_PLAYERS))
  const [noteMode, setNoteMode] = useState(() => loadState()?.noteMode ?? false)
  const [notes, setNotes] = useState(() => loadState()?.notes ?? '')
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  // Persist all state to localStorage whenever anything changes
  useEffect(() => {
    saveState({ players, grid, noteGrid, noteMode, notes })
  }, [players, grid, noteGrid, noteMode, notes])

  useEffect(() => {
    function handleClick(e) {
      if (menuOpen && menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('touchstart', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('touchstart', handleClick)
    }
  }, [menuOpen])

  const addPlayer = useCallback((name) => {
    const id = 'p_' + Date.now()
    const newPlayer = { id, name, isMe: false }
    setPlayers(prev => [...prev, newPlayer])
    setGrid(prev => mergePlayerIntoGrid(prev, newPlayer))
    setNoteGrid(prev => mergePlayerIntoNoteGrid(prev, newPlayer))
  }, [])

  const removePlayer = useCallback((id) => {
    setPlayers(prev => prev.filter(p => p.id !== id))
    setGrid(prev => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    setNoteGrid(prev => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }, [])

  const cycleCell = useCallback((playerId, item) => {
    const STATES = [null, 'tick', 'cross', 'q', 'd1', 'd2', 'd3']
    setGrid(prev => {
      const current = prev[playerId]?.[item] ?? null
      const idx = STATES.indexOf(current)
      const next = STATES[(idx + 1) % STATES.length]
      return {
        ...prev,
        [playerId]: { ...prev[playerId], [item]: next }
      }
    })
  }, [])

  const cycleNoteCell = useCallback((playerId, item, subIdx) => {
    setNoteGrid(prev => {
      const arr = [...(prev[playerId]?.[item] ?? [0,0,0,0,0,0,0,0,0])]
      arr[subIdx] = (arr[subIdx] + 1) % 3
      return {
        ...prev,
        [playerId]: { ...prev[playerId], [item]: arr }
      }
    })
  }, [])

  const resetBoard = useCallback(() => {
    setGrid(buildEmptyGrid(players))
    setNoteGrid(buildEmptyNoteGrid(players))
    setNotes('')
    localStorage.removeItem(STORAGE_KEY)
  }, [players])

  const appStyle = {
    minHeight: '100vh',
    background: 'radial-gradient(ellipse at top left, #1a0a05 0%, #0d0d0d 55%, #05050f 100%)',
    color: '#e7e5e4',
    fontFamily: 'Georgia, serif',
    display: 'flex',
    flexDirection: 'column',
  }

  return (
    <div style={appStyle}>
      <div ref={menuRef} style={{ position: 'relative' }}>
        <TopBar
          menuOpen={menuOpen}
          onMenuToggle={() => setMenuOpen(o => !o)}
          noteMode={noteMode}
          onNoteModeToggle={() => setNoteMode(m => !m)}
        />
        {menuOpen && (
          <BurgerMenu
            players={players}
            onAddPlayer={addPlayer}
            onRemovePlayer={removePlayer}
            onReset={resetBoard}
            onClose={() => setMenuOpen(false)}
          />
        )}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', paddingTop: '56px' }}>
        <Grid
          players={players}
          grid={grid}
          noteGrid={noteGrid}
          noteMode={noteMode}
          onCycleCell={cycleCell}
          onCycleNoteCell={cycleNoteCell}
        />
        <NotesArea notes={notes} onChange={setNotes} />
      </div>
    </div>
  )
}
