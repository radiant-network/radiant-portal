import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../../translations/common/en.json';
import fr from '../../translations/common/fr.json';

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      en: { common: en },
      fr: { common: fr },
    },
    lng: 'en',
    fallbackLng: 'en',
    ns: ['common'],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
  });
}

export default i18n;
