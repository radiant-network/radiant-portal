#!/usr/bin/env bash
# The PR check: build the images the PR affects (no push) and scan them; fail on a fixable CRITICAL.
#   pr-check.sh <base>        (working tree = the PR head)
set -euo pipefail
cd "$(dirname "$0")/.."
registry=${REGISTRY:-localhost:5002/radiant-network}
head=$(git rev-parse --short=7 HEAD)
affected=$(moon query changed-files --base "$1" --head "$head" </dev/null \
  | moon query tasks --affected \
  | jq -r '.tasks | to_entries[] | .key as $p | .value | keys[] | select(startswith("docker-")) | "\($p):\(.)"')

scripts/trivy.sh config
[[ -z $affected ]] && { echo "no image affected: nothing to build or scan"; exit 0; }
echo "== build ($(wc -w <<<"$affected" | tr -d ' ') images, not pushed)"
# shellcheck disable=SC2086
PUSH=0 moon run $affected </dev/null 2>&1 | grep -E 'built|×'
echo "== trivy (gate: fixable CRITICAL)"
rc=0
while read -r target image libsev ignore; do
  grep -qx "$target" <<<"$affected" || continue
  LOCAL=1 GATE=1 scripts/trivy.sh image "$image" "$registry/$image:sha-$head" "$libsev" "$ignore" || rc=1
done <<<"$(scripts/images.sh)"
exit $rc
