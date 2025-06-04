<!--
status: closed
priority: critical
created: 2025-06-04
resolved: 2025-06-04
parent_epic: epic-restore-original-ux.md
tags: [dropdown-sync, scripture-panel, context-flow, critical-bug, regression, url-format]
resolution: fixed
version: 0.4.6
resolution_summary: |
  Successfully resolved all critical dropdown synchronization issues introduced by the bad implementation.
  Fixed broken ManifestsWrapper, restored proper context flow, enhanced useEffect dependencies,
  and restored full organization/language/resource/reference synchronization functionality.
  All core features now work as expected with proper loading states and error handling.

  Additional fix in 0.4.6: Resolved RC URI language code duplication issue where URLs showed
  /en/en_ult/ instead of /en/ult/. Enhanced contextHelpers to properly handle bidirectional
  URL synchronization with language prefix stripping for clean URLs and reconstruction for
  internal catalog API compatibility.
-->

# Fix Broken Dropdown Synchronization After Bad Implementation

**Description**  
The dropdown synchronization functionality was severely broken by a poorly executed implementation in commit `e77fde1`. Multiple core features that were previously working are now completely non-functional, creating a critical regression that affects the entire user experience.

---

## 🚨 Critical Issues Introduced

### 1. **Organization/Owner Changes Don't Update Resources**

- **Problem**: Changing the organization dropdown doesn't change the resources rendered on screen to that owner
- **Expected**: Should reload manifests and resources for the new organization
- **Current**: Stale content from previous organization remains

### 2. **Language Changes Don't Update Content**

- **Problem**: Changing language dropdown doesn't change the language of resources rendered on screen
- **Expected**: Should reload all content in the selected language
- **Current**: Previous language content persists

### 3. **Bible/Resource Selection Broken**

- **Problem**: Changing bible/resource dropdown doesn't change the bible rendered in scripture panel
- **Expected**: Should immediately switch to displaying the selected resource
- **Current**: Same scripture resource shows regardless of selection

### 4. **Basic Navigation Completely Broken**

- **Problem**: Book/chapter/verse changes no longer update the scripture panel
- **Expected**: Basic navigation should always work
- **Current**: Scripture panel doesn't respond to reference changes

### 5. **Translation Helps Panels Have Errors**

- **Problem**: Resources on the right side (Translation Notes, Questions, Words) have errors
- **Expected**: Should display relevant content for current verse
- **Current**: Error states or incorrect content

### 6. **Premature Rendering with Fake Data**

- **Problem**: App renders content before having all required context, showing fake/stale data
- **Expected**: Should wait for proper context before rendering real content
- **Current**: Shows misleading content that doesn't match actual selections

---

## 🔍 Root Cause Analysis

### Bad Implementation Details

The following changes in commit `e77fde1` broke core functionality:

1. **Improper Context Dependencies**: Added organization parameter without proper context flow
2. **Broken ManifestsWrapper**: Created wrapper component that doesn't properly propagate changes
3. **Service Parameter Mismatches**: Updated services with parameters that don't align with context updates
4. **Missing State Synchronization**: Context changes don't properly trigger re-renders
5. **Async Flow Corruption**: Manifest loading and resource fetching got out of sync
6. **Default Parameter Issues**: Services using default values instead of actual context values

### Files That Were Corrupted

- `src-new/components/App.jsx` - Broken ManifestsWrapper implementation
- `src-new/components/ScripturePanel.jsx` - Bad useEffect dependencies
- `src-new/context/MultiManifestsContext.jsx` - Improper organization handling
- `src-new/services/dcsClient.js` - Parameter mismatches
- `src-new/services/scriptureService.js` - Broken organization propagation

---

## 🎯 Requirements for Proper Fix

### Context Flow Requirements

1. **Proper Dependency Chain**: Organization → Language → Resource → Book → Chapter → Verse
2. **Cascade Updates**: Higher-level changes should reset lower-level selections appropriately
3. **Loading States**: Show loading indicators during each transition
4. **Error Handling**: Graceful fallbacks when selections become invalid
5. **State Consistency**: All contexts must stay synchronized throughout the app

### Data Flow Requirements

1. **Wait for Context**: Don't render content until all required context is available
2. **Real Data Only**: No fake data, placeholders, or stale content
3. **Proper Async Handling**: Manifest loading must complete before resource fetching
4. **Parameter Alignment**: Service calls must use actual context values, not defaults
5. **Cache Invalidation**: Old cached data must be cleared when context changes

### User Experience Requirements

1. **Immediate Feedback**: Dropdown changes should show loading state immediately
2. **Consistent Behavior**: All dropdowns should behave predictably
3. **Error Recovery**: Clear error messages and recovery paths
4. **Performance**: No unnecessary re-renders or API calls
5. **State Preservation**: Maintain valid selections when possible during context changes

---

## 🚫 What NOT to Do (Lessons from Failed Implementation)

### Avoid These Mistakes

1. **Don't add parameters without proper context flow** - Adding organization parameter without ensuring proper propagation
2. **Don't create wrapper components that break context** - ManifestsWrapper broke the context chain
3. **Don't update services in isolation** - Services need to align with context updates
4. **Don't ignore cascade effects** - Organization changes affect everything downstream
5. **Don't render with incomplete data** - Wait for proper context before showing content
6. **Don't use default parameters as shortcuts** - Use actual context values throughout
7. **Don't commit without thorough testing** - Test all dropdown combinations before committing

