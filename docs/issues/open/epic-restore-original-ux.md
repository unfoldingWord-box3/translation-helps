<!--
status: open
priority: critical
created: 2025-05-30
tags: [epic, regression, rewrite, ux, restoration]
-->

# 🧩 Epic: Restore Full Feature Parity and UX from Original App

**Description**  
The recent rewrite succeeded in bootstrapping a working Vite-based React app, but failed to preserve core functionality and user experience. This epic tracks the restoration of all missing features and UI/UX behaviors that were present in the original implementation.

---

## 🎯 Goals

- Rebuild all expected features that users relied on
- Eliminate manual entry workflows and restore linked verse/context navigation
- Reinstate multi-resource tabs, synced views, and intelligent data defaults
- Match original app behavior in layout, loading, and reference syncing

---

## 📋 Parity Restoration Checklist

| Feature                                | Status         | Linked Issue                                                 |
| -------------------------------------- | -------------- | ------------------------------------------------------------ |
| Auto-load default scripture reference  | ❌ Missing     | _(To be created)_                                            |
| Tabbed view for tW, tN, TWL, etc.      | ❌ Missing     | _(To be created)_                                            |
| Verse click triggers help panel update | ✅ Complete    | [Closed Issue](../closed/fix-verse-click-help-panel-sync.md) |
| Context sync across scripture + helps  | ❌ Missing     | _(To be created)_                                            |
| TWL link resolution and display        | ❌ Partial     | [TWL migration issue](#)                                     |
| Maintain layout from original app      | ❌ Broken      | _(To be created)_                                            |
| Avoid manual Bible reference entry     | ❌ Manual-only | _(To be created)_                                            |

---

## 📌 Dependencies

- ✅ Replace yaml with js-yaml
- ✅ Codex-compatible version constraints

---

## 🛠 Action Plan

1. Audit original UI/UX features and file structure
2. Re-implement multi-resource panel layout
3. Reinstate verse synchronization and click behavior
4. Restore context-based auto-loading of verse + helps
5. Review `codex.md` to align future tasks with this Epic

---

## 🧠 Notes

This epic may be referenced by all future UX-related issues. The rewrite is not "done" until we recover the original app’s functionality and usability.

Please prioritize this as a blocker for `v2.0` release milestone.
