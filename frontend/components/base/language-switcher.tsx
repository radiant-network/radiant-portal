import React, { useState } from 'react';
import { useI18n } from '../hooks/i18n';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/base/ui/navigation-menu';

interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className }) => {
  const { currentLanguage, setLanguage, languages, t } = useI18n();
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
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent p-2">
            {isLoading ? t('common.loading') : <>{currentLanguage.toUpperCase()}</>}
          </NavigationMenuTrigger>
          <NavigationMenuContent className="p-2">
            {languages.map((lang: string) => (
                <NavigationMenuLink
                key={lang}
                className={`${navigationMenuTriggerStyle()} p-4`}
                onClick={() => handleLanguageChange(lang)}
                >
                {t(`common.languages.${lang}`)}
                </NavigationMenuLink>
            ))}
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
