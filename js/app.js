/* ------------------------------------------------------------------
   app.js — profile gate, state, rendering and interaction.

   FULL   every skill; the source of truth for progress and the card.
   VIEW   only the branches/tiers currently switched on; drives the board.

   With a couple of thousand nodes on the board, two things matter:
   building the DOM in one pass rather than element by element, and
   never touching an element during a refresh whose appearance has not
   actually changed.
------------------------------------------------------------------ */

const STORAGE_KEY = 'skill-tree.v2';
const ALL_TIERS = TIERS.map(t => t.tier);
const FULL = buildGraph();
let VIEW = FULL;

/* Canonical, stable id order — used to pack progress into the compact
   restore-code bitset printed on the PDF report. New skills appended to
   the data files land at the end, so old codes keep decoding correctly. */
const ID_ORDER = SKILLS.map(s => s.id);

/* Precomputed once — recomputing these per refresh is what makes a board
   this size feel slow. */
const CAT_NODES = new Map(CATEGORIES.map(c => [c.id, FULL.nodes.filter(n => n.cat === c.id)]));
const SEARCH_TEXT = new Map(FULL.nodes.map(n => [n.id, (n.name + ' ' + n.group + ' ' + n.desc).toLowerCase()]));

const state = {
  profile: null,               // { name, age, gender }
  learned: new Set(),
  selected: null,
  query: '',
  cats: new Set(CATEGORIES.map(c => c.id)),
  tiers: new Set(ALL_TIERS),
  statuses: new Set(['learned', 'available', 'locked']),
  view: { x: 0, y: 0, k: 1 },
  cardPos: null,                // { left, top } once dragged; else default corner
};

const el = {};
const nodeEls = new Map();     // currently-mounted node id -> <button>
let visibleNodeIds = null;     // ids syncVisibleNodes() decided belong on screen right now
let openFilter = null;          // 'branch' | 'tier' | 'status' | 'user' | null
let toastTimer = 0;

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const nf = n => n.toLocaleString('en-US');

/* ------------------------------ state ----------------------------- */

function xpOf(id) { return FULL.byId.get(id).tier * 10; }

function totalXp() {
  let xp = 0;
  for (const id of state.learned) xp += xpOf(id);
  return xp;
}

/* Each level costs a little more than the last: 100, 240, 408, ... */
function levelFor(xp) {
  let lvl = 1, need = 100, spent = 0;
  while (xp >= spent + need) { spent += need; lvl++; need = Math.round(need * 1.2 + 20); }
  return { level: lvl, into: xp - spent, need };
}

function isLearned(id) { return state.learned.has(id); }

function isAvailable(id) {
  const s = FULL.byId.get(id);
  return !isLearned(id) && s.req.every(r => isLearned(r));
}

function statusOf(id) {
  if (isLearned(id)) return 'learned';
  return isAvailable(id) ? 'available' : 'locked';
}

/* Unlearning a skill invalidates everything downstream of it. */
function descendantsOf(id) {
  const out = new Set();
  const stack = [id];
  while (stack.length) {
    for (const c of FULL.byId.get(stack.pop()).children) {
      if (!out.has(c)) { out.add(c); stack.push(c); }
    }
  }
  return out;
}

function learn(id) {
  if (!isAvailable(id)) return false;
  state.learned.add(id);
  save(); refresh(); flash(id);
  return true;
}

function unlearn(id) {
  if (!isLearned(id)) return;
  state.learned.delete(id);
  for (const d of descendantsOf(id)) state.learned.delete(d);
  save(); refresh();
}

function toggle(id) { isLearned(id) ? unlearn(id) : learn(id); }

/* Learn every prerequisite of `id`, deepest first, then `id` itself. */
function learnPath(id) {
  const order = [], seen = new Set();
  (function walk(n) {
    if (seen.has(n)) return;
    seen.add(n);
    for (const r of FULL.byId.get(n).req) walk(r);
    order.push(n);
  })(id);
  for (const n of order) state.learned.add(n);
  save(); refresh(); flash(id);
}

/* Drop any learned skill whose prerequisites are no longer satisfied. */
function prune() {
  let changed = true;
  while (changed) {
    changed = false;
    for (const id of [...state.learned]) {
      if (!FULL.byId.get(id).req.every(r => state.learned.has(r))) {
        state.learned.delete(id); changed = true;
      }
    }
  }
}

/* ------------------------------ persist ---------------------------- */

/* Browsers refuse localStorage on a file:// origin (Chrome and Safari both
   throw on access) and in some private windows. The tree still works, but
   nothing is remembered — which is worth saying out loud, because silently
   dropping every write loses a whole session's progress on the next reload
   and looks like the app is broken rather than the way it was opened. */
let storageOK = (() => {
  try {
    localStorage.setItem(STORAGE_KEY + '.probe', '1');
    localStorage.removeItem(STORAGE_KEY + '.probe');
    return true;
  } catch (e) { return false; }
})();

/* Says so in both places the user might be looking: the gate's footnote,
   which otherwise promises the opposite, and the app's warning strip. */
function warnNoStorage() {
  const onFile = location.protocol === 'file:';
  const why = onFile
    ? 'This page was opened directly from a file, and browsers block storage on file:// pages.'
    : 'This browser is blocking local storage (a private window will do that).';
  const fix = onFile ? ' Run it with run.py — see the README — to keep your progress.' : '';

  if (el.gateFoot) el.gateFoot.textContent = 'Progress will not be saved. ' + why + fix;
  const w = document.getElementById('warn');
  if (w) { w.hidden = false; w.textContent = 'Progress will not be saved. ' + why + fix; }
}

function save() {
  if (!storageOK) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      profile: state.profile,
      learned: [...state.learned],
      cats: [...state.cats],
    }));
  } catch (e) {
    storageOK = false;      // quota, or storage revoked mid-session
    warnNoStorage();
  }
}

function loadStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const saved = JSON.parse(raw);
    if (!saved.profile || !saved.profile.name) return false;

    state.profile = saved.profile;
    for (const id of saved.learned || []) if (FULL.byId.has(id)) state.learned.add(id);
    prune();

    const cats = (saved.cats || []).filter(c => CATEGORIES.some(x => x.id === c));
    if (cats.length) state.cats = new Set(cats);
    return true;
  } catch (e) { return false; }
}

/* ------------------------- restore-code codec ----------------------- */

/* Pack `learned` into a bitset over ID_ORDER, base64-encoded — compact
   regardless of how many skills are learned (~340 chars for all 2,044),
   short enough to print on the PDF report and paste back in by hand. */
