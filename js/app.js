/* ------------------------------------------------------------------
   app.js — state, rendering and interaction for the skill tree.

   FULL  every skill; the source of truth for progress and the detail panel.
   VIEW  only the branches currently switched on; drives what gets drawn.

   With a couple of thousand nodes on the board, two things matter:
   building the DOM in one pass rather than element by element, and
   never touching an element during a refresh whose appearance has not
   actually changed.
------------------------------------------------------------------ */

const STORAGE_KEY = 'skill-tree.v1';
const FULL = buildGraph();
let VIEW = FULL;

/* Precomputed once — recomputing these per refresh is what makes a board
   this size feel slow. */
const CAT_NODES = new Map(CATEGORIES.map(c => [c.id, FULL.nodes.filter(n => n.cat === c.id)]));
const SEARCH_TEXT = new Map(FULL.nodes.map(n => [n.id, (n.name + ' ' + n.group + ' ' + n.desc).toLowerCase()]));

const state = {
  learned: new Set(),
  selected: null,
  query: '',
  cats: new Set(CATEGORIES.map(c => c.id)),
  availableOnly: false,
  view: { x: 0, y: 0, k: 1 },
};

const el = {};
const nodeEls = new Map();
const edgeEls = new Map();

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

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

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      learned: [...state.learned],
      cats: [...state.cats],
    }));
  } catch (e) { /* private mode — the tree still works, it just isn't remembered */ }
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    for (const id of saved.learned || []) if (FULL.byId.has(id)) state.learned.add(id);
    prune();

    // Which branches you were looking at is worth remembering too: with this
    // many skills, most people work through one or two at a time.
    const cats = (saved.cats || []).filter(c => CATEGORIES.some(x => x.id === c));
    if (cats.length) state.cats = new Set(cats);
  } catch (e) { /* ignore corrupt saves */ }
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

/* ----------------------------- building ---------------------------- */

function rebuild() {
  VIEW = buildGraph([...state.cats]);
  buildBoard();
  refresh();
}

