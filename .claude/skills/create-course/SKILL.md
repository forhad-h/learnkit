---
description: Scaffold a complete new LearnKit course from scratch
argument-hint: "[topic + audience — e.g. 'Rust for systems programmers who know C']"
---

# /create-course

Scaffold a complete new LearnKit course from scratch. You are the course generation agent.

## Step 1 — Gather requirements (one question at a time)

$ARGUMENTS

**First, ask for the topic.** If already provided in `$ARGUMENTS`, skip directly to the suggestions step.

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Question 1 of 6 · Topic
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  What is the course about?

  ▶
```

**Once the topic is known**, generate smart options for all remaining questions based on the topic. Then ask each remaining question one at a time using this format:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Question N of 6 · [label]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  [question text]

  a) [option 1]
  b) [option 2]
  c) [option 3]
  d) Decide for me

  a / b / c / d / your own answer  ▶
```

Questions in order (2–6 all include options):

2. **Audience** (label: `Audience`) — "Who is this for, and what do they already know?"
3. **Prerequisites** (label: `Prerequisites`) — "What must the learner have installed or know before starting?"
4. **Time** (label: `Time`) — "Roughly how long will the full course take?"
5. **Goal** (label: `Goal`) — "What concrete outcome will the learner have at the end?"
6. **Modules** (label: `Modules`) — Generate 3 distinct outline variants (different focus/depth/structure) as options a/b/c, each showing the full module list.

When the user types `a`, `b`, or `c`, use that option. When the user types `d`, pick whichever option you judge best and move on. When the user types anything else, treat it as their own custom answer.

After all answers are collected, display:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✓ Got everything — generating now
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Then continue to Step 1b.

## Step 1b — Planning pass

Before writing any files, run the planning pass defined in `.claude/prompts/course-generation.md`.

Fill in the variables from Step 1:
- `TOPIC` → user's topic answer
- `DURATION` → user's time commitment answer
- `TARGET_AUDIENCE` → user's audience answer
- `GOAL` → user's goal answer
- `MODULES` → user's module list

Work through the scratchpad (core concepts, project idea, depth calibration, analogies, stumbling blocks). The output informs every config and HTML file you generate — it does not get written to disk.

## Step 2 — Determine course location

Check whether we are in the monorepo layout (a `core/` directory exists) or the legacy single-course layout.

- **Monorepo layout**: create `courses/{topic-slug}/` directory alongside existing courses
- **Legacy layout**: create the course files in the current directory

Ask the user: "What folder name should I use for this course?" (suggest a kebab-case slug from the topic).

## Step 3 — Generate config.js

Create `courses/{slug}/config.js` with `window.COURSE_CONFIG` populated from the user's answers.

Assign module IDs as `s1`, `s2`, `s3` … (use `s25` for 2.5 etc. if needed).

Choose appropriate tags from this vocabulary based on the module's role:
- `Read first` / `Do first` — opening context or setup
- `Core skill` / `Core concept` — fundamental knowledge the learner needs repeatedly
- `Memorize this` — a pattern or API worth encoding in memory
- `Skip if confident` — review material for those with prior experience
- `Month 2+` / `Week 3+` — advanced modules to return to later
- `Portfolio booster` — an externally visible achievement
- `Track progress` — meta/milestone modules
- `Quick reference` — reference material, not linear reading

Choose `tagColor` values: `blue` (core/reference), `green` (action/do), `amber` (advanced), `purple` (framework/tool), `orange` (optional).

For `numColors`, assign a unique palette per module that visually distinguishes module groups. Use these CSS-compatible inline styles:
- Blue: `background:#eff6ff;color:#1d4ed8;`
- Green: `background:#f0fdf4;color:#16a34a;`
- Purple: `background:#f3e8ff;color:#6b21a8;`
- Amber: `background:#fef3c7;color:#92400e;`
- Orange: `background:#fff7ed;color:#c2410c;`
- Pink: `background:#fdf2f8;color:#9d174d;`

For `stateKey`, use a unique snake_case string: `{topic_slug}_state` (e.g. `python_ml_state`). This prevents localStorage collisions if multiple courses are served from the same origin.

**The following four fields are REQUIRED in every config.js — they power the top card on the dashboard. Never omit them:**

```js
  subtitle: '...',          // tech stack or audience tagline shown under the title
  description: '...',       // 1–2 sentence course summary shown above the meta grid
  prerequisites: [          // rendered as a bulleted list; minimum 2 items
    'Item one',
    'Item two',
  ],
  timeCommitment: '...',    // e.g. "4–6 hrs/week · ~6 weeks to working agent"
  goal: '...',              // concrete outcome the learner will have at the end
```

## Step 4 — Generate index.html

Create the dashboard page. Use `courses/template/index.html` as the base — it is a generic shell with no course-specific content. Do NOT put description, prerequisites, time commitment, or goal text into the HTML; those come exclusively from config.js and are rendered by `initDashboard()`. Only fill in:
- Correct script paths (relative to course root)
- The `<title>` element

## Step 5 — Generate module pages

For each module in the user's list:
- Create `courses/{slug}/pages/module-N.html` (or `module-2-5.html` for 2.5)
- Use the module-template pattern from `courses/template/pages/module-template.html`
- Write placeholder content for each lesson based on the module description
- Apply the psychological content principles from CLAUDE.md:
  - Lead with "why this matters"
  - At least 2–3 lessons per module (chunking)
  - At least one code block per technical module
  - At least one callout (info or warning) per module
  - End with either a checklist or a "verify" lesson
- For the final module, add a checklist with 3–5 portfolio milestone items

## Step 6 — Copy settings.html and create states/manifest.json

- Copy `courses/template/pages/settings.html` to `courses/{slug}/pages/settings.html`
- Create `courses/{slug}/states/manifest.json` with `{"states": []}`

## Step 7 — Summary

Tell the user:
- Which files were created
- How to open the course: `python3 -m http.server 8000` then open the URL
- What to do next: use the `add-lesson` skill to flesh out any module, `improve-lesson` to deepen content
- How to publish: enable GitHub Pages on their fork

## Important rules

- Do not add npm, CDN imports, or any external dependencies
- Do not create a backend
- All checkbox IDs must be globally unique across the course — use `sN-keyword` convention
- All lesson IDs must follow `sN-M` pattern where N is the module number and M is the lesson number
- Never skip the `initPage('sN', '../')` call at the bottom of each module page
