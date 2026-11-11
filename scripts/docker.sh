#!/usr/bin/env bash
# Build one image and (PUSH=1) publish it. Called by every moon `docker-*` task.
#   docker.sh <image> <dockerfile> <context>
# Tags of a built image (same as docker/metadata-action today):
#   sha-<short>         every commit of main has the full set (scripts/publish.sh retags the others)
#   <sha>-<timestamp>   only on built images: this is what the Flux ImagePolicy deploys in QA
#   latest
set -euo pipefail
image=$1 dockerfile=$2 context=$3
registry=${REGISTRY:-localhost:5002/radiant-network}
sha=$(git rev-parse HEAD)
ref=$registry/$image
tags=("sha-${sha:0:7}" "$sha-$(date +%s)" latest)

# --pull: re-resolve FROM tags (alpine:latest...) like a fresh CI runner, not the local cache.
docker build -q --pull -f "$dockerfile" $(printf -- '-t %s ' "${tags[@]/#/$ref:}") \
  --label org.opencontainers.image.revision="$sha" "$context" >/dev/null
echo "built  $ref ($(docker image inspect -f '{{.Size}}' "$ref:latest" | awk '{printf "%.0f MB", $1/1e6}'))"
if [[ "${PUSH:-0}" == 1 ]]; then
  for t in "${tags[@]}"; do docker push -q "$ref:$t" >/dev/null; done
  echo "pushed $ref:{${tags[*]}}" | tr ' ' ','
fi
