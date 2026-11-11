import { HttpStatusCode } from 'axios';

import { refreshAccessToken } from '../auth/server';

export async function handleRefreshTokenRequest(request: Request): Promise<Response> {
  if (request.method === 'POST') {
    const refreshed = await refreshAccessToken(request);
    if (!refreshed) {
      return new Response(null, { status: HttpStatusCode.Unauthorized });
    }

    const headers = new Headers();
    refreshed.cookies.forEach(cookie => headers.append('Set-Cookie', cookie));

    return new Response(JSON.stringify({ success: true }), { status: HttpStatusCode.Ok, headers });
  }

  return new Response(null, { status: HttpStatusCode.MethodNotAllowed });
}
