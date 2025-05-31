 # 📓 Rewrite Decision Log

 This log tracks important architectural and design decisions made during the clean-slate rewrite of the translationHelps Viewer. Each entry should include the decision, date, context, and rationale.

 ---

 ## Template Entry Format

 ```
 ### [YYYY-MM-DD] Use framework-idiomatic hooks for state management

 **Decision:** Use React Context and hooks to manage resource state across modules.

 **Context:** Describe context here.

 **Rationale:**
 - Leverage native React APIs for maintainable state.
 - Testable and composable design.
 ```

 ---

## Log
### [2025-06-01] Split rewrite plan and scaffold modules

**Decision:** Initiate implementation by splitting the clean-slate rewrite plan into focused module execution tasks and scaffolding the module folder structure under `src/modules`.

**Context:** Following the Execute the Rewrite Plan issue acceptance criteria.

**Rationale:**
- Enables vertical-slice development and independent verification of each module.
- Aligns with test-first and clean-slate architectural principles.
- Provides clear execution tasks and folder structure for contributors.

### [2025-06-07] QA review identifies gaps in module hooks, helpers, and services

**Decision:** Document incomplete module hook implementations (TWL, tN, tQ, tW), scattered helper utilities, and direct `fetch` usage across services/components. Created new issues to implement missing hooks, consolidate helpers, and introduce a unified DCS client.

**Context:** Executed the review-rewrite-implementation issue by comparing codebase against `docs/rewrite/plan.md`, `docs/component-map.md`, `docs/lifecycle.md`, and `docs/separation-of-concerns.md`.

**Rationale:**
- Align module hooks with separation-of-concerns guidelines.
- Improve consistency and testability by centralizing helper utilities.
- Simplify and standardize resource fetching via a unified DCS client.