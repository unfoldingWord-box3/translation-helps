<!--
Resolved: true
status: open
priority: high
created: 2025-06-04
tags: [rewrite, context]
-->

# 🔧 Issue: Implement rewrite contexts

## Description

Implement core context providers required for the clean-slate rewrite including resource loading, reference tracking, and manifest management.

## ✅ Acceptance Criteria

- [ ] `src-new/context/ResourcesContext.js` — Manages loaded resource content (validate existing)
- [ ] `src-new/context/ReferenceContext.js` — Tracks current book/chapter/verse
- [ ] `src-new/context/ManifestsContext.js` — Loads resource manifests from DCS

## 🧠 Implementation Notes

See `docs/rewrite/plan.md` and `docs/issues/closed/rewrite-entire-app.md` for context.