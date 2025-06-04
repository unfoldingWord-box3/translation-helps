# Translation Words Linking (TWL) Integration

This document outlines how Translation Words Linking (TWL) data is integrated into the unfoldingWord translationHelps Viewer, powering the Translation Words functionality.

## 📘 What is TWL?

**TWL** stands for **Translation Words Links**. It is a `.tsv` (Tab-Separated Values) formatted resource that explicitly defines links between verses of scripture and corresponding Translation Words (tW) article entries.

This provides a robust and language-agnostic way to connect verses to relevant word study resources, replacing older Greek-tagged word linking strategies.

## 📂 File Format

Each `.tsv` file corresponds to a specific book of the Bible (e.g., `gen.tsv` for Genesis) and is structured as follows:

| Column      | Description                                                                            |
| ----------- | -------------------------------------------------------------------------------------- |
| `Reference` | The scripture reference in `chapter:verse` format (e.g., `1:1` for chapter 1, verse 1) |
| `TWLink`    | The `rc://` URI pointing to a tW article (e.g., `rc://en/tw/dict/bible/kt/create`)     |

### Example TWL File Content

```
Reference	TWLink
1:1	rc://en/tw/dict/bible/kt/create
1:1	rc://en/tw/dict/bible/kt/god
1:2	rc://en/tw/dict/bible/kt/spirit
```

## 🔧 Implementation Architecture

### Service Layer (`twlService.js`)

The TWL service provides the main API for accessing Translation Words Links:

```javascript
import { getLinksForVerse } from "../services/twlService.js";

// Get TWL links for a specific verse with organization/language context
const links = await getLinksForVerse(
  "gen", // bookId
  1, // chapter
  1, // verse
  manifest, // TWL manifest
  "unfoldingWord", // organization (NEW in v0.4.7)
  "en" // languageId (NEW in v0.4.7)
);
// Returns: ['rc://en/tw/dict/bible/kt/create', 'rc://en/tw/dict/bible/kt/god']
```

### Organization and Language Context Support

**NEW in v0.4.7**: TWL service now supports dynamic organization and language parameters:

```javascript
// Load TWL from different organizations and languages
const spanishLinks = await getLinksForVerse("gen", 1, 1, manifest, "STR", "es");
const hindiLinks = await getLinksForVerse(
  "gen",
  1,
  1,
  manifest,
  "translationCore-Create-BCS",
  "hi"
);
```

### Manifest-Based File Loading

The service uses manifest data to discover correct file paths instead of hardcoded filenames:

```javascript
// twlService.js discovers files via manifest
const project = manifest.projects.find((p) => p.identifier === bookId);
if (!project) {
  throw new Error(`No TWL project found for book: ${bookId}`);
}

const fileName = project.path.replace("./", "");
const tsvContent = await fetchResourceFile(languageId, "twl", fileName, organization);
```

## 🔗 Integration with Translation Words

### TWL → tW Articles Pipeline

1. **TWL Discovery**: `twlService` finds relevant `rc://` links for a verse
2. **Article Fetching**: `twService` fetches tW articles for each link
3. **Content Display**: `TranslationWordsPanel` displays articles with summaries

```javascript
// TranslationWordsPanel.jsx integration
const { organization, languageId } = useContext(ReferenceContext);

// Step 1: Get TWL links
const links = await getLinksForVerse(
  reference.bookId,
  reference.chapter,
  reference.verse,
  manifests.twl,
  organization,
  languageId
);

// Step 2: Fetch tW articles for the links
const articles = await getArticlesForLinks(links, languageId, organization);

// Step 3: Display articles
setWords(
  articles.map((article) => ({
    title: article.title,
    content: article.content,
    rcUri: article.rcUri,
    summary: extractSummary(article.content),
  }))
);
```

## 📊 Data Flow

```
User selects verse
      ↓
TranslationWordsPanel
      ↓
twlService.getLinksForVerse()
      ↓
MultiManifestsContext (TWL manifest)
      ↓
dcsClient.fetchResourceFile() → {org}/{lang}_twl/{book}.tsv
      ↓
parseTsv() → Filter by chapter:verse
      ↓
Return rc:// URIs
      ↓
twService.getArticlesForLinks()
      ↓
Display tW articles
```

## 🎨 UI Integration

### TranslationWordsPanel Component

The TWL integration is seamless to users - they see "Translation Words" but TWL powers it behind the scenes:

```javascript
// TranslationWordsPanel.jsx
export function TranslationWordsPanel({ reference }) {
  const [words, setWords] = useState([]);
  const [twlLinks, setTwlLinks] = useState([]);
  const { manifests } = useContext(ManifestsContext);
  const { organization, languageId } = useContext(ReferenceContext);

  useEffect(() => {
    async function loadWords() {
      // Get TWL links
      const links = await getLinksForVerse(
        reference.bookId,
        reference.chapter,
        reference.verse,
        manifests.twl,
        organization,
        languageId
      );

      setTwlLinks(links);

      // Fetch and display tW articles
      if (links?.length > 0) {
        const articles = await getArticlesForLinks(links, languageId, organization);
        setWords(articles);
      }
    }

    loadWords();
  }, [reference, manifests.twl, organization, languageId]);

  // UI renders tW articles powered by TWL
}
```

