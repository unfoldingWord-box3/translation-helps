<!--
status: open
Resolved: true
priority: high
created: 2025-05-30
tags: [migration, TWL, translationWords]
-->

# 🚧 Issue: Migrate Translation Words Integration from Inline Greek Tags to TWL

**Description**  
The current translationHelps Viewer links Translation Words (tW) articles using a deprecated method: inline Greek-tagged references in source texts. These have since been removed across source repositories. The new standard is the **Translation Words Links (TWL)** resource, a `.tsv` file organized by `book/chapter/verse` with explicit links to tW articles.

This issue tracks the migration to use TWL as the primary means of linking translationWords articles.

---

## ✅ Acceptance Criteria

- [ ] Add a `twlService.js` module that:
  - Downloads `.tsv` files per book from the [en_twl DCS repo](https://git.door43.org/unfoldingWord/en_twl)
  - Parses and filters entries by `Reference`
  - Exposes `getLinksForVerse(bookId, chapter, verse)` API
- [ ] Wire `twlService` into relevant components (e.g., `Viewer`, `Workspace`, or new `TranslationWordsPanel`)
- [ ] Render TWL-linked tW articles (from `rc://` URIs) in the UI
- [ ] Match the architectural separation of concerns used elsewhere (e.g., for tN)
- [ ] Confirm that all legacy Greek-tag linking logic is removed or deprecated
- [ ] Add unit tests for `twlService` and UI integration
- [ ] Document the new flow in `TWL_Integration_Documentation.md`

---

## 📁 Reference Resources

- [TWL README](https://git.door43.org/unfoldingWord/en_twl/raw/branch/master/README.md)
- [`docs/TWL_Integration_Documentation.md`](./docs/TWL_Integration_Documentation.md)
- [`docs/Resource_Integration_Overview.md`](./docs/Resource_Integration_Overview.md)
- [`docs/DCS_Integration_Documentation.md`](./docs/DCS_Integration_Documentation.md)
- [`ARCHITECTURE.md`](./docs/ARCHITECTURE.md)

---

## 🧠 Implementation Notes

- TWL rows include `Reference`, `Quote`, `Occurrence`, and `TWLink`
- Links point to `rc://` markdown articles in `en_tw`
- Use `fetch()` or cached loading to support offline-first needs
- TWL format is consistent with OBS-TWL, enabling shared patterns across scripture and story modes

---

## 🔍 Status

This is a **high-priority migration** for continued compatibility with unfoldingWord resources. TWL provides a more portable and translation-friendly method of aligning key terms with source content.
