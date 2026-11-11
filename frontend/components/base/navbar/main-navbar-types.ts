import type { MainNavbarItemProps } from './main-navbar-item';

export type MainNavbarEntry = (MainNavbarItemProps & { separator?: never }) | { separator: true };

export interface BaseMainNavbarProps {
  logo: React.ReactNode;
  links: MainNavbarEntry[];
  actions: MainNavbarItemProps[];
  userDetails: {
    id: string;
    name: string;
    email: string;
  };
  onLogoutClick: () => void;
}
