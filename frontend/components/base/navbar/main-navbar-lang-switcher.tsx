import { useState } from 'react';
import { setDefaultOptions } from 'date-fns';
import { enUS, frCA } from 'date-fns/locale';

import { Button } from '@/components/base/shadcn/button';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';

interface NavbarLangSwitcherProps {
  className?: string;
}

function NavbarLangSwitcher({ className }: NavbarLangSwitcherProps) {
  const { t, currentLanguage, setLanguage } = useI18n();

  const [isLoading, setIsLoading] = useState(false);
  const nextLanguage = currentLanguage === 'en' ? 'fr' : 'en';

  const handleLanguageChange = async (lang: string) => {
    setIsLoading(true);
    try {
      await setLanguage(lang);
      switch (lang) {
        case 'fr':
          setDefaultOptions({ locale: frCA });
          break;
        default:
          setDefaultOptions({ locale: enUS });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      data-cy="lang-button"
      variant="ghost"
      iconOnly
      className={cn('text-muted-foreground px-3 text-base md:text-sm', className)}
      loading={isLoading}
      aria-label={t(`a11y.lang_switcher.switch_to_${nextLanguage}`)}
      onClick={() => handleLanguageChange(nextLanguage)}
    >
      {nextLanguage.toUpperCase()}
    </Button>
  );
}

export default NavbarLangSwitcher;
