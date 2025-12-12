import { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import Cookies from 'universal-cookie';

import { IThemeContextProps, Theme, ThemeContext } from '@/components/base/theme-toggle/theme-context';

const persistKey = 'theme';
const cookies = new Cookies(null, { path: '/' });

export default function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<Theme>(() => (cookies.get(persistKey) ? cookies.get(persistKey) : Theme.LIGHT));

  const toggleTheme = (theme: Theme) => {
    setTheme(theme);
    cookies.set(persistKey, theme);
  };

  useEffect(() => {
    document.body.classList.remove(Theme.LIGHT, Theme.DARK);
    document.body.classList.add(theme);
  }, [theme]);

  const memoedContext = useMemo<IThemeContextProps>(() => ({ theme, toggleTheme }), [theme]);

  return <ThemeContext.Provider value={memoedContext}>{children}</ThemeContext.Provider>;
}
