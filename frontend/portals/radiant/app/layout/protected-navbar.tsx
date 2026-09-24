import { Link, useLocation, useNavigate } from 'react-router';
import logo from '@assets/logo/header.svg';
import { ArchiveIcon, FolderIcon, SettingsIcon } from 'lucide-react';

import MainNavbar from '@/components/base/navbar/main-navbar';
import type { MainNavbarEntry } from '@/components/base/navbar/main-navbar-types';
import { useI18n } from '@/components/hooks/i18n';
import { useCanAdministerTenant, useLocalPath } from '@/components/hooks/use-tenant';

type ProtectedNavbarProps = {
  placement: 'left' | 'right' | 'top';
  userDetails: { id: string; name: string; email: string };
};

const ProtectedNavbar = ({ placement, userDetails }: ProtectedNavbarProps) => {
  const { t } = useI18n();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const canAdministerTenant = useCanAdministerTenant();
  const localPath = useLocalPath();

  const adminLinks: MainNavbarEntry[] = canAdministerTenant
    ? [
        { separator: true },
        {
          title: t('main_navbar.links.admin'),
          icon: <SettingsIcon />,
          to: localPath('/admin'),
          as: Link,
          active: pathname === localPath('/admin'),
        },
      ]
    : [];

  return (
    <MainNavbar
      placement={placement}
      logo={<img src={logo} alt="Logo" />}
      links={[
        // SJRA-389
        // {
        //   title: t('main_navbar.links.dashboard'),
        //   icon: <LayoutDashboardIcon />,
        //   as: 'button',
        // },
        {
          title: t('main_navbar.links.cases'),
          icon: <FolderIcon />,
          to: localPath('/case'),
          as: Link,
          active: pathname === localPath('/case'),
        },
        {
          title: t('main_navbar.links.files'),
          icon: <ArchiveIcon />,
          to: localPath('/file'),
          as: Link,
          active: pathname === localPath('/file'),
        },
        ...adminLinks,
      ]}
      actions={
        [
          // SJRA-389
          // {
          //   title: t('main_navbar.actions.community'),
          //   icon: <UsersIcon />,
          //   as: 'button',
          // },
          // {
          //   title: t('main_navbar.actions.resources'),
          //   icon: <LightbulbIcon />,
          //   as: 'button',
          //   subItems: [
          //     {
          //       title: t('main_navbar.actions.website'),
          //       icon: <ExternalLink />,
          //       as: 'a',
          //       href: 'https://www.radiant-genomics.com',
          //     },
          //     {
          //       title: t('main_navbar.actions.documentation'),
          //       icon: <ExternalLink />,
          //       as: 'button',
          //     },
          //     {
          //       separator: true,
          //     },
          //     {
          //       title: t('main_navbar.actions.contact'),
          //       icon: <MailIcon />,
          //       as: 'button',
          //     },
          //   ],
          // },
        ]
      }
      userDetails={userDetails}
      onLogoutClick={() => navigate('/auth/logout')}
    />
  );
};

export default ProtectedNavbar;
