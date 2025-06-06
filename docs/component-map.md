# 🧩 Component Map: translationHelps Viewer

This document lists and describes the major components in the viewer and their responsibilities.

---

## 🔝 Top-Level Components

| Component               | Path                                           | Description                                          |
| ----------------------- | ---------------------------------------------- | ---------------------------------------------------- |
| `App`                   | `src-new/components/App.jsx`                   | Entry shell that wraps the viewer in contexts        |
| `MainView`              | `src-new/components/MainView.jsx`              | Orchestrates scripture, navigation, and helps panels |
| `NavigationBar`         | `src-new/components/NavigationBar.jsx`         | Book, chapter, and verse selectors                   |
| `NavigationBreadcrumbs` | `src-new/components/NavigationBreadcrumbs.jsx` | Visual breadcrumb navigation with context display    |
| `ErrorBoundary`         | `src-new/components/ErrorBoundary.jsx`         | Error boundary for graceful error handling           |

---

## 📖 Scripture & Reference Components

| Component           | Path                                       | Description                      |
| ------------------- | ------------------------------------------ | -------------------------------- |
| `ScripturePanel`    | `src-new/components/ScripturePanel.jsx`    | Displays selected scripture text |
| `ReferenceSelector` | `src-new/components/ReferenceSelector.jsx` | Reference selection component    |

---

## 🔢 Verse Navigation & Views

| Component   | Path                               | Description                     |
| ----------- | ---------------------------------- | ------------------------------- |
| `VerseTabs` | `src-new/components/VerseTabs.jsx` | Displays verse navigation tabs  |
| `VerseView` | `src-new/components/VerseView.jsx` | Individual verse view component |

---

## 📝 Helps Panels

| Component                   | Path                                               | Description                                 |
| --------------------------- | -------------------------------------------------- | ------------------------------------------- |
| `HelpsTabs`                 | `src-new/components/HelpsTabs.jsx`                 | Tab interface for helps panels              |
| `TranslationNotesPanel`     | `src-new/components/TranslationNotesPanel.jsx`     | Displays translation notes (tN) entries     |
| `TranslationQuestionsPanel` | `src-new/components/TranslationQuestionsPanel.jsx` | Displays translation questions (tQ) entries |
| `TranslationWordsPanel`     | `src-new/components/TranslationWordsPanel.jsx`     | Displays translation words (tW) entries     |
| `TWLPanel`                  | `src-new/components/TWLPanel.jsx`                  | Displays translation words links (TWL) data |
| `ArticlePanel`              | `src-new/components/ArticlePanel.jsx`              | Displays translation articles (tA) content  |

---

## 🧭 Navigation Components

| Component          | Path                                                                  | Description                                 |
| ------------------ | --------------------------------------------------------------------- | ------------------------------------------- |
| `NavigationWizard` | `src-new/components/NavigationWizard/index.jsx`                       | Main wizard entry point and integration     |
| `WizardContainer`  | `src-new/components/NavigationWizard/WizardContainer.jsx`             | Modal wizard container with step management |
| `StepIndicator`    | `src-new/components/NavigationWizard/StepIndicator.jsx`               | Visual progress indicator for wizard steps  |
| `OrganizationStep` | `src-new/components/NavigationWizard/steps/OrganizationStep.jsx`      | Step 1: Organization selection              |
| `LanguageStep`     | `src-new/components/NavigationWizard/steps/LanguageStep.jsx`          | Step 2: Language selection                  |
| `ResourceStep`     | `src-new/components/NavigationWizard/steps/ResourceStep.jsx`          | Step 3: Resource selection                  |
| `BookStep`         | `src-new/components/NavigationWizard/steps/BookStep.jsx`              | Step 4: Book selection                      |
| `ChapterVerseStep` | `src-new/components/NavigationWizard/steps/ChapterVerseStep.jsx`      | Step 5: Chapter and verse selection         |
| `SearchableGrid`   | `src-new/components/NavigationWizard/components/SearchableGrid.jsx`   | Reusable grid with search functionality     |
| `SelectionCard`    | `src-new/components/NavigationWizard/components/SelectionCard.jsx`    | Card component for selections               |
| `RecentSelections` | `src-new/components/NavigationWizard/components/RecentSelections.jsx` | Recent selections display                   |

---

## 🧠 Context Providers

