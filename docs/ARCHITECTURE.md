# 🏗️ Architecture Overview: translationHelps Viewer

This document provides a high-level overview of the translationHelps Viewer architecture, including component hierarchy, data flow, and key design decisions.

---

## 🎯 Architectural Principles

### Clean-Slate Rewrite Philosophy

The current `src-new/` implementation follows a clean-slate rewrite approach with these principles:

- **Separation of Concerns**: Clear boundaries between UI, state, services, and utilities
- **Service-Based Architecture**: Dedicated services for each resource type
- **Context-Driven State**: React Context for global state management
- **Testability**: Comprehensive test coverage for all layers
- **Performance**: Optimized loading and caching strategies

### Modern React Patterns

- **Functional Components**: All components use React hooks
- **Context Providers**: Global state via React Context
- **Custom Hooks**: Reusable logic encapsulation
- **Error Boundaries**: Graceful error handling
- **Strict Mode**: Development-time checks and warnings

---

## 🏢 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser Application                       │
├─────────────────────────────────────────────────────────────┤
│  UI Layer (Components)                                      │
│  ├── App.jsx (Context Providers)                           │
│  ├── MainView.jsx (Layout Orchestration)                   │
│  ├── Navigation (Book/Chapter/Verse Selection)             │
│  ├── Scripture Panel (Text Display)                        │
│  └── Helps Panels (tN, tQ, tW, TWL, tA)                   │
├─────────────────────────────────────────────────────────────┤
│  State Management Layer (Context)                          │
│  ├── ReferenceContext (Current verse, org, language)      │
│  ├── ManifestsContext (Resource manifests)                 │
│  ├── MultiManifestsContext (Multi-org manifests)          │
│  └── ResourcesContext (Loaded resource data)              │
├─────────────────────────────────────────────────────────────┤
│  Business Logic Layer (Hooks & Services)                   │
│  ├── Custom Hooks (useAppState, useLoadResources, etc.)   │
│  ├── Resource Services (tnService, tqService, etc.)       │
│  ├── DCS Client (Door43 API integration)                  │
│  └── Catalog Service (Resource discovery)                 │
├─────────────────────────────────────────────────────────────┤
│  Utility Layer                                             │
│  ├── Parsers (TSV, USFM, Markdown)                        │
│  ├── RC Link Utilities                                     │
│  └── Helper Functions                                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    External APIs                            │
│  ├── Door43 Content Service (DCS)                         │
│  ├── Git Repositories (Content Storage)                   │
│  └── Catalog API (Resource Discovery)                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧩 Component Hierarchy

### Application Structure

```
App (Context Providers)
└── ErrorBoundary
    └── MainView (Layout)
        ├── NavigationBar
        │   └── ReferenceSelector
        ├── ScripturePanel
        └── HelpsTabs
            ├── VerseTabs
            │   └── VerseView
            ├── TranslationNotesPanel
            ├── TranslationQuestionsPanel
            ├── TranslationWordsPanel
            ├── TWLPanel
            └── ArticlePanel
```

### Context Hierarchy

```
ReferenceContext (Global reference state)
├── ManifestsContext (Resource manifests)
│   └── MultiManifestsContext (Multi-org support)
└── ResourcesContext (Loaded content)
```

---

## 🔄 Data Flow Architecture

### 1. Initialization Flow

```
App Startup
    ↓
Load Context Providers
    ↓
Set Default Reference (Genesis 1:1)
    ↓
Trigger Manifest Loading
    ↓
Load Initial Resources
    ↓
Render UI
```

### 2. User Interaction Flow

```
User Selects Verse/Organization/Language
    ↓
ReferenceContext Updates
    ↓
Triggers useEffect in Components
    ↓
Components Call Service Functions
    ↓
Services Check Cache
    ↓
If Not Cached: Fetch from DCS
    ↓
Parse Data (TSV/Markdown/USFM)
    ↓
Cache Result
    ↓
Return to Component
    ↓
Component Updates UI
```

### 3. Resource Loading Flow

```
Service Called
    ↓
Check ManifestsContext for Resource Info
    ↓
Use dcsClient to Fetch Raw Content
    ↓
Parse Content via Utility Functions
    ↓
Filter/Transform Data
    ↓
Cache Result
    ↓
Return Structured Data
```

---

## 🎛️ Service Layer Architecture

### Core Services

