#!/usr/bin/env bash
# The daily scan: new CVEs on images that did not change. Scans what QA runs (the tag Flux picks), no build.
set -euo pipefail
cd "$(dirname "$0")/.."
registry=${REGISTRY:-localhost:5002/radiant-network}
while read -r _ image libsev ignore; do
  tag=$(scripts/tags.sh "$image" --names | grep -E '^[a-fA-F0-9]+-' \
    | awk -F- '{print $NF, $0}' | sort -n | tail -1 | cut -d' ' -f2)
  scripts/trivy.sh image "$image" "$registry/$image:$tag" "$libsev" "$ignore"
done <<<"$(scripts/images.sh)"
