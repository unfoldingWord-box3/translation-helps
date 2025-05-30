
# 🧱 Refactor Plan: translationHelps Viewer

This document defines the high-level architecture, migration steps, and module layout for a full rewrite of the app using modern design principles and tooling.

---

## 🎯 Purpose of the Refactor

This refactor aims to:
- Remove outdated dependencies (older React, service worker, JS packages)
- Improve modularity using the Separation of Concerns guide
- Enable AI agents (e.g., Codex CLI) to support rewriting and ongoing development
- Prepare the codebase for future scalability and offline-first support

## 🛠 Current Pain Points

- Tight coupling between UI and business logic
- Untested logic buried in presentation components
- Outdated dependencies and lack of type safety
- Monolithic modules with unclear boundaries

---

## 🧩 Proposed Architecture

### Layers

| Layer | Role |
|-------|------|
| **UI Components** | Pure presentational components |
| **Context Providers** | Shared state and async hooks (e.g., for resources, manifests, selection) |
| **Service Modules** | Logic to fetch, parse, and manage resources |
| **Helpers** | Stateless utility functions (e.g., TSV parser) |
| **Tests** | Isolated unit tests per module/service |

### Technologies

- React 18+
- Functional components + hooks
- Optional TypeScript for stricter types
- Jest + React Testing Library
- Modular file structure with `src/components`, `src/services`, `src/context`

## 🗂️ Modules to Keep, Break Apart, or Remove

- **Keep:** `src/helpers.js`, shared utility functions
- **Keep:** `src/services/twlService.js`, `src/services/tnService.js`, `src/services/dcsClient.js`
- **Break Apart:** Monolithic `Viewer` and `Workspace` modules into focused sub-components (e.g., ScriptureView, TranslationHelps)
- **Remove:** Legacy `src/serviceWorker.js` and any deprecated context/provider stubs

---

## 🔧 Migration Phases

1. **Audit** current modules by function
2. **Extract** service logic from UI components
3. **Rebuild** shared state via React Context or Zustand
4. **Rebuild** UI as modular presentational components
5. **Integrate** resource helpers (tN, tQ, tW, TWL) via unified API pattern
6. **Replace** outdated libraries with modern alternatives
7. **Write Tests** for all services/helpers

---

## 📁 Folder Structure

```text
src/
  components/
    Scripture/
    Helps/
    Navigation/
  context/
    ResourcesContext.js
    ManifestsContext.js
  services/
    twlService.js
    tnService.js
    dcsClient.js
  helpers/
    parseTsv.js
    rcUri.js
  hooks/
    useLoadResources.js
  tests/
    services/
    components/
```

---

## 📌 Compatibility Assumptions

- All resources remain in the DCS format (`.tsv`, `.md`, `.usfm`)
- TWL replaces inline word-tagging permanently
- Future code is designed for extensibility (e.g., OBS, audio/sign workflows)

---

## 🔁 Feedback Loop

This plan should be reviewed and refined as migration begins. Open questions and design decisions should be tracked in `decision-log.md`.

