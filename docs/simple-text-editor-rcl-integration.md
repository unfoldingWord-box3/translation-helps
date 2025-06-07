# Simple Text Editor RCL Integration

**Documentation for:** `simple-text-editor-rcl` v6.16.0
**Created:** 2025-06-06
**Purpose:** Document the correct API usage and integration patterns for the RCL library

## Overview

The `simple-text-editor-rcl` library provides USFM rendering capabilities for scripture content. This document captures the correct API usage patterns discovered through investigation.

## ✅ GRANULAR DECORATOR SOLUTION IMPLEMENTED

**USFM Alignment Rendering Issue RESOLVED**

The alignment milestone rendering problem has been solved using granular custom decorators. The issue where content was being hidden by the library's CSS rule `.usfm .preview .marker, .usfm .preview .attribute { display: none; }` has been addressed.

### Solution Overview

Custom granular decorators separate USFM alignment structures into distinct parts:

- **marker**: USFM markers (hidden in preview mode)
- **content**: actual text content (always visible)
- **attributes**: metadata (hidden in preview mode)

This ensures that words like "Paul" remain visible while alignment markup is properly hidden.

```javascript
// ✅ CURRENT IMPLEMENTATION: Uses granular decorators
<UsfmEditor
  content={rawUsfmString}
  decorators={createMilestoneDecorators(previewMode)}
  {...otherProps}
/>
```

**See `docs/usfm-alignment-rendering-solution.md` for complete technical details.**

## Key Resources

- **Official Documentation:** https://simple-text-editor-rcl.netlify.app/
- **UsfmEditor Examples:** https://simple-text-editor-rcl.netlify.app/#usfmeditor
- **NPM Package:** https://www.npmjs.com/package/simple-text-editor-rcl
- **Current Version:** v6.16.0

## Correct API Structure

### UsfmEditor Component

The `UsfmEditor` component requires a specific structure for event handling:

```javascript
import { UsfmEditor } from "simple-text-editor-rcl";

const props = {
  content: usfmString, // Raw USFM content
  onContent: setContent, // Optional: for editable mode
  options: {
    sectionable: true, // Enable section interactions
    blockable: true, // Enable block interactions
    editable: false, // Set to true for editing
    preview: true, // Enable preview mode
  },
  handlers: {
    // ✅ CRITICAL: Use handlers object
    onSectionClick: handleSectionClick, // Function to handle section clicks
    onBlockClick: handleBlockClick, // Function to handle block clicks
  },
  sectionIndex: -1, // Section index (-1 for full document)
};

<UsfmEditor {...props} />;
```

### ❌ Incorrect API Usage (Does NOT Work)

```javascript
// These approaches DO NOT work with v6.16.0:
<UsfmEditor
  content={usfm}
  onBlockClick={handleBlockClick} // ❌ Unknown event handler property
  onSelectionClick={handleSelectionClick} // ❌ Unknown event handler property
/>
```

### ✅ Correct API Usage (WORKS)

```javascript
<UsfmEditor
  content={usfm}
  options={options}
  sectionIndex={-1}
  handlers={{
    // ✅ Use handlers object
    onSectionClick: handleSelectionClick,
    onBlockClick: handleBlockClick,
  }}
/>
```

## Event Handler Functions

### onBlockClick Handler

```javascript
const handleBlockClick = (block) => {
  console.log("📝 Block clicked:", block);

  // Example: Extract verse information
  if (block?.content) {
    const verseMatch = block.content.match(/\\v\s+(\d+)/);
    if (verseMatch) {
      const verseNum = parseInt(verseMatch[1]);
      updateReference({ verse: verseNum });
    }
  }

  // Check for verse data in block metadata
  if (block?.verse) {
    const verseNum = parseInt(block.verse);
    updateReference({ verse: verseNum });
  }
};
```

### onSectionClick Handler

```javascript
const handleSectionClick = (selection) => {
  console.log("📖 Selection clicked:", selection);

  // Example: Extract chapter information
  if (selection?.content) {
    const chapterMatch = selection.content.match(/\\c\s+(\d+)/);
    if (chapterMatch) {
      const chapterNum = parseInt(chapterMatch[1]);
      updateReference({ chapter: chapterNum });
    }
  }

  // Check for chapter data in selection metadata
  if (selection?.chapter) {
    const chapterNum = parseInt(selection.chapter);
    updateReference({ chapter: chapterNum });
  }
};
```

## Configuration Options

### Common Options Object

