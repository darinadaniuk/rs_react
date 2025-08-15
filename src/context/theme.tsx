'use client';

import { createContext, useContext, useEffect } from 'react';

import { useStorage } from '@rs-react/hooks/local-storage.hook';

type Theme = 'light' | 'dark';

interface ThemeContext {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const DefaultContext: ThemeContext = {
  theme: 'dark',
  setTheme: () => {},
};

const ThemeContext = createContext<ThemeContext>(DefaultContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useStorage<Theme>('theme', {
    failoverValue: DefaultContext.theme,
  });

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);

    return () => {
      document.body.removeAttribute('data-theme');
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
