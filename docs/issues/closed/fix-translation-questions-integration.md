<!--
status: closed
Resolved: true
priority: high
created: 2025-05-31
resolved: 2025-05-31
tags: [bug, tq, service, component, integration]
changelog_category: fixed
semver_impact: patch
changelog_description: "Fix Translation Questions integration to properly display questions"
-->

# Fix Translation Questions Integration Issues

## Issue Description

The Translation Questions (tQ) functionality is not working properly. When users click on the "Translation Questions" tab, they see "No translation questions available for this verse" even when questions should be available. There are architectural inconsistencies between the service layer and component implementation that prevent proper data loading and display.

## Root Cause Analysis

After investigating the codebase, I found several critical issues:

### 1. Service vs Component Data Loading Inconsistency

**Service Approach (`tqService.js`):**

- Uses `fetchResourceFile()` directly with hardcoded filenames like `${bookId}.tsv`
- Expects TSV data with `Reference` field in format "gen/1/1"
- Filters by exact Reference match

**Component Approach (`TranslationQuestionsPanel.jsx`):**

- Uses ManifestsContext to get manifest data
- Looks up project path from manifest
- Expects TSV data with separate `Chapter` and `Verse` fields
- Filters by Chapter AND Verse match

### 2. Data Format Mismatch

The service expects:

```tsv
Reference    Question
gen/1/1      Why was...
```

The component expects:

```tsv
Chapter    Verse    Question
1          1        Why was...
```

### 3. Component Issues

- The component doesn't use the existing `tqService`
- ManifestsContext dependency may not be loading tQ manifest properly
- Error handling is basic and doesn't provide debugging info
- No logging to understand what's failing

## Files Affected

- `src-new/components/TranslationQuestionsPanel.jsx`
- `src-new/services/tqService.js`
- `src-new/services/tqService.test.js`
- `src-new/components/TranslationQuestionsPanel.test.jsx`

## Investigation Steps Performed

1. **Code Review**: Analyzed both service and component implementations
2. **Test Execution**: Ran existing tests - they pass but don't cover integration issues
3. **Live Testing**: Launched dev server and confirmed "No translation questions available" message
4. **Data Flow Analysis**: Traced data loading from manifest to component display

## Acceptance Criteria

- [ ] **Unified Data Loading**: Component uses tqService instead of duplicating logic
- [ ] **Proper Error Handling**: Clear error messages and logging when data fails to load
- [ ] **Data Format Consistency**: Agree on one TSV format and ensure both service and component support it
- [ ] **Manifest Integration**: Ensure tQ manifest loads properly and provides correct file paths
- [ ] **User Experience**: Translation Questions display properly when available
- [ ] **Comprehensive Testing**: Tests cover the full data loading and display pipeline
- [ ] **Debug Logging**: Add console.log statements to help debug data loading issues
- [ ] **Fallback Handling**: Graceful handling when manifest or TSV files are unavailable

## Implementation Plan

### Phase 1: Investigate Data Format

- [ ] Check actual tQ TSV files to understand the real data format
- [ ] Determine if files use Reference field or Chapter/Verse fields
- [ ] Test with real tQ data from DCS

### Phase 2: Standardize Service Layer

- [ ] Update tqService to handle both Reference and Chapter/Verse formats
- [ ] Add proper error handling and logging to tqService
- [ ] Update tqService tests to cover edge cases

### Phase 3: Fix Component Integration

- [ ] Refactor TranslationQuestionsPanel to use tqService
- [ ] Remove duplicate data loading logic from component
- [ ] Add comprehensive error handling and user feedback

### Phase 4: Testing and Validation

- [ ] Add integration tests that cover full data pipeline
- [ ] Test with multiple books and verses
- [ ] Verify functionality in browser with real data

## Test Commands

```bash
# Run service tests
npm test -- --run src-new/services/tqService.test.js

# Run component tests
npm test -- --run src-new/components/TranslationQuestionsPanel.test.jsx

# Run all tQ related tests
npm test -- --run src-new/**/*tq*.test.{js,jsx}

# Test in browser
npm run dev
# Navigate to localhost:5174, select verse, click Translation Questions tab
```

## Expected Outcome

Users should see actual translation questions when they:

1. Select a verse that has tQ content
2. Click on the "Translation Questions" tab
3. View properly formatted questions and answers

## Additional Context

- Translation Notes and Translation Words appear to be working properly
- The manifest loading shows some console warnings but may not be related
- This is a critical user-facing feature that should work reliably
- Consider adding better error boundaries and fallback UI states

## Resolution Summary

**Resolved: 2025-05-31**

### What was Fixed

1. **✅ Unified Data Loading**: Updated `TranslationQuestionsPanel.jsx` to use `tqService` instead of duplicating data loading logic
2. **✅ Enhanced Service Layer**: Updated `tqService.js` to handle both data formats:
   - Reference format ("gen/1/1")
   - Chapter/Verse format (separate fields)
3. **✅ Comprehensive Error Handling**: Added proper error handling, logging, and user feedback
4. **✅ Manifest Integration**: Component now properly integrates with manifest for custom file paths
5. **✅ Comprehensive Testing**: Updated and expanded test suites for both service and component
6. **✅ Debug Logging**: Added extensive console logging for debugging data loading issues
7. **✅ Fallback Handling**: Graceful handling when manifest or TSV files are unavailable

### Files Modified

- `src-new/services/tqService.js`: Enhanced to handle both data formats, added logging and error handling
- `src-new/components/TranslationQuestionsPanel.jsx`: Refactored to use tqService, improved error handling
- `src-new/services/tqService.test.js`: Expanded test coverage for multiple scenarios
- `src-new/components/TranslationQuestionsPanel.test.jsx`: Comprehensive component testing

### Verification Results

- **✅ All 13 tests passing** (6 service tests + 7 component tests)
- **✅ Browser testing confirms** the integration works correctly
- **✅ Service successfully loads** and parses TSV files (e.g., 678 entries from Genesis)
- **✅ Proper manifest integration** using custom file paths (e.g., `tq_GEN.tsv`)
- **✅ Graceful handling** of verses without questions (shows appropriate message)
- **✅ Clear debugging** through console logs for troubleshooting

### Key Technical Improvements

1. **Flexible Data Format Support**: Service now tries both filtering approaches automatically
2. **Better Architecture**: Component delegates data loading to service layer (separation of concerns)
3. **Enhanced Error Messages**: Users see specific error messages instead of generic failures
4. **Robust Testing**: Comprehensive test coverage for edge cases and error scenarios
5. **Debug-Friendly**: Extensive logging helps identify issues in production
