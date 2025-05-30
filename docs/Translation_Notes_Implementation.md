
# 📘 Translation Notes (tN) Resource Integration

This document outlines how the Translation Notes (tN) resource is implemented and rendered within the unfoldingWord translationHelps Viewer.

---

## 📂 Source Location in Codebase

The Translation Notes functionality is implemented primarily in:

- `src/components/Viewer/Workspace/Scripture/helpers.js`  
- `src/components/Viewer/Workspace/Scripture/ScriptureView/TranslationNotesTable.js`  
- `src/components/Viewer/Workspace/Scripture/ScriptureView/Verse/Component.js`  
- `src/components/Viewer/Workspace/TranslationHelps/*`  
- `Resources.context.js` and `gitApi.js` for data fetching and state

---

## 📦 Data Loading

tN content is loaded via `fetchResources()` in:

```js
src/components/Viewer/Workspace/Scripture/helpers.js
```

It pulls the `en_tn` resource from Door43 using the manifest and fetches the book-specific `.tsv` files.

The `tn` resource is added to the `resources` object and made available through the `ResourcesContext`.

---

## 🧠 State Management

State is managed in:

```js
src/components/Viewer/Workspace/Scripture/Resources.context.js
```

Here, the `populateResources` function handles loading the tN content into the global `resources` context.

---

## 🧾 TSV Parsing and Display

tN entries are parsed from `.tsv` and displayed using:

- `TranslationNotesTable.js`: renders rows using `MUIDataTable`
- `VerseComponent.js`: injects tN as a "tab" with structured verse-by-verse data
- `TranslationHelps/Component.js` and `HelpsTab.js`: render tN entries with markdown

Example tab rendering logic:
```js
if (tab.notes) {
  content = tab.notes.map((note, index) =>
    <TranslationNotes key={index} note={note} />
  );
}
```

---

## 🔗 Link Handling

tN notes may include internal links to:
- Translation Words (tW) articles
- Translation Academy (tA) topics

These links are parsed and rendered using:
```js
TranslationHelps/RCLinkContainer.js
```

This component interprets `rc://` URIs and dynamically loads linked resources.

---

## 🧪 Testing Considerations

tN logic spans across state, data fetching, and rendering layers:
- Validate correct loading of `.tsv` files for each book
- Test that verse alignment correctly associates notes
- Ensure links to tW/tA resolve and render appropriately

---

## 📌 Summary

- tN is a `.tsv`-based, verse-indexed resource rendered in structured tables and panels
- Data is loaded into context and reused across views
- UI integrates tabbed display, markdown rendering, and resource linking
- No dedicated `tnService.js` exists — logic is distributed across components and helpers

