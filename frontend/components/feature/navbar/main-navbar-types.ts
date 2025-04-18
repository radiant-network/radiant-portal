import { MainNavbarItemProps } from './main-navbar-item';

export interface BaseMainNavbarProps {
  logo: React.ReactNode;
  links: MainNavbarItemProps[];
  actions: MainNavbarItemProps[];
  userDetails: {
    name: string;
    email: string;
  };
  onLogoutClick: () => void;
}
