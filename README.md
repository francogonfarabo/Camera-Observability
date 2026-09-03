# Camera Health — WatchMeGrow

Design prototype for **camera health**: a live board showing every camera's most recent
heartbeat, so a center admin, regional manager, or exec can see what is down right now
and for how long.

Camera health has its own top-level rail item, **Monitoring** — set apart from the
center-scoped section icons (Cameras, Dashboard, Users, …) by a subtle divider, since it
answers a different kind of question than any of them.

| Page | What it is |
|---|---|
| [`index.html`](index.html) | Camera health under **Monitoring**, with Live / History / Saved Clips / Admin Display as its sub-tabs |
| [`rationale.html`](rationale.html) | Design notes: layout decisions, the refresh contract, accessibility, open questions |

A version switcher is pinned to the bottom of both pages.

## A hidden second version still exists

This project explored two placements for camera health — nested under a section's own
sub-nav (what's linked above) versus living at *account* altitude above center selection
entirely, reached by a toggle in the header. The account-altitude version (`fleet.html`)
is still in the repo and still deployed, but is no longer linked from the switcher — the
nested placement is the one going forward. See the design notes for the full comparison
and why both were worth building before choosing.

## What these are and aren't

Front-end prototypes with **stand-in data** — no API, no database. Statuses are generated
from a fixed seed and mutated on each refresh so the live behavior can be evaluated. The
14 centers, store numbers, room names, and recorder IDs are invented.

Not production code. They exist to settle the interaction design before anyone writes a query.

## Trying it

Open `index.html` directly in a browser — self-contained, no build step, no dependencies
beyond a Google Fonts stylesheet.

- **Monitoring**, top of the left rail, is where camera health lives — set apart from
  Cameras/Dashboard/Users/etc. by a divider, since it isn't scoped to a center the way
  they are.
- **Scope** opens on a single center; switch to **All centers** for the multi-center board.
- **One filter dropdown** on the far right of the toolbar — Status, Brand, State, and Sort
  grouped in one panel, with Parent-facing as an audience toggle beneath the columns.
  Search stays on the left. Active filters read as chips beside the trigger; KPI tiles
  still work as one-click shortcuts into the same panel.
- **KPIs follow the filter** and go calm (grey, not alert red/orange) when Offline or
  Degraded read zero.
- **Saved views** — name the current status/brand/state/audience/sort/search combination,
  reapply or delete it from the chip row. Stored in your browser (`localStorage`) only.
- **Notes per center** — the small button beside a center's meta line expands a plain
  textbox in place. A dot on the button is the only sign a note exists; text saves as you
  type and survives a reload.
- **Auto-refresh** runs a 30s cycle with a visible countdown, pause, and refresh-now, and
  stops on its own when the tab is hidden, a drawer is open, or you are typing a filter.
- **Deferred reordering** — hover the list and refresh a few times. Rankings are held behind
  a "Ranking changed — reorder" pill rather than moving rows under your cursor.
- **Keyboard** — each center's grid is one tab stop with arrow-key navigation, not one stop
  per camera.

The dashed strip at the bottom of the page forces first-load, refresh-failure, and
all-healthy states. It is scaffolding, not part of the design.

`fleet.html` — the hidden account-altitude version — has its own equivalent set of
controls; see the design notes for what differs.

## Visual language

Taken from `STYLE_GUIDE.md` in the
[Camera-and-Room-Management-WMG](https://github.com/francogonfarabo/Camera-and-Room-Management-WMG)
repo: DM Sans for UI, Titillium Web 700 uppercase for labels, `#159deb` primary blue, and
the semantic trio `#dc2626` offline / `#f97316` degraded / `#16a34a` normal. Light theme
only, matching the rest of the admin console.

Status is encoded by **shape as well as color** — a cross for offline, a diagonal hatch for
degraded, a flat fill for normal — because the board's whole meaning otherwise rides on the
red/green pair that fails for red-green color blindness.

## Deployment

Static site, no build step in CI. `index.html`, `fleet.html`, and `rationale.html` are
all generated from the sources in `../UX/Claude` by a local wrapper script that adds the
doctype, charset, viewport meta, favicon, and version switcher — `fleet.html` still
builds and deploys, it's just left out of the switcher's links. Pushes to `main` deploy
automatically via the Vercel GitHub integration.
