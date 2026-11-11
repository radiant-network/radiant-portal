# Local LibreChat → remote radiant-mcp (Keycloak JWT pass-through)

A self-contained local test harness for driving the **deployed** radiant-mcp
server from a LibreChat UI running on your machine.

- **LibreChat + MongoDB** run locally (this `docker compose` stack).
- **Keycloak** and **radiant-mcp** are **remote** (already deployed).
- The **LLM** is served by **AWS Bedrock** (Claude, `ca-central-1`), with
  **Ollama on your host** kept as an optional local alternative.

LibreChat logs the user in against remote Keycloak, then forwards *that same*
Keycloak access token to radiant-mcp as `Authorization: Bearer <jwt>`. radiant-mcp
accepts it with fastmcp's native `KeycloakAuthProvider`, which validates any valid
realm JWT against Keycloak's JWKS (so no MCP OAuth discovery/DCR happens here), and
runs each StarRocks query under the token's `sub` identity.

## How the token flows

```
Browser ──login──▶ remote Keycloak
   │                    │ issues access token (JWT) to LibreChat client
   ▼                    ▼
LibreChat (local) ──Authorization: Bearer {{LIBRECHAT_OPENID_ACCESS_TOKEN}}──▶ remote radiant-mcp /mcp
   │ (OPENID_REUSE_TOKENS refreshes the token so it stays valid)              │ KeycloakAuthProvider (JWKS)
   │                                                                          ▼
Bedrock / Ollama ◀──model calls──┘                                 starrocks.py → StarRocks (as `sub`)
```

## Prerequisites

### 1. AWS Bedrock (`ca-central-1`)
- Enable **Model access** for the Anthropic models in `ca-central-1`. This needs the
  model's AWS Marketplace agreement accepted **once, at account level** — the IAM
  actions `aws-marketplace:ViewSubscriptions` + `:Subscribe`. Only *creating* the
  agreement needs them; afterwards any principal can invoke without Marketplace
  permissions. Without it every `anthropic.*` invoke returns `AccessDeniedException`.
- Create a **long-term** Bedrock API key (console → Bedrock → API keys) and set it as
  `BEDROCK_AWS_BEARER_TOKEN` in `.env`. Short-term keys expire after 12 h and the
  stack then fails with `Bearer Token has expired`.
- Model IDs are pinned in `.env` via `BEDROCK_AWS_MODELS`. Leave it set: unset, the
  picker lists every ID LibreChat knows, most of which this account cannot invoke.

Three gates decide whether a Bedrock model ID works here — see the notes in
`.env.example` for the check commands:
1. **Marketplace agreement** in place (`agreementAvailability.status: AVAILABLE`).
2. **Profile-prefixed ID** for anything `INFERENCE_PROFILE`-only, which all Claude
   models are. A bare `anthropic.claude-...` returns `ValidationException`. There is
   no `ca.` profile for Claude, so `us.` (US regions) or `global.` (any commercial
   region) is unavoidable — `us.` is the tighter choice for residency.
3. **Tool use in streaming mode**, since LibreChat always streams. Non-streaming
   `converse` is not a valid check — `mistral.mistral-large-2402-v1:0` passes it and
   still fails on `ConverseStream`.

### 2. Ollama on the host (optional — only if you want the local model too)
```bash
ollama pull llama3.1                 # a tool-calling capable model
OLLAMA_HOST=0.0.0.0:11434 ollama serve
curl http://localhost:11434/v1/models   # sanity check
```
> Default Ollama binds `127.0.0.1`, which the LibreChat container can't reach.
> `OLLAMA_HOST=0.0.0.0:11434` is required.

### 3. Remote Keycloak (one-time)
On the LibreChat client (confidential, authorization-code flow), in the **same
realm** radiant-mcp/StarRocks validate against:
- Add redirect URI: `http://localhost:3080/oauth/openid/callback`
- Ensure `offline_access` is an allowed/optional scope (usually a realm default).
- If radiant-mcp runs with `KEYCLOAK_AUDIENCE` set (or StarRocks requires a
  specific `aud`), add an **audience mapper** so tokens carry that audience.
  Otherwise no mapper needed.

### 4. Remote StarRocks (the real gate)
Each Keycloak user's `sub` (UUID) must already exist as a StarRocks user
`IDENTIFIED WITH authentication_jwt` (`principal_field: sub`) — the same
requirement as the existing portal path. Test with an already-provisioned user.

