<!--
Resolved: true
status: open
priority: high
created: 2025-06-04
tags: [rewrite, ui-components]
-->

# 🔧 Issue: Implement rewrite UI components

## Description

Implement core UI components for the clean-slate rewrite including application shell, navigation, scripture display, and translation helps panels.

## ✅ Acceptance Criteria

- [ ] `src-new/components/App.jsx` — Root shell and provider wiring
- [ ] `src-new/components/NavigationBar.jsx` — Book/chapter/verse selectors
- [ ] `src-new/components/ScripturePanel.jsx` — Displays selected scripture content (validate existing)
- [ ] `src-new/components/TranslationNotesPanel.jsx` — Table of tN entries
- [ ] `src-new/components/TranslationWordsPanel.jsx` — Displays tW articles via TWL (validate existing)
- [ ] `src-new/components/TranslationQuestionsPanel.jsx` — tQ entries for comprehension
- [ ] `src-new/components/VerseTabs.jsx` — Unified tabs across helps
- [ ] `src-new/components/VerseView.jsx` — Wrapper for content per verse

## 🧠 Implementation Notes

See `docs/rewrite/plan.md` and `docs/issues/closed/rewrite-entire-app.md` for context.