import { useState } from 'react';
import { Outlet, useLoaderData, useNavigate } from 'react-router';
import { authenticateRequest, getSessionUser, requireAuth } from '~/utils/auth.server';
import type { Route } from '../+types/root';
import { MainNav } from '@/components/feature/main-navigation';
import type { IAuthUser } from '~/utils/auth.types';
import { tv } from 'tailwind-variants';
import { useBetaFeatures } from '@/components/hooks/beta-feature-provider';

export async function loader({ request }: Route.LoaderArgs) {
  if (await requireAuth(request)) {
    await authenticateRequest(request);
  } else {
    return await getSessionUser(request);
  }
}

const layoutVariants = tv({
  base: 'h-screen flex gap-2',
  variants: {
    orientation: {
      left: 'flex-row',
      right: 'flex-row-reverse',
      top: 'flex-col'
    }
  },
  defaultVariants: {
    orientation: 'top'
  }
});

const ProtectedLayout = () => {
  const navigate = useNavigate();
  const data = useLoaderData<IAuthUser>();
  const { features } = useBetaFeatures();
  const { orientation } = features as { orientation: 'left' | 'right' | 'top' };
  const [layout, setLayout] = useState<'compact' | 'normal'>('normal');

  return (
    <div 
      className={layoutVariants({ orientation })}
    >
      <MainNav
        orientation={orientation}
        userName={data.preferred_username}
        onLogout={() => navigate('/auth/logout')}
        onCollapse={() => {
          setLayout(layout === 'compact' ? 'normal' : 'compact');
        }}
        layout={layout}
      />
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
    </div>
  );
};

export default ProtectedLayout;
