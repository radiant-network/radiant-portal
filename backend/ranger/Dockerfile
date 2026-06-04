# Dual-mode Apache Ranger admin image with StarRocks baked in.
#
# Custom entrypoint with three modes on top of the stock image (see ranger-entrypoint.sh):
#   migrate  -- run DB schema setup (setup_mode=SeparateDBA) once, then exit (for a gated k8s Job).
#   serve    -- run setup (idempotent) + start the admin server (for the Deployment).
#   register -- apply the service-def/service JSON to a running admin (one-shot k8s Job).
#
# DB connection and all account passwords are externalized via RANGER_* env vars (see
# install.properties.tpl), so this targets a managed Postgres with no runtime superuser.
#
# The StarRocks bits are baked in (self-contained -- no plugin-download sidecar, no mounted JSON):
#   - the StarRocks Ranger plugin jar + MySQL JDBC driver (test-connection / resource autocomplete);
#   - the StarRocks service-def and service-instance JSON, dropped into the dirs register-services.py
#     reads by default (/ranger/service-defs, /ranger/services).
#
# Two StarRocks runtime knobs (resolved by ranger-entrypoint.sh into ${RANGER_*} placeholders that
# register-services.py substitutes into the baked JSON before parsing):
#   RANGER_STARROCKS_AUTOCOMPLETE  yes -> service-def implClass = RangerServiceStarRocks; else empty.
#   RANGER_STARROCKS_SERVICE_NAME  name of the registered service instance (default starrocks).
#
# Build context is this directory (backend/ranger).
FROM apache/ranger:2.8.0

COPY install.properties.tpl           /home/ranger/scripts/install.properties.tpl
COPY ranger-entrypoint.sh             /home/ranger/scripts/ranger-entrypoint.sh
COPY register-services.py             /home/ranger/scripts/register-services.py

# StarRocks service-def (type) + service instance, baked into the dirs register-services.py scans.
COPY ranger-servicedef-starrocks.json /ranger/service-defs/starrocks.json
COPY starrocks-service.json           /ranger/services/starrocks.json

# The root RUN below also strips setup.sh's `export $DIST_NAME` line: with an empty DIST_NAME that bare
# `export` dumps every env var (incl. secrets) to the log. It's a no-op bug, so the line is removed
# (the `! grep` asserts it's gone, failing the build if a future base image changes it).
#
# StarRocks Ranger plugin jars on the admin classpath, so test-connection / autocomplete work at first
# boot.
ARG STARROCKS_PLUGIN_JAR=https://releases.starrocks.io/resources/ranger-starrocks-plugin-3.0.0-SNAPSHOT.jar
ARG MYSQL_CONNECTOR_JAR=https://repo1.maven.org/maven2/com/mysql/mysql-connector-j/9.7.0/mysql-connector-j-9.7.0.jar

USER root
RUN PLUGIN_DIR=/opt/ranger/admin/ews/webapp/WEB-INF/classes/ranger-plugins/starrocks && \
    mkdir -p "${PLUGIN_DIR}" && \
    curl -fsSL -o "${PLUGIN_DIR}/ranger-starrocks-plugin.jar" "${STARROCKS_PLUGIN_JAR}" && \
    curl -fsSL -o "${PLUGIN_DIR}/mysql-connector-j.jar"       "${MYSQL_CONNECTOR_JAR}" && \
    chmod +x /home/ranger/scripts/ranger-entrypoint.sh && \
    sed -i '/export .DIST_NAME/d' /opt/ranger/admin/setup.sh && \
    ! grep -q 'export .DIST_NAME' /opt/ranger/admin/setup.sh && \
    chown -R ranger:ranger "${PLUGIN_DIR}" /home/ranger/scripts /ranger
USER ranger

ENTRYPOINT ["/home/ranger/scripts/ranger-entrypoint.sh"]
CMD ["serve"]
