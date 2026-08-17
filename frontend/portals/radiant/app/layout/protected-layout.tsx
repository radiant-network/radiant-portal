import { Suspense } from 'react';
import { Outlet, useLoaderData } from 'react-router';
import { tv } from 'tailwind-variants';

import { SidebarProvider } from '@/components/base/shadcn/sidebar';
import { useBetaFeatures } from '@/components/hooks/beta-feature-provider';
import { LoginContext } from '@/components/hooks/use-login';
import { TenantProvider } from '@/components/hooks/use-tenant';

import type { Route } from '../+types/root';

import ProtectedNavbar from './protected-navbar';

import { authenticateRequest, getSessionUser, requireAuth } from '~/utils/auth.server';
import type { IAuthUser } from '~/utils/auth.types';

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
  const data = useLoaderData<IAuthUser>();
  const { features } = useBetaFeatures();
  const { orientation } = features as { orientation: 'left' | 'right' | 'top' };

  return (
    <LoginContext value={{ ...data }}>
      <TenantProvider>
        <SidebarProvider>
          <div className={layoutVariants({ orientation })}>
            <ProtectedNavbar
              placement={orientation}
              userDetails={{ id: data.sub, name: data.name, email: data.email }}
            />
            <Outlet />
          </div>
        </SidebarProvider>
      </TenantProvider>
    </LoginContext>
  );
};

export default function ProtectedLayout() {
  return (
    <Suspense>
      <_ProtectedLayout />
    </Suspense>
  );
}
