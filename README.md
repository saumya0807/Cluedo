# Cluedo Detective Tracker

A mobile-first, dark-themed single-page web app for tracking clues during a game of Cluedo (Clue). Built with React + Vite, zero external UI libraries.

## Features

- **Grid tracker** — 21 cards (suspects, weapons, rooms) × all players. Tap any cell to cycle through 7 states: unknown → confirmed → eliminated → suspect → seen once/twice/three times.
- **Note mode** — toggle to turn every cell into a 3×3 sub-grid for granular per-card notes (empty / suspect / confirmed sub-states).
- **Player management** — add/remove players via the burger menu. "Me" is always first and protected. Each player gets a colour-coded column with a rotated name header.
- **Legend** — quick-reference state guide in the burger menu.
- **Reset board** — clears all cell state and notes with a confirmation step.
- **Notes textarea** — free-text area at the bottom for jotting down deductions and tells.

## Tech Stack

- React 19 (Vite scaffold)
- Plain inline styles — no Tailwind, no CSS modules, no UI libraries
- Fully static build, deploy-ready for Vercel / Netlify

## Getting Started

```bash
npm install
npm run dev
```

## Build & Deploy

```bash
npm run build    # outputs to dist/
npm run preview  # local preview of the production build
```

The `dist/` folder is a standard static site. Connect this repo to Vercel — it will auto-detect the Vite framework and deploy with zero config.

## State Shape

```js
players  = [{ id, name, isMe }]
grid     = { [playerId]: { [itemName]: 'tick'|'cross'|'q'|'d1'|'d2'|'d3'|null } }
noteGrid = { [playerId]: { [itemName]: [0|1|2, ...9 values] } }
noteMode = boolean
notes    = string
```
