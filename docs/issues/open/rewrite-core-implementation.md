
<!--
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

- [ ] Create a fresh `src/` directory or `src-new/` for rewritten code
- [ ] Implement working versions of the following foundational modules:
  - [ ] `twlService.js`: fetches and parses `.tsv` TWL files
  - [ ] `parseTsv.js`: helper to transform TSV text to structured rows
  - [ ] `ResourcesContext.js`: loads and stores current resource data
  - [ ] `ScripturePanel.jsx`: displays scripture aligned with selected verse
  - [ ] `TranslationWordsPanel.jsx`: displays linked tW articles from TWL
- [ ] Add unit tests for each service/helper
- [ ] Integrate Codex CLI tasks (if configured) to validate each module
- [ ] Include comments or JSDoc headers that explain each module’s responsibility

---

## 🧠 Implementation Guidelines

- Follow `docs/separation-of-concerns.md` for all module boundaries
- Keep services stateless and testable
- Use React 18 functional components only
- Use `fetch` or a custom DCS client wrapper for resource loading
- Prefer props and context over prop drilling or global state

---

## 📁 Related Inputs

- `rewrite/plan.md`
- `component-map.md`
- `dependency-review.md`
- `separation-of-concerns.md`

---

## 🏁 Goal

By the end of this issue, the rewrite should have:
- A working TWL loading and rendering pipeline
- Basic scripture display
- Fully testable and modularized architecture to build on
