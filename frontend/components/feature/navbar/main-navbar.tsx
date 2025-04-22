import React, { useState } from 'react';
import { tv } from 'tailwind-variants';
import { CircleAlert, MenuIcon, XIcon } from 'lucide-react';
import MainNavbarLangSwitcher from './main-navbar-lang-switcher';
import { Separator } from '@/components/base/ui/separator';
import MainNavbarItem from './main-navbar-item';
import MainNavbarUserAvatar from './main-navbar-user-avatar';
import BetaFeaturesSheet from '../admin/beta-features-sheet';
import { cn } from '@/components/lib/utils';
import MainSidebar from './main-sidebar';
import { BaseMainNavbarProps } from './main-navbar-types';
import { ThemeToggle } from '../theme-toggle/theme-toggle';
import { useSidebar } from '@/components/base/ui/sidebar';

const navbarVariant = tv({
  slots: {
    base: 'flex items-center border-b bg-background shadow-sm w-full',
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
            <div className="flex flex-col md:hidden bg-background h-[calc(100vh_-_56px)]">
              <div className="flex flex-col flex-grow overflow-scroll">
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
          <div className={navbarStyles.base({ className: 'h-16 px-6 hidden md:flex' })}>
            <div
              className="flex mr-6 h-9 text-primary"
              onClick={e => {
                if (e.metaKey && e.altKey) {
                  setBetaSuperMode(!betaSuperMode);
                }
              }}
            >
              {logo}
            </div>
            <div className="flex flex-1 gap-1 items-center overflow-scroll">
              {links.map(link => (
                <MainNavbarItem key={link.title} {...link} />
              ))}
              {betaSuperModeItem}
            </div>
            <div className="flex gap-4">
              {actions.map(action => (
                <MainNavbarItem iconOnly key={action.title} {...action} />
              ))}
              <MainNavbarUserAvatar userDetails={userDetails} onLogoutClick={onLogoutClick} />
              <MainNavbarLangSwitcher />
              <ThemeToggle className="text-muted-foreground [&_svg]:size-5" />
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
        responsive={false}
      />
      <div className="flex flex-1 h-8 justify-center text-primary">{logo}</div>
      <MainNavbarLangSwitcher />
    </div>
  );
}

export default MainNavbar;
