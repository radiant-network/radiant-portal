import crypto from 'node:crypto';
import { createRemoteJWKSet, decodeJwt, jwtVerify, type JWTPayload } from 'jose';
import { env } from './env';

/**
 * OIDC helpers.
 *
 * The authorization-code flow is hand-rolled on top of `fetch` rather than
 * pulled from a library: it is ~50 lines and the point of this POC is that the
 * flow is legible to whoever reads it.
 */

export type TokenResponse = {
  access_token: string;
  refresh_token?: string;
  id_token?: string;
  token_type: string;
  expires_in: number;
};

export type RadiantClaims = JWTPayload & {
  azp?: string;
  scope?: string;
  preferred_username?: string;
  email?: string;
  name?: string;
};

/** Cached across requests; jose handles the kid lookup and re-fetch on rotation. */
const jwks = createRemoteJWKSet(new URL(env.jwksUri));

export function bearerToken(header: string | undefined): string | undefined {
  if (!header) return undefined;
  const [scheme, ...rest] = header.split(' ');
  if (!scheme || scheme.toLowerCase() !== 'bearer') return undefined;
  const token = rest.join(' ').trim();
  return token === '' ? undefined : token;
}

/**
 * Reads the claims WITHOUT verifying the signature. Display only — never use
 * the result for an authorization decision. `verifyAccessToken` is the one that
 * actually checks anything.
 */
export function decodeClaims(token: string): RadiantClaims | undefined {
  try {
    return decodeJwt<RadiantClaims>(token);
  } catch {
    return undefined;
  }
}

export type VerifyChecks = {
  signature: boolean;
  expiry: boolean;
  issuer: boolean;
  audience: boolean;
};

export type VerifyResult =
  | { valid: true; claims: RadiantClaims; kid?: string; checks: VerifyChecks }
  | {
      valid: false;
      reason: string;
      failedCheck: keyof VerifyChecks;
      claims?: RadiantClaims;
    };

/**
 * Full validation against Keycloak: RS256 signature via JWKS, `exp`, `iss` and
 * `aud`.
 *
 * Deliberately stricter than the real Radiant API, which (via gin-keycloak)
 * checks signature and expiry only — see backend/internal/authorization/keycloak.go.
 */
export async function verifyAccessToken(token: string): Promise<VerifyResult> {
  const unverified = decodeClaims(token);

  try {
    const { payload, protectedHeader } = await jwtVerify<RadiantClaims>(token, jwks, {
      issuer: env.keycloakIssuer,
      audience: env.acceptedAudiences,
    });
    return {
      valid: true,
      claims: payload,
      kid: protectedHeader.kid,
      checks: { signature: true, expiry: true, issuer: true, audience: true },
    };
  } catch (error) {
    const code = (error as { code?: string }).code ?? '';
    const message = error instanceof Error ? error.message : String(error);

    // jose reports every claim failure as ERR_JWT_CLAIM_VALIDATION_FAILED with
    // the offending claim attached, so we can name the exact check that failed.
    const claim = (error as { claim?: string }).claim;
    let failedCheck: keyof VerifyChecks = 'signature';
    if (code === 'ERR_JWT_EXPIRED' || claim === 'exp') failedCheck = 'expiry';
    else if (claim === 'iss') failedCheck = 'issuer';
    else if (claim === 'aud') failedCheck = 'audience';

    return { valid: false, reason: message, failedCheck, claims: unverified };
  }
}

// ---------------------------------------------------------------------------
// Authorization code flow (solution 2)
// ---------------------------------------------------------------------------

export function randomUrlSafe(bytes = 32): string {
  return crypto.randomBytes(bytes).toString('base64url');
}

export function codeChallengeOf(verifier: string): string {
  return crypto.createHash('sha256').update(verifier).digest('base64url');
}

export function redirectUri(): string {
  return `${env.charmxPublicUrl.replace(/\/$/, '')}/oidc/callback`;
}

export function authorizationUrl(options: { state: string; codeVerifier: string; silent: boolean }): string {
  const url = new URL(env.authorizationEndpoint);
  url.searchParams.set('client_id', env.keycloakClient);
  url.searchParams.set('redirect_uri', redirectUri());
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'openid email profile');
  url.searchParams.set('state', options.state);
  url.searchParams.set('code_challenge', codeChallengeOf(options.codeVerifier));
  url.searchParams.set('code_challenge_method', 'S256');
  if (options.silent) {
    // The whole trick of solution 2: if the browser already has a Keycloak SSO
    // session, Keycloak 302s straight back with a code and never renders HTML —
    // which matters because its login page refuses to render in an iframe.
    // If there is no session it returns error=login_required instead.
    url.searchParams.set('prompt', 'none');
  }
  return url.toString();
}

async function postToken(body: URLSearchParams): Promise<TokenResponse> {
  body.set('client_id', env.keycloakClient);
  if (env.keycloakClientSecret) body.set('client_secret', env.keycloakClientSecret);

  const response = await fetch(env.tokenEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`token endpoint returned ${response.status}: ${text}`);
  }
  return JSON.parse(text) as TokenResponse;
}

export function exchangeCode(code: string, codeVerifier: string): Promise<TokenResponse> {
  return postToken(
    new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri(),
      code_verifier: codeVerifier,
    }),
  );
}

export function refreshTokens(refreshToken: string): Promise<TokenResponse> {
  return postToken(
    new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  );
}

export function endSessionUrl(idToken: string | undefined): string {
  const url = new URL(env.endSessionEndpoint);
  url.searchParams.set('post_logout_redirect_uri', env.charmxPublicUrl);
  if (idToken) url.searchParams.set('id_token_hint', idToken);
  return url.toString();
}
