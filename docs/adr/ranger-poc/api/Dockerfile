FROM golang:1.22-alpine AS build
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY main.go .
RUN CGO_ENABLED=0 go build -o poc-api .

FROM alpine:3.20
COPY --from=build /app/poc-api /poc-api
EXPOSE 8080
CMD ["/poc-api"]
