# USFM Rendering with Proskomma.js

## Overview

As of June 2025, all USFM rendering in this project is handled using [Proskomma.js](https://github.com/Proskomma/Proskomma), a robust scripture parser and document model for USFM and USX. This replaces all previous decorator/regex-based approaches.

**Key advantages:**

- True USFM parsing (not regex/string replacement)
- Structured, queryable scripture model (books, chapters, verses, words, notes, etc.)
- Full support for complex USFM features (alignment, milestones, footnotes, etc.)
- Extensible and maintainable React rendering pipeline

---

## Architecture

### Pipeline

```mermaid
flowchart TD
    A[USFM String] --> B[Proskomma.js Parse]
    B --> C[Proskomma Document Model]
    C --> D[React Component Tree (Chapters, Verses, Words, Notes, etc.)]
    D --> E[Render with Custom Tags & CSS]
    E --> F[User Interaction & Navigation (Proskomma Model)]
```

### Key Components

- **ProskommaScriptureProvider** (`src-new/context/ProskommaScriptureContext.jsx`):  
  Parses USFM, provides the Proskomma document model via React context.

- **USFMRenderer** (`src-new/components/ScripturePanelRCL/USFMRenderer.jsx`):  
  Consumes the Proskomma context and renders scripture as a React component tree, grouped by chapters and verses.

- **ScripturePanelRCL** (`src-new/components/ScripturePanelRCL/ScripturePanelRCL.jsx`):  
  Loads USFM content and wraps USFMRenderer in the ProskommaScriptureProvider.

---

## Usage Example

```jsx
import { ProskommaScriptureProvider } from "src-new/context/ProskommaScriptureContext";
import USFMRenderer from "src-new/components/ScripturePanelRCL/USFMRenderer";

<ProskommaScriptureProvider usfm={usfmContent}>
  <USFMRenderer
    usfm={usfmContent}
    selectedVerse={reference.verse}
    onVerseClick={handleVerseClick}
  />
</ProskommaScriptureProvider>;
```

---

## Migration Notes

- **All decorator/regex-based rendering code and documentation has been removed.**
- **All scripture rendering is now based on the Proskomma document model.**
- **Obsolete files removed:**
  - `src-new/utils/usfmDecorators.js`
  - `src-new/components/ScripturePanelRCL/CustomUsfmEditor.jsx`
  - `src-new/components/ScripturePanelRCL/CustomUsfmEditor.test.jsx`
- **Tests and downstream consumers must assert on the new Proskomma-based output.**

---

## Further Reading

- [Proskomma.js Documentation](https://github.com/Proskomma/Proskomma)
- `src-new/context/ProskommaScriptureContext.jsx` (context/provider implementation)
- `src-new/components/ScripturePanelRCL/USFMRenderer.jsx` (React rendering logic)
