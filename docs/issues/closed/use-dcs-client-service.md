<!--
Resolved: true
status: open
priority: medium
created: 2025-06-07
tags: [rewrite, services, dcs]
-->

# 🛠️ Issue: Introduce a unified DCS client service

## Description

The clean-slate rewrite plan proposes a unified `dcsClient` service for fetching Door43 content (manifests, `.tsv`, `.md`). Currently, modules and services fetch directly via `fetch()`. Implement a centralized DCS client (`src/services/dcsClient.ts`) to handle URL construction, caching, and error handling.

## ✅ Acceptance Criteria

- [ ] Create `src/services/dcsClient.ts` exporting methods to fetch text files (`fetchText(urlPath: string)`).
- [ ] Refactor `getLinksForVerse` and module hooks to use `dcsClient`.
- [ ] Add unit tests for `dcsClient`, including caching and error scenarios.