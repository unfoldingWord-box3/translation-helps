# 📘 Translation Notes (tN) Resource Integration

This document outlines how the Translation Notes (tN) resource is implemented and rendered within the unfoldingWord translationHelps Viewer.

---

## 📂 Source Location in Codebase

The Translation Notes functionality is implemented in the new service-based architecture:

- `src-new/services/tnService.js` - Core service for fetching and parsing tN data
- `src-new/components/TranslationNotesPanel.jsx` - UI component for displaying tN entries
- `src-new/services/dcsClient.js` - DCS API client for fetching manifests and TSV files
- `src-new/context/MultiManifestsContext.jsx` - Context for managing resource manifests
- `src-new/context/ReferenceContext.jsx` - Current verse reference and organization/language context
- `src-new/utils/parseTsv.js` - Utility for parsing TSV files

---

## 📦 Data Loading Architecture

### Service Layer (`tnService.js`)

The tN service provides the main API for accessing Translation Notes:

```javascript
import { getNotesForVerse, getNotesForBook } from "../services/tnService.js";

// Get tN entries for a specific verse with organization/language context
const notes = await getNotesForVerse(
  "gen", // bookId
  1, // chapter
  1, // verse
  "unfoldingWord", // organization (default)
  "en" // languageId (default)
);

// Get all tN entries for a book
const allNotes = await getNotesForBook("gen", "unfoldingWord", "en");
```

### Organization and Language Context Support

**NEW in v0.4.7**: All tN functions now support dynamic organization and language parameters:

```javascript
// Load from different organizations and languages
const spanishNotes = await getNotesForVerse("gen", 1, 1, "STR", "es");
const portugueseNotes = await getNotesForVerse("gen", 1, 1, "WA", "pt");
const hindiNotes = await getNotesForVerse("gen", 1, 1, "translationCore-Create-BCS", "hi");
```

### Data Flow

1. **Manifest Loading**: `MultiManifestsContext` loads resource manifests for current organization/language
2. **File Discovery**: `tnService` uses manifest to find correct TSV file path for each book
3. **Content Fetching**: `dcsClient` fetches TSV content from DCS repositories
4. **Parsing**: `parseTsv` utility converts TSV to structured data
5. **Filtering**: Service filters entries by verse reference
6. **Caching**: Results are cached to improve performance

---

## 🧠 State Management

### Context Hierarchy

```
App
├── ReferenceContext (organization, languageId, reference)
└── MultiManifestsContext (loads manifests for current org/lang)
    └── MainView
        └── TranslationNotesPanel
```

### Context Usage

```javascript
// TranslationNotesPanel.jsx
const { organization, languageId } = useContext(ReferenceContext);
const { manifests } = useContext(ManifestsContext);

// Pass context to service
const notes = await getNotesForVerse(
  reference.bookId,
  reference.chapter,
  reference.verse,
  organization,
  languageId
);
```

---

## 🧾 TSV Structure and Parsing

### TSV File Format

Translation Notes are stored as TSV files with these columns:

```
Book	Chapter	Verse	ID	SupportReference	OrigQuote	Occurrence	GLQuote	OccurrenceNote
GEN	1	1	abc1	1:1	בְּרֵאשִׁ֖ית	1	In the beginning	This refers to...
GEN	1	1	def2	1:1	בָּרָ֣א	1	created	God made...
```

### Parsing Logic

```javascript
// parseTsv.js extracts structured data
const parsedData = parseTsv(tsvContent, {
  hasHeader: true,
  skipEmptyLines: true,
});

// tnService filters by reference
const verseNotes = parsedData.filter(
  (entry) => entry.Chapter === chapter.toString() && entry.Verse === verse.toString()
);
```

---

## 🎨 UI Component (`TranslationNotesPanel.jsx`)

### Component Features

- **Verse-specific Display**: Shows only notes for current verse
- **Loading States**: Displays loading indicator while fetching
- **Error Handling**: Shows user-friendly error messages
- **RC Link Processing**: Converts `rc://` URIs to clickable links
- **Context Awareness**: Reloads when organization/language/verse changes

### Example Usage

```javascript
<TranslationNotesPanel reference={{ bookId: "gen", chapter: 1, verse: 1 }} />
```

### Rendering Logic

```javascript
// For each note entry
{
  notes.map((note, index) => (
    <div key={index} className='note-entry'>
      <h4>{note.GLQuote}</h4>
      <p>{processRcLinks(note.OccurrenceNote, handleRcLinkClick)}</p>
      <small>Support Reference: {note.SupportReference}</small>
    </div>
  ));
}
```

---

## 🔗 RC Link Processing

### Link Types in tN Content

Translation Notes may contain links to:

