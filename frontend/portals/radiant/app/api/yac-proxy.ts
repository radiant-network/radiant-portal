// The proxy lives in a .server module: React Router strips server code only from loader/action,
// so anything else exported from this route file would be bundled for the client.
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';

import { proxyYac } from '@/utils/api/yac-proxy.server';

/**
 * Handles GET requests
 */
export function loader({ request }: LoaderFunctionArgs) {
  return proxyYac(request);
}

/**
 * Handles POST, PUT, PATCH, DELETE, UPDATE requests
 */
export function action({ request }: ActionFunctionArgs) {
  return proxyYac(request);
}
