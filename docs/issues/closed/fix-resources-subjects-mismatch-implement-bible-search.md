---
Resolved: true
ResolvedDate: 2025-06-04
ResolvedVersion: 0.4.2
---

# Fix Resources/Subjects Mismatch - Implement Bible Resource Search

## Issue Summary

The current UI/UX displays "Resources" in the dropdown, but technically these are "Subjects" from the DCS Catalog API. The current implementation fetches all available subjects for an organization/language combination, but what we actually need is a filtered list of Bible repositories that contain .usfm files that can be rendered in the Scripture panel.

## Current Problem

### Technical Issue

- **UI Label**: "Resources"
- **API Reality**: Using `/subjects` endpoint which returns subject categories
- **Data Returned**: Generic subjects like "Translation Academy", "Translation Notes", etc.
- **User Expectation**: Bible resources that can be used to read Scripture text

### Current Implementation

```javascript
// catalogService.js - fetchResources()
const url = `${BASE_CATALOG_URL}/subjects?owner=${encodeURIComponent(
  owner
)}&lang=${encodeURIComponent(languageCode)}`;
```

Returns subjects like:

```json
{
  "data": [
    "Aligned Bible",
    "Translation Academy",
    "Translation Notes",
    "Translation Questions",
    "Translation Words",
    "TSV Translation Notes",
    "TSV Translation Questions",
    "TSV Translation Words Links"
  ]
}
```

### The Real Problem

1. **Misleading UI**: Users think they're selecting a Bible resource
2. **Unusable Data**: Most subjects returned aren't Bible texts
3. **Missing Functionality**: No way to actually select a Bible repository to fetch .usfm files from
4. **Wrong API Endpoint**: Should use Search endpoint to find actual repositories

## Proposed Solution

### Use DCS Search API Instead of Subjects API

Replace the current subjects-based approach with a search-based approach that finds actual Bible repositories.

### New API Approach

```javascript
// New endpoint to implement
const searchUrl = `https://git.door43.org/api/v1/repos/search`;

// Parameters to filter for Bible resources
const searchParams = {
  q: "", // search query if needed
  owner: organizationName,
  lang: languageCode,
  subject: ["Bible", "Aligned Bible"], // Filter for Bible subjects only
  limit: 50,
};
```

### Expected Results

Instead of subject categories, return actual Bible repositories:

```json
{
  "data": [
    {
      "name": "en_ult",
      "full_name": "unfoldingWord/en_ult",
      "description": "unfoldingWord Literal Text",
      "subject": "Aligned Bible",
      "language": "en",
      "repo_url": "https://git.door43.org/unfoldingWord/en_ult"
    },
    {
      "name": "en_ust",
      "full_name": "unfoldingWord/en_ust",
      "description": "unfoldingWord Simplified Text",
      "subject": "Aligned Bible",
      "language": "en",
      "repo_url": "https://git.door43.org/unfoldingWord/en_ust"
    }
  ]
}
```

## Implementation Plan

### 1. Update catalogService.js

#### Create New Function

```javascript
/**
 * Fetches available Bible resources for a specific organization and language
 * @param {string} owner - The organization/owner name
 * @param {string|Object} language - The language ID or language object
 * @returns {Promise<Object[]>} Array of Bible repository objects
 */
