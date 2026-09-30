/* Wrap the source fragments in src/ into standalone pages at the repo root.
 *
 * A fragment starts at <title> and has no doctype, <html>, <head> or <body>;
 * this adds them. The split point is the first </style> — everything before it
 * is head, everything after is body.
 *
 * Run `node build.js` after editing anything in src/. Vercel runs no build
 * step, so the generated files are committed and the deployed site is exactly
 * what is in git. Edit a fragment, forget to build, and the deploy silently
 * does not change. That is the one trap in this layout.
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');

const FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%23159deb'/%3E%3Cpath d='M6 11h13v10H6z' fill='none' stroke='white' stroke-width='2.4' stroke-linejoin='round'/%3E%3Cpath d='M19 15l7-3.5v9L19 17' fill='none' stroke='white' stroke-width='2.4' stroke-linejoin='round'/%3E%3C/svg%3E";

/* Archived pages stay deployed so old links keep working, but they say they are
   archived rather than looking current. Live pages get none of this. */
const BANNER_CSS = `
<style>
.vsw{position:fixed;left:50%;transform:translateX(-50%);bottom:14px;z-index:80;display:flex;align-items:center;gap:4px;
  background:rgba(55,65,81,.96);border:1px solid #374151;border-radius:9999px;padding:4px;
  box-shadow:0 6px 24px rgba(0,0,0,.16);backdrop-filter:blur(6px);font-family:'DM Sans',system-ui,sans-serif}
.vsw b{font-family:'Titillium Web',sans-serif;font-size:9.5px;font-weight:700;letter-spacing:.09em;
  text-transform:uppercase;color:#fcd34d;padding:0 8px 0 10px;white-space:nowrap}
.vsw .was{font-size:11.5px;color:#d1d5db;padding-right:4px;white-space:nowrap}
.vsw a{display:inline-flex;align-items:center;padding:6px 13px;border-radius:9999px;font-size:12.5px;
  font-weight:700;color:#fff;background:rgba(255,255,255,.14);text-decoration:none;white-space:nowrap}
.vsw a:hover{background:rgba(255,255,255,.26)}
.page-inner{padding-bottom:82px}
.wrap{padding-bottom:70px}
@media (max-width:640px){ .vsw b,.vsw .was{display:none} .vsw a{padding:6px 10px;font-size:12px} }
</style>`;

const banner = home => `
<nav class="vsw" aria-label="Prototype version">
  <b>Archived</b>
  <span class="was">superseded — kept for reference</span>
  <a href="${home}">Go to the current board</a>
</nav>`;

const pages = [
  { src: 'camera-health.html', out: 'index.html',
    desc: 'Camera health under its own Monitoring rail item — live per-camera status across every assigned center, with an overview that changes altitude as the assignment grows, filtering, sorting, saved views and a camera detail modal.' },

  // Built and reachable, deliberately not linked from the board.
  { src: 'rationale.html', out: 'rationale.html',
    desc: 'Design notes for the camera-health feature: layout decisions, the refresh contract, accessibility, and open questions.' },

  // Superseded directions. See archive/README.md for what each one tested.
  { src: 'archive/tone.html', out: 'archive/tone.html', archived: true,
    desc: 'Archived. The fork in which hue and saturation rather than silhouette separate the states — superseded.' },
  { src: 'archive/nested.html', out: 'archive/nested.html', archived: true,
    desc: 'Archived. The board with one square per center in the overview — superseded.' },
  { src: 'archive/fleet.html', out: 'archive/fleet.html', archived: true,
    desc: 'Archived. Camera health at account altitude, reached by a toggle in the header — superseded.' },
];

for (const p of pages) {
  const raw = fs.readFileSync(path.join(SRC, p.src), 'utf8');
  const cut = raw.indexOf('</style>');
  if (cut === -1) throw new Error('no </style> found in ' + p.src);
  const head = raw.slice(0, cut + '</style>'.length).trim();
  const body = raw.slice(cut + '</style>'.length).trim();
  if (!/<title>/.test(head)) throw new Error('no <title> in head of ' + p.src);

  // "../index.html" from archive/, "index.html" from the root.
  const home = '../'.repeat(p.out.split('/').length - 1) + 'index.html';

  const doc = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="${p.desc}">
<meta name="robots" content="noindex">
<link rel="icon" href="${FAVICON}">
${head}${p.archived ? BANNER_CSS : ''}
</head>
<body>
${body}${p.archived ? banner(home) : ''}
</body>
</html>
`;
  const dest = path.join(ROOT, p.out);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, doc, 'utf8');
  console.log(p.out.padEnd(22), (doc.length / 1024).toFixed(1) + ' KB', p.archived ? '(archived)' : '');
}
