 <!--
 status: open
 Resolved: true
 priority: high
 created: 2025-05-30
 tags: [rewrite, architecture, planning]
 -->

 # 🔁 Issue: Rewrite and Replace Refactor Plan with Rewrite-Oriented Architecture

 **Description**  
 The original `docs/refactor/plan.md` was developed with a modular *refactor* in mind. However, based on architectural analysis and the age of the current codebase, we are shifting toward a **clean-slate rewrite** approach. This issue will guide the rewriting of the plan to focus on a fresh architecture using modern technologies and best practices without needing to preserve internal implementation structure.

 ---

 ## 🧭 Key Differences Between Refactor vs Rewrite

 | Refactor Plan | Rewrite Plan |
 |---------------|--------------|
 | Gradual migration | Clean break and rebuild |
 | Starts from legacy structure | Starts from design requirements |
 | Reuse of context/components encouraged | Behavior replicated, implementation replaced |
 | Emphasis on de-coupling | Emphasis on re-invention and testability |
 | Risk of leftover technical debt | Risk of scope drift but high clarity |

 ---

 ## ✅ Acceptance Criteria

 - [ ] Archive or rename `refactor/plan.md` → `refactor/plan.legacy.md`
 - [ ] Create `docs/rewrite/plan.md` with a clean-slate architecture:
   - Only reference behavior, not component names
   - Define new structure with minimal assumptions
   - Favor idiomatic modern frameworks (e.g., React + hooks, TypeScript optional)
 - [ ] Reference input documents: `app-overview.md`, `ui-map.md`, `component-map.md`, `lifecycle.md`
 - [ ] Remove assumptions about service workers, legacy layouts, and folder structure
 - [ ] Define rewrite strategy by vertical slice or by resource module (e.g., TWL first, then tN)
 - [ ] Document goals, principles, and proposed file structure
 - [ ] Log decisions in `rewrite/decision-log.md`

 ---

 ## 🗂 Suggested Output Files

 | File | Description |
 |------|-------------|
 | `rewrite/plan.md` | Clean-slate architecture and rewrite roadmap |
 | `rewrite/decision-log.md` | Tracks rewrite-specific architecture choices |
 | `rewrite/module-checklist.md` | Optional checklist of rewrite modules by type or domain |

 ---

 ## 🧠 Notes

 This issue replaces the refactor-based approach with a rewrite-first mindset. Once resolved, it will enable Codex CLI or manual contributors to begin generating `rewrite-*` scoped issues based on this foundation.