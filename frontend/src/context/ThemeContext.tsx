import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  sidebarColor: string;
  headerColor: string;
  fontFamily: string;
  borderRadius: string;
  logoUrl?: string;
}

interface ThemeContextType {
  theme: ThemeConfig;
  setTheme: (theme: Partial<ThemeConfig>) => void;
  resetTheme: () => void;
}

const defaultTheme: ThemeConfig = {
  primaryColor: '#6366f1',
  secondaryColor: '#8b5cf6',
  accentColor: '#f97316',
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  sidebarColor: '#1e1b4b',
  headerColor: '#ffffff',
  fontFamily: 'Inter',
  borderRadius: '0.75rem',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeConfig>(defaultTheme);

  useEffect(() => {
    const stored = localStorage.getItem('companyTheme');
    if (stored) {
      try {
        setThemeState({ ...defaultTheme, ...JSON.parse(stored) });
      } catch {}
    }
  }, []);

  useEffect(() => {
    // Apply CSS variables
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', theme.primaryColor);
    root.style.setProperty('--theme-secondary', theme.secondaryColor);
    root.style.setProperty('--theme-accent', theme.accentColor);
    root.style.setProperty('--theme-bg', theme.backgroundColor);
    root.style.setProperty('--theme-text', theme.textColor);
    root.style.setProperty('--theme-sidebar', theme.sidebarColor);
    root.style.setProperty('--theme-header', theme.headerColor);
    root.style.setProperty('--theme-font', theme.fontFamily);
    root.style.setProperty('--theme-radius', theme.borderRadius);
  }, [theme]);

  const setTheme = (partial: Partial<ThemeConfig>) => {
    const newTheme = { ...theme, ...partial };
    setThemeState(newTheme);
    localStorage.setItem('companyTheme', JSON.stringify(newTheme));
  };

  const resetTheme = () => {
    setThemeState(defaultTheme);
    localStorage.removeItem('companyTheme');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
