FROM golang:1.24-alpine AS build
WORKDIR /app
COPY go.mod go.sum* ./
RUN go mod download 2>/dev/null || true
COPY main.go .
RUN CGO_ENABLED=0 go build -o mysql-jwt-proxy .

FROM alpine:3.20
COPY --from=build /app/mysql-jwt-proxy /mysql-jwt-proxy
EXPOSE 9031
CMD ["/mysql-jwt-proxy"]
