# Scaffold TypeScript-strict Next.js project with static export config

Run create-next-app with TypeScript template. Enable strict mode in tsconfig.json (strict: true, noUncheckedIndexedAccess: true). Configure next.config.js with output: 'export' and trailingSlash. Verify `next build` produces /out with a valid index.html. Add .gitignore for /out and node_modules.

## Acceptance Criteria
- tsconfig.json has strict: true and noUncheckedIndexedAccess: true
- next.config.js sets output to 'export' and trailingSlash to true
- Running `next build` produces /out/index.html with no server runtime
- All source files use .ts or .tsx extensions; no .js source files except config

## Relevant Components
- pass-web

## Quality Commands
- Lint: n/a
- Typecheck: n/a
- Test (changed): n/a
- Test (critical): n/a
- Coverage: n/a