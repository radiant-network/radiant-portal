/**
 * Configuration for both POC services.
 *
 * Every value has a default aimed at the local `backend/compose` stack, so the
 * POC runs with no .env file at all. Override anything via real env vars.
 */

function str(name: string, fallback: string): string {
  const value = process.env[name];
  return value === undefined || value === '' ? fallback : value;
}

function int(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw === '') return fallback;
  const parsed = Number.parseInt(raw, 10);
  if (Number.isNaN(parsed)) throw new Error(`env ${name} is not a number: ${raw}`);
  return parsed;
}

function bool(name: string, fallback: boolean): boolean {
  const raw = process.env[name];
  if (raw === undefined || raw === '') return fallback;
  return raw === 'true' || raw === '1';
}

function list(name: string, fallback: string[]): string[] {
  const raw = process.env[name];
  if (raw === undefined || raw === '') return fallback;
  return raw
    .split(',')
    .map(v => v.trim())
    .filter(Boolean);
}

const keycloakHost = str('KEYCLOAK_HOST', 'http://localhost:8080');
const keycloakRealm = str('KEYCLOAK_REALM', 'CQDG');

export const env = {
  // ---- Keycloak (shared) -------------------------------------------------
  keycloakHost,
  keycloakRealm,
  /**
   * The `iss` claim value carried by tokens. Note it is NOT always
   * `${keycloakHost}/realms/${realm}`: inside docker the host is
   * `http://keycloak:8080`, but tokens are minted through the browser so `iss`
   * says `http://localhost:8080`. That mismatch is why this is separate.
   */
  keycloakIssuer: str('KEYCLOAK_ISSUER', `${keycloakHost}/realms/${keycloakRealm}`),
  jwksUri: str('KEYCLOAK_JWKS_URI', `${keycloakHost}/realms/${keycloakRealm}/protocol/openid-connect/certs`),
  authorizationEndpoint: `${keycloakHost}/realms/${keycloakRealm}/protocol/openid-connect/auth`,
  tokenEndpoint: `${keycloakHost}/realms/${keycloakRealm}/protocol/openid-connect/token`,
  endSessionEndpoint: `${keycloakHost}/realms/${keycloakRealm}/protocol/openid-connect/logout`,

  // ---- CharmX app --------------------------------------------------------
  charmxPort: int('CHARMX_PORT', 8091),
  /** Public origin of CharmX; must match the Keycloak client's redirect URI. */
  charmxPublicUrl: str('CHARMX_PUBLIC_URL', `http://localhost:${int('CHARMX_PORT', 8091)}`),
  /** Portal origin allowed to frame CharmX (solution 2). */
  portalOrigin: str('PORTAL_ORIGIN', 'http://localhost:3000'),
  keycloakClient: str('KEYCLOAK_CLIENT', 'charmx'),
  keycloakClientSecret: str('KEYCLOAK_CLIENT_SECRET', 'charmx-poc-secret'),
  sessionSecret: str('SESSION_SECRET', 'charmx-poc-session-secret'),

  /**
   * Cookie flags for CharmX's own session (solution 2 only).
   *
   * Defaults are `lax` + insecure because that is all localhost needs — and
   * that is exactly the trap: localhost:3000 and localhost:8091 are the SAME
   * SITE, so a lax cookie survives the iframe locally. On different production
   * domains it will not. Prod needs sameSite=none + secure (+ partitioned).
   */
  cookieSameSite: str('CHARMX_COOKIE_SAMESITE', 'lax') as 'lax' | 'none' | 'strict',
  cookieSecure: bool('CHARMX_COOKIE_SECURE', false),
  cookiePartitioned: bool('CHARMX_COOKIE_PARTITIONED', false),

  // ---- Downstream stub ---------------------------------------------------
  downstreamPort: int('DOWNSTREAM_PORT', 8092),
  downstreamUrl: str('DOWNSTREAM_URL', `http://localhost:${int('DOWNSTREAM_PORT', 8092)}`),
  /** Audiences the downstream service accepts. `radiant` = solution 1, `charmx` = solution 2. */
  acceptedAudiences: list('ACCEPTED_AUDIENCES', ['radiant', 'charmx']),
} as const;

export type Env = typeof env;
