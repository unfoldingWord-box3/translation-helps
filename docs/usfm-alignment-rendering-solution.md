# USFM Alignment Rendering Solution

**Critical Issue Documentation**  
**Created:** 2025-06-07  
**Purpose:** Document the alignment milestone rendering problem and granular decorator solution

## The Problem

### Issue Description

USFM content with alignment data causes text to disappear in preview mode when using `simple-text-editor-rcl`. The actual readable text (e.g., "Paul") gets hidden along with the markup.

### Root Cause

The `simple-text-editor-rcl` library has a CSS rule that hides markers and attributes in preview mode:

```css
.usfm .preview .marker,
.usfm .preview .attribute {
  display: none;
}
```

However, the library's default decorators are **greedy** and wrap entire alignment structures in spans with these classes, including the actual content that should remain visible.

### Example Problem

**Input USFM:**

```
\zaln-s |x-strong="G39720" x-lemma="Παῦλος" x-morph="Gr,N,,,,,NMS," x-occurrence="1" x-occurrences="1" x-content="Παῦλος"\*\w Paul|x-occurrence="1" x-occurrences="1"\w*\zaln-e\*
```

**Library's Problematic Output:**

```html
<span class="attribute"
  >|x-strong="G39720" x-lemma="Παῦλος" x-morph="Gr,N,,,,,NMS," x-occurrence="1" x-occurrences="1"
  x-content="Παῦλος"\*<span class="marker w">\w </span>Paul|x-occurrence="1" x-occurrences="1"</span
>
```

**Result:** The entire content including "Paul" is wrapped in `class="attribute"` and gets hidden by the CSS rule.

## The Solution: Granular Decorators

### Core Principle

**CRITICAL: Decorators wrap content with classes - they NEVER remove or replace text.**

All decorators generate IDENTICAL HTML structure regardless of preview mode. Only CSS controls visibility differences.

Separate USFM alignment structures into distinct, non-greedy components:

1. **Marker** - The USFM marker itself (e.g., `\zaln-s`, `\w`) → Hidden in preview by CSS
2. **Content** - The actual text that needs to be displayed (e.g., "Paul") → Always visible
3. **Attributes** - The metadata (e.g., `|x-strong="G39720"...`) → Hidden in preview by CSS

**Key Requirements:**

- ALL original USFM text must be found in the `.text()` of the output HTML
- Preview and non-preview modes produce IDENTICAL HTML structures
- CSS classes control what's visible, not different decorator patterns

### Target Structure

Transform alignment milestones into granular HTML:

**Input:**

```
\zaln-s |x-strong="G39720"...\*\w Paul|x-occurrence="1"...\w*\zaln-e\*
```

**Desired Output:**

```html
<span class="milestone">
  <span class="marker">\zaln-s</span>
  <span class="attributes">|x-strong="G39720"...</span>
  <span class="word">
    <span class="marker">\w </span>
    <span class="content">Paul</span>
    <span class="attributes">|x-occurrence="1"...</span>
  </span>
  <span class="marker">\zaln-e</span>
</span>
```

### CSS Behavior

```css
.usfm .preview .marker,
.usfm .preview .attributes {
  display: none;
}
/* .content is always visible - no rule needed */
```

**Result:** Only "Paul" remains visible in preview mode, which is exactly what we want.

## Implementation Strategy

### 1. Granular Decorator Patterns

The key is using regex patterns that capture specific parts separately:

```javascript
// Alignment milestone start - separate marker, content, attributes
alignmentStart: [
    /(\\zaln-s)\s+(\|[^\\]*)(\\?\*)/g,
    '<span class="milestone"><span class="marker">$1</span><span class="attributes">$2</span><span class="marker">$3</span>'
],

// Word marker - separate marker, content, attributes
wordMarker: [
    /(\\w)\s+([^|\\]+)(\|[^\\]*)(\\w\*)/g,
    '<span class="word"><span class="marker">$1 </span><span class="content">$2</span><span class="attributes">$3</span><span class="marker">$4</span></span>'
],

// Alignment milestone end
alignmentEnd: [
    /(\\zaln-e)(\\?\*)/g,
    '<span class="marker">$1$2</span></span>'
]
```

### 2. Consistent Processing

**CRITICAL CHANGE:** Both preview and non-preview modes use IDENTICAL decorators.

**All Modes:**

- Apply the same granular decorators
- Generate identical HTML structure
- CSS controls visibility differences:
  - Preview: `.marker` and `.attributes` hidden by CSS
  - Source: All elements visible with syntax highlighting

### 3. Processing Order

Critical: Process decorators in the correct order to avoid conflicts:

1. Alignment start markers
2. Word markers (nested inside alignments)
3. Alignment end markers
4. Cleanup any remaining markers

## Code Examples

### Decorator Configuration

