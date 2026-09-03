/* ------------------------------------------------------------------
   pdf.js — a small PDF writer, written from scratch.

   The project has no build step, no dependencies and no internet, so
   pulling in a PDF library was not an option. This does the subset the
   progress report actually needs: multiple pages, the two built-in
   Helvetica faces (no font embedding required), wrapped and aligned
   text, filled and stroked rectangles, rounded rectangles and lines.

   Coordinates are top-left origin with y running down the page, which
   is how layout is easier to think about; the flip into PDF's
   bottom-left space happens on the way out.

     const doc = new PDF();
     doc.text('Hello', 48, 48, { size: 18, bold: true });
     doc.save('hello.pdf');
------------------------------------------------------------------ */

const PDF = (() => {

  /* Widths (per 1000 units) for the two standard faces, chars 32..126. */
  const W_REG = [278,278,355,556,556,889,667,191,333,333,389,584,278,333,278,278,
    556,556,556,556,556,556,556,556,556,556,278,278,584,584,584,556,1015,
    667,667,722,722,667,611,778,722,278,500,667,556,833,722,778,667,778,722,667,611,722,667,944,667,667,611,
    278,278,278,469,556,333,
    556,556,500,556,556,278,556,556,222,222,500,222,833,556,556,556,556,333,500,278,556,500,722,500,500,500,
    334,260,334,584];

  const W_BOLD = [278,333,474,556,556,889,722,238,333,333,389,584,278,333,278,278,
    556,556,556,556,556,556,556,556,556,556,333,333,584,584,584,611,975,
    722,722,722,722,667,611,778,722,278,556,722,611,833,722,778,667,778,722,667,611,722,667,944,667,667,611,
    333,278,333,584,556,333,
    556,611,556,611,556,333,611,611,278,278,556,278,889,611,611,611,611,389,556,333,611,556,778,556,556,500,
    389,280,389,584];

  /* Everything is written as ASCII so byte offsets in the xref table are
     predictable. Typographic punctuation and accents are folded down
     rather than dropped, and anything else (emoji included) is removed. */
  const FOLD = {
    '‘': "'", '’': "'", '‚': "'", '“': '"', '”': '"', '„': '"',
    '–': '-', '—': '-', '−': '-', '…': '...', '·': '-', '•': '-',
    '×': 'x', ' ': ' ', '′': "'", '″': '"',
    'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a', 'æ': 'ae',
    'ç': 'c', 'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',
    'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i', 'ñ': 'n',
    'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o', 'ø': 'o',
    'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u', 'ý': 'y', 'ÿ': 'y',
    'ß': 'ss', 'œ': 'oe',
  };

  function ascii(str) {
    let out = '';
    for (const ch of String(str)) {
      if (ch >= ' ' && ch <= '~') { out += ch; continue; }
      const f = FOLD[ch] || FOLD[ch.toLowerCase()];
      if (f) out += (ch === ch.toLowerCase() ? f : f.toUpperCase());
    }
    return out;
  }

  const esc = s => s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

  function rgb(hex) {
    const h = hex.replace('#', '');
    const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
    return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]
      .map(v => v.toFixed(3)).join(' ');
  }

  const K = 0.5523;   // circle-to-bezier constant

  class PDF {
    constructor(opts = {}) {
      this.w = opts.width || 595.28;      // A4 portrait
      this.h = opts.height || 841.89;
      this.pages = [];
      this.addPage();
    }

    addPage() { this.pages.push([]); this.page = this.pages[this.pages.length - 1]; return this; }
    get pageCount() { return this.pages.length; }
    op(s) { this.page.push(s); return this; }

    /* ------------------------------ text ------------------------------ */

    /** Width of `str` at `size`, in points. */
    measure(str, size = 11, bold = false) {
      const t = ascii(str), tab = bold ? W_BOLD : W_REG;
      let w = 0;
      for (let i = 0; i < t.length; i++) {
        const c = t.charCodeAt(i) - 32;
        w += (c >= 0 && c < tab.length ? tab[c] : 500);
      }
      return w * size / 1000;
    }

    /** Greedy wrap of `str` into lines no wider than `max`. */
    wrap(str, max, size = 11, bold = false) {
      const words = ascii(str).split(/\s+/).filter(Boolean);
      const lines = [];
      let line = '';
      for (const word of words) {
        const test = line ? line + ' ' + word : word;
        if (this.measure(test, size, bold) <= max || !line) { line = test; continue; }
        lines.push(line); line = word;
      }
      if (line) lines.push(line);
      return lines.length ? lines : [''];
    }

    /** Truncate to `max` points, adding an ellipsis when it does not fit. */
    clip(str, max, size = 11, bold = false) {
      let t = ascii(str);
      if (this.measure(t, size, bold) <= max) return t;
      while (t.length && this.measure(t + '...', size, bold) > max) t = t.slice(0, -1);
      return t.replace(/[\s,;:-]+$/, '') + '...';
    }

    /**
     * Draw text at (x, y), where y is the TOP of the first line.
     * Returns the y coordinate directly below the block.
     */
    text(str, x, y, o = {}) {
      const size = o.size || 11;
      const bold = !!o.bold;
      const lh = size * (o.lineHeight || 1.35);
      const color = o.color || '#000000';
      const lines = o.width ? this.wrap(str, o.width, size, bold)
                            : [o.clip ? this.clip(str, o.clip, size, bold) : ascii(str)];
      const use = o.maxLines ? lines.slice(0, o.maxLines) : lines;

      this.op('BT /' + (bold ? 'F2' : 'F1') + ' ' + size + ' Tf ' + rgb(color) + ' rg');
      use.forEach((ln, i) => {
        let tx = x;
        if (o.align === 'right')  tx = x - this.measure(ln, size, bold);
        if (o.align === 'center') tx = x - this.measure(ln, size, bold) / 2;
        // PDF baselines sit on the text bottom; shift down by the cap height.
        const by = this.h - (y + i * lh + size * 0.76);
        this.op('1 0 0 1 ' + tx.toFixed(2) + ' ' + by.toFixed(2) + ' Tm (' + esc(ln) + ') Tj');
      });
      this.op('ET');
      return y + use.length * lh;
    }

    /* ---------------------------- graphics ---------------------------- */

    rect(x, y, w, h, o = {}) {
      const r = Math.min(o.r || 0, w / 2, h / 2);
      const top = this.h - y, bot = this.h - (y + h);

      if (r > 0) {
        const c = r * K;
        this.op((x + r).toFixed(2) + ' ' + top.toFixed(2) + ' m');
        this.op((x + w - r).toFixed(2) + ' ' + top.toFixed(2) + ' l');
        this.op((x + w - r + c).toFixed(2) + ' ' + top.toFixed(2) + ' ' + (x + w).toFixed(2) + ' ' + (top - r + c).toFixed(2) + ' ' + (x + w).toFixed(2) + ' ' + (top - r).toFixed(2) + ' c');
        this.op((x + w).toFixed(2) + ' ' + (bot + r).toFixed(2) + ' l');
        this.op((x + w).toFixed(2) + ' ' + (bot + r - c).toFixed(2) + ' ' + (x + w - r + c).toFixed(2) + ' ' + bot.toFixed(2) + ' ' + (x + w - r).toFixed(2) + ' ' + bot.toFixed(2) + ' c');
        this.op((x + r).toFixed(2) + ' ' + bot.toFixed(2) + ' l');
        this.op((x + r - c).toFixed(2) + ' ' + bot.toFixed(2) + ' ' + x.toFixed(2) + ' ' + (bot + r - c).toFixed(2) + ' ' + x.toFixed(2) + ' ' + (bot + r).toFixed(2) + ' c');
        this.op(x.toFixed(2) + ' ' + (top - r).toFixed(2) + ' l');
        this.op(x.toFixed(2) + ' ' + (top - r + c).toFixed(2) + ' ' + (x + r - c).toFixed(2) + ' ' + top.toFixed(2) + ' ' + (x + r).toFixed(2) + ' ' + top.toFixed(2) + ' c');
        this.op('h');
      } else {
        this.op(x.toFixed(2) + ' ' + bot.toFixed(2) + ' ' + w.toFixed(2) + ' ' + h.toFixed(2) + ' re');
      }

      if (o.fill) this.op(rgb(o.fill) + ' rg');
      if (o.stroke) this.op(rgb(o.stroke) + ' RG ' + (o.lineWidth || 1) + ' w');
      this.op(o.fill && o.stroke ? 'B' : o.stroke ? 'S' : 'f');
      return this;
    }

    line(x1, y1, x2, y2, o = {}) {
      this.op(rgb(o.color || '#e6e9ed') + ' RG ' + (o.width || 1) + ' w');
      this.op(x1.toFixed(2) + ' ' + (this.h - y1).toFixed(2) + ' m ' + x2.toFixed(2) + ' ' + (this.h - y2).toFixed(2) + ' l S');
      return this;
    }

    /** A rounded track with a filled portion — used for every progress bar. */
    bar(x, y, w, h, frac, o = {}) {
      this.rect(x, y, w, h, { fill: o.track || '#eceef1', r: h / 2 });
      const fw = Math.max(0, Math.min(1, frac)) * w;
      if (fw > 0.6) this.rect(x, y, Math.max(fw, h), h, { fill: o.fill || '#10794f', r: h / 2 });
      return this;
    }

    /* ----------------------------- output ----------------------------- */

    build() {
      const objs = [];
      const add = body => { objs.push(body); return objs.length; };   // returns object number

      const catalog = add(null);          // 1, patched below
      const pagesObj = add(null);         // 2
      const f1 = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
      const f2 = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');

      const kids = [];
      for (const ops of this.pages) {
        const stream = ops.join('\n');
        const contentNo = add('<< /Length ' + stream.length + ' >>\nstream\n' + stream + '\nendstream');
        const pageNo = add('<< /Type /Page /Parent ' + pagesObj + ' 0 R /MediaBox [0 0 ' +
          this.w.toFixed(2) + ' ' + this.h.toFixed(2) + '] /Resources << /Font << /F1 ' + f1 +
          ' 0 R /F2 ' + f2 + ' 0 R >> >> /Contents ' + contentNo + ' 0 R >>');
        kids.push(pageNo + ' 0 R');
      }

      objs[catalog - 1] = '<< /Type /Catalog /Pages ' + pagesObj + ' 0 R >>';
      objs[pagesObj - 1] = '<< /Type /Pages /Kids [' + kids.join(' ') + '] /Count ' + kids.length + ' >>';

      let out = '%PDF-1.4\n';
      const offsets = [0];
      objs.forEach((body, i) => {
        offsets.push(out.length);
        out += (i + 1) + ' 0 obj\n' + body + '\nendobj\n';
      });

      const xref = out.length;
      out += 'xref\n0 ' + (objs.length + 1) + '\n0000000000 65535 f \n';
      for (let i = 1; i <= objs.length; i++) out += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
      out += 'trailer\n<< /Size ' + (objs.length + 1) + ' /Root ' + catalog + ' 0 R >>\nstartxref\n' + xref + '\n%%EOF';

      const bytes = new Uint8Array(out.length);
      for (let i = 0; i < out.length; i++) bytes[i] = out.charCodeAt(i) & 0xff;
      return bytes;
    }

    blob() { return new Blob([this.build()], { type: 'application/pdf' }); }

    save(filename) {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(this.blob());
      a.download = filename;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    }
  }

  PDF.ascii = ascii;
  return PDF;
})();
