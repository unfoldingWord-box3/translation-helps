# 🌐 DCS (Door43 Content Service) Integration

This document explains how the app integrates with the **Door43 Content Service (DCS)**, the Git-based platform that hosts translation resources such as ULT, UST, tN, tQ, tW, and TWL.

---

## 🏗 What is DCS?

**DCS** (Door43 Content Service) is a Git server that stores Bible translation and support resources in the form of **Resource Containers (RCs)**. These are structured Git repositories accessible via HTTP or Git protocols, each with a `manifest.yaml` describing its metadata.

Official DCS instance: [https://git.door43.org](https://git.door43.org)

---

## 📦 Resource Structure

Each DCS repository adheres to the **RC v0.2 spec** and contains:

- A `manifest.yaml` describing the resource
- Content in `.tsv`, `.md`, `.usfm`, or `.json` formats
- Language and resource metadata

Example resource URL:

```
https://git.door43.org/unfoldingWord/en_twl
```

To access a raw file from the `master` branch:

```
https://git.door43.org/unfoldingWord/en_twl/raw/branch/master/gen.tsv
```

---

## 🔍 Access Patterns in the App

The app uses DCS to:

- Dynamically load resources (e.g., tN, tW, TWL) at runtime
- Pull `.tsv` files by book from TWL or tQ repositories
- Retrieve and parse `manifest.yaml` for metadata
- Support offline caching for key resources

Example usage:

```js
const url = `https://git.door43.org/unfoldingWord/en_twl/raw/branch/master/${bookId}.tsv`;
const response = await fetch(url);
const tsvText = await response.text();
```

### 🧭 How Resource Discovery Works

The app uses a combination of context values and `manifest.yaml` files to discover which DCS repositories to access for a given project. The following steps outline how it identifies and retrieves resource data:

1. **Context Setup**:

   - The app tracks the current `organization`, `languageId`, `resourceId`, and `reference` (book, chapter, verse).
   - These values are used to compose DCS repository names, such as `en_tn`, `en_twl`, or `en_ult`.

2. **Repository Identification**:

   - Using the language and resource ID, the app forms URLs like:
     ```
     https://git.door43.org/unfoldingWord/en_tn
     ```
   - It assumes the repo adheres to the Resource Container (RC) structure.

3. **Manifest Retrieval**:

   - The app fetches the `manifest.yaml` file:
     ```
     https://git.door43.org/unfoldingWord/en_tn/raw/branch/master/manifest.yaml
     ```
   - This file lists metadata including available books and projects.

4. **Book File Access**:

   - From the manifest, the app determines available books.
   - For each selected book (e.g., `gen`), the app fetches its file based on format:
     - `.tsv` for tN, tQ, TWL
     - `.md` for tW
     - `.usfm` for ULT, UST, UGNT

5. **Content Parsing**:
   - After downloading, the app parses the file depending on type:
     - `.tsv`: tab-separated rows
     - `.md`: rendered as markdown with `rc://` link support
     - `.usfm`: parsed using `usfm-js` or equivalent

These steps are repeated for each resource enabled in the app context, and cached locally for reuse or offline access.

---

## 🔐 Authentication (If Needed)

Most DCS resources are public and do not require authentication. However, private resources or write operations would need:

- A registered user account on DCS
- A personal access token
- HTTPS Basic Auth or Git credentials for Git CLI usage

This app currently operates in **read-only, public-access mode**.

---

## 🧪 Testing DCS Access

Test DCS endpoints with:

- Browser inspection (open file links directly)
- `curl` or `fetch` in JavaScript
- Unit tests that mock `.tsv` file downloads

---

## 🚧 Limitations

- **Rate limits**: DCS does not currently impose strict API rate limits, but large-scale use should implement caching.
- **Branching**: Only the `master` branch is used for production access.
- **Offline mode**: For offline support, resource files must be bundled or cached in advance.

---

## 🏁 Summary

DCS acts as the backend for all Bible translation resources used in the app. It exposes a Git-backed content delivery layer that enables live access to `.tsv`, `.md`, and `.usfm` files structured around the RC model.

All new data integrations—such as TWL—rely on structured access to these DCS repositories.
