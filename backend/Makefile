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
		gotestsum --format testname -- ./internal/repository; \
	else \
		echo "gotestsum not installed — falling back to 'go test'. Install: go install gotest.tools/gotestsum@latest"; \
		go test ./internal/repository; \
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

# Clean the binary
clean:
	@echo "Cleaning..."
	@rm -f main

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
