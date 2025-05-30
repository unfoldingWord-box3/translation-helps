
<!--
status: open
priority: high
created: 2025-05-30
tags: [refactor, architecture, planning]
-->

# 🧠 Issue: Create, Document, and Review Refactoring Approach for Rewrite

**Description**  
Before rewriting the `translationHelps Viewer` app using modern frameworks and best practices, we need a formal, documented **refactoring strategy**. This strategy will guide decisions around architecture, module structure, responsibilities, and tech stack upgrades.

This issue includes three parts: creating a plan, documenting it for transparency and AI tooling, and conducting a review to assess readiness and risk.

---

## 🎯 Goals

- Establish scope boundaries for the rewrite (what to keep, rework, or remove)
- Define new architecture principles (React 18+, Context/hooks, modular services, etc.)
- Align all contributors (human and agentic) on standards like separation of concerns
- Document tradeoffs in refactoring vs. rebuilding

---

## ✅ Acceptance Criteria

### Phase 1: **Create the Refactoring Plan**
- [ ] Identify current architectural pain points (tight coupling, untested logic, outdated libraries)
- [ ] List modules to keep, break apart, or remove
- [ ] Propose high-level architecture for rewritten app (context, services, UI layers)
- [ ] Define modular entry points (components, services, contexts, tests)

### Phase 2: **Document the Strategy**
- [ ] Create `docs/refactor/plan.md` outlining the proposed new structure
- [ ] Include diagrams or flowcharts where helpful
- [ ] Reference existing docs: `app-overview.md`, `component-map.md`, `separation-of-concerns.md`
- [ ] Align with current Codex CLI goals defined in `codex.md`

### Phase 3: **Review and Analyze**
- [ ] Discuss whether full rewrite or staged refactor is more appropriate
- [ ] Document known risks (time, compatibility, learning curve)
- [ ] Get internal sign-off before proceeding to write `rewrite-*` issues

---

## 📁 Proposed Output Files

| File | Purpose |
|------|---------|
| `docs/refactor/plan.md` | Outline of new modular structure and migration phases |
| `docs/refactor/impact-analysis.md` | Notes on tradeoffs, known risks, technical debt |
| `docs/refactor/decision-log.md` | Rationale for architectural choices made |

---

## 🧠 Notes

- Codex CLI will rely on this plan to understand what files to generate and where logic should live
- This plan enables contributors to work in parallel on smaller, focused modules
- Rewrite issues will not be opened until this issue is resolved and approved
