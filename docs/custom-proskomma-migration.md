# CustomProskomma Migration Guide

## Overview

We've successfully ported the core functionality from the `uw-proskomma` npm package into a local `CustomProskomma` class. This gives us the benefits of the unfoldingWord conventions without the dependency on an outdated package.

## What's Changed

### 1. New CustomProskomma Class

- **Location**: `src-new/utils/CustomProskomma.js`
- **Features Ported**:
  - Organization-based selectors (org/lang_abbr format)
  - Automatic USFM preprocessing (converts `\s5` to `\ts\*`)
  - Custom tags support structure
  - Selector validation

### 2. Updated ProskommaScriptureContext

- Now imports and uses `CustomProskomma` instead of direct `Proskomma`
- Includes organization extraction from manifest
- DocSetId format is now: `org/lang_abbr` (e.g., `unfoldingWord/en_TIT`)

## Key Features

### Organization-Based Selectors

```javascript
{
  org: "unfoldingWord",    // Organization identifier
  lang: "en",              // Language code
  abbr: "TIT"              // Book abbreviation
}
```

### USFM Preprocessing

- Automatically converts `\s5` tags to `\ts\*` for compatibility
- This happens transparently during document import

### Selector String Format

- Format: `org/lang_abbr`
- Example: `unfoldingWord/en_TIT`

## How to Use

### Basic Usage

```javascript
import { CustomProskomma } from "../utils/CustomProskomma";

const pk = new CustomProskomma();
pk.importDocument({ org: "unfoldingWord", lang: "en", abbr: "TIT" }, "usfm", usfmContent);
```

### In Context Provider

The `ProskommaScriptureProvider` automatically:

1. Extracts the organization from manifest (defaults to "unfoldingWord")
2. Extracts language from manifest
3. Extracts book ID from USFM header
4. Imports the document with proper selectors

## Testing

Run the unit tests to verify the implementation:

```bash
npm test src-new/utils/CustomProskomma.test.js
```

## Benefits

1. **No External Dependencies**: We control the code and updates
2. **Compatibility**: Aligns with unfoldingWord conventions
3. **Flexibility**: Can easily add or modify features as needed
4. **Performance**: No overhead from unused features

## Migration Notes

### If You Were Using Direct Proskomma

- The API is mostly the same
- Main difference: selectors now include `org` field
- DocSetId format changed from `lang_abbr` to `org/lang_abbr`

### If You Were Planning to Use uw-proskomma

- You now have the same functionality without the npm dependency
- The implementation is cleaner and more maintainable
- You avoid version mismatch issues

## Future Enhancements

If needed, you can easily extend CustomProskomma with:

- Additional USFM preprocessing rules
- Custom query methods
- Caching mechanisms
- Multi-document management

## Troubleshooting

### Common Issues

1. **DocSetId Format Changed**

   - Old: `en_TIT`
   - New: `unfoldingWord/en_TIT`
   - Update any code that expects the old format

2. **Organization Not Found**

   - The context will use "unfoldingWord" as default
   - Can be overridden by manifest fields: `owner` or `organization`

3. **USFM Preprocessing**
   - The `\s5` to `\ts\*` conversion is automatic
   - If you need to disable it, modify the `importDocuments` method

## Conclusion

The CustomProskomma implementation provides all the benefits of uw-proskomma while giving you full control over the code. It's a cleaner, more maintainable solution that aligns with unfoldingWord conventions without external dependencies.
