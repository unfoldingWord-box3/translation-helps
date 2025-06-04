# 📚 Resource Integration Overview

This document summarizes how different unfoldingWord resources are integrated and linked within the translationHelps Viewer. Each resource type follows its own conventions for alignment, formatting, and contextual relevance.

## 🔗 Supported Resource Types

| Resource                          | Format   | Service               | Linkage Method   | Organization Support |
| --------------------------------- | -------- | --------------------- | ---------------- | -------------------- |
| **ULT/UST/T4T/UEB**               | USFM     | `scriptureService.js` | Verse-based      | ✅ v0.4.7            |
| **tN** (Translation Notes)        | TSV      | `tnService.js`        | Verse-based      | ✅ v0.4.7            |
| **tQ** (Translation Questions)    | TSV      | `tqService.js`        | Verse-based      | ✅ v0.4.7            |
| **tW** (Translation Words)        | Markdown | `twService.js`        | RC URI-based     | ✅ v0.4.7            |
| **TWL** (Translation Words Links) | TSV      | `twlService.js`       | Verse → tW links | ✅ v0.4.7            |
| **tA** (Translation Academy)      | Markdown | `taService.js`        | Topic-based      | ✅ v0.4.7            |

## 🏗️ Service-Based Architecture

### Core Services

Each resource type has a dedicated service for data fetching and processing:

```
src-new/services/
├── scriptureService.js     # Bible text (ULT, UST, etc.)
├── tnService.js           # Translation Notes
├── tqService.js           # Translation Questions
├── twService.js           # Translation Words articles
├── twlService.js          # Translation Words Links
├── taService.js           # Translation Academy
└── dcsClient.js           # DCS API client (shared)
```

### Organization and Language Context Support

**NEW in v0.4.7**: All services now support dynamic organization and language parameters:

```javascript
// All services accept organization and language context
const notes = await getNotesForVerse("gen", 1, 1, "STR", "es");
const questions = await getQuestionsForVerse("gen", 1, 1, "WA", "pt");
const links = await getLinksForVerse("gen", 1, 1, manifest, "translationCore-Create-BCS", "hi");
const article = await getArticle("rc://en/tw/dict/bible/kt/create", "en", "unfoldingWord");
```

## 🔁 Resource Linkage Patterns

### Translation Words Integration Pipeline

1. **TWL Discovery**: `twlService` finds `rc://` links for a verse
2. **Article Fetching**: `twService` fetches tW articles for each link
3. **Display**: `TranslationWordsPanel` shows articles with summaries

```
User selects Genesis 1:1
         ↓
TranslationWordsPanel
         ↓
twlService.getLinksForVerse('gen', 1, 1, manifest, org, lang)
         ↓
Returns: ['rc://en/tw/dict/bible/kt/create', 'rc://en/tw/dict/bible/kt/god']
         ↓
twService.getArticlesForLinks(links, lang, org)
         ↓
Display: Articles about "create" and "god"
```

### RC Link Cross-References

Resources frequently reference each other via `rc://` URIs:

- **tN entries** link to tW articles: `rc://en/tw/dict/bible/kt/faith`
- **tN entries** link to tA topics: `rc://en/ta/man/translate/figs-metaphor`
- **tW articles** link to other tW articles: `rc://en/tw/dict/bible/kt/believe`
- **tA articles** link to tW definitions: `rc://en/tw/dict/bible/kt/covenant`

### Dynamic Organization Resolution

**NEW in v0.4.7**: RC links resolve using current organization context:

```javascript
// User in STR/Spanish context
"rc://en/tw/dict/bible/kt/create" → https://git.door43.org/STR/en_tw/.../create.md

// User in unfoldingWord/English context
"rc://en/tw/dict/bible/kt/create" → https://git.door43.org/unfoldingWord/en_tw/.../create.md
```

## 🧱 Data Flow Architecture

### Context Hierarchy

```
App
├── ReferenceContext (organization, languageId, reference)
└── MultiManifestsContext (loads manifests for current org/lang)
    └── MainView
        ├── ScripturePanel
        ├── TranslationNotesPanel
        ├── TranslationQuestionsPanel
        └── TranslationWordsPanel
```

### Manifest-Driven File Discovery

All services use manifest data to discover file paths:

```javascript
// Services use manifests to find correct files
const manifest = await fetchManifest(languageId, resourceId, organization);
const project = manifest.projects.find((p) => p.identifier === bookId);
const fileName = project.path.replace("./", "");
```

### Caching Strategy

- **Service-Level Caching**: Each service maintains its own cache
- **Organization-Aware Keys**: `${org}:${lang}:${resource}:${reference}`
- **Error Caching**: Failed requests cached to avoid retries
- **Cache Clearing**: Available for testing and refresh

