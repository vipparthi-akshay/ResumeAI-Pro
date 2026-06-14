// Theme management with localStorage persistence and system preference fallback
class ThemeManager {
    constructor() {
        this.STORAGE_KEY = 'theme';
        this.THEME_CLASS_LIGHT = 'theme-light';
        this.THEME_CLASS_DARK = 'theme-dark';
        this.TRANSITION_CLASS = 'theme-transitioning';
        this.TRANSITION_DURATION = 300; // milliseconds for smooth transitions
        
        // Initialize theme on constructor
        this.currentTheme = this.getStoredTheme() || this.getSystemPreference() || 'light';
        
        // Ensure DOM is ready before initializing (safe across pages)
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    /**
     * Get stored theme preference from localStorage
     */
    getStoredTheme() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            return stored === 'dark' || stored === 'light' ? stored : null;
        } catch (e) {
            return null;
        }
    }

    /**
     * Get system theme preference using prefers-color-scheme media query
     */
    getSystemPreference() {
        try {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark';
            }
            return 'light';
        } catch (e) {
            return 'light';
        }
    }

    /**
     * Initialize theme manager and setup listeners
     */
    init() {
        // Apply stored or system preference theme
        this.applyTheme(this.currentTheme, false);
        
        // Setup theme toggle buttons
        this.setupToggle();
        
        // Listen for system theme changes
        this.setupSystemPreferenceListener();
    }

    /**
     * Apply theme with smooth transitions and icon updates
     */
    applyTheme(theme, useTransition = true) {
        if (theme !== 'dark' && theme !== 'light') {
            console.warn(`Invalid theme: ${theme}. Using 'light'.`);
            theme = 'light';
        }

        // Add transition class for smooth color changes
        if (useTransition) {
            document.documentElement.classList.add(this.TRANSITION_CLASS);
        }

        // Update current theme
        this.currentTheme = theme;

        // Update body classes for theme usage (required: body.light-mode / body.dark-mode)
        document.body.classList.remove('light-mode', 'dark-mode');
        document.body.classList.add(theme === 'dark' ? 'dark-mode' : 'light-mode');

        // Also keep documentElement classes for backward compatibility
        document.documentElement.classList.remove(this.THEME_CLASS_LIGHT, this.THEME_CLASS_DARK);
        document.documentElement.classList.add(theme === 'dark' ? this.THEME_CLASS_DARK : this.THEME_CLASS_LIGHT);

        // Persist theme preference to localStorage
        this.persistTheme(theme);

        // Update theme toggle button icons and aria labels
        this.updateToggleButtons(theme);

        // Remove transition class after animation completes
        if (useTransition) {
            setTimeout(() => {
                document.documentElement.classList.remove(this.TRANSITION_CLASS);
            }, this.TRANSITION_DURATION);
        }

        // Broadcast theme change event for other modules to respond
        this.broadcastThemeChange(theme);
    }

    /**
     * Persist theme choice to localStorage
     */
    persistTheme(theme) {
        try {
            localStorage.setItem(this.STORAGE_KEY, theme);
        } catch (e) {
            console.warn('Unable to persist theme preference:', e);
        }
    }

    /**
     * Update theme toggle button icons and labels
     */
    updateToggleButtons(theme) {
        document.querySelectorAll('#themeToggle, .theme-toggle').forEach(toggleBtn => {
            // Update button content with appropriate emoji/icon
            toggleBtn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
            
            // Update accessibility label
            toggleBtn.setAttribute('aria-label', 
                theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
            
            // Update title for tooltip
            toggleBtn.setAttribute('title', 
                theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
        });
    }

    /**
     * Broadcast custom event for theme changes
     */
    broadcastThemeChange(theme) {
        try {
            document.dispatchEvent(new CustomEvent('themeChange', { 
                detail: { 
                    theme, 
                    isDark: theme === 'dark' 
                },
                bubbles: true,
                cancelable: false
            }));
        } catch (e) {
            console.warn('Unable to dispatch theme change event:', e);
        }
    }

    /**
     * Toggle between light and dark themes
     */
    toggle() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme, true);
    }

    /**
     * Setup click handlers for all theme toggle buttons
     */
    setupToggle() {
        document.querySelectorAll('#themeToggle, .theme-toggle').forEach(toggleBtn => {
            // Remove any existing listeners by cloning
            const newBtn = toggleBtn.cloneNode(true);
            toggleBtn.parentNode.replaceChild(newBtn, toggleBtn);
            
            // Add new listener
            newBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggle();
            });
        });
    }

    /**
     * Listen for system preference changes (e.g., user changes OS theme)
     */
    setupSystemPreferenceListener() {
        try {
            if (window.matchMedia) {
                const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
                
                // Handle both old and new API for media query listener
                if (darkModeQuery.addEventListener) {
                    darkModeQuery.addEventListener('change', (e) => {
                        // Only apply system preference if user hasn't explicitly set a preference
                        if (!localStorage.getItem(this.STORAGE_KEY)) {
                            const systemTheme = e.matches ? 'dark' : 'light';
                            this.applyTheme(systemTheme, true);
                        }
                    });
                } else if (darkModeQuery.addListener) {
                    // Fallback for older browsers
                    darkModeQuery.addListener((e) => {
                        if (!localStorage.getItem(this.STORAGE_KEY)) {
                            const systemTheme = e.matches ? 'dark' : 'light';
                            this.applyTheme(systemTheme, true);
                        }
                    });
                }
            }
        } catch (e) {
            console.warn('Unable to setup system preference listener:', e);
        }
    }

    /**
     * Get current theme
     */
    getTheme() {
        return this.currentTheme;
    }

    /**
     * Check if current theme is dark
     */
    isDark() {
        return this.currentTheme === 'dark';
    }

    /**
     * Explicitly set theme to light
     */
    setLight() {
        this.applyTheme('light', true);
    }

    /**
     * Explicitly set theme to dark
     */
    setDark() {
        this.applyTheme('dark', true);
    }

    /**
     * Reset to system preference
     */
    resetToSystemPreference() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
        } catch (e) {
            console.warn('Unable to clear theme preference:', e);
        }
        const systemTheme = this.getSystemPreference();
        this.applyTheme(systemTheme, true);
    }
}

// Instantiate globally if not already created (pages that load app.js will reassign)
if (!window.themeManager) {
    window.themeManager = new ThemeManager();
}
