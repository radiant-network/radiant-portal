FROM golang:1.25 AS builder
ARG CGO_ENABLED=0
WORKDIR /app

COPY .. .
RUN go mod download && go mod tidy
RUN CGO_ENABLED=0 GOOS=linux go build -o bin/main ./cmd/mysql-proxy/

# alpine (not scratch) so the image ships curl for the Fargate in-container health check
# (CMD-SHELL curl http://localhost:9998/status). NOTE: unset STARROCKS_SSL_CA means the proxy
# SKIPS certificate verification entirely (dev only) — system roots are never consulted, so
# always set STARROCKS_SSL_CA in QA/prod.
FROM alpine:latest
RUN apk add --no-cache ca-certificates curl
COPY --from=builder /app/bin/main /main
# Unprivileged: the proxy binds 9031 (cleartext client, loopback/sidecar only — never expose
# beyond the pod/task) and 9998 (HTTP health probe), both > 1024, so no root needed. A mounted
# STARROCKS_SSL_CA must be readable by this user.
USER nobody
EXPOSE 9031 9998
ENTRYPOINT ["/main"]
