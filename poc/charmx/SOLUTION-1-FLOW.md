# Solution 1 — server proxy: full sequence

Same hypothetical deployment as [SOLUTION-2-FLOW.md](SOLUTION-2-FLOW.md), with one big difference:

| Role       | Host                                                             |
| ---------- | ---------------------------------------------------------------- |
| Portal     | `https://portal.radiant-tst.d3b.io`                              |
| Keycloak   | `https://auth.radiant-tst.d3b.io`                                |
| CharmX     | `http://charmx.internal:8091` — **never reached by the browser** |
| Downstream | `http://downstream.internal:8092` — likewise                     |

The browser only ever talks to the portal and to Keycloak. CharmX is reached exclusively
server-to-server, so it does not need a public hostname, a TLS certificate, a Keycloak client, or a
DNS entry your users can resolve. Everything the browser sees lives at
`https://portal.radiant-tst.d3b.io/charmx-proxy/*` — the portal's own origin.

That single fact removes every cookie problem in solution 2: there is no cross-site request anywhere,
so `SameSite`, third-party blocking and CHIPS never enter the picture.

## Sequence

```mermaid
sequenceDiagram
    autonumber
    actor U as User
    participant B as Browser<br/>(top-level)
    participant F as Browser<br/>(CharmX iframe)
    participant P as Portal + proxy route<br/>portal.radiant-tst.d3b.io
    participant C as CharmX<br/>charmx.internal (private)
    participant K as Keycloak<br/>auth.radiant-tst.d3b.io
    participant D as Downstream<br/>downstream.internal (private)

    rect rgb(235, 244, 255)
    Note over U,K: Phase 1 — portal login. Identical to solution 2, and the ONLY time Keycloak is involved.
    U->>B: open /poc/charmx
    B->>P: GET /poc/charmx
    P-->>B: 302 to Keycloak, client_id=radiant
    B->>K: GET /auth (top-level)
    K-->>B: 200 login page
    U->>K: POST username + password
    K-->>B: 302 to portal/auth/callback?code=A<br/>Set-Cookie KEYCLOAK_IDENTITY
    B->>P: GET /auth/callback?code=A
    P->>K: POST /token (back-channel, client `radiant` + secret + PKCE verifier)
    K-->>P: access_token (azp=radiant) + refresh_token
    P-->>B: 302 to /<br/>Set-Cookie session.token (+ session.user, session.r.token)
    Note left of P: on portal.radiant-tst.d3b.io<br/>Secure · HttpOnly · SameSite=Lax<br/>THE only cookie that matters from here on
    end

    rect rgb(240, 240, 240)
    Note over U,P: Phase 2 — the page renders
    B->>P: GET /poc/charmx
    P-->>B: 200 HTML with iframe src=/charmx-proxy/<br/>a RELATIVE url — same origin, no cross-site anything
    end

    rect rgb(238, 250, 240)
    Note over F,C: Phase 3 — first iframe load. The browser asks the PORTAL, not CharmX.
    F->>P: GET /charmx-proxy/<br/>sends session.token (same-origin, always sent)
    Note right of P: proxy reads the httpOnly cookie server-side<br/>strips portal cookies so CharmX can never see them
    P->>C: GET /<br/>Authorization: Bearer [portal token]<br/>X-Charmx-Base: /charmx-proxy
    Note right of C: CharmX holds NO session.<br/>The token arrives fresh on every single request.
    C-->>P: 200 HTML (all links relative)
    P-->>F: 200 HTML streamed through<br/>content-type and headers preserved
    end

    rect rgb(255, 248, 235)
    Note over F,C: Phase 4 — navigation + form submit inside the iframe
    U->>F: click "Patients" (href="patients")
    F->>P: GET /charmx-proxy/patients?page=2
    P->>C: GET /patients?page=2 + Bearer
    C-->>P: 200 HTML
    P-->>F: 200 HTML
    U->>F: submit the form
    F->>P: POST /charmx-proxy/submit<br/>application/x-www-form-urlencoded
    Note right of P: body is buffered, not streamed —<br/>so a 401 can be retried after a token refresh
    P->>C: POST /submit + Bearer + body
    C-->>P: 303 · Location: result?msg=hello   (relative)
    Note right of P: proxy rewrites it to /charmx-proxy/result?msg=hello<br/>resolved against the path CharmX actually saw
    P-->>F: 303 · Location: /charmx-proxy/result?msg=hello
    F->>P: GET /charmx-proxy/result?msg=hello
    P->>C: GET /result?msg=hello + Bearer
    C-->>P: 200 HTML
    P-->>F: 200 HTML
    end

    rect rgb(250, 240, 250)
    Note over F,D: Phase 5 — the passthrough to the downstream service
    U->>F: click "Call downstream"
    F->>P: GET /charmx-proxy/call-downstream
    P->>C: GET /call-downstream + Bearer
    C->>D: GET /whoami<br/>Authorization: Bearer [the same portal token]
    D->>K: GET /certs (JWKS, cached by kid)
    K-->>D: public keys
    Note right of D: verifies signature, exp, iss, aud<br/>sees azp=radiant — the PORTAL's client
    D-->>C: {valid:true, azp:"radiant", …}
    C-->>P: 200 rendering that JSON
    P-->>F: 200
    end
```

