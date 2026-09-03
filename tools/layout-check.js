#!/usr/bin/env node
/* tools/layout-check.js — run the real layout headlessly and report the board
   size it produces, so scale problems show up before the browser does.
   Run: node tools/layout-check.js */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const files = [
  'js/skills.js',
  ...fs.readdirSync(path.join(root, 'js/skills')).filter(f => f.endsWith('.js')).sort()
      .map(f => 'js/skills/' + f),
  'js/layout.js',
];

const ctx = vm.createContext({ console });
for (const f of files) vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f });

const { buildGraph, CATEGORIES } = vm.runInContext('({ buildGraph, CATEGORIES })', ctx);

const all = buildGraph();
console.log(`\nall branches: ${all.nodes.length} nodes · ${all.edges.length} edges`);
console.log(`board: ${Math.round(all.width)} x ${Math.round(all.height)} px`);
console.log('tier widths: ' + all.columns.map(c => `T${c.tier} ${c.w}`).join('  '));
if (all.problems.length) console.log(`problems: ${all.problems.length}`);

console.log('\nper branch, focused on its own:');
const w = Math.max(...CATEGORIES.map(c => c.id.length));
for (const c of CATEGORIES) {
  const g = buildGraph([c.id]);
  console.log(`  ${c.id.padEnd(w)}  ${String(g.nodes.length).padStart(4)} nodes  ${String(Math.round(g.width)).padStart(5)} x ${String(Math.round(g.height)).padStart(5)}`);
}

/* Nodes must never overlap — the cheapest way to catch a layout bug. */
const seen = new Map();
let clashes = 0;
for (const n of all.nodes) {
  const key = Math.round(n.x) + ',' + Math.round(n.y);
  if (seen.has(key)) { clashes++; if (clashes < 6) console.log(`  overlap: ${n.id} and ${seen.get(key)}`); }
  seen.set(key, n.id);
}
console.log(clashes ? `\n✗ ${clashes} overlapping nodes` : '\n✓ no overlapping nodes');
process.exit(clashes || all.problems.length ? 1 : 0);
