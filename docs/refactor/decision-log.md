
# 📓 Refactor Decision Log

This log tracks important architectural and design decisions made during the refactor of the translationHelps Viewer. Each entry should include the decision, date, context, and rationale.

---

## Template Entry Format

```
### [YYYY-MM-DD] Use React Context for Resource Management

**Decision:** Use React Context (rather than Zustand or Redux) to manage and share loaded resources (tN, tQ, tW, TWL) across the app.

**Context:** The legacy app uses a context-like provider with tightly coupled state logic. Codex CLI will operate more predictably with idiomatic React Context.

**Rationale:**
- Native to React
- Well-documented for AI tooling
- Testable and composable
```

---

## Log

### [2025-05-30] Adopt Separation-of-Concerns Module Structure

**Decision:** Enforce modular separation between UI, services, helpers, and context.

**Context:** Legacy components had mixed responsibilities (e.g., loading data and rendering it). This was hard to maintain and impossible to test in isolation.

**Rationale:**
- Aligns with AI agent design patterns
- Increases testability and clarity
- Pairs well with Codex CLI modular file generation
