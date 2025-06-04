<!--
status: closed
Resolved: true
priority: medium
created: 2025-05-31
tags: [feature, ui, navigation, rc-links, url-sync, dropdowns]
changelog_category: added
semver_impact: minor
changelog_description: "Add hierarchical navigation dropdowns with URL synchronization"
-->

# Implement RC Link Style Hierarchical Navigation Dropdowns

## Issue Description

The original app in `/src` had a sophisticated URL synchronization system that kept the browser address bar in sync with the app's context. The new app needs to enhance the existing dropdown system to function as hierarchical navigation with proper URL synchronization. This will extend the current `ReferenceSelector` with additional dropdowns for Organization → Language → Resource selection, creating a complete navigation hierarchy.

## Background

The old app used RC (Resource Container) links with a URL structure like:

```
?owner=door43-catalog&rc=/en/tn/gen/1/1
```

Where:

- `owner`: Organization (e.g., "door43-catalog")
- `rc`: Resource Container path with format `/{languageId}/{resourceId}/{bookId}/{chapter}/{verse}`

The new app has the URL handling infrastructure in place (`src-new/utils/contextHelpers.js`) and basic book/chapter/verse dropdowns, but lacks the higher-level organization, language, and resource selection dropdowns that would complete the navigation hierarchy.

## Detailed Requirements

### Visual Design

- Enhance the existing dropdown system with additional hierarchical dropdowns
- Display dropdown sequence: Organization → Language → Resource → Book → Chapter → Verse
- Use consistent styling to match the existing `ReferenceSelector` component
- Maintain the current inline layout approach with proper spacing
- Show appropriate loading states and placeholder text for dependent dropdowns

### Functional Requirements

- Each dropdown should cascade properly (selecting organization loads languages, selecting language loads resources, etc.)
- Changing a higher-level dropdown should reset lower levels appropriately
- Missing or loading states should show appropriate placeholder text
- Support the same URL format as the original app for backward compatibility
- Populate organization dropdown from DCS catalog API
- Language dropdown should show available languages for the selected organization
- Resource dropdown should show Bible resources (ult, ust, etc.) for the selected language

### Integration Points

- Extend existing `ReferenceContext` to include organization, language, and resource state
- Use existing `contextHelpers.js` utilities for URL synchronization
- Enhance the current `ReferenceSelector` component with additional dropdowns
- Integrate with DCS catalog API for fetching available organizations and resources
- Ensure compatibility with existing routing and state management

## Files Affected

### New Files to Create

- `src-new/services/catalogService.js` - Service for DCS catalog API integration
- `src-new/services/catalogService.test.js` - Service tests
- `src-new/hooks/useOrganizations.js` - Hook for organization data from catalog API
- `src-new/hooks/useLanguages.js` - Hook for language data by organization
- `src-new/hooks/useResources.js` - Hook for resource data by organization/language

### Files to Modify

- `src-new/components/ReferenceSelector.jsx` - Add organization, language, and resource dropdowns
- `src-new/components/ReferenceSelector.test.jsx` - Update tests for new dropdowns
- `src-new/context/ReferenceContext.jsx` - Extend to include organization, language, resource state
- `src-new/utils/contextHelpers.js` - Ensure proper URL sync for all dropdown levels
- `src-new/services/dcsClient.js` - Add catalog API methods alongside existing repository access

## Acceptance Criteria

- [ ] **Enhanced ReferenceSelector**: Extended with organization, language, and resource dropdowns
- [ ] **Hierarchical Dropdowns**: Shows Organization → Language → Resource → Book → Chapter → Verse sequence
- [ ] **Cascading Selection**: Each dropdown properly filters and resets dependent dropdowns
- [ ] **URL Synchronization**: Browser URL updates when navigating via dropdowns
- [ ] **Context Integration**: Works seamlessly with existing `ReferenceContext`
- [ ] **Placeholder Handling**: Shows appropriate placeholders for unset levels
- [ ] **State Reset Logic**: Changing higher levels appropriately resets lower levels
- [ ] **Responsive Design**: Works on both desktop and mobile devices
- [ ] **Backward Compatibility**: Supports same URL format as original app
- [ ] **Test Coverage**: Comprehensive unit tests for all functionality
- [ ] **Integration Testing**: E2E tests verify URL sync and navigation behavior
- [ ] **Loading States**: Proper loading indicators while fetching dropdown data
- [ ] **Error Handling**: Graceful error handling for failed API requests
- [ ] **Catalog API Integration**: Uses DCS catalog API for dynamic organization/language/resource discovery

## Technical Considerations

### Component Structure

```jsx
<ReferenceSelector>
  <OrganizationDropdown value={organization} onChange={handleOrganizationChange} />
  <LanguageDropdown
    organization={organization}
    value={languageId}
    onChange={handleLanguageChange}
  />
  <ResourceDropdown
    organization={organization}
    language={languageId}
    value={resourceId}
    onChange={handleResourceChange}
  />
  <BookDropdown value={bookId} onChange={handleBookChange} />
  <ChapterDropdown book={bookId} value={chapter} onChange={handleChapterChange} />
  <VerseDropdown book={bookId} chapter={chapter} value={verse} onChange={handleVerseChange} />
</ReferenceSelector>
```

