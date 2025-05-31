<!--
Resolved: true
status: open
priority: high
created: 2025-06-04
tags: [rewrite, hooks]
-->

# 🔧 Issue: Implement rewrite hooks

## Description

Implement shared hooks required for the clean-slate rewrite including resource loading and manifest parsing.

## ✅ Acceptance Criteria

- [ ] `src-new/hooks/useLoadResources.js` — Fetch and cache resource sets
- [ ] `src-new/hooks/useManifest.js` — Load and parse DCS manifests

## 🧠 Implementation Notes

See `docs/rewrite/plan.md` and `docs/issues/closed/rewrite-entire-app.md` for context.