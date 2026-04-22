---
description: Improve or fix the LearnKit core framework (JS or CSS)
argument-hint: "[describe the improvement or bug — e.g. 'add dark mode toggle' or 'fix accordion animation on mobile']"
---

# /improve-framework

Extend or fix the LearnKit core framework (core/js/framework.js and core/css/styles.css). This skill is for UI and framework improvements, not content changes.

## Step 1 — Understand the request

$ARGUMENTS

If the user provided a description above, use it as the starting point and skip asking. Otherwise ask: "What do you want to improve or add to the framework? Describe what it should do from the learner's perspective."

If the request is a bug, ask: "How do you reproduce it? What browser? What's the current behavior vs. expected behavior?"

## When to use this skill

- Adding a new UI component (new callout type, new card variant, new interactive element)
- Fixing a bug in state management, navigation, or rendering
- Improving mobile responsiveness
- Adding a new framework feature (e.g. progress sharing, personalization, time tracking)
- Refactoring for the framework split (moving config out of framework.js)

## Step 2 — Read before writing

Always read the relevant files before making changes:

- For JS changes: read `core/js/framework.js` (full file)
- For CSS changes: read `core/css/styles.css`
- For dashboard changes: read `courses/{name}/index.html`
- For module page changes: read one representative module page (e.g. `courses/cpp-drone/pages/module-5.html`)

Understand:
- The public API surface: `initPage()`, `initDashboard()`, `toggleLesson()`, `expandAll()`, `collapseAll()`, `setStatus()`, `openSidebar()`, `closeSidebar()`, and the export/import functions
- The state schema (see CLAUDE.md) — any change that adds a new state key needs a default value in `getState()`
- The CSS variable system — all values should reference existing variables where possible

## Step 3 — Plan before editing

For any change larger than a one-liner, briefly describe what you're going to change and why before making edits. Include:
- Which functions or CSS rules will change
- Whether the public API changes (it should not break existing module pages)
- Whether the state schema changes (and if so, how `getState()` handles old state gracefully)

## Step 4 — Implement

Make targeted, minimal edits. Do not refactor surrounding code that isn't related to the request.

### For new CSS components
Add the new classes at the bottom of `core/css/styles.css` using the existing variable system. New colors go into `:root`. Example pattern:

```css
/* New component: {name} */
.new-component { ... }
.new-component--variant { ... }
@media (max-width: 768px) { .new-component { ... } }
```

### For new JS features
Add new functions near the end of their logical group (state functions near state, render functions near render). Expose on window if module pages need to call them.

### For state schema additions
Add the new key with a default in `getState()`:
```js
if (!state.newKey) state.newKey = {};
```
This ensures old exported state JSON imports cleanly.

## Step 5 — Verify

After making changes, describe the test steps for the user:

1. `python3 -m http.server 8000` from the project root
2. Open the dashboard — confirm no console errors
3. Navigate to a module page — confirm sidebar, header, prev/next render correctly
4. Toggle a module status — confirm it persists on reload
5. If you added a new feature, describe how to see it working
6. Export state — confirm the JSON downloads correctly
7. Import the exported JSON — confirm state restores correctly

## Upcoming framework features (reference for implementation)

### Personalization (user name)
- On first load (no `state.userName`), show a small inline prompt or modal: "What's your name?"
- Store as `state.userName` in the state schema
- In `renderHeader()`, add the name to the header or a greeting element
- In `initDashboard()`, personalize the continue banner: "Welcome back, {name}"
- In `getContinueModule()` hint text: "Pick up where you left off, {name}"

### Progress sharing via GitHub Gist
- Add a "Share progress" button to `pages/settings.html`
- On click: POST the current state JSON to `https://api.github.com/gists` (anonymous gist, no auth)
- Display the returned gist URL for the user to copy
- Add a "Restore from Gist URL" input field that fetches the gist and imports the JSON
- No backend, no token required for public anonymous gists

### Time-per-module tracking
- Add `state.sessionStart` — timestamp set when a module page first loads
- When module status changes to "completed", compute duration and store as `state.timeSpent[moduleId]`
- Show in the sidebar footer or page header: "~45 min"

## Rules for framework changes

- Never break the `initPage(moduleId, basePath)` signature — all module pages call it
- Never break the `initDashboard()` call — index.html calls it
- Never change existing state key names — would break imported state JSON for all users
- Never add npm, CDN links, or build steps
- Keep the total JS size reasonable — current framework.js is ~14KB. A full-featured framework should stay under 30KB unminified.
- CSS: never use `!important` — fix specificity properly
