# Changelog

## [0.2.6] - 2025-06-02

### Added

- Added `docs/rewrite/dependency-review.md` to audit legacy dependencies and propose bootstrap list.
- Updated `docs/rewrite/plan.md` Input References to include dependency-review.md.
- Updated `codex.md` to reference `rewrite/dependency-review.md` in Key Docs.
- Finalized initial `package.json` dependency and devDependency list for bootstrap and switched scripts to Vite/Vitest/ESLint.
- Moved and resolved evaluate-dependency-stack issue (`docs/issues/closed/evaluate-dependency-stack.md`).

## [0.2.5] - 2025-06-01

### Added

- Scaffolded `src/modules` folder structure for TWL, tN, tQ, and tW modules.
- Updated `docs/component-map.md` to include module mappings under `src/modules`.
- Updated `codex.md` to reference `rewrite/decision-log.md` and `rewrite/module-checklist.md` in Key Docs.
- Added decision-log entry for splitting the rewrite plan and scaffolding modules in `docs/rewrite/decision-log.md`.
- Closed and resolved the Execute the Rewrite Plan issue (`docs/issues/closed/execute-rewrite-plan.md`).

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
