<!--
status: completed
priority: high
created: 2025-05-31
updated: 2025-05-31
completed: 2025-05-31
parent_epic: epic-restore-original-ux.md
tags: [context, architecture, coordination, state-management]
-->

# Create Context Coordination Layer

**Description**  
The new app's separated contexts (ReferenceContext, ManifestsContext, ResourcesContext) are architecturally sound but lack the intelligent coordination and workflow logic from the original app. Rather than merging contexts into a monolith, we need a coordination layer that enables original app behaviors while preserving the clean separation of concerns.

---

## 🎯 Objective

Create a coordination layer between existing contexts that enables intelligent navigation, context validation, and workflow logic from the original app while preserving the architectural benefits of separated contexts.

---

## 📋 Current vs. Proposed Approach

### Current Approach (src-new)

```javascript
// Separated contexts (good architecture)
ReferenceContext: { bookId, chapter, verse }
ManifestsContext: { manifests by resource type }
ResourcesContext: { loaded resource data }

// Components use contexts directly
const { reference } = useContext(ReferenceContext);
const { manifests } = useContext(ManifestsContext);
```

### Proposed Hybrid Approach

```javascript
// Coordination layer over separated contexts
function useAppState() {
  const reference = useContext(ReferenceContext);
  const manifests = useContext(ManifestsContext);
  const resources = useContext(ResourcesContext);

  // Add resourceId and coordination logic
  const [resourceId, setResourceId] = useState(null);

  const updateContext = (changes) => {
    // Intelligent context updates with validation
    // Coordinate between contexts based on changes
  };

  return { reference, manifests, resources, resourceId, updateContext };
}

// Components use coordination layer
const { reference, resourceId, updateContext } = useAppState();
```

---

## 🛠 Implementation Plan

### Phase 1: Create Coordination Layer

1. **Create useAppState hook** - Coordinate between existing contexts
2. **Add resourceId state** - Track current resource selection
3. **Implement context validation** - Add validation logic without merging contexts
4. **Add URL integration** - Support deep linking and browser history

### Phase 2: Add Coordination Logic

1. **Context change coordination** - Update related contexts when one changes
2. **Workflow validation** - Implement original app's context validation rules
3. **Intelligent defaults** - Auto-load appropriate content based on context
4. **State persistence** - Save/restore coordinated state from localStorage

### Phase 3: Component Integration

1. **Update components** - Use useAppState instead of individual contexts
2. **Add navigation logic** - Implement progressive workflow at component level
3. **Context synchronization** - Ensure all contexts stay in sync
4. **Performance optimization** - Minimize unnecessary re-renders

---

## 📁 Files to Create/Modify

### New Files Needed

- `src-new/hooks/useAppState.js` - Context coordination hook
- `src-new/utils/contextHelpers.js` - Context validation and URL helpers
- `src-new/utils/contextValidation.js` - Context validation logic
- `src-new/utils/workflowHelpers.js` - Navigation workflow logic

### Files to Enhance (Keep Existing)

- `src-new/context/ReferenceContext.jsx` - Add resourceId support
- `src-new/context/ManifestsContext.jsx` - Keep as-is, coordinate via hook
- `src-new/context/ResourcesContext.jsx` - Keep as-is, coordinate via hook
- `src-new/context/MultiManifestsContext.jsx` - Evaluate if still needed

### Components to Update

- `src-new/components/App.jsx` - Keep existing providers, add coordination
- `src-new/components/MainView.jsx` - Use useAppState hook
- `src-new/components/ScripturePanel.jsx` - Use useAppState hook
- `src-new/components/HelpsTabs.jsx` - Use useAppState hook
- All help panel components - Use useAppState hook

---

## 🎨 Design References

### Original Context Structure (from src)

```javascript
// From src/Context.context.js
const defaultContext = {
  organization: "door43-catalog",
  languageId: "en",
};

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

### Proposed Coordination Hook

```javascript
// src-new/hooks/useAppState.js
export function useAppState() {
  const { reference, setReference } = useContext(ReferenceContext);
  const { manifests } = useContext(ManifestsContext);
  const { resources } = useContext(ResourcesContext);

  const [resourceId, setResourceId] = useState(null);
  const [organization] = useState("door43-catalog");
  const [languageId] = useState("en");

  const updateContext = (changes) => {
    // Implement original validation and coordination logic
    if (changes.resourceId) setResourceId(changes.resourceId);
    if (changes.reference) setReference(changes.reference);
    // Add intelligent defaults and validation
  };

  return {
    context: { organization, languageId, resourceId, reference },
    manifests,
    resources,
    updateContext,
    // Helper methods for navigation workflow
    validateContext: (ctx) => validateContext(ctx),
    shouldShowResources: () => !resourceId,
    shouldShowBooks: () => resourceId && !reference?.bookId,
    shouldShowChapters: () => reference?.bookId && !reference?.chapter,
    shouldShowScripture: () => reference?.bookId && reference?.chapter,
  };
}
```

---

## 🔄 Migration Strategy

### Step 1: Create Coordination Layer (Non-Breaking)

- Create useAppState hook alongside existing contexts
- Implement coordination logic without changing existing contexts
- Test workflow behavior matches original

### Step 2: Update Components (Gradual)

- Update one component at a time to use useAppState
- Keep existing context providers in App.jsx
- Add resourceId to ReferenceContext gradually

### Step 3: Optimize and Refine

- Optimize coordination logic for performance
- Remove any redundant context logic
- Update tests to use coordination layer

---

## ✅ Definition of Done

- [x] useAppState hook coordinates between existing contexts
- [x] Context structure includes resourceId and coordination logic
- [x] Context validation prevents invalid state transitions
- [x] URL integration for deep linking (contextFromQuery, updateQueryFromContext)
- [x] Local storage persistence for coordinated state
- [x] Components updated to use useAppState hook
- [x] Original context behavior preserved (validateContext, updateContext logic)
- [x] Existing contexts remain separated and functional
- [x] Performance maintained or improved vs. current implementation
- [x] No breaking changes to existing functionality

### ✅ Implementation Completed

**Files Created:**

- `src-new/hooks/useAppState.js` - Main coordination hook
- `src-new/utils/contextValidation.js` - Context validation logic
- `src-new/utils/contextHelpers.js` - URL and localStorage helpers
- `src-new/utils/workflowHelpers.js` - Navigation workflow logic
- Complete test suites for all utilities

**Key Features Implemented:**

- Context coordination between ReferenceContext, ManifestsContext, ResourcesContext
- Intelligent navigation workflow with progressive disclosure
- Original app context validation and update logic preserved
- URL deep linking and browser history support
- Local storage persistence for application state
- Breadcrumb navigation system
- Memory-optimized implementation with proper memoization
- Comprehensive test coverage

The Context Coordination Layer successfully preserves the architectural benefits of separated contexts while enabling all the intelligent behaviors from the original app.

---

## 🔗 Related Issues

- **Blocks**: "Implement Progressive Navigation Workflow" (needs resourceId and coordination)
- **Blocks**: "Add Resource Selection Screen" (needs coordinated context for navigation)
- **Related to**: "Enhance Translation Helps Integration" (helps need context coordination)

---

## 🧠 Notes

- This preserves the architectural benefits of separated contexts while enabling original UX
- Coordination layer approach is more maintainable than context merger
- Gradual migration ensures no regressions in existing functionality
- Focus on intelligent coordination rather than monolithic state management
- URL integration and validation can be added without context restructuring
- This approach is more testable and follows modern React patterns
- Performance can be optimized through selective re-renders and memoization
