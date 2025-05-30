
# Translation Words Linking (TWL) Integration

This document outlines how Translation Words Linking (TWL) data is integrated into this project, replacing the older Greek-tagged word links used in Translation Words (tW) resources.

## 📘 What is TWL?

**TWL** stands for **Translation Words Links**. It is a `.tsv` (Tab-Separated Values) formatted resource that explicitly defines links between verses of scripture and corresponding tW article entries.

This provides a more robust and language-agnostic way to align translation helps with scripture content.

## 📂 File Format

Each `.tsv` file corresponds to a specific book of the Bible (e.g., `gen.tsv` for Genesis) and is structured as follows:

| Column        | Description |
|---------------|-------------|
| `Reference`   | The scripture reference in `book/chapter/verse` format (e.g., `gen/1/1`) |
| `OrigWords`   | Original language words (may be empty) |
| `Quote`       | Word(s) in the translation to which the article applies |
| `Occurrence`  | Which instance of the `Quote` to apply the link to |
| `TWLink`      | The `rc://` path pointing to a tW article (e.g., `rc://en/tw/dict/bible/kt/create`) |

## 🔧 How It Works in the App

### 1. **Loading TWL Data**

A service module (e.g., `twlService.js`) loads `.tsv` files for each book from the `en_twl` resource repository, either dynamically or at build time.

### 2. **Parsing and Querying**

The service:
- Parses the `.tsv` files into JavaScript objects
- Filters entries by a verse reference
- Returns a list of TWLinks relevant to that verse

Example:
```js
import { getLinksForVerse } from './services/twlService';

const links = getLinksForVerse('gen', '1', '1');
// returns all TWLinks for Genesis 1:1
```

### 3. **UI Integration**

A component such as `TranslationWordsPanel.js` displays these TWLinks:
- Renders clickable links or previews of tW articles
- Allows readers to explore definitions and context while translating

## ✅ Benefits of TWL

- Replaces unreliable in-text tagging
- Decouples original language dependency
- Simplifies alignment of helps resources
- More portable across languages and workflows

## 🧪 Testing Strategy

- Unit test the parsing logic for `.tsv` files
- Integration test that TWLinks show up for a selected verse
- Mock TWL content for test environments

## 📌 Source Repository

Official TWL resource:  
[https://git.door43.org/unfoldingWord/en_twl](https://git.door43.org/unfoldingWord/en_twl)

## 🏁 Summary

Use `getLinksForVerse(bookId, chapter, verse)` to get TWLinks for a verse. These links enhance translator access to tW articles and replace deprecated word-tagging strategies.
