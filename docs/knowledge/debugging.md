# Debugging Knowledge

Solutions to recurring issues and tricky bugs.

---

## Next.js Dev Server SegmentViewNode Error
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: Hit during together-report development -->

Error: `Could not find the module "...segment-explorer-node.js#SegmentViewNode" in the React Client Manifest`

This is a known Next.js 15.5.x devtools cache bug. Not related to your code.

**Fix:** Delete `.next/` and restart the dev server:
```bash
rm -rf .next && npx next dev
```

---

## Port Conflicts (Multiple Dev Servers)
<!-- Added: 2026-02-17 by Daniel -->

When running multiple projects locally:
- Nova web: port 3000
- Nova API: port 3001
- Reports: port 3002 (`npx next dev -p 3002`)

Check what's using a port: `lsof -i :3000`
