import { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { IThemeContextProps, Theme, ThemeContext } from '@/components/feature/theme-toggle/theme-context';

const persistKey = 'theme';

export default function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<Theme>(() => {
    // TODO find a way to correctly persist with server-side rendering
    //const savedTheme = localStorage.getItem(persistKey) as Theme | null;
    return Theme.LIGHT;
  });

  const toggleTheme = (theme: Theme) => {
    setTheme(theme);
    //localStorage.setItem(persistKey, newTheme);
  };

  useEffect(() => {
    document.body.classList.remove(Theme.LIGHT, Theme.DARK);
    document.body.classList.add(theme);
  }, [theme]);

  const memoedContext = useMemo<IThemeContextProps>(() => ({ theme, toggleTheme }), [theme]);

  return <ThemeContext.Provider value={memoedContext}>{children}</ThemeContext.Provider>;
}
