# Course Generation Prompt

Used internally by the create-course skill after Step 1 requirements are gathered. Run this planning pass before generating any files.

## Variables (filled from Step 1 answers)

- `TOPIC` — the course subject
- `DURATION` — time commitment (e.g. "6–8 hrs/week · 2 months")
- `TARGET_AUDIENCE` — who it's for and what they already know
- `GOAL` — concrete outcome the learner achieves
- `MODULES` — list of modules with one-line descriptions

---

## Planning Pass (do this before writing a single file)

Work through the scratchpad below mentally. The output of this pass informs the content you write into config.js and every module HTML file.

<scratchpad>
Think through:
1. What are the 3–5 core concepts that must land for TOPIC? Which modules carry them?
2. What hands-on project ties the theory together? It must solve a real problem — not a TODO app or calculator. Could a learner actually use or deploy it?
3. How should depth vary across modules? Which modules are foundation (read carefully), which are reference (skim and return)?
4. What analogies make the hardest concepts concrete for TARGET_AUDIENCE?
5. What prerequisites does TOPIC actually require beyond what the user listed?
6. Where will learners get stuck? List the top 3 stumbling blocks and how to address them in the content.
</scratchpad>

---

## Content Requirements

Apply these when writing module HTML files. They supplement — never replace — the principles in CLAUDE.md.

### Quality
- Language: clear and direct for developers who can write code but may be new to the domain
- Every abstract concept gets a concrete analogy or real-world comparison
- Theory and practice stay balanced — explain the why, then show the how, then let the learner do it
- Each concept builds on the previous one; never introduce a term before it's been defined

### Per-module structure
Every module should contain:
- **Why this matters** — opens the module, tied to GOAL (not "in this module we will…")
- **Core explanation** — theory with inline code examples
- **Hands-on exercise** — something the learner runs or builds themselves
- **Common mistake** — at least one `callout-warning` per module
- **Verify step or checklist** — how the learner confirms they got it

### The hands-on project
- Appears as milestones spread across modules, not a standalone module
- One real problem solved end-to-end
- Naturally exercises all major concepts — not a forced add-on
- Includes a troubleshooting lesson for the top 2–3 failure modes
- Final module checklist = portfolio milestone items (3–5 items)

### Code examples
- Every technical concept that can be demonstrated in code must have a code block
- Comments explain WHY something non-obvious is done, never WHAT the code does
- Provide runnable snippets, not pseudocode, wherever possible

### Callouts
- `callout-info` — prerequisite knowledge, important context, background the learner needs
- `callout-warning` — common mistake, gotcha, or thing that silently fails
- `callout-success` — confirmation the learner succeeded, or a 💡 personal discovery

---

## Module Depth Guide

Use this to calibrate how much content to generate per module:

| Module role | Tag | Depth |
|---|---|---|
| Foundation / must-read | `Core concept`, `Read first` | 4–6 lessons, exercises, checklist |
| Hands-on setup | `Do first` | 3–4 lessons, verify step |
| Skill the learner uses repeatedly | `Core skill`, `Memorize this` | 3–5 lessons, worked example |
| Advanced, return later | `Month 2+`, `Week 3+` | 2–3 lessons, reference-style |
| For learners with prior knowledge | `Skip if confident` | 2–3 lessons, self-test |
| External milestone | `Portfolio booster` | checklist-heavy, deployment steps |

---

## What to Produce

After this planning pass, generate (in order):

1. `config.js` — modules list with tags, colors, stateKey, prerequisites, time/goal text
2. `index.html` — dashboard shell with course overview woven into the subtitle/intro copy
3. `pages/module-N.html` for each module — full content per the structure above
4. `pages/settings.html` — copy from template
5. `states/manifest.json` — `{"states": []}`

The course_overview and prerequisites from your planning pass belong in `index.html` intro copy and `config.js` prerequisites array, not in a separate document.
