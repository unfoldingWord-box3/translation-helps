# Original /src Implementation Documentation

## Overview

This document provides a comprehensive analysis of the original implementation in the `/src` directory, created approximately 6-8 years ago. This implementation serves as a reference for understanding the original architectural patterns, design decisions, and functionality that informed the current `src-new/` rewrite.

## Architecture Overview

### Technology Stack

- **React**: Class and functional components
- **Material-UI v4**: Using `@material-ui/core` with `withStyles` HOC pattern
- **Context API**: Multiple context providers for state management
- **React Suspense**: Lazy loading of workspace components
- **Local Storage**: Persistent state management
- **URL Query Parameters**: Context synchronization with browser history

### Core Architectural Patterns

#### 1. Context-Based State Management

The original implementation uses multiple React contexts for different aspects of application state:

```javascript
// Context.context.js - Main application context
export const ContextContext = createContext();

// History.context.js - Navigation history management
export const HistoryContext = createContext();

// Manifests.context.js - Resource manifest management
export const ManifestsContext = createContext();
```

#### 2. Container/Component Pattern

Clear separation between logic (Container) and presentation (Component):

```javascript
// Container.js - Handles scroll behavior and lifecycle
class Container extends React.Component {
  componentDidUpdate() {
    // Auto-scroll to verse reference
    const { reference } = this.props.context;
    if (reference) {
      const { bookId, chapter, verse } = reference;
      const id = `${bookId}_${chapter}_${verse}`;
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  }
}
```

#### 3. Lazy Loading and Code Splitting

Uses React.Suspense for dynamic component loading:

```javascript
const History = lazy(() => Promise.resolve().then(() => require("./History")));
const Resources = lazy(() => Promise.resolve().then(() => require("./Resources")));
const OpenBibleStories = lazy(() => Promise.resolve().then(() => require("./OpenBibleStories")));
const Scripture = lazy(() => Promise.resolve().then(() => require("./Scripture")));
```

## Component Hierarchy

### Top-Level Structure

```
src/
├── App.js                    # Main app with theme provider and context wrappers
├── ApplicationBar.js         # Top navigation bar
├── BottomNav.js             # Bottom navigation
├── Context.context.js       # Global application state
├── History.context.js       # Navigation history management
├── helpers.js               # Utility functions (validation, URL sync)
├── styles.js                # Material-UI styles
├── theme.js                 # Material-UI theme configuration
└── components/
    └── Viewer/
        ├── Viewer.js        # Manifest management wrapper
        ├── Manifests.context.js  # Resource manifest context
        ├── gitApi.js        # Git API interactions
        ├── helpers.js       # Viewer-specific utilities
        └── Workspace/
            ├── Container.js  # Scroll behavior and lifecycle
            ├── Component.js  # View routing and conditional rendering
            ├── History/      # Navigation history view
            ├── Resources/    # Resource selection view
            ├── Scripture/    # Scripture text view
            ├── OpenBibleStories/  # OBS-specific view
            └── TranslationHelps/
                ├── TranslationNotes/
                ├── TranslationWords/
                └── TranslationAcademy/
```

### Component Responsibilities

#### App.js

- **Purpose**: Root component with theme provider and context initialization
- **Key Features**:
  - Material-UI theme provider setup
  - Multiple context provider nesting
  - Context update handling with history integration
  - Manifest state management

```javascript
function App({ classes }) {
  const { context, updateContext } = useContext(ContextContext);
  const { history, addHistory } = useContext(HistoryContext);
  const [manifests, setManifests] = useState({});

  const setContext = (_context) => {
    addHistory(_context);
    updateContext(_context);
  };

  return (
    <MuiThemeProvider theme={theme}>
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <main className={classes.main}>
            <ApplicationBar
              applicationName='unfoldingWord'
              context={context}
              manifests={manifests}
            />
            <div className={classes.workspace}>
              <Viewer
                context={context}
                setContext={setContext}
                history={history}
                handleManifestsChange={setManifests}
              />
            </div>
          </main>
          <nav className={classes.bottomNav}>
            <BottomNav context={context} setContext={updateContext} />
          </nav>
        </div>
      </div>
    </MuiThemeProvider>
  );
}
```

#### Context.context.js

- **Purpose**: Global application state management
- **Key Features**:
  - URL query parameter synchronization
  - Context validation
  - Deep freeze for immutability
  - Auto-scroll to top on context changes

