---
description: Improve the content and structure of an existing course module
argument-hint: "[module number/name + what to improve — e.g. 'module 3 of cpp-drone, add more code examples']"
---

# /improve-lesson

Improve the content of an existing course module. This skill applies the psychological learning principles that make LearnKit effective and incorporates the learner's own discoveries.

## Step 1 — Identify the module

$ARGUMENTS

If the user specified a module above, use it as the starting point. If there are multiple courses, ask which one. Then confirm: "Which module do you want to improve? (You can give the module number, title, or filename.)"

Read `config.js` to find the module. Then read the corresponding module HTML file in `pages/`.

## Step 2 — Gather improvement direction

Ask for anything still missing in a single message:

1. **What's wrong or missing?** — Is the content unclear, incomplete, too shallow, has bad examples? Or just "generally improve it"?

2. **Did anything make this click for you personally?** — A mental model, an analogy, a command output that helped, a different way of thinking about the concept? This is the most valuable input. If yes, capture it exactly as the user describes it.

3. **What tripped you up?** — Was there a gotcha, a common error, an assumption the content made that turned out to be wrong? These become `callout-warning` blocks.

4. **What would you add?** — Any specific content, code examples, references, or tools the module should include?

## Step 3 — Audit the existing content

Before making changes, check each lesson against these criteria:

- [ ] Opens with "why this matters" (not "in this lesson we will…")
- [ ] Written in second person ("you", "your")
- [ ] Has at least one runnable code block (for technical content)
- [ ] Has at least one callout (info, warning, or success)
- [ ] Ends with a checklist or verify step
- [ ] No lesson tries to cover more than one concept

Flag each gap in your response before editing.

## Step 4 — Apply improvements

Make targeted edits to the module HTML:

**For personal discoveries from Step 2:** Add a `callout-success` block with a 💡 prefix inside the most relevant lesson:
```html
<div class="callout callout-success">💡 What worked for me: {user's discovery verbatim or lightly edited for clarity}</div>
```

**For gotchas from Step 2:** Add a `callout-warning` at the point in the content where the learner would encounter it:
```html
<div class="callout callout-warning">{gotcha description and how to avoid/fix it}</div>
```

**For shallow content:** Expand explanations, add a second code example showing a variation or edge case, add an analogy if the concept is abstract.

**For missing verify steps:** Add a lesson at the end called "Verify" or "Check your work" with a short checklist or a command to run and expected output.

**For lessons missing the "why":** Add 1–2 sentences at the start of each lesson body connecting the concept to the learner's concrete goal.

## Step 5 — Self-improvement context

If the user provided a personal discovery in Step 2, also ask:

"Do you want to update the course's README or the module's intro to mention this insight for future learners who find this module hard? This helps the next person start with your shortcut instead of working it out themselves."

If yes, add a brief mention in the module intro or README's "what people find hard about X" area.

## Step 6 — Summary

Tell the user:
- What was changed and why (one line per change)
- Whether any structural gaps remain (lessons that still need work)
- Suggest the next module to improve: "The weakest module based on structure is probably module N. Want me to improve that one next?"

## Important rules

- Never delete existing content unless it is factually wrong or the user explicitly asked to remove it
- Never change module IDs or lesson IDs — doing so breaks saved state for any learner who already has progress
- If adding new checklist items, their IDs must be globally unique across the course
- Keep the same voice and level of technicality as the surrounding content
- If the user's personal discovery is particularly insightful, note it as a potential pull request to the course for other learners
