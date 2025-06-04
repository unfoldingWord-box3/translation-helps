<!--
status: open
Resolved: false
priority: critical
created: 2025-06-04
tags: [bug, regression, race-condition, manifest-loading, dcs-integration]
changelog_category: fixed
semver_impact: patch
changelog_description: "Fix race condition causing intermittent resource loading failures"
-->

# Fix Race Condition in Resource Loading (Regression)

## Issue Description

The app intermittently fails to render content that previously worked correctly, showing errors like:

```
Resource HI_GLT not available for translationCore-Create-BCS/hi
```

When accessing: `http://localhost:5173/?owner=translationCore-Create-BCS&rc=/hi/glt/tit/1/1`

## Root Cause Analysis

### Problem Details (REGRESSION BUG)

1. **Race Condition**: Resource loading has become unreliable - content sometimes flashes correctly before failing, indicating a timing issue

2. **Recent Regression**: This functionality worked previously but has broken in recent development cycles

3. **Intermittent Failure**: The issue is not consistent - refreshing sometimes shows full content briefly before error

4. **Context/State Management Issue**: Likely related to recent changes in context loading order or state management

### Current Behavior (Regression)

- User clicks a link with `rc=/hi/glt/tit/1/1`
- App briefly shows loading state
- Sometimes content flashes correctly for a moment
- Then shows error: "Resource HI_GLT not available"
- Resource that previously worked is now failing intermittently
- Suggests race condition between manifest loading and content rendering

### Expected Behavior (Previous Working State)

- App should load GLT resource consistently as it did before
- Content should render without intermittent failures
- No race conditions between manifest loading and content display
- Stable, reliable resource loading like previous versions

## Investigation Steps

1. **Test Resource Discovery**:

   ```bash
   # Check what resources are actually available for translationCore-Create-BCS/hi
   curl "https://git.door43.org/api/v1/repos/search?owner=translationCore-Create-BCS&lang=hi&limit=50"
   ```

2. **Check Catalog API Response**:

   ```bash
   # See what subjects are returned
   curl "https://git.door43.org/api/v1/catalog/list/subjects?owner=translationCore-Create-BCS&lang=hi"
   ```

3. **Verify GLT Resource Existence**:
   ```bash
   # Check if GLT resource exists for this organization
   curl "https://git.door43.org/api/v1/repos/translationCore-Create-BCS/hi_glt"
   ```

## Files Affected

### Service Layer

- `src-new/services/catalogService.js` - Enhance resource discovery
- `src-new/context/MultiManifestsContext.jsx` - Improve fallback handling
- `src-new/components/ScripturePanel.jsx` - Better error messaging

### Potential New Files

- `src-new/utils/resourceDiscovery.js` - Enhanced resource discovery utilities
- `src-new/utils/resourceFallbacks.js` - Smart fallback logic

## Implementation Plan

### Phase 1: Fix Race Condition (Primary Focus)

1. **Investigate Loading Order Issues**:

   - Check if MultiManifestsContext loading completes before ScripturePanel tries to access manifests
   - Review recent changes to context providers and loading states
   - Add debug logging to track loading sequence

2. **Fix Context Dependencies**:

   ```javascript
   // Ensure ScripturePanel waits for manifests to fully load
   if (manifestsLoading) {
     console.log("⏳ ScripturePanel: Waiting for manifests to load");
     setLoading(true);
     return; // Already implemented but may need strengthening
   }
   ```

3. **Improve Resource Resolution Timing**:
   ```javascript
   // Ensure resource discovery includes GLT and other resources
   // that worked previously
   const allResourceIds = [...BASE_RESOURCE_IDS, ...bibleResourceIds];
   ```

### Phase 2: Enhanced Debug Information

1. **Add Comprehensive Logging**:

   ```javascript
   console.log("📋 Loading manifests for resources:", allResourceIds);
   console.log("✅ Available manifests:", Object.keys(loadedManifests));
   console.log("❌ Failed to load:", failedResources);
   ```

2. **Manifest Loading Verification**:
   ```javascript
   // Verify GLT is being discovered and loaded
   results.forEach(({ resourceId, manifest }) => {
     if (manifest) {
       console.log(`✅ Loaded manifest for ${resourceId}`);
     } else {
       console.error(`❌ Failed to load manifest for ${resourceId}`);
     }
   });
   ```

### Phase 3: Strengthen Resource Discovery

1. **Expand Resource Search** (if GLT is not being found):

   ```javascript
   // Include more comprehensive search terms
   const searchParams = new URLSearchParams({
     owner: owner,
     lang: languageCode,
     subject: "Bible,Aligned Bible,Translation,Scripture", // More inclusive
     limit: "50",
   });
   ```

2. **Better Error Recovery**:
   - If resource loading fails, retry with exponential backoff
   - Provide clear feedback about what went wrong and when

## Acceptance Criteria

- [ ] **Regression Fixed**: GLT resource loads consistently like it did before
- [ ] **No Race Conditions**: Content doesn't flash and then fail - stable loading
- [ ] **Reliable Manifest Loading**: MultiManifestsContext properly discovers and loads GLT manifests
- [ ] **Consistent Behavior**: No intermittent failures when refreshing the same URL
- [ ] **Debug Information**: Clear logging to understand loading sequence and failures
- [ ] **Original URL Works**: `http://localhost:5173/?owner=translationCore-Create-BCS&rc=/hi/glt/tit/1/1` works reliably
- [ ] **Proper Loading States**: UI shows appropriate loading indicators during manifest fetch
- [ ] **Context Synchronization**: ScripturePanel waits for manifests before attempting to render
- [ ] **Error Clarity**: If GLT truly isn't available, error message is clear and helpful
- [ ] **No Performance Regression**: Fix doesn't slow down previously working functionality

## Test Commands

```bash
# Test with the failing URL
npm run dev
# Navigate to: http://localhost:5173/?owner=translationCore-Create-BCS&rc=/hi/glt/tit/1/1

# Run integration tests
npm test src-new/services/catalogService.integration.test.js

# Test fallback behavior
npm test src-new/context/ManifestsContext.test.js

# Test ScripturePanel error handling
npm test src-new/components/ScripturePanel.test.jsx
```

## Additional Context

**This is a regression bug** - functionality that previously worked has been broken by recent changes. The intermittent nature (content flashing before failing) strongly indicates a race condition between:

1. Manifest loading in MultiManifestsContext
2. Resource resolution in ScripturePanel
3. State updates across context boundaries

The fix should focus on:

- Ensuring proper loading order and dependencies
- Adding debug information to track down the timing issue
- Restoring the previous reliable behavior
- Not introducing new complexity that could cause other regressions

**Priority is critical** because this breaks existing functionality that users depend on.

## Related Issues

- Related to DCS integration and manifest loading
- Impacts RC link functionality and deep linking
- Affects user experience for non-English translation projects
- Connected to catalog service reliability and API coverage
