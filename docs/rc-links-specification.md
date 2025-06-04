# RC Links Specification and Implementation

## Overview

RC (Resource Container) Links are URIs that reference unfoldingWord translation resources. They provide a standardized way to link between different translation resources like Scripture, Translation Notes, Translation Words, Translation Academy, and Translation Questions.

## URI Structure

```
rc://<language>/<resource>/<version>/<path>
```

### Components

- **language**: Language code (ISO 639-1, e.g., `en`, `es`, `fr`) or `*` for current context language
- **resource**: Resource identifier (`ult`, `tn`, `tw`, `ta`, `tq`, `twl`)
- **version**: Version identifier (often `master`, `latest`, or specific version)
- **path**: Resource-specific path to content

## Supported Namespaces

### 1. Scripture (ULT)

```
rc://en/ult/book/chapter/verse
rc://en/ult/gen/01/01          # Genesis 1:1
rc://*/ult/mat/05/03-12        # Beatitudes (dynamic language)
```

### 2. Translation Notes (TN)

```
rc://en/tn/help/book/chapter/verse
rc://en/tn/help/gen/01/01      # Notes for Genesis 1:1
rc://*/tn/help/mat/05/03       # Notes with dynamic language
```

### 3. Translation Words (TW)

```
rc://en/tw/dict/bible/kt/word
rc://en/tw/dict/bible/kt/create    # "create" key term
rc://en/tw/dict/bible/names/paul   # Person name
rc://en/tw/dict/bible/other/tax    # Other term
rc://*/tw/dict/bible/kt/faith      # Dynamic language
```

### 4. Translation Academy (TA)

```
rc://en/ta/man/category/article
rc://en/ta/man/translate/translate-names    # How to translate names
rc://en/ta/man/checking/level-one          # Quality checking
rc://*/ta/man/translate/figs-metaphor      # Dynamic language
```

### 5. Translation Questions (TQ)

```
rc://en/tq/book/chapter
rc://en/tq/gen/01              # Questions for Genesis 1
rc://*/tq/mat/05               # Dynamic language
```

### 6. Translation Word List (TWL)

```
rc://en/twl/book
rc://en/twl/gen                # TWL for Genesis
rc://*/twl/mat                 # Dynamic language
```

## Dynamic Language Resolution

### Wildcard Language (`*`)

When `*` is used as the language code, it should be resolved to the current language context:

```javascript
// Examples of wildcard resolution
"rc://*/tw/dict/bible/kt/create" → "rc://en/tw/dict/bible/kt/create" (if context is English)
"rc://*/tw/dict/bible/kt/create" → "rc://es/tw/dict/bible/kt/create" (if context is Spanish)
"rc://*/ta/man/translate/figs-metaphor" → "rc://fr/ta/man/translate/figs-metaphor" (if context is French)
```

### Language Context Sources

1. **MultiManifestsContext**: Primary language from `languageId` prop
2. **User Settings**: Stored user language preference
3. **Browser Language**: Navigator language as fallback
4. **Default**: `"en"` as final fallback

## Implementation Architecture

### Services Layer

#### Translation Academy Service (`taService.js`)

```javascript
// Fetches TA articles using three-file structure
await getArticle("rc://en/ta/man/translate/translate-names", contextLanguage);

// File structure fetched:
// - title.md
// - sub-title.md
// - 01.md
```

#### Translation Words Service (`twService.js`)

```javascript
// Fetches tW articles
await getArticle("rc://en/tw/dict/bible/kt/create", contextLanguage);
```

### RC Link Processing

#### rcLinkUtils.jsx

```javascript
// Convert text with RC links to clickable components
processRcLinks(content, onRcLinkClick, contextLanguage);

// Create clickable RC link
<RcLink rcUri='rc://*/tw/dict/bible/kt/create' onClick={handler}>
  create
</RcLink>;
```

### Integration Points

#### MainView Integration

```javascript
// Pass language context from MultiManifestsContext
const { languageId } = useContext(ManifestsContext);

// Handle RC link clicks with language context
const handleRcLinkClick = async (rcUri) => {
  if (rcUri.includes("/ta/")) {
    const article = await getTaArticle(rcUri, languageId);
    // Open article tab...
  }
  // Handle other resource types...
};
```

## Error Handling

### Missing Articles

```javascript
{
  rcUri: "rc://en/ta/man/translate/missing-article",
  title: "Translation Academy Article Not Found",
  content: "The requested article could not be found...",
  error: "not_found"
}
```

### Network Errors

```javascript
{
  rcUri: "rc://en/tw/dict/bible/kt/create",
  title: "Error Loading Article",
  content: "Failed to load article: Network error",
  error: "network_error"
}
```

