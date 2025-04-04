import logo from '@assets/logo/header.svg';
import logoDark from '@assets/logo/header-dark.svg';
import { LanguageSwitcher } from '@/components/base/language-switcher';
import { useI18n } from '@/components/hooks/i18n';
import { useConfig } from '@/components/model/applications-config';
import { ThemeToggle } from '@/components/feature/theme-toggle/theme-toggle';
import { Button } from '@/components/base/ui/button';

interface IProps {
  userName: string;
  onLogout(): void;
}

export function MainNav({ userName, onLogout }: IProps) {
  const { t } = useI18n();
  const config = useConfig();

  return (
    <header className="h-12 flex border-b bg-accent/50 items-center justify-between px-4 w-full max-w-full">
      <div className="flex space-x-3 items-center">
        <img src={logo} alt="Logo" className="h-8 w-auto dark:hidden" />
        <img src={logoDark} alt="Logo" className="h-8 w-auto hidden dark:block" />

        {/* <img src={logo} alt="Logo" className="h-8 w-auto" /> */}
        <div className="text-lg font-bold">{config.portal.name}</div>
        <nav>
          <Button variant="ghost">
            <a href="#">{t('common.navigation.dashboard')}</a>
          </Button>
          <Button variant="ghost">
            <a href="#">{t('common.navigation.variant')}</a>
          </Button>
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <button className="py-2 px-3">{userName}</button>

        <LanguageSwitcher />

        <ThemeToggle />

        <button className="py-2 px-3 " onClick={onLogout}>
          {t('common.navigation.logout')}
        </button>
      </div>
    </header>
  );
}
