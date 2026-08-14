import type { RadiantClaims } from './oidc';

/**
 * Tiny HTML helpers — no template engine, so the markup that goes over the wire
 * is right here in one file.
 *
 * EVERY link, form action and asset href below is DOCUMENT-RELATIVE (no leading
 * slash). That is the single property that lets solution 1 work: mounted under
 * `/charmx-proxy/` on the portal origin, `href="patients"` resolves to
 * `/charmx-proxy/patients` and comes back through the proxy. An absolute
 * `href="/patients"` would escape the proxy and 404 on the portal.
 */

export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export type AuthMode = 'proxy' | 'sso';

const MODE_LABEL: Record<AuthMode, string> = {
  proxy: 'Solution 1 — token injected by the portal proxy',
  sso: 'Solution 2 — CharmX’s own Keycloak session',
};

export type LayoutOptions = {
  title: string;
  mode: AuthMode;
  /** Rendered above the nav; used for the auth summary on every page. */
  body: string;
};

export function layout({ title, mode, body }: LayoutOptions): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>CharmX — ${escapeHtml(title)}</title>
    <!-- relative asset: proves static files resolve through the proxy too -->
    <link rel="stylesheet" href="assets/style.css" />
  </head>
  <body>
    <header>
      <h1>CharmX <small>(external app POC)</small></h1>
      <p class="badge badge-${mode}">${escapeHtml(MODE_LABEL[mode])}</p>
      <nav>
        <a href="./">Home</a>
        <a href="patients">Patients</a>
        <a href="form">Form</a>
        <a href="call-downstream">Call downstream</a>
      </nav>
    </header>
    <main>
      <h2>${escapeHtml(title)}</h2>
      ${body}
    </main>
    <footer>
      <p>Every link and form action on this page is relative — that is what makes the portal proxy work.</p>
    </footer>
  </body>
</html>
`;
}

/** Renders the claims of whichever token CharmX is holding for this request. */
export function claimsTable(claims: RadiantClaims | undefined): string {
  if (!claims) return '<p class="error">No token claims available.</p>';

  const aud = Array.isArray(claims.aud) ? claims.aud.join(', ') : (claims.aud ?? '');
  const exp = typeof claims.exp === 'number' ? new Date(claims.exp * 1000).toISOString() : '—';
  const rows: [string, unknown][] = [
    ['sub', claims.sub],
    ['preferred_username', claims.preferred_username],
    ['email', claims.email],
    ['iss', claims.iss],
    ['aud', aud],
    ['azp', claims.azp],
    ['scope', claims.scope],
    ['exp', `${claims.exp ?? '—'} (${exp})`],
  ];

  return `<table class="claims">
    <tbody>
      ${rows.map(([key, value]) => `<tr><th>${escapeHtml(key)}</th><td><code>${escapeHtml(value)}</code></td></tr>`).join('\n      ')}
    </tbody>
  </table>`;
}

/**
 * Shown when silent SSO fails (no Keycloak session). Keycloak's login page sets
 * X-Frame-Options: SAMEORIGIN, so redirecting to it inside the iframe yields a
 * blank frame — the sign-in link therefore has target="_top" to break out.
 */
export function loginRequiredPage(reason: string): string {
  return layout({
    title: 'Sign-in required',
    mode: 'sso',
    body: `<p class="error">Silent authentication failed: <code>${escapeHtml(reason)}</code></p>
      <p>
        There is no Keycloak session in this browser, so <code>prompt=none</code> could not return a token.
        Keycloak refuses to render its login page inside an iframe, so signing in has to happen at the top level.
      </p>
      <p><a class="button" href="login" target="_top">Sign in with Keycloak</a></p>`,
  });
}

export function errorPage(title: string, detail: string, mode: AuthMode = 'sso'): string {
  return layout({
    title,
    mode,
    body: `<p class="error">${escapeHtml(detail)}</p>`,
  });
}
