FROM golang:1.25 AS builder
ARG CGO_ENABLED=0
WORKDIR /app

COPY .. .
RUN go mod download && go mod tidy
RUN CGO_ENABLED=0 GOOS=linux go build -o bin/main ./cmd/mysql-gateway/

# alpine (not scratch) so the image ships curl for the Fargate in-container health check
# (CMD-SHELL curl http://localhost:9997/status). NOTE: unset STARROCKS_SSL_CA means the gateway
# SKIPS verification of StarRocks' certificate (dev only) — system roots are never consulted, so
# always set STARROCKS_SSL_CA in QA/prod.
FROM alpine:latest
RUN apk add --no-cache ca-certificates curl
COPY --from=builder /app/bin/main /main
# Unprivileged: the gateway binds 9032 (TLS, end-user clients) and 9997 (HTTP health probe),
# both > 1024, so no root needed. The mounted TLS_CERT_FILE / TLS_KEY_FILE and any
# STARROCKS_SSL_CA must be readable by this user.
#
# Unlike mysql-proxy, this listener is MEANT to be reachable by people — but only over TLS,
# which the process requires at startup, since it carries end-user passwords.
USER nobody
EXPOSE 9032 9997
ENTRYPOINT ["/main"]
