FROM --platform=amd64 oven/bun:latest

# Change architecture to base image oven/bun if you want to push to docker hub
# --platform=amd64

WORKDIR /usr/src/app

COPY . .

RUN bun install

CMD ["bun", "run", "start"]