# Changelog

## [Unreleased]

### Added

- Placeholder for future features

## [0.3.4] - 2025-05-31

### Fixed

- **RC Links issues completely resolved**
  - ✅ Fixed article word links creating duplicate tabs (e.g., Tit 1:1 Paul)
  - ✅ Fixed Translation Academy articles showing placeholder text instead of real content
  - ✅ Corrected DCS repository URL structure (removed incorrect "man" path segment)
  - ✅ Added comprehensive markdown rendering with ReactMarkdown integration
  - ✅ Implemented proper heading hierarchy: title.md → # headings, sub-title.md → ## headings
  - ✅ Enhanced ArticlePanel with professional typography and styling
  - ✅ Added complete Translation Academy service (taService.js) with caching and error handling
  - ✅ All 12 taService tests passing with corrected URL structure

### Added

- **Complete markdown rendering system**
  - ReactMarkdown integration with remark-gfm support
  - Custom component styling for all markdown elements (headings, lists, tables, code blocks)
  - Professional blue theming consistent with app design
  - Proper RC link processing within markdown content

## [0.3.3] - 2025-05-31

### Added

- **Translation Words (tW) functionality via TWL integration - COMPLETED**
  - ✅ Complete TWL service implementation with manifest-based file loading
  - ✅ Fixed TWL service URL format and reference format (`chapter:verse`)
  - ✅ Added wildcard rc:// URI support (`rc://*/tw/dict/...` → `rc://en/tw/dict/...`)
  - ✅ Comprehensive `twService.js` for fetching and parsing tW articles from rc:// URIs
  - ✅ Robust caching for both TWL files and tW articles with error handling
  - ✅ TranslationWordsPanel displays contextually relevant articles per verse
  - ✅ Successfully tested with Titus 1:1 showing 11 translation words (Paul, servant, God, etc.)
  - ✅ Complete TWL → tW articles pipeline working end-to-end

### Changed

- **TWL service refactored to use manifest-based file loading**
  - Removed hardcoded filename generation (`twl_BOOKID.tsv`)
  - Now uses manifest projects to find file paths, following same pattern as Translation Notes
  - Integrated with DCS client for consistent resource fetching

### Removed

- **Redundant Translation Word Links (TWL) tab**
  - TWL now powers Translation Words tab behind the scenes
  - Simplified UI to 3 tabs: Translation Notes, Translation Questions, Translation Words
  - Eliminated user confusion between TWL and Translation Words

## [0.3.2] - 2025-05-31

### Added

- Create comprehensive issue for implementing full Translation Words (tW) integration via TWL (Translation Words Links)
- Document complete pipeline from TWL entries to tW article display with cross-tab navigation

## [0.3.1] - 2025-05-31

### Fixed

- Verify verse click synchronization with translation helps panels

## [0.3.0] - 2025-05-31

### Added

- Add standardized changelog and semantic versioning process with updated issue template

## [0.2.20] - 2025-06-17

### Changed

- Replace `yaml` package with `js-yaml` for YAML parsing in DCS client (`dcsClient.js`), update tests and mock setup to use `js-yaml`, and update documentation and codex.md accordingly.

## [0.2.19] - 2025-06-16

### Closed

- Close and resolve the Missing "./browser" Export Specifier in `yaml` Package issue (`docs/issues/closed/vite-yaml-browser-entry-error.md`).

## [0.2.18] - 2025-06-15

### Changed

- Add `codex-version-guard` CLI script to verify dependencies against the Codex model cutoff date (May 31, 2024).
- Create `docs/codex-version-guard.md` describing the version guard policy.
- Reference `codex-version-guard.md` in `codex.md`.

## [0.2.17] - 2025-06-14

### Changed

- Use explicit `yaml/browser/index.js` alias and pre-bundle both `yaml` and `yaml/browser` in `vite.config.ts` to avoid missing subpath export errors.
- Add troubleshooting entry in `codex.md` for modern ESM/bundler incompatibilities.

## [0.2.16] - 2025-06-13

### Changed

- Import YAML from `yaml/browser` in `dcsClient.js` and related tests to avoid internal module resolution errors.
- Update `vite.config.ts` to pre-bundle both `yaml` and `yaml/browser`.
- Document YAML module resolution workaround in `codex.md`.

## [0.2.15] - 2025-06-12

### Changed

- Add `yaml` to Vite `optimizeDeps` in `vite.config.ts` to pre-bundle it and prevent stale cache errors.
- Update README.md with instructions to clear Vite optimization cache if you get 504 Gateway Timeout errors.

## [0.2.14] - 2025-06-11

### Added

- UI/UX tests for core components (App, MainView, VerseTabs, TranslationWordsPanel, ScripturePanel) using Vitest and React Testing Library; see `src-new/__tests__/`.

## [0.2.13] - 2025-06-10

### Changed

- Fix blank page when running `yarn dev` under Vite: added root `index.html`, `src-new/main.jsx`, and error boundary with routing support
- Update README.md with debug instructions for Vite dev server blank screen

## [0.2.12] - 2025-06-09

### Added

- Introduce MainView.jsx to consolidate panels and context sync
- Added integration tests for context synchronization and component orchestration
- Added unit tests for ScripturePanel and TranslationWordsPanel
- Updated component-map.md, rewrite/plan.md, rewrite/decision-log.md, and codex.md
- Created docs/rewrite/backlog.md for deferred items
- Moved epic-post-refactor-completion.md to docs/issues/closed with Resolved metadata

## [0.2.11] - 2025-06-08

### Added

- Consolidate helper utilities (parseTsv, parseRcUri, groupByVerse) into src/utils with unit tests
- Introduce unified DCS client service (dcsClient.ts) for manifest and file fetching, with tests
- Implement tnService and tqService for tN and tQ resource loading, with tests
- Refactor twlService to use dcsClient and centralized parseTsv utility, with tests
- Implement module hooks: useTwlLinks, useTranslationNotes, useTranslationQuestions, useTranslationWords with tests

### Changed

- Bump version to 0.2.11 and close open rewrite-related issues

## [0.2.10] - 2025-06-07

## [0.2.9] - 2025-06-05

### Added

- Core rewrite implementations for services, contexts, hooks, helpers, and UI components
- Unit tests for services and helper utilities
- Rendering tests for core components and context provider tests

### Changed

- Bump version to 0.2.9

### Closed

- Close open rewrite sub-issues (rewrite-services, rewrite-contexts, rewrite-hooks, rewrite-helpers, rewrite-ui-components, rewrite-tests)

## [0.2.8] - 2025-06-04

### Changed

- Close and decompose rewrite-entire-app issue (`docs/issues/closed/rewrite-entire-app.md`)
- Create new issues for rewrite-services, rewrite-contexts, rewrite-ui-components, rewrite-hooks, rewrite-helpers, and rewrite-tests under `docs/issues/open/`

## [0.2.7] - 2025-06-03

### Added

- Created `src-new/utils/parseTsv.js` and its unit tests.
- Created `src-new/services/twlService.js` and its unit tests.
- Added `src-new/context/ResourcesContext.js` for loading resource data.
- Added `src-new/components/ScripturePanel.jsx` and `TranslationWordsPanel.jsx`.
- Closed and resolved the rewrite-core-implementation issue (`docs/issues/closed/rewrite-core-implementation.md`).

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