function buildBoard() {
  nodeEls.clear(); edgeEls.clear();
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
           <span class="band-icon">${band.icon}</span>
           <span class="band-name">${esc(band.name)}</span>
           <span class="band-count" data-band-count="${band.id}"></span>
         </div>
       </div>`);
  }
  el.chrome.innerHTML = chrome.join('');

  /* ---- edges ---- */
  el.svg.setAttribute('viewBox', `0 0 ${VIEW.width} ${VIEW.height}`);
  el.svg.style.width = VIEW.width + 'px';
  el.svg.style.height = VIEW.height + 'px';

  const paths = VIEW.edges.map(e => {
    const to = VIEW.byId.get(e.to);
    return `<path d="${edgePath(VIEW.byId.get(e.from), to)}" class="edge${e.cross ? ' cross' : ''}" style="--c:${to.color}"/>`;
  });
  el.svg.innerHTML = paths.join('');
  const pathEls = el.svg.children;
  VIEW.edges.forEach((e, i) => edgeEls.set(e.from + '>' + e.to, pathEls[i]));

  /* ---- nodes ---- */
  el.nodeLayer.innerHTML = VIEW.nodes.map(n =>
    `<button class="node" type="button" data-id="${n.id}"
       style="left:${n.x}px;top:${n.y}px;width:${n.w}px;height:${n.h}px;--c:${n.color}"
       title="${esc(n.group)} · ${esc(n.desc)}">
       <span class="node-tier">T${n.tier} · ${esc(n.group)}</span>
       <span class="node-name">${esc(n.name)}</span>
       <span class="node-mark"></span>
     </button>`).join('');
  const btns = el.nodeLayer.children;
  VIEW.nodes.forEach((n, i) => nodeEls.set(n.id, btns[i]));
}

/* ----------------------------- rendering --------------------------- */

function refresh() {
  const q = state.query.trim().toLowerCase();
  const sel = state.selected;
  const chain = sel ? highlightSet(sel) : null;
  let hits = 0;

  for (const n of VIEW.nodes) {
    const d = nodeEls.get(n.id);
    const st = statusOf(n.id);
    const matches = !q || SEARCH_TEXT.get(n.id).includes(q);
    if (q && matches) hits++;
    const dim = !(matches && (!state.availableOnly || st !== 'locked'));
    const hit = !!q && matches;
    const selected = n.id === sel;
    const related = !!chain && chain.has(n.id) && !selected;

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

  for (const e of VIEW.edges) {
    const p = edgeEls.get(e.from + '>' + e.to);
    const done = isLearned(e.from) && isLearned(e.to);
    const open = isLearned(e.from) && !done;
    const lit = !!chain && chain.has(e.from) && chain.has(e.to);

    const sig = (done ? 'd' : '') + (open ? 'o' : '') + (lit ? 'l' : '') + (chain ? 'f' : '');
    if (p._sig === sig) continue;
    p._sig = sig;

    p.classList.toggle('done', done);
    p.classList.toggle('open', open);
    p.classList.toggle('lit', lit);
    p.classList.toggle('faded', !!chain);
  }

  el.hits.textContent = q ? `${hits} match${hits === 1 ? '' : 'es'}` : '';
  renderStats();
  renderDetail();
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
  const { level, into, need } = levelFor(xp);
  const done = state.learned.size, all = FULL.nodes.length;

  el.level.textContent = level;
  el.xp.textContent = xp.toLocaleString();
  el.levelBar.style.width = Math.round(into / need * 100) + '%';
  el.levelHint.textContent = `${need - into} XP to level ${level + 1}`;
  el.countLabel.textContent = `${done.toLocaleString()} / ${all.toLocaleString()} skills`;
  el.overallBar.style.width = (done / all * 100) + '%';

  let ready = 0;
  for (const n of FULL.nodes) if (isAvailable(n.id)) ready++;
  el.availableLabel.textContent = `${ready.toLocaleString()} ready to start`;

  for (const cat of CATEGORIES) {
    const inCat = CAT_NODES.get(cat.id);
    let d = 0;
    for (const n of inCat) if (isLearned(n.id)) d++;
    const bar = el.catBars.get(cat.id);
    bar.fill.style.width = (d / inCat.length * 100) + '%';
    bar.num.textContent = `${d}/${inCat.length}`;
    const badge = document.querySelector(`[data-band-count="${cat.id}"]`);
    if (badge) badge.textContent = `${d} / ${inCat.length} learned`;
  }
}

function renderDetail() {
  const id = state.selected;
  if (!id) {
    el.detail.innerHTML = `<div class="empty">
        <div class="empty-icon">🌳</div>
        <p>Select any skill to see what it needs and what it opens up.</p>
        <p class="muted">Tier 1 skills have no prerequisites — start there.</p>
        <p class="muted">With ${FULL.nodes.length.toLocaleString()} skills on the board, the sidebar’s
        <b>only</b> button is the fastest way in: focus one branch at a time.</p>
      </div>`;
    return;
  }
  const s = FULL.byId.get(id);
  const cat = CATEGORIES.find(c => c.id === s.cat);
  const st = statusOf(id);
  const missing = s.req.filter(r => !isLearned(r));
  const chainSize = unlearnedChain(id).length;   // how many skills stand between you and it

  const chip = rid => {
    const r = FULL.byId.get(rid);
    return `<button class="chip" data-goto="${rid}" data-state="${statusOf(rid)}">
      <span class="chip-dot" style="background:${CATEGORIES.find(c => c.id === r.cat).color}"></span>${esc(r.name)}<span class="chip-t">T${r.tier}</span></button>`;
  };

  el.detail.innerHTML = `
    <div class="d-head">
      <div class="d-cat" style="color:${cat.color}">${cat.icon} ${esc(cat.name)}</div>
      <h2>${esc(s.name)}</h2>
      <div class="d-meta">
        <span class="pill" style="--c:${cat.color}">Tier ${s.tier} · ${TIERS[s.tier - 1].name}</span>
        <span class="pill ghost">${xpOf(id)} XP</span>
        <span class="pill status" data-status="${st}">${st === 'learned' ? 'Learned' : st === 'available' ? 'Ready' : 'Locked'}</span>
      </div>
      <div class="d-group">${esc(s.group)}</div>
    </div>
    <p class="d-desc">${esc(s.desc)}</p>

    <div class="d-block">
      <h3>Requires ${s.req.length ? `<span class="muted">(${s.req.length - missing.length}/${s.req.length})</span>` : ''}</h3>
      <div class="chips">${s.req.length ? s.req.map(chip).join('') : '<span class="muted">Nothing — this is a starting skill.</span>'}</div>
    </div>

    <div class="d-block">
      <h3>Unlocks ${s.children.length ? `<span class="muted">(${s.children.length})</span>` : ''}</h3>
      <div class="chips">${s.children.length ? s.children.map(chip).join('') : '<span class="muted">Nothing further — this is an endpoint.</span>'}</div>
    </div>

    <div class="d-actions">
      ${st === 'learned'
        ? `<button class="btn danger" data-act="unlearn">Mark as not learned</button>`
        : `<button class="btn primary" data-act="learn" ${st === 'available' ? '' : 'disabled'}>${st === 'available' ? 'Mark as learned' : 'Locked'}</button>`}
      ${st === 'locked' ? `<button class="btn" data-act="path">Learn the whole path (${chainSize})</button>` : ''}
    </div>
    ${st === 'locked' ? `<p class="hint">Still missing: ${missing.map(m => esc(FULL.byId.get(m).name)).join(', ')}.</p>` : ''}
    ${st === 'learned' && s.children.length ? `<p class="hint">Unlearning this also unlearns everything built on it.</p>` : ''}
  `;
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

function applyView() {
  const { x, y, k } = state.view;
  el.canvas.style.transform = `translate(${x}px, ${y}px) scale(${k})`;
  el.zoomLabel.textContent = Math.round(k * 100) + '%';
}

function zoomBy(factor, cx, cy) {
  const v = state.view;
  const k = Math.min(2.2, Math.max(0.12, v.k * factor));
  const r = el.viewport.getBoundingClientRect();
  const px = cx ?? r.width / 2, py = cy ?? r.height / 2;
  v.x = px - (px - v.x) * (k / v.k);
  v.y = py - (py - v.y) * (k / v.k);
  v.k = k;
  applyView();
}

/* Fit the tier progression across the width and keep nodes readable; taller
   sets of branches scroll vertically rather than being shrunk to nothing. */
function fitToScreen() {
  const r = el.viewport.getBoundingClientRect();
  const k = Math.min((r.width - 36) / VIEW.width, (r.height - 36) / VIEW.height, 1.05);
  const kk = Math.max(k, Math.min((r.width - 36) / VIEW.width, 1.05));   // never below width-fit
  state.view = {
    k: kk,
    x: (r.width - VIEW.width * kk) / 2,
    y: VIEW.height * kk < r.height ? (r.height - VIEW.height * kk) / 2 : 14,
  };
  applyView();
}

function centerOn(id) {
  const cat = FULL.byId.get(id).cat;
  if (!state.cats.has(cat)) { state.cats.add(cat); syncCatButtons(); rebuild(); }
  const n = VIEW.byId.get(id);
  if (!n) return;
  const r = el.viewport.getBoundingClientRect();
  const k = Math.max(state.view.k, 0.6);   // a match is no use if you cannot read it
  state.view.k = k;
  state.view.x = r.width / 2 - (n.x + n.w / 2) * k;
  state.view.y = r.height / 2 - (n.y + n.h / 2) * k;
  applyView();
}

/* ------------------------------ wiring ----------------------------- */

function buildSidebarCats() {
  el.catBars = new Map();
  for (const cat of CATEGORIES) {
    const row = document.createElement('div');
    row.className = 'cat-row';
    row.innerHTML = `
      <button class="cat-toggle on" data-cat="${cat.id}" title="Show or hide this branch">
        <span class="cat-icon">${cat.icon}</span>
        <span class="cat-name">${esc(cat.name)}</span>
        <span class="cat-num"></span>
      </button>
      <button class="cat-solo" data-solo="${cat.id}" title="Show only this branch">only</button>
      <div class="cat-bar"><i style="background:${cat.color}"></i></div>`;
    el.catList.appendChild(row);
    el.catBars.set(cat.id, { fill: row.querySelector('.cat-bar i'), num: row.querySelector('.cat-num') });
  }
}

function syncCatButtons() {
  document.querySelectorAll('[data-cat]').forEach(b => b.classList.toggle('on', state.cats.has(b.dataset.cat)));
}

function setCats(ids) {
  state.cats = new Set(ids.length ? ids : CATEGORIES.map(c => c.id));
  syncCatButtons(); save(); rebuild(); fitToScreen();
}

function select(id) {
  state.selected = id;
  refresh();
}

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

  el.detail.addEventListener('click', ev => {
    const goto = ev.target.closest('[data-goto]');
    if (goto) { select(goto.dataset.goto); centerOn(goto.dataset.goto); return; }
    const act = ev.target.closest('[data-act]');
    if (!act) return;
    if (act.dataset.act === 'learn') learn(state.selected);
    if (act.dataset.act === 'unlearn') unlearn(state.selected);
    if (act.dataset.act === 'path') learnPath(state.selected);
  });

  el.catList.addEventListener('click', ev => {
    const solo = ev.target.closest('[data-solo]');
    if (solo) {
      const id = solo.dataset.solo;
      const alone = state.cats.size === 1 && state.cats.has(id);
      setCats(alone ? CATEGORIES.map(c => c.id) : [id]);
      return;
    }
    const t = ev.target.closest('[data-cat]');
    if (!t) return;
    const id = t.dataset.cat;
    if (state.cats.has(id)) state.cats.delete(id); else state.cats.add(id);
    if (!state.cats.size) CATEGORIES.forEach(c => state.cats.add(c.id));  // never blank the board
    syncCatButtons(); save(); rebuild();
  });

  el.catAll.onclick = () => setCats(CATEGORIES.map(c => c.id));
  el.catNone.onclick = () => setCats([CATEGORIES[0].id]);

  // A keystroke restyles every visible node, so coalesce bursts of typing.
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

  el.availToggle.addEventListener('change', () => {
    state.availableOnly = el.availToggle.checked;
    refresh();
  });

  el.zoomIn.onclick = () => zoomBy(1.2);
  el.zoomOut.onclick = () => zoomBy(1 / 1.2);
  el.fit.onclick = fitToScreen;
  el.reset.onclick = () => {
    if (!confirm('Reset all progress? This clears every learned skill.')) return;
    state.learned.clear(); state.selected = null; save(); refresh();
  };
  el.export.onclick = () => {
    const blob = new Blob([JSON.stringify({ learned: [...state.learned], savedAt: new Date().toISOString() }, null, 2)],
      { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'skill-tree-progress.json';
    a.click();
    URL.revokeObjectURL(a.href);
  };
  el.importBtn.onclick = () => el.importInput.click();
  el.importInput.onchange = () => {
    const file = el.importInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        state.learned = new Set((JSON.parse(reader.result).learned || []).filter(id => FULL.byId.has(id)));
        prune(); save(); refresh();
      } catch (e) { alert('That file is not a valid progress export.'); }
    };
    reader.readAsText(file);
    el.importInput.value = '';
  };

  // pan and zoom
  let dragging = false, sx = 0, sy = 0, ox = 0, oy = 0, moved = false;
  el.viewport.addEventListener('pointerdown', ev => {
    if (ev.target.closest('.node')) return;
    dragging = true; moved = false;
    sx = ev.clientX; sy = ev.clientY; ox = state.view.x; oy = state.view.y;
    el.viewport.setPointerCapture(ev.pointerId);
    el.viewport.classList.add('grabbing');
  });
  el.viewport.addEventListener('pointermove', ev => {
    if (!dragging) return;
    const dx = ev.clientX - sx, dy = ev.clientY - sy;
    if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;
    state.view.x = ox + dx; state.view.y = oy + dy;
    applyView();
  });
  const endDrag = () => {
    if (dragging && !moved && state.selected) select(null);
    dragging = false;
    el.viewport.classList.remove('grabbing');
  };
  el.viewport.addEventListener('pointerup', endDrag);
  el.viewport.addEventListener('pointercancel', endDrag);

  el.viewport.addEventListener('wheel', ev => {
    ev.preventDefault();
    const r = el.viewport.getBoundingClientRect();
    if (ev.ctrlKey || ev.metaKey) {
      zoomBy(ev.deltaY < 0 ? 1.1 : 1 / 1.1, ev.clientX - r.left, ev.clientY - r.top);
    } else {
      state.view.x -= ev.deltaX; state.view.y -= ev.deltaY;
      applyView();
    }
  }, { passive: false });

  document.addEventListener('keydown', ev => {
    if (ev.target.tagName === 'INPUT') return;
    if (ev.key === '/') { ev.preventDefault(); el.search.focus(); }
    if (ev.key === 'Escape') select(null);
    if (ev.key === 'f') fitToScreen();
    if (ev.key === '+' || ev.key === '=') zoomBy(1.2);
    if (ev.key === '-') zoomBy(1 / 1.2);
    if (ev.key === 'Enter' && state.selected) toggle(state.selected);
  });
}

/* ------------------------------- boot ------------------------------ */

function init() {
  ['viewport','canvas','svg','chrome','nodeLayer','detail','catList','search','level','xp','levelBar',
   'levelHint','countLabel','overallBar','availableLabel','zoomIn','zoomOut','fit','reset','export',
   'importBtn','importInput','zoomLabel','availToggle','hits','catAll','catNone','total','branches']
    .forEach(k => el[k] = document.getElementById(k));

  if (FULL.problems.length) {
    console.warn('Skill data problems:\n' + FULL.problems.join('\n'));
    const w = document.getElementById('warn');
    w.hidden = false;
    w.textContent = `${FULL.problems.length} data problem(s) in the skill files — see the browser console.`;
  }

  buildSidebarCats();
  load();
  syncCatButtons();
  rebuild();
  wire();
  fitToScreen();
  el.total.textContent = FULL.nodes.length.toLocaleString();
  el.branches.textContent = CATEGORIES.length;
}

document.addEventListener('DOMContentLoaded', init);
