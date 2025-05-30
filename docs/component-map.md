
# 🧩 Component Map: translationHelps Viewer

This document lists and describes the major components in the viewer and their responsibilities.

---

## 🔝 Top-Level

| Component | Path | Description |
|-----------|------|-------------|
| `App.js` | `/src/App.js` | Entry shell that wraps viewer in contexts |
| `Viewer.js` | `/src/components/Viewer/Viewer.js` | Manages context change detection and manifest loading |
| `Workspace.js` | `/src/components/Viewer/Workspace/Container.js` | Core layout manager for scripture and helps views |

---

## 🔨 Modules (Vertical Slices)

| Module | Path | Description |
|--------|------|-------------|
| `TWL`  | `/src/modules/twl` | Translation Words Links module (data, hooks, types, tests) |
| `tN`   | `/src/modules/tn`  | Translation Notes module |
| `tQ`   | `/src/modules/tq`  | Translation Questions module |
| `tW`   | `/src/modules/tw`  | Translation Words module |

---

## 📖 Scripture Panel

| Component | Path | Description |
|-----------|------|-------------|
| `ScriptureView.js` | `Scripture/ScriptureView/` | Displays scripture, verse panels, and aligned data |
| `VerseComponent.js` | `Verse/Component.js` | Renders a single verse with embedded helps tabs |
| `Chapter.js` | `Scripture/ChapterSelection/` | Responsible for changing chapter context |
| `Book.js` | `Scripture/BookSelection/` | Responsible for changing book context |

---

## 🧠 Helps Panels

| Component | Description |
|-----------|-------------|
| `TranslationNotesTable.js` | Displays TSV-based tN rows for the current verse |
| `TranslationWordsPanel` | Renders tW article linked from TWL `.tsv` |
| `HelpsTab.js` | Switches between notes, words, questions tabs |
| `RCLinkContainer.js` | Resolves `rc://` article paths to markdown content |

---

## 🛠 Utilities & Context

| File | Description |
|------|-------------|
| `Resources.context.js` | Global store for loaded resource data |
| `helpers.js` | Parsing and utility functions for each resource type |
| `twlService.js` | Loads and parses TWL `.tsv` links |

---

## 🧪 Test Coverage

Unit tests exist (or should be added) for:
- `twlService.js` (parsing)
- TSV parsing helpers
- Book/chapter selection behavior

