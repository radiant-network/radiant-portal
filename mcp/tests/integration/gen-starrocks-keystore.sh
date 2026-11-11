#!/usr/bin/env bash
#
# Generate a self-signed Java keystore (JKS) for StarRocks FE SSL.
# Output: tests/integration/tls/starrocks.jks
#
set -euo pipefail

DIR="$(cd "$(dirname "$0")/tls" && pwd)"
KEYSTORE="$DIR/starrocks.jks"
PASSWORD="changeit"

if [ -f "$KEYSTORE" ]; then
  echo "Keystore already exists at $KEYSTORE — skipping generation."
  exit 0
fi

echo "Generating self-signed keystore at $KEYSTORE ..."
keytool -genkeypair \
  -alias starrocks \
  -keyalg RSA \
  -keysize 2048 \
  -validity 3650 \
  -keystore "$KEYSTORE" \
  -storepass "$PASSWORD" \
  -keypass "$PASSWORD" \
  -dname "CN=starrocks,OU=Test,O=Radiant,L=Test,ST=Test,C=US" \
  -ext "SAN=DNS:starrocks,DNS:localhost,IP:127.0.0.1"

echo "Done. Keystore: $KEYSTORE"
