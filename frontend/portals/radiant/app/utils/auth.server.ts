import { createCookie, createCookieSessionStorage, redirect } from 'react-router';
import { Authenticator } from 'remix-auth';
import { OAuth2Strategy } from 'remix-auth-oauth2';

import { AuthStrategyName, type IAuthUser, type IAuthUserWithToken } from './auth.types';
import { isTokenValid } from './tokens';

const createSessionStorage = (cookieName: string) =>
  createCookieSessionStorage({
    cookie: {
      name: cookieName,
      sameSite: 'lax',
      path: '/',
      httpOnly: true,
      secrets: [process.env.SESSION_SECRET!],
      secure: process.env.NODE_ENV === 'production',
    },
  });

const userSessionStorage = createSessionStorage('session.user');
const accessTokenSessionStorage = createSessionStorage('session.token');
const refreshTokenSessionStorage = createSessionStorage('session.r.token');

const RETURN_TO_MAX_AGE = 600;

// Page to land back on after a re-authentication; short-lived so a stale one is never reused.
const returnToCookie = createCookie('return_to', {
  sameSite: 'lax',
  path: '/',
  httpOnly: true,
  maxAge: RETURN_TO_MAX_AGE,
  secrets: [process.env.SESSION_SECRET!],
  secure: process.env.NODE_ENV === 'production',
});

// Same-origin relative path only, so a crafted returnTo can't send the user to another domain.
const toSafeReturnTo = (path: string | null | undefined): string | null => {
  if (!path || !path.startsWith('/') || path.startsWith('//') || path.startsWith('/\\')) return null;
  const url = new URL(path, 'http://localhost');
  if (url.origin !== 'http://localhost' || url.pathname.startsWith('/auth/')) return null;
  return `${url.pathname}${url.search}`;
};

// Client navigations reach loaders as `/x.data?_routes=…`: keep the page URL the user asked for.
const getPageUrl = (request: Request) => {
  const url = new URL(request.url);
  url.pathname = url.pathname.replace(/\/_\.data$/, '/').replace(/\.data$/, '');
  url.searchParams.delete('_routes');
  return `${url.pathname}${url.search}`;
};

const getUserSessionStorage = async (request: Request) =>
  await userSessionStorage.getSession(request.headers.get('cookie'));

const getAccessTokenSessionStorage = async (request: Request) =>
  await accessTokenSessionStorage.getSession(request.headers.get('cookie'));

const getRefreshTokenSessionStorage = async (request: Request) =>
  await refreshTokenSessionStorage.getSession(request.headers.get('cookie'));

const getKeycloakOauth2Url = (endpoint: string) =>
  `${process.env.KEYCLOAK_HOST}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/${endpoint}`;

export const authenticateRequest = async (request: Request): Promise<IAuthUserWithToken> =>
  await authenticator.authenticate(AuthStrategyName, request);

/** Starts the OAuth flow, remembering the requested page to come back to after login. */
export const authenticateAndReturn = async (request: Request): Promise<never> => {
  try {
    await authenticateRequest(request);
  } catch (error) {
    const returnTo = toSafeReturnTo(getPageUrl(request));
    if (error instanceof Response && returnTo) {
      const headers = new Headers(error.headers);
      headers.append('Set-Cookie', await returnToCookie.serialize(returnTo));
      throw new Response(null, { status: error.status, headers });
    }
    throw error;
  }
  throw redirect('/');
};

export const getSessionUser = async (request: Request): Promise<IAuthUser> => {
  const userSession = await getUserSessionStorage(request);
  const user = userSession.get('user');
  return user;
};

export const getSessionAccessToken = async (request: Request): Promise<string> => {
  const accessTokenSession = await getAccessTokenSessionStorage(request);
  return accessTokenSession.get('token');
};

export const getSessionRefreshToken = async (request: Request): Promise<string> => {
  const refreshTokenSession = await getRefreshTokenSessionStorage(request);
  return refreshTokenSession.get('token');
};

