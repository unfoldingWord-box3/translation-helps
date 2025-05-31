<!--
status: completed
priority: high
created: 2024-12-19
completed: 2025-05-31
tags: [feature, translation-notes, parsing, ui]
-->

# Implement Translation Notes Parsing and Rendering

## Description

The application needs to implement parsing and rendering functionality for translationNotes (tN) resources. Currently, the app can fetch and display scripture text, but lacks the ability to properly parse and display translation notes that provide contextual help and explanations for specific verses.

Translation notes are typically stored in TSV (Tab-Separated Values) format and need to be:

1. Fetched from the appropriate resource repository (after consulting the manifest.yaml)
2. Parsed into a structured format
3. Linked to specific verses/references
4. Rendered in the UI alongside scripture text

The process requires first fetching the manifest.yaml file from the translation notes repository to determine the structure and location of TSV files for each book.

## Acceptance Criteria

1. [x] Fetch and parse the translation notes manifest.yaml to determine TSV file locations
2. [x] Create a translation notes parser utility that handles TSV format
3. [x] Implement a translation notes service for fetching and processing tN resources
4. [x] Create UI components to display translation notes
5. [x] Link translation notes to specific verse references
6. [x] Integrate translation notes display with the existing scripture panel
7. [ ] Support multiple languages/versions of translation notes
8. [x] Handle edge cases (missing notes, malformed data, etc.)
9. [x] Add appropriate error handling and loading states
10. [x] Ensure responsive design for notes display
11. [x] Write tests for parsing and rendering functionality

## Technical Details

### Expected TSV Format

Translation notes typically follow this structure:

- `Reference` - Book/Chapter/Verse reference
- `ID` - Unique identifier
- `Tags` - Categorization tags
- `SupportReference` - Supporting scripture references
- `Quote` - The specific text being annotated
- `Occurrence` - Which occurrence of the quote in the verse
- `Note` - The actual translation note content

### Implementation Approach

1. **Manifest Handling**

   - Fetch `manifest.yaml` from the translation notes repository
   - Parse manifest to identify available books and their TSV file paths
   - Handle different manifest formats (e.g., `projects` array structure)
   - Example manifest structure:
     ```yaml
     dublin_core:
       conformsto: "rc0.2"
       format: "text/tsv"
     projects:
       - identifier: "gen"
         path: "./tn_GEN.tsv"
         title: "Genesis"
       - identifier: "exo"
         path: "./tn_EXO.tsv"
         title: "Exodus"
     ```

2. **Parser Module** (`/src-new/utils/translationNotesParser.js`)

   - Parse TSV content into structured JSON
   - Handle special characters and formatting
   - Validate data structure

3. **Service Layer** (`/src-new/services/translationNotesService.js`)

   - Fetch manifest.yaml first to determine resource structure
   - Fetch tN resources from DCS/repository based on manifest paths
   - Cache parsed notes for performance
   - Provide API for querying notes by reference

4. **UI Components**

   - `TranslationNotesPanel.jsx` - Main container for notes display
   - `TranslationNote.jsx` - Individual note component
   - Integration with existing `ScripturePanel.jsx`

5. **State Management**
   - Add translation notes to the application context
   - Sync notes display with current scripture reference
   - Handle loading and error states

## Dependencies

- Existing scripture parsing and display functionality
- DCS client service for fetching resources
- Current verse/reference context system

## Related Issues

- Epic: Restore Full Feature Parity (#epic-restore-original-ux)
- This is part of restoring the tabbed view for tW, tN, TWL resources

## Notes

- Consider performance implications when loading large TSV files
- May need to implement pagination or lazy loading for extensive note sets
- Should coordinate with the TWL (Translation Word List) implementation for consistent UI/UX