export async function fetchBibleResources(owner, language) {
  if (!owner || !language) {
    return [];
  }

  const languageCode = typeof language === "string" ? language : language.code;
  if (!languageCode) {
    return [];
  }

  try {
    const searchParams = new URLSearchParams({
      owner: owner,
      lang: languageCode,
      subject: "Bible,Aligned Bible", // Filter for Bible subjects only
      limit: "50",
    });

    const url = `https://git.door43.org/api/v1/repos/search?${searchParams}`;
    const data = await fetchWithCache(url, `bible_resources_${owner}_${languageCode}`);

    if (data && data.data && Array.isArray(data.data)) {
      // Filter and format Bible resources
      return data.data
        .filter(
          (repo) =>
            repo && repo.name && (repo.subject === "Bible" || repo.subject === "Aligned Bible")
        )
        .map((repo) => ({
          id: repo.name,
          name: repo.name,
          fullName: repo.full_name,
          description: repo.description || repo.name,
          subject: repo.subject,
          repoUrl: repo.html_url || repo.repo_url,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
    }

    return [];
  } catch (error) {
    console.warn(`Failed to fetch Bible resources for ${owner}/${languageCode}:`, error);
    return [];
  }
}
```

#### Update/Replace fetchResources

Either replace `fetchResources` entirely or keep it for other use cases and create the new `fetchBibleResources` function.

### 2. Update useResources.js Hook

```javascript
// Import the new function
import { fetchBibleResources } from "../services/catalogService.js";

// Update hook to use Bible-specific search
export function useResources(organization, language) {
  // ... existing state ...

  useEffect(() => {
    const loadResources = async () => {
      if (!organization || !language) {
        setResources([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Use new Bible-specific search
        const data = await fetchBibleResources(organization, language);

        if (isMounted) {
          setResources(data);
        }
      } catch (err) {
        // ... error handling ...
      }
    };

    loadResources();
  }, [organization, language]);

  return { resources, loading, error };
}
```

### 3. Update ReferenceSelector.jsx

Update the resource dropdown to display more meaningful information:

```jsx
{
  /* Resource Dropdown - Updated to show Bible resources */
}
<label style={labelStyle}>
  <span style={labelTextStyle}>Bible Resource</span>
  <select
    value={resourceId || ""}
    onChange={handleResourceChange}
    data-testid='resource-selector'
    style={selectStyle}
    disabled={!organization || !languageId || resourcesLoading}
  >
    {!organization || !languageId ? (
      <option value=''>Select Language</option>
    ) : resourcesLoading ? (
      <option>Loading...</option>
    ) : (
      <>
        <option value=''>Select Bible Resource</option>
        {resources.map((resource) => (
          <option key={resource.id} value={resource.id}>
            {resource.name.toUpperCase()} - {resource.description}
          </option>
        ))}
      </>
    )}
  </select>
</label>;
```

### 4. Update ScripturePanel.jsx

Once a Bible resource is selected, the Scripture panel should be able to:

1. Use the selected repository URL to fetch .usfm files
2. Parse and render the content on the left side
3. Show the actual Bible text for the selected reference

## Testing Requirements

### Unit Tests

```javascript
// catalogService.test.js
describe("fetchBibleResources", () => {
  it("should fetch Bible resources using search API", async () => {
    const mockResponse = {
      data: [
        {
          name: "en_ult",
          full_name: "unfoldingWord/en_ult",
          subject: "Aligned Bible",
          description: "unfoldingWord Literal Text",
        },
      ],
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const resources = await fetchBibleResources("unfoldingWord", "en");

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/api/v1/repos/search"));
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("owner=unfoldingWord"));
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("lang=en"));
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("subject=Bible,Aligned Bible"));

    expect(resources).toHaveLength(1);
    expect(resources[0].name).toBe("en_ult");
  });

  it("should filter out non-Bible subjects", async () => {
    const mockResponse = {
      data: [
        { name: "en_ult", subject: "Aligned Bible" },
        { name: "en_tn", subject: "Translation Notes" }, // Should be filtered out
        { name: "en_bible", subject: "Bible" },
      ],
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const resources = await fetchBibleResources("unfoldingWord", "en");
    expect(resources).toHaveLength(2);
    expect(resources.map((r) => r.name)).toEqual(["en_bible", "en_ult"]);
  });
});
```

### Integration Tests

```javascript
// catalogService.integration.test.js
describe("Bible Resources Integration", () => {
  it("should fetch real Bible resources from DCS API", async () => {
    const resources = await fetchBibleResources("unfoldingWord", "en");

    expect(Array.isArray(resources)).toBe(true);
    if (resources.length > 0) {
      expect(resources[0]).toHaveProperty("name");
      expect(resources[0]).toHaveProperty("subject");
      expect(["Bible", "Aligned Bible"]).toContain(resources[0].subject);
    }
  });
});
```

## Acceptance Criteria

### ✅ Definition of Done

1. **API Integration**

   - [ ] Replace subjects endpoint with search endpoint
   - [ ] Filter results to Bible and Aligned Bible subjects only
   - [ ] Return repository objects with name, description, and URL

2. **UI Updates**

   - [ ] Update dropdown label from "Resource" to "Bible Resource"
   - [ ] Display meaningful resource names and descriptions
   - [ ] Show only Bible resources that contain .usfm files

3. **Functionality**

   - [ ] Selected Bible resource can be used to fetch .usfm content
   - [ ] Scripture panel can render content from selected repository
   - [ ] Proper error handling for failed searches

4. **Testing**

   - [ ] Unit tests for new fetchBibleResources function
   - [ ] Integration tests with real DCS API
   - [ ] UI tests for updated resource selection

5. **Documentation**
   - [ ] Update API documentation with search endpoint usage
   - [ ] Update component documentation for resource selection
   - [ ] Add examples of Bible resource objects

## Future Considerations

### Potential Enhancements

1. **Resource Metadata**: Display additional info like language direction, version info
2. **Resource Previews**: Show sample verses to help users identify resources
3. **Favorites**: Allow users to bookmark frequently used Bible resources
4. **Advanced Filtering**: Filter by translation type (literal, dynamic, etc.)

### Technical Debt

1. **Terminology Cleanup**: Standardize on "Bible Resources" vs "Resources" throughout codebase
2. **API Abstraction**: Create dedicated Bible resource service separate from general catalog service
3. **Caching Strategy**: Implement smarter caching for Bible resource searches

## Dependencies

- DCS Search API availability and stability
- Proper authentication/rate limiting for search endpoint
- Understanding of search API response format
- Integration with existing Scripture rendering pipeline

## Related Issues

- [Implement Dynamic DCS Catalog API Endpoints](./implement-dynamic-dcs-catalog-api-endpoints.md)
- [Fix DCS Catalog Language Display and Coverage](./fix-dcs-catalog-language-display-and-coverage.md)

## Priority

**High** - This directly impacts the core functionality of Scripture selection and rendering.
