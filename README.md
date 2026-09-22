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

It carries the **real roster**: 1,231 Learning Care Group centers as of 21 September 2026, with their
brands, store numbers, cities and states. Thirteen brands, 41 states, 698 cities. The cameras on those
centers are invented — see *What these are and aren't* below.

## What it does

- **"Your centers"** — an always-visible overview of the whole assignment, above the list.
  One cell is a center while that fits and a **brand or a state once it doesn't**, so the
  overview stays three rows tall whether you manage sixty centers or the whole 1,231.
  The `Cell` control makes that zoom explicit; `AUTO` picks the finest one that still
  draws legibly. Click a center to search it, click a group to filter to it, and the
  overview collapses to a 32px sticky strip once you scroll past it.
- **Three center states, and only three** — red when *every* camera at a site is offline,
  green when nothing is offline and nothing impaired, orange for everything between. The
  same red/orange/green, by the same rule, at every zoom.
- **Four numbers** across the top — centers needing attention, cameras offline, cameras
  degraded, longest outage. Each doubles as a one-click filter, and each goes calm rather
  than alert-red when it reads zero.
- **Filters and sort as two separate controls** — nine facets (out-of-date readings, center
  status, cameras inside, brand, payment model, parent access, country, state, city),
  multi-select within a category and ANDed across them, with live counts computed from the
  centers passing your *other* choices. A category that has only one value left in it is
  dropped from the rail rather than offered: Country is the live case, since the roster is
  entirely US. It reappears on its own the day a second country does. Out-of-date readings is a switch rather than a list and leads the rail: a
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

A front-end prototype with **no API and no database**.

The **centers are real**: names, brands, store numbers, cities and states come from the Learning
Care Group roster of 21 September 2026. Brand is read from the centernumber prefix rather than the
name, because thirty-three sites do not lead with their brand — thirty Montessori Unlimited
locations named for a neighbourhood, a typo, and two La Petite sites inside a partner — and every
one of them knows its prefix. Two edits were made and are visible in the source: sites with a
missing or duplicated store number were given the next free code in their brand's block, and the
235 sites sharing a name with another now carry their store number in brackets.

The **cameras are invented**. How many a site has, which are dark or impaired, how long they have
been that way and when each was last assessed all come from one fixed seed, and mutate on each
refresh so the live behaviour can be judged. 20,744 cameras across the roster, of which about 2.5%
are offline or impaired at any moment — leaving 9 centers fully down, 203 needing attention and
1,019 all reporting.

The dashed strip at the bottom of the page forces first-load, refresh-failure and all-healthy
states, and switches the assignment between three sets of brands — **6 brands / 57 centers**,
**4 brands / 398**, and **all 13 / 1,231**. Brands rather than counts, because nobody is assigned
"the first four hundred centers in the file"; you cover some chains and you get however many
centers they have. It is scaffolding, not part of the design — it exists so the overview can be
judged at the altitudes a smaller assignment puts it in.

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
