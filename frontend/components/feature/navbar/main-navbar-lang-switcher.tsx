import { useState } from 'react';
import { cn } from '@/components/lib/utils';
import { Button } from '@/components/base/ui/button';
import { useI18n } from '@/components/hooks/i18n';

interface NavbarLangSwitcherProps {
  className?: string;
}

function NavbarLangSwitcher({ className }: NavbarLangSwitcherProps) {
  const { currentLanguage, setLanguage } = useI18n();

  const [isLoading, setIsLoading] = useState(false);

  const handleLanguageChange = async (lang: string) => {
    setIsLoading(true);
    try {
      await setLanguage(lang);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      iconOnly
      className={cn('text-muted-foreground px-3 text-base md:text-sm', className)}
      loading={isLoading}
      onClick={() => handleLanguageChange(currentLanguage === 'en' ? 'fr' : 'en')}
    >
      {currentLanguage === 'en' ? 'FR' : 'EN'}
    </Button>
  );
}

export default NavbarLangSwitcher;
