# 🧩 Separation of Concerns and Modular Design Guide

This guide explains the design principles and coding standards for structuring this app around small, focused modules. The goal is to ensure maintainability, reusability, and testability—especially during a full modernization of the codebase.

---

## 🧭 Why Separation of Concerns Matters

To improve the developer experience and long-term sustainability of the project:

- Each module should have **a single clear responsibility**
- Modules should have **minimal or no side effects**
- Code should be **loosely coupled**, easily tested, and reused in different parts of the app

---

## 🧱 Module Categories and Responsibilities

| Layer         | Examples                                                             | Responsibility                                |
| ------------- | -------------------------------------------------------------------- | --------------------------------------------- |
| **UI**        | `VerseView`, `TranslationNotesPanel`, `HelpsTabs`                    | Pure presentation based on props              |
| **Context**   | `ReferenceContext`, `ManifestsContext`, `ResourcesContext`           | App-wide state management and async lifecycle |
| **Services**  | `twlService.js`, `tnService.js`, `dcsClient.js`, `catalogService.js` | Data fetching, transformation, caching        |
| **Hooks**     | `useAppState.js`, `useLoadResources.js`, `useManifest.js`            | Custom React hooks for component logic        |
| **Utilities** | `parseTsv.js`, `rcUri.js`, `markdownUtils.jsx`, `tsvUtils.js`        | Pure utility functions                        |
| **Tests**     | `*.test.jsx`, `*.test.js`                                            | Component and utility testing                 |

---

## 🪜 Design Rules

- ✅ One primary responsibility per file
- ✅ No UI logic in services or helpers
- ✅ Services can access external resources, helpers cannot
- ✅ Functions should be composable and reusable
- ✅ Test each layer independently
- ❌ Avoid stateful modules or deeply nested component logic
- ❌ Avoid mixing fetch logic with rendering logic

---

## 🔧 Recommended Patterns

```js
// services/twlService.js
export async function getTwlLinksForVerse(bookId, chapter, verse) {
  const rows = await loadTsvForBook(bookId);
  return rows.filter((row) => row.Reference === `${bookId}/${chapter}/${verse}`);
}

// helpers/tsv.js
export function parseTsv(tsvText) {
  return tsvText
    .trim()
    .split("\n")
    .slice(1)
    .map((line) => {
      const [Reference, Quote, Occurrence, TWLink] = line.split("\t");
      return { Reference, Quote, Occurrence, TWLink };
    });
}
```

---

## 📚 Documenting Module Responsibilities

Each module should begin with a comment block:

```js
/**
 * twlService.js
 * Responsible for:
 * - Fetching and caching TWL files
 * - Filtering links by verse
 * - Returning rc:// URIs pointing to TW articles
 */
```

---

## 🧠 Using This During Rewrite

Codex CLI or human developers should use this as a blueprint to:

- Decompose legacy files into smaller modules
- Move API/resource logic into `services/`
- Move rendering logic into `components/`
- Share state via `context/` providers
- Ensure helpers and parsers are isolated and testable

---

## 🔁 Summary

This guide supports a cleaner, modern rebuild of the translationHelps Viewer. All future modules should aim to follow these separation-of-concerns standards for consistency and clarity.
