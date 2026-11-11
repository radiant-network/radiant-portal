import HiddenFeaturesAdmin from '@/components/base/admin/beta-features';
import { logout, requireAuth } from '@/utils/auth/server';

import type { Route } from '../+types/home';

export async function loader({ request }: Route.LoaderArgs) {
  if (await requireAuth(request)) {
    return logout(request);
  }
}

const HiddenFeatures = () => <HiddenFeaturesAdmin />;

export default HiddenFeatures;
