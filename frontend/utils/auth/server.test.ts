import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.hoisted(() => {
  process.env.SESSION_SECRET = 'test-secret';
  process.env.KEYCLOAK_HOST = 'http://keycloak';
  process.env.KEYCLOAK_REALM = 'test';
  process.env.KEYCLOAK_CLIENT = 'test-client';
  process.env.KEYCLOAK_CLIENT_SECRET = 'test-client-secret';
  process.env.PORTAL_HOST = 'http://portal';
});

const mockRefreshToken = vi.hoisted(() => vi.fn());

vi.mock('remix-auth-oauth2', () => ({
  OAuth2Strategy: function MockOAuth2Strategy() {
    return { name: 'oauth2', refreshToken: mockRefreshToken };
  },
}));

vi.mock('remix-auth', () => ({
  Authenticator: function MockAuthenticator() {
    return { use: () => undefined, authenticate: () => undefined };
  },
}));

import { createCookieSessionStorage } from 'react-router';

import { ensureFreshAccessToken, requireAuth } from './server';

const jwt = (expiresIn: number) => {
  const encode = (part: object) => Buffer.from(JSON.stringify(part)).toString('base64url');
  return `${encode({ alg: 'none' })}.${encode({ exp: Math.floor(Date.now() / 1000) + expiresIn })}.`;
};

async function cookieFor(name: string, data: Record<string, unknown>): Promise<string> {
  const storage = createCookieSessionStorage({
    cookie: { name, secrets: ['test-secret'], sameSite: 'lax', path: '/', httpOnly: true, secure: false },
  });
  const session = await storage.getSession();
  Object.entries(data).forEach(([k, v]) => session.set(k, v));
  const serialized = await storage.commitSession(session);
  return serialized.split(';')[0];
}

type RequestOpts = {
  url?: string;
  user?: Record<string, unknown>;
  accessToken?: string;
  refreshToken?: string;
};

async function buildRequest(opts: RequestOpts = {}): Promise<Request> {
  const cookies: string[] = [];
  if (opts.user !== undefined) cookies.push(await cookieFor('session.user', { user: opts.user }));
  if (opts.accessToken !== undefined) cookies.push(await cookieFor('session.token', { token: opts.accessToken }));
  if (opts.refreshToken !== undefined) cookies.push(await cookieFor('session.r.token', { token: opts.refreshToken }));
  return new Request(opts.url ?? 'http://portal/some-page', {
    headers: cookies.length ? { Cookie: cookies.join('; ') } : {},
  });
}

const refreshedTokensResponse = (accessToken: string, refreshToken?: string) => ({
  accessToken: () => accessToken,
  refreshToken: () => refreshToken ?? '',
  hasRefreshToken: () => refreshToken != null,
});

beforeEach(() => {
  mockRefreshToken.mockReset();
});