export const refreshAccessToken = async (
  request: Request,
): Promise<{ accessToken: string; cookies: string[] } | null> => {
  const refreshTokenSession = await getRefreshTokenSessionStorage(request);
  const refreshToken = refreshTokenSession.get('token');
  if (!isTokenValid(refreshToken)) return null;

  let tokens;
  try {
    tokens = await authStrategy.refreshToken(refreshToken);
  } catch {
    // Keycloak rejects it once the SSO session has ended
    return null;
  }

  const accessTokenSession = await getAccessTokenSessionStorage(request);
  accessTokenSession.set('token', tokens.accessToken());
  const cookies = [await accessTokenSessionStorage.commitSession(accessTokenSession)];

  if (tokens.hasRefreshToken()) {
    refreshTokenSession.set('token', tokens.refreshToken());
    cookies.push(await refreshTokenSessionStorage.commitSession(refreshTokenSession));
  }

  return { accessToken: tokens.accessToken(), cookies };
};

export const login = async (request: Request): Promise<Response> => {
  const { refresh_token, access_token, ...user } = await authenticateRequest(request);

  const userSession = await getUserSessionStorage(request);
  userSession.set('user', user);

  const accessTokenSession = await getAccessTokenSessionStorage(request);
  accessTokenSession.set('token', access_token);

  const refreshTokenSession = await getRefreshTokenSessionStorage(request);
  refreshTokenSession.set('token', refresh_token);

  const returnTo = toSafeReturnTo(await returnToCookie.parse(request.headers.get('cookie')));

  return redirect(returnTo ?? '/', {
    headers: [
      ['Set-Cookie', await userSessionStorage.commitSession(userSession)],
      ['Set-Cookie', await accessTokenSessionStorage.commitSession(accessTokenSession)],
      ['Set-Cookie', await refreshTokenSessionStorage.commitSession(refreshTokenSession)],
      ['Set-Cookie', await returnToCookie.serialize('', { maxAge: 0 })],
      ['Cache-Control', 'no-store'],
    ],
  });
};

export const logout = async (request: Request) => {
  const refreshTokenSession = await getRefreshTokenSessionStorage(request);

  await fetch(getKeycloakOauth2Url('logout'), {
    method: 'POST',
    body: new URLSearchParams({
      refresh_token: refreshTokenSession.get('token'),
      client_id: process.env.KEYCLOAK_CLIENT!,
      client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
    }).toString(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return await clearSession(request);
};

export const requireAuth = async (request: Request): Promise<boolean> => {
  const token = await getSessionAccessToken(request);

  if (!token) {
    return true;
  }

  try {
    if (!isTokenValid(token)) {
      return true;
    }

    const user = await getSessionUser(request);
    if (!user) {
      return true;
    }

    return false;
  } catch (err) {
    await clearSession(request);
    return true;
  }
};

export async function clearSession(request: Request): Promise<Response> {
  // Only a forced logout passes a returnTo; a voluntary one also drops any stale one
  const returnTo = toSafeReturnTo(new URL(request.url).searchParams.get('returnTo'));
  const userSession = await getUserSessionStorage(request);
  const accessTokenSession = await getAccessTokenSessionStorage(request);
  const refreshTokenSession = await getRefreshTokenSessionStorage(request);

  return redirect('/', {
    headers: [
      ['Set-Cookie', await userSessionStorage.destroySession(userSession)],
      ['Set-Cookie', await accessTokenSessionStorage.destroySession(accessTokenSession)],
      ['Set-Cookie', await refreshTokenSessionStorage.destroySession(refreshTokenSession)],
      ['Set-Cookie', await returnToCookie.serialize(returnTo ?? '', { maxAge: returnTo ? RETURN_TO_MAX_AGE : 0 })],
    ],
  });
}

const authenticator = new Authenticator<IAuthUserWithToken>();

export const authStrategy = new OAuth2Strategy(
  {
    cookie: 'oauth2',

    clientId: process.env.KEYCLOAK_CLIENT || '',
    clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || '',

    tokenEndpoint: `${getKeycloakOauth2Url('token')}`,
    authorizationEndpoint: `${getKeycloakOauth2Url('auth')}`,

    redirectURI: `${process.env.PORTAL_HOST}/auth/callback`,

    scopes: ['openid', 'email', 'profile'], // optional
  },
  async ({ tokens }) => {
    const response = await fetch(getKeycloakOauth2Url('userinfo'), {
      headers: {
        Authorization: `Bearer ${tokens.accessToken()}`,
      },
    });

    const userInfo = await response.json();

    return {
      ...userInfo,
      refresh_token: tokens.refreshToken(),
      access_token: tokens.accessToken(),
    };
  },
);

authenticator.use(authStrategy, AuthStrategyName);
