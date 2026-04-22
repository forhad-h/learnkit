/* ═══════════════════════════════════════════
   LearnKit Course Config
   ═══════════════════════════════════════════

   This is the only file you edit to define your course's structure.
   The framework (core/js/framework.js) reads everything from this.

   This file lives in your course folder: courses/my-course/config.js
   Each module page loads config.js first, then ../../core/js/framework.js
   ═══════════════════════════════════════════ */

window.COURSE_CONFIG = {

  // ─── Identity ───────────────────────────────

  // Displayed in the site header and browser <title>
  title: 'Your Course Title',

  // Emoji or short text shown as the header logo badge
  icon: '📖',

  // Footer text at the bottom of every module page
  footer: 'Your Course Title · v1.0 · ' + new Date().getFullYear(),

  // LocalStorage key — MUST be unique across all courses on the same origin.
  // Convention: slugify your title with underscores, e.g. 'python_ml_state'
  // This key persists your learner's progress. Changing it resets their progress.
  stateKey: 'my_course_state',


  // ─── Modules ────────────────────────────────

  // The ordered list of modules. This drives:
  //   - Sidebar navigation (all modules listed here, in this order)
  //   - Prev / Next navigation between module pages
  //   - Progress calculation (completed / total)
  //   - Dashboard module cards
  //   - "Continue learning" banner logic

  modules: [
    {
      id: 's1',         // Unique string ID. Used as the localStorage key for this module's status.
                        // Convention: s1, s2, s3 … or s25 for module 2.5
      num: '1',         // Display number shown in the badge. Can be '1', '2.5', '3a', etc.
      title: 'Introduction and Setup',
      tag: 'Read first', // Short label shown as a badge on the module card.
                         // See tag vocabulary below for options.
      tagColor: 'blue',  // One of: blue | green | amber | purple | orange
      file: 'module-1.html',  // Filename inside pages/ — relative to pages/ directory
      // Optional: short description shown on dashboard card (1-2 sentences)
      // description: 'Brief overview of what this module covers.',
      // Optional: estimated time shown on dashboard card
      // estimatedTime: '~45 min',
    },
    {
      id: 's2',
      num: '2',
      title: 'Core Concepts',
      tag: 'Core skill',
      tagColor: 'blue',
      file: 'module-2.html',  // Filename inside pages/ — relative to pages/ directory
      // Optional: short description shown on dashboard card (1-2 sentences)
      // description: 'Brief overview of what this module covers.',
      // Optional: estimated time shown on dashboard card
      // estimatedTime: '~45 min',
    },
    {
      id: 's3',
      num: '3',
      title: 'Hands-on Practice',
      tag: 'Do first',
      tagColor: 'green',
      file: 'module-3.html',  // Filename inside pages/ — relative to pages/ directory
      // Optional: short description shown on dashboard card (1-2 sentences)
      // description: 'Brief overview of what this module covers.',
      // Optional: estimated time shown on dashboard card
      // estimatedTime: '~45 min',
    },
    {
      id: 's4',
      num: '4',
      title: 'Portfolio Project',
      tag: '1 project',
      tagColor: 'green',
      file: 'module-4.html',  // Filename inside pages/ — relative to pages/ directory
      // Optional: short description shown on dashboard card (1-2 sentences)
      // description: 'Brief overview of what this module covers.',
      // Optional: estimated time shown on dashboard card
      // estimatedTime: '~45 min',
    },
    {
      id: 's5',
      num: '5',
      title: 'Resources and Reference',
      tag: 'Quick reference',
      tagColor: 'blue',
      file: 'module-5.html',  // Filename inside pages/ — relative to pages/ directory
      // Optional: short description shown on dashboard card (1-2 sentences)
      // description: 'Brief overview of what this module covers.',
      // Optional: estimated time shown on dashboard card
      // estimatedTime: '~45 min',
    },
  ],


  // ─── Module badge colors ─────────────────────

  // Background and text color for the round number badge on each module card.
  // Keys must match module IDs above.
  // Falls back to a neutral grey if a module ID is missing here.
  //
  // Palette options (copy these):
  //   Blue:   background:#eff6ff;color:#1d4ed8;
  //   Green:  background:#f0fdf4;color:#16a34a;
  //   Purple: background:#f3e8ff;color:#6b21a8;
  //   Amber:  background:#fef3c7;color:#92400e;
  //   Orange: background:#fff7ed;color:#c2410c;
  //   Pink:   background:#fdf2f8;color:#9d174d;

  numColors: {
    s1: 'background:#eff6ff;color:#1d4ed8;',
    s2: 'background:#eff6ff;color:#1d4ed8;',
    s3: 'background:#f0fdf4;color:#16a34a;',
    s4: 'background:#f0fdf4;color:#16a34a;',
    s5: 'background:#eff6ff;color:#1d4ed8;',
  },

};


/* ═══════════════════════════════════════════
   TAG VOCABULARY (for reference)

   Tag           | Color  | When to use
   --------------|--------|------------------------------------------
   Read first    | blue   | Required context, read before anything else
   Do first      | green  | Setup/install — unblock yourself immediately
   Core skill    | blue   | Fundamental — will use this repeatedly
   Core concept  | blue   | Theory that underpins everything else
   Memorize this | blue   | Pattern worth encoding in memory
   Skip if conf. | orange | Optional review for experienced learners
   Core framework| purple | Foundational tool for this domain
   Month 2+      | amber  | Advanced — return after basics are solid
   Week 3+       | amber  | Intermediate — return after basics are solid
   Portfolio     | green  | Produces an externally visible outcome
   Quick ref.    | blue   | Reference material, not linear reading
   Track progress| green  | Meta/milestone module
   ═══════════════════════════════════════════ */
