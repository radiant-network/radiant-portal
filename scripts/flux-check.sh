#!/usr/bin/env bash
# What the QA Flux ImagePolicy would pick for each image (qlin-qa-infra/kubernetes-manifests/fluxcd/*.yml):
#   filterTags.pattern '^[a-fA-F0-9]+-(?P<ts>.*)', extract $ts, numerical asc -> highest timestamp.
set -euo pipefail
cd "$(dirname "$0")/.."
registry=${REGISTRY:-localhost:5002/radiant-network}
while read -r _ image _; do
  pick=$(scripts/tags.sh "$image" --names | grep -E '^[a-fA-F0-9]+-' \
    | awk -F- '{print $NF, $0}' | sort -n | tail -1 | cut -d' ' -f2)
  printf '%-24s %s\n' "$image" "${pick:0:7}…-${pick##*-}"
done <<<"$(scripts/images.sh)"
