# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Radiant Portal — a medical/genomic data platform. Monorepo containing a Go REST API backend, a React/TypeScript frontend monorepo, Cypress e2e tests, a Docusaurus documentation site, and design assets.

## Repository Layout

```
backend/      # Go REST API + async batch worker
frontend/     # React 19 monorepo (apps, components, portals, themes, translations)
cypress/      # End-to-end tests (Cypress + POM pattern)
docs/         # Docusaurus public documentation site
design/       # Design assets
cli/          # Code generation utilities (Python client)
postman/      # Postman API collections
Makefile      # API client generation from OpenAPI spec
```

Each major subdirectory has its own `CLAUDE.md` or `README.md` with details. Start there for subsystem-specific guidance:
- **Backend**: `backend/CLAUDE.md`
- **Frontend**: `frontend/CLAUDE.md`

## Cross-Cutting Commands

### API Client Generation

The TypeScript frontend client and the Python CLI client are generated from the backend's OpenAPI spec (`backend/docs/swagger.yaml`). Run from repo root after backend API changes:

```bash
make generate-client-typescript   # Regenerates frontend/api/
make generate-client-python       # Regenerates cli/python/
make generate-client-all          # Both
```

Requires `openapi-generator-cli` installed globally.

### Code Formatting

Prettier config is at root `.prettierrc.json` and applies across the whole repo.

```bash
# From repo root (cypress formatting)
npm run format:cypress        # Format cypress/ code
npm run format:cypress:check  # Check formatting without writing
npm run type-check:cypress    # TypeScript check on cypress/
```

### Commit Convention

All commits must follow conventional commit format enforced by CommitLint + Husky:
```
type(scope): SJRA-### message
```

## Architecture

### Backend ↔ Frontend Integration

The backend exposes a REST API documented with Swagger (swaggo). The OpenAPI spec at `backend/docs/swagger.yaml` is the source of truth for the `frontend/api/` client (auto-generated, never edit manually) and `cli/python/`.

Workflow when adding or modifying an API endpoint:
1. Add/update handler + Swagger annotations in `backend/`
2. Run `make doc` (inside `backend/`) to regenerate `backend/docs/swagger.yaml`
3. Run `make generate-client-typescript` from repo root to update `frontend/api/`
4. Use the updated client in the frontend

### Multi-Portal Build

The frontend supports multiple portal builds (e.g., `radiant`, `kf`) from a single codebase. The `THEME` environment variable at build time selects the portal. Portal-specific assets live in `frontend/themes/{portal}/` and translations in `frontend/translations/portals/{portal}/`.

### Authorization

The backend supports two authorization providers selected by `RADIANT_AUTHORIZATION_PROVIDER`:
- `keycloak` (default) — RBAC via JWT claims
- `openfga` — fine-grained access control

Both the frontend (Keycloak OAuth2 via `remix-auth`) and backend must be pointed at the same Keycloak realm.

### End-to-End Tests (Cypress)

Tests in `cypress/` run against a live QA environment:
- **API base**: `https://radiant-api.qa.juno.cqdg.ferlab.bio/`
- **Auth**: Keycloak QA at `https://auth.qa.juno.cqdg.ferlab.bio`
- **Pattern**: Page Object Model (`cypress/pom/pages/`)
- **Categories**: `Connexion`, `Cases`, `CaseEntity`, `VariantEntity`, `Files`
- **API tests**: `cypress/api/` with request/response fixtures

### Documentation Site

`docs/` is a Docusaurus site deployed to GitHub Pages at `https://radiant-network.github.io/radiant-portal/`. The Storybook component library is also deployed there at `/storybook`.

## Local Development Setup

### Backend (Go)

```bash
cd backend
make docker-run    # Start StarRocks, PostgreSQL, Keycloak, MinIO
make run           # Run API server on port 8090
```

See `backend/CLAUDE.md` for full details.

### Frontend (React)

```bash
cd frontend
npm install
cd portals/radiant
npm run dev:radiant   # Dev server on port 3000
```

See `frontend/CLAUDE.md` for full details.

### GitHub Workflows

- `backend.yml` — Backend CI (test + build)
- `build_and_push.yml` — Docker image build and registry push (multi-portal)
- `storybook.yml` — Storybook build and GitHub Pages deployment
