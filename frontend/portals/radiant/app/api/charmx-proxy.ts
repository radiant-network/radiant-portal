import * as process from 'node:process';

import type { Route } from './+types/charmx-proxy';

import { getSessionAccessToken, refreshAccessToken } from '~/utils/auth.server';

/**
 * CharmX integration — solution 1: same-origin reverse proxy.
 *
 * Everything under `/charmx-proxy/*` is forwarded to `CHARMX_HOST` with the
 * portal's Keycloak access token injected from the httpOnly session cookie. The
 * browser never sees the token, and because the iframe is served from the
 * portal's own origin there are no third-party-cookie or frame-ancestors
 * problems at all.
 *
 * This deliberately does NOT reuse `./proxy.ts`: that one is axios-based and
 * JSON-only — it parses the body as JSON, drops every request and response
 * header, and always answers 200. Serving someone else's HTML app needs real
 * header/redirect/content-type passthrough.
 *
 * Requires CharmX to emit relative URLs. This proxy rewrites `Location` headers
 * but never rewrites HTML bodies, so an absolute `href="/patients"` from CharmX
 * would escape the mount point and 404 on the portal.
 */

export const CHARMX_PROXY_BASE = '/charmx-proxy';

/** Cookies belonging to the portal itself — never forwarded to CharmX. */
const PORTAL_COOKIES = ['session.user', 'session.token', 'session.r.token', 'oauth2'];

/**
 * Hop-by-hop headers (RFC 9110 §7.6.1) plus the ones we must own:
 * - `host` would point at the portal
 * - `content-length` is recomputed by fetch
 * - `accept-encoding` is dropped so the upstream replies uncompressed and we
 *   can stream the body through untouched
 */
const STRIPPED_REQUEST_HEADERS = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
  'host',
  'content-length',
  'accept-encoding',
  'authorization',
]);

const STRIPPED_RESPONSE_HEADERS = new Set([
  'connection',
  'keep-alive',
  'transfer-encoding',
  'upgrade',
  'content-encoding',
  'content-length',
]);

/** Handles GET/HEAD. */
export function loader({ request }: Route.LoaderArgs) {
  return proxyCharmx(request);
}

/** Handles POST/PUT/PATCH/DELETE — notably the form submits from CharmX. */
export function action({ request }: Route.ActionArgs) {
  return proxyCharmx(request);
}

function charmxHost(): string {
  return (process.env.CHARMX_HOST || 'http://localhost:8091').replace(/\/$/, '');
}

/** `/charmx-proxy/patients?page=2` -> `http://localhost:8091/patients?page=2` */
function upstreamUrl(request: Request): URL {
  const incoming = new URL(request.url);
  const path = incoming.pathname.slice(CHARMX_PROXY_BASE.length);
  return new URL(`${charmxHost()}${path}${incoming.search}`);
}

/**
 * Drops the portal's own session cookies so CharmX cannot read (or replay) the
 * portal session. Cookies CharmX itself set are passed back to it.
 */
function forwardableCookies(cookieHeader: string | null): string | undefined {
  if (!cookieHeader) return undefined;
  const kept = cookieHeader
    .split(';')
    .map(part => part.trim())
    .filter(part => {
      const name = part.split('=')[0]?.trim();
      return name !== undefined && !PORTAL_COOKIES.includes(name);
    });
  return kept.length > 0 ? kept.join('; ') : undefined;
}

function buildUpstreamHeaders(request: Request, accessToken: string): Headers {
  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (STRIPPED_REQUEST_HEADERS.has(key.toLowerCase())) return;
    if (key.toLowerCase() === 'cookie') return;
    headers.set(key, value);
  });

  const cookies = forwardableCookies(request.headers.get('cookie'));
  if (cookies) headers.set('cookie', cookies);
  else headers.delete('cookie');

  headers.set('Authorization', `Bearer ${accessToken}`);

  const incoming = new URL(request.url);
  headers.set('X-Forwarded-Proto', incoming.protocol.replace(':', ''));
  headers.set('X-Forwarded-Host', incoming.host);
  // Lets CharmX know it is being proxied, and under which path.
  headers.set('X-Charmx-Base', CHARMX_PROXY_BASE);

  return headers;
}

/**
 * Rewrites a `Location` from CharmX into an absolute path under the mount.
 *
 * `upstreamPath` is the path CharmX itself saw (e.g. `/submit`), which is the
 * base a relative location must resolve against.
 *
 * Relative locations are resolved here rather than left for the browser: React
 * Router normalises a relative `Location` on the way out and resolves it against
 * the wrong base, turning `result?msg=x` on `/charmx-proxy/submit` into
 * `/charmx-proxy/submit/result`. Emitting an unambiguous absolute path is what a
 * proxy should do anyway.
 */
