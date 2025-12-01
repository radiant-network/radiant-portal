---
sidebar_position: 0
---

# API Clients

We generate two types of API clients to support different development environments:

## TypeScript Client

- **Generator:** `typescript-axios`
- **Purpose:** For frontend applications built with TypeScript and React.
- **Location:** `frontend/api`

## Python Client

- **Generator:** `python`
- **Purpose:** For backend services or CLI tools written in Python.
- **Location:** `cli/python`

Both clients are generated from the same OpenAPI specification (`swagger.yaml`) to ensure consistency across platforms.

## Generation Process

The clients are generated automatically using the following Makefile targets:

- `generate-cli-python`: Generates the Python client.
- `generate-cli-typescript`: Generates the TypeScript client.

Refer to the Makefile for details on the generation commands.
