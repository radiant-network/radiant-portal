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
# install.properties TEMPLATE for the dual-mode production Ranger image.
#
# ranger-entrypoint.sh renders this file to /opt/ranger/admin/install.properties at runtime, expanding
# the ${...} placeholders below from the container environment. setup.sh
# then reads the rendered file. This template carries NO plaintext secrets on purpose: it keeps secrets
# in the env, and it avoids the host-side secret-redaction tool blanking committed values.
#
# NOTE: setup.sh does NOT support trailing inline "#" comments on a value line -- they get parsed as
# part of the value. Keep all explanatory comments on their own lines.

PYTHON_COMMAND_INVOKER=python3
RANGER_ADMIN_LOG_DIR=/var/log/ranger
RANGER_PID_DIR_PATH=/var/run/ranger
DB_FLAVOR=POSTGRES
SQL_CONNECTOR_JAR=/usr/share/java/postgresql.jar
RANGER_ADMIN_LOGBACK_CONF_FILE=/opt/ranger/admin/ews/webapp/WEB-INF/classes/conf/logback.xml

# --- DB connection -------------------------------------------------------------------------------
# setup_mode=SeparateDBA: setup.sh skips dba_script.py (no create-db / create-user). The database and
# the db_user role/grants must be pre-created out of band by a DBA. setup.sh connects as db_user and
# only creates/populates the Ranger TABLES (idempotent).
setup_mode=SeparateDBA

# db_root_* is unused under SeparateDBA (DBA steps are skipped). Kept so this file still works if
# someone flips setup_mode off; point it at the runtime account in that case.
db_root_user=${RANGER_DB_ROOT_USER}
db_root_password=${RANGER_DB_ROOT_PASSWORD}

# db_host: external/managed Postgres endpoint (host[:port]).
db_host=${RANGER_DB_HOST}
db_name=${RANGER_DB_NAME}

# db_user / db_password: runtime account Ranger uses; owns the tables.
db_user=${RANGER_DB_USER}
db_password=${RANGER_DB_PASSWORD}
# -------------------------------------------------------------------------------------------------

postgres_core_file=db/postgres/optimized/current/ranger_core_db_postgres.sql
postgres_audit_file=db/postgres/xa_audit_db_postgres.sql
mysql_core_file=db/mysql/optimized/current/ranger_core_db_mysql.sql
mysql_audit_file=db/mysql/xa_audit_db.sql

# --- Independent account passwords (sourced from the k8s Secret) ----------------------------------
rangerAdmin_password=${RANGER_ADMIN_PASSWORD}
keyadmin_password=${RANGER_KEYADMIN_PASSWORD}
rangerTagsync_password=${RANGER_TAGSYNC_PASSWORD}
rangerUsersync_password=${RANGER_USERSYNC_PASSWORD}
# -------------------------------------------------------------------------------------------------

# Audit shipping is a no-op without a Solr container; admin still boots fine.
audit_store=solr
audit_solr_urls=http://ranger-solr:8983/solr/ranger_audits
audit_solr_collection_name=ranger_audits

# audit_store=elasticsearch
audit_elasticsearch_urls=
audit_elasticsearch_port=9200
audit_elasticsearch_protocol=http
audit_elasticsearch_user=elastic
audit_elasticsearch_password=elasticsearch
audit_elasticsearch_index=ranger_audits
audit_elasticsearch_bootstrap_enabled=true

policymgr_external_url=${RANGER_POLICYMGR_EXTERNAL_URL}
policymgr_http_enabled=true

unix_user=ranger
unix_user_pwd=ranger
unix_group=ranger

# Following variables are referenced in db_setup.py. Do not remove these
oracle_core_file=
sqlserver_core_file=
sqlanywhere_core_file=
cred_keystore_filename=

# #################  DO NOT MODIFY ANY VARIABLES BELOW #########################
#
# --- These deployment variables are not to be modified unless you understand the full impact of the changes
#
################################################################################
XAPOLICYMGR_DIR=$PWD
app_home=$PWD/ews/webapp
TMPFILE=$PWD/.fi_tmp
LOGFILE=$PWD/logfile
LOGFILES="$LOGFILE"

JAVA_BIN='java'
JAVA_VERSION_REQUIRED='1.8'

ranger_admin_max_heap_size=1g
#retry DB and Java patches after the given time in seconds.
PATCH_RETRY_INTERVAL=120
STALE_PATCH_ENTRY_HOLD_TIME=10

hadoop_conf=
authentication_method=UNIX

#------------ Kerberos Config -----------------
spnego_principal=
spnego_keytab=
token_valid=
admin_principal=
admin_keytab=
lookup_principal=
lookup_keytab=
audit_jaas_client_loginModuleName=
audit_jaas_client_loginModuleControlFlag=
audit_jaas_client_option_useKeyTab=
audit_jaas_client_option_storeKey=
audit_jaas_client_option_useTicketCache=
audit_jaas_client_option_serviceName=
audit_jaas_client_option_keyTab=
audit_jaas_client_option_principal=
