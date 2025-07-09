/// <reference types="vite/client" />

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { deepMerge } from '../lib/merge';

// Get the current theme from environment variable
const getCurrentTheme = () => {
  return process.env.THEME || 'radiant';
};

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
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);
    
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

// Load translations based on theme (same as client-side)
export const loadTranslations = async (lang: string) => {
  const theme = getCurrentTheme();

  try {
    // Load translations in parallel but handle errors separately
    const [commonResult, portalResult] = await Promise.allSettled([
      import(`../../translations/common/${lang}.json`),
      import(`../../translations/portals/${theme}/${lang}.json`),
    ]);

    // Start with common translations
    let translations = commonResult.status === 'fulfilled' ? commonResult.value.default : {};

    // Add portal translations if available
    if (portalResult.status === 'fulfilled') {
      translations = deepMerge(translations, portalResult.value.default);
    }

    return translations;
  } catch (error) {
    console.warn(`Failed to load translations for ${lang}, falling back to common translations`);
    try {
      const common = await import(`../../translations/common/${lang}.json`);
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
    ns: ['common', 'portal'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      [lng]: {
        common: translations,
        portal: {},
      }
    },
  });

  return serverI18n;
}; 