# CharmX integration POC

Two working prototypes for embedding an external application (**CharmX**) inside the Radiant portal
with our Keycloak JWT, so we can pick one on evidence rather than on argument.

The constraint that shapes both designs: the portal keeps its access token in an **httpOnly** cookie
(`session.token`, see `frontend/portals/radiant/app/utils/auth.server.ts`). Browser JavaScript can
never read it. So either the portal's server attaches the token on CharmX's behalf (**solution 1**),
or CharmX gets its own token from Keycloak (**solution 2**).

```
                                 ┌──────────────────────────────┐
  solution 1 (same-origin)       │  portal :3000                │
  browser ──/charmx-proxy/*──────▶  app/api/charmx-proxy.ts     │──Bearer──┐
                                 │  (injects the httpOnly JWT)  │          │
                                 └──────────────────────────────┘          ▼
                                                                  ┌─────────────────┐
  solution 2 (cross-origin)                                       │  charmx :8091   │
  browser ──iframe src=:8091────────────────────────────────────▶ │  (this repo)    │
              └── code flow, prompt=none ──▶ keycloak :8080       └────────┬────────┘
                                                                           │ Bearer
                                                                           ▼
                                                                  ┌─────────────────┐
                                                                  │ downstream :8092│
                                                                  │ verifies the JWT│
                                                                  └─────────────────┘
```

CharmX serves **both** modes from one process: if a request carries `Authorization: Bearer` it uses
that token and keeps no session (solution 1); otherwise it runs its own code flow (solution 2).

---

## Run it

```bash
# 1. Keycloak (imports the CQDG realm, including the `charmx` client)
docker compose -f ../../backend/compose/docker-compose.yml up -d keycloak

# 2. this POC — CharmX :8091 and the downstream stub :8092
npm install
npm start

# 3. the portal
cd ../../frontend && npm install
cd portals/radiant && npm run dev:radiant
```

The portal needs two extra variables in `frontend/portals/radiant/.env`:

```
CHARMX_HOST=http://localhost:8091        # server-side, used by the proxy
CHARMX_PUBLIC_URL=http://localhost:8091  # browser-visible, used by the solution-2 iframe
```

Then open **http://localhost:3000/poc/charmx**.

> **The `charmx` Keycloak client.** It is defined in
> `backend/scripts/init-keycloak/cqdg.json`, but `--import-realm` only imports a realm that does not
> already exist. If your Keycloak is already running, recreate it — the service has no named volume,
> so nothing else is lost:
>
> ```bash
> docker compose -f ../../backend/compose/docker-compose.yml rm -sf keycloak
> docker compose -f ../../backend/compose/docker-compose.yml up -d keycloak
> ```

Test users are not in the realm import. Either register one at the portal's login screen, or run
`backend/compose/scripts/04_seed_users.sh` for alice/bob/wendy (`radiant123!`).

## What to click

In each tab: **Patients** (relative links + query strings), **Form** (a POST that answers `303` with
a relative `Location`), and **Call downstream** — which is the interesting one. It shows the JSON the
downstream service returned after validating the token it was handed:

|                       | solution 1           | solution 2                     |
| --------------------- | -------------------- | ------------------------------ |
| `azp`                 | `radiant`            | `charmx`                       |
| `aud`                 | `radiant`, `account` | `charmx`, `radiant`, `account` |
| who fetched the token | the portal, at login | CharmX, via `prompt=none`      |

Different `azp` in the two tabs is the proof that both paths carried a real, signature-valid token
end to end. The downstream service checks signature, `exp`, `iss` **and** `aud` — deliberately
stricter than the real Radiant API, which (via `gin-keycloak`) checks only signature and expiry.

---

## Trade-offs

### Solution 1 — server proxy (`/charmx-proxy/*`)

> Full request-by-request sequence diagram: [SOLUTION-1-FLOW.md](SOLUTION-1-FLOW.md)

Currently the stronger candidate.

- ✅ **Same-origin.** No third-party cookies, no `frame-ancestors`, no `SameSite` — none of the
  problems below exist. Works in every browser today, including Safari.
