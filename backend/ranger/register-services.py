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
# Generic, file-driven Ranger service registration -- run by `ranger-entrypoint.sh register`
# (typically as a one-shot k8s Job, after the admin Deployment is healthy) and by `serve` mode.
#
# Service-defs (the resource "type") and service instances (concrete services of that type) are two
# distinct Ranger objects, so they live in two separate mounted dirs and are applied independently:
#   1. every *.json in RANGER_SERVICEDEF_DIR  -> create_service_def  (e.g. the upstream StarRocks
#      servicedef, conf/ranger/ranger-servicedef-starrocks.json, used verbatim)
#   2. every *.json in RANGER_SERVICE_DIR     -> create_service      (deployment-specific: name/type
#      plus the actual connection configs)
# Both steps are idempotent (GET-before-create). Service-defs come first because an instance
# references its type.
#
# Secrets: before parsing each JSON, ${RANGER_*} placeholders are expanded from the environment
# (string.Template.safe_substitute, same approach as install.properties.tpl). This lets a service
# instance's JDBC url/user/password come from a k8s Secret rather than committed plaintext, e.g.:
#   {"name": "starrocks", "type": "starrocks",
#    "configs": {"jdbc.url": "${RANGER_STARROCKS_JDBC_URL}", "password": "${RANGER_STARROCKS_PASSWORD}"}}
#
# This is the production-generic counterpart to the local-dev create-ranger-services.py (left as-is).

import glob
import json
import os
import sys
from string import Template

from apache_ranger.client.ranger_client import RangerClient
from apache_ranger.model.ranger_service import RangerService
from apache_ranger.model.ranger_service_def import RangerServiceDef

RANGER_ADMIN_URL = os.environ.get('RANGER_ADMIN_URL', 'http://localhost:6080')
RANGER_ADMIN_USER = os.environ.get('RANGER_ADMIN_USER', 'admin')
RANGER_ADMIN_PASSWORD = os.environ.get('RANGER_ADMIN_PASSWORD', '')
RANGER_SERVICEDEF_DIR = os.environ.get('RANGER_SERVICEDEF_DIR', '/ranger/service-defs')
RANGER_SERVICE_DIR = os.environ.get('RANGER_SERVICE_DIR', '/ranger/services')

client = RangerClient(RANGER_ADMIN_URL, (RANGER_ADMIN_USER, RANGER_ADMIN_PASSWORD))

# Only RANGER_*-prefixed env vars are substituted, so shell-style tokens elsewhere are left untouched.
_subst = {k: v for k, v in os.environ.items() if k.startswith('RANGER_')}


def load_json(path):
    with open(path) as fh:
        return json.loads(Template(fh.read()).safe_substitute(_subst))


def missing(getter, name):
    try:
        return getter(name) is None
    except Exception:
        # A non-JSON / 404 response means the object does not exist yet.
        return True


def apply_dir(dir_path, kind, getter, creator, wrap, updater=None):
    files = sorted(glob.glob(os.path.join(dir_path, '*.json')))
    if not files:
        print(f"[register] no {kind} files in {dir_path}")
        return
    for path in files:
        data = load_json(path)
        name = data['name']
        src = os.path.basename(path)
        if missing(getter, name):
            creator(wrap(data))
            print(f"[register] {kind} '{name}' created (from {src})")
        elif updater is not None:
            # Keep the mounted file authoritative for the type schema (e.g. implClass changes).
            updater(name, wrap(data))
            print(f"[register] {kind} '{name}' updated (from {src})")
        else:
            print(f"[register] {kind} '{name}' already exists")


# Service-defs (types) first, then service instances that reference them. Service-defs are
# create-or-update so schema fixes (like a corrected implClass) propagate on the next run; service
# instances are create-only so we never clobber a live service's config or attached policies.
apply_dir(RANGER_SERVICEDEF_DIR, 'service-def', client.get_service_def,
          client.create_service_def, RangerServiceDef, updater=client.update_service_def)
apply_dir(RANGER_SERVICE_DIR, 'service', client.get_service,
          client.create_service, RangerService)

print("[register] done")
sys.exit(0)
