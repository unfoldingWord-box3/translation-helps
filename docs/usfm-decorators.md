# USFM Decorators in simple-text-editor-rcl

> **Migration Note (2025-06):**  
> The previous `milestoneDecorators` utility has been **removed**. All milestone and custom USFM tag handling is now managed by the unified `usfmDecorators` module (`src-new/utils/usfmDecorators.js`).  
> This change consolidates all decorator logic, supports both standard and custom tags, and enables easier future enhancements.
>
> - All references to `milestoneDecorators` have been removed.
> - If you previously used or extended `milestoneDecorators`, migrate your logic to the new `usfmDecorators` API.
> - See the API documentation below for usage examples and extension points.
>
> | Old Utility         | Status  | Replacement    | Notes                                  |
> | ------------------- | ------- | -------------- | -------------------------------------- |
> | milestoneDecorators | Removed | usfmDecorators | Unified, extensible, supports all tags |

> **NOTE:** The following section documents the legacy decorator mappings (class-based).  
> For the current implementation using custom tags, see the section **Custom Tag Decorator Mappings (Current)** below.

---

## Legacy Decorator Mappings (Class-Based)

This document outlines the default decorators used in the `UsfmEditor` component of the `simple-text-editor-rcl` package. These decorators use regular expressions to find and replace USFM markers with HTML spans for styling.

### Decorators

Below is a list of the most important legacy decorators, with their marker, regex, replacement, and an example output.

---

**\id**

- **Decorator Name:** header
- **Regex:** `(\\id(\n|.|$)+?)(?=(\\(id|ide|h|toc\d?|mt|[cspvr])|$))`
- **Replacement:** `<span class='header id'>$1</span>`
- **Example Output:** `<span class='header id'>\id GEN</span>`

---

**\ide**

- **Decorator Name:** header
- **Regex:** `(\\ide(\n|.|$)+?)(?=(\\(id|ide|h|toc\d?|mt|[cspvr])|$))`
- **Replacement:** `<span class='header ide'>$1</span>`
- **Example Output:** `<span class='header ide'>\ide UTF-8</span>`

---

**\h**

- **Decorator Name:** header
- **Regex:** `(\\h(\n|.|$)+?)(?=(\\(id|ide|h|toc\d?|mt|[cspvr])|$))`
- **Replacement:** `<span class='header h'>$1</span>`
- **Example Output:** `<span class='header h'>\h Titus</span>`

---

**\toc1**

- **Decorator Name:** header
- **Regex:** `(\\toc1(\n|.|$)+?)(?=(\\(id|ide|h|toc\d?|mt|[cspvr])|$))`
- **Replacement:** `<span class='header toc1'>$1</span>`
- **Example Output:** `<span class='header toc1'>\toc1 The Letter of Paul to Titus</span>`

---

**\toc2**

- **Decorator Name:** header
- **Regex:** `(\\toc2(\n|.|$)+?)(?=(\\(id|ide|h|toc\d?|mt|[cspvr])|$))`
- **Replacement:** `<span class='header toc2'>$1</span>`
- **Example Output:** `<span class='header toc2'>\toc2 Titus</span>`

---

**\toc3**

- **Decorator Name:** header
- **Regex:** `(\\toc3(\n|.|$)+?)(?=(\\(id|ide|h|toc\d?|mt|[cspvr])|$))`
- **Replacement:** `<span class='header toc3'>$1</span>`
- **Example Output:** `<span class='header toc3'>\toc3 Tit</span>`

---

**\mt**

- **Decorator Name:** header
- **Regex:** `(\\mt(\n|.|$)+?)(?=(\\(id|ide|h|toc\d?|mt|[cspvr])|$))`
- **Replacement:** `<span class='header mt'>$1</span>`
- **Example Output:** `<span class='header mt'>\mt Titus</span>`

---

**\ts**

