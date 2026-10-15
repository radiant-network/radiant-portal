import { handleRefreshTokenRequest } from '@/utils/api/refresh-token.server';

import type { Route } from './+types/refresh-token';

export function action({ request }: Route.ActionArgs) {
  return handleRefreshTokenRequest(request);
}
