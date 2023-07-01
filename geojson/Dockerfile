FROM golang:1.19

WORKDIR /app
RUN go install github.com/kajikentaro/file-server@v1.0.0
EXPOSE 20768

ENTRYPOINT ["file-server"]
