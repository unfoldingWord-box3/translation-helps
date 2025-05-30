# Changelog

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
