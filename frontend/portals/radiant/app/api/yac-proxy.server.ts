import type { AxiosResponseHeaders, RawAxiosResponseHeaders } from 'axios';
import axios, { HttpStatusCode } from 'axios';
import * as process from 'node:process';

import { getSessionAccessToken } from '~/utils/auth.server';

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

function forwardResponseHeaders(from: RawAxiosResponseHeaders | AxiosResponseHeaders): Headers {
  const headers = new Headers();
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

function jsonError(status: number, detail: string): Response {
  return new Response(JSON.stringify({ detail }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
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
  const accessToken = await getSessionAccessToken(request);
  if (!accessToken) {
    // 401 lets the frontend's axios interceptor run its refresh-token flow.
    return jsonError(HttpStatusCode.Unauthorized, 'no session');
  }

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
      headers: forwardResponseHeaders(response.headers),
    });
  } catch (error: unknown) {
    // Only reached when the agent could not be reached at all (no HTTP response).
    const message = error instanceof Error ? error.message : String(error);
    return jsonError(HttpStatusCode.BadGateway, `YAC agent unreachable: ${message}`);
  }
};
