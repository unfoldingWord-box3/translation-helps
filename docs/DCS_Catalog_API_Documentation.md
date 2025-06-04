# DCS Catalog API Documentation

## Overview

The Door43 Content Service (DCS) Catalog API provides endpoints to discover organizations, languages, and resources available in the DCS repository. This document describes the correct usage of these APIs to prevent implementation errors.

## Base URL

```
https://git.door43.org/api/v1/catalog/list
```

## API Endpoints

### 1. Organizations/Owners

**Endpoint:** `GET /owners`

**URL:** `https://git.door43.org/api/v1/catalog/list/owners`

**Description:** Retrieves all organizations that have published content to DCS.

**Response Format:**

```json
{
  "data": [
    {
      "id": 613,
      "login": "unfoldingWord",
      "full_name": "unfoldingWord®",
      "email": "unfoldingword@noreply.door43.org",
      "avatar_url": "https://git.door43.org/avatars/1bc81b740b4286613cdaa55ddfe4b1fc",
      "html_url": "https://git.door43.org/unfoldingWord",
      "repo_languages": ["el-x-koine", "en", "fr", "hbo"],
      "repo_subjects": ["Aligned Bible", "Translation Academy", "Translation Words", "..."],
      "repo_metadata_types": ["rc"],
      "username": "unfoldingWord"
    }
  ],
  "ok": true
}
```

**Key Fields:**

- `data[].login`: Organization identifier (use this for subsequent API calls)
- `data[].full_name`: Display name for the organization

**Implementation Example:**

```javascript
const response = await fetch("https://git.door43.org/api/v1/catalog/list/owners");
const apiResponse = await response.json();
const organizations = apiResponse.data
  .filter((org) => org && org.login)
  .map((org) => org.login)
  .sort();
```

### 2. Languages

**Endpoint:** `GET /languages`

**URL:** `https://git.door43.org/api/v1/catalog/list/languages?owner={owner}`

**Parameters:**

- `owner` (required): Organization login from the owners endpoint

**Description:** Retrieves all languages available for a specific organization.

**Example URL:**

```
https://git.door43.org/api/v1/catalog/list/languages?owner=unfoldingWord
```

**Response Format:**

```json
{
  "data": [
    {
      "lc": "en",
      "ln": "English",
      "ang": "English",
      "cc": ["US", "GB", "CA", "AU"],
      "gw": true,
      "hc": "US",
      "ld": "ltr",
      "lr": "Americas",
      "pk": 1747
    }
  ],
  "ok": true
}
```

**Key Fields:**

- `data[].lc`: Language code (use this for subsequent API calls)
- `data[].ln`: Language display name
- `data[].ang`: English name for the language

**Implementation Example:**

```javascript
const owner = "unfoldingWord";
const url = `https://git.door43.org/api/v1/catalog/list/languages?owner=${encodeURIComponent(
  owner
)}`;
const response = await fetch(url);
const apiResponse = await response.json();
const languages = apiResponse.data
  .filter((lang) => lang && lang.lc)
  .map((lang) => lang.lc)
  .sort();
```

### 3. Resources/Subjects

**Endpoint:** `GET /subjects`

**URL:** `https://git.door43.org/api/v1/catalog/list/subjects?owner={owner}&lang={language}`

**Parameters:**

- `owner` (required): Organization login from the owners endpoint
- `lang` (required): Language code from the languages endpoint

**Description:** Retrieves all resource types/subjects available for a specific organization and language combination.

**Example URL:**

```
https://git.door43.org/api/v1/catalog/list/subjects?owner=unfoldingWord&lang=en
```

**Response Format:**

```json
{
  "data": [
    "Aligned Bible",
    "Greek New Testament",
    "Hebrew Old Testament",
    "Open Bible Stories",
    "Translation Academy",
    "Translation Notes",
    "Translation Questions",
    "Translation Words",
    "TSV Translation Notes",
    "TSV Translation Questions",
    "TSV Translation Words Links"
  ],
  "ok": true
}
```

**Key Fields:**

- `data[]`: Array of resource/subject names (strings)

**Implementation Example:**

```javascript
const owner = "unfoldingWord";
const language = "en";
const url = `https://git.door43.org/api/v1/catalog/list/subjects?owner=${encodeURIComponent(
  owner
)}&lang=${encodeURIComponent(language)}`;
const response = await fetch(url);
const apiResponse = await response.json();
const resources = apiResponse.data
  .filter((resource) => resource && typeof resource === "string")
  .sort();
```

## Common Response Structure

All DCS Catalog API endpoints return responses in the following format:

```json
{
  "data": <actual_data>,
  "ok": true|false
}
```

**Important Notes:**

- Always check `response.ok` first to ensure HTTP request succeeded
- Always access actual data via the `data` field
- The `ok` field in the JSON indicates API-level success
- `data` can be `null` if no results are found

## Error Handling

### HTTP Errors

