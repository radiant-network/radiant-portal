/* eslint-disable no-console */
/// <reference types="vite/client" />

import { initReactI18next } from 'react-i18next';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { replaceUnderscore } from '../lib/string-format';

// Load pre-merged translations (no runtime merging needed)
const loadTranslations = async (lang: string) => {
  try {
    // @vite-ignore - We want to keep the merged file approach
    const translations = await import(`@translations-merged/${lang}.json`);
    return translations.default;
  } catch (error) {
    console.error(
      `Failed to load merged translations for ${lang}. Make sure the build process has run to generate merged translation files.`,
    );
    throw new Error(`Missing merged translation file for language: ${lang}`);
  }
};

// Track initialization state
let isInitialized = false;
let initializationPromise: Promise<void> | null = null;

// Initialize i18next and load initial translations
const initializeI18n = async () => {
  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    // Initialize i18next first with LanguageDetector
    await i18next
      .use(initReactI18next)
      .use(LanguageDetector)
      .init({
        debug: import.meta.env.DEV,
        fallbackLng: 'en',
        // Don't set lng here - let LanguageDetector handle it

        // Only support en and fr
        supportedLngs: ['en', 'fr'],

        // No namespace - all translations are merged into 'common'
        defaultNS: 'common',
        ns: ['common'],

        // Detection options for browser
        detection: {
          order: ['localStorage', 'querystring', 'cookie', 'navigator'],
          lookupQuerystring: 'lng',
          lookupCookie: 'i18next',
          lookupLocalStorage: 'i18nextLng',
          caches: ['localStorage', 'cookie'],
        },

        interpolation: {
          escapeValue: false,
        },
      });

    // Now get the detected language from LanguageDetector
    const detectedLang = i18next.language;
    console.log(`LanguageDetector detected language: ${detectedLang}`);

    // Load translations for the detected language
    try {
      console.log(`Loading initial translations for ${detectedLang}...`);
      const translations = await loadTranslations(detectedLang);
      i18next.addResourceBundle(detectedLang, 'common', translations, true, true);
      console.log(`✅ Initial translations loaded for ${detectedLang}`);
    } catch (error) {
      console.error(`Failed to load initial translations for ${detectedLang}:`, error);
      // Try to load fallback
      if (detectedLang !== 'en') {
        try {
          const fallbackTranslations = await loadTranslations('en');
          i18next.addResourceBundle('en', 'common', fallbackTranslations, true, true);
          await i18next.changeLanguage('en');
          console.log('✅ Fallback English translations loaded');
        } catch (fallbackError) {
          console.error('Failed to load fallback translations:', fallbackError);
        }
      }
    }

    isInitialized = true;
    console.log('✅ i18n initialization complete');
  })();

  return initializationPromise;
};

// Simple hook for language switching (backward compatibility)
export const useI18n = () => {
  const { t, i18n } = useTranslation();

  /**
   * APIs key does not always respect snake_case.
   * Sanitize ensure to transform the key in a correct snake_case format
   * Some key in apis can start with _ like _low_penetrance
   */
  const sanitize = (key?: string | number | boolean) => String(key).replace(/^_+/, '').toLowerCase();

  /**
   * Automatic translation where values are stripped from underscore
   * To be used with value that are always displayed in english
   */
  const lazyTranslate = (key?: string | number | boolean) => replaceUnderscore(String(key)).toLowerCase();

  const changeLanguage = async (lang: string) => {
    // Load the language if it's not already loaded
    if (!i18n.hasResourceBundle(lang, 'common')) {
      try {
        console.log(`Loading translations for ${lang}...`);
        const translations = await loadTranslations(lang);
        i18n.addResourceBundle(lang, 'common', translations, true, true);
        localStorage.setItem('language', lang);
        console.log(`✅ Translations loaded for ${lang}`);
      } catch (error) {
        console.error(`Failed to load translations for ${lang}:`, error);
        return; // Don't change language if loading failed
      }
    }

    await i18n.changeLanguage(lang);
  };

  return {
    t,
    sanitize,
    lazyTranslate,
    changeLanguage,
    language: i18n.language,
    languages: ['en', 'fr'],
    // Backward compatibility
    setLanguage: changeLanguage,
    currentLanguage: i18n.language,
    i18n,
  };
};
// Export functions for initialization control
export const waitForI18n = () => {
  if (!initializationPromise) {
    return initializeI18n();
  }
  return initializationPromise;
};

export const isI18nReady = () => isInitialized;

// Auto-initialize on import (but don't block)
initializeI18n();

export default i18next;
export { useTranslation };
// Backward compatibility export
export { i18next as i18n };
