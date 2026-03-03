# Configure Next.js static export and deterministic /out output

Set next.config.ts output:'export' with trailingSlash and distDir settings so `next build` produces a deterministic /out directory. Add the build script entry `next build` to package.json. Verify config produces /out with static HTML for all routes.

## Acceptance Criteria
- next.config.ts sets output:'export' and outputs to /out
- package.json build script runs `next build` producing /out directory
- Running build twice on identical source yields byte-identical /out output
- No server-side runtime files exist in /out

## Relevant Components
- pass-build

## Quality Commands
- Lint: n/a
- Typecheck: n/a
- Test (changed): n/a
- Test (critical): n/a
- Coverage: n/a