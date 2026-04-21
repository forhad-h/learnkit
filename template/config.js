/* ═══════════════════════════════════════════
   LearnKit Tutorial Config
   ═══════════════════════════════════════════

   This is the only file you MUST edit to define your tutorial's structure.
   Everything else (js/app.js, css/styles.css) reads from this.

   After the framework split:
     - This file lives in your tutorial folder (e.g. my-tutorial/config.js)
     - The framework lives in core/js/framework.js
     - Each section page loads config.js first, then framework.js

   For now (legacy layout): edit js/app.js directly and use this as a reference.
   ═══════════════════════════════════════════ */

window.TUTORIAL_CONFIG = {

  // ─── Identity ───────────────────────────────

  // Displayed in the site header and browser <title>
  title: 'Your Tutorial Title',

  // Emoji or short text shown as the header logo badge
  icon: '📖',

  // Footer text at the bottom of every section page
  footer: 'Your Tutorial Title · v1.0 · ' + new Date().getFullYear(),

  // LocalStorage key — MUST be unique across all tutorials on the same origin.
  // Convention: slugify your title with underscores, e.g. 'python_ml_state'
  // This key persists your learner's progress. Changing it resets their progress.
  stateKey: 'my_tutorial_state',


  // ─── Sections ───────────────────────────────

  // The ordered list of sections. This drives:
  //   - Sidebar navigation (all sections listed here, in this order)
  //   - Prev / Next navigation between section pages
  //   - Progress calculation (completed / total)
  //   - Dashboard section cards
  //   - "Continue learning" banner logic

  sections: [
    {
      id: 's1',         // Unique string ID. Used as the localStorage key for this section's status.
                        // Convention: s1, s2, s3 … or s25 for section 2.5
      num: '1',         // Display number shown in the badge. Can be '1', '2.5', '3a', etc.
      title: 'Introduction and Setup',
      tag: 'Read first', // Short label shown as a badge on the section card.
                         // See tag vocabulary below for options.
      tagColor: 'blue',  // One of: blue | green | amber | purple | orange
      file: 'section-1.html'  // Filename inside pages/ — relative to pages/ directory
    },
    {
      id: 's2',
      num: '2',
      title: 'Core Concepts',
      tag: 'Core skill',
      tagColor: 'blue',
      file: 'section-2.html'
    },
    {
      id: 's3',
      num: '3',
      title: 'Hands-on Practice',
      tag: 'Do first',
      tagColor: 'green',
      file: 'section-3.html'
    },
    {
      id: 's4',
      num: '4',
      title: 'Portfolio Project',
      tag: '1 project',
      tagColor: 'green',
      file: 'section-4.html'
    },
    {
      id: 's5',
      num: '5',
      title: 'Resources and Reference',
      tag: 'Quick reference',
      tagColor: 'blue',
      file: 'section-5.html'
    },
  ],


  // ─── Section badge colors ────────────────────

  // Background and text color for the round number badge on each section card.
  // Keys must match section IDs above.
  // Falls back to a neutral grey if a section ID is missing here.
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
   Track progress| green  | Meta/milestone section
   ═══════════════════════════════════════════ */