```javascript
const updateContext = async (_context) => {
  // allow navigation to Resources selection
  const emptyResourceId = !_context.reference || !_context.resourceId;
  let shouldSetContext;
  if (emptyResourceId) shouldSetContext = true;
  // use 'obs' for bookId if is resourceId
  if (_context.resourceId === "obs") {
    const reference = { ..._context.reference, bookId: "obs" };
    _context.reference = reference;
  }
  const validContext = validateContext(_context);
  // validate context
  if (validContext) shouldSetContext = true;
  if (shouldSetContext) {
    setContext(_context);
  }
};
```

#### History.context.js

- **Purpose**: Navigation history management with persistence
- **Key Features**:
  - Local storage persistence
  - History deduplication
  - Context-based history entries

```javascript
const addToHistoryArray = (_context, _history) => {
  let history = [];
  if (_history) history = [..._history];
  const newContext = JSON.stringify(_context);
  const oldContext = JSON.stringify(history[0]);
  const isNew = !(newContext === oldContext);
  if (isNew) {
    const context = JSON.parse(newContext);
    history.unshift(context);
  }
  return history;
};
```

## Key Features and Functionality

### 1. Auto-Scroll to Verse References

The Container component implements smooth scrolling to specific verse references:

```javascript
componentDidUpdate() {
  const {reference} = this.props.context;
  if (reference) {
    const {bookId, chapter, verse} = reference;
    const id = `${bookId}_${chapter}_${verse}`;
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }
}
```

### 2. URL Query Parameter Synchronization

Bidirectional synchronization between application context and URL:

```javascript
export const updateQueryFromContext = (context) => {
  let reference = context.reference || {};
  const _context = { ...context, reference };
  const {
    organization,
    languageId,
    resourceId,
    reference: { bookId, chapter, verse },
  } = _context;
  const _organization = organization ? `owner=${organization}` : "";
  const _languageId = languageId ? `/${languageId}` : "";
  const _resourceId = resourceId ? `/${resourceId}` : "";
  const _bookId = bookId ? `/${bookId}` : "";
  const _chapter = chapter ? `/${chapter}` : "";
  const _verse = verse ? `/${verse}` : "";
  const rc = `&rc=${_languageId}${_resourceId}${_bookId}${_chapter}${_verse}`;
  const path = window.location.pathname;
  const query = `${path}?${_organization}${rc}`;
  window.history.pushState(context, null, query);
};

export const contextFromQuery = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const organization = urlParams.get("owner") || "door43-catalog";
  const rc = urlParams.get("rc") || "";
  const rcArray = rc
    .slice(1)
    .split("/")
    .filter((string) => string);
  const [languageId, resourceId, bookId, chapter, verse] = rcArray;
  return {
    organization,
    languageId: languageId || "en",
    resourceId: resourceId,
    reference: {
      bookId,
      chapter,
      verse,
    },
  };
};
```

### 3. Dynamic Manifest Management

Context-aware manifest loading and refreshing:

```javascript
const populateManifests = async ({ context }) => {
  const _manifests = await gitApi.fetchResourceManifests(context);
  setManifests(_manifests);
  return _manifests;
};

const refreshManifests = async ({ context, oldContext }) => {
  let _manifests = { ...manifests };
  const languageChanged = oldContext.languageId !== context.languageId;
  const organizationChanged = oldContext.organization !== context.organization;
  if (languageChanged || organizationChanged) {
    _manifests = await populateManifests({ context });
  }
  return _manifests;
};
```

### 4. Conditional View Rendering

Resource-type-specific view routing:

```javascript
let component = loadingComponent;
const shouldShowHistory = context.view === "history";
if (Object.keys(manifests).length > 0) {
  const shouldShowResources = !context.resourceId;
  const shouldShowScripture = ["ult", "ust", "ulb", "udb", "irv"].includes(context.resourceId);
  const shouldShowOpenBibleStories = context.resourceId === "obs";

  if (shouldShowHistory) component = historyComponent;
  else if (shouldShowResources) component = resources;
  else if (shouldShowScripture) component = scripture;
  else if (shouldShowOpenBibleStories) component = openBibleStories;
}
```

### 5. Local Storage Integration

Persistent state management for history and context:

```javascript
export const save = ({ key, value }) => {
  return localstorage.set(key, value);
};

export const load = ({ key, defaultValue }) => {
  let value;
  try {
    value = localstorage.get(key);
  } catch (error) {
    value = defaultValue;
  }
  return value || defaultValue;
};
```

## Context Structure

### Application Context Schema

