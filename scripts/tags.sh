#!/usr/bin/env bash
# The tags of one image in the registry, with their digest (same digest = same image, nothing rebuilt).
#   tags.sh <image>            e.g. tags.sh radiant-mcp
#   tags.sh <image> --names    tag names only
# Talks to the registry HTTP API (the tour's local registry; ghcr would need a token).
set -euo pipefail
registry=${REGISTRY:-localhost:5002/radiant-network}
host=${registry%%/*} repo=${registry#*/}/$1
names=$(curl -sf "http://$host/v2/$repo/tags/list" | jq -r '.tags // [] | .[]' | sort)
[[ ${2:-} == --names ]] && { echo "$names"; exit 0; }
accept='application/vnd.oci.image.index.v1+json,application/vnd.docker.distribution.manifest.list.v2+json,application/vnd.oci.image.manifest.v1+json,application/vnd.docker.distribution.manifest.v2+json'
for t in $names; do
  d=$(curl -sfI -H "Accept: $accept" "http://$host/v2/$repo/manifests/$t" | tr -d '\r' | awk -F': ' 'tolower($1)=="docker-content-digest"{print $2}')
  printf '%-52s %s\n' "$t" "${d:7:12}"
done
