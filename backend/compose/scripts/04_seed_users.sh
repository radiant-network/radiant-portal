#!/bin/bash
# =============================================================================
# 04_seed_users.sh — provision the demo regular users (alice/bob/wendy) end-to-end
# across Keycloak + Postgres + Ranger + StarRocks by driving the `cmd/createuser`
# Go tool once per user. Each user is keyed on its Keycloak `sub` (see the
# "Identity bridge" section of README.md).
#
#     ./04_seed_users.sh
#
# Run after the scaffolding scripts (01_seed_postgres.sql, 02_starrocks_*.sql,
# 03_ranger_policies.py) and against a running backend/compose stack. Every step
# is idempotent, so re-running converges. The grants mirror the "Demo users"
# table in README.md:
#
#     alice  tenant_a / ORG_A1 / geneticist
#     bob    tenant_b / ORG_B1 / geneticist
#     wendy  tenant_a / *      / geneticist   (all tenant_a orgs)
#
# All three share USER_PASSWORD (default radiant123!), the password the rest of
# the demo (README, starrocks-connect.sh) authenticates the JWT users with.
#
# cmd/createuser reads all its connection settings from the environment. Unlike
# docker-compose.yml (which uses the in-container hostnames `starrocks`/`postgres`
# and the StarRocks TLS cert), this script runs on the host and reaches the stack
# on its published ports — so it sets the host equivalents below. Every var is
# overridable (`${VAR:-default}`). The StarRocks CREATE USER needs admin rights,
# so we connect as `root` (no password on the allin1 image), not svc_admin_api.
# Keycloak / Ranger / StarRocks-JWT settings are intentionally left unset: the
# tool already defaults them to the compose stack (and the SR_JWT_* values must
# stay at the in-container defaults baked into each StarRocks user definition).
# =============================================================================

set -euo pipefail

# Run from backend/ so `go run ./cmd/createuser` resolves.
cd "$(dirname "${BASH_SOURCE[0]}")/../.."

export USER_PASSWORD="${USER_PASSWORD:-radiant123!}"

# StarRocks (MySQL protocol) — host-published port, TLS without cert validation.
export DB_HOST="${DB_HOST:-127.0.0.1}"
export DB_PORT="${DB_PORT:-9030}"
export DB_NAME="${DB_NAME:-test_db}"
export DB_USERNAME="${DB_USERNAME:-root}"
export DB_PASSWORD="${DB_PASSWORD:-}"
export DB_SSL_MODE="${DB_SSL_MODE:-skip-verify}"

# Postgres (auth model).
export PGHOST="${PGHOST:-localhost}"
export PGPORT="${PGPORT:-5432}"
export PGDATABASE="${PGDATABASE:-radiant}"
export PGUSER="${PGUSER:-radiant}"
export PGPASSWORD="${PGPASSWORD:-radiant}"
export STARROCKS_JWT_JWKS_URL=http://keycloak:8080/realms/CQDG/protocol/openid-connect/certs
export STARROCKS_JWT_REQUIRED_ISSUER=http://localhost:8080/realms/CQDG
export STARROCKS_JWT_REQUIRED_AUDIENCE=radiant

# Admin API auth is the CQDG-realm service account (radiant-admin-cli) seeded by
# scripts/init-keycloak/cqdg.json — a client_credentials grant, not a human admin,
# so it is not blocked by OTP the way the old ROPC (kcadmin) flow was.
export KEYCLOAK_HOST=http://localhost:8080
export KEYCLOAK_REALM=CQDG
export KEYCLOAK_ADMIN_CLIENT_ID=radiant-admin-cli
export KEYCLOAK_ADMIN_CLIENT_SECRET=radiant-admin-secret

export RANGER_URL=http://localhost:6080
export RANGER_ADMIN_USER=admin
export RANGER_ADMIN_PASSWORD=rangerR0cks!

go run ./cmd/createuser -email alice@demo.org -first Alice -last Demo \
  -grant tenant_a:ORG_A1:geneticist

go run ./cmd/createuser -email bob@demo.org -first Bob -last Demo \
  -grant tenant_b:ORG_B1:geneticist

go run ./cmd/createuser -email wendy@demo.org -first Wendy -last Demo \
  -grant tenant_a:*:geneticist
