# Simple Text Editor RCL Integration

**Documentation for:** `simple-text-editor-rcl` v6.16.0
**Created:** 2025-06-06
**Last Updated:** 2025-06-07
**Purpose:** Document the correct API usage and integration patterns for the RCL library

## Overview

The `simple-text-editor-rcl` library provides USFM rendering capabilities for scripture content. This document captures the correct API usage patterns, focusing on a robust and maintainable implementation.

## Core Principles

1.  **No USFM Preprocessing:** Raw, unmodified USFM must be passed directly to the `UsfmEditor` component. Preprocessing the USFM string is a primary cause of rendering failures.
2.  **Custom Decorators for Alignment:** To handle complex alignment data (e.g., `\zaln-s`, `\w`), we use a system of custom decorators that transform USFM markers into semantic HTML tags (e.g., `<zaln>`, `<word>`).
3.  **Identical HTML Output:** The decorators produce the exact same HTML structure for both preview and non-preview modes. This ensures stability and predictability.
4.  **CSS for Styling:** All visual differences between modes (e.g., hiding markers in preview) are handled exclusively by CSS.

## Current Implementation

The current implementation uses a combination of custom decorators and a custom `block` component to achieve the desired rendering.

```javascript
// ✅ CURRENT IMPLEMENTATION: Custom decorators and component override
<UsfmEditor
  content={rawUsfmString}
  decorators={createMilestoneDecorators()}
  components={{
    block: ({ ...props }) => <div {...props} style={{ whiteSpace: "normal" }} />,
  }}
  {...otherProps}
/>
```

**See `docs/verse-1-test-case.md` for the target HTML structure.**

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
  options: {
    sectionable: true,
    blockable: true,
    editable: false,
    preview: true,
  },
  handlers: {
    // ✅ CRITICAL: Use handlers object
    onSectionClick: handleSectionClick,
    onBlockClick: handleBlockClick,
  },
  sectionIndex: -1, // -1 for full document
};

<UsfmEditor {...props} />;
```

## Known Issues & Limitations

### 1. Alignment Data Interference

**Problem:** Without custom decorators, USFM with heavy alignment markup can cause verse content to disappear in preview mode.

**Solution:** Our custom decorator system, implemented in `src-new/utils/milestoneDecorators.js`, resolves this by transforming the alignment markers into semantic HTML tags that can be styled with CSS.

### 2. Event Handler Console Warnings

The library may show warnings about `defaultProps` usage. These are React warnings about future deprecation and do not affect functionality.

## Related Files

- `src-new/components/ScripturePanelRCL/USFMRenderer.jsx` - Main implementation
- `src-new/utils/milestoneDecorators.js` - Custom decorator implementation
- `package.json` - Dependency version specification

## Version History

| Version | Notes                                                 |
| ------- | ----------------------------------------------------- |
| v6.16.0 | Current version. Handlers object required for events. |

---

**Verified With:** simple-text-editor-rcl v6.16.0
