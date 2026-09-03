# 🌳 Skill Tree

A life-skills progression map: every skill a person might plausibly want,
arranged in a game-style tech tree. **2,044 skills across 26 branches and 5
tiers, linked by 3,961 prerequisites** — learning one skill unlocks the more
advanced ones built on top of it.

The branches cover health, education, money, work, family, travel, food, the
outdoors, craft, technology, civic life and the rest — the whole of an ordinary
life, not just the employable parts.

No build step, no dependencies, no internet. Plain HTML, CSS and JavaScript.

## Running it on macOS

Double-click **`run.command`** in Finder. It starts a tiny local server
(Python 3, already on macOS) and opens the app in your browser. Close the
Terminal window to stop it.

From a terminal instead:

```bash
cd "path/to/this/folder"
./run.command
```

Opening `index.html` directly by double-clicking also works, but the browser
may refuse to remember your progress on `file://` URLs — use `run.command` if
you want progress saved.

> The first time you double-click, macOS may ask permission to run it.
> If Finder opens the file in a text editor instead, run
> `chmod +x run.command` once in Terminal.

## Finding your way around 2,000 skills

The whole board is about 3,900 × 18,000 pixels, so the default view is an
overview rather than something you read. Two things make it usable:

- **Focus one branch.** Hover a branch in the sidebar and click **only**. The
  layout re-flows for that branch alone — taller and narrower, so it fits the
  width of the screen at a readable zoom. This is the intended way to work.
- **Search.** Press `/` and type. It matches names, groups and descriptions,
  shows a match count, and `Enter` jumps to and selects the first hit.

Your branch selection is remembered along with your progress, so you come back
to whatever you were working through.

## How it works

- **Tiers run left to right** — Tier 1 (Foundation) through Tier 5 (Mastery).
- **Branches are the horizontal bands**, and within a band skills are clustered
  by **group** — the sub-domain shown above each skill's name (`T3 · Camp
  Craft`) and in the detail panel.
- A tier is not a single column any more. Each band picks a block height from
  the size of its biggest tier, and wraps into as many sub-columns as it needs.
  The fewer branches are on screen, the taller and narrower those blocks get.
- A skill is **locked** until every prerequisite is learned. Prerequisites cross
  branches constantly — Storytelling needs Public Speaking *and* Creative
  Writing; Machine Learning needs Data Analysis *and* Calculus; Sourdough needs
  Bread Making *and* Fermentation. Cross-branch links are dashed.
- Marking a skill learned awards XP (tier × 10) and levels you up.
- Unlearning a skill also unlearns everything built on top of it, so the tree
  is always internally consistent.

## Controls

| Action | How |
|---|---|
| See a skill's requirements and unlocks | click it |
| Mark learned / not learned | ⇧-click, double-click, or the button in the panel |
| Learn an entire prerequisite chain at once | select a locked skill → **Learn the whole path** |
| Focus one branch | hover a branch in the sidebar → **only** |
| Show/hide a branch | click its name in the sidebar |
| Show every branch / just one | **all** / **one** next to the Branches heading |
| Pan | drag the background |
| Zoom | ⌘-scroll, or the +/− buttons |
| Fit to screen | **Fit**, or press `f` |
| Search | type in the box, or press `/` (Enter jumps to the first match) |
| Hide everything still locked | **Hide locked** checkbox |
| Back up / move progress | **Export** and **Import** (a small JSON file) |

Progress is stored in your browser's `localStorage`, per browser. Export if you
want it somewhere permanent.

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
| `index.html` | Page structure, and the script tags that load each branch |
| `css/styles.css` | All styling |
| `js/skills.js` | Categories, tiers, and the registry the branch files append to |
| `js/skills/*.js` | The skill data — 26 files, one per branch. The files you'll edit |
| `js/layout.js` | Builds the graph and positions every node and connector |
| `js/app.js` | Progress state, rendering, interaction, save/load |
| `tools/validate.js` | Data integrity checks |
| `tools/layout-check.js` | Layout sanity checks |
| `run.command` | macOS launcher |