```javascript
export const createMilestoneDecorators = (previewMode = true) => {
  // CRITICAL: Same HTML structure for both preview and non-preview modes
  // CSS controls visibility via .usfm .preview .marker { display: none; }
  return {
    // Granular alignment milestone processing
    alignmentStart: [
      /(\\zaln-s)\s+(\|[^\\]*)(\\?\*)/g,
      '<span class="milestone"><span class="marker">$1 </span><span class="attributes">$2</span><span class="marker">$3</span>',
    ],

    wordMarker: [
      /(\\w)\s+([^|\\]+)(\|[^\\]*)(\\w\*)/g,
      '<span class="word"><span class="marker">$1 </span><span class="content">$2</span><span class="attributes">$3</span><span class="marker">$4</span></span>',
    ],

    alignmentEnd: [/(\\zaln-e)(\\?\*)/g, '<span class="marker">$1$2</span></span>'],

    // Additional decorators for other USFM elements
    chapterMarker: [
      /(\\c)\s+(\d+)(?=\\|$)/g,
      '<span class="chapter"><span class="marker">$1 </span><span class="content"><h2 class="chapter-heading">Chapter $2</h2></span></span>',
    ],

    verseMarker: [
      /(\\v)\s+(\d+)(?=\s|\\|$)/g,
      '<span class="verse-marker"><span class="marker">$1 </span><span class="content verse-number" data-verse="$2">$2</span></span> ',
    ],

    // All other markers follow the same pattern: separate marker, content, attributes
  };
};
```

### CSS Requirements

```css
/* Hide only markers and attributes in preview mode */
.usfm .preview .marker,
.usfm .preview .attributes {
  display: none;
}

/* Content is always visible */
.content {
  /* No display: none rule */
}

/* Optional: Style content for readability */
.word .content {
  /* Add any styling for the actual words */
}
```

## Testing & Verification

### Test Cases

1. **Simple Word Alignment:**

   ```
   \zaln-s |x-strong="G39720"\*\w Paul|x-occurrence="1"\w*\zaln-e\*
   ```

   Expected: "Paul" visible, all markup hidden

2. **Multiple Words:**

   ```
   \zaln-s |x-strong="G1161"\*\w And|x-occurrence="1"\w*\zaln-e\* \zaln-s |x-strong="G3972"\*\w Paul|x-occurrence="1"\w*\zaln-e\*
   ```

   Expected: "And Paul" visible, all markup hidden

3. **Complex Attributes:**
   ```
   \zaln-s |x-strong="G39720" x-lemma="Παῦλος" x-morph="Gr,N,,,,,NMS," x-occurrence="1" x-occurrences="1" x-content="Παῦλος"\*\w Paul|x-occurrence="1" x-occurrences="1"\w*\zaln-e\*
   ```
   Expected: "Paul" visible, all complex attributes hidden

### Verification Steps

1. Load USFM with alignment data
2. Toggle preview mode ON
3. Verify only actual words are visible
4. Toggle preview mode OFF
5. Verify all markup is visible but styled
6. Check that click handlers still work on words

## Common Pitfalls to Avoid

### 1. Greedy Regex Patterns

❌ **Wrong:** `/(\\w.*?\\w\*)/g` - captures everything including content
✅ **Correct:** `/(\\w)\s+([^|\\]+)(\|[^\\]*)(\\w\*)/g` - separates parts

### 2. Incorrect CSS Targeting

❌ **Wrong:** `.attribute { display: none; }` - hides content wrapped in attributes
✅ **Correct:** `.attributes { display: none; }` - hides only the attribute spans

### 3. Wrong Processing Order

❌ **Wrong:** Process end markers before start markers
✅ **Correct:** Process start → nested → end in sequence

### 4. Preprocessing USFM

❌ **Wrong:** Strip alignment data before passing to library
✅ **Correct:** Use custom decorators to handle alignment data properly

## Dependencies

- `simple-text-editor-rcl` v6.16.0 or compatible
- Decorator support in the library
- CSS override capability

## Files Modified

- `src-new/utils/milestoneDecorators.js` - Granular decorator implementation
- `src-new/components/ScripturePanelRCL/USFMRenderer.jsx` - Uses custom decorators
- `src/index.css` - CSS for hiding markers/attributes

## Performance Notes

The granular approach creates more DOM elements but:

- Improves content visibility (primary goal)
- Maintains semantic structure
- Enables better styling control
- Preserves click handler functionality

## Future Considerations

1. **Library Updates:** Monitor simple-text-editor-rcl for alignment handling improvements
2. **Performance:** Consider optimizations if DOM size becomes an issue
3. **Accessibility:** Ensure screen readers handle the structure appropriately
4. **Internationalization:** Test with non-Latin scripts in alignment data

---

**Key Takeaway:** Always separate USFM markers, content, and attributes into distinct spans. Never allow greedy patterns to wrap content that should remain visible.
