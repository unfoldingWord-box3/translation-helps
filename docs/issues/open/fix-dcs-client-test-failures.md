<!--
status: open
Resolved: false
priority: high
created: 2025-05-31
tags: [testing, dcs-client, fetch, mocking]
-->

# Fix DCS Client Test Failures

## Issue Description

The `dcsClient.test.js` file contains 4 failing tests that need to be investigated and fixed. All tests are related to the DCS (Door43 Content Service) client functionality for fetching manifests and resource files.

## Failing Tests

### 1. `fetches and parses manifest.yaml correctly`

- **Error**: `expected "spy" to be called with arguments: [ Array(1) ]`
- **Details**: The mocked `fetch` function shows 0 calls, but the test expects it to be called with the manifest URL
- **Expected URL**: `https://git.door43.org/unfoldingWord/en_tn/raw/branch/master/manifest.yaml`

### 2. `throws when manifest fetch fails`

- **Error**: `promise resolved "{}" instead of rejecting`
- **Details**: The function should throw an error when the fetch response is not ok, but instead it's resolving with an empty object
- **Expected**: Should reject with "Failed to load manifest for en_tn: Not Found"

### 3. `fetches resource file correctly`

- **Error**: `expected "spy" to be called with arguments: [ Array(1) ]`
- **Details**: The mocked `fetch` function shows 0 calls, but the test expects it to be called with the resource file URL
- **Expected URL**: `https://git.door43.org/unfoldingWord/en_tn/raw/branch/master/gen.tsv`

### 4. `throws when resource file fetch fails`

- **Error**: `promise resolved "''" instead of rejecting`
- **Details**: The function should throw an error when the fetch response is not ok, but instead it's resolving with an empty string
- **Expected**: Should reject with "Failed to load gen.tsv for en_tn: Error"

## Root Cause Analysis

The test failures suggest one of the following issues:

1. **Mocking Issue**: The global `fetch` mock may not be properly intercepting the actual fetch calls made by the dcsClient functions
2. **Import/Export Issue**: There may be a problem with how the functions are being imported or exported
3. **Implementation Bug**: The functions may have logic errors that cause them to return early or not execute the fetch calls
4. **Async/Await Issue**: There may be timing or promise handling issues in the test setup

## Investigation Steps

1. **Verify Mock Setup**: Ensure that the global fetch mock is properly configured and intercepting calls
2. **Debug Function Execution**: Add logging to verify that the functions are being called and executing the expected code paths
3. **Check Error Handling**: Verify that the error handling logic in both `fetchManifest` and `fetchResourceFile` is working correctly
4. **Test Isolation**: Ensure that the test environment is properly isolated and not interfering with the mocking

## Files Affected

- `src-new/services/dcsClient.test.js` (failing tests)
- `src-new/services/dcsClient.js` (implementation being tested)

## Priority

**High** - These test failures indicate potential issues with critical DCS integration functionality that could affect the entire application's ability to fetch translation resources.

## Acceptance Criteria

- [ ] All 4 tests in `dcsClient.test.js` pass
- [ ] The `fetchManifest` function correctly calls fetch with the expected URL
- [ ] The `fetchManifest` function correctly throws errors when fetch fails
- [ ] The `fetchResourceFile` function correctly calls fetch with the expected URL
- [ ] The `fetchResourceFile` function correctly throws errors when fetch fails
- [ ] Tests properly mock the global fetch function and verify its calls
- [ ] Error messages match the expected format and content

## Test Command

```bash
npm test src-new/services/dcsClient.test.js
```

## Related Tests

These failures may also be contributing to console errors and warnings seen in other component tests that depend on DCS client functionality.
