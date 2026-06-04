# Ranger (StarRocks) image

A self-contained **Apache Ranger admin** image (`FROM apache/ranger:2.8.0`) with the StarRocks
integration baked in. It targets a managed Postgres (no runtime superuser) and externalizes all
secrets through `RANGER_*` env vars, so the same image works in local dev (`docker-compose.yml`) and
in production (k8s).

What's baked into the image (vs. the stock Ranger image):

- the **StarRocks Ranger plugin jar** + **MySQL JDBC driver** on the admin classpath
  (`…/WEB-INF/classes/ranger-plugins/starrocks/`), used for resource autocomplete / Test Connection;
- the **service-def** (`ranger-servicedef-starrocks.json` → `/ranger/service-defs/starrocks.json`) and
  the **service instance** (`starrocks-service.json` → `/ranger/services/starrocks.json`), applied at
  startup by `register-services.py`.

## Files

| File | Role |
|---|---|
| `Dockerfile` | Builds the image: copies scripts, bakes the JSON + plugin jars. |
| `ranger-entrypoint.sh` | Entry point. Modes `migrate` / `serve` / `register`; resolves the StarRocks knobs. |
| `install.properties.tpl` | `install.properties` template (`${RANGER_*}` placeholders, `setup_mode=SeparateDBA`, no plaintext secrets). |
| `register-services.py` | Generic, file-driven registration: service-defs create-or-update, instances create-only. |
| `ranger-servicedef-starrocks.json` | StarRocks service-def (the resource "type"). `implClass` is a `${…}` placeholder. |
| `starrocks-service.json` | StarRocks service instance (connection config; `${…}` placeholders). |

## Entry-point modes

The default `CMD` is `serve`. Pass another mode as the container command to switch:

- `migrate` — render `install.properties`, run `setup.sh` (schema only), exit. Use as a gated, run-once
  k8s Job before rolling out serve pods.
- `serve` — run setup (idempotent) → start the admin → register the baked service-def/instance (unless
  `RANGER_REGISTER_ON_SERVE=false`) → stay alive.
- `register` — pure REST client against an already-running admin (no DB setup, no server). Use as a
  one-shot k8s Job after the serve Deployment is healthy.

## StarRocks connection is optional

The StarRocks connection (`RANGER_STARROCKS_USERNAME` / `RANGER_STARROCKS_PASSWORD` /
`RANGER_STARROCKS_JDBC_URL`) is **only needed when autocomplete is enabled**.

`RANGER_STARROCKS_AUTOCOMPLETE` controls the service-def's `implClass`:

- **`yes` (default)** → `implClass = org.apache.ranger.services.starrocks.RangerServiceStarRocks`.
  Ranger loads the plugin class and connects to StarRocks for the UI **Test Connection** and resource
  **autocomplete** (catalogs / databases / tables). In this mode you **must** provide the StarRocks
  connection props, and StarRocks must be reachable.
- **anything else (e.g. `false` / `no`)** → `implClass` is empty. Ranger uses the base class and
  **never connects to StarRocks**. You can author policies by typing resource names manually.
  In this mode **you do not need to set any StarRocks connection props** — they are unused, so leaving
  `RANGER_STARROCKS_USERNAME` / `RANGER_STARROCKS_PASSWORD` / `RANGER_STARROCKS_JDBC_URL` unset is fine.

## Environment variables

### Ranger DB (managed Postgres; `SeparateDBA` — DB + role pre-created out of band)

| Var | Purpose |
|---|---|
| `RANGER_DB_HOST` | Postgres endpoint (`host[:port]`). |
| `RANGER_DB_NAME` | Database name (pre-created). |
| `RANGER_DB_USER` / `RANGER_DB_PASSWORD` | Runtime account that owns the Ranger tables. |
| `RANGER_DB_ROOT_USER` / `RANGER_DB_ROOT_PASSWORD` | Unused under `SeparateDBA`; set if you flip the mode off. |

### Ranger account passwords (≥8 chars, upper+lower+digit)

`RANGER_ADMIN_PASSWORD`, `RANGER_KEYADMIN_PASSWORD`, `RANGER_TAGSYNC_PASSWORD`, `RANGER_USERSYNC_PASSWORD`.

### Admin

| Var | Default | Purpose |
|---|---|---|
| `RANGER_POLICYMGR_EXTERNAL_URL` | `http://localhost:6080` | External base URL the admin advertises (rendered into `ranger-admin-site.xml`); **not** the bind address. Set to the real externally-reachable URL (k8s service / ingress) in production. |

### StarRocks

| Var | Default | Purpose |
|---|---|---|
| `RANGER_STARROCKS_AUTOCOMPLETE` | `yes` | `yes` → enable plugin `implClass` (Test Connection / autocomplete); else empty. |
| `RANGER_STARROCKS_SERVICE_NAME` | `starrocks` | Name of the registered service instance (`type` stays `starrocks`). |
| `RANGER_STARROCKS_USERNAME` | — | StarRocks user. **Only needed when autocomplete is `yes`.** |
| `RANGER_STARROCKS_PASSWORD` | — | StarRocks password. **Only needed when autocomplete is `yes`.** |
| `RANGER_STARROCKS_JDBC_URL` | — | e.g. `jdbc:mysql://starrocks:9030`. **Only needed when autocomplete is `yes`.** |

### Registration (used by `register` / `serve`)

| Var | Default | Purpose |
|---|---|---|
| `RANGER_REGISTER_ON_SERVE` | `true` | `serve` registers the baked files after the admin is up; set `false` to opt out (e.g. HA with a dedicated `register` Job). |
| `RANGER_ADMIN_URL` | `http://localhost:6080` | Admin REST endpoint (set to e.g. `http://ranger:6080` for a remote `register` Job). |
| `RANGER_ADMIN_USER` | `admin` | REST user. |
| `RANGER_ADMIN_WAIT_RETRIES` | `60` | `serve` readiness poll retries. |
| `RANGER_ADMIN_WAIT_INTERVAL` | `3` | `serve` readiness poll interval (seconds). |
| `RANGER_SERVICEDEF_DIR` | `/ranger/service-defs` | Service-defs applied (create-or-update). |
| `RANGER_SERVICE_DIR` | `/ranger/services` | Service instances applied (create-only). |

## Local development

Wired into `backend/docker-compose.yml` as the `ranger` service (with `ranger-db`). Bring it up:

```bash
cd backend
docker compose up -d ranger-db starrocks ranger
```

The admin is at http://localhost:6080 (login `admin` / `RANGER_ADMIN_PASSWORD`). With autocomplete on,
verify the StarRocks connection:

```bash
curl -s -u admin:<RANGER_ADMIN_PASSWORD> -H 'Content-Type: application/json' -X POST \
  http://localhost:6080/service/plugins/services/validateConfig \
  -d '{"name":"starrocks","type":"starrocks","configs":{"username":"root","password":"","jdbc.driverClassName":"com.mysql.cj.jdbc.Driver","jdbc.url":"jdbc:mysql://starrocks:9030"}}'
# -> {"statusCode":0,"msgDesc":"Connection test successful"}
```
