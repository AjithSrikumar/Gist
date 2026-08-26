<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Commit & Deploy Workflow

After completing a task, signal the watcher to commit and push:

```powershell
powershell -File "D:\Projects\Book Summary\signal-commit.ps1" "Your commit message here"
```

This writes a `.commit-signal` file that the watcher picks up, commits, and pushes to GitHub (which triggers Vercel deploy).