- ✅ The token never reaches the browser.
- ✅ CharmX needs no Keycloak client, no redirect URIs and no session of its own.
- ⚠️ **CharmX must emit relative URLs.** The proxy rewrites `Location` headers but never rewrites
  HTML bodies, so an absolute `href="/patients"` escapes the mount and 404s on the portal.
- ⚠️ CharmX's `Set-Cookie`s land on the portal's origin (scoped to `/charmx-proxy`) — a name
  collision with a portal cookie would be silent. The proxy strips the portal's own session cookies
  on the way out so CharmX can never see or replay them.
- ⚠️ All CharmX traffic transits the portal's Node server. Request bodies are buffered (so a 401 can
  be retried after a token refresh), which is fine for HTML and forms but wrong for large uploads.
  WebSockets/SSE would need more work.
- ⚠️ Token refresh inside an iframe is the portal's job: iframe navigations bypass the client-side
  axios 401 interceptor in `frontend/utils/axios.ts`, so the proxy refreshes and retries once itself.

### Solution 2 — direct iframe + silent SSO

> Full request-by-request sequence diagram, for a same-domain deployment:
> [SOLUTION-2-FLOW.md](SOLUTION-2-FLOW.md)

- ✅ Genuinely transparent when the user already has a Keycloak session: `prompt=none` returns a code
  with no UI at all (verified — zero sign-in prompts).
- ✅ CharmX gets its own audience (`aud: charmx`), so the downstream can distinguish and authorize it
  as a first-class client rather than impersonating the portal.
- ✅ No proxy hop; CharmX can use any URL shape it likes.
- 🚨 **Where you deploy CharmX decides whether this works at all** — see below.
- 🚨 **Keycloak's login page cannot render in an iframe** (`X-Frame-Options: SAMEORIGIN` from the
  realm's security defenses). Only the `prompt=none` happy path is transparent; `login_required` must
  break out to the top level, which is what the "Sign in with Keycloak" page here does
  (`target="_top"`). Relaxing the realm's `frame-ancestors` to make login render in-frame would be a
  clickjacking regression — don't.
- ⚠️ Needs its own Keycloak client, redirect URIs, and logout coordination: signing out of the portal
  does **not** end CharmX's session (that needs Keycloak back-channel logout).
- ⚠️ CharmX must serve `frame-ancestors` allowing the portal's origin (it does).

#### Cookies in solution 2: which ones, and where CharmX may live

Two separate cookies have to survive the iframe. Both are third-party cookie problems, and both are
decided by **site**, not origin.

1. **`charmx_session`** — CharmX's own session, set on CharmX's origin. Without it, every request
   inside the iframe is anonymous and CharmX re-runs silent auth forever.
