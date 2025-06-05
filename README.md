# unfoldingWord translationHelps Viewer

[https://unfoldingword.bible/content/]

## Purpose

All resources are currently integrated into the unfoldingWord Scripture drafting tool, translationStudio to aid in the translation process. Resources are also being integrated into the unfoldingWord Scripture checking tool, translationCore to aid in the checking process.

Outside of using tS, tC or downloading PDF files of the resources, there is a need to consume these resources in a similar Just in Time method that displays relevant information in an efficient manner.

### Use cases

- Drafting using tools other than tS including Autographa and even basic pen and paper.
- Community checking printed copies of translations where tC is not practical.
- Bible study and reference when drafting and checking are not taking place.

## Resource Integration

Resources are categorized by two categories. This is not an exclusive list of unfoldingWord resources.

### Scope

Most of these resources are in progress. The New Testament resources in English are complete enough to use.

### Scripture

- ULT - unfoldingWord Literal Text
- UST - unfoldingWord Simplified Text
- UGNT - unfoldingWord Greek New Testament

### translationHelps

- tN - translationNotes
- tA - translationAcademy
- tQ - translationQuestions
- tW - translationWords
- TWL - translationWords Links

## Development Environment

This project requires **Node.js 12.x–16.x**. To manage multiple Node versions easily, use [nvm](https://github.com/nvm-sh/nvm). A `.nvmrc` file is included to automatically select the correct version:

```bash
# Install and switch to the version specified in .nvmrc
nvm install
nvm use
```

After switching Node.js versions, reinstall dependencies. If you previously installed modules under a different Node version, remove your `node_modules` directory and run:

```bash
rm -rf node_modules
npm install
```

If you prefer not to use nvm and are running Node 17 or above, you can fall back to the legacy OpenSSL provider:

```bash
export NODE_OPTIONS=--openssl-legacy-provider
```

### Running the development server

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the dev server:

   ```bash
   npm run dev
   ```

   Or with yarn:

   ```bash
   yarn dev
   ```

### Debugging Dev Server Blank Screen

If the development server launches a blank page, check the following:

- Ensure `index.html` at project root contains a `<div id="root">`.
- Verify `src-new/main.jsx` mounts the `<App />` component using `ReactDOM.createRoot`.
- Wrap `<App />` with `BrowserRouter` and configure a `<Route path="/" element={<MainView />} />` in `App.jsx`.
- Open the browser console to inspect any import or runtime errors.
- Add an `ErrorBoundary` to catch render-time exceptions in the UI.

### Clearing Vite Optimization Cache

If you encounter 504 Gateway Timeout errors when loading optimized dependencies (e.g., `yaml.js`), clear the Vite dependency cache:

```bash
rm -rf node_modules/.vite
yarn dev
```

To avoid internal module resolution errors in the `yaml` package when building with Vite, add the following alias to your `vite.config.ts`:

```ts
resolve: {
  alias: {
    'yaml': 'yaml/browser'
  }
}
```

## Technical Overview

All resources are managed in Git repositories on (DCS)[https://git.door43.org]. Each repository is organized in a Resource Container Spec (RC). Each RC has a manifest that contains metadata about included resource projects. Each project has metadata including information such as the book id and relative paths to included project files. By fetching the project file it can then be parsed by file type. Each resource project's data can then be integrated based on the relevant alignments and tags that link the resources together.

### Relationships

The relationships between the resources can be used to display relevant information where appropriate.

- ULT - (primary text organized by reference)
  - tN (tagged to UGNT and ULT by reference and quote)
    - tA (links in tN)
  - UGNT (aligned in ULT)
    - tW (tagged in UGNT)
  - tQ (tagged by reference)
  - UST - (secondary text organized by reference)
