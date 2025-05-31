<!--
status: open
priority: high
created: 2025-05-31
parent_epic: epic-restore-original-ux.md
tags: [navigation, ux, workflow, context]
-->

# Implement Progressive Navigation Workflow

**Description**  
The original app guided users through a logical progression: Resource Selection → Book Selection → Chapter Selection → Scripture View. The new app bypasses this flow and immediately shows a manual reference selector, which breaks the expected user experience.

---

## 🎯 Objective

Restore the progressive navigation workflow where users are guided through content selection based on what context is missing, matching the original app's intelligent navigation flow.

---

## 📋 Current vs. Expected Behavior

### Current Behavior (src-new)

- App always shows: Reference Selector + Scripture Panel + Translation Helps
- User must manually select book/chapter/verse from dropdowns
- No guidance for users unfamiliar with available content
- Fixed layout regardless of context state

### Expected Behavior (src original)

- Progressive screens based on missing context:
  1. **Resources View**: If no resourceId selected, show available resources
  2. **Book Selection**: If resourceId but no bookId, show book grid
  3. **Chapter Selection**: If bookId but no chapter, show chapter grid
  4. **Scripture View**: If complete reference, show scripture + helps

---

## 🛠 Implementation Plan

### Phase 1: Create Navigation Logic

1. **Add view state to context** - Track current navigation view
2. **Implement view routing logic** - Determine which view to show based on context
3. **Create view determination helper** - Function to decide current view based on missing context

### Phase 2: Implement View Components

1. **Resources View Component** - Grid of available scripture resources (ULT, UST, etc.)
2. **Book Selection Component** - Grid/list of books for selected resource
3. **Chapter Selection Component** - Grid/list of chapters for selected book
4. **Update Main View** - Route to appropriate view based on context

### Phase 3: Navigation Flow

1. **Resource selection updates context** - Sets resourceId and triggers book selection
2. **Book selection updates context** - Sets bookId and triggers chapter selection
3. **Chapter selection updates context** - Sets chapter and triggers scripture view
4. **Back navigation support** - Allow users to go back to previous selection

---

## 📁 Files to Create/Modify

### New Components Needed

- `src-new/components/ResourcesView.jsx` - Resource selection screen
- `src-new/components/BookSelectionView.jsx` - Book selection screen
- `src-new/components/ChapterSelectionView.jsx` - Chapter selection screen
- `src-new/utils/navigationHelpers.js` - Logic for determining current view

### Existing Files to Modify

- `src-new/components/MainView.jsx` - Add view routing logic
- `src-new/context/ReferenceContext.jsx` - Add resourceId and view state
- `src-new/utils/defaultReference.js` - Update to include resourceId

---

## 🎨 Design References

### Original Resource Selection (from src)

```javascript
// From src/components/Viewer/Workspace/Component.js
const shouldShowResources = !context.resourceId;
const shouldShowScripture = ["ult", "ust", "ulb", "udb", "irv"].includes(context.resourceId);
```

### Original Book/Chapter Selection (from src)

```javascript
// From src/components/Viewer/Workspace/Scripture/Scripture.js
const shouldShowBookSelection = !reference || !reference.bookId;
const shouldShowChapterSelection = reference && reference.bookId && !reference.chapter;
const shouldShowScriptureView = contextLoaded.reference && contextLoaded.reference.bookId;
```

---

## ✅ Definition of Done

- [ ] User sees resource selection screen on first load (no resourceId)
- [ ] Selecting a resource shows book selection for that resource
- [ ] Selecting a book shows chapter selection for that book
- [ ] Selecting a chapter shows scripture view with translation helps
- [ ] Back navigation allows returning to previous selection screens
- [ ] URL updates to reflect current navigation state (future enhancement)
- [ ] Matches original app's navigation flow behavior

---

## 🔗 Related Issues

- **Depends on**: "Create Unified Context System" (context needs resourceId)
- **Blocks**: "Add Resource Selection Screen" (specific implementation of resources view)
- **Related to**: "Enhance Translation Helps Integration" (final destination of navigation)

---

## 🧠 Notes

- This restores the core UX workflow that made the original app intuitive
- Progressive disclosure reduces cognitive load for new users
- Maintains the clean React architecture while restoring original UX patterns
- Consider responsive design for mobile navigation
