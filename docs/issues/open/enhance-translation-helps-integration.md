<!--
status: open
priority: high
created: 2025-05-31
parent_epic: epic-restore-original-ux.md
tags: [translation-helps, tabs, integration, ux]
-->

# Enhance Translation Helps Integration

**Description**  
The new app has basic individual help panels (TranslationNotesPanel, TranslationWordsPanel, etc.) but lacks the sophisticated tabbed interface with badge counts, verse synchronization, and integrated workflow of the original app. The helps feel disconnected from the scripture and each other.

---

## 🎯 Objective

Restore the original app's integrated translation helps experience with a proper tabbed interface, badge counts showing content availability, and seamless verse synchronization that made the original app intuitive and efficient for translators.

---

## 📋 Current vs. Expected Behavior

### Current Implementation (src-new)

- **Basic tab switching** - Simple tab component with manual switching
- **Separated help panels** - Individual components with minimal integration
- **No content indicators** - Users can't see which helps have content for current verse
- **Manual synchronization** - Helps don't automatically update with verse changes
- **Static layout** - Always shows the same tabs regardless of content availability

### Expected Implementation (src original)

- **Dynamic tabbed interface** - Tabs appear/disappear based on content availability
- **Badge counts** - Each tab shows count of available help items (e.g., "Translation Notes (3)")
- **Automatic synchronization** - Helps automatically update when verse changes
- **Integrated workflow** - Tabs can spawn new tabs (e.g., clicking a word creates new word tab)
- **Content-aware UI** - Interface adapts based on what helps are available

---

## 🛠 Implementation Plan

### Phase 1: Enhanced Tab System

1. **Create enhanced HelpsTabs component** - Replace basic tab switching with Material-UI tabs
2. **Implement badge counts** - Show content count for each help type
3. **Add dynamic tab management** - Tabs appear/disappear based on content
4. **Add tab spawning logic** - Allow tabs to create new tabs (e.g., word lookup)

### Phase 2: Content Integration

1. **Unified content loading** - Coordinate loading of all help types for current verse
2. **Content availability detection** - Determine which helps have content for current verse
3. **Loading states** - Show loading indicators while help content loads
4. **Error handling** - Graceful handling when help content fails to load

### Phase 3: Verse Synchronization

1. **Automatic help updates** - Update all helps when verse changes
2. **Cross-tab communication** - Allow tabs to communicate and update each other
3. **Context preservation** - Maintain user's tab selection across verse changes
4. **Performance optimization** - Efficient loading/caching of help content

---

## 📁 Files to Create/Modify

### New Components Needed

- `src-new/components/EnhancedHelpsTabs.jsx` - Advanced tabbed interface with badges
- `src-new/components/HelpTab.jsx` - Individual tab content wrapper
- `src-new/hooks/useHelpContent.js` - Hook for loading and managing help content
- `src-new/hooks/useTabManagement.js` - Hook for dynamic tab management

### Existing Files to Enhance

- `src-new/components/HelpsTabs.jsx` - Replace with enhanced version or merge functionality
- `src-new/components/TranslationNotesPanel.jsx` - Add badge count integration
- `src-new/components/TranslationWordsPanel.jsx` - Add badge count integration
- `src-new/components/TranslationQuestionsPanel.jsx` - Add badge count integration
- `src-new/components/TWLPanel.jsx` - Add badge count integration

### New Utilities

- `src-new/utils/helpContentHelpers.js` - Helper functions for content detection and counting
- `src-new/utils/tabHelpers.js` - Tab management utilities

---

## 🎨 Design References

### Original Tabbed Interface (from src)

```javascript
// From src/components/Viewer/Workspace/TranslationHelps/Component.js
tabs.forEach((tab, index) => {
  if (tab.text) {
    badgeCount = 0;
  } else if (tab.notes) {
    badgeCount = tab.notes.length;
  } else if (tab.original) {
    const wordObjects = tab.original;
    badgeCount = wordObjects.length;
  } else if (tab.words) {
    badgeCount = tab.words.length;
  } else if (tab.content) {
    badgeCount = tab.content.length;
  }
  const badge = (
    <Badge className={classes.padding} color='primary' badgeContent={badgeCount}>
      {tab.title}
    </Badge>
  );
  tabLabels.push(<Tab key={tabLabels.length} label={badgeCount > 0 ? badge : tab.title} />);
});
```

### Original Tab Content Structure (from src)

```javascript
// From src/components/Viewer/Workspace/Scripture/ScriptureView/ScriptureView.js
let tabs = [];

// Translation Notes intro
if (resources && resources.tn && resources.tn.data && resources.tn.data.front) {
  tabs.push({
    title: resources.tn.manifest.dublin_core.title,
    text: introDetails,
  });
}

// Search Notes
tabs.push({ title: "Search Notes", content: translationNotesTable });

// Verse Counts
tabs.push({ title: "Verse Counts", content: verseCountTable });

// Search Words
tabs.push({ title: "Search Words", content: alignmentsTable });
```

---

## 🔧 Technical Requirements

### Badge Count Logic

- **Translation Notes**: Count of notes for current verse
- **Translation Words**: Count of words/concepts for current verse
- **Translation Questions**: Count of questions for current verse
- **TWL**: Count of word list entries for current verse
- **Custom tabs**: Dynamic content counting

### Tab Management

- **Dynamic tabs**: Add/remove tabs based on content availability
- **Tab memory**: Remember user's last selected tab per verse
- **Tab spawning**: Allow clicking words/links to create new focused tabs
- **Tab ordering**: Consistent tab order across verses

### Performance Considerations

- **Lazy loading**: Load tab content only when tab is selected
- **Content caching**: Cache help content to avoid repeated API calls
- **Debounced updates**: Debounce verse changes to avoid excessive API calls
- **Memory management**: Clean up unused tab content

---

## ✅ Definition of Done

- [ ] Tabbed interface shows badge counts for content availability
- [ ] Tabs automatically update when verse changes
- [ ] Users can see at a glance which helps have content for current verse
- [ ] Badge counts are accurate and update in real-time
- [ ] Tab selection is preserved when switching verses
- [ ] Performance is smooth with no unnecessary re-renders or API calls
- [ ] Interface matches original app's tabbed help experience
- [ ] Support for spawning new tabs from word/link clicks
- [ ] Graceful handling of loading states and errors
- [ ] Mobile-responsive tab interface

---

## 🔗 Related Issues

- **Depends on**: "Create Unified Context System" (needs unified context for verse coordination)
- **Related to**: "Implement Progressive Navigation Workflow" (helps are destination of navigation)
- **Enables**: Content badge counting and tab management for enhanced UX

---

## 🧠 Notes

- This is the heart of the translation helps experience - getting this right is crucial
- Badge counts provide immediate feedback about content availability
- Focus on making the interface feel responsive and intelligent
- Consider accessibility for screen readers and keyboard navigation
- The original app's tab system was highly sophisticated - aim to match that level of integration
- Performance is critical since this will be used continuously during translation work
