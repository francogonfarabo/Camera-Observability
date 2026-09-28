# Camera Health — WatchMeGrow

Design prototype for **camera health**: a live board showing every camera's most recent
heartbeat, so a regional or multi-site manager can answer "why can't parents at Store 4471
see anything?" in seconds — and know whether that is one camera or the whole site.

Camera health has its own top-level rail item, **Monitoring**, set apart from the
center-scoped icons (Cameras, Dashboard, Users, …) by a divider: it covers the whole
assignment and deliberately ignores the center picker in the header.

One board is live.

| Page | What it is |
|---|---|
| [`index.html`](index.html) | The board |
| [`rationale.html`](rationale.html) | Design notes: the decisions, what came out again, and why |

Nothing links between them any more. The board carries no version bar; the notes are built and
reachable at their own address, and that is deliberate — a prototype handed to someone should open
on the thing being judged, not on a menu of alternatives.

Everything on it is **generated**: eight invented chains plus a twelfth of the fleet trading under no
chain at all, spread across all 51 US jurisdictions and six Canadian provinces. The dashed strip at the
bottom sizes the fleet — **74**, **600** or **4,000** centers — and 4,000 is the ceiling the board is
designed against. See *What these are and aren't* below.

## What it does

- **"Your centers"** — an always-visible overview of the whole assignment, above the list.
  One cell is a center while that fits and a **state or a brand once it doesn't**, so the
  overview stays three rows tall whether you manage seventy centers or four thousand.
  The `Center / State / Brand` control makes that zoom explicit, and **`Auto`** — a segment of
  its own, with a lamp — picks the finest one that still draws legibly. Hovering `Auto` shows
  its working: every grouping it weighed, the cell count for each, and which one it took and
  why. Press a zoom to hold the board there; press `Auto` to hand the choice back. Click a
  center to search it, click a group to filter to it, and the overview collapses to a 32px
  sticky strip once you scroll past it.
- **Three center states, and only three** — red when *every* camera at a site is offline,
  green when nothing is offline and nothing impaired, orange for everything between. The
  same red/orange/green, by the same rule, at every zoom.
- **Four numbers** across the top — centers needing attention, cameras offline, cameras
  degraded, longest outage. Each doubles as a one-click filter, and each goes calm rather
  than alert-red when it reads zero.
- **Filters and sort as two separate controls** — eight facets (stale camera data, center
  status, camera health, brand, parent access, country, state, city),
  multi-select within a category and ANDed across them, with live counts computed from the
  centers passing your *other* choices. A category that has only one value left in it is
  dropped from the rail rather than offered — filter down to one state and Country stops being a
  choice and starts being a statement, so the row goes. It comes back on its own. Stale camera data is a switch rather than a list and leads the rail: a
  reading being stale is a statement about the reading, not a fourth thing a camera can be.
  Five sort fields, each naming a field and never an order.
- **Saved views** — name the current filter/sort/search combination and reapply it.
  Browser-local.
- **Auto-refresh** on a visible 30s cycle with pause and refresh-now. It stops on its own
  when the tab is hidden, a camera is open, or you are typing — and it never reorders the
  list or the overview under your cursor.
- **Stale camera data** — a camera whose assessment has gone stale keeps its last known
  status, loses its saturation and gains a dashed ring. The board never claims to know
  more than it does.

## What these are and aren't

A front-end prototype with **no API and no database**.

**Every center is invented**, and so is every camera on it. The chains, the independent sites, the
cities, the store numbers, how many cameras a site has, which are dark or impaired, how long they
have been that way and when each was last assessed all come from one fixed seed, and mutate on each
refresh so the live behaviour can be judged.

A real customer roster — 1,231 Learning Care Group sites — sat here between 21 and 28 September 2026
and was taken back out. It belongs to the client build, which is a separate repo. Two reasons: a
board that has to survive four thousand centers cannot be designed against a list that stops at
twelve hundred, and real center names are not something to leave lying in a prototype that is not
for that customer. It is in this repo's history if it is ever wanted again.

About **2.5% of cameras** are offline or impaired at any moment, which at 4,000 centers and 67,683
cameras leaves 37 fully down, 708 needing attention and 3,255 all healthy. The rate is the same at
every size, and the sizes **nest** — the first 74 centers of the 4,000 are the 74, camera for camera,
so changing size changes who you can see and never what is wrong with them.

The dashed strip at the bottom of the page forces first-load, refresh-failure and all-healthy states,
and sizes the fleet: **74**, **600** or **4,000**. 74 is every state and DC once, every third one
twice — the size at which a square per center is obviously the right cell. 600 is a region. 4,000 is
the only one of the three that proves anything, because a band, a sort and a filter panel that all
hold at 600 can fall over at four thousand. It is scaffolding, not part of the design.

Not production code. These exist to settle the interaction design before anyone writes a
query.

## Archived versions

Three earlier shapes are still deployed so no link ever breaks, but are not linked from
anywhere and carry an "Archived — superseded" bar:

- [`tone.html`](tone.html) — the fork in which hue and saturation rather than silhouette separated
  the states, on the synthetic fleet. Archived 21 Sep 2026, kept because the question it was built
  to answer is still open.
- [`nested.html`](nested.html) — one square per center in the overview, ordered worst-first
  with the healthy tail folded into a count. The right move, and not enough on its own past
  a few hundred centers.
- [`fleet.html`](fleet.html) — camera health at account altitude, reached by a toggle in the
  header rather than living under Monitoring.

The design notes carry the full comparison and why each was worth building before choosing.

## Visual language

Taken from `STYLE_GUIDE.md` in the
[Camera-and-Room-Management-WMG](https://github.com/francogonfarabo/Camera-and-Room-Management-WMG)
repo: DM Sans for UI, Titillium Web 700 uppercase for labels, `#159deb` primary blue, and
the semantic trio `#dc2626` offline / `#f97316` degraded / `#16a34a` normal. Light theme
only, matching the rest of the admin console.

Status is encoded by **shape as well as colour** — a cross for offline, a diagonal hatch for
degraded, a flat fill for normal — because the board's whole meaning would otherwise ride on
the red/green pair that fails for red-green colour blindness. Below 13px the squares stop
shrinking and the overview changes zoom instead, since colour on its own is not an encoding.

Keyboard: each grid is one tab stop with arrow-key navigation, not one stop per camera.

## Deployment

Static site, no build step in CI. Every page here is generated from the sources in
`../UX/Claude` by a local wrapper script that adds the doctype, charset, viewport meta,
favicon and, on archived pages only, the superseded banner. Pushes to `main` deploy
automatically via the Vercel GitHub integration.
