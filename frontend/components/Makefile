# Project Makefile

# Default shell
SHELL := /bin/bash

# Check if the first argument is shadcn-add
ifneq (shadcn-add,$(firstword $(MAKECMDGOALS)))
$(firstword $(MAKECMDGOALS)):
	@:
endif

# Capture the component name for shadcn-add
COMPONENT := $(wordlist 2,2,$(MAKECMDGOALS))

# Catch-all target to prevent errors
%:
	@:

# Shadcn UI Component Installation
shadcn-add:
ifndef COMPONENT
	@echo "Usage: make shadcn-add button"
	@echo "Available components can be found at: https://ui.shadcn.com/docs/components"
	exit 1
endif
	@echo "Adding Shadcn UI Component: $(COMPONENT)"
	@npx shadcn@latest add $(COMPONENT)
	@echo "✅ Shadcn UI $(COMPONENT) component added successfully!"

# Development server
dev:
	@echo "Starting development server..."
	@npm run dev

# Production build
build:
	@echo "Creating production build..."
	@npm run build

# Clean build directory
clean:
	@echo "Cleaning build directory..."
	@rm -rf dist

# Install dependencies
install:
	@echo "Installing project dependencies..."
	@npm install

.PHONY: shadcn-add dev build preview clean install setup
