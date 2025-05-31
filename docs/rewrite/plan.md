# 📝 Rewrite Plan: translationHelps Viewer

## ✅ Rewrite Plan Status

All core rewrite tasks have been implemented under `src-new/` as of version 0.2.11. See `docs/rewrite/backlog.md` for deferred enhancements.

---

This document defines a clean-slate architecture and rewrite roadmap for the translationHelps Viewer. It focuses on behavior requirements and modern frameworks without referencing internal implementation details of the legacy codebase.

 ---

 ## 🎯 Goals

 - Define required user behaviors: navigation by book/chapter/verse, resource display (tN, tQ, tW, TWL), offline support, native integration.
 - Emphasize behavior-driven design: focus on user-facing outcomes, not current implementation.
 - Enable extensibility for future resource types and platforms.

 ## 🧭 Principles

 - **Clean-slate**: Start from behavior requirements, avoid carry-over of legacy structure.
 - **Modular by vertical slice**: Implement resource modules (TWL, tN, tQ, tW) end-to-end.
 - **Test-first**: Drive architecture with tests for each module and core behaviors.
 - **Framework-idiomatic**: Leverage React hooks, context, and optional TypeScript.
**Extensible**: Design plugin-friendly module interfaces for new resource types.

### 🏭 Layer Responsibilities

- **UI Components** (`src/components/`): Presentational components handling navigation and resource display.
- **Modules** (`src/modules/`): Vertical-slice resource modules (TWL, tN, tQ, tW) including data loading, parsing, hooks, types, and tests.
- **Context / State** (`src/context/`): Application-wide state management and resource providers.
- **Hooks / Services** (`src/hooks/`, `src/utils/`): Shared hooks and utilities for resource fetching, parsing TSV/USFM, and stateful logic.
- **Entry Point** (`src/App.tsx`): Bootstraps context, routing, and top-level UI container.
 ---

 ## 🗂 Proposed File Structure

 ```text
 src/
   modules/
     twl/
       index.tsx
       hooks.ts
       types.ts
       tests/
     tn/
       index.tsx
       hooks.ts
       types.ts
       tests/
     tq/
       index.tsx
       hooks.ts
       types.ts
       tests/
     tw/
       index.tsx
       hooks.ts
       types.ts
       tests/
   components/
     Navigation/
       BookList.tsx
       ChapterList.tsx
       VersePicker.tsx
     ResourceViewer/
       ResourceContainer.tsx
   context/
     ResourcesProvider.tsx
   utils/
     parseTsv.ts
     usfmParser.ts
   hooks/
     useLoadResources.ts
   App.tsx
 ```

 ---

 ## 🔧 Rewrite Strategy

 1. **Vertical Slice**  
    Implement the TWL (Translation Words Links) module end-to-end: data loading, parsing, UI integration, and tests.
 2. **Additional Modules**  
    Repeat process for tN (Translation Notes), tQ (Translation Questions), and tW (Translation Words).
 3. **Core Infrastructure**  
    Establish shared context, routing, and resource-loading hooks.
 4. **Presentational Components**  
    Build generic UI components for rendering resource data and navigation controls.
 5. **Platform Integration**  
    Integrate with native platforms (Capacitor) after web-first implementation.

 ---

## 📚 Input References

- `docs/app-overview.md`
- `docs/ui-map.md`
- `docs/component-map.md`
- `docs/lifecycle.md`
- `docs/separation-of-concerns.md`
- `docs/rewrite/dependency-review.md`

 ---

 ## 🔁 Feedback and Iteration

 Refine this plan as early implementations surface new insights. Track all architectural decisions in `docs/rewrite/decision-log.md`.