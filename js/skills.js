/* ------------------------------------------------------------------
   skills.js — the skill universe: categories, tiers, and the registry
   that every js/skills/*.js domain file pushes into.

   A skill:
     id     unique slug (referenced by other skills' `req`)
     name   display name
     cat    category id (see CATEGORIES)
     group  sub-domain label inside the category — clusters related
            skills together in the layout and shows in the detail panel
     tier   1..5
     req    ids that must be learned first (may cross categories)
     desc   what actually having this skill means

   The data is split across js/skills/*.js so no one file is unwieldy.
   index.html loads this file first, then every domain file, then the app.
------------------------------------------------------------------ */

const CATEGORIES = [
  /* --- self --- */
  { id: 'mind',      name: 'Mind & Character',        color: '#ffd43b', icon: '🧘' },
  { id: 'health',    name: 'Health & Medical',        color: '#ff6b6b', icon: '🩺' },
  { id: 'physical',  name: 'Sports & Movement',       color: '#3ecf8e', icon: '🏃' },
  { id: 'style',     name: 'Style & Self-Presentation', color: '#f6a6ff', icon: '💇' },
  { id: 'spirit',    name: 'Meaning & Spirituality',  color: '#bdb2ff', icon: '🕯️' },

  /* --- knowing --- */
  { id: 'academic',  name: 'Academic & Intellectual', color: '#5b8dff', icon: '📚' },
  { id: 'language',  name: 'Language & Linguistics',  color: '#4ecdc4', icon: '🈯' },
  { id: 'learning',  name: 'Learning & Teaching',     color: '#a0c4ff', icon: '🎓' },
  { id: 'tech',      name: 'Technical & Digital',     color: '#4dd6e8', icon: '💻' },
  { id: 'science',   name: 'Science & Engineering',   color: '#6ee7b7', icon: '🔬' },

  /* --- people --- */
  { id: 'social',    name: 'Social & Interpersonal',  color: '#ff7ab6', icon: '💬' },
  { id: 'family',    name: 'Family & Relationships',  color: '#f28ea8', icon: '👨‍👩‍👧' },
  { id: 'civic',     name: 'Civic & Legal',           color: '#7fb3d5', icon: '⚖️' },

  /* --- livelihood --- */
  { id: 'money',     name: 'Money & Finance',         color: '#d4e157', icon: '💰' },
  { id: 'career',    name: 'Career & Work',           color: '#8e9aff', icon: '💼' },
  { id: 'business',  name: 'Business & Enterprise',   color: '#b388eb', icon: '📈' },

  /* --- making --- */
  { id: 'creative',  name: 'Visual Arts & Design',    color: '#c77dff', icon: '🎨' },
  { id: 'music',     name: 'Music & Performance',     color: '#e07be0', icon: '🎵' },
  { id: 'craft',     name: 'Craft & Making',          color: '#ff8e5e', icon: '🪡' },

  /* --- living --- */
  { id: 'food',      name: 'Food & Cooking',          color: '#ffa94d', icon: '🍳' },
  { id: 'practical', name: 'Home & Practical',        color: '#ffb35c', icon: '🧰' },
  { id: 'travel',    name: 'Travel & Navigation',     color: '#5ec8f0', icon: '✈️' },
  { id: 'outdoors',  name: 'Outdoors & Wilderness',   color: '#7bd389', icon: '🏕️' },
  { id: 'nature',    name: 'Nature & Sustainability', color: '#9ae6b4', icon: '🌱' },
  { id: 'safety',    name: 'Safety & Emergency',      color: '#ff9f7f', icon: '🚨' },
  { id: 'play',      name: 'Games & Play',            color: '#ff6b8a', icon: '🎲' },
];

const TIERS = [
  { tier: 1, name: 'Foundation' },
  { tier: 2, name: 'Developing' },
  { tier: 3, name: 'Proficient' },
  { tier: 4, name: 'Advanced'   },
  { tier: 5, name: 'Mastery'    },
];

/* Every domain file appends to this. */
const SKILLS = [];

/* addSkills({ cat, group }, [ ... ]) — the shared cat/group are stamped onto
   each entry so domain files stay terse and consistent. Either can still be
   overridden per skill. */
function addSkills(defaults, list) {
  for (const s of list) SKILLS.push({ req: [], ...defaults, ...s });
}
