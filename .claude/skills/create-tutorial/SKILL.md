---
description: Scaffold a complete new LearnKit tutorial from scratch
argument-hint: "[topic + audience — e.g. 'Rust for systems programmers who know C']"
---

# /create-tutorial

Scaffold a complete new LearnKit tutorial from scratch. You are the tutorial generation agent.

## Step 1 — Gather requirements (one question at a time)

$ARGUMENTS

Ask questions one at a time, waiting for the user's answer before asking the next. Do not ask multiple questions in the same message. Skip any question the user already answered via `$ARGUMENTS`.

Ask in this order, only what is still missing. For each question, use this exact format so the user can see clearly that input is expected:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Question N of 6 · [label]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  [question text]

  ▶
```

Replace `N` with the current question number, `[label]` with a short label (e.g. `Topic`, `Audience`, `Prerequisites`, `Time`, `Goal`, `Sections`), and `[question text]` with the actual question. The `▶` at the end signals "your turn".

Questions in order:

1. **Topic** (label: `Topic`) — "What is the tutorial about?" — skip if already provided in `$ARGUMENTS`.
2. **Audience** (label: `Audience`) — "Who is this for, and what do they already know?"
3. **Prerequisites** (label: `Prerequisites`) — "What must the learner have installed or know before starting?"
4. **Time** (label: `Time`) — "Roughly how long will the full tutorial take? (e.g. '4–6 hours total', '1 week at 2 hrs/day')"
5. **Goal** (label: `Goal`) — "What concrete outcome will the learner have at the end?"
6. **Sections** (label: `Sections`) — Propose a numbered section list yourself based on the topic (6–12 sections, one-line descriptions each), then ask: "Here's a suggested outline — confirm, reorder, drop, or add sections." Wait for confirmation or edits.

After all answers are collected, display:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✓ Got everything — generating now
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Then continue to Step 1b.

## Step 1b — Planning pass

Before writing any files, run the planning pass defined in `.claude/prompts/tutorial-generation.md`.

Fill in the variables from Step 1:
- `TOPIC` → user's topic answer
- `DURATION` → user's time commitment answer
- `TARGET_AUDIENCE` → user's audience answer
- `GOAL` → user's goal answer
- `SECTIONS` → user's section list

Work through the scratchpad (core concepts, project idea, depth calibration, analogies, stumbling blocks). The output informs every config and HTML file you generate — it does not get written to disk.

## Step 2 — Determine tutorial location

Check whether we are in the monorepo layout (a `core/` directory exists) or the legacy single-tutorial layout.

- **Monorepo layout**: create `tutorials/{topic-slug}/` directory alongside existing tutorials
- **Legacy layout**: create the tutorial files in the current directory

Ask the user: "What folder name should I use for this tutorial?" (suggest a kebab-case slug from the topic).

## Step 3 — Generate config.js

Create `tutorials/{slug}/config.js` with `window.TUTORIAL_CONFIG` populated from the user's answers.

Assign section IDs as `s1`, `s2`, `s3` … (use `s25` for 2.5 etc. if needed).

Choose appropriate tags from this vocabulary based on the section's role:
- `Read first` / `Do first` — opening context or setup
- `Core skill` / `Core concept` — fundamental knowledge the learner needs repeatedly
- `Memorize this` — a pattern or API worth encoding in memory
- `Skip if confident` — review material for those with prior experience
- `Month 2+` / `Week 3+` — advanced sections to return to later
- `Portfolio booster` — an externally visible achievement
- `Track progress` — meta/milestone sections
- `Quick reference` — reference material, not linear reading

Choose `tagColor` values: `blue` (core/reference), `green` (action/do), `amber` (advanced), `purple` (framework/tool), `orange` (optional).

For `numColors`, assign a unique palette per section that visually distinguishes section groups. Use these CSS-compatible inline styles:
- Blue: `background:#eff6ff;color:#1d4ed8;`
- Green: `background:#f0fdf4;color:#16a34a;`
- Purple: `background:#f3e8ff;color:#6b21a8;`
- Amber: `background:#fef3c7;color:#92400e;`
- Orange: `background:#fff7ed;color:#c2410c;`
- Pink: `background:#fdf2f8;color:#9d174d;`

For `stateKey`, use a unique snake_case string: `{topic_slug}_state` (e.g. `python_ml_state`). This prevents localStorage collisions if multiple tutorials are served from the same origin.

## Step 4 — Generate index.html

Create the dashboard page. Use `tutorials/template/index.html` as the base. Fill in:
- Title and subtitle from the user's topic and audience
- Prerequisites list
- Time commitment and goal from the user's answers
- Correct script paths (relative to tutorial root)

## Step 5 — Generate section pages

For each section in the user's list:
- Create `tutorials/{slug}/pages/section-N.html` (or `section-2-5.html` for 2.5)
- Use the section-template pattern from `tutorials/template/pages/section-template.html`
- Write placeholder content for each sub-section based on the section description
- Apply the psychological content principles from CLAUDE.md:
  - Lead with "why this matters"
  - At least 2–3 sub-sections per section (chunking)
  - At least one code block per technical section
  - At least one callout (info or warning) per section
  - End with either a checklist or a "verify" sub-section
- For the final section, add a checklist with 3–5 portfolio milestone items

## Step 6 — Copy settings.html and create states/manifest.json

- Copy `tutorials/template/pages/settings.html` to `tutorials/{slug}/pages/settings.html`
- Create `tutorials/{slug}/states/manifest.json` with `{"states": []}`

## Step 7 — Summary

Tell the user:
- Which files were created
- How to open the tutorial: `python3 -m http.server 8000` then open the URL
- What to do next: use the `add-lesson` skill to flesh out any section, `improve-lesson` to deepen content
- How to publish: enable GitHub Pages on their fork

## Important rules

- Do not add npm, CDN imports, or any external dependencies
- Do not create a backend
- All checkbox IDs must be globally unique across the tutorial — use `sN-keyword` convention
- All sub-section IDs must follow `sN-M` pattern where N is the section number and M is the sub-section number
- Never skip the `initPage('sN', '../')` call at the bottom of each section page
