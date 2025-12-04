import { redirect } from 'react-router';

import type { Route } from './+types/callback';

import { login, requireAuth } from '~/utils/auth.server';

export async function loader({ request }: Route.LoaderArgs) {
  if (await requireAuth(request)) {
    return await login(request);
  } else {
    return redirect('/');
  }
}
