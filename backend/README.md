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

Once created, assign the role `api` and a password in`credentials` tab.

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

## Generate the CLI
    
    ```bash 

    openapi-generator-cli generate -i ./backend/docs/swagger.yaml -g typescript-axios -o ./frontend/api

    ```

# Dev local

## Prerequisites

- Docker in recent version (28.1.1 for instance)
- Docker compose in recent version (v2.36.0 for instance)

## Run backend stack

```bash
docker compose up
```

## Run frontend

Then use this .env in front-end
```
KEYCLOAK_REALM=CQDG
KEYCLOAK_HOST=http:localhost:8080
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