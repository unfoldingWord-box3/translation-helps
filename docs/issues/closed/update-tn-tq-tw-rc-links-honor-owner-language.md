---
Resolved: true
Priority: High
Version: 0.4.7
Date: 2025-06-04
---

# Update tN, tQ, tW, and RC Links to Honor Owner and Language Repository Context

## Issue Summary

The Translation Notes (tN), Translation Questions (tQ), Translation Words (tW) services, and all rc:// links are currently hardcoded to use "unfoldingWord" organization and "en" (English) language. This prevents users from accessing these resources in their selected organization and language combination, similar to how Scripture resources were handled before the recent fix.

## Current Problem

### Hardcoded Values in Services

**Translation Notes Service (`tnService.js`)**:

```javascript
const RESOURCE_ID = "tn";
const LANGUAGE_ID = "en"; // ❌ Hardcoded to English
```

**Translation Questions Service (`tqService.js`)**:

```javascript
const RESOURCE_ID = "tq";
const LANGUAGE_ID = "en"; // ❌ Hardcoded to English
```

**Translation Words Service (`twService.js`)**:

```javascript
// In rcUriToUrl function:
const baseUrl = `https://git.door43.org/unfoldingWord/${language}_${resource}/raw/branch/master`;
// ❌ Hardcoded to "unfoldingWord" organization
```

**DCS Client (`dcsClient.js`)**:

```javascript
export async function fetchManifest(languageId, resourceId, organization = "unfoldingWord") {
export async function fetchResourceFile(languageId, resourceId, filePath, organization = "unfoldingWord") {
// ❌ Defaults to "unfoldingWord" organization
```

**RC Link Utils (`rcLinkUtils.jsx`)**:

```javascript
// In convertRcUriToUrl function:
const baseUrl = "https://git.door43.org";
const repoPath = `${language}_${resource}`;
return `${baseUrl}/unfoldingWord/${repoPath}/src/branch/master/${path}`;
// ❌ Hardcoded to "unfoldingWord" organization
```

### Impact on User Experience

1. **Limited Organization Access**: Users can only access tN/tQ/tW from unfoldingWord, not from other organizations like STR, WA, door43-catalog, etc.
2. **Language Restriction**: All translation helps are locked to English, regardless of user's language selection
3. **Broken RC Links**: rc:// links in content always point to unfoldingWord/English resources, even when viewing content from other organizations/languages
4. **Inconsistent Behavior**: Scripture respects user selections but translation helps don't

## Proposed Solution

### 1. Update Service Functions to Accept Dynamic Parameters

#### Update `tnService.js`

```javascript
/**
 * Retrieves tN entries for a given verse reference.
 * @param {string} bookId Bible book identifier (e.g., 'gen')
 * @param {string|number} chapter Chapter number
 * @param {string|number} verse Verse number
 * @param {string} [organization="unfoldingWord"] Organization name
 * @param {string} [languageId="en"] Language code
 * @returns {Promise<Array<Object>>} Array of parsed tN entries
 */
export async function getNotesForVerse(
  bookId,
  chapter,
  verse,
  organization = "unfoldingWord",
  languageId = "en"
) {
  try {
    // Get the manifest to find the correct TSV file path
    const manifest = await fetchManifest(languageId, RESOURCE_ID, organization);

    // ... rest of function using dynamic organization and languageId
  } catch (error) {
    console.error(
      `Error fetching translation notes for ${organization}/${languageId}_tn ${bookId} ${chapter}:${verse}:`,
      error
    );
    throw error;
  }
}

/**
 * Retrieves all tN entries for a given book.
 * @param {string} bookId Bible book identifier (e.g., 'gen')
 * @param {string} [organization="unfoldingWord"] Organization name
 * @param {string} [languageId="en"] Language code
 * @returns {Promise<Array<Object>>} Array of all parsed tN entries for the book
 */
export async function getNotesForBook(bookId, organization = "unfoldingWord", languageId = "en") {
  // ... implementation using dynamic parameters
}
```

#### Update `tqService.js`

```javascript
/**
 * Retrieves tQ entries for a given verse reference.
 * @param {string} bookId
 * @param {string|number} chapter
 * @param {string|number} verse
 * @param {string} [organization="unfoldingWord"] Organization name
 * @param {string} [languageId="en"] Language code
 * @param {string} [customFilePath] - Optional custom file path from manifest
 * @returns {Promise<Array<Object>>}
 */
export async function getQuestionsForVerse(
  bookId,
  chapter,
  verse,
  organization = "unfoldingWord",
  languageId = "en",
  customFilePath = null
) {
  try {
    console.log(`Loading tQ for ${organization}/${languageId}_tq ${bookId} ${chapter}:${verse}`);

    // Use custom file path if provided, otherwise default to bookId.tsv
    const fileName = customFilePath || `${bookId}.tsv`;
    const text = await fetchResourceFile(languageId, RESOURCE_ID, fileName, organization);

    // ... rest of function
  } catch (error) {
    console.error(
      `Error loading tQ for ${organization}/${languageId}_tq ${bookId} ${chapter}:${verse}:`,
      error
    );
    throw new Error(`Failed to load translation questions: ${error.message}`);
  }
}
```

#### Update `twService.js`

```javascript
/**
 * Converts rc:// URI to DCS raw file URL
 * @param {string} rcUri - RC URI like "rc://en/tw/dict/bible/kt/create"
 * @param {string} [contextLanguage="en"] - Current language context for wildcard resolution
 * @param {string} [contextOrganization="unfoldingWord"] - Current organization context
 * @returns {string} DCS raw file URL
 */
function rcUriToUrl(rcUri, contextLanguage = "en", contextOrganization = "unfoldingWord") {
  const { language, resource, path } = parseRcUri(rcUri, contextLanguage);
  const baseUrl = `https://git.door43.org/${contextOrganization}/${language}_${resource}/raw/branch/master`;

  // For tW URIs, skip the "dict" part in the path
  const pathParts = path.split("/");
  let finalPath = path;

  if (resource === "tw" && pathParts[0] === "dict") {
    finalPath = pathParts.slice(1).join("/");
  }

  return `${baseUrl}/${finalPath}.md`;
}

/**
 * Fetches a single tW article from an rc:// URI
 * @param {string} rcUri - RC URI pointing to a tW article
 * @param {string} [contextLanguage="en"] - Current language context for wildcard resolution
 * @param {string} [contextOrganization="unfoldingWord"] - Current organization context
 * @returns {Promise<object>} Article object with title, content, and metadata
 */
export async function getArticle(
  rcUri,
  contextLanguage = "en",
  contextOrganization = "unfoldingWord"
) {
  // ... use contextOrganization in rcUriToUrl call
  url = rcUriToUrl(rcUri, contextLanguage, contextOrganization);
  // ... rest of function
}
```

### 2. Update RC Link Utils to Support Dynamic Organization

```javascript
/**
 * Converts an rc:// URI to a browsable URL (for external access if needed)
 * @param {string} rcUri - The rc:// URI to convert
 * @param {string} defaultLanguage - Default language code to use if URI has wildcard
 * @param {string} defaultOrganization - Default organization to use
 * @returns {string|null} - The converted URL or null if conversion fails
 */
export function convertRcUriToUrl(
  rcUri,
  defaultLanguage = "en",
  defaultOrganization = "unfoldingWord"
) {
  if (!rcUri || !rcUri.startsWith("rc://")) {
    return null;
  }

  try {
    // Parse the rc:// URI
    const parts = rcUri.split("/");
    if (parts.length < 4) {
      return null;
    }

    let language = parts[2];
    const resource = parts[3];
    const version = parts[4] || "latest";
    const path = parts.slice(5).join("/");

    // Handle wildcard language
    if (language === "*") {
      language = defaultLanguage;
    }

    // Construct DCS URL using dynamic organization
    const baseUrl = "https://git.door43.org";
    const repoPath = `${language}_${resource}`;

    if (path) {
      return `${baseUrl}/${defaultOrganization}/${repoPath}/src/branch/master/${path}`;
    } else {
      return `${baseUrl}/${defaultOrganization}/${repoPath}`;
    }
  } catch (error) {
    console.error("Error converting rc:// URI to URL:", error);
    return null;
  }
}
```

### 3. Update Component Integration

#### Update Translation Panels to Pass Context

**TranslationNotesPanel.jsx**:

```javascript
// Get organization and language from context
const { organization, language } = useAppState();

// Pass to service calls
const notes = await getNotesForVerse(bookId, chapter, verse, organization, language?.code);
```

**TranslationQuestionsPanel.jsx**:

```javascript
// Get organization and language from context
const { organization, language } = useAppState();

// Pass to service calls
const questions = await getQuestionsForVerse(bookId, chapter, verse, organization, language?.code);
```

**TranslationWordsPanel.jsx**:

```javascript
// Get organization and language from context
const { organization, language } = useAppState();

// Pass to service calls and RC link processing
const article = await getArticle(rcUri, language?.code, organization);
const processedContent = processRcLinks(content, (rcUri) => {
  // Handle RC link clicks with current context
  handleRcLinkClick(rcUri, language?.code, organization);
});
```

### 4. Update RC Link Processing Throughout App

Wherever `processRcLinks` is called, pass the current organization and language context:

```javascript
// In any component that processes RC links
const { organization, language } = useAppState();

const processedContent = processRcLinks(content, (rcUri) => {
  handleRcLinkClick(rcUri, language?.code, organization);
});
```

## Implementation Plan

### Phase 1: Update Service Layer

1. ✅ Update `tnService.js` to accept organization and language parameters
2. ✅ Update `tqService.js` to accept organization and language parameters
3. ✅ Update `twService.js` to accept organization context for RC URIs
4. ✅ Update `dcsClient.js` to make organization parameter required (remove default)

### Phase 2: Update RC Link Handling

1. ✅ Update `rcLinkUtils.jsx` to accept organization context
2. ✅ Update all RC link processing to pass current context
3. ✅ Update RC link click handlers to use dynamic context

### Phase 3: Update Component Integration

1. ✅ Update `TranslationNotesPanel.jsx` to pass context to service
2. ✅ Update `TranslationQuestionsPanel.jsx` to pass context to service
3. ✅ Update `TranslationWordsPanel.jsx` to pass context to service
4. ✅ Update any other components that use these services

### Phase 4: Testing and Validation

1. ✅ Test with different organizations (unfoldingWord, STR, WA, door43-catalog)
2. ✅ Test with different languages
3. ✅ Test RC link navigation between resources
4. ✅ Test fallback behavior when resources don't exist

## Testing Requirements

### Unit Tests

```javascript
// tnService.test.js
describe("getNotesForVerse with dynamic context", () => {
  it("should fetch notes from specified organization and language", async () => {
    const notes = await getNotesForVerse("gen", "1", "1", "STR", "es");
    expect(fetchManifest).toHaveBeenCalledWith("es", "tn", "STR");
  });

  it("should default to unfoldingWord/en when no context provided", async () => {
    const notes = await getNotesForVerse("gen", "1", "1");
    expect(fetchManifest).toHaveBeenCalledWith("en", "tn", "unfoldingWord");
  });
});

// twService.test.js
describe("getArticle with dynamic context", () => {
  it("should resolve RC URIs using provided organization context", async () => {
    const article = await getArticle("rc://en/tw/dict/bible/kt/create", "en", "STR");
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("git.door43.org/STR/en_tw/raw/branch/master")
    );
  });
});

// rcLinkUtils.test.js
describe("convertRcUriToUrl with dynamic context", () => {
  it("should convert RC URI using specified organization", () => {
    const url = convertRcUriToUrl("rc://es/tw/dict/bible/kt/create", "es", "WA");
    expect(url).toContain("git.door43.org/WA/es_tw");
  });
});
```

### Integration Tests

```javascript
// Test with real organizations
describe("Translation Helps Integration", () => {
  it("should load tN from STR Spanish repository", async () => {
    const notes = await getNotesForVerse("gen", "1", "1", "STR", "es");
    expect(Array.isArray(notes)).toBe(true);
  });

  it("should load tQ from WA Portuguese repository", async () => {
    const questions = await getQuestionsForVerse("gen", "1", "1", "WA", "pt");
    expect(Array.isArray(questions)).toBe(true);
  });

  it("should resolve RC links to correct organization/language", async () => {
    const article = await getArticle("rc://*/tw/dict/bible/kt/create", "fr", "door43-catalog");
    expect(article.url).toContain("door43-catalog/fr_tw");
  });
});
```

## Acceptance Criteria

### ✅ Definition of Done

1. **Service Layer Updates**

   - [ ] `tnService.js` accepts and uses organization and language parameters
   - [ ] `tqService.js` accepts and uses organization and language parameters
   - [ ] `twService.js` accepts and uses organization context for RC URI resolution
   - [ ] `dcsClient.js` properly handles dynamic organization parameter

2. **RC Link Functionality**

   - [ ] `rcLinkUtils.jsx` accepts and uses organization context
   - [ ] RC links resolve to correct organization/language repositories
   - [ ] RC link clicks navigate within current organization/language context
   - [ ] Wildcard RC URIs (rc://\*/...) resolve using current language

3. **Component Integration**

   - [ ] Translation panels pass current organization and language to services
   - [ ] RC link processing uses current organization and language context
   - [ ] User selections in dropdowns affect all translation helps resources

4. **Backward Compatibility**

   - [ ] Services still work with default parameters when context not provided
   - [ ] Existing functionality preserved for unfoldingWord/English combinations
   - [ ] Graceful fallback when resources don't exist in selected organization/language

5. **Testing**
   - [ ] Unit tests cover dynamic parameter functionality
   - [ ] Integration tests verify multi-organization/language support
   - [ ] Manual testing with various organization/language combinations

## Error Handling

### Graceful Degradation

When a resource doesn't exist in the selected organization/language:

1. **Primary Attempt**: Try to fetch from selected organization/language
2. **Fallback Attempt**: Try to fetch from unfoldingWord/English if primary fails
3. **User Notification**: Show clear message about resource availability
4. **Cache Failed Attempts**: Don't repeatedly attempt to fetch non-existent resources

```javascript
export async function getNotesForVerse(
  bookId,
  chapter,
  verse,
  organization = "unfoldingWord",
  languageId = "en"
) {
  try {
    // Primary attempt with selected organization/language
    return await fetchNotesFromRepository(bookId, chapter, verse, organization, languageId);
  } catch (error) {
    // Fallback to unfoldingWord/English if different org/lang was requested
    if (organization !== "unfoldingWord" || languageId !== "en") {
      console.warn(
        `Failed to load tN from ${organization}/${languageId}, falling back to unfoldingWord/en`
      );
      try {
        return await fetchNotesFromRepository(bookId, chapter, verse, "unfoldingWord", "en");
      } catch (fallbackError) {
        console.error("Failed to load tN from fallback repository:", fallbackError);
      }
    }

    throw new Error(`Translation notes not available for ${bookId} ${chapter}:${verse}`);
  }
}
```

## Future Considerations

### Enhanced Context Management

1. **Context Provider**: Create a dedicated translation helps context provider
2. **Resource Discovery**: Automatically detect available translation helps for each organization/language
3. **Mixed Context**: Allow different resources to come from different organizations (e.g., Scripture from STR, tN from unfoldingWord)
4. **Resource Metadata**: Show users which organization/language combination provides each resource

### Performance Optimizations

1. **Intelligent Caching**: Cache by organization/language combination
2. **Prefetching**: Preload common translation helps when user selects organization/language
3. **Resource Availability Check**: Quick check for resource existence before attempting full fetch

## Dependencies

- Current app state management for organization and language selection
- DCS API stability across different organizations
- Manifest format consistency across organizations
- RC URI format standardization

## Related Issues

- [Fix Resources/Subjects Mismatch - Implement Bible Resource Search](./fix-resources-subjects-mismatch-implement-bible-search.md) - Similar fix applied to Scripture resources
- [Implement Dynamic DCS Catalog API Endpoints](../closed/implement-dynamic-dcs-catalog-api-endpoints.md) - Related to dynamic organization/language handling

## Priority

**High** - This directly impacts the core functionality of translation helps and user experience consistency across the application. Users expect translation helps to match their selected organization and language context, just like Scripture resources do.
