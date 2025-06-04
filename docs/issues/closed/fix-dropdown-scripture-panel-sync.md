<!--
status: open
priority: medium
created: 2025-06-04
parent_epic: epic-restore-original-ux.md
tags: [scripture-panel, dropdowns, synchronization, ux, reference-context]
-->

Resolved: true

# Fix Dropdown Changes Not Reflecting in Scripture Panel

**Description**  
When users change dropdown selections (such as resource selection, language, or organization), the ScripturePanel component does not properly update to reflect the new selection. This creates a disconnect between the UI controls and the displayed scripture content, leading to user confusion and poor user experience.

---

## 🎯 Objective

Ensure that all dropdown changes immediately and correctly update the scripture content displayed in the ScripturePanel, providing users with immediate visual feedback that their selections have taken effect.

---

## 📋 Current vs. Expected Behavior

### Current Implementation

- **Inconsistent updates** - Scripture panel may not update when dropdowns change
- **Stale content** - Old scripture content remains visible after changing resource/language
- **Missing feedback** - Users can't tell if their dropdown selection worked
- **Context mismatch** - Dropdown state and scripture content get out of sync
- **Manual refresh needed** - Users may need to navigate away and back to see changes

### Expected Implementation

- **Immediate updates** - Scripture panel updates instantly when dropdowns change
- **Visual feedback** - Loading states show when content is being updated
- **State synchronization** - Dropdown selections and scripture content stay in sync
- **Error handling** - Clear messaging when new selection fails to load
- **Consistent behavior** - All dropdown types trigger appropriate scripture updates

---

## 🛠 Implementation Plan

### Phase 1: Context Dependencies Audit

1. **Review ScripturePanel dependencies** - Identify all context values used for fetching scripture
2. **Check useEffect dependencies** - Ensure all relevant context changes trigger re-renders
3. **Test dropdown integration** - Verify each dropdown type properly updates relevant context
4. **Document dependency chain** - Map how dropdown changes flow to scripture updates

### Phase 2: Fix Missing Dependencies

1. **Update useEffect arrays** - Add missing dependencies that should trigger scripture reload
2. **Fix context propagation** - Ensure dropdown changes properly update shared context
3. **Add loading states** - Show loading indicators during scripture updates
4. **Implement error boundaries** - Handle cases where new selection fails to load

### Phase 3: User Experience Enhancement

1. **Add transition feedback** - Visual cues when scripture is updating
2. **Preserve user position** - Maintain verse selection across resource changes when possible
3. **Optimize performance** - Prevent unnecessary re-renders and API calls
4. **Add fallback handling** - Graceful degradation when resources are unavailable

---

## 📁 Files to Investigate/Modify

### Primary Files

- `src-new/components/ScripturePanel.jsx` - Main component with potential missing dependencies
- `src-new/context/ReferenceContext.jsx` - Context that manages reference state
- `src-new/components/ReferenceSelector.jsx` - Dropdown component for reference selection
- `src-new/hooks/useResources.js` - Hook that may handle resource selection

### Supporting Files

- `src-new/context/ResourcesContext.jsx` - Resource management context
- `src-new/context/ManifestsContext.jsx` - Manifest data context
- `src-new/services/scriptureService.js` - Scripture data fetching service
- `src-new/hooks/useAppState.js` - Application state management

### Areas to Check

- **useEffect dependency arrays** - Ensure all state variables that affect scripture loading are included
- **Context providers** - Verify dropdown changes properly propagate to consumers
- **Event handlers** - Check if dropdown onChange handlers update the correct context
- **Loading states** - Add visual feedback during scripture updates

---

## 🔧 Technical Requirements

### Dependency Tracking

- **Resource changes**: `resourceId`, `languageId`, `organization` changes should trigger scripture reload
- **Reference changes**: `bookId`, `chapter`, `verse` changes should update displayed content
- **Manifest updates**: New manifest data should trigger content refresh
- **Context synchronization**: All related contexts should stay synchronized

### State Management

- **Loading indicators**: Show loading state during scripture updates
- **Error handling**: Display meaningful error messages when updates fail
- **State consistency**: Prevent race conditions between multiple dropdown changes
- **Performance**: Debounce rapid changes to prevent excessive API calls

### User Experience

- **Immediate feedback**: Users should see loading state immediately after dropdown change
- **Content preservation**: Maintain verse selection when switching resources (if verse exists)
- **Error recovery**: Provide clear next steps when new selection fails
- **Responsive design**: Ensure updates work across different screen sizes

---

## 🐛 Known Issues to Address

### ScripturePanel useEffect Dependencies

```javascript
// Current implementation may be missing dependencies
useEffect(() => {
  // This effect may not trigger on all necessary context changes
  loadChapter();
}, [reference?.bookId, reference?.chapter, resourceId, languageId, manifests]);
```

### Potential Missing Triggers

- **Organization changes**: May not trigger scripture reload
- **Manifest updates**: New manifest data might not cause refresh
- **Resource availability**: Changes in available resources might not update UI
- **Context initialization**: First-time context loading might not trigger updates

---

## ✅ Definition of Done

- [ ] All dropdown changes immediately trigger appropriate scripture panel updates
- [ ] Loading indicators show during scripture content updates
- [ ] Error states are properly handled and displayed to users
- [ ] No stale content remains visible after dropdown changes
- [ ] Performance is optimized with proper debouncing and memoization
- [ ] Verse selection is preserved across resource changes when possible
- [ ] All context dependencies are properly tracked in useEffect arrays
- [ ] Manual testing confirms all dropdown types work correctly
- [ ] Automated tests verify the synchronization behavior
- [ ] User experience is smooth and predictable across all interactions

---

## 🔗 Related Issues

- **Related to**: "Enhance Translation Helps Integration" (helps panels may have similar sync issues)
- **Depends on**: Context system stability and proper provider implementation
- **Blocks**: User workflow efficiency and application usability
- **May affect**: "Implement Progressive Navigation Workflow" (navigation depends on reliable content updates)

---

## 🧠 Implementation Notes

### Investigation Steps

1. **Trace dropdown change flow**: Follow how dropdown changes propagate through contexts to ScripturePanel
2. **Check useEffect dependencies**: Verify all necessary values are included in dependency arrays
3. **Test edge cases**: Rapid dropdown changes, network failures, missing resources
4. **Performance profiling**: Ensure changes don't cause excessive re-renders

### Common Patterns to Check

- **Missing context dependencies**: useEffect not including all relevant context values
- **Stale closures**: Event handlers capturing old context values
- **Race conditions**: Multiple async operations conflicting with each other
- **Context provider ordering**: Contexts not properly nested or initialized

### Testing Strategy

- **Unit tests**: Mock context changes and verify component updates
- **Integration tests**: Test full dropdown-to-scripture-update flow
- **User testing**: Manual verification of all dropdown combinations
- **Performance tests**: Ensure updates are efficient and don't cause lag

---

## 🔍 Debugging Checklist

- [ ] Add console logs to track context changes in ScripturePanel
- [ ] Verify ReferenceContext updates when dropdowns change
- [ ] Check if ManifestsContext properly provides updated manifests
- [ ] Test ResourcesContext synchronization with dropdown selections
- [ ] Confirm all async operations complete before new ones start
- [ ] Validate error handling paths work correctly
- [ ] Test with network throttling to simulate slow connections
