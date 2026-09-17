# Camera Health — WatchMeGrow

Design prototype for **camera health**: a live board showing every camera's most recent
heartbeat, so a regional or multi-site manager can answer "why can't parents at Store 4471
see anything?" in seconds — and know whether that is one camera or the whole site.

Camera health has its own top-level rail item, **Monitoring**, set apart from the
center-scoped icons (Cameras, Dashboard, Users, …) by a divider: it covers the whole
assignment and deliberately ignores the center picker in the header.

Two versions of the board are live, named for what carries a distinction in each.

| Page | What it is |
|---|---|
| [`index.html`](index.html) | **Tone** — hue and saturation carry the distinctions |
| [`shape.html`](shape.html) | **Shape** — silhouette carries them |
| [`rationale.html`](rationale.html) | Design notes: the decisions, what came out again, and why |

A switcher is pinned to the bottom of all three.

**Shape** differs from Tone in three ways, all of them about the same question — what a reader
separates two things by:

- **The two oranges are split.** Hatch means a degraded *camera* and nothing else. A center needing
  attention is solid amber with a fixed triangular notch out of one corner. The notch never grows with
  the defect rate; the middle bucket stays ungraded.
- **An out-of-date reading is hollow rather than faded** — white, with a dashed stroke and its glyph in
  the last-known status colour. Solid versus outline separates before colour is read. How far out of
  date moves to text: a pill on the row, and one clause on the page subtitle.
- **The band's three states are filterable, and the legend is the control.** Three keys carrying mark,
  count and name — *2 fully down*, *27 need attention*, *44 all reporting*. Pressing one filters the list
  and leaves the band alone.

## What it does

- **"Your centers"** — an always-visible overview of the whole assignment, above the list.
  One cell is a center while that fits and a **brand or a state once it doesn't**, so the
  overview stays three rows tall whether you manage 73 centers or 4,000.
  The `Cell` control makes that zoom explicit; `AUTO` picks the finest one that still
  draws legibly. Click a center to search it, click a group to filter to it, and the
  overview collapses to a 32px sticky strip once you scroll past it.
- **Three center states, and only three** — red when *every* camera at a site is offline,
  green when nothing is offline and nothing impaired, orange for everything between. The
  same red/orange/green, by the same rule, at every zoom.
- **Four numbers** across the top — centers needing attention, cameras offline, cameras
  degraded, longest outage. Each doubles as a one-click filter, and each goes calm rather
  than alert-red when it reads zero.
- **Filters and sort as two separate controls** — eight facets (out-of-date readings, camera
  health, brand, payment model, parent access, country, state, city), multi-select within a
  category and ANDed across them, with live counts computed from the centers passing your
  *other* choices. Out-of-date readings is a switch rather than a list and leads the rail: a
  reading being stale is a statement about the reading, not a fourth thing a camera can be.
  Five sort fields, each naming a field and never an order.
- **Saved views** — name the current filter/sort/search combination and reapply it.
  Browser-local.
- **Auto-refresh** on a visible 30s cycle with pause and refresh-now. It stops on its own
  when the tab is hidden, a camera is open, or you are typing — and it never reorders the
  list or the overview under your cursor.
- **Out-of-date readings** — a camera whose assessment has gone stale keeps its last known
  status, loses its saturation and gains a dashed ring. The board never claims to know
  more than it does.

## What these are and aren't

Front-end prototypes with **stand-in data** — no API, no database. Statuses come from a
fixed seed and mutate on each refresh so the live behaviour can be judged. The centers,
store numbers, room names and brands are invented; roughly one site in twelve deliberately
has no brand at all, because a grouped overview has to survive that.

The dashed strip at the bottom of the page forces first-load, refresh-failure and
all-healthy states, and switches the synthetic fleet between **73 / 600 / 4,000 centers**.
It is scaffolding, not part of the design — it exists so the overview can be judged at the
scale it claims to survive.

Not production code. These exist to settle the interaction design before anyone writes a
query.

## Archived versions

Two earlier shapes are still deployed so no link ever breaks, but are not linked from
anywhere and carry an "Archived — superseded" bar instead of the switcher:

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
favicon and switcher. Pushes to `main` deploy automatically via the Vercel GitHub
integration.