### Invalid URIs

```javascript
{
  error: "Invalid rc:// URI format: rc://invalid",
  title: "Error Loading Article"
}
```

## Caching Strategy

### Per-Service Caching

- Each service maintains its own cache
- Cache keys use the original RC URI (before language resolution)
- Cache successful responses, 404s, and errors
- Configurable cache expiration

### Cache Management

```javascript
// Clear cache for testing/refresh
twService.clearCache();
taService.clearCache();

// Get cache statistics
const stats = twService.getCacheStats();
// { totalEntries: 15, successfulEntries: 12, errorEntries: 3 }
```

## URL Mapping

### DCS Repository Structure

**NEW in v0.4.7**: Organization context support for RC links

```
https://git.door43.org/{organization}/{language}_{resource}/raw/branch/master/
```

Where `{organization}` is determined by current user context:

- unfoldingWord (default)
- STR
- WA
- translationCore-Create-BCS
- door43-catalog
- Or any other DCS organization

#### Translation Academy

```
rc://en/ta/man/translate/translate-names
→ https://git.door43.org/unfoldingWord/en_ta/raw/branch/master/translate/translate-names/
  ├── title.md
  ├── sub-title.md
  └── 01.md
```

#### Translation Words

```
rc://en/tw/dict/bible/kt/create
→ https://git.door43.org/unfoldingWord/en_tw/raw/branch/master/bible/kt/create.md
```

## Testing Considerations

### Language Context Testing

```javascript
// Test wildcard resolution
await getArticle("rc://*/ta/man/translate/test", "es");
// Should fetch from Spanish repository

// Test fallback behavior
await getArticle("rc://nonexistent/ta/man/test", "en");
// Should gracefully handle missing language
```

### Cross-Resource Testing

```javascript
// Test RC links within articles
const article = await getArticle("rc://en/ta/man/translate/figs-metaphor");
// Article content may contain RC links to TW articles
// These should be processed and made clickable
```

## Performance Optimization

### Parallel Fetching

```javascript
// TA articles fetch three files in parallel
const [title, subtitle, content] = await Promise.all([
  fetchFileContent(urls.title),
  fetchFileContent(urls.subtitle),
  fetchFileContent(urls.content),
]);
```

### Deduplication

```javascript
// Automatic deduplication of identical RC URIs
await getArticlesForLinks([
  "rc://en/tw/dict/bible/kt/create",
  "rc://en/tw/dict/bible/kt/create", // duplicate
  "rc://en/tw/dict/bible/kt/faith",
]);
// Only fetches 2 unique articles
```

## Best Practices

### Language Context Propagation

1. Always pass language context from the top-level component
2. Use MultiManifestsContext as the source of truth for language
3. Fallback gracefully when language context is unavailable

### Error Handling

1. Cache failed requests to avoid repeated network calls
2. Provide meaningful error messages to users
3. Log errors for debugging while failing gracefully

### Performance

1. Use parallel fetching where possible
2. Implement intelligent caching strategies
3. Deduplicate requests automatically

### User Experience

1. Make RC links visually distinct and clickable
2. Provide loading states for network requests
3. Handle offline scenarios gracefully

## Future Enhancements

### Planned Features

1. **Offline Support**: Cache articles for offline access
2. **Smart Preloading**: Preload linked articles based on user behavior
3. **Cross-Reference Discovery**: Automatically discover related articles
4. **Advanced Caching**: Implement cache invalidation strategies
5. **Performance Metrics**: Track and optimize loading times

### Language Support Expansion

1. **RTL Languages**: Support right-to-left text direction
2. **Complex Scripts**: Handle scripts with complex rendering
3. **Localization**: Localize error messages and UI text
4. **Font Loading**: Ensure proper font support for all languages

## Troubleshooting

### Common Issues

#### Wildcard Not Resolving

- Check that language context is properly passed down
- Verify MultiManifestsContext is providing languageId
- Ensure fallback to "en" is working

#### Articles Not Loading

- Verify network connectivity
- Check repository exists on DCS
- Validate RC URI format
- Check console for network errors

#### Caching Issues

- Clear cache manually if needed
- Check cache statistics for debugging
- Verify cache keys are consistent

### Debugging Tools

```javascript
// Enable debug logging
console.log(twService.getCacheStats());
console.log(taService.getCacheStats());

// Manual cache inspection
console.log(Object.keys(twService.cache));

// Test RC URI parsing
console.log(parseRcUri("rc://*/tw/dict/bible/kt/create", "es"));
```

This specification provides a comprehensive foundation for implementing and maintaining RC links across all unfoldingWord translation resources with proper language context handling.
