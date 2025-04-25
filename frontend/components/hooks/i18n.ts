/// <reference types="vite/client" />

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { useTranslation } from 'react-i18next';

/**
 * Deep merge two objects, with the second object overriding the first
 */
const deepMerge = <T extends Record<string, any>>(target: T, source: T): T => {
  const result = { ...target };

  for (const key in source) {
    if (source[key] && typeof source[key] === 'object') {
      result[key] = deepMerge(result[key] || ({} as T[typeof key]), source[key]);
    } else {
      result[key] = source[key];
    }
  }

  return result;
};

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

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en',
    debug: import.meta.env.DEV,
    supportedLngs: ['en', 'fr', 'de', 'es'],

    // Namespaces for different translation layers
    ns: ['common', 'portal'],
    defaultNS: 'common',

    // Language detection configuration
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator'],
      caches: ['localStorage', 'cookie'],
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
    },

    // Interpolation configuration
    interpolation: {
      escapeValue: false,
    },

    // Initialize with empty resources
    resources: {
      en: {
        common: {},
        portal: {},
      },
      fr: {
        common: {},
        portal: {},
      },
      de: {
        common: {},
        portal: {},
      },
      es: {
        common: {},
        portal: {},
      },
    },
  });

// Load initial language
const initialLang = i18next.language;
loadTranslations(initialLang).then(translations => {
  i18next.addResourceBundle(initialLang, 'common', translations, true, true);
});

export const useI18n = (namespace?: string) => {
  const { t, i18n } = useTranslation(namespace);

  const setLanguage = async (lang: string) => {
    if (lang === i18n.language) return;

    try {
      // Load translations for the new language
      const translations = await loadTranslations(lang);

      // Add translations before changing language to prevent flicker
      i18next.addResourceBundle(lang, 'common', translations, true, true);

      // Change the language
      await i18n.changeLanguage(lang);
    } catch (error) {
      console.error('Failed to change language:', error);
      // Revert to previous language if change fails
      await i18n.changeLanguage(i18n.language);
    }
  };

  return {
    t,
    i18n,
    currentLanguage: i18n.language,
    setLanguage,
    languages: ['en', 'fr', 'de', 'es'],
  };
};

export { i18next as i18n };
