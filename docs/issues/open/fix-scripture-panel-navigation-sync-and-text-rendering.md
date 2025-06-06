<!--
status: open
Resolved: false
priority: high
created: 2025-06-06
tags: [bug, ui, navigation, scripture-panel, alignment-data]
changelog_category: fixed
semver_impact: patch
changelog_description: "Fix scripture panel navigation sync and alignment data text rendering"
-->

# Fix Scripture Panel Navigation Sync and Text Content Rendering

## Issue Description

Two critical issues with the ScripturePanelRCL component that affect user experience and functionality:

1. **Navigation Sync Issue**: Clicking chapter headings and verse blocks doesn't change the chapter/verse context as expected, preventing helps resources (Translation Notes, Translation Questions, etc.) on the right panel from staying in sync with the selected scripture content.

2. **Text Content Rendering Issue**: USFM alignment data containing complex `\zaln-s` and `\w` markers is not being properly processed to extract readable text, resulting in raw markup being displayed instead of clean scripture text.

## Problem Details

### Navigation Sync Problem

- **Location**: `src-new/components/ScripturePanelRCL/USFMRenderer.jsx`
- **Behavior**: User clicks on chapter headings or verse numbers in the scripture panel
- **Expected**: Context should update to sync helps resources with the selected verse/chapter
- **Actual**: Clicks don't trigger context updates, helps resources remain out of sync

### Text Rendering Problem (RESOLVED)

- **Location**: `src-new/components/ScripturePanelRCL/ScripturePanelRCL.jsx`
- **Behavior**: Raw USFM with alignment data displays complex markup
- **Example Raw**: `\zaln-s |x-strong="G39720" x-lemma="Παῦλος"\*\w Paul|x-occurrence="1"\w*\zaln-e\*`
- **Expected**: Clean text like "Paul"
- **Status**: ✅ **RESOLVED** - Added USFM processor to extract readable text

## Root Cause Analysis

### Navigation Sync Issue

The `simple-text-editor-rcl` component is not properly configured to handle click events, and the event handlers (`onSelectionClick`, `onBlockClick`) may not be compatible with the current version or configuration of the library.

### Text Rendering Issue (RESOLVED)

The `simple-text-editor-rcl` library doesn't automatically process USFM alignment markers to extract readable text. Raw USFM with alignment data needs preprocessing before being passed to the renderer.

## Files Affected

- `src-new/components/ScripturePanelRCL/USFMRenderer.jsx` - Navigation event handling
- `src-new/components/ScripturePanelRCL/ScripturePanelRCL.jsx` - Text processing (RESOLVED)
- `src-new/utils/usfmProcessor.js` - ✅ **NEW** - USFM text extraction utilities

## Investigation Steps

### Navigation Testing

1. Open application with scripture panel
2. Click on chapter headings in scripture content
3. Click on verse numbers in scripture content
4. Observe if Translation Notes/Questions panel updates to match selection
5. Check browser console for click event logs and errors

### Text Rendering Testing ✅ **VERIFIED WORKING**

1. Load scripture content with alignment data (e.g., Titus 1:1)
2. Verify readable text appears instead of raw markup
3. Confirm USFM processing logs show successful extraction

## Resolution Progress

### ✅ Text Rendering - COMPLETED

- Created `src-new/utils/usfmProcessor.js` with text extraction functions
- Updated `ScripturePanelRCL.jsx` to preprocess USFM before rendering
- Verified clean text extraction (136,216 chars → 5,851 chars readable text)
- Console logs confirm successful processing: "Paul, a servant of God and an apostle of Jesus Christ..."

### ⏳ Navigation Sync - IN PROGRESS

- Identified null reference error in USFMRenderer
- Need to fix event handler compatibility with simple-text-editor-rcl
- Need to verify click events properly trigger ReferenceContext updates

## Acceptance Criteria

- [x] **Text Rendering**: USFM alignment data is processed to show clean, readable text
- [x] **Text Processing**: Complex alignment markers are removed while preserving verse structure
- [ ] **Navigation Sync**: Clicking chapter headings updates context to sync helps resources
- [ ] **Verse Navigation**: Clicking verse numbers updates context to sync helps resources
- [ ] **Error Handling**: No console errors when interacting with scripture content
- [ ] **Integration**: Helps resources (TN, TQ) stay synchronized with scripture selection

## Test Commands

```bash
# Start development server
npm run dev

# Test scripture panel navigation
# 1. Navigate to Titus 1:1
# 2. Click chapter headings and verse numbers
# 3. Verify helps resources update accordingly
# 4. Check browser console for errors

# Test text rendering (ALREADY WORKING)
# 1. Navigate to any book with alignment data
# 2. Verify clean text appears without raw USFM markup
```

## Additional Context

- This issue affects the core user experience of the scripture study workflow
- Navigation sync is essential for helps resources to provide relevant content
- Text rendering fix successfully reduces USFM size by ~96% (136K → 5.8K chars)
- Uses `simpleWordExtraction` function for optimal text processing
- Console logging available for debugging click events and text processing

## Related Issues

- Related to `docs/issues/open/fix-scripture-panel-rcl-navigation-and-rendering.md`
- Connected to overall scripture panel enhancement work
- May impact other components that depend on ReferenceContext updates
