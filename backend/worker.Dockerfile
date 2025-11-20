FROM golang:1.23 as builder
ARG CGO_ENABLED=0
WORKDIR /app

COPY .. .
RUN go mod download && go mod tidy
RUN CGO_ENABLED=0 GOOS=linux go build -o bin/main ./cmd/worker/

# Fetch CA certificates
FROM alpine:latest AS certs
RUN apk add --no-cache ca-certificates

FROM scratch
COPY --from=builder /app/bin/main /main
COPY --from=certs /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
ENTRYPOINT ["/main"]