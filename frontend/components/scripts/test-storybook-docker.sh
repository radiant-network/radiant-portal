#!/usr/bin/env bash
# Runs the browser Vitest projects with Chromium from the official Playwright image; Vitest stays on the host.
# VITEST_PROJECTS picks the projects (default: storybook and browser). Extra arguments go to Vitest (e.g. --update).
set -euo pipefail

cd "$(dirname "$0")/.."

PW_VERSION=$(node -p "require('playwright/package.json').version")
PW_PORT=${PW_PORT:-3000}
CONTAINER=radiant-storybook-playwright

docker rm -f "$CONTAINER" >/dev/null 2>&1 || true
docker run -d --rm --name "$CONTAINER" --network host --init --ipc=host \
  "mcr.microsoft.com/playwright:v${PW_VERSION}-noble" \
  npx -y "playwright@${PW_VERSION}" run-server --port "$PW_PORT" --host 127.0.0.1 >/dev/null
trap 'docker rm -f "$CONTAINER" >/dev/null 2>&1 || true' EXIT

for _ in $(seq 1 60); do
  docker logs "$CONTAINER" 2>&1 | grep -q "Listening on" && break
  sleep 1
done

PROJECT_ARGS=()
for project in ${VITEST_PROJECTS:-storybook browser}; do
  PROJECT_ARGS+=(--project "$project")
done

PW_WS_ENDPOINT="ws://127.0.0.1:${PW_PORT}/" THEME=radiant npx vitest run "${PROJECT_ARGS[@]}" "$@"