## 📊 Supported Organizations

The app supports multiple DCS organizations:

- **unfoldingWord** (default)
- **STR** (Spanish resources)
- **WA** (Wycliffe Associates)
- **translationCore-Create-BCS** (Hindi and other languages)
- **door43-catalog** (Community resources)
- **Any other DCS organization**

## 🔄 Error Handling and Fallbacks

### Graceful Degradation

```javascript
// Primary attempt with selected organization/language
try {
  return await fetchFromRepository(org, lang);
} catch (error) {
  // Fallback to unfoldingWord/English if different org/lang requested
  if (org !== "unfoldingWord" || lang !== "en") {
    console.warn(`Falling back from ${org}/${lang} to unfoldingWord/en`);
    return await fetchFromRepository("unfoldingWord", "en");
  }
  throw error;
}
```

### User-Friendly Error Messages

- Clear messaging when resources aren't available
- Debug information for troubleshooting
- Graceful handling of network issues

## 🧪 Testing Strategy

### Unit Testing

Each service has comprehensive unit tests:

```javascript
// Example test patterns
describe("tnService with organization context", () => {
  it("should fetch from specified organization", async () => {
    const notes = await getNotesForVerse("gen", 1, 1, "STR", "es");
    expect(fetchManifest).toHaveBeenCalledWith("es", "tn", "STR");
  });
});
```

### Integration Testing

- **Cross-Organization**: Test unfoldingWord, STR, WA, etc.
- **Cross-Language**: Test English, Spanish, Portuguese, Hindi, etc.
- **RC Link Navigation**: Test links between resources work correctly
- **Fallback Behavior**: Test graceful degradation when resources missing

### Manual Testing Scenarios

1. **Organization Switching**: Change organization in dropdown, verify translation helps update
2. **Language Switching**: Change language, verify resources load in new language
3. **RC Link Clicking**: Click RC links in content, verify correct articles open
4. **Error Handling**: Test with non-existent org/language combinations

## 📈 Performance Optimizations

### Parallel Processing

```javascript
// TWL service fetches and processes in parallel
const [tsvContent, articles] = await Promise.all([fetchTwlData(), fetchArticlesForLinks()]);
```

### React Optimizations

```javascript
// Components use proper dependency arrays
useEffect(() => {
  loadResources();
}, [reference, manifests, organization, languageId]);
```

### Intelligent Caching

- Cache successful responses, 404s, and errors
- Organization/language-specific cache keys
- Configurable cache expiration

## 🔮 Future Enhancements

### Planned Features

1. **Offline Support**: Cache resources for offline access
2. **Smart Preloading**: Preload related resources based on user behavior
3. **Advanced Search**: Search across all translation helps
4. **Resource Discovery**: Auto-detect available resources per org/language
5. **Performance Metrics**: Track and optimize loading times

### Enhanced Integration

1. **Cross-Resource Search**: Find references across tN, tQ, tW, tA
2. **Resource Recommendations**: Suggest related articles based on current verse
3. **Bookmark System**: Save frequently accessed resources
4. **Export Functionality**: Export translation helps for offline study

## 📖 Migration from Legacy

### What Changed in v0.4.7

1. **Service-Based Architecture**: Replaced component-embedded logic
2. **Organization Context**: Added support for any DCS organization
3. **Dynamic Language**: Removed hardcoded English assumptions
4. **Improved Caching**: Better performance with structured caching
5. **Comprehensive Testing**: Full test coverage for all services

### Legacy Components Removed

- ❌ `src/components/Viewer/Workspace/Scripture/helpers.js`
- ❌ `src/components/Viewer/Workspace/Scripture/Resources.context.js`
- ❌ `src/components/Viewer/Workspace/TranslationHelps/*`

### New Components Added

- ✅ Service layer: `src-new/services/`
- ✅ React components: `src-new/components/`
- ✅ Context providers: `src-new/context/`
- ✅ Utility functions: `src-new/utils/`

## 📌 Summary

The translationHelps Viewer provides comprehensive integration of unfoldingWord resources with:

- **Multi-Organization Support**: Access resources from any DCS organization
- **Service-Based Architecture**: Clean separation between data and UI layers
- **Dynamic Context**: Organization and language-aware resource loading
- **RC Link Integration**: Seamless navigation between related resources
- **Performance Optimized**: Caching, parallel processing, and React optimizations
- **Robust Error Handling**: Graceful fallbacks and user-friendly messaging
- **Comprehensive Testing**: Unit and integration test coverage

All resources work together to provide translators with contextual helps while maintaining performance and reliability across different organizations and languages.
