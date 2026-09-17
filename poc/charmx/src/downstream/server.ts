import express from 'express';
import { env } from '../lib/env';
import { bearerToken, verifyAccessToken } from '../lib/oidc';

/**
 * The "other microservice".
 *
 * CharmX passes the caller's JWT through to this service; this service does the
 * real validation and reports exactly what it saw. That report is the point of
 * the whole POC: solution 1 lands here with `azp: radiant`, solution 2 with
 * `azp: charmx`, which is how you can tell at a glance that both integration
 * paths actually carried a token end to end.
 */

export function createDownstreamApp() {
  const app = express();
  app.disable('x-powered-by');

  app.get('/healthz', (_req, res) => {
    res.json({ status: 'ok', service: 'charmx-downstream' });
  });

  app.get('/whoami', async (req, res) => {
    const token = bearerToken(req.header('authorization'));

    if (!token) {
      res.status(401).json({
        valid: false,
        error: 'missing_bearer_token',
        detail: 'No Authorization: Bearer header reached the downstream service.',
        hint: 'In solution 1 the portal proxy injects it; in solution 2 CharmX attaches its own token.',
      });
      return;
    }

    const result = await verifyAccessToken(token);

    if (!result.valid) {
      res.status(401).json({
        valid: false,
        error: 'token_rejected',
        failed_check: result.failedCheck,
        detail: result.reason,
        // Unverified claims, echoed purely so a mismatch is diagnosable.
        unverified_claims: result.claims
          ? {
              iss: result.claims.iss,
              aud: result.claims.aud,
              azp: result.claims.azp,
              exp: result.claims.exp,
            }
          : null,
        expected: {
          issuer: env.keycloakIssuer,
          audiences: env.acceptedAudiences,
        },
      });
      return;
    }

    const { claims } = result;
    res.json({
      valid: true,
      service: 'charmx-downstream',
      // Which integration path this token came from — the headline of the POC.
      came_from:
        claims.azp === 'charmx' ? 'solution 2 (CharmX SSO client)' : `solution 1 (portal client: ${claims.azp})`,
      sub: claims.sub,
      preferred_username: claims.preferred_username,
      email: claims.email,
      iss: claims.iss,
      aud: claims.aud,
      azp: claims.azp,
      scope: claims.scope,
      exp: claims.exp,
      expires_at: typeof claims.exp === 'number' ? new Date(claims.exp * 1000).toISOString() : null,
      verified_with_kid: result.kid,
      checks: result.checks,
    });
  });

  return app;
}

export function startDownstream() {
  const app = createDownstreamApp();
  return app.listen(env.downstreamPort, () => {
    console.log(`[downstream] listening on http://localhost:${env.downstreamPort}`);
    console.log(`[downstream] verifying against ${env.jwksUri}`);
    console.log(`[downstream] required iss=${env.keycloakIssuer} aud=${env.acceptedAudiences.join('|')}`);
  });
}

// Started directly (`npm run downstream`) rather than imported by src/dev.ts.
if (process.argv[1] && import.meta.url === `file://${process.argv[1]}`) {
  startDownstream();
}
