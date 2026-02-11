# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Radiant Data Platform — a bioinformatics portal for genomic data exploration with case management, variant analysis, and query building. Monorepo with a Go backend and a React/TypeScript frontend.

## Build & Run Commands

### Backend (`backend/`)

```bash
cd backend
make install          # go mod tidy
make build            # build API binary to ./bin/api/
make run              # go run ./cmd/api/
make watch            # live reload with air
make docker-run       # start Docker stack (PostgreSQL, Keycloak, StarRocks, API)
make docker-down      # stop Docker stack
make doc              # regenerate OpenAPI spec + OpenFGA model
make migrate          # create new database migration
make build-worker     # build background worker binary
make run-worker       # run background worker
```

### Frontend (`frontend/`)

```bash
cd frontend
npm install                            # install all workspace dependencies
npm run dev:radiant                    # run from frontend/portals/radiant/ (port 3000)
npm run dev:kf                         # run from frontend/portals/radiant/ (KF theme)
npm run build:radiant                  # production build from frontend/portals/radiant/
```

### API Client Generation (root)

```bash
make generate-client-typescript   # regenerate TypeScript Axios client from OpenAPI spec
make generate-client-python       # regenerate Python client from OpenAPI spec
make generate-client-all          # both
```

Regenerate clients whenever backend API models change.

### Full Stack Local Dev

```bash
docker compose up       # starts StarRocks, PostgreSQL, Keycloak, Radiant API
```

Then create a Keycloak user at `http://localhost:8080` (assign `api` role + password). Frontend `.env` for local dev is documented in the root README.

## Testing

### Backend

```bash
cd backend
make test       # runs OpenFGA model tests + go test ./...
make itest      # integration tests only (repository layer, uses testcontainers)
```

Run a single Go test:
```bash
cd backend && go test ./internal/repository -run TestFunctionName
```

### Frontend

```bash
cd frontend
npm test        # runs vitest (all unit tests)
```

Run a single frontend test:
```bash
cd frontend && npx vitest run path/to/file.test.ts
```

### Cypress E2E

Config at `cypress.config.ts`. Tests in `cypress/**/*.cy.ts`. Uses Page Object Model pattern (`cypress/pom/`). Requires env vars for credentials (`CYPRESS_USER_USERNAME`, `CYPRESS_USER_PASSWORD`).

## Linting

```bash
cd frontend
npm run lint          # ESLint
npm run lint:fix      # ESLint with auto-fix
```

Husky + lint-staged runs ESLint `--fix` on staged `*.ts`/`*.tsx` files at commit time.

Key ESLint rules: kebab-case naming enforced, no nested ternaries, unused vars error (prefix with `_` to ignore), max line length 130.

Prettier: single quotes, semicolons, trailing commas, tab width 2, print width 120.

## Architecture

### Backend (Go 1.24, Gin framework)

- **Entry points**: `cmd/api/` (REST API), `cmd/worker/` (background worker)
- **Layered structure** in `internal/`:
  - `server/` — HTTP handlers (`handlers_*.go`), one file per endpoint group
  - `repository/` — data access layer, one file per entity
  - `types/` — domain models and request/response types
  - `authorization/` — OpenFGA-based authorization
  - `database/` — DB connections and migrations
  - `client/` — external API clients
  - `utils/` — helpers (auth, S3 presigning)
- **Databases**: PostgreSQL (transactional), StarRocks (OLAP analytics for variant data)
- **Auth**: Keycloak (identity) + OpenFGA (fine-grained authorization)
- **API docs**: OpenAPI v3.1 generated via swag (`backend/docs/swagger.yaml`)

### Frontend (React 19, TypeScript, Tailwind CSS 4, Vite)

Workspace monorepo — packages import directly from source (no npm publish step).

- **`apps/`** — domain-specific applications (case, variant, file-archive, query-builder-v3, etc.). Each app contains pages and modals for its domain but no navigation or site layout.
- **`components/`** — shared UI library:
  - `base/` — reusable components; `base/ui/` — shadcn/ui primitives (add via `npx shadcn@latest add`)
  - `layout/` — layout components (headers, sidebars)
  - `cores/` — headless logic, models, types
  - `hooks/` — shared React hooks
  - `stories/` — Storybook stories
- **`portals/`** — portal configurations (radiant, kf, include). Each portal is a separate build with its own theme injected at compile time via Vite env (`THEME=radiant`).
- **`themes/`** — per-portal CSS variables, colors, fonts, logos
- **`api/`** — auto-generated TypeScript Axios clients (do not edit manually)

Portal config is set to a global `PROJECT` variable in vite config at compile time, consumed via `@/components/utils/config.ts`.

## Conventions

### Git

- **Branch names**: always include JIRA ticket — `feat/SJRA-000`, `fix/SJRA-000`
- **Commit messages**: `type(subject): SJRA-### description` — squash before merge
  - Examples: `feat(variant): SJRA-123 add filter panel`, `fix(case): SJRA-456 fix pagination`

### Frontend Code

- **File naming**: kebab-case for all files and directories (`user-profile.tsx`, `auth-utils.ts`)
- **Folder names**: plural (`components/`, `utils/`)
- **Component suffixes**: `HomePage`, `DashboardLayout`, `UserProfileCard`
- **Component structure order**: external imports → local imports → hooks → state → derived values → handlers → JSX
- **Tailwind**: compose classes directly in JSX; extract common patterns to style objects when reused
- **Unused variables**: prefix with `_` to satisfy ESLint

### Backend Code

- Test files co-located with source (`handlers_cases_test.go` next to `handlers_cases.go`)
- Repository pattern: one repository per entity with clean separation from handlers
