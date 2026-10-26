import { APP_NAMES } from './config/catalog';
import { type ThemeName, THEMES } from './config/themes';

export function computeApps(theme: string): Record<string, boolean> {
  const definition = THEMES[theme as ThemeName];
  if (!definition) {
    throw new Error(`Unknown THEME "${theme}": add it to THEMES in config/themes.ts`);
  }

  const apps: readonly string[] = definition.apps;
  return Object.fromEntries(APP_NAMES.map(name => [`import.meta.env.APPS_${name}`, apps.includes(name)]));
}
