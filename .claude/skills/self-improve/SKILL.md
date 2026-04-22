---
description: Heuristic-only content polishing for LearnKit courses
argument-hint: "[course name + module number — e.g. 'cpp-drone module 3']"
---

# /self-improve

Heuristic-only content polishing agent. Detects and suggests improvements based on generic instructional rules without rewriting core curriculum or structural logic.

## Goal

Shift from "Instructional Designer" to "Content Polisher" — only improving readability, fixing broken Markdown, ensuring consistent tone, and flagging ambiguous phrasing.

## Constraint

The agent must NOT attempt to rewrite core curriculum or structural logic. If an improvement requires a change to the "core" (the "how" or "why" of the subject matter), the agent must stop and flag it for a human developer rather than making the change itself.

## Step 1 — Identify the target

$ARGUMENTS

If the user specified a course and module above, use it as the starting point. If there are multiple courses, ask which one. Then confirm: "Which module do you want to polish? (You can give the module number, title, or filename.)"

Read `config.js` to find the module. Then read the corresponding module HTML file in `pages/`.

## Step 2 — Heuristic audit

Analyze the module HTML content against these **generic instructional rules**:

### Readability heuristics
- [ ] Sentences are concise (avoid run‑on sentences)
- [ ] Paragraphs are short (2–4 sentences max)
- [ ] Headings use sentence case (not title case)
- [ ] Lists use parallel structure
- [ ] No passive voice where active is clearer
- [ ] No jargon without explanation

### Markdown/HTML formatting heuristics
- [ ] Code blocks have proper language tags (e.g., ````cpp` for C++)
- [ ] Inline code uses `<code>` tags
- [ ] Links have descriptive anchor text (not "click here")
- [ ] Images have alt text (if any)
- [ ] No broken HTML tags or mismatched nesting

### Tone and voice heuristics
- [ ] Consistent second‑person ("you", "your") throughout
- [ ] No shifts to third‑person ("the learner", "one should")
- [ ] No editorializing ("obviously", "simply", "just")
- [ ] No condescension ("easy", "trivial")

### Ambiguity heuristics
- [ ] Pronouns have clear antecedents
- [ ] "This" is followed by a noun ("this concept", not just "this")
- [ ] No vague instructions ("do the thing")
- [ ] All acronyms are spelled out on first use

### LearnKit‑specific heuristics
- [ ] Lesson IDs follow pattern `sN-M`
- [ ] Checklist IDs are globally unique (`sN-taskname`)
- [ ] Callout classes are correct (`callout-info`, `callout-warning`, `callout-success`)
- [ ] No missing `</div>` tags that break the accordion layout

## Step 3 — Flag core‑curriculum changes

If any of the following are detected, **stop and flag for human developer**:

- Changing the technical accuracy of code examples
- Adding or removing conceptual explanations that affect the "why"
- Reordering lessons in a way that changes the learning progression
- Modifying the pedagogical strategy (chunking, sequencing, scaffolding)
- Altering the learning objectives or outcomes

These are **core curriculum** changes that require subject‑matter expertise.

## Step 4 — Generate suggestions

For each heuristic violation found in Step 2, produce a **comment or diff** that shows the fix without applying it.

**Comment format** (for minor issues):
```html
<!-- POLISH: Consider rewriting this sentence to avoid passive voice. -->
```

**Diff format** (for concrete fixes):
```diff
- <p>You will simply run the command.</p>
+ <p>Run the command.</p>
```

**Output organization**:
1. Group suggestions by heuristic category
2. Include the line number or surrounding context
3. Keep each suggestion brief (one line explanation)

## Step 5 — Present findings

Show the user:
- Number of heuristic violations found per category
- The suggested comments/diffs (render them as plain text, not HTML)
- Any core‑curriculum changes that were flagged (with explanation)
- A summary: "These are polish‑only suggestions; none affect the core curriculum."

## Step 6 — Optional application

Ask: "Would you like me to apply any of these polish suggestions? I can edit the file with your approval."

If yes, apply only the suggestions the user explicitly approves, one at a time, using the Edit tool.

## Important rules

- Never edit the file without explicit user approval
- Never change module IDs, lesson IDs, or checklist IDs
- Never add or remove lessons
- Never modify the `config.js` modules array
- If you are unsure whether a change touches core curriculum, flag it
- The goal is subtle improvement, not overhaul