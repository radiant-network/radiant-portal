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
  placement?: 'top' | 'bottom';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  className, 
  placement = 'bottom' 
}) => {  
  const { currentLanguage, setLanguage, languages, t } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  
  // Map placement to direction
  const direction = placement === 'top' ? 'up' : 'down';

  const handleLanguageChange = async (lang: string) => {
    setIsLoading(true);
    try {
      await setLanguage(lang);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <NavigationMenu className={className} direction={direction}>
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
