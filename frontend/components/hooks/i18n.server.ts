/// <reference types="vite/client" />

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { deepMerge } from '../lib/merge';

// Get the current theme from environment variable
const getCurrentTheme = () => {
  return process.env.THEME || 'radiant';
};

// Load translations synchronously for server
const loadTranslationsSync = async (lang: string) => {
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

// Create a server-side i18n instance
export const createServerI18n = async (lng: string = 'en') => {
  const fallbackLng = 'en';
  const resources: any = {};

  // Load only the current language and fallback if different
  const languagesToLoad = lng === fallbackLng ? [lng] : [lng, fallbackLng];
  
  for (const lang of languagesToLoad) {
    try {
      const translations = await loadTranslationsSync(lang);
      resources[lang] = {
        common: translations,
        portal: {},
      };
    } catch (error) {
      console.warn(`Failed to load server translations for ${lang}`);
      resources[lang] = {
        common: {},
        portal: {},
      };
    }
  }

  const serverI18n = i18next.createInstance();
  
  await serverI18n
    .use(initReactI18next)
    .init({
      lng,
      fallbackLng: 'en',
      debug: false,
      supportedLngs: ['en', 'fr'],
      ns: ['common', 'portal'],
      defaultNS: 'common',
      interpolation: {
        escapeValue: false,
      },
      resources,
    });

  return serverI18n;
}; 