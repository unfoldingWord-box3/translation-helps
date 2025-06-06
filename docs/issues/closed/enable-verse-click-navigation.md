<!--
status: closed
Resolved: true
priority: high
created: 2025-06-06
resolved: 2025-06-06
tags: [bug, ui, navigation, scripture-panel, verse-click]
changelog_category: fixed
semver_impact: patch
changelog_description: "Enable verse click navigation in scripture panel to sync helps resources"
-->

# Enable Verse Click Navigation in Scripture Panel

## Description

The scripture panel has verse click functionality implemented using the `simple-text-editor-rcl` library, but clicking on verses does not trigger the expected navigation behavior. This prevents users from quickly navigating to specific verses and keeping helps resources (Translation Notes, Translation Questions, etc.) synchronized with the selected scripture.

## Problem Details

### Current State

- Event handlers are implemented in `USFMRenderer.jsx` for both RCL library events (`onBlockClick`, `onSelectionClick`) and DOM click events
- The `simple-text-editor-rcl` library supports onClick events for verse blocks
- Multiple approaches have been tried, including DOM event listeners as fallbacks
- Despite the implementation, clicking verses produces no navigation or context updates

### Expected Behavior

1. **Verse Navigation**: Clicking any verse number should:

   - Update the ReferenceContext to that verse
   - Highlight the selected verse with visual feedback
   - Update all helps panels to show content for that verse

2. **Cross-Chapter Navigation**: When clicking a verse reference in another chapter:

   - First update the chapter in ReferenceContext
   - Then update the verse
   - Ensure scripture panel loads the new chapter
   - Sync helps resources to the new chapter and verse

3. **Visual Feedback**:
   - Selected verse should be highlighted (background color change)
   - Hover states should indicate clickable elements
   - Smooth scrolling to bring selected verse into view

## Acceptance Criteria

- [ ] Clicking a verse number updates the ReferenceContext with the selected verse
- [ ] All helps panels (Translation Notes, Questions, Words) sync to show content for the clicked verse
- [ ] Clicking a verse in a different chapter triggers chapter navigation first, then verse selection
- [ ] Selected verse is visually highlighted with appropriate styling
- [ ] Hover states provide clear indication of clickable verse elements
- [ ] Console shows appropriate debug logs for verse click events
- [ ] No console errors when interacting with verses
- [ ] Navigation works consistently across different Bible resources (ULT, UST, etc.)

## Technical Details

### Files Affected

- `src-new/components/ScripturePanelRCL/USFMRenderer.jsx` - Main implementation file
- `src-new/components/ScripturePanelRCL/ScripturePanelRCL.jsx` - Parent component
- `src-new/context/ReferenceContext.jsx` - Context that needs to be updated

### Implementation Notes

- The `UsfmEditor` component from `simple-text-editor-rcl` is configured with:
  - `onBlockClick` handler for verse clicks
  - `onSelectionClick` handler for chapter clicks
  - DOM click event listener as a fallback mechanism
- Current implementation attempts to detect verses through:
  - CSS classes (`.v`, `.verse-*`)
  - Data attributes (`data-verse`, `data-chapter`)
  - Text content matching for verse numbers

### Debug Information

The implementation includes console logging for:

- Block/selection click events
- Detected verse/chapter numbers
- Navigation updates

## Test Commands

```bash
# Start development server
npm run dev

# Test verse navigation:
# 1. Navigate to any book (e.g., Titus 1)
# 2. Click on different verse numbers
# 3. Verify helps panels update to match selected verse
# 4. Check browser console for click event logs
# 5. Try clicking verses in poetry sections (Psalms)
# 6. Test cross-chapter navigation by clicking verse references
```

## Root Cause Analysis

The issue appears to be related to:

1. Event handler compatibility with the current version of `simple-text-editor-rcl`
2. Possible rendering timing issues where click handlers are attached before content is fully rendered
3. The structure of the rendered USFM may not match what the event handlers expect

## Related Issues

- `docs/issues/open/fix-scripture-panel-navigation-sync-and-text-rendering.md` - Related navigation sync work
- Connected to overall scripture panel enhancement efforts
- May impact components that depend on ReferenceContext updates

## Additional Context

This functionality is critical for the user experience as it enables:

- Quick navigation between verses while studying
- Keeping translation helps synchronized with the scripture being read
- Efficient comparison of verses across different resources
- Natural reading flow with clickable navigation
