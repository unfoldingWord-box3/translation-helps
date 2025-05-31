<!--
Resolved: true
status: open
priority: medium
created: 2025-06-07
tags: [rewrite, helpers, utils]
-->

# 🧰 Issue: Consolidate helper utilities and deprecate scattered helper functions

## Description

Multiple helper functions (e.g., TSV parsers, RC URI parsers, grouping utilities) are scattered throughout component folders, and the `parseTsv` function is embedded in `src/services/twlService.js`. To improve modularity and testability, extract and centralize these helpers into `src/utils`, remove unused or outdated helper.js files, and update references accordingly.

## ✅ Acceptance Criteria

- [ ] Create `src/utils/parseTsv.ts`, `src/utils/getRcUriParts.ts`, and `src/utils/groupByVerse.ts` with unit tests.
- [ ] Update `twlService.js` (or module hooks) to use the centralized `parseTsv` utility.
- [ ] Remove or deprecate inline helper definitions in `src/services` and component-level `helpers.js` files.
- [ ] Ensure no duplicate or outdated helper code remains.