import { createContext, useContext } from 'react';

import { useStorage } from '@rs-react/hooks/local-storage.hook';

type Theme = 'light' | 'dark';

interface ThemeContext {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const DEFAULT_CONTEXT: ThemeContext = {
  theme: 'dark',
  setTheme: () => {},
};

const ThemeContext = createContext<ThemeContext>(DEFAULT_CONTEXT);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useStorage<Theme>('theme', {
    failoverValue: DEFAULT_CONTEXT.theme,
  });

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div data-theme={theme}>{children}</div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
