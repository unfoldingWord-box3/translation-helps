<!--
Resolved: true
status: open
priority: high
created: 2025-06-07
tags: [rewrite, modules, hooks, tests]
-->

# 🔧 Issue: Implement resource module hooks and tests

## Description

The TWL, tN, tQ, and tW modules under `src/modules` are currently scaffolds with placeholder TODOs in their `hooks.ts` files. To complete the clean-slate rewrite, implement these hooks following the guidelines in `docs/separation-of-concerns.md` and ensure comprehensive unit tests for each hook according to the module checklist.

## ✅ Acceptance Criteria

- [ ] `src/modules/twl/hooks.ts` exports a `useTwlLinks(bookId, chapter, verse)` hook that fetches and returns TWL links for a verse.
- [ ] `src/modules/tn/hooks.ts` exports a `useTranslationNotes(bookId, chapter, verse)` hook to fetch tN rows.
- [ ] `src/modules/tq/hooks.ts` exports a `useTranslationQuestions(bookId, chapter, verse)` hook to fetch tQ rows.
- [ ] `src/modules/tw/hooks.ts` exports a `useTranslationWords(bookId, chapter, verse)` hook to fetch tW articles via TWL links.
- [ ] Each hook is implemented with the DCS client or corresponding service as appropriate.
- [ ] Unit tests cover successful data loads, caching behavior, and error handling for each hook.