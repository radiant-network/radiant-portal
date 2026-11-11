# Radiant MCP Server

A containerized [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server that gives AI assistants (the Radiant D.A.V.I.D agents) access to Radiant data: curated tools over the Radiant portal API and [StarRocks](https://www.starrocks.io/), plus SQL as a last resort, limited by the caller's own StarRocks rights.

## Overview

The server provides:

- **Health check endpoints** (`/health`, `/ready`) for container orchestration.
- **Mandatory OAuth 2.1 authentication** via Keycloak (OIDC), in front of the MCP endpoint.
- **Per-request JWT pass-through** — each MCP tool call runs its StarRocks queries under the authenticated user's identity. This component holds **no** StarRocks credentials.

It runs in **streamable-http** mode, exposing an HTTP endpoint for MCP clients. `KEYCLOAK_REALM_URL` is required — the server refuses to boot without it.

What each tool does and how it decides, in plain words, is in [docs/tools.md](docs/tools.md).

To change the code, start with the [developer guide](docs/developer-guide.md): the system around the server, the layers, a tool call, the result envelope, the contracts with the ETL and the portal, and how to add a tool, with diagrams.

## Quick Start

```bash
docker run -d \
  -p 8000:8000 \
  -e STARROCKS_HOST=your-starrocks-host \
  -e STARROCKS_PORT=9030 \
  -e STARROCKS_DB=your-database \
  -e KEYCLOAK_REALM_URL=https://kc.example.com/realms/radiant \
  -e MCP_BASE_URL=https://mcp.example.com \
  ghcr.io/radiant-network/radiant-mcp:latest
```

## Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/mcp` | POST | MCP protocol endpoint (JSON-RPC over HTTP) |
| `/health` | GET | Liveness check — the process is up (does not touch StarRocks) |
| `/ready` | GET | Readiness check - returns server status |

### Health Check Response

```json
{"status": "healthy"}
```

Returns HTTP 200 while the process is running. It does **not** probe StarRocks —
this component holds no StarRocks credentials.

### Readiness Check Response

```json
{"status": "ready"}
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `STARROCKS_HOST` | No | `localhost` | StarRocks FE (Frontend) hostname or IP (connection target only) |
| `STARROCKS_PORT` | No | `9030` | StarRocks FE query port |
| `STARROCKS_DB` | No | - | Default database to use |
| `STARROCKS_CONNECTION_TIMEOUT` | No | `10` | Connection timeout, in seconds |
| `STARROCKS_QUERY_TIMEOUT` | No | `60` | StarRocks `query_timeout` of every statement, in seconds |
| `STARROCKS_MAX_ROWS` | No | `500` | Maximum rows returned by `read_query` (more rows set `truncated: true`) |
| `STARROCKS_SSL_VERIFY` | No | `false` | Verify the FE certificate chain and hostname. Off, the connection is still TLS but anyone on the path can pose as StarRocks and read the forwarded JWT |
| `STARROCKS_SSL_CA` | No | - | PEM file of the CA that signed the FE certificate (a private CA). Unset, `STARROCKS_SSL_VERIFY` checks against the system CA bundle |
| `RADIANT_API_URL` | No | - | Radiant portal API base URL. When set, registers the Radiant API tools below (the caller's JWT is forwarded as a Bearer token) |
| `RADIANT_API_TIMEOUT` | No | `60` | Seconds to wait for a Radiant API response (read timeout). Requests are not retried |
| `RADIANT_API_CONNECT_TIMEOUT` | No | `5` | Seconds to open a connection to the Radiant API |
| `RADIANT_PORTAL_URL` | No | - | Radiant portal base URL. When set, the tools return a `portal_url` for every case, patient, occurrence and variant |
| `RADIANT_SHARED_DB` | No | `radiant` | StarRocks database of the shared tables (annotations, `staging_sequencing_experiment`) |
| `MCP_MAX_CONCURRENT_CALLS` | No | `20` | Tool calls running at once, for all users together (some tools open up to 3 connections or requests each, so StarRocks and the portal can see up to 3x this) |
| `MCP_QUEUE_TIMEOUT` | No | `10` | Seconds a tool call waits for a free slot before failing with `upstream` ("busy, retry") |
| `FORWARDED_ALLOW_IPS` | No | `*` | Proxies whose `X-Forwarded-*` headers are trusted (needed behind a TLS-terminating load balancer). With `*`, anyone who reaches the container directly can set the client IP and scheme it sees: keep the container reachable only through the load balancer, or set the load balancer's addresses here |

Every variable is validated at startup: a missing `KEYCLOAK_REALM_URL` or a malformed value (a non-numeric port, a negative timeout) stops the server with one line per variable.

> No `STARROCKS_USER` / `STARROCKS_PASSWORD`: this component authenticates to
> StarRocks with each caller's JWT, never a static credential. `STARROCKS_HOST`
> and `STARROCKS_PORT` only tell it *where* to connect.

> **Client timeout.** The timeouts above apply to one SQL statement or one API
> request, not to a whole tool call: `cohort_carriers` runs 2 API calls, then 2
> statements in sequence and up to 3 summary statements side by side. Give the MCP client a timeout well above
> `STARROCKS_QUERY_TIMEOUT` (e.g. `timeout: 180000` ms for the server in LibreChat's
> `mcpServers`), or a slow call is cut client-side before StarRocks' own error
> (which tells the agent to narrow the query) comes back.

## Authentication (OAuth 2.1 + Keycloak)

Authentication is **mandatory**: the server requires `KEYCLOAK_REALM_URL` and refuses to boot without it. It supports two kinds of clients simultaneously:

- **Self-discovering MCP clients** (e.g. Claude Desktop) — complete the full OAuth 2.1 + PKCE flow, with dynamic client registration, discovered automatically from the server's `.well-known` metadata.
- **Clients that already hold a Keycloak token** (e.g. a web portal) — present the existing token directly as a `Bearer` header.

In both cases the user's Keycloak JWT is forwarded to StarRocks, which validates it against Keycloak's JWKS (the `authentication_jwt` plugin, v3.5.0+) and executes queries under that user's identity. There is no static-credential fallback: a request without a valid JWT is rejected. The user (the JWT `sub`) must exist in StarRocks as `IDENTIFIED WITH authentication_jwt` (`principal_field: sub`), and StarRocks must have SSL enabled (JWT auth requires it).

The server uses fastmcp's native `KeycloakAuthProvider` — a pure JWT resource server. It holds no client id/secret and mints no tokens; it only validates incoming Bearer JWTs against the realm's JWKS. Requires Keycloak ≥ 26.6.0 for the DCR path.

### OAuth Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `KEYCLOAK_REALM_URL` | Yes | - | Bare realm URL, e.g. `https://kc.example.com/realms/radiant` |
| `MCP_BASE_URL` | No | `http://localhost:8000` | Server **root** URL (not `/mcp`); the provider derives the resource + metadata URLs from it |
| `OAUTH_REQUIRED_SCOPES` | No | `openid` | Comma-separated scopes required on tokens |
| `KEYCLOAK_AUDIENCE` | No | - | Expected JWT `aud` claim (leave unset unless you add a matching audience mapper) |
| `OAUTH_SUPPORTED_SCOPES` | No | `openid,offline_access` | Comma-separated scopes advertised in the protected-resource metadata (clients register with them) |

## Building the Image

```bash
docker build -t radiant-mcp:latest .
```

## Container Configuration

### Port Mapping

The server listens on port 8000 inside the container.

### Health Check

For container orchestration (Docker Compose, Kubernetes, ECS):

```bash
curl -f http://localhost:8000/health
```

### Example Docker Compose

```yaml
services:
  radiant-mcp:
    image: ghcr.io/radiant-network/radiant-mcp:latest
    ports:
      - "8000:8000"
    environment:
      STARROCKS_HOST: starrocks-fe
      STARROCKS_PORT: 9030
      STARROCKS_DB: my_database
      KEYCLOAK_REALM_URL: https://kc.example.com/realms/radiant
      MCP_BASE_URL: https://mcp.example.com
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### Deployment Considerations

- **Memory**: Recommend at least 1GB (SciPy and matplotlib for the charts)
- **Credentials**: None to store — the component holds no StarRocks user/password. Access is governed entirely by the caller's Keycloak JWT and the matching StarRocks JWT user.

## MCP Client Configuration

Configure your MCP client to connect to the server:

```json
{
  "mcpServers": {
    "radiant": {
      "url": "http://localhost:8000/mcp"
    }
  }
}
```

## Available MCP Tools

### Result format

Every tool returns the same JSON object, also sent as structured content and
published as the tool's output schema:

```json
{
  "ok": true,
  "data": {"...": "the tool's own fields"},
  "warnings": ["what the answer may be missing"],
  "truncated": {"reason": "what was cut and how to narrow", "lists": ["..."]},
  "portal_url": "https://portal.example/..."
}
```

On failure, `ok` is false, the MCP result has `isError`, and `error` holds a
`code` (`invalid_input`, `not_found`, `ambiguous_tenant`, `forbidden`,
`unavailable`, `auth_required`, `upstream`, `internal`), a `message` and
optional `details` (e.g. the `allowed` values). `warnings` is always a list;
`truncated` and `portal_url` are present only when they apply. The chart tools
add the PNG as an image part after the JSON.

### Tools

SQL is the assistant's last resort. Both SQL tools run under the caller's JWT and
cache nothing, so StarRocks applies the caller's own grants on every call.

| Tool | Description |
|------|-------------|
| `read_query` | Run a SQL query (send one SELECT; with several statements all run, the first result set is returned and a warning counts the others); returns at most `STARROCKS_MAX_ROWS` rows, with `truncated` set when more exist |
| `table_overview` | Row count, columns and up to 3 sample rows of a `db.table` |
| `describe_schema` | Curated description of the StarRocks tables of a topic (`germline_snv`, `somatic_snv`, `cnv`, `annotations`, `frequencies`, `clinical`): tables and portal clinical views to use, keys, partitions, stored enum values, join rules, example queries |

With `RADIANT_API_URL` set, the tools backed by the Radiant portal API are
registered. They forward the caller's Keycloak JWT as a Bearer token, so the API
applies its own per-user authorization. Every case, patient, occurrence and
variant they return carries a `portal_url` when `RADIANT_PORTAL_URL` is set:

| Tool | Description |
|------|-------------|
| `search_cases` | Find cases by exact-match filters (status, type, panel, project, MRN, patient id, ...) and/or a free-text identifier prefix (resolved through the cases autocomplete endpoint). Returns case summaries and total count |
| `get_case_context` | Full clinical context of a case: metadata, patients with phenotypes, tasks, sequencing experiments, and the `(case_id, seq_id, task_id, data_type)` keys needed to query its variant occurrences. `tenant` is optional and auto-resolved when the user belongs to a single tenant |
| `list_tenants` | Tenants the authenticated user belongs to (codes to pass as `tenant`) |
| `search_patients` | Find patients of the portal's patient list by identifier or name prefix and/or clinical filters (diagnosis, vital status, treatments, ...) |
| `get_patient_context` | Clinical context of a patient, as on the portal's patient page: demographics, diagnoses, treatments, laboratory, imaging, genomic cases and interpretations, trial eligibility. Fails with the `unavailable` code for a tenant without clinical data |
| `prioritize_snv` | Germline or somatic SNV occurrences of a sequencing, filtered and ranked like the case variants tab (Exomiser order by default) |
| `case_cnv` | Germline or somatic CNV occurrences of a sequencing, filtered and sorted like the case CNV tab |
| `variant_details` | One SNV's annotations (predictions, OMIM, ClinVar, external and internal frequencies, key transcripts) and, with an occurrence key, its genotype and transmission in a case |
| `variant_carriers` | The cases of the tenant that carry a germline SNV, interpreted or not |
| `second_hit` | Genes hit twice in a case: germline rare SNV + LOSS CNV (HET anywhere in the gene, or HOM/HEM inside the deletion), compound heterozygous pairs; somatic: germline P/LP + tumor-normal somatic SNV or LOSS/CNLOH CNV (tumor-only SNV analyses are skipped). States the rules applied |
| `cohort_carriers` | Cases and patients of the tenant carrying a variant in a gene (germline or somatic, SNV or CNV): `cases` whose proband carries, `cases_any_member` (a relative only counts too), `patients`, with counts by consequence, variant class, CNV type and family role |
| `genotype_phenotype` | Observed HPO phenotypes of a gene's carriers, and the carriers of a given HPO term |
| `gene_info` | A gene's OMIM, HPO, Orphanet, DDD and COSMIC associations, tenant gene panels and gnomAD pLI/LOEUF |
| `lookup_terms` | HPO or MONDO terms and ids from a name |
| `family_venn` | Image: Venn diagram of the SNVs shared by a trio or a duo of a case, with the counts |
| `survival_curve` | Image: Kaplan-Meier curves of 2 to 6 patient groups (patient keys, patient filters or a gene's carriers, optionally within a cohort and against its other patients), with the k-sample log-rank test |
| `oncoprint` | Image: gene x case matrix of the alteration types in a gene list |
| `lollipop` | Image: the carriers' variants along a gene's protein |
| `patient_timeline` | Image: a patient's events, treatments and imaging on one age axis |
| `bar_chart` | Image: a bar chart of numbers the agent passes (always registered) |

## Local Development

A `docker-compose.yml` brings up a full local stack — Keycloak (IdP), StarRocks (with TLS + a JWT-authenticated `testuser`), and `radiant-mcp` wired to both:

```bash
docker compose up --build
```

The MCP server is then at `http://localhost:8000/mcp` and Keycloak at `http://localhost:8080` (realm `radiant`).

### Querying StarRocks directly with a JWT

The local stack ships a Keycloak user (`testuser` / `testpass`, in realm `radiant`) and a matching StarRocks user authenticated with `authentication_jwt`. You can use the same token the MCP server forwards to query StarRocks yourself with the `mysql` CLI.

**1. Get an access token** (the compose realm's `radiant-mcp-server` client allows the password grant) and save it to a file — the `mysql` client reads the token from a file:

```bash
TOKEN=$(curl -sf -X POST http://localhost:8080/realms/radiant/protocol/openid-connect/token \
  -d grant_type=password \
  -d client_id=radiant-mcp-server \
  -d client_secret=test-client-secret \
  -d username=testuser \
  -d password=testpass \
  -d scope=openid \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])")

printf '%s' "$TOKEN" > /tmp/token.jwt
chmod 600 /tmp/token.jwt
```

To inspect the claims (notably `sub`):

```bash
echo "$TOKEN" | cut -d. -f2 | tr '_-' '/+' | base64 -d 2>/dev/null | python3 -m json.tool
```

**2. Connect with the `mysql` CLI.** The StarRocks username is the token's `sub` claim (a UUID), **not** the Keycloak login name. For `testuser` the `sub` is pinned in `keycloak-import/radiant-realm.json` and created by `starrocks-init`:

```bash
mysql -h127.0.0.1 -P9030 \
  -u 11111111-1111-1111-1111-111111111111 \
  --authentication-openid-connect-client-id-token-file=/tmp/token.jwt
```

```sql
SELECT current_user();
SELECT * FROM test_db.users;
```

Notes:

- `--authentication-openid-connect-client-id-token-file` requires a MySQL client that ships the `authentication_openid_connect_client` plugin (MySQL client ≥ 9.1, e.g. Homebrew `mysql-client`). The 8.0 client bundled in the StarRocks image does not have it — run this from the host.
- Passing the token as a password (`--enable-cleartext-plugin -p"$TOKEN"`) does **not** work; StarRocks answers `The path to ID token file is not set`.
- Keycloak access tokens are short-lived (5 minutes by default). On an authentication error, fetch a new token and reconnect.
- The FE has TLS enabled; the client negotiates SSL automatically (`--ssl-mode=REQUIRED` also works).

### Integration Tests

An end-to-end test exercises the OAuth 2.1 + JWT → StarRocks flow (health, OAuth metadata, token issuance, authenticated `read_query`, and the unauthenticated → 401 case):

```bash
docker compose --profile test run --rm test-runner
```

> Use `run --rm test-runner`, not `up --abort-on-container-exit` — the one-shot `starrocks-init` container exits 0 on success, which would abort the whole stack before the test runs.
