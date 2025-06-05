# 🔄 App Lifecycle & Context Flow

This document describes the runtime behavior and application lifecycle of the translationHelps Viewer, including context initialization, resource loading, and async flows.

---

## ⚙️ Startup Process

1. **App loads** (`src-new/main.jsx`)

   - Initializes React application with StrictMode
   - Loads global context providers (ReferenceContext, ManifestsContext, ResourcesContext)

2. **Initial Context Setup**

   - Book, chapter, verse default to Genesis 1:1 (or last viewed)
   - Context propagated via React Context Providers

3. **Manifest Fetching**
   - `useManifest()` hook and `catalogService` fetch resource metadata for the selected book/language/project
   - Manifests determine which `.tsv`, `.md`, and `.usfm` files should be loaded

---

## 📖 When User Selects a Book or Chapter

1. **Context Update**

   - Triggers manifest refresh via `ManifestsContext` if bookId or language has changed
   - Triggers `useLoadResources()` hook which:
     - Loads content for ULT, UST, tN, tQ, tW, TWL, tA, etc.
     - Resolves source text (ULT/UGNT) and supporting resources via individual services

2. **Resource Load**

   - Each resource fetched as raw text from Door43 (DCS) via `dcsClient`
   - Parsed into usable data structures by dedicated services:
     - `.tsv` files → row objects via `parseTsv` and `tsvUtils`
     - `.md` files → article maps via `markdownUtils`
     - USFM → rendered verses via `usfmParser`

3. **UI Update**
   - `ScripturePanel` renders aligned text
   - `TranslationNotesPanel`, `TranslationWordsPanel`, `TranslationQuestionsPanel`, `TWLPanel`, `ArticlePanel` display related content
   - `HelpsTabs` and `VerseTabs` update dynamically per verse or frame

---

## 🧠 Async & Deferred Behavior

| Event               | Effect                                                                           |
| ------------------- | -------------------------------------------------------------------------------- |
| User resets session | Clears all stored context and cache                                              |
| Initial book load   | May take time if cache is empty; resources pulled from DCS                       |
| Switching verses    | Loads only the verse-specific resources, reusing cached data where available     |
| Missing resources   | Gracefully handled with fallback messaging (e.g., “No questions for this verse”) |

---

## 💾 Offline / Cache Model

- Local caching is handled by IndexedDB via localForage (used for manifests and possibly TSV content)
- Service worker (if enabled) may precache key assets
- App supports offline view for already-loaded books but does not attempt to persist all resources
