<!--
status: open
Resolved: false
priority: medium
created: 2025-06-04
tags: [ui, feature, tn]
changelog_category: added
semver_impact: minor
changelog_description: "Add markdown rendering support for Translation Notes cards"
-->

# Fix Translation Notes Markdown Rendering

## Issue Description

Translation Notes cards currently display markdown syntax as plain text instead of rendering it as formatted HTML. This makes the notes harder to read and reduces the visual hierarchy that markdown formatting provides.

## Problem Details

In `src-new/components/TranslationNotesPanel.jsx`, the `note.text` content is processed through `processRcLinks` for RC link handling but does not undergo markdown-to-HTML conversion. As a result:

- **Bold text** appears as `**Bold text**`
- _Italic text_ appears as `*Italic text*`
- `Code snippets` appear as `` `Code snippets` ``
- Lists, headers, and other markdown elements are not formatted

## Root Cause Analysis

The component renders `note.text` directly without any markdown processing:

```jsx
<div style={{ lineHeight: "1.5", color: "#333" }}>
  {processRcLinks(note.text, (rcUri) => {
    if (handleRcLinkClick) {
      handleRcLinkClick(rcUri, languageId, organization);
    }
  })}
</div>
```

## Files Affected

- `src-new/components/TranslationNotesPanel.jsx` - Main component requiring markdown rendering
- `package.json` - May need to add markdown processing dependency
- `src-new/utils/` - May need new markdown utility functions

## Acceptance Criteria

- [ ] Translation Notes text content renders markdown syntax as HTML
- [ ] Bold, italic, code, and other common markdown elements are properly formatted
- [ ] RC links continue to function correctly after markdown processing
- [ ] Markdown rendering doesn't break existing styling or layout
- [ ] Performance impact is minimal (no unnecessary re-renders)
- [ ] Unit tests cover markdown rendering functionality
- [ ] Integration tests verify both markdown and RC link processing work together

## Technical Requirements

- [ ] Add a markdown processing library (e.g., `marked`, `react-markdown`, or similar)
- [ ] Create or update utility function to handle both markdown and RC link processing
- [ ] Ensure markdown processing is sanitized for security
- [ ] Maintain existing RC link click handling functionality
- [ ] Preserve current card styling and layout

## Test Commands

```bash
# Run component tests
npm test src-new/components/TranslationNotesPanel.test.jsx

# Run integration tests if available
npm test -- --grep "translation.*notes"

# Start dev server for manual testing
npm run dev
```

## Manual Test Cases

1. Navigate to a verse with translation notes containing markdown syntax
2. Verify bold text (`**text**`) renders as bold HTML
3. Verify italic text (`*text*`) renders as italic HTML
4. Verify code snippets (`` `code` ``) render with monospace styling
5. Verify RC links still function correctly
6. Test mixed markdown and RC links in the same note

## Additional Context

This enhancement will improve the readability and visual hierarchy of translation notes, making them more user-friendly and professionally formatted. The implementation should maintain backward compatibility with existing note content while adding support for standard markdown formatting.

Consider using a lightweight markdown library that supports the subset of markdown commonly used in translation notes, focusing on:

- Bold/italic text
- Code spans
- Simple lists
- Basic formatting elements

Avoid complex markdown features that might not be relevant to translation notes content.
