# Camera Observability — WatchMeGrow

Design prototype for the **current-status camera view**: a live board showing every
camera's most recent heartbeat across one or many centers, so a center admin,
regional manager, or exec can see what is down right now and for how long.

| Page | What it is |
|---|---|
| [`index.html`](index.html) | Clickable prototype — the board itself |
| [`rationale.html`](rationale.html) | Design notes: decisions, departures from the original mockup, refresh contract, accessibility, open questions |

## What this is and isn't

It is a **front-end prototype with stand-in data** — no API, no database. Camera
statuses are generated in-page from a fixed seed and mutated on each refresh so the
live behavior can be evaluated. The 14 centers, store numbers, and room names are
invented.

It is not production code. It exists to settle the interaction design before anyone
writes a query.

## Trying it

Open `index.html` directly in a browser — both pages are self-contained, with no
build step and no dependencies beyond a Google Fonts stylesheet.

Things worth exercising:

- **Scope** — opens on a single center (the one a user would be viewing). Switch to
  **All centers** for the multi-center board.
- **Auto-refresh** — 30s cycle with a visible countdown, pause, and refresh-now. It
  stops on its own when the tab is hidden, a camera drawer is open, or you are typing
  in the filter box.
- **Deferred reordering** — hover the list and refresh a few times. Rankings are held
  behind a "Ranking changed — reorder" pill rather than moving rows under your cursor.
- **A camera** — click any block for the detail drawer; `←` / `→` walk the center's
  cameras, `Esc` closes and returns focus.
- **Keyboard** — each center's grid is one tab stop with arrow-key navigation, not one
  stop per camera.
- **Prototype controls** — the dashed strip at the bottom forces first-load, refresh
  failure, and all-healthy states. It is scaffolding, not part of the design.

## Visual language

Taken from `STYLE_GUIDE.md` in the
[Camera-and-Room-Management-WMG](https://github.com/francogonfarabo/Camera-and-Room-Management-WMG)
repo: DM Sans for UI, Titillium Web 700 uppercase for labels, `#159deb` primary blue,
and the semantic trio `#dc2626` offline / `#f97316` degraded / `#16a34a` normal. Light
theme only, matching the rest of the admin console.

Status is encoded by **shape as well as color** — a cross for offline, a diagonal hatch
for degraded, a flat fill for normal — because the board's whole meaning otherwise rides
on the red/green pair that fails for red-green color blindness.

## Deployment

Static site, no build step. Vercel serves the repo root as-is; pushes to `main` deploy
automatically via the GitHub integration.
