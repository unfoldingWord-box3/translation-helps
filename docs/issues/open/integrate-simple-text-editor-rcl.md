# Integrate simple-text-editor-rcl for Enhanced Scripture Rendering

## Problem Statement

The current scripture rendering implementation uses a basic verse-by-verse display that:

- Loses the literary structure of scripture (paragraphs, poetry, etc.)
- Doesn't properly display USFM milestone markers with alignment data
- Provides a flat reading experience without visual hierarchy
- Cannot handle complex USFM features like footnotes, cross-references, or section headers

## Proposed Solution

Integrate the `simple-text-editor-rcl` library (https://simple-text-editor-rcl.netlify.app/#usfmeditor) to provide:

- Rich USFM rendering with proper formatting
- Support for milestone markers with alignment data
- Maintain verse-level navigation for translation helps
- Optional editing capabilities for translators

## Requirements

### Must Have

1. **Preserve Current Functionality**

   - Verse clicking still updates translation helps panels
   - Selected verse highlighting
   - Chapter navigation

2. **Enhanced Display**

   - Proper paragraph formatting
   - Poetry indentation
   - Section headers
   - Quotation formatting

3. **Milestone Marker Support**
   - Visual indicators for aligned words
   - Access to Greek/Hebrew lemma data
   - Clear alignment relationships

### Nice to Have

1. **Interlinear Mode**

   - Toggle to show source text above aligned words
   - Visual connection lines

2. **Edit Mode**

   - Allow translators to edit USFM directly
   - Live preview of changes
   - Validation of USFM syntax

3. **Comparison View**
   - Side-by-side scripture versions
   - Highlight differences

## Technical Approach

### Phase 1: Basic Integration

1. Add `simple-text-editor-rcl` as dependency
2. Create new `ScripturePanelRCL` component
3. Modify `scriptureService.js` to return raw USFM
4. Implement verse click handling on rendered output

### Phase 2: Alignment Visualization

1. Parse milestone markers for alignment data
2. Add visual styling for aligned words:
   - Dotted underlines
   - Hover tooltips with lemma info
   - Optional color coding

### Phase 3: Advanced Features

1. Implement toggle for interlinear view
2. Add edit mode with permissions
3. Create comparison view layout

## Implementation Details

### Component Structure

```
src-new/components/
├── ScripturePanelRCL/
│   ├── index.jsx
│   ├── ScripturePanelRCL.jsx
│   ├── ScripturePanelRCL.test.jsx
│   ├── USFMRenderer.jsx
│   ├── AlignmentDisplay.jsx
│   └── styles.css
```

### Key Changes

1. **scriptureService.js**

   - Add `fetchRawUSFM()` function
   - Keep existing functions for backward compatibility

2. **ScripturePanel.jsx**

   - Add feature flag for new renderer
   - Conditionally use ScripturePanelRCL

3. **Verse Navigation**
   - Implement click handlers on rendered USFM
   - Map rendered elements to verse numbers
   - Maintain verse selection state

## Visual Design Options

### Option A: Subtle Indicators

- Aligned words have dotted underlines
- Hover shows tooltip with Greek/Hebrew
- Maintains clean reading experience

### Option B: Inline Annotations

- Small superscript numbers on aligned words
- Side panel with alignment details
- Click to highlight connections

### Option C: Toggle Modes

- Reading mode (clean text)
- Study mode (shows alignments)
- Edit mode (for translators)

## Testing Strategy

1. Unit tests for verse click mapping
2. Integration tests with translation helps
3. Performance tests with large chapters
4. Visual regression tests for formatting

## Success Criteria

- [x] USFM renders with proper formatting
- [x] Verse clicking updates translation helps
- [x] Milestone markers display alignment data (basic support)
- [x] Performance remains acceptable
- [x] Backward compatibility maintained

## Implementation Status

✅ **COMPLETED** - Phase 1: Basic Integration

- [x] Added `simple-text-editor-rcl` as dependency
- [x] Created new `ScripturePanelRCL` component
- [x] Modified `scriptureService.js` to return raw USFM via `fetchRawUSFM()`
- [x] Implemented verse click handling on rendered output
- [x] Added feature flag for controlled rollout (`VITE_USE_ENHANCED_SCRIPTURE`)
- [x] Comprehensive test coverage
- [x] Documentation updates completed

🔄 **FUTURE ENHANCEMENTS** - Phase 2 & 3

- [ ] Enhanced alignment visualization with tooltips
- [ ] Interlinear mode implementation
- [ ] Edit mode for translators
- [ ] Comparison view layout
- [ ] Advanced milestone marker features

## Dependencies

- `simple-text-editor-rcl` package
- Updated `usfm-js` if needed
- CSS framework for styling

## Timeline Estimate

- Phase 1: 2-3 days
- Phase 2: 3-4 days
- Phase 3: 1 week

## Documentation Updates Required

Per AGENTS.md workflow, the following documentation must be updated:

1. **docs/component-map.md**

   - Add entry for `ScripturePanelRCL` component with path and description
   - Update `ScripturePanel` description to mention conditional RCL rendering

2. **docs/ui-map.md**

   - Update Scripture Panel section with enhanced formatting capabilities
   - Document alignment visualization options and interactions

3. **docs/lifecycle.md**

   - Update resource fetching section to include raw USFM fetching
   - Document state management for alignment data

4. **docs/ARCHITECTURE.md**

   - Add section on USFM rendering strategy
   - Document dual-mode scripture display architecture
   - Include data flow for milestone markers

5. **docs/Resource_Integration_Overview.md**
   - Update scripture resource section with enhanced USFM capabilities
   - Document milestone marker support and alignment data handling

## Version and Changelog

- **Version Increment**: Minor version (0.8.0 → 0.9.0) - new feature addition
- **Changelog Entry Format**:
  ```
  ## [0.9.0] - YYYY-MM-DD
  ### Added
  - Integrated simple-text-editor-rcl for enhanced scripture rendering
  - Support for USFM milestone markers with alignment data visualization
  - Proper literary formatting (paragraphs, poetry, section headers)
  - Configurable alignment display modes (tooltips, underlines, interlinear)
  ```

## References

- [simple-text-editor-rcl Demo](https://simple-text-editor-rcl.netlify.app/#usfmeditor)
- [USFM 3.0 Specification](https://ubsicap.github.io/usfm/)
- [Milestone Markers Documentation](https://ubsicap.github.io/usfm/milestones/index.html)
