# Implement Dynamic DCS Catalog API Endpoints

**Status**: Open  
**Priority**: High  
**Type**: Enhancement/Bug Fix  
**Created**: 2025-06-04  
**Labels**: API, DCS Integration, Technical Debt

## Problem Statement

The changelog for v0.4.0 falsely claims that dynamic DCS Catalog API integration was completed:

> - ✅ DCS Catalog API integration service (catalogService.js) with caching and error handling
> - ✅ Dynamic organization discovery via `https://git.door43.org/api/v1/catalog/list/owners`
> - ✅ Language discovery via `https://git.door43.org/api/v1/catalog/list/languages/{owner}`
> - ✅ Resource discovery via `https://git.door43.org/api/v1/catalog/list/subjects/{owner}/{language}`

However, examining `src-new/services/catalogService.js` reveals that **all three main functions are completely hardcoded**:

1. `fetchOrganizations()` - Returns hardcoded array `["unfoldingWord", "door43-catalog", "STR", "WA"]`
2. `fetchLanguages()` - Returns hardcoded array of 20 common languages
3. `fetchResources()` - Returns hardcoded array `["ult", "ust", "tn", "tq", "tw", "twl", "ta"]`

Each function contains comments explicitly stating "since DCS catalog API endpoints are not available", indicating the API calls were never implemented.

## Current State Analysis

### What's Actually Implemented

- ✅ Caching infrastructure (`CatalogCache` class)
- ✅ Generic `fetchWithCache()` function with error handling
- ✅ Fallback data structure
- ✅ React hooks for consuming catalog data (`useOrganizations`, `useLanguages`, `useResources`)

### What's Missing (But Claimed as Complete)

- ❌ Actual API calls to DCS catalog endpoints
- ❌ Dynamic organization discovery
- ❌ Dynamic language discovery per organization
- ❌ Dynamic resource discovery per organization/language
- ❌ Graceful fallback from API to hardcoded data when APIs fail

## Technical Requirements

### API Endpoint Implementation

Implement actual calls to the documented DCS catalog API endpoints:

1. **Organizations**: `GET https://git.door43.org/api/v1/catalog/list/owners`
2. **Languages**: `GET https://git.door43.org/api/v1/catalog/list/languages/{owner}`
3. **Resources**: `GET https://git.door43.org/api/v1/catalog/list/subjects/{owner}/{language}`

### Fallback Strategy

The current hardcoded values should be retained as **fallbacks** when:

- API endpoints are unreachable
- API responses are malformed
- Network errors occur
- API rate limits are hit

### Function Signatures (Keep Existing)

```javascript
// Should attempt API call first, fallback to hardcoded on failure
export async function fetchOrganizations() {
  /* implement */
}
export async function fetchLanguages(owner) {
  /* implement */
}
export async function fetchResources(owner, language) {
  /* implement */
}
```

## Implementation Plan

### Phase 1: API Integration

1. **Research DCS API Documentation**

   - Verify endpoint URLs and expected response formats
   - Test endpoints manually to ensure they're functional
   - Document any authentication requirements

2. **Implement API Calls**

   - Modify `fetchOrganizations()` to call actual DCS API
   - Modify `fetchLanguages(owner)` to call actual DCS API
   - Modify `fetchResources(owner, language)` to call actual DCS API
   - Use existing `fetchWithCache()` infrastructure

3. **Add Proper Error Handling**
   - Graceful degradation to hardcoded fallbacks
   - Appropriate error logging
   - User-friendly error states in UI

### Phase 2: Testing Strategy

1. **Unit Tests**

   - Test successful API responses
   - Test API failure scenarios with fallback behavior
   - Test caching behavior
   - Mock API responses for consistent testing

2. **Integration Tests**

   - Test with actual DCS API endpoints (when available)
   - Test UI behavior with both dynamic and fallback data
   - Test error states in React components

3. **E2E Tests**
   - Verify dropdown population with real API data
   - Test graceful degradation when APIs are down

### Phase 3: Documentation Updates

1. **Changelog Correction**
   - Add entry acknowledging that v0.4.0 implementation was hardcoded
   - Document actual dynamic implementation completion
2. **API Documentation**
   - Document DCS API endpoints used
   - Document fallback behavior
   - Update service documentation

## Testing Requirements

### Mock Data for Tests

- Keep current hardcoded arrays as mock data for unit tests
- Ensure tests don't depend on external API availability
- Test both success and failure scenarios

### API Response Validation

- Validate API response structure matches expectations
- Handle cases where API returns different data than hardcoded fallbacks
- Ensure consistent data types and formats

## Acceptance Criteria

- [ ] `fetchOrganizations()` calls actual DCS API endpoint
- [ ] `fetchLanguages(owner)` calls actual DCS API endpoint
- [ ] `fetchResources(owner, language)` calls actual DCS API endpoint
- [ ] All functions fallback to hardcoded data on API failure
- [ ] Existing caching behavior is preserved
- [ ] All existing tests continue to pass
- [ ] New tests cover API integration and fallback scenarios
- [ ] UI continues to work when APIs are down
- [ ] Changelog accurately reflects implementation status
- [ ] Performance is maintained or improved

## Risk Assessment

### Low Risk

- Existing hardcoded fallbacks ensure app continues to function
- Caching infrastructure already in place
- No breaking changes to function signatures

### Medium Risk

- DCS API endpoints may have different response formats than expected
- API rate limiting or availability issues
- Performance impact of additional network calls

### Mitigation Strategies

- Thorough testing with actual API endpoints before deployment
- Implement circuit breaker pattern if APIs are unreliable
- Monitor API performance and adjust caching timeouts accordingly

## Related Files

- `src-new/services/catalogService.js` - Main implementation
- `src-new/services/catalogService.test.js` - Tests to update
- `src-new/hooks/useOrganizations.js` - Consumer hook
- `src-new/hooks/useLanguages.js` - Consumer hook
- `src-new/hooks/useResources.js` - Consumer hook
- `CHANGELOG.md` - Needs correction/update

## Definition of Done

This issue is complete when:

1. All three catalog functions make actual API calls to DCS endpoints
2. Fallback behavior works reliably when APIs fail
3. All tests pass (existing + new API integration tests)
4. Documentation accurately reflects implementation
5. Performance meets or exceeds current hardcoded implementation
6. UI works seamlessly with both dynamic and fallback data

---

**Note**: This issue addresses technical debt introduced by falsely claiming dynamic implementation was complete in the changelog. The hardcoded approach was a valid interim solution, but should have been clearly documented as such.
