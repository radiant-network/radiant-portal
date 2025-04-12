import logo from '@assets/logo/header.svg';
import logoDark from '@assets/logo/header-dark.svg';
import { LanguageSwitcher } from '@/components/base/language-switcher';
import { useI18n } from '@/components/hooks/i18n';
import { useConfig } from '@/components/model/applications-config';
import { ThemeToggle } from '@/components/feature/theme-toggle/theme-toggle';
import { Button } from '@/components/base/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import BetaFeaturesSheet from '../admin/beta-features-sheet';
import { useState } from 'react';
import { CircleUser, LogOut, ArrowLeftToLine, ArrowRightToLine, DnaOff, House } from 'lucide-react';

import { tv } from 'tailwind-variants';

interface IProps {
  userName: string;
  onLogout(): void;
  orientation: 'left' | 'right' | 'top';
  onCollapse?: () => void;
  layout?: 'compact' | 'normal';
}

const headerVariants = tv({
  base: 'flex bg-accent/50 px-4',
  variants: {
    orientation: {
      side: 'flex-col h-screen items-start',
      top: 'flex-row h-12 w-full items-center border-b',
    },
    side: {
      left: 'border-r',
      right: 'border-l',
    },
    layout: {
      compact: '',
      normal: '',
    }
  },
  compoundVariants: [
    {
      orientation: 'side',
      layout: 'compact',
      class: 'w-[60px]',
    },
    {
      orientation: 'side',
      layout: 'normal',
      class: 'w-[170px]',
    },
  ],
  defaultVariants: {
    orientation: 'top',
    layout: 'normal',
    side: 'left',
  },
});

const logoContainerVariants = tv({
  base: 'relative flex items-center',
  variants: {
    orientation: {
      side: 'space-x-2 mt-2 w-full',
      top: 'space-x-3',
    },
    layout: {
      compact: 'p-0',
      normal: 'p-2',
    },
  },
});

const logoVariants = tv({
  base: 'h-8',
});

const portalNameVariants = tv({
  base: 'text-lg font-bold',
});

const collapseButtonVariants = tv({
  base: 'h-8 w-8 p-0',
  variants: {
    side: {
      left: 'absolute right-[-12px]',
      right: 'absolute left-[-42px] rotate-180',
    }, 
    layout: {
      compact: 'rotate-180',
      normal: '',
    },
  },
  compoundVariants: [
    {
      side: 'left',
      layout: 'compact',
      class: 'right-[-34px]',
    },
    {
      side: 'right',
      layout: 'compact',
      class: 'left-[-44px] rotate-0',
    },
  ]
});

const menuContentVariants = tv({
  base: 'flex',
  variants: {
    orientation: {
      side: 'flex-col justify-between space-y-2 h-full w-full mt-4',
      top: 'flex-row ml-4 justify-start flex-grow',
    },
  },
});

const menuLinksVariants = tv({
  base: 'flex',
  variants: {
    orientation: {
      side: 'flex-col w-full',
      top: 'flex-row justify-start space-x-1',
    },
    layout: {
      compact: 'items-center justify-center w-full',
      normal: 'w-full items-center justify-start',
    },
  },
  compoundVariants: [
    {
      orientation: 'side',
      layout: 'normal',
      class: 'flex-col justify-start items-start w-full pb-3',
    },
  ]
});

const extraSectionVariants = tv({
  base: 'flex',
  variants: {
    orientation: {
      side: 'flex-col flex-wrap items-center mb-4 w-full',
      top: 'flex-row space-x-3 gap-4',
    },
  },
});

const extraItemVariants = tv({
  base: 'flex items-center',
  variants: {
    orientation: {
      side: 'justify-between w-full pb-3',
      top: 'gap-2',
    },
    layout: {
      compact: 'flex-col flex-wrap justify-center w-full',
      normal: 'flex-row w-full',
    },
  },
});

const textButtonVariants = tv({
  base: 'py-0 px-2',
  variants: {
    layout: {
      compact: '',
      normal: 'justify-start',
    },
  },
});

const actionButtonsVariants = tv({
  base: 'w-full py-0 px-0',
  variants: {
    layout: {
      compact: 'flex justify-center w-full',
      normal: 'w-full w-8',
    },
    side: {
      left: 'pl-0',
      right: 'pr-0',
    },
  },
});

export function MainNav({
  userName,
  onLogout,
  orientation: position,
  layout = 'normal',
  onCollapse
}: IProps) {
  const { t } = useI18n();
  const config = useConfig();
  const [betaSuperMode, setBetaSuperMode] = useState(false);

  const orientation = position === 'left' || position === 'right' ? 'side' : 'top';
  const side = position !== 'top' ? position : undefined;

  return (
    <header className={headerVariants({ orientation, side, layout })}>
      <div className={logoContainerVariants({ orientation, layout })}>
        <img src={logo} alt="Logo" className={logoVariants()} />
        {layout === 'normal' && <div className={portalNameVariants()}>{config.portal.name}</div>}
        {onCollapse && orientation === 'side' && (
          <Button
            className={collapseButtonVariants({ side, layout })}
            variant={layout === 'compact' ? "outline" : "ghost"}
            size="sm"
            onClick={onCollapse}
          >
            <ArrowLeftToLine />
          </Button>
        )}
      </div>

      <div className={menuContentVariants({ orientation })}>
        <nav className={menuLinksVariants({ orientation, layout })}>
          <Button className={textButtonVariants({ layout })} variant="ghost">
            <House />{layout === 'normal' && t('common.navigation.dashboard')}
          </Button>
          <Button className={textButtonVariants({ layout })} variant="ghost">
            <DnaOff />{layout === 'normal' && t('common.navigation.variant')}
          </Button>
        </nav>

        <div className={extraSectionVariants({ orientation })}>
          <div className={extraItemVariants({ orientation, layout })}>
            <Button
              variant="ghost"
              className={textButtonVariants({ layout })}
              onClick={e => {
                if (e.metaKey && e.altKey) {
                  setBetaSuperMode(!betaSuperMode);
                }
              }}
            >
              {layout === 'normal' && <>{userName}</> || <CircleUser />}
            </Button>
            {betaSuperMode && <BetaFeaturesSheet layout={layout} />}
          </div>
          <div className={extraItemVariants({ orientation, layout })}>
            <LanguageSwitcher
              className={actionButtonsVariants({ layout, side })}
              placement={orientation === 'top' ? 'bottom' : 'top'}
            />
            <ThemeToggle className={actionButtonsVariants({ layout, side })} />
            <Tooltip>
              <TooltipTrigger asChild onClick={onLogout}>
                <Button variant="ghost" className={actionButtonsVariants({ layout, side })} onClick={onLogout}>
                  <LogOut />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t('common.navigation.logout')}</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </header>
  );
}
