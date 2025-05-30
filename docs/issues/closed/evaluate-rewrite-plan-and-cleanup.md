
<!--
status: open
Resolved: true
priority: high
created: 2025-05-30
tags: [rewrite, evaluation, cleanup]
-->

# 📋 Issue: Evaluate Rewrite Plan and Retire Refactor Plan

**Description**  
The new `rewrite/plan.md` will define a clean-slate architecture and implementation roadmap for rebuilding the translationHelps Viewer. This issue ensures that plan is comprehensive, aligns with current design documentation, and provides enough direction to proceed with module-by-module rewrites.

Once validated, the old `refactor/plan.md` will be removed to avoid confusion and ensure a single authoritative source of architectural truth.

---

## ✅ Acceptance Criteria

- [ ] Review `rewrite/plan.md` and confirm it includes:
  - High-level architecture
  - File/module structure
  - Layer responsibilities (UI, services, context, etc.)
  - Clear project goals and principles
  - Timeline or sequencing strategy (e.g., by resource type or feature group)
- [ ] Ensure it references key documents:
  - `app-overview.md`
  - `component-map.md`
  - `lifecycle.md`
  - `separation-of-concerns.md`
- [ ] Ensure it includes new decision log references (`rewrite/decision-log.md`)
- [ ] Confirm it reflects Codex CLI assumptions in `codex.md`
- [ ] If complete and approved:
  - [ ] Delete `refactor/plan.md`
  - [ ] Archive `refactor/impact-analysis.md` if no longer relevant
  - [ ] Update `codex.md` to point only to `rewrite/plan.md`

---

## 🧠 Notes

This issue marks the transition from planning to execution. After it's resolved, the team can begin issuing `rewrite-*` implementation tasks based on the structure defined in `rewrite/plan.md`.
