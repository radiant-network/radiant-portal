import type { AxiosResponseHeaders, RawAxiosResponseHeaders } from 'axios';
import axios, { HttpStatusCode } from 'axios';
import * as process from 'node:process';

import { isTokenValid } from '../utils/tokens';

import { getSessionAccessToken, refreshAccessToken } from '~/utils/auth.server';

// Refresh a token this close to expiry, so it cannot expire on its way to the agent.
const TOKEN_MIN_VALIDITY_SECONDS = 30;

// Refreshes in flight, keyed by the expired access token: the dashboard's cards query in
// parallel, and one refresh serves them all instead of one each.
const refreshing = new Map<string, ReturnType<typeof refreshAccessToken>>();

// Request headers the YAC agent reads, relayed as-is. Authorization is never taken from the
// browser: it is always the session's token. X-Conversation-Id groups the turns of one chat,
// X-OpenAI-Key is the user's own LLM key (bring-your-own-key mode).
const FORWARD_REQUEST_HEADERS = ['accept', 'content-type', 'x-conversation-id', 'x-openai-key'];

// Dropped before relaying the response: axios already decompressed the body, so these would make
// the browser decode a payload that no longer matches them (content-encoding, content-length), or
// relay a hop-by-hop header that must not cross a proxy (transfer-encoding, connection).
const SKIP_RESPONSE_HEADERS = new Set(['content-encoding', 'content-length', 'transfer-encoding', 'connection']);

function forwardRequestHeaders(request: Request, accessToken: string): Record<string, string> {
  const headers: Record<string, string> = { Authorization: `Bearer ${accessToken}` };
  for (const name of FORWARD_REQUEST_HEADERS) {
    const value = request.headers.get(name);
    if (value != null) headers[name] = value;
  }
  return headers;
}

function forwardResponseHeaders(from: RawAxiosResponseHeaders | AxiosResponseHeaders, cookies: string[]): Headers {
  const headers = cookieHeaders(cookies);
  for (const [key, value] of Object.entries(from)) {
    if (value == null || SKIP_RESPONSE_HEADERS.has(key.toLowerCase())) continue;
    if (Array.isArray(value)) {
      value.forEach(v => headers.append(key, String(v)));
    } else {
      headers.set(key, String(value));
    }
  }
  return headers;
}

/**
 * The session's access token, refreshed when it is about to expire. The portal's axios client
 * refreshes on a 401, but the chat calls the agent with its own fetch, so the proxy does it here.
 * The cookies carry the refreshed tokens back to the browser.
 */
async function sessionAccessToken(request: Request): Promise<{ accessToken: string; cookies: string[] } | null> {
  const accessToken = await getSessionAccessToken(request);
  if (!accessToken) return null;
  if (isTokenValid(accessToken, TOKEN_MIN_VALIDITY_SECONDS)) return { accessToken, cookies: [] };

  let refresh = refreshing.get(accessToken);
  if (!refresh) {
    refresh = refreshAccessToken(request).finally(() => refreshing.delete(accessToken));
    refreshing.set(accessToken, refresh);
  }
  return refresh;
}

function cookieHeaders(cookies: string[]): Headers {
  const headers = new Headers();
  cookies.forEach(cookie => headers.append('Set-Cookie', cookie));
  return headers;
}

function jsonError(status: number, detail: string, cookies: string[] = []): Response {
  const headers = cookieHeaders(cookies);
  headers.set('Content-Type', 'application/json');
  return new Response(JSON.stringify({ detail }), { status, headers });
}

export function transformUrl(url: string): string {
  const parsedUrl = new URL(url);

  // Extract the path after `/api/yac/`
  const match = parsedUrl.pathname.match(/^\/api\/yac\/(.*)$/);

  if (match) {
    return `${process.env.YAC_AGENT_HOST}/${match[1]}${parsedUrl.search}`;
  }

  // Return original URL if it doesn't match the expected pattern
  return url;
}

/**
 * Relays a request to the YAC agent with the session's access token. The body and the response
 * are passed through untouched (no JSON round-trip), and every agent status, error or not, is
 * returned as-is so the browser sees the agent's own 401/403/404 and its X-Usage-* headers.
 */
export const proxyYac = async (request: Request) => {
  const session = await sessionAccessToken(request);
  if (!session) {
    // No session, or one Keycloak no longer refreshes: the user has to log in again.
    return jsonError(HttpStatusCode.Unauthorized, 'no session');
  }
  const { accessToken, cookies } = session;

  const hasBody = !['GET', 'HEAD'].includes(request.method.toUpperCase());
  const body = hasBody ? Buffer.from(await request.arrayBuffer()) : undefined;

  try {
    const response = await axios({
      method: request.method,
      url: transformUrl(request.url),
      headers: forwardRequestHeaders(request, accessToken),
      data: body && body.length > 0 ? body : undefined,
      responseType: 'arraybuffer',
      // Relay every status: the caller handles the agent's errors, not this proxy.
      validateStatus: () => true,
    });
    return new Response(response.status === HttpStatusCode.NoContent ? null : response.data, {
      status: response.status,
      headers: forwardResponseHeaders(response.headers, cookies),
    });
  } catch (error: unknown) {
    // Only reached when the agent could not be reached at all (no HTTP response).
    const message = error instanceof Error ? error.message : String(error);
    return jsonError(HttpStatusCode.BadGateway, `YAC agent unreachable: ${message}`, cookies);
  }
};
