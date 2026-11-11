#!/usr/bin/env bash
# Trivy scans with the settings of the three trivy.yml today: HIGH,CRITICAL, unfixed ignored,
# OS and library packages reported separately (the portal's library threshold is per image).
#   trivy.sh image <name> <ref> [library-severity] [ignorefile]
#       <ref> = registry ref (scanned remotely) or a local image (scanned from the Docker daemon)
#   trivy.sh config
# Writes .trivy/<name>-{os,library}.sarif (what upload-sarif would send). GATE=1 exits 1 on a
# fixable CRITICAL (the PR check); otherwise it only reports, like today.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p .trivy
trivy() {
  docker run --rm -v radiant-poc-trivy-cache:/root/.cache/trivy -v /var/run/docker.sock:/var/run/docker.sock \
    -v "$PWD:/src" -w /src aquasec/trivy:0.76.0 "$@"
}
count() { jq -r '[.Results[]?.Vulnerabilities[]?.Severity] | "CRITICAL=\(map(select(.=="CRITICAL"))|length) HIGH=\(map(select(.=="HIGH"))|length)"' "$1"; }

if [[ $1 == config ]]; then
  # Only the tracked Dockerfiles: a CI checkout has no node_modules/.venv, a dev tree has ~1M files.
  rm -rf .trivy/config-src && mkdir -p .trivy/config-src
  git ls-files '*Dockerfile*' ':!:*.dockerignore' | while read -r f; do
    mkdir -p ".trivy/config-src/$(dirname "$f")" && cp "$f" ".trivy/config-src/$f"; done
  trivy config -q --severity HIGH,CRITICAL --format json -o .trivy/config.json .trivy/config-src >/dev/null
  trivy convert -q --format sarif -o .trivy/config.sarif .trivy/config.json
  n=$(jq '[.Results[]?.Misconfigurations[]?] | length' .trivy/config.json)
  echo "config  $n HIGH/CRITICAL misconfigurations"
  jq -r '.Results[]? | select(.Misconfigurations) | .Target as $t | .Misconfigurations[] | "        \($t): \(.ID) \(.Severity) \(.Title)"' .trivy/config.json
  exit 0
fi

name=$2 ref=$3 libsev=${4:-HIGH,CRITICAL} ignore=${5:-}
src=(--image-src docker)
if [[ $ref == localhost:* && ${LOCAL:-0} != 1 ]]; then                  # the tour registry, seen from the Trivy container
  ref=host.docker.internal:${ref#localhost:}
  # Tour images are built for this machine (arm64 on a Mac); in CI they are linux/amd64, the default.
  src=(--image-src remote --insecure --platform "${PLATFORM:-$(docker version -f '{{.Server.Os}}/{{.Server.Arch}}')}")
fi
gate=0
for kind in os library; do
  sev=HIGH,CRITICAL; [[ $kind == library ]] && sev=$libsev
  trivy image -q "${src[@]}" --pkg-types "$kind" --severity "$sev" --ignore-unfixed \
    ${ignore:+--ignorefile "$ignore"} --format json -o ".trivy/$name-$kind.json" "$ref" >/dev/null
  trivy convert -q --format sarif -o ".trivy/$name-$kind.sarif" ".trivy/$name-$kind.json"
  c=$(count ".trivy/$name-$kind.json")
  printf 'trivy  %-22s %-8s %s\n' "$name" "$kind" "$c"
  [[ $c == CRITICAL=0* ]] || gate=1
done
[[ ${GATE:-0} == 1 && $gate == 1 ]] && { echo "trivy  $name: fixable CRITICAL found" >&2; exit 1; }
exit 0
