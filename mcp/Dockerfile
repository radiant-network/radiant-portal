# Build stage - install dependencies
FROM python:3.11-slim AS builder

# Monorepo: built from the repo root (mcp/Dockerfile.dockerignore keeps only mcp/ and clients/python/).
# No git needed any more: the API client is a local path, not a git URL.
# Pinned like the dependencies: the build tool must not float either.
RUN pip install uv==0.11.13

WORKDIR /app
# uv.lock makes every image build reproducible; the client sits where
# [tool.uv.sources] expects it (../clients/python), and --no-editable copies it
# into the venv so the runtime stage does not need the sources.
ENV UV_PROJECT_ENVIRONMENT=/app/.venv
COPY clients/python /clients/python
COPY mcp/pyproject.toml mcp/uv.lock ./
RUN uv sync --frozen --no-dev --no-editable

# Runtime stage - minimal image
FROM python:3.11-slim

RUN apt-get update && apt-get upgrade -y && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*
# The app runs from /app/.venv; the base image's setuptools/wheel are unused and
# carry vendored CVEs (wheel, jaraco.context), so drop them along with pip.
RUN pip uninstall -y setuptools wheel pip
RUN useradd --system --uid 10001 --no-create-home --shell /usr/sbin/nologin app

WORKDIR /app
COPY --from=builder /app/.venv /app/.venv
COPY mcp/server.py .
COPY mcp/radiant_mcp/ radiant_mcp/

ENV PATH="/app/.venv/bin:$PATH"
# Charts (matplotlib): the app user has no home directory for the config and font cache.
ENV MPLCONFIGDIR=/tmp/matplotlib
EXPOSE 8000

USER 10001

CMD ["python", "server.py"]
