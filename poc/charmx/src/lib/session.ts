import crypto from 'node:crypto';
import type { CookieOptions, Response } from 'express';
import { env } from './env';

/**
 * CharmX's own session — used by solution 2 only.
 *
 * Solution 1 never creates one: there the token arrives on every request in the
 * Authorization header, so CharmX stays stateless.
 *
 * The tokens live in a server-side store and the cookie carries only a signed
 * session id. That is not premature engineering — a Keycloak access + refresh +
 * id token sealed into one cookie comes to ~4.4 KB, over the 4096-byte per-cookie
 * limit, and browsers drop an oversized Set-Cookie *silently*: the login appears
 * to succeed and every subsequent request is anonymous.
 *
 * The store is an in-memory Map, so restarting CharmX logs everyone out. Fine
 * for a POC; a real deployment would use Redis or an encrypted split cookie.
 */
export type CharmxSession = {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  /** Epoch seconds. */
  expiresAt: number;
};

export const SESSION_COOKIE = 'charmx_session';
export const OAUTH_COOKIE = 'charmx_oauth';

/** Transient state for an in-flight authorization code exchange. */
export type OAuthState = {
  state: string;
  codeVerifier: string;
  /** Where to send the browser once the exchange succeeds (relative path). */
  returnTo: string;
  /** True when this leg was started with prompt=none. */
  silent: boolean;
};

type Cookies = Record<string, string | undefined>;

const store = new Map<string, CharmxSession>();

/** Drops sessions an hour past their access-token expiry. */
function prune(): void {
  const cutoff = Math.floor(Date.now() / 1000) - 3600;
  for (const [id, session] of store) {
    if (session.expiresAt < cutoff) store.delete(id);
  }
}

function sign(payload: string): string {
  return crypto.createHmac('sha256', env.sessionSecret).update(payload).digest('base64url');
}

function seal(value: string): string {
  const payload = Buffer.from(value, 'utf8').toString('base64url');
  return `${payload}.${sign(payload)}`;
}

function unseal(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const [payload, signature] = raw.split('.');
  if (!payload || !signature) return undefined;

  const expected = sign(payload);
  // timingSafeEqual throws on a length mismatch, so check that first.
  if (expected.length !== signature.length) return undefined;
  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) return undefined;

  return Buffer.from(payload, 'base64url').toString('utf8');
}

function cookieOptions(extra: CookieOptions = {}): CookieOptions {
  return {
    httpOnly: true,
    path: '/',
    sameSite: env.cookieSameSite,
    secure: env.cookieSecure,
    // `partitioned` (CHIPS) is what makes a cross-site iframe cookie work in
    // browsers that block third-party cookies. Requires secure + sameSite=none.
    ...(env.cookiePartitioned ? { partitioned: true } : {}),
    ...extra,
  };
}

function sessionId(cookies: Cookies): string | undefined {
  return unseal(cookies[SESSION_COOKIE]);
}

export function readSession(cookies: Cookies): CharmxSession | undefined {
  const id = sessionId(cookies);
  return id ? store.get(id) : undefined;
}

/** Creates or updates the session; pass `cookies` to keep the existing id. */
export function writeSession(res: Response, session: CharmxSession, cookies: Cookies = {}): void {
  prune();
  const id = sessionId(cookies) ?? crypto.randomBytes(18).toString('base64url');
  store.set(id, session);
  res.cookie(SESSION_COOKIE, seal(id), cookieOptions());
}

export function clearSession(res: Response, cookies: Cookies = {}): void {
  const id = sessionId(cookies);
  if (id) store.delete(id);
  res.clearCookie(SESSION_COOKIE, cookieOptions());
}

export function readOAuthState(cookies: Cookies): OAuthState | undefined {
  const raw = unseal(cookies[OAUTH_COOKIE]);
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as OAuthState;
  } catch {
    return undefined;
  }
}

export function writeOAuthState(res: Response, state: OAuthState): void {
  res.cookie(OAUTH_COOKIE, seal(JSON.stringify(state)), cookieOptions({ maxAge: 5 * 60 * 1000 }));
}

export function clearOAuthState(res: Response): void {
  res.clearCookie(OAUTH_COOKIE, cookieOptions());
}

/** True when the access token is expired or within `skewSeconds` of expiring. */
export function isExpired(session: CharmxSession, skewSeconds = 15): boolean {
  return session.expiresAt - skewSeconds <= Math.floor(Date.now() / 1000);
}
