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
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Module N — Title</title>
<link rel="stylesheet" href="../../../core/css/styles.css">
</head>
<body>
<div id="page-content">
  <!-- content here -->
</div>
<script src="../config.js"></script>
<script src="../../../core/js/framework.js"></script>
<script>initPage('sN', '../');</script>
</body>
</html>
```

### Lesson accordion
```html
<div class="lesson" id="sN-M">
  <div class="lesson-header" onclick="toggleLesson('sN-M')">
    <div class="lesson-title">N.M Lesson Title</div>
    <svg class="lesson-chevron" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  </div>
  <div class="lesson-body">
    <!-- content -->
  </div>
</div>
```

### Callouts
```html
<div class="callout callout-info">Context or background.</div>
<div class="callout callout-warning">Common mistake or gotcha.</div>
<div class="callout callout-success">💡 What worked for me: personal discovery here.</div>
```

### Checklist (persisted)
```html
<ul class="checklist">
  <li><input type="checkbox" id="globally-unique-id"> Task description</li>
</ul>
```

Checkbox IDs must be globally unique across the entire course (not just the module). Convention: `sN-taskname` e.g. `s2-ros-installed`.

## What NOT to Do

- Do not add npm packages, build tools, or external CDN links
- Do not use `localStorage` keys other than the `STATE_KEY` derived from `config.js`'s `stateKey`
- Do not hardcode module counts (use `MODULES.length`)
- Do not write comments explaining what code does — only write comments explaining WHY something non-obvious is done
- Do not create a backend, database, or server-side component — use files and the GitHub Gist API for anything requiring persistence

## Known LLM Mistakes — Do Not Repeat

These are bugs introduced by LLMs that have already been fixed. Do not regress them.

### 1. Missing `<div class="progress-main">` in dashboard index.html

The `.progress-card` is NOT a flex container — `.progress-main` is. The correct structure is:

```html
<div class="progress-card">
  <div class="progress-main">           <!-- ← required; this is the flex row -->
    <span class="progress-label">Overall progress</span>
    <div class="progress-track"><div class="progress-fill" id="dashProgressFill"></div></div>
    <span class="progress-count" id="dashProgressCount">0 / ?</span>
  </div>
  <div class="progress-backup-row">
    <!-- icon + text + settings btn-icon -->
  </div>
</div>
```

Without the wrapper, label/track/count stack vertically and the progress bar turns yellow (inherits amber background from `.progress-backup-row`). Do NOT inline hacks like `flex-wrap: wrap` on `.progress-card` or negative margins on `.progress-backup-row` — the CSS already handles the layout correctly.

### 2. Wrong button in the backup row

The settings link in `.progress-backup-row` must use `class="btn-icon"` with a gear icon SVG, NOT `class="btn"` with the text "Export / Import". The correct markup is in `courses/cpp-drone/index.html` — copy from there.

### 3. Not updating root `index.html` after creating a course

Every new course must have an entry in the `COURSES` array in the root `index.html`. This is the homepage that lists all courses with their live progress. Forgetting this means the course is invisible to users on the home page.

### 4. Missing top-card fields in config.js

The dashboard header card (description, prerequisites, time commitment, goal) is rendered entirely from `config.js` by `initDashboard()`. These five fields are **required** in every config.js — never omit them:

```js
  subtitle: '...',          // tech stack / audience tagline shown under the title
  description: '...',       // 1–2 sentence course summary
  prerequisites: ['...'],   // minimum 2 items; rendered as a bullet list
  timeCommitment: '...',    // e.g. "4–6 hrs/week · ~6 weeks"
  goal: '...',              // concrete outcome the learner will achieve
```

Do NOT put this content in `index.html` — the HTML is a generic shell. Putting course-specific text in the HTML breaks the pattern and will get lost the next time the template is re-applied.

### 5. Using old terminology

The framework uses **Module** (not "Section") and **Lesson** (not "Sub-section"). In config.js the key is `modules:`, not `sections:`. In HTML the lesson accordion classes are `.lesson`, `.lesson-header`, `.lesson-title`, `.lesson-chevron`, `.lesson-body`. The JS function is `toggleLesson()`, not `toggleSub()`. In the dashboard HTML the list container is `id="moduleList"` with `class="module-list"`. Do not use the old names.
