import { redirect } from 'react-router';

import { login, requireAuth } from '@/utils/auth/server';

import type { Route } from './+types/callback';

export async function loader({ request }: Route.LoaderArgs) {
  if (await requireAuth(request)) {
    return await login(request);
  } else {
    return redirect('/');
  }
}
