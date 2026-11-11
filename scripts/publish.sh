#!/usr/bin/env bash
# What the publish workflow does on every push to main.
#   publish.sh <base> <head>   build+push the affected images, retag the others sha-<base> -> sha-<head>
#   publish.sh --all           build+push everything (bootstrap, weekly base-image refresh)
# The working tree must be at <head>.
set -euo pipefail
cd "$(dirname "$0")/.."
registry=${REGISTRY:-localhost:5002/radiant-network}
head=$(git rev-parse --short=7 HEAD)
images=$(scripts/images.sh)

if [[ $1 == --all ]]; then
  affected=$(cut -d' ' -f1 <<<"$images")
else
  base=$(git rev-parse --short=7 "$1")
  [[ $(git rev-parse --short=7 "$2") == "$head" ]] || { echo "check out $2 first" >&2; exit 1; }
  affected=$(moon query changed-files --base "$base" --head "$head" </dev/null \
    | moon query tasks --affected \
    | jq -r '.tasks | to_entries[] | .key as $p | .value | keys[] | select(startswith("docker-")) | "\($p):\(.)"')
fi

echo "== build ($(wc -w <<<"$affected" | tr -d ' ') images)"
# shellcheck disable=SC2086
[[ -n $affected ]] && PUSH=1 moon run $affected </dev/null 2>&1 | grep -E 'built|pushed|×'

echo "== trivy (the pushed images; the retagged ones have the same digest, already scanned)"
while read -r target image libsev ignore; do
  grep -qx "$target" <<<"$affected" || continue
  scripts/trivy.sh image "$image" "$registry/$image:sha-$head" "$libsev" "$ignore"
done <<<"$images"

echo "== retag (registry-side, same digest, no <sha>-<ts> tag so Flux ignores it)"
while read -r target image _; do
  grep -qx "$target" <<<"$affected" && continue
  docker buildx imagetools create -t "$registry/$image:sha-$head" "$registry/$image:sha-$base" 2>/dev/null
  echo "retag  $image  sha-$base -> sha-$head"
done <<<"$images"
