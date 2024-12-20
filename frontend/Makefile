# Project variables
DOCKER_IMAGE_PREFIX := portal
PORTALS := radiant:8080 include:8081 
PORTALS_PATH := ./portals

# Default help target
.PHONY: help
help:
	@echo "Available commands:"
	@echo "  make docker-build-all      - Build all portal Docker images."
	@echo "  make docker-run-all        - Run all portals with specified ports."
	@echo "  make docker-build-<portal> - Build a specific portal (e.g., build-radiant-portal)."
	@echo "  make docker-run-<portal>   - Run a specific portal with its port (e.g., run-radiant-portal)."

# Rules to build all portals
.PHONY: build-all
build-all: $(addprefix docker-build-, $(subst :, ,$(PORTALS)))

.PHONY: run-all
run-all: $(addprefix docker-run-, $(subst :, ,$(PORTALS)))

# Extract portal name and port from PORTALS
define get_portal_port
$(shell echo $(1) | cut -d':' -f2)
endef

define get_portal_name
$(shell echo $(1) | cut -d':' -f1)
endef

# Build a specific portal
.PHONY: $(addprefix docker-build-, $(subst :, ,$(PORTALS)))
$(addprefix docker-build-, $(subst :, ,$(PORTALS))): docker-build-%:
	$(eval PORTAL := $(subst docker-build-,,$@))  # Remove 'build-' prefix
	@echo "Building Docker image for portal: $(PORTAL)"
	docker build --progress=plain --no-cache -t $(DOCKER_IMAGE_PREFIX)-$(PORTAL) -f $(PORTALS_PATH)/$(PORTAL)/Dockerfile .

# Run a specific portal
.PHONY: $(addprefix docker-run-, $(subst :, ,$(PORTALS)))
$(addprefix docker-run-, $(subst :, ,$(PORTALS))): docker-run-%:
	$(eval PORTAL := $(subst docker-run-,,$@))  # Remove 'run-' prefix
	$(eval PORTAL_PORT := $(call get_portal_port,$(filter $(PORTAL):%,$(PORTALS))))
	@echo "Running portal: $(PORTAL) on port $(PORTAL_PORT)"
	docker run --rm -p $(PORTAL_PORT):80 $(DOCKER_IMAGE_PREFIX)-$(PORTAL)

