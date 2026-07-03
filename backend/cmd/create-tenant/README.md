# create-tenant

A control-plane CLI that onboards a tenant across the three systems that hold
multi-tenant state — **PostgreSQL**, **StarRocks**, and **Apache Ranger**.

It is an administrative tool, run as a one-off (locally, or as a deploy/ops task),
**not** part of the request-serving API. Everything it does is idempotent: re-running
converges and never clobbers existing state.

To re-apply a tenant's StarRocks views and Ranger masking policies after a schema or
policy change, use the separate [`refresh-tenants`](../refresh-tenants) command.

## Usage

```bash
# Create (or converge) a tenant — PostgreSQL + StarRocks + Ranger
go run ./cmd/create-tenant -code demo -name "Demo Hospital"

# Print the plan without touching anything
go run ./cmd/create-tenant -code demo -name "Demo Hospital" -dry-run
```

## What "create" does

Three ordered phases (order matters — each builds on the previous):

### 1. PostgreSQL — the source of truth
- Inserts the `tenant` row.
- Seeds the tenant's default role catalog (`member`, `geneticist`, `data_manager`)
  and their `role_action` mappings. This is the runtime equivalent of migration
  `000012`, parameterized by tenant code. Tenants can edit their roles afterward.

### 2. StarRocks — the per-tenant view layer
- Ensures the shared `auth.pii_grant` view (the PII-masking source, global — not
  tenant-specific).
- Creates the tenant database **`<code>_tenant`** (e.g. `demo` → `demo_tenant`).
- Creates one view per federated clinical table over the `radiant_jdbc` federation,
  filtered to the tenant: `… FROM radiant_jdbc.public.<table> WHERE tenant_code = '<code>'`.

How the views are built:
- **Columns are introspected from `information_schema`**, excluding types the
  StarRocks JDBC catalog can't map (`jsonb`, `uuid`, `json`). `SELECT *` would fail on
  those, so the view projects an explicit, federatable column list. This stays correct
  as the schema evolves — re-running picks up new supported columns.
- **Special-behaviour tables use a SQL template** in [`views/`](../../internal/repository/views)
  (embedded via `//go:embed`). A table with a `views/<table>.sql.tmpl` is rendered from
  it; everything else gets a generated `SELECT`. Today `patient` has a template (it adds
  the `can_read_pii` masking flag); add a new `views/<table>.sql.tmpl` to give any other
  table custom SQL — no code change needed.
- The view set is the tenant-scoped tables the API reads through federation. Tables that
  are tenant-scoped but **not** federated (`batch`, `user_set`) are intentionally
  excluded — the API never reads them via StarRocks.

> **Note:** a StarRocks view is not a Ranger access boundary. The views provide
> per-tenant ergonomics and column masking; tenant *isolation* comes from the
> database-level access policy plus per-tenant base data.

### 3. Ranger — the access gate + PII masking
- Ensures the Ranger role `<code>_user`.
- Ensures the access policy `sr_access_<code>` granting `<code>_user` `SELECT` on
  `<code>_tenant.*`.
- Bootstraps the global PII-masking policies (idempotent, tenant-independent): the
  `user_role` masking-subject marker, `SELECT` + row-filter on `auth.pii_grant`, and the
  `patient` column masks (`sr_mask_pii_redact`, `sr_mask_dob`) over `*_tenant`.
- Nests `<code>_user` under `user_role` so the tenant's members are masking subjects.

Role *membership* is not managed here — it's owned by the user-provisioning flow
(`cmd/createuser`). `create-tenant` only creates the empty role, the policies, and the
role nesting.

## Configuration

Reads the same environment as the API (loaded from `.env` via `godotenv`):

| Vars | System |
|------|--------|
| `DB_HOST` / `DB_PORT` / `DB_NAME` / `DB_USERNAME` / `DB_PASSWORD` / `DB_SSL_MODE` | StarRocks (privileged / `root`) |
| `PGHOST` / `PGPORT` / `PGDATABASE` / `PGUSER` / `PGPASSWORD` / `PGSSLMODE` | PostgreSQL |
| `RANGER_URL` / `RANGER_ADMIN_USER` / `RANGER_ADMIN_PASSWORD` | Ranger |

Against the local `compose` stack, set `DB_SSL_MODE=skip-verify` (StarRocks runs with
TLS enabled).

## Tenant code

The code must match `^[a-z][a-z0-9_]{0,48}[a-z0-9]$` (lowercase letter first, then
lowercase/digits/underscore). This is also the injection guard for the DDL, which
cannot use bound parameters — keep it strict.

## Verifying

```bash
# StarRocks: database + views
mysql -h127.0.0.1 -P9030 -uroot -e "SHOW DATABASES LIKE 'demo_tenant'; SHOW TABLES FROM demo_tenant;"

# PostgreSQL: tenant row + seeded roles
psql -h localhost -U radiant -d radiant -c \
  "SELECT code, name FROM tenant WHERE code='demo';
   SELECT role_code, action_code FROM role_action WHERE tenant_code='demo' ORDER BY 1,2;"

# Ranger: role + access policy
curl -s -u admin:<pw> "$RANGER_URL/service/roles/roles/name/demo_user"
curl -s -u admin:<pw> "$RANGER_URL/service/public/v2/api/service/starrocks/policy/sr_access_demo"
```

## Known limitations

- **The API does not yet read these views.** It still queries `radiant_jdbc.public.*`
  directly; switching it to `<code>_tenant.*` is a separate refactor. Until then the
  views and Ranger policies are infrastructure ahead of their consumer.
- **Ranger access policies are inert against views** (StarRocks issue
  [#72910](https://github.com/StarRocks/starrocks/issues/72910): authorization is
  bypassed for views). The policy is created correctly, but real access isolation
  requires base/native tables.
