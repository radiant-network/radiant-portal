import React, { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';

import { i18n, isI18nReady, waitForI18n } from './i18n';

interface I18nProviderProps {
  children: React.ReactNode;
  initialLanguage?: string;
}

export function I18nProvider({ children, initialLanguage }: I18nProviderProps) {
  const [isReady, setIsReady] = useState(isI18nReady());

  useEffect(() => {
    if (!isReady) {
      // Wait for i18n to be fully initialized
      waitForI18n().then(() => {
        // Set initial language if provided and different from current
        if (initialLanguage && i18n.language !== initialLanguage) {
          i18n.changeLanguage(initialLanguage).then(() => {
            setIsReady(true);
          });
        } else {
          setIsReady(true);
        }
      });
    } else if (initialLanguage && i18n.language !== initialLanguage) {
      // If already ready but need to change language
      i18n.changeLanguage(initialLanguage);
    }
  }, [initialLanguage, isReady]);

  // Show loading state while waiting for translations
  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading translations...</div>
      </div>
    );
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
