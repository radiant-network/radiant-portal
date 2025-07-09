import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { i18n } from './i18n';

interface I18nProviderProps {
  children: React.ReactNode;
  initialLanguage?: string;
}

export function I18nProvider({ children, initialLanguage }: I18nProviderProps) {
  useEffect(() => {
    // Set the initial language if provided by server
    if (initialLanguage && i18n.language !== initialLanguage) {
      i18n.changeLanguage(initialLanguage);
    }
  }, [initialLanguage]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}