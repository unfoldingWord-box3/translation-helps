
# 🔄 App Lifecycle & Context Flow

This document describes the runtime behavior and application lifecycle of the translationHelps Viewer, including context initialization, resource loading, and async flows.

---

## ⚙️ Startup Process

1. **App loads** (`index.js`)
   - Initializes React and service worker (if enabled)
   - Loads global context (language, project, reference)

2. **Initial Context Setup**
   - Book, chapter, verse default to Genesis 1:1 (or last viewed)
   - Context propagated via React Context Providers

3. **Manifest Fetching**
   - `populateManifests()` and `refreshManifests()` fetch resource metadata for the selected book/language/project
   - Manifests determine which `.tsv`, `.md`, and `.usfm` files should be loaded

---

## 📖 When User Selects a Book or Chapter

1. **Context Update**
   - Triggers `refreshManifests()` if bookId or language has changed
   - Triggers `fetchResources()` which:
     - Loads content for ult, ust, tn, tQ, tW, etc.
     - Resolves source text (ULT/UGNT) and supporting resources

2. **Resource Load**
   - Each resource fetched as raw text from Door43 (DCS)
   - Parsed into usable data structures:
     - `.tsv` files → row objects
     - `.md` files → article maps
     - USFM → rendered verses

3. **UI Update**
   - `ScriptureView` renders aligned text
   - `TranslationNotesTable`, `TranslationWordsPanel`, `QuestionsTable` display related content
   - Tabs update dynamically per verse or frame

---

## 🧠 Async & Deferred Behavior

| Event | Effect |
|-------|--------|
| User resets session | Clears all stored context and cache |
| Initial book load | May take time if cache is empty; resources pulled from DCS |
| Switching verses | Loads only the verse-specific resources, reusing cached data where available |
| Missing resources | Gracefully handled with fallback messaging (e.g., “No questions for this verse”) |

---

## 💾 Offline / Cache Model

- Local caching is handled by IndexedDB via localForage (used for manifests and possibly TSV content)
- Service worker (if enabled) may precache key assets
- App supports offline view for already-loaded books but does not attempt to persist all resources

