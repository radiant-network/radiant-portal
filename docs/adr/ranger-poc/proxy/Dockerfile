FROM golang:1.22-alpine AS build
WORKDIR /app
COPY go.mod ./
RUN go mod download
COPY main.go .
RUN CGO_ENABLED=0 go build -o mysql-proxy .

FROM alpine:3.20
COPY --from=build /app/mysql-proxy /mysql-proxy
EXPOSE 9031
CMD ["/mysql-proxy"]
