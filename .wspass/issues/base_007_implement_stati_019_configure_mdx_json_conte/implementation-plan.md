# Configure MDX/JSON content ingestion from /content directory

Install and configure next-mdx-remote or @next/mdx to compile MDX files under /content at build time. Add a utility module (e.g. lib/content.ts) that reads and parses all MDX and JSON section files from /content, returning typed Section objects. Ensure JSON files are imported with correct TypeScript typings.

## Acceptance Criteria
- next-mdx-remote or @next/mdx is installed and configured in next.config.js
- lib/content.ts exports a getAllSections() function returning typed Section[]
- MDX files in /content are compiled to React components at build time
- JSON files in /content are parsed and returned as typed objects

## Relevant Components
- pass-build

## Quality Commands
- Lint: n/a
- Typecheck: n/a
- Test (changed): n/a
- Test (critical): n/a
- Coverage: n/a