2. **Keycloak's `KEYCLOAK_IDENTITY` / `KEYCLOAK_SESSION`** — read when the iframe navigates to
   Keycloak for `prompt=none`. Without them Keycloak answers `login_required` and the user gets a
   sign-in prompt _even though they are signed in to the portal_. Keycloak already sets these
   `Secure; SameSite=None` out of the box, so it is handled — but `Secure` means **HTTPS is
   mandatory** in any real deployment (`localhost` is the browser's only exemption).

**"Same site" is not "same origin".** A _site_ is the scheme plus the registrable domain (eTLD+1).
Port and subdomain are **ignored**. That is why `localhost:3000` and `localhost:8091` are same-site
despite being different origins — and it is why local testing tells you nothing about production.

| CharmX deployed at                                    | Same site as the portal?                             | What you need                                                                                                                  |
| ----------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `localhost:8091` (portal on `:3000`)                  | **Yes** — port ignored                               | Nothing. Also proves nothing.                                                                                                  |
| `charmx.radiant.org` (portal on `portal.radiant.org`) | **Yes** — subdomain ignored, eTLD+1 is `radiant.org` | Nothing special. `SameSite=Lax` is fine and third-party blocking never applies. **This is the deployment to aim for.**         |
| `charmx.some-vendor.io` (portal on `radiant.org`)     | **No** — different registrable domain                | `SameSite=None; Secure` over HTTPS, **and** CHIPS (`Partitioned`) to survive Safari/Firefox/Chrome third-party cookie blocking |

So to answer the common question directly: **if CharmX sits on a subdomain of the portal's domain,
none of this bites.** The cookie warnings only apply when CharmX lives on a genuinely different
registrable domain.

One catch if you do end up cross-site with CHIPS: a `Partitioned` cookie is double-keyed by
(top-level site, cookie site). CharmX's session inside the portal's iframe is then a _different_
session from CharmX opened in its own tab — signing out of one does not sign out of the other.

To rehearse the cross-site shape locally:
`CHARMX_COOKIE_SAMESITE=none CHARMX_COOKIE_SECURE=true CHARMX_COOKIE_PARTITIONED=true`.

None of this applies to solution 1, which is same-origin by construction.

---

## Two bugs this POC already caught

Both were found by running the flows, not by reading the code — and both would have hit any real
implementation of these designs.

1. **A Keycloak session does not fit in a cookie.** Access + refresh + id token sealed into one
   cookie came to **4393 bytes**, past the 4096-byte per-cookie limit. Browsers drop an oversized
   `Set-Cookie` _silently_: login appears to succeed and every later request is anonymous. CharmX now
   keeps tokens in a server-side store and puts only a signed session id in the cookie
   (`src/lib/session.ts`). A production build needs Redis or an encrypted split cookie — not this
   in-memory `Map`, which logs everyone out on restart.

2. **Don't let the framework resolve a relative `Location`.** CharmX answers its form POST with the
   relative `Location: result?msg=…`. React Router normalised it against the wrong base, turning it
   into `/charmx-proxy/submit/result` — a 404. The proxy now resolves relative locations itself
   against the path CharmX actually saw and emits an absolute path.

## Layout

```
src/lib/env.ts        configuration, all defaulted for the local stack
src/lib/oidc.ts       code flow + PKCE, and JWKS/RS256 verification (jose)
src/lib/session.ts    signed session-id cookie + server-side token store
src/lib/html.ts       the pages — every link/action here is document-relative
src/charmx/auth.ts    per-request mode resolution (header vs own session)
src/charmx/server.ts  CharmX itself                          :8091
src/downstream/       the "other microservice"               :8092
```

Portal-side (the only files outside this directory):

```
frontend/portals/radiant/app/api/charmx-proxy.ts    the solution-1 proxy
frontend/portals/radiant/app/routes/poc/charmx.tsx  the two-tab comparison page
frontend/portals/radiant/app/routes.ts              two route entries
backend/scripts/init-keycloak/cqdg.json             the `charmx` client
```

## Configuration

Everything is defaulted; override via environment variables.

| Variable                                              | Default                          | Notes                                                                                                        |
| ----------------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `CHARMX_PORT` / `DOWNSTREAM_PORT`                     | `8091` / `8092`                  |                                                                                                              |
| `CHARMX_PUBLIC_URL`                                   | `http://localhost:8091`          | Must match the Keycloak redirect URI                                                                         |
| `PORTAL_ORIGIN`                                       | `http://localhost:3000`          | Allowed to frame CharmX                                                                                      |
| `KEYCLOAK_HOST` / `KEYCLOAK_REALM`                    | `http://localhost:8080` / `CQDG` |                                                                                                              |
| `KEYCLOAK_CLIENT` / `_SECRET`                         | `charmx` / `charmx-poc-secret`   |                                                                                                              |
| `KEYCLOAK_ISSUER`                                     | derived from host+realm          | Override when in-container: tokens are minted through the browser, so `iss` says `localhost`, not `keycloak` |
| `ACCEPTED_AUDIENCES`                                  | `radiant,charmx`                 | What the downstream will accept                                                                              |
| `CHARMX_COOKIE_SAMESITE` / `_SECURE` / `_PARTITIONED` | `lax` / `false` / `false`        | Set to `none`/`true`/`true` to rehearse production                                                           |
