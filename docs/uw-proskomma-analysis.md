# UW-Proskomma Package Analysis

## Overview

The `uw-proskomma` npm package is a subclass of Proskomma specifically designed for unfoldingWord's use cases. This document analyzes whether it would be beneficial to adopt it in the translation-helps project.

## Package Details

- **NPM Package**: `uw-proskomma` (v0.8.5)
- **GitHub**: https://github.com/unfoldingWord-box3/uw-proskomma
- **Last NPM Publish**: 3 years ago
- **Recent GitHub Activity**: October 2024 (version updates)
- **License**: MIT

## What UW-Proskomma Provides

### 1. Extended Proskomma Class

```javascript
class UWProskomma extends Proskomma {
  // Custom implementation
}
```

### 2. Organization-Based Selectors

```javascript
selectors = [
  { name: "org", type: "string", regex: "^[^\\s]+$" },
  { name: "lang", type: "string", regex: "^[^\\s]+$" },
  { name: "abbr", type: "string", regex: "^[A-za-z0-9_-]+$" },
];
```

### 3. Custom Selector String Format

```javascript
selectorString(docSetSelectors) {
  return `${docSetSelectors.org}/${docSetSelectors.lang}_${docSetSelectors.abbr}`;
}
```

### 4. USFM Preprocessing

Automatically replaces `\s5` tags with `\ts\*`:

```javascript
contentStrings = contentStrings.map((cs) => cs.replace(/\\s5/g, "\\ts\\*"));
```

### 5. Custom Tags Support

```javascript
customTags = {
  heading: [],
  paragraph: [],
  char: [],
  word: [],
  intro: [],
  introHeading: [],
};
```

## Current Implementation Comparison

### Your Current Approach (ProskommaScriptureContext.jsx)

**Pros:**

- Direct and simple implementation
- Clear and understandable code
- No additional dependencies
- Already working with your manifest structure
- Full control over Proskomma instantiation

**Cons:**

- No built-in USFM preprocessing
- No organization-level namespace
- Manual selector handling

### Using UW-Proskomma

**Pros:**

- Standardized selector format with organization support
- Built-in USFM preprocessing (handles `\s5` tags)
- Aligned with unfoldingWord ecosystem
- Potential for additional features in the future

**Cons:**

- Additional dependency to maintain
- Package hasn't been updated on NPM in 3 years
- Would require refactoring your current implementation
- The organization selector might not be needed for your use case
- Version mismatch: NPM shows 0.8.5, but GitHub shows 1.0.0+

## Migration Considerations

If you decide to use `uw-proskomma`, here's what would need to change:

1. **Install the package**:

   ```bash
   npm install uw-proskomma
   ```

2. **Update imports**:

   ```javascript
   import { UWProskomma } from "uw-proskomma";
   ```

3. **Modify document import**:

   ```javascript
   const proskomma = new UWProskomma();
   proskomma.importDocuments({ org: "unfoldingWord", lang, abbr: bookId }, "usfm", [usfm], {});
   ```

4. **Update docSetId handling**:
   The docSetId format would change from `lang_bookId` to `org/lang_bookId`

## Recommendation

**For your current needs, I recommend staying with your direct Proskomma implementation** for the following reasons:

1. **Simplicity**: Your current implementation is straightforward and working
2. **Maintenance concerns**: The NPM package is 3 years old
3. **No critical features**: The main benefit (org-based namespacing and \s5 preprocessing) may not be essential for your use case
4. **Version alignment**: You're using Proskomma 0.9.3, while uw-proskomma might be on an older version

**Consider switching to uw-proskomma if:**

- You need organization-based namespacing
- You frequently work with USFM containing `\s5` tags
- You want to align more closely with unfoldingWord's ecosystem
- The package gets updated on NPM to match the GitHub version

## Alternative Approach

If you want some of the benefits without the dependency, you could create a small wrapper class in your project:

```javascript
// utils/CustomProskomma.js
import { Proskomma } from "proskomma";

export class CustomProskomma extends Proskomma {
  importDocument(selectors, contentType, contentString) {
    // Add any preprocessing here
    if (contentType === "usfm") {
      contentString = contentString.replace(/\\s5/g, "\\ts\\*");
    }
    return super.importDocument(selectors, contentType, contentString);
  }
}
```

This gives you the flexibility to add custom behavior without an external dependency.
