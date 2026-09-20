# Ashish-Shukla-
Graphic design

## Lumina Transformation Tracker (current app)

A personal, fully offline daily habit tracker, todo list, and diary with a modern
3D glossy glass interface.

- **Just want to use it?** Open `index.html` (repo root) directly in any browser —
  no internet, no install, no server needed. It's a single self-contained file.
- Track custom daily habits/metrics (water, workout, sleep, etc.) with progress bars.
- Manage a daily todo list, write diary entries, and see day-by-day insights.
- All data is saved locally in the browser (`localStorage`) — nothing leaves your device.
- Works the same on desktop and mobile browsers — just open the file.

### Editing / customizing it further

The full editable source code lives in [`lumina-tracker/`](./lumina-tracker) (React +
Vite + Tailwind). To make changes and rebuild the single offline file:

```
cd lumina-tracker
bun install      # or: npm install
bun run build    # or: npm run build
```

This produces `lumina-tracker/dist/index.html` — a single self-contained file with
everything inlined (no separate JS/CSS files), so it still works fully offline when
opened directly. Copy it over the root `index.html` to update the live app.

### Older tracker

An earlier, simpler offline tracker (plain HTML/CSS/JS) is kept at
[`simple-tracker-offline.html`](./simple-tracker-offline.html) for reference.
