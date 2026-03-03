# Create JSON section manifest and ordering schema

Author /content/sections.json defining the ordered list of all presentation sections (AI architecture evolution, agentic systems, live demos, enterprise differentiators). Each entry includes id, order, label, scrollAnchorId, and isMockScaffold flag. This file drives build-time section discovery and ordering.

## Acceptance Criteria
- sections.json exists at /content/sections.json
- Each entry contains id, order, label, scrollAnchorId, isMockScaffold fields
- Sections cover: AI architecture evolution, agentic systems, live demos, audit traceability, cost management, agentic DevOps uptime
- Entries are ordered sequentially by the order field with no gaps

## Relevant Components
- pass-content

## Quality Commands
- Lint: n/a
- Typecheck: n/a
- Test (changed): n/a
- Test (critical): n/a
- Coverage: n/a