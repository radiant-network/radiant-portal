# Solution 2 — direct iframe + silent SSO: full sequence

Hypothetical deployment, all three hosts under the same registrable domain (`d3b.io`):

| Role     | Host                                |
| -------- | ----------------------------------- |
| Portal   | `https://portal.radiant-tst.d3b.io` |
| CharmX   | `https://charmx.radiant-tst.d3b.io` |
| Keycloak | `https://auth.radiant-tst.d3b.io`   |

Because all three share the eTLD+1 `d3b.io`, every cookie below is **same-site**. Nothing is a
third-party cookie, so no `SameSite=None` and no CHIPS are required — plain `Lax` works and no
browser blocks anything. This is the deployment shape to aim for.

## Sequence

```mermaid
sequenceDiagram
    autonumber
    actor U as User
    participant B as Browser<br/>(top-level: portal)
    participant F as Browser<br/>(CharmX iframe)
    participant P as Portal<br/>portal.radiant-tst.d3b.io
    participant C as CharmX<br/>charmx.radiant-tst.d3b.io
    participant K as Keycloak<br/>auth.radiant-tst.d3b.io
    participant D as Downstream<br/>service

    rect rgb(235, 244, 255)
    Note over U,K: Phase 1 — portal login (TOP-LEVEL navigation, no iframe involved)
    U->>B: open /poc/charmx
    B->>P: GET /poc/charmx
    P-->>B: 302 → auth/…/auth?client_id=radiant&redirect_uri=portal/auth/callback
    B->>K: GET /auth  (top-level)
    K-->>B: 200 login page
    U->>K: POST username + password
    K-->>B: 302 → portal/auth/callback?code=A<br/>Set-Cookie KEYCLOAK_IDENTITY, KEYCLOAK_SESSION
    Note right of K: on auth.radiant-tst.d3b.io<br/>Secure · HttpOnly · SameSite=None<br/>← the SSO session
    B->>P: GET /auth/callback?code=A
    P->>K: POST /token (back-channel, client `radiant` + secret + PKCE verifier)
    K-->>P: access_token (azp=radiant) + refresh + id_token
    P-->>B: 302 → /<br/>Set-Cookie session.user, session.token, session.r.token
    Note left of P: on portal.radiant-tst.d3b.io<br/>Secure · HttpOnly · SameSite=Lax<br/>← the token the browser can never read
    end

    rect rgb(240, 240, 240)
    Note over U,P: Phase 2 — the page renders
    B->>P: GET /poc/charmx
    P-->>B: 200 HTML containing an iframe<br/>src=https://charmx.radiant-tst.d3b.io/
    end

    rect rgb(238, 250, 240)
    Note over F,K: Phase 3 — CharmX authenticates itself, INSIDE the iframe, with no UI
    F->>C: GET /  (no charmx_session yet)
    C-->>F: 302 → auth/…/auth?client_id=charmx&prompt=none<br/>Set-Cookie charmx_oauth (state + PKCE verifier, 5 min)
    F->>K: GET /auth?prompt=none<br/>sends KEYCLOAK_IDENTITY
    Note right of K: Same-site (d3b.io), so the cookie is sent.<br/>THIS is the step that makes SSO transparent.
    K-->>F: 302 → charmx/oidc/callback?code=B
    Note right of K: No HTML is ever rendered — which matters,<br/>because Keycloak's login page sets<br/>X-Frame-Options: SAMEORIGIN and would be blank here.
    F->>C: GET /oidc/callback?code=B  (sends charmx_oauth)
    C->>K: POST /token (back-channel, client `charmx` + secret + PKCE verifier)
    K-->>C: access_token (azp=charmx, aud includes charmx)
    C-->>F: 302 → /<br/>Set-Cookie charmx_session (signed id) · clears charmx_oauth
    Note left of C: on charmx.radiant-tst.d3b.io<br/>Secure · HttpOnly · SameSite=Lax<br/>Holds only a session id — the tokens stay server-side
    F->>C: GET /  (sends charmx_session)
    C-->>F: 200 CharmX HTML
    Note over U,F: User sees CharmX. Never saw a second prompt.
    end

    rect rgb(255, 248, 235)
    Note over C,D: Phase 4 — CharmX calls the downstream service with its own token
    U->>F: click "Call downstream"
    F->>C: GET /call-downstream
    C->>D: GET /whoami<br/>Authorization: Bearer [CharmX's own token]
    D->>K: GET /certs (JWKS, cached by kid)
    K-->>D: public keys
    Note right of D: verifies signature, exp, iss, aud
    D-->>C: {valid:true, azp:"charmx", …}
    C-->>F: 200 rendering that JSON
    end
```

