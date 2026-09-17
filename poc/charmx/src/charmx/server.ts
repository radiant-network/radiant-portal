import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cookieParser from 'cookie-parser';
import express from 'express';
import { callbackHandler, loginHandler, resolveAuth } from './auth';
import { env } from '../lib/env';
import { claimsTable, escapeHtml, layout, type AuthMode } from '../lib/html';
import { endSessionUrl } from '../lib/oidc';
import { clearSession, readSession } from '../lib/session';

/**
 * CharmX — the external application being embedded.
 *
 * Nothing here is domain-specific; it exists to exercise the three things that
 * break when you embed someone else's app: relative links, form submits, and
 * calling a further service with the caller's token.
 */

const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../public');

// Enough rows to page through.
const PATIENTS = Array.from({ length: 23 }, (_, i) => ({
  id: `PT-${String(i + 1).padStart(4, '0')}`,
  name: `Patient ${i + 1}`,
  status: ['screening', 'enrolled', 'completed'][i % 3]!,
}));
const PAGE_SIZE = 8;

export function createCharmxApp() {
  const app = express();
  app.disable('x-powered-by');
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: false }));

  app.use((_req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    // Needed for solution 2: the portal loads CharmX cross-origin in an iframe.
    // X-Frame-Options cannot express an allowlist, so it is deliberately unset.
    res.setHeader('Content-Security-Policy', `frame-ancestors 'self' ${env.portalOrigin}`);
    next();
  });

  app.get('/healthz', (_req, res) => {
    res.json({ status: 'ok', service: 'charmx' });
  });

  // Mounted at the relative path the pages reference: `assets/style.css`.
  app.use('/assets', express.static(publicDir, { fallthrough: false }));

  // Unauthenticated legs of the code flow (solution 2).
  app.get('/login', loginHandler);
  app.get('/oidc/callback', callbackHandler);
  app.get('/logout', (req, res) => {
    const session = readSession(req.cookies);
    clearSession(res, req.cookies);
    res.redirect(endSessionUrl(session?.idToken));
  });

  // Everything below needs a token, by whichever of the two routes.
  app.use(resolveAuth);

  app.get('/', (req, res) => {
    const { mode, claims, proxyBase } = req.auth!;
    const how =
      mode === 'proxy'
        ? `The token arrived in the <code>Authorization</code> header, injected by the portal proxy mounted at <code>${escapeHtml(
            proxyBase ?? '/charmx-proxy',
          )}</code>. CharmX holds no session of its own.`
        : `CharmX obtained this token itself from Keycloak (client <code>${escapeHtml(
            env.keycloakClient,
          )}</code>) using the authorization-code flow with <code>prompt=none</code>, reusing the browser's existing Keycloak session.`;

    res.type('html').send(
      layout({
        title: 'Home',
        mode,
        body: `<p>${how}</p>
      <h2>Token claims</h2>
      ${claimsTable(claims)}
      <p>Note <code>azp</code> — it names the Keycloak client, so it tells you which integration produced this token.</p>`,
      }),
    );
  });

  app.get('/patients', (req, res) => {
    const { mode } = req.auth!;
    const requested = Number.parseInt(String(req.query.page ?? '1'), 10);
    const lastPage = Math.ceil(PATIENTS.length / PAGE_SIZE);
    const page = Number.isNaN(requested) ? 1 : Math.min(Math.max(requested, 1), lastPage);
    const rows = PATIENTS.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const pager = [
      page > 1 ? `<a href="patients?page=${page - 1}">&larr; Previous</a>` : '',
      page < lastPage ? `<a href="patients?page=${page + 1}">Next &rarr;</a>` : '',
    ]
      .filter(Boolean)
      .join('\n        ');

    res.type('html').send(
      layout({
        title: `Patients — page ${page} of ${lastPage}`,
        mode,
        body: `<p>Relative links plus a query string. If paging works inside the iframe, the proxy preserved both the path and the search string.</p>
      <ul class="patients">
        ${rows.map(p => `<li><code>${escapeHtml(p.id)}</code> — ${escapeHtml(p.name)} <em>(${escapeHtml(p.status)})</em></li>`).join('\n        ')}
      </ul>
      <div class="pager">
        ${pager}
      </div>`,
      }),
    );
  });

  app.get('/form', (req, res) => {
    const { mode } = req.auth!;
    res.type('html').send(
      layout({
        title: 'Form submit',
        mode,
        body: `<p>A plain <code>application/x-www-form-urlencoded</code> POST to the relative action <code>submit</code>, which answers <code>303</code> with a relative <code>Location</code> (post/redirect/get).</p>
      <form method="post" action="submit">
        <label for="note">Note</label>
        <input id="note" name="note" type="text" value="hello from the iframe" required />
        <button type="submit">Submit</button>
      </form>`,
      }),
    );
  });

  app.post('/submit', (req, res) => {
    const note = String((req.body as Record<string, unknown>)?.note ?? '');
    // Relative Location on purpose: the browser resolves it against the current
    // document URL, so it lands back inside the proxy mount in solution 1 and on
    // the CharmX origin in solution 2 — with no rewriting either way.
    res.redirect(303, `result?msg=${encodeURIComponent(note)}`);
  });

  app.get('/result', (req, res) => {
    const { mode } = req.auth!;
    const msg = String(req.query.msg ?? '');
    res.type('html').send(
      layout({
        title: 'Submitted',
        mode,
        body: `<p class="ok">The POST body survived the round trip and the relative redirect landed here.</p>
      <table class="claims"><tbody>
        <tr><th>note</th><td><code>${escapeHtml(msg)}</code></td></tr>
        <tr><th>current URL</th><td><code>${escapeHtml(req.originalUrl)}</code></td></tr>
      </tbody></table>
      <p><a href="form">Submit another</a></p>`,
      }),
    );
  });

  app.get('/call-downstream', async (req, res) => {
    const { mode, token } = req.auth!;
    const url = `${env.downstreamUrl.replace(/\/$/, '')}/whoami`;

    let status: number | string;
    let payload: string;
    try {
      // The passthrough: CharmX forwards the caller's token unchanged.
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      status = response.status;
      const text = await response.text();
      try {
        payload = JSON.stringify(JSON.parse(text), null, 2);
      } catch {
        payload = text;
      }
    } catch (error) {
      status = 'network error';
      payload = error instanceof Error ? error.message : String(error);
    }

    const ok = status === 200;
    res.type('html').send(
      layout({
        title: 'Downstream call',
        mode,
        body: `<p>CharmX called <code>${escapeHtml(url)}</code> server-side with <code>Authorization: Bearer &lt;the same token&gt;</code>.</p>
      <p class="${ok ? 'ok' : 'error'}">HTTP ${escapeHtml(status)}</p>
      <pre>${escapeHtml(payload)}</pre>
      <p>Compare <code>azp</code> here between the portal's two tabs: <code>radiant</code> for solution 1, <code>charmx</code> for solution 2.</p>`,
      }),
    );
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('[charmx] unhandled error:', err);
    const mode: AuthMode = req.auth?.mode ?? 'sso';
    res
      .status(500)
      .type('html')
      .send(
        layout({
          title: 'CharmX error',
          mode,
          body: `<p class="error">${escapeHtml(err.message)}</p>`,
        }),
      );
  });

  return app;
}

export function startCharmx() {
  const app = createCharmxApp();
  return app.listen(env.charmxPort, () => {
    console.log(`[charmx]     listening on http://localhost:${env.charmxPort}`);
    console.log(`[charmx]     keycloak client=${env.keycloakClient} redirect_uri=${env.charmxPublicUrl}/oidc/callback`);
    console.log(`[charmx]     framing allowed from ${env.portalOrigin}; downstream=${env.downstreamUrl}`);
  });
}

if (process.argv[1] && import.meta.url === `file://${process.argv[1]}`) {
  startCharmx();
}
