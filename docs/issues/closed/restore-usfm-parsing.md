# Restore USFM Parsing with usfm-js Library

## Description

The new `/src-new` implementation lacks proper USFM parsing functionality. The old `/src` implementation used the `usfm-js` library to parse USFM files into structured JSON, providing full support for USFM markers, formatting, and metadata. The new implementation only uses basic regex patterns to extract chapters and verses, missing important USFM features like:

- Paragraph markers (`\p`, `\m`, etc.)
- Character formatting (`\it`, `\bd`, etc.)
- Footnotes and cross-references
- Section headings (`\s`, `\ms`, etc.)
- Other USFM structural elements

## Acceptance Criteria

1. ✅ Install `usfm-js` dependency (already installed)
2. ✅ Create a USFM parser utility that uses `usfm-js` to parse USFM content
3. ✅ Create a scripture service that mirrors the old helper functions for fetching and parsing scripture
4. ✅ Update ScripturePanel to use the new parsing approach
5. ✅ Ensure all tests pass with the new implementation
6. ✅ Maintain backward compatibility with existing functionality

## Technical Details

- The old implementation is in `/src/components/Viewer/Workspace/Scripture/helpers.js`
- The new implementation is in:
  - `/src-new/utils/usfmParser.js` - USFM parsing utilities
  - `/src-new/services/scriptureService.js` - Scripture fetching and processing service
- Updated `/src-new/components/ScripturePanel.jsx` to use the new services

## Resolution

The issue has been resolved by:

1. **USFM Parser Implementation**: Created comprehensive USFM parsing utilities in `/src-new/utils/usfmParser.js` that properly handle:
   - Basic text extraction
   - Word objects
   - **Milestone markers (zaln)** - Fixed the main issue where text was hidden inside alignment markers
   - Quote handling
   - Nested structures

2. **Scripture Service**: Implemented a full-featured scripture service in `/src-new/services/scriptureService.js` that provides:
   - Book fetching with manifest support
   - Multi-resource parallel fetching
   - Testament detection (Old/New)
   - Original language support (Hebrew/Greek)

3. **Fixed Milestone Processing**: The key fix was updating the `processVerseObjects` function to properly handle `milestone` type objects that contain aligned text in their `children` arrays. This was causing the issue where only punctuation was visible.

4. **Test Coverage**: All tests pass, including:
   - USFM parser tests
   - Scripture service tests
   - Integration with ScripturePanel component

The implementation now correctly parses and displays scripture text with full USFM support, matching the functionality of the original application.

## Status: CLOSED
Date Resolved: 2024-12-19