function encodeProgress() {
  const bytes = new Uint8Array(Math.ceil(ID_ORDER.length / 8));
  ID_ORDER.forEach((id, i) => { if (state.learned.has(id)) bytes[i >> 3] |= (1 << (i & 7)); });
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return 'ST1:' + btoa(bin);
}

function decodeProgress(code) {
  const m = String(code).trim().match(/ST1:([A-Za-z0-9+/=]+)/);
  if (!m) throw new Error('That does not look like a Skill Tree restore code.');
  const bin = atob(m[1]);
  const out = new Set();
  for (let i = 0; i < ID_ORDER.length; i++) {
    const byte = bin.charCodeAt(i >> 3) || 0;
    if (byte & (1 << (i & 7))) out.add(ID_ORDER[i]);
  }
  return out;
}

/* ----------------------------- building ---------------------------- */

function rebuild() {
  VIEW = buildGraph([...state.cats], [...state.tiers]);
  buildBoard();
  refresh();
}

function buildBoard() {
  nodeEls.clear();
  el.chrome.innerHTML = '';
  el.svg.innerHTML = '';
  el.nodeLayer.innerHTML = '';

  el.canvas.style.width = VIEW.width + 'px';
  el.canvas.style.height = VIEW.height + 'px';

  /* ---- tier headers, column guides and category bands ---- */
  const chrome = [];
  for (const col of VIEW.columns) {
    chrome.push(
      `<div class="col-guide" style="left:${col.x - LAYOUT.COL_GAP / 2}px;width:${col.w + LAYOUT.COL_GAP}px;height:${VIEW.height}px"></div>`,
      `<div class="col-head" style="left:${col.x}px;width:${col.w}px"><b>Tier ${col.tier}</b><span>${esc(col.name)}</span></div>`);
  }
  for (const band of VIEW.bands) {
    chrome.push(
      `<div class="band" style="top:${band.y}px;height:${band.h}px;left:${LAYOUT.PAD_X / 2}px;width:${VIEW.width - LAYOUT.PAD_X}px;--c:${band.color}">
         <div class="band-head">
           <span class="swatch"></span>
           <span class="band-name">${esc(band.name)}</span>
           <span class="band-count" data-band-count="${band.id}"></span>
         </div>
       </div>`);
  }
  el.chrome.innerHTML = chrome.join('');

  /* ---- edges ----
     Up to ~4,000 prerequisite links, but rendered as six grouped <path>
     elements (one per state × solid/dashed combination) instead of one
     element per edge — see rebuildEdgeBuckets(). Each edge's curve is pure
     geometry (depends only on its two nodes' fixed positions), so it's
     computed once here and reused every time the buckets are rebuilt. */
  el.svg.setAttribute('viewBox', `0 0 ${VIEW.width} ${VIEW.height}`);
  el.svg.style.width = VIEW.width + 'px';
  el.svg.style.height = VIEW.height + 'px';

  for (const e of VIEW.edges) e._d = edgePath(VIEW.byId.get(e.from), VIEW.byId.get(e.to));

  el.svg.innerHTML =
    '<g id="edgeBase">' +
      '<path class="edge-plain"></path><path class="edge-plain cross"></path>' +
      '<path class="edge-open"></path><path class="edge-open cross"></path>' +
      '<path class="edge-done"></path><path class="edge-done cross"></path>' +
    '</g><g id="edgeLit"></g>';
  el.edgeBase = document.getElementById('edgeBase');
  el.edgeLit = document.getElementById('edgeLit');
  el.edgeBucket = {
    plain: el.edgeBase.children[0], plainCross: el.edgeBase.children[1],
    open: el.edgeBase.children[2], openCross: el.edgeBase.children[3],
    done: el.edgeBase.children[4], doneCross: el.edgeBase.children[5],
  };

  /* ---- nodes ----
     Not rendered here. A board this size (up to 2,044 nodes at once) is
     mostly off-screen at any given pan/zoom — mounting all of them up
     front, and keeping them all live in the DOM while panning moves them
     in and out of view, is the real cost a "large image" complaint is
     about. syncVisibleNodes() (called from refresh() and from every camera
     move below) mounts only what's within the viewport plus a small
     margin, so the live DOM stays around a hundred-odd nodes regardless of
     how many the board actually has. */
  visibleNodeIds = null;   // force a full resync against the fresh VIEW
}

function createNodeButton(n) {
  const t = document.createElement('template');
  t.innerHTML = `<button class="node" type="button" data-id="${n.id}"
       style="left:${n.x}px;top:${n.y}px;width:${n.w}px;height:${n.h}px;--c:${n.color}"
       title="${esc(n.group)} · ${esc(n.desc)}">
       <span class="node-tier">T${n.tier} · ${esc(n.group)}</span>
       <span class="node-name">${esc(n.name)}</span>
       <span class="node-mark"></span>
     </button>`;
  return t.content.firstElementChild;
}

/* The canvas-space rectangle currently showing through #board, padded by a
   margin (in screen px, so it's a constant visual buffer at every zoom
   level) — nodes and edges outside it simply aren't mounted. */
function visibleRect() {
  const r = getBoardRect();
  const { x, y, k } = state.view;
  const m = 480 / k;
  return {
    left: -x / k - m, top: -y / k - m,
    right: (r.width - x) / k + m, bottom: (r.height - y) / k + m,
  };
}

/* Mount/unmount node buttons to match the current viewport. Cheap even run
   every frame during a pan: a plain bounding-box loop over VIEW.nodes (a
   few thousand numeric comparisons), then DOM writes bounded by however
   many nodes actually crossed the margin since the last call — a handful,
   normally, not thousands. */
function syncVisibleNodes() {
  const r = visibleRect();
  const need = new Set();
  for (const n of VIEW.nodes) {
    if (n.x + n.w >= r.left && n.x <= r.right && n.y + n.h >= r.top && n.y <= r.bottom) need.add(n.id);
  }
  if (state.selected) need.add(state.selected);   // keep the open card's node mounted

  for (const [id, d] of nodeEls) if (!need.has(id)) { d.remove(); nodeEls.delete(id); }

  const frag = document.createDocumentFragment();
  for (const id of need) {
    if (nodeEls.has(id)) continue;
    const btn = createNodeButton(VIEW.byId.get(id));
    frag.appendChild(btn);
    nodeEls.set(id, btn);
  }
  el.nodeLayer.appendChild(frag);
  visibleNodeIds = need;
}

/* ----------------------------- rendering --------------------------- */

/* Applies current status/search/selection styling to whatever's presently
   mounted. Shared by refresh() (after a real state change) and
   syncViewport() (after a pure camera move, where none of that changed but
   freshly-mounted nodes still need it applied at least once). */
