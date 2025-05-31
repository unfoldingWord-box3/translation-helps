<!--
Resolved: true
status: open
priority: high
created: 2025-06-04
tags: [rewrite, services]
-->

# 🔧 Issue: Implement core rewrite services

## Description

Implement core services required for the clean-slate rewrite including TWL, tN, tQ services, a unified DCS fetch client, and TSV parsing utilities.

## ✅ Acceptance Criteria

- [ ] `src-new/services/twlService.js` — TWL links for verse (validate and add tests)
- [ ] `src-new/services/tnService.js` — Translation Notes loader
- [ ] `src-new/services/tqService.js` — Translation Questions loader
- [ ] `src-new/services/dcsClient.js` — Unified fetch layer for DCS repos
- [ ] `src-new/utils/parseTsv.js` — Reusable TSV parser (validate existing implementation)

## 🧠 Implementation Notes

See `docs/rewrite/plan.md` and `docs/issues/closed/rewrite-entire-app.md` for context.