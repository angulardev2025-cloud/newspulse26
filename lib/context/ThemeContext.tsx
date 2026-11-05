'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  darkMode: boolean;
  theme: ThemeMode;
  setDarkMode: (val: boolean) => void;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  theme: 'system',
  setDarkMode: () => {},
  setTheme: () => {},
  toggleTheme: () => {},
});

const THEME_STORAGE_KEY = 'newspulse_theme_preference';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>('system');
  const [darkMode, setDarkModeState] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  // Apply theme to document root
  const applyTheme = useCallback((isDark: boolean) => {
    setDarkModeState(isDark);
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (isDark) {
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
      }
    }
  }, []);

  // Initialize theme on mount from localStorage or system preference
  useEffect(() => {
    setMounted(true);
    try {
      const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
      const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (storedTheme === 'dark') {
        setThemeState('dark');
        applyTheme(true);
      } else if (storedTheme === 'light') {
        setThemeState('light');
        applyTheme(false);
      } else {
        setThemeState('system');
        applyTheme(systemPrefersDark);
      }
    } catch (e) {
      // Fallback in case localStorage is blocked
      const systemPrefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(Boolean(systemPrefersDark));
    }
  }, [applyTheme]);

  // Listen for OS system theme changes if theme is set to 'system'
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (!storedTheme || storedTheme === 'system') {
        applyTheme(e.matches);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [applyTheme]);

  // Public setters
  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (e) {}

    if (newTheme === 'dark') {
      applyTheme(true);
    } else if (newTheme === 'light') {
      applyTheme(false);
    } else {
      const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(Boolean(systemDark));
    }
  }, [applyTheme]);

  const setDarkMode = useCallback((val: boolean) => {
    setTheme(val ? 'dark' : 'light');
  }, [setTheme]);

  const toggleTheme = useCallback(() => {
    setDarkMode(!darkMode);
  }, [darkMode, setDarkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, theme, setDarkMode, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