function styleMountedNodes(q, chain) {
  const statusFiltered = state.statuses.size < 3;
  for (const [id, d] of nodeEls) {
    const n = VIEW.byId.get(id);
    const st = statusOf(id);
    const matchesQ = !q || SEARCH_TEXT.get(id).includes(q);
    const matchesStatus = !statusFiltered || state.statuses.has(st);
    const dim = !(matchesQ && matchesStatus);
    const hit = !!q && matchesQ;
    const selected = id === state.selected;
    const related = !!chain && chain.has(id) && !selected;

    // Skip the DOM entirely when nothing about this node has changed.
    const sig = st + (dim ? 'd' : '') + (hit ? 'h' : '') + (selected ? 's' : '') + (related ? 'r' : '');
    if (d._sig === sig) continue;
    d._sig = sig;

    d.dataset.status = st;
    d.classList.toggle('dim', dim);
    d.classList.toggle('hit', hit);
    d.classList.toggle('selected', selected);
    d.classList.toggle('related', related);
  }
}

/* Everything a pure camera move (pan/zoom) needs to stay correct: remount
   for the new viewport, restyle anything newly mounted, and keep the edge
   buckets scoped to what's actually on screen. Deliberately skips the
   header/stats/card — none of that depends on where the camera is. */
function syncViewport() {
  syncVisibleNodes();
  styleMountedNodes(state.query.trim().toLowerCase(), state.selected ? highlightSet(state.selected) : null);
  rebuildEdgeBuckets();
}

function refresh() {
  const q = state.query.trim().toLowerCase();
  const chain = state.selected ? highlightSet(state.selected) : null;

  let hits = 0;
  if (q) for (const n of VIEW.nodes) if (SEARCH_TEXT.get(n.id).includes(q)) hits++;

  syncViewport();
  rebuildLitOverlay(chain);

  renderHeader(q, hits);
  renderStats();
  renderCard();
  syncFilterPills();
}

/* Sort every edge into one of six buckets by (learned-state × solid/dashed)
   and write each bucket's whole run of subpaths as a single `d` attribute —
   six DOM writes and one JS pass over the edge list, instead of up to
   thousands of individual classList toggles. Cheap enough (a plain loop
   over a few thousand short strings) to just always run inside refresh()
   rather than tracking a separate dirty flag for every place `state.learned`
   can change. */
function rebuildEdgeBuckets() {
  const b = el.edgeBucket;
  const need = visibleNodeIds;
  const plain = [], plainCross = [], open = [], openCross = [], done = [], doneCross = [];
  for (const e of VIEW.edges) {
    if (need && !need.has(e.from) && !need.has(e.to)) continue;
    const toDone = isLearned(e.from) && isLearned(e.to);
    const toOpen = !toDone && isLearned(e.from);
    const bucket = toDone ? (e.cross ? doneCross : done)
                 : toOpen ? (e.cross ? openCross : open)
                 : (e.cross ? plainCross : plain);
    bucket.push(e._d);
  }
  b.plain.setAttribute('d', plain.join(' '));
  b.plainCross.setAttribute('d', plainCross.join(' '));
  b.open.setAttribute('d', open.join(' '));
  b.openCross.setAttribute('d', openCross.join(' '));
  b.done.setAttribute('d', done.join(' '));
  b.doneCross.setAttribute('d', doneCross.join(' '));
}

/* The prerequisite-chain highlight for the current selection. Always small
   (bounded by one skill's own chain, not the whole board), so — unlike the
   base mass of edges — individual per-edge elements with their own colour
   are affordable here. Dims the bucketed base layer as a single opacity
   toggle on its parent group rather than touching every edge in it. */
function rebuildLitOverlay(chain) {
  el.edgeBase.classList.toggle('dimmed', !!chain);
  if (!chain) { el.edgeLit.innerHTML = ''; return; }
  const parts = [];
  for (const e of VIEW.edges) {
    if (chain.has(e.from) && chain.has(e.to)) {
      parts.push('<path class="edge-lit" d="' + e._d + '" style="stroke:' + VIEW.byId.get(e.to).color + '"/>');
    }
  }
  el.edgeLit.innerHTML = parts.join('');
}

function renderHeader(q, hits) {
  const soloCat = state.cats.size === 1 ? CATEGORIES.find(c => state.cats.has(c.id)) : null;
  el.viewTitle.textContent = soloCat ? soloCat.name
    : state.cats.size === CATEGORIES.length ? 'All branches'
    : state.cats.size + ' branches selected';

  const bits = [];
  bits.push(nf(VIEW.nodes.length) + ' skill' + (VIEW.nodes.length === 1 ? '' : 's'));
  if (state.cats.size !== CATEGORIES.length) bits.push(state.cats.size + ' of ' + CATEGORIES.length + ' branches');
  if (state.tiers.size !== ALL_TIERS.length) bits.push(state.tiers.size + ' of ' + ALL_TIERS.length + ' tiers');
  if (state.statuses.size < 3) bits.push([...state.statuses].join('/'));
  if (q) bits.push(hits + ' match' + (hits === 1 ? '' : 'es') + ' for “' + el.search.value + '”');
  el.viewSub.textContent = bits.join(' · ');
}

/* The selected skill, its whole prerequisite chain, and its direct unlocks. */
function highlightSet(id) {
  const set = new Set([id]);
  const stack = [id];
  while (stack.length) {
    for (const r of FULL.byId.get(stack.pop()).req) if (!set.has(r)) { set.add(r); stack.push(r); }
  }
  for (const c of FULL.byId.get(id).children) set.add(c);
  return set;
}