- **Decorator Name:** header
- **Regex:** `(\\ts(\n|.|$)+?)(?=(\\(id|ide|h|toc\d?|mt|[cspvr])|$))`
- **Replacement:** `<span class='header ts'>$1</span>`
- **Example Output:** `<span class='header ts'>\ts*</span>`

---

**\c**

- **Decorator Name:** markers/numberForMarkers
- **Regex:** `(\\c +)(\d+)`
- **Replacement:** `$1<span class='number'>$2</span>`
- **Example Output:** `<span class='marker c'>\c </span><span class='number'>1</span>`

---

**\p**

- **Decorator Name:** markers
- **Regex:** `(\\p)`
- **Replacement:** `<span class='marker p'>$1</span>`
- **Example Output:** `<span class='marker p'>\p</span>`

---

**\v**

- **Decorator Name:** markers/numberForMarkers
- **Regex:** `(\\v +)(\d+)`
- **Replacement:** `$1<span class='number'>$2</span>`
- **Example Output:** `<span class='marker v'>\v </span><span class='number'>1</span>`

---

**\w**

- **Decorator Name:** w
- **Regex:** `/\\w\s([^|]+)\|([^\\*]+)\\w\*/g`
- **Replacement:** `<span class='w'>$1</span>`
- **Example Output:** `<span class='w'>Paul</span>`

---

**\zaln-s**

- **Decorator Name:** zaln
- **Regex:** `/\\zaln-s\s([^\\*]+)\\\*([\s\S]*?)\\zaln-e\\\*/g`
- **Replacement:** `<span class='zaln-s'>$1</span>$2<span class='zaln-e'></span>`
- **Example Output:** `<span class='zaln-s'>...</span>...</span>`

---

**\f**

- **Decorator Name:** footnotes
- **Regex:** `(\\f (.|\\n)+?(\\f\\*))`
- **Replacement:** `<span class='footnote'>$1</span>`
- **Example Output:** `<span class='footnote'>\f ...\f*</span>`

---

**\fe**

- **Decorator Name:** endnotes
- **Regex:** `(\\fe (.|\\n)+?(\\fe\\*))`
- **Replacement:** `<span class='endnote'>$1</span>`
- **Example Output:** `<span class='endnote'>\fe ...\fe*</span>`

---

**attributes**

- **Decorator Name:** attributes
- **Regex:** `(\\|? ?x?-?[\w-]+=".*")`
- **Replacement:** `<span class='attribute'>$1</span>`
- **Example Output:** `<span class='attribute'>|x-occurrence="1"</span>`

---

# Custom Tag Decorator Mappings (Current)

## Purpose

This section defines the new decorator mappings for USFM markers, using custom HTML tags as required by the current rendering architecture.  
See [`docs/verse-1-test-case.md`](./verse-1-test-case.md) for the canonical output.

## Decorator Order and Mapping

**Decorator order is CRITICAL:**  
Decorators must be sorted from smallest scope (most deeply nested) to largest scope (most encompassing), i.e., "inside out". This ensures correct nesting and prevents decorators from interfering with each other.

**The order below is chosen to:**

1. Apply attribute decorators first, so that attributes are always nested inside the correct tag.
2. Apply word-level decorators (`w`) before alignment (`zaln`), so words are always inside alignments.
3. Apply alignment decorators before footnotes/endnotes, so notes can wrap aligned content if needed.
4. Apply verse, paragraph, section, and chapter decorators after all inline/word-level decorators, so they wrap the full content.
5. Book/major/TOC/title decorators are last, as they are the most encompassing.

### Mapping Table

