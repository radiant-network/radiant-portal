// The proxy lives in a .server module: React Router strips server code only from loader/action,
// so anything else exported from this route file would be bundled for the client.
import type { Route } from './+types/yac-proxy';
import { proxyYac } from './yac-proxy.server';

/**
 * Handles GET requests
 */
export function loader({ request }: Route.LoaderArgs) {
  return proxyYac(request);
}

/**
 * Handles POST, PUT, PATCH, DELETE, UPDATE requests
 */
export function action({ request }: Route.ActionArgs) {
  return proxyYac(request);
}
