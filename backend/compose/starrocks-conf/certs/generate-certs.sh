#!/usr/bin/env bash
#
# Generate a self-signed certificate for StarRocks SSL (local-dev only) and lay
# out the three artifacts the rest of the compose stack consumes:
#
#   starrocks_keystore.jks    JKS keystore (private key + cert) -- loaded by the
#                             StarRocks FE (ssl_keystore_location in fe.conf).
#   starrocks_cert.pem        the public certificate in PEM -- used as the CA
#                             bundle by PEM-based clients:
#                               * the Go API   (DB_SSL_CA, see internal/database/starrocks.go)
#                               * the mysql CLI (--ssl-ca, init-schema)
#   starrocks_truststore.jks  JKS truststore (public cert only) -- used by JDBC
#                             clients (Ranger admin / register, MySQL Connector/J
#                             trustCertificateKeyStoreUrl).
#
# Because the cert is self-signed, the certificate IS its own CA, so the exported
# PEM / truststore double as the CA bundle that clients verify against.
#
# Idempotent: if the keystore already exists it does nothing, so re-running
# `docker compose up` reuses the same cert (and clients keep trusting it).
#
# Run automatically by the `cert-init` service in docker-compose.yml, but also
# runnable by hand (needs `keytool` on PATH from any JDK):
#   CERT_DIR=./certs ./generate-certs.sh
set -euo pipefail

CERT_DIR="${CERT_DIR:-/certs}"
# Dev password reused for store + key. Matches the values wired into fe.conf and
# the JDBC truststore params. Override via env for a non-default value.
STORE_PASS="${STORE_PASS:-changeit}"
KEY_PASS="${KEY_PASS:-$STORE_PASS}"
# CN must match the hostname clients connect to (DB_HOST=starrocks) so that
# strict verifiers (VERIFY_IDENTITY) pass; SAN covers the docker hostname plus
# localhost/127.0.0.1 for host-side mysql clients.
DNAME="${DNAME:-CN=starrocks}"
SAN="${SAN:-SAN=dns:starrocks,dns:localhost,ip:127.0.0.1}"
VALIDITY_DAYS="${VALIDITY_DAYS:-3650}"

KEYSTORE="$CERT_DIR/starrocks_keystore.jks"
CERT_PEM="$CERT_DIR/starrocks_cert.pem"
TRUSTSTORE="$CERT_DIR/starrocks_truststore.jks"

mkdir -p "$CERT_DIR"

if [ -f "$KEYSTORE" ]; then
  echo "cert-init: $KEYSTORE already exists, reusing existing certificate."
  exit 0
fi

echo "cert-init: generating self-signed StarRocks certificate in $CERT_DIR ..."

# 1. Keystore with a fresh RSA key pair + self-signed cert. Force -storetype JKS:
#    modern JDKs default to PKCS12 even for a .jks file, but StarRocks loads the
#    keystore as JKS.
keytool -genkeypair \
  -alias starrocks \
  -keyalg RSA -keysize 2048 \
  -validity "$VALIDITY_DAYS" \
  -dname "$DNAME" \
  -ext "$SAN" \
  -storetype JKS \
  -keystore "$KEYSTORE" \
  -storepass "$STORE_PASS" \
  -keypass "$KEY_PASS"

# 2. Export the public cert as PEM (CA bundle for the Go API + mysql CLI).
keytool -exportcert -rfc \
  -alias starrocks \
  -keystore "$KEYSTORE" \
  -storepass "$STORE_PASS" \
  -file "$CERT_PEM"

# 3. Import the public cert into a JKS truststore (for JDBC clients).
keytool -importcert -noprompt \
  -alias starrocks \
  -file "$CERT_PEM" \
  -storetype JKS \
  -keystore "$TRUSTSTORE" \
  -storepass "$STORE_PASS"

# World-readable so the unprivileged users inside the client containers can read
# the mounted files (the private key only lives in the keystore the FE loads).
chmod 0644 "$KEYSTORE" "$CERT_PEM" "$TRUSTSTORE"

echo "cert-init: done."