| USFM Marker | Legacy Output (class-based)                                        | New Output (custom tag)                                                                                                                                                                 |
| ----------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| attributes  | `<span class="attribute">...</span>`                               | `<attributes>...</attributes>`                                                                                                                                                          |
| \w          | `<span class="w">...</span>`                                       | `<word><marker class="w">\w </marker><content>...</content><attributes>...</attributes><marker class="w*">\w*</marker></word>`                                                          |
| \zaln-s     | `<span class="zaln-s">...</span>...</span>`                        | `<zaln><marker class="zaln-s">\zaln-s </marker><attributes>...</attributes><marker class="*">\*</marker>...<marker class="zaln-e">\zaln-e</marker><marker class="*">\*</marker></zaln>` |
| \f          | `<span class="footnote">...</span>`                                | `<footnote>...</footnote>` (planned)                                                                                                                                                    |
| \fe         | `<span class="endnote">...</span>`                                 | `<endnote>...</endnote>` (planned)                                                                                                                                                      |
| \v          | `<span class="marker v">...</span><span class="number">...</span>` | `<v><marker>\\v </marker><number>...</number>...</v>`                                                                                                                                   |
| \p          | `<span class="marker p">...</span>`                                | `<p><marker>\\p</marker></p>`                                                                                                                                                           |
| \s          | `<span class="header s">...</span>`                                | `<header class="s"><marker class="marker s">\\s </marker>...</header>`                                                                                                                  |
| \c          | `<span class="marker c">...</span><span class="number">...</span>` | `<c><marker>\\c </marker><number>...</number></c>`                                                                                                                                      |
| \h          | `<span class="header h">...</span>`                                | `<header class="h"><marker class="marker h">\\h </marker>...</header>`                                                                                                                  |
| \mt         | `<span class="header mt">...</span>`                               | `<header class="mt"><marker class="marker mt">\\mt </marker>...</header>`                                                                                                               |
| \toc1       | `<span class="header toc1">...</span>`                             | `<header class="toc1"><marker class="marker toc1">\\toc1 </marker>...</header>`                                                                                                         |
| \toc2       | `<span class="header toc2">...</span>`                             | `<header class="toc2"><marker class="marker toc2">\\toc2 </marker>...</header>`                                                                                                         |
| \toc3       | `<span class="header toc3">...</span>`                             | `<header class="toc3"><marker class="marker toc3">\\toc3 </marker>...</header>`                                                                                                         |
| ...         | ...                                                                | ...                                                                                                                                                                                     |

## Rationale

- The new mapping enables semantic HTML and matches the output required for downstream processing and tests.
- The decorator order ensures correct nesting and prevents decorators from interfering with each other.
- The legacy mapping is preserved above for reference only.

## Migration Guidance

- When porting or updating decorators, always refer to the "Custom Tag Decorator Mappings (Current)" section and `verse-1-test-case.md`.
- The canonical implementation is in [`src-new/utils/usfmDecorators.js`](../src-new/utils/usfmDecorators.js).

## See Also

- [`docs/verse-1-test-case.md`](./verse-1-test-case.md) (source of truth for output)
- [`src-new/utils/usfmDecorators.js`](../src-new/utils/usfmDecorators.js) (implementation)

---

## Migration Checklist for New Tag Implementation

- [x] **Decorator Implementation:** All USFM markers in the new mapping are implemented in `src-new/utils/usfmDecorators.js`.
- [x] **Rendering Pipeline:** Rendering components (`CustomUsfmEditor.jsx`, `USFMRenderer.jsx`, etc.) pass the new decorators and do not escape custom tags.
- [x] **CSS/Styling:** CSS is updated or created for new tags (e.g., `usfm-custom-tags.css`), and legacy class-based CSS is removed or refactored.
- [x] **Tests:** All tests for USFM rendering assert on custom tags, not legacy spans. Add new tests for any new markers or edge cases.
- [x] **Documentation:** This file and related docs are kept up to date as the single source of truth for both legacy and new mappings.
- [ ] **Downstream Consumers:** Any downstream code or tools that expect the old structure are updated to work with new custom tags.
- [x] **Migration/Transition:** All references to legacy decorators are clearly marked, and migration notes or TODOs are added as needed.
