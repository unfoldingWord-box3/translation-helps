
<!--
status: open
priority: high
created: 2025-05-30
tags: [rewrite, full-app, implementation]
-->

# 🏗️ Issue: Rewrite the Full App Across All Modules and Components

**Description**  
This issue initiates a full reconstruction of the translationHelps Viewer as outlined in `rewrite/plan.md`. Unlike previous partial tasks that focused on a single slice (e.g., TWL), this issue encompasses **all core services, contexts, UI components, and helpers**. It is the starting point for building a fully functional, modular, testable application.

---

## ✅ Acceptance Criteria

### Services
- [ ] `twlService.js` — TWL links for verse
- [ ] `tnService.js` — Translation Notes loader
- [ ] `tqService.js` — Translation Questions loader
- [ ] `dcsClient.js` — Unified fetch layer for DCS repos
- [ ] `parseTsv.js` — Reusable TSV parser

### Context
- [ ] `ResourcesContext.js` — Manages loaded resource content
- [ ] `ReferenceContext.js` — Tracks current book/chapter/verse
- [ ] `ManifestsContext.js` — Loads resource manifests from DCS

### UI Components
- [ ] `App.jsx` — Root shell and provider wiring
- [ ] `NavigationBar.jsx` — Book/chapter/verse selectors
- [ ] `ScripturePanel.jsx` — Displays selected scripture content
- [ ] `TranslationNotesPanel.jsx` — Table of tN entries
- [ ] `TranslationWordsPanel.jsx` — tW articles via TWL
- [ ] `TranslationQuestionsPanel.jsx` — tQ entries for comprehension
- [ ] `VerseTabs.jsx` — Unified tabs across helps
- [ ] `VerseView.jsx` — Wrapper for content per verse

### Hooks
- [ ] `useLoadResources.js` — Fetch and cache resource sets
- [ ] `useManifest.js` — Load and parse DCS manifests

### Helpers
- [ ] `rcUri.js` — Parses `rc://` URIs
- [ ] `tsvUtils.js` — TSV-safe row manipulation
- [ ] `groupByVerse.js` — Aligns content to specific verses

### Tests
- [ ] Unit tests for all services/helpers
- [ ] Rendering tests for core components
- [ ] Context tests (mocked values + async updates)

---

## 🧠 Implementation Notes

- Use React 18+ with functional components and hooks only
- TypeScript optional but encouraged for services
- Keep test coverage near 100% for services/helpers
- Follow `separation-of-concerns.md` for all architecture
- Use `fetch` and modern `async/await` logic for DCS access

---

## 📁 References

- `rewrite/plan.md`
- `rewrite/decision-log.md`
- `dependency-review.md`
- `component-map.md`
- `codex.md`

---

## 🏁 Outcome

A modular, testable, and modern implementation of the full app, ready to replace the legacy codebase and serve as the foundation for additional features (e.g., OBS, offline-first, multimodal translation).
