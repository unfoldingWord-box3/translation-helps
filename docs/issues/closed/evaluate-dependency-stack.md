<!--
status: open
Resolved: true
priority: high
created: 2025-05-30
tags: [rewrite, dependencies, architecture]
-->

# 🔄 Issue: Evaluate and Redesign Dependency Stack for Rewrite

**Description**  
Before finalizing the architecture and generating modules for the new `translationHelps Viewer`, we must review all current dependencies and define a modern, minimal, and maintainable stack.

---

## ✅ Acceptance Criteria

- [ ] Audit all packages used in the legacy `package.json`
- [ ] Identify deprecated, redundant, or legacy dependencies
- [ ] Propose modern replacements based on:
  - React 18 best practices
  - AI-assist-friendly modularity
  - Improved developer ergonomics
- [ ] Document findings in `rewrite/dependency-review.md`
- [ ] Reference changes or selections in `rewrite/plan.md`
- [ ] Finalize initial `package.json` dependency list for bootstrap

---

## 🧠 Notes

Dependencies should be explicitly justified — we are rebuilding this app for clarity, maintainability, and modularity. Any tools that increase complexity or dev onboarding time without clear benefit should be excluded.