### State Management

- Extend existing `ReferenceContext` to include organization, languageId, and resourceId
- Utilize `updateQueryFromContext` from `contextHelpers.js` for URL updates
- Handle partial context states gracefully with loading states
- Implement proper cascading reset logic (organization change resets language, resource, book, chapter, verse)

### Dropdown Cascade Logic

- Selecting organization: reset language, resource, book, chapter, verse; load available languages
- Selecting language: reset resource, book, chapter, verse; load available resources
- Selecting resource: reset book, chapter, verse; maintain current book if available
- Selecting book: reset chapter, verse to '1'; load available chapters
- Selecting chapter: reset verse to '1'; load available verses

### Data Flow

1. **Organization Dropdown**: Fetches from DCS catalog API, shows available organizations
2. **Language Dropdown**: Filters available languages based on selected organization
3. **Resource Dropdown**: Filters available Bible resources (ult, ust, tn, tw, etc.) based on organization/language
4. **Book/Chapter/Verse**: Existing functionality, enhanced with proper reset logic

## Test Commands

```bash
# Unit tests
npm test src-new/components/ReferenceSelector.test.jsx
npm test src-new/services/catalogService.test.js
npm test src-new/hooks/useOrganizations.test.js

# Integration tests
npm run test:e2e -- --grep "hierarchical navigation"

# Context tests
npm test src-new/context/ReferenceContext.test.js
```

## Implementation Notes

### Phase 1: Catalog API Integration

1. Create catalogService.js with DCS catalog API integration
2. Add organization dropdown using catalog API data
3. Create hooks for organizations, languages, and resources
4. Add organization dropdown to ReferenceSelector

### Phase 2: Language & Resource Dropdowns

1. Add language dropdown with proper cascading from organization selection
2. Add resource dropdown with filtering based on organization/language
3. Extend `contextHelpers.js` to handle all dropdown levels
4. Implement proper state reset and URL synchronization

### Phase 3: Integration & Testing

1. Integrate with existing DCS client for repository access
2. Add loading states and error handling for all dropdowns
3. Implement full test coverage including E2E tests
4. Add accessibility features (ARIA labels, keyboard navigation)

### Accessibility Requirements

- Proper ARIA labels for screen readers
- Keyboard navigation support
- High contrast mode compatibility
- Focus management for navigation
- Loading state announcements

### DCS Catalog API Integration

DCS provides a catalog API for discovering organizations and resources:

**Available API Endpoints:**

- **Organizations/Owners**: `https://git.door43.org/api/v1/catalog/list/owners`
- **Languages by Organization**: `https://git.door43.org/api/v1/catalog/list/languages/{owner}`
- **Resources by Organization/Language**: `https://git.door43.org/api/v1/catalog/list/subjects/{owner}/{language}`

**Implementation Strategy:**

1. **Organization Dropdown**:

   - Fetch dynamic list from DCS catalog API
   - Use `GET https://git.door43.org/api/v1/catalog/list/owners`
   - Cache results for performance

2. **Language Discovery**:

   - Based on selected organization, fetch available languages
   - Use `GET https://git.door43.org/api/v1/catalog/list/languages/{owner}`
   - Filter and display available language options

3. **Resource Discovery**:
   - Based on organization and language, fetch available resources
   - Use `GET https://git.door43.org/api/v1/catalog/list/subjects/{owner}/{language}`
   - Filter for Bible translation resources (ult, ust, tn, tq, tw, twl, ta)

**Example API Usage:**

```javascript
// Fetch available organizations
const fetchOrganizations = async () => {
  const response = await fetch("https://git.door43.org/api/v1/catalog/list/owners");
  return response.json();
};

// Fetch languages for specific organization
const fetchLanguages = async (owner) => {
  const response = await fetch(`https://git.door43.org/api/v1/catalog/list/languages/${owner}`);
  return response.json();
};

// Fetch resources for organization/language combination
const fetchResources = async (owner, language) => {
  const response = await fetch(
    `https://git.door43.org/api/v1/catalog/list/subjects/${owner}/${language}`
  );
  return response.json();
};
```

**Error Handling and Caching:**

```javascript
// Service implementation with caching and error handling
class CatalogService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 300000; // 5 minutes
  }

  async fetchWithCache(url, cacheKey) {
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }
      const data = await response.json();

      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });

      return data;
    } catch (error) {
      console.error(`Failed to fetch from ${url}:`, error);
      // Return cached data if available, even if expired
      return cached ? cached.data : [];
    }
  }
}
```

## Related Issues

- Links to any existing navigation or URL handling issues
- Consider impact on mobile navigation patterns
- Ensure compatibility with future routing enhancements

## Additional Context

This feature restores the complete hierarchical navigation from the original app that users found valuable for understanding their current location and quickly navigating through the organization/language/resource hierarchy. The enhanced dropdown system should feel familiar to users of the original app while taking advantage of the improved architecture in the new app.

The implementation should be flexible enough to support future enhancements like:

- Custom organization selection
- Favorite/recent navigation shortcuts
- Deep linking support
- Enhanced mobile navigation patterns
- Organization/language/resource caching for performance
- Progressive loading for large datasets