function renderStats() {
  const xp = totalXp();
  const { level } = levelFor(xp);
  const done = state.learned.size, all = FULL.nodes.length;
  const pct = all ? done / all : 0;

  // gauge — a 270° arc, dash-offset driven
  const ARC = 226.2;
  el.gaugeArc.setAttribute('stroke-dashoffset', String(ARC * (1 - pct)));
  el.gaugePct.textContent = Math.round(pct * 100) + '%';
  el.gaugeSub.textContent = nf(done) + ' of ' + nf(all);
  el.gXp.textContent = nf(xp);
  el.gLevel.textContent = String(level);
  el.compNote.textContent = state.cats.size === CATEGORIES.length ? 'All branches' : state.cats.size + ' branches';

  let ready = 0;
  for (const n of FULL.nodes) if (isAvailable(n.id)) ready++;
  const locked = all - done - ready;

  el.segLearned.style.width = (done / all * 100) + '%';
  el.segReady.style.width = (ready / all * 100) + '%';
  el.segLocked.style.width = (locked / all * 100) + '%';
  el.nLearned.textContent = nf(done); el.pLearned.textContent = Math.round(done / all * 100) + '%';
  el.nReady.textContent = nf(ready); el.pReady.textContent = Math.round(ready / all * 100) + '%';
  el.nLocked.textContent = nf(locked); el.pLocked.textContent = Math.round(locked / all * 100) + '%';
  el.statusNote.textContent = nf(all) + ' total';

  // overview
  let started = 0, strongest = null, deepestTier = 0, untouched = 0;
  for (const c of CATEGORIES) {
    const inCat = CAT_NODES.get(c.id);
    let d = 0;
    for (const n of inCat) if (isLearned(n.id)) d++;
    if (d > 0) started++;
    if (!strongest || d > strongest.d) strongest = { c, d };
  }
  for (const n of FULL.nodes) if (isLearned(n.id) && n.tier > deepestTier) deepestTier = n.tier;
  for (const n of FULL.nodes) if (isAvailable(n.id)) untouched++;

  el.ovBranches.textContent = started + ' / ' + CATEGORIES.length;
  el.ovTop.textContent = strongest && strongest.d > 0 ? strongest.c.name : '—';
  el.ovTier.textContent = deepestTier ? 'Tier ' + deepestTier : '—';
  el.ovNext.textContent = nf(untouched);

  // next up — a handful of ready skills, prioritising the current branch focus
  const readyNodes = FULL.nodes.filter(n => isAvailable(n.id));
  const inFocus = state.cats.size < CATEGORIES.length ? readyNodes.filter(n => state.cats.has(n.cat)) : readyNodes;
  const pool = (inFocus.length ? inFocus : readyNodes).slice().sort((a, b) => a.tier - b.tier).slice(0, 8);
  el.nextUp.innerHTML = pool.length ? pool.map(n => {
    const cat = CATEGORIES.find(c => c.id === n.cat);
    return `<button class="upitem" data-goto="${n.id}">
      <span class="swatch" style="background:${cat.color}"></span>
      <span class="who"><b>${esc(n.name)}</b><span>${esc(cat.name)}</span></span>
      <span class="xp">T${n.tier}</span>
    </button>`;
  }).join('') : '<div class="empty-line">Nothing unlocked yet — start with a Tier 1 skill.</div>';

  // per-branch counts in the rail
  for (const cat of CATEGORIES) {
    const inCat = CAT_NODES.get(cat.id);
    let d = 0;
    for (const n of inCat) if (isLearned(n.id)) d++;
    const row = el.navCounts.get(cat.id);
    if (row) {
      row.textContent = d + '/' + inCat.length;
      row.classList.toggle('done', d === inCat.length && inCat.length > 0);
    }
    const badge = document.querySelector(`[data-band-count="${cat.id}"]`);
    if (badge) badge.textContent = d + ' / ' + inCat.length + ' learned';
  }
  el.navAllCount.textContent = nf(done) + '/' + nf(all);
}

/* --------------------------- floating card -------------------------- */

let cardTab = 'req';

function renderCard() {
  const id = state.selected;
  if (!id) { el.card.hidden = true; return; }
  const s = FULL.byId.get(id);
  const cat = CATEGORIES.find(c => c.id === s.cat);
  const st = statusOf(id);
  const missing = s.req.filter(r => !isLearned(r));
  const chainSize = unlearnedChain(id).length;

  if (!['req', 'unlock'].includes(cardTab)) cardTab = 'req';
  if (cardTab === 'req' && !s.req.length && s.children.length) cardTab = 'unlock';

  const row = rid => {
    const r = FULL.byId.get(rid);
    const rc = CATEGORIES.find(c => c.id === r.cat);
    const rst = statusOf(rid);
    return `<button class="linkrow" data-goto="${rid}">
      <span class="swatch" style="background:${rc.color}"></span>
      <span class="label">${esc(r.name)}</span>
      <span class="t">T${r.tier}</span>
      ${rst === 'learned' ? '<span class="ok">✓</span>' : ''}
    </button>`;
  };

  el.card.innerHTML = `
    <div class="card-head" id="cardDrag">
      <span class="card-grip">⋮⋮</span>
      <span class="title">${esc(s.name)}</span>
      <button class="icon-btn" id="cardClose" type="button" title="Close">✕</button>
    </div>
    <div class="card-body">
      <div class="card-meta">
        <span class="chipx tier" style="--c:${cat.color}">Tier ${s.tier} · ${TIERS[s.tier - 1].name}</span>
        <span class="chipx">${xpOf(id)} XP</span>
        <span class="chipx st-${st}">${st === 'learned' ? 'Learned' : st === 'available' ? 'Ready' : 'Locked'}</span>
      </div>
      <div class="card-group">${esc(cat.name)} › ${esc(s.group)}</div>
      <p class="card-desc">${esc(s.desc)}</p>

      <div class="tabs">
        <button class="tab ${cardTab === 'req' ? 'on' : ''}" data-tab="req">Requires <span class="n">(${s.req.length})</span></button>
        <button class="tab ${cardTab === 'unlock' ? 'on' : ''}" data-tab="unlock">Unlocks <span class="n">(${s.children.length})</span></button>
      </div>
      <div id="cardList">
        ${cardTab === 'req'
          ? (s.req.length ? s.req.map(row).join('') : '<div class="empty-line">Nothing — this is a starting skill.</div>')
          : (s.children.length ? s.children.map(row).join('') : '<div class="empty-line">Nothing further — this is an endpoint.</div>')}
      </div>
    </div>
    <div class="card-foot">
      ${st === 'learned'
        ? `<button class="btn danger" data-act="unlearn">Mark as not learned</button>`
        : `<button class="btn dark" data-act="learn" ${st === 'available' ? '' : 'disabled'}>${st === 'available' ? 'Mark as learned' : 'Locked'}</button>
           ${st === 'locked' ? `<button class="btn" data-act="path">Whole path (${chainSize})</button>` : ''}`}
    </div>
    ${st === 'locked' ? `<p class="card-hint">Still missing: ${missing.map(m => esc(FULL.byId.get(m).name)).join(', ')}.</p>` : ''}
    ${st === 'learned' && s.children.length ? `<p class="card-hint">Unlearning this also unlearns everything built on it.</p>` : ''}
  `;

  el.card.hidden = false;
  positionCard();
}

function positionCard() {
  if (state.cardPos) {
    el.card.style.left = state.cardPos.left + 'px';
    el.card.style.top = state.cardPos.top + 'px';
    el.card.style.right = 'auto';
    return;
  }
  el.card.style.right = '20px';
  el.card.style.top = '20px';
  el.card.style.left = 'auto';
}

