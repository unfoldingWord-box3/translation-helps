<!--
Resolved: true
status: open
priority: high
created: 2025-06-04
tags: [rewrite, helpers]
-->

# 🔧 Issue: Implement rewrite helpers

## Description

Implement helper utilities required for the clean-slate rewrite including URI parsing, TSV manipulation, and grouping by verse.

## ✅ Acceptance Criteria

- [ ] `src-new/utils/rcUri.js` — Parses `rc://` URIs
- [ ] `src-new/utils/tsvUtils.js` — TSV-safe row manipulation
- [ ] `src-new/utils/groupByVerse.js` — Aligns content to specific verses

## 🧠 Implementation Notes

See `docs/rewrite/plan.md` and `docs/issues/closed/rewrite-entire-app.md` for context.