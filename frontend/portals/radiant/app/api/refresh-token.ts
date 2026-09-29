import { HttpStatusCode } from 'axios';

import type { Route } from './+types/refresh-token';

import { refreshAccessToken } from '~/utils/auth.server';

export async function action({ request }: Route.ActionArgs) {
  if (request.method === 'POST') {
    const cookies = await refreshAccessToken(request);
    if (!cookies) {
      return new Response(null, { status: HttpStatusCode.Unauthorized });
    }

    const headers = new Headers();
    cookies.forEach(cookie => headers.append('Set-Cookie', cookie));

    return new Response(JSON.stringify({ success: true }), { status: HttpStatusCode.Ok, headers });
  }

  return new Response(null, { status: HttpStatusCode.MethodNotAllowed });
}
