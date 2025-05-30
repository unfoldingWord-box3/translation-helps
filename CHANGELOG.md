# Changelog

## [0.2.4] - 2025-05-30

### Added

- Layer responsibilities section in `docs/rewrite/plan.md`.
- Reference `docs/separation-of-concerns.md` in rewrite plan input references.
- Include `rewrite/plan.md` in `codex.md` Key Docs.
- Archive legacy impact analysis doc (`docs/refactor/impact-analysis.legacy.md`).
- Close and resolve evaluate rewrite plan issue (`docs/issues/closed/evaluate-rewrite-plan-and-cleanup.md`).

## [0.2.3] - 2025-05-30

### Added

- Archive legacy refactor plan (`docs/refactor/plan.legacy.md`)
- Add clean-slate rewrite plan (`docs/rewrite/plan.md`) and decision log (`docs/rewrite/decision-log.md`)
- Add rewrite module checklist (`docs/rewrite/module-checklist.md`)
- Move and resolve rewrite plan issue (`docs/issues/closed/replace-refactor-with-rewrite-plan.md`)

## [0.2.2] - 2025-05-30

### Added

- Introduce refactoring plan and documentation (`docs/refactor/plan.md`, `docs/refactor/impact-analysis.md`, `docs/refactor/decision-log.md`)
- Close create-refactor-plan issue under `docs/issues/closed` with resolution metadata

## [0.2.1] - 2025-05-30

### Changed

- Finalize core documentation for agentic rebuild:
  - Added `docs/app-overview.md`, `docs/ui-map.md`, `docs/lifecycle.md`, `docs/component-map.md`
  - Created `docs/README.md` with document overview and recommended reading order
  - Updated `codex.md` Key Docs section to include new documentation

## [0.2.0] - 2025-05-30

### Added

- `twlService.js` for loading and parsing TWL resource TSV files (TWL links).
- Integration in `VerseComponent` to fetch and display TWL-linked tW articles.
- Unit tests for TWL service parsing and querying (`src/services/twlService.test.js`).
- Documentation for UI integration of TWL in `docs/TWL_Integration_Documentation.md`.

### Changed

- Removed legacy Greek-tag linking logic in `VerseComponent`.
