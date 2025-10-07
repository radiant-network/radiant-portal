/// <reference types="vite/client" />

import { initReactI18next } from 'react-i18next';
import i18next from 'i18next';

// Get the current theme from environment variable
const getCurrentTheme = () => process.env.THEME || 'radiant';

// Simple language detection for consistent server/client behavior
export const detectLanguageFromRequest = (request: Request): string => {
  const url = new URL(request.url);

  // Check URL parameter first
  const langParam = url.searchParams.get('lng');
  if (langParam && ['en', 'fr'].includes(langParam)) {
    return langParam;
  }

  // Check cookie
  const cookieHeader = request.headers.get('Cookie');
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').reduce(
      (acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      },
      {} as Record<string, string>,
    );

    const langCookie = cookies['i18next'] || cookies['i18nextLng'];
    if (langCookie && ['en', 'fr'].includes(langCookie)) {
      return langCookie;
    }
  }

  // Check Accept-Language header
  const acceptLanguage = request.headers.get('Accept-Language');
  if (acceptLanguage) {
    const languages = acceptLanguage.split(',').map(lang => lang.split(';')[0].trim());
    for (const lang of languages) {
      if (lang.startsWith('fr')) return 'fr';
      if (lang.startsWith('en')) return 'en';
    }
  }

  return 'en';
};

// Load pre-merged translations (same as client-side now)
export const loadTranslations = async (lang: string) => {
  const theme = getCurrentTheme();

  try {
    // Load merged translations directly
    // @vite-ignore - We want to keep the merged file approach
    const mergedPath = `../../translations/merged/${theme}/${lang}.json`;
    const merged = await import(/* @vite-ignore */ mergedPath);
    return merged.default;
  } catch (error) {
    console.warn(`Failed to load merged translations for ${theme}/${lang}, falling back to common`);
    try {
      // @vite-ignore - Fallback to common translations
      const common = await import(/* @vite-ignore */ `../../translations/common/${lang}.json`);
      return common.default;
    } catch {
      return {};
    }
  }
};

// Create a simple server-side i18n instance
export const createServerI18n = async (lng: string = 'en') => {
  const translations = await loadTranslations(lng);

  const serverI18n = i18next.createInstance();

  await serverI18n.use(initReactI18next).init({
    lng,
    fallbackLng: 'en',
    debug: false,
    ns: ['common'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      [lng]: {
        common: translations,
      },
    },
  });

  return serverI18n;
};
