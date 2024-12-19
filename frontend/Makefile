# Project variables
DOCKER_IMAGE_PREFIX := portal
PORTALS := radiant:8080 include:8081 
PORTALS_PATH := ./portals

# Default help target
.PHONY: help
help:
	@echo "Available commands:"
	@echo "  make build-all      - Build all portal Docker images."
	@echo "  make run-all        - Run all portals with specified ports."
	@echo "  make build-<portal> - Build a specific portal (e.g., build-radiant-portal)."
	@echo "  make run-<portal>   - Run a specific portal with its port (e.g., run-radiant-portal)."

# Rules to build all portals
.PHONY: build-all
build-all: $(addprefix build-, $(subst :, ,$(PORTALS)))

.PHONY: run-all
run-all: $(addprefix run-, $(subst :, ,$(PORTALS)))

# Extract portal name and port from PORTALS
define get_portal_port
$(shell echo $(1) | cut -d':' -f2)
endef

define get_portal_name
$(shell echo $(1) | cut -d':' -f1)
endef

# Build a specific portal
.PHONY: $(addprefix build-, $(subst :, ,$(PORTALS)))
$(addprefix build-, $(subst :, ,$(PORTALS))): build-%:
	$(eval PORTAL := $(subst build-,,$@))  # Remove 'build-' prefix
	@echo "Building Docker image for portal: $(PORTAL)"
	docker build --progress=plain --no-cache -t $(DOCKER_IMAGE_PREFIX)-$(PORTAL) -f $(PORTALS_PATH)/$(PORTAL)/Dockerfile .

# Run a specific portal
.PHONY: $(addprefix run-, $(subst :, ,$(PORTALS)))
$(addprefix run-, $(subst :, ,$(PORTALS))): run-%:
	$(eval PORTAL := $(subst run-,,$@))  # Remove 'run-' prefix
	$(eval PORTAL_PORT := $(call get_portal_port,$(filter $(PORTAL):%,$(PORTALS))))
	@echo "Running portal: $(PORTAL) on port $(PORTAL_PORT)"
	docker run --rm -p $(PORTAL_PORT):80 $(DOCKER_IMAGE_PREFIX)-$(PORTAL)

