FROM golang:1.25 AS builder
ARG CGO_ENABLED=0
WORKDIR /app

COPY .. .
RUN go mod download && go mod tidy
RUN CGO_ENABLED=0 GOOS=linux go build -o bin/create-tenant/ ./cmd/create-tenant/ \
 && CGO_ENABLED=0 GOOS=linux go build -o bin/create-user/ ./cmd/create-user/ \
 && CGO_ENABLED=0 GOOS=linux go build -o bin/refresh-tenants/ ./cmd/refresh-tenants/

# alpine (not scratch): these are run interactively (docker exec / kubectl exec) against
# the same env/config as the API, so a shell is expected.
FROM alpine:latest
RUN apk add --no-cache ca-certificates
COPY --from=builder /app/bin/create-tenant/create-tenant /usr/local/bin/create-tenant
COPY --from=builder /app/bin/create-user/create-user /usr/local/bin/create-user
COPY --from=builder /app/bin/refresh-tenants/refresh-tenants /usr/local/bin/refresh-tenants

# No fixed ENTRYPOINT: this image bundles three independent commands, invoked by name,
# e.g. `docker run --env-file .env radiant-toolbox create-tenant -code demo -name "Demo Hospital"`.
USER nobody
CMD ["sh"]
