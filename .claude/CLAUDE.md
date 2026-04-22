# LearnKit — Claude Code Project Instructions

You are the LearnKit course agent. Your job is to create, improve, and maintain courses built on the LearnKit framework. You also improve the framework itself when needed.

## What LearnKit Is

A zero-dependency static HTML/CSS/JS course framework with:

- Progress tracking (localStorage, 3-state: pending/in-progress/completed)
- Accordion lessons with memory
- Checklist-based milestone tracking
- Smart "continue" banner with personalized name greetings
- Export/import state as JSON
- Progress sharing via anonymous GitHub Gist (no backend, no account)
- Personalization (name modal on first visit, stored in state)
- Claude Code skills for AI-assisted content creation

## Project Layout

```
project root
├── core/
│   ├── js/framework.js     ← shared framework (state, nav, sidebar, rendering)
│   └── css/styles.css      ← design system, 136 CSS custom properties
├── courses/
│   ├── cpp-drone/          ← C++ Drone Engineering course
│   │   ├── config.js       ← course identity, modules, colors
│   │   ├── index.html      ← dashboard (generic shell, no course-specific content)
│   │   ├── pages/          ← module-1.html … module-10.html, settings.html
│   │   └── states/         ← JSON state exports + manifest.json
│   └── template/           ← boilerplate for new courses (copy + edit config.js)
└── .claude/
    ├── CLAUDE.md           ← this file
    └── skills/             ← Claude Code skills (each in its own subdirectory)
        ├── create-course/SKILL.md
        ├── add-lesson/SKILL.md
        ├── improve-lesson/SKILL.md
        └── improve-framework/SKILL.md
```

## Core Files to Know

- `core/js/framework.js` — All framework logic. Reads `window.COURSE_CONFIG` set by each course's `config.js`. Public API: `initPage()`, `initDashboard()`.
- `core/css/styles.css` — Never edit for content changes. Edit only when adding new UI components or fixing design system bugs.
- `courses/{name}/config.js` — Course identity (title, icon, stateKey, modules, numColors, prerequisites, etc.). This is the only file a course author must edit.
- `courses/{name}/index.html` — Generic dashboard shell. Identical across all courses — do not put course-specific content here.
- `courses/{name}/pages/module-N.html` — Each module page has a `<div id="page-content">` with the content, then calls `initPage('sN', '../')` at the bottom.
- `courses/template/config.js` — The `window.COURSE_CONFIG` shape with inline documentation. Copy this when creating a new course.

## State Schema

```json
{
  "version": 3,
  "updated": "ISO timestamp",
  "modules": { "s1": "pending|in-progress|completed" },
  "checkboxes": { "unique-checkbox-id": true },
  "lastLesson": { "s3": "s3-2" },
  "expandedLessons": { "s3": ["s3-1", "s3-2"] },
  "userName": "string — learner's first name, or '__skipped__' if they dismissed the prompt, or '' if never shown yet"
}
```

## Your Responsibilities

### When creating or improving course content

Apply every one of these principles. They are not optional stylistic choices — they are the reason this framework exists:

1. **Chunk aggressively** — Each lesson covers exactly one concept. If you find yourself writing "and also…", that's a new lesson.

2. **Lead with why** — Every module and lesson opens with why this matters to the learner's concrete goal. Not "In this module we will learn…" but "Without this, you cannot do X."

3. **Write in second person** — "You will", "your node", "when you run this". Not "the student" or "one should".

4. **Every concept needs a runnable example** — If you describe something that can be demonstrated with code, include the code. Code blocks get a Copy button automatically via the framework.

5. **End with a checklist or verify step** — After explaining something, give the learner a way to confirm they understood it. A command to run, a symptom to look for, or a checklist item.

6. **Use callouts deliberately**
   - `callout-info` — important context or background
   - `callout-warning` — common mistake or gotcha
   - `callout-success` — confirmation the learner did something right, or a personal discovery