/* Everything still unlearned on the way to `id`, including `id` itself. */
function unlearnedChain(id) {
  const need = new Set(), stack = [id];
  while (stack.length) {
    const cur = stack.pop();
    if (isLearned(cur) || need.has(cur)) continue;
    need.add(cur);
    for (const r of FULL.byId.get(cur).req) stack.push(r);
  }
  return [...need];
}

function flash(id) {
  const d = nodeEls.get(id);
  if (!d) return;
  d.classList.remove('pop');
  void d.offsetWidth;
  d.classList.add('pop');
}

/* ------------------------------ camera ----------------------------- */

/* getBoundingClientRect() forces a synchronous layout flush. Reading it on
   every single wheel tick during a trackpad fling — potentially dozens a
   second, each interleaved with a transform *write* from the previous one —
   is a textbook layout-thrashing loop. #board's own box only moves on
   window resize, so it's cached and only invalidated there. */
let boardRect = null;
function getBoardRect() { return boardRect || (boardRect = el.board.getBoundingClientRect()); }

function applyView() {
  const { x, y, k } = state.view;
  el.canvas.style.transform = `translate(${x}px, ${y}px) scale(${k})`;
  el.zoomLabel.textContent = Math.round(k * 100) + '%';
}

/* Pure state update, no DOM write — split out so the rAF-batched wheel
   handler below can fold several queued zoom ticks into one state change
   before the single trailing applyView() that actually touches the page. */
function computeZoom(factor, cx, cy) {
  const v = state.view;
  const k = Math.min(2.2, Math.max(0.12, v.k * factor));
  const r = getBoardRect();
  const px = cx ?? r.width / 2, py = cy ?? r.height / 2;
  v.x = px - (px - v.x) * (k / v.k);
  v.y = py - (py - v.y) * (k / v.k);
  v.k = k;
}

function zoomBy(factor, cx, cy) { computeZoom(factor, cx, cy); applyView(); syncViewport(); }

/* Fit the tier progression across the width and keep nodes readable; taller
   sets of branches scroll vertically rather than being shrunk to nothing. */
function fitToScreen() {
  const r = el.board.getBoundingClientRect();
  const k = Math.min((r.width - 36) / VIEW.width, (r.height - 36) / VIEW.height, 1.05);
  const kk = Math.max(k, Math.min((r.width - 36) / VIEW.width, 1.05));
  state.view = {
    k: kk,
    x: (r.width - VIEW.width * kk) / 2,
    y: VIEW.height * kk < r.height ? (r.height - VIEW.height * kk) / 2 : 14,
  };
  applyView();
  syncViewport();
}

function centerOn(id) {
  const cat = FULL.byId.get(id).cat;
  if (!state.cats.has(cat)) { state.cats = new Set([cat]); syncNavButtons(); save(); rebuild(); }
  const n = VIEW.byId.get(id);
  if (!n) return;
  const r = el.board.getBoundingClientRect();
  const k = Math.max(state.view.k, 0.6);
  state.view.k = k;
  state.view.x = r.width / 2 - (n.x + n.w / 2) * k;
  state.view.y = r.height / 2 - (n.y + n.h / 2) * k;
  applyView();
  syncViewport();
}

/* ------------------------------ toast ------------------------------ */

function toast(msg) {
  el.toast.textContent = msg;
  el.toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.toast.classList.remove('show'), 2800);
}

/* -------------------------------- gate ------------------------------ */

function slugAvatar(name) {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '–';
  return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
}

function showApp() {
  el.gate.hidden = true;
  el.app.hidden = false;
  el.userName.textContent = state.profile.name;
  el.userAvatar.textContent = slugAvatar(state.profile.name);
  const bits = [];
  if (state.profile.age) bits.push(state.profile.age);
  if (state.profile.gender) bits.push(state.profile.gender);
  el.userMeta.textContent = bits.join(' · ') || '—';
  buildSidebarCats();
  syncNavButtons();
  rebuild();
  fitToScreen();
}

function openGate(prefill) {
  el.app.hidden = true;
  el.gate.hidden = false;
  if (prefill) {
    el.pfName.value = prefill.name || '';
    el.pfAge.value = prefill.age || '';
    const known = ['Woman', 'Man', 'Non-binary', 'Prefer not to say'];
    if (prefill.gender && !known.includes(prefill.gender)) {
      el.pfGender.value = 'self';
      el.pfSelf.value = prefill.gender;
      el.pfSelfWrap.hidden = false;
    } else {
      el.pfGender.value = prefill.gender || '';
      el.pfSelfWrap.hidden = true;
    }
  }
  el.pfName.focus();
}

function wireGate() {
  el.pfGender.addEventListener('change', () => {
    el.pfSelfWrap.hidden = el.pfGender.value !== 'self';
    if (el.pfGender.value === 'self') el.pfSelf.focus();
  });

  el.gateForm.addEventListener('submit', ev => {
    ev.preventDefault();
    const name = el.pfName.value.trim();
    const age = parseInt(el.pfAge.value, 10);
    const genderRaw = el.pfGender.value;
    const gender = genderRaw === 'self' ? el.pfSelf.value.trim() : genderRaw;
    if (!name) return el.pfName.focus();

    const isEdit = !!state.profile;
    state.profile = { name, age: Number.isFinite(age) ? age : null, gender: gender || null };
    save();
    showApp();
    toast(isEdit ? 'Profile updated' : 'Welcome, ' + name.split(' ')[0]);
  });
}

/* ------------------------------ wiring ----------------------------- */

function buildSidebarCats() {
  el.navCounts = new Map();
  el.navBranches.innerHTML = CATEGORIES.map(c => `
    <button class="nav-item" data-cat="${c.id}">
      <span class="swatch" style="background:${c.color}"></span>
      <span class="label">${esc(c.name)}</span>
      <span class="count" id="navCount-${c.id}"></span>
    </button>`).join('');
  for (const c of CATEGORIES) el.navCounts.set(c.id, document.getElementById('navCount-' + c.id));
}

function syncNavButtons() {
  const solo = state.cats.size === 1 ? [...state.cats][0] : null;
  el.navAll.classList.toggle('on', state.cats.size === CATEGORIES.length);
  document.querySelectorAll('[data-cat]').forEach(b => b.classList.toggle('on', b.dataset.cat === solo));
}

