/// <reference types="vite/client" />

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { useTranslation } from 'react-i18next';
import { deepMerge } from '../lib/merge';

// Get the current theme from environment variable
const getCurrentTheme = () => {
  return import.meta.env.THEME || 'radiant';
};

// Load translations based on theme
const loadTranslations = async (lang: string) => {
  const theme = getCurrentTheme();

  try {
    // Load translations in parallel but handle errors separately
    const [commonResult, portalResult] = await Promise.allSettled([
      import(`@translations/common/${lang}.json`),
      import(`@translations/portals/${theme}/${lang}.json`),
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
    const common = await import(`@translations/common/${lang}.json`);
    return common.default;
  }
};

// Initialize i18next
i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en',
    debug: import.meta.env.DEV,
    supportedLngs: ['en', 'fr'],

    ns: ['common', 'portal'],
    defaultNS: 'common',
    
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator'],
      caches: ['localStorage', 'cookie'],
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
    },

    interpolation: {
      escapeValue: false,
    },

    // Start empty - load on demand
    resources: {},
  });

// Simple hook that loads translations on demand (maintains backward compatibility)
export const useI18n = (namespace?: string) => {
  const { t, i18n } = useTranslation(namespace);

  const changeLanguage = async (lang: string) => {
    // Check if we already have translations
    if (!i18n.hasResourceBundle(lang, 'common')) {
      try {
        const translations = await loadTranslations(lang);
        i18n.addResourceBundle(lang, 'common', translations);
      } catch (error) {
        console.error('Failed to load translations:', error);
      }
    }
    
    await i18n.changeLanguage(lang);
  };

  return {
    t,
    changeLanguage,
    language: i18n.language,
    languages: ['en', 'fr'],
    // Backward compatibility
    setLanguage: changeLanguage,
    currentLanguage: i18n.language,
    i18n
  };
};

// Load initial translations
loadTranslations(i18next.language || 'en').then(translations => {
  i18next.addResourceBundle(i18next.language || 'en', 'common', translations);
});

export { i18next as i18n };
