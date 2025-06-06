# Enable Verse Click Navigation

**Created:** 2025-06-06
**Priority:** High
**Type:** Feature/Bug

## Problem Statement

The application fails to render clickable verse numbers in the Scripture panel, preventing users from navigating by clicking on verses. While the rcl library (`simple-text-editor-rcl` v6.16.0) is supposed to support verse interactions, the current implementation shows only headers/titles with no verse numbers visible.

## Current Status

- ✅ **Event Handling Fixed** - Correct `handlers` object structure now working
- ❌ **Still Blocked** - UsfmEditor v6.16.0 not rendering verse numbers or content
- 🔍 **Root Cause** - Alignment data prevents verse content rendering
- 🎯 **Next Step** - Need to strip alignment markup or find alternative rendering approach

## Investigation Findings

### Technical Analysis

1. **USFM Content**: Raw USFM contains proper verse markers (`\v 1`, `\v 2`, etc.)
2. **Alignment Data Interference**: USFM is heavily marked up with alignment data:
   ```usfm
   \v 1 \zaln-s |x-strong="G39720" x-lemma="Παῦλος"...\*\w Paul|x-occurrence="1"\w*\zaln-e\*
   ```
3. **Rendering Issue**: UsfmEditor only renders:
   - Book titles (`\mt`, `\toc`)
   - Chapter headers (`\c`)
   - NO verse numbers or verse content
4. **API Incompatibility**: Console errors show `onBlockClick` is "Unknown event handler property"

### Console Evidence

```
EditableContent.onBlockClick({content, index}) not provided.
Warning: Unknown event handler property `onBlockClick`. It will be ignored.
```

### UI State

- ✅ Headers and titles render correctly
- ❌ No verse numbers visible anywhere in UI
- ❌ No clickable verse elements
- ❌ No verse content text (only headings)

## Root Causes

### 1. Version Incompatibility

The `simple-text-editor-rcl` v6.16.0 API differs from expected:

- `onBlockClick` property doesn't exist
- `onSelectionClick` property doesn't exist
- Different event handling mechanism required

### 2. Alignment Data Processing

The heavy alignment markup may be:

- Preventing verse parsing by UsfmEditor
- Hiding actual verse content
- Causing rendering to fail for verse elements

### 3. Configuration Issues

Current options may not enable verse rendering:

```javascript
options: {
  verse: true,        // Enabled but not working
  chapter: true,      // Working (headers show)
  preview: true,      // May be hiding verse numbers
  blockable: true,    // Enabled but unclear effect
}
```

## Attempted Solutions

### 1. Event Handler Approaches ✅ FIXED

- ❌ Added `onBlockClick` callback → "Unknown event handler"
- ❌ Added `onSelectionClick` callback → "Unknown event handler"
- ✅ **BREAKTHROUGH**: Fixed using correct `handlers` object structure:
  ```javascript
  <UsfmEditor
    content={usfm}
    options={options}
    sectionIndex={-1}
    handlers={{
      onSectionClick: handleSelectionClick,
      onBlockClick: handleBlockClick,
    }}
  />
  ```
- ✅ Event handlers now working: `📝 Block clicked: JSHandle@object`
- ✅ Added DOM click listeners → Ready for verse elements (when they render)

### 2. USFM Processing ❌ Still Needed

- Tried raw USFM passthrough → Same rendering issue
- Attempted alignment data stripping → Incomplete/broken
- **Issue**: Alignment markup prevents verse content from rendering

### 3. Option Configurations ❌ Insufficient

- Tested various option combinations → No change in verse visibility
- Options correctly configured but content still not rendering

## Required Actions

### Immediate (High Priority)

1. **Library Research**: Investigate correct API for `simple-text-editor-rcl` v6.16.0

   - Find proper event handling mechanism
   - Identify correct props for verse interaction
   - Check if version upgrade needed

2. **USFM Processing**: Implement proper alignment data handling

   - Strip alignment markup while preserving verse structure
   - Test with clean USFM content
   - Ensure verse markers remain intact

3. **Alternative Investigation**: Research other RCL components
   - Check if different component supports verse rendering
   - Evaluate scripture-related RCL packages
   - Consider fallback implementations

### Testing Requirements

- [ ] Verse numbers must be visible in UI
- [ ] Clicking verse number should update reference context
- [ ] Chapter navigation should also work via clicks
- [ ] Cross-chapter verse clicks should change both chapter and verse
- [ ] Visual feedback for selected verse (highlighting)

## Technical Specifications

### Expected Behavior

```javascript
// When user clicks verse 5
onVerseClick(5); // Should fire
updateReference({ verse: 5 }); // Should update context
// UI should highlight verse 5
// Translation helps should sync to verse 5
```

### Cross-Chapter Navigation

```javascript
// When user clicks verse in different chapter
onVerseClick(3, 2); // verse 3, chapter 2
updateReference({ chapter: 2, verse: 3 });
// Should navigate to new chapter AND verse
```

## Related Files

- `src-new/components/ScripturePanelRCL/ScripturePanelRCL.jsx`
- `src-new/components/ScripturePanelRCL/USFMRenderer.jsx`
- `src-new/utils/usfmProcessor.js`
- `package.json` (simple-text-editor-rcl dependency)
- `docs/simple-text-editor-rcl-integration.md` - **API Documentation & Integration Guide**

## Dependencies

- `simple-text-editor-rcl`: v6.16.0
- React context for reference management
- USFM processing utilities

## Success Criteria

- [ ] Verse numbers visible and clickable in scripture panel
- [ ] Clicking verse updates application state
- [ ] Cross-chapter navigation works correctly
- [ ] Visual feedback for current verse selection
- [ ] No console errors related to event handling

---

**Next Steps:** Research proper simple-text-editor-rcl v6.16.0 API documentation and identify correct approach for verse interaction handling.
