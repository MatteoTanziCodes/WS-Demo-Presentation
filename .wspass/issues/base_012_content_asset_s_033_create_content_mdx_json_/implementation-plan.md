# Create /content MDX/JSON scaffold with section source files

Add /content directory with one MDX file per presentation section. Each file follows the Section entity schema (id, order, label, scrollAnchorId, contentMdx, isMockScaffold). Populate every file with realistic mock prose and frontmatter so downstream components can import them at build time.

## Acceptance Criteria
- A /content directory exists with one MDX file per section defined in the architecture
- Each MDX file contains valid frontmatter matching Section entity fields (id, order, label, scrollAnchorId, isMockScaffold: true)
- Each file includes placeholder body content of at least two paragraphs
- Running next build does not error on /content imports

## Relevant Components
- pass-web

## Quality Commands
- Lint: n/a
- Typecheck: n/a
- Test (changed): n/a
- Test (critical): n/a
- Coverage: n/a