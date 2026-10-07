# YAC agent (local dev, POC)

[YAC](https://github.com/hms-dbmi/udi-yac) is HIDIVE's agentic chat (chat UI + agent back-end). This
runs its agent back-end (`packages/agent`, FastAPI) in the local compose stack, with a local Ollama
as the LLM. Service definition: `yac-compose.yml`.

## Start

```bash
ollama serve                 # on the host (GPU); skip if the Ollama app is already running
ollama pull qwen3:14b

cd backend
YAC_ENABLED=true make docker-run   # without YAC_ENABLED=true the agent is not started
```

The first run builds the image from the git repo (a few minutes). The agent listens on
`http://localhost:8007`. `make docker-down` stops it with the rest of the stack.

Without the Makefile: `COMPOSE_PROFILES=yac docker compose -f compose/docker-compose.yml up --build`.

## Start only the agent

To run the portal frontend against a remote environment (e.g. QA Keycloak and API) with a local
agent, start the agent alone. StarRocks, Keycloak and the API are not started:

```bash
cd backend
YAC_KEYCLOAK=https://auth.dev.qlin.aws.sante.quebec/realms/qlin make yac-run   # QA, needs the VPN
make yac-down                                                                  # stop it
```

Then point the portal's yac proxy at it, in `frontend/portals/radiant/.env`:

```
YAC_AGENT_HOST="http://localhost:8007"
```

and run `npm run dev:radiant`. The browser calls `/api/yac/*`, and the proxy forwards them to the
agent with the session's token.

In this mode only completions work. The metadata and query endpoints use `yac/backends.json`, which
points at the local StarRocks, and that StarRocks doesn't know remote users.

## Overrides

| Variable | Default | Purpose |
|---|---|---|
| `YAC_ENABLED` | unset | `true` adds the `yac` profile in `make docker-run` |
| `YAC_MODEL` | `qwen3:14b` | Ollama model. Needs tool calling and strict JSON-schema output |
| `YAC_LLM_BASE_URL` | `http://host.docker.internal:11434/v1` | Any OpenAI-compatible endpoint |
| `YAC_PORT` | `8007` | Host port |
| `YAC_CORS_ORIGINS` | `http://localhost:3000` | Comma-separated origins |
| `YAC_BUILD_CONTEXT` | `https://github.com/hms-dbmi/udi-yac.git#main` | Git ref or local clone path (relative to `compose/`) |
| `YAC_KEYCLOAK` | `http://keycloak:8080/realms/radiant` | Keycloak realm URL the agent trusts. It is the token issuer (`JWT_ISSUER`), and the signing keys are fetched from `<realm>/protocol/openid-connect/certs`. The audience stays `radiant`. QA: `https://auth.dev.qlin.aws.sante.quebec/realms/qlin` |

`YAC_KEYCLOAK` sets both the issuer and the key URL, so the realm URL must be reachable from the
container **and** match the tokens' `iss` claim. That holds for QA. Locally it doesn't: tokens are
minted through `http://localhost:8080/realms/radiant`, so the default issuer doesn't match and local
tokens get a 401.

## Auth and data (JWT passthrough)

The agent verifies Keycloak JWTs (realm `radiant`, audience `radiant`, the same as the API) and runs
every StarRocks query **as the caller**: the token is forwarded as the StarRocks password and the
StarRocks user is the Keycloak `sub`. Ranger masks and row filters therefore apply per user.

`yac/backends.json` exposes two packages, `tenant_a` and `tenant_b` (the `patient` views from
`scripts/02_starrocks_views.sql`). They need the seed data and demo users from `scripts/README.md`
(steps 1 to 4).

The demo users log in with their email (`alice@demo.org`, password `radiant123!`). `create-user`
sets a temporary password, which blocks direct-grant logins until the `UPDATE_PASSWORD` required
action is cleared in Keycloak (admin console, or the admin API with `radiant-admin-cli`).

## Smoke test

```bash
curl -s localhost:8007/        # {"status":"running"}

tok() { curl -s -d client_id=radiant -d 'client_secret=ShutThisIsASecret!' -d "username=$1@demo.org" \
  -d 'password=radiant123!' -d grant_type=password \
  http://localhost:8080/realms/radiant/protocol/openid-connect/token | jq -r .access_token; }

# Same query, different users: alice sees patient 1003 masked, wendy sees it in clear.
for u in alice wendy; do
  curl -s -X POST localhost:8007/v1/yac/query -H "Authorization: Bearer $(tok $u)" -H 'Content-Type: application/json' \
    -d '{"package":"tenant_a","queries":[{"vizId":"q","source":[{"name":"patient","source":"patient"}],"transformation":[]}]}' \
    | jq -c '[.results.q.displayData[] | {id, submitter_patient_id}]'
done

# Completion (browser-mode data, no StarRocks involved)
curl -s https://raw.githubusercontent.com/hms-dbmi/udi-yac/main/sample-data/penguins/datapackage.json \
  | jq '{messages: [{role: "user", content: "Show body mass by species"}], dataSchema: tojson, dataDomains: "{}"}' \
  | curl -s -X POST localhost:8007/v1/yac/completions -H "Authorization: Bearer $(tok alice)" \
    -H 'Content-Type: application/json' -d @- | jq
```

The completion returns a JSON array of tool calls (e.g. `RenderVisualization`). It can take a while
on a local model.
