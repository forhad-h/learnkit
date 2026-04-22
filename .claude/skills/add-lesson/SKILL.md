---
description: Add a new section to an existing LearnKit tutorial
argument-hint: "[lesson title + where to insert — e.g. 'Error Handling, after section 4 of cpp-drone']"
---

# /add-lesson

Add a new section to an existing LearnKit tutorial.

## Step 1 — Identify the tutorial and lesson

$ARGUMENTS

If the user provided a lesson title or placement above, use it as a starting point. If there are multiple tutorials (monorepo layout), ask: "Which tutorial are you adding a lesson to?"

Read `config.js` to understand the existing section structure — their IDs, numbers, titles, and order.

## Step 2 — Gather lesson details

Ask for anything still missing in a single message:

1. **Title** — What is this section called?
2. **Position** — Where in the sequence does it go? (e.g. "after section 4", "at the end", "between 2 and 3")
3. **Tag** — How should learners approach this section? (offer the tag vocabulary as options)
4. **Content outline** — Give a brief description of what each sub-section should cover. Bullet points are fine. Aim for 3–5 sub-sections.
5. **Time estimate** — How long should this section take? (optional, for the tag or description)

## Step 3 — Assign IDs

Determine the section ID and number:
- If inserting between existing sections, use a decimal (e.g. between s3 and s4 → `s35`, num `3.5`, file `section-3-5.html`)
- If appending at the end, increment the last section number

Verify the new ID does not conflict with any existing section ID in the config.

## Step 4 — Generate the section HTML file

Create `tutorials/{slug}/pages/{filename}.html` following the standard section page pattern:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Section N — {Title}</title>
<link rel="stylesheet" href="../../../core/css/styles.css">
</head>
<body>
<div id="page-content">
  <!-- sub-sections here -->
</div>
<script src="../config.js"></script>
<script src="../../../core/js/framework.js"></script>
<script>initPage('{sectionId}', '../');</script>
</body>
</html>
```

Apply all psychological content principles from CLAUDE.md:
- Lead each sub-section with why it matters
- Include at least one code block per technical sub-section
- Include at least one callout (info or warning)
- End with a checklist or "verify" step
- Write in second person throughout

## Step 5 — Update config.js

Insert the new section object into the `SECTIONS` array at the correct position.

Also add the corresponding entry to `numColors` — pick a color that visually groups this section with related sections.

Choose the `tagColor` based on the section's role (see tag vocabulary in CLAUDE.md).

## Step 6 — Verify

Tell the user which files were modified, what the new section ID is, and remind them to reload the tutorial in the browser to confirm the sidebar shows the new section correctly.

Ask: "Would you like me to expand the placeholder content into a full lesson now? I can use the improve-lesson skill on this new section."