function syncFilterPills() {
  el.fBranch.classList.toggle('on', state.cats.size !== CATEGORIES.length);
  el.fBranchN.textContent = state.cats.size;
  el.fTier.classList.toggle('on', state.tiers.size !== ALL_TIERS.length);
  el.fStatus.classList.toggle('on', state.statuses.size !== 3);
  const filtered = state.cats.size !== CATEGORIES.length || state.tiers.size !== ALL_TIERS.length ||
    state.statuses.size !== 3 || state.query.trim().length > 0;
  el.fClear.hidden = !filtered;
}

function setCats(ids) {
  state.cats = new Set(ids.length ? ids : CATEGORIES.map(c => c.id));
  syncNavButtons(); save(); rebuild(); fitToScreen();
}

function select(id) {
  state.selected = id;
  refresh();
}

/* --------------------------- filter menus --------------------------- */

function closeMenu() { el.menu.hidden = true; openFilter = null; }

function positionMenu(anchor, alignRight, above) {
  const r = anchor.getBoundingClientRect();
  el.menu.style.visibility = 'hidden';
  el.menu.hidden = false;
  const mw = el.menu.offsetWidth, mh = el.menu.offsetHeight;
  let left = alignRight ? r.right - mw : r.left;
  left = Math.max(8, Math.min(left, window.innerWidth - mw - 8));
  let top = above ? r.top - mh - 6 : r.bottom + 6;
  top = Math.max(8, Math.min(top, window.innerHeight - mh - 8));
  el.menu.style.left = left + 'px';
  el.menu.style.top = top + 'px';
  el.menu.style.visibility = '';
}

function openBranchMenu() {
  openFilter = 'branch';
  const rows = CATEGORIES.map(c => {
    const inCat = CAT_NODES.get(c.id);
    let d = 0;
    for (const n of inCat) if (isLearned(n.id)) d++;
    const on = state.cats.has(c.id);
    return `<button class="menu-item" data-toggle-cat="${c.id}">
      <span class="tick">${on ? '✓' : ''}</span>
      <span class="swatch" style="background:${c.color}"></span>
      <span class="label">${esc(c.name)}</span>
      <span class="count">${d}/${inCat.length}</span>
    </button>`;
  }).join('');
  el.menu.innerHTML = `<div class="menu-head"><span>Branches</span>
      <button type="button" data-cat-all>All</button></div>${rows}`;
  positionMenu(el.fBranch, false, false);
}

function openTierMenu() {
  openFilter = 'tier';
  const rows = TIERS.map(t => {
    const inTier = VIEW === FULL ? FULL.nodes.filter(n => n.tier === t.tier)
      : FULL.nodes.filter(n => n.tier === t.tier && state.cats.has(n.cat));
    const on = state.tiers.has(t.tier);
    return `<button class="menu-item" data-toggle-tier="${t.tier}">
      <span class="tick">${on ? '✓' : ''}</span>
      <span class="label">Tier ${t.tier} · ${esc(t.name)}</span>
      <span class="count">${inTier.length}</span>
    </button>`;
  }).join('');
  el.menu.innerHTML = `<div class="menu-head"><span>Tiers</span>
      <button type="button" data-tier-all>All</button></div>${rows}`;
  positionMenu(el.fTier, false, false);
}

function openStatusMenu() {
  openFilter = 'status';
  const defs = [
    ['learned', '#10794f', 'Learned'],
    ['available', '#2563eb', 'Ready to start'],
    ['locked', '#c6ccd5', 'Locked'],
  ];
  const rows = defs.map(([key, color, label]) => {
    let n = 0;
    for (const node of VIEW.nodes) if (statusOf(node.id) === key) n++;
    const on = state.statuses.has(key);
    return `<button class="menu-item" data-toggle-status="${key}">
      <span class="tick">${on ? '✓' : ''}</span>
      <span class="swatch" style="background:${color}"></span>
      <span class="label">${label}</span>
      <span class="count">${n}</span>
    </button>`;
  }).join('');
  el.menu.innerHTML = `<div class="menu-head"><span>Status</span>
      <button type="button" data-status-all>All</button></div>${rows}`;
  positionMenu(el.fStatus, false, false);
}

function openUserMenu() {
  openFilter = 'user';
  el.menu.innerHTML = `
    <button class="menu-item" data-user-act="edit"><span class="tick"></span><span class="label">Edit profile</span></button>
    <button class="menu-item" data-user-act="restore"><span class="tick"></span><span class="label">Restore from code</span></button>
    <button class="menu-item" data-user-act="signout"><span class="tick"></span><span class="label" style="color:var(--red)">Clear data & sign out</span></button>
  `;
  positionMenu(el.userCard, false, true);
}

function wireMenu() {
  el.fBranch.addEventListener('click', () => openFilter === 'branch' ? closeMenu() : openBranchMenu());
  el.fTier.addEventListener('click', () => openFilter === 'tier' ? closeMenu() : openTierMenu());
  el.fStatus.addEventListener('click', () => openFilter === 'status' ? closeMenu() : openStatusMenu());
  el.userCard.addEventListener('click', () => openFilter === 'user' ? closeMenu() : openUserMenu());

  el.fClear.addEventListener('click', () => {
    state.cats = new Set(CATEGORIES.map(c => c.id));
    state.tiers = new Set(ALL_TIERS);
    state.statuses = new Set(['learned', 'available', 'locked']);
    state.query = ''; el.search.value = '';
    syncNavButtons(); save(); rebuild(); fitToScreen();
  });

  el.menu.addEventListener('click', ev => {
    const catBtn = ev.target.closest('[data-toggle-cat]');
    if (catBtn) {
      const id = catBtn.dataset.toggleCat;
      state.cats.has(id) ? state.cats.delete(id) : state.cats.add(id);
      if (!state.cats.size) CATEGORIES.forEach(c => state.cats.add(c.id));
      syncNavButtons(); save(); rebuild(); openBranchMenu();
      return;
    }
    if (ev.target.closest('[data-cat-all]')) {
      const all = state.cats.size === CATEGORIES.length;
      state.cats = new Set(all ? [CATEGORIES[0].id] : CATEGORIES.map(c => c.id));
      syncNavButtons(); save(); rebuild(); openBranchMenu();
      return;
    }

    const tierBtn = ev.target.closest('[data-toggle-tier]');
    if (tierBtn) {
      const t = Number(tierBtn.dataset.toggleTier);
      state.tiers.has(t) ? state.tiers.delete(t) : state.tiers.add(t);
      if (!state.tiers.size) ALL_TIERS.forEach(x => state.tiers.add(x));
      rebuild(); openTierMenu();
      return;
    }
    if (ev.target.closest('[data-tier-all]')) {
      const all = state.tiers.size === ALL_TIERS.length;
      state.tiers = new Set(all ? [1] : ALL_TIERS);
      rebuild(); openTierMenu();
      return;
    }

    const stBtn = ev.target.closest('[data-toggle-status]');
    if (stBtn) {
      const k = stBtn.dataset.toggleStatus;
      state.statuses.has(k) ? state.statuses.delete(k) : state.statuses.add(k);
      if (!state.statuses.size) state.statuses.add(k);
      refresh(); openStatusMenu();
      return;
    }
    if (ev.target.closest('[data-status-all]')) {
      const all = state.statuses.size === 3;
      state.statuses = new Set(all ? ['learned'] : ['learned', 'available', 'locked']);
      refresh(); openStatusMenu();
      return;
    }

    const userBtn = ev.target.closest('[data-user-act]');
    if (userBtn) {
      closeMenu();
      const act = userBtn.dataset.userAct;
      if (act === 'edit') openGate(state.profile);
      if (act === 'restore') openRestoreModal();
      if (act === 'signout') {
        if (!confirm('Clear your profile and all learned progress on this browser? This cannot be undone.')) return;
        try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
        state.profile = null; state.learned.clear(); state.selected = null;
        state.cats = new Set(CATEGORIES.map(c => c.id));
        el.gateForm.reset(); el.pfSelfWrap.hidden = true;
        openGate(null);
      }
    }
  });

  document.addEventListener('pointerdown', ev => {
    if (!openFilter) return;
    if (ev.target.closest('.menu') || ev.target.closest('#fBranch, #fTier, #fStatus, #userCard')) return;
    closeMenu();
  });
}

