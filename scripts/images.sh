#!/usr/bin/env bash
# "<moon target> <image> <library severity> <trivy ignore file>" for every docker-* task.
cd "$(dirname "$0")/.."
moon query tasks 'taskTag=docker' </dev/null \
  | jq -r '.tasks[][] | "\(.target) \(.args[0]) \(.env.TRIVY_LIBRARY_SEVERITY // "HIGH,CRITICAL") \(.env.TRIVY_IGNOREFILE // "")"' | sort
