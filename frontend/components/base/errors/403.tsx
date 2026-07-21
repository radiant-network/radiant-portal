import type { ReactNode } from 'react';
import logoUrl from '@assets/logo/header-full-white.svg';

import CenterLayout from '@/components/base/layouts/center-layout';
import RadiantBackground from '@/components/base/layouts/radiant-background';
import NavbarLangSwitcher from '@/components/base/navbar/main-navbar-lang-switcher';
import { Button } from '@/components/base/shadcn/button';
import { useI18n } from '@/components/hooks/i18n';

const logo = <img src={logoUrl} alt="RADIANT" />;

interface Error403Props {
  title?: ReactNode;
  message?: ReactNode;
  extra?: ReactNode;
}

function Error403({ title, message, extra }: Error403Props) {
  const { t } = useI18n();
  return (
    <CenterLayout
      logo={logo}
      langSwitcher={<NavbarLangSwitcher className="text-white hover:bg-white/10 hover:text-white" />}
      background={<RadiantBackground />}
    >
      <div className="w-full max-w-sm space-y-6 rounded-lg border bg-card p-6 text-center shadow-xs">
        <div className="space-y-3">
          <h1 className="text-lg font-semibold text-foreground">{title ?? t('errors.forbidden.title')}</h1>
          <p className="text-sm text-muted-foreground">{message ?? t('errors.forbidden.body')}</p>
        </div>
        {extra ?? (
          <Button variant="outline" className="w-full" asChild>
            <a href="/auth/logout">{t('errors.forbidden.cta')}</a>
          </Button>
        )}
      </div>
    </CenterLayout>
  );
}

export default Error403;
