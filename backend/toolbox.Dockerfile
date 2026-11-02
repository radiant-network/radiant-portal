FROM golang:1.27 AS builder
ARG CGO_ENABLED=0
WORKDIR /app

COPY .. .
RUN go mod download && go mod tidy
RUN CGO_ENABLED=0 GOOS=linux go build -o bin/create-tenant/ ./cmd/create-tenant/ \
 && CGO_ENABLED=0 GOOS=linux go build -o bin/create-user/ ./cmd/create-user/ \
 && CGO_ENABLED=0 GOOS=linux go build -o bin/refresh-tenants/ ./cmd/refresh-tenants/ \
 && CGO_ENABLED=0 GOOS=linux go build -o bin/bootstrap-admin-policies/ ./cmd/bootstrap-admin-policies/

# alpine (not scratch): these are run interactively (docker exec / kubectl exec) against
# the same env/config as the API, so a shell is expected.
FROM alpine:latest
RUN apk add --no-cache ca-certificates
COPY --from=builder /app/bin/create-tenant/create-tenant /usr/local/bin/create-tenant
COPY --from=builder /app/bin/create-user/create-user /usr/local/bin/create-user
COPY --from=builder /app/bin/refresh-tenants/refresh-tenants /usr/local/bin/refresh-tenants
COPY --from=builder /app/bin/bootstrap-admin-policies/bootstrap-admin-policies /usr/local/bin/bootstrap-admin-policies

# No fixed ENTRYPOINT: this image bundles four independent commands, invoked by name,
# e.g. `docker run --env-file .env radiant-toolbox create-tenant -code demo -name "Demo Hospital"`.
USER nobody
CMD ["sh"]
