<!--
status: open
priority: medium
created: 2025-05-31
parent_epic: epic-restore-original-ux.md
tags: [material-ui, design-system, theming, ui]
-->

# Integrate Material-UI Design System

**Description**  
The new app uses inline styling and basic React components, while the original app used Material-UI with consistent theming, styled components, and professional UI elements. This creates a visual and functional disconnect from the original app's polished appearance and accessibility features.

---

## 🎯 Objective

Integrate Material-UI components and theming to restore the original app's professional appearance, consistent styling, and enhanced accessibility while maintaining the clean React architecture of the rewrite.

---

## 📋 Current vs. Expected Styling

### Current Approach (src-new)

- **Inline styles** - Styles defined directly in component files
- **Basic HTML elements** - Standard div, button, select elements
- **No theming system** - Hardcoded colors and spacing
- **Limited accessibility** - Missing ARIA labels, focus management
- **Inconsistent styling** - Each component styled independently

### Expected Approach (src original)

- **Material-UI components** - AppBar, Tabs, ExpansionPanel, CircularProgress, etc.
- **Unified theme** - Consistent colors, typography, spacing across app
- **withStyles HOC** - Styled components with theme integration
- **Enhanced accessibility** - Built-in ARIA support, keyboard navigation
- **Responsive design** - Mobile-friendly components and layouts

---

## 🛠 Implementation Plan

### Phase 1: Setup Material-UI

1. **Install Material-UI dependencies** - @mui/material, @emotion/react, @emotion/styled
2. **Create theme configuration** - Match original app's theme colors and typography
3. **Setup theme provider** - Wrap app with ThemeProvider
4. **Configure Material-UI icons** - Install and setup @mui/icons-material

### Phase 2: Replace Core Components

1. **Navigation components** - Replace reference selector with Material-UI components
2. **Layout components** - Add AppBar, Container, Grid components
3. **Loading states** - Replace basic loading with CircularProgress
4. **Interactive elements** - Replace buttons, inputs with Material-UI variants

### Phase 3: Advanced Components

1. **Tabs interface** - Implement Material-UI Tabs for translation helps
2. **Expansion panels** - Add expandable sections for book introductions
3. **Badges and chips** - Implement content count badges
4. **Navigation elements** - Add bottom navigation, breadcrumbs

---

## 📁 Files to Create/Modify

### New Configuration Files

- `src-new/theme/index.js` - Material-UI theme configuration
- `src-new/theme/colors.js` - Color palette matching original app
- `src-new/theme/typography.js` - Typography configuration
- `src-new/styles/globalStyles.js` - Global style overrides

### Components to Update

- `src-new/components/App.jsx` - Add ThemeProvider wrapper
- `src-new/components/NavigationBar.jsx` - Replace with Material-UI AppBar
- `src-new/components/ReferenceSelector.jsx` - Use Material-UI Select, FormControl
- `src-new/components/MainView.jsx` - Use Material-UI Container, Grid
- `src-new/components/HelpsTabs.jsx` - Implement Material-UI Tabs
- All panel components - Add proper Material-UI Paper, Typography

### Dependencies to Add

```json
{
  "@mui/material": "^5.x.x",
  "@emotion/react": "^11.x.x",
  "@emotion/styled": "^11.x.x",
  "@mui/icons-material": "^5.x.x"
}
```

---

## 🎨 Design References

### Original Theme Configuration (from src)

```javascript
// From src/theme.js
import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#0277BD",
    },
    secondary: {
      main: "#FF5722",
    },
  },
  typography: {
    useNextVariants: true,
  },
});
```

### Original Styled Components (from src)

```javascript
// From src/styles.js
const styles = (theme) => ({
  root: {
    display: "flex",
    height: "100vh",
    overflow: "hidden",
  },
  appFrame: {
    position: "relative",
    display: "flex",
    width: "100%",
    height: "100%",
  },
  main: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: 0,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
  },
  workspace: {
    flex: 1,
    overflow: "auto",
  },
});
```

### Original Component Styling (from src)

```javascript
// From src/components/Viewer/Workspace/TranslationHelps/Component.js
export default withStyles(styles, { withTheme: true })(Component);

// Usage in component
const Component = ({
  classes,
  theme,
  // ...
}) => {
  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar} position='sticky' color='default'>
        <Tabs
          className={classes.width}
          value={tabIndex}
          onChange={handleChangeIndex}
          indicatorColor='primary'
          textColor='primary'
          variant='scrollable'
          scrollButtons='auto'
        >
          {tabLabels}
        </Tabs>
      </AppBar>
    </div>
  );
};
```

---

## 🔧 Migration Strategy

### Step 1: Foundation (Non-Breaking)

1. **Install Material-UI** - Add dependencies without breaking existing code
2. **Create theme** - Setup theme configuration matching original colors
3. **Add ThemeProvider** - Wrap app to enable Material-UI theming
4. **Test existing functionality** - Ensure no regressions

### Step 2: Component Migration (Gradual)

1. **Start with navigation** - Replace NavigationBar with Material-UI AppBar
2. **Update layout components** - Replace divs with Container, Grid, Paper
3. **Migrate form elements** - Replace selects, inputs with Material-UI versions
4. **Update interactive elements** - Replace buttons, links with Material-UI components

### Step 3: Advanced Features

1. **Implement tabs** - Use Material-UI Tabs for translation helps
2. **Add badges** - Implement Material-UI Badge for content counts
3. **Add loading states** - Use CircularProgress for loading indicators
4. **Polish and optimize** - Fine-tune theming and performance

---

## ✅ Definition of Done

- [ ] Material-UI library integrated with proper theme configuration
- [ ] App appearance matches original Material-UI styling
- [ ] All major components use Material-UI instead of inline styles
- [ ] Consistent spacing, colors, and typography throughout app
- [ ] Enhanced accessibility with Material-UI's built-in ARIA support
- [ ] Responsive design works across mobile and desktop
- [ ] Loading states use Material-UI CircularProgress
- [ ] Navigation uses Material-UI AppBar and Tabs
- [ ] Form elements use Material-UI inputs and selects
- [ ] No regressions in existing functionality
- [ ] Performance remains smooth with Material-UI components

---

## 🔗 Related Issues

- **Enhances**: "Enhance Translation Helps Integration" (tabs will use Material-UI)
- **Complements**: "Implement Progressive Navigation Workflow" (navigation will use Material-UI)
- **Foundation for**: Badge counts, expansion panels, bottom navigation

---

## 🧠 Notes

- This change primarily affects visual appearance and accessibility, not core functionality
- Material-UI v5 uses emotion for styling instead of JSS (which original app used)
- Consider gradual migration to avoid disrupting development of core features
- Focus on matching original app's visual design and user experience
- Material-UI provides excellent accessibility features out of the box
- Responsive design is crucial for mobile translator users
- Performance impact should be minimal with proper tree-shaking
