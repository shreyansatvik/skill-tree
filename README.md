# Skill Tree

**▶ [Open the app](https://shreyansatvik.github.io/skill-tree/)** — runs in
your browser, nothing to install.

A life-skills progression map: every skill a person might plausibly want,
arranged in a game-style tech tree. **2,044 skills across 26 branches and 5
tiers, linked by 3,961 prerequisites** — learning one skill unlocks the more
advanced ones built on top of it.

The branches cover health, education, money, work, family, travel, food, the
outdoors, craft, technology, civic life and the rest — the whole of an ordinary
life, not just the employable parts.

No build step, no dependencies, no internet. Plain HTML, CSS and JavaScript.

## Running it

The easiest way is the hosted copy —
**<https://shreyansatvik.github.io/skill-tree/>** — which needs nothing
installed and saves your progress in that browser.

To run it yourself instead, on any platform, with no install beyond Python 3
(already present on macOS and Linux; on Windows get it from
[python.org](https://www.python.org/downloads/) or the Microsoft Store):

```bash
git clone https://github.com/shreyansatvik/skill-tree.git
cd skill-tree
python3 run.py        # Windows: py run.py
```

It picks a free port, serves the folder, and opens your browser. Press
`Ctrl-C` to stop.

**On macOS** you can instead double-click **`run.command`** in Finder, which
opens a Terminal window and does the same thing; close the window to stop it.

> **Don't just double-click `index.html`.** Browsers block `localStorage` on
> `file://` pages, so your profile and progress are silently discarded on
> every reload. The app detects this and says so, but the fix is to serve it
> with `run.py`.

### Hosting it

The site is plain static files, so it works on any static host. This repo
publishes to <https://shreyansatvik.github.io/skill-tree/> through
`.github/workflows/pages.yml`, which validates the skill data and the board
layout first, so a broken `req` id cannot reach the live site.

To point a fork at your own copy, enable Pages once under **Settings → Pages →
Build and deployment → Source: GitHub Actions** — the workflow cannot switch
it on for you, because the built-in token is not allowed to create a Pages
site. The repository also has to be public for Pages to serve it on a free
plan.

## Setting up

The first time you open the app you're asked for a name, age and gender.
Nothing is uploaded — it's stored in this browser's `localStorage` alongside
your progress, and is only used to head up the PDF report you export. You can
edit it or clear it at any time from the profile menu in the bottom-left
corner.

## Finding your way around 2,000 skills

The whole board is about 3,900 × 18,000 pixels, so the default view is an
overview rather than something you read. Two things make it usable:

- **Focus one branch.** Click a branch in the left rail. The layout re-flows
  for that branch alone — taller and narrower, so it fits the width of the
  screen at a readable zoom. This is the intended way to work. **All
  branches** at the top of the rail returns to the full board.
- **Search.** Press `/` and type. It matches names, groups and descriptions.

The header also carries three filter pills — **Branches**, **Tier** and
**Status** — for combinations the rail can't express: several branches at
once, a single tier across everything, or only the skills that are ready to
start. **Clear filters** appears whenever any of them, or a search, is active.

Your branch selection is remembered along with your progress, so you come back
to whatever you were working through.

## How it works

- **Tiers run left to right** — Tier 1 (Foundation) through Tier 5 (Mastery).
- **Branches are the horizontal bands**, and within a band skills are clustered
  by **group** — the sub-domain shown above each skill's name (`T3 · Camp
  Craft`) and in the skill card.
- A tier is not a single column any more. Each band picks a block height from
  the size of its biggest tier, and wraps into as many sub-columns as it needs.
  The fewer branches are on screen, the taller and narrower those blocks get.
- A skill is **locked** until every prerequisite is learned. Prerequisites cross
  branches constantly — Storytelling needs Public Speaking *and* Creative
  Writing; Machine Learning needs Data Analysis *and* Calculus; Sourdough needs
  Bread Making *and* Fermentation. Cross-branch links are drawn fainter than
  links inside a branch.
- Marking a skill learned awards XP (tier × 10) and levels you up.
- Unlearning a skill also unlearns everything built on top of it, so the tree
  is always internally consistent.
- Clicking a skill opens a floating card — drag it by its header if it's in
  the way of what you're looking at.

## Controls

| Action | How |
|---|---|
| See a skill's requirements and unlocks | click it — opens the floating card |
| Mark learned / not learned | ⇧-click, double-click, or the button on the card |
| Learn an entire prerequisite chain at once | select a locked skill → **Whole path** |
| Focus one branch | click it in the left rail |
| Show every branch | **All branches** at the top of the rail |
| Filter by several branches, a tier, or status | the **Branches** / **Tier** / **Status** pills |
| Pan | drag the background |
| Zoom | ⌘-scroll, or the +/− buttons |
| Fit to screen | **Fit**, or press `f` |
| Search | type in the box, or press `/` |
| Reset progress | **Reset** in the rail |
| Export a personalised progress report | **Export report** — downloads a PDF |
| Move progress to another browser | **Restore** — paste the code from a report |
| Edit your name / age / gender | the profile card, bottom-left |

Progress and your profile are stored in your browser's `localStorage`, per
browser. Export a report if you want a permanent, personal, human-readable
record — its last page carries a compact restore code you can paste into
**Restore** on any other browser to bring the same progress back.

## Adding your own skills

The data lives in [`js/skills/`](js/skills/), one file per branch. A skill is
one object inside an `addSkills` block, which stamps the shared `cat` and
`group` onto everything in it:

```js
addSkills({ cat: 'food', group: 'Baking' }, [
  { id:'sourdough', name:'Sourdough', tier:4, req:['bread','fermenting'],
    desc:'Keep a starter alive and bake a decent loaf from it, repeatedly.' },
]);
```

- `id` — unique, lowercase, hyphenated; referenced by other skills' `req`
- `cat` — one of the ids in `CATEGORIES` in [`js/skills.js`](js/skills.js)
- `group` — the sub-domain label; groups appear in the order first written
- `tier` — 1–5; a prerequisite may be the same tier or lower, never higher
- `req` — ids that must be learned first (up to four); `[]` makes it a starting skill
- `desc` — what actually having this skill means

Save and reload the page — layout, connections, counts and XP all rebuild
themselves. If you make a typo in a `req` id, a warning bar appears at the top
of the app and the details go to the browser console.

To add a whole new branch, add an entry to `CATEGORIES` (id, name, colour,
icon), create `js/skills/<id>.js`, and add a `<script>` tag for it in
`index.html` alongside the others.

New skills should be appended to the end of a branch file rather than inserted
in the middle — restore codes encode progress as a bitset over the order
skills are defined in, so appending keeps old codes decoding correctly.

### Checking your edits

Two scripts run the real data and the real layout under Node, so mistakes show
up without opening a browser:

```bash
node tools/validate.js      # ids, tiers, cycles, reachability, per-branch counts
node tools/layout-check.js  # board dimensions, and that no two nodes overlap
```

`validate.js` catches the easy things to get wrong at this scale: duplicate
ids, a `req` pointing at nothing, a prerequisite in a *higher* tier than the
skill that needs it, a dependency cycle, and any skill that can never be
reached from an empty slate.

## Files

| File | What's in it |
|---|---|
| `index.html` | Page structure — login gate, app shell, and the script tags that load each branch |
| `css/styles.css` | All styling |
| `js/skills.js` | Categories, tiers, and the registry the branch files append to |
| `js/skills/*.js` | The skill data — 26 files, one per branch. The files you'll edit |
| `js/layout.js` | Builds the graph and positions every node and connector |
| `js/app.js` | Profile, progress state, rendering, interaction, save/load |
| `js/pdf.js` | A small from-scratch PDF writer — text, wrapping, bars, rounded rects |
| `js/report.js` | Lays out the personalised progress report on top of `pdf.js` |
| `tools/validate.js` | Data integrity checks |
| `tools/layout-check.js` | Layout sanity checks |
| `run.py` | Cross-platform launcher — Windows, macOS, Linux |
| `run.command` | macOS launcher, double-clickable in Finder |
| `.github/workflows/pages.yml` | Validates the data and publishes to GitHub Pages |
