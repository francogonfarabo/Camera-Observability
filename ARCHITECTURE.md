# How this is built

One HTML file, no framework, no build step beyond `node build.js` stitching a
`<head>` onto a fragment. Everything below is about `src/camera-health.html`.

## The shape of it

```
S  ──►  render()  ──►  DOM
▲                       │
└───── events ──────────┘
```

`S` is one plain object holding view state: filters, sort, search, page, which
zoom the overview is at, what is open. Events mutate `S` and call `render()`.
`render()` reads `S` and `DATA` and rewrites the parts of the page that changed.
Nothing flows the other way — the DOM is never asked what the state is.

`DATA` is the fleet. It is generated from a seeded PRNG at load, never fetched,
and the refresh tick mutates it in place to simulate cameras changing.

## The four rules

**1. Derive, never remember.** Anything that can be computed from `S` is
computed on render rather than stored. A filter that no longer matches anything
is dropped by re-deriving the option list, not by a flag somebody has to
remember to clear. This is why the code has no invalidation bugs: there is
almost nothing to invalidate. The one exception is `GEN`, a counter bumped on
every mutation, which keys the per-center tally cache — at 4,000 centers the
sort alone asks for tens of thousands of tallies per repaint.

**2. One vocabulary.** A center is *fully down*, *needs attention*, or *all
healthy* — three states, mutually exclusive, defined once in `STATE_NAME` and
`centerStatus()`. The overview squares, the status filter, the legend and the
headline count all read from those, so they cannot disagree. Change the wording
in `STATE_NAME` and it changes everywhere.

Staleness is deliberately *not* a fourth state. A camera can be "offline, and
that reading is two hours old" — two facts about two different objects. Stale
renders as a veil over a status (desaturated, dashed ring), never as a
replacement for one. Throwing away the last known status is exactly what triage
cannot afford.

**3. Never move what someone is using.** The board refreshes every 30 seconds
and re-sorts on a changing field, so this is a real hazard. The list holds its
ranking while you are reading it; the overview holds its cell order while the
pointer is inside it or focus is within it; the tooltip re-anchors to the node
that replaced the one it was attached to. Fills keep updating throughout — only
*membership and order* wait.

**4. The data is invented, and says so.** Everything is seeded, so every reload
tells the same story. The three fleet sizes **nest**: the first 74 centers of
the 4,000 are the 74, camera for camera, because `seeds()` draws in the same
order whatever the target and `build()` re-seeds per center from its index.
Changing size changes who you can see, never what is wrong with them.

## The one non-obvious piece: the overview

"Your centers" is three rows tall at every fleet size, which means a cell cannot
always be a center. `autoDim()` walks the groupings finest-first and takes the
first that draws at a size worth reading — a square per center at 74, a tile per
state at 4,000. Two things about it trip people up:

- **It measures *drawn* cells, not centers.** Healthy cells fold away so the
  problems stay visible, so at 4,000 centers it is weighing 745 unhealthy ones.
  `drawnCount()` inverts to all cells when nothing needs attention, or a healthy
  fleet would draw an empty band.
- **Auto is a mode, not a zoom.** Off does not mean "no zoom" — it pins whatever
  is on screen. That is why a zoom Auto chose and a zoom you pinned look
  different: without that, switching Auto off would change nothing visible.

## Where to look

| | |
|---|---|
| `src/camera-health.html` | the board. Section map at the top of its `<script>` |
| `src/rationale.html` | design notes — built, deployed, deliberately unlinked |
| `src/archive/` | superseded directions, see `archive/README.md` |
| `build.js` | fragment → page. Run it after every source edit |

Generated files at the repo root are committed because Vercel runs no build
step. **Edit a fragment, forget `node build.js`, and the deploy silently does
not change.** That is the only trap in this layout.
