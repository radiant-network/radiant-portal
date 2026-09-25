import { Navigate, useLocation } from 'react-router';

import Error403 from '@/components/base/errors/403';
import { Spinner } from '@/components/base/spinner';
import { usePreferredTenant } from '@/components/hooks/use-tenant';

import type { Route } from './+types/tenant-redirect';

import { authenticateRequest, requireAuth } from '~/utils/auth.server';

// This route sits outside the protected layout, so it carries its own auth gate.
export async function loader({ request }: Route.LoaderArgs) {
  if (await requireAuth(request)) {
    await authenticateRequest(request);
  }
  return null;
}

/** Sends the bare domain to the caller's preferred tenant. */
export default function TenantRedirectRoute() {
  const { search } = useLocation();
  const { tenant, isLoading } = usePreferredTenant();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Spinner size={32} className="text-primary" />
      </div>
    );
  }

  if (!tenant) {
    return <Error403 />;
  }

  return <Navigate to={`/${tenant}${search}`} replace />;
}
