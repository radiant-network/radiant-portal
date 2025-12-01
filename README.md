# Radiant Portal

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/license/apache-2-0)
[![Build Status](https://github.com/radiant-network/radiant-portal/actions/workflows/build_and_push.yml/badge.svg)](https://github.com/radiant-network/radiant-portal/actions/workflows/build_and_push.yml)
[![Build Storybook](https://github.com/radiant-network/radiant-portal/actions/workflows/storybook.yml/badge.svg)](https://github.com/radiant-network/radiant-portal/actions/workflows/storybook.yml)

Radiant Data Platform

# Links

- [Radiant Portal](https://portal.radiant.ferlab.bio/)
- [Documentation](https://radiant-network.github.io/radiant-portal/)
- [Storybook](https://radiant-network.github.io/radiant-portal/storybook)

# Backend

[Backend Documentation](./backend/README.md)

# Frontend

[Frontend Documentation](./frontend/README.md)

# Development

## Generating clients

We currently support two types of clients for the Radiant Portal backend API:

- Typescript
- Python

These can be generated from using the Makefile targets below:

```bash
make generate-client-typescript
make generate-client-python
```

Or to generate both at once:

```bash
make generate-client-all
```