### Context Awareness

The component reloads when any context changes:

- **Verse changes**: New TWL links for new verse
- **Organization changes**: TWL from different organization
- **Language changes**: TWL in different language

## 🧪 Testing

### Unit Tests (`twlService.test.js`)

```javascript
describe("getLinksForVerse", () => {
  it("should fetch links with organization context", async () => {
    const links = await getLinksForVerse("gen", 1, 1, mockManifest, "STR", "es");
    expect(dcsClient.fetchResourceFile).toHaveBeenCalledWith("es", "twl", "gen.tsv", "STR");
  });

  it("should filter links by chapter:verse reference", async () => {
    const links = await getLinksForVerse("gen", 1, 1, mockManifest, "unfoldingWord", "en");
    expect(links).toEqual(["rc://en/tw/dict/bible/kt/create"]);
  });

  it("should handle missing book projects", async () => {
    await expect(
      getLinksForVerse("missing", 1, 1, mockManifest, "unfoldingWord", "en")
    ).rejects.toThrow("No TWL project found for book: missing");
  });
});
```

### Integration Testing

Test organization/language combinations:

- unfoldingWord/English → `unfoldingWord/en_twl`
- STR/Spanish → `STR/es_twl`
- translationCore-Create-BCS/Hindi → `translationCore-Create-BCS/hi_twl`

## 🔄 Error Handling

### Graceful Degradation

```javascript
export async function getLinksForVerse(bookId, chapter, verse, manifest, organization, languageId) {
  try {
    // Primary attempt with selected org/lang
    return await fetchLinksFromRepository(
      bookId,
      chapter,
      verse,
      manifest,
      organization,
      languageId
    );
  } catch (error) {
    console.error(`Failed to load TWL file for ${bookId}:`, error);
    throw new Error(`Failed to load TWL file for ${bookId}: ${error.message}`);
  }
}
```

### UI Error Display

```javascript
// TranslationWordsPanel shows debug info when TWL exists but articles fail
{
  error && twlLinks.length > 0 && (
    <details style={{ marginTop: "8px", fontSize: "0.9em", color: "#666" }}>
      <summary>Debug Info</summary>
      <p>Found {twlLinks.length} TWL link(s) for this verse:</p>
      <ul>
        {twlLinks.map((link, index) => (
          <li key={index} style={{ wordBreak: "break-all" }}>
            {link}
          </li>
        ))}
      </ul>
    </details>
  );
}
```

## ✅ Benefits of TWL Integration

### Advantages Over Legacy Approach

1. **Language Agnostic**: Works with any language, not just Greek/Hebrew
2. **Explicit Linking**: Clear verse-to-article mappings
3. **Maintainable**: Separate from Scripture text, easier to update
4. **Portable**: TSV format is simple and widely supported
5. **Organization Aware**: Works with any DCS organization
6. **Version Controlled**: Links can be tracked and versioned

### User Experience

- **Contextual**: Only shows words relevant to current verse
- **Comprehensive**: Can link multiple words per verse
- **Cross-Reference**: Supports links to various tW categories

## 📌 Migration from Legacy Implementation

### What Changed in v0.4.7

1. **Organization/Language Parameters**: Dynamic context instead of hardcoded
2. **Manifest Integration**: File discovery via manifest instead of naming convention
3. **Service Architecture**: Clean separation between TWL and tW services
4. **Error Handling**: Better error messages and debugging
5. **Caching**: Improved performance with structured caching

### Legacy vs New

```javascript
// OLD (hardcoded)
const links = await getLinksForVerse("gen", 1, 1, manifest);
// Always fetched from unfoldingWord/en_twl

// NEW (dynamic context)
const links = await getLinksForVerse("gen", 1, 1, manifest, "STR", "es");
// Fetches from STR/es_twl
```

## 📂 File Locations

### Service Layer

- `src-new/services/twlService.js` - TWL data fetching and parsing
- `src-new/services/twlService.test.js` - Unit tests
- `src-new/services/twService.js` - tW article fetching (powered by TWL)

### UI Components

- `src-new/components/TranslationWordsPanel.jsx` - Main UI (uses TWL behind scenes)

### Utilities

- `src-new/utils/parseTsv.js` - TSV parsing utility
- `src-new/services/dcsClient.js` - DCS API client

## 📖 Summary

TWL integration provides:

- **Robust Word Linking**: Explicit verse-to-article connections
- **Multi-Organization Support**: Works with any DCS organization
- **Language Flexibility**: Supports any language with TWL resources
- **Service-Based Architecture**: Clean separation of concerns
- **Enhanced User Experience**: Contextual word studies while reading Scripture
- **Developer-Friendly**: Comprehensive testing and error handling

The TWL system seamlessly powers the Translation Words functionality, providing users with relevant word studies without exposing the underlying complexity.