### Context Architecture Rules

1. **Single Source of Truth**: Each piece of state should have one authoritative source
2. **Proper Nesting**: Context providers must be properly nested and ordered
3. **Dependency Management**: useEffect arrays must include ALL relevant dependencies
4. **State Initialization**: Proper initialization order prevents race conditions
5. **Error Boundaries**: Each context level should handle its own errors

---

## 📝 Implementation Strategy for Fix

### Phase 1: Revert and Assess

1. Consider reverting the broken changes completely
2. Assess current state and identify what was working before
3. Document the exact working behavior that needs to be restored

### Phase 2: Proper Context Design

1. Design proper context dependency chain
2. Ensure organization/language/resource contexts work together
3. Test context flow thoroughly before touching UI components

### Phase 3: Incremental Implementation

1. Fix one dropdown at a time
2. Test each change thoroughly before moving to next
3. Ensure no regressions are introduced

### Phase 4: Integration Testing

1. Test all dropdown combinations
2. Verify loading states work correctly
3. Confirm error handling is robust

---

## 🔧 Specific Technical Fixes Needed

### Context Dependencies

- Fix ScripturePanel useEffect to properly track all context changes
- Ensure ManifestsContext responds correctly to organization AND language changes
- Verify ResourcesContext properly updates when upstream contexts change

### Service Parameter Alignment

- Fix dcsClient to use actual organization parameter from context
- Update scriptureService to properly propagate organization throughout
- Ensure all service calls use real context values, not defaults

### Component Rendering Logic

- Fix App.jsx context provider nesting and flow
- Ensure ScripturePanel waits for proper context before rendering
- Update all help panels to properly respond to context changes

### Data Flow Validation

- Verify manifest loading completes before resource fetching
- Ensure cache invalidation occurs on context changes
- Test async flow under various network conditions

---

## ✅ Resolution Summary

**Fixed in Version 0.4.4**

### Critical Issues Resolved:

1. **✅ Organization/Language/Resource Synchronization Restored**

   - Removed broken ManifestsWrapper component that corrupted context flow
   - Fixed MultiManifestsContext to properly subscribe to ReferenceContext changes
   - Enhanced useEffect dependency arrays to include all relevant context values
   - Organization and language changes now properly trigger manifest reloads

2. **✅ Scripture Panel Context Flow Fixed**

   - Enhanced ScripturePanel with proper loading states and error handling
   - Added waiting for manifests to load before attempting to render scripture
   - Fixed "Resource not available" errors with proper context dependency management
   - Scripture panel now responds correctly to all dropdown changes

3. **✅ Bible Resource Dropdown Fixed**

   - Improved resource mapping in ReferenceSelector with cleaner display
   - Resources properly populate from API and display with meaningful descriptions
   - Removed test/hardcoded options that were confusing users
   - Dropdown now shows real fetched resources only

4. **✅ Proper Async Flow Restored**

   - Context changes → manifests load → resources fetch → UI updates
   - Added comprehensive loading states throughout the chain
   - Proper error handling and fallbacks at each stage
   - No more premature rendering with incomplete data

5. **✅ All Core Functionality Working**
   - Organization changes immediately trigger complete app state refresh
   - Language changes properly reload all content and manifests
   - Bible resource selection changes scripture panel content
   - Book/chapter/verse navigation works correctly
   - Translation helps panels receive proper context updates

### Technical Improvements:

- **Context Architecture**: Restored direct context nesting without problematic wrapper patterns
- **Service Layer**: Aligned all service calls to use actual context values instead of defaults
- **Loading States**: Added comprehensive loading indicators during transitions
- **Error Handling**: Enhanced error boundaries and graceful fallback behavior
- **Performance**: Optimized re-renders and eliminated unnecessary API calls

### Testing Results:

- ✅ Organization dropdown changes immediately update all displayed resources
- ✅ Language dropdown changes immediately update all content language
- ✅ Bible/Resource dropdown changes immediately update scripture panel
- ✅ Book/Chapter/Verse navigation works correctly
- ✅ Translation Helps panels display correct content without errors
- ✅ No content renders until proper context is established
- ✅ Loading states show during all transitions
- ✅ Error states are handled gracefully
- ✅ All dropdown combinations work correctly
- ✅ No performance regressions or excessive re-renders

## 🧠 Key Learnings for Next Implementation

1. **Test incrementally** - Don't change multiple files at once without testing
2. **Understand context flow** - Map out how data flows before making changes
3. **Respect existing patterns** - Don't reinvent context architecture unnecessarily
4. **Use real data only** - Never show fake or stale content to users
5. **Follow AGENTS.md workflow** - But don't commit broken code just to follow process
6. **Think about cascade effects** - Upstream changes affect everything downstream
7. **Validate assumptions** - Test actual behavior, don't assume things work

The previous implementation failed because it focused on adding parameters without understanding the existing context architecture and data flow patterns. The next implementation must start with understanding how the app currently works and make targeted fixes that preserve working functionality while adding the missing synchronization.
