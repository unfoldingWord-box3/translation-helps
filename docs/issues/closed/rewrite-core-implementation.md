<!--
Resolved: true
status: open
priority: high
created: 2025-05-30
tags: [rewrite, implementation, modules]
-->

# 🔧 Issue: Begin Full Implementation of Rewrite Modules

**Description**  
This issue marks the transition from architectural planning to actual code implementation of the new translationHelps Viewer app. Unlike prior scaffold-focused issues, this task is for actively writing and delivering core files and components as defined in `rewrite/plan.md`.

---

## ✅ Acceptance Criteria

- [x] Create a fresh `src-new/` directory for rewritten code
- [x] Implement working versions of the following foundational modules:
  - [x] `src-new/services/twlService.js`: fetches and parses `.tsv` TWL files
  - [x] `src-new/utils/parseTsv.js`: helper to transform TSV text to structured rows
  - [x] `src-new/context/ResourcesContext.js`: loads and stores current resource data
  - [x] `src-new/components/ScripturePanel.jsx`: displays scripture aligned with selected verse
  - [x] `src-new/components/TranslationWordsPanel.jsx`: displays linked tW articles from TWL
- [x] Add unit tests for each service/helper
- [x] Integrate Codex CLI tasks (if configured) to validate each module
- [x] Include JSDoc headers explaining each module’s responsibility

---

## 🧠 Implementation Guidelines

- Follow `docs/separation-of-concerns.md` for all module boundaries
- Keep services stateless and testable
- Use React 18 functional components only
- Use `fetch` for resource loading
- Prefer props and context over global state

---

## 📁 Related Inputs

- `docs/rewrite/plan.md`
- `docs/component-map.md`
- `docs/rewrite/dependency-review.md`
- `docs/separation-of-concerns.md`

---

## 🏁 Goal

By the end of this issue, the rewrite should have:
- A working TWL loading and rendering pipeline
- Basic scripture display
- Fully testable and modularized architecture to build on