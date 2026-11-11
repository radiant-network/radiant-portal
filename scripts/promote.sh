#!/usr/bin/env bash
# Release: tag the full image set of a main commit with the version. No rebuild: same digests as in QA.
#   promote.sh <commit> <version>
set -euo pipefail
cd "$(dirname "$0")/.."
registry=${REGISTRY:-localhost:5002/radiant-network}
sha=$(git rev-parse --short=7 "$1") version=$2
while read -r _ image _; do
  docker buildx imagetools create -t "$registry/$image:v$version" -t "$registry/$image:$version" \
    "$registry/$image:sha-$sha" 2>/dev/null
  echo "$image  sha-$sha -> v$version"
done <<<"$(scripts/images.sh)"