/* -------------------------------- modal ------------------------------ */

function closeModal() { el.scrim.hidden = true; el.modal.innerHTML = ''; }

function openRestoreModal() {
  el.modal.innerHTML = `
    <h2>Restore progress</h2>
    <p class="lede">Paste the restore code from the bottom of a previously exported report. It only
      contains which skills are marked learned — not your profile.</p>
    <textarea id="restoreInput" placeholder="ST1:..." spellcheck="false"></textarea>
    <div class="modal-foot">
      <button class="btn" id="restoreCancel" type="button">Cancel</button>
      <button class="btn dark" id="restoreGo" type="button">Restore</button>
    </div>
  `;
  el.scrim.hidden = false;
  document.getElementById('restoreInput').focus();
  document.getElementById('restoreCancel').onclick = closeModal;
  document.getElementById('restoreGo').onclick = () => {
    const raw = document.getElementById('restoreInput').value;
    try {
      const set = decodeProgress(raw);
      state.learned = set;
      prune(); save(); refresh();
      closeModal();
      toast('Progress restored (' + nf(set.size) + ' skills)');
    } catch (e) {
      toast(e.message || 'Could not read that code.');
    }
  };
}

function wireModal() {
  el.btnRestore.addEventListener('click', openRestoreModal);
  el.scrim.addEventListener('click', ev => { if (ev.target === el.scrim) closeModal(); });
}

/* -------------------------------- export ------------------------------ */

function exportReport() {
  const { level } = levelFor(totalXp());
  const doc = Report.build({
    profile: state.profile,
    learned: state.learned,
    xp: totalXp(),
    level,
    restoreCode: encodeProgress(),
  });
  const slug = (state.profile.name || 'skill-tree').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  doc.save((slug || 'skill-tree') + '-progress-report.pdf');
  toast('Report downloaded');
}

/* -------------------------------- card drag ---------------------------- */

function wireCardDrag() {
  let dragging = false, sx = 0, sy = 0, ol = 0, ot = 0;

  el.card.addEventListener('pointerdown', ev => {
    const closeBtn = ev.target.closest('#cardClose');
    if (closeBtn) { select(null); return; }
    const tab = ev.target.closest('.tab');
    if (tab) { cardTab = tab.dataset.tab; renderCard(); return; }

    const handle = ev.target.closest('#cardDrag');
    if (!handle) return;
    const rect = el.card.getBoundingClientRect();
    const boardRect = el.board.getBoundingClientRect();
    dragging = true;
    sx = ev.clientX; sy = ev.clientY;
    ol = rect.left - boardRect.left; ot = rect.top - boardRect.top;
    el.card.style.left = ol + 'px'; el.card.style.top = ot + 'px'; el.card.style.right = 'auto';
    handle.setPointerCapture(ev.pointerId);
    handle.classList.add('drag');
  });
  el.card.addEventListener('pointermove', ev => {
    if (!dragging) return;
    const boardRect = el.board.getBoundingClientRect();
    let left = ol + (ev.clientX - sx), top = ot + (ev.clientY - sy);
    left = Math.max(8, Math.min(left, boardRect.width - el.card.offsetWidth - 8));
    top = Math.max(8, Math.min(top, boardRect.height - 40));
    el.card.style.left = left + 'px'; el.card.style.top = top + 'px';
    state.cardPos = { left, top };
  });
  const endDrag = () => { dragging = false; el.card.querySelector('#cardDrag')?.classList.remove('drag'); };
  el.card.addEventListener('pointerup', endDrag);
  el.card.addEventListener('pointercancel', endDrag);

  el.card.addEventListener('click', ev => {
    const goto = ev.target.closest('[data-goto]');
    if (goto) { select(goto.dataset.goto); centerOn(goto.dataset.goto); return; }
    const act = ev.target.closest('[data-act]');
    if (!act) return;
    if (act.dataset.act === 'learn') learn(state.selected);
    if (act.dataset.act === 'unlearn') unlearn(state.selected);
    if (act.dataset.act === 'path') learnPath(state.selected);
  });
}

/* ------------------------------ main wiring -------------------------- */

