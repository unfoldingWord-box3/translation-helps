
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
