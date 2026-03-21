FROM golang:1.21-alpine
WORKDIR /app
COPY CraftoraGo/go.mod ./
RUN go mod download
COPY CraftoraGo/ .
RUN go build -o app .
EXPOSE 8083
CMD ["./app"]