```javascript
const options = {
  sectionable: true, // Enable section-level interactions
  blockable: true, // Enable block-level interactions
  editable: false, // Set to true to allow content editing
  preview: true, // Enable preview mode for readable text
  verse: true, // Enable verse rendering (may not work with alignment data)
  chapter: true, // Enable chapter rendering
  showWordAtts: false, // Hide word attributes for cleaner display
  showTitles: true, // Show book titles
  showHeadings: true, // Show section headings
  showIntroductions: true, // Show introductory content
  showChapterLabels: true, // Show chapter labels
  showVerseLabels: true, // Show verse labels
};
```

## Known Issues & Limitations

### 1. Alignment Data Interference

**Problem:** USFM with heavy alignment markup prevents verse content rendering.

**Example Problematic Content:**

```usfm
\v 1 \zaln-s |x-strong="G39720" x-lemma="Παῦλος" x-morph="Gr,N,,,,,NMS," x-occurrence="1" x-occurrences="1" x-content="Παῦλος"\*\w Paul|x-occurrence="1" x-occurrences="1"\w*\zaln-e\*
```

**Symptoms:**

- Only book titles and chapter headers render
- No verse numbers visible
- No verse content text displayed
- Event handlers work but find no verse elements

**Workarounds:**

- Strip alignment data before passing to UsfmEditor
- Use alternative RCL components
- Implement custom verse rendering

### 2. Event Handler Console Warnings

The library may show warnings about `defaultProps` usage. These are React warnings about future deprecation and do not affect functionality:

```
Warning: Support for defaultProps will be removed from function components in a future major release.
```

## Implementation Example

### Complete Working Example

```javascript
import React, { useState, useContext } from "react";
import { UsfmEditor } from "simple-text-editor-rcl";
import { ReferenceContext } from "../context/ReferenceContext";

export default function USFMRenderer({ usfm, selectedVerse, onVerseClick }) {
  const { updateReference } = useContext(ReferenceContext);

  const [options, setOptions] = useState({
    sectionable: true,
    blockable: true,
    editable: false,
    preview: true,
  });

  const handleBlockClick = (block) => {
    console.log("📝 Block clicked:", block);

    if (block?.content) {
      const verseMatch = block.content.match(/\\v\s+(\d+)/);
      if (verseMatch) {
        const verseNum = parseInt(verseMatch[1]);
        updateReference({ verse: verseNum });
        if (onVerseClick) {
          onVerseClick(verseNum);
        }
      }
    }
  };

  const handleSectionClick = (selection) => {
    console.log("📖 Selection clicked:", selection);

    if (selection?.content) {
      const chapterMatch = selection.content.match(/\\c\s+(\d+)/);
      if (chapterMatch) {
        const chapterNum = parseInt(chapterMatch[1]);
        updateReference({ chapter: chapterNum });
      }
    }
  };

  return (
    <div>
      <UsfmEditor
        content={usfm}
        options={options}
        sectionIndex={-1}
        handlers={{
          onSectionClick: handleSectionClick,
          onBlockClick: handleBlockClick,
        }}
      />
    </div>
  );
}
```

## Testing & Verification

### Verify Event Handlers Working

Look for these console logs when clicking content:

```
📝 Block clicked: [object Object]
📖 Selection clicked: [object Object]
```

### Verify Options Applied

Check that the rendered content reflects your option settings:

- `sectionable: true` → Sections can be clicked
- `blockable: true` → Blocks can be clicked
- `preview: true` → Content displayed in readable format
- `editable: false` → Content not editable

## Troubleshooting

### Event Handlers Not Working

**Symptoms:**

- Console errors: "Unknown event handler property"
- No click events detected

**Solution:**

- Ensure using `handlers` object structure
- Verify function names match: `onSectionClick`, `onBlockClick`

### No Verse Content Visible

**Symptoms:**

- Only titles and headers render
- No verse numbers or verse text

**Likely Cause:**

- **USFM was preprocessed (DO NOT DO THIS - see warning above)**
- Alignment data interference
- Corrupted USFM content

**Solution:**

- **Ensure USFM is passed raw/unprocessed to the component**
- Check USFM content format and structure

### Console Warnings

**Symptoms:**

- React warnings about `defaultProps`

**Resolution:**

- These are library warnings, not errors
- Do not affect functionality
- Can be ignored unless upgrading library

## Related Files

- `src-new/components/ScripturePanelRCL/USFMRenderer.jsx` - Main implementation
- `src-new/components/ScripturePanelRCL/ScripturePanelRCL.jsx` - Parent component
- `src-new/utils/usfmProcessor.js` - USFM preprocessing utilities
- `package.json` - Dependency version specification

## Version History

| Version | Notes                                                 |
| ------- | ----------------------------------------------------- |
| v6.16.0 | Current version. Handlers object required for events. |

---

**Last Updated:** 2025-06-06  
**Verified With:** simple-text-editor-rcl v6.16.0
