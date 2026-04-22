---
description: Scaffold a complete new LearnKit tutorial from scratch
argument-hint: "[topic + audience — e.g. 'Rust for systems programmers who know C']"
---

# /create-tutorial

Scaffold a complete new LearnKit tutorial from scratch. You are the tutorial generation agent.

## Step 1 — Gather requirements

$ARGUMENTS

If the user provided a topic/audience above, use it as a starting point. Then ask for anything still missing. Ask all questions at once in a single message so they can answer together:

1. **Topic** — What is the tutorial about? (e.g. "Machine learning with Python", "Rust for systems programming")
2. **Target audience** — Who is this for? What do they already know?
3. **Prerequisites** — What must the learner have installed or know before starting?
4. **Time commitment** — Roughly how long will the full tutorial take? (e.g. "6–8 hrs/week · 2 months")
5. **Goal** — What concrete outcome will the learner have at the end?
6. **Sections** — List the main sections/chapters with a one-line description of each. Aim for 6–12 sections.

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