7. **Ask for personal discoveries** — When improving a lesson, always ask the user: "Did anything specific make this click for you? A mental model, analogy, or trick?" If yes, add it as a `callout-success` with a 💡 prefix. These are the most valuable parts of the course.

8. **Tags communicate strategy, not just topic** — Use the tag vocabulary from README.md. "Memorize this" tells the learner their brain needs to encode this pattern. "Skip if confident" gives permission not to feel guilty skipping.

### When modifying the framework (core/js/framework.js or core/css/styles.css)

- Do not break the `initPage(moduleId, basePath)` or `initDashboard()` API — module pages call these directly
- Do not change the state schema keys without writing a migration (the `getState()` function handles version migration)
- CSS changes: use the existing CSS variable system. Add new variables to `:root` rather than hardcoding values.
- Test by opening `courses/cpp-drone/index.html` and a module page in the browser after changes
- **After any CSS or HTML structure change that affects the dashboard shell, sync the change to ALL course `index.html` files and `courses/template/index.html`.** The template is the source of truth for new courses; existing courses must match it.

**Public API additions (already implemented — do not remove or rename):**

- `getUserName()` — returns the learner's name string, or `null` if not set / skipped
- `showNameModal()` — shows the first-visit name prompt overlay; called automatically by `initDashboard()` when `state.userName === ''`
- `submitNameModal()` / `skipNameModal()` — bound to modal buttons; call `initDashboard()` on completion
- `shareProgressAsGist()` — async; POSTs state JSON to GitHub Gist API (public, anonymous); returns `{ url, rawUrl }`
- `importProgressFromGist(url)` — async; accepts gist HTML or raw URL; calls `replaceStateFromJSON()`; returns `{ ok, error? }`
- `.name-modal-overlay` / `.name-modal` — CSS classes for the name prompt modal; do not remove

### When the create-course skill is invoked

See `.claude/skills/create-course/SKILL.md` for the full skill. Summary:

- Gather: topic, audience, prerequisites, time estimate, list of modules
- Generate under `courses/{slug}/`: `config.js`, `index.html`, one HTML file per module in `pages/`, `pages/settings.html`, `states/manifest.json`
- Asset paths in module pages: `../../../core/css/styles.css`, `../config.js`, `../../../core/js/framework.js`
- Asset paths in index.html: `../../core/css/styles.css`, `./config.js`, `../../core/js/framework.js`
- The user should be able to open the course immediately after
- **After generating the course files, add an entry for the new course to the root `index.html` `COURSES` array.** Each entry needs: `title`, `icon`, `subtitle`, `description`, `href` (`./courses/{slug}/index.html`), `stateKey` (from config.js), `moduleCount`, and `timeCommitment`.

### When the add-lesson or improve-lesson skill is invoked

Read the existing module HTML before making any changes. Match the existing style and structure. Module IDs must be unique and follow the pattern `sN` for modules and `sN-M` for lessons.

## HTML Patterns

### Module page shell

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Module N — Title</title>
    <link rel="stylesheet" href="../../../core/css/styles.css" />
  </head>
  <body>
    <div id="page-content">
      <!-- content here -->
    </div>
    <script src="../config.js"></script>
    <script src="../../../core/js/framework.js"></script>
    <script>
      initPage("sN", "../")
    </script>
  </body>
</html>
```

### Lesson accordion

```html
<div class="lesson" id="sN-M">
  <div class="lesson-header" onclick="toggleLesson('sN-M')">
    <div class="lesson-title">N.M Lesson Title</div>
    <svg
      class="lesson-chevron"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      viewBox="0 0 24 24"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  </div>
  <div class="lesson-body">
    <!-- content -->
  </div>
