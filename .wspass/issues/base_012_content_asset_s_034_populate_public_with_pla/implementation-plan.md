# Populate /public with placeholder photo and animation assets

Add placeholder photo images (WebP/PNG) and lightweight CSS/JS animation stubs into /public, organized by sectionId subdirectories. Ensure total size stays well under the 500 MB budget. Each section references at least one photo asset matching the PhotoAsset entity shape.

## Acceptance Criteria
- /public contains per-section subdirectories each with at least one placeholder image
- All placeholder images are valid WebP or PNG files
- Total /public size is under 10 MB
- Asset filenames align with PhotoAsset entity naming (sectionId-based)

## Relevant Components
- pass-web

## Quality Commands
- Lint: n/a
- Typecheck: n/a
- Test (changed): n/a
- Test (critical): n/a
- Coverage: n/a