import React, { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { i18nPromise, getI18nInstance, i18n } from './i18n';

interface I18nProviderProps {
  children: React.ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [i18nInstance, setI18nInstance] = useState(i18n);

  useEffect(() => {
    // Update to the fully initialized instance when ready
    i18nPromise.then(() => {
      const fullyInitialized = getI18nInstance();
      setI18nInstance(fullyInitialized);
    }).catch((error) => {
      console.error('Failed to initialize i18n:', error);
      // Continue with the base instance - no need to block
    });
  }, []);

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>;
}