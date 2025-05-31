<!--
status: open
priority: critical
created: 2025-05-30
updated: 2025-05-31
tags: [epic, regression, rewrite, ux, restoration, architecture]
-->

# 🧩 Epic: Restore Original App UX and Workflow

**Description**  
After analyzing both `/src` (original) and `/src-new` (rewrite) applications, it's clear the rewrite took a fundamentally different architectural approach. While the new app provides basic functionality, it lacks the sophisticated user experience and workflow of the original. This epic tracks the restoration of the original app's user experience within the new architecture.

---

## 🔍 Architecture Analysis

### Original App (`/src`) - Material-UI Based

- **Unified Context System**: Single context managing organization, languageId, resourceId, and reference
- **Progressive Navigation Flow**: Resources → Book → Chapter → Scripture based on missing context
- **View-Based Routing**: Different views (history, resources, scripture, obs) shown conditionally
- **Integrated Translation Helps**: Tabbed interface with badge counts and verse synchronization
- **Manifest-Driven**: Complex manifest loading with resource discovery
- **Material-UI Components**: Consistent theming, expansion panels, app bars, bottom navigation

### New App (`/src-new`) - Clean React Rewrite

- **Separated Contexts**: Individual contexts for Reference, Manifests, Resources
- **Fixed Layout**: Always shows reference selector + scripture + helps side-by-side
- **Manual Navigation**: User must manually select book/chapter/verse via dropdowns
- **Simplified Components**: Individual help panels without deep integration
- **Direct Resource Loading**: Simplified resource fetching without complex manifest logic
- **Inline Styling**: No Material-UI, basic styling approach

---

## 🎯 Restoration Goals

### High Priority - Core UX Flow

1. **Progressive Navigation Workflow**: Restore the guided flow from resource selection to content
2. **Unified Context Management**: Implement context that drives the entire app state
3. **Intelligent Defaults**: Auto-load appropriate content based on available resources
4. **Integrated Translation Helps**: Tabbed interface with proper verse synchronization

### Medium Priority - UI/UX Polish

5. **Material-UI Integration**: Restore consistent theming and component library
6. **Badge Counts**: Show help content counts on tabs
7. **History Navigation**: Implement breadcrumb/back navigation
8. **Bottom Navigation**: Restore secondary navigation elements

### Low Priority - Advanced Features

9. **Manifest Caching**: Implement sophisticated resource discovery
10. **URL State Management**: Restore deep-linking and browser history
11. **Performance Optimizations**: Lazy loading and code splitting

---

## 📋 Detailed Feature Gap Analysis

| Original Feature                         | New App Status | Priority | Issue Needed                       |
| ---------------------------------------- | -------------- | -------- | ---------------------------------- |
| Resource Selection Screen                | ❌ Missing     | High     | Create resource selection workflow |
| Progressive Book/Chapter Selection       | ❌ Missing     | High     | Implement guided navigation flow   |
| Unified Context (resourceId + reference) | ❌ Separated   | High     | Create context coordination layer  |
| Tabbed Translation Helps                 | 🟡 Basic       | High     | Enhance helps integration          |
| Badge Counts on Tabs                     | ❌ Missing     | Medium   | Add content count badges           |
| Material-UI Components                   | ❌ Missing     | Medium   | Integrate Material-UI theming      |
| Verse Click Synchronization              | ✅ Working     | -        | Already implemented                |
| History/Back Navigation                  | ❌ Missing     | Medium   | Implement navigation history       |
| Bottom Navigation Bar                    | ❌ Missing     | Low      | Add secondary navigation           |
| Expansion Panels for Books               | ❌ Missing     | Low      | Add expandable book introductions  |
| URL State Persistence                    | ❌ Missing     | Low      | Implement deep linking             |

---

## 🗂 Recommended Issues to Create

### Immediate (High Priority)

1. **Implement Progressive Navigation Workflow** - Restore the guided flow from resources to content
2. **Create Context Coordination Layer** - Add coordination between separated contexts while preserving clean architecture
3. **Add Resource Selection Screen** - Implement initial resource discovery/selection view
4. **Enhance Translation Helps Integration** - Improve tabbed interface with proper synchronization

### Next Phase (Medium Priority)

5. **Integrate Material-UI Design System** - Replace inline styles with consistent component library
6. **Add Content Badge Counts** - Show help content counts on tabs
7. **Implement Navigation History** - Add breadcrumb and back navigation

### Future (Low Priority)

8. **Add Bottom Navigation** - Restore secondary navigation elements
9. **Implement URL State Management** - Add deep linking and browser history
10. **Optimize Resource Loading** - Improve manifest caching and performance

---

## 🧠 Notes

- The new app architecture is sound but needs UX workflow restoration
- Focus on user experience over technical architecture changes
- Progressive enhancement approach: start with core workflows, add polish later
- Maintain the clean React patterns from the rewrite while restoring original UX
- **Hybrid approach adopted**: Keep separated contexts, add coordination layer for workflow logic
- Preserve architectural benefits while enabling original user workflows

**Status**: This epic serves as the master tracking issue for restoring the original app's user experience within the new technical architecture using a hybrid coordination approach.