| Context Provider         | Path                                        | Description                           |
| ------------------------ | ------------------------------------------- | ------------------------------------- |
| `ReferenceProvider`      | `src-new/context/ReferenceContext.jsx`      | Manages selected book, chapter, verse |
| `ManifestsProvider`      | `src-new/context/ManifestsContext.jsx`      | Provides DCS manifests for resources  |
| `MultiManifestsProvider` | `src-new/context/MultiManifestsContext.jsx` | Manages multiple manifests            |
| `ResourcesProvider`      | `src-new/context/ResourcesContext.jsx`      | Loads and stores resource data        |

---

## 🎣 Custom Hooks

| Hook                    | Path                                                                 | Description                                 |
| ----------------------- | -------------------------------------------------------------------- | ------------------------------------------- |
| `useAppState`           | `src-new/hooks/useAppState.js`                                       | Main application state management hook      |
| `useLanguages`          | `src-new/hooks/useLanguages.js`                                      | Hook for language selection and management  |
| `useLoadResources`      | `src-new/hooks/useLoadResources.js`                                  | Hook for loading resource data              |
| `useManifest`           | `src-new/hooks/useManifest.js`                                       | Hook for fetching DCS manifests             |
| `useOrganizations`      | `src-new/hooks/useOrganizations.js`                                  | Hook for organization data management       |
| `useResources`          | `src-new/hooks/useResources.js`                                      | Hook for resource data access               |
| `useTWL`                | `src-new/hooks/useTWL.js`                                            | Hook for TWL (Translation Words Links) data |
| `useWizardState`        | `src-new/components/NavigationWizard/hooks/useWizardState.js`        | Wizard state management hook                |
| `useNavigationHistory`  | `src-new/components/NavigationWizard/hooks/useNavigationHistory.js`  | Navigation history tracking hook            |
| `useKeyboardNavigation` | `src-new/components/NavigationWizard/hooks/useKeyboardNavigation.js` | Keyboard navigation support hook            |

---

## ⚙️ Services

| Service            | Path                                   | Description                               |
| ------------------ | -------------------------------------- | ----------------------------------------- |
| `catalogService`   | `src-new/services/catalogService.js`   | Service for DCS catalog API access        |
| `dcsClient`        | `src-new/services/dcsClient.js`        | Unified client for DCS content fetching   |
| `scriptureService` | `src-new/services/scriptureService.js` | Service for scripture text retrieval      |
| `taService`        | `src-new/services/taService.js`        | Service for translation articles (tA)     |
| `tnService`        | `src-new/services/tnService.js`        | Service for translation notes (tN)        |
| `tqService`        | `src-new/services/tqService.js`        | Service for translation questions (tQ)    |
| `twService`        | `src-new/services/twService.js`        | Service for translation words (tW)        |
| `twlService`       | `src-new/services/twlService.js`       | Service for translation words links (TWL) |

---

## 🧪 Utilities

| Utility             | Path                                 | Description                                   |
| ------------------- | ------------------------------------ | --------------------------------------------- |
| `contextHelpers`    | `src-new/utils/contextHelpers.js`    | Helper functions for context management       |
| `contextValidation` | `src-new/utils/contextValidation.js` | Validation utilities for context data         |
| `defaultReference`  | `src-new/utils/defaultReference.js`  | Default reference values and constants        |
| `groupByVerse`      | `src-new/utils/groupByVerse.js`      | Groups TSV rows by verse                      |
| `markdownUtils`     | `src-new/utils/markdownUtils.jsx`    | Markdown parsing and rendering utilities      |
| `parseTsv`          | `src-new/utils/parseTsv.js`          | TSV parsing utility                           |
| `rcLinkUtils`       | `src-new/utils/rcLinkUtils.jsx`      | RC (Resource Container) link utilities        |
| `rcUri`             | `src-new/utils/rcUri.js`             | RCUri parsing utility                         |
| `tsvUtils`          | `src-new/utils/tsvUtils.js`          | TSV data processing utilities                 |
| `usfmParser`        | `src-new/utils/usfmParser.js`        | USFM (Unified Standard Format Markers) parser |
| `workflowHelpers`   | `src-new/utils/workflowHelpers.js`   | Helper functions for workflow management      |

---

## 🧪 Test Files

All components, services, hooks, contexts, and utilities have corresponding test files using the `.test.jsx` or `.test.js` extension, following React Testing Library and Vitest patterns.

## 📝 Entry Point

| File       | Path               | Description                                 |
| ---------- | ------------------ | ------------------------------------------- |
| `main.jsx` | `src-new/main.jsx` | Application entry point and React rendering |
