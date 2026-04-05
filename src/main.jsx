import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

// Global baseline styles
const style = document.createElement('style')
style.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; }
  body {
    background: #0d0d0d;
    color: #e7e5e4;
    font-family: Georgia, serif;
    -webkit-font-smoothing: antialiased;
    overscroll-behavior: none;
  }
  #root { height: 100%; }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: #1c1917; }
  ::-webkit-scrollbar-thumb { background: #44403c; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #57534e; }
  input::placeholder { color: #57534e; }
  textarea::placeholder { color: #44403c; }
`
document.head.appendChild(style)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
