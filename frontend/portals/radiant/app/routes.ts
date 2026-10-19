import type { RouteConfig } from '@react-router/dev/routes';

import includeRoutes from '../config/routes.include';
import kfRoutes from '../config/routes.kf';
import qlinRoutes from '../config/routes.qlin';
import radiantRoutes from '../config/routes.radiant';

const perTheme = {
  radiant: radiantRoutes,
  include: includeRoutes,
  kf: kfRoutes,
  qlin: qlinRoutes,
} satisfies Record<string, RouteConfig>;

const theme = (process.env.THEME ?? 'radiant') as keyof typeof perTheme;

export default perTheme[theme];
