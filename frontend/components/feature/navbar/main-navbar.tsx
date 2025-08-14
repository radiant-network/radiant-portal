import React, { useState } from 'react';
import { CircleAlert, MenuIcon, XIcon } from 'lucide-react';
import { tv } from 'tailwind-variants';

import { Separator } from '@/components/base/ui/separator';
import { useSidebar } from '@/components/base/ui/sidebar';
import { cn } from '@/components/lib/utils';

import BetaFeaturesSheet from '../admin/beta-features-sheet';
import { ThemeToggle } from '../theme-toggle/theme-toggle';

import MainNavbarItem from './main-navbar-item';
import MainNavbarLangSwitcher from './main-navbar-lang-switcher';
import { BaseMainNavbarProps } from './main-navbar-types';
import MainNavbarUserAvatar from './main-navbar-user-avatar';
import MainSidebar from './main-sidebar';

const navbarVariant = tv({
  slots: {
    base: 'flex items-center h-[44px] px-6 hidden md:flex py-2 border-b bg-background shadow-xs w-full',
  },
});

type NavbarProps = React.HTMLAttributes<HTMLDivElement> &
  BaseMainNavbarProps & {
    placement?: 'left' | 'right' | 'top';
  };

function MainNavbar({ placement, logo, links, actions, userDetails, onLogoutClick }: NavbarProps) {
  const navbarStyles = navbarVariant();
  const [isOpen, setIsOpen] = useState(false);
  const [betaSheetOpen, setBetaSheetOpen] = useState(false);
  const [betaSuperMode, setBetaSuperMode] = useState(false);
  const sidebar = useSidebar();

  const betaSuperModeItem =
    placement === 'top' && betaSuperMode ? (
      <MainNavbarItem
        title="Beta"
        icon={<CircleAlert />}
        variant="destructive"
        className="text-destructive-foreground"
        as="button"
        onClick={() => setBetaSheetOpen(true)}
      />
    ) : null;

  return (
    <>
      {placement !== 'top' ? (
        <>
          <MobileNavbar isOpen={sidebar.openMobile} logo={logo} onBurgerClick={() => sidebar.toggleSidebar()} />
          <MainSidebar
            logo={logo}
            links={links}
            actions={actions}
            placement={placement}
            userDetails={userDetails}
            onLogoutClick={onLogoutClick}
            betaSuperMode={betaSuperMode}
            onBetaSuperModeChange={setBetaSuperMode}
            onBetaSheetOpen={() => setBetaSheetOpen(true)}
          />
        </>
      ) : (
        <>
          {/* Mobile NavBar */}
          <MobileNavbar isOpen={isOpen} logo={logo} onBurgerClick={() => setIsOpen(!isOpen)} />
          {isOpen && (
            <div className="flex flex-col md:hidden absolute z-50 left-0 right-0 bottom-0 bg-background h-[calc(100vh-56px)]">
              <div className="flex flex-col grow overflow-x-auto">
                <div className="p-2 flex flex-col">
                  {links.map(link => (
                    <MainNavbarItem key={link.title} {...link} />
                  ))}
                  {betaSuperModeItem}
                </div>
                <Separator />
                <div className="p-2 flex flex-col">
                  {actions.map(action => (
                    <MainNavbarItem key={action.title} {...action} className={cn('w-full', action.className)} />
                  ))}
                </div>
              </div>
              <Separator />
              <div className="p-2">
                <MainNavbarUserAvatar userDetails={userDetails} onLogoutClick={onLogoutClick} />
              </div>
            </div>
          )}
          {/* Desktop NavBar */}
          <div className={navbarStyles.base()}>
            <div
              className="flex mr-6 h-7 text-primary [&_svg]:h-full [&_img]:h-full"
              onClick={e => {
                if (e.metaKey && e.altKey) {
                  setBetaSuperMode(!betaSuperMode);
                }
              }}
            >
              {logo}
            </div>
            <div className="flex flex-1 gap-1 items-center">
              {links.map(link => (
                <MainNavbarItem key={link.title} {...link} />
              ))}
              {betaSuperModeItem}
            </div>
            <div className="flex items-center gap-4">
              {actions.map(action => (
                <MainNavbarItem iconOnly key={action.title} {...action} />
              ))}
              <MainNavbarUserAvatar avatarClassName="size-7" userDetails={userDetails} onLogoutClick={onLogoutClick} />
              <MainNavbarLangSwitcher className="size-7" />
              <ThemeToggle className="text-muted-foreground size-7 [&_svg]:size-5" />
            </div>
          </div>
        </>
      )}
      <BetaFeaturesSheet open={betaSheetOpen} onOpenChange={setBetaSheetOpen} />
    </>
  );
}

function MobileNavbar({
  isOpen,
  logo,
  onBurgerClick,
}: {
  isOpen: boolean;
  logo: React.ReactNode;
  onBurgerClick: () => void;
}) {
  const navbarStyles = navbarVariant();

  return (
    <div className={navbarStyles.base({ className: 'h-[56px] px-3 flex md:hidden' })}>
      <MainNavbarItem
        title="Burger"
        iconOnly
        icon={isOpen ? <XIcon /> : <MenuIcon />}
        onClick={onBurgerClick}
        as="button"
        responsive={false}
      />
      <div className="flex flex-1 h-8 justify-center text-primary">{logo}</div>
      <MainNavbarLangSwitcher />
    </div>
  );
}

export default MainNavbar;
