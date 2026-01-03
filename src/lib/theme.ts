const THEME_STORAGE_KEY = 'muhib-theme';

export type Theme = 'light' | 'dark';

/**
 * Get the saved theme from localStorage, or return null if not set
 */
export function getStoredTheme(): Theme | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
  } catch (e) {
    console.error('Error reading theme from localStorage:', e);
  }
  
  return null;
}

/**
 * Save theme to localStorage
 */
export function saveTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (e) {
    console.error('Error saving theme to localStorage:', e);
  }
}

/**
 * Apply theme to the document
 */
export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  const body = document.body;
  
  // Remove both classes first
  root.classList.remove('light', 'dark');
  body.classList.remove('light', 'dark');
  
  // Add the new theme
  root.classList.add(theme);
  body.classList.add(theme);
}

/**
 * Get the current theme from the document
 */
export function getCurrentTheme(): Theme {
  const root = document.documentElement;
  if (root.classList.contains('dark')) return 'dark';
  if (root.classList.contains('light')) return 'light';
  
  // Default to dark if neither is set
  return 'dark';
}

/**
 * Initialize theme on page load
 * Returns the theme that was applied
 */
export function initializeTheme(): Theme {
  // First, try to get stored theme
  const storedTheme = getStoredTheme();
  
  if (storedTheme) {
    applyTheme(storedTheme);
    return storedTheme;
  }
  
  // If no stored theme, check system preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const defaultTheme: Theme = prefersDark ? 'dark' : 'light';
  
  applyTheme(defaultTheme);
  saveTheme(defaultTheme);
  
  return defaultTheme;
}

/**
 * Toggle theme and save to storage
 */
export function toggleTheme(): Theme {
  const currentTheme = getCurrentTheme();
  const newTheme: Theme = currentTheme === 'light' ? 'dark' : 'light';
  
  applyTheme(newTheme);
  saveTheme(newTheme);
  
  return newTheme;
}

