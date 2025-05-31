<!--
status: closed
priority: high
created: 2025-05-30
resolved: true
tags: [rewrite, qa, epic, post-refactor]
-->

# 🧩 Epic: Post-Refactor QA and Completion Tasks

**Description**  
This epic covers the final integration, verification, and enhancement steps needed to complete the translationHelps Viewer rewrite. The refactored code under `src-new/` introduces a clean modular structure with solid services, utilities, context, and components. This issue ensures everything is properly integrated, wired, tested, and documented before marking the rewrite feature-complete.

---

## ✅ Core Goals

- Finalize integration across all component panels
- Validate verse/context synchronization
- Confirm services and hooks behave as expected
- Ensure all functionality from the legacy app is present
- Align codebase with documentation (and vice versa)
- Prepare for UI theming, OBS integration, or external rollout

---

## 🔚 Resolution

All tasks in this epic have been completed:
- Introduced `MainView.jsx` to orchestrate panels
- Added integration and unit tests for core components and context sync
- Updated documentation (`component-map.md`, `rewrite/plan.md`, `rewrite/decision-log.md`, `codex.md`)
- Created backlog for deferred enhancements (`docs/rewrite/backlog.md`)

---

## 🔗 Related Files

- `src-new/components/MainView.jsx`
- `docs/rewrite/backlog.md`
- `docs/rewrite/decision-log.md`
- `docs/component-map.md`
- `codex.md`