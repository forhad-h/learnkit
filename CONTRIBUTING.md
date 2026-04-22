# Contributing to LearnKit

Thanks for your interest in contributing. LearnKit is a static-file course framework — contributions range from fixing a typo in a course module to building new framework features.

## Ways to contribute

- **Content fixes** — typos, outdated commands, broken examples in `courses/cpp-drone/pages/`
- **New course** — open Claude Code in the repo, ask Claude to create a course on any topic, open a PR
- **Framework improvements** — new components, mobile fixes, performance changes in `core/`
- **Skill improvements** — better prompt logic in `.claude/skills/`

## How to run locally

No install step. Open a terminal in the repo root:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/courses/cpp-drone/` to see the included course.

## Project structure

```
core/js/framework.js   ← all runtime logic (shared)
core/css/styles.css    ← design system (136 CSS variables)
courses/template/    ← copy this to start a new course
courses/cpp-drone/   ← reference course
.claude/skills/        ← Claude Code skills
```

## Ground rules

- No npm, no build tools, no external CDN links — zero-dependency is a hard constraint
- Do not modify `core/` files to fix course-specific content; only change the relevant module page
- New CSS must use existing variables from `:root`; add new variables there rather than hardcoding values
- Checkbox IDs must be globally unique across a course; use the convention `sN-taskname`
- Do not add comments explaining what code does — only add them when the WHY is non-obvious

## Submitting a PR

1. Fork the repo
2. Create a branch: `git checkout -b your-branch-name`
3. Make your changes
4. Open a pull request against `main`
5. Fill in the PR template

For large changes (new framework feature, major content rewrite), open an issue first to discuss the approach.
