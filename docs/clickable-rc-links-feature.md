# Clickable RC:// Links Feature

## Overview

This feature automatically converts `rc://` resource links found in translation resource content into clickable links that open the referenced resource in a new tab.

## Implementation

### Components Updated

1. **TranslationNotesPanel.jsx** - Makes rc:// links in notes and support references clickable
2. **TranslationWordsPanel.jsx** - Makes rc:// links in word summaries clickable, and displays rcUri as clickable links
3. **TranslationQuestionsPanel.jsx** - Makes rc:// links in questions and answers clickable

### Utility Functions

**`src-new/utils/rcLinkUtils.js`** provides:

- `extractRcUris(text)` - Extracts all rc:// URIs from text
- `handleRcLinkClick(rcUri, event)` - Opens rc:// URI in new tab
- `renderTextWithRcLinks(text, linkStyle)` - Renders text with clickable rc:// links
- `RcLink({ rcUri, displayText, style })` - Creates a clickable rc:// link component

### How It Works

1. **Text Parsing**: The `extractRcUris()` function uses regex to find all `rc://` URIs in text content
2. **URL Conversion**: RC URIs are converted to DCS (Door43 Content Service) raw file URLs
3. **Link Rendering**: Found URIs are replaced with clickable React components
4. **Click Handling**: Clicking opens the resource in a new tab with proper security attributes

### URL Conversion Examples

- `rc://en/tw/dict/bible/kt/create` → `https://git.door43.org/unfoldingWord/en_tw/raw/branch/master/bible/kt/create.md`
- `rc://*/tw/dict/bible/kt/love` → `https://git.door43.org/unfoldingWord/en_tw/raw/branch/master/bible/kt/love.md`
- `rc://en/tn/dict/bible/kt/faith` → `https://git.door43.org/unfoldingWord/en_tn/raw/branch/master/dict/bible/kt/faith.md`

### Special Handling

- **Wildcard Language**: `rc://*/` is converted to `rc://en/` (defaults to English)
- **Translation Words**: For tW resources, the "dict" path segment is automatically removed
- **Error Handling**: Invalid URIs log a warning and don't open a window
- **Event Prevention**: Click events are properly handled to prevent interference with parent elements

### Visual Design

- **Link Styling**: Clickable links are styled with blue color (`#1976d2`), underline, and monospace font
- **Hover Effects**: Links show a cursor pointer and include tooltip with "Open [uri] in new tab"
- **Custom Styling**: Link styles can be customized through the `linkStyle` parameter

### Usage in Components

```jsx
import { renderTextWithRcLinks, RcLink } from '../utils/rcLinkUtils';

// Automatically convert text with rc:// links
<div>{renderTextWithRcLinks(note.text)}</div>

// Direct link component
<RcLink rcUri="rc://en/tw/dict/bible/kt/create" style={{ fontSize: '0.8em' }} />
```

### Security

- Links open with `noopener,noreferrer` attributes for security
- Click events prevent default browser behavior
- Event propagation is stopped to avoid conflicts

## Benefits

- **Enhanced User Experience**: Users can quickly access referenced resources
- **Improved Navigation**: No need to manually copy/paste or search for resources
- **Consistent Behavior**: All resource panels behave consistently with clickable links
- **Accessibility**: Proper link semantics and keyboard navigation support

## Future Enhancements

- Support for additional resource types beyond tW and tN
- Custom domain configuration for different deployment environments
- Link preview/tooltip showing resource content
- Caching of frequently accessed resources
