# 🗺️ UI Map: translationHelps Viewer

This document explains the layout and function of each major area of the user interface.

---

## 🧭 Screen Regions and Roles

| Area                          | Description                                                                                                   |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Top App Bar**               | Displays project or book name; offers language selection and navigation options                               |
| **Navigation Breadcrumbs**    | Visual breadcrumb display showing current organization, language, resource, book, and chapter:verse selection |
| **Book/Chapter/Verse Picker** | Interactive selection to set the current passage context                                                      |
| **Navigation Wizard**         | Modal step-by-step wizard for guided selection of organization, language, resource, book, and chapter/verse   |
| **Scripture Panel**           | Main area showing selected scripture content                                                                  |
| **Helps Panel**               | Side or bottom panel with tabs for Notes, Words, Questions                                                    |
| **Translation Notes Table**   | Structured view showing filtered tN rows for the verse                                                        |
| **Translation Words**         | Displays articles linked by TWL via `rc://` references                                                        |
| **Translation Questions**     | Questions table linked to verse from tQ                                                                       |
| **Verse Tabs / Panels**       | Each verse expands into an area showing all applicable helps                                                  |

---

## 📌 User Actions and Their Effects

| Action                      | Result                                           |
| --------------------------- | ------------------------------------------------ |
| Select book/chapter/verse   | Loads scripture and fetches relevant tN, tQ, TWL |
| Click on a translation word | Loads tW article content in side panel           |
| Toggle between tabs         | Switches between notes, questions, words, etc.   |
| Open navigation wizard      | Launches step-by-step guided selection process   |
| Click breadcrumb element    | Opens wizard at specific step for quick editing  |
| Reset session               | Clears context and reinitializes app state       |

---

## 🔗 Component Overview (Frontend)

- `App` → top-level application shell with context providers
- `MainView` → main layout orchestrating all panels
- `NavigationBar` → book/chapter/verse selection interface
- `NavigationBreadcrumbs` → visual breadcrumb navigation display
- `NavigationWizard` → modal step-by-step selection wizard
- `ScripturePanel` → displays selected scripture text
- `HelpsTabs` → tabbed interface for translation helps
- `TranslationNotesPanel`, `TranslationWordsPanel`, `TranslationQuestionsPanel`, `TWLPanel` → individual help type displays
- `VerseTabs` → verse-specific navigation
- `VerseView` → individual verse display component
- `ReferenceContext`, `ManifestsContext`, `ResourcesContext` → React context providers for state management

The application is built with React 18, React Context + Hooks, and follows modern component patterns with comprehensive test coverage.
