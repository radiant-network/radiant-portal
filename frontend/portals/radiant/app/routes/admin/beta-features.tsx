import HiddenFeaturesAdmin from '@/components/base/admin/beta-features';

import type { Route } from '../+types/home';

import { logout, requireAuth } from '~/utils/auth.server';

export async function loader({ request }: Route.LoaderArgs) {
  if (await requireAuth(request)) {
    return logout(request);
  }
}

const HiddenFeatures = () => <HiddenFeaturesAdmin />;

export default HiddenFeatures;
