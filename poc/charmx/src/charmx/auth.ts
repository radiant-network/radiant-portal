import type { NextFunction, Request, Response } from 'express';
import { env } from '../lib/env';
import { errorPage, loginRequiredPage } from '../lib/html';
import {
  authorizationUrl,
  bearerToken,
  decodeClaims,
  exchangeCode,
  randomUrlSafe,
  refreshTokens,
  type RadiantClaims,
} from '../lib/oidc';
import {
  clearOAuthState,
  isExpired,
  readOAuthState,
  readSession,
  writeOAuthState,
  writeSession,
  type CharmxSession,
} from '../lib/session';

/**
 * CharmX resolves its token per request, so one running instance backs both
 * prototypes:
 *
 *   1. An `Authorization: Bearer` header is present  -> "proxy" mode. The portal
 *      injected the token; CharmX stays stateless and owns no session.
 *   2. No header                                     -> "sso" mode. CharmX runs
 *      its own authorization-code flow against Keycloak and keeps a session
 *      cookie.
 */

export type CharmxAuth = {
  mode: 'proxy' | 'sso';
  token: string;
  claims: RadiantClaims | undefined;
  /** Set by the portal proxy; present only in solution 1. */
  proxyBase?: string;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: CharmxAuth;
    }
  }
}

function sessionFromTokens(tokens: {
  access_token: string;
  refresh_token?: string;
  id_token?: string;
  expires_in: number;
}): CharmxSession {
  return {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    idToken: tokens.id_token,
    expiresAt: Math.floor(Date.now() / 1000) + tokens.expires_in,
  };
}

/** Routes that must never be a post-login destination — they restart the flow. */
const AUTH_PATHS = ['/login', '/oidc/callback'];

function safeReturnTo(originalUrl: string): string {
  const path = originalUrl.split('?')[0] ?? '/';
  return AUTH_PATHS.includes(path) ? '/' : originalUrl;
}

/** Kicks off the code flow. `silent` uses prompt=none so no HTML is rendered. */
function beginAuth(req: Request, res: Response, silent: boolean): void {
  const state = randomUrlSafe(16);
  const codeVerifier = randomUrlSafe(32);
  writeOAuthState(res, {
    state,
    codeVerifier,
    returnTo: safeReturnTo(req.originalUrl),
    silent,
  });
  res.redirect(authorizationUrl({ state, codeVerifier, silent }));
}

export async function resolveAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const proxyBase = req.header('x-charmx-base') ?? undefined;
  const headerToken = bearerToken(req.header('authorization'));

  // ---- Solution 1 -------------------------------------------------------
  if (headerToken) {
    req.auth = {
      mode: 'proxy',
      token: headerToken,
      claims: decodeClaims(headerToken),
      proxyBase,
    };
    next();
    return;
  }

  // A request that carried the proxy marker but no token means the portal has
  // no session. Starting an OIDC redirect here would bounce Keycloak inside the
  // portal's iframe, so fail loudly instead.
  if (proxyBase) {
    res
      .status(401)
      .type('html')
      .send(
        errorPage(
          'No token from the portal',
          'This request arrived through the portal proxy but carried no Authorization header. Sign in to the portal and reload.',
          'proxy',
        ),
      );
    return;
  }

  // ---- Solution 2 -------------------------------------------------------
  const session = readSession(req.cookies);

  if (session && !isExpired(session)) {
    req.auth = {
      mode: 'sso',
      token: session.accessToken,
      claims: decodeClaims(session.accessToken),
    };
    next();
    return;
  }

  if (session?.refreshToken) {
    try {
      const refreshed = sessionFromTokens(await refreshTokens(session.refreshToken));
      writeSession(res, refreshed, req.cookies);
      req.auth = {
        mode: 'sso',
        token: refreshed.accessToken,
        claims: decodeClaims(refreshed.accessToken),
      };
      next();
      return;
    } catch (error) {
      console.warn('[charmx] refresh failed, falling back to silent auth:', error);
    }
  }

  beginAuth(req, res, true);
}

/** GET /login — the top-level break-out when silent auth failed. */
export function loginHandler(req: Request, res: Response): void {
  beginAuth(req, res, false);
}

/** GET /oidc/callback */
export async function callbackHandler(req: Request, res: Response): Promise<void> {
  const pending = readOAuthState(req.cookies);
  clearOAuthState(res);

  const error = typeof req.query.error === 'string' ? req.query.error : undefined;
  if (error) {
    // `login_required` / `interaction_required` are the expected outcome of
    // prompt=none when there is no Keycloak session — not a bug.
    res.status(401).type('html').send(loginRequiredPage(error));
    return;
  }

  const code = typeof req.query.code === 'string' ? req.query.code : undefined;
  const state = typeof req.query.state === 'string' ? req.query.state : undefined;

  if (!pending || !code || !state || state !== pending.state) {
    res
      .status(400)
      .type('html')
      .send(errorPage('Invalid callback', 'Missing code, or the state did not match the one CharmX issued.'));
    return;
  }

  try {
    const session = sessionFromTokens(await exchangeCode(code, pending.codeVerifier));
    writeSession(res, session);
    // Relative-safe: returnTo was captured from originalUrl on this origin.
    res.redirect(pending.returnTo || '/');
  } catch (cause) {
    console.error('[charmx] code exchange failed:', cause);
    res
      .status(502)
      .type('html')
      .send(
        errorPage(
          'Token exchange failed',
          `Keycloak rejected the code exchange for client "${env.keycloakClient}". Check the client secret and that ${
            env.charmxPublicUrl
          }/oidc/callback is an allowed redirect URI. Cause: ${cause instanceof Error ? cause.message : String(cause)}`,
        ),
      );
  }
}
