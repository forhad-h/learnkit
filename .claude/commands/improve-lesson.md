# /improve-lesson

Improve the content of an existing tutorial section. This skill applies the psychological learning principles that make LearnKit effective and incorporates the learner's own discoveries.

## Step 1 — Identify the section

If there are multiple tutorials, ask which one. Then ask: "Which section do you want to improve? (You can give the section number, title, or filename.)"

Read `config.js` or `js/app.js` to find the section. Then read the corresponding section HTML file in `pages/`.

## Step 2 — Gather improvement direction

Ask the user these questions in a single message:

1. **What's wrong or missing?** — Is the content unclear, incomplete, too shallow, has bad examples? Or just "generally improve it"?

2. **Did anything make this click for you personally?** — A mental model, an analogy, a command output that helped, a different way of thinking about the concept? This is the most valuable input. If yes, capture it exactly as the user describes it.

3. **What tripped you up?** — Was there a gotcha, a common error, an assumption the content made that turned out to be wrong? These become `callout-warning` blocks.

4. **What would you add?** — Any specific content, code examples, references, or tools the section should include?

## Step 3 — Audit the existing content

Before making changes, check each sub-section against these criteria:

- [ ] Opens with "why this matters" (not "in this sub-section we will…")
- [ ] Written in second person ("you", "your")
- [ ] Has at least one runnable code block (for technical content)
- [ ] Has at least one callout (info, warning, or success)
- [ ] Ends with a checklist or verify step
- [ ] No sub-section tries to cover more than one concept

Flag each gap in your response before editing.

## Step 4 — Apply improvements

Make targeted edits to the section HTML:

**For personal discoveries from Step 2:** Add a `callout-success` block with a 💡 prefix inside the most relevant sub-section:
```html
<div class="callout callout-success">💡 What worked for me: {user's discovery verbatim or lightly edited for clarity}</div>
```

**For gotchas from Step 2:** Add a `callout-warning` at the point in the content where the learner would encounter it:
```html
<div class="callout callout-warning">{gotcha description and how to avoid/fix it}</div>
```

**For shallow content:** Expand explanations, add a second code example showing a variation or edge case, add an analogy if the concept is abstract.

**For missing verify steps:** Add a sub-section at the end called "Verify" or "Check your work" with a short checklist or a command to run and expected output.

**For sections missing the "why":** Add 1–2 sentences at the start of each sub-section body connecting the concept to the learner's concrete goal.

## Step 5 — Self-improvement context

If the user provided a personal discovery in Step 2, also ask:

"Do you want to update the tutorial's README or the section's intro to mention this insight for future learners who find this section hard? This helps the next person start with your shortcut instead of working it out themselves."

If yes, add a brief mention in the section intro or README's "what people find hard about X" area.

## Step 6 — Summary

Tell the user:
- What was changed and why (one line per change)
- Whether any structural gaps remain (sub-sections that still need work)
- Suggest the next section to improve: "The weakest section based on structure is probably section N. Want to run /improve-lesson on that next?"

## Important rules

- Never delete existing content unless it is factually wrong or the user explicitly asked to remove it
- Never change section IDs or sub-section IDs — doing so breaks saved state for any learner who already has progress
- If adding new checklist items, their IDs must be globally unique across the tutorial
- Keep the same voice and level of technicality as the surrounding content
- If the user's personal discovery is particularly insightful, note it as a potential pull request to the tutorial for other learners
