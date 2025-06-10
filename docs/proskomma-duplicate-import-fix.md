# Proskomma Duplicate Import Fix

## Problem

When navigating between chapters in the same book, the ScripturePanelRCL component was attempting to re-import the same book into Proskomma, causing the error:

```
Error importing scripture: Attempt to import document with bookCode 'MRK' which already exists in docSet unfoldingWord/en_mrk
```

## Root Cause

The component was not checking if a book was already imported into Proskomma before attempting to create new document configurations for import. Every time the chapter changed (even within the same book), it would try to re-import the entire USFM content.

## Solution

Added duplicate import prevention using the `useCatalog` hook from proskomma-react-hooks:

### Key Changes

1. **Added useCatalog Hook**: Imported and used `useCatalog` to check existing imports
2. **Book Import Detection**: Created logic to check if a book is already imported by examining the Proskomma catalog
3. **Conditional Document Creation**: Only create document configurations for `useImport` when the book is not already imported
4. **Optimized Loading**: Skip USFM re-fetching when book is already imported and content is available

### Implementation Details

```javascript
// Check what's already imported to prevent duplicate imports
const catalogHook = useCatalog({
  ...proskommaHook,
  verbose: false,
});

// Check if the current book is already imported
const isBookAlreadyImported = useMemo(() => {
  if (!organization || !languageId || !reference?.bookId || !catalogHook.catalog) {
    return false;
  }

  const docSetId = `${organization}/${languageId}_${reference.bookId}`;
  const docSets = catalogHook.catalog.docSets || [];

  const existingDocSet = docSets.find((ds) => ds.id === docSetId);
  const hasDocuments = existingDocSet && existingDocSet.nDocuments > 0;

  return hasDocuments;
}, [organization, languageId, reference?.bookId, catalogHook.catalog]);

// Create document configuration only when book is not already imported
const document = useMemo(() => {
  if (!usfmContent || !organization || !languageId || !reference?.bookId) return null;

  // Don't create document config if book is already imported
  if (isBookAlreadyImported) {
    console.log("📚 Book already imported, skipping document creation");
    return null;
  }

  return [
    {
      selectors: { org: organization, lang: languageId, abbr: reference.bookId },
      data: usfmContent,
      bookCode: reference.bookId,
    },
  ];
}, [usfmContent, organization, languageId, reference?.bookId, isBookAlreadyImported]);
```

### Loading Optimization

```javascript
// If book is already imported, we don't need to re-fetch the USFM content
if (isBookAlreadyImported && usfmContent) {
  console.log("📚 Book already imported and content available, skipping fetch");
  setError(null);
  setLoading(false);
  return;
}
```

## Benefits

1. **Eliminates Duplicate Import Errors**: No more attempts to re-import existing books
2. **Improved Performance**: Reduces unnecessary USFM fetching when navigating within the same book
3. **Better User Experience**: Faster chapter navigation within the same book
4. **Debugging Support**: Added console logs to track import decisions

## Testing

Created comprehensive tests in `ScripturePanelRCL.duplicate-fix.test.jsx` that verify:

- Import skipping when book is already in Proskomma catalog
- Normal import process when book is not yet imported
- Reuse of existing content when changing chapters within the same book
- Appropriate logging messages for debugging

## Files Modified

- `src-new/components/ScripturePanelRCL/ScripturePanelRCL.jsx`: Main fix implementation
- `src-new/components/ScripturePanelRCL/ScripturePanelRCL.duplicate-fix.test.jsx`: Test coverage

## Impact

This fix resolves the duplicate import issue while maintaining all existing functionality and improving performance for chapter navigation within the same book.