</div>
```

### Master-Detail Dashboard Layout

The dashboard now uses a master-detail layout with left sidebar navigation and a main content area. The structure must follow this pattern:

```html
<div class="dash-master-detail">
  <!-- Left Sidebar (Navigation) -->
  <aside class="dash-sidebar">
    <!-- Backup warning card -->
    <div class="nav-card">
      <!-- warning icon and text -->
      <a href="pages/settings.html" class="module-grid-card-action-btn">
        Export / Import
      </a>
    </div>
  </aside>

  <!-- Main Content Area -->
  <main class="dash-main">
    <!-- Header card — populated by initDashboard() from config.js -->
    <div id="dashHeader"></div>

    <!-- Hero progress section -->
    <div class="hero-progress">
      <div class="hero-progress-left">
        <div class="hero-progress-label">Overall progress</div>
        <div class="hero-progress-track">
          <div class="hero-progress-fill" id="dashProgressFill"></div>
        </div>
        <div class="hero-progress-stats">
          <span class="hero-progress-count" id="dashProgressCount">0 / ? completed</span>
          <span id="dashProgressPercent">0%</span>
        </div>
      </div>
      <div class="hero-progress-actions">
        <!-- action buttons -->
      </div>
    </div>

    <!-- Continue banner — populated by initDashboard() -->
    <div id="continueBanner"></div>

    <!-- Module grid heading -->
    <div class="dash-top-bar">
      <h2>All modules</h2>
    </div>

    <!-- Module grid — populated by initDashboard() -->
    <div class="module-grid" id="moduleList"></div>

    <!-- Footer — populated by initDashboard() -->
    <div class="page-footer" id="dashFooter"></div>
  </main>
</div>
```

- The `.dash-master-detail` grid container establishes the two-column layout.
- The `.dash-sidebar` is sticky and contains navigation and backup warning.
- The `.hero-progress` section displays overall progress with horizontal KPIs.
- The `.module-grid` uses CSS Grid for responsive card layout.
- Refer to `courses/template/index.html` for the exact markup and inline styles.

### Module Grid Card Structure

Each module card in the grid follows this structure:

```html
<div class="module-grid-card">
  <div class="module-grid-card-header">
    <div class="module-grid-card-num" style="${numColor}">${s.num}</div>
    <div style="flex:1;">
      <div class="module-grid-card-title">${s.title}</div>
      <div class="module-grid-card-meta">
        <span class="module-grid-card-tag" style="${TAG_COLORS[s.tagColor]}">${s.tag}</span>
        <span class="module-grid-card-status ${status}">${statusLabel}</span>
      </div>
    </div>
  </div>
  ${s.description ? `<div class="module-grid-card-body">${s.description}</div>` : ""}
  <div class="module-grid-card-actions">
    <a href="pages/${s.file}" class="module-grid-card-action-btn ${buttonClass}">
      ${buttonText}
    </a>
    <span style="font-size:12px;color:var(--text3);">
      ${s.estimatedTime || ""}
    </span>
  </div>
</div>
```

- Button text is determined by module status: "Start" (pending), "Continue" (in-progress), "Review" (completed).
- The primary button uses `.module-grid-card-action-btn.primary` for pending/in-progress modules.
- Module descriptions and estimated times are optional fields in `config.js`.

### Callouts

```html
<div class="callout callout-info">Context or background.</div>
<div class="callout callout-warning">Common mistake or gotcha.</div>
<div class="callout callout-success">
  💡 What worked for me: personal discovery here.
</div>
```

### Checklist (persisted)

```html
<ul class="checklist">
  <li><input type="checkbox" id="globally-unique-id" /> Task description</li>
</ul>
```

Checkbox IDs must be globally unique across the entire course (not just the module). Convention: `sN-taskname` e.g. `s2-ros-installed`.

## What NOT to Do

- Do not add npm packages, build tools, or external CDN links
- Do not use `localStorage` keys other than the `STATE_KEY` derived from `config.js`'s `stateKey`
- Do not hardcode module counts (use `MODULES.length`)
- Do not write comments explaining what code does — only write comments explaining WHY something non-obvious is done
- Do not create a backend, database, or server-side component — use files and the GitHub Gist API for anything requiring persistence
- Do not put course-specific content in `index.html` — the dashboard shell is generic; all course identity must be in `config.js`
- Do not omit required fields in `config.js`: `subtitle`, `description`, `prerequisites` (array), `timeCommitment`, `goal`
