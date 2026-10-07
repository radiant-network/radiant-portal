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
| `YAC_KEYCLOAK` | unset | Keycloak realm URL of another environment, e.g. QA: `https://auth.dev.qlin.aws.sante.quebec/realms/qlin`. It becomes the token issuer (`JWT_ISSUER`), and the signing keys are fetched from `<realm>/protocol/openid-connect/certs`. The audience stays `radiant`. |

Unset, the agent trusts the local realm: the issuer is `http://localhost:8080/realms/radiant` (the URL
tokens are minted through), and the keys are fetched in-network from `keycloak:8080`, since
`localhost` inside the container is the container itself.

## Auth and data (JWT passthrough)

The agent verifies Keycloak JWTs (realm `radiant`, audience `radiant`, the same as the API) and runs
every StarRocks query **as the caller**: the token is forwarded as the StarRocks password and the
StarRocks user is the Keycloak `sub`. Ranger masks and row filters therefore apply per user.

`yac/backends.json` exposes one package, `cbtn`: the PCX secured views of tenant `cbtn`, in
database `cbtn_tenant`, seeded by the stack (see `scripts/seed/README.md`).

- `patient` (`v_pcx_30_patient_level_combined`) is the parent entity, one row per patient. The other
  eleven views (`demographics`, `event`, `medical_therapy`, `radiation`, `surgery`,
  `treatment_summary`, `mri_image` and the latest labs) link to it on `patient_id`.
- The descriptions come from the seed's data dictionaries, so the LLM knows what each column means.
- The PHI rule lives in the views and reads `current_user()`, so it applies per caller. With PHI
  access, `patient_id` is the MRN and calendar dates are filled; without it, `patient_id` is the
  research id and the dates are NULL.

Log in with the seed's demo users (`cbtn-admin`, `cbtn-phi-chop`, `cbtn-phi-sch`, `cbtn-lab`,
`cbtn-nophi`). The password is the username.

Known StarRocks 4.0.16 bug in the upstream PCX views: a `WHERE` on `radiant_patient_id` fails with
"slot_id not found". A chart selection on that column hits it.

## Smoke test

```bash
cd backend
curl -s localhost:8007/        # {"status":"running"}

SECRET=$(jq -r '.clients[] | select(.clientId=="radiant") | .secret' scripts/init-keycloak/radiant.json)
tok() { curl -s -d client_id=radiant --data-urlencode "client_secret=$SECRET" -d "username=$1" \
  -d "password=$1" -d grant_type=password \
  http://localhost:8080/realms/radiant/protocol/openid-connect/token | jq -r .access_token; }

# Same query, different users: patients whose MRN (PHI) each user sees.
# cbtn-admin 966 mrn, cbtn-phi-chop 255 mrn / 711 research_id, cbtn-nophi 966 research_id.
for u in cbtn-admin cbtn-phi-chop cbtn-nophi; do
  curl -s -X POST localhost:8007/v1/yac/query -H "Authorization: Bearer $(tok $u)" -H 'Content-Type: application/json' \
    -d '{"package":"cbtn","queries":[{"vizId":"q","source":[{"name":"patient","source":"patient"}],
         "transformation":[{"groupby":["patient_id_type"]},{"rollup":{"n":{"op":"count"}}}]}]}' \
    | jq -c "{user: \"$u\", result: .results.q.displayData}"
done

# Completion (browser-mode data, no StarRocks involved)
curl -s https://raw.githubusercontent.com/hms-dbmi/udi-yac/main/sample-data/penguins/datapackage.json \
  | jq '{messages: [{role: "user", content: "Show body mass by species"}], dataSchema: tojson, dataDomains: "{}"}' \
  | curl -s -X POST localhost:8007/v1/yac/completions -H "Authorization: Bearer $(tok cbtn-admin)" \
    -H 'Content-Type: application/json' -d @- | jq
```

The completion returns a JSON array of tool calls (e.g. `RenderVisualization`). It can take a while
on a local model.
