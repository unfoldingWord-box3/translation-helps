
<!--
status: open
Resolved: true
priority: high
created: 2025-05-30
tags: [documentation, codex, refactor-prep]
-->

# 📝 Issue: Finalize Core Documentation for Agentic Rebuild

**Description**  
We are preparing to **rewrite the translationHelps Viewer** using modern best practices (React 18+, modular design, updated dependencies, possibly TypeScript). To support this, we must finalize a clear and comprehensive set of **developer-facing documentation**. This will enable humans and AI agents (e.g., Codex CLI) to rebuild the app accurately and efficiently.

This issue guides the audit and refinement of all foundational documentation required for an agentic understanding of the project.

---

## ✅ Acceptance Criteria

- [ ] Ensure `docs/app-overview.md` clearly defines purpose, target users, and supported resources
- [ ] Review `docs/ui-map.md` for accuracy of screen regions, component roles, and interactions
- [ ] Confirm `docs/lifecycle.md` includes:
  - Startup behavior
  - Context propagation
  - Resource fetching
  - Offline support behavior
- [ ] Ensure `docs/component-map.md` lists all key components with paths and descriptions
- [ ] Verify all references to `Translation Notes`, `TWL`, and `DCS` usage are covered in:
  - `docs/TWL_Integration_Documentation.md`
  - `docs/Translation_Notes_Implementation.md`
  - `docs/DCS_Integration_Documentation.md`
- [ ] Add links to each of these in `codex.md` so they are discoverable to Codex CLI
- [ ] Ensure all Markdown docs follow a clean heading hierarchy (`#`, `##`, `###`)
- [ ] Add a `docs/README.md` that lists and explains each document with recommended reading order

---

## 📁 Document Checklist

| File | Status |
|------|--------|
| `app-overview.md` | ✅ Created |
| `ui-map.md` | ✅ Created |
| `lifecycle.md` | ✅ Created |
| `component-map.md` | ✅ Created |
| `TWL_Integration_Documentation.md` | ✅ Existing |
| `Translation_Notes_Implementation.md` | ✅ Existing |
| `DCS_Integration_Documentation.md` | ✅ Existing |
| `Resource_Integration_Overview.md` | ✅ Existing |
| `codex.md` | ✅ Updated with automation guide |
| `docs/README.md` | ⬜ To be created |

---

## 🧠 Notes

- The goal is **clarity and completeness**, not preserving legacy implementation details.
- All documents should **describe behavior, not implementation**, and leave room for modernization.
- This is a pre-requisite before authoring `rewrite-*` issues.