## The one branch that is not transparent

Step 3 assumes the browser already has a Keycloak SSO session. If it does not — a private window, or
the SSO session expired — `prompt=none` cannot show a login form, so Keycloak returns an error
instead:

```mermaid
sequenceDiagram
    autonumber
    actor U as User
    participant F as Browser<br/>(CharmX iframe)
    participant C as CharmX
    participant K as Keycloak

    F->>K: GET /auth?prompt=none  (no KEYCLOAK_IDENTITY)
    K-->>F: 302 → charmx/oidc/callback?error=login_required
    F->>C: GET /oidc/callback?error=login_required
    C-->>F: 401 "Sign-in required" page
    Note over C,F: Keycloak cannot render its login page in an iframe,<br/>so the button uses target="_top" to break out.
    U->>F: click "Sign in with Keycloak"
    Note over U,K: breaks out of the iframe → the whole tab runs Phase 1 again
```

In the portal this branch is rare: you only reach `/poc/charmx` after the portal itself logged you
in, which is what created the Keycloak session in the first place. It shows up mainly when CharmX is
opened directly, or after the SSO session (`ssoSessionIdleTimeout`, 30 min in our realm) lapses while
the portal page stays open.

## Cookies involved, and who owns them

| Cookie                                               | Set by   | Domain           | Flags                                   | Read at                                                           |
| ---------------------------------------------------- | -------- | ---------------- | --------------------------------------- | ----------------------------------------------------------------- |
| `KEYCLOAK_IDENTITY` / `KEYCLOAK_SESSION`             | Keycloak | `auth.…d3b.io`   | `Secure; HttpOnly; SameSite=None`       | Phase 3 step 3 — the SSO session that makes `prompt=none` succeed |
| `session.user` / `session.token` / `session.r.token` | Portal   | `portal.…d3b.io` | `Secure; HttpOnly; SameSite=Lax`        | Portal requests only. **Not** used by solution 2 at all           |
| `charmx_oauth`                                       | CharmX   | `charmx.…d3b.io` | `Secure; HttpOnly; SameSite=Lax`, 5 min | The callback, to validate `state` and hold the PKCE verifier      |
| `charmx_session`                                     | CharmX   | `charmx.…d3b.io` | `Secure; HttpOnly; SameSite=Lax`        | Every CharmX request afterwards                                   |

Note the portal's session cookies play **no part** in solution 2 — CharmX never sees the portal's
token. That is the structural difference from solution 1, where the portal's token _is_ the only
token and CharmX has no Keycloak identity of its own.

## Two tokens, two clients

|                 | Portal                          | CharmX                          |
| --------------- | ------------------------------- | ------------------------------- |
| Keycloak client | `radiant`                       | `charmx`                        |
| `azp`           | `radiant`                       | `charmx`                        |
| `aud`           | `radiant`, `account`            | `charmx`, `radiant`, `account`  |
| Obtained at     | Phase 1 (user typed a password) | Phase 3 (silent, `prompt=none`) |

Same user, same `sub` — two independently issued tokens. The downstream service can therefore
authorize CharmX as a first-class client instead of having it impersonate the portal.

## What each host must be configured with

- **Keycloak** — the `charmx` client needs `redirectUris: ["https://charmx.radiant-tst.d3b.io/*"]`
  and `webOrigins: ["https://charmx.radiant-tst.d3b.io"]`. Our local definition in
  `backend/scripts/init-keycloak/cqdg.json` hardcodes `localhost:8091`; that has to change per
  environment. Leave the realm's `browserSecurityHeaders` alone — relaxing `frame-ancestors` so the
  login page renders in-frame would be a clickjacking regression.
- **CharmX** — must send `Content-Security-Policy: frame-ancestors https://portal.radiant-tst.d3b.io`
  or the browser refuses to frame it. Set `PORTAL_ORIGIN` accordingly.
- **Portal** — `CHARMX_PUBLIC_URL=https://charmx.radiant-tst.d3b.io` for the iframe `src`.
- **HTTPS everywhere.** Keycloak's SSO cookies are `Secure`, and `localhost` is the browser's only
  exemption from that rule.

## Still open in this shape

- **Logout is not coordinated.** Signing out of the portal ends the portal's session and the Keycloak
  SSO session, but CharmX's own `charmx_session` survives until it expires. Closing that needs
  Keycloak back-channel logout registered on the `charmx` client.
- **CharmX's session store is in-memory** in this POC, so it does not survive a restart and will not
  work across replicas. Redis or an encrypted split cookie for anything real.
