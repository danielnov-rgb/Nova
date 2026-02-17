---
name: learn
description: Record a project learning to the shared knowledge base so all developers and AI assistants benefit from it across sessions.
argument-hint: [what you learned]
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(git config *)
---

# Record a Learning

You are adding a new entry to the Nova shared knowledge base at `docs/knowledge/`.

## Input

The user's learning: $ARGUMENTS

## Steps

1. **Understand the learning.** Parse what the user described. If it's vague, ask one clarifying question before proceeding.

2. **Categorize it.** Determine which knowledge file it belongs to:
   - `architecture.md` - System architecture, infrastructure, deployment, repo structure
   - `patterns.md` - Reusable code patterns, component conventions, styling approaches
   - `client-context.md` - Client terminology, business context, engagement details
   - `debugging.md` - Bug fixes, workarounds, error solutions
   - `decisions/<date>-<slug>.md` - Significant architectural decisions (create new file)

   If none fit, create a new appropriately-named `.md` file in `docs/knowledge/`.

3. **Check for duplicates.** Search the target file for similar entries. If a related entry exists, update it rather than creating a duplicate.

4. **Get author info:**
   ```
   git config user.name
   ```

5. **Format the entry** using this template:

   ```markdown
   ---

   ## Short Descriptive Title
   <!-- Added: YYYY-MM-DD by [author name] -->
   <!-- Context: Brief note on when/why this was discovered -->

   Clear explanation of the learning.

   **Example:** (if applicable)
   ```code snippet```
   ```

   Use today's date. Keep it concise but complete enough that someone unfamiliar could understand and apply it.

6. **Append the entry** to the end of the appropriate knowledge file, before any closing content.

7. **Confirm to the user** what was added and where, with the file path.

## Rules

- Never remove or modify existing entries (append only, unless updating a duplicate)
- Keep entries self-contained - each should make sense on its own
- Use the exact markdown template format above for consistency
- For architecture decisions, create a new file: `decisions/YYYY-MM-DD-short-slug.md`
- If the learning is project-specific (only relevant to web or api), also mention it in the relevant `apps/*/CLAUDE.md`
