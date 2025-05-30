
<!--
status: open
Resolved: true
priority: high
created: 2025-05-30
tags: [rewrite, execution, implementation]
-->

# 🚀 Issue: Execute the Rewrite Plan

**Description**  
This issue initiates the actual implementation phase based on the structure and strategy defined in `rewrite/plan.md`. It should be used to coordinate all rewrite activities, break down modules into executable tasks, and ensure contributors follow the updated architectural guidelines.

---

## ✅ Acceptance Criteria

- [ ] Read and validate `rewrite/plan.md` one final time
- [ ] Split the plan into smaller issues or module checklists (e.g., `rewrite-service-twl`, `rewrite-component-scripture-view`)
- [ ] Use `rewrite/decision-log.md` to log any architecture shifts or forks
- [ ] Prioritize components that:
  - Enable vertical slice testing (scripture + helps + TWL)
  - Can be verified independently
- [ ] Begin execution in a clean branch or folder structure
- [ ] Align testing strategy (unit, integration, snapshot) with each new module
- [ ] Keep UI modular and all state/data logic in separate files

---

## 📦 Suggested Areas for Rewrite Issues

- `components/ScriptureView/`
- `components/TranslationHelps/`
- `services/twlService.js`, `tnService.js`, etc.
- `context/ResourcesContext.js`
- `helpers/tsvParser.js`, `rcUri.js`

---

## 🧠 Guidelines for Execution

- Follow `separation-of-concerns.md` for all new files
- Update `codex.md` and `component-map.md` as modules are replaced
- Use Codex CLI for scaffolding where applicable

---

## 🗂 Related Documents

- `rewrite/plan.md`
- `rewrite/decision-log.md`
- `component-map.md`
- `lifecycle.md`
- `separation-of-concerns.md`

---

Once this issue is opened, all `rewrite-*` module tasks should reference this as their parent or epic.
