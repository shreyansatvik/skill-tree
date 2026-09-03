#!/usr/bin/env node
/* tools/validate.js — load the skill data the same way the browser does and
   report anything the app would choke on. Run: node tools/validate.js */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const files = [
  'js/skills.js',
  ...fs.readdirSync(path.join(root, 'js/skills')).filter(f => f.endsWith('.js')).sort()
      .map(f => 'js/skills/' + f),
];

const ctx = vm.createContext({ console });
for (const f of files) {
  try { vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f }); }
  catch (e) { console.error(`✗ ${f}: ${e.message}`); process.exit(1); }
}

/* top-level `const` lives in the script's lexical scope, not on the context
   object — pull the bindings out with one more evaluation. */
const { SKILLS, CATEGORIES } = vm.runInContext('({ SKILLS, CATEGORIES })', ctx);
const catIds = new Set(CATEGORIES.map(c => c.id));
const problems = [];
const byId = new Map();

for (const s of SKILLS) {
  if (!s.id) { problems.push(`skill with no id: ${JSON.stringify(s)}`); continue; }
  if (byId.has(s.id)) problems.push(`duplicate id "${s.id}"`);
  byId.set(s.id, s);
  if (!s.name) problems.push(`"${s.id}" has no name`);
  if (!s.desc) problems.push(`"${s.id}" has no desc`);
  if (!s.group) problems.push(`"${s.id}" has no group`);
  if (!catIds.has(s.cat)) problems.push(`"${s.id}" has unknown cat "${s.cat}"`);
  if (!(s.tier >= 1 && s.tier <= 5)) problems.push(`"${s.id}" has bad tier ${s.tier}`);
  if (!Array.isArray(s.req)) problems.push(`"${s.id}" req is not an array`);
  if (!/^[a-z0-9-]+$/.test(s.id || '')) problems.push(`"${s.id}" is not a clean slug`);
}

for (const s of byId.values()) {
  const seen = new Set();
  for (const r of s.req || []) {
    if (seen.has(r)) problems.push(`"${s.id}" lists "${r}" twice`);
    seen.add(r);
    if (r === s.id) { problems.push(`"${s.id}" requires itself`); continue; }
    const p = byId.get(r);
    if (!p) { problems.push(`"${s.id}" requires unknown skill "${r}"`); continue; }
    if (p.tier > s.tier) problems.push(`"${s.id}" (T${s.tier}) requires "${r}" (T${p.tier}) — higher tier`);
  }
  if ((s.req || []).length > 4) problems.push(`"${s.id}" has ${s.req.length} prerequisites — keep it to 4`);
}

/* Cycles: a tier-1 skill with prerequisites, or any strongly-connected loop. */
const colour = new Map();
function walk(id, trail) {
  if (colour.get(id) === 2) return;
  if (colour.get(id) === 1) { problems.push(`cycle: ${trail.slice(trail.indexOf(id)).join(' -> ')} -> ${id}`); return; }
  colour.set(id, 1);
  for (const r of byId.get(id).req || []) if (byId.has(r)) walk(r, [...trail, id]);
  colour.set(id, 2);
}
for (const id of byId.keys()) walk(id, []);

/* Reachability: every skill must be learnable from an empty slate. */
const learned = new Set();
let grew = true;
while (grew) {
  grew = false;
  for (const s of byId.values()) {
    if (!learned.has(s.id) && (s.req || []).every(r => learned.has(r))) { learned.add(s.id); grew = true; }
  }
}
for (const s of byId.values()) if (!learned.has(s.id)) problems.push(`"${s.id}" is unreachable — its prerequisite chain never resolves`);

/* ------------------------------ report ------------------------------ */
const perCat = new Map(CATEGORIES.map(c => [c.id, []]));
for (const s of SKILLS) if (perCat.has(s.cat)) perCat.get(s.cat).push(s);

const tierCount = [1, 2, 3, 4, 5].map(t => SKILLS.filter(s => s.tier === t).length);
const edges = SKILLS.reduce((n, s) => n + (s.req || []).length, 0);
const cross = SKILLS.reduce((n, s) => n + (s.req || []).filter(r => byId.get(r) && byId.get(r).cat !== s.cat).length, 0);

console.log(`\n${SKILLS.length} skills · ${CATEGORIES.length} branches · ${edges} links (${cross} cross-branch)`);
console.log(`tiers: ` + tierCount.map((n, i) => `T${i + 1} ${n}`).join('  ') + '\n');

const width = Math.max(...CATEGORIES.map(c => c.id.length));
for (const c of CATEGORIES) {
  const list = perCat.get(c.id);
  const per = [1, 2, 3, 4, 5].map(t => String(list.filter(s => s.tier === t).length).padStart(3));
  const groups = new Set(list.map(s => s.group)).size;
  console.log(`  ${c.id.padEnd(width)}  ${String(list.length).padStart(4)}  [${per.join('')} ]  ${groups} groups`);
}

if (problems.length) {
  console.error(`\n✗ ${problems.length} problem(s):`);
  for (const p of problems.slice(0, 60)) console.error('   ' + p);
  if (problems.length > 60) console.error(`   … and ${problems.length - 60} more`);
  process.exit(1);
}
console.log('\n✓ data is clean\n');
