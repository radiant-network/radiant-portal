/// <reference types="vite/client" />

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { useTranslation } from 'react-i18next';

// Load pre-merged translations (no runtime merging needed)
const loadTranslations = async (lang: string) => {
  try {
    const translations = await import(`@translations-merged/${lang}.json`);
    return translations.default;
  } catch (error) {
    console.error(`Failed to load merged translations for ${lang}. Make sure the build process has run to generate merged translation files.`);
    throw new Error(`Missing merged translation file for language: ${lang}`);
  }
};

// Initialize i18next
i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    debug: import.meta.env.DEV,
    fallbackLng: 'en',
    lng: 'en',
    
    // Only support en and fr
    supportedLngs: ['en', 'fr'],
    
    // No namespace - all translations are merged into 'common'
    defaultNS: 'common',
    ns: ['common'],
    
    // Detection options for browser
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator'],
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage', 'cookie'],
    },

    interpolation: {
      escapeValue: false,
    },
  });

// Load translations for each supported language
const initializeTranslations = async () => {
  const languages = ['en', 'fr'];
  
  for (const lang of languages) {
    try {
      const translations = await loadTranslations(lang);
      i18next.addResourceBundle(lang, 'common', translations, true, true);
    } catch (error) {
      console.error(`Failed to initialize translations for ${lang}:`, error);
    }
  }
  
  console.log('✅ Pre-merged translations loaded successfully');
};

// Initialize translations
initializeTranslations();

// Simple hook for language switching (backward compatibility)
export const useI18n = () => {
  const { t, i18n } = useTranslation();
  
  const changeLanguage = async (lang: string) => {
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

export default i18next;
export { useTranslation };
// Backward compatibility export
export { i18next as i18n };