## Run

```bash
cp .env.example .env
# edit .env: OPENID_ISSUER / OPENID_CLIENT_ID / OPENID_CLIENT_SECRET / OPENID_SESSION_SECRET
# edit .env: BEDROCK_AWS_BEARER_TOKEN
# the `radiant` mcpServers url in librechat.yaml already points at the dev host;
# change it only for a different deployment (and update mcpSettings.allowedDomains)
docker compose up -d
open http://localhost:3080
```

## Verify (end-to-end)

1. Open http://localhost:3080 and log in via the Keycloak button.
2. Confirm a **Bedrock** endpoint appears in the model picker listing the
   `BEDROCK_AWS_MODELS` IDs, and send one plain chat turn — that alone validates the
   API key, the region and model access.
3. Create an **Agent** on the **Bedrock** endpoint with a Claude model, and enable
   the **radiant** MCP server's tools on it.
   The instructions of the three D.A.V.I.D agents live in `agent-radiant-case.md`,
   `agent-radiant-patient.md` and `agent-radiant-cohort.md` (paste one into the
   agent's *Instructions* field). In QA they are the `promptPrefix` of the
   `radiant-case`, `radiant-patient` and `radiant-cohort` model specs in
   qlin-qa-infra's `librechat.yaml`: keep both copies in sync.
4. Ask the agent about a case (e.g. "summarize case 1131" → `get_case_context`),
   or ask for `describe_schema` then a `read_query`. Confirm data comes back.
5. Check the **remote** radiant-mcp logs: the token is accepted by
   `KeycloakAuthProvider` (no DCR/discovery), and `starrocks.py` runs the queries under
   the user identity.
6. **Negative check:** a Keycloak user with no matching StarRocks user should
   fail at the query step — proving the per-user pass-through is live (the server
   holds no StarRocks credential to fall back on).

## Gotchas

- **Apple Silicon:** MongoDB is pinned to `mongo:4.4` in `docker-compose.yml`;
  Mongo 5+ needs AVX and crashes on M-series chips.
- **VPN before boot:** LibreChat runs OIDC discovery once at startup and never
  retries. If the Keycloak host doesn't resolve then, the login button fails with
  `Unknown authentication strategy "openid"` for the life of the process. Fix:
  `docker compose restart librechat`, and confirm the log says `OpenID Connect
  configured successfully` rather than `strategy not registered`.
- **Bedrock errors, by message:** `AccessDeniedException ... Marketplace` = the
  model's account-level agreement is missing (prerequisite 1); `ValidationException
  ... with on-demand throughput isn't supported` = use a profile-prefixed ID
  (prerequisite 2); `This model doesn't support tool use in streaming mode` = wrong
  model for an MCP agent (prerequisite 3); `Bearer Token has expired` = short-term
  API key, generate a long-term one. If the Bedrock endpoint is missing from the UI
  entirely, the credential/region wiring failed — check `docker compose logs
  librechat`.
- **Prompt caching with Nova:** LibreChat turns prompt caching on by default for any
  model ID containing `claude` or `nova`, appending a `cachePoint` block. Claude
  accepts it in tool-result turns; Nova rejects it with `extraneous key [cachePoint]
  is not permitted` the moment MCP tools are attached. A Nova agent therefore needs
  **Prompt Caching** switched off in its model parameters.
- **`ENDPOINTS` env var:** leave it unset. Setting it turns it into an allowlist that
  would then have to name `bedrock` explicitly.
- **Ollama + MCP tools:** tool calls only work with a model that supports
  function calling (llama3.1, qwen2.5, mistral-nemo). Small/older models may
  silently ignore MCP tools.
- **Placeholder name:** `{{LIBRECHAT_OPENID_ACCESS_TOKEN}}` is used here; some
  LibreChat versions expose it as `{{LIBRECHAT_OPENID_TOKEN}}`. If the header
  arrives empty, check your version's placeholder name and confirm
  `OPENID_REUSE_TOKENS=true`.
- **Token expiry:** `offline_access` + `OPENID_REUSE_TOKENS=true` keep the
  forwarded access token fresh across the session. Without them, MCP calls
  start returning 401 once the short-lived access token expires.

## Cleanup

```bash
docker compose down            # keeps chat history in ./data-node
docker compose down -v         # or remove ./data-node to wipe everything
```