- **Translation Words (tW)**: `rc://en/tw/dict/bible/kt/create`
- **Translation Academy (tA)**: `rc://en/ta/man/translate/figs-metaphor`

### Link Processing

```javascript
import { processRcLinks } from "../utils/rcLinkUtils.jsx";

// Convert RC links to clickable elements
const processedContent = processRcLinks(note.OccurrenceNote, (rcUri) =>
  handleRcLinkClick(rcUri, languageId, organization)
);
```

### Organization Context in Links

**NEW in v0.4.7**: RC links now resolve using current organization context:

```javascript
// Old behavior (hardcoded)
rc://en/tw/dict/bible/kt/create → unfoldingWord/en_tw

// New behavior (dynamic)
rc://en/tw/dict/bible/kt/create → {currentOrg}/en_tw
```

---

## 📊 Performance Optimizations

### Caching Strategy

```javascript
// tnService.js implements multi-level caching
const cache = new Map();

export async function getNotesForVerse(bookId, chapter, verse, org, lang) {
  const cacheKey = `${org}:${lang}:${bookId}:${chapter}:${verse}`;

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  // Fetch and cache result
  const notes = await fetchAndParseNotes(bookId, chapter, verse, org, lang);
  cache.set(cacheKey, notes);
  return notes;
}
```

### React Optimizations

```javascript
// TranslationNotesPanel.jsx uses proper dependency arrays
useEffect(() => {
  loadNotes();
}, [reference, manifests.tn, organization, languageId]);
```

---

## 🧪 Testing

### Unit Tests (`tnService.test.js`)

```javascript
describe("getNotesForVerse", () => {
  it("should fetch notes with organization context", async () => {
    const notes = await getNotesForVerse("gen", 1, 1, "STR", "es");
    expect(fetchManifest).toHaveBeenCalledWith("es", "tn", "STR");
  });

  it("should filter notes by verse reference", async () => {
    const notes = await getNotesForVerse("gen", 1, 1);
    expect(notes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          Chapter: "1",
          Verse: "1",
        }),
      ])
    );
  });
});
```

### Integration Testing

Test organization/language combinations:

- unfoldingWord/English (default)
- STR/Spanish
- WA/Portuguese
- translationCore-Create-BCS/Hindi

---

## 🔄 Error Handling and Fallbacks

### Service-Level Error Handling

```javascript
export async function getNotesForVerse(bookId, chapter, verse, org, lang) {
  try {
    // Primary attempt with selected org/lang
    return await fetchNotesFromRepository(bookId, chapter, verse, org, lang);
  } catch (error) {
    // Fallback to unfoldingWord/English
    if (org !== "unfoldingWord" || lang !== "en") {
      console.warn(`Failed to load tN from ${org}/${lang}, falling back`);
      try {
        return await fetchNotesFromRepository(bookId, chapter, verse, "unfoldingWord", "en");
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
      }
    }
    throw new Error(`Translation notes not available for ${bookId} ${chapter}:${verse}`);
  }
}
```

### UI Error States

```javascript
// TranslationNotesPanel.jsx shows user-friendly errors
if (error) {
  return (
    <section data-testid='translation-notes-panel'>
      <p style={{ color: "red" }}>Failed to load translation notes: {error}</p>
      <p>Try selecting a different organization or language.</p>
    </section>
  );
}
```

---

## 📌 Migration from Legacy Implementation

### What Changed in v0.4.7

1. **Service-Based Architecture**: Moved from component-embedded logic to dedicated services
2. **Organization/Language Support**: Added dynamic context instead of hardcoded values
3. **Improved Caching**: Better performance with structured caching
4. **Error Handling**: More robust error handling and fallbacks
5. **Testability**: Comprehensive unit test coverage

### Removed Legacy Components

- ❌ `src/components/Viewer/Workspace/Scripture/helpers.js`
- ❌ `src/components/Viewer/Workspace/Scripture/Resources.context.js`
- ❌ `src/components/Viewer/Workspace/TranslationHelps/*`

### New Components Added

- ✅ `src-new/services/tnService.js`
- ✅ `src-new/components/TranslationNotesPanel.jsx`
- ✅ `src-new/services/dcsClient.js`
- ✅ `src-new/context/MultiManifestsContext.jsx`

---

## 📖 Summary

Translation Notes in the new architecture provide:

- **Dynamic Organization/Language Support**: Access tN from any DCS organization
- **Service-Based Design**: Clean separation between data and UI layers
- **Robust Error Handling**: Fallbacks when resources aren't available
- **Performance Optimized**: Multi-level caching and React optimizations
- **Comprehensive Testing**: Unit and integration test coverage
- **RC Link Integration**: Seamless navigation to related resources