## Token expiry inside the iframe

Access tokens live 5 minutes (`accessTokenLifespan` in our realm). A user leaving the tab open will
outlive one. Iframe navigations do **not** go through the client-side axios 401 interceptor in
`frontend/utils/axios.ts` — that only wraps XHR from the portal's own React code — so the proxy has
to handle it:

```mermaid
sequenceDiagram
    autonumber
    participant F as Browser<br/>(CharmX iframe)
    participant P as Portal + proxy route
    participant C as CharmX
    participant K as Keycloak

    F->>P: GET /charmx-proxy/patients
    P->>C: GET /patients + Bearer [expired token]
    C-->>P: 401
    Note right of P: proxy catches the 401 instead of passing it on
    P->>K: POST /token (grant_type=refresh_token)
    K-->>P: fresh access_token
    P->>C: GET /patients + Bearer [fresh token] — retried once
    C-->>P: 200 HTML
    P-->>F: 200 HTML<br/>Set-Cookie session.token (refreshed)
    Note over F,P: The user sees nothing. If the refresh token is<br/>also dead, the proxy lets the logout redirect through.
```

**Caveat in this POC:** CharmX does not validate the bearer token in proxy mode — it only decodes it
for display — so it never actually answers 401 on an expired token. The expiry surfaces one hop
later, at the downstream service, which does verify `exp`. The refresh-and-retry above is therefore
implemented and correct but dormant here. A real CharmX that validates its input would trigger it.

## Security note: CharmX must not be publicly reachable

In proxy mode CharmX trusts the `Authorization` header it is handed. In this POC it does not verify
the signature — the downstream does that. So if CharmX were exposed on the public internet, anyone
could call it directly with a forged or borrowed token.

Two acceptable postures, pick one:

1. **Keep CharmX private** (the diagram above). Only the portal can reach it. Simplest, and the
   reason this deployment needs no public CharmX hostname at all.
2. **Have CharmX verify the JWT itself** against Keycloak's JWKS — the same check
   `src/downstream/server.ts` already implements. Required if CharmX is reachable by anything other
   than the portal.

Doing neither is the failure mode to avoid.

## Cookies involved

| Cookie                                               | Set by   | Domain           | Sent to                                                                               |
| ---------------------------------------------------- | -------- | ---------------- | ------------------------------------------------------------------------------------- |
| `KEYCLOAK_IDENTITY` / `KEYCLOAK_SESSION`             | Keycloak | `auth.…d3b.io`   | Keycloak only, during Phase 1                                                         |
| `session.user` / `session.token` / `session.r.token` | Portal   | `portal.…d3b.io` | The portal — including every `/charmx-proxy/*` request, because it is the same origin |

That is the whole list. **CharmX gets no cookie and needs none**, and nothing in this flow is ever a
third-party cookie. Compare with solution 2, which depends on four cookies across three origins.

One wrinkle: if CharmX itself sets a cookie, the proxy passes the `Set-Cookie` through and it lands
on `portal.radiant-tst.d3b.io` scoped to `/charmx-proxy`. A name collision with a portal cookie would
be silent, so namespace CharmX's cookies if it uses any. The proxy already strips the portal's own
session cookies on the way out, so CharmX can never read or replay them.

## One token, one client

|                 | Portal + CharmX + downstream            |
| --------------- | --------------------------------------- |
| Keycloak client | `radiant`                               |
| `azp`           | `radiant`                               |
| `aud`           | `radiant`, `account`                    |
| Obtained at     | Phase 1, when the user typed a password |

There is only ever one token. CharmX has no Keycloak identity of its own — it acts entirely on the
portal's. That is the main functional trade against solution 2: the downstream cannot distinguish
"the portal called me" from "CharmX called me", so it cannot authorize them differently. If you need
CharmX to have distinct permissions, either add a token-exchange step or use solution 2.

## What each host must be configured with

- **Portal** — `CHARMX_HOST=http://charmx.internal:8091` (server-side only, never sent to the
  browser). No `CHARMX_PUBLIC_URL` is needed for this solution.
- **CharmX** — must emit **relative** URLs. The proxy rewrites `Location` headers but never rewrites
  HTML bodies, so an absolute `href="/patients"` escapes the mount and 404s on the portal. No
  Keycloak client, no redirect URIs, no `frame-ancestors` needed.
- **Keycloak** — nothing at all. No second client, no extra redirect URIs.

## Still open in this shape

- **Uploads.** Request bodies are buffered so a 401 can be retried. Fine for HTML and forms, wrong
  for large file uploads — those would need a streaming variant that forfeits the retry.
- **WebSockets / SSE** are not proxied.
- **Latency and bandwidth.** Every byte CharmX serves transits the portal's Node process.
