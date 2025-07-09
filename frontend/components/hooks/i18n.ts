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

// Initialize i18next immediately with empty resources
i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en',
    debug: import.meta.env.DEV,
    supportedLngs: ['en', 'fr'],

    // Namespaces for different translation layers
    ns: ['common', 'portal'],
    defaultNS: 'common',

    // Language detection configuration
    detection: {
      order: ['cookie', 'localStorage', 'navigator'],
      caches: ['localStorage', 'cookie'],
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
    },

    // Interpolation configuration
    interpolation: {
      escapeValue: false,
    },

    // Start with empty resources - translations will be loaded asynchronously
    resources: {
      en: {
        common: {},
        portal: {},
      },
      fr: {
        common: {},
        portal: {},
      }
    },
  });

// Load translations in the background and update when ready
const loadInitialTranslations = async () => {
  const currentLang = i18next.language;

  // Only load translations for the current language to reduce network load
  try {
    const translations = await loadTranslations(currentLang);
    
    // Add translations to the existing i18next instance
    i18next.addResourceBundle(currentLang, 'common', translations, true, true);
    
    // Trigger a re-render by changing language to apply the loaded translations
    i18next.changeLanguage(currentLang);
  } catch (error) {
    console.warn(`Failed to load initial translations for ${currentLang}`, error);
  }
};

// Start loading translations immediately but don't block
const initPromise = loadInitialTranslations();

export const useI18n = (namespace?: string) => {
  const { t, i18n } = useTranslation(namespace);

  const setLanguage = async (lang: string) => {
    if (lang === i18n.language) return;

    try {
      // Check if we already have translations for this language
      const hasResources = i18n.getResourceBundle(lang, 'common');
      
      if (!hasResources || Object.keys(hasResources).length === 0) {
        // Load translations for the new language
        const translations = await loadTranslations(lang);
        
        // Add translations before changing language to prevent flicker
        i18n.addResourceBundle(lang, 'common', translations, true, true);
      }

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
    languages: ['en', 'fr'],
  };
};

// Export the i18next instance (available immediately)
export { i18next as i18n };

// Export the initialized i18next instance
export const getI18nInstance = () => {
  return i18next;
};

// Export the promise for components that need to wait for initialization
export const i18nPromise = initPromise;