function wire() {
  el.nodeLayer.addEventListener('click', ev => {
    const btn = ev.target.closest('.node');
    if (!btn) return;
    if (ev.shiftKey || ev.metaKey) toggle(btn.dataset.id); else select(btn.dataset.id);
  });
  el.nodeLayer.addEventListener('dblclick', ev => {
    const btn = ev.target.closest('.node');
    if (btn) toggle(btn.dataset.id);
  });

  el.navAll.addEventListener('click', () => setCats(CATEGORIES.map(c => c.id)));
  el.navReset.addEventListener('click', () => {
    if (!confirm('Reset all progress? This clears every learned skill.')) return;
    state.learned.clear(); state.selected = null; save(); refresh();
    toast('Progress reset');
  });
  el.navBranches.addEventListener('click', ev => {
    const btn = ev.target.closest('[data-cat]');
    if (btn) setCats([btn.dataset.cat]);
  });

  el.btnExport.addEventListener('click', exportReport);

  let searchTimer = 0;
  el.search.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => { state.query = el.search.value; refresh(); }, 90);
  });
  el.search.addEventListener('keydown', ev => {
    if (ev.key === 'Escape') { el.search.value = ''; state.query = ''; refresh(); el.search.blur(); }
    if (ev.key === 'Enter') {
      clearTimeout(searchTimer);
      state.query = el.search.value;
      const q = state.query.trim().toLowerCase();
      const hit = FULL.nodes.find(n => n.name.toLowerCase().includes(q))
               || FULL.nodes.find(n => SEARCH_TEXT.get(n.id).includes(q));
      refresh();
      if (hit) { select(hit.id); centerOn(hit.id); }
    }
  });

  el.zoomIn.onclick = () => zoomBy(1.2);
  el.zoomOut.onclick = () => zoomBy(1 / 1.2);
  el.fit.onclick = fitToScreen;

  // pan and zoom — mouse/touch drag and wheel/trackpad both funnel through
  // one rAF-batched flush, so a burst of input events (a trackpad can fire
  // wheel dozens of times a frame) only ever touches the DOM once per frame.
  let dragging = false, sx = 0, sy = 0, ox = 0, oy = 0, moved = false;
  let pendingDrag = null, panDX = 0, panDY = 0, zoomFactor = 1, zoomClientX = null, zoomClientY = null;
  let rafScheduled = false;

  function queueFrame() {
    if (rafScheduled) return;
    rafScheduled = true;
    requestAnimationFrame(flushView);
  }
  function flushView() {
    rafScheduled = false;
    let changed = false;
    if (pendingDrag) { state.view.x = pendingDrag.x; state.view.y = pendingDrag.y; pendingDrag = null; changed = true; }
    if (panDX || panDY) { state.view.x -= panDX; state.view.y -= panDY; panDX = 0; panDY = 0; changed = true; }
    if (zoomFactor !== 1) {
      // Board-relative conversion happens once here, at flush time — not
      // once per queued wheel tick, which only the last of matters anyway.
      const r = getBoardRect();
      computeZoom(zoomFactor, zoomClientX - r.left, zoomClientY - r.top);
      zoomFactor = 1; zoomClientX = null; zoomClientY = null; changed = true;
    }
    if (changed) { applyView(); syncViewport(); }
  }

  let wheelIdleTimer = 0;
  function markPanning() {
    el.board.classList.add('panning');
    clearTimeout(wheelIdleTimer);
    wheelIdleTimer = setTimeout(() => el.board.classList.remove('panning'), 140);
  }

  el.board.addEventListener('pointerdown', ev => {
    if (ev.target.closest('.node') || ev.target.closest('.card')) return;
    dragging = true; moved = false;
    sx = ev.clientX; sy = ev.clientY; ox = state.view.x; oy = state.view.y;
    el.board.setPointerCapture(ev.pointerId);
    el.board.classList.add('grabbing', 'panning');
  });
  el.board.addEventListener('pointermove', ev => {
    if (!dragging) return;
    const dx = ev.clientX - sx, dy = ev.clientY - sy;
    if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;
    pendingDrag = { x: ox + dx, y: oy + dy };
    queueFrame();
  });
  const endDrag = () => {
    if (dragging && !moved && state.selected) select(null);
    dragging = false;
    el.board.classList.remove('grabbing', 'panning');
  };
  el.board.addEventListener('pointerup', endDrag);
  el.board.addEventListener('pointercancel', endDrag);

  el.board.addEventListener('wheel', ev => {
    ev.preventDefault();
    markPanning();
    if (ev.ctrlKey || ev.metaKey) {
      zoomFactor *= (ev.deltaY < 0 ? 1.1 : 1 / 1.1);
      zoomClientX = ev.clientX; zoomClientY = ev.clientY;
    } else {
      panDX += ev.deltaX; panDY += ev.deltaY;
    }
    queueFrame();
  }, { passive: false });

  document.addEventListener('keydown', ev => {
    if (el.app.hidden) return;
    if (ev.target.tagName === 'INPUT' || ev.target.tagName === 'TEXTAREA') {
      if (ev.key === 'Escape') { closeModal(); }
      return;
    }
    if (ev.key === '/') { ev.preventDefault(); el.search.focus(); }
    if (ev.key === 'Escape') { openFilter ? closeMenu() : select(null); }
    if (ev.key === 'f') fitToScreen();
    if (ev.key === '+' || ev.key === '=') zoomBy(1.2);
    if (ev.key === '-') zoomBy(1 / 1.2);
    if (ev.key === 'Enter' && state.selected) toggle(state.selected);
  });
}

/* ------------------------------- boot ------------------------------ */

function init() {
  ['gate', 'gateForm', 'pfName', 'pfAge', 'pfGender', 'pfSelf', 'pfSelfWrap', 'gateFoot',
   'app', 'board', 'canvas', 'svg', 'chrome', 'nodeLayer', 'card',
   'navAll', 'navAllCount', 'navReset', 'navBranches', 'userCard', 'userAvatar', 'userName', 'userMeta',
   'viewTitle', 'viewSub', 'btnRestore', 'btnExport',
   'fBranch', 'fBranchN', 'fTier', 'fStatus', 'fClear',
   'zoomIn', 'zoomOut', 'fit', 'zoomLabel',
   'gaugeArc', 'gaugePct', 'gaugeSub', 'gXp', 'gLevel', 'compNote',
   'segLearned', 'segReady', 'segLocked', 'nLearned', 'pLearned', 'nReady', 'pReady', 'nLocked', 'pLocked', 'statusNote',
   'ovBranches', 'ovTop', 'ovTier', 'ovNext', 'nextUp',
   'menu', 'scrim', 'modal', 'toast', 'search']
    .forEach(k => el[k] = document.getElementById(k));

  if (FULL.problems.length) {
    console.warn('Skill data problems:\n' + FULL.problems.join('\n'));
    const w = document.getElementById('warn');
    if (w) { w.hidden = false; w.textContent = FULL.problems.length + ' data problem(s) — see the browser console.'; }
  }

  wireGate();
  wireMenu();
  wireModal();
  wireCardDrag();
  wire();

  window.addEventListener('resize', () => { boardRect = null; if (!el.app.hidden) fitToScreen(); });

  el.nextUp.addEventListener('click', ev => {
    const goto = ev.target.closest('[data-goto]');
    if (goto) { select(goto.dataset.goto); centerOn(goto.dataset.goto); }
  });

  if (!storageOK) warnNoStorage();

  if (loadStored()) showApp(); else openGate(null);
}

document.addEventListener('DOMContentLoaded', init);
