# Camera Health — WatchMeGrow

Design prototypes for **camera health**: a live board showing every camera's most
recent heartbeat, so a center admin, regional manager, or exec can see what is down
right now and for how long.

The same feature is built at **two altitudes**, so the placement decision can be made
by looking at it rather than by arguing about it.

| Page | Version | What it is |
|---|---|---|
| [`index.html`](index.html) | **A · Nested** | Camera health as the first sub-tab of the camera section, beside Live / History / Saved Clips / Admin Display |
| [`fleet.html`](fleet.html) | **B · Toggle** | Camera health at *account* altitude — above center selection, with no center selected and the center-scoped nav hidden |
| [`rationale.html`](rationale.html) | — | Design notes: the two altitudes, layout decisions, refresh contract, accessibility, open questions |

A version switcher is pinned to the bottom of every page.

## The difference in one line

Version A puts a cross-center view *inside* the center-scoped part of the app, which is
cheap to ship but leaves the header naming one center while the page reports on fourteen.
Version B introduces an account scope that sits above center selection, which resolves
that seam honestly but is genuinely new navigation.

## What these are and aren't

Front-end prototypes with **stand-in data** — no API, no database. Statuses are generated
from a fixed seed and mutated on each refresh so the live behavior can be evaluated. The
14 centers, store numbers, room names, and recorder IDs are invented.

Not production code. They exist to settle the interaction design before anyone writes a query.

## Trying them

Open either file directly in a browser — self-contained, no build step, no dependencies
beyond a Google Fonts stylesheet.

**Version A · Nested** — worth exercising:

- **Scope** opens on a single center; switch to **All centers** for the multi-center board.
- **Auto-refresh** runs a 30s cycle with a visible countdown, pause, and refresh-now, and
  stops on its own when the tab is hidden, a drawer is open, or you are typing a filter.
- **Deferred reordering** — hover the list and refresh a few times. Rankings are held behind
  a "Ranking changed — reorder" pill rather than moving rows under your cursor.
- **Keyboard** — each center's grid is one tab stop with arrow-key navigation, not one stop
  per camera.

**Version B · Toggle** — worth exercising:

- **Cold start.** It opens on the dashboard with no center selected, which is why its camera
  panel reads "Error! Unable to load requested cameras." Switch on **Camera health** in the
  search field to enter focus mode: left nav hidden, field reading "All my centers".
- **Every center is listed**, paginated, with the sort deciding what floats to the top —
  there is no problems-first/all-centers mode switch.
- **No center view.** Center names are labels, not links, and a camera's modal offers only
  Status, duration, Last checked, Room, and a link to my.wmg. Camera health is the only
  place cameras are checked.
- **One filter dropdown** on the far right of the toolbar, with search on the left. State,
  brand, and sort live in a single grouped panel; whatever is active reads as a chip beside
  the trigger, with a count badge.
- **KPIs follow the filter.** Filter to one state and the four summary cards total that
  subset, with a line under them saying so and the fourth card switching to
  "Centers in view · of 14 assigned".
- **Saved views** — name the current mix of sort, filters, and search, then reapply or
  delete it from the chip row. Stored in your browser (`localStorage`) only, so it survives
  a reload but not a different device.
- **Single-center user** (prototype controls) shows the entry point disappearing when there
  is nothing to aggregate.

The dashed strip at the bottom of each page forces first-load, refresh-failure, and
all-healthy states. It is scaffolding, not part of the design.

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
generated from the sources in `../UX/Claude` by a local wrapper script that adds the
doctype, charset, viewport meta, favicon, and version switcher. Pushes to `main` deploy
automatically via the Vercel GitHub integration.