```javascript
const response = await fetch(url);
if (!response.ok) {
  throw new Error(`API request failed: ${response.status} ${response.statusText}`);
}
```

### API Response Validation

```javascript
const apiResponse = await response.json();
if (!apiResponse || !apiResponse.data || !Array.isArray(apiResponse.data)) {
  // Use fallback data
  return fallbackData;
}
```

### Network Errors

```javascript
try {
  const response = await fetch(url);
  // ... handle response
} catch (error) {
  console.error("Network error:", error);
  // Use fallback data
  return fallbackData;
}
```

## Implementation Best Practices

### 1. URL Encoding

Always encode URL parameters to handle special characters:

```javascript
const url = `${BASE_URL}/languages?owner=${encodeURIComponent(owner)}`;
```

### 2. Data Validation

Filter out invalid entries:

```javascript
// For organizations
const validOrgs = data.filter((org) => org && org.login);

// For languages
const validLangs = data.filter((lang) => lang && lang.lc);

// For resources
const validResources = data.filter((resource) => resource && typeof resource === "string");
```

### 3. Caching

Implement caching to reduce API load:

```javascript
const cache = new Map();
const CACHE_TIMEOUT = 300000; // 5 minutes

function getCachedData(key) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TIMEOUT) {
    return cached.data;
  }
  return null;
}
```

### 4. Fallback Data

Always provide fallback data for when APIs fail:

```javascript
const FALLBACK_ORGANIZATIONS = ["unfoldingWord", "door43-catalog"];
const FALLBACK_LANGUAGES = ["en", "es", "fr", "pt"];
const FALLBACK_RESOURCES = ["ult", "ust", "tn", "tq", "tw"];
```

## Testing Guidelines

### 1. Mock API Responses

Use the correct response structure in tests:

```javascript
const mockApiResponse = {
  data: [{ login: "unfoldingWord", full_name: "unfoldingWord®" }],
  ok: true,
};
```

### 2. Test Error Scenarios

- Network failures
- HTTP error responses (404, 500, etc.)
- Invalid JSON responses
- Missing or null data fields
- Invalid data types

### 3. Validate URL Construction

Ensure URLs match the expected format:

```javascript
expect(fetch).toHaveBeenCalledWith(
  "https://git.door43.org/api/v1/catalog/list/languages?owner=unfoldingWord"
);
```

## Common Mistakes to Avoid

### ❌ Wrong URL Format

```javascript
// WRONG - Using path parameters
const url = `${BASE_URL}/languages/${owner}`;

// CORRECT - Using query parameters
const url = `${BASE_URL}/languages?owner=${encodeURIComponent(owner)}`;
```

### ❌ Incorrect Response Parsing

```javascript
// WRONG - Expecting direct array
const organizations = response;

// CORRECT - Accessing data field
const organizations = response.data;
```

### ❌ Missing Validation

```javascript
// WRONG - No validation
const orgs = data.map((org) => org.login);

// CORRECT - With validation
const orgs = data.filter((org) => org && org.login).map((org) => org.login);
```

### ❌ No Error Handling

```javascript
// WRONG - No error handling
const data = await fetch(url).then((r) => r.json());

// CORRECT - With error handling
try {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const data = await response.json();
  return data.data || fallbackData;
} catch (error) {
  console.error("API error:", error);
  return fallbackData;
}
```

## API Response Examples

### Organizations Response (Truncated)

```json
{
  "data": [
    {
      "id": 613,
      "login": "unfoldingWord",
      "full_name": "unfoldingWord®",
      "repo_languages": ["el-x-koine", "en", "fr", "hbo"],
      "repo_subjects": ["Aligned Bible", "Translation Academy"]
    },
    {
      "id": 4598,
      "login": "Door43-Catalog",
      "full_name": "Door43 Resource Catalog",
      "repo_languages": ["am", "ar", "as", "bn"],
      "repo_subjects": ["Bible", "Translation Notes"]
    }
  ],
  "ok": true
}
```

### Languages Response (Truncated)

```json
{
  "data": [
    {
      "lc": "en",
      "ln": "English",
      "ang": "English",
      "cc": ["US", "GB", "CA"],
      "gw": true
    },
    {
      "lc": "es",
      "ln": "español",
      "ang": "Spanish",
      "cc": ["ES", "MX", "AR"],
      "gw": true
    }
  ],
  "ok": true
}
```

### Resources Response

```json
{
  "data": [
    "Aligned Bible",
    "Translation Academy",
    "Translation Notes",
    "Translation Questions",
    "Translation Words",
    "TSV Translation Notes",
    "TSV Translation Questions",
    "TSV Translation Words Links"
  ],
  "ok": true
}
```

## Conclusion

This API provides a robust way to discover DCS content dynamically. Following these guidelines ensures reliable integration and prevents common implementation errors. Always validate responses, handle errors gracefully, and provide fallback data for the best user experience.
