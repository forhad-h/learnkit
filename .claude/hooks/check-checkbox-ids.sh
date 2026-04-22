#!/usr/bin/env bash

INPUT=$(cat)
FILE=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty' 2>/dev/null) || exit 0

# Only run for HTML files inside a tutorial pages/ directory
[[ "$FILE" == *.html ]] || exit 0
PAGES_DIR=$(dirname "$FILE")
[[ "$(basename "$PAGES_DIR")" == "pages" ]] || exit 0

# Collect every checkbox id="..." value across all section pages in this tutorial
DUPLICATES=$(grep -rh 'type="checkbox"' "$PAGES_DIR"/*.html 2>/dev/null \
  | grep -o 'id="[^"]*"' \
  | sed 's/id="//;s/"//' \
  | sort | uniq -d) || true

[[ -n "$DUPLICATES" ]] || exit 0

DUP_LIST=$(echo "$DUPLICATES" | tr '\n' ',' | sed 's/,$//' | sed 's/,/, /g')
MSG="Duplicate IDs found across tutorial pages: $DUP_LIST — each id must be unique across ALL section files in this tutorial (e.g. use s3-ros-installed, not ros-installed). Fix these before proceeding."

echo "{\"hookSpecificOutput\": {\"hookEventName\": \"PostToolUse\", \"additionalContext\": $(printf '%s' "$MSG" | jq -Rs .)}}"
