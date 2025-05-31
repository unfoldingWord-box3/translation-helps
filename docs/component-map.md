
# 🧩 Component Map: translationHelps Viewer

This document lists and describes the major components in the viewer and their responsibilities.

---

## 🔝 Top-Level

| Component   | Path                                | Description                                    |
|-------------|-------------------------------------|------------------------------------------------|
| `App`       | `src-new/components/App.jsx`        | Entry shell that wraps the viewer in contexts  |
| `MainView`  | `src-new/components/MainView.jsx`   | Orchestrates scripture, navigation, and helps panels |
| `NavigationBar` | `src-new/components/NavigationBar.jsx` | Book, chapter, and verse selectors      |

---

## 📖 Scripture Panel

| Component        | Path                                        | Description                         |
|------------------|---------------------------------------------|-------------------------------------|
| `ScripturePanel` | `src-new/components/ScripturePanel.jsx`     | Displays selected scripture text    |

---

## 🔢 Verse Navigation

| Component   | Path                                 | Description                       |
|-------------|--------------------------------------|-----------------------------------|
| `VerseTabs` | `src-new/components/VerseTabs.jsx`   | Displays verse navigation tabs    |

---

## 📝 Helps Panels

| Component                  | Path                                                   | Description                                  |
|----------------------------|--------------------------------------------------------|----------------------------------------------|
| `TranslationNotesPanel`    | `src-new/components/TranslationNotesPanel.jsx`         | Displays translation notes (tN) entries      |
| `TranslationQuestionsPanel`| `src-new/components/TranslationQuestionsPanel.jsx`     | Displays translation questions (tQ) entries  |
| `TranslationWordsPanel`    | `src-new/components/TranslationWordsPanel.jsx`         | Displays linked translation words (TWL) links |

---

## 🧠 Context Providers

| Context Provider    | Path                                         | Description                           |
|---------------------|----------------------------------------------|---------------------------------------|
| `ReferenceProvider` | `src-new/context/ReferenceContext.jsx`       | Manages selected book, chapter, verse |
| `ManifestsProvider` | `src-new/context/ManifestsContext.jsx`       | Provides DCS manifests for resources  |
| `ResourcesProvider` | `src-new/context/ResourcesContext.jsx`       | Loads and stores resource data        |

---

## ⚙️ Hooks & Services

| File               | Path                                      | Description                              |
|--------------------|-------------------------------------------|------------------------------------------|
| `useManifest`      | `src-new/hooks/useManifest.js`            | Hook for fetching DCS manifests          |
| `useLoadResources` | `src-new/hooks/useLoadResources.js`       | Hook for loading resource data           |
| `dcsClient`        | `src-new/services/dcsClient.js`           | Unified client for DCS content fetching  |
| `tnService`        | `src-new/services/tnService.js`           | Service for translation notes (tN)       |
| `tqService`        | `src-new/services/tqService.js`           | Service for translation questions (tQ)  |
| `twlService`       | `src-new/services/twlService.js`          | Service for translation words links (TWL)|

---

## 🧪 Utilities

| File             | Path                                     | Description                |
|------------------|------------------------------------------|----------------------------|
| `parseTsv`       | `src-new/utils/parseTsv.js`              | TSV parsing utility        |
| `rcUri`          | `src-new/utils/rcUri.js`                 | RCUri parsing utility      |
| `groupByVerse`   | `src-new/utils/groupByVerse.js`          | Groups TSV rows by verse   |

