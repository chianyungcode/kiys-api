FROM --platform=amd64 oven/bun:latest

WORKDIR /src/usr/app

COPY . .

RUN bun install

CMD [ "bun", "start" ]