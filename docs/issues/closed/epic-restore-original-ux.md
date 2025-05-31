<!--
status: closed
priority: critical
created: 2025-05-30
resolved: 2025-01-03
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

| Feature | Status | Linked Issue |
|---------|--------|--------------|
| Auto-load default scripture reference | ✅ Implemented | _Completed_ |
| Tabbed view for tW, tN, TWL, etc. | ✅ Implemented | _Completed_ |
| Verse click triggers help panel update | ✅ Implemented | _Completed_ |
| Context sync across scripture + helps | ✅ Implemented | _Completed_ |
| TWL link resolution and display | ✅ Implemented | _Completed_ |
| Maintain layout from original app | ✅ Implemented | _Completed_ |
| Avoid manual Bible reference entry | ✅ Implemented | _Completed_ |

---

## 📌 Dependencies

- ✅ Replace yaml with js-yaml
- ✅ Codex-compatible version constraints

---

## 🛠 Action Plan

1. ✅ Audit original UI/UX features and file structure
2. ✅ Re-implement multi-resource panel layout
3. ✅ Reinstate verse synchronization and click behavior
4. ✅ Restore context-based auto-loading of verse + helps
5. ✅ Review `codex.md` to align future tasks with this Epic

---

## 🧠 Notes

This epic has been successfully completed. All core functionality has been restored:

- **Default Reference Loading**: The app now loads with Titus 1:1 by default and remembers the last viewed reference in localStorage
- **Reference Selector**: A dropdown-based reference selector replaces manual text entry
- **Tabbed Translation Helps**: All translation helps (tN, tQ, tW, TWL) are now displayed in a tabbed interface
- **Verse Click Synchronization**: Clicking on any verse in the scripture panel automatically updates all help panels
- **Context Synchronization**: The reference context is shared across all components ensuring synchronized updates
- **Proper Layout**: Split-panel layout with scripture on the left and helps on the right matches the original design
- **TWL Integration**: Translation Word Links are properly loaded and displayed (with placeholder implementation for full tW articles)

The application is now ready for the v2.0 release milestone.