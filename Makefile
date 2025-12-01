.PHONY: generate-client-all

generate-client-python:
	openapi-generator-cli generate -i ./backend/docs/swagger.yaml -g python -o ./cli/python -c cli/python/openapi-config.yaml
	@echo "✅ Generated Python CLI code in ./cli/python\n\n"

generate-client-typescript:
	openapi-generator-cli generate -i ./backend/docs/swagger.yaml -g typescript-axios -o ./frontend/api
	@echo "✅ Generated TypeScript API code in ./frontend/api\n\n"

generate-client-all: generate-client-python generate-client-typescript