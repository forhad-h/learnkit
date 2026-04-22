---
description: Add a new module to an existing LearnKit course
argument-hint: "[module title + where to insert — e.g. 'Error Handling, after module 4 of cpp-drone']"
---

# /add-lesson

Add a new module to an existing LearnKit course.

## Step 1 — Identify the course and module

$ARGUMENTS

If the user provided a module title or placement above, use it as a starting point. If there are multiple courses (monorepo layout), ask: "Which course are you adding a module to?"

Read `config.js` to understand the existing module structure — their IDs, numbers, titles, and order.

## Step 2 — Gather module details

Ask for anything still missing in a single message:

1. **Title** — What is this module called?
2. **Position** — Where in the sequence does it go? (e.g. "after module 4", "at the end", "between 2 and 3")
3. **Tag** — How should learners approach this module? (offer the tag vocabulary as options)
4. **Content outline** — Give a brief description of what each lesson should cover. Bullet points are fine. Aim for 3–5 lessons.
5. **Time estimate** — How long should this module take? (optional, for the tag or description)

## Step 3 — Assign IDs

Determine the module ID and number:
- If inserting between existing modules, use a decimal (e.g. between s3 and s4 → `s35`, num `3.5`, file `module-3-5.html`)
- If appending at the end, increment the last module number

Verify the new ID does not conflict with any existing module ID in the config.

## Step 4 — Generate the module HTML file

Create `courses/{slug}/pages/{filename}.html` following the standard module page pattern:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Module N — {Title}</title>
<link rel="stylesheet" href="../../../core/css/styles.css">
</head>
<body>
<div id="page-content">
  <!-- lessons here -->
</div>
<script src="../config.js"></script>
<script src="../../../core/js/framework.js"></script>
<script>initPage('{moduleId}', '../');</script>
</body>
</html>
```

Apply all psychological content principles from CLAUDE.md:
- Lead each lesson with why it matters
- Include at least one code block per technical lesson
- Include at least one callout (info or warning)
- End with a checklist or "verify" step
- Write in second person throughout

## Step 5 — Update config.js

Insert the new module object into the `modules` array at the correct position.

Also add the corresponding entry to `numColors` — pick a color that visually groups this module with related modules.

Choose the `tagColor` based on the module's role (see tag vocabulary in CLAUDE.md).

## Step 6 — Verify

Tell the user which files were modified, what the new module ID is, and remind them to reload the course in the browser to confirm the sidebar shows the new module correctly.

Ask: "Would you like me to expand the placeholder content into a full module now? I can use the improve-lesson skill on this new module."