```javascript
const defaultContext = {
  organization: "door43-catalog",
  languageId: "en",
  resourceId: undefined, // 'ult', 'ust', 'tn', 'tq', 'tw', 'ta', 'obs'
  reference: {
    bookId: undefined, // Bible book ID
    chapter: undefined, // Chapter number
    verse: undefined, // Verse number
  },
  view: undefined, // 'history' or undefined
};
```

### History Context Schema

```javascript
const historyEntry = {
  organization: 'door43-catalog',
  languageId: 'en',
  resourceId: 'ult',
  reference: {
    bookId: 'gen',
    chapter: '1',
    verse: '1',
  },
};

const history = [historyEntry, ...]; // Array of context objects
```

## Feature Gap Analysis: Original vs. Current Implementation

### Features Present in Original Implementation

#### ✅ **Implemented in src-new/**

1. **Context-based State Management** - Reimplemented with modern patterns
2. **Resource Type Handling** - Updated with new resource types
3. **Material-UI Integration** - Upgraded to v5
4. **Lazy Loading** - Maintained with modern syntax

#### ❓ **Potentially Missing or Different in src-new/**

1. **Auto-scroll to Verse References**

   - **Original**: Automatic smooth scrolling in `Container.js`
   - **Current**: Need to verify if this behavior exists

2. **URL Query Parameter Synchronization**

   - **Original**: Bidirectional sync with custom format (`owner=...&rc=...`)
   - **Current**: Need to verify current URL handling approach

3. **Navigation History System**

   - **Original**: Sophisticated history context with localStorage persistence
   - **Current**: Need to verify if history functionality exists

4. **Manifest Refresh Logic**

   - **Original**: Dynamic manifest updating based on language/organization changes
   - **Current**: Need to verify manifest management approach

5. **Local Storage Integration**

   - **Original**: Persistent state for history and preferences
   - **Current**: Need to verify persistence mechanisms

6. **Resource Type Conditional Logic**

   - **Original**: Specific handling for ULT, UST, OBS, etc.
   - **Current**: Need to verify resource-specific logic

7. **Context Validation**
   - **Original**: Built-in validation with chapter/verse checking
   - **Current**: Need to verify validation patterns

## Design Patterns and Best Practices

### Strengths of Original Implementation

1. **Clear Separation of Concerns**: Container/Component pattern
2. **Immutable State**: Deep freeze pattern for contexts
3. **Progressive Loading**: Lazy loading with fallbacks
4. **User Experience**: Auto-scroll and smooth navigation
5. **Persistence**: Local storage integration
6. **URL Integration**: Shareable links with state

### Areas for Modern Improvement

1. **TypeScript**: Original uses JavaScript, modern version could benefit from types
2. **Hooks**: Original uses class components, modern patterns prefer hooks
3. **Testing**: More comprehensive test coverage
4. **Performance**: Modern optimization techniques
5. **Accessibility**: Enhanced a11y patterns

## Migration Considerations

### High-Priority Features to Consider for src-new/

1. **Auto-scroll Behavior**: Essential for user experience
2. **URL State Synchronization**: Important for shareable links
3. **History Navigation**: Valuable for user workflow
4. **Context Validation**: Critical for stability

### Medium-Priority Features

1. **Local Storage Persistence**: Nice-to-have for user preferences
2. **Manifest Refresh Logic**: Optimization for dynamic content
3. **Resource Type Handling**: Ensure all original resource types supported

### Low-Priority Features

1. **Exact UI Pattern Matching**: Modern UI patterns may be superior
2. **Legacy Browser Support**: Focus on modern browsers

## Recommendations

### For Current Development

1. **Audit Feature Parity**: Compare original features with current implementation
2. **Test Migration**: Ensure all user workflows from original are supported
3. **Performance Comparison**: Benchmark original vs. current performance
4. **User Experience**: Preserve positive UX patterns from original

### For Future Development

1. **Documentation**: Maintain this historical reference
2. **Testing**: Add regression tests for migrated features
3. **Modernization**: Update patterns while preserving functionality
4. **TypeScript**: Consider type definitions for all original interfaces

## Conclusion

The original `/src` implementation demonstrates sophisticated state management, user experience considerations, and architectural patterns that were advanced for its time. Key features like auto-scroll behavior, URL synchronization, and history management provide valuable user experience benefits that should be preserved in the modern implementation.

The clear separation of concerns, immutable state patterns, and progressive loading strategies serve as excellent reference points for modern development, even as the specific implementations evolve with current best practices and technologies.
