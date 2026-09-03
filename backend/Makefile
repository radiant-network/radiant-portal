# Simple Makefile for a Go project

# Build the application
all: build test

install:
	@echo "Installing dependencies..."
	@go mod tidy

build:
	@echo "Building API..."
	@go build -o bin/api/ ./cmd/api/

# Run the application
run:
	@go run ./cmd/api/

build-worker:
	@echo "Building Worker..."
	@go build -o bin/worker/ ./cmd/worker/

# Run the worker
run-worker:
	@go run ./cmd/worker

# radiant-client CLI. Version comes from the git tag (or <sha>-dirty, or dev) and is baked
# in with ldflags, never hardcoded.
CLI_NAME=radiant-client
VERSION?=$(shell git describe --tags --always --dirty 2>/dev/null || echo dev)
COMMIT?=$(shell git rev-parse --short HEAD 2>/dev/null || echo none)
DATE?=$(shell date -u +"%Y-%m-%dT%H:%M:%SZ")
CLI_LDFLAGS=-s -w -X main.version=$(VERSION) -X main.commit=$(COMMIT) -X main.date=$(DATE)
CLI_PLATFORMS=linux/amd64 linux/arm64 darwin/amd64 darwin/arm64 windows/amd64

build-cli:
	@echo "Building $(CLI_NAME) $(VERSION)..."
	@CGO_ENABLED=0 go build -trimpath -ldflags="$(CLI_LDFLAGS)" -o bin/$(CLI_NAME)/ ./cmd/$(CLI_NAME)/

# Cross-compile every platform into dist/ as tar.gz (zip on windows) plus a sha256 manifest.
build-cli-all:
	@rm -rf dist && mkdir -p dist
	@for p in $(CLI_PLATFORMS); do \
		os=$${p%/*}; arch=$${p#*/}; ext=$$([ $$os = windows ] && echo .exe); \
		echo "Building $(CLI_NAME) $(VERSION) for $$os/$$arch..."; \
		CGO_ENABLED=0 GOOS=$$os GOARCH=$$arch go build -trimpath -ldflags="$(CLI_LDFLAGS)" -o dist/$$os-$$arch/$(CLI_NAME)$$ext ./cmd/$(CLI_NAME)/ || exit 1; \
		if [ $$os = windows ]; then \
			(cd dist/$$os-$$arch && zip -q ../$(CLI_NAME)-$$os-$$arch.zip $(CLI_NAME)$$ext); \
		else \
			tar -czf dist/$(CLI_NAME)-$$os-$$arch.tar.gz -C dist/$$os-$$arch $(CLI_NAME); \
		fi; \
		rm -rf dist/$$os-$$arch; \
	done
	@cd dist && sha256sum *.tar.gz *.zip > checksums.txt
	@ls -1 dist

test-cli:
	@go test ./cmd/$(CLI_NAME)/... ./internal/cli/... -count=1

# Create DB container
docker-run:
	@if docker compose -f compose/docker-compose.yml up --build 2>/dev/null; then \
		: ; \
	else \
		echo "Falling back to Docker Compose V1"; \
		docker-compose -f compose/docker-compose.yml up --build; \
	fi

# Shutdown DB container
docker-down:
	@if docker compose -f compose/docker-compose.yml down 2>/dev/null; then \
		: ; \
	else \
		echo "Falling back to Docker Compose V1"; \
		docker-compose -f compose/docker-compose.yml down; \
	fi

# Test the application (readable output via gotestsum, falls back to go test)
test:
	@echo "Testing..."
	@if command -v gotestsum > /dev/null; then \
		gotestsum --format testname -- ./...; \
	else \
		echo "gotestsum not installed — falling back to 'go test'. Install: go install gotest.tools/gotestsum@latest"; \
		go test ./...; \
	fi

# Integrations Tests for the application (readable output via gotestsum, falls back to go test)
itest:
	@echo "Running integration tests..."
	@if command -v gotestsum > /dev/null; then \
		gotestsum --format testname -- ./internal/repository/...; \
	else \
		echo "gotestsum not installed — falling back to 'go test'. Install: go install gotest.tools/gotestsum@latest"; \
		go test ./internal/repository/...; \
	fi

# Format the code (gofmt); the CI golangci-lint job verifies this formatting
fmt:
	@echo "Formatting..."
	@gofmt -w .

# Lint the application (same config and linters as the CI golangci-lint job)
lint:
	@echo "Linting..."
	@if command -v golangci-lint > /dev/null; then \
		golangci-lint run; \
	else \
		echo "golangci-lint is not installed. Install it with:"; \
		echo "  go install github.com/golangci/golangci-lint/v2/cmd/golangci-lint@v2.5.0"; \
		exit 1; \
	fi

# Clean the binaries
clean:
	@echo "Cleaning..."
	@rm -rf main bin dist

# Live Reload
watch:
	@if command -v air > /dev/null; then \
            air; \
            echo "Watching...";\
        else \
            read -p "Go's 'air' is not installed on your machine. Do you want to install it? [Y/n] " choice; \
            if [ "$$choice" != "n" ] && [ "$$choice" != "N" ]; then \
                go install github.com/air-verse/air@latest; \
                air; \
                echo "Watching...";\
            else \
                echo "You chose not to install air. Exiting..."; \
                exit 1; \
            fi; \
        fi

doc:
	@echo "Generating OpenAPI v3.1 documentation..."
	@go run scripts/openapi/generate.go

.PHONY: all build run test clean watch docker-run docker-down itest lint fmt

migrate:
	@echo "Create database migration..."
	@go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate
	@migrate create -ext sql -dir ./scripts/init-sql/migrations -seq "todo"
