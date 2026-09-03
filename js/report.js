/* ------------------------------------------------------------------
   report.js — composes the personalised PDF progress report.

   Everything here is layout: pdf.js does the drawing, this decides what
   goes on the page and where. Exports one function:

     Report.build({ profile, learned, xp, level, levelInto, levelNeed,
                    restoreCode })  ->  PDF document

   It reads FULL, CATEGORIES and TIERS from the loaded skill data.
------------------------------------------------------------------ */

const Report = (() => {

  const INK = '#16181d', GREEN = '#10794f', BLUE = '#2563eb';
  const TEXT = '#0e1116', TEXT2 = '#454d59', MUTED = '#868e9c', FAINT = '#a8b0bc';
  const LINE = '#e6e9ed', TRACK = '#eceef1', SOFT = '#f5f6f8';

  const M = 46;                       // page margin
  const FOOT = 58;                    // reserved footer strip

  const nf = n => n.toLocaleString('en-US');

  /* A cursor that knows how to start a new page when a block will not fit. */
  function makeFlow(doc) {
    const flow = {
      doc, y: M, w: doc.w - M * 2, x: M,
      bottom: doc.h - FOOT,
      ensure(h) {
        if (this.y + h <= this.bottom) return false;
        doc.addPage();
        this.y = M;
        return true;
      },
      gap(h) { this.y += h; return this; },
    };
    return flow;
  }

  /* ---------------------------- components --------------------------- */

  function coverBand(doc, f, profile, generated) {
    const h = 118;
    doc.rect(0, 0, doc.w, h, { fill: INK });

    // wordmark tile
    doc.rect(M, 26, 22, 22, { fill: '#ffffff', r: 6 });
    doc.text('ST', M + 11, 32, { size: 10, bold: true, color: INK, align: 'center' });

    doc.text('SKILL TREE', M + 32, 31, { size: 9, bold: true, color: '#8b93a1' });
    doc.text('Progress report', M + 32, 41, { size: 9, color: '#8b93a1' });

    doc.text(generated, doc.w - M, 31, { size: 9, color: '#8b93a1', align: 'right' });

    doc.text(profile.name || 'Unnamed', M, 66, { size: 25, bold: true, color: '#ffffff', clip: f.w });
    const meta = [
      profile.age ? profile.age + ' years old' : null,
      profile.gender || null,
    ].filter(Boolean).join('   ·   ');
    if (meta) doc.text(meta, M, 96, { size: 10, color: '#9aa2b0' });

    f.y = h + 30;
  }

  function sectionTitle(doc, f, label, note) {
    f.ensure(40);
    doc.text(label.toUpperCase(), f.x, f.y, { size: 8.5, bold: true, color: MUTED });
    if (note) doc.text(note, f.x + f.w, f.y, { size: 8.5, color: FAINT, align: 'right' });
    f.y += 15;
    doc.line(f.x, f.y, f.x + f.w, f.y, { color: LINE });
    f.y += 14;
  }

  function statRow(doc, f, stats) {
    f.ensure(56);
    const cw = f.w / stats.length;
    stats.forEach((s, i) => {
      const x = f.x + i * cw;
      doc.text(s.v, x, f.y, { size: 21, bold: true, color: s.color || TEXT });
      doc.text(s.l, x, f.y + 27, { size: 9, color: MUTED });
    });
    f.y += 50;
  }

  function barRow(doc, f, label, count, total, color, opts = {}) {
    const rowH = 26;
    f.ensure(rowH);
    const labelW = opts.labelW || 168;
    const numW = 74;
    const barW = f.w - labelW - numW - 16;
    const frac = total ? count / total : 0;

    if (opts.swatch) doc.rect(f.x, f.y + 3.5, 6, 6, { fill: opts.swatch, r: 2 });
    doc.text(label, f.x + (opts.swatch ? 13 : 0), f.y, {
      size: 9.5, color: TEXT2, clip: labelW - (opts.swatch ? 15 : 0),
    });

    doc.bar(f.x + labelW, f.y + 3, barW, 6, frac, { fill: color, track: TRACK });

    doc.text(nf(count) + ' / ' + nf(total), f.x + f.w, f.y, {
      size: 9.5, color: count ? TEXT : FAINT, align: 'right',
    });
    f.y += rowH;
  }

  /* Wrapped run of comma-separated names under a small heading, able to
     spill across a page break one line at a time. */
  function nameBlock(doc, f, heading, swatch, names) {
    const size = 9.5, lh = size * 1.45;
    const lines = doc.wrap(names.join(',  '), f.w - 14, size, false);

    // keep the heading with at least a couple of its lines
    f.ensure(15 + lh * Math.min(2, lines.length) + 6);

    doc.rect(f.x, f.y + 3, 6, 6, { fill: swatch, r: 2 });
    doc.text(heading, f.x + 13, f.y, { size: 9.5, bold: true, color: TEXT });
    doc.text(String(names.length), f.x + f.w, f.y, { size: 9, color: FAINT, align: 'right' });
    f.y += 15;

    for (const ln of lines) {
      f.ensure(lh);
      doc.text(ln, f.x + 13, f.y, { size, color: TEXT2 });
      f.y += lh;
    }
    f.y += 12;
  }

  function footers(doc, profile, generated) {
    const total = doc.pageCount;
    for (let i = 0; i < total; i++) {
      doc.page = doc.pages[i];
      const y = doc.h - 34;
      doc.line(M, y - 12, doc.w - M, y - 12, { color: LINE });
      doc.text(PDF.ascii(profile.name || 'Skill Tree') + '  ·  ' + generated, M, y, { size: 8, color: FAINT });
      doc.text('Page ' + (i + 1) + ' of ' + total, doc.w - M, y, { size: 8, color: FAINT, align: 'right' });
    }
  }

  /* ------------------------------ build ------------------------------ */

  function build(input) {
    const { profile, learned, xp, level, restoreCode } = input;
    const doc = new PDF();
    const f = makeFlow(doc);

    const generated = new Date().toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric',
    });

    const all = FULL.nodes;
    const total = all.length;
    const isLearned = id => learned.has(id);
    const isReady = n => !isLearned(n.id) && n.req.every(r => isLearned(r));

    const done = all.filter(n => isLearned(n.id));
    const ready = all.filter(isReady);
    const lockedN = total - done.length - ready.length;
    const pct = total ? done.length / total : 0;

    /* per branch */
    const branches = CATEGORIES.map(c => {
      const inCat = all.filter(n => n.cat === c.id);
      const d = inCat.filter(n => isLearned(n.id));
      return {
        cat: c, total: inCat.length, done: d.length,
        frac: inCat.length ? d.length / inCat.length : 0,
        names: d.sort((a, b) => a.tier - b.tier || a.name.localeCompare(b.name)).map(n => n.name),
        readyCount: inCat.filter(isReady).length,
      };
    });
    const started = branches.filter(b => b.done > 0);
    const strongest = branches.slice().sort((a, b) => b.done - a.done || b.frac - a.frac)[0];
    const deepest = done.length ? Math.max(...done.map(n => n.tier)) : 0;

    /* ---------------------------- page 1 ---------------------------- */
    coverBand(doc, f, profile, generated);

    // summary sentence — the personal part
    const summary = done.length === 0
      ? 'You have not marked anything as learned yet. ' + nf(ready.length) +
        ' skills are open to you right now with no prerequisites standing in the way.'
      : 'You have learned ' + nf(done.length) + ' of ' + nf(total) + ' skills (' +
        (pct * 100).toFixed(1) + '%), across ' + started.length + ' of ' + CATEGORIES.length +
        ' branches. Your strongest branch is ' + strongest.cat.name + ' at ' +
        strongest.done + ' of ' + strongest.total + '. ' + nf(ready.length) +
        ' more skills are unlocked and waiting to be started.';
    f.y = doc.text(summary, f.x, f.y, { size: 11, color: TEXT2, width: f.w, lineHeight: 1.5 });
    f.gap(20);

    statRow(doc, f, [
      { v: String(level), l: 'Level' },
      { v: nf(xp), l: 'Total XP' },
      { v: nf(done.length), l: 'Skills learned' },
      { v: (pct * 100).toFixed(1) + '%', l: 'Complete', color: GREEN },
    ]);

    sectionTitle(doc, f, 'Overall completion');
    doc.bar(f.x, f.y, f.w, 9, pct, { fill: GREEN, track: TRACK });
    f.y += 20;
    doc.text(nf(done.length) + ' learned', f.x, f.y, { size: 9, color: MUTED });
    doc.text(nf(total - done.length) + ' remaining', f.x + f.w, f.y, { size: 9, color: MUTED, align: 'right' });
    f.gap(26);

    sectionTitle(doc, f, 'Status breakdown');
    barRow(doc, f, 'Learned', done.length, total, GREEN, { swatch: GREEN });
    barRow(doc, f, 'Ready to start', ready.length, total, BLUE, { swatch: BLUE });
    barRow(doc, f, 'Locked', lockedN, total, '#c6ccd5', { swatch: '#c6ccd5' });
    f.gap(10);

    sectionTitle(doc, f, 'Tier reach', 'Deepest reached: tier ' + (deepest || '—'));
    for (const t of TIERS) {
      const inTier = all.filter(n => n.tier === t.tier);
      const d = inTier.filter(n => isLearned(n.id)).length;
      barRow(doc, f, 'Tier ' + t.tier + ' · ' + t.name, d, inTier.length, INK, { labelW: 168 });
    }
    f.gap(10);

    /* --------------------------- branches --------------------------- */
    sectionTitle(doc, f, 'Branch progress', CATEGORIES.length + ' branches');
    for (const b of branches) {
      barRow(doc, f, b.cat.name, b.done, b.total, b.cat.color, { swatch: b.cat.color });
    }
    f.gap(8);

    /* ------------------------ what you learned ---------------------- */
    if (done.length) {
      f.ensure(90);
      sectionTitle(doc, f, 'What you have learned', nf(done.length) + ' skills');
      for (const b of branches) {
        if (!b.names.length) continue;
        nameBlock(doc, f, b.cat.name, b.cat.color, b.names);
      }
    }

    /* --------------------------- next steps -------------------------- */
    if (ready.length) {
      f.ensure(90);
      sectionTitle(doc, f, 'Ready to start next', nf(ready.length) + ' unlocked');

      const byBranch = new Map();
      for (const n of ready.slice().sort((a, b) => a.tier - b.tier || a.name.localeCompare(b.name))) {
        if (!byBranch.has(n.cat)) byBranch.set(n.cat, []);
        byBranch.get(n.cat).push(n);
      }
      for (const c of CATEGORIES) {
        const list = byBranch.get(c.id);
        if (!list) continue;
        nameBlock(doc, f, c.name, c.color, list.map(n => n.name + ' (T' + n.tier + ')'));
      }
    }

    /* -------------------------- restore code ------------------------- */
    if (restoreCode) {
      f.ensure(130);
      sectionTitle(doc, f, 'Restore code');
      f.y = doc.text(
        'This report is also your backup. Paste the code below into Restore in the app to put ' +
        'this exact progress back on any browser.',
        f.x, f.y, { size: 9.5, color: MUTED, width: f.w, lineHeight: 1.45 });
      f.gap(8);

      const lines = [];
      for (let i = 0; i < restoreCode.length; i += 74) lines.push(restoreCode.slice(i, i + 74));
      const boxH = 14 + lines.length * 11.5;
      f.ensure(boxH + 10);
      doc.rect(f.x, f.y, f.w, boxH, { fill: SOFT, stroke: LINE, r: 6 });
      lines.forEach((ln, i) => doc.text(ln, f.x + 10, f.y + 8 + i * 11.5, { size: 7.6, color: TEXT2 }));
      f.y += boxH + 10;
    }

    footers(doc, profile, generated);
    return doc;
  }

  return { build };
})();
