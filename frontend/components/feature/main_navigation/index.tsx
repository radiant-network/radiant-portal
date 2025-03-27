import logo from "@assets/logo/header.svg";
import logoDark from "@assets/logo/header-dark.svg";
import { LanguageSwitcher } from "@/components/base/language-switcher";
import { useI18n } from "@/components/hooks/i18n";
import { NavigationMenu } from '@/components/base/ui/navigation-menu';
import { useConfig } from "@/components/model/applications-config";

interface IProps {
  languages?: string[];
  userName: string;
  onLogout(): void;
}

export function MainNav({ languages = [], userName, onLogout }: IProps) {
  const { t } = useI18n();
  const config = useConfig();

  return (
    <header className="h-12 bg-gray-800 text-white flex items-center justify-between px-4 w-full max-w-full">
      <div className="flex space-x-3 items-center">
        <img src={logo} alt="Logo" className="h-8 w-auto dark:hidden" />
        <img
          src={logoDark}
          alt="Logo"
          className="h-8 w-auto hidden dark:block"
        />

        {/* <img src={logo} alt="Logo" className="h-8 w-auto" /> */}
        <div className="text-lg font-bold">{config.portal.name}</div>
        <nav>
          <a href="#" className="px-4 py-2 hover:bg-gray-700">
            {t('common.navigation.dashboard')}
          </a>
          <a href="#" className="px-4 py-2 hover:bg-gray-700">
            {t('common.navigation.variant')}
          </a>
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button className="py-2 px-3">{userName}</button>
          <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow hidden group-hover:block">
            <a href="#" className="block px-4 py-2 hover:bg-gray-200">
              {t('common.navigation.profile')}
            </a>
            <a href="#" className="block px-4 py-2 hover:bg-gray-200">
              {t('common.navigation.settings')}
            </a>
          </div>
        </div>

        <LanguageSwitcher />

        <button className="text-white py-2 px-3 " onClick={onLogout}>
          {t('common.navigation.logout')}
        </button>
      </div>
    </header>
  );
}