function rewriteLocation(location: string, upstreamPath: string): string {
  if (location.startsWith(`${CHARMX_PROXY_BASE}/`)) return location;

  const host = charmxHost();
  let target = location;
  if (target.startsWith(host)) {
    target = target.slice(host.length) || '/';
  } else if (/^[a-z][a-z0-9+.-]*:\/\//i.test(target)) {
    // Off to a third party — not ours to remount.
    return target;
  }

  // The origin here is a throwaway: only pathname/search/hash are used.
  const resolved = new URL(target, `http://charmx.invalid${upstreamPath || '/'}`);
  return `${CHARMX_PROXY_BASE}${resolved.pathname}${resolved.search}${resolved.hash}`;
}

function buildDownstreamHeaders(upstream: Response, upstreamPath: string): Headers {
  const headers = new Headers();
  upstream.headers.forEach((value, key) => {
    const name = key.toLowerCase();
    if (STRIPPED_RESPONSE_HEADERS.has(name)) return;
    if (name === 'set-cookie') return; // handled below, may repeat
    if (name === 'location') {
      headers.set('Location', rewriteLocation(value, upstreamPath));
      return;
    }
    headers.set(key, value);
  });

  for (const cookie of upstream.headers.getSetCookie()) {
    headers.append('Set-Cookie', cookie);
  }

  return headers;
}

/**
 * Turns a `Set-Cookie` value back into something readable as a `Cookie` request
 * header, so the freshly committed session can be read straight back.
 */
function setCookieToCookieHeader(setCookie: string): string {
  return setCookie.split(';')[0] ?? '';
}

function unauthenticatedResponse(): Response {
  return new Response(
    `<!doctype html><meta charset="utf-8" /><title>Not signed in</title>
     <p style="font:14px system-ui;padding:1rem">
       No portal session, so no token could be injected for CharmX.
       <a href="/" target="_top">Sign in to the portal</a> and reload.
     </p>`,
    { status: 401, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } },
  );
}

async function proxyCharmx(request: Request): Promise<Response> {
  const incoming = new URL(request.url);

  // `/charmx-proxy` without the trailing slash would make CharmX's relative
  // asset URLs resolve against the portal root, so normalise it first.
  if (incoming.pathname === CHARMX_PROXY_BASE) {
    return new Response(null, { status: 308, headers: { Location: `${CHARMX_PROXY_BASE}/${incoming.search}` } });
  }

  let accessToken = await getSessionAccessToken(request);
  if (!accessToken) {
    return unauthenticatedResponse();
  }

  // Buffered rather than streamed because a 401 has to be retryable, and a
  // request stream cannot be replayed. Fine for HTML and form posts; large
  // uploads through this proxy would need a streaming variant without retry.
  const hasBody = !['GET', 'HEAD'].includes(request.method.toUpperCase());
  const body = hasBody ? await request.arrayBuffer() : undefined;

  const target = upstreamUrl(request);
  const send = (token: string) =>
    fetch(target, {
      method: request.method,
      headers: buildUpstreamHeaders(request, token),
      body,
      // Pass 3xx to the browser instead of following them server-side, so the
      // iframe's URL bar stays in sync with what CharmX thinks the path is.
      redirect: 'manual',
    });

  let refreshedCookie: string | undefined;

  try {
    let upstream = await send(accessToken);

    // Iframe navigations bypass the client-side axios 401 interceptor in
    // frontend/utils/axios.ts, so the refresh has to happen here or the frame
    // dies silently once the 5-minute access token expires.
    if (upstream.status === 401) {
      const refreshed = await refreshAccessToken(request);
      refreshedCookie = refreshed.cookie;
      accessToken = await getSessionAccessToken(
        new Request(request.url, { headers: { cookie: setCookieToCookieHeader(refreshed.cookie) } }),
      );
      upstream = await send(accessToken);
    }

    const headers = buildDownstreamHeaders(upstream, incoming.pathname.slice(CHARMX_PROXY_BASE.length));
    if (refreshedCookie) headers.append('Set-Cookie', refreshedCookie);

    return new Response(upstream.body, { status: upstream.status, statusText: upstream.statusText, headers });
  } catch (error) {
    // When the refresh token is dead, `refreshAccessToken` does `throw logout(request)`
    // — and `logout` is async, so what lands here is a Promise<Response>, not a
    // Response. Handle both shapes and let the logout redirect through untouched.
    if (error instanceof Response) return error;
    if (error instanceof Promise) return await error;

    const detail = error instanceof Error ? error.message : String(error);
    return new Response(
      `<!doctype html><meta charset="utf-8" /><title>CharmX unreachable</title>
       <p style="font:14px system-ui;padding:1rem">
         Could not reach CharmX at <code>${charmxHost()}</code>.<br />${detail}
       </p>`,
      { status: 502, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } },
    );
  }
}
