
# 🗺️ UI Map: translationHelps Viewer

This document explains the layout and function of each major area of the user interface.

---

## 🧭 Screen Regions and Roles

| Area | Description |
|------|-------------|
| **Top App Bar** | Displays project or book name; offers language selection and navigation options |
| **Book/Chapter/Verse Picker** | Interactive selection to set the current passage context |
| **Scripture Panel** | Main area showing selected scripture content |
| **Helps Panel** | Side or bottom panel with tabs for Notes, Words, Questions |
| **Translation Notes Table** | Structured view showing filtered tN rows for the verse |
| **Translation Words** | Displays articles linked by TWL via `rc://` references |
| **Translation Questions** | Questions table linked to verse from tQ |
| **Verse Tabs / Panels** | Each verse expands into an area showing all applicable helps |

---

## 📌 User Actions and Their Effects

| Action | Result |
|--------|--------|
| Select book/chapter/verse | Loads scripture and fetches relevant tN, tQ, TWL |
| Click on a translation word | Loads tW article content in side panel |
| Toggle between tabs | Switches between notes, questions, words, etc. |
| Reset session | Clears context and reinitializes app state |

---

## 🔗 Component Overview (Frontend)

- `Viewer` → top-level container for context and manifests
- `Workspace` → layout and help containers
- `ScriptureView` → main display of verse(s)
- `TranslationNotesTable`, `TranslationWordsPanel` → side-tabs for helps
- `Resources.context` → state provider for resources

Each of these can be rebuilt with React 18, React Context + Hooks, or moved into modular composables in a refactor.
