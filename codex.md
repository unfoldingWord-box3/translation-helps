# codex.md

name: translationHelps Viewer
description: An application for viewing unfoldingWord Bible translation resources including Translation Notes (tN), Translation Questions (tQ), Translation Words (tW), and the new Translation Words Links (TWL) format.

## 🧭 Project Structure

- `src-new/`: Main React app source (clean-slate rewrite)
- `src/`: Legacy source (can be removed)
- `docs/`: Developer documentation (architecture, TWL, resource guides, DCS)
- `public/`: Static assets
- `package.json`: Project config and dependencies
- `docs/issues/open/`: Markdown files describing open development issues

## 📘 Key Docs (in ./docs)

- `ARCHITECTURE.md`: High-level component and data layer overview
- `app-overview.md`: Defines application purpose, target audience, and supported resources
- `ui-map.md`: UI layout, screen regions, and component interactions
- `lifecycle.md`: Startup process, context flow, resource fetching, and offline behavior
- `component-map.md`: Key React components with paths and descriptions
- `rewrite/plan.md`: Clean-slate rewrite roadmap and architecture plan
- `rewrite/decision-log.md`: Architectural decision log for the rewrite execution
- `rewrite/module-checklist.md`: Module checklist for the clean-slate rewrite
- `rewrite/dependency-review.md`: Audit of legacy dependencies and proposed modern dependency list
- `TWL_Integration_Documentation.md`: Guide for the new TWL resource
- `Translation_Notes_Implementation.md`: Implementation details for Translation Notes (tN)
- `DCS_Integration_Documentation.md`: Explains access patterns to Door43 Content Service
- `Resource_Integration_Overview.md`: Outlines all supported translation resource types

## 🛠️ Development Environment

- React + Material UI
- Capacitor (for native builds)
- Loads data from Door43 Git-based repos
- Uses TSV and Markdown content structures

## 🧠 Assistant Tips (for Codex)

- Be concise but context-aware
- Prioritize docs in `/docs` for any questions about resource format or architecture
- If editing React components, respect separation of concerns (UI, state, data-fetching)
- TWL is a new addition that replaces Greek inline tags—point devs to TWL documentation
For Dev Server issues (blank page), refer to the “Debugging Dev Server Blank Screen” section in README.md.

## 🚧 Issue Resolution Workflow

Outstanding development issues are stored as Markdown files under:

```
docs/issues/open/
```

Each file describes a single issue using standard headings like `## Description`, `## Acceptance Criteria`, etc.

Codex CLI should:

1. Read all open issues from `docs/issues/open/`
2. For each issue:
   - Review related documentation in `docs/`
   - Locate and update relevant code files (typically under `src-new/`)
   - Implement the requested behavior (e.g., `twlService.js`)
   - Update documentation as described (e.g., `TWL_Integration_Documentation.md`)
   - Increment the version number in `package.json`
   - Prepend a new entry to `CHANGELOG.md`
   - Commit the changes with a meaningful commit message (e.g., `feat: migrate TW integration to TWL`)
   - Move the issue file to `docs/issues/closed/` and add `Resolved: true` metadata to the top
