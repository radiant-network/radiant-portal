import { useEffect, useState } from 'react';

export type PlotlyThemeColors = {
  foreground: string;
  muted: string;
  border: string;
  card: string;
};

// Plotly's color parser can't read CSS variables,
// so we map the theme to known-good hex values here.
const LIGHT: PlotlyThemeColors = {
  foreground: '#0f172a', // slate-900
  muted: '#64748b', // slate-500
  border: '#e2e8f0', // slate-200
  card: '#ffffff', // white
};

const DARK: PlotlyThemeColors = {
  foreground: '#f8fafc', // slate-50
  muted: '#94a3b8', // slate-400
  border: '#1e293b', // slate-800
  card: '#020617', // slate-950
};

function isDarkTheme(): boolean {
  if (typeof document === 'undefined') {
    return false;
  }
  return document.documentElement.classList.contains('dark') || document.body.classList.contains('dark');
}

/**
 * Returns the chart chrome colors for the current light/dark theme
 */
export function usePlotlyTheme(): PlotlyThemeColors {
  const [colors, setColors] = useState<PlotlyThemeColors>(() => (isDarkTheme() ? DARK : LIGHT));

  useEffect(() => {
    const update = () => setColors(isDarkTheme() ? DARK : LIGHT);
    update();

    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return colors;
}
