import { Outlet, useLoaderData, useLocation, useNavigate } from 'react-router';
import { authenticateRequest, getSessionUser, requireAuth } from '~/utils/auth.server';
import type { Route } from '../+types/root';
import type { IAuthUser } from '~/utils/auth.types';
import { tv } from 'tailwind-variants';
import { useBetaFeatures } from '@/components/hooks/beta-feature-provider';
import MainNavbar from '@/components/feature/navbar/main-navbar';
import logo from '@assets/logo/header.svg';
import { SidebarProvider } from '@/components/base/ui/sidebar';
import {
  LayoutDashboardIcon,
  AudioWaveformIcon,
  UsersIcon,
  LightbulbIcon,
  ExternalLink,
  MailIcon,
  FolderIcon,
} from 'lucide-react';
import { useI18n } from '@/components/hooks/i18n';
import { Suspense } from 'react';

export async function loader({ request }: Route.LoaderArgs) {
  if (await requireAuth(request)) {
    await authenticateRequest(request);
  } else {
    return await getSessionUser(request);
  }
}

const layoutVariants = tv({
  base: 'h-screen w-screen flex',
  variants: {
    orientation: {
      left: 'flex-col md:flex-row',
      right: 'flex-col md:flex-row-reverse',
      top: 'flex-col',
    },
  },
  defaultVariants: {
    orientation: 'top',
  },
});

const _ProtectedLayout = () => {
  const { t } = useI18n();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const data = useLoaderData<IAuthUser>();
  const { features } = useBetaFeatures();
  const { orientation } = features as { orientation: 'left' | 'right' | 'top' };

  return (
    <SidebarProvider>
      <div className={layoutVariants({ orientation })}>
        <MainNavbar
          placement={orientation}
          logo={<img src={logo} alt="Logo" />}
          links={[
            {
              title: t('mainNavbar.links.dashboard'),
              icon: <LayoutDashboardIcon />,
            },
            {
              title: t('mainNavbar.links.cases'),
              icon: <FolderIcon />,
              onClick: () => navigate('/case-exploration'),
              active: pathname === '/case-exploration'
            },
          ]}
          actions={[
            {
              title: t('mainNavbar.actions.community'),
              icon: <UsersIcon />,
            },
            {
              title: t('mainNavbar.actions.resources'),
              icon: <LightbulbIcon />,
              subItems: [
                {
                  title: t('mainNavbar.actions.website'),
                  icon: <ExternalLink />,
                },
                {
                  title: t('mainNavbar.actions.documentation'),
                  icon: <ExternalLink />,
                },
                {
                  separator: true,
                },
                {
                  title: t('mainNavbar.actions.contact'),
                  icon: <MailIcon />,
                },
              ],
            },
          ]}
          userDetails={data}
          onLogoutClick={() => navigate('/auth/logout')}
        />
        <Outlet />
      </div>
    </SidebarProvider>
  );
};

export default function ProtectedLayout() {
  return (
    <Suspense>
      <_ProtectedLayout />
    </Suspense>
  );
}
