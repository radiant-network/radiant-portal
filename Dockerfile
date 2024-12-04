FROM golang:1.23 as builder
ARG CGO_ENABLED=0
WORKDIR /app

COPY . .
RUN go mod download

RUN CGO_ENABLED=0 GOOS=linux go build -o bin/main cmd/api/main.go

FROM scratch
COPY --from=builder /app/bin/main /main
ENTRYPOINT ["/main"]