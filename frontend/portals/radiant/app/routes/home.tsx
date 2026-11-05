import { redirect } from 'react-router';

import { HOME_PATHS } from '../../config/catalog';
import { type ThemeName, THEMES } from '../../config/themes';

import type { Route } from './+types/home';

const { home } = THEMES[(import.meta.env.THEME ?? 'radiant') as ThemeName];

export function loader({ request, params }: Route.LoaderArgs) {
  const { search } = new URL(request.url);
  return redirect(`/${params.tenant}/${HOME_PATHS[home]}${search}`);
}

const HomeRoute = () => null;

export default HomeRoute;