| Service            | Responsibility                         | Key Functions                            |
| ------------------ | -------------------------------------- | ---------------------------------------- |
| `catalogService`   | Resource discovery via DCS Catalog API | `getLanguages()`, `getOrganizations()`   |
| `dcsClient`        | Raw content fetching from DCS          | `fetchResourceFile()`, `fetchManifest()` |
| `scriptureService` | Scripture text retrieval and parsing   | `getScriptureForVerse()`                 |
| `tnService`        | Translation Notes data                 | `getNotesForVerse()`                     |
| `tqService`        | Translation Questions data             | `getQuestionsForVerse()`                 |
| `twService`        | Translation Words articles             | `getArticlesForLinks()`                  |
| `twlService`       | Translation Words Links                | `getLinksForVerse()`                     |
| `taService`        | Translation Academy articles           | `getArticleByPath()`                     |

### Service Interface Pattern

All services follow a consistent interface pattern:

```javascript
// Standard service function signature
export async function getResourceForVerse(
  bookId, // String: book identifier
  chapter, // Number: chapter number
  verse, // Number: verse number
  organization = "unfoldingWord", // String: DCS organization
  languageId = "en" // String: language code
) {
  // 1. Check cache
  // 2. Load manifest if needed
  // 3. Fetch raw content
  // 4. Parse content
  // 5. Filter by reference
  // 6. Cache result
  // 7. Return structured data
}
```

---

## 🧠 State Management Strategy

### Context-Based State

The application uses React Context for global state management:

```javascript
// ReferenceContext - Current reference and org/language
const referenceState = {
  bookId: "gen",
  chapter: 1,
  verse: 1,
  organization: "unfoldingWord",
  languageId: "en",
};

// ManifestsContext - Resource manifests
const manifestsState = {
  tn: {
    /* manifest data */
  },
  tq: {
    /* manifest data */
  },
  tw: {
    /* manifest data */
  },
  // ... other resources
};

// ResourcesContext - Loaded content
const resourcesState = {
  scripture: {
    /* verse text */
  },
  notes: [
    /* tN entries */
  ],
  questions: [
    /* tQ entries */
  ],
  // ... other resources
};
```

### Custom Hooks for Logic

Business logic is encapsulated in custom hooks:

```javascript
// useAppState - Central application state
const { loading, error, resources } = useAppState();

// useLoadResources - Resource loading logic
const { loadResources } = useLoadResources();

// useManifest - Manifest management
const { manifest, loading } = useManifest(resourceType, organization, languageId);
```

---

## 📁 File Structure Organization

### Directory Structure

```
src-new/
├── main.jsx                 # Application entry point
├── components/              # React components
│   ├── App.jsx             # Root component with providers
│   ├── MainView.jsx        # Layout orchestration
│   ├── NavigationBar.jsx   # Reference selection
│   ├── ScripturePanel.jsx  # Scripture display
│   ├── HelpsTabs.jsx       # Tabbed interface
│   ├── TranslationNotesPanel.jsx
│   ├── TranslationQuestionsPanel.jsx
│   ├── TranslationWordsPanel.jsx
│   ├── TWLPanel.jsx
│   ├── ArticlePanel.jsx
│   ├── VerseTabs.jsx
│   ├── VerseView.jsx
│   ├── ReferenceSelector.jsx
│   └── ErrorBoundary.jsx
├── context/                 # React context providers
│   ├── ReferenceContext.jsx
│   ├── ManifestsContext.jsx
│   ├── MultiManifestsContext.jsx
│   └── ResourcesContext.jsx
├── hooks/                   # Custom React hooks
│   ├── useAppState.js
│   ├── useLoadResources.js
│   ├── useManifest.js
│   ├── useLanguages.js
│   ├── useOrganizations.js
│   ├── useResources.js
│   └── useTWL.js
├── services/                # Business logic services
│   ├── catalogService.js
│   ├── dcsClient.js
│   ├── scriptureService.js
│   ├── tnService.js
│   ├── tqService.js
│   ├── twService.js
│   ├── twlService.js
│   └── taService.js
└── utils/                   # Pure utility functions
    ├── contextHelpers.js
    ├── contextValidation.js
    ├── CustomProskomma.js
    ├── defaultReference.js
    ├── groupByVerse.js
    ├── languageMapping.js
    ├── markdownUtils.jsx
    ├── parseTsv.js
    ├── rcLinkUtils.jsx
    ├── rcUri.js
    ├── segmenter.js
    ├── tsvUtils.js
    └── workflowHelpers.js
```

### File Naming Conventions

- **Components**: PascalCase with `.jsx` extension
- **Hooks**: camelCase starting with `use` and `.js` extension
- **Services**: camelCase with `.js` extension
- **Utilities**: camelCase with `.js` or `.jsx` extension
- **Tests**: Same name as source file with `.test.js` or `.test.jsx`

---

## 🔗 Integration Points

### External API Integration

```javascript
// DCS API Integration
const dcsClient = {
  baseUrl: "https://git.door43.org",
  endpoints: {
    catalog: "/api/catalog",
    raw: "/{owner}/{repo}/raw/branch/master/{path}",
  },
};

// Resource Path Pattern
const resourcePath = `${organization}/${languageId}_${resourceType}`;
// Example: "unfoldingWord/en_tn"
```

