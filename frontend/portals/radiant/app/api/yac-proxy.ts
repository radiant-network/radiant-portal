import type { AxiosResponseHeaders, RawAxiosResponseHeaders } from 'axios';
import axios, { AxiosError, HttpStatusCode } from 'axios';
import * as process from 'node:process';

import type { Route } from './+types/yac-proxy';

import { getSessionAccessToken } from '~/utils/auth.server';

// Dropped before forwarding: axios already decompressed the body and we re-serialize
// the JSON ourselves, so these would make the browser try to decode a payload that
// no longer matches them (content-encoding, content-length) or relay a hop-by-hop
// header that must not cross a proxy (transfer-encoding, connection).
const SKIP_RESPONSE_HEADERS = new Set(['content-encoding', 'content-length', 'transfer-encoding', 'connection']);

function forwardHeaders(from: RawAxiosResponseHeaders | AxiosResponseHeaders | undefined): Headers {
  const headers = new Headers({ 'Content-Type': 'application/json' });
  if (!from) return headers;
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
 * Handles GET requests
 */
export function loader({ request }: Route.ActionArgs) {
  return proxyYac(request);
}

/**
 * Handles POST, PUT, PATCH, DELETE, UPDATE requests
 */
export function action({ request }: Route.ActionArgs) {
  return proxyYac(request);
}

function transformUrl(url: string): string {
  const parsedUrl = new URL(url);

  // Extract the path after `/api/yac/`
  const match = parsedUrl.pathname.match(/^\/api\/yac\/(.*)$/);

  if (match) {
    return `${process.env.YAC_AGENT_HOST}/${match[1]}${parsedUrl.search}`;
  }

  // Return original URL if it doesn't match the expected pattern
  return url;
}

const proxyYac = async (request: Request) => {
  try {
    const transformedUrl = transformUrl(request.url);
    const accessToken = await getSessionAccessToken(request);

    let data;
    if (request.method.toLowerCase() !== 'get') {
      const text = await request.text();
      data = text ? JSON.parse(text) : undefined;
    }

    const response = await axios({
      method: request.method,
      url: transformedUrl,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      data,
    });
    return new Response(JSON.stringify(response.data), {
      status: response.status,
      headers: forwardHeaders(response.headers),
    });
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return new Response(JSON.stringify(error.response?.data), {
        status: error.response?.status || HttpStatusCode.InternalServerError,
        headers: forwardHeaders(error.response?.headers),
      });
    } else {
      return new Response(JSON.stringify(error), {
        status: HttpStatusCode.InternalServerError,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }
};
