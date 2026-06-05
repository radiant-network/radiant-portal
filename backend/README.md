# Radiant Portal

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/license/apache-2-0)

Radiant Data Platform 

# Backend

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Install swag
Before using `make doc` command:

```
go get github.com/swaggo/swag/v2@v2.0.0-rc4
go install github.com/swaggo/swag/v2/cmd/swag@v2.0.0-rc4
```

### Create keycloak User

Realm settings are imported at start, still a user needs to be created manually in the UI `http://localhost:8080`.

Once created, assign the role `radiant` and a password in`credentials` tab.

## MakeFile

Install all dependencies
```bash
make install
```

Run build make command with tests
```bash
make all
```

Build the application
```bash
make build
```

Run the application
```bash
make run
```

Create DB container
```bash
make docker-run
```

Shutdown DB Container
```bash
make docker-down
```

DB Integrations Test:
```bash
make itest
```

Live reload the application:
```bash
make watch
```

Run the test suite:
```bash
make test
```

Generate OpenAPI v3.1 documentation:
```bash
make doc
```

Clean up binary from the last build:
```bash
make clean
```

# Frontend

Everytime the backend API model changes, the API clients need to be regenerated.

## 1. Install the OpenAPI Generator CLI

To install the CLI: https://github.com/OpenAPITools/openapi-generator?tab=readme-ov-file#1---installation

(If the `openapi-generator-cli version` doesn't match the current version used by the repo, you can set it manually using `openapi-generator-cli version-manager set <version>`.)

## 2. Generating clients

We currently support two types of clients for the Radiant Portal backend API:

- Typescript
- Python

These can be generated from using the root Makefile (`radiant-portal/Makefile`) targets below:

```bash
make generate-client-typescript
make generate-client-python
```

Or to generate both at once:

```bash
make generate-client-all
```

# Dev local

## Prerequisites

- Docker in recent version (28.1.1 for instance)
- Docker compose in recent version (v2.36.0 for instance)

## Run backend stack

```bash
docker compose up
```

### Ranger (StarRocks authorization)

The Apache Ranger image and its Helm chart live in their own repository:
[`radiant-network/ranger-starrocks`](https://github.com/radiant-network/ranger-starrocks).

For local dev you don't need that repo checked out — `backend/ranger-compose.yml` runs the **published**
image (`ghcr.io/radiant-network/ranger-starrocks`) in its three phases (migrate / serve / register), and
`backend/docker-compose.yml` includes it so `docker compose up` brings Ranger up with the rest of the
stack. The admin UI is exposed on http://localhost:6080.

- To test a local or alternate build, override the image: `RANGER_IMAGE=ranger-dual-mode docker compose up`.
- If you don't need Ranger locally, comment out the `include:` at the top of `backend/docker-compose.yml`.

## Run frontend

Then use this .env in front-end
```
KEYCLOAK_REALM=CQDG
KEYCLOAK_HOST=http://localhost:8080
KEYCLOAK_CLIENT=radiant
KEYCLOAK_CLIENT_SECRET=ShutThisIsASecret!
SESSION_SECRET=secret_session
PORTAL_HOST=http://localhost:3000
API_HOST=http://localhost:8090
PORT=3000
```

## Play 

Start the radiant portal and open your browser on http://localhost:3000

Click on Register to create a user, then you're all set