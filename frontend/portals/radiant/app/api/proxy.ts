import type { Route } from './+types/proxy';

import { proxyApi } from '@/utils/api/proxy.server';

/**
 * Handles GET requests
 */
export function loader({ request }: Route.LoaderArgs) {
  return proxyApi(request);
}

/**
 * Handles POST, PUT, PATCH, DELETE, UPDATE requests
 */
export function action({ request }: Route.ActionArgs) {
  return proxyApi(request);
}