describe('ensureFreshAccessToken', () => {
  it('returns null when there is no session', async () => {
    const request = await buildRequest();
    const result = await ensureFreshAccessToken(request);
    expect(result).toBeNull();
    expect(mockRefreshToken).not.toHaveBeenCalled();
  });

  it('returns the access token and no cookies when the token is still valid', async () => {
    const accessToken = jwt(300);
    const request = await buildRequest({ accessToken });
    const result = await ensureFreshAccessToken(request);
    expect(result).toEqual({ accessToken, cookies: [] });
    expect(mockRefreshToken).not.toHaveBeenCalled();
  });

  it('refreshes a token that is within the 30s expiry window', async () => {
    const freshAccess = jwt(900);
    mockRefreshToken.mockResolvedValue(refreshedTokensResponse(freshAccess, jwt(3600)));
    const request = await buildRequest({ accessToken: jwt(10), refreshToken: jwt(3600) });
    const result = await ensureFreshAccessToken(request);
    expect(mockRefreshToken).toHaveBeenCalledTimes(1);
    expect(result?.accessToken).toBe(freshAccess);
    expect(result?.cookies.length).toBe(2);
  });

  it('refreshes an expired access token and returns the new session cookies', async () => {
    const freshAccess = jwt(900);
    mockRefreshToken.mockResolvedValue(refreshedTokensResponse(freshAccess, jwt(3600)));
    const request = await buildRequest({ accessToken: jwt(-10), refreshToken: jwt(3600) });
    const result = await ensureFreshAccessToken(request);
    expect(mockRefreshToken).toHaveBeenCalledTimes(1);
    expect(result?.accessToken).toBe(freshAccess);
    expect(result?.cookies.some(c => c.startsWith('session.token='))).toBe(true);
    expect(result?.cookies.some(c => c.startsWith('session.r.token='))).toBe(true);
  });

  it('returns only the access-token cookie when Keycloak rotates no new refresh token', async () => {
    mockRefreshToken.mockResolvedValue(refreshedTokensResponse(jwt(900)));
    const request = await buildRequest({ accessToken: jwt(-10), refreshToken: jwt(3600) });
    const result = await ensureFreshAccessToken(request);
    expect(result?.cookies.length).toBe(1);
    expect(result?.cookies[0]?.startsWith('session.token=')).toBe(true);
  });

  it('returns null when the refresh token is itself expired', async () => {
    const request = await buildRequest({ accessToken: jwt(-10), refreshToken: jwt(-100) });
    const result = await ensureFreshAccessToken(request);
    expect(result).toBeNull();
    expect(mockRefreshToken).not.toHaveBeenCalled();
  });

  it('returns null when Keycloak rejects the refresh', async () => {
    mockRefreshToken.mockRejectedValue(new Error('invalid_grant'));
    const request = await buildRequest({ accessToken: jwt(-10), refreshToken: jwt(3600) });
    const result = await ensureFreshAccessToken(request);
    expect(result).toBeNull();
  });

  it('coalesces parallel calls with the same expired access token into one refresh', async () => {
    const freshAccess = jwt(900);
    mockRefreshToken.mockResolvedValue(refreshedTokensResponse(freshAccess, jwt(3600)));
    const expired = jwt(-10);
    const refresh = jwt(3600);
    const requests = await Promise.all([
      buildRequest({ accessToken: expired, refreshToken: refresh }),
      buildRequest({ accessToken: expired, refreshToken: refresh }),
      buildRequest({ accessToken: expired, refreshToken: refresh }),
    ]);
    const [a, b, c] = await Promise.all(requests.map(r => ensureFreshAccessToken(r)));
    expect(mockRefreshToken).toHaveBeenCalledTimes(1);
    expect(a?.accessToken).toBe(freshAccess);
    expect(b?.accessToken).toBe(freshAccess);
    expect(c?.accessToken).toBe(freshAccess);
  });
});

describe('requireAuth', () => {
  it('returns true when there is no session', async () => {
    const request = await buildRequest();
    await expect(requireAuth(request)).resolves.toBe(true);
  });

  it('returns true when the access token is valid but there is no user cookie', async () => {
    const request = await buildRequest({ accessToken: jwt(300) });
    await expect(requireAuth(request)).resolves.toBe(true);
  });

  it('returns false when the access token is valid and the user cookie is present', async () => {
    const request = await buildRequest({ accessToken: jwt(300), user: { sub: 'u1' } });
    await expect(requireAuth(request)).resolves.toBe(false);
  });

  it('throws a redirect with the refreshed Set-Cookie when the access token was refreshed', async () => {
    mockRefreshToken.mockResolvedValue(refreshedTokensResponse(jwt(900), jwt(3600)));
    const request = await buildRequest({
      url: 'http://portal/radiant/case',
      accessToken: jwt(-10),
      refreshToken: jwt(3600),
      user: { sub: 'u1' },
    });
    let thrown: unknown;
    try {
      await requireAuth(request);
    } catch (err) {
      thrown = err;
    }
    expect(thrown).toBeInstanceOf(Response);
    const response = thrown as Response;
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toBe('/radiant/case');
    const setCookie = response.headers.getSetCookie();
    expect(setCookie.some(c => c.startsWith('session.token='))).toBe(true);
  });

  it('returns true when the access token is expired and the refresh fails', async () => {
    mockRefreshToken.mockRejectedValue(new Error('invalid_grant'));
    const request = await buildRequest({
      accessToken: jwt(-10),
      refreshToken: jwt(3600),
      user: { sub: 'u1' },
    });
    await expect(requireAuth(request)).resolves.toBe(true);
  });
});
