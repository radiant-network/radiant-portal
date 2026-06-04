#!/bin/bash

# Licensed to the Apache Software Foundation (ASF) under one or more
# contributor license agreements.  See the NOTICE file distributed with
# this work for additional information regarding copyright ownership.
# The ASF licenses this file to You under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with
# the License.  You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

#
# Dual-mode entrypoint for the production Apache Ranger image.
#
#   migrate  render install.properties from env, run setup.sh (schema only), exit 0.
#            Use as a gated/run-once k8s Job before rolling out serve pods.
#   serve    render install.properties, run setup.sh (idempotent; also regenerates
#            ranger-admin-site.xml in this pod's filesystem), start the admin, then (unless
#            RANGER_REGISTER_ON_SERVE=false) apply any mounted service-defs/services, and stay alive.
#   register apply service-def / service JSON to a RUNNING admin (no DB setup, no server).
#            Use as a one-shot k8s Job after the serve Deployment is healthy. See register-services.py.
#   <other>  exec the given command (escape hatch / debugging).
#
# setup.sh reads ${RANGER_ADMIN_CONF:-$PWD}/install.properties; it is invoked after cd into the admin
# dir, so it reads ${RANGER_HOME}/admin/install.properties -- which is exactly where we render it.

set -euo pipefail

MODE="${1:-serve}"
ADMIN_DIR="${RANGER_HOME}/admin"
TEMPLATE="${RANGER_SCRIPTS}/install.properties.tpl"

# StarRocks knobs -> ${RANGER_*} placeholders that register-services.py substitutes into the baked
# service-def / service JSON before parsing. Resolved here (all modes) so they're set before any
# registration runs.
#   RANGER_STARROCKS_SERVICE_NAME  -> starrocks-service.json "name" (default starrocks)
#   RANGER_STARROCKS_AUTOCOMPLETE  -> "yes" enables the StarRocks plugin implClass (UI Test Connection /
#                                     resource autocomplete); anything else leaves implClass empty so
#                                     Ranger falls back to the base class with no connection probing.
: "${RANGER_STARROCKS_SERVICE_NAME:=starrocks}"
export RANGER_STARROCKS_SERVICE_NAME
case "${RANGER_STARROCKS_AUTOCOMPLETE:-yes}" in
  yes) export RANGER_STARROCKS_IMPL_CLASS="org.apache.ranger.services.starrocks.RangerServiceStarRocks" ;;
  *)   export RANGER_STARROCKS_IMPL_CLASS="" ;;
esac

# External base URL the admin advertises (rendered into install.properties -> ranger-admin-site.xml);
# NOT the bind address. Default suits local dev; set to the real reachable URL (k8s service / ingress)
# in production. Defaulted here so the ${...} placeholder always resolves during render.
: "${RANGER_POLICYMGR_EXTERNAL_URL:=http://localhost:6080}"
export RANGER_POLICYMGR_EXTERNAL_URL

# Render the template, substituting ONLY our RANGER_* placeholders. Shell tokens that setup.sh must
# evaluate itself (e.g. XAPOLICYMGR_DIR=$PWD, LOGFILES="$LOGFILE") are left untouched -- this mirrors
# the stock ranger.sh, which copies the template verbatim. The base image has python3 but no envsubst.
render_props() {
  python3 - "${TEMPLATE}" "${ADMIN_DIR}/install.properties" <<'PY'
import os, sys
from string import Template
with open(sys.argv[1]) as fh:
    text = fh.read()
keys = {k: v for k, v in os.environ.items() if k.startswith("RANGER_")}
with open(sys.argv[2], "w") as fh:
    fh.write(Template(text).safe_substitute(keys))
PY
}

run_setup() {
  render_props
  cd "${ADMIN_DIR}"
  ./setup.sh
}

start_admin() {
  cd "${ADMIN_DIR}"
  ./ews/ranger-admin-services.sh start
}

# Wait for the local admin to accept authenticated REST calls, then apply mounted service-defs/services
# (register-services.py is a no-op when nothing is mounted). Used by serve mode only; non-fatal.
register_on_serve() {
  local user="${RANGER_ADMIN_USER:-admin}"
  local probe="http://localhost:6080/service/public/v2/api/servicedef"
  local retries="${RANGER_ADMIN_WAIT_RETRIES:-60}"
  local interval="${RANGER_ADMIN_WAIT_INTERVAL:-3}"
  echo "[entrypoint] waiting for local admin REST before registering services..."
  local i
  for i in $(seq 1 "${retries}"); do
    if curl -sf -o /dev/null -u "${user}:${RANGER_ADMIN_PASSWORD:-}" "${probe}"; then
      python3 "${RANGER_SCRIPTS}/register-services.py"
      return $?
    fi
    sleep "${interval}"
  done
  echo "[entrypoint] admin not ready after $((retries * interval))s; skipping service registration" >&2
  return 1
}

case "${MODE}" in
  migrate)
    run_setup
    echo "[entrypoint] migrate complete"
    ;;
  register)
    # Pure REST client against a running admin -- no install.properties / setup.sh / server.
    python3 "${RANGER_SCRIPTS}/register-services.py"
    ;;
  serve)
    run_setup
    start_admin
    if [ "${RANGER_REGISTER_ON_SERVE:-true}" = "true" ]; then
      register_on_serve || echo "[entrypoint] service registration skipped/failed (non-fatal)" >&2
    fi
    # Keep the container alive, tied to the embedded Tomcat process.
    pid="$(pgrep -f 'org.apache.ranger.server.tomcat.EmbeddedServer' || true)"
    if [ -n "${pid}" ]; then
      tail --pid="${pid}" -f /dev/null
    else
      echo "[entrypoint] Ranger Admin process not found -- it likely failed to start" >&2
      exit 1
    fi
    ;;
  *)
    exec "$@"
    ;;
esac
