import { Link, useLocation, useNavigate } from 'react-router';
import logo from '@assets/logo/header.svg';
import { ArchiveIcon, FolderIcon, SettingsIcon, UsersIcon } from 'lucide-react';

import MainNavbar from '@/components/base/navbar/main-navbar';
import type { MainNavbarEntry } from '@/components/base/navbar/main-navbar-types';
import { useI18n } from '@/components/hooks/i18n';
import { useLocalPath } from '@/components/hooks/use-local-path';
import { useCanAdministerTenant } from '@/components/hooks/use-tenant';

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

  const adminLinks: MainNavbarEntry[] =
    import.meta.env.APPS_ADMIN && canAdministerTenant
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
        ...(import.meta.env.APPS_PATIENT
          ? [
              {
                title: t('main_navbar.links.patients'),
                icon: <UsersIcon />,
                to: localPath('/patient'),
                as: Link,
                active: pathname === localPath('/patient'),
              },
            ]
          : []),
        ...(import.meta.env.APPS_CASE
          ? [
              {
                title: t('main_navbar.links.cases'),
                icon: <FolderIcon />,
                to: localPath('/case'),
                as: Link,
                active: pathname === localPath('/case'),
              },
            ]
          : []),
        ...(import.meta.env.APPS_FILE_ARCHIVE
          ? [
              {
                title: t('main_navbar.links.files'),
                icon: <ArchiveIcon />,
                to: localPath('/file'),
                as: Link,
                active: pathname === localPath('/file'),
              },
            ]
          : []),
        ...adminLinks,
      ]}
      actions={[]}
      userDetails={userDetails}
      onLogoutClick={() => navigate('/auth/logout')}
    />
  );
};

export default ProtectedNavbar;
