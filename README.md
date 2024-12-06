# Radiant API

[![Go Report Card](https://goreportcard.com/badge/github.com/Ferlab-Ste-Justine/radiant-api)](https://goreportcard.com/report/github.com/Ferlab-Ste-Justine/radiant-api)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)


API for Radiant Data Platform

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 

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

Clean up binary from the last build:
```bash
make clean
```

