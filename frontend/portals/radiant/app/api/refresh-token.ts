import { HttpStatusCode } from 'axios';

import type { Route } from './+types/refresh-token';

import { refreshAccessToken } from '~/utils/auth.server';

export async function action({ request }: Route.ActionArgs) {
  if (request.method === 'POST') {
    const results = await refreshAccessToken(request);

    return new Response(JSON.stringify({ success: true }), {
      status: HttpStatusCode.Ok,
      headers: {
        'Set-Cookie': results.cookie,
      },
    });
  }

  return new Response(null, { status: HttpStatusCode.MethodNotAllowed });
}