### Resource Container (RC) Links

```javascript
// RC Link Pattern
const
```

// RC Link Resolution
const resolveRcLink = (rcUri, organization, languageId) => {
const [, lang, resourceType, category, path] = rcUri.match(rcLinkPattern);
return `${organization}/${languageId}_${resourceType}/${category}/${path}.md`;
};

// Example:
// rc://en/tw/dict/bible/kt/create
// → unfoldingWord/en_tw/dict/bible/kt/create.md

````

---

## 🚀 Performance Considerations

### Caching Strategy

```javascript
// Multi-level caching approach
const cache = {
  manifests: new Map(),    // Resource manifests
  resources: new Map(),    // Parsed resource data
  raw: new Map()          // Raw file content
};

// Cache key pattern
const cacheKey = `${organization}:${languageId}:${resourceType}:${bookId}:${chapter}:${verse}`;
````

### Lazy Loading

- **Manifests**: Loaded on demand when resource is first accessed
- **Resources**: Fetched only when user navigates to specific verse
- **Components**: React.lazy() for code splitting (future enhancement)

### Memory Management

- **LRU Cache**: Automatic cleanup of least recently used resources
- **Weak References**: For large data structures where appropriate
- **Cleanup**: useEffect cleanup functions prevent memory leaks

---

## 🧪 Testing Strategy

### Test Coverage by Layer

| Layer      | Test Type             | Coverage            |
| ---------- | --------------------- | ------------------- |
| Components | React Testing Library | Unit + Integration  |
| Services   | Jest                  | Unit + Mocked API   |
| Utilities  | Jest                  | Unit + Edge Cases   |
| Hooks      | React Testing Library | Custom Hook Testing |
| Context    | Jest                  | Provider Testing    |

### Test Patterns

```javascript
// Component Testing
import { render, screen } from "@testing-library/react";
import { TranslationNotesPanel } from "./TranslationNotesPanel";

test("displays notes for selected verse", async () => {
  render(<TranslationNotesPanel reference={{ bookId: "gen", chapter: 1, verse: 1 }} />);

  await waitFor(() => {
    expect(screen.getByText(/translation notes/i)).toBeInTheDocument();
  });
});

// Service Testing
import { getNotesForVerse } from "./tnService";
import { dcsClient } from "./dcsClient";

jest.mock("./dcsClient");

test("fetches and parses translation notes", async () => {
  dcsClient.fetchResourceFile.mockResolvedValue(mockTsvContent);

  const notes = await getNotesForVerse("gen", 1, 1);

  expect(notes).toEqual(expectedNotesArray);
});
```

---

## 🔄 Error Handling Strategy

### Error Boundary Implementation

```javascript
// ErrorBoundary.jsx
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Application error:", error, errorInfo);
    // Optional: Send to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

### Service-Level Error Handling

```javascript
// Graceful degradation pattern
export async function getResourceWithFallback(params) {
  try {
    return await getPrimaryResource(params);
  } catch (primaryError) {
    console.warn("Primary resource failed, trying fallback:", primaryError);

    try {
      return await getFallbackResource(params);
    } catch (fallbackError) {
      console.error("All resource sources failed:", fallbackError);
      throw new Error(`Resource unavailable: ${fallbackError.message}`);
    }
  }
}
```

---

## 📈 Scalability Considerations

### Code Organization

- **Modular Architecture**: Each resource type has dedicated service
- **Shared Utilities**: Common functionality abstracted into utils
- **Interface Consistency**: All services follow same patterns
- **Type Safety**: JSDoc comments provide type hints

### Future Enhancements

- **Code Splitting**: React.lazy() for component-level code splitting
- **Service Workers**: Offline support and background sync
- **Virtual Scrolling**: For large datasets (verse lists, search results)
- **Internationalization**: i18n framework for UI text translation

### Plugin Architecture (Future)

```javascript
// Extensible plugin system for custom resource types
const pluginRegistry = {
  registerResourceType(type, service) {
    this.services[type] = service;
  },

  getService(type) {
    return this.services[type];
  },
};
```

---

## 📚 Summary

The translationHelps Viewer architecture provides:

- **Clean Separation**: Clear boundaries between UI, state, services, and utilities
- **Scalable Design**: Service-based architecture supports multiple resource types
- **Modern React**: Hooks, Context, and functional components throughout
- **Performance**: Multi-level caching and lazy loading strategies
- **Testability**: Comprehensive test coverage at all layers
- **Maintainability**: Consistent patterns and clear documentation
- **Extensibility**: Plugin-ready architecture for future enhancements

This architecture supports the current feature set while providing a foundation for future growth and enhancement.
