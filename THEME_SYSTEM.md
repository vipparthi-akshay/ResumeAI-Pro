# Theme System Implementation

## Overview
A comprehensive, accessible theme system with light/dark mode support, smooth transitions, localStorage persistence, and system preference detection.

## Features Implemented

### 1. **Global Theme Classes**
- `theme-light` - Applied to `<html>` element in light mode
- `theme-dark` - Applied to `<html>` element in dark mode
- `theme-transitioning` - Applied during theme transitions for smooth animations
- Backward compatible with `dark-mode` class on `<body>`

### 2. **CSS Variables for Light/Dark Modes**
The `:root` selector defines all theme variables that dynamically change based on the active theme:

#### Light Mode Variables (Default)
```css
--bg-primary: #ffffff;
--bg-secondary: #f8fafc;
--bg-tertiary: #f1f5f9;
--text-primary: #0f172a;
--text-secondary: #475569;
--text-tertiary: #94a3b8;
--border: #e2e8f0;
--surface-light: #f8fafc;
```

#### Dark Mode Variables
```css
--bg-primary: #0f172a;
--bg-secondary: #1e293b;
--bg-tertiary: #334155;
--text-primary: #f1f5f9;
--text-secondary: #cbd5e1;
--text-tertiary: #94a3b8;
--border: #334155;
--surface-light: #1e293b;
```

#### Brand & Semantic Variables (Theme-Independent)
```css
--primary: #2563eb;
--success: #10b981;
--warning: #f59e0b;
--error: #ef4444;
--transition-fast: 150ms;
--transition-base: 300ms;
--transition-slow: 500ms;
```

### 3. **Smooth Transitions**
- All theme-related properties transition smoothly over 300ms
- Shadows and gradients adapt to theme with smooth animation
- Transition class `theme-transitioning` enables CSS transitions during theme switches
- Non-breaking transitions on all color-related properties

```css
html.theme-transitioning,
html.theme-transitioning * {
    transition: background-color var(--transition-base) ease,
                color var(--transition-base) ease,
                border-color var(--transition-base) ease,
                box-shadow var(--transition-base) ease !important;
}
```

### 4. **Persistent localStorage Handling**
- **Storage Key**: `theme-preference`
- Automatically saves theme preference to localStorage on every theme change
- Reads from localStorage on page load for consistent experience
- Falls back to system preference if no stored preference exists
- Gracefully handles storage errors (quota exceeded, disabled storage, etc.)

### 5. **Theme Toggle Icon Updates**
- **Light Mode Icon**: 🌙 (moon)
- **Dark Mode Icon**: ☀️ (sun)
- Icons update instantly when theme changes
- Applied to all buttons with `#themeToggle` or `.theme-toggle` classes

### 6. **Accessibility Features**
- `aria-label` attributes update based on theme (for screen readers)
- `title` attributes provide tooltips
- Proper semantic HTML structure
- High contrast ratios maintained in both themes

### 7. **System Preference Fallback**
- Detects OS/browser theme preference using `prefers-color-scheme` media query
- Automatically applies system theme on first visit if no stored preference
- Listens for system theme changes and respects them if user hasn't set explicit preference
- Respects user's explicit preference over system changes

## Usage

### Basic Usage
Include the theme.js script in your HTML:
```html
<button id="themeToggle" class="theme-toggle">🌙</button>
<script src="js/theme.js"></script>
```

### Using CSS Variables
Apply theme colors to any element using CSS variables:
```css
.my-element {
    background-color: var(--bg-primary);
    color: var(--text-primary);
    border: 1px solid var(--border);
    transition: all var(--transition-base) ease;
}
```

### JavaScript API

#### Get Current Theme
```javascript
const theme = window.themeManager.getTheme(); // 'light' or 'dark'
const isDark = window.themeManager.isDark(); // boolean
```

#### Set Theme Explicitly
```javascript
window.themeManager.setLight();   // Switch to light mode
window.themeManager.setDark();    // Switch to dark mode
window.themeManager.toggle();     // Toggle current theme
```

#### Reset to System Preference
```javascript
window.themeManager.resetToSystemPreference();
```

#### Listen for Theme Changes
```javascript
document.addEventListener('themeChange', (event) => {
    const { theme, isDark } = event.detail;
    console.log(`Theme changed to: ${theme}`);
});
```

### HTML Integration

**Theme Toggle Button:**
```html
<button id="themeToggle" class="theme-toggle">🌙</button>
<!-- or -->
<button class="theme-toggle">🌙</button>
```

The manager will:
- Update the icon based on current theme
- Set aria-label for accessibility
- Handle click events automatically

## Implementation Details

### ThemeManager Class Methods

| Method | Description |
|--------|-------------|
| `getStoredTheme()` | Retrieves theme from localStorage |
| `getSystemPreference()` | Detects OS theme preference |
| `init()` | Initializes the theme manager |
| `applyTheme(theme, useTransition)` | Applies theme with optional transitions |
| `persistTheme(theme)` | Saves theme to localStorage |
| `updateToggleButtons(theme)` | Updates button icons and accessibility |
| `broadcastThemeChange(theme)` | Dispatches custom event |
| `toggle()` | Toggles between light/dark |
| `setupToggle()` | Attaches click listeners to toggle buttons |
| `setupSystemPreferenceListener()` | Monitors OS theme changes |
| `getTheme()` | Returns current theme |
| `isDark()` | Returns true if dark mode active |
| `setLight()` | Explicitly sets light theme |
| `setDark()` | Explicitly sets dark theme |
| `resetToSystemPreference()` | Clears stored preference, uses system |

## Browser Support
- Modern browsers with CSS Variables support
- Firefox 31+
- Chrome/Edge 49+
- Safari 10+
- Graceful degradation for older browsers

## Testing
Open `test-theme.html` to run comprehensive test suite covering:
- Theme class application
- CSS variable values
- localStorage persistence
- Toggle button icons
- System preference detection
- Smooth transitions
- Custom event dispatch
- API methods

## Migration Guide

### From Old System
If migrating from a simpler theme system:

1. Old theme storage key: `'theme'` → New: `'theme-preference'`
2. Old class: `body.dark-mode` → New: `html.theme-dark` (both supported)
3. Update CSS to use new variables:
   ```css
   /* Old */
   color: var(--gray-800);
   
   /* New */
   color: var(--text-primary);
   ```

## Performance Considerations
- Transitions are GPU-accelerated using `ease` timing functions
- No layout thrashing - theme changes batch DOM updates
- Minimal repaints - transitions use transform and opacity when possible
- LocalStorage operations are wrapped in try-catch for safety

## Troubleshooting

### Theme not persisting
- Check if localStorage is enabled in browser
- Verify `theme-preference` key in browser storage

### Icons not updating
- Ensure buttons have `id="themeToggle"` or `class="theme-toggle"`
- Check console for errors

### Transitions not smooth
- Verify `--transition-base: 300ms` is defined
- Check if transitions are not overridden globally

### System preference not working
- Verify browser supports `prefers-color-scheme` media query
- Check OS theme settings (Windows: Settings > Personalization > Colors)

## Future Enhancements
- Automatic time-based theme switching (sunrise/sunset)
- Per-component theme overrides
- Custom color palette configuration
- Theme animation preferences based on `prefers-reduced-motion`
