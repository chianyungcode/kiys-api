FROM oven/bun:debian

# --platform=amd64

WORKDIR /usr/src/app

COPY . .

RUN bun install

RUN bun prisma generate


CMD ["bun", "run